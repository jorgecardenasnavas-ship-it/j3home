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
    items: readonly { src: string; alt: string; w: number; h: number }[];
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
    credsMobile: readonly { val: string; label: string }[];
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
      }[];
    };

    team: {
      label: string;
      heading1: string;
      heading2: string;
      members: readonly {
        num: string;
        role: string;
        first: string;
        last: string;
        bio: string;
        quote: string;
      }[];
    };

    players: {
      label: string;
      heading1: string;
      heading2: string;
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
}
