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
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52 },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52 },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56 },
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
      { year: "11\u00D7", text: "Titres sur le circuit professionnel" },
    ],
    tagline: "Centre de formation champion d\u2019Espagne et du Monde",
    cta1: "Voir les produits",
    cta2: "Coach360",
    credsMobile: [
      { val: "#1", label: "Meilleur club 2018" },
      { val: "20+", label: "Ann\u00E9es" },
      { val: "WPT", label: "Si\u00E8ge 2014" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", label: "Victoires pro" },
      { val: "\uD83C\uDFC6", label: "Champions" },
    ],
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
        buttons: ["En savoir plus", "Rejoindre"],
      },
      {
        tag: "En ligne \u00B7 Contenu \u00B7 Divertissement",
        forLabel: "Tous les profils",
        description: "Analyse, d\u00E9bat et le jeu moderne sans bruit.",
        buttons: ["En savoir plus", "Se connecter"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Next Gen",
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
    stats: [
      { val: "#1", line1: "Meilleur club /", line2: "du monde 2018" },
      { val: "20+", line1: "Ann\u00E9es dans /", line2: "le secteur" },
      { val: "\uD83C\uDFC6", line1: "Champions /", line2: "d\u2019Espagne et du Monde" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", line1: "Circuit /", line2: "professionnel" },
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

    stats: {
      header: "Notre histoire en chiffres",
      items: [
        { val: 20, suffix: "+", lbl: "Ann\u00E9es dans\nle secteur" },
        { prefix: "#", val: 1, lbl: "Meilleur club\ndu monde 2018" },
        { val: 11, lbl: "Titres professionnels\nen 18 finales disput\u00E9es" },
        { val: 100, suffix: "+", lbl: "Coaches form\u00E9s\nchez Coach360" },
        { label: "WPT", val: 0, lbl: "Si\u00E8ge officiel\nM\u00E1laga 2014" },
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
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "Dans les m\u00EAmes installations qu\u2019Ocean Padel, nous ouvrons un club propre. Un projet qui n\u2019a pas abouti, mais qui a laiss\u00E9 une le\u00E7on claire sur la gestion.",
        },
        {
          year: "2016",
          title: "Higuer\u00F3n Resort",
          desc: "Nous int\u00E9grons Reserva del Higuer\u00F3n \u2014 aujourd\u2019hui Higuer\u00F3n Resort. Le cycle le plus long et le plus exigeant du projet commence. Jordi Mu\u00F1oz quitte M\u00E1laga et le projet J3 pour des raisons personnelles. Son empreinte reste pr\u00E9sente.",
        },
        {
          year: "2018",
          title: "Meilleur Club de Padel du Monde",
          desc: "Higuer\u00F3n Resort, sous notre direction, est reconnu comme le meilleur club de padel du monde. Un titre qui arrive apr\u00E8s deux ans de travail discret et ambitieux.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
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
        },
        {
          year: "2022-2023",
          title: "\u00C1lex Ruiz et Momo Gonz\u00E1lez",
          desc: "Une paire 100% malaguen\u00F1a form\u00E9e \u00E0 Ocean Padel / J3. Ils atteignent le top 5 mondial. Finale du WPT \u00E0 Marbella \u2014 \u00E0 la maison.",
          badge: "Top 5 Mondial \u00B7 Finale WPT Marbella",
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
      heading2: "Une m\u00EAme vision.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "C\u00E1rdenas",
          bio: "Joueur, entra\u00EEneur, ex\u00E9cutant. Il grandit sur le terrain et continue d\u2019entra\u00EEner, avec un don naturel pour transformer les id\u00E9es en structure. Il organise le WPT M\u00E1laga avec pr\u00E8s de 300 paires, g\u00E8re le Higuer\u00F3n jusqu\u2019\u00E0 en faire le meilleur club du monde et dirige aujourd\u2019hui l\u2019ensemble de l\u2019\u00E9cosyst\u00E8me J3.",
          quote: "Sans ex\u00E9cution, la vision reste une simple conversation.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "C\u00E1rdenas",
          bio: "Joueur, entra\u00EEneur, strat\u00E8ge. Toujours tourn\u00E9 vers ce qui arrive. Il d\u00E9finit la m\u00E9thodologie J3 depuis le terrain, forme des dizaines de jeunes qui atteignent les sommets et am\u00E8ne des joueurs au top 5 mondial. Aujourd\u2019hui, il dessine l\u2019avenir de J3Padel.",
          quote: "Voir le jeu avant qu\u2019il ne se produise. C\u2019est \u00E7a, entra\u00EEner.",
        },
      ],
    },

    players: {
      label: "Joueurs",
      heading1: "Form\u00E9s avec",
      heading2: "le syst\u00E8me J3.",
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
        "Next Gen \u2192 Top 30",
        "Next Gen \u2192 Top 30",
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
} as const satisfies Dictionary;

export default fr;
