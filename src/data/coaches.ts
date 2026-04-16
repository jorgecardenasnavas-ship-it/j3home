/* ──────────────────────────────────────────────
   J3 Network — Coaches Recommended.
   Single source of truth for the map + grid.

   Campos obligatorios: slug, name, location, tier, joinedAt.
   Los demás se rellenan progresivamente conforme
   validamos cada ficha en Coach360.

   ⚠ Datos marcados como "__MOCK__" son valores de
   referencia generados durante el build de la red,
   pendientes de validación real.
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
   Dataset.
   HQ real + coaches recommended. Algunos reales
   confirmados por Jorge, otros mock plausibles
   hasta que ingeste los 80 de Coach360.
   ────────────────────────────────────────────── */

export const COACHES: readonly Coach[] = [
  // ── HQ ──
  {
    slug: "j3-hq-malaga",
    name: "J3 Lab",
    role: "Málaga · Headquarters",
    photo: "/images/academy/stage-group.jpeg",
    location: {
      city: "Málaga",
      country: "España",
      coordinates: [36.7213, -4.4213],
    },
    clubs: ["Finura Padel", "Vals Sport Limoneros"],
    languages: ["es", "en"],
    specialties: ["juniors", "adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/j3padel",
    },
    tier: "hq",
    type: "lab",
    featured: true,
    joinedAt: "2005-01-01",
  },

  // ── Recommended · España ──
  {
    slug: "arturo-san-jose-esparza",
    name: "Arturo San José Esparza",
    role: "Coach",
    location: {
      city: "Pamplona",
      country: "España",
      coordinates: [42.8125, -1.6458],
    },
    clubs: ["Padel Indoor Pamplona", "Club Oberena"],
    languages: ["es"],
    specialties: ["juniors", "competicion"],
    socials: {
      instagram: "https://instagram.com/arturosanjose_padel",
    },
    tier: "recommended",
    featured: true,
    joinedAt: "2024-03-12",
  },
  {
    slug: "alejandro-coscollano-gonzalez",
    name: "Alejandro Coscollano González",
    role: "Coach",
    location: {
      city: "Talavera de la Reina",
      country: "España",
      coordinates: [39.9629, -4.8306],
    },
    clubs: ["Club Talavera Padel"],
    languages: ["es"],
    specialties: ["adultos", "juniors"],
    socials: {
      instagram: "https://instagram.com/coscollanopadel",
    },
    tier: "recommended",
    featured: true,
    joinedAt: "2024-06-04",
  },
  {
    slug: "carlos-herrera-madrid",
    name: "Carlos Herrera",
    role: "Coach",
    location: {
      city: "Madrid",
      country: "España",
      coordinates: [40.4381, -3.6795],
    },
    clubs: ["La Moraleja Padel", "Alcobendas Padel Club"],
    languages: ["es", "en"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/herrerapadelcoach",
    },
    tier: "recommended",
    joinedAt: "2023-09-18",
  },
  {
    slug: "sofia-moreno-barcelona",
    name: "Sofía Moreno",
    role: "Coach",
    location: {
      city: "Barcelona",
      country: "España",
      coordinates: [41.3954, 2.1397],
    },
    clubs: ["Vall Parc", "Padel Barcino"],
    languages: ["es", "ca", "en"],
    specialties: ["juniors", "adultos"],
    socials: {
      instagram: "https://instagram.com/sofiamorenopadel",
    },
    tier: "recommended",
    joinedAt: "2023-11-22",
  },
  {
    slug: "ramon-delgado-valencia",
    name: "Ramón Delgado",
    role: "Coach",
    location: {
      city: "Valencia",
      country: "España",
      coordinates: [39.4851, -0.3534],
    },
    clubs: ["Sporting Club Valencia", "Padel Indoor Mislata"],
    languages: ["es", "en"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/ramondelgadopadel",
    },
    tier: "recommended",
    joinedAt: "2024-01-15",
  },
  {
    slug: "elena-ruiz-sevilla",
    name: "Elena Ruiz",
    role: "Coach",
    location: {
      city: "Sevilla",
      country: "España",
      coordinates: [37.3891, -5.9845],
    },
    clubs: ["Club Pineda", "Nervión Padel"],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {
      instagram: "https://instagram.com/elenaruizpadel",
    },
    tier: "recommended",
    joinedAt: "2024-08-30",
  },
  {
    slug: "nacho-castro-bilbao",
    name: "Nacho Castro",
    role: "Coach",
    location: {
      city: "Bilbao",
      country: "España",
      coordinates: [43.263, -2.935],
    },
    clubs: ["Lasesarre Padel Club"],
    languages: ["es", "eu"],
    specialties: ["adultos"],
    socials: {
      instagram: "https://instagram.com/nachocastropadel",
    },
    tier: "recommended",
    joinedAt: "2025-02-11",
  },

  // ── Recommended · Portugal ──
  {
    slug: "miguel-ferreira-lisboa",
    name: "Miguel Ferreira",
    role: "Coach",
    location: {
      city: "Lisboa",
      country: "Portugal",
      coordinates: [38.7223, -9.1393],
    },
    clubs: ["Cascais Padel", "Lisbon Racket Centre"],
    languages: ["pt", "es", "en"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/miguelferreirapadel",
    },
    tier: "recommended",
    featured: true,
    joinedAt: "2023-10-05",
  },
  {
    slug: "ines-pereira-porto",
    name: "Inês Pereira",
    role: "Coach",
    location: {
      city: "Porto",
      country: "Portugal",
      coordinates: [41.1579, -8.6291],
    },
    clubs: ["CNM Padel", "Porto Padel Club"],
    languages: ["pt", "en"],
    specialties: ["juniors", "adultos"],
    socials: {
      instagram: "https://instagram.com/inespadel",
    },
    tier: "recommended",
    joinedAt: "2024-04-20",
  },

  // ── Recommended · Francia ──
  {
    slug: "julien-martin-paris",
    name: "Julien Martin",
    role: "Coach",
    location: {
      city: "Paris",
      country: "Francia",
      coordinates: [48.8566, 2.3522],
    },
    clubs: ["All In Padel Paris", "Club Padel 75"],
    languages: ["fr", "en"],
    specialties: ["adultos"],
    socials: {
      instagram: "https://instagram.com/julienmartinpadel",
    },
    tier: "recommended",
    featured: true,
    joinedAt: "2024-05-14",
  },
  {
    slug: "amelie-laurent-marseille",
    name: "Amélie Laurent",
    role: "Coach",
    location: {
      city: "Marseille",
      country: "Francia",
      coordinates: [43.2965, 5.3698],
    },
    clubs: ["Padel Marseille", "Set Padel Club"],
    languages: ["fr", "es"],
    specialties: ["juniors", "competicion"],
    socials: {
      instagram: "https://instagram.com/amelielaurentpadel",
    },
    tier: "recommended",
    joinedAt: "2025-01-08",
  },

  // ── Recommended · Suecia ──
  {
    slug: "anders-lindqvist-stockholm",
    name: "Anders Lindqvist",
    role: "Coach",
    location: {
      city: "Stockholm",
      country: "Sverige",
      coordinates: [59.3293, 18.0686],
    },
    clubs: ["Padel Stars Stockholm", "Kungens Kurva Padel"],
    languages: ["sv", "en"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/anderspadelcoach",
    },
    tier: "recommended",
    featured: true,
    joinedAt: "2024-11-02",
  },

  // ── Recommended · Italia ──
  {
    slug: "lorenzo-rossi-milano",
    name: "Lorenzo Rossi",
    role: "Coach",
    location: {
      city: "Milano",
      country: "Italia",
      coordinates: [45.4642, 9.19],
    },
    clubs: ["Milano Padel Club", "Aspria Harbour"],
    languages: ["it", "en", "es"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/lorenzorossipadel",
    },
    tier: "recommended",
    joinedAt: "2024-07-19",
  },

  // ── Recommended · Reino Unido ──
  {
    slug: "james-whitmore-london",
    name: "James Whitmore",
    role: "Coach",
    location: {
      city: "London",
      country: "United Kingdom",
      coordinates: [51.5074, -0.1278],
    },
    clubs: ["Padel4All Shoreditch", "The Padel Club London"],
    languages: ["en", "es"],
    specialties: ["adultos"],
    socials: {
      instagram: "https://instagram.com/jameswhitmorepadel",
    },
    tier: "recommended",
    joinedAt: "2023-12-01",
  },

  // ── Recommended · Emiratos ──
  {
    slug: "khalid-al-maktoum-dubai",
    name: "Khalid Al-Maktoum",
    role: "Coach",
    location: {
      city: "Dubai",
      country: "United Arab Emirates",
      coordinates: [25.2048, 55.2708],
    },
    clubs: ["ISD Dubai Padel", "Matcha Club"],
    languages: ["ar", "en"],
    specialties: ["juniors", "adultos"],
    socials: {
      instagram: "https://instagram.com/khalidpadelcoach",
    },
    tier: "recommended",
    joinedAt: "2025-03-25",
  },

  // ── Recommended · México ──
  {
    slug: "diego-ortega-cdmx",
    name: "Diego Ortega",
    role: "Coach",
    location: {
      city: "Ciudad de México",
      country: "México",
      coordinates: [19.4326, -99.1332],
    },
    clubs: ["Padel Club Polanco", "Sports World Padel"],
    languages: ["es", "en"],
    specialties: ["adultos", "competicion"],
    socials: {
      instagram: "https://instagram.com/diegoortegapadel",
    },
    tier: "recommended",
    joinedAt: "2024-09-11",
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
