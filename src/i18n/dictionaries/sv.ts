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
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52, href: "https://www.tecnifibre.com" },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52, href: "https://www.lacoste.com" },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56, href: "http://www.alquilavisual.com" },
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
      { year: "11\u00D7", text: "Mästare på proffstouren" },
    ],
    tagline: "Ungdomsakademi — mästare i Spanien och världen",
    cta1: "Se produkter",
    cta2: "Coach360",
    accentTouch: {
      topLine: "Världen tappade accenten.",
      accentWord: "Vi",
      afterAccent: "har den kvar.",
      labelLeft: "P\u00C1DEL \u00B7 MED \u00B7 ACCENT",
      labelRight: "SEDAN 2004 \u2014 M\u00C1LAGA",
    },
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
        buttons: ["Gå till Coach360"],
      },
      {
        tag: "Online \u00B7 Innehåll \u00B7 Underhållning",
        forLabel: "Alla profiler",
        description: "Analys, debatt och det moderna spelet utan brus.",
        buttons: ["Läs mer", "Logga in"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Junior",
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
    statsLabel: "I siffror",
    stats: [
      { val: "#1", line1: "Bästa klubb /", line2: "i världen 2018" },
      { val: "20+", line1: "År /", line2: "i branschen" },
      { val: "WPT", line1: "Officiell värd /", line2: "sedan 2014" },
      { val: "18", line1: "Titlar /", line2: "på proffstouren" },
      { val: "100+", line1: "Tränare /", line2: "utbildade J3-metod" },
      { val: "Top 5", line1: "Världsranking /", line2: "2022" },
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
        "Vi tränade dussintals unga spelare.",
        "Några lyfte nationella och internationella titlar.",
        "Andra uppnådde sitt mål att spela på proffstouren.",
        "Och många förverkligade drömmen om att studera vid det universitet de ville.",
      ],
      historyLabel: "Vår historia",
    },

    bridge: {
      line1: "Vi spelar. Vi tr\u00E4nar. Vi leder.",
      line2: "V\u00E5rt hem \u00E4r 20\u00D710.",
    },

    accent: {
      eyebrow: "Vår signatur",
      slogan: ["Pádel.", "Med.", "Accent."],
      manifesto: [
        "När sporten lämnade Spanien tappade den sin accent.",
        "Vi släppte den aldrig.",
        "För accenten är inte stavning — det är ursprung.",
      ],
    },

    stats: {
      header: "Vår historia i siffror",
      items: [
        { val: 20, suffix: "+", lbl: "Års\nerfarenhet" },
        { prefix: "#", val: 1, lbl: "Bästa klubb\ni världen 2018" },
        { val: 100, suffix: "+", lbl: "Tränare utbildade\ni Coach360" },
        { val: 2000, suffix: "+", lbl: "Amatörspelare\nutbildade" },
        { val: 30, suffix: "+", lbl: "Professionella spelare\nutbildade" },
        { label: "N.º1", val: 0, lbl: "Bästa spanska tränare\nWPT-ranking 2022" },
        { val: 11, lbl: "Professionella titlar\ni 18 spelade finaler" },
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
          image: "/images/story/timeline/ocean-padel.jpg",
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
          image: "/images/story/timeline/j3padel-fundadores.jpeg",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "I samma lokaler som Ocean Padel öppnar vi en egen klubb. Ett projekt som inte bar sig, men som gav en tydlig läxa om klubbdrift.",
        },
        {
          year: "2016",
          title: "Higuerón Resort",
          desc: "Vi ansluter oss till Reserva del Higuerón — idag Higuerón Resort. Den längsta och mest krävande perioden i projektet inleds.",
          image: "/images/story/timeline/higueron-resort.jpg",
        },
        {
          year: "Slutet av 2016",
          title: "Jordi Muñoz lämnar projektet",
          desc: "Jordi lämnar Málaga och J3-projektet av personliga skäl. Hans avtryck lever kvar. Javi och Jorge fortsätter med projektet, även om det är utan det J som öppnade vägen för dem.",
          image: "/images/story/timeline/tres-j.jpeg",
          imagePosition: "center 25%",
        },
        {
          year: "2018",
          title: "Världens bästa padelklubb",
          desc: "Higuerón Resort, under vår ledning, utses till världens bästa padelklubb. En titel som kommer efter två år av tyst och ambitiöst arbete.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
          image: "/images/story/timeline/mejor-club-2018.jpeg",
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
          image: "/images/story/timeline/franco-alex-pozzoni-jorge.jpeg",
          imagePosition: "center 55%",
        },
        {
          year: "2022",
          title: "Final WPT Marbella",
          desc: "Ett helmalaguenskt par, utbildade på Ocean Padel / J3. Final i WPT i Marbella — på hemmaplan, med våra egna på läktaren.",
          badge: "WPT Marbella Master \u00B7 2022",
          image: "/images/story/timeline/wpt-marbella-2022.jpeg",
        },
        {
          year: "December 2022",
          title: "Álex Ruiz och Momo González \u00B7 Topp 5",
          desc: "De når topp 5 i världen. Två spelare utbildade på Ocean Padel, tränade av J3, högst upp på den professionella touren.",
          badge: "Topp 5 i världen \u00B7 December 2022",
          highlight: true,
          image: "/images/story/timeline/momo-alex-jorge.jpeg",
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
      heading2: "Samma",
      heading2Accent: "omdöme.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "Cárdenas",
          last2: "Navas",
          bio: "Spelare, tränare, genomförare. Växer upp på banan och fortsätter träna, men med en naturlig talang för att omvandla idéer till struktur. Organiserar WPT Málaga med nästan 300 par, driver Higuerón tills det blir världens bästa klubb och leder idag hela J3-ekosystemets operativa verksamhet.",
          quote: "Utan genomförande förblir visionen bara ett samtal.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "Cárdenas",
          last2: "Navas",
          bio: "Spelare, tränare, strateg. Alltid med blicken riktad mot det som komma skall. Definierar J3-metodiken från banan, utbildar dussintals juniorer som når toppen och leder spelare till topp 5 i världen. 2022, den högst rankade spanska tränaren. Idag designar han vart J3Padel är på väg.",
          quote: "Att se spelet innan det händer. Det är att träna.",
        },
      ],
    },

    players: {
      label: "Spelare",
      heading1: "Varje spelare",
      heading2: "har sin",
      heading2Accent: "roadmap.",
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
        "Junior → Topp 30",
        "Junior → Topp 30",
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

  /* ── Academy page ── */

  academy: {
    hero: {
      locationLabel: "M\u00E1laga \u00B7 Costa del Sol",
      titleLine1: "Upprepa.",
      titleLine2: "Finjustera.",
      titleLine3a: "OCH",
      titleLine3b: "g\u00E5 fram\u00E5t.",
      ctaLabel: "Utforska program",
      subtitleBefore: "Den b\u00E4sta",
      subtitleAccent: "padelakademin",
      subtitleAfter: "",
      subtitleLocation: "p\u00E5 Costa del Sol",
      subtitleLine2: "Sedan 2004 tr\u00E4nar vi spelare p\u00E5 alla niv\u00E5er.",
      eyebrow: "Rekommenderade tr\u00E4nare",
      heading: "Hitta tr\u00E4nare med omd\u00F6me, metod och ordning.",
      headingPre: "Hitta tr\u00E4nare med ",
      headingAccent: "omd\u00F6me, metod och ordning.",
      headingPost: "",
      sub: "Vi certifierar dem som kan metoden. Vi verifierar dem vi vet till\u00E4mpar den med omd\u00F6me.",
      ctaPrimary: "Hitta en coach n\u00E4ra dig",
      ctaSecondary: "Kom och tr\u00E4na \u00B7 M\u00E1laga",
      filtersTitle: "Filtrera",
      countTemplate: "{count} coacher \u00B7 {numCountries} l\u00E4nder \u00B7 {countries} st\u00E4der",
      sedesNavLabel: "J3-platser",
    },

    band: {
      eyebrow: "V\u00E5rt laboratorium",
      headingLead: "Sedan 2004.",
      headingAccent: "M\u00E1laga, Spanien.",
      description: "Belägen i hjärtat av Costa del Sol, kombinerar akademin topprestanda, en egen metodik och ett tränarteam med erfarenhet från den professionella touren.",
    },

    claim: {
      quote: "Vissa vill att det ska hända, andra önskar att det ska hända, resten ser till att det händer.",
      author: "Michael Jordan",
    },

    banner: {
      headingBefore: "Den ledande padel",
      headingAccent: "akademin",
      headingAfter: "p\u00E5 Costa del Sol.",
      tagline: "Alla \u00E5ldrar \u00B7 Alla niv\u00E5er \u00B7 \u00C5ret runt",
    },

    statement: {
      lines: [
        { before: "Vi formar", accent: "spelare." },
        { before: "Vi utvecklar", accent: "m\u00E4nniskor." },
        { before: "Vi bygger", accent: "karri\u00E4rer." },
      ],
      statYears: "\u00E5r",
      statPlayers: "spelare formade",
      statTitles: "proffstitlar",
    },

    programs: {
      eyebrow: "Program",
      headingPre: "V\u00E4lj efter ",
      headingAccent: "\u00E5lder, niv\u00E5 eller kalender.",
      headingSub: "Juniorer, Vuxna, Intensive Training. En metod, tre kriterier.",
      juniorsLabel: "Juniorer",
      juniorsCards: [
        {
          tag: "Grunder",
          title: "Kinder",
          sub: "4+ \u00E5r",
          ctaLabel: "Beg\u00E4r info",
          waMsg: "Hej, jag vill ha info om Kinder (4-10 \u00E5r)",
        },
        {
          tag: "Utveckling",
          title: "Kids",
          sub: "10+ \u00E5r",
          ctaLabel: "Beg\u00E4r info",
          waMsg: "Hej, jag vill ha info om Kids (10+)",
        },
        {
          tag: "T\u00E4vling",
          title: "Junior",
          sub: "14+ \u00E5r",
          ctaLabel: "Beg\u00E4r info",
          waMsg: "Hej, jag vill ha info om Junior (14+ t\u00E4vling)",
        },
        {
          tag: "H\u00F6gprestation",
          title: "Next Gen",
          sub: "16+ \u00E5r",
          ctaLabel: "Beg\u00E4r info",
          waMsg: "Hej, jag vill ha info om Next Gen (16+ touren)",
        },
      ],
      adultosLabel: "Vuxna",
      adultosCards: [
        {
          tag: "Alla niv\u00E5er",
          title: "Adultos",
          sub: "Nyb\u00F6rjare \u00B7 Medel \u00B7 Avancerad \u00B7 T\u00E4vling",
          ctaLabel: "Anm\u00E4l mig",
          waMsg: "Hej, jag vill ha info om Amateur-programmet",
        },
        {
          tag: "Proffstour",
          title: "Pro",
          sub: "Elittr\u00E4ning",
          ctaLabel: "Beg\u00E4r info",
          waMsg: "Hej, jag vill ha info om Pro-programmet",
        },
      ],
      adultosInfoEyebrow: "Ordinarie skola",
      adultosInfoHeadingPre: "Amat\u00F6r-",
      adultosInfoHeadingAccent: "skolan.",
      adultosInfoTagline: "Mejora con constancia.",
      adultosInfoDesc: "\u00C5rsprogram \u00F6ppet f\u00F6r alla niv\u00E5er. Din takt, din grupp, ditt schema.",
      adultosFeatures: [
        { label: "Niv\u00E5er", desc: "Nyb\u00F6rjare, medel, avancerad och t\u00E4vling" },
        { label: "Format", desc: "Ordinarie skola med \u00E5rsprogram" },
        { label: "Schema", desc: "Morgnar, eftermiddagar, vardag eller helg" },
      ],
      intensiveCards: [
        {
          tag: "Intensivformat",
          title: "Camps \u00B7 Stages",
          sub: "Skr\u00E4ddarsydda program",
          ctaLabel: "Boka",
          waMsg: "Hej, jag vill boka Intensive Training",
        },
      ],
      intensiveLabel: "Intensive Training",
      intensiveEyebrow: "Camps \u00B7 Stages \u00B7 Skr\u00E4ddarsydda program",
      intensiveTitlePre: "Kom och tr\u00E4na",
      intensiveTitleAccent: "med oss.",
      intensiveDesc: "Vi skapar en plan p\u00E5 dina villkor.",
      intensiveImageAlt: "Grupp av spelare p\u00E5 padel-stage",
      intensiveCtaBook: "Boka din tr\u00E4ning",
      intensiveCtaInfo: "Mer information",
      intensiveWaMsgBook: "Hej, jag vill boka Intensive Training",
      intensiveWaMsgInfo: "Hej, jag vill ha info om Intensive Training",
      intensiveInfoEyebrow: "Flexibelt format",
      intensiveInfoHeadingPre: "Din tr\u00E4ning,",
      intensiveInfoHeadingAccent: "p\u00E5 dina villkor.",
      intensiveInfoDesc: "Vi skr\u00E4ddarsyr varje program efter dina behov: frekvens, intensitet, matcher och logistik.",
      intensiveFeatures: [
        { label: "Schema", desc: "Helg, vardag eller skr\u00E4ddarsytt" },
        { label: "Pass", desc: "1 till 3 pass per dag" },
        { label: "Matcher", desc: "Organiserade spel och intern t\u00E4vling" },
        { label: "Boende", desc: "Vi erbjuder dig de b\u00E4sta alternativen" },
      ],
    },

    headquarters: {
      eyebrow: "Anl\u00E4ggningar",
      headingPre: "Vi st\u00E5r f\u00F6r metodiken. ",
      headingAccent: "Du v\u00E4ljer var.",
      sedeCta: "Se anl\u00E4ggning \u2192",
      sedes: [
        {
          tag: "Inomhusbanor \u00B7 M\u00E1laga",
          name: "Finura P\u00E1del",
          detail: "7 inomhusbanor \u00B7 M\u00E1laga",
          features: ["Indoor", "Kafeteria", "Gym", "Pro Shop"],
          badge: "7 banor",
        },
        {
          tag: "Utomhusbanor \u00B7 M\u00E1laga",
          name: "Vals Sport Limoneros",
          detail: "11 banor \u00B7 Snart \u00F6ppet",
          features: ["Outdoor", "Sjukgymnastik", "Fitnesszon", "Pro Shop", "Restaurang", "Pool"],
          badge: "Snart \u00F6ppet \u00B7 11 banor",
        },
      ],
      clubCta: {
        eyebrow: "Din klubb?",
        title: "Din klubb. V\u00E5r metod.",
        description: "Vi licensierar J3-utbildning och metod till partnerklubbar. Var som helst.",
        cta: "Bli J3-partner",
      },
    },

    network: {
      eyebrow: "Anl\u00E4ggningar i M\u00E1laga",
      headingPre: "Outdoor \u00B7 ",
      headingAccent: "Indoor.",
      headingSub: "",
      sedesLabel: "Headquarter",
      sedes: [
        {
          name: "Vals Los Limoneros",
          flag: "Puerto de la Torre \u00B7 M\u00E1laga",
          cta: "Bes\u00F6k basen",
          href: "https://valssportlimoneros.com",
          openingSoon: "Kommande \u00F6ppning \u00B7 1 juni 2026",
          schedule: "\u00D6ppet hela dagen",
        },
        {
          name: "Finura Padel",
          flag: "M\u00E1laga centrum",
          cta: "Bes\u00F6k Finura",
          href: "https://finurapadelgym.com",
          video: "https://finurapadelgym.com/wp-content/uploads/2025/10/home-2.webm",
          schedule: "Till 17:00",
        },
      ],
      mapLabel: "Kartan",
      mapHint: "Coach360-n\u00E4tverket \u00B7 certifierade och rekommenderade v\u00E4rlden \u00F6ver",
      gridLabel: "J3 Recommended",
      gridHeading: "Hitta din coach.",
      statsLine: "{showing} av {total} coacher \u00B7 {countries} l\u00E4nder \u00B7 {languages} spr\u00E5k",
      filterAll: "Todos",
      filterCountry: "País",
      filterLanguage: "Idioma",
      filterSpecialty: "Especialidad",
      filterReset: "Limpiar filtros",
      filterEmpty: "Ning\u00FAn coach con estos filtros. Prueba otros.",
      filterEmptyTitle: "Ingen matchar just nu",
      filterEmptyDesc: "Prova att ta bort ett filter eller fr\u00E5ga J3 \u2014 vi hittar n\u00E5gon.",
      nearMe: "N\u00E4ra mig",
      nearMeLoading: "Hittar position\u2026",
      nearMeActive: "Sorterad efter avst\u00E5nd",
      nearMeError: "Vi kan inte komma \u00E5t din plats. Aktivera beh\u00F6righeten eller skriv din stad.",
      kmFromYou: "{km} km fr\u00E5n dig",
      youAreHere: "Du \u00E4r h\u00E4r",
      specialtyJuniors: "Juniors",
      specialtyAdultos: "Adultos",
      specialtyCompeticion: "Competici\u00F3n",
      specialtyCamps: "Camps",
      badgeFounder: "Founder",
      badgeGenOne: "Gen ONE",
      badgeVerified: "J3 Certifierad",
      badgeHq: "Headquarter",
      distinctionFormaCoaches: "Utbildar andra tr\u00E4nare",
      distinctionJugadoresCircuito: "Spelare p\u00E5 touren",
      distinctionMultilingue: "Flerspr\u00E5kig",
      distinctionDecano: "J3-veteran",
      distinctionKidsIniciacion: "Kids \u00B7 Nyb\u00F6rjare",
      distinctionJuniorsTecnificacion: "Juniors \u00B7 Utveckling",
      distinctionProtocoloFamiliar: "Familjeprotokoll",
      distinctionIniciacionAdulto: "Vuxen nyb\u00F6rjare",
      distinctionReeducacionTecnica: "Teknikomskolning",
      distinctionGruposMixtos: "Blandade grupper",
      distinctionBautismoPadel: "Padelintroduktion",
      distinctionExperienciaFamiliar: "Familjelektioner",
      monthShort: ["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Aug","Sep","Okt","Nov","Dec"],
      memberSince: "Medlem sedan {date}",
      qualifiedSince: "Kvalificerad",
      certifiedSince: "Certifierad",
      askChatbot: "Fr\u00E5ga J3",
      legendTitle: "N\u00E4tverket",
      legendHq: "Headquarter",
      legendCoach: "Coach360 kvalificerad",
      legendCoachVerified: "Coach360 certifierad",
      legendCoachInProgress: "Coach360",
      inProgressBadge: "Under certifieringsprocess",
      inProgressNote: "Tillg\u00E4nglig n\u00E4r J3-certifierad.",
      baseCoachesLine: "+{count} tr\u00E4nare utbildade med Coach360-metoden",
      stageCoach: "Coach",
      stageCoach360: "Coach360",
      stageCualificado: "Kvalificerad",
      stageVerificado: "Certifierad",
      legendCluster: "Grupp",
      legendDistinctionsTitle: "Utm\u00E4rkelser",
      legendDistGroupProfesional: "Karri\u00E4rv\u00E4g",
      legendDistGroupKids: "Kids & juniors",
      legendDistGroupAmateur: "Vuxen amat\u00F6r",
      legendDistGroupVacacional: "Semester \u00B7 grupp",
      viewInMaps: "Visa i Maps",
      viewProfile: "Ver perfil",
      viewAllCta: "Ver los {count} coaches",
      viewFilteredCta: "Ver los {count} resultados completos",
      coachCta: {
        eyebrow: "\u00C4r du tr\u00E4nare?",
        title: "Bygg din v\u00E4g med Coach360.",
        description: "Fr\u00E5n metoden till kvalificering. Fr\u00E5n kvalificering till J3 Certifierad. N\u00E4sta m\u00E5nads N\u00BA 01 kan b\u00E4ra ditt namn.",
        cta: "Starta med Coach360",
        href: "https://j3padel.com/join",
      },
      monthlyRanking: {
        eyebrow: "M\u00E5nadens topp",
        period: "April 2026",
        edition: "N\u00BA 01",
        achievementLabel: "M\u00E5nadens prestation",
        outcomesLabel: "H\u00F6jdpunkter",
        ctaLabel: "Fr\u00E5ga J3",
        top3: [
          {
            coachSlug: "nacho-gonzalez-sevilla",
            achievement: "L\u00E5ste upp utm\u00E4rkelsen Utbildar andra tr\u00E4nare denna m\u00E5nad. Hans session med Marc Torres satte metodisk standard f\u00F6r J3-n\u00E4tverket.",
            outcomes: ["4 bidragna sessioner", "12 tr\u00E4nare utbildade"],
          },
          {
            coachSlug: "giulia-rossi-milano",
            outcomes: ["Topp flerspr\u00E5kig bidragsgivare", "3 elever certifierade"],
          },
          {
            coachSlug: "laura-vega-valencia",
            outcomes: ["Mest sedda t\u00E4vlingssession", "48 h undervisade"],
          },
        ],
      },
    },

    coachesPage: {
      metaTitle: "Coaches J3 \u00B7 Directorio completo",
      metaDescription: "Red global de coaches certificados por J3. Filtra por pa\u00EDs, idioma o especialidad.",
      heading: "Red J3 \u2014 directorio completo",
      statsTemplate: "{coaches} coaches \u00B7 {countries} pa\u00EDses \u00B7 {languages} idiomas",
      emptyTitle: "Ning\u00FAn coach coincide con tus filtros.",
      emptyCta: "Quitar filtros",
      backLink: "\u2190 Volver a Academy",
    },

    sello: {
      eyebrow: "J3-st\u00E4mpeln",
      headingPre: "En verifierbar ",
      headingAccent: "standard",
      lede: "Tre niv\u00E5er. Ett enda krav: varje timme p\u00E5 planen ska ge riktig utveckling tillbaka.",
      tiers: [
        {
          key: "hq",
          badge: "HQ \u00B7 LAB",
          title: "J3 Lab M\u00E1laga",
          summary: "Moderbasen. D\u00E4r metoden f\u00F6ds och coacherna tr\u00E4nas.",
          points: [
            "Vals Sport Limoneros \u00B7 Finura Padel",
            "20+ \u00E5r av spelarutveckling",
            "Levande metodlabb",
          ],
        },
        {
          key: "academy",
          badge: "J3 \u00B7 ACADEMY",
          title: "Nyckelf\u00E4rdig franchise",
          summary: "Klubbar som driver verksamheten med J3:s varum\u00E4rke, metod och st\u00F6d.",
          points: [
            "Komplett metod och material",
            "Coach360-utbildning f\u00F6r hela staben",
            "Juridisk och operativ onboarding",
          ],
        },
        {
          key: "recommended",
          badge: "J3 \u00B7 RECOMMENDED",
          title: "Ackrediterade coacher",
          summary: "Enskilda proffs med aktiv J3-st\u00E4mpel.",
          points: [
            "Fullst\u00E4ndig Coach360-utbildning",
            "Tillg\u00E5ng till J3:s AI och verktyg",
            "\u00C5rlig ompr\u00F6vning av st\u00E4mpeln",
          ],
        },
      ],
      criteriaEyebrow: "Att vara Recommended kr\u00E4ver",
      criteriaHeading: "Fyra d\u00F6rrar att passera \u2014 och h\u00E5lla \u00F6ppna.",
      criteriaItems: [
        { num: "01", title: "Coach360-utbildning", desc: "Klara hela utbildningen som h\u00E5lls av M\u00E1laga-labbet." },
        { num: "02", title: "J3-metoden", desc: "Till\u00E4mpa metoden i klubbens vardag, inte bara p\u00E5 papper." },
        { num: "03", title: "\u00C5rlig ompr\u00F6vning", desc: "F\u00F6rnya st\u00E4mpeln varje s\u00E4song. Att hoppa av kostar vid \u00E5terkomst." },
        { num: "04", title: "Tillg\u00E5ng till J3 AI", desc: "Anv\u00E4nd Coach360-motorn som ett dagligt arbetsverktyg." },
      ],
    },

    franquicias: {
      eyebrow: "J3 Academy \u00B7 F\u00F6r klubbar",
      headingPre: "Ta J3 ",
      headingAccent: "till din klubb",
      lede: "En nyckelf\u00E4rdig franchisemodell f\u00F6r klubbar och entrepren\u00F6rer som vill driva verksamheten med J3:s varum\u00E4rke, metod och st\u00F6d.",
      pillars: [
        { num: "01", title: "Metod", desc: "Hela J3-metoden: \u00E5ldersprogram, niv\u00E5er, spelarbed\u00F6mning och undervisningsmaterial." },
        { num: "02", title: "Utbildning", desc: "Coach360 f\u00F6r hela din personal. Varje coach f\u00E5r sin Recommended-st\u00E4mpel och syns p\u00E5 kartan." },
        { num: "03", title: "Varum\u00E4rke", desc: "Du driver som J3 Academy. Varum\u00E4rkesmanual, visuella riktlinjer och n\u00E4rvaro i det internationella n\u00E4tverket." },
        { num: "04", title: "St\u00F6d", desc: "Operativt st\u00F6d fr\u00E5n M\u00E1laga. Periodiska \u00F6versyner, metoduppdateringar och franchisetagargemenskap." },
      ],
      ctaEyebrow: "\u00C4r du klubb eller investerare?",
      ctaHeading: "L\u00E5t oss prata.",
      ctaSub: "L\u00E4mna dina uppgifter s\u00E5 h\u00F6r en J3-partner av sig med hela dokumentationen.",
      ctaPrimary: "Beg\u00E4r information",
      ctaPrimaryHref: "mailto:partner@j3padel.com?subject=J3%20Academy%20informationsf%C3%B6rfr%C3%A5gan",
      ctaSecondary: "Ladda ner dossier",
      disclaimer: "Modell under utveckling. F\u00F6rsta kullen 2026.",
    },

    method: {
      eyebrow: "J3-metoden",
      headingPre: "S\u00E5 h\u00E4r ",
      headingAccent: "jobbar vi.",
      steps: [
        {
          title: "Individuell diagnos",
          desc: "Varje spelare b\u00F6rjar med en verklig utv\u00E4rdering. Vi vet var de st\u00E5r innan vi s\u00E4ger var de kan n\u00E5.",
        },
        {
          title: "Planering efter m\u00E5l",
          desc: "Inga tv\u00E5 program \u00E4r lika. Tr\u00E4ningen utformas efter varje spelares profil, niv\u00E5 och m\u00E5l.",
        },
        {
          title: "Tr\u00E4nare i v\u00E4rldsklass",
          desc: "Tr\u00E4narteamet kommer fr\u00E5n proffstouren. De har tr\u00E4nat spanska och v\u00E4rldsm\u00E4stare och de k\u00E4nner v\u00E4gen.",
        },
        {
          title: "L\u00F6pande uppf\u00F6ljning",
          desc: "F\u00F6rb\u00E4ttring m\u00E4ts, den gissas inte. St\u00E4ndig uppf\u00F6ljning med verkliga justeringar, inte bakgrundsbrus.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "\u00C5r i branschen" },
        { lbl: "V\u00E4rldens b\u00E4sta klubb 2018" },
        { lbl: "Proffsspelare tr\u00E4nade" },
        { lbl: "Titlar p\u00E5 proffstouren" },
        { lbl: "Amat\u00F6rspelare tr\u00E4nade" },
      ],
    },

    cta: {
      eyebrow: "B\u00F6rja idag",
      titlePre: "Metoden f\u00F6rklaras inte. ",
      titleAccent: "Den tr\u00E4nas.",
      subtitle: "Juniors, vuxna eller Intensive Training \u2014 tre v\u00E4gar, en metod. I M\u00E1laga, sedan 2004.",
      button: "Skriv p\u00E5 WhatsApp",
      note: "Utan f\u00F6rpliktelse \u00B7 Inga formul\u00E4r \u00B7 Direkt svar",
      waMsg: "Hej J3P\u00E1del, jag vill ha information om era program.",
    },

    clubesHandoff: {
      eyebrow: "Har du en klubb?",
      body: "Plug & play. P\u00E5 3 m\u00E5nader lyfts din klubb och akademi till n\u00E4sta niv\u00E5.",
      cta: "Uppt\u00E4ck",
    },
  },

  /* ── Experience page ── */

  experience: {
    hero: {
      eyebrow: "J3Experience \u00B7 P\u00E5 banan \u00B7 Internationellt",
      titleLines: ["DU", "V\u00C4LJER", "ATT LEVA DET."],
      subtitleTags: ["Camps", "Stages", "Upplevelser"],
      subtitleBefore: "",
      subtitleAccent: "skr\u00E4ddarsydda",
      subtitleAfter: "var som helst i v\u00E4rlden",
    },

    statement: {
      eyebrow: "Upplevelsen",
      lines: [
        { before: "Njut av", accent: "en" },
        { before: "unik upplevelse" },
        { before: "med", accent: "oss." },
      ],
    },

    flowCamp: {
      eyebrow: "Worldwide \u00B7 Kids \u00B7 Juniors \u00B7 Players",
      headingFlow: "Flow",
      headingCamp: "Camp",
      introBefore: "Vi letar platser, samlar folk och delar det vi kan. ",
      introAccent: "P\u00E5 banan och utanf\u00F6r den.",
      jovenesLabel: "Flow Camp \u00B7 Unga",
      jovenesTitleAccent: "Flow Camp.",
      jovenesTitleRest: " Padel, v\u00E4rderingar och mentalitet. F\u00F6r unga som ser sporten som n\u00E5got mer.",
      jovenesCards: [
        {
          label: "Eventet",
          title: "J3 i din stad",
          desc: "Vi hittar platsen, samlar unga spelare och genomf\u00F6r det. Ett intensivt event i en eller flera dagar med J3-teamet p\u00E5 banan.",
        },
        {
          label: "Metoden",
          title: "Teknik \u00B7 Taktik \u00B7 Mentalitet",
          desc: "Det handlar inte bara om att sl\u00E5 b\u00E4ttre. Flow Camp arbetar med de tre pelarna i J3-systemet \u2014 f\u00F6r padel p\u00E5 h\u00F6g niv\u00E5 b\u00F6rjar i huvudet.",
        },
        {
          label: "Tr\u00E4narna",
          title: "Expressutbildning ing\u00E5r",
          desc: "Lokala tr\u00E4nare deltar tillsammans med J3 p\u00E5 banan. De tar med sig metoden, visionen och en \u00E4kta utbildning. Alla vinner.",
        },
      ],
      adultosLabel: "Players Camp \u00B7 Vuxna",
      adultosTitleAccent: "Players Camp.",
      adultosTitleMid: " Din stad, v\u00E5r ",
      adultosTitleSerif: "upplevelse.",
      adultosCards: [
        {
          label: "Vem",
          title: "F\u00F6r dem som spelar p\u00E5 riktigt",
          desc: "Kompisg\u00E4ng, amat\u00F6rlag som t\u00E4vlar eller alla som vill uppleva ett camp utan att beh\u00F6va resa till M\u00E1laga.",
        },
        {
          label: "Vad",
          title: "Intensivt i din stad",
          desc: "Tr\u00E4ningspass p\u00E5 banan med J3-teamet. Teknik, taktik, analyserade matcher. P\u00E5 er anl\u00E4ggning eller en vi hittar tillsammans.",
        },
        {
          label: "Plus",
          title: "Utan att l\u00E4mna hemmet",
          desc: "J3-upplevelsen utan att resa. Perfekt om gruppen \u00E4r stor, niv\u00E5erna varierar eller du helt enkelt f\u00F6redrar hemmaplan.",
        },
      ],
      ctaText: "Ber\u00E4tta din stad och vilka ni \u00E4r. Resten tar vi hand om.",
      ctaButton: "Beg\u00E4r Flow Camp",
      waMsg: "Hej, jag vill ha information om Flow Camp",
    },

    empresas: {
      eyebrow: "Vi kopplar ihop team \u00B7 Vi aktiverar varum\u00E4rken",
      heading: "F\u00F6retag",
      introBefore: "Padel som ",
      introAccent: "verktyg.",
      introAfter: " F\u00F6r att n\u00E5 din community eller aktivera ditt team \u2014 vi designar upplevelsen fr\u00E5n b\u00F6rjan till slut.",
      leftPara1: "Vi jobbar med varum\u00E4rken och f\u00F6retag som f\u00F6rst\u00E5r att padel \u00E4r mycket mer \u00E4n en sport. Det \u00E4r en m\u00F6tesplats, en aktivering, ett \u00F6gonblick som f\u00F6renar.",
      leftPara2: "I er lokal eller i v\u00E5r. I M\u00E1laga eller d\u00E4r ni beh\u00F6ver oss.",
      ctaButton: "Prata med teamet",
      waMsg: "Hej, jag vill ha information om J3Experience f\u00F6r f\u00F6retag",
      formatos: [
        {
          tag: "Format 01",
          name: "Meet & Greet",
          desc: "Koppla ditt varum\u00E4rke till padel-communityn. J3 arrangerar eventet, samlar spelarna och skapar \u00F6gonblicket.",
        },
        {
          tag: "Format 02",
          name: "Varum\u00E4rkesaktivering",
          desc: "Varum\u00E4rkesn\u00E4rvaro i en \u00E4kta sportmilj\u00F6. Med riktiga spelare, inte statister.",
        },
        {
          tag: "Format 03",
          name: "Team Building",
          desc: "Ditt team p\u00E5 banan. Konkurrensdynamik, lagarbete och en upplevelse som g\u00E5r l\u00E5ngt bortom vanlig f\u00F6retagspadel.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "\u00C5r i\nbranschen" },
        { lbl: "V\u00E4rldens b\u00E4sta\nklubb 2018" },
        { lbl: "Segrar p\u00E5\nproffstouren" },
        { lbl: "Officiell v\u00E4rd\nM\u00E1laga 2014" },
      ],
    },

    cta: {
      titleLine1: "N\u00E4r",
      titleLine2: "\u00E4r din",
      titleAccent: "Experience",
      titleEnd: "?",
      body: "Skriv till oss p\u00E5 WhatsApp. Ber\u00E4tta vad du s\u00F6ker s\u00E5 designar vi det tillsammans.",
      button: "Beg\u00E4r nu",
      note: "Svar inom 24h \u00B7 Utan f\u00F6rpliktelse",
      waMsg: "Hej, jag vill ha information om J3Experience",
    },
  },
} as const satisfies Dictionary;
