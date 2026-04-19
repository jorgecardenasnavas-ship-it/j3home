/* ──────────────────────────────────────────────
   J3 Network — Coaches Recommended.
   Single source of truth for the map + grid.

   Campos obligatorios: slug, name, location, tier, joinedAt.
   Los demás (clubs, specialties, socials, photo) se rellenan
   progresivamente conforme cada coach nos pase su info.

   Política de veracidad: NUNCA inventar datos. Si falta el
   Instagram o las specialties, van vacíos. Es preferible una
   ficha parca y verdadera que una completa y falsa.
   ────────────────────────────────────────────── */

export type CoachSpecialty = "juniors" | "adultos" | "competicion" | "camps";

/**
 * Tier público del coach — la "capa base" que determina quién aparece
 * en el mapa y con qué garantía:
 *
 *  - 'hq'          → J3 Lab / Headquarter (solo las sedes J3 propias).
 *  - 'recommended' → Coach en mentoría activa con J3. J3 conoce cómo
 *                    trabaja hoy y lo avala. Lleva badge 'Recomendado J3'
 *                    en la card. Puede además mostrar especialidades
 *                    verificadas y distinciones (Forma coaches, Jugadores
 *                    en circuito, Multilingüe, Decano).
 *  - 'trained'     → Coach certificado (ha pasado Coach360 Plus + examen).
 *                    Aparece en el mapa sin badges — su credencial es
 *                    estar aquí. J3 valida su formación, no su práctica
 *                    actual.
 *
 *  Regla de oro: solo los 'recommended' pueden mostrar badges adicionales
 *  (especialidad, distinciones) porque son los únicos cuya práctica J3
 *  conoce en directo.
 *
 *  El Founder es histórico y puede combinarse con cualquier tier — no
 *  depende de la relación actual.
 */
export type CoachTier = "hq" | "recommended" | "trained";

/**
 * Distinciones reseñables que J3 puede avalar de un coach. Solo
 * se muestran si el coach está en tier 'recommended' (J3 conoce su
 * práctica en directo).
 *
 *  - 'forma-coaches'      → Enseña el método J3 a otros entrenadores.
 *  - 'jugadores-circuito' → Tiene alumnos activos en rankings nacionales
 *                           o en el circuito profesional.
 *  - 'multilingue'        → Trabaja profesionalmente en 3+ idiomas.
 *
 *  (El 'decano' — 5+ años en la red — se computa desde joinedAt, no
 *   se almacena como distinción explícita.)
 */
export type CoachDistinction = "forma-coaches" | "jugadores-circuito" | "multilingue";

/**
 * Tipo de nodo dentro de la red J3:
 *  - 'lab'     → J3 Lab (sede origen, solo Málaga).
 *  - 'academy' → J3 Academy (franquicia llave en mano con marca J3).
 *  - 'coach'   → Coach individual con sello (certificado o recomendado).
 *  Default implícito cuando no se especifica: 'coach'.
 */
export type CoachType = "lab" | "academy" | "coach";

export interface Coach {
  /** Identificador estable para keys/URLs (ej. "juan-lopez-madrid") */
  slug: string;
  /** Nombre del coach o de la academia que representa */
  name: string;
  /** "Coach" · "Academia" — etiqueta corta bajo el nombre */
  role?: string;
  /** Ruta a la foto (cuadrada 640×640 mín.). Opcional hasta que lleguen. */
  photo?: string;
  location: {
    city: string;
    country: string;
    /** [lat, lng] — indispensable para el mapa */
    coordinates: [number, number];
  };
  /** Clubs donde opera */
  clubs?: string[];
  /** ISO 639-1: "es", "en", "fr"… */
  languages?: string[];
  /** Para filtros. En 'recommended' actúan como especialidades verificadas
   *  por J3 (mostramos máx. 2 en la card). En 'trained' no se muestran
   *  en la card — solo sirven para el filtro. */
  specialties?: CoachSpecialty[];
  socials?: {
    instagram?: string;
    web?: string;
    coach360?: string;
  };
  /** Tier por defecto cuando se crea un coach: 'trained'. */
  tier: CoachTier;
  /**
   * Tipo de nodo en la red. Default: 'coach'.
   * El Lab (Málaga) va como 'lab'. Las franquicias como 'academy'.
   */
  type?: CoachType;
  /** Destacar en la home / como primer pin abierto */
  featured?: boolean;
  /**
   * Founder J3: miembro de la primera hornada de coaches. Distinción
   * histórica e irrepetible. Puede combinarse con cualquier tier —
   * no depende de la relación actual.
   */
  founder?: boolean;
  /**
   * Distinciones reseñables que J3 avala. Solo se renderizan en la card
   * cuando el coach está en tier 'recommended'.
   */
  distinctions?: CoachDistinction[];
  /** Fecha ISO de alta en Coach360 (YYYY-MM-DD). Usada para ordenar dentro de cada tier. */
  joinedAt: string;
}

/* ──────────────────────────────────────────────
   Dataset — TODOS los coaches son reales.
   Los 16 coaches fundadores entraron a Coach360 el
   2025-08-01. Todos arrancan en tier 'recommended' +
   badge 'founder' (distinción histórica irrepetible).
   Las fichas se van rellenando conforme cada coach nos
   confirma specialties, distinctions, clubs y foto.
   ────────────────────────────────────────────── */

export const COACHES: readonly Coach[] = [
  // ── HQ ──
  {
    slug: "j3-hq-malaga",
    name: "J3 Lab",
    role: "Málaga · Headquarters",
    photo: "/images/vals-1.jpg",
    location: {
      // Vals Sport Limoneros — C. Pedro Garfias 5, Puerto de la Torre, 29190 Málaga
      city: "Málaga",
      country: "España",
      coordinates: [36.7334706, -4.4844103],
    },
    clubs: ["Vals Sport Limoneros", "Finura Padel"],
    languages: ["es", "en"],
    specialties: ["juniors", "adultos", "competicion", "camps"],
    socials: {
      instagram: "https://instagram.com/j3padel",
      web: "https://j3padel.com",
    },
    tier: "hq",
    type: "lab",
    featured: true,
    joinedAt: "2005-01-01",
  },

  /* ── Recomendados · primera hornada (Founders) ──
     Los 16 coaches que iniciaron Coach360 el 2025-08-01. Todos arrancan
     en tier 'recommended' (J3 los mentoriza activamente) y con badge
     'founder' (distinción histórica, nunca se podrá volver a ganar).
     Las specialties y distinctions son sample data hasta que cada coach
     nos confirme las suyas. */

  // ── España ──
  {
    slug: "alejandro-coscollano-gonzalez",
    name: "Alejandro Coscollano González",
    role: "Coach",
    location: {
      city: "Talavera de la Reina",
      country: "España",
      coordinates: [39.9629, -4.8306],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["forma-coaches"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "aleix-vinals-llagosta",
    name: "Aleix Viñals",
    role: "Coach",
    location: {
      city: "La Llagosta",
      country: "España",
      coordinates: [41.5182, 2.1932],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "andres-fernandez-murcia",
    name: "Andrés Fernández",
    role: "Coach",
    location: {
      city: "San Javier",
      country: "España",
      coordinates: [37.8045, -0.8360],
    },
    clubs: [],
    languages: ["es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "arturo-san-jose-esparza",
    name: "Arturo San José Esparza",
    role: "Coach",
    location: {
      city: "Pamplona",
      country: "España",
      coordinates: [42.8125, -1.6458],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors", "competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "david-camunas-molina",
    name: "David Camuñas Molina",
    role: "Coach",
    location: {
      city: "Talavera de la Reina",
      country: "España",
      coordinates: [39.9629, -4.8306],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["camps"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "diego-valdez-castelldefels",
    name: "Diego Valdez",
    role: "Coach",
    location: {
      city: "Castelldefels",
      country: "España",
      coordinates: [41.2800, 1.9755],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "manuel-sarachaga-gomez",
    name: "Manuel Sarachaga Gómez",
    role: "Coach",
    location: {
      city: "Santander",
      country: "España",
      coordinates: [43.4623, -3.8099],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["adultos"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "mati-pereira-tarragona",
    name: "Mati Pereira",
    role: "Coach",
    location: {
      city: "Tarragona",
      country: "España",
      coordinates: [41.1189, 1.2445],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["forma-coaches"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "miguel-laredo-pontevedra",
    name: "Miguel Laredo",
    role: "Coach",
    location: {
      city: "Pontevedra",
      country: "España",
      coordinates: [42.4336, -8.6448],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "nacho-gonzalez-madrid",
    name: "Nacho González",
    role: "Coach",
    location: {
      city: "Villanueva de la Cañada",
      country: "España",
      coordinates: [40.4467, -3.9942],
    },
    clubs: [],
    languages: ["es", "en"],
    specialties: ["competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["forma-coaches", "jugadores-circuito"],
    joinedAt: "2025-08-01",
  },

  // ── Italia ──
  {
    slug: "camilo-masmut-milano",
    name: "Camilo Masmut",
    role: "Coach",
    location: {
      city: "Milano",
      country: "Italia",
      coordinates: [45.4642, 9.1900],
    },
    clubs: [],
    languages: ["it", "es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["multilingue"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "emilio-cigala-desenzano",
    name: "Emilio Cigala",
    role: "Coach",
    location: {
      city: "Desenzano del Garda",
      country: "Italia",
      coordinates: [45.4710, 10.5380],
    },
    clubs: [],
    languages: ["it", "es"],
    specialties: ["competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "saul-rielo-cagliari",
    name: "Saúl Rielo",
    role: "Coach",
    location: {
      city: "Cagliari",
      country: "Italia",
      coordinates: [39.2238, 9.1217],
    },
    clubs: [],
    languages: ["it", "es"],
    specialties: ["juniors"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },

  // ── Argentina ──
  {
    slug: "lucas-barros-mar-del-plata",
    name: "Lucas Barros",
    role: "Coach",
    location: {
      city: "Mar del Plata",
      country: "Argentina",
      coordinates: [-38.0055, -57.5426],
    },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },

  // ── Portugal ──
  {
    slug: "andre-silva-esposende",
    name: "André Silva",
    role: "Coach",
    location: {
      city: "Esposende",
      country: "Portugal",
      coordinates: [41.5362, -8.7817],
    },
    clubs: [],
    languages: ["pt", "es"],
    specialties: ["juniors"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    joinedAt: "2025-08-01",
  },

  // ── Bélgica ──
  {
    slug: "manuel-agten-sanchez",
    name: "Manuel Agten Sanchez",
    role: "Coach",
    location: {
      city: "Tongeren",
      country: "Bélgica",
      coordinates: [50.7802, 5.4646],
    },
    clubs: [],
    languages: ["nl", "es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    founder: true,
    distinctions: ["multilingue"],
    joinedAt: "2025-08-01",
  },

  /* ── Certificados · datos de muestra ──
     Coaches que han pasado Coach360 Plus + examen pero no están en
     mentoría activa con J3. Aparecen en el mapa sin badges — J3
     valida su formación, no su práctica actual. No pueden mostrar
     specialties verificadas ni distinctions (esas requieren que J3
     conozca su práctica en directo). */
  {
    slug: "carlos-merino-sevilla",
    name: "Carlos Merino",
    role: "Coach",
    location: {
      city: "Sevilla",
      country: "España",
      coordinates: [37.3891, -5.9845],
    },
    clubs: [],
    languages: ["es"],
    specialties: [],
    socials: {},
    tier: "trained",
    type: "coach",
    featured: true,
    joinedAt: "2026-02-14",
  },
  {
    slug: "lucia-santos-lisboa",
    name: "Lucía Santos",
    role: "Coach",
    location: {
      city: "Lisboa",
      country: "Portugal",
      coordinates: [38.7223, -9.1393],
    },
    clubs: [],
    languages: ["pt", "es"],
    specialties: [],
    socials: {},
    tier: "trained",
    type: "coach",
    featured: true,
    joinedAt: "2026-03-05",
  },
  {
    slug: "thomas-bernard-lyon",
    name: "Thomas Bernard",
    role: "Coach",
    location: {
      city: "Lyon",
      country: "Francia",
      coordinates: [45.7640, 4.8357],
    },
    clubs: [],
    languages: ["fr", "en"],
    specialties: [],
    socials: {},
    tier: "trained",
    type: "coach",
    featured: true,
    joinedAt: "2026-01-20",
  },
  {
    slug: "martina-rossi-milan",
    name: "Martina Rossi",
    role: "Coach",
    location: {
      city: "Milán",
      country: "Italia",
      coordinates: [45.4642, 9.1900],
    },
    clubs: [],
    languages: ["it", "en"],
    specialties: [],
    socials: {},
    tier: "trained",
    type: "coach",
    featured: true,
    joinedAt: "2026-03-18",
  },
] as const;

/** Lista de países únicos (alfabético) — para filtros. */
export const COACH_COUNTRIES = Array.from(
  new Set(COACHES.filter(c => c.tier !== "hq").map(c => c.location.country)),
).sort();

/** Lista de idiomas únicos. */
export const COACH_LANGUAGES = Array.from(
  new Set(COACHES.filter(c => c.tier !== "hq").flatMap(c => c.languages ?? [])),
).sort();

/** Catálogo de especialidades. */
export const COACH_SPECIALTIES: readonly CoachSpecialty[] = [
  "juniors",
  "adultos",
  "competicion",
  "camps",
] as const;

/* ──────────────────────────────────────────────
   Ordenación: tier → founder boost → antigüedad.
   - HQ siempre primero.
   - Recomendados > Certificados (J3 los conoce en directo).
   - Dentro del mismo tier, los Founders suben un puesto dentro
     de su empate (distinción histórica + palanca de retención).
   - Finalmente, por antigüedad (más veteranos primero).
   ────────────────────────────────────────────── */

const TIER_ORDER: Record<CoachTier, number> = {
  hq: 0,
  recommended: 1,
  trained: 2,
};

/**
 * Devuelve una copia ordenada por (tier) → (founder) → (joinedAt).
 */
export function sortCoaches(coaches: readonly Coach[]): Coach[] {
  return [...coaches].sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    const founderDiff = (b.founder ? 1 : 0) - (a.founder ? 1 : 0);
    if (founderDiff !== 0) return founderDiff;
    return a.joinedAt.localeCompare(b.joinedAt);
  });
}

/* ──────────────────────────────────────────────
   Helpers de badges — reglas de visualización.
   ────────────────────────────────────────────── */

/** Años cumplidos en la red (desde joinedAt). */
export function yearsInNetwork(coach: Coach, referenceDate: Date = new Date()): number {
  const joined = new Date(coach.joinedAt);
  const diffMs = referenceDate.getTime() - joined.getTime();
  return diffMs / (1000 * 60 * 60 * 24 * 365.25);
}

/** Decano J3: 5+ años en la red. Se computa, no se almacena. */
export function isDecano(coach: Coach, referenceDate: Date = new Date()): boolean {
  return yearsInNetwork(coach, referenceDate) >= 5;
}

export interface CoachBadgeView {
  /** ¿Mostrar badge "Recomendado J3"? (tier actual = recommended) */
  recomendado: boolean;
  /** ¿Mostrar badge "Founder"? (distinción histórica) */
  founder: boolean;
  /** Specialties verificadas a mostrar en la card (máx. 2). Vacío si tier !== recommended. */
  specialties: CoachSpecialty[];
  /** Distinciones reseñables. Vacío si tier !== recommended. */
  distinctions: CoachDistinction[];
  /** ¿Es decano? (5+ años en la red). Solo relevante para recommended. */
  decano: boolean;
}

/**
 * Normaliza qué badges mostrar en la card de un coach.
 *
 * Reglas:
 *  - Founder: se muestra siempre que esté marcado (histórico, no depende del tier).
 *  - Recomendado: solo si tier === 'recommended'.
 *  - Specialties verificadas: solo si 'recommended', máx. 2 (evita catálogo).
 *  - Distinctions: solo si 'recommended'.
 *  - Decano: se computa desde joinedAt, solo cuenta como badge si recomendado.
 */
export function getCoachBadges(coach: Coach, referenceDate: Date = new Date()): CoachBadgeView {
  const isRecommended = coach.tier === "recommended";
  return {
    recomendado: isRecommended,
    founder: !!coach.founder,
    specialties: isRecommended ? (coach.specialties ?? []).slice(0, 2) : [],
    distinctions: isRecommended ? (coach.distinctions ?? []) : [],
    decano: isRecommended && isDecano(coach, referenceDate),
  };
}

/* ──────────────────────────────────────────────
   URL helpers para la página catálogo /academy/coaches.
   Mantienen el estado de filtros sincronizado con la URL
   para que sean compartibles e indexables.
   ────────────────────────────────────────────── */

export interface CoachFilters {
  country: string;   // "all" o un país concreto
  language: string;  // "all" o código ISO
  specialty: string; // "all" o "juniors"/"adultos"/"competicion"
}

// Alias de tipado para los dos tipos que Next puede dar (mutable o readonly)
type ReadonlyURLSearchParams = { get(name: string): string | null };

/**
 * Construye la URL de /academy/coaches con los filtros como query params.
 * Sólo serializa los filtros que no son "all".
 */
export function buildCoachesUrl(filters: CoachFilters): string {
  const params = new URLSearchParams();
  if (filters.country !== "all") params.set("country", filters.country);
  if (filters.language !== "all") params.set("language", filters.language);
  if (filters.specialty !== "all") params.set("specialty", filters.specialty);
  const qs = params.toString();
  return `/academy/coaches${qs ? `?${qs}` : ""}`;
}

/**
 * Lee filtros desde URLSearchParams. Valores ausentes o inválidos caen en "all".
 */
export function parseCoachesFilters(params: URLSearchParams | ReadonlyURLSearchParams): CoachFilters {
  const country = params.get("country") ?? "all";
  const language = params.get("language") ?? "all";
  const specialty = params.get("specialty") ?? "all";
  const validSpecialty = (COACH_SPECIALTIES as readonly string[]).includes(specialty) ? specialty : "all";
  return {
    country: COACH_COUNTRIES.includes(country) ? country : "all",
    language: COACH_LANGUAGES.includes(language) ? language : "all",
    specialty: validSpecialty,
  };
}

/**
 * Aplica filtros a una lista de coaches.
 * "all" en cualquier dimensión = sin filtro en esa dimensión.
 */
export function filterCoaches(coaches: readonly Coach[], filters: CoachFilters): Coach[] {
  return coaches.filter(c => {
    if (filters.country !== "all" && c.location.country !== filters.country) return false;
    if (filters.language !== "all" && !(c.languages ?? []).includes(filters.language)) return false;
    if (filters.specialty !== "all" && !(c.specialties ?? []).includes(filters.specialty as CoachSpecialty)) return false;
    return true;
  });
}

/**
 * Toma los N destacados de una lista ya filtrada. Si hay menos featured que N,
 * completa con no-featured (mismo orden) hasta llegar a N. Si la lista filtrada
 * es menor que N, devuelve la lista entera.
 */
export function pickDisplayCoaches(sortedFiltered: readonly Coach[], n: number): Coach[] {
  const featured = sortedFiltered.filter(c => c.featured);
  if (featured.length >= n) return featured.slice(0, n);
  const needed = n - featured.length;
  const rest = sortedFiltered.filter(c => !c.featured).slice(0, needed);
  return [...featured, ...rest];
}
