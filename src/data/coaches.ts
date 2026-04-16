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

export type CoachSpecialty = "juniors" | "adultos" | "competicion";
export type CoachTier = "hq" | "recommended" | "elite";
/**
 * Tipo de nodo dentro de la red J3:
 *  - 'lab'     → J3 Lab (sede origen, solo Málaga).
 *  - 'academy' → J3 Academy (franquicia llave en mano con marca J3).
 *  - 'coach'   → Recomendado J3 (profesional individual con sello).
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
  /** Para filtros */
  specialties?: CoachSpecialty[];
  socials?: {
    instagram?: string;
    web?: string;
    coach360?: string;
  };
  /** Tier por defecto: "recommended". "hq" reservado para Málaga. */
  tier: CoachTier;
  /**
   * Tipo de nodo en la red. Default: 'coach'.
   * El Lab (Málaga) va como 'lab'. Las franquicias como 'academy'.
   */
  type?: CoachType;
  /** Destacar en la home / como primer pin abierto */
  featured?: boolean;
  /** Fecha ISO de alta en Coach360 (YYYY-MM-DD). Usada para ordenar dentro de cada tier. */
  joinedAt: string;
}

/* ──────────────────────────────────────────────
   Dataset — TODOS los coaches son reales.
   Los 12 coaches Recommended entraron a la formación
   Coach360 el 2025-08-01. La ficha arranca con campos
   mínimos (nombre, ubicación, idiomas por defecto) y
   se va rellenando conforme cada coach nos manda su
   Instagram, clubs, specialties y foto.
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
    specialties: ["juniors", "adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/j3padel",
      web: "https://j3padel.com",
    },
    tier: "hq",
    type: "lab",
    featured: true,
    joinedAt: "2005-01-01",
  },

  // ── Recommended · España ──
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    languages: ["es"],
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    joinedAt: "2025-08-01",
  },

  // ── Recommended · Italia ──
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
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
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    joinedAt: "2025-08-01",
  },

  // ── Recommended · Bélgica ──
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
    languages: ["nl", "es"],
    specialties: [],
    socials: {},
    tier: "recommended",
    type: "coach",
    featured: true,
    joinedAt: "2025-08-01",
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
] as const;

/* ──────────────────────────────────────────────
   Ordenación híbrida: tier → antigüedad dentro del tier.
   HQ siempre primero · dentro de Recommended, los más
   antiguos (joinedAt menor) van delante. Es la palanca
   de retención Coach360 — darse de baja hace que al volver
   se pierda posicionamiento dentro del tier.
   ────────────────────────────────────────────── */

const TIER_ORDER: Record<CoachTier, number> = {
  hq: 0,
  elite: 1,
  recommended: 2,
};

/**
 * Devuelve una copia ordenada por (tier ascendente) → (joinedAt ascendente).
 */
export function sortCoaches(coaches: readonly Coach[]): Coach[] {
  return [...coaches].sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.joinedAt.localeCompare(b.joinedAt);
  });
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
