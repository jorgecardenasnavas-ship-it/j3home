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

// IDs internos del refactor V1 (mayo 2026): Plan Lab → Coach, Plan Pro → Pro Coach.
// Los ctaHref de Stripe se mantienen sin cambios para no romper enlaces ya activos
// — el coach que paga ve el mismo producto Stripe, solo cambian los nombres internos.

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "coach",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach",
    pricing: {
      monthly: { amount: 19, currency: "EUR" },
      yearly:  { amount: 144, currency: "EUR", savePct: 37 },
    },
  },
  {
    id: "pro-coach",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach-pro",
    recommended: true,
    pricing: {
      // Pro Coach: pago único anual con facilidades.
      // monthly aquí representa la cuota fraccionada en 12 (55€ × 12 = 660€).
      // yearly representa el pago único anual (540€).
      monthly: { amount: 55, currency: "EUR" },
      yearly:  { amount: 540, currency: "EUR", savePct: 18 },
    },
  },
];

// Head Coach: tercer tier vertical. Requiere Pro Coach activo + 3 rutas
// completadas + insignia Cualificado activa (validación operativa).
// Se mantiene como SubscriptionPlan separado (no en SUBSCRIPTION_PLANS)
// para que UIs que iteran sobre SUBSCRIPTION_PLANS no lo pinten por error.
export const HEAD_COACH_PLAN: SubscriptionPlan = {
  id: "head-coach",
  variant: "subscription",
  ctaHref: "https://j3padel.com/join?plan=head-coach",
  recommended: false,
  pricing: {
    monthly: { amount: 90, currency: "EUR" },   // mensual fraccionado: 1.080€/año
    yearly:  { amount: 840, currency: "EUR", savePct: 22 },  // anual pago único
  },
};

// Modalidad trimestral de Head Coach: 900€/año (4 pagos de 225€).
// SubscriptionPlan solo soporta monthly + yearly; el trimestral se expone
// como dato auxiliar para la UI.
export const HEAD_COACH_QUARTERLY: { amount: number; currency: Currency; perPaymentAmount: number } = {
  amount: 900,
  currency: "EUR",
  perPaymentAmount: 225,
};

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
  // Solo 3 grados públicos: Verificado NO es un grado, es una insignia que se suma a Master Coach.
  gradoKey: "assistantCoach" | "coach" | "masterCoach";
  insigniaKey: "cualificado" | "certificado" | "verificado" | null;
  unlockKey: "planBase" | "planPro" | "examen" | "merito";
}

export const CAMINO_STEPS: CaminoStep[] = [
  { num: "01", gradoKey: "assistantCoach", insigniaKey: null,           unlockKey: "planBase" },
  { num: "02", gradoKey: "coach",          insigniaKey: "cualificado",  unlockKey: "planPro"  },
  { num: "03", gradoKey: "masterCoach",    insigniaKey: "certificado",  unlockKey: "examen"   },
  // Mismo grado que paso 03 — la diferenciación visual la marca la insignia (morado + check Instagram).
  { num: "04", gradoKey: "masterCoach",    insigniaKey: "verificado",   unlockKey: "merito"   },
];

/* ─── Destinos finales del Camino (bifurcación opcional tras Master Coach) ─── */

export interface CaminoDestino {
  id: "business" | "proCoach";
}

export const CAMINO_DESTINOS: CaminoDestino[] = [
  { id: "business" },
  { id: "proCoach" },
];

/* ─── First year math (tabla comercial) ─── */

export interface FirstYearRow {
  id: string;
  amount: string; // pre-formateado por simplicidad — el copy del label vive en i18n
}

export const FIRST_YEAR_ROWS: FirstYearRow[] = [
  { id: "pro",             amount: "540€"   },
  { id: "proExamen",       amount: "1.030€" },
  { id: "proExamenSprint", amount: "1.925€" },
  { id: "proExamenProg",   amount: "3.525€" },
];
