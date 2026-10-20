"""Build src/data/*.json from the official MV SR candidate XLSX files.

Usage: .venv/bin/python3 scripts/extract.py  (run scripts/download.sh first)
"""

import json
import re
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
BSK_SEATS = {1: 4, 2: 6, 3: 2, 4: 2, 5: 3, 6: 2, 7: 3, 8: 1, 9: 3, 10: 1, 11: 9}
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


def main() -> None:
    by_name = {f"Bratislava - {d[1]}": d[0] for d in DISTRICTS}
    candidates: list[dict] = []

    for r in rows("OSO26_ZZK-Starosta"):
        obec = clean(r[1])
        if obec == "Bratislava":
            body, district = "primator", None
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
        {"id": i, "name": n, "mszObvod": m, "bskObvod": b, "url": u,
         "mzObvody": [{"obvod": o, "seats": s, "okrsky": ok} for o, (s, ok) in SM_MZ.items()] if i == "stare-mesto" else None}
        for i, n, m, b, u in DISTRICTS
    ]
    obvody = {
        "msz": [{"obvod": o, "seats": s, "districts": [d[0] for d in DISTRICTS if d[2] == o]} for o, s in MSZ_SEATS.items()],
        "zastupitelstvo-bsk": [{"obvod": o, "seats": s, "districts": [d[0] for d in DISTRICTS if d[3] == o]} for o, s in BSK_SEATS.items()],
    }

    OUT.mkdir(parents=True, exist_ok=True)
    streets = {"stare-mesto": parse_okrsky(SRC / "sm-okrsky.txt")}
    for name, data in (("candidates", candidates), ("districts", districts), ("obvody", obvody), ("streets", streets)):
        (OUT / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

    summary: dict[str, int] = {}
    for c in candidates:
        summary[c["body"]] = summary.get(c["body"], 0) + 1
    print(summary, "total", len(candidates))


if __name__ == "__main__":
    main()
