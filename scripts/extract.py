"""Build src/data/*.json from the official MV SR candidate XLSX files.

Usage: .venv/bin/python3 scripts/extract.py  (run scripts/download.sh first)
"""

import json
import re
import unicodedata
from pathlib import Path

import openpyxl

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "sources"
OUT = ROOT / "src" / "data"

# id, official name in XLSX (without "Bratislava - "), MsZ obvod, BSK obvod, election page
DISTRICTS = [
    ("stare-mesto", "Staré Mesto", 1, 1, "https://www.staremesto.sk/31451/volby-do-organov-uzemnej-samospravy-2026"),
    ("podunajske-biskupice", "Podunajské Biskupice", 2, 4, "https://www.biskupice.sk/zverejnovanie/volby-1/volby-do-organov-samospravy-obci-a-do-organov-samospravnych-krajov-2026-2351sk.html"),
    ("ruzinov", "Ružinov", 3, 2, "https://www.ruzinov.sk/sk/stranky/view/volby-do-organov-samospravy-obci-a-organov-samospravnych-krajov-2026"),
    ("vrakuna", "Vrakuňa", 4, 3, "https://www.vrakuna.sk/31466/komunalne-volby-2026"),
    ("nove-mesto", "Nové Mesto", 5, 5, "https://www.banm.sk/28691/volby"),
    ("raca", "Rača", 6, 6, "https://www.raca.sk/komunalne-volby-2026/"),
    ("vajnory", "Vajnory", 6, 6, "https://www.vajnory.sk/volby-do-organov-uzemnej-samospravy-2026"),
    ("devinska-nova-ves", "Devínska Nová Ves", 7, 8, "https://www.devinskanovaves.sk/31556/volby-2026"),
    ("devin", "Devín", 7, 8, "https://www.devin.sk/"),
    ("dubravka", "Dúbravka", 8, 9, "https://www.dubravka.sk/"),
    ("lamac", "Lamač", 8, 10, "https://www.lamac.sk/info/volby-2026"),
    ("zahorska-bystrica", "Záhorská Bystrica", 8, 10, "https://zahorskabystrica.sk/ako-hlasovat-v-komunalnych-volbach-2026/"),
    ("karlova-ves", "Karlova Ves", 9, 7, "https://www.karlovaves.sk/komunalne-volby-2026/"),
    ("petrzalka", "Petržalka", 10, 11, "https://www.petrzalka.sk/samosprava/miestne-zastupitelstvo/volby/"),
    ("jarovce", "Jarovce", 11, 11, "http://www.jarovce.sk/"),
    ("rusovce", "Rusovce", 11, 11, "http://www.rusovce.sk/"),
    ("cunovo", "Čunovo", 11, 11, "https://www.cunovo.sk/"),
]

# Seats per constituency, from the official notices (see docs/plan.md sources).
MSZ_SEATS = {1: 5, 2: 2, 3: 8, 4: 2, 5: 4, 6: 3, 7: 2, 8: 5, 9: 3, 10: 10, 11: 1}
# Obvod 16 = Stupava, Marianka, Borinka (only Stupava is in scope).
BSK_SEATS = {1: 4, 2: 6, 3: 2, 4: 2, 5: 3, 6: 2, 7: 3, 8: 1, 9: 3, 10: 1, 11: 9, 16: 1}

# Stupava (town in okres Malacky): id, name, BSK obvod, election page; city council obvod: (seats, okrsky)
STUPAVA = ("stupava", "Stupava", 16, "https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html")
STUPAVA_MSZ = {1: (4, [1, 2]), 2: (4, [3, 6]), 3: (4, [4, 5]), 4: (4, [7, 8])}
SM_MZ = {  # obvod: (seats, okrsky)
    1: (3, [1, 2, 3, 12]),
    2: (3, [4, 5, 6, 30]),
    3: (3, [7, 8, 9, 34]),
    4: (3, [10, 11, 13, 14]),
    5: (3, [15, 16, 17, 18]),
    6: (3, [19, 20, 21, 22]),
    7: (4, [23, 24, 25, 26, 27, 28]),
    8: (3, [29, 31, 32, 33]),
}

POST_TITLE = re.compile(
    r"^(PhD(?!r)|Ph\.D\.|CSc|DrSc|Dr\.Sc|MBA|MPH|MPA|LL\.?M|L\.L\.M|LLM|MSc|BSc|M\. ?A\.|MA\.?$|DiS|ArtD|práp)"
)
INDEPENDENT = re.compile(r"^nezávisl", re.I)
# Party names that themselves contain a comma (VÚC file separates parties by ", ").
COMMA_PARTIES = ["Zmena zdola, demokratická únia Slovenska"]
PARTY_FIX = {"Kdh - kresťanskodemokratické hnutie": "KDH - Kresťanskodemokratické hnutie"}


def rows(name: str):
    ws = openpyxl.load_workbook(SRC / f"{name}.xlsx", read_only=True).worksheets[0]
    return [r for r in list(ws.iter_rows(values_only=True))[3:] if r[0]]


def clean(v) -> str:
    return re.sub(r"\s+", " ", str(v or "")).strip()


def split_titles(raw: str) -> tuple[str, str]:
    before, after = [], []
    for tok in [clean(t) for t in raw.split(",") if clean(t)]:
        (after if POST_TITLE.match(tok) else before).append(tok)
    return " ".join(before), ", ".join(after)


def parties(raw: str, sep: str) -> list[str]:
    raw = clean(raw)
    if INDEPENDENT.match(raw):
        return []
    found = [p for p in COMMA_PARTIES if p in raw]
    for p in found:
        raw = raw.replace(p, "")
    out = [clean(p) for p in raw.split(sep) if clean(p)] + found
    return [PARTY_FIX.get(p, p) for p in out]


def person(first, last, before, after, age, job, party_raw, sep, **extra) -> dict:
    p = parties(party_raw, sep)
    return {
        "firstName": clean(first),
        "lastName": clean(last),
        "titlesBefore": clean(before),
        "titlesAfter": clean(after),
        "age": int(age),
        "occupation": clean(job),
        "parties": p,
        "independent": not p,
        **extra,
    }


def parse_okrsky(path: Path) -> dict:
    """Parse a district notice (pdftotext -layout) listing streets/houses per polling district."""
    okrsky: dict[int, str] = {}
    streets: list[list] = []
    okrsok, expect_place = None, False
    houses_re = r"\d[\dA-Za-z/]*(?:,\s*[\dA-Za-z/]+)*,?"
    line_re = re.compile(rf"^(.+?)\s+(cel[áéý]|{houses_re})$")
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("3. Informácia"):
            break
        if m := re.match(r"Miestom konania volieb okrsku č\. (\d+)", line):
            okrsok, expect_place = int(m.group(1)), True
            continue
        if not okrsok or not line or line.startswith("Strana č."):
            continue
        if line.startswith("pre oprávnených"):
            expect_place = False
            continue
        if expect_place:
            okrsky[okrsok] = clean(f"{okrsky.get(okrsok, '')} {line}")
            continue
        if streets and streets[-1][1] and streets[-1][1].endswith(",") and re.fullmatch(houses_re, line):
            streets[-1][1] += re.sub(r"\s", "", line)
            continue
        if m := line_re.match(line):
            houses = None if m.group(2).startswith("cel") else re.sub(r"\s", "", m.group(2))
            streets.append([clean(m.group(1)), houses, okrsok])
        else:
            raise ValueError(f"Unparsed line in {path.name}: {line!r}")
    return {"okrsky": okrsky, "streets": streets}


def parse_stupava(path: Path) -> dict:
    """Parse the Stupava notice: streets (with house ranges), localities and cadastral areas per okrsok."""
    okrsky: dict[int, str] = {}
    streets: list[list] = []
    okrsok, mode, area = None, None, ""
    for raw in path.read_text(encoding="utf-8").splitlines():
        line = raw.strip()
        if line.startswith("Mgr."):
            break
        if not line or re.match(r"^(Strana|\d/6$|Voľby do orgánov|orgánov samosprávnych|Vo volebnom obvode|volebný okrsok č\. \d+ a)", line):
            continue
        if m := re.match(r"^Volebný okrsok č\. (\d+)$", line):
            okrsok, mode = int(m.group(1)), None
        elif m := re.match(r"^Volebná miestnosť: (.+)$", line):
            okrsky[okrsok], mode = clean(m.group(1)), "place"
        elif okrsok is None:
            continue
        elif re.match(r"^\d\. pre voličov, ktorí majú trvalý pobyt na uliciach", line):
            mode = "street"
        elif re.match(r"^\d\. pre voličov, ktorí majú trvalý pobyt evidovaní na mesto", line):
            streets.append(["Trvalý pobyt bez ulice (len „Stupava“)", None, okrsok])
        elif m := re.match(r"^\d\. v stavbách v k\. ú\. (.+?)(?: v lokalitách:)?$", line):
            area = m.group(1)
            if "lokalitách" in line:
                mode = "locality"
            else:
                streets.append([f"k. ú. {area}", None, okrsok])
                mode = None
        elif mode == "place":
            okrsky[okrsok] = clean(f"{okrsky[okrsok]} {line}")
        elif mode == "street":
            line = line.rstrip(",")
            m = re.match(r"^(.*?[^\d\s])\s+(\d.*)$", line)
            name, houses = (m.group(1), re.sub(r"\((n?e?párne)\)", r"\1", m.group(2))) if m else (line, None)
            streets.append([clean(name), houses and clean(houses), okrsok])
        elif mode == "locality":
            line = line.rstrip(",")
            name = f"{line} – lokalita" + ("" if area == "Stupava" else f" (k. ú. {area})")
            if [name, None, okrsok] not in streets:
                streets.append([name, None, okrsok])
        else:
            raise ValueError(f"Unparsed line in {path.name}: {line!r}")
    okrsky = {o: re.sub(r",\s*Stupava(?=\s*\(|$)", "", p) for o, p in okrsky.items()}
    return {"okrsky": okrsky, "streets": sorted(streets, key=lambda r: (unicodedata.normalize("NFD", r[0].lower()), r[2]))}


def main() -> None:
    by_name = {f"Bratislava - {d[1]}": d[0] for d in DISTRICTS}
    candidates: list[dict] = []

    for r in rows("OSO26_ZZK-Starosta"):
        obec = clean(r[1])
        if obec == "Bratislava":
            body, district = "primator", None
        elif obec == STUPAVA[1] and clean(r[0]) == "Malacky":
            body, district = "primator", STUPAVA[0]
        elif obec in by_name:
            body, district = "starosta", by_name[obec]
        else:
            continue
        b, a = split_titles(clean(r[5]))
        candidates.append({"body": body, "district": district, "obvod": None, "number": int(r[2]),
                           **person(r[3], r[4], b, a, r[6], r[7], r[8], ";")})

    for r in rows("OSO26_ZZK-Poslanci"):
        obec = clean(r[1])
        if obec == "Bratislava":
            body, district = "msz", None
        elif obec == STUPAVA[1] and clean(r[0]) == "Malacky":
            body, district = "msz", STUPAVA[0]
        elif obec == "Bratislava - Staré Mesto":
            body, district = "mz", "stare-mesto"
        else:
            continue
        b, a = split_titles(clean(r[6]))
        candidates.append({"body": body, "district": district, "obvod": int(r[2]), "number": int(r[3]),
                           **person(r[4], r[5], b, a, r[7], r[8], r[9], ";")})

    for r in rows("VUC26_ZZK-Predseda"):
        if not str(r[0]).startswith("Bratislavsk"):
            continue
        candidates.append({"body": "predseda-bsk", "district": None, "obvod": None, "number": int(r[1]),
                           **person(r[2], r[3], r[4], r[5], r[6], r[7], r[9], ", ", residence=clean(r[8]))})

    for r in rows("VUC26_ZZK-Poslanci"):
        if not str(r[0]).startswith("Bratislavsk") or int(r[1]) not in BSK_SEATS:
            continue
        candidates.append({"body": "zastupitelstvo-bsk", "district": None, "obvod": int(r[1]), "number": int(r[2]),
                           **person(r[3], r[4], r[5], r[6], r[7], r[8], r[10], ", ", residence=clean(r[9]))})

    for c in candidates:
        c["id"] = "-".join(str(x) for x in (c["body"], c["district"], c["obvod"], c["number"]) if x)
    ids = [c["id"] for c in candidates]
    assert len(ids) == len(set(ids)), "duplicate candidate ids"

    districts = [
        {"id": i, "city": "bratislava", "name": n, "mszObvod": m, "bskObvod": b, "url": u,
         "mzObvody": [{"obvod": o, "seats": s, "okrsky": ok} for o, (s, ok) in SM_MZ.items()] if i == "stare-mesto" else None,
         "mszObvody": None}
        for i, n, m, b, u in DISTRICTS
    ] + [
        {"id": STUPAVA[0], "city": "stupava", "name": STUPAVA[1], "mszObvod": None, "bskObvod": STUPAVA[2], "url": STUPAVA[3],
         "mzObvody": None, "mszObvody": [{"obvod": o, "seats": s, "okrsky": ok} for o, (s, ok) in STUPAVA_MSZ.items()]}
    ]
    bsk_districts = {d[3]: [] for d in DISTRICTS} | {STUPAVA[2]: []}
    for d in DISTRICTS:
        bsk_districts[d[3]].append(d[0])
    bsk_districts[STUPAVA[2]].append(STUPAVA[0])
    obvody = {
        "msz": [{"obvod": o, "seats": s, "districts": [d[0] for d in DISTRICTS if d[2] == o]} for o, s in MSZ_SEATS.items()],
        "zastupitelstvo-bsk": [{"obvod": o, "seats": s, "districts": bsk_districts[o]} for o, s in BSK_SEATS.items()],
    }

    OUT.mkdir(parents=True, exist_ok=True)
    streets = {"stare-mesto": parse_okrsky(SRC / "sm-okrsky.txt"), "stupava": parse_stupava(SRC / "okrsky" / "stupava.txt")}
    for name, data in (("candidates", candidates), ("districts", districts), ("obvody", obvody), ("streets", streets)):
        (OUT / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    summary: dict[str, int] = {}
    for c in candidates:
        summary[c["body"]] = summary.get(c["body"], 0) + 1
    print(summary, "total", len(candidates))


if __name__ == "__main__":
    main()
