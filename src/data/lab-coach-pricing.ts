/* ──────────────────────────────────────────────
   Catálogo de precios de J3 Lab Coach.

   Datos PUROS (números, ids, descuentos, hrefs).
   Todo el copy vive en src/i18n/dictionaries/es.ts
   bajo lab.coach.pricing — la pricing page resuelve
   textos del diccionario y los pasa al PricingCard.

   Tipos discriminados por `variant` para que el
   componente PricingCard renderice la sub-card correcta.
   ────────────────────────────────────────────── */

export type PlanVariant = "subscription" | "one-time" | "package" | "free";

export type Currency = "EUR";

interface PlanBase {
  id: string;
  variant: PlanVariant;
  ctaHref: string;
  recommended?: boolean;
}

export interface SubscriptionPlan extends PlanBase {
  variant: "subscription";
  pricing: {
    monthly: { amount: number; currency: Currency };
    yearly:  { amount: number; currency: Currency; savePct: number };
  };
}

export interface OneTimePlan extends PlanBase {
  variant: "one-time";
  pricing: { amount: number; currency: Currency };
}

export interface PackagePlan extends PlanBase {
  variant: "package";
  durationKey: "30d" | "90d" | "12m"; // resuelve a "30 días" / "90 días" / "12 meses" en i18n
  sessions: number;
  pricing: {
    public:  { amount: number; currency: Currency };
    founder: { amount: number; currency: Currency; discountPct: 30 };
  };
}

export interface FreePlan extends PlanBase {
  variant: "free";
  requirementsHref: string;
}

export type PricingPlan =
  | SubscriptionPlan
  | OneTimePlan
  | PackagePlan
  | FreePlan;

/* ─── Catálogo ─── */

// TODO: actualizar ctaHref cuando exista checkout real para
// examen, sesión cero y los 3 paquetes Mentor. Las suscripciones
// (coach-base, coach-pro) probablemente sirvan ya con el checkout
// actual de Coach360 (j3padel.com/join), pero confirmar antes de prod.

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "coach-base",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach",
    pricing: {
      monthly: { amount: 19, currency: "EUR" },
      yearly:  { amount: 144, currency: "EUR", savePct: 37 },
    },
  },
  {
    id: "coach-pro",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach-pro",
    recommended: true,
    pricing: {
      monthly: { amount: 49, currency: "EUR" },
      yearly:  { amount: 396, currency: "EUR", savePct: 33 },
    },
  },
];

export const EXAM_PLAN: OneTimePlan = {
  id: "examen",
  variant: "one-time",
  ctaHref: "https://j3padel.com/join?plan=examen",
  pricing: { amount: 490, currency: "EUR" },
};

export const MENTOR_PLANS: PackagePlan[] = [
  {
    id: "mentor-sprint",
    variant: "package",
    ctaHref: "/lab/coach/precios#sesion-cero",
    durationKey: "30d",
    sessions: 4,
    pricing: {
      public:  { amount: 895, currency: "EUR" },
      founder: { amount: 625, currency: "EUR", discountPct: 30 },
    },
  },
  {
    id: "mentor-acompanamiento",
    variant: "package",
    ctaHref: "/lab/coach/precios#sesion-cero",
    durationKey: "90d",
    sessions: 8,
    pricing: {
      public:  { amount: 1495, currency: "EUR" },
      founder: { amount: 1045, currency: "EUR", discountPct: 30 },
    },
  },
  {
    id: "mentor-programa",
    variant: "package",
    ctaHref: "/lab/coach/precios#sesion-cero",
    durationKey: "12m",
    sessions: 16,
    pricing: {
      public:  { amount: 2495, currency: "EUR" },
      founder: { amount: 1745, currency: "EUR", discountPct: 30 },
    },
  },
];

export const SESION_CERO_PLAN: OneTimePlan = {
  id: "sesion-cero",
  variant: "one-time",
  ctaHref: "https://j3padel.com/join?plan=sesion-cero",
  pricing: { amount: 49, currency: "EUR" },
};

export const VERIFICACION_PLAN: FreePlan = {
  id: "verificacion",
  variant: "free",
  ctaHref: "/sello",
  requirementsHref: "/sello",
};

/* ─── Datos para "El camino" (mini-bloque entre hero y suscripciones) ─── */

export interface CaminoStep {
  num: string;
  // Solo 3 grados públicos: Verificado NO es un grado, es una insignia que se suma a Head Coach.
  gradoKey: "assistantCoach" | "coach" | "headCoach";
  insigniaKey: "cualificado" | "certificado" | "verificado" | null;
  unlockKey: "planCoach" | "planCoachPro" | "examen" | "merito";
}

export const CAMINO_STEPS: CaminoStep[] = [
  { num: "01", gradoKey: "assistantCoach", insigniaKey: null,           unlockKey: "planCoach"    },
  { num: "02", gradoKey: "coach",          insigniaKey: "cualificado",  unlockKey: "planCoachPro" },
  { num: "03", gradoKey: "headCoach",      insigniaKey: "certificado",  unlockKey: "examen"       },
  // Mismo grado que paso 03 — la diferenciación visual la marca la insignia (morado + check Instagram).
  { num: "04", gradoKey: "headCoach",      insigniaKey: "verificado",   unlockKey: "merito"       },
];

/* ─── First year math (tabla comercial) ─── */

export interface FirstYearRow {
  id: string;
  amount: string; // pre-formateado por simplicidad — el copy del label vive en i18n
}

export const FIRST_YEAR_ROWS: FirstYearRow[] = [
  { id: "base",            amount: "144€"   },
  { id: "pro",             amount: "396€"   },
  { id: "proExamen",       amount: "886€"   },
  { id: "proExamenSprint", amount: "1.481€" },
  { id: "proExamenProg",   amount: "2.681€" },
];
