import type { Dictionary } from "./types";

export const en = {
  /* ── Shared components ── */

  nav: {
    soluciones: "Premium",
    acceder: "Sign in",
    inicio: "Home",
  },

  footer: {
    copyright: "\u00A9 2026 J3P\u00E1del",
  },

  sponsors: {
    items: [
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52, href: "https://www.tecnifibre.com" },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52, href: "https://www.lacoste.com" },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56, href: "http://www.alquilavisual.com" },
    ],
  },

  chat: {
    tooltip: "Let's talk",
  },

  /* ── Home page ── */

  hero: {
    play: "Play.",
    coach: "Coach.",
    manage: "Manage.",
    milestones: [
      { year: "2004", text: "The journey begins" },
      { year: "2014", text: "World Padel Tour host" },
      { year: "2018", text: "Best club in the world" },
      { year: "2022", text: "Top-ranked Spanish coach on the pro circuit" },
      { year: "2024", text: "J3's 10th anniversary" },
      { year: "11\u00D7", text: "Champion on the pro circuit" },
    ],
    tagline: "Youth academy \u2014 champions of Spain and the World",
    cta1: "View products",
    cta2: "Coach360",
    accentTouch: {
      topLine: "The world dropped the accent.",
      accentWord: "We",
      afterAccent: "never let it go.",
      labelLeft: "P\u00C1DEL \u00B7 WITH \u00B7 ACCENT",
      labelRight: "SINCE 2004 \u2014 M\u00C1LAGA",
    },
  },

  impact: {
    line1: "The #1",
    line2: "padel academy",
    line3: "on the Costa del Sol.",
    tagline: "Since 2004 \u00B7 M\u00E1laga, Spain",
  },

  system: {
    blocks: [
      { line1: "The game", line2: "has changed." },
      { line1: "The coach", line2: "has evolved." },
      { line1: "The management", line2: "optimized." },
    ],
    nodes: ["Coach360", "J3PTV", "Academy", "Business", "Experience", "Partner"],
  },

  home: {
    line1: "A complete environment for demanding enthusiasts, players and coaches.",
    line2: "An end-to-end management system for padel academies and clubs.",
    closer: "Optimize. Automate. Scale.",
  },

  products: {
    cards: [
      {
        tag: "Online \u00B7 Training",
        forLabel: "Padel coaches",
        description: "Insight, method and community. New content every week.",
        buttons: ["Enter Coach360"],
      },
      {
        tag: "Online \u00B7 Content \u00B7 Entertainment",
        forLabel: "All profiles",
        description: "Analysis, debate and the modern game \u2014 no noise.",
        buttons: ["Learn more", "Sign in"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Junior",
        description: "The same system used on the pro circuit, adapted to you.",
        buttons: ["Train with us"],
      },
      {
        tag: "Automation \u00B7 Management \u00B7 Optimization",
        forLabel: "Academies and clubs",
        description: "Boost performance with our know-how and 1:1 support.",
        buttons: ["Learn more", "Book a call"],
      },
      {
        tag: "Service \u00B7 On-site",
        forLabel: "Clubs, academies and groups",
        buttons: ["Request"],
      },
      {
        tag: "Expansion \u00B7 Turnkey",
        forLabel: "Clubs and academies",
        buttons: ["Learn more"],
      },
    ],
  },

  nosotros: {
    label: "About us",
    heading1: "Over 20 years",
    heading2: "in padel.",
    body: "We started when padel was a different sport. We have trained players who now compete on the professional circuit, managed the best club in the world and coached WPT professionals. That is what stands behind us.",
    link: "Discover our journey",
    statsLabel: "By the numbers",
    stats: [
      { val: "#1", line1: "Best club /", line2: "in the world 2018" },
      { val: "20+", line1: "Years /", line2: "in the industry" },
      { val: "WPT", line1: "Official host /", line2: "since 2014" },
      { val: "18", line1: "Titles /", line2: "on the pro circuit" },
      { val: "100+", line1: "Coaches /", line2: "trained \u00B7 J3 method" },
      { val: "Top 5", line1: "World /", line2: "ranking 2022" },
    ],
  },

  contacto: {
    label: "Contact",
    heading1: "Tell us",
    heading2: "what you're looking for.",
    body: "If you have made it this far, something resonated. Tell us where you are and what you are looking for.",
    email: "Email",
    telefono: "Phone",
    sede: "Headquarters",
    placeholders: {
      nombre: "Name",
      email: "Email",
      mensaje: "Message",
    },
    soyOptions: [
      "I am...",
      "Coach / Trainer",
      "Amateur player",
      "Padel enthusiast",
      "Academy / club director",
      "Interested in franchise",
      "Other",
    ],
    interesOptions: [
      "I'm interested in...",
      "Coach360 \u00B7 Training",
      "J3PTV \u00B7 Content",
      "Academy \u00B7 Train in M\u00E1laga",
      "Franchise \u00B7 Turnkey system",
      "J3 Experience \u00B7 Come to my club",
      "Something else",
    ],
    submit: "Send",
    sending: "Sending...",
    sent: "\u2713 Sent",
    error: "Please fill in your name, email and message.",
  },

  /* ── Story page ── */

  story: {
    hero: {
      prefix: "Over",
      years: "20 years",
      dentro: "in",
      delJuego: "the game.",
      sub1: "One of the most",
      sub2: "influential",
      sub3: "teams in the world of padel.",
      desde: "Since 2004",
      location: "M\u00E1laga, Spain",
    },

    impact: {
      line1: "We aim for the sky, but",
      line2: "always with our feet on the ground.",
      fact1: "We have coached players ranked in the top 8 of the professional circuit.",
      fact2: "Ten years leading one of the best clubs in the world.",
      closer: "And we are still on court.",
      proudLabel: "What we are most proud of",
      cantera: [
        "We trained dozens of young players.",
        "Some lifted national and world titles.",
        "Others achieved their goal of competing on the professional circuit.",
        "And many fulfilled the dream of studying at the university they wanted.",
      ],
      historyLabel: "Our history",
    },

    bridge: {
      line1: "We play. We coach. We manage.",
      line2: "Our home is the 20\u00D710.",
    },

    accent: {
      eyebrow: "Our signature",
      slogan: ["P\u00E1del.", "With.", "Accent."],
      manifesto: [
        "When the sport left Spain, it lost the tilde.",
        "We never let it go.",
        "Because the accent isn\u2019t spelling \u2014 it\u2019s origin.",
      ],
    },

    stats: {
      header: "Our history in numbers",
      items: [
        { val: 20, suffix: "+", lbl: "Years of\nexperience" },
        { prefix: "#", val: 1, lbl: "Best club\nin the world 2018" },
        { val: 100, suffix: "+", lbl: "Coaches trained\non Coach360" },
        { val: 2000, suffix: "+", lbl: "Amateur players\ntrained" },
        { val: 30, suffix: "+", lbl: "Professional players\ntrained" },
        { label: "N.\u00BA1", val: 0, lbl: "Top Spanish coach\nWPT ranking 2022" },
        { val: 11, lbl: "Professional titles\nin 18 finals played" },
        { label: "WPT", val: 0, lbl: "Official host\nM\u00E1laga 2014" },
      ],
    },

    timeline: {
      sectionLabel: "Journey",
      heading1: "Milestones that",
      heading2: "define us",
      eras: ["The early days", "Ocean Padel \u00B7 J3Padel", "Reserva del Higuer\u00F3n", "Game changer"],
      entries: [
        {
          year: "Early 2000s",
          title: "Padel finds us",
          desc: "We discovered padel as amateurs. What started as a sport quickly became an obsession. Years competing across Andalusia, regulars on the M\u00E1laga squad and representing the University of M\u00E1laga (UMA).",
        },
        {
          year: "2005-2008",
          title: "The first lessons",
          desc: "While still competing, we began coaching on the side. La Capellan\u00EDa and Club de Tenis M\u00E1laga were the first venues where we started teaching what the game had taught us.",
        },
        {
          year: "2009-2010",
          title: "Smash Padel \u2192 Ocean Padel",
          desc: "The three of us \u2014 Javi, Jorge and Jordi Mu\u00F1oz \u2014 joined forces for the first time to build a youth academy at Smash Padel. Shortly after, it became Ocean Padel, and the real scaling began.",
          highlight: true,
          image: "/images/story/timeline/ocean-padel.jpg",
        },
        {
          year: "2010-2014",
          title: "The best youth academy in Spain",
          desc: "Ocean Padel became a national benchmark. This is where \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado, Bea Gonz\u00E1lez and the entire first generation were trained. Several reached the Spanish national team and competed internationally.",
          badge: "Champions of Andalusia \u00B7 Spain \u00B7 World (youth)",
        },
        {
          year: "2014",
          title: "J3Padel is born",
          desc: "When Ocean Padel closed, the team split but the J3 brand was born as its own entity. We organized the WPT in M\u00E1laga with nearly 300 registered pairs.",
          badge: "World Padel Tour \u00B7 Official host M\u00E1laga 2014",
          image: "/images/story/timeline/j3padel-fundadores.jpeg",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "In the same facilities as Ocean Padel, we opened our own club. A project that did not succeed, but left a clear lesson about management.",
        },
        {
          year: "2016",
          title: "Higuer\u00F3n Resort",
          desc: "We joined Reserva del Higuer\u00F3n \u2014 now Higuer\u00F3n Resort. The longest and most demanding chapter of the project begins.",
          image: "/images/story/timeline/higueron-resort.jpg",
        },
        {
          year: "Late 2016",
          title: "Jordi Mu\u00F1oz leaves the project",
          desc: "Jordi leaves M\u00E1laga and the J3 project for personal reasons. His essence remains present. Javi and Jorge continue with the project, although without the J that opened the way for them.",
          image: "/images/story/timeline/tres-j.jpeg",
          imagePosition: "center 25%",
        },
        {
          year: "2018",
          title: "Best Padel Club in the World",
          desc: "Higuer\u00F3n Resort, under our management, was recognized as the best padel club in the world. A title that came after two years of quiet, ambitious work.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
          image: "/images/story/timeline/mejor-club-2018.jpeg",
        },
        {
          year: "2016-2022",
          title: "Competition school \u00B7 Internationalization",
          desc: "For six years, the focus was on the youth academy and internationalization. What we had already done at Ocean Padel, we replicated again. We also turned the Costa del Sol into an international destination for amateur players.",
        },
        {
          year: "2021",
          title: "\u00C1lex Ruiz and Franco Stupaczuk",
          desc: "We returned to high performance. The result was historic: we finished the year ranked in the world's top 4 on the WPT.",
          badge: "World Top 4 WPT \u00B7 2021",
          highlight: true,
          image: "/images/story/timeline/franco-alex-pozzoni-jorge.jpeg",
          imagePosition: "center 55%",
        },
        {
          year: "2022",
          title: "WPT Marbella Final",
          desc: "A 100% M\u00E1laga-born pair, trained at Ocean Padel / J3. WPT final in Marbella \u2014 at home, with our people in the stands.",
          badge: "WPT Marbella Master \u00B7 2022",
          image: "/images/story/timeline/wpt-marbella-2022.jpeg",
        },
        {
          year: "December 2022",
          title: "\u00C1lex Ruiz and Momo Gonz\u00E1lez \u00B7 Top 5",
          desc: "They reach the world top 5. Two players developed at Ocean Padel, coached by J3, at the very top of the professional circuit.",
          badge: "World Top 5 \u00B7 December 2022",
          highlight: true,
          image: "/images/story/timeline/momo-alex-jorge.jpeg",
        },
        {
          year: "2023-2024",
          title: "Varlion",
          desc: "Javi joined Varlion as head of expansion for the brand. A period of strategic learning off the court.",
        },
        {
          year: "2024",
          title: "End of a chapter",
          desc: "We parted ways with Higuer\u00F3n Resort and Varlion. Nearly a decade managing what was the best club in the world. That chapter closes.",
        },
        {
          year: "2024-2025",
          title: "From M\u00E1laga to the world",
          desc: "Fully dedicated to building J3Padel as an ecosystem: training, management, content and high performance.",
        },
        {
          year: "Mid 2025",
          title: "Coach360 is born",
          desc: "Online training for padel coaches. After travelling the world and seeing the gap the expansion of padel had created in coaching education, we decided to contribute all our knowledge in a unique way. We created the first coaching community.",
          badge: "Coach360 \u00B7 100+ coaches \u00B7 40+ lessons",
        },
        {
          year: "2026",
          title: "New headquarters \u00B7 M\u00E1laga city",
          desc: "J3Padel has a physical home again \u2014 Finura Padel and Vals Los Limoneros. The full ecosystem: Coach360, J3PTV, Academy, Business and Experience.",
          badge: "Finura Padel \u00B7 Vals Los Limoneros \u00B7 Summer 2026",
        },
      ],
    },

    team: {
      label: "The DNA",
      heading1: "Two people.",
      heading2: "One shared",
      heading2Accent: "vision.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Player, coach, executor. He grew up on the court and still coaches, but with a natural gift for turning ideas into structure. He organized the WPT M\u00E1laga with nearly 300 pairs, managed Higuer\u00F3n until it became the best club in the world and today leads the operations of the entire J3 ecosystem.",
          quote: "Without execution, vision is just conversation.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Player, coach, strategist. Always focused on what comes next. He defined the J3 methodology from the court, trained dozens of young players who reached the top and coached players to the world top 5. In 2022, the highest-ranked Spanish coach. Today he designs where J3Padel is headed.",
          quote: "Seeing the game before it happens. That is coaching.",
        },
      ],
    },

    players: {
      label: "Players",
      heading1: "Every player",
      heading2: "has their",
      heading2Accent: "roadmap.",
      description: "Two types of relationship. Those we developed from the ground up \u2014 now on the professional circuit. And those who trusted J3 for high-performance preparation.",
      heroLabel: "Developed from the ground up \u00B7 The highest level of the circuit",
      nextGenLabel: "From the youth academy to the professional circuit",
      nextGenProLabel: "Arrived as prospects \u00B7 Established on the circuit",
      featuredLabel: "Notable professional collaborations",
      sharedLabel: "We\u2019ve also shared the court with",
      heroPlayers: [
        { info: "Trained from a young age at Ocean Padel. Reached world #4.", tag: "World Top 4" },
        { info: "Ocean Padel / J3 youth academy. 100% from M\u00E1laga. World top 5.", tag: "World Top 5" },
        { info: "World top 8 on the PPT. Co-founder of J3Padel.", tag: "J3 Co-founder \u00B7 PPT Top 8" },
      ],
      nextGenTags: [
        "Champion of Spain and the World",
        "Champion of Spain and the World",
        "Champion of Spain \u00B7 Pro Circuit",
        "Champion of Spain \u00B7 Pro Circuit",
        "Champion of Spain and the World Junior",
      ],
      nextGenProTags: [
        "Junior \u2192 Top 30",
        "Junior \u2192 Top 30",
      ],
      featuredPlayers: [
        { info: "5 finals and world #4 pair in 2021.", tag: "3 Titles \u00B7 #4 World 2021" },
        { info: "P2 Premier Padel semi-finals in Milan 2022.", tag: "SF P2 Milan 2022" },
        { info: "P2 Premier Padel semi-finals in Milan 2022.", tag: "SF P2 Milan 2022" },
        { info: "FIP Platinum title in Mexico City.", tag: "FIP Platinum Title CDMX" },
      ],
      sharedTags: [
        "World Top",
        "World Top",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
        "Pro Circuit",
      ],
    },

    philosophy: {
      label: "Philosophy",
      word1: "Insight.",
      word2: "Method.",
      word3: "System.",
      body: "We do not coach with random drills. We do not manage on gut feeling. Everything we do at J3Padel is driven by a system built over 20 years.",
      pillars: [
        {
          num: "01",
          label: "Insight",
          title: "Knowing why, not just what",
          body: "A coach with insight does not run drills \u2014 they make decisions.",
        },
        {
          num: "02",
          label: "Method",
          title: "Repeatability and progression",
          body: "The J3 method is designed to produce systematic improvement. Without method, talent does not scale.",
        },
        {
          num: "03",
          label: "System",
          title: "A structure that runs on its own",
          body: "A good system works when you are not there. We built it for clubs, academies and coaches.",
        },
        {
          num: "04",
          label: "Court",
          title: "Everything starts from real play",
          body: "Every concept in the J3 system has been tested on court \u2014 with real players, in real competition.",
        },
      ],
    },

    clubs: {
      label: "Club management",
      heading1: "Clubs where we",
      heading2: "have left our mark.",
      description: "Technical direction, operational management and youth development.",
      originLabel: "Where it all started",
      presentLabel: "Currently",
      lessonAside: "A project that did not succeed, but left a clear lesson.",
      origins: [
        {
          flag: "M\u00E1laga \u00B7 2009\u20132014",
          name: "Ocean Padel",
          detail: "Where everything started at real scale. The best youth academy in Spain. This is where \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado and the entire first J3 generation were trained.",
          highlight: "Best youth academy",
        },
        {
          flag: "M\u00E1laga \u00B7 2014",
          name: "Belife",
          detail: "Official World Padel Tour host venue. Nearly 300 registered pairs.",
          highlight: "WPT \u00B7 Official host 2014",
        },
      ],
      heroClub: {
        flag: "Marbella \u00B7 2016\u20132024",
        name: "Reserva del Higuer\u00F3n",
        detail: "Nearly a decade managing the club recognized as the best in the world. Full technical direction, elite youth academy and large-scale operations.",
        highlight: "Best Padel Club in the World \u00B7 2018",
        years: "9",
      },
      lesson: {
        flag: "M\u00E1laga \u00B7 2015",
        name: "J3Padel Indoor",
      },
      present: [
        {
          flag: "M\u00E1laga city \u00B7 2026",
          name: "Finura Padel",
          detail: "First headquarters of the new chapter in M\u00E1laga city.",
          highlight: "Current HQ \u00B7 Operational",
        },
        {
          flag: "Puerto de la Torre \u00B7 2026",
          name: "Vals Los Limoneros",
          detail: "New facility. Newly opening club.",
          highlight: "Opening soon \u00B7 Summer 2026",
        },
      ],
    },

    brands: {
      currentLabel: "Brands that trust J3Padel",
      pastLabel: "Have trusted J3Padel",
    },

    cta: {
      label: "20 years later",
      heading1: "Up to here,",
      heading2: "it's all history.",
      body: "What comes next is written with those who choose to be part of it. Whether you are a coach, run a club or simply want to train with us \u2014 now is the time.",
      buttons: ["Talk to us", "Coach360", "Academy", "Business"],
    },
  },

  /* ── Academy page ── */

  academy: {
    hero: {
      locationLabel: "M\u00E1laga \u00B7 Costa del Sol",
      titleLine1: "Repeat.",
      titleLine2: "Refine.",
      titleLine3a: "",
      titleLine3b: "Advance.",
      ctaLabel: "Explore programs",
      subtitleBefore: "The best p\u00E1del",
      subtitleAccent: "academy",
      subtitleAfter: "",
      subtitleLocation: "on the Costa del Sol",
      subtitleLine2: "Training players of all levels since 2004.",
      eyebrow: "Recommended coaches",
      heading: "Find coaches with judgement, method and rigour.",
      headingPre: "Find coaches with ",
      headingAccent: "judgement, method and rigour.",
      headingPost: "",
      sub: "Coaches we personally validate. Find yours nearby.",
      ctaPrimary: "Find a coach nearby",
      ctaSecondary: "Come train \u00B7 M\u00E1laga",
      filtersTitle: "Filter",
      countTemplate: "{count} coaches \u00B7 {numCountries} countries \u00B7 {countries} cities",
      sedesNavLabel: "J3 Venues",
    },

    band: {
      eyebrow: "Our laboratory",
      headingLead: "Since 2004.",
      headingAccent: "M\u00E1laga, Spain.",
      description: "Located in the heart of the Costa del Sol, it combines high performance, a proprietary methodology, and a coaching team with professional-circuit experience.",
    },

    claim: {
      quote: "Some people want it to happen, some wish it would happen, others make it happen.",
      author: "Michael Jordan",
    },

    banner: {
      headingBefore: "The leading p\u00E1del ",
      headingAccent: "academy",
      headingAfter: "on the Costa del Sol.",
      tagline: "All ages \u00B7 All levels \u00B7 All year round",
    },

    statement: {
      lines: [
        { before: "We build", accent: "players." },
        { before: "We shape", accent: "people." },
        { before: "We create", accent: "careers." },
      ],
      statYears: "years",
      statPlayers: "players trained",
      statTitles: "professional titles",
    },

    programs: {
      eyebrow: "Programs",
      headingPre: "Pick by ",
      headingAccent: "age, level or calendar.",
      headingSub: "Juniors, Adults, Intensive Training. One method, three criteria.",
      juniorsLabel: "Juniors",
      juniorsCards: [
        {
          tag: "Fundamentals",
          title: "Kinder",
          sub: "4+ years",
          ctaLabel: "Request info",
          waMsg: "Hi, I\u2019d like info about Kinder (4-10 years)",
        },
        {
          tag: "Skills development",
          title: "Kids",
          sub: "10+ years",
          ctaLabel: "Request info",
          waMsg: "Hi, I\u2019d like info about Kids (10+)",
        },
        {
          tag: "Competition",
          title: "Junior",
          sub: "14+ years",
          ctaLabel: "Request info",
          waMsg: "Hi, I\u2019d like info about Junior (14+ competition)",
        },
        {
          tag: "High performance",
          title: "Next Gen",
          sub: "16+ years",
          ctaLabel: "Request info",
          waMsg: "Hi, I\u2019d like info about Next Gen (16+ pro tour)",
        },
      ],
      adultosLabel: "Adults",
      adultosCards: [
        {
          tag: "All levels",
          title: "Adultos",
          sub: "Beginner \u00B7 Intermediate \u00B7 Advanced \u00B7 Competition",
          ctaLabel: "Sign me up",
          waMsg: "Hi, I\u2019d like info about the Amateur program",
        },
        {
          tag: "Professional tour",
          title: "Pro",
          sub: "Elite training",
          ctaLabel: "Request info",
          waMsg: "Hi, I\u2019d like info about the Pro program",
        },
      ],
      adultosInfoEyebrow: "Regular school",
      adultosInfoHeadingPre: "The amateur",
      adultosInfoHeadingAccent: "school.",
      adultosInfoTagline: "Mejora con constancia.",
      adultosInfoDesc: "Year-round program open to all levels. Your pace, your group, your schedule.",
      adultosFeatures: [
        { label: "Levels", desc: "Beginner, intermediate, advanced and competition" },
        { label: "Format", desc: "Regular school, year-long program" },
        { label: "Schedule", desc: "Mornings, afternoons, weekdays or weekends" },
      ],
      intensiveCards: [
        {
          tag: "Intensive format",
          title: "Camps \u00B7 Stages",
          sub: "Custom programs",
          ctaLabel: "Book",
          waMsg: "Hi, I\u2019d like to book Intensive Training",
        },
      ],
      intensiveLabel: "Intensive Training",
      intensiveEyebrow: "Camps \u00B7 Stages \u00B7 Custom programs",
      intensiveTitlePre: "Come train",
      intensiveTitleAccent: "with us.",
      intensiveDesc: "We design a plan tailored to you.",
      intensiveImageAlt: "Group of players at a p\u00E1del training camp",
      intensiveCtaBook: "Book your training",
      intensiveCtaInfo: "More information",
      intensiveWaMsgBook: "Hi, I\u2019d like to book Intensive Training",
      intensiveWaMsgInfo: "Hi, I\u2019d like info about Intensive Training",
      intensiveInfoEyebrow: "Flexible format",
      intensiveInfoHeadingPre: "Your training,",
      intensiveInfoHeadingAccent: "your way.",
      intensiveInfoDesc: "We design every program to fit what you need: frequency, intensity, matches and logistics.",
      intensiveFeatures: [
        { label: "Schedule", desc: "Weekend, weekday or custom" },
        { label: "Sessions", desc: "1 to 3 sessions per day" },
        { label: "Matches", desc: "Organized games and internal competition" },
        { label: "Accommodation", desc: "We offer you the best options" },
      ],
    },

    headquarters: {
      eyebrow: "Venues",
      headingPre: "We bring the methodology. ",
      headingAccent: "You pick where.",
      sedeCta: "View venue \u2192",
      sedes: [
        {
          tag: "Indoor Courts \u00B7 M\u00E1laga",
          name: "Finura P\u00E1del",
          detail: "7 indoor courts \u00B7 M\u00E1laga",
          features: ["Indoor", "Cafeteria", "Gym", "Pro Shop"],
          badge: "7 courts",
        },
        {
          tag: "Outdoor Courts \u00B7 M\u00E1laga",
          name: "Vals Sport Limoneros",
          detail: "11 courts \u00B7 Opening soon",
          features: ["Outdoor", "Physiotherapy", "Fitness Zone", "Pro Shop", "Restaurant", "Pool"],
          badge: "Opening soon \u00B7 11 courts",
        },
      ],
      clubCta: {
        eyebrow: "Your club?",
        title: "Your club. Our method.",
        description: "We license J3 training and methodology to partner clubs. Anywhere.",
        cta: "Become a J3 partner",
      },
    },

    network: {
      eyebrow: "Red J3",
      headingPre: "Un m\u00E9todo, ",
      headingAccent: "muchas pistas.",
      headingSub: "Desde nuestra sede en M\u00E1laga a una red de coaches recomendados por J3. El mismo est\u00E1ndar, est\u00E9s donde est\u00E9s.",
      hqLabel: "Headquarters",
      hqTitle: "M\u00E1laga \u2014 donde nace el m\u00E9todo",
      hqSubtitle: "Nuestra sede principal. Cantera, pruebas, referencia.",
      hqCta: "Conoce la HQ",
      mapLabel: "El mapa",
      mapHint: "Explora coaches J3 Recommended por el mundo",
      gridLabel: "Coaches recomendados",
      gridHeading: "J3 Recommended.",
      filterAll: "Todos",
      filterCountry: "País",
      filterLanguage: "Idioma",
      filterSpecialty: "Especialidad",
      filterReset: "Limpiar filtros",
      filterEmpty: "Ning\u00FAn coach con estos filtros. Prueba otros.",
      filterEmptyTitle: "No one matches right now",
      filterEmptyDesc: "Try removing a filter or ask J3 \u2014 we'll find someone for you.",
      nearMe: "Near me",
      nearMeLoading: "Locating\u2026",
      nearMeActive: "Sorted by distance",
      nearMeError: "We can't access your location. Enable the permission or type your city.",
      kmFromYou: "{km} km from you",
      youAreHere: "You are here",
      specialtyJuniors: "Juniors",
      specialtyAdultos: "Adultos",
      specialtyCompeticion: "Competici\u00F3n",
      specialtyCamps: "Camps",
      badgeRecommended: "J3 Recommended",
      badgeHq: "Headquarter",
      askChatbot: "Pregunta a J3",
      legendTitle: "The network",
      legendHq: "Headquarter",
      legendRecommended: "Recommended",
      legendCluster: "Cluster",
      viewInMaps: "View in Maps",
      viewProfile: "Ver perfil",
      viewAllCta: "Ver los {count} coaches",
      viewFilteredCta: "Ver los {count} resultados completos",
      coachCta: {
        eyebrow: "\u00BFEres coach?",
        title: "Sube al sello J3.",
        description: "Entra en Coach360, entrena con nuestro m\u00E9todo y opta a ser recomendado en esta red.",
        cta: "Entrar a Coach360",
        href: "https://j3padel.com/join",
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
      eyebrow: "The J3 Seal",
      headingPre: "A verifiable ",
      headingAccent: "standard",
      lede: "Three tiers. One demand: every hour on court must return real progress.",
      tiers: [
        {
          key: "hq",
          badge: "HQ \u00B7 LAB",
          title: "J3 Lab M\u00E1laga",
          summary: "The mother base. Where the method is born and coaches are trained.",
          points: [
            "Vals Sport Limoneros \u00B7 Finura Padel",
            "20+ years developing players",
            "Living methodology lab",
          ],
        },
        {
          key: "academy",
          badge: "J3 \u00B7 ACADEMY",
          title: "Turnkey franchise",
          summary: "Clubs operating with J3\u2019s brand, method and support.",
          points: [
            "Full methodology and materials",
            "Coach360 training for the entire staff",
            "Legal and operational onboarding",
          ],
        },
        {
          key: "recommended",
          badge: "J3 \u00B7 RECOMMENDED",
          title: "Accredited coaches",
          summary: "Individual professionals with an active J3 seal.",
          points: [
            "Complete Coach360 training",
            "Access to J3 AI and tools",
            "Annual seal review",
          ],
        },
      ],
      criteriaEyebrow: "Being Recommended requires",
      criteriaHeading: "Four doors to cross \u2014 and keep open.",
      criteriaItems: [
        { num: "01", title: "Coach360 training", desc: "Complete the full training program run by the M\u00E1laga Lab." },
        { num: "02", title: "J3 methodology", desc: "Apply the method in the club\u2019s daily life, not just on paper." },
        { num: "03", title: "Annual review", desc: "Renew the seal every season. Leaving costs your position on return." },
        { num: "04", title: "Access to J3 AI", desc: "Use the Coach360 engine as a daily working tool." },
      ],
    },

    franquicias: {
      eyebrow: "J3 Academy \u00B7 For clubs",
      headingPre: "Bring J3 ",
      headingAccent: "to your club",
      lede: "A turnkey franchise model for clubs and entrepreneurs who want to operate with J3\u2019s brand, method and support.",
      pillars: [
        { num: "01", title: "Methodology", desc: "The full J3 method: age programs, levels, player evaluation and teaching materials." },
        { num: "02", title: "Training", desc: "Coach360 for your entire staff. Every coach earns their Recommended seal and appears on the map." },
        { num: "03", title: "Brand", desc: "You operate as a J3 Academy. Brand manual, visual guidelines and presence on the international network." },
        { num: "04", title: "Support", desc: "Operational accompaniment from M\u00E1laga. Periodic reviews, method updates and franchisee community." },
      ],
      ctaEyebrow: "Are you a club or investor?",
      ctaHeading: "Let\u2019s talk.",
      ctaSub: "Leave your details and a J3 partner will reach out with the full dossier.",
      ctaPrimary: "Request information",
      ctaPrimaryHref: "mailto:partner@j3padel.com?subject=J3%20Academy%20information%20request",
      ctaSecondary: "Download dossier",
      disclaimer: "Model in formation. First cohort 2026.",
    },

    method: {
      eyebrow: "J3 Method",
      headingPre: "How we ",
      headingAccent: "work.",
      steps: [
        {
          title: "Individual assessment",
          desc: "Every player starts with a real evaluation. We know where they\u2019re coming from before we tell them where they can go.",
        },
        {
          title: "Goal-based planning",
          desc: "No two programs are alike. Training is designed around each player\u2019s profile, level and goals.",
        },
        {
          title: "Top-tier coaches",
          desc: "Our coaching team comes from the professional tour. They\u2019ve trained Spanish and world champions, and they know the path.",
        },
        {
          title: "Continuous follow-up",
          desc: "Progress is measured, not guessed. Constant review with real adjustments, not background noise.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "Years in the industry" },
        { lbl: "Best club in the world 2018" },
        { lbl: "Professional players trained" },
        { lbl: "Titles on the professional tour" },
        { lbl: "Amateur players trained" },
      ],
    },

    cta: {
      eyebrow: "First point of contact",
      titlePre: "Start",
      titleAccent: "today.",
      subtitle: "Tell us your level, your goals and your availability. We\u2019ll get back to you in under 24\u00A0hours.",
      button: "Message us on WhatsApp",
      note: "No commitment \u00B7 No forms \u00B7 Direct reply",
      waMsg: "Hi, I\u2019d like information about J3Academy",
    },
  },

  /* ── Experience page ── */

  experience: {
    hero: {
      eyebrow: "J3Experience \u00B7 On court \u00B7 International",
      titleLines: ["YOU", "CHOOSE", "TO LIVE IT."],
      subtitleTags: ["Camps", "Stages", "Experiences"],
      subtitleBefore: "",
      subtitleAccent: "bespoke",
      subtitleAfter: "anywhere in the world",
    },

    statement: {
      eyebrow: "The experience",
      lines: [
        { before: "Enjoy", accent: "a" },
        { before: "unique experience" },
        { before: "with", accent: "us." },
      ],
    },

    flowCamp: {
      eyebrow: "Worldwide \u00B7 Kids \u00B7 Juniors \u00B7 Players",
      headingFlow: "Flow",
      headingCamp: "Camp",
      introBefore: "We find the venues, we gather the people and we share what we know. ",
      introAccent: "On court and off it.",
      jovenesLabel: "Flow Camp \u00B7 Juniors",
      jovenesTitleAccent: "Flow Camp.",
      jovenesTitleRest: " P\u00E1del, values and mindset. For young players who see sport as something more.",
      jovenesCards: [
        {
          label: "The event",
          title: "J3 in your city",
          desc: "We find the venue, bring the young players together and run the show. An intensive event over one or several days with the J3 team on court.",
        },
        {
          label: "The method",
          title: "Technique \u00B7 Tactics \u00B7 Mindset",
          desc: "It\u2019s not just about hitting better. Flow Camp works on the three pillars of the J3 system \u2014 because top-level p\u00E1del starts in your head.",
        },
        {
          label: "The coaches",
          title: "Express training included",
          desc: "Local coaches join J3 on court. They take home the method, the vision and real training. Everyone wins.",
        },
      ],
      adultosLabel: "Players Camp \u00B7 Adults",
      adultosTitleAccent: "Players Camp.",
      adultosTitleMid: " Your city, our ",
      adultosTitleSerif: "experience.",
      adultosCards: [
        {
          label: "Who",
          title: "For those who play seriously",
          desc: "Groups of friends, amateur competitive teams or anyone who wants to live a camp without travelling to M\u00E1laga.",
        },
        {
          label: "What",
          title: "Intensive in your city",
          desc: "On-court sessions with the J3 team. Technique, tactics, analysed matches. At your venue or one we find together.",
        },
        {
          label: "The plus",
          title: "Without leaving home",
          desc: "The J3 experience with no travel. Ideal if the group is big, the level varies or you just prefer to play on home turf.",
        },
      ],
      ctaText: "Tell us your city and who you are. We\u2019ll take care of the rest.",
      ctaButton: "Request Flow Camp",
      waMsg: "Hi, I\u2019d like information about Flow Camp",
    },

    empresas: {
      eyebrow: "We connect teams \u00B7 We activate brands",
      heading: "Companies",
      introBefore: "P\u00E1del as a ",
      introAccent: "tool.",
      introAfter: " To connect with your community or activate your team \u2014 we design the experience from start to finish.",
      leftPara1: "We work with brands and companies that understand p\u00E1del is much more than a sport. It\u2019s a meeting point, an activation, a moment that brings people together.",
      leftPara2: "At your venue or at ours. In M\u00E1laga or wherever you need us.",
      ctaButton: "Talk to the team",
      waMsg: "Hi, I\u2019d like information about J3Experience for companies",
      formatos: [
        {
          tag: "Format 01",
          name: "Meet & Greet",
          desc: "Connect your brand with the p\u00E1del community. J3 organises the event, brings the players and creates the moment.",
        },
        {
          tag: "Format 02",
          name: "Brand activation",
          desc: "Brand presence in a real sports environment. With real players, not extras.",
        },
        {
          tag: "Format 03",
          name: "Team Building",
          desc: "Your team on court. Competitive dynamics, teamwork and an experience that goes far beyond the usual office p\u00E1del session.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "Years in\nthe industry" },
        { lbl: "Best club in\nthe world 2018" },
        { lbl: "Wins on the\nprofessional tour" },
        { lbl: "Official venue\nM\u00E1laga 2014" },
      ],
    },

    cta: {
      titleLine1: "When",
      titleLine2: "is your",
      titleAccent: "Experience",
      titleEnd: "?",
      body: "Message us on WhatsApp. Tell us what you\u2019re looking for and we\u2019ll design it together.",
      button: "Request now",
      note: "Reply within 24h \u00B7 No commitment",
      waMsg: "Hi, I\u2019d like information about J3Experience",
    },
  },
} as const satisfies Dictionary;

export default en;
