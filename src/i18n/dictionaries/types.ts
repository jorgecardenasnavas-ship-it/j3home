/* ──────────────────────────────────────────────
   Dictionary type — single source of truth for
   every translatable string across J3Padel.
   ────────────────────────────────────────────── */

export interface Dictionary {
  /* ── Shared components ── */

  nav: {
    soluciones: string;
    acceder: string;
    inicio: string;
  };

  footer: {
    copyright: string;
  };

  sponsors: {
    items: readonly { src: string; alt: string; w: number; h: number; href: string }[];
  };

  chat: {
    tooltip: string;
  };

  /* ── Home page ── */

  hero: {
    play: string;
    coach: string;
    manage: string;
    milestones: readonly { year: string; text: string }[];
    tagline: string;
    cta1: string;
    cta2: string;
    accentTouch: {
      topLine: string;
      accentWord: string;
      afterAccent: string;
      labelLeft: string;
      labelRight: string;
    };
  };

  impact: {
    line1: string;
    line2: string;
    line3: string;
    tagline: string;
  };

  system: {
    blocks: readonly { line1: string; line2: string }[];
    nodes: readonly string[];
  };

  home: {
    line1: string;
    line2: string;
    closer: string;
  };

  products: {
    cards: readonly {
      tag: string;
      forLabel: string;
      description?: string;
      buttons: readonly string[];
    }[];
  };

  nosotros: {
    label: string;
    heading1: string;
    heading2: string;
    body: string;
    link: string;
    statsLabel: string;
    stats: readonly { val: string; line1: string; line2: string }[];
  };

  contacto: {
    label: string;
    heading1: string;
    heading2: string;
    body: string;
    email: string;
    telefono: string;
    sede: string;
    placeholders: { nombre: string; email: string; mensaje: string };
    soyOptions: readonly string[];
    interesOptions: readonly string[];
    submit: string;
    sending: string;
    sent: string;
    error: string;
  };

  /* ── Story page ── */

  story: {
    hero: {
      prefix: string;
      years: string;
      dentro: string;
      delJuego: string;
      sub1: string;
      sub2: string;
      sub3: string;
      desde: string;
      location: string;
    };

    impact: {
      line1: string;
      line2: string;
      fact1: string;
      fact2: string;
      closer: string;
      proudLabel: string;
      cantera: readonly string[];
      historyLabel: string;
    };

    bridge: {
      line1: string;
      line2: string;
    };

    accent: {
      eyebrow: string;
      slogan: readonly [string, string, string];
      manifesto: readonly string[];
    };

    stats: {
      header: string;
      items: readonly {
        val: number | string;
        suffix?: string;
        prefix?: string;
        label?: string;
        lbl: string;
      }[];
    };

    timeline: {
      sectionLabel: string;
      heading1: string;
      heading2: string;
      eras: readonly string[];
      entries: readonly {
        year: string;
        title: string;
        desc: string;
        badge?: string;
        highlight?: boolean;
        image?: string;
        imagePosition?: string;
      }[];
    };

    team: {
      label: string;
      heading1: string;
      heading2: string;
      heading2Accent: string;
      members: readonly {
        num: string;
        role: string;
        first: string;
        last: string;
        last2?: string;
        bio: string;
        quote: string;
      }[];
    };

    players: {
      label: string;
      heading1: string;
      heading2: string;
      heading2Accent: string;
      description: string;
      heroLabel: string;
      nextGenLabel: string;
      nextGenProLabel: string;
      featuredLabel: string;
      sharedLabel: string;
      heroPlayers: readonly { info: string; tag: string }[];
      nextGenTags: readonly string[];
      nextGenProTags: readonly string[];
      featuredPlayers: readonly { info: string; tag: string }[];
      sharedTags: readonly string[];
    };

    philosophy: {
      label: string;
      word1: string;
      word2: string;
      word3: string;
      body: string;
      pillars: readonly {
        num: string;
        label: string;
        title: string;
        body: string;
      }[];
    };

    clubs: {
      label: string;
      heading1: string;
      heading2: string;
      description: string;
      originLabel: string;
      presentLabel: string;
      lessonAside: string;
      origins: readonly {
        flag: string;
        name: string;
        detail: string;
        highlight: string;
      }[];
      heroClub: {
        flag: string;
        name: string;
        detail: string;
        highlight: string;
        years: string;
      };
      lesson: {
        flag: string;
        name: string;
      };
      present: readonly {
        flag: string;
        name: string;
        detail: string;
        highlight: string;
      }[];
    };

    brands: {
      currentLabel: string;
      pastLabel: string;
    };

    cta: {
      label: string;
      heading1: string;
      heading2: string;
      body: string;
      buttons: readonly string[];
    };
  };

  /* ── Academy page ── */

  academy: {
    hero: {
      readonly locationLabel: string;
      readonly titleLine1: string;
      readonly titleLine2: string;
      readonly titleLine3a: string;
      readonly titleLine3b: string;
      readonly ctaLabel: string;
      readonly subtitleBefore: string;
      readonly subtitleAccent: string;
      readonly subtitleAfter: string;
      readonly subtitleLocation: string;
      readonly subtitleLine2: string;
      // ── Nuevo hero con mapa ──
      readonly eyebrow: string;        // "Dónde entrenar J3"
      readonly heading: string;         // "Academy J3"
      /** Opcional: si se definen, el H1 se renderiza como pre + <em>accent</em> + post,
       *  con el accent en serif-itálico dorado. Si faltan se usa `heading`. */
      readonly headingPre?: string;
      readonly headingAccent?: string;
      readonly headingPost?: string;
      readonly sub: string;             // "El Lab en Málaga. La red en tu ciudad."
      readonly ctaPrimary: string;      // "Encontrar coach J3 cerca"
      readonly ctaSecondary: string;    // "Entrenar en el J3 Lab"
      readonly filtersTitle: string;    // "Filtrar"
      readonly countTemplate: string;   // "{count} coaches · {countries} ciudades"
      readonly sedesNavLabel: string;   // "Sedes J3"
    };

    band: {
      readonly eyebrow: string;
      /** Parte afirmativa del H2 ("Desde 2004.") */
      readonly headingLead: string;
      /** Acento serif-italic dorado ("Málaga, España.") */
      readonly headingAccent: string;
      readonly description: string;
    };

    claim: {
      readonly quote: string;
      readonly author: string;
    };

    banner: {
      /** H2: texto antes del accent. Ej: "La academia de " */
      readonly headingBefore: string;
      /** Palabra/frase accent en serif-itálico gold. Ej: "referencia" */
      readonly headingAccent: string;
      /** Texto después del accent (salta línea si existe). Ej: "en la Costa del Sol." */
      readonly headingAfter: string;
      readonly tagline: string;
    };

    statement: {
      readonly lines: readonly { readonly before: string; readonly accent?: string }[];
      /** Labels de los stats bajo el manifesto (años / jugadores formados / etc). */
      readonly statYears: string;
      readonly statPlayers: string;
      readonly statTitles: string;
    };

    programs: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      readonly headingSub: string;
      readonly juniorsLabel: string;
      readonly juniorsCards: readonly {
        readonly tag: string;
        readonly title: string;
        readonly sub: string;
        readonly ctaLabel: string;
        readonly waMsg: string;
      }[];
      readonly adultosLabel: string;
      readonly adultosCards: readonly {
        readonly tag: string;
        readonly title: string;
        readonly sub: string;
        readonly ctaLabel: string;
        readonly waMsg: string;
      }[];
      readonly adultosInfoEyebrow: string;
      readonly adultosInfoHeadingPre: string;
      readonly adultosInfoHeadingAccent: string;
      readonly adultosInfoTagline: string;
      readonly adultosInfoDesc: string;
      readonly adultosFeatures: readonly {
        readonly label: string;
        readonly desc: string;
      }[];
      readonly intensiveCards: readonly {
        readonly tag: string;
        readonly title: string;
        readonly sub: string;
        readonly ctaLabel: string;
        readonly waMsg: string;
      }[];
      readonly intensiveLabel: string;
      readonly intensiveEyebrow: string;
      readonly intensiveTitlePre: string;
      readonly intensiveTitleAccent: string;
      readonly intensiveDesc: string;
      readonly intensiveImageAlt: string;
      readonly intensiveCtaBook: string;
      readonly intensiveCtaInfo: string;
      readonly intensiveWaMsgBook: string;
      readonly intensiveWaMsgInfo: string;
      readonly intensiveInfoEyebrow: string;
      readonly intensiveInfoHeadingPre: string;
      readonly intensiveInfoHeadingAccent: string;
      readonly intensiveInfoDesc: string;
      readonly intensiveFeatures: readonly {
        readonly label: string;
        readonly desc: string;
      }[];
    };

    headquarters: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      readonly sedeCta: string;
      readonly sedes: readonly {
        readonly tag: string;
        readonly name: string;
        readonly detail: string;
        readonly features: readonly string[];
        readonly badge?: string;
      }[];
      readonly clubCta: {
        readonly eyebrow: string;
        readonly title: string;
        readonly description: string;
        readonly cta: string;
      };
    };

    network: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      /** Sub opcional. Si es "", no se renderiza. */
      readonly headingSub?: string;
      /** Eyebrow del bloque de sedes físicas del Lab (Coach360 / el Lab). */
      readonly sedesLabel: string;
      /** Array de sedes físicas. Se pintan en scroll horizontal. */
      readonly sedes: readonly {
        readonly name: string;
        readonly flag: string;
        readonly cta: string;
        readonly href: string;
        /** URL opcional de video de fondo (mp4/webm). Si no, se usa gradient. */
        readonly video?: string;
        /** Badge opcional de "próxima apertura" — se pinta top-right de la card. */
        readonly openingSoon?: string;
        /** Horario de acceso a la sede. Ej: "Apertura a cierre" / "Hasta las 17:00". */
        readonly schedule?: string;
      }[];
      readonly mapLabel: string;
      readonly mapHint: string;
      readonly gridLabel: string;
      readonly gridHeading: string;
      readonly filterAll: string;
      readonly filterCountry: string;
      readonly filterLanguage: string;
      readonly filterSpecialty: string;
      readonly filterReset: string;
      readonly filterEmpty: string;
      /** Título del empty state cuando filtros no matchean */
      readonly filterEmptyTitle: string;
      /** Subtítulo / sugerencia en el empty state */
      readonly filterEmptyDesc: string;
      /** Botón "Cerca de mí" (idle) */
      readonly nearMe: string;
      /** Label mientras se pide permiso de geolocalización */
      readonly nearMeLoading: string;
      /** Badge cuando está activo: "Ordenado por cercanía" */
      readonly nearMeActive: string;
      /** Mensaje si el usuario deniega o el navegador falla */
      readonly nearMeError: string;
      /** Template del badge de distancia en la card. {km} = número */
      readonly kmFromYou: string;
      /** Label del pin "tú estás aquí" en el mapa */
      readonly youAreHere: string;
      readonly specialtyJuniors: string;
      readonly specialtyAdultos: string;
      readonly specialtyCompeticion: string;
      readonly specialtyCamps: string;
      /** Badge "Founder" — distinción histórica irrepetible (16 cohort original) */
      readonly badgeFounder: string;
      /** Badge "Gen ONE" — early adopter no-founder de 2025 */
      readonly badgeGenOne: string;
      /** Badge "Verificado J3" — J3 trabaja 1:1 con este coach (mentorActive) */
      readonly badgeVerified: string;
      /** Badge "Headquarter" — sedes J3 propias */
      readonly badgeHq: string;
      /* ── Distinciones: trayectoria profesional ── */
      /** Distinción: "Forma coaches" */
      readonly distinctionFormaCoaches: string;
      /** Distinción: "Jugadores en circuito" */
      readonly distinctionJugadoresCircuito: string;
      /** Distinción: "Multilingüe" */
      readonly distinctionMultilingue: string;
      /** Distinción computada: "Decano J3" (5+ años en la red) */
      readonly distinctionDecano: string;

      /* ── Distinciones: kids & juniors ── */
      /** Distinción: "Kids · Iniciación" (didáctica 4-8 años) */
      readonly distinctionKidsIniciacion: string;
      /** Distinción: "Juniors · Tecnificación" */
      readonly distinctionJuniorsTecnificacion: string;
      /** Distinción: "Protocolo familiar" (comunicación con padres) */
      readonly distinctionProtocoloFamiliar: string;

      /* ── Distinciones: amateur adulto ── */
      /** Distinción: "Iniciación adulto" */
      readonly distinctionIniciacionAdulto: string;
      /** Distinción: "Reeducación técnica" (corrige vicios) */
      readonly distinctionReeducacionTecnica: string;
      /** Distinción: "Grupos mixtos" (niveles heterogéneos) */
      readonly distinctionGruposMixtos: string;

      /* ── Distinciones: vacacional / grupo ── */
      /** Distinción: "Bautismo de padel" (intro para novatos) */
      readonly distinctionBautismoPadel: string;
      /** Distinción: "Experiencia familiar" (padres + hijos) */
      readonly distinctionExperienciaFamiliar: string;
      /** Nombres abreviados de mes (Ene, Feb, Mar…) — índice 0 = enero. 12 items. */
      readonly monthShort: readonly [string, string, string, string, string, string, string, string, string, string, string, string];
      /** Template antigüedad. Ej: "Coach360 desde {date}" — se sustituye por "Ago 2025". */
      readonly memberSince: string;
      /** Label "Cualificado" — coach que ha demostrado conocimiento del método
       *  (examen). Mostrado en la card cuando el coach NO es Verificado.
       *  Distinto de Certificado, que añade verificación práctica 1:1. */
      readonly qualifiedSince: string;
      /** Label "Certificado" — mostrado en la card cuando el coach es
       *  Verificado internamente. Públicamente la máxima atestación J3
       *  se llama "Certificado" (verificar + cualificar = certificar). */
      readonly certifiedSince: string;
      readonly askChatbot: string;
      /** Título de la mini-leyenda del mapa (bottom-left) */
      readonly legendTitle: string;
      /** Label de la fila "Headquarter" en la leyenda */
      readonly legendHq: string;
      /** Fila "Coach360 cualificado" — pin gold lleno (sin anillo). */
      readonly legendCoach: string;
      /** Fila "Coach Verificado J3" — pin con anillo exterior. */
      readonly legendCoachVerified: string;
      /** Fila "Coach360" — dot hollow pulsante para los PLUS en proceso. */
      readonly legendCoachInProgress: string;
      /** Chip del popup "en proceso": "En proceso de certificación" */
      readonly inProgressBadge: string;
      /** Nota al pie del popup "en proceso": "Disponible cuando obtenga su certificación" */
      readonly inProgressNote: string;
      /** Línea junto al mapa con el total de coaches en la red J3 (suma de todos los tiers).
       *  Template: "+{count} entrenadores en la red J3" */
      readonly baseCoachesLine: string;
      /** Estaciones del viaje J3 — micro-labels del progress bar en el popup
       *  "en proceso". Viaje de 4 peldaños:
       *   1. Coach        → pre-J3 (raw, past)
       *   2. Coach360     → ya dentro del sistema (current para PLUS en proceso)
       *   3. Cualificado  → conocimiento del método atestiguado (examen)
       *   4. Certificado  → J3 certifica la práctica 1:1 (verificar + cualificar)
       *      (la clave sigue llamándose `stageVerificado` por compatibilidad
       *       interna; el VALOR público es "Certificado".)
       */
      readonly stageCoach: string;
      readonly stageCoach360: string;
      readonly stageCualificado: string;
      readonly stageVerificado: string;
      /** Label de la fila "Cluster (agrupación)" en la leyenda */
      readonly legendCluster: string;
      /** Subtítulo de la sección distinciones dentro de la leyenda. */
      readonly legendDistinctionsTitle: string;
      /** Subtítulo de grupo: trayectoria profesional. */
      readonly legendDistGroupProfesional: string;
      /** Subtítulo de grupo: kids & juniors. */
      readonly legendDistGroupKids: string;
      /** Subtítulo de grupo: amateur adulto. */
      readonly legendDistGroupAmateur: string;
      /** Subtítulo de grupo: vacacional / grupo ocasional. */
      readonly legendDistGroupVacacional: string;
      /** Label del botón "Ver en Maps" en el popup */
      readonly viewInMaps: string;
      readonly viewProfile: string;
      readonly viewAllCta: string;       // "Ver los {count} coaches"
      readonly viewFilteredCta: string;  // "Ver los {count} resultados completos"
      readonly coachCta: {
        readonly eyebrow: string;
        readonly title: string;
        readonly description: string;
        readonly cta: string;
        readonly href: string;
      };
    };

    coachesPage: {
      readonly metaTitle: string;
      readonly metaDescription: string;
      readonly heading: string;
      readonly statsTemplate: string;    // "{coaches} coaches · {countries} países · {languages} idiomas"
      readonly emptyTitle: string;
      readonly emptyCta: string;
      readonly backLink: string;
    };

    /* ── S5c — EL SELLO (qué garantiza el sello J3) ── */
    sello: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      readonly lede: string;
      readonly tiers: readonly {
        readonly key: "hq" | "academy" | "recommended";
        readonly badge: string;
        readonly title: string;
        readonly summary: string;
        readonly points: readonly string[];
      }[];
      readonly criteriaEyebrow: string;
      readonly criteriaHeading: string;
      readonly criteriaItems: readonly {
        readonly num: string;
        readonly title: string;
        readonly desc: string;
      }[];
    };

    /* ── S5d — J3 ACADEMY (franquicias B2B) ── */
    franquicias: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      readonly lede: string;
      readonly pillars: readonly {
        readonly num: string;
        readonly title: string;
        readonly desc: string;
      }[];
      readonly ctaEyebrow: string;
      readonly ctaHeading: string;
      readonly ctaSub: string;
      readonly ctaPrimary: string;
      readonly ctaPrimaryHref: string;
      readonly ctaSecondary: string;
      readonly disclaimer: string;
    };

    method: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
      readonly steps: readonly { readonly title: string; readonly desc: string }[];
    };

    stats: {
      readonly items: readonly { readonly lbl: string }[];
    };

    cta: {
      readonly eyebrow: string;
      readonly titlePre: string;
      readonly titleAccent: string;
      readonly subtitle: string;
      readonly button: string;
      readonly note: string;
      readonly waMsg: string;
    };
  };

  /* ── Experience page ── */

  experience: {
    hero: {
      readonly eyebrow: string;
      readonly titleLines: readonly string[];
      readonly subtitleTags: readonly string[];
      readonly subtitleBefore: string;
      readonly subtitleAccent: string;
      readonly subtitleAfter: string;
    };

    statement: {
      readonly eyebrow: string;
      readonly lines: readonly { readonly before: string; readonly accent?: string }[];
    };

    flowCamp: {
      readonly eyebrow: string;
      readonly headingFlow: string;
      readonly headingCamp: string;
      readonly introBefore: string;
      readonly introAccent: string;
      readonly jovenesLabel: string;
      readonly jovenesTitleAccent: string;
      readonly jovenesTitleRest: string;
      readonly jovenesCards: readonly {
        readonly label: string;
        readonly title: string;
        readonly desc: string;
      }[];
      readonly adultosLabel: string;
      readonly adultosTitleAccent: string;
      readonly adultosTitleMid: string;
      readonly adultosTitleSerif: string;
      readonly adultosCards: readonly {
        readonly label: string;
        readonly title: string;
        readonly desc: string;
      }[];
      readonly ctaText: string;
      readonly ctaButton: string;
      readonly waMsg: string;
    };

    empresas: {
      readonly eyebrow: string;
      readonly heading: string;
      readonly introBefore: string;
      readonly introAccent: string;
      readonly introAfter: string;
      readonly leftPara1: string;
      readonly leftPara2: string;
      readonly ctaButton: string;
      readonly waMsg: string;
      readonly formatos: readonly {
        readonly tag: string;
        readonly name: string;
        readonly desc: string;
      }[];
    };

    stats: {
      readonly items: readonly { readonly lbl: string }[];
    };

    cta: {
      readonly titleLine1: string;
      readonly titleLine2: string;
      readonly titleAccent: string;
      readonly titleEnd: string;
      readonly body: string;
      readonly button: string;
      readonly note: string;
      readonly waMsg: string;
    };
  };
}
