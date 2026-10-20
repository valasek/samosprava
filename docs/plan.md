# Plan: Bratislava Self-Government Elections 2026 Voter Guide

Static, mobile-first SK/EN voter guide for the 24 Oct 2026 combined municipal + regional elections, Bratislava only. Astro + JSON data + minimal vanilla JS filtering, Netlify deploy on git push, served at `samosprava.stanislavvalasek.com`.

## Original assignment (summary)

- Explain simply who is elected, how, where and when to vote, and when/where full results will be published.
- Full list of candidates (and parties), with info a voter needs; filtering by district/constituency and other relevant criteria.
- Photo, name and important info per candidate.
- Primary goal: help undecided voters decide, link further sources, prevent administrative mistakes when voting.
- Restriction: Bratislava and its city districts only.

## Verified facts

Sources: minv.sk, bratislava.sk, zmos.sk

- Date: Saturday 24. 10. 2026, 7:00–20:00.
- Vote only at the polling station of your permanent residence.
- **No voter card (hlasovací preukaz)** is issued for these elections.
- Eligible: Slovak citizens and foreigners with permanent residence, aged 18+ on election day.
- Campaign moratorium starts 21. 10. 2026 at 23:59.
- Bratislava residents elect 6 bodies at once:
  1. Primátor (mayor of Bratislava)
  2. Mestské zastupiteľstvo (city council, MsZ)
  3. Starosta mestskej časti (district mayor)
  4. Miestne zastupiteľstvo (district council)
  5. Predseda BSK (chair of Bratislava Self-Governing Region)
  6. Zastupiteľstvo BSK (regional council)
- Official candidate lists (bratislava.sk, published 7. 9. 2026):
  - [Primátor candidates (PDF)](https://bratislavask.s3.bratislava.sk/upload/zoznam_zaregistrovanych_kandidatov_na_primatora_2026_v3_ab65b97c7a.pdf)
  - [MsZ candidates (PDF)](https://bratislavask.s3.bratislava.sk/upload/Zoznam_zaregistrovanych_kandidatov_na_poslancov_Ms_Z_2026_v3_b98fab8502.pdf)
  - [How to vote in Bratislava and Košice (PDF)](https://bratislavask.s3.bratislava.sk/upload/Informacia_o_sposobe_hlasovania_v_hlavnom_meste_Slovenskej_republiky_Bratislave_a_v_meste_Kosice_7a6485818b.pdf)
  - [Constituencies (PDF)](https://bratislavask.s3.bratislava.sk/upload/Oznamenie_o_utvoreni_volebnych_obvodov_184e4730e8.pdf)
- Results: volby.statistics.sk (linked from minv.sk "Výsledky volieb").

## Decisions

| Topic | Decision |
|---|---|
| Elections covered | Primátor, MsZ, 17 starostovia, predseda BSK, zastupiteľstvo BSK (Bratislava constituencies). Miestne zastupiteľstvo **only for Staré Mesto**. |
| Photos | Only freely licensed photos (Wikimedia Commons, identity verified) with author, licence link and "cropped" note; everyone else keeps initials avatars. Citing a source alone does not grant rights (zákon 185/2015), campaign sites are "All rights reserved" and offer no press kits. Current: Ráž (CC BY 3.0, TV JOJ), Šubová (CC BY-SA 4.0), Vallo (CC BY 4.0, A. Shadura), Droba (CC BY 2.0, P. Frešo). Data in `src/data/extras.json` (also verified candidate websites), images in `public/photos/`. |
| Tech stack | Astro (static output) + JSON data + small vanilla JS filter. |
| Languages | Slovak + English only. |
| Domain | `samosprava.stanislavvalasek.com` (overrides the originally proposed `komunalne-volby-2026.stanislavvalasek.com`). |
| Credit & feedback | Footer credit to Stanislav Valasek; feedback via Netlify Forms. |
| Where to vote | Explanation + links to polling station lists of each city district (no street lookup). |
| Hosting | Netlify, auto-deploy from git push; all static assets in repo. |
| Candidate data source | Official MV SR XLSX registers (starosta/primátor, obecné poslanci, predseda VÚC, poslanci VÚC), filtered to Bratislava by `scripts/extract.py` into `src/data/*.json`. Seat counts from city, BSK and Staré Mesto notices. |
| BSK constituencies | Obvody 1–11 cover Bratislava (24 in total in the region); obvody 12–24 are excluded. |
| Staré Mesto council | 8 obvody defined by okrsky (polling districts); voter finds their okrsok number on the notice mailed to households. |
| Ballot validity | Per law 180/2014 §152 (VÚC) and §184 (obce): a ballot is invalid if no candidate or more than allowed are circled. |
| Withdrawn candidates | Per §142(4) they stay on the ballot but are disregarded. Marked via candidate ids in `src/data/withdrawn.json`. 2026-10-20: Miroslav Heredoš withdrew as primátor candidate (`primator-2`); his MsZ candidacy (obvod 10) stays. |
| Street lookup | Staré Mesto only (the only district whose council constituencies are in scope): street + house number → okrsok → MZ obvod + polling place, parsed from the district notice into `src/data/streets.json`. MsZ and BSK obvody cover whole districts, so no lookup is needed there. |

## Status (2026-10-20)

- Phases 1–4 done and deployed; Lighthouse mobile 100/100/100/100.
- Election-day banner switches automatically (before / 24. 10. 7:00–20:00 / after → results link).
- Remaining: refresh data on 23. 10. (`scripts/download.sh` + `scripts/extract.py`) and check withdrawals; more photos only with written permission from campaigns.

## Data pipeline

1. `scripts/download.sh` downloads the MV SR XLSX files into `sources/` (git-ignored).
2. `.venv/bin/python3 scripts/extract.py` writes `src/data/candidates.json`, `districts.json`, `obvody.json`.
3. Counts (2026-10-20): primátor 6, starosta 44 (17 MČ), MsZ 220, Staré Mesto MZ 70, predseda BSK 7, zastupiteľstvo BSK 192 (Bratislava obvody) = 539.

## Phases

### 1. Scope
1. Save this plan to `docs/plan.md`.
2. Reduce `README.md` to a short English repo description.

### 2. PoC (depends on 1)
1. Astro skeleton, static output, `/sk/` and `/en/` routes, `netlify.toml`, placeholder page.
2. Footer with credit and Netlify feedback form.
3. Connect repo to Netlify, set `samosprava` CNAME, verify that git push deploys and HTTPS works.

### 3. Content (parallel with 2 once the schema is agreed)
1. Schema in `src/data/*.json`: bodies, districts, constituencies (MsZ, BSK), candidates (name, title, age, occupation, party/independent, constituency, ballot number, links, photo + credit), links.
2. Extract candidates from official PDFs: primátor + MsZ (bratislava.sk), predseda + zastupiteľstvo BSK (bsk.sk), 17 starostovia (district websites), Staré Mesto miestne zastupiteľstvo.
3. Results links and per-district polling station list links.
4. Photos for top-tier candidates only, with source credit.

### 4. Full app (depends on 2 and 3)
1. Home: what is elected, when and where; "My ballots" checklist (every voter gets 6 ballots; district council candidates listed only for Staré Mesto); how to mark ballots correctly (max N crosses); common mistakes; when and where results are published.
2. Candidates: filters by body, district, constituency, party, plus name search (vanilla JS over embedded JSON).
3. Candidate card: photo/avatar, key facts, external links.
4. Links page: official and independent sources (e.g. volby.sme.sk).
5. Polish: accessibility, Open Graph meta, countdown/deadline banner.

## Planned files

- `README.md` – English repo description
- `docs/plan.md` – this plan
- `astro.config.mjs`, `netlify.toml`, `package.json`
- `src/pages/{sk,en}/`, `src/data/`, `src/i18n/`, `public/photos/`

## Verification

1. `npm run build` produces static HTML without errors.
2. Netlify deploys on push; domain resolves over HTTPS.
3. Candidate counts spot-checked against each official PDF per district.
4. Feedback form submission appears in Netlify.
5. Layout checked at 360 px, tablet, desktop; Lighthouse mobile run.

## Risks / notes

- Election is in 4 days: ship Phase 4 incrementally (home + primátor/BSK predseda first, then councils).
- BSK and district candidate lists are not yet located; find them first in Phase 3.

## Sources

- https://www.minv.sk/?volby-samosprava26
- https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026
- https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026
- https://www.zmos.sk/spojene-samospravne-volby-budu-24--oktobra-2026-oznam/mid/536833/.html
- https://volby.sme.sk/regionalne-volby/2026

## Appendix: original assignment (from the original README)

> Tento víkend budú Regionálne voľby 2026 a potrebujem spraviť aplikáciu, ktorá voličom na prvú dobrú ukáže:
> - Jednoduchou formou vysvetlí, koho volia, ako volia, kde a kedy sa volí a kedy a kde budú kompletné výsledky
> - Zobrazí úplný zoznam všetkých kandidátov a prípadne strany. Pre každého voleného zobrazí tie informácie, ktoré sú pre voliča nutné. Užívatelia budú mať možnosť vybrať si s možnosťou filtrovania podľa okresu/obvodu alebo iných kritérií, ktoré sú pre voličov dôležité pri výbere.
>
> Pre každého voleného pridaj foto, meno a všetky důležité informácie.
>
> Primárnym cieľom aplikácie je uľahčiť rozhodovanie nerozhodnutým. poskytnúť odkazy na ďaľšie zdroje a zabezpečiť, aby voliči volili bez administratívnych chýb.
>
> Obmedzenia:
> - riešime iba Bratislavu a jej mestské časti
>
> Realization plan:
> 1. Prepare app scope and save it into the plan.md into docs folder and update this readme.me to keep only repo app description in english.
> 2. Implement PoC - just to test URL and deployment process
> 3. Search and download for the content
> 4. Implement full functionality
>
> If you need to make any important decisions, ask and save the decisions in the plan file.
>
> Design and technical restrictions:
> - App will be served as a web page.
> - Will be in Slovak and English language, propose more languages if many people spek that language
> - App should be mobile first, then tablet and last desktop optimized
> - Tech stack is up to you, just ask me for the final confirmation. App will not be reused, this is one time shot but propose someting tokend efficient.
> - Tech stack should support staightforward Netlify deployement from just git push (I will connect repo to Netlify, I have there an account). All static sources will be part of the app.
> - App url will be komunalne-volby-2026.stanislavvalasek.com and give me there a credit and leave a link for a feedback.