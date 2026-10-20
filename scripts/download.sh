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
echo "Downloaded to $(pwd)"
