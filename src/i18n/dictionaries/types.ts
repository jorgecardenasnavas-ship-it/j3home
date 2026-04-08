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
      readonly subtitleBefore: string;
      readonly subtitleAccent: string;
      readonly subtitleAfter: string;
      readonly subtitleLocation: string;
      readonly subtitleLine2: string;
    };

    statement: {
      readonly eyebrow: string;
      readonly lines: readonly { readonly before: string; readonly accent?: string }[];
    };

    proof: {
      readonly eyebrow: string;
      readonly quoteOpen: string;
      readonly quoteAccent: string;
      readonly quoteClose: string;
      readonly imageAlt: string;
      readonly players: readonly { readonly name: string; readonly info: string }[];
    };

    programs: {
      readonly eyebrow: string;
      readonly headingPre: string;
      readonly headingAccent: string;
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
      }[];
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
