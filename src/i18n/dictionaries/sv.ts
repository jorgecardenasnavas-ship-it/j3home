import type { Dictionary } from "./types";

export const sv = {
  /* ── Shared components ── */

  nav: {
    soluciones: "Premium",
    acceder: "Logga in",
    inicio: "Hem",
  },

  footer: {
    copyright: "\u00A9 2026 J3Pádel",
  },

  sponsors: {
    items: [
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52 },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52 },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56 },
    ],
  },

  chat: {
    tooltip: "Kontakta oss",
  },

  /* ── Home page ── */

  hero: {
    play: "Play.",
    coach: "Coach.",
    manage: "Manage.",
    milestones: [
      { year: "2004", text: "Resan börjar" },
      { year: "2014", text: "Värd för World Padel Tour" },
      { year: "2018", text: "Bästa klubben i världen" },
      { year: "2022", text: "Bästa spanska tränaren i profrankingen" },
      { year: "2024", text: "10-årsjubileum för J3" },
      { year: "11\u00D7", text: "Titlar på proffstouren" },
    ],
    tagline: "Ungdomsakademi — mästare i Spanien och världen",
    cta1: "Se produkter",
    cta2: "Coach360",
    credsMobile: [
      { val: "#1", label: "Bästa klubb 2018" },
      { val: "20+", label: "År" },
      { val: "WPT", label: "Värd 2014" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", label: "Profsegrar" },
      { val: "\uD83C\uDFC6", label: "Mästare" },
    ],
  },

  impact: {
    line1: "Padelakademin",
    line2: "nummer ett",
    line3: "på Costa del Sol.",
    tagline: "Sedan 2004 \u00B7 Málaga, Spanien",
  },

  system: {
    blocks: [
      { line1: "Spelet", line2: "har förändrats." },
      { line1: "Tränaren", line2: "har utvecklats." },
      { line1: "Verksamheten", line2: "har optimerats." },
    ],
    nodes: ["Coach360", "J3PTV", "Academy", "Business", "Experience", "Partner"],
  },

  home: {
    line1: "En komplett miljö för entusiaster, spelare och krävande tränare.",
    line2: "Ett helhetssystem för förvaltning av padelakademier och klubbar.",
    closer: "Optimera. Automatisera. Skala upp.",
  },

  products: {
    cards: [
      {
        tag: "Online \u00B7 Utbildning",
        forLabel: "Padeltränare",
        description: "Omdöme, metod och gemenskap. Nytt innehåll varje vecka.",
        buttons: ["Läs mer", "Gå med"],
      },
      {
        tag: "Online \u00B7 Innehåll \u00B7 Underhållning",
        forLabel: "Alla profiler",
        description: "Analys, debatt och det moderna spelet utan brus.",
        buttons: ["Läs mer", "Logga in"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Next Gen",
        description: "Samma system som på proffstouren, anpassat för dig.",
        buttons: ["Träna med oss"],
      },
      {
        tag: "Automatisering \u00B7 Förvaltning \u00B7 Optimering",
        forLabel: "Akademier och klubbar",
        description: "Öka prestationen med vår expertis och personlig 1:1-coachning.",
        buttons: ["Läs mer", "Boka ett samtal"],
      },
      {
        tag: "Tjänst \u00B7 På plats",
        forLabel: "Klubbar, akademier och grupper",
        buttons: ["Begär offert"],
      },
      {
        tag: "Expansion \u00B7 Nyckelfärdigt",
        forLabel: "Klubbar och akademier",
        buttons: ["Läs mer"],
      },
    ],
  },

  nosotros: {
    label: "Vilka vi är",
    heading1: "Mer än 20 år",
    heading2: "inom padel.",
    body: "Vi började när padel var en helt annan sport. Vi har utvecklat spelare som idag tävlar på touren, drivit världens bästa klubb och tränat WPT-proffs. Det är det som ligger bakom.",
    link: "Upptäck vår historia",
    stats: [
      { val: "#1", line1: "Bästa klubb /", line2: "i världen 2018" },
      { val: "20+", line1: "År i /", line2: "branschen" },
      { val: "\uD83C\uDFC6", line1: "Mästare /", line2: "Spanien och världen" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", line1: "Professionell /", line2: "tour" },
    ],
  },

  contacto: {
    label: "Kontakt",
    heading1: "Berätta",
    heading2: "vad du söker.",
    body: "Om du har kommit ända hit har något väckt ditt intresse. Berätta var du befinner dig och vad du letar efter.",
    email: "E-post",
    telefono: "Telefon",
    sede: "Huvudkontor",
    placeholders: {
      nombre: "Namn",
      email: "E-post",
      mensaje: "Meddelande",
    },
    soyOptions: [
      "Jag är...",
      "Tränare / Coach",
      "Amatörspelare",
      "Padelentusiast",
      "Akademi- / klubbchef",
      "Intresserad av franchise",
      "Annat",
    ],
    interesOptions: [
      "Jag är intresserad av...",
      "Coach360 \u00B7 Utbildning",
      "J3PTV \u00B7 Innehåll",
      "Academy \u00B7 Träna i Málaga",
      "Franchise \u00B7 Nyckelfärdigt system",
      "J3 Experience \u00B7 Kom till min klubb",
      "Annat",
    ],
    submit: "Skicka",
    sending: "Skickar...",
    sent: "\u2713 Skickat",
    error: "Vänligen fyll i namn, e-post och meddelande.",
  },

  /* ── Story page ── */

  story: {
    hero: {
      prefix: "Mer än",
      years: "20 år",
      dentro: "inne i",
      delJuego: "spelet.",
      sub1: "Ett av de mest",
      sub2: "inflytelserika",
      sub3: "teamen i padelvärlden.",
      desde: "Sedan 2004",
      location: "Málaga, Spanien",
    },

    impact: {
      line1: "Vi siktar mot stjärnorna, men",
      line2: "står alltid med fötterna på jorden.",
      fact1: "Vi har tränat spelare i topp 8 på proffstouren.",
      fact2: "Tio år i ledningen av en av världens bästa klubbar.",
      closer: "Och vi är fortfarande på banan.",
      proudLabel: "Det vi är mest stolta över",
      cantera: [
        "Vi har utbildat och stöttat dussintals juniorer.",
        "Några blev mästare i Spanien eller världen.",
        "Andra nådde proffstouren.",
        "Och många antogs till det universitet de valde",
        "tack vare att de klassades som elitidrottare av CSD.",
      ],
      historyLabel: "Vår historia",
    },

    stats: {
      header: "Vår historia i siffror",
      items: [
        { val: 20, suffix: "+", lbl: "År i\nbranschen" },
        { prefix: "#", val: 1, lbl: "Bästa klubb\ni världen 2018" },
        { val: 11, lbl: "Professionella titlar\ni 18 spelade finaler" },
        { val: 100, suffix: "+", lbl: "Tränare utbildade\ni Coach360" },
        { label: "WPT", val: 0, lbl: "Officiell värd\nMálaga 2014" },
      ],
    },

    timeline: {
      sectionLabel: "Historik",
      heading1: "Milstolpar som",
      heading2: "definierar oss",
      eras: ["Början", "Ocean Padel \u00B7 J3Padel", "Reserva del Higuerón", "Nytt kapitel"],
      entries: [
        {
          year: "Tidigt 2000-tal",
          title: "Padel hittar oss",
          desc: "Vi upptäcker padel som amatörer. Det som börjar som en sport förvandlas snabbt till en passion. År av tävlingar runt om i Andalusien, stammisar i Málagalaget och representerande Universidad de Málaga (UMA).",
        },
        {
          year: "2005-2008",
          title: "De första lektionerna",
          desc: "Samtidigt som vi fortsätter tävla börjar vi ge lektioner parallellt. La Capellanía och Club de Tenis Málaga är de första platserna där vi börjar lära ut det som spelet hade lärt oss.",
        },
        {
          year: "2009-2010",
          title: "Smash Padel \u2192 Ocean Padel",
          desc: "Vi samlas för första gången alla tre — Javi, Jorge och Jordi Muñoz — för att starta en juniorakademi på Smash Padel. Kort därefter omvandlas den till Ocean Padel, och den riktiga expansionen börjar.",
          highlight: true,
        },
        {
          year: "2010-2014",
          title: "Spaniens bästa juniorakademi",
          desc: "Ocean Padel blir en nationell referens. Här utbildas Álex Ruiz, Momo González, Guille Collado, Bea González och hela den första generationen. Flera når det spanska landslaget och tävlar internationellt.",
          badge: "Mästare Andalusien \u00B7 Spanien \u00B7 Världen (juniorer)",
        },
        {
          year: "2014",
          title: "J3Padel föds",
          desc: "När Ocean Padel stänger splittras teamet, men varumärket J3 föds som en egen enhet. Vi organiserar WPT i Málaga med nästan 300 anmälda par.",
          badge: "World Padel Tour \u00B7 Officiell värd Málaga 2014",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "I samma lokaler som Ocean Padel öppnar vi en egen klubb. Ett projekt som inte bar sig, men som gav en tydlig läxa om klubbdrift.",
        },
        {
          year: "2016",
          title: "Higuerón Resort",
          desc: "Vi ansluter oss till Reserva del Higuerón — idag Higuerón Resort. Den längsta och mest krävande perioden i projektet inleds. Jordi Muñoz lämnar Málaga och J3-projektet av personliga skäl. Hans avtryck lever kvar.",
        },
        {
          year: "2018",
          title: "Världens bästa padelklubb",
          desc: "Higuerón Resort, under vår ledning, utses till världens bästa padelklubb. En titel som kommer efter två år av tyst och ambitiöst arbete.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
        },
        {
          year: "2016-2022",
          title: "Tävlingsskola \u00B7 Internationalisering",
          desc: "Under sex år ligger fokus på ungdomsutveckling och internationalisering. Det vi redan gjort på Ocean Padel replikerar vi igen. Dessutom gör vi Costa del Sol till en internationell destination för amatörspelare.",
        },
        {
          year: "2021",
          title: "Álex Ruiz och Franco Stupaczuk",
          desc: "Vi återvänder till elitträning. Resultatet är historiskt: vi avslutar året som topp 4 i världen på WPT.",
          badge: "Topp 4 i världen WPT \u00B7 2021",
          highlight: true,
        },
        {
          year: "2022-2023",
          title: "Álex Ruiz och Momo González",
          desc: "Ett helmalaguenskt par, utbildade på Ocean Padel / J3. De når topp 5 i världen. Final i WPT i Marbella — på hemmaplan.",
          badge: "Topp 5 i världen \u00B7 Final WPT Marbella",
        },
        {
          year: "2023-2024",
          title: "Varlion",
          desc: "Javi kliver in på Varlion som ansvarig för varumärkets expansion. En period av strategiskt lärande utanför banan.",
        },
        {
          year: "2024",
          title: "Slutet på en era",
          desc: "Vi avslutar samarbetet med Higuerón Resort och Varlion. Nästan ett decennium med att driva det som var världens bästa klubb. Det kapitlet stängs.",
        },
        {
          year: "2024-2025",
          title: "Från Málaga till världen",
          desc: "Helhjärtat fokuserade på att bygga J3Padel som ekosystem: utbildning, förvaltning, innehåll och elitträning.",
        },
        {
          year: "Mitten av 2025",
          title: "Coach360 föds",
          desc: "Onlineutbildning för padeltränare. Efter att ha rest världen runt och sett det tomrum som padelns expansion skapat inom utbildning bestämde vi oss för att bidra med all vår kunskap på ett unikt sätt. Vi skapade den första tränarcommunityns.",
          badge: "Coach360 \u00B7 100+ coaches \u00B7 40+ lektioner",
        },
        {
          year: "2026",
          title: "Nytt huvudkontor \u00B7 Málaga centrum",
          desc: "J3Padel har åter en fysisk bas — Finura Padel och Vals Los Limoneros. Det kompletta ekosystemet: Coach360, J3PTV, Academy, Business och Experience.",
          badge: "Finura Padel \u00B7 Vals Los Limoneros \u00B7 Sommaren 2026",
        },
      ],
    },

    team: {
      label: "Teamet",
      heading1: "Två personer.",
      heading2: "Samma omdöme.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "Cárdenas",
          bio: "Spelare, tränare, genomförare. Växer upp på banan och fortsätter träna, men med en naturlig talang för att omvandla idéer till struktur. Organiserar WPT Málaga med nästan 300 par, driver Higuerón tills det blir världens bästa klubb och leder idag hela J3-ekosystemets operativa verksamhet.",
          quote: "Utan genomförande förblir visionen bara ett samtal.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "Cárdenas",
          bio: "Spelare, tränare, strateg. Alltid med blicken riktad mot det som komma skall. Definierar J3-metodiken från banan, utbildar dussintals juniorer som når toppen och leder spelare till topp 5 i världen. Idag designar han vart J3Padel är på väg.",
          quote: "Att se spelet innan det händer. Det är att träna.",
        },
      ],
    },

    players: {
      label: "Spelare",
      heading1: "Utbildade med",
      heading2: "J3-systemet.",
      description: "Två typer av relationer. De vi utbildade från grunden — idag på proffstouren. Och de som anlitat J3 för förberedelser på elitnivå.",
      heroLabel: "Utbildade från grunden \u00B7 Högsta nivån på touren",
      nextGenLabel: "Från ungdomsakademin till proffstouren",
      nextGenProLabel: "Kom som löften \u00B7 Etablerade på touren",
      featuredLabel: "Framstående professionella samarbeten",
      sharedLabel: "Har också delat team med J3",
      heroPlayers: [
        { info: "Utbildad från ung ålder på Ocean Padel. Nådde världens topp 4.", tag: "Världens topp 4" },
        { info: "Ungdomsakademin Ocean Padel / J3. 100 % från Málaga. Världens topp 5.", tag: "Världens topp 5" },
        { info: "Världens topp 8 på PPT. Medgrundare av J3Padel.", tag: "Medgrundare J3 · PPT topp 8" },
      ],
      nextGenTags: [
        "Mästare i Spanien och världen",
        "Mästarinna i Spanien och världen",
        "Mästarinna i Spanien · Proffstouren",
        "Mästare i Spanien · Proffstouren",
        "Mästare i Spanien och världen Junior",
      ],
      nextGenProTags: [
        "Next Gen → Topp 30",
        "Next Gen → Topp 30",
      ],
      featuredPlayers: [
        { info: "5 finaler och världens par nr 4 år 2021.", tag: "3 titlar · #4 i världen 2021" },
        { info: "Semifinal i P2 Premier Padel i Milano 2022.", tag: "SF P2 Milano 2022" },
        { info: "Semifinal i P2 Premier Padel i Milano 2022.", tag: "SF P2 Milano 2022" },
        { info: "FIP Platinum-titel i Mexico City.", tag: "FIP Platinum-titel CDMX" },
      ],
      sharedTags: [
        "Världstopp",
        "Världstopp",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
        "Proffstouren",
      ],
    },

    philosophy: {
      label: "Filosofi",
      word1: "Omdöme.",
      word2: "Metod.",
      word3: "System.",
      body: "Vi tränar inte med lösryckta övningar. Vi driver inte verksamheten på intuition. Allt vi gör på J3Padel bygger på ett system som formats under 20 år.",
      pillars: [
        {
          num: "01",
          label: "Omdöme",
          title: "Att veta varför, inte bara vad",
          body: "En tränare med omdöme utför inte bara övningar — hen fattar beslut.",
        },
        {
          num: "02",
          label: "Metod",
          title: "Repeterbarhet och progression",
          body: "J3-metoden är utformad för att skapa systematisk förbättring. Utan metod kan talangen inte skalas upp.",
        },
        {
          num: "03",
          label: "System",
          title: "Struktur som fungerar på egen hand",
          body: "Ett bra system arbetar när du inte är där. Vi har byggt det för klubbar, akademier och tränare.",
        },
        {
          num: "04",
          label: "Banan",
          title: "Allt utgår från verklig matchspel",
          body: "Varje koncept i J3-systemet har testats på banan — med verkliga spelare, i verklig tävling.",
        },
      ],
    },

    clubs: {
      label: "Klubbledning",
      heading1: "Klubbar där vi",
      heading2: "har lämnat avtryck.",
      description: "Teknisk ledning, operativ förvaltning och ungdomsutveckling.",
      originLabel: "Där allt började",
      presentLabel: "I nuläget",
      lessonAside: "Ett projekt som inte bar sig, men som gav en tydlig läxa.",
      origins: [
        {
          flag: "Málaga \u00B7 2009\u20132014",
          name: "Ocean Padel",
          detail: "Där allt började på riktigt. Spaniens bästa juniorakademi. Här utbildades Álex Ruiz, Momo González, Guille Collado och hela den första J3-generationen.",
          highlight: "Bästa juniorakademin",
        },
        {
          flag: "Málaga \u00B7 2014",
          name: "Belife",
          detail: "Officiell värd för World Padel Tour. Närmare 300 anmälda par.",
          highlight: "WPT \u00B7 Officiell värd 2014",
        },
      ],
      heroClub: {
        flag: "Marbella \u00B7 2016\u20132024",
        name: "Reserva del Higuerón",
        detail: "Nästan ett decennium med att driva den klubb som utsågs till världens bästa. Komplett teknisk ledning, elitungdomsakademi och storskalig verksamhet.",
        highlight: "Best Padel Club in the World \u00B7 2018",
        years: "9",
      },
      lesson: {
        flag: "Málaga \u00B7 2015",
        name: "J3Padel Indoor",
      },
      present: [
        {
          flag: "Málaga centrum \u00B7 2026",
          name: "Finura Padel",
          detail: "Första basen i den nya etappen i centrala Málaga.",
          highlight: "Nuvarande bas \u00B7 I drift",
        },
        {
          flag: "Puerto de la Torre \u00B7 2026",
          name: "Vals Los Limoneros",
          detail: "Ny anläggning. Nyöppnad klubb.",
          highlight: "Öppnar snart \u00B7 Sommaren 2026",
        },
      ],
    },

    brands: {
      currentLabel: "Varumärken som litar på J3Padel",
      pastLabel: "Har samarbetat med J3Padel",
    },

    cta: {
      label: "20 år senare",
      heading1: "Fram till hit",
      heading2: "är allt historia.",
      body: "Det som kommer skrivs av de som väljer att vara med. Om du är tränare, driver en klubb eller helt enkelt vill träna med oss — nu är stunden.",
      buttons: ["Prata med oss", "Coach360", "Academy", "Business"],
    },
  },
} as const satisfies Dictionary;
