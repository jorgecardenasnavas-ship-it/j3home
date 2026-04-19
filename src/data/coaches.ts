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
 * Tier del coach — capa base que clasifica el NODO en el mapa:
 *
 *  - 'hq'    → J3 Lab / Headquarter (sede J3 propia, Málaga).
 *  - 'coach' → Cualquier coach de la red. Su ESTADO visible (base, certificado
 *              activo, ex-certificado, mentor con distinciones) se deriva de
 *              los campos `certifiedAt`, `certificationActive` y `mentorActive`
 *              — no del tier.
 *
 *  Nota: versiones anteriores separaban 'recommended' y 'trained' como tiers.
 *  Se abandona esa distinción — todos los coaches son iguales a nivel de pin
 *  en el mapa. La diferencia vive en la card.
 */
export type CoachTier = "hq" | "coach";

/**
 * Distinciones reseñables que J3 puede avalar. Solo se renderizan si el
 * coach tiene `mentorActive: true` (Plan Mentor activo). Se perderán al
 * instante si baja de plan — son estado activo, no medallas ganadas.
 *
 *  - 'forma-coaches'      → Enseña el método J3 a otros entrenadores.
 *  - 'jugadores-circuito' → Tiene alumnos activos en rankings nacionales o pro.
 *  - 'multilingue'        → Trabaja profesionalmente en 3+ idiomas.
 *
 *  El 'decano' (5+ años en la red) se computa desde joinedAt, no se
 *  almacena.
 */
export type CoachDistinction = "forma-coaches" | "jugadores-circuito" | "multilingue";

/**
 * Tipo de nodo en la red J3:
 *  - 'lab'     → J3 Lab (sede origen, solo Málaga).
 *  - 'academy' → J3 Academy (franquicia llave en mano con marca J3).
 *  - 'coach'   → Coach individual.
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
  /** Especialidades. Se muestran en la card SOLO si certificationActive=true
   *  (J3 solo avala especialidades de coaches actualmente certificados).
   *  Siempre sirven para filtrar. */
  specialties?: CoachSpecialty[];
  socials?: {
    instagram?: string;
    web?: string;
    coach360?: string;
  };
  /** 'hq' solo para sedes J3 propias. Resto: 'coach'. */
  tier: CoachTier;
  /**
   * Tipo de nodo en la red. Default: 'coach'.
   * El Lab (Málaga) va como 'lab'. Las franquicias como 'academy'.
   */
  type?: CoachType;
  /** Destacar en la home / como primer pin abierto */
  featured?: boolean;
  /**
   * Founder J3: miembro de la primera hornada. Distinción histórica
   * irrepetible. Una vez Founder, Founder para siempre — incluso si
   * baja a plan básico.
   */
  founder?: boolean;
  /**
   * Fecha ISO (YYYY-MM-DD) de la última certificación obtenida.
   * Null/undefined → nunca se certificó (plan base 19€).
   */
  certifiedAt?: string;
  /**
   * Si true, mantiene plan Plus o Mentor activo y la certificación está
   * VIGENTE. La card muestra "Certificado desde {mes año}".
   * Si false con certifiedAt presente → EX-CERTIFICADO. La card muestra
   * "Última certificación {mes año}".
   * Si certifiedAt es null/undefined este flag se ignora (coach base).
   */
  certificationActive?: boolean;
  /**
   * Plan Mentor activo. Requiere certificationActive=true. Habilita el
   * render de `distinctions` en la card. Al bajar de Mentor a Plus, se
   * pone a false y las distinciones desaparecen inmediatamente.
   */
  mentorActive?: boolean;
  /**
   * Distinciones reseñables verificadas por J3. Solo se muestran si
   * mentorActive=true.
   */
  distinctions?: CoachDistinction[];
  /** Fecha ISO (YYYY-MM-DD) de alta en la plataforma. Inmutable.
   *  La card la muestra como "Coach360 desde {mes año}". */
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

  /* ── Fundadores · primera hornada ──
     Los 16 coaches que iniciaron Coach360 el 2025-08-01. Todos llevan
     badge 'founder' (histórico, irrepetible). Arrancaron la fase beta
     y se certificaron en Feb 2026 tras superar los requisitos iniciales.
     Los que además están en Plan Mentor activo tienen `mentorActive:
     true` y muestran sus distinciones. Los datos (specialties,
     distinctions) son sample hasta que cada coach confirme los suyos. */

  // ── España ──
  {
    slug: "alejandro-coscollano-gonzalez",
    name: "Alejandro Coscollano González",
    role: "Coach",
    location: { city: "Talavera de la Reina", country: "España", coordinates: [39.9629, -4.8306] },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["forma-coaches"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "aleix-vinals-llagosta",
    name: "Aleix Viñals",
    role: "Coach",
    location: { city: "La Llagosta", country: "España", coordinates: [41.5182, 2.1932] },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "andres-fernandez-murcia",
    name: "Andrés Fernández",
    role: "Coach",
    location: { city: "San Javier", country: "España", coordinates: [37.8045, -0.8360] },
    clubs: [],
    languages: ["es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "arturo-san-jose-esparza",
    name: "Arturo San José Esparza",
    role: "Coach",
    location: { city: "Pamplona", country: "España", coordinates: [42.8125, -1.6458] },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors", "competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "david-camunas-molina",
    name: "David Camuñas Molina",
    role: "Coach",
    location: { city: "Talavera de la Reina", country: "España", coordinates: [39.9629, -4.8306] },
    clubs: [],
    languages: ["es"],
    specialties: ["camps"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "diego-valdez-castelldefels",
    name: "Diego Valdez",
    role: "Coach",
    location: { city: "Castelldefels", country: "España", coordinates: [41.2800, 1.9755] },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "manuel-sarachaga-gomez",
    name: "Manuel Sarachaga Gómez",
    role: "Coach",
    location: { city: "Santander", country: "España", coordinates: [43.4623, -3.8099] },
    clubs: [],
    languages: ["es"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "mati-pereira-tarragona",
    name: "Mati Pereira",
    role: "Coach",
    location: { city: "Tarragona", country: "España", coordinates: [41.1189, 1.2445] },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["forma-coaches"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "miguel-laredo-pontevedra",
    name: "Miguel Laredo",
    role: "Coach",
    location: { city: "Pontevedra", country: "España", coordinates: [42.4336, -8.6448] },
    clubs: [],
    languages: ["es"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "nacho-gonzalez-madrid",
    name: "Nacho González",
    role: "Coach",
    location: { city: "Villanueva de la Cañada", country: "España", coordinates: [40.4467, -3.9942] },
    clubs: [],
    languages: ["es", "en"],
    specialties: ["competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["forma-coaches", "jugadores-circuito"],
    joinedAt: "2025-08-01",
  },

  // ── Italia ──
  {
    slug: "camilo-masmut-milano",
    name: "Camilo Masmut",
    role: "Coach",
    location: { city: "Milano", country: "Italia", coordinates: [45.4642, 9.1900] },
    clubs: [],
    languages: ["it", "es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["multilingue"],
    joinedAt: "2025-08-01",
  },
  {
    slug: "emilio-cigala-desenzano",
    name: "Emilio Cigala",
    role: "Coach",
    location: { city: "Desenzano del Garda", country: "Italia", coordinates: [45.4710, 10.5380] },
    clubs: [],
    languages: ["it", "es"],
    specialties: ["competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },
  {
    slug: "saul-rielo-cagliari",
    name: "Saúl Rielo",
    role: "Coach",
    location: { city: "Cagliari", country: "Italia", coordinates: [39.2238, 9.1217] },
    clubs: [],
    languages: ["it", "es"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },

  // ── Argentina ──
  {
    slug: "lucas-barros-mar-del-plata",
    name: "Lucas Barros",
    role: "Coach",
    location: { city: "Mar del Plata", country: "Argentina", coordinates: [-38.0055, -57.5426] },
    clubs: [],
    languages: ["es"],
    specialties: ["competicion"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["jugadores-circuito"],
    joinedAt: "2025-08-01",
  },

  // ── Portugal ──
  {
    slug: "andre-silva-esposende",
    name: "André Silva",
    role: "Coach",
    location: { city: "Esposende", country: "Portugal", coordinates: [41.5362, -8.7817] },
    clubs: [],
    languages: ["pt", "es"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    joinedAt: "2025-08-01",
  },

  // ── Bélgica ──
  {
    slug: "manuel-agten-sanchez",
    name: "Manuel Agten Sanchez",
    role: "Coach",
    location: { city: "Tongeren", country: "Bélgica", coordinates: [50.7802, 5.4646] },
    clubs: [],
    languages: ["nl", "es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["multilingue"],
    joinedAt: "2025-08-01",
  },

  /* ── Datos de muestra: los 4 estados visibles ──
     Ilustran los casos A/B/C/D del documento de escalera de valor:
       A · Base (19€, sin certificación)
       B · Certificado activo (Plus)
       C · Founder + certificado + Mentor (viven en el bloque fundadores)
       D · Ex-certificada (bajó a 19€ tras certificarse)
     Estos coaches son sample — se eliminarán cuando lleguen reales. */

  // A · Base (Coach360 19€, sin certificación obtenida nunca)
  {
    slug: "carlos-merino-sevilla",
    name: "Carlos Merino",
    role: "Coach",
    location: { city: "Sevilla", country: "España", coordinates: [37.3891, -5.9845] },
    clubs: [],
    languages: ["es"],
    specialties: [],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    joinedAt: "2026-02-14",
  },

  // B · Certificado activo (Plus, sin mentor)
  {
    slug: "lucia-santos-lisboa",
    name: "Lucía Santos",
    role: "Coach",
    location: { city: "Lisboa", country: "Portugal", coordinates: [38.7223, -9.1393] },
    clubs: [],
    languages: ["pt", "es"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    certifiedAt: "2026-03-10",
    certificationActive: true,
    joinedAt: "2026-03-05",
  },

  // A · Base (nuevo en plataforma, aún sin certificar)
  {
    slug: "thomas-bernard-lyon",
    name: "Thomas Bernard",
    role: "Coach",
    location: { city: "Lyon", country: "Francia", coordinates: [45.7640, 4.8357] },
    clubs: [],
    languages: ["fr", "en"],
    specialties: [],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    joinedAt: "2026-01-20",
  },

  // D · Ex-certificada (se certificó, bajó a 19€ — cert marcada como histórica)
  {
    slug: "martina-rossi-milan",
    name: "Martina Rossi",
    role: "Coach",
    location: { city: "Milán", country: "Italia", coordinates: [45.4642, 9.1900] },
    clubs: [],
    languages: ["it", "en"],
    specialties: [],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    certifiedAt: "2026-03-18",
    certificationActive: false,
    joinedAt: "2025-11-10",
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
   Ordenación: estado → founder boost → antigüedad.

   Estado (derivado, ver getCoachStatus):
     0 · HQ (J3 Lab)
     1 · Certificación activa (Plus o Mentor)
     2 · Ex-certificado (ya no activo pero con historia)
     3 · Base (19€, sin certificación)

   Dentro del mismo estado, los Founders empujan un puesto.
   Finalmente por antigüedad (más veteranos primero).
   ────────────────────────────────────────────── */

/**
 * Estado derivado del coach. 0 = mejor posicionado.
 * No se almacena — se computa en cada render. Los campos de verdad
 * son `tier`, `certifiedAt` y `certificationActive`.
 */
export type CoachStatus = "hq" | "certified-active" | "ex-certified" | "base";

export function getCoachStatus(coach: Coach): CoachStatus {
  if (coach.tier === "hq") return "hq";
  if (coach.certifiedAt && coach.certificationActive) return "certified-active";
  if (coach.certifiedAt && !coach.certificationActive) return "ex-certified";
  return "base";
}

const STATUS_ORDER: Record<CoachStatus, number> = {
  "hq": 0,
  "certified-active": 1,
  "ex-certified": 2,
  "base": 3,
};

/** Devuelve una copia ordenada por (status) → (founder) → (joinedAt). */
export function sortCoaches(coaches: readonly Coach[]): Coach[] {
  return [...coaches].sort((a, b) => {
    const statusDiff = STATUS_ORDER[getCoachStatus(a)] - STATUS_ORDER[getCoachStatus(b)];
    if (statusDiff !== 0) return statusDiff;
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
  /** Estado computado del coach (base / certified-active / ex-certified / hq). */
  status: CoachStatus;
  /** ¿Mostrar badge "Founder"? (distinción histórica). */
  founder: boolean;
  /** Specialties verificadas a mostrar en la card (máx. 2). Vacío si no hay
   *  certificación activa — J3 solo avala specialties cuando la cert está vigente. */
  specialties: CoachSpecialty[];
  /** Distinciones reseñables — solo si mentorActive=true. */
  distinctions: CoachDistinction[];
  /** ¿Es decano? (5+ años en la red). Solo se pinta si mentor. */
  decano: boolean;
  /** Fecha ISO (YYYY-MM-DD) de alta — siempre presente. */
  joinedAt: string;
  /** Fecha ISO de certificación — presente si el coach tiene certifiedAt. */
  certifiedAt: string | null;
}

/**
 * Normaliza qué se muestra en la card de un coach según las reglas del doc:
 *
 *  - Founder: siempre que esté marcado (histórico, compatible con cualquier estado).
 *  - Specialties verificadas: solo si certificationActive (J3 no avala práctica
 *    de un ex-certificado). Máx. 2 en la card.
 *  - Distinctions: solo si mentorActive. Se pierden al instante si baja de plan.
 *  - Decano: computado desde joinedAt. Solo se pinta si está en Mentor
 *    (coherente con la regla general de distinciones).
 *  - joinedAt / certifiedAt: las fechas crudas que la capa de UI formatea
 *    según idioma ("Coach360 desde Ago 2025" / "Certificado desde Feb 2026"
 *    / "Última certificación Feb 2026" según el status).
 */
export function getCoachBadges(coach: Coach, referenceDate: Date = new Date()): CoachBadgeView {
  const status = getCoachStatus(coach);
  const certActive = status === "certified-active";
  const isMentor = certActive && !!coach.mentorActive;
  return {
    status,
    founder: !!coach.founder,
    specialties: certActive ? (coach.specialties ?? []).slice(0, 2) : [],
    distinctions: isMentor ? (coach.distinctions ?? []) : [],
    decano: isMentor && isDecano(coach, referenceDate),
    joinedAt: coach.joinedAt,
    certifiedAt: coach.certifiedAt ?? null,
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
  /** Toggle "Solo certificados" — cuando true, oculta coaches base
   *  y ex-certificados. Solo deja HQ + certificados activos. */
  certifiedOnly: boolean;
}

// Alias de tipado para los dos tipos que Next puede dar (mutable o readonly)
type ReadonlyURLSearchParams = { get(name: string): string | null };

/**
 * Construye la URL de /academy/coaches con los filtros como query params.
 * Sólo serializa los filtros que no son su valor por defecto.
 */
export function buildCoachesUrl(filters: CoachFilters): string {
  const params = new URLSearchParams();
  if (filters.country !== "all") params.set("country", filters.country);
  if (filters.language !== "all") params.set("language", filters.language);
  if (filters.specialty !== "all") params.set("specialty", filters.specialty);
  if (filters.certifiedOnly) params.set("certified", "1");
  const qs = params.toString();
  return `/academy/coaches${qs ? `?${qs}` : ""}`;
}

/**
 * Lee filtros desde URLSearchParams. Valores ausentes o inválidos caen en default.
 */
export function parseCoachesFilters(params: URLSearchParams | ReadonlyURLSearchParams): CoachFilters {
  const country = params.get("country") ?? "all";
  const language = params.get("language") ?? "all";
  const specialty = params.get("specialty") ?? "all";
  const validSpecialty = (COACH_SPECIALTIES as readonly string[]).includes(specialty) ? specialty : "all";
  const certifiedOnly = params.get("certified") === "1";
  return {
    country: COACH_COUNTRIES.includes(country) ? country : "all",
    language: COACH_LANGUAGES.includes(language) ? language : "all",
    specialty: validSpecialty,
    certifiedOnly,
  };
}

/**
 * Aplica filtros a una lista de coaches.
 * "all" en cualquier dimensión = sin filtro en esa dimensión.
 * certifiedOnly=true → solo HQ + coaches con certificationActive.
 */
export function filterCoaches(coaches: readonly Coach[], filters: CoachFilters): Coach[] {
  return coaches.filter(c => {
    if (filters.country !== "all" && c.location.country !== filters.country) return false;
    if (filters.language !== "all" && !(c.languages ?? []).includes(filters.language)) return false;
    if (filters.specialty !== "all" && !(c.specialties ?? []).includes(filters.specialty as CoachSpecialty)) return false;
    if (filters.certifiedOnly) {
      const status = getCoachStatus(c);
      if (status !== "hq" && status !== "certified-active") return false;
    }
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
