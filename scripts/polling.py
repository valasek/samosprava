"""Build src/data/polling.json (polling place per street) from city district notices.

Usage: python3 scripts/polling.py  (run scripts/download.sh first; needs pdftotext)
"""

import html
import json
import re
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources" / "okrsky"
OUT = ROOT / "src" / "data" / "polling.json"

Row = tuple[str, str | None, str]  # street, house numbers (None = whole street), polling place

PREPOSITIONS = {"pri", "na", "pod", "nad", "za", "k"}
LOWER = {"cesta", "námestie", "nám.", "generála", "závodu", "role", "osada", "sady"}


def clean(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def title(name: str) -> str:
    """Title-case an upper-case street name."""
    if name != name.upper():
        return name
    out, lower_rest = [], False
    for i, w in enumerate(name.lower().split()):
        if i and (lower_rest or w in LOWER or w in PREPOSITIONS):
            out.append(w)
        else:
            out.append("-".join(p[:1].upper() + p[1:] for p in w.split("-")))
        lower_rest = lower_rest or w in PREPOSITIONS
    return " ".join(out)


def houses(raw: str) -> str | None:
    raw = clean(raw.replace(";", ","))
    if not raw or re.fullmatch(r"(cel[áéý]|všetky)", raw, re.I):
        return None
    raw = re.sub(r"\bod (\d+\w*) ?do ?(\d+\w*)", r"\1-\2", raw)
    raw = re.sub(r"(\d+) až (\d+)", r"\1-\2", raw, flags=re.I)
    raw = re.sub(r"\b(NE)?PÁRNE\b", lambda m: m.group(0).lower(), raw)
    raw = re.sub(r"(\d+\w*) a (\d+\w*)", r"\1, \2", raw)
    tokens = [re.sub(r"^(\d+)\s*/?\s*([A-Za-z])$", r"\1\2", t.strip()) for t in raw.split(",")]
    return ", ".join(t for t in tokens if t)


def split_item(item: str) -> tuple[str, str | None]:
    """'Hradská nepárne 1-29' -> ('Hradská', 'nepárne 1-29')."""
    item = clean(re.sub(r"\(.*?\)", "", item))
    if m := re.match(r"^(.*?[^\d\s.])\s+((?:od |(?:ne)?párne )?\d.*)$", item):
        if not re.match(r"^\d+\.? ", item):
            return m.group(1), houses(m.group(2))
    return item, None


def pdftext(name: str, layout: bool = True) -> str:
    return subprocess.run(["pdftotext", *(["-layout"] if layout else []), str(SRC / name), "-"],
                          capture_output=True, text=True, check=True).stdout


def comma_list(text: str) -> list[tuple[str, str | None]]:
    """Comma separated streets; items starting with a number continue the previous street."""
    out: list[tuple[str, str | None]] = []
    for item in clean(re.sub(r"\(.*?\)", "", text, flags=re.S)).rstrip(".").split(","):
        item = item.strip()
        if not item:
            continue
        if re.match(r"^\d", item) and out:
            name, h = out[-1]
            out[-1] = (name, f"{h}, {houses(item)}" if h else houses(item))
        else:
            out.append(split_item(item))
    return out


# --- parsers ---------------------------------------------------------------


def stare_mesto() -> list[Row]:
    return from_streets("stare-mesto")


def from_streets(district: str) -> list[Row]:
    """Districts already parsed into streets.json by extract.py."""
    d = json.loads((ROOT / "src" / "data" / "streets.json").read_text(encoding="utf-8"))[district]
    return [(s, h.replace(",", ", ").replace(",  ", ", ") if h else None, d["okrsky"][str(o)]) for s, h, o in d["streets"]]


def ruzinov() -> list[Row]:
    s = (SRC / "ruz.html").read_text(encoding="utf-8")
    rows = []
    for tr in re.findall(r"<tr[^>]*>(.*?)</tr>", s, flags=re.S):
        cells = [clean(html.unescape(re.sub(r"<[^>]+>", " ", c))) for c in re.findall(r"<td[^>]*>(.*?)</td>", tr, flags=re.S)]
        if len(cells) == 4 and cells[2].isdigit():
            rows.append((cells[0], houses(cells[1]), cells[3]))
    return rows


def nove_mesto() -> list[Row]:
    rows, place, buf = [], None, []

    def flush():
        if place and buf:
            entry = clean(" ".join(buf))
            name, _, nums = re.sub(r"\s*:\s*", " : ", entry, count=1).partition(" : ")
            rows.append((clean(name), houses(nums.rstrip(";")), place))
        buf.clear()

    for line in pdftext("nm.pdf").splitlines():
        s = line.strip()
        if m := re.match(r"Volebná miestnosť\s*:\s*(.+)", s):
            flush()
            place = clean(m.group(1)).replace(" č. ", " ")
        elif not s or s.startswith(("MESTSKÁ ČASŤ", "pre volebný", "č.", "Pre voľby")):
            flush()
        elif place:
            if ":" in s:
                flush()
            buf.append(s)
    flush()
    return rows


def petrzalka() -> list[Row]:
    bbox = subprocess.run(["pdftotext", "-bbox", str(SRC / "petr.pdf"), "-"], capture_output=True, text=True, check=True).stdout
    blocks: list[dict] = []  # per okrsok: place parts and [street, numbers] rows
    for page in bbox.split("<page")[1:]:
        lines: dict[int, list] = {}
        for x, y, w in re.findall(r'xMin="([\d.]+)" yMin="([\d.]+)"[^>]*>([^<]*)<', page):
            key = next((k for k in lines if abs(k - float(y)) < 3), round(float(y)))
            lines.setdefault(key, []).append((float(x), html.unescape(w)))
        for y in sorted(lines):
            words = sorted(lines[y])
            text = " ".join(w for _, w in words)
            if "Volebný obvod" in text or "Hrčka" in text or "starosta" in text:
                continue
            cols = ["", "", "", ""]
            for x, w in words:
                cols[0 if x < 80 else 1 if x < 222 else 2 if x < 338 else 3] += " " + w
            num, plc, street, nums = (clean(c) for c in cols)
            if num.isdigit():
                blocks.append({"place": [plc], "rows": []})
            elif not blocks:
                continue
            elif plc:
                blocks[-1]["place"].append(plc)
            rows = blocks[-1]["rows"]
            # Street names wrap onto a second line; "M. Curie / SKLODOWSKEJ" wraps with numbers on both lines.
            if street and (nums or not rows) and not (rows and rows[-1][0].endswith("Curie")):
                rows.append([street, nums])
            elif street:
                rows[-1][0] += " " + street
                rows[-1][1] += " " + nums
            elif nums:
                rows[-1][1] += " " + nums
    fix = {"M. Curie SKLODOWSKEJ": "M. Curie-Sklodowskej"}
    return [(title(fix.get(s, s)), houses(h), " ".join(b["place"])) for b in blocks for s, h in b["rows"]]


def devinska_nova_ves() -> list[Row]:
    rows, place, street, nums = [], None, None, []
    skip = ("Mestská časť", "Dátum:", "Zoznam ulíc", "pre", "Komunálne voľby", "Dátum konania", "Obvod č.")

    def flush():
        if street and place:
            rows.append((street, houses(" ".join(nums)), place))

    for line in pdftext("dnv.pdf").splitlines():
        s = line.strip()
        if not s or s.startswith(skip):
            continue
        if m := re.match(r"^(\d+) (\D.+)$", line):
            flush()
            place, street, nums = clean(m.group(2)), None, []
        elif line.startswith(" "):
            nums.append(s)
        else:
            flush()
            street, nums = s.rstrip("."), []
    flush()
    return rows


def dubravka() -> list[Row]:
    places = {}
    text = pdftext("dub.pdf")
    for name, okrsky in re.findall(r"^(\S.*?\d)\s{3,}([\d, ]+)[,.]?$", text, flags=re.M):
        for o in re.findall(r"\d+", okrsky):
            places[int(o)] = clean(name)
    rows, block = [], []

    def flush():
        okrsok = next((int(m.group(1)) for b in block if (m := re.match(r"^(\d+)\b", b))), None)
        for b in block:
            item = re.sub(r"^\d+(\s+|$)", "", b) if okrsok and b.startswith(str(okrsok)) else b
            if item:
                name, h = split_item(item.replace(" A ", " a "))
                rows.append((title(name), h, places[okrsok]))
        block.clear()

    started = False
    for line in text.split("Volebné okrsky a volebné miestnosti", 1)[1].splitlines():
        s = line.strip()
        if s == "Volebný":
            flush()
            started = True
        elif started and s and s not in ("Volebná miestnosť", "okrsok", "číslo") and not re.match(r"^(ZŠ|KC|SPŠE|GYMNÁZIUM)\b", s):
            block.append(s)
    flush()
    return rows


def karlova_ves() -> list[Row]:
    rows, place = [], None
    for line in pdftext("kv.pdf").split("Príloha k rozhodnutiu", 1)[1].splitlines():
        s = line.strip()
        if not s or s.startswith(("Volebný okrsok", "Ulica", "Do volebného obvodu", "orgánov samosprávy")):
            continue
        if s.startswith("Volebná miestnosť"):
            place = clean(s.removeprefix("Volebná miestnosť"))
        elif line.startswith(" "):
            if "," in s or "súpisné" in s:
                name, h = rows[-1][0], rows[-1][1]
                rows[-1] = (name, f"{h}, {houses(s)}" if h else houses(s), place)
        else:
            name, *nums = re.split(r"\s{2,}", s, maxsplit=1)
            rows.append((name, houses(nums[0] if nums else ""), place))
    return rows


def labelled(text: str, okrsok_re: str, place_re: str, list_re: str) -> list[Row]:
    """Notices with 'Volebný okrsok N', a polling place line and a comma separated list of streets."""
    rows = []
    for block in re.split(okrsok_re, text)[1:]:
        place = clean(m.group(1)) if (m := re.search(place_re, block, flags=re.S)) else None
        m = re.search(list_re, block, flags=re.S)
        if not m:
            continue
        for name, h in comma_list(m.group(1)):
            if not name.lower().startswith(("obyvatelia", "osoby", "a občania", "občania")):
                rows.append((re.sub(r"(?i)^a občania.*", "", name), h, place))
    return rows


def vrakuna() -> list[Row]:
    return labelled(pdftext("vrak.pdf"), r"Volebný okrsok č\. \d+", r"Volebná miestnosť: (.+?)\n",
                    r"ulice: (.+?)(?=\n\s*(?:Volebný okrsok|VOLEBNÝ OBVOD|JUDr)|\Z)")


def raca() -> list[Row]:
    text = pdftext("raca.pdf")
    rows = []
    for m in re.finditer(r"Volebný okrsok (\d+) (.+?)\nulice: (.+?)(?=\n\s*\n)", text, flags=re.S):
        for name, h in comma_list(m.group(3).replace("1do", "1 do")):
            rows.append((name, h, clean(m.group(2))))
    return rows


def biskupice() -> list[Row]:
    places = {}
    for o, name, street in re.findall(r"Volebný okrsok č\. (\d+)\s{2,}(.+?)\s{2,}(.+)", pdftext("pb1.pdf")):
        places[int(o)] = f"{clean(name)}, {clean(street).replace(' ulica č. ', ' ')}"
    rows, okrsok = [], None
    for line in pdftext("pb2.pdf").splitlines():
        indent = len(line) - len(line.lstrip())
        s = line.strip()
        if not s or indent >= 25 or s.startswith(("okrsok", "číslo", "VOLEBNÝ", "MESTSKÁ", "BRATISLAVA", "Starosta", "Bratislava", "OZNÁMENIE", "Volebné", "v zmysle", "k zabezpečeniu", "do orgánov", "ktoré sa", "na území")):
            continue
        if m := re.match(r"^(\d\d)\s+(.*)$", s):
            okrsok, s = int(m.group(1)), m.group(2)
        if okrsok is None:
            continue
        name = re.split(r"\s{2,}", s)[0]
        if name.startswith("obyvatelia"):
            continue
        name = re.sub(r"\s*\(.*\)", "", name)
        if m := re.match(r"^(.*\D)\s+(\d+\s*-\s*\d+)$", name):
            rows.append((m.group(1), houses(m.group(2)), places[okrsok]))
        else:
            rows.append((name, None, places[okrsok]))
    return rows


def prislusne(name: str, places: dict[int, str]) -> list[Row]:
    """Small districts: 'okrsok č. N' followed by 'Prislúchajúce ulice:' and a comma separated list."""
    text = pdftext(name)
    rows = []
    for m in re.finditer(r"[Oo]krsok č\. (\d+).*?(?:ulice|Ulice):\s*(.+?)(?=\n\s*\n|\n\s*(?:Volebný )?[Oo]krsok č\.|\n\s*Bratislava-|\Z)", text, flags=re.S):
        for street, h in comma_list(m.group(2)):
            street = re.sub(r"\s*\+?\s*(a )?občania.*$", "", street, flags=re.I)
            if street:
                rows.append((title(street), h, places[int(m.group(1))]))
    return rows


def rusovce() -> list[Row]:
    p1 = "Budova pri vstupe do areálu ZŠ/ZUŠ, Vývojová 228"
    p2 = "Jedáleň novej budovy ZŠ, Vývojová 228"
    p3 = "Základná škola, Vývojová 228"
    return prislusne("rus.pdf", {1: p1, 2: p2, 3: p3, 4: p3})


VAJNORY = {
    "Základná škola Kataríny Brúderovej, Osloboditeľská 1": "Alviano, Dorastenecká, Pod krížom, Pri majeri, Pri nadjazde, Pri pasienku, Pri pekárni, Pri potoku, Pri rybníku, Pri starom letisku, Pri šanci, Regrútska, Rybničná, Šutráková, Tibenského, Tuhovská, Buzalkova, Pračanská, Pri mlyne, Príjazdná, Šachorová, Šinkovské, Široká, Za mlynom, Zbrody, Čierny chodník, Kúkoľová, Nové Šuty, Šuty, Tomanova, Uhliská, Veľké Štepnice",
    "Základná škola s materskou školou sv. Jána Pavla II., Osloboditeľská 27": "Hospodárska, Kataríny Brúderovej, Na jarku, Ochotnícka, Roľnícka, Za humnami, Vajnorské jazerá, Baničova, Jačmenná, Koncová, Koniarkova, Kratiny, Na doline, Nad jazierkom, Nad Válkom, Nemecká dolina, Osloboditeľská, Pod lipami, Pod Válkom, Pri pastierni, Pri Struhe, Skuteckého, Šaldova, Za farou, Zátureckého",
}

SINGLE = {
    "devin": "Dom kultúry Devín, Rytierska 2",
    "jarovce": "Kultúrny dom, Jantárová 1",
    "cunovo": "Miestny úrad, Hraničiarska 144/22",
    "lamac": "Základná škola, Malokarpatské nám. 1",
    "zahorska-bystrica": "Spoločenský dom, Gbelská 6",
}

SOURCES = {
    "stare-mesto": "https://data.moderneobce.sk/data/uploads/staremesto.sk/volby2026/oznamenie_26_1103.pdf",
    "ruzinov": "https://www.ruzinov.sk/sk/stranky/view/zoznam-ulic-a-okrskov-abecedne",
    "nove-mesto": "https://data.moderneobce.sk/data/uploads/banm.sk/113434/Volebn%C3%A9_okrsky_ulice_-_komplet_zoznam_volby_20261024_1.pdf",
    "petrzalka": "https://www.petrzalka.sk/wp-content/uploads/2026/09/OKRSKY-SPOJENE-VOLBY-2026.pdf",
    "devinska-nova-ves": "https://www.devinskanovaves.sk/data/page/devinskanovaves.sk/31556/rozdelenie-okrskov.pdf",
    "dubravka": "https://www.dubravka.sk/files/documents/samosprava/volby/2026%20samospravy/rozhodnutie-starostu-vytvorenie-vo-a-vm-2026-v1.03.pdf",
    "karlova-ves": "https://www.karlovaves.sk/wp-content/uploads/2026/07/Urcenie_volebnych_okrskov_kom-volby_volby-VUC_2026.pdf",
    "vrakuna": "https://www.vrakuna.sk/data/page/vrakuna.sk/31466/volebne-okrsky-a-volebne-miestnosti.pdf",
    "raca": "https://www.raca.sk/wp-content/uploads/2026/07/Oznamenie-o-utvoreni-volebnych-obvodov-poctu-poslancov-a-urceni-volebnych-okrskov-2026.pdf",
    "podunajske-biskupice": "https://www.biskupice.sk/evt_file.php?file=15320",
    "rusovce": "https://www.bratislava-rusovce.sk/media/files/volby/2026__spojene_samospravne_volby_/2026-07-30/okrsky_v_mc_bratislava-rusovce_pre_volby_do_organov_samospravy_obci_a_do_organov_samospravy_krajov.pdf",
    "vajnory": "https://www.vajnory.sk/sites/default/files/2026-07/Ozn%C3%A1menie%20utvoren%C3%AD%20volebn%C3%BDch%20okrskov%20a%20ur%C4%8Den%C3%AD%20volebn%C3%BDch%20miestnost%C3%AD.pdf",
    "devin": "https://www.devin.sk/data/news_files/devin.sk/137816/rozhodnutie-o-utvoreni-okrskov-a-urceni-miestnosti.pdf",
    "jarovce": "http://www.jarovce.sk/dokumenty/volby/kom2026/Urcenie%20volebnych%20okrskov.pdf",
    "cunovo": "https://www.cunovo.eu/files/2026-07-31-120505-ur__enie_okrskov.pdf",
    "lamac": "https://www.lamac.sk/files/documents/zverejnovanie/volby/komunalne/2026/oznamenie_o_urceni_volebnych_okrskov.pdf",
    "zahorska-bystrica": "https://zahorskabystrica.sk/ako-hlasovat-v-komunalnych-volbach-2026/",
    "stupava": "https://www.stupava.sk/e_download.php?file=/data/uredni_deska/obsah8410_1.pdf&original=OZN%C3%81MENIE_volebn%C3%A9_okrsky_a_miestnosti.pdf",
}


def norm(s: str) -> str:
    import unicodedata
    return "".join(c for c in unicodedata.normalize("NFD", s.lower()) if not unicodedata.combining(c)).strip()


def compact(rows: list[Row]) -> dict:
    """Keep house numbers only where a street is split between polling places."""
    places = sorted({p for _, _, p in rows})
    by_street: dict[str, dict] = {}
    for street, h, place in rows:
        e = by_street.setdefault(norm(street), {"name": street, "places": {}})
        prev = e["places"].get(place, "")
        e["places"][place] = None if h is None or prev is None else f"{prev}, {h}" if prev else h
    out = []
    for e in sorted(by_street.values(), key=lambda e: norm(e["name"])):
        if len(e["places"]) == 1:
            out.append([e["name"], None, places.index(next(iter(e["places"])))])
        else:
            out.extend([e["name"], h, places.index(p)] for p, h in e["places"].items())
    return {"places": places, "streets": out}


def main() -> None:
    parsed = {
        "stare-mesto": stare_mesto(),
        "ruzinov": ruzinov(),
        "nove-mesto": nove_mesto(),
        "petrzalka": petrzalka(),
        "devinska-nova-ves": devinska_nova_ves(),
        "dubravka": dubravka(),
        "karlova-ves": karlova_ves(),
        "vrakuna": vrakuna(),
        "raca": raca(),
        "podunajske-biskupice": biskupice(),
        "rusovce": rusovce(),
        "vajnory": [(s.strip(), None, p) for p, streets in VAJNORY.items() for s in streets.split(",")],
        "stupava": from_streets("stupava"),
    }
    data = {i: {"places": [p], "streets": [], "source": SOURCES[i]} for i, p in SINGLE.items()}
    for i, rows in parsed.items():
        assert rows, f"no rows for {i}"
        data[i] = {**compact(rows), "source": SOURCES[i]}
    OUT.write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    for i, d in data.items():
        print(f"{i}: {len(d['places'])} places, {len(d['streets'])} street rows")


if __name__ == "__main__":
    main()
