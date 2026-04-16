/* ──────────────────────────────────────────────
   J3 Network — Coaches Recommended.
   Single source of truth for the map + grid.
   Campos obligatorios: slug, name, location.
   Los demás son opcionales hasta que completemos
   cada ficha.
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
   Seeds (placeholders honestos mientras llegan
   los 80 reales de Coach360).
   ────────────────────────────────────────────── */

export const COACHES: readonly Coach[] = [
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
  {
    slug: "arturo-san-jose-esparza",
    name: "Arturo San José Esparza",
    role: "Coach",
    location: {
      city: "Pamplona",
      country: "España",
      coordinates: [42.8125, -1.6458],
    },
    languages: ["es"],
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
    languages: ["es"],
    tier: "recommended",
  },
] as const;

/** Lista de países/ciudades únicas para alimentar filtros. */
export const COACH_COUNTRIES = Array.from(
  new Set(COACHES.map(c => c.location.country)),
).sort();

export const COACH_LANGUAGES = Array.from(
  new Set(COACHES.flatMap(c => c.languages ?? [])),
).sort();
