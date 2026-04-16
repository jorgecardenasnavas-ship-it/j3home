/* ──────────────────────────────────────────────
   J3 Network — Coaches Recommended.
   Single source of truth for the map + grid.

   Campos obligatorios: slug, name, location, tier.
   Los demás se rellenan progresivamente conforme
   validamos cada ficha en Coach360.

   ⚠ Datos marcados como "__MOCK__" son valores de
   referencia generados durante el build de la red,
   pendientes de validación real.
   ────────────────────────────────────────────── */

export type CoachSpecialty = "juniors" | "adultos" | "competicion";
export type CoachTier = "hq" | "recommended" | "elite";

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
  /** Destacar en la home / como primer pin abierto */
  featured?: boolean;
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
    name: "J3 Padel HQ",
    role: "Headquarters",
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
    featured: true,
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
