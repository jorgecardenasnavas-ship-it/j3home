import type { Dictionary } from "./types";

export const fr = {
  /* ── Shared components ── */

  nav: {
    soluciones: "Premium",
    acceder: "Se connecter",
    inicio: "Accueil",
  },

  footer: {
    copyright: "\u00A9 2026 J3Padel",
  },

  sponsors: {
    items: [
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52, href: "https://www.tecnifibre.com" },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52, href: "https://www.lacoste.com" },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56, href: "http://www.alquilavisual.com" },
    ],
  },

  chat: {
    tooltip: "Parlons-en",
  },

  /* ── Home page ── */

  hero: {
    play: "Play.",
    coach: "Coach.",
    manage: "Manage.",
    milestones: [
      { year: "2004", text: "Le parcours commence" },
      { year: "2014", text: "Si\u00E8ge World Padel Tour" },
      { year: "2018", text: "Meilleur club du monde" },
      { year: "2022", text: "Meilleur entra\u00EEneur espagnol au classement pro" },
      { year: "2024", text: "10\u00E8me anniversaire de J3" },
      { year: "11\u00D7", text: "Champion sur le circuit pro" },
    ],
    tagline: "Centre de formation champion d\u2019Espagne et du Monde",
    cta1: "Voir les produits",
    cta2: "Coach360",
    accentTouch: {
      topLine: "Le monde a perdu l\u2019accent.",
      accentWord: "Nous",
      afterAccent: "l\u2019avons gard\u00E9.",
      labelLeft: "P\u00C1DEL \u00B7 AVEC \u00B7 ACCENT",
      labelRight: "DEPUIS 2004 \u2014 M\u00C1LAGA",
    },
  },

  impact: {
    line1: "L\u2019acad\u00E9mie",
    line2: "de padel #1",
    line3: "sur la Costa del Sol.",
    tagline: "Depuis 2004 \u00B7 M\u00E1laga, Espagne",
  },

  system: {
    blocks: [
      { line1: "Le jeu", line2: "a chang\u00E9." },
      { line1: "Le coach", line2: "a \u00E9volu\u00E9." },
      { line1: "La gestion", line2: "optimis\u00E9e." },
    ],
    nodes: ["Coach360", "J3PTV", "Academy", "Business", "Experience", "Partner"],
  },

  home: {
    line1: "Un environnement complet pour les passionn\u00E9s, joueurs et entra\u00EEneurs exigeants.",
    line2: "Un syst\u00E8me de gestion int\u00E9gral pour acad\u00E9mies et clubs de padel.",
    closer: "Optimiser. Automatiser. D\u00E9velopper.",
  },

  products: {
    cards: [
      {
        tag: "En ligne \u00B7 Formation",
        forLabel: "Entra\u00EEneurs de padel",
        description: "Expertise, m\u00E9thode et communaut\u00E9. Du nouveau contenu chaque semaine.",
        buttons: ["Entrer dans Coach360"],
      },
      {
        tag: "En ligne \u00B7 Contenu \u00B7 Divertissement",
        forLabel: "Tous les profils",
        description: "Analyse, d\u00E9bat et le jeu moderne sans bruit.",
        buttons: ["En savoir plus", "Se connecter"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Junior",
        description: "Le m\u00EAme syst\u00E8me du circuit professionnel, adapt\u00E9 \u00E0 vous.",
        buttons: ["Entra\u00EEnez-vous avec nous"],
      },
      {
        tag: "Automatisation \u00B7 Gestion \u00B7 Optimisation",
        forLabel: "Acad\u00E9mies et clubs",
        description: "Am\u00E9liorez vos performances gr\u00E2ce \u00E0 notre savoir-faire et notre accompagnement 1:1.",
        buttons: ["En savoir plus", "Planifier un appel"],
      },
      {
        tag: "Service \u00B7 Pr\u00E9sentiel",
        forLabel: "Clubs, acad\u00E9mies et groupes",
        buttons: ["Demander"],
      },
      {
        tag: "Expansion \u00B7 Cl\u00E9 en main",
        forLabel: "Clubs et acad\u00E9mies",
        buttons: ["En savoir plus"],
      },
    ],
  },

  nosotros: {
    label: "Qui sommes-nous",
    heading1: "Plus de 20 ans",
    heading2: "dans le padel.",
    body: "Nous avons commenc\u00E9 quand le padel \u00E9tait un autre sport. Nous avons form\u00E9 des joueurs qui \u00E9voluent aujourd\u2019hui sur le circuit, g\u00E9r\u00E9 le meilleur club du monde et entra\u00EEn\u00E9 des professionnels du WPT. Voil\u00E0 ce qui se cache derri\u00E8re.",
    link: "D\u00E9couvrez notre parcours",
    statsLabel: "Par les chiffres",
    stats: [
      { val: "#1", line1: "Meilleur club /", line2: "du monde 2018" },
      { val: "20+", line1: "Ann\u00E9es /", line2: "dans le secteur" },
      { val: "WPT", line1: "Si\u00E8ge officiel /", line2: "depuis 2014" },
      { val: "18", line1: "Titres /", line2: "sur le circuit pro" },
      { val: "100+", line1: "Coachs /", line2: "form\u00E9s m\u00E9thode J3" },
      { val: "Top 5", line1: "Classement /", line2: "mondial 2022" },
    ],
  },

  contacto: {
    label: "Contact",
    heading1: "Dites-nous",
    heading2: "ce que vous cherchez.",
    body: "Si vous \u00EAtes arriv\u00E9 jusqu\u2019ici, quelque chose a retenu votre attention. Dites-nous o\u00F9 vous en \u00EAtes et ce que vous recherchez.",
    email: "E-mail",
    telefono: "T\u00E9l\u00E9phone",
    sede: "Si\u00E8ge",
    placeholders: {
      nombre: "Nom",
      email: "E-mail",
      mensaje: "Message",
    },
    soyOptions: [
      "Je suis...",
      "Entra\u00EEneur / Coach",
      "Joueur amateur",
      "Passionn\u00E9 de padel",
      "Directeur d\u2019acad\u00E9mie / club",
      "Int\u00E9ress\u00E9 par la franchise",
      "Autre",
    ],
    interesOptions: [
      "Je m\u2019int\u00E9resse \u00E0...",
      "Coach360 \u00B7 Formation",
      "J3PTV \u00B7 Contenu",
      "Academy \u00B7 S\u2019entra\u00EEner \u00E0 M\u00E1laga",
      "Franchise \u00B7 Syst\u00E8me cl\u00E9 en main",
      "J3 Experience \u00B7 Venez dans mon club",
      "Autre chose",
    ],
    submit: "Envoyer",
    sending: "Envoi en cours...",
    sent: "\u2713 Envoy\u00E9",
    error: "Veuillez compl\u00E9ter le nom, l\u2019e-mail et le message.",
  },

  /* ── Story page ── */

  story: {
    hero: {
      prefix: "Plus de",
      years: "20 ans",
      dentro: "au c\u0153ur",
      delJuego: "du jeu.",
      sub1: "L\u2019une des \u00E9quipes les plus",
      sub2: "influentes",
      sub3: "dans le monde du padel.",
      desde: "Depuis 2004",
      location: "M\u00E1laga, Espagne",
    },

    impact: {
      line1: "Nous visons haut, mais",
      line2: "toujours les pieds sur terre.",
      fact1: "Nous entra\u00EEnons des joueurs dans le top 8 du circuit professionnel.",
      fact2: "Dix ans \u00E0 la t\u00EAte de l\u2019un des meilleurs clubs du monde.",
      closer: "Et nous sommes toujours sur le terrain.",
      proudLabel: "Ce dont nous sommes le plus fiers",
      cantera: [
        "Nous avons formé des dizaines de jeunes.",
        "Certains ont remporté des titres nationaux et mondiaux.",
        "D\u2019autres ont réalisé leur objectif de jouer sur le circuit professionnel.",
        "Et beaucoup ont réalisé le rêve d\u2019étudier à l\u2019université qu\u2019ils voulaient.",
      ],
      historyLabel: "Notre histoire",
    },

    bridge: {
      line1: "On joue. On entra\u00EEne. On dirige.",
      line2: "Notre maison, c\u2019est le 20\u00D710.",
    },

    accent: {
      eyebrow: "Notre signature",
      slogan: ["P\u00E1del.", "Avec.", "Accent."],
      manifesto: [
        "Quand le sport a quitt\u00E9 l\u2019Espagne, il a perdu son accent.",
        "Nous ne l\u2019avons jamais l\u00E2ch\u00E9.",
        "Car l\u2019accent n\u2019est pas orthographe \u2014 c\u2019est origine.",
      ],
    },

    stats: {
      header: "Notre histoire en chiffres",
      items: [
        { val: 20, suffix: "+", lbl: "Ans\nd'expérience" },
        { prefix: "#", val: 1, lbl: "Meilleur club\ndu monde 2018" },
        { val: 100, suffix: "+", lbl: "Coaches formés\nchez Coach360" },
        { val: 2000, suffix: "+", lbl: "Joueurs amateurs\nformés" },
        { val: 30, suffix: "+", lbl: "Joueurs professionnels\nformés" },
        { label: "N.º1", val: 0, lbl: "Meilleur entraîneur espagnol\nranking WPT 2022" },
        { val: 11, lbl: "Titres professionnels\nen 18 finales disputées" },
        { label: "WPT", val: 0, lbl: "Siège officiel\nMálaga 2014" },
      ],
    },

    timeline: {
      sectionLabel: "Parcours",
      heading1: "Des jalons qui",
      heading2: "nous d\u00E9finissent",
      eras: ["Les d\u00E9buts", "Ocean Padel \u00B7 J3Padel", "Reserva del Higuer\u00F3n", "Changement de cap"],
      entries: [
        {
          year: "D\u00E9but des ann\u00E9es 2000",
          title: "Le padel nous trouve",
          desc: "Nous d\u00E9couvrons le padel en tant qu\u2019amateurs. Ce qui commence comme un sport devient rapidement une obsession. Des ann\u00E9es de comp\u00E9tition \u00E0 travers toute l\u2019Andalousie, membres r\u00E9guliers de la s\u00E9lection de M\u00E1laga et repr\u00E9sentant l\u2019Universit\u00E9 de M\u00E1laga (UMA).",
        },
        {
          year: "2005-2008",
          title: "Les premiers cours",
          desc: "Tout en continuant \u00E0 comp\u00E9titionner, nous commen\u00E7ons \u00E0 donner des cours en parall\u00E8le. La Capellan\u00EDa et le Club de Tenis M\u00E1laga sont les premiers endroits o\u00F9 nous transmettons ce que le jeu nous a appris.",
        },
        {
          year: "2009-2010",
          title: "Smash Padel \u2192 Ocean Padel",
          desc: "Nous nous r\u00E9unissons pour la premi\u00E8re fois tous les trois \u2014 Javi, Jorge et Jordi Mu\u00F1oz \u2014 pour cr\u00E9er une acad\u00E9mie de jeunes \u00E0 Smash Padel. Peu apr\u00E8s, elle se transforme en Ocean Padel, et la vraie mont\u00E9e en puissance commence.",
          highlight: true,
          image: "/images/story/timeline/ocean-padel.jpg",
        },
        {
          year: "2010-2014",
          title: "La meilleure acad\u00E9mie de jeunes d\u2019Espagne",
          desc: "Ocean Padel devient une r\u00E9f\u00E9rence nationale. C\u2019est ici que se forment \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado, Bea Gonz\u00E1lez et toute la premi\u00E8re g\u00E9n\u00E9ration. Plusieurs int\u00E8grent la s\u00E9lection espagnole et participent \u00E0 des comp\u00E9titions internationales.",
          badge: "Champions d\u2019Andalousie \u00B7 d\u2019Espagne \u00B7 du Monde (jeunes)",
        },
        {
          year: "2014",
          title: "Naissance de J3Padel",
          desc: "Lorsque Ocean Padel ferme ses portes, l\u2019\u00E9quipe se s\u00E9pare mais la marque J3 na\u00EEt en tant qu\u2019entit\u00E9 propre. Nous organisons le WPT de M\u00E1laga avec pr\u00E8s de 300 paires inscrites.",
          badge: "World Padel Tour \u00B7 Si\u00E8ge officiel M\u00E1laga 2014",
          image: "/images/story/timeline/j3padel-fundadores.jpeg",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "Dans les m\u00EAmes installations qu\u2019Ocean Padel, nous ouvrons un club propre. Un projet qui n\u2019a pas abouti, mais qui a laiss\u00E9 une le\u00E7on claire sur la gestion.",
        },
        {
          year: "2016",
          title: "Higuer\u00F3n Resort",
          desc: "Nous int\u00E9grons Reserva del Higuer\u00F3n \u2014 aujourd\u2019hui Higuer\u00F3n Resort. Le cycle le plus long et le plus exigeant du projet commence.",
          image: "/images/story/timeline/higueron-resort.jpg",
        },
        {
          year: "Fin 2016",
          title: "Jordi Mu\u00F1oz quitte le projet",
          desc: "Jordi quitte M\u00E1laga et le projet J3 pour des raisons personnelles. Son empreinte reste pr\u00E9sente. Javi et Jorge poursuivent le projet, sans le J qui leur avait ouvert la voie.",
          image: "/images/story/timeline/tres-j.jpeg",
          imagePosition: "center 25%",
        },
        {
          year: "2018",
          title: "Meilleur Club de Padel du Monde",
          desc: "Higuer\u00F3n Resort, sous notre direction, est reconnu comme le meilleur club de padel du monde. Un titre qui arrive apr\u00E8s deux ans de travail discret et ambitieux.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
          image: "/images/story/timeline/mejor-club-2018.jpeg",
        },
        {
          year: "2016-2022",
          title: "\u00C9cole de comp\u00E9tition \u00B7 Internationalisation",
          desc: "Pendant six ans, l\u2019accent est mis sur la formation des jeunes et l\u2019internationalisation. Ce que nous avions d\u00E9j\u00E0 fait \u00E0 Ocean Padel, nous le reproduisons. De plus, nous faisons de la Costa del Sol une destination internationale pour les joueurs amateurs.",
        },
        {
          year: "2021",
          title: "\u00C1lex Ruiz et Franco Stupaczuk",
          desc: "Nous revenons au haut niveau. Le r\u00E9sultat est historique : nous terminons l\u2019ann\u00E9e dans le top 4 mondial du WPT.",
          badge: "Top 4 Mondial WPT \u00B7 2021",
          highlight: true,
          image: "/images/story/timeline/franco-alex-pozzoni-jorge.jpeg",
          imagePosition: "center 55%",
        },
        {
          year: "2022",
          title: "Finale WPT Marbella",
          desc: "Une paire 100% malague\u00F1a et form\u00E9e \u00E0 Ocean Padel / J3. Finale du WPT \u00E0 Marbella \u2014 \u00E0 la maison, avec les n\u00F4tres dans les tribunes.",
          badge: "WPT Marbella Master \u00B7 2022",
          image: "/images/story/timeline/wpt-marbella-2022.jpeg",
        },
        {
          year: "D\u00E9cembre 2022",
          title: "\u00C1lex Ruiz et Momo Gonz\u00E1lez \u00B7 Top 5",
          desc: "Ils atteignent le top 5 mondial. Deux joueurs form\u00E9s \u00E0 Ocean Padel, entra\u00EEn\u00E9s par J3, au plus haut niveau du circuit professionnel.",
          badge: "Top 5 Mondial \u00B7 D\u00E9cembre 2022",
          highlight: true,
          image: "/images/story/timeline/momo-alex-jorge.jpeg",
        },
        {
          year: "2023-2024",
          title: "Varlion",
          desc: "Javi rejoint Varlion en tant que responsable de l\u2019expansion de la marque. Une \u00E9tape d\u2019apprentissage strat\u00E9gique en dehors du terrain.",
        },
        {
          year: "2024",
          title: "Fin d\u2019un cycle",
          desc: "Nous nous s\u00E9parons de Higuer\u00F3n Resort et de Varlion. Pr\u00E8s d\u2019une d\u00E9cennie \u00E0 g\u00E9rer celui qui fut le meilleur club du monde. Ce cycle se referme.",
        },
        {
          year: "2024-2025",
          title: "De M\u00E1laga au monde",
          desc: "Enti\u00E8rement d\u00E9di\u00E9s \u00E0 construire J3Padel en tant qu\u2019\u00E9cosyst\u00E8me : formation, gestion, contenu et haut niveau.",
        },
        {
          year: "Mi-2025",
          title: "Naissance de Coach360",
          desc: "Formation en ligne pour entra\u00EEneurs de padel. Apr\u00E8s avoir voyag\u00E9 \u00E0 travers le monde et constat\u00E9 le vide que l\u2019expansion du padel avait cr\u00E9\u00E9 en mati\u00E8re de formation, nous d\u00E9cidons d\u2019apporter tout notre savoir-faire de mani\u00E8re unique. Nous cr\u00E9ons la premi\u00E8re communaut\u00E9 d\u2019entra\u00EEneurs.",
          badge: "Coach360 \u00B7 100+ coaches \u00B7 40+ le\u00E7ons",
        },
        {
          year: "2026",
          title: "Nouveau si\u00E8ge \u00B7 M\u00E1laga capitale",
          desc: "J3Padel retrouve un si\u00E8ge physique \u2014 Finura Padel et Vals Los Limoneros. L\u2019\u00E9cosyst\u00E8me complet : Coach360, J3PTV, Academy, Business et Experience.",
          badge: "Finura Padel \u00B7 Vals Los Limoneros \u00B7 \u00C9t\u00E9 2026",
        },
      ],
    },

    team: {
      label: "L\u2019\u00E9quipe",
      heading1: "Deux personnes.",
      heading2: "Une même",
      heading2Accent: "vision.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Joueur, entra\u00EEneur, ex\u00E9cutant. Il grandit sur le terrain et continue d\u2019entra\u00EEner, avec un don naturel pour transformer les id\u00E9es en structure. Il organise le WPT M\u00E1laga avec pr\u00E8s de 300 paires, g\u00E8re le Higuer\u00F3n jusqu\u2019\u00E0 en faire le meilleur club du monde et dirige aujourd\u2019hui l\u2019ensemble de l\u2019\u00E9cosyst\u00E8me J3.",
          quote: "Sans ex\u00E9cution, la vision reste une simple conversation.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Joueur, entra\u00EEneur, strat\u00E8ge. Toujours tourn\u00E9 vers ce qui arrive. Il d\u00E9finit la m\u00E9thodologie J3 depuis le terrain, forme des dizaines de jeunes qui atteignent les sommets et am\u00E8ne des joueurs au top 5 mondial. Aujourd\u2019hui, il dessine l\u2019avenir de J3Padel.",
          quote: "Voir le jeu avant qu\u2019il ne se produise. C\u2019est \u00E7a, entra\u00EEner.",
        },
      ],
    },

    players: {
      label: "Joueurs",
      heading1: "Chaque joueur",
      heading2: "a son",
      heading2Accent: "roadmap.",
      description: "Deux types de relation. Ceux que nous avons form\u00E9s depuis la base \u2014 aujourd\u2019hui sur le circuit professionnel. Et ceux qui ont fait appel \u00E0 J3 pour une pr\u00E9paration de haut niveau.",
      heroLabel: "Form\u00E9s depuis la base \u00B7 Au plus haut du circuit",
      nextGenLabel: "Du centre de formation au circuit professionnel",
      nextGenProLabel: "Arriv\u00E9s comme espoirs \u00B7 Confirm\u00E9s sur le circuit",
      featuredLabel: "Collaborations professionnelles remarquables",
      sharedLabel: "Ont \u00E9galement partag\u00E9 l\u2019\u00E9quipe J3",
      heroPlayers: [
        { info: "Form\u00E9 d\u00E8s son plus jeune \u00E2ge \u00E0 Ocean Padel. A atteint le top 4 mondial.", tag: "Top 4 Mondial" },
        { info: "Centre de formation Ocean Padel / J3. 100 % de M\u00E1laga. Top 5 mondial.", tag: "Top 5 Mondial" },
        { info: "Top 8 mondial au PPT. Cofondateur de J3Padel.", tag: "Cofondateur J3 \u00B7 Top 8 PPT" },
      ],
      nextGenTags: [
        "Champion d\u2019Espagne et du Monde",
        "Championne d\u2019Espagne et du Monde",
        "Championne d\u2019Espagne \u00B7 Circuit Pro",
        "Champion d\u2019Espagne \u00B7 Circuit Pro",
        "Champion d\u2019Espagne et du Monde Junior",
      ],
      nextGenProTags: [
        "Junior \u2192 Top 30",
        "Junior \u2192 Top 30",
      ],
      featuredPlayers: [
        { info: "5 finales et paire n\u00B0 4 mondiale en 2021.", tag: "3 Titres \u00B7 #4 Mondial 2021" },
        { info: "Demi-finales du P2 Premier Padel \u00E0 Milan 2022.", tag: "DF P2 Milan 2022" },
        { info: "Demi-finales du P2 Premier Padel \u00E0 Milan 2022.", tag: "DF P2 Milan 2022" },
        { info: "Titre FIP Platinum \u00E0 Mexico.", tag: "Titre FIP Platinum CDMX" },
      ],
      sharedTags: [
        "Top Mondial",
        "Top Mondial",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
        "Circuit Pro",
      ],
    },

    philosophy: {
      label: "Philosophie",
      word1: "Expertise.",
      word2: "M\u00E9thode.",
      word3: "Syst\u00E8me.",
      body: "Nous n\u2019entra\u00EEnons pas avec des exercices isol\u00E9s. Nous ne g\u00E9rons pas \u00E0 l\u2019intuition. Tout ce que nous faisons chez J3Padel r\u00E9pond \u00E0 un syst\u00E8me construit pendant 20 ans.",
      pillars: [
        {
          num: "01",
          label: "Expertise",
          title: "Savoir pourquoi, pas seulement quoi",
          body: "Un entra\u00EEneur avec de l\u2019expertise n\u2019ex\u00E9cute pas des exercices \u2014 il prend des d\u00E9cisions.",
        },
        {
          num: "02",
          label: "M\u00E9thode",
          title: "R\u00E9p\u00E9tabilit\u00E9 et progression",
          body: "La m\u00E9thode J3 est con\u00E7ue pour produire une am\u00E9lioration syst\u00E9matique. Sans m\u00E9thode, le talent ne progresse pas.",
        },
        {
          num: "03",
          label: "Syst\u00E8me",
          title: "Une structure qui fonctionne seule",
          body: "Un bon syst\u00E8me fonctionne quand vous n\u2019\u00EAtes pas l\u00E0. Nous l\u2019avons construit pour les clubs, acad\u00E9mies et entra\u00EEneurs.",
        },
        {
          num: "04",
          label: "Terrain",
          title: "Tout part du jeu r\u00E9el",
          body: "Chaque concept du syst\u00E8me J3 a \u00E9t\u00E9 \u00E9prouv\u00E9 sur le terrain \u2014 avec de vrais joueurs, en comp\u00E9tition r\u00E9elle.",
        },
      ],
    },

    clubs: {
      label: "Gestion de clubs",
      heading1: "Les clubs o\u00F9 nous",
      heading2: "avons laiss\u00E9 notre empreinte.",
      description: "Direction technique, gestion op\u00E9rationnelle et d\u00E9veloppement de la formation.",
      originLabel: "L\u00E0 o\u00F9 tout a commenc\u00E9",
      presentLabel: "Actuellement",
      lessonAside: "Un projet qui n\u2019a pas abouti, mais qui a laiss\u00E9 une le\u00E7on claire.",
      origins: [
        {
          flag: "M\u00E1laga \u00B7 2009\u20132014",
          name: "Ocean Padel",
          detail: "L\u00E0 o\u00F9 tout a commenc\u00E9 \u00E0 grande \u00E9chelle. La meilleure acad\u00E9mie de jeunes d\u2019Espagne. C\u2019est ici qu\u2019ont \u00E9t\u00E9 form\u00E9s \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado et toute la premi\u00E8re g\u00E9n\u00E9ration J3.",
          highlight: "Meilleure acad\u00E9mie de jeunes",
        },
        {
          flag: "M\u00E1laga \u00B7 2014",
          name: "Belife",
          detail: "Si\u00E8ge officiel du World Padel Tour. Pr\u00E8s de 300 paires inscrites.",
          highlight: "WPT \u00B7 Si\u00E8ge officiel 2014",
        },
      ],
      heroClub: {
        flag: "Marbella \u00B7 2016\u20132024",
        name: "Reserva del Higuer\u00F3n",
        detail: "Pr\u00E8s d\u2019une d\u00E9cennie \u00E0 g\u00E9rer le club reconnu comme le meilleur du monde. Direction technique compl\u00E8te, centre de formation d\u2019\u00E9lite et gestion \u00E0 grande \u00E9chelle.",
        highlight: "Best Padel Club in the World \u00B7 2018",
        years: "9",
      },
      lesson: {
        flag: "M\u00E1laga \u00B7 2015",
        name: "J3Padel Indoor",
      },
      present: [
        {
          flag: "M\u00E1laga capitale \u00B7 2026",
          name: "Finura Padel",
          detail: "Premier si\u00E8ge de la nouvelle \u00E9tape \u00E0 M\u00E1laga capitale.",
          highlight: "Si\u00E8ge actuel \u00B7 Op\u00E9rationnel",
        },
        {
          flag: "Puerto de la Torre \u00B7 2026",
          name: "Vals Los Limoneros",
          detail: "Nouvelle installation. Club en cours d\u2019ouverture.",
          highlight: "Ouverture prochaine \u00B7 \u00C9t\u00E9 2026",
        },
      ],
    },

    brands: {
      currentLabel: "Marques qui font confiance \u00E0 J3Padel",
      pastLabel: "Ont fait confiance \u00E0 J3Padel",
    },

    cta: {
      label: "20 ans plus tard",
      heading1: "Jusqu\u2019ici,",
      heading2: "tout est histoire.",
      body: "La suite s\u2019\u00E9crit avec ceux qui d\u00E9cident d\u2019en faire partie. Si vous \u00EAtes entra\u00EEneur, g\u00E9rez un club ou souhaitez simplement vous entra\u00EEner avec nous \u2014 c\u2019est le moment.",
      buttons: ["Parlons-en", "Coach360", "Academy", "Business"],
    },
  },

  /* ── Academy page ── */

  academy: {
    hero: {
      locationLabel: "M\u00E1laga \u00B7 Costa del Sol",
      titleLine1: "R\u00E9p\u00E9ter.",
      titleLine2: "Affiner.",
      titleLine3a: "ET",
      titleLine3b: "avancer.",
      ctaLabel: "Explorer les programmes",
      subtitleBefore: "La meilleure",
      subtitleAccent: "acad\u00E9mie",
      subtitleAfter: "de padel",
      subtitleLocation: "sur la Costa del Sol",
      subtitleLine2: "Depuis 2004, nous formons des joueurs de tous niveaux.",
      eyebrow: "O\u00F9 s'entra\u00EEner J3",
      heading: "Academy J3",
      sub: "Le Lab \u00E0 M\u00E1laga. Le r\u00E9seau dans ta ville.",
      ctaPrimary: "Trouver un coach J3 pr\u00E8s de chez toi",
      ctaSecondary: "S'entra\u00EEner au J3 Lab",
      filtersTitle: "Filtrer",
      countTemplate: "{count} coaches \u00B7 {countries} villes",
      sedesNavLabel: "Sites J3",
    },

    band: {
      description: "Située au cœur de la Costa del Sol, elle allie haut niveau, méthodologie propre et une équipe technique forte d'une expérience sur le circuit professionnel.",
    },

    claim: {
      quote: "Certains veulent que ça arrive, d'autres souhaitent que ça arrive, les autres font en sorte que ça arrive.",
      author: "Michael Jordan",
    },

    statement: {
      eyebrow: "Notre mission",
      lines: [
        { before: "Nous formons", accent: "des joueurs." },
        { before: "Nous d\u00E9veloppons", accent: "des personnes." },
        { before: "Nous b\u00E2tissons", accent: "des carri\u00E8res." },
      ],
    },

    proof: {
      eyebrow: "Parcours \u00B7 R\u00E9sultats",
      quoteOpen: "\u00AB\u202FNos joueurs n\u2019arrivent pas seulement sur le circuit. ",
      quoteAccent: "Ils s\u2019imposent",
      quoteClose: ".\u202F\u00BB",
      imageAlt: "Joueurs de J3 Academy sur le circuit professionnel",
      players: [
        { name: "Guille Collado", info: "Circuit pro WPT / APT" },
        { name: "\u00C1lex Ruiz", info: "Circuit professionnel" },
        { name: "Bea Gonz\u00E1lez", info: "Circuit f\u00E9minin" },
        { name: "Momo Gonz\u00E1lez", info: "Circuit professionnel" },
        { name: "Martina Fassio", info: "Circuit professionnel" },
        { name: "Jos\u00E9 Jim\u00E9nez", info: "Circuit professionnel" },
      ],
    },

    programs: {
      eyebrow: "Structure J3",
      headingPre: "Trouvez votre ",
      headingAccent: "programme.",
      headingSub: "M\u00EAme structure dans chaque club \u2014 trois parcours pens\u00E9s pour chaque \u00E2ge, niveau et objectif.",
      juniorsLabel: "Juniors",
      juniorsCards: [
        {
          tag: "Fondamentaux",
          title: "Kinder",
          sub: "4+ ans",
          ctaLabel: "Demander des infos",
          waMsg: "Bonjour, je souhaite des infos sur Kinder (4-10 ans)",
        },
        {
          tag: "Perfectionnement",
          title: "Kids",
          sub: "10+ ans",
          ctaLabel: "Demander des infos",
          waMsg: "Bonjour, je souhaite des infos sur Kids (10+)",
        },
        {
          tag: "Comp\u00E9tition",
          title: "Junior",
          sub: "14+ ans",
          ctaLabel: "Demander des infos",
          waMsg: "Bonjour, je souhaite des infos sur Junior (14+ comp\u00E9tition)",
        },
        {
          tag: "Haut niveau",
          title: "Next Gen",
          sub: "16+ ans",
          ctaLabel: "Demander des infos",
          waMsg: "Bonjour, je souhaite des infos sur Next Gen (16+ circuit)",
        },
      ],
      adultosLabel: "Adultes",
      adultosCards: [
        {
          tag: "Tous niveaux",
          title: "Amateur",
          sub: "D\u00E9butant \u00B7 Interm\u00E9diaire \u00B7 Avanc\u00E9 \u00B7 Comp\u00E9tition",
          ctaLabel: "Je m\u2019inscris",
          waMsg: "Bonjour, je souhaite des infos sur le programme Amateur",
        },
        {
          tag: "Circuit professionnel",
          title: "Pro",
          sub: "Entra\u00EEnement d\u2019\u00E9lite",
          ctaLabel: "Demander des infos",
          waMsg: "Bonjour, je souhaite des infos sur le programme Pro",
        },
      ],
      adultosInfoEyebrow: "\u00C9cole r\u00E9guli\u00E8re",
      adultosInfoHeadingPre: "L\u2019\u00E9cole",
      adultosInfoHeadingAccent: "amateur.",
      adultosInfoTagline: "Mejora con constancia.",
      adultosInfoDesc: "Programme annuel ouvert \u00E0 tous les niveaux. Votre rythme, votre groupe, votre horaire.",
      adultosFeatures: [
        { label: "Niveaux", desc: "D\u00E9butant, interm\u00E9diaire, avanc\u00E9 et comp\u00E9tition" },
        { label: "Format", desc: "\u00C9cole r\u00E9guli\u00E8re, programme annuel" },
        { label: "Horaires", desc: "Matins, apr\u00E8s-midi, semaine ou week-end" },
      ],
      intensiveCards: [
        {
          tag: "Format intensif",
          title: "Camps \u00B7 Stages",
          sub: "Programmes sur mesure",
          ctaLabel: "R\u00E9server",
          waMsg: "Bonjour, je souhaite r\u00E9server un Intensive Training",
        },
      ],
      intensiveLabel: "Intensive Training",
      intensiveEyebrow: "Camps \u00B7 Stages \u00B7 Programmes sur mesure",
      intensiveTitlePre: "Venez vous entra\u00EEner",
      intensiveTitleAccent: "avec nous.",
      intensiveDesc: "Nous concevons un plan sur mesure.",
      intensiveImageAlt: "Groupe de joueurs lors d\u2019un stage de padel",
      intensiveCtaBook: "R\u00E9server votre training",
      intensiveCtaInfo: "Plus d\u2019informations",
      intensiveWaMsgBook: "Bonjour, je souhaite r\u00E9server un Intensive Training",
      intensiveWaMsgInfo: "Bonjour, je souhaite des infos sur Intensive Training",
      intensiveInfoEyebrow: "Format flexible",
      intensiveInfoHeadingPre: "Votre training,",
      intensiveInfoHeadingAccent: "sur mesure.",
      intensiveInfoDesc: "Nous concevons chaque programme selon vos besoins : fr\u00E9quence, intensit\u00E9, matchs et logistique.",
      intensiveFeatures: [
        { label: "Calendrier", desc: "Week-end, semaine ou sur mesure" },
        { label: "S\u00E9ances", desc: "De 1 \u00E0 3 s\u00E9ances par jour" },
        { label: "Matchs", desc: "Organis\u00E9s et comp\u00E9tition interne" },
        { label: "H\u00E9bergement", desc: "Nous vous proposons les meilleures options" },
      ],
    },

    headquarters: {
      eyebrow: "Sites",
      headingPre: "Nous, la m\u00E9thodologie. ",
      headingAccent: "Toi, le lieu.",
      sedeCta: "Voir le site \u2192",
      sedes: [
        {
          tag: "Courts Indoor \u00B7 M\u00E1laga",
          name: "Finura P\u00E1del",
          detail: "7 courts couverts \u00B7 M\u00E1laga",
          features: ["Indoor", "Cafétéria", "Salle de sport", "Pro Shop"],
          badge: "7 courts",
        },
        {
          tag: "Courts Outdoor \u00B7 M\u00E1laga",
          name: "Vals Sport Limoneros",
          detail: "11 courts \u00B7 Ouverture prochaine",
          features: ["Outdoor", "Physiothérapie", "Zone fitness", "Pro Shop", "Restaurant", "Piscine"],
          badge: "Ouverture prochaine \u00B7 11 courts",
        },
      ],
      clubCta: {
        eyebrow: "Votre club\u00A0?",
        title: "Votre club. Notre m\u00E9thode.",
        description: "Nous licencions la formation et la m\u00E9thode J3 aux clubs partenaires. O\u00F9 que vous soyez.",
        cta: "Devenir partenaire J3",
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
      specialtyJuniors: "Juniors",
      specialtyAdultos: "Adultos",
      specialtyCompeticion: "Competici\u00F3n",
      badgeRecommended: "J3 Recommended",
      badgeHq: "Headquarter",
      askChatbot: "Pregunta a J3",
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
      eyebrow: "Le Label J3",
      headingPre: "Un standard ",
      headingAccent: "v\u00E9rifiable",
      lede: "Trois niveaux. Une seule exigence : que chaque heure sur le court vous rende du progr\u00E8s r\u00E9el.",
      tiers: [
        {
          key: "hq",
          badge: "HQ \u00B7 LAB",
          title: "J3 Lab M\u00E1laga",
          summary: "La base m\u00E8re. O\u00F9 na\u00EEt la m\u00E9thode et o\u00F9 se forment les coachs.",
          points: [
            "Vals Sport Limoneros \u00B7 Finura Padel",
            "20+ ans \u00E0 former des joueurs",
            "Laboratoire de m\u00E9thodologie vivante",
          ],
        },
        {
          key: "academy",
          badge: "J3 \u00B7 ACADEMY",
          title: "Franchise cl\u00E9 en main",
          summary: "Des clubs qui op\u00E8rent avec la marque, la m\u00E9thode et le soutien de J3.",
          points: [
            "M\u00E9thodologie compl\u00E8te et mat\u00E9riel",
            "Formation Coach360 pour tout le personnel",
            "Onboarding juridique et op\u00E9rationnel",
          ],
        },
        {
          key: "recommended",
          badge: "J3 \u00B7 RECOMMENDED",
          title: "Coachs accr\u00E9dit\u00E9s",
          summary: "Professionnels individuels avec le label J3 actif.",
          points: [
            "Formation Coach360 compl\u00E8te",
            "Acc\u00E8s \u00E0 l\u2019IA et aux outils J3",
            "R\u00E9vision annuelle du label",
          ],
        },
      ],
      criteriaEyebrow: "\u00CAtre Recommended exige",
      criteriaHeading: "Quatre portes \u00E0 franchir \u2014 et \u00E0 garder ouvertes.",
      criteriaItems: [
        { num: "01", title: "Formation Coach360", desc: "Suivre la formation compl\u00E8te dispens\u00E9e par le Lab de M\u00E1laga." },
        { num: "02", title: "M\u00E9thodologie J3", desc: "Appliquer la m\u00E9thode au quotidien dans le club, pas uniquement sur le papier." },
        { num: "03", title: "R\u00E9vision annuelle", desc: "Renouveler le label chaque saison. Se d\u00E9sinscrire co\u00FBte cher au retour." },
        { num: "04", title: "Acc\u00E8s \u00E0 l\u2019IA J3", desc: "Utiliser le moteur Coach360 comme outil de travail habituel." },
      ],
    },

    franquicias: {
      eyebrow: "J3 Academy \u00B7 Pour les clubs",
      headingPre: "Apportez J3 ",
      headingAccent: "\u00E0 votre club",
      lede: "Un mod\u00E8le de franchise cl\u00E9 en main pour clubs et entrepreneurs qui veulent op\u00E9rer avec la marque, la m\u00E9thode et le soutien J3.",
      pillars: [
        { num: "01", title: "M\u00E9thodologie", desc: "La m\u00E9thode J3 compl\u00E8te : programmes par \u00E2ge, niveaux, \u00E9valuation des joueurs et mat\u00E9riel p\u00E9dagogique." },
        { num: "02", title: "Formation", desc: "Coach360 pour l\u2019ensemble du staff. Chaque coach obtient son label Recommended et appara\u00EEt sur la carte." },
        { num: "03", title: "Marque", desc: "Vous op\u00E9rez sous J3 Academy. Manuel de marque, lignes directrices visuelles et pr\u00E9sence sur le r\u00E9seau international." },
        { num: "04", title: "Soutien", desc: "Accompagnement op\u00E9rationnel depuis M\u00E1laga. R\u00E9visions p\u00E9riodiques, mises \u00E0 jour de la m\u00E9thode et communaut\u00E9 des franchis\u00E9s." },
      ],
      ctaEyebrow: "Club ou investisseur ?",
      ctaHeading: "Parlons-en.",
      ctaSub: "Laissez vos coordonn\u00E9es et un partenaire J3 vous contactera avec le dossier complet.",
      ctaPrimary: "Demander des informations",
      ctaPrimaryHref: "mailto:franquicias@j3padel.com?subject=Demande%20d%27informations%20J3%20Academy",
      ctaSecondary: "T\u00E9l\u00E9charger le dossier",
      disclaimer: "Mod\u00E8le en formation. Premi\u00E8re promotion 2026.",
    },

    method: {
      eyebrow: "M\u00E9thode J3",
      headingPre: "Comment ",
      headingAccent: "nous travaillons.",
      steps: [
        {
          title: "Diagnostic individuel",
          desc: "Chaque joueur d\u00E9marre par une \u00E9valuation r\u00E9elle. Nous savons d\u2019o\u00F9 il part avant de lui dire o\u00F9 il peut aller.",
        },
        {
          title: "Planification par objectifs",
          desc: "Aucun programme ne se ressemble. L\u2019entra\u00EEnement est con\u00E7u selon le profil, le niveau et l\u2019objectif de chaque joueur.",
        },
        {
          title: "Entra\u00EEneurs de r\u00E9f\u00E9rence",
          desc: "L\u2019\u00E9quipe technique vient du circuit professionnel. Ils ont form\u00E9 des champions d\u2019Espagne et du monde, et connaissent le chemin.",
        },
        {
          title: "Suivi continu",
          desc: "On mesure la progression, on ne la devine pas. Revue constante des progr\u00E8s avec de vrais ajustements, pas du bruit de fond.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "Ann\u00E9es dans le secteur" },
        { lbl: "Meilleur club du monde 2018" },
        { lbl: "Joueurs professionnels form\u00E9s" },
        { lbl: "Titres sur le circuit professionnel" },
        { lbl: "Joueurs amateurs form\u00E9s" },
      ],
    },

    cta: {
      eyebrow: "Premier contact",
      titlePre: "Commence",
      titleAccent: "aujourd\u2019hui.",
      subtitle: "Dites-nous votre niveau, vos objectifs et vos disponibilit\u00E9s. Nous vous r\u00E9pondons en moins de 24\u00A0heures.",
      button: "\u00C9crire sur WhatsApp",
      note: "Sans engagement \u00B7 Sans formulaires \u00B7 R\u00E9ponse directe",
      waMsg: "Bonjour, je souhaite des informations sur J3Academy",
    },
  },

  /* ── Experience page ── */

  experience: {
    hero: {
      eyebrow: "J3Experience \u00B7 Sur le court \u00B7 International",
      titleLines: ["TU", "CHOISIS", "DE LE VIVRE."],
      subtitleTags: ["Camps", "Stages", "Exp\u00E9riences"],
      subtitleBefore: "",
      subtitleAccent: "sur mesure",
      subtitleAfter: "partout dans le monde",
    },

    statement: {
      eyebrow: "L\u2019exp\u00E9rience",
      lines: [
        { before: "Profite d\u2019", accent: "une" },
        { before: "exp\u00E9rience unique" },
        { before: "avec", accent: "nous." },
      ],
    },

    flowCamp: {
      eyebrow: "Worldwide \u00B7 Kids \u00B7 Juniors \u00B7 Players",
      headingFlow: "Flow",
      headingCamp: "Camp",
      introBefore: "Nous trouvons les lieux, rassemblons les gens et partageons ce que nous savons. ",
      introAccent: "Sur le court et en dehors.",
      jovenesLabel: "Flow Camp \u00B7 Jeunes",
      jovenesTitleAccent: "Flow Camp.",
      jovenesTitleRest: " Padel, valeurs et mental. Pour les jeunes qui voient le sport comme quelque chose de plus.",
      jovenesCards: [
        {
          label: "L\u2019\u00E9v\u00E9nement",
          title: "J3 dans ta ville",
          desc: "Nous trouvons le lieu, rassemblons les jeunes joueurs et organisons tout. Un \u00E9v\u00E9nement intensif d\u2019un ou plusieurs jours avec l\u2019\u00E9quipe J3 sur le court.",
        },
        {
          label: "La m\u00E9thode",
          title: "Technique \u00B7 Tactique \u00B7 Mental",
          desc: "Il ne s\u2019agit pas seulement d\u2019am\u00E9liorer le coup. Le Flow Camp travaille les trois piliers du syst\u00E8me J3 \u2014 parce que le padel de haut niveau commence dans la t\u00EAte.",
        },
        {
          label: "Les entra\u00EEneurs",
          title: "Formation express incluse",
          desc: "Les entra\u00EEneurs locaux participent aux c\u00F4t\u00E9s de J3 sur le court. Ils repartent avec la m\u00E9thode, la vision et une vraie formation. Tout le monde y gagne.",
        },
      ],
      adultosLabel: "Players Camp \u00B7 Adultes",
      adultosTitleAccent: "Players Camp.",
      adultosTitleMid: " Ta ville, notre ",
      adultosTitleSerif: "exp\u00E9rience.",
      adultosCards: [
        {
          label: "Pour qui",
          title: "Pour ceux qui jouent s\u00E9rieusement",
          desc: "Groupes d\u2019amis, \u00E9quipes qui disputent des comp\u00E9titions amateur ou toute personne qui veut vivre un camp sans venir \u00E0 M\u00E1laga.",
        },
        {
          label: "Quoi",
          title: "Intensif dans ta ville",
          desc: "Sessions sur le court avec l\u2019\u00E9quipe J3. Technique, tactique, matchs analys\u00E9s. Dans votre club ou dans celui que nous trouvons ensemble.",
        },
        {
          label: "Le plus",
          title: "Sans sortir de chez toi",
          desc: "L\u2019exp\u00E9rience J3 sans d\u00E9placement. Id\u00E9al si le groupe est grand, si les niveaux varient ou si tu pr\u00E9f\u00E8res jouer sur ton terrain.",
        },
      ],
      ctaText: "Dis-nous ta ville et qui vous \u00EAtes. Le reste, nous nous en occupons.",
      ctaButton: "Demander un Flow Camp",
      waMsg: "Bonjour, je souhaite des informations sur Flow Camp",
    },

    empresas: {
      eyebrow: "Nous connectons des \u00E9quipes \u00B7 Nous activons des marques",
      heading: "Entreprises",
      introBefore: "Le padel comme ",
      introAccent: "outil.",
      introAfter: " Pour connecter votre communaut\u00E9 ou activer votre \u00E9quipe \u2014 nous concevons l\u2019exp\u00E9rience du d\u00E9but \u00E0 la fin.",
      leftPara1: "Nous travaillons avec des marques et des entreprises qui ont compris que le padel est bien plus qu\u2019un sport. C\u2019est un point de rencontre, une activation, un moment qui rassemble.",
      leftPara2: "Dans votre espace ou dans le n\u00F4tre. \u00C0 M\u00E1laga ou l\u00E0 o\u00F9 vous en avez besoin.",
      ctaButton: "Parler \u00E0 l\u2019\u00E9quipe",
      waMsg: "Bonjour, je souhaite des informations sur J3Experience pour les entreprises",
      formatos: [
        {
          tag: "Format 01",
          name: "Meet & Greet",
          desc: "Connectez votre marque \u00E0 la communaut\u00E9 padel. J3 organise l\u2019\u00E9v\u00E9nement, r\u00E9unit les joueurs et cr\u00E9e le moment.",
        },
        {
          tag: "Format 02",
          name: "Activation de marque",
          desc: "Pr\u00E9sence de la marque dans un v\u00E9ritable environnement sportif. Avec de vrais joueurs, pas des figurants.",
        },
        {
          tag: "Format 03",
          name: "Team Building",
          desc: "Votre \u00E9quipe sur le court. Dynamique comp\u00E9titive, travail d\u2019\u00E9quipe et une exp\u00E9rience qui va bien au-del\u00E0 du padel de bureau.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "Ann\u00E9es dans\nle secteur" },
        { lbl: "Meilleur club\ndu monde 2018" },
        { lbl: "Victoires sur le\ncircuit professionnel" },
        { lbl: "Si\u00E8ge officiel\nM\u00E1laga 2014" },
      ],
    },

    cta: {
      titleLine1: "\u00C0 quand",
      titleLine2: "ton",
      titleAccent: "Experience",
      titleEnd: "?",
      body: "\u00C9cris-nous sur WhatsApp. Dis-nous ce que tu cherches et on le con\u00E7oit ensemble.",
      button: "Demander maintenant",
      note: "R\u00E9ponse en moins de 24h \u00B7 Sans engagement",
      waMsg: "Bonjour, je souhaite des informations sur J3Experience",
    },
  },
} as const satisfies Dictionary;

export default fr;
