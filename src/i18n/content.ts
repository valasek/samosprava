import type { Lang } from './ui';

interface Section {
  title: string;
  intro?: string;
  items?: string[];
  ordered?: boolean;
}

interface HomeContent {
  lead: string;
  keyFacts: { label: string; value: string; href?: string }[];
  ballots: Section & { white: string; blue: string; whiteNote: string; blueNote: string; seatsNote: string };
  steps: Section;
  mistakes: Section;
  who: Section;
  where: Section;
  results: Section;
  // Overrides shown when the voter picks Stupava (4 ballots, no city district).
  stupava: { lead: string; ballotsTitle: string; white: string; whiteNote: string; step2: string };
}

export const home: Record<Lang, HomeContent> = {
  sk: {
    lead: 'V sobotu 24. októbra 2026 si Bratislavčania volia naraz vedenie mesta, svojej mestskej časti aj Bratislavského kraja. Na jednej návšteve volebnej miestnosti dostanete 6 hlasovacích lístkov.',
    keyFacts: [
      { label: 'Kedy', value: 'sobota 24. 10. 2026, 7:00 – 20:00' },
      { label: 'Kde', value: 'iba vo volebnej miestnosti podľa trvalého pobytu', href: '#kde-volit' },
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
        'Občan SR aj cudzinec, ktorý má trvalý pobyt v Bratislave alebo v Stupave.',
        'Najneskôr v deň volieb dovŕši 18 rokov.',
        'Môžete sa zúčastniť len jedných volieb (napr. iba krajských) – lístky na druhé jednoducho neprevezmete.',
        'Ak nemôžete prísť zo zdravotných dôvodov, požiadajte mestskú časť (alebo v deň volieb komisiu) o prenosnú volebnú schránku.',
      ],
    },
    stupava: {
      lead: 'V sobotu 24. októbra 2026 si Stupavčania volia naraz vedenie mesta aj Bratislavského kraja. Na jednej návšteve volebnej miestnosti dostanete 4 hlasovacie lístky.',
      ballotsTitle: 'Koho volíte – 4 hlasovacie lístky',
      white: 'Biela obálka – mesto Stupava',
      whiteNote: 'Mestské časti a starostu Stupava nemá, volí sa len primátor a mestské zastupiteľstvo.',
      step2: 'Komisia vám dá modrú obálku s 2 lístkami (kraj) a bielu obálku s 2 lístkami (mesto). Prevzatie podpíšete v každom zozname zvlášť.',
    },
    where: {
      title: 'Kde voliť',
      intro: 'Volíte vo volebnej miestnosti svojho volebného okrsku podľa adresy trvalého pobytu. Vyberte mestskú časť, prípadne ulicu a číslo domu – zobrazíme adresu volebnej miestnosti. Nájdete ju aj na oznámení, ktoré dostala každá domácnosť.',
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
      { label: 'Where', value: 'only at the polling station of your permanent residence', href: '#kde-volit' },
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
        'Slovak citizens and foreigners with permanent residence in Bratislava or Stupava.',
        'Aged 18 or over on election day.',
        'You may take part in only one of the elections (e.g. only regional) – just do not take the other ballots.',
        'If you cannot come for health reasons, ask your city district (or the commission on election day) for a portable ballot box.',
      ],
    },
    stupava: {
      lead: 'On Saturday 24 October 2026, Stupava residents elect the leadership of the town and the Bratislava Region – all at once. In one visit to the polling station you will receive 4 ballots.',
      ballotsTitle: 'Who you elect – 4 ballots',
      white: 'White envelope – Town of Stupava',
      whiteNote: 'Stupava has no city districts or district mayor; you elect only the mayor and the town council.',
      step2: 'The commission gives you a blue envelope with 2 ballots (region) and a white envelope with 2 ballots (town). You sign for each in a separate list.',
    },
    where: {
      title: 'Where to vote',
      intro: 'You vote at the polling station of your polling district, based on your permanent address. Choose your city district and, if needed, your street and house number to see the polling station address. It is also on the notice delivered to every household.',
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
  hu: {
    lead: '2026. október 24-én, szombaton a pozsonyiak egyszerre választják meg a város, a városrészük és Pozsony megye vezetését. A szavazóhelyiségben egyetlen alkalommal 6 szavazólapot kap.',
    keyFacts: [
      { label: 'Mikor', value: '2026. október 24., szombat, 7:00 – 20:00' },
      { label: 'Hol', value: 'csak az állandó lakhelye szerinti szavazóhelyiségben', href: '#kde-volit' },
      { label: 'Mit vigyen', value: 'személyi igazolványt (külföldiek tartózkodási okmányt)' },
      { label: 'Választói igazolás', value: 'ezen a választáson nincs' },
    ],
    ballots: {
      title: 'Kire szavaz – 6 szavazólap',
      white: 'Fehér boríték – város és városrész',
      blue: 'Kék boríték – Pozsony megye',
      whiteNote: 'A főpolgármesteri és a városi képviselő-testületi szavazólap bal szélén szürke csík van.',
      blueNote: 'Mindkét szavazólapon kék csíkok vannak.',
      seatsNote: 'Azt, hogy hány jelöltet karikázhat be, a szavazólap is feltünteti.',
    },
    steps: {
      title: 'Hogyan szavazzon lépésről lépésre',
      ordered: true,
      items: [
        'Menjen el a szavazóhelyiségébe (a címet a postaládájába kézbesített értesítésen vagy a városrész honlapján találja), és mutassa fel személyi igazolványát.',
        'A bizottság ad egy kék borítékot 2 szavazólappal (megye) és egy fehér borítékot 4 szavazólappal (város és városrész). Az átvételt mindegyik jegyzékben külön aláírja.',
        'Mindig menjen be a paraván mögé – enélkül a bizottság nem engedi szavazni.',
        'A szavazólapon karikázza be a jelölt sorszámát – legalább egyet. Főpolgármesternél, polgármesternél és megyeelnöknél pontosan 1-et, a képviselő-testületeknél legfeljebb annyit, ahány képviselőt az Ön választókerületében választanak.',
        'A megyei szavazólapokat tegye a kék borítékba, a városi és városrészi szavazólapokat a fehér borítékba.',
        'A kék borítékot dobja a kék urnába, a fehér borítékot a fehér urnába.',
        'A fel nem használt vagy elrontott szavazólapokat dobja a fel nem használt szavazólapok gyűjtőládájába.',
      ],
    },
    mistakes: {
      title: 'A leggyakoribb hibák, amelyek miatt a szavazat érvénytelen',
      items: [
        'A megengedettnél több jelölt bekarikázása – az egész szavazólap érvénytelen.',
        'Az a szavazólap, amelyen egyetlen jelölt sincs bekarikázva, érvénytelen. Ha valamelyik választáson nem akar szavazni, ne tegye a szavazólapot a borítékba.',
        'A visszalépett jelölt a szavazólapon marad, de a rá leadott szavazatot a mandátumok elosztásánál nem veszik figyelembe. A listát kifüggesztik a szavazóhelyiségben.',
        'Rossz borítékba tett szavazólap (megyei a fehérbe, városi a kékbe) – a szavazólap érvénytelen.',
        'Rossz urnába dobott boríték – a szavazás érvénytelen.',
        'Elrontotta a szavazólapot? Kérjen újat a bizottságtól, az elrontottat ne tegye a borítékba.',
        'A fel nem használt szavazólapokat ne vigye haza – 33 € bírság járhat érte.',
        'Csak az állandó lakhelyén szavazhat. Választói igazolás és levélszavazás ezen a választáson nincs.',
      ],
    },
    who: {
      title: 'Ki szavazhat',
      items: [
        'Szlovák állampolgár és külföldi is, akinek állandó lakhelye (trvalý pobyt) Pozsonyban vagy Stomfán van.',
        'Legkésőbb a választás napján betölti 18. életévét.',
        'Részt vehet csak az egyik választáson is (pl. csak a megyein) – a többi szavazólapot egyszerűen ne vegye át.',
        'Ha egészségügyi okból nem tud elmenni, kérjen mozgóurnát a városrésztől (vagy a választás napján a bizottságtól).',
      ],
    },
    stupava: {
      lead: '2026. október 24-én, szombaton a stomfaiak egyszerre választják meg a város és Pozsony megye vezetését. A szavazóhelyiségben egyetlen alkalommal 4 szavazólapot kap.',
      ballotsTitle: 'Kire szavaz – 4 szavazólap',
      white: 'Fehér boríték – Stomfa város',
      whiteNote: 'Stomfának nincsenek városrészei, csak a polgármestert és a városi képviselő-testületet választják.',
      step2: 'A bizottság ad egy kék borítékot 2 szavazólappal (megye) és egy fehér borítékot 2 szavazólappal (város). Az átvételt mindegyik jegyzékben külön aláírja.',
    },
    where: {
      title: 'Hol szavazzon',
      intro: 'Az állandó lakcíme szerinti szavazókörzet szavazóhelyiségében szavaz. Válassza ki a városrészt, szükség esetén az utcát és a házszámot – megmutatjuk a szavazóhelyiség címét. Megtalálja azt a minden háztartásnak kézbesített értesítésen is.',
    },
    results: {
      title: 'Mikor lesznek eredmények',
      items: [
        'A szavazóhelyiségek szombaton 20:00-kor zárnak, utána kezdődik a számlálás.',
        'Az előzetes eredményeket a Szlovák Statisztikai Hivatal az éjszaka folyamán teszi közzé a volby.statistics.sk oldalon.',
        'A hivatalos eredményeket várhatóan 2026. október 25-én, vasárnap délután hirdetik ki.',
      ],
    },
  },
  cs: {
    lead: 'V sobotu 24. října 2026 si Bratislavané volí najednou vedení města, své městské části i Bratislavského kraje. Při jedné návštěvě volební místnosti dostanete 6 hlasovacích lístků.',
    keyFacts: [
      { label: 'Kdy', value: 'sobota 24. 10. 2026, 7:00 – 20:00' },
      { label: 'Kde', value: 'pouze ve volební místnosti podle trvalého pobytu', href: '#kde-volit' },
      { label: 'Co si vzít', value: 'občanský průkaz (cizinci doklad o pobytu)' },
      { label: 'Voličský průkaz', value: 'v těchto volbách neexistuje' },
    ],
    ballots: {
      title: 'Koho volíte – 6 hlasovacích lístků',
      white: 'Bílá obálka – město a městská část',
      blue: 'Modrá obálka – Bratislavský kraj',
      whiteNote: 'Lístky na primátora a do městského zastupitelstva mají na levém okraji šedý pruh.',
      blueNote: 'Oba lístky mají modré pruhy.',
      seatsNote: 'Počet kandidátů, které můžete zakroužkovat, je uveden i přímo na hlasovacím lístku.',
    },
    steps: {
      title: 'Jak volit krok za krokem',
      ordered: true,
      items: [
        'Přijďte do své volební místnosti (adresu najdete v oznámení ve schránce nebo na webu městské části) a ukažte občanský průkaz.',
        'Komise vám dá modrou obálku se 2 lístky (kraj) a bílou obálku se 4 lístky (město a městská část). Převzetí podepíšete v každém seznamu zvlášť.',
        'Vždy jděte za plentu – bez toho vám komise hlasování neumožní.',
        'Na lístku zakroužkujte pořadové číslo kandidáta – alespoň jednoho. U primátora, starosty a předsedy kraje právě 1, u zastupitelstev nejvýše tolik, kolik poslanců se ve vašem obvodu volí.',
        'Lístky na kraj vložte do modré obálky, lístky na město a městskou část do bílé obálky.',
        'Modrou obálku vhoďte do modré schránky, bílou obálku do bílé schránky.',
        'Nepoužité nebo pokažené lístky vhoďte do schránky na nepoužité lístky.',
      ],
    },
    mistakes: {
      title: 'Nejčastější chyby, kvůli kterým hlas neplatí',
      items: [
        'Zakroužkování více kandidátů, než je dovoleno – celý lístek je neplatný.',
        'Lístek bez jediného zakroužkovaného kandidáta je neplatný. Pokud v některé volbě nechcete hlasovat, lístek do obálky nevkládejte.',
        'Kandidát, který se vzdal kandidatury, zůstává na lístku, ale hlas pro něj se při přidělování mandátů nebere v úvahu. Seznam je vyvěšen ve volební místnosti.',
        'Lístek ve špatné obálce (krajský v bílé, městský v modré) – lístek je neplatný.',
        'Obálka ve špatné schránce – hlasování je neplatné.',
        'Pokazili jste lístek? Požádejte komisi o nový, pokažený do obálky nevkládejte.',
        'Nepoužité lístky si neodnášejte domů – hrozí pokuta 33 €.',
        'Volit lze pouze v místě trvalého pobytu. Voličský průkaz ani volba poštou v těchto volbách nejsou.',
      ],
    },
    who: {
      title: 'Kdo může volit',
      items: [
        'Občan SR i cizinec (včetně občanů ČR), který má trvalý pobyt v Bratislavě nebo ve Stupavě.',
        'Nejpozději v den voleb dovrší 18 let.',
        'Můžete se zúčastnit jen jedněch voleb (např. jen krajských) – lístky na ostatní jednoduše nepřevezmete.',
        'Pokud nemůžete přijít ze zdravotních důvodů, požádejte městskou část (nebo v den voleb komisi) o přenosnou volební schránku.',
      ],
    },
    stupava: {
      lead: 'V sobotu 24. října 2026 si obyvatelé Stupavy volí najednou vedení města i Bratislavského kraje. Při jedné návštěvě volebí místnosti dostanete 4 hlasovací lístky.',
      ballotsTitle: 'Koho volíte – 4 hlasovací lístky',
      white: 'Bílá obálka – město Stupava',
      whiteNote: 'Stupava nemá městské části ani starostu, volí se jen primátor a městské zastupitelstvo.',
      step2: 'Komise vám dá modrou obálku se 2 lístky (kraj) a bílou obálku se 2 lístky (město). Převzetí podepíšete v každém seznamu zvlášť.',
    },
    where: {
      title: 'Kde volit',
      intro: 'Volíte ve volební místnosti svého volebního okrsku podle adresy trvalého pobytu. Vyberte městskou část, případně ulici a číslo domu – zobrazíme adresu volební místnosti. Najdete ji i v oznámení, které dostala každá domácnost.',
    },
    results: {
      title: 'Kdy budou výsledky',
      items: [
        'Volební místnosti se zavírají v sobotu ve 20:00, potom začíná sčítání.',
        'Průběžné výsledky zveřejňuje Statistický úřad SR během noci na volby.statistics.sk.',
        'Oficiální výsledky by měly být vyhlášeny v neděli 25. 10. 2026 odpoledne.',
      ],
    },
  },
  ru: {
    lead: 'В субботу, 24 октября 2026 года, жители Братиславы одновременно избирают руководство города, своего городского района и Братиславского края. За одно посещение помещения для голосования вы получите 6 бюллетеней.',
    keyFacts: [
      { label: 'Когда', value: 'суббота, 24 октября 2026, 7:00 – 20:00' },
      { label: 'Где', value: 'только в помещении для голосования по месту постоянного жительства', href: '#kde-volit' },
      { label: 'Что взять с собой', value: 'удостоверение личности (иностранцы – документ о пребывании)' },
      { label: 'Открепительное удостоверение', value: 'на этих выборах не предусмотрено' },
    ],
    ballots: {
      title: 'За кого вы голосуете – 6 бюллетеней',
      white: 'Белый конверт – город и городской район',
      blue: 'Синий конверт – Братиславский край',
      whiteNote: 'Бюллетени на выборы мэра и в городской совет имеют серую полосу у левого края.',
      blueNote: 'Оба бюллетеня имеют синие полосы.',
      seatsNote: 'Количество кандидатов, которых можно обвести, указано и на самом бюллетене.',
    },
    steps: {
      title: 'Как голосовать – шаг за шагом',
      ordered: true,
      items: [
        'Придите в своё помещение для голосования (адрес указан в объявлении в почтовом ящике или на сайте городского района) и предъявите удостоверение личности.',
        'Комиссия выдаст вам синий конверт с 2 бюллетенями (край) и белый конверт с 4 бюллетенями (город и городской район). Получение вы подтверждаете подписью в каждом списке отдельно.',
        'Обязательно зайдите за ширму – иначе комиссия не допустит вас к голосованию.',
        'Обведите в бюллетене порядковый номер кандидата – хотя бы одного. Для мэра, старосты и председателя края – ровно 1, для советов – не больше, чем избирается депутатов в вашем округе.',
        'Бюллетени по краю положите в синий конверт, бюллетени по городу и району – в белый конверт.',
        'Синий конверт опустите в синюю урну, белый конверт – в белую урну.',
        'Неиспользованные или испорченные бюллетени опустите в ящик для неиспользованных бюллетеней.',
      ],
    },
    mistakes: {
      title: 'Частые ошибки, из-за которых голос недействителен',
      items: [
        'Обведено больше кандидатов, чем разрешено, – весь бюллетень недействителен.',
        'Бюллетень, в котором не обведён ни один кандидат, недействителен. Если не хотите голосовать на каких-то выборах, просто не кладите этот бюллетень в конверт.',
        'Кандидат, снявший свою кандидатуру, остаётся в бюллетене, но голоса за него при распределении мандатов не учитываются. Список вывешен в помещении для голосования.',
        'Бюллетень в неправильном конверте (краевой – в белом, городской – в синем) – бюллетень недействителен.',
        'Конверт в неправильной урне – голосование недействительно.',
        'Испортили бюллетень? Попросите у комиссии новый, испорченный в конверт не кладите.',
        'Не уносите неиспользованные бюллетени домой – грозит штраф 33 €.',
        'Голосовать можно только по месту постоянного жительства. Открепительных удостоверений и голосования по почте на этих выборах нет.',
      ],
    },
    who: {
      title: 'Кто может голосовать',
      items: [
        'Гражданин Словакии, а также иностранец с постоянным местом жительства (trvalý pobyt) в Братиславе или Ступаве.',
        'Временное убежище (dočasné útočisko) и временное пребывание (prechodný pobyt) права голоса на этих выборах не дают.',
        'Исполнилось 18 лет не позднее дня выборов.',
        'Можно участвовать только в одних выборах (например, только краевых) – просто не берите остальные бюллетени.',
        'Если вы не можете прийти по состоянию здоровья, попросите городской район (или в день выборов комиссию) о переносной урне.',
      ],
    },
    stupava: {
      lead: 'В субботу, 24 октября 2026 года, жители Ступавы одновременно избирают руководство города и Братиславского края. За одно посещение помещения для голосования вы получите 4 бюллетеня.',
      ballotsTitle: 'За кого вы голосуете – 4 бюллетеня',
      white: 'Белый конверт – город Ступава',
      whiteNote: 'В Ступаве нет городских районов – избираются только мэр и городской совет.',
      step2: 'Комиссия выдаст вам синий конверт с 2 бюллетенями (край) и белый конверт с 2 бюллетенями (город). Получение вы подтверждаете подписью в каждом списке отдельно.',
    },
    where: {
      title: 'Где голосовать',
      intro: 'Вы голосуете в помещении для голосования своего избирательного участка по адресу постоянного места жительства. Выберите городской район и при необходимости улицу и номер дома – мы покажем адрес помещения для голосования. Он также указан в объявлении, которое получило каждое домохозяйство.',
    },
    results: {
      title: 'Когда будут результаты',
      items: [
        'Помещения для голосования закрываются в субботу в 20:00, затем начинается подсчёт голосов.',
        'Предварительные результаты Статистическое управление СР публикует ночью на volby.statistics.sk.',
        'Официальные результаты ожидаются в воскресенье, 25 октября 2026, во второй половине дня.',
      ],
    },
  },
  uk: {
    lead: 'У суботу, 24 жовтня 2026 року, жителі Братислави одночасно обирають керівництво міста, свого міського району та Братиславського краю. За одне відвідування приміщення для голосування ви отримаєте 6 бюлетенів.',
    keyFacts: [
      { label: 'Коли', value: 'субота, 24 жовтня 2026, 7:00 – 20:00' },
      { label: 'Де', value: 'лише в приміщенні для голосування за місцем постійного проживання', href: '#kde-volit' },
      { label: 'Що взяти', value: 'посвідчення особи (іноземці – документ про перебування)' },
      { label: 'Відкріпне посвідчення', value: 'на цих виборах не передбачене' },
    ],
    ballots: {
      title: 'За кого ви голосуєте – 6 бюлетенів',
      white: 'Білий конверт – місто й міський район',
      blue: 'Синій конверт – Братиславський край',
      whiteNote: 'Бюлетені для виборів мера та до міської ради мають сіру смугу біля лівого краю.',
      blueNote: 'Обидва бюлетені мають сині смуги.',
      seatsNote: 'Кількість кандидатів, яких можна обвести, вказано й на самому бюлетені.',
    },
    steps: {
      title: 'Як голосувати – крок за кроком',
      ordered: true,
      items: [
        'Прийдіть до свого приміщення для голосування (адресу вказано в оголошенні в поштовій скриньці або на сайті міського району) і пред’явіть посвідчення особи.',
        'Комісія видасть вам синій конверт із 2 бюлетенями (край) і білий конверт із 4 бюлетенями (місто та міський район). Отримання ви підтверджуєте підписом у кожному списку окремо.',
        'Обов’язково зайдіть за ширму – інакше комісія не допустить вас до голосування.',
        'Обведіть у бюлетені порядковий номер кандидата – щонайменше одного. Для мера, старости та голови краю – рівно 1, для рад – не більше, ніж обирається депутатів у вашому окрузі.',
        'Бюлетені щодо краю покладіть у синій конверт, бюлетені щодо міста й району – у білий конверт.',
        'Синій конверт опустіть у синю скриньку, білий конверт – у білу скриньку.',
        'Невикористані або зіпсовані бюлетені опустіть у скриньку для невикористаних бюлетенів.',
      ],
    },
    mistakes: {
      title: 'Поширені помилки, через які голос недійсний',
      items: [
        'Обведено більше кандидатів, ніж дозволено, – увесь бюлетень недійсний.',
        'Бюлетень, у якому не обведено жодного кандидата, недійсний. Якщо не хочете голосувати на якихось виборах, просто не кладіть цей бюлетень у конверт.',
        'Кандидат, який зняв свою кандидатуру, залишається в бюлетені, але голоси за нього під час розподілу мандатів не враховуються. Список вивішено в приміщенні для голосування.',
        'Бюлетень у неправильному конверті (крайовий – у білому, міський – у синьому) – бюлетень недійсний.',
        'Конверт у неправильній скриньці – голосування недійсне.',
        'Зіпсували бюлетень? Попросіть у комісії новий, зіпсований у конверт не кладіть.',
        'Не забирайте невикористані бюлетені додому – загрожує штраф 33 €.',
        'Голосувати можна лише за місцем постійного проживання. Відкріпних посвідчень і голосування поштою на цих виборах немає.',
      ],
    },
    who: {
      title: 'Хто може голосувати',
      items: [
        'Громадянин Словаччини, а також іноземець із постійним проживанням (trvalý pobyt) у Братиславі або Ступаві.',
        'Тимчасовий захист (dočasné útočisko) і тимчасове проживання (prechodný pobyt) права голосу на цих виборах не дають.',
        'Виповнилося 18 років не пізніше дня виборів.',
        'Можна взяти участь лише в одних виборах (наприклад, лише крайових) – просто не беріть інші бюлетені.',
        'Якщо ви не можете прийти через стан здоров’я, попросіть міський район (або в день виборів комісію) про переносну скриньку.',
      ],
    },
    stupava: {
      lead: 'У суботу, 24 жовтня 2026 року, жителі Ступави одночасно обирають керівництво міста та Братиславського краю. За одне відвідування приміщення для голосування ви отримаєте 4 бюлетені.',
      ballotsTitle: 'За кого ви голосуєте – 4 бюлетені',
      white: 'Білий конверт – місто Ступава',
      whiteNote: 'У Ступаві немає міських районів – обирають лише мера та міську раду.',
      step2: 'Комісія видасть вам синій конверт із 2 бюлетенями (край) і білий конверт із 2 бюлетенями (місто). Отримання ви підтверджуєте підписом у кожному списку окремо.',
    },
    where: {
      title: 'Де голосувати',
      intro: 'Ви голосуєте в приміщенні для голосування своєї виборчої дільниці за адресою постійного проживання. Виберіть міський район і за потреби вулицю та номер будинку – ми покажемо адресу приміщення для голосування. Її також вказано в оголошенні, яке отримало кожне домогосподарство.',
    },
    results: {
      title: 'Коли будуть результати',
      items: [
        'Приміщення для голосування закриваються в суботу о 20:00, після чого починається підрахунок голосів.',
        'Попередні результати Статистичне управління СР публікує вночі на volby.statistics.sk.',
        'Офіційні результати очікуються в неділю, 25 жовтня 2026, у другій половині дня.',
      ],
    },
  },
  vi: {
    lead: 'Vào thứ Bảy, ngày 24 tháng 10 năm 2026, người dân Bratislava cùng lúc bầu ra lãnh đạo thành phố, quận của mình và vùng Bratislava. Trong một lần đến phòng bỏ phiếu, bạn sẽ nhận 6 lá phiếu.',
    keyFacts: [
      { label: 'Khi nào', value: 'Thứ Bảy 24/10/2026, 7:00 – 20:00' },
      { label: 'Ở đâu', value: 'chỉ tại phòng bỏ phiếu theo nơi thường trú', href: '#kde-volit' },
      { label: 'Mang theo', value: 'giấy tờ tùy thân (người nước ngoài: thẻ cư trú)' },
      { label: 'Giấy chứng nhận bỏ phiếu nơi khác', value: 'không áp dụng trong cuộc bầu cử này' },
    ],
    ballots: {
      title: 'Bạn bầu cho ai – 6 lá phiếu',
      white: 'Phong bì trắng – thành phố và quận',
      blue: 'Phong bì xanh – vùng Bratislava',
      whiteNote: 'Phiếu bầu thị trưởng và hội đồng thành phố có sọc xám ở mép trái.',
      blueNote: 'Cả hai lá phiếu đều có sọc xanh.',
      seatsNote: 'Số ứng viên bạn được khoanh tròn cũng được in trên lá phiếu.',
    },
    steps: {
      title: 'Cách bỏ phiếu từng bước',
      ordered: true,
      items: [
        'Đến phòng bỏ phiếu của bạn (địa chỉ có trên thông báo trong hộp thư hoặc trên trang web của quận) và xuất trình giấy tờ tùy thân.',
        'Ban bầu cử sẽ đưa bạn một phong bì xanh có 2 lá phiếu (vùng) và một phong bì trắng có 4 lá phiếu (thành phố và quận). Bạn ký nhận riêng trong từng danh sách.',
        'Luôn đi vào sau tấm che – nếu không, ban bầu cử sẽ không cho bạn bỏ phiếu.',
        'Khoanh tròn số thứ tự của ứng viên trên lá phiếu – ít nhất một người. Với thị trưởng, trưởng quận và chủ tịch vùng: đúng 1; với các hội đồng: tối đa bằng số ghế được bầu ở đơn vị bầu cử của bạn.',
        'Bỏ các lá phiếu cấp vùng vào phong bì xanh, các lá phiếu thành phố và quận vào phong bì trắng.',
        'Bỏ phong bì xanh vào thùng phiếu xanh, phong bì trắng vào thùng phiếu trắng.',
        'Bỏ các lá phiếu không dùng hoặc bị hỏng vào thùng dành cho phiếu không sử dụng.',
      ],
    },
    mistakes: {
      title: 'Những lỗi thường gặp khiến phiếu bầu không hợp lệ',
      items: [
        'Khoanh tròn nhiều ứng viên hơn mức cho phép – toàn bộ lá phiếu không hợp lệ.',
        'Lá phiếu không khoanh tròn ứng viên nào là không hợp lệ. Nếu bạn không muốn bầu trong một cuộc bầu cử nào đó, đừng bỏ lá phiếu đó vào phong bì.',
        'Ứng viên đã rút lui vẫn có tên trên lá phiếu, nhưng phiếu bầu cho họ không được tính khi phân bổ ghế. Danh sách được niêm yết tại phòng bỏ phiếu.',
        'Lá phiếu bỏ sai phong bì (phiếu vùng trong phong bì trắng, phiếu thành phố trong phong bì xanh) – lá phiếu không hợp lệ.',
        'Phong bì bỏ sai thùng phiếu – phiếu bầu không hợp lệ.',
        'Viết hỏng lá phiếu? Hãy xin ban bầu cử lá phiếu mới, đừng bỏ lá phiếu hỏng vào phong bì.',
        'Không mang phiếu chưa dùng về nhà – có thể bị phạt 33 €.',
        'Bạn chỉ có thể bỏ phiếu tại nơi thường trú. Cuộc bầu cử này không có giấy chứng nhận bỏ phiếu nơi khác và không bỏ phiếu qua bưu điện.',
      ],
    },
    who: {
      title: 'Ai được bỏ phiếu',
      items: [
        'Công dân Slovakia và người nước ngoài có thường trú (trvalý pobyt) tại Bratislava hoặc Stupava.',
        'Người chỉ có tạm trú (prechodný pobyt) không có quyền bỏ phiếu trong cuộc bầu cử này.',
        'Đủ 18 tuổi chậm nhất vào ngày bầu cử.',
        'Bạn có thể chỉ tham gia một cuộc bầu cử (ví dụ chỉ bầu cấp vùng) – chỉ cần không nhận các lá phiếu còn lại.',
        'Nếu không thể đến vì lý do sức khỏe, hãy đề nghị quận (hoặc ban bầu cử vào ngày bầu cử) mang thùng phiếu lưu động đến.',
      ],
    },
    stupava: {
      lead: 'Vào thứ Bảy, ngày 24 tháng 10 năm 2026, người dân Stupava cùng lúc bầu ra lãnh đạo thành phố và vùng Bratislava. Trong một lần đến phòng bỏ phiếu, bạn sẽ nhận 4 lá phiếu.',
      ballotsTitle: 'Bạn bầu cho ai – 4 lá phiếu',
      white: 'Phong bì trắng – thành phố Stupava',
      whiteNote: 'Stupava không có quận, chỉ bầu thị trưởng và hội đồng thành phố.',
      step2: 'Ban bầu cử sẽ đưa bạn một phong bì xanh có 2 lá phiếu (vùng) và một phong bì trắng có 2 lá phiếu (thành phố). Bạn ký nhận riêng trong từng danh sách.',
    },
    where: {
      title: 'Bỏ phiếu ở đâu',
      intro: 'Bạn bỏ phiếu tại phòng bỏ phiếu của khu vực bỏ phiếu theo địa chỉ thường trú. Hãy chọn quận và nếu cần, tên đường và số nhà – chúng tôi sẽ hiển thị địa chỉ phòng bỏ phiếu. Địa chỉ này cũng có trên thông báo gửi đến từng hộ gia đình.',
    },
    results: {
      title: 'Khi nào có kết quả',
      items: [
        'Các phòng bỏ phiếu đóng cửa lúc 20:00 thứ Bảy, sau đó bắt đầu kiểm phiếu.',
        'Văn phòng Thống kê Slovakia công bố kết quả sơ bộ trong đêm trên volby.statistics.sk.',
        'Kết quả chính thức dự kiến được công bố vào chiều Chủ Nhật 25/10/2026.',
      ],
    },
  },
  rue: {
    lead: 'В суботу 24. октобра 2026 Братіславчане выберуть нараз веджіня міста, своєй містьской части і Братіславского краю. При єдній навщіві вольбовой містности достанете 6 голосовачіх листків.',
    keyFacts: [
      { label: 'Коли', value: 'субота 24. 10. 2026, 7:00 – 20:00' },
      { label: 'Де', value: 'лем у вольбовій містности подля трвалого побыту', href: '#kde-volit' },
      { label: 'Што взяти', value: 'обчаньскый преуказ (чуджінці доклад о побыті)' },
      { label: 'Вольчій преуказ', value: 'в тых вольбах не єствує' },
    ],
    ballots: {
      title: 'Кого волите – 6 голосовачіх листків',
      white: 'Біла обалка – місто і містьска часть',
      blue: 'Модра обалка – Братіславскый край',
      whiteNote: 'Листкы на прімаря і до містьского заступительства мають на лівім краю сивый пас.',
      blueNote: 'Обидва листкы мають модры пасы.',
      seatsNote: 'Кілько кандідатів можете закружковати, є уведене і прямо на голосовачім листку.',
    },
    steps: {
      title: 'Як голосовати крок за кроком',
      ordered: true,
      items: [
        'Прийдьте до своєй вольбовой містности (адресу найдете на оголошіню в поштовій скринці або на сторінці містьской части) і укажте обчаньскый преуказ.',
        'Комісія вам дасть модру обалку з 2 листками (край) і білу обалку з 4 листками (місто і містьска часть). Пріятя підпишете в каждім списку окремо.',
        'Завсе войдьте за заслону – без того вам комісія голосованя не доволить.',
        'На листку закружкуйте порядове чісло кандідата – холем єдного. При прімарьови, старостови і председови краю точно 1, при заступительствах найвеце тілько, кілько посланців ся у вашім обводі волить.',
        'Листкы на край вложте до модрой обалкы, листкы на місто і містьску часть до білой обалкы.',
        'Модру обалку вкиньте до модрой скринкы, білу обалку до білой скринкы.',
        'Неужыты або зопсованы листкы вкиньте до скринкы на неужыты листкы.',
      ],
    },
    mistakes: {
      title: 'Найчастїшы хыбы, про котры голос не платить',
      items: [
        'Закружкованя веце кандідатів, як є доволене – цілый листок є неплатный.',
        'Листок без єдного закружкованого кандідата є неплатный. Кідь в даякій вольбі не хочете голосовати, листок не вкладайте до обалкы.',
        'Кандідат, котрый одступив од кандідатуры, лишать ся на листку, але голос за нёго ся при розділіню мандатів не рахує. Список є вывішеный у вольбовій містности.',
        'Листок в неправилній обалці (крайскый в білій, містьскый в модрій) – листок є неплатный.',
        'Обалка в неправилній скринці – голосованя є неплатне.',
        'Зопсовали сьте листок? Попросьте комісію о новый, зопсованый до обалкы не вкладайте.',
        'Неужыты листкы не беріть домів – грозить покута 33 €.',
        'Голосовати мож лем в місці трвалого побыту. Вольчій преуказ ани вольба поштов в тых вольбах не суть.',
      ],
    },
    who: {
      title: 'Хто може голосовати',
      items: [
        'Обчан СР і чуджінець, котрый має трвалый побыт у Братіславі або в Ступаві.',
        'Найпізнїше в день волеб доповнить 18 років.',
        'Можете ся зучастнити лем єдных волеб (напр. лем крайскых) – листкы на другы просто не приймете.',
        'Кідь не можете прийти зо здравотных причін, попросьте містьску часть (або в день волеб комісію) о переносну вольбову скринку.',
      ],
    },
    stupava: {
      lead: 'В суботу 24. октобра 2026 Ступавчане выберуть нараз веджіня міста і Братіславского краю. При єдній навщіві вольбовой містности достанете 4 голосовачі листкы.',
      ballotsTitle: 'Кого волите – 4 голосовачі листкы',
      white: 'Біла обалка – місто Ступава',
      whiteNote: 'Ступава не має містьскых частей, волиться лем прімар і містьске заступительство.',
      step2: 'Комісія вам дасть модру обалку з 2 листками (край) і білу обалку з 2 листками (місто). Пріятя підпишете в каждім списку окремо.',
    },
    where: {
      title: 'Де голосовати',
      intro: 'Голосуєте у вольбовій містности свого вольбового окрску подля адресы трвалого побыту. Выберте містьску часть, припадно уліцю і чісло дому – укажеме адресу вольбовой містности. Найдете єй і на оголошіню, котре достала каждя домакня.',
    },
    results: {
      title: 'Коли будуть резултаты',
      items: [
        'Вольбовы містности ся заперають в суботу о 20:00, потім зачне рахованя.',
        'Перебіжны резултаты зверейнює Штатістічный уряд СР через ніч на volby.statistics.sk.',
        'Офіціалны резултаты бы мали быти выголошены в неділю 25. 10. 2026 пополудні.',
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
        { label: 'Mesto Stupava – Spojené voľby 2026: obvody a okrsky', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
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
        { label: 'Town of Stupava – Elections 2026: constituencies and polling districts', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
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
  hu: [
    {
      group: 'Hivatalos források (szlovákul)',
      items: [
        { label: 'Belügyminisztérium – Önkormányzati választások 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'Belügyminisztérium – Tájékoztató a választóknak és jelöltnyilvántartások', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Pozsony főváros – Önkormányzati választások 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Pozsony megye – Megyei választások 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Stomfa város – Választások 2026: választókerületek és szavazókörök', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Statisztikai Hivatal – választási eredmények', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Média és további információk',
      items: [
        { label: 'Új Szó (magyarul)', href: 'https://ujszo.com/' },
        { label: 'SME – Regionális választások 2026 (szlovákul)', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'Wikipédia – Önkormányzati választások 2026 (szlovákul)', href: 'https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026' },
      ],
    },
  ],
  cs: [
    {
      group: 'Oficiální zdroje (slovensky)',
      items: [
        { label: 'MV SR – Volby do orgánů územní samosprávy 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'MV SR – Informace pro voliče a registry kandidátů', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Hlavní město Bratislava – Komunální volby 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Bratislavský samosprávný kraj – Krajské volby 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Město Stupava – Volby 2026: obvody a okrsky', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Statistický úřad SR – výsledky voleb', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Média a další informace (slovensky)',
      items: [
        { label: 'SME – Regionální volby 2026', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'Wikipedie – Volby do orgánů samosprávy obcí 2026', href: 'https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026' },
      ],
    },
  ],
  ru: [
    {
      group: 'Официальные источники (на словацком)',
      items: [
        { label: 'МВД СР – Выборы в органы самоуправления 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'МВД СР – Информация для избирателей и реестры кандидатов', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Город Братислава – Муниципальные выборы 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Братиславский самоуправляемый край – Краевые выборы 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Город Ступава – Выборы 2026: округа и участки', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Статистическое управление СР – результаты выборов', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'СМИ и другая информация',
      items: [
        { label: 'SME – Региональные выборы 2026 (на словацком)', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'The Slovak Spectator (на английском)', href: 'https://spectator.sme.sk/' },
      ],
    },
  ],
  uk: [
    {
      group: 'Офіційні джерела (словацькою)',
      items: [
        { label: 'МВС СР – Вибори до органів самоврядування 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'МВС СР – Інформація для виборців і реєстри кандидатів', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Місто Братислава – Муніципальні вибори 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Братиславський самоврядний край – Крайові вибори 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Місто Ступава – Вибори 2026: округи та дільниці', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Статистичне управління СР – результати виборів', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'ЗМІ та інша інформація',
      items: [
        { label: 'SME – Регіональні вибори 2026 (словацькою)', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'The Slovak Spectator (англійською)', href: 'https://spectator.sme.sk/' },
      ],
    },
  ],
  vi: [
    {
      group: 'Nguồn chính thức (tiếng Slovakia)',
      items: [
        { label: 'Bộ Nội vụ – Bầu cử chính quyền địa phương 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'Bộ Nội vụ – Thông tin cho cử tri và danh sách ứng viên', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Thành phố Bratislava – Bầu cử địa phương 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Vùng tự quản Bratislava – Bầu cử cấp vùng 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Thành phố Stupava – Bầu cử 2026: đơn vị bầu cử và khu vực bỏ phiếu', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Văn phòng Thống kê – kết quả bầu cử', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Báo chí và thông tin khác',
      items: [
        { label: 'SME – Bầu cử cấp vùng 2026 (tiếng Slovakia)', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'The Slovak Spectator (tiếng Anh)', href: 'https://spectator.sme.sk/' },
      ],
    },
  ],
  rue: [
    {
      group: 'Офіціалны жрідла (по словацькы)',
      items: [
        { label: 'МВ СР – Вольбы до орґанів теріторіалной самосправы 2026', href: 'https://www.minv.sk/?volby-samosprava26' },
        { label: 'МВ СР – Інформації про вольча і реґістры кандідатів', href: 'https://www.minv.sk/?samosprava26-info10' },
        { label: 'Головне місто Братіслава – Комуналны вольбы 2026', href: 'https://bratislava.sk/mesto-bratislava/transparentne-mesto/komunalne-volby-2026' },
        { label: 'Братіславскый самосправный край – Вольбы до ВУЦ 2026', href: 'https://bratislavskykraj.sk/volby-do-vuc-2026/' },
        { label: 'Місто Ступава – Вольбы 2026: обводы і окрскы', href: 'https://www.stupava.sk/mesto/oznamy/spojene-volby-2026-obvody-vz-okrsky-6886sk.html' },
        { label: 'Штатістічный уряд СР – резултаты волеб', href: 'https://volby.statistics.sk/' },
      ],
    },
    {
      group: 'Медії і далшы інформації (по словацькы)',
      items: [
        { label: 'SME – Реґіоналны вольбы 2026', href: 'https://volby.sme.sk/regionalne-volby/2026' },
        { label: 'Вікіпедія – Вольбы до орґанів самосправы обцей 2026', href: 'https://sk.wikipedia.org/wiki/Vo%C4%BEby_do_org%C3%A1nov_samospr%C3%A1vy_obc%C3%AD_na_Slovensku_v_roku_2026' },
      ],
    },
  ],
};
