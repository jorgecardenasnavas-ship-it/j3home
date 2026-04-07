import type { Dictionary } from "./types";

export const es = {
  /* ── Shared components ── */

  nav: {
    soluciones: "Premium",
    acceder: "Acceder",
    inicio: "Inicio",
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
    tooltip: "Hablemos",
  },

  /* ── Home page ── */

  hero: {
    play: "Play.",
    coach: "Coach.",
    manage: "Manage.",
    milestones: [
      { year: "2004", text: "Empieza el camino" },
      { year: "2014", text: "Sede World Padel Tour" },
      { year: "2018", text: "Mejor club del mundo" },
      { year: "2022", text: "Mejor entrenador espa\u00F1ol en ranking pro" },
      { year: "2024", text: "10\u00BA aniversario de J3" },
      { year: "11\u00D7", text: "T\u00EDtulos en circuito profesional" },
    ],
    tagline: "Cantera campeona de Espa\u00F1a y del Mundo",
    cta1: "Ver productos",
    cta2: "Coach360",
    credsMobile: [
      { val: "#1", label: "Mejor club 2018" },
      { val: "20+", label: "A\u00F1os" },
      { val: "WPT", label: "Sede 2014" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", label: "Victorias pro" },
      { val: "\uD83C\uDFC6", label: "Campeones" },
    ],
  },

  impact: {
    line1: "La academia",
    line2: "de p\u00E1del #1",
    line3: "en la Costa del Sol.",
    tagline: "Desde 2004 \u00B7 M\u00E1laga, Espa\u00F1a",
  },

  system: {
    blocks: [
      { line1: "El juego", line2: "ha cambiado." },
      { line1: "El coach", line2: "evolucionado." },
      { line1: "La gesti\u00F3n", line2: "optimizada." },
    ],
    nodes: ["Coach360", "J3PTV", "Academy", "Business", "Experience", "Partner"],
  },

  home: {
    line1: "Un entorno completo para aficionados, jugadores y entrenadores exigentes.",
    line2: "Un sistema de gesti\u00F3n integral para academias y clubes de p\u00E1del.",
    closer: "Optimizar. Automatizar. Escalar.",
  },

  products: {
    cards: [
      {
        tag: "Online \u00B7 Formaci\u00F3n",
        forLabel: "Entrenadores de p\u00E1del",
        description: "Criterio, m\u00E9todo y comunidad. Contenido nuevo cada semana.",
        buttons: ["Ver m\u00E1s", "Unirse"],
      },
      {
        tag: "Online \u00B7 Contenido \u00B7 Entretenimiento",
        forLabel: "Todos los perfiles",
        description: "An\u00E1lisis, debate y el juego moderno sin ruido.",
        buttons: ["Ver m\u00E1s", "Acceder"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Next Gen",
        description: "El mismo sistema del circuito profesional, adaptado a ti.",
        buttons: ["Entrena con nosotros"],
      },
      {
        tag: "Automatizaci\u00F3n \u00B7 Gesti\u00F3n \u00B7 Optimizaci\u00F3n",
        forLabel: "Academias y clubes",
        description: "Aumenta el rendimiento con nuestro know-how y acompa\u00F1amiento 1:1.",
        buttons: ["Saber m\u00E1s", "Agendar llamada"],
      },
      {
        tag: "Servicio \u00B7 Presencial",
        forLabel: "Clubes, academias y grupos",
        buttons: ["Solicitar"],
      },
      {
        tag: "Expansi\u00F3n \u00B7 Llave en mano",
        forLabel: "Clubes y academias",
        buttons: ["Saber m\u00E1s"],
      },
    ],
  },

  nosotros: {
    label: "Qui\u00E9nes somos",
    heading1: "M\u00E1s de 20 a\u00F1os",
    heading2: "dentro del p\u00E1del.",
    body: "Empezamos cuando el p\u00E1del era otro deporte. Hemos formado jugadores que hoy est\u00E1n en el circuito, gestionado el mejor club del mundo y entrenado a profesionales del WPT. Eso es lo que hay detr\u00E1s.",
    link: "Conoce nuestra trayectoria",
    stats: [
      { val: "#1", line1: "Mejor club /", line2: "del mundo 2018" },
      { val: "20+", line1: "A\u00F1os en /", line2: "el sector" },
      { val: "\uD83C\uDFC6", line1: "Campeones /", line2: "Espa\u00F1a y Mundo" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", line1: "Circuito /", line2: "profesional" },
    ],
  },

  contacto: {
    label: "Contacto",
    heading1: "Cu\u00E9ntanos",
    heading2: "qu\u00E9 buscas.",
    body: "Si has llegado hasta aqu\u00ED algo te ha resonado. Cu\u00E9ntanos d\u00F3nde est\u00E1s y qu\u00E9 buscas.",
    email: "Email",
    telefono: "Tel\u00E9fono",
    sede: "Sede",
    placeholders: {
      nombre: "Nombre",
      email: "Email",
      mensaje: "Mensaje",
    },
    soyOptions: [
      "Soy...",
      "Entrenador / Coach",
      "Jugador amateur",
      "Aficionado al p\u00E1del",
      "Director de academia / club",
      "Interesado en franquicia",
      "Otro",
    ],
    interesOptions: [
      "Me interesa...",
      "Coach360 \u00B7 Formaci\u00F3n",
      "J3PTV \u00B7 Contenido",
      "Academy \u00B7 Entrenar en M\u00E1laga",
      "Franquicia \u00B7 Sistema llave en mano",
      "J3 Experience \u00B7 Venid a mi club",
      "Otra cosa",
    ],
    submit: "Enviar",
    sending: "Enviando...",
    sent: "\u2713 Enviado",
    error: "Por favor, completa nombre, email y mensaje.",
  },

  /* ── Story page ── */

  story: {
    hero: {
      prefix: "M\u00E1s de",
      years: "20 a\u00F1os",
      dentro: "dentro",
      delJuego: "del juego.",
      sub1: "Uno de los equipos m\u00E1s",
      sub2: "influyentes",
      sub3: "en el mundo del p\u00E1del.",
      desde: "Desde 2004",
      location: "M\u00E1laga, Espa\u00F1a",
    },

    impact: {
      line1: "Apuntamos al cielo, pero",
      line2: "siempre con los pies en la tierra.",
      fact1: "Entrenamos jugadores en el top 8 del circuito profesional.",
      fact2: "Diez a\u00F1os al frente de uno de los mejores clubes del mundo.",
      closer: "Y seguimos en pista.",
      proudLabel: "De lo que m\u00E1s orgullosos estamos",
      cantera: [
        "Formamos a decenas de jóvenes.",
        "Algunos levantaron títulos a nivel nacional y mundial.",
        "Otros cumplieron su objetivo de jugar en el circuito profesional.",
        "Y muchos lograron el sueño de estudiar en la universidad que querían.",
      ],
      historyLabel: "Nuestra historia",
    },

    stats: {
      header: "Nuestra historia en n\u00FAmeros",
      items: [
        { val: 20, suffix: "+", lbl: "A\u00F1os en el\nsector" },
        { prefix: "#", val: 1, lbl: "Mejor club\ndel mundo 2018" },
        { val: 11, lbl: "T\u00EDtulos profesionales\nen 18 finales disputadas" },
        { val: 100, suffix: "+", lbl: "Coaches formados\nen Coach360" },
        { label: "WPT", val: 0, lbl: "Sede oficial\nM\u00E1laga 2014" },
      ],
    },

    timeline: {
      sectionLabel: "Trayectoria",
      heading1: "Hitos que",
      heading2: "nos definen",
      eras: ["Los inicios", "Ocean Padel \u00B7 J3Padel", "Reserva del Higuer\u00F3n", "Cambio de juego"],
      entries: [
        {
          year: "Principios 2000",
          title: "El p\u00E1del nos encuentra",
          desc: "Descubrimos el p\u00E1del como aficionados. Lo que empieza como un deporte se convierte r\u00E1pidamente en obsesi\u00F3n. A\u00F1os compitiendo por toda Andaluc\u00EDa, asiduos en la selecci\u00F3n malague\u00F1a y representando a la Universidad de M\u00E1laga (UMA).",
        },
        {
          year: "2005-2008",
          title: "Las primeras clases",
          desc: "Mientras seguimos compitiendo, empezamos a dar clases en paralelo. La Capellan\u00EDa y el Club de Tenis M\u00E1laga son los primeros sitios donde comenzamos a ense\u00F1ar lo que el juego nos hab\u00EDa ense\u00F1ado.",
        },
        {
          year: "2009-2010",
          title: "Smash Padel \u2192 Ocean Padel",
          desc: "Nos juntamos por primera vez los tres \u2014 Javi, Jorge y Jordi Mu\u00F1oz \u2014 para montar una academia de menores en Smash Padel. Poco despu\u00E9s se transforma en Ocean Padel, y empieza la escala real.",
          highlight: true,
          image: "/images/story/timeline/ocean-padel.jpg",
        },
        {
          year: "2010-2014",
          title: "La mejor academia de menores de Espa\u00F1a",
          desc: "Ocean Padel se convierte en referencia nacional. Aqu\u00ED se forman \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado, Bea Gonz\u00E1lez y toda la primera generaci\u00F3n. Varios llegan a la selecci\u00F3n espa\u00F1ola y compiten internacionalmente.",
          badge: "Campeones Andaluc\u00EDa \u00B7 Espa\u00F1a \u00B7 Mundo (menores)",
        },
        {
          year: "2014",
          title: "Nace J3Padel",
          desc: "Cuando cierra Ocean Padel, el equipo se divide pero la marca J3 nace como entidad propia. Una idea que se consolid\u00F3. Organizamos el WPT de M\u00E1laga con casi 300 parejas inscritas.",
          badge: "World Padel Tour \u00B7 Sede oficial M\u00E1laga 2014",
          image: "/images/story/timeline/j3padel-fundadores.jpeg",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "En las mismas instalaciones de Ocean Padel abrimos un club propio. Un proyecto que no prosper\u00F3, pero que dej\u00F3 una lecci\u00F3n clara sobre la gesti\u00F3n.",
        },
        {
          year: "2016",
          title: "Higuer\u00F3n Resort",
          desc: "Nos incorporamos a Reserva del Higuer\u00F3n \u2014 hoy Higuer\u00F3n Resort. Comienza el ciclo m\u00E1s largo y m\u00E1s exigente del proyecto.",
          image: "/images/story/timeline/higueron-resort.jpg",
        },
        {
          year: "Finales 2016",
          title: "Jordi Mu\u00F1oz deja el proyecto",
          desc: "Jordi abandona M\u00E1laga y el proyecto J3 por motivos personales. Su esencia sigue presente. Javi y Jorge contin\u00FAan con el proyecto, aunque sin la J que les abri\u00F3 el camino.",
          image: "/images/story/timeline/tres-j.jpeg",
          imagePosition: "center 25%",
        },
        {
          year: "2018",
          title: "Mejor Club de P\u00E1del del Mundo",
          desc: "Higuer\u00F3n Resort, bajo nuestra gesti\u00F3n, es reconocido como el mejor club de p\u00E1del del mundo. Un t\u00EDtulo que llega despu\u00E9s de dos a\u00F1os de trabajo silencioso y ambicioso.",
          badge: "#1 Best Padel Club in the World \u00B7 2018",
          highlight: true,
          image: "/images/story/timeline/mejor-club-2018.jpeg",
        },
        {
          year: "2016-2022",
          title: "Escuela de competici\u00F3n \u00B7 Internacionalizaci\u00F3n",
          desc: "Durante seis a\u00F1os, el foco est\u00E1 en la cantera y en la internacionalizaci\u00F3n. Lo que ya hicimos en Ocean Padel, lo replicamos de nuevo. Adem\u00E1s, conseguimos que la Costa del Sol se convirtiese en destino internacional de jugadores amateurs.",
        },
        {
          year: "2021",
          title: "\u00C1lex Ruiz y Franco Stupaczuk",
          desc: "Volvemos al alto rendimiento. El resultado es hist\u00F3rico: acabamos el a\u00F1o en el top 4 del mundo en el WPT.",
          badge: "Top 4 Mundial WPT \u00B7 2021",
          highlight: true,
          image: "/images/story/timeline/higueron-pro.jpeg",
        },
        {
          year: "2022",
          title: "Final WPT Marbella",
          desc: "Pareja 100% malague\u00F1a y formada en Ocean Padel / J3. Final del WPT en Marbella \u2014 en casa, con los nuestros en la grada.",
          badge: "WPT Marbella Master \u00B7 2022",
          image: "/images/story/timeline/wpt-marbella-2022.jpeg",
        },
        {
          year: "Diciembre 2022",
          title: "\u00C1lex Ruiz y Momo Gonz\u00E1lez \u00B7 Top 5",
          desc: "Alcanzan el top 5 del mundo. Dos jugadores formados en Ocean Padel, entrenados por J3, en lo m\u00E1s alto del circuito profesional.",
          badge: "Top 5 Mundial \u00B7 Diciembre 2022",
          highlight: true,
          image: "/images/story/timeline/momo-alex-jorge.jpeg",
        },
        {
          year: "2023-2024",
          title: "Varlion",
          desc: "Javi entra en Varlion como team manager de la marca. Etapa de aprendizaje estrat\u00E9gico fuera de pista.",
        },
        {
          year: "2024",
          title: "Fin de un ciclo",
          desc: "Nos desvinculamos de Higuer\u00F3n Resort y de Varlion. Casi una d\u00E9cada gestionando el que fue el mejor club del mundo. Ese ciclo se cierra.",
          badge: "Cambio de juego",
        },
        {
          year: "2024-2025",
          title: "De M\u00E1laga al mundo",
          desc: "Dedicados en exclusiva a construir J3Padel como ecosistema: formaci\u00F3n, gesti\u00F3n, contenido y alto rendimiento.",
        },
        {
          year: "Mediados 2025",
          title: "Nace Coach360",
          desc: "Formaci\u00F3n online para entrenadores de p\u00E1del. Tras viajar por todo el mundo y ver el vac\u00EDo que la expansi\u00F3n del p\u00E1del hab\u00EDa generado en el \u00E1mbito formativo, decidimos aportar todo nuestro conocimiento de manera \u00FAnica. Creamos la primera comunidad de entrenadores.",
          badge: "Coach360 \u00B7 100+ coaches \u00B7 40+ lecciones",
        },
        {
          year: "2026",
          title: "Nueva sede \u00B7 M\u00E1laga capital",
          desc: "J3Padel vuelve a tener sede f\u00EDsica \u2014 Finura Padel y Vals Los Limoneros. El ecosistema completo: Coach360, J3PTV, Academy, Business y Experience.",
          badge: "Finura Padel \u00B7 Vals Los Limoneros \u00B7 Verano 2026",
        },
      ],
    },

    team: {
      label: "El equipo",
      heading1: "Dos personas.",
      heading2: "Un mismo",
      heading2Accent: "criterio.",
      members: [
        {
          num: "01",
          role: "Co-founder \u00B7 CEO",
          first: "Javi",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Jugador, entrenador, ejecutor. Crece en la pista y sigue entrenando, pero con un don natural para convertir ideas en estructura. Organiza el WPT M\u00E1laga con casi 300 parejas, gestiona el Higuer\u00F3n hasta convertirlo en el mejor club del mundo y hoy lidera la operativa de todo el ecosistema J3.",
          quote: "Sin ejecuci\u00F3n, la visi\u00F3n se queda en conversaci\u00F3n.",
        },
        {
          num: "02",
          role: "Co-founder \u00B7 CSO",
          first: "Jorge",
          last: "C\u00E1rdenas",
          last2: "Navas",
          bio: "Jugador, entrenador, estratega. Siempre con la visi\u00F3n puesta en lo que viene. Define la metodolog\u00EDa J3 desde la pista, forma a decenas de menores que llegan a lo m\u00E1s alto y lleva jugadores al top 5 mundial. En 2022, el entrenador espa\u00F1ol mejor situado en el ranking. Hoy dise\u00F1a hacia d\u00F3nde va J3Padel.",
          quote: "Ver el juego antes de que ocurra. Eso es entrenar.",
        },
      ],
    },

    players: {
      label: "Jugadores profesionales",
      heading1: "Cada jugador",
      heading2: "tiene su",
      heading2Accent: "roadmap.",
      description: "Un sistema desarrollado por cada uno de los jugadores que hemos entrenado.",
      heroLabel: "Formados desde base \u00B7 Lo m\u00E1s alto del circuito",
      nextGenLabel: "De la cantera al circuito profesional",
      nextGenProLabel: "Llegaron como promesa \u00B7 Consolidados en el circuito",
      featuredLabel: "Colaboraciones profesionales destacadas",
      sharedLabel: "Tambi\u00E9n han compartido equipo con J3",
      heroPlayers: [
        { info: "Formado desde joven en Ocean Padel. Alcanz\u00F3 el top 4 mundial.", tag: "Top 4 Mundial" },
        { info: "Cantera Ocean Padel / J3. 100 % malague\u00F1o. Top 5 mundial.", tag: "Top 5 Mundial" },
        { info: "Top 8 mundial en el PPT. Cofundador de J3Padel.", tag: "Cofundador J3 \u00B7 Top 8 PPT" },
      ],
      nextGenTags: [
        "Campe\u00F3n de Espa\u00F1a y del Mundo",
        "Campeona de Espa\u00F1a y del Mundo",
        "Campeona de Espa\u00F1a \u00B7 Circuito Pro",
        "Campe\u00F3n de Espa\u00F1a \u00B7 Circuito Pro",
        "Campe\u00F3n de Espa\u00F1a y del Mundo Junior",
      ],
      nextGenProTags: [
        "Next Gen \u2192 Top 30",
        "Next Gen \u2192 Top 30",
      ],
      featuredPlayers: [
        { info: "5 finales y pareja n.\u00BA 4 del mundo en 2021.", tag: "3 T\u00EDtulos \u00B7 #4 Mundial 2021" },
        { info: "Semifinales del P2 Premier Padel en Mil\u00E1n 2022.", tag: "SF P2 Mil\u00E1n 2022" },
        { info: "Semifinales del P2 Premier Padel en Mil\u00E1n 2022.", tag: "SF P2 Mil\u00E1n 2022" },
        { info: "T\u00EDtulo FIP Platinum en Ciudad de M\u00E9xico.", tag: "T\u00EDtulo FIP Platinum CDMX" },
      ],
      sharedTags: [
        "Top Mundial",
        "Top Mundial",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
        "Circuito Pro",
      ],
    },

    philosophy: {
      label: "Filosof\u00EDa",
      word1: "Criterio.",
      word2: "M\u00E9todo.",
      word3: "Sistema.",
      body: "No entrenamos por ejercicios sueltos. No gestionamos por intuici\u00F3n. Cada cosa que hacemos en J3Padel responde a un sistema construido durante 20 a\u00F1os.",
      pillars: [
        {
          num: "01",
          label: "Criterio",
          title: "Saber por qu\u00E9, no solo qu\u00E9",
          body: "Un entrenador con criterio no ejecuta ejercicios \u2014 toma decisiones.",
        },
        {
          num: "02",
          label: "M\u00E9todo",
          title: "Repetibilidad y progresi\u00F3n",
          body: "El m\u00E9todo J3 est\u00E1 dise\u00F1ado para producir mejora sistem\u00E1tica. Sin m\u00E9todo, el talento no escala.",
        },
        {
          num: "03",
          label: "Sistema",
          title: "Estructura que funciona sola",
          body: "Un buen sistema trabaja cuando t\u00FA no est\u00E1s. Lo hemos construido para clubs, academias y entrenadores.",
        },
        {
          num: "04",
          label: "Pista",
          title: "Todo parte del juego real",
          body: "Cada concepto del sistema J3 ha pasado por la pista \u2014 con jugadores reales, en competici\u00F3n real.",
        },
      ],
    },

    clubs: {
      label: "Gesti\u00F3n de clubes",
      heading1: "Clubes en los que",
      heading2: "hemos dejado huella.",
      description: "Direcci\u00F3n t\u00E9cnica, gesti\u00F3n operativa y desarrollo de cantera.",
      originLabel: "Donde empez\u00F3 todo",
      presentLabel: "En la actualidad",
      lessonAside: "Un proyecto que no prosper\u00F3, pero dej\u00F3 una lecci\u00F3n clara.",
      origins: [
        {
          flag: "M\u00E1laga \u00B7 2009\u20132014",
          name: "Ocean Padel",
          detail: "Donde todo empez\u00F3 a escala real. La mejor academia de menores de Espa\u00F1a. Aqu\u00ED se formaron \u00C1lex Ruiz, Momo Gonz\u00E1lez, Guille Collado y toda la primera generaci\u00F3n J3.",
          highlight: "Mejor academia de menores",
        },
        {
          flag: "M\u00E1laga \u00B7 2014",
          name: "Belife",
          detail: "Sede oficial del World Padel Tour. Cerca de 300 parejas inscritas.",
          highlight: "WPT \u00B7 Sede oficial 2014",
        },
      ],
      heroClub: {
        flag: "Marbella \u00B7 2016\u20132024",
        name: "Reserva del Higuer\u00F3n",
        detail: "Casi una d\u00E9cada gestionando el club reconocido como el mejor del mundo. Direcci\u00F3n t\u00E9cnica completa, cantera de \u00E9lite y operativa a gran escala.",
        highlight: "Best Padel Club in the World \u00B7 2018",
        years: "9",
      },
      lesson: {
        flag: "M\u00E1laga \u00B7 2015",
        name: "J3Padel Indoor",
      },
      present: [
        {
          flag: "M\u00E1laga capital \u00B7 2026",
          name: "Finura Padel",
          detail: "Primera sede de la nueva etapa en M\u00E1laga capital.",
          highlight: "Sede actual \u00B7 Operativa",
        },
        {
          flag: "Puerto de la Torre \u00B7 2026",
          name: "Vals Los Limoneros",
          detail: "Nueva instalaci\u00F3n. Club de nueva apertura.",
          highlight: "Pr\u00F3xima apertura \u00B7 Verano 2026",
        },
      ],
    },

    brands: {
      currentLabel: "Marcas que conf\u00EDan en J3Padel",
      pastLabel: "Han confiado en J3Padel",
    },

    cta: {
      label: "20 a\u00F1os despu\u00E9s",
      heading1: "Hasta aqu\u00ED,",
      heading2: "todo es historia.",
      body: "Lo que viene se escribe con las personas que decidan ser parte. Si eres entrenador, tienes un club o simplemente quieres entrenar con nosotros \u2014 este es el momento.",
      buttons: ["Habla con nosotros", "Coach360", "Academy", "Business"],
    },
  },
} as const satisfies Dictionary;
