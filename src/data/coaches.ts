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
 * Distinciones reseñables que J3 ha verificado del coach. Son LOGROS
 * GANADOS: una vez conseguidas se quedan, incluso si el coach baja
 * del Plan Mentor a Plus o 19€. Mentor sirve para GANAR nuevas, no
 * para mantener las que ya tienes.
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
   * Founder J3: miembro de la primera hornada (16 coaches de Ago 2025).
   * Distinción histórica irrepetible. Una vez Founder, Founder para
   * siempre — incluso si baja a plan básico.
   */
  founder?: boolean;
  /**
   * Gen ONE J3: no-founder que entró en la plataforma durante 2025.
   * Segunda ola de early adopters. Generaciones futuras irán por año
   * (Gen '26 cuando cierre 2026, Gen '27, etc.). Se puede computar desde
   * joinedAt pero lo guardamos explícito para simplicidad.
   */
  genOne?: boolean;
  /**
   * Fecha ISO (YYYY-MM-DD) de la última certificación obtenida.
   * Null/undefined → nunca se certificó → NO APARECE EN EL MAPA.
   */
  certifiedAt?: string;
  /**
   * Si true, mantiene plan Plus o Mentor activo y la certificación está
   * VIGENTE. La card muestra "Certificado desde {mes año}" en dorado.
   * Si false con certifiedAt presente → EX-CERTIFICADO. La card muestra
   * "Última certificación {mes año}" en itálica apagada.
   */
  certificationActive?: boolean;
  /**
   * Plan Mentor activo. Relevante a nivel producto (quien está en Mentor
   * puede ganar NUEVAS distinciones). No afecta al display: las distinciones
   * ya ganadas se muestran siempre, independientemente del plan actual.
   */
  mentorActive?: boolean;
  /**
   * Distinciones reseñables verificadas por J3. Son logros ganados y
   * permanentes — se muestran siempre que el array no esté vacío,
   * independientemente de si el coach sigue o no en Plan Mentor.
   */
  distinctions?: CoachDistinction[];
  /** Fecha ISO (YYYY-MM-DD) de alta en la plataforma. Inmutable.
   *  La card la muestra como "Coach360 desde {mes año}". */
  joinedAt: string;
}

/* ──────────────────────────────────────────────
   Dataset de prueba · v1
   9 casuísticas inventadas que cubren todos los estados visibles
   del modelo Coach360. Se reemplazarán por datos reales conforme
   cada coach confirme los suyos.

   Cobertura:
     1. HQ — J3 Lab Málaga
     2. Certificado activo · sin extras (baseline limpio)
     3. Certificado activo + Gen ONE
     4. Certificado activo + Founder
     5. Founder + Mentor + 2 distinciones (la card más rica)
     6. Gen ONE + Mentor + 1 distinción
     7. Ex-certificado · sin extras (estado apagado)
     8. Ex-certificado + Founder
     9. Ex-certificado + 2 distinciones (logros permanentes)
   ────────────────────────────────────────────── */

export const COACHES: readonly Coach[] = [
  // 1 · HQ — J3 Lab Málaga
  {
    slug: "j3-hq-malaga",
    name: "J3 Lab",
    role: "Málaga · Headquarters",
    photo: "/images/vals-1.jpg",
    location: {
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

  // 2 · Certificado activo · limpio (Plus reciente, sin Founder/Gen ONE/distinciones)
  {
    slug: "ana-ruiz-madrid",
    name: "Ana Ruiz",
    role: "Coach",
    location: { city: "Madrid", country: "España", coordinates: [40.4168, -3.7038] },
    clubs: [],
    languages: ["es"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    certifiedAt: "2026-03-12",
    certificationActive: true,
    joinedAt: "2026-02-01",
  },

  // 3 · Certificado activo + Gen ONE (entró en 2025, no founder)
  {
    slug: "marc-torres-barcelona",
    name: "Marc Torres",
    role: "Coach",
    location: { city: "Barcelona", country: "España", coordinates: [41.3874, 2.1686] },
    clubs: [],
    languages: ["es", "ca"],
    specialties: ["juniors"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    genOne: true,
    certifiedAt: "2026-01-20",
    certificationActive: true,
    joinedAt: "2025-10-14",
  },

  // 4 · Certificado activo + Founder (sin distinciones, solo Plus)
  {
    slug: "laura-vega-valencia",
    name: "Laura Vega",
    role: "Coach",
    location: { city: "Valencia", country: "España", coordinates: [39.4699, -0.3763] },
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
    joinedAt: "2025-08-01",
  },

  // 5 · Founder + Mentor + 2 distinciones (la card más rica)
  {
    slug: "nacho-gonzalez-sevilla",
    name: "Nacho González",
    role: "Coach",
    location: { city: "Sevilla", country: "España", coordinates: [37.3891, -5.9845] },
    clubs: [],
    languages: ["es", "en"],
    specialties: ["competicion", "juniors"],
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

  // 6 · Gen ONE + Mentor + 1 distinción
  {
    slug: "giulia-rossi-milano",
    name: "Giulia Rossi",
    role: "Coach",
    location: { city: "Milano", country: "Italia", coordinates: [45.4642, 9.1900] },
    clubs: [],
    languages: ["it", "es", "en"],
    specialties: ["adultos"],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    genOne: true,
    certifiedAt: "2026-01-28",
    certificationActive: true,
    mentorActive: true,
    distinctions: ["multilingue"],
    joinedAt: "2025-11-03",
  },

  // 7 · Ex-certificado · limpio (se certificó, luego bajó a 19€)
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
    certifiedAt: "2026-02-05",
    certificationActive: false,
    joinedAt: "2025-12-10",
  },

  // 8 · Ex-certificado + Founder (Founder que bajó a 19€ pero mantiene el histórico)
  {
    slug: "pedro-santos-lisboa",
    name: "Pedro Santos",
    role: "Coach",
    location: { city: "Lisboa", country: "Portugal", coordinates: [38.7223, -9.1393] },
    clubs: [],
    languages: ["pt", "es"],
    specialties: [],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    founder: true,
    certifiedAt: "2026-02-15",
    certificationActive: false,
    joinedAt: "2025-08-01",
  },

  // 9 · Ex-certificado + 2 distinciones (logros permanentes tras dejar Mentor)
  {
    slug: "james-walker-london",
    name: "James Walker",
    role: "Coach",
    location: { city: "London", country: "Reino Unido", coordinates: [51.5074, -0.1278] },
    clubs: [],
    languages: ["en", "es"],
    specialties: [],
    socials: {},
    tier: "coach",
    type: "coach",
    featured: true,
    certifiedAt: "2026-01-15",
    certificationActive: false,
    distinctions: ["forma-coaches", "multilingue"],
    joinedAt: "2025-09-22",
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
  /** Estado computado del coach (certified-active / ex-certified / hq). */
  status: CoachStatus;
  /** ¿Mostrar badge "Founder"? (distinción histórica). */
  founder: boolean;
  /** ¿Mostrar badge "Gen ONE"? (early adopter no-founder de 2025). */
  genOne: boolean;
  /** Specialties verificadas a mostrar en la card (máx. 2). Vacío si no hay
   *  certificación activa — J3 solo avala specialties cuando la cert está vigente. */
  specialties: CoachSpecialty[];
  /** Distinciones reseñables — se muestran siempre que se hayan ganado,
   *  sean permanentes (independientes del Plan Mentor). */
  distinctions: CoachDistinction[];
  /** ¿Es decano? (5+ años en la red). Computado desde joinedAt. */
  decano: boolean;
  /** Fecha ISO (YYYY-MM-DD) de alta — siempre presente. */
  joinedAt: string;
  /** Fecha ISO de certificación — presente si el coach tiene certifiedAt. */
  certifiedAt: string | null;
}

/**
 * Normaliza qué se muestra en la card de un coach. Reglas:
 *
 *  - Founder: badge visible siempre que esté marcado (histórico, permanente).
 *  - Gen ONE: badge visible siempre que esté marcado (histórico, permanente).
 *  - Specialties verificadas: solo si certificationActive (J3 no avala
 *    práctica actual de un ex-certificado). Máx. 2 en la card.
 *  - Distinctions: siempre visibles si el array tiene items. Son logros
 *    permanentes — se mantienen aunque el coach deje Mentor o baje de plan.
 *  - Decano: computado desde joinedAt (5+ años en la red).
 *  - joinedAt / certifiedAt: fechas crudas que la capa de UI formatea
 *    según idioma ("Coach360 desde Ago 2025" / "Certificado desde Feb 2026"
 *    / "Última certificación Feb 2026" según el status).
 */
export function getCoachBadges(coach: Coach, referenceDate: Date = new Date()): CoachBadgeView {
  const status = getCoachStatus(coach);
  const certActive = status === "certified-active";
  return {
    status,
    founder: !!coach.founder,
    genOne: !!coach.genOne,
    specialties: certActive ? (coach.specialties ?? []).slice(0, 2) : [],
    distinctions: coach.distinctions ?? [],
    decano: isDecano(coach, referenceDate),
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
  return {
    country: COACH_COUNTRIES.includes(country) ? country : "all",
    language: COACH_LANGUAGES.includes(language) ? language : "all",
    specialty: validSpecialty,
  };
}

/**
 * Aplica filtros a una lista de coaches.
 * "all" en cualquier dimensión = sin filtro en esa dimensión.
 *
 * Regla de oro (siempre aplicada): en el mapa solo aparecen coaches
 * certificados (activos o ex-certificados). Los que nunca pasaron el
 * examen no son visibles — han pagado por contenido, no por visibilidad.
 */
export function filterCoaches(coaches: readonly Coach[], filters: CoachFilters): Coach[] {
  return coaches.filter(c => {
    // Regla de oro: solo certificados aparecen. HQ siempre pasa.
    const status = getCoachStatus(c);
    if (status !== "hq" && status !== "certified-active" && status !== "ex-certified") {
      return false;
    }
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
