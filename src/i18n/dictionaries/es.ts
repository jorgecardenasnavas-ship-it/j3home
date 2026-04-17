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
      { year: "11\u00D7", text: "Campe\u00F3n en el circuito profesional" },
    ],
    tagline: "Cantera campeona de Espa\u00F1a y del Mundo",
    cta1: "Ver productos",
    cta2: "Coach360",
    accentTouch: {
      topLine: "El mundo perdi\u00F3 la tilde.",
      accentWord: "Nosotros",
      afterAccent: "la jugamos.",
      labelLeft: "P\u00C1DEL \u00B7 CON \u00B7 ACENTO",
      labelRight: "DESDE 2004 \u2014 M\u00C1LAGA",
    },
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
        buttons: ["Entrar a Coach360"],
      },
      {
        tag: "Online \u00B7 Contenido \u00B7 Entretenimiento",
        forLabel: "Todos los perfiles",
        description: "An\u00E1lisis, debate y el juego moderno sin ruido.",
        buttons: ["Ver m\u00E1s", "Acceder"],
      },
      {
        tag: "Headquarters \u00B7 Stages \u00B7 Camps",
        forLabel: "Kids \u00B7 Amateur \u00B7 Junior",
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
    statsLabel: "Por los n\u00FAmeros",
    stats: [
      { val: "#1", line1: "Mejor club /", line2: "del mundo 2018" },
      { val: "20+", line1: "A\u00F1os /", line2: "en el sector" },
      { val: "WPT", line1: "Sede oficial /", line2: "desde 2014" },
      { val: "18", line1: "T\u00EDtulos /", line2: "en el circuito profesional" },
      { val: "100+", line1: "Coaches /", line2: "formados m\u00E9todo J3" },
      { val: "Top 5", line1: "Ranking /", line2: "mundial 2022" },
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

    bridge: {
      line1: "Jugamos. Entrenamos. Dirigimos.",
      line2: "Nuestra casa es el 20\u00D710.",
    },

    accent: {
      eyebrow: "Nuestra firma",
      slogan: ["P\u00E1del.", "Con.", "Acento."],
      manifesto: [
        "Cuando el deporte sali\u00F3 de Espa\u00F1a, perdi\u00F3 la tilde.",
        "Nosotros nunca la soltamos.",
        "Porque el acento no es ortograf\u00EDa \u2014 es origen.",
      ],
    },

    stats: {
      header: "Nuestra historia en n\u00FAmeros",
      items: [
        { val: 20, suffix: "+", lbl: "Años de\nexperiencia" },
        { prefix: "#", val: 1, lbl: "Mejor club\ndel mundo 2018" },
        { val: 100, suffix: "+", lbl: "Coaches formados\nen Coach360" },
        { val: 2000, suffix: "+", lbl: "Jugadores amateur\nformados" },
        { val: 30, suffix: "+", lbl: "Jugadores profesionales\nentrenados" },
        { label: "N.\u00BA1", val: 0, lbl: "Entrenador espa\u00F1ol\nen ranking WPT 2022" },
        { val: 11, lbl: "T\u00EDtulos profesionales\nen 18 finales disputadas" },
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
          image: "/images/story/timeline/franco-alex-pozzoni-jorge.jpeg",
          imagePosition: "center 55%",
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
      label: "El ADN",
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
      sharedLabel: "También hemos compartido pista con",
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
        "Junior \u2192 Top 30",
        "Junior \u2192 Top 30",
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

  /* ── Academy page ── */

  academy: {
    hero: {
      locationLabel: "M\u00E1laga \u00B7 Costa del Sol",
      titleLine1: "Repetir.",
      titleLine2: "Ajustar.",
      titleLine3a: "",
      titleLine3b: "Avanzar.",
      ctaLabel: "Explorar programas",
      subtitleBefore: "La mejor",
      subtitleAccent: "academia",
      subtitleAfter: "de p\u00E1del",
      subtitleLocation: "en la Costa del Sol",
      subtitleLine2: "Desde 2004 entrenando jugadores de todos los niveles.",
      eyebrow: "Coaches recomendados",
      heading: "Encuentra entrenadores con criterio, m\u00E9todo y orden.",
      headingPre: "Encuentra entrenadores con ",
      headingAccent: "criterio, m\u00E9todo y orden.",
      headingPost: "",
      sub: "Entrenadores que validamos personalmente. Encuentra el tuyo cerca de ti.",
      ctaPrimary: "Buscar coach cerca",
      ctaSecondary: "Ven a entrenar \u00B7 M\u00E1laga",
      filtersTitle: "Filtrar",
      countTemplate: "{count} coaches \u00B7 {numCountries} pa\u00EDses \u00B7 {countries} ciudades",
      sedesNavLabel: "Sedes J3",
    },

    band: {
      eyebrow: "Nuestro laboratorio",
      headingLead: "Desde 2004.",
      headingAccent: "M\u00E1laga, Espa\u00F1a.",
      description: "Ubicada en el coraz\u00F3n de la Costa del Sol, combina alto rendimiento, metodolog\u00EDa propia y un equipo t\u00E9cnico con experiencia en el circuito profesional.",
    },

    claim: {
      quote: "Algunos quieren que suceda, otros desean que pase, los dem\u00E1s hacen que ocurra.",
      author: "Michael Jordan",
    },

    banner: {
      headingBefore: "La academia de ",
      headingAccent: "referencia",
      headingAfter: "en la Costa del Sol.",
      tagline: "Todas las edades \u00B7 Todos los niveles \u00B7 Todo el a\u00F1o",
    },

    statement: {
      eyebrow: "Nuestra misi\u00F3n",
      lines: [
        { before: "El talento", accent: "se entrena." },
        { before: "El car\u00E1cter", accent: "se forja." },
      ],
    },

    proof: {
      eyebrow: "Trayectoria \u00B7 Resultados",
      quoteOpen: "\u201CNuestros jugadores no solo llegan al circuito. ",
      quoteAccent: "Destacan",
      quoteClose: ".\u201D",
      imageAlt: "Jugadores J3 Academy en el circuito profesional",
      players: [
        { name: "Guille Collado", info: "Circuito profesional WPT / APT" },
        { name: "\u00C1lex Ruiz", info: "Circuito profesional" },
        { name: "Bea Gonz\u00E1lez", info: "Circuito femenino" },
        { name: "Momo Gonz\u00E1lez", info: "Circuito profesional" },
        { name: "Martina Fassio", info: "Circuito profesional" },
        { name: "Jos\u00E9 Jim\u00E9nez", info: "Circuito profesional" },
      ],
    },

    programs: {
      eyebrow: "Estructura J3",
      headingPre: "\u00BFHasta d\u00F3nde quieres ",
      headingAccent: "llegar?",
      headingSub: "Misma estructura en cada sede \u2014 tres caminos dise\u00F1ados para cada edad, nivel y objetivo.",
      juniorsLabel: "Juniors",
      juniorsCards: [
        {
          tag: "Fundamentos",
          title: "Kinder",
          sub: "4+ a\u00F1os",
          ctaLabel: "Solicitar info",
          waMsg: "Hola, quiero info sobre Kinder (4-10 a\u00F1os)",
        },
        {
          tag: "Tecnificaci\u00F3n",
          title: "Kids",
          sub: "10+ a\u00F1os",
          ctaLabel: "Solicitar info",
          waMsg: "Hola, quiero info sobre Kids (10+)",
        },
        {
          tag: "Competici\u00F3n",
          title: "Junior",
          sub: "14+ a\u00F1os",
          ctaLabel: "Solicitar info",
          waMsg: "Hola, quiero info sobre Junior (14+ competici\u00F3n)",
        },
        {
          tag: "Alto rendimiento",
          title: "Next Gen",
          sub: "16+ a\u00F1os",
          ctaLabel: "Solicitar info",
          waMsg: "Hola, quiero info sobre Next Gen (16+ circuito)",
        },
      ],
      adultosLabel: "Programa mensual",
      adultosCards: [
        {
          tag: "Adultos",
          title: "Amateur",
          sub: "Tu rutina semanal",
          ctaLabel: "Apuntarme",
          waMsg: "Hola, quiero info sobre el programa mensual de adultos",
        },
      ],
      adultosInfoEyebrow: "Escuela regular",
      adultosInfoHeadingPre: "La escuela",
      adultosInfoHeadingAccent: "amateur.",
      adultosInfoTagline: "Mejora con constancia.",
      adultosInfoDesc: "Programaci\u00F3n anual abierta a todos los niveles. Tu ritmo, tu grupo, tu horario.",
      adultosFeatures: [
        { label: "Niveles", desc: "Iniciaci\u00F3n, intermedio, avanzado y competici\u00F3n" },
        { label: "Formato", desc: "Escuela regular con programaci\u00F3n anual" },
        { label: "Horarios", desc: "Ma\u00F1anas, tardes, entre semana o fin de semana" },
      ],
      intensiveCards: [
        {
          tag: "Formato intensivo",
          title: "Camps \u00B7 Stages",
          sub: "Programas personalizados",
          ctaLabel: "Reservar",
          waMsg: "Hola, quiero reservar Intensive Training",
        },
      ],
      intensiveLabel: "Intensive Training",
      intensiveEyebrow: "Camps \u00B7 Stages \u00B7 Programas personalizados",
      intensiveTitlePre: "Ven a entrenar",
      intensiveTitleAccent: "con nosotros.",
      intensiveDesc: "Dise\u00F1amos un plan a tu medida.",
      intensiveImageAlt: "Grupo de jugadores en stage de p\u00E1del",
      intensiveCtaBook: "Reservar tu training",
      intensiveCtaInfo: "M\u00E1s informaci\u00F3n",
      intensiveWaMsgBook: "Hola, quiero reservar Intensive Training",
      intensiveWaMsgInfo: "Hola, quiero info sobre Intensive Training",
      intensiveInfoEyebrow: "Formato flexible",
      intensiveInfoHeadingPre: "Tu training,",
      intensiveInfoHeadingAccent: "a tu medida.",
      intensiveInfoDesc: "Dise\u00F1amos cada programa seg\u00FAn lo que buscas: frecuencia, intensidad, partidos y log\u00EDstica.",
      intensiveFeatures: [
        { label: "Calendario", desc: "Fin de semana, entre semana o a medida" },
        { label: "Sesiones", desc: "De 1 a 3 sesiones por d\u00EDa" },
        { label: "Partidos", desc: "Organizados y competici\u00F3n interna" },
        { label: "Alojamiento", desc: "Te ofrecemos las mejores opciones" },
      ],
    },

    headquarters: {
      eyebrow: "Sedes",
      headingPre: "Nosotros, la metodolog\u00EDa. ",
      headingAccent: "T\u00FA eliges d\u00F3nde.",
      sedeCta: "Ver sede \u2192",
      sedes: [
        {
          tag: "Pistas Indoor \u00B7 M\u00E1laga",
          name: "Finura P\u00E1del",
          detail: "7 pistas cubiertas \u00B7 M\u00E1laga",
          features: ["Indoor", "Cafetería", "Gimnasio", "Pro Shop"],
          badge: "7 pistas",
        },
        {
          tag: "Pistas Outdoor \u00B7 M\u00E1laga",
          name: "Vals Sport Limoneros",
          detail: "11 pistas \u00B7 Pr\u00F3xima apertura",
          features: ["Outdoor", "Fisioterapia", "Zona fitness", "Pro Shop", "Restaurante", "Piscina"],
          badge: "Pr\u00F3ximamente \u00B7 11 pistas",
        },
      ],
      clubCta: {
        eyebrow: "\u00BFTu club?",
        title: "Tu club. Nuestra metodolog\u00EDa.",
        description: "Licenciamos formaci\u00F3n y m\u00E9todo J3 a clubs asociados. Sea donde sea.",
        cta: "S\u00E9 partner J3",
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
      filterEmptyTitle: "Nadie encaja ahora mismo",
      filterEmptyDesc: "Prueba a quitar alg\u00FAn filtro o pregunta a J3 — seguro que encontramos a alguien.",
      nearMe: "Cerca de m\u00ED",
      nearMeLoading: "Localizando\u2026",
      nearMeActive: "Ordenado por cercan\u00EDa",
      nearMeError: "No podemos acceder a tu ubicaci\u00F3n. Activa el permiso o escribe tu ciudad.",
      kmFromYou: "a {km} km de ti",
      youAreHere: "Est\u00E1s aqu\u00ED",
      specialtyJuniors: "Juniors",
      specialtyAdultos: "Adultos",
      specialtyCompeticion: "Competici\u00F3n",
      specialtyCamps: "Camps",
      badgeRecommended: "J3 Recommended",
      badgeHq: "Headquarter",
      askChatbot: "Pregunta a J3",
      legendTitle: "La red",
      legendHq: "Headquarter",
      legendRecommended: "Recomendado",
      legendCluster: "Agrupaci\u00F3n",
      viewInMaps: "Ver en Maps",
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
      eyebrow: "El Sello J3",
      headingPre: "Un est\u00E1ndar ",
      headingAccent: "verificable",
      lede: "Tres niveles. Una sola exigencia: que cada hora en pista te devuelva progreso real.",
      tiers: [
        {
          key: "hq",
          badge: "HQ \u00B7 LAB",
          title: "J3 Lab M\u00E1laga",
          summary: "La sede madre. Donde nace el m\u00E9todo y se entrenan los coaches.",
          points: [
            "Vals Sport Limoneros \u00B7 Finura Padel",
            "20+ a\u00F1os formando jugadores",
            "Laboratorio de metodolog\u00EDa viva",
          ],
        },
        {
          key: "academy",
          badge: "J3 \u00B7 ACADEMY",
          title: "Franquicia llave en mano",
          summary: "Clubes que operan con marca, m\u00E9todo y soporte J3.",
          points: [
            "Metodolog\u00EDa completa y material",
            "Formaci\u00F3n Coach360 para todo el staff",
            "Onboarding legal y operativo",
          ],
        },
        {
          key: "recommended",
          badge: "J3 \u00B7 RECOMMENDED",
          title: "Coaches acreditados",
          summary: "Profesionales individuales con sello J3 activo.",
          points: [
            "Formaci\u00F3n Coach360 completa",
            "Acceso a IA y herramientas J3",
            "Revisi\u00F3n anual del sello",
          ],
        },
      ],
      criteriaEyebrow: "Ser Recommended exige",
      criteriaHeading: "Cuatro puertas que cruzar \u2014 y mantener abiertas.",
      criteriaItems: [
        { num: "01", title: "Formaci\u00F3n Coach360", desc: "Pasar la formaci\u00F3n completa que imparte el Lab de M\u00E1laga." },
        { num: "02", title: "Metodolog\u00EDa J3", desc: "Aplicar el m\u00E9todo en el d\u00EDa a d\u00EDa del club, no solo en papel." },
        { num: "03", title: "Revisi\u00F3n anual", desc: "Renovar el sello cada temporada. Darse de baja cuesta volver." },
        { num: "04", title: "Acceso a IA J3", desc: "Usar el motor de Coach360 como herramienta habitual." },
      ],
    },

    franquicias: {
      eyebrow: "J3 Academy \u00B7 Para clubes",
      headingPre: "Lleva J3 ",
      headingAccent: "a tu club",
      lede: "Un modelo de franquicia llave en mano para clubes y emprendedores que quieren operar con marca, m\u00E9todo y soporte J3.",
      pillars: [
        { num: "01", title: "Metodolog\u00EDa", desc: "El m\u00E9todo J3 completo: programas por edad, niveles, evaluaci\u00F3n de jugadores y material did\u00E1ctico." },
        { num: "02", title: "Formaci\u00F3n", desc: "Coach360 para todo tu staff. Cada coach recibe su sello Recommended y aparece en el mapa." },
        { num: "03", title: "Marca", desc: "Operas bajo J3 Academy. Manual de marca, pautas visuales y presencia en la red internacional." },
        { num: "04", title: "Soporte", desc: "Acompa\u00F1amiento operativo desde M\u00E1laga. Revisiones peri\u00F3dicas, actualizaciones del m\u00E9todo y comunidad de franquiciados." },
      ],
      ctaEyebrow: "\u00BFEres club o inversor?",
      ctaHeading: "Hablemos.",
      ctaSub: "D\u00E9janos tus datos y un partner de J3 te contactar\u00E1 con el dossier completo.",
      ctaPrimary: "Solicitar informaci\u00F3n",
      ctaPrimaryHref: "mailto:partner@j3padel.com?subject=Quiero%20informaci%C3%B3n%20sobre%20J3%20Academy",
      ctaSecondary: "Descargar dossier",
      disclaimer: "Modelo en formaci\u00F3n. Primera convocatoria 2026.",
    },

    method: {
      eyebrow: "M\u00E9todo J3",
      headingPre: "C\u00F3mo ",
      headingAccent: "trabajamos.",
      steps: [
        {
          title: "Diagn\u00F3stico individual",
          desc: "Cada jugador entra con una evaluaci\u00F3n real. Sabemos de d\u00F3nde parte antes de decirle a d\u00F3nde puede llegar.",
        },
        {
          title: "Planificaci\u00F3n por objetivos",
          desc: "No hay dos programas iguales. El entrenamiento se dise\u00F1a seg\u00FAn el perfil, el nivel y la meta de cada jugador.",
        },
        {
          title: "Entrenadores de referencia",
          desc: "El equipo t\u00E9cnico viene del circuito profesional. Han entrenado campeones de Espa\u00F1a y del mundo, y conocen el camino.",
        },
        {
          title: "Seguimiento continuo",
          desc: "La mejora se mide, no se intuye. Revisi\u00F3n constante del progreso con ajustes reales, no ruido de fondo.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "A\u00F1os en el sector" },
        { lbl: "Mejor club del mundo 2018" },
        { lbl: "Jugadores profesionales entrenados" },
        { lbl: "T\u00EDtulos en circuito profesional" },
        { lbl: "Jugadores amateurs entrenados" },
      ],
    },

    cta: {
      eyebrow: "Primera toma de contacto",
      titlePre: "Empieza",
      titleAccent: "hoy.",
      subtitle: "Cu\u00E9ntanos tu nivel, tus objetivos y tu disponibilidad. Te respondemos en menos de 24\u00A0horas.",
      button: "Escribir por WhatsApp",
      note: "Sin compromiso \u00B7 Sin formularios \u00B7 Respuesta directa",
      waMsg: "Hola, quiero informaci\u00F3n sobre J3Academy",
    },
  },

  /* ── Experience page ── */

  experience: {
    hero: {
      eyebrow: "J3Experience \u00B7 En pista \u00B7 Internacional",
      titleLines: ["T\u00DA", "ELIGES", "VIVIRLO."],
      subtitleTags: ["Camps", "Stages", "Experiencias"],
      subtitleBefore: "",
      subtitleAccent: "a medida",
      subtitleAfter: "en cualquier lugar del mundo",
    },

    statement: {
      eyebrow: "La experiencia",
      lines: [
        { before: "Disfruta de", accent: "una" },
        { before: "experiencia \u00FAnica" },
        { before: "con", accent: "nosotros." },
      ],
    },

    flowCamp: {
      eyebrow: "Worldwide \u00B7 Kids \u00B7 Juniors \u00B7 Players",
      headingFlow: "Flow",
      headingCamp: "Camp",
      introBefore: "Buscamos lugares, encontramos gente y compartimos lo que sabemos. ",
      introAccent: "En pista y fuera de ella.",
      jovenesLabel: "Flow Camp \u00B7 J\u00F3venes",
      jovenesTitleAccent: "Flow Camp.",
      jovenesTitleRest: " P\u00E1del, valores y mentalidad. Para j\u00F3venes que entienden el deporte como algo m\u00E1s.",
      jovenesCards: [
        {
          label: "El evento",
          title: "J3 en tu ciudad",
          desc: "Buscamos sede, convocamos jugadores j\u00F3venes y lo ejecutamos. Un evento intensivo de uno o varios d\u00EDas con el equipo J3 en pista.",
        },
        {
          label: "El m\u00E9todo",
          title: "T\u00E9cnica \u00B7 T\u00E1ctica \u00B7 Mentalidad",
          desc: "No es solo mejorar el golpe. El Flow Camp trabaja los tres pilares del sistema J3 \u2014 porque el p\u00E1del de alto nivel empieza en la cabeza.",
        },
        {
          label: "Los entrenadores",
          title: "Formaci\u00F3n express incluida",
          desc: "Los entrenadores locales participan junto a J3 en pista. Se llevan el m\u00E9todo, la visi\u00F3n y una formaci\u00F3n real. Todos salen ganando.",
        },
      ],
      adultosLabel: "Players Camp \u00B7 Adultos",
      adultosTitleAccent: "Players Camp.",
      adultosTitleMid: " Tu ciudad, nuestra ",
      adultosTitleSerif: "experiencia.",
      adultosCards: [
        {
          label: "Qui\u00E9n",
          title: "Para los que juegan en serio",
          desc: "Grupos de amigos, equipos que compiten a nivel amateur o cualquiera que quiera vivir un camp sin tener que venir a M\u00E1laga.",
        },
        {
          label: "Qu\u00E9",
          title: "Intensivo en tu ciudad",
          desc: "Sesiones en pista con el equipo J3. T\u00E9cnica, t\u00E1ctica, partidos analizados. En vuestra instalaci\u00F3n o en la que encontremos juntos.",
        },
        {
          label: "El plus",
          title: "Sin salir de casa",
          desc: "La experiencia J3 sin desplazamiento. Ideal si el grupo es grande, si hay nivel variado o si simplemente prefieres jugar en tu terreno.",
        },
      ],
      ctaText: "Cu\u00E9ntanos tu ciudad y qui\u00E9nes sois. El resto lo hacemos nosotros.",
      ctaButton: "Solicitar Flow Camp",
      waMsg: "Hola, quiero informaci\u00F3n sobre Flow Camp",
    },

    empresas: {
      eyebrow: "Conectamos equipos \u00B7 Activamos marcas",
      heading: "Empresas",
      introBefore: "El p\u00E1del como ",
      introAccent: "herramienta.",
      introAfter: " Para conectar con tu comunidad o activar a tu equipo \u2014 dise\u00F1amos la experiencia de principio a fin.",
      leftPara1: "Trabajamos con marcas y empresas que entienden que el p\u00E1del es mucho m\u00E1s que un deporte. Es un punto de encuentro, una activaci\u00F3n, un momento que une.",
      leftPara2: "En vuestro espacio o en el nuestro. En M\u00E1laga o donde lo necesit\u00E9is.",
      ctaButton: "Hablar con el equipo",
      waMsg: "Hola, quiero informaci\u00F3n sobre J3Experience para empresas",
      formatos: [
        {
          tag: "Formato 01",
          name: "Meet & Greet",
          desc: "Conecta tu marca con la comunidad p\u00E1del. J3 organiza el evento, convoca jugadores y crea el momento.",
        },
        {
          tag: "Formato 02",
          name: "Activaci\u00F3n de marca",
          desc: "Presencia de marca en un entorno deportivo real. Con jugadores reales, no figurantes.",
        },
        {
          tag: "Formato 03",
          name: "Team Building",
          desc: "Tu equipo en pista. Din\u00E1mica competitiva, trabajo en equipo y una experiencia que va m\u00E1s all\u00E1 del paddle friki de empresa.",
        },
      ],
    },

    stats: {
      items: [
        { lbl: "A\u00F1os en\nel sector" },
        { lbl: "Mejor club\ndel mundo 2018" },
        { lbl: "Victorias en\ncircuito profesional" },
        { lbl: "Sede oficial\nM\u00E1laga 2014" },
      ],
    },

    cta: {
      titleLine1: "\u00BFCu\u00E1ndo",
      titleLine2: "es tu",
      titleAccent: "Experience",
      titleEnd: "?",
      body: "Escr\u00EDbenos por WhatsApp. Cu\u00E9ntanos qu\u00E9 buscas y lo dise\u00F1amos juntos.",
      button: "Solicitar ahora",
      note: "Respuesta en menos de 24h \u00B7 Sin compromiso",
      waMsg: "Hola, quiero informaci\u00F3n sobre J3Experience",
    },
  },
} as const satisfies Dictionary;
