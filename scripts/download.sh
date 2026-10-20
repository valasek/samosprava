#!/bin/sh
# Download official source files into sources/ (not committed).
set -e
mkdir -p "$(dirname "$0")/../sources"
cd "$(dirname "$0")/../sources"
M=https://www.minv.sk/swift_data/source/verejna_sprava/volby_a_referendum
curl -sfo OSO26_ZZK-Starosta.xlsx $M/150_oso/OSO26_ZZK-Starosta.xlsx
curl -sfo OSO26_ZZK-Poslanci.xlsx $M/150_oso/OSO26_ZZK-Poslanci.xlsx
curl -sfo VUC26_ZZK-Predseda.xlsx $M/140_vuc/VUC26_ZZK-Predseda.xlsx
curl -sfo VUC26_ZZK-Poslanci.xlsx $M/140_vuc/VUC26_ZZK-Poslanci.xlsx
# Staré Mesto: streets per polling district (okrsok)
curl -sfo sm-okrsky.pdf https://data.moderneobce.sk/data/uploads/staremesto.sk/volby2026/oznamenie_26_1103.pdf
pdftotext -layout sm-okrsky.pdf sm-okrsky.txt
# Polling places per street for all city districts (parsed by scripts/polling.py)
mkdir -p okrsky
UA="Mozilla/5.0 (Macintosh) AppleWebKit/537.36 Chrome/130 Safari/537.36"
dl() { curl -sfL -A "$UA" -o "okrsky/$1" "$2"; }
dl nm.pdf "https://data.moderneobce.sk/data/uploads/banm.sk/113434/Volebn%C3%A9_okrsky_ulice_-_komplet_zoznam_volby_20261024_1.pdf"
dl ruz.html "https://www.ruzinov.sk/sk/stranky/view/zoznam-ulic-a-okrskov-abecedne"
dl petr.pdf "https://www.petrzalka.sk/wp-content/uploads/2026/09/OKRSKY-SPOJENE-VOLBY-2026.pdf"
dl kv.pdf "https://www.karlovaves.sk/wp-content/uploads/2026/07/Urcenie_volebnych_okrskov_kom-volby_volby-VUC_2026.pdf"
dl dub.pdf "https://www.dubravka.sk/files/documents/samosprava/volby/2026%20samospravy/rozhodnutie-starostu-vytvorenie-vo-a-vm-2026-v1.03.pdf"
dl raca.pdf "https://www.raca.sk/wp-content/uploads/2026/07/Oznamenie-o-utvoreni-volebnych-obvodov-poctu-poslancov-a-urceni-volebnych-okrskov-2026.pdf"
dl vrak.pdf "https://www.vrakuna.sk/data/page/vrakuna.sk/31466/volebne-okrsky-a-volebne-miestnosti.pdf"
dl pb1.pdf "https://www.biskupice.sk/evt_file.php?file=15318"
dl pb2.pdf "https://www.biskupice.sk/evt_file.php?file=15320"
dl dnv.pdf "https://www.devinskanovaves.sk/data/page/devinskanovaves.sk/31556/rozdelenie-okrskov.pdf"
dl rus.pdf "https://www.bratislava-rusovce.sk/media/files/volby/2026__spojene_samospravne_volby_/2026-07-30/okrsky_v_mc_bratislava-rusovce_pre_volby_do_organov_samospravy_obci_a_do_organov_samospravy_krajov.pdf"
echo "Downloaded to $(pwd)"
