import type { Lang } from './ui';

interface Section {
  title: string;
  intro?: string;
  items?: string[];
  ordered?: boolean;
}

interface HomeContent {
  lead: string;
  keyFacts: { label: string; value: string }[];
  ballots: Section & { white: string; blue: string; whiteNote: string; blueNote: string; seatsNote: string };
  steps: Section;
  mistakes: Section;
  who: Section;
  where: Section;
  results: Section;
}

export const home: Record<Lang, HomeContent> = {
  sk: {
    lead: 'V sobotu 24. októbra 2026 si Bratislavčania volia naraz vedenie mesta, svojej mestskej časti aj Bratislavského kraja. Na jednej návšteve volebnej miestnosti dostanete 6 hlasovacích lístkov.',
    keyFacts: [
      { label: 'Kedy', value: 'sobota 24. 10. 2026, 7:00 – 20:00' },
      { label: 'Kde', value: 'iba vo volebnej miestnosti podľa trvalého pobytu' },
      { label: 'Čo si zobrať', value: 'občiansky preukaz (cudzinci doklad o pobyte)' },
      { label: 'Voličský preukaz', value: 'v týchto voľbách neexistuje' },
    ],
    ballots: {
      title: 'Koho volíte – 6 hlasovacích lístkov',
      white: 'Biela obálka – mesto a mestská časť',
      blue: 'Modrá obálka – Bratislavský kraj',
      whiteNote: 'Lístky na primátora a do mestského zastupiteľstva majú na ľavom okraji sivý pruh.',
      blueNote: 'Oba lístky majú modré pruhy.',
      seatsNote: 'Počet, koľko kandidátov môžete zakrúžkovať, je uvedený aj priamo na hlasovacom lístku.',
    },
    steps: {
      title: 'Ako voliť krok za krokom',
      ordered: true,
      items: [
        'Príďte do svojej volebnej miestnosti (adresu nájdete na oznámení v schránke alebo na stránke mestskej časti) a ukážte občiansky preukaz.',
        'Komisia vám dá modrú obálku s 2 lístkami (kraj) a bielu obálku so 4 lístkami (mesto a mestská časť). Prevzatie podpíšete v každom zozname zvlášť.',
        'Vždy vojdite za plentu – bez toho vám komisia hlasovanie neumožní.',
        'Na lístku zakrúžkujte poradové číslo kandidáta – aspoň jedného. Pri primátorovi, starostovi a predsedovi kraja práve 1, pri zastupiteľstvách najviac toľko, koľko poslancov sa vo vašom obvode volí.',
        'Lístky na kraj vložte do modrej obálky, lístky na mesto a mestskú časť do bielej obálky.',
        'Modrú obálku vhoďte do modrej schránky, bielu obálku do bielej schránky.',
        'Nepoužité alebo pokazené lístky vhoďte do schránky na nepoužité lístky.',
      ],
    },
    mistakes: {
      title: 'Najčastejšie chyby, pre ktoré hlas neplatí',
      items: [
        'Zakrúžkovanie viac kandidátov, ako je dovolené – celý lístok je neplatný.',
        'Lístok bez jediného zakrúžkovaného kandidáta je neplatný. Ak v niektorej voľbe nechcete hlasovať, lístok nevkladajte do obálky.',
        'Kandidát, ktorý sa vzdal kandidatúry, zostáva na lístku, ale hlas preň sa pri prideľovaní mandátov neberie do úvahy. Zoznam je vyvesený vo volebnej miestnosti.',
        'Lístok v nesprávnej obálke (krajský v bielej, mestský v modrej) – lístok je neplatný.',
        'Obálka v nesprávnej schránke – hlasovanie je neplatné.',
        'Pokazili ste lístok? Požiadajte komisiu o nový, pokazený nevhadzujte do obálky.',
        'Nepoužité lístky si neodnášajte domov – hrozí pokuta 33 €.',
        'Voliť sa dá len v mieste trvalého pobytu. Voličský preukaz ani voľba poštou v týchto voľbách nie sú.',
      ],
    },
    who: {
      title: 'Kto môže voliť',
      items: [
        'Občan SR aj cudzinec, ktorý má trvalý pobyt v Bratislave.',
        'Najneskôr v deň volieb dovŕši 18 rokov.',
        'Môžete sa zúčastniť len jedných volieb (napr. iba krajských) – lístky na druhé jednoducho neprevezmete.',
        'Ak nemôžete prísť zo zdravotných dôvodov, požiadajte mestskú časť (alebo v deň volieb komisiu) o prenosnú volebnú schránku.',
      ],
    },
    where: {
      title: 'Kde voliť',
      intro: 'Volíte vo volebnej miestnosti svojho volebného okrsku podľa adresy trvalého pobytu. Adresu miestnosti nájdete na oznámení, ktoré dostala každá domácnosť, alebo na stránke svojej mestskej časti:',
    },
    results: {
      title: 'Kedy budú výsledky',
      items: [
        'Volebné miestnosti sa zatvárajú v sobotu o 20:00, potom začne sčítavanie.',
        'Priebežné výsledky zverejňuje Štatistický úrad SR počas noci na volby.statistics.sk.',
        'Oficiálne výsledky by mali byť vyhlásené v nedeľu 25. 10. 2026 popoludní.',
      ],
    },
  },
  en: {
    lead: 'On Saturday 24 October 2026, Bratislava residents elect the leadership of the city, their city district and the Bratislava Region – all at once. In one visit to the polling station you will receive 6 ballots.',
    keyFacts: [
      { label: 'When', value: 'Saturday 24 Oct 2026, 7:00 – 20:00' },
      { label: 'Where', value: 'only at the polling station of your permanent residence' },
      { label: 'Bring', value: 'ID card (foreigners: residence document)' },
      { label: 'Voter card', value: 'not available in these elections' },
    ],
    ballots: {
      title: 'Who you elect – 6 ballots',
      white: 'White envelope – city and city district',
      blue: 'Blue envelope – Bratislava Region',
      whiteNote: 'Ballots for the mayor and the city council have a grey stripe on the left edge.',
      blueNote: 'Both ballots have blue stripes.',
      seatsNote: 'The number of candidates you may circle is also printed on the ballot.',
    },
    steps: {
      title: 'How to vote step by step',
      ordered: true,
      items: [
        'Go to your polling station (the address is on the notice in your mailbox or on your city district website) and show your ID.',
        'The commission gives you a blue envelope with 2 ballots (region) and a white envelope with 4 ballots (city and district). You sign for each in a separate list.',
        'Always go behind the screen – otherwise the commission will not let you vote.',
        'Circle the candidate number on the ballot – at least one. For mayor, district mayor and regional chair exactly 1; for councils at most as many as there are seats in your constituency.',
        'Put the regional ballots in the blue envelope, the city and district ballots in the white envelope.',
        'Drop the blue envelope into the blue box and the white envelope into the white box.',
        'Put unused or spoiled ballots into the box for unused ballots.',
      ],
    },
    mistakes: {
      title: 'Common mistakes that make your vote invalid',
      items: [
        'Circling more candidates than allowed – the whole ballot is invalid.',
        'A ballot with no candidate circled is invalid. If you do not want to vote in one of the elections, just leave that ballot out of the envelope.',
        'A candidate who withdrew stays on the ballot, but is disregarded when seats are allocated. The list is posted in the polling station.',
        'A ballot in the wrong envelope (regional in white, city in blue) – the ballot is invalid.',
        'An envelope in the wrong box – the vote is invalid.',
        'Made a mistake? Ask the commission for a new ballot; do not put the spoiled one in the envelope.',
        'Do not take unused ballots home – there is a €33 fine.',
        'You can vote only where you have permanent residence. There is no voter card and no postal vote in these elections.',
      ],
    },
    who: {
      title: 'Who can vote',
      items: [
        'Slovak citizens and foreigners with permanent residence in Bratislava.',
        'Aged 18 or over on election day.',
        'You may take part in only one of the elections (e.g. only regional) – just do not take the other ballots.',
        'If you cannot come for health reasons, ask your city district (or the commission on election day) for a portable ballot box.',
      ],
    },
    where: {
      title: 'Where to vote',
      intro: 'You vote at the polling station of your polling district, based on your permanent address. The address is on the notice delivered to every household, or on your city district website:',
    },
    results: {
      title: 'When are the results',
      items: [
        'Polling stations close on Saturday at 20:00, then counting starts.',
        'The Statistical Office publishes running results overnight at volby.statistics.sk.',
        'Official results are expected on Sunday 25 Oct 2026 in the afternoon.',
      ],
    },
  },
};

export const links: Record<Lang, { group: string; items: { label: string; href: string }[] }[]> = {
  sk: [
    {
      group: 'Oficiálne zdroje',
      items: [
        { label: 'MV SR – Voľby do orgánov územnej samosprávy 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'MV SR – Informácie pre voliča a registre kandidátov', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Hlavné mesto Bratislava – Komunálne voľby 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Bratislavský samosprávny kraj – Voľby do VÚC 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Štatistický úrad SR – výsledky volieb', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Médiá a ďalšie informácie',
      items: [
        { label: 'SME – Regionálne voľby 2026', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'Wikipédia – Voľby do orgánov samosprávy obcí 2026', href: 'https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026' },
        { label: 'ZMOS – Spojené samosprávne voľby 2026', href: 'https://www.zmos.sk/spojene-samospravne-volby-budu-24--oktobra-2026-oznam/mid/536833/.html' },
      ],
    },
  ],
  en: [
    {
      group: 'Official sources (in Slovak)',
      items: [
        { label: 'Ministry of Interior – Self-government elections 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'Ministry of Interior – Voter information and candidate registers', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'City of Bratislava – Municipal elections 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Bratislava Self-Governing Region – Regional elections 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Statistical Office – election results', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Media and more',
      items: [
        { label: 'SME – Regional elections 2026 (Slovak)', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'Wikipedia – 2026 Slovak municipal elections (Slovak)', href: 'https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026' },
        { label: 'The Slovak Spectator', href: 'https://spectator.sme.sk/' },
      ],
    },
  ],
};
