/* ──────────────────────────────────────────────
   PricingCard — componente presentacional puro para la pricing page
   de J3 Lab Coach. Renderiza una de cuatro variantes según el discriminante
   `plan.variant`: subscription · one-time · package · free.

   Recibe el copy ya pre-extraído desde la página padre. No navega el
   diccionario internamente — eso evita el coupling con la estructura
   asimétrica de lab.coach.pricing y mantiene la card reutilizable.

   El componente NO maneja estado (ni billing toggle ni founder rate).
   Los recibe como props, controlados desde la página padre.
   ────────────────────────────────────────────── */

import type {
  SubscriptionPlan,
  OneTimePlan,
  PackagePlan,
  FreePlan,
} from "@/data/lab-coach-pricing";
import { cn } from "@/lib/utils";

/* ─── Copy types — pre-extraído por la página padre desde el diccionario ─── */

export interface SubscriptionCardCopy {
  name: string;
  tagline: string;
  description: string;
  features: readonly string[];
  cta: string;
  badge?: string;
  saveLabel: string; // "Ahorra" — se compone con savePct: "Ahorra 33%"
}

export interface OneTimeCardCopy {
  name: string;
  tagline: string;
  description: string;
  priceNote: string; // "Pago único" / "Pago único · 30 min"
  features: readonly string[];
  cta: string;
}

export interface PackageCardCopy {
  name: string;
  tagline: string;
  description: string;
  duration: string; // ya resuelto desde duraciones[durationKey]
  features: readonly string[];
  cta: string;
  priceLabels: { public: string; founder: string };
}

export interface FreeCardCopy {
  name: string;
  tagline: string;
  description: string;
  meritNote: string; // "Por mérito · proceso gratuito"
  features: readonly string[];
  cta: string;
}

/* ─── Props discriminadas ─── */

type SubscriptionProps = {
  plan: SubscriptionPlan;
  copy: SubscriptionCardCopy;
  billingPeriod: "monthly" | "yearly";
  highlight?: boolean;
  className?: string;
};

type OneTimeProps = {
  plan: OneTimePlan;
  copy: OneTimeCardCopy;
  highlight?: boolean;
  className?: string;
};

type PackageProps = {
  plan: PackagePlan;
  copy: PackageCardCopy;
  founderRateActive: boolean;
  highlight?: boolean;
  className?: string;
};

type FreeProps = {
  plan: FreePlan;
  copy: FreeCardCopy;
  highlight?: boolean;
  className?: string;
};

type PricingCardProps =
  | SubscriptionProps
  | OneTimeProps
  | PackageProps
  | FreeProps;

/* ─── Public component — discrimina y delega ─── */

export function PricingCard(props: PricingCardProps) {
  // El discriminante (plan.variant) está anidado, así que TypeScript no
  // estrecha props automáticamente al hacer el spread. Casts localizados
  // hacen explícito qué rama recibe cada delegate.
  switch (props.plan.variant) {
    case "subscription":
      return <SubscriptionCardInner {...(props as SubscriptionProps)} />;
    case "one-time":
      return <OneTimeCardInner {...(props as OneTimeProps)} />;
    case "package":
      return <PackageCardInner {...(props as PackageProps)} />;
    case "free":
      return <FreeCardInner {...(props as FreeProps)} />;
  }
}

/* ─── Shell común y helpers ─── */

function CardShell({
  highlighted,
  headingId,
  className,
  children,
}: {
  highlighted: boolean;
  headingId: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "relative flex flex-col p-7 max-[960px]:p-6 rounded-[2px]",
        "border transition-colors duration-500 overflow-hidden",
        highlighted
          ? "border-[var(--champan)]/55 bg-[rgba(201,169,110,0.04)]"
          : "border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.015]",
        className,
      )}
    >
      {highlighted && (
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
        />
      )}
      {children}
    </article>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 self-start mb-5">
      <span
        aria-hidden
        className="w-[5px] h-[5px] rounded-full bg-[var(--champan)]"
      />
      <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]">
        {label}
      </span>
    </div>
  );
}

function FeatureList({ features }: { features: readonly string[] }) {
  return (
    <ul className="space-y-2.5 mb-7 pt-5 border-t border-white/[.06]">
      {features.map((f) => (
        <li
          key={f}
          className="flex items-start gap-2.5 text-[12.5px] leading-[1.5] opacity-85"
        >
          <span
            aria-hidden
            className="mt-[7px] w-[3px] h-[3px] rounded-full bg-[var(--champan)] flex-shrink-0"
          />
          <span>{f}</span>
        </li>
      ))}
    </ul>
  );
}

function CtaButton({
  href,
  label,
  ariaLabel,
  variant = "outline",
}: {
  href: string;
  label: string;
  ariaLabel?: string;
  variant?: "outline" | "solid";
}) {
  return (
    <a
      href={href}
      aria-label={ariaLabel}
      className={cn(
        "mt-auto inline-flex items-center justify-center min-h-[44px] px-5 py-3",
        "text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px]",
        "transition-all duration-300",
        variant === "solid"
          ? "bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)]"
          : "border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)]",
      )}
    >
      {label}
    </a>
  );
}

/* Si el texto del CTA no menciona el plan, añade el nombre del plan
   como aria-label para que en pantalla con varios CTAs idénticos
   ("Reservar sesión cero") un screen reader pueda diferenciarlos. */
function buildCtaAriaLabel(cta: string, planName: string): string | undefined {
  return cta.toLowerCase().includes(planName.toLowerCase())
    ? undefined
    : `${cta} — ${planName}`;
}

/* ─── Inner cards por variante ─── */

function SubscriptionCardInner({
  plan,
  copy,
  billingPeriod,
  highlight,
  className,
}: Extract<PricingCardProps, { plan: SubscriptionPlan }>) {
  const isYearly = billingPeriod === "yearly";
  const price = isYearly ? plan.pricing.yearly : plan.pricing.monthly;
  const periodLabel = isYearly ? "/año" : "/mes";
  const isHighlighted = highlight ?? plan.recommended ?? false;
  const headingId = `plan-${plan.id}-name`;
  const ariaLabel = buildCtaAriaLabel(copy.cta, copy.name);

  return (
    <CardShell highlighted={isHighlighted} headingId={headingId} className={className}>
      {copy.badge && <Badge label={copy.badge} />}

      <h3
        id={headingId}
        className="font-bold text-[26px] max-[960px]:text-[24px] tracking-[-0.5px] leading-[1.1] mb-2"
      >
        {copy.name}
      </h3>
      <p className="text-[14px] opacity-70 leading-[1.4] mb-6">{copy.tagline}</p>

      <div className="mb-2 flex items-baseline">
        <span className="font-bold text-[clamp(40px,5vw,52px)] tracking-[-2px] leading-[1]">
          {price.amount}€
        </span>
        <span className="ml-1 text-[14px] opacity-60">{periodLabel}</span>
      </div>

      {/* Slot reservado para el chip de ahorro — mantiene altura constante
          entre la card mensual y la anual para evitar que el grid salte. */}
      <div className="min-h-[28px] mb-5">
        {isYearly && (
          <span className="inline-flex items-center px-2 py-[3px] rounded-[2px] bg-[rgba(201,169,110,0.12)] border border-[var(--champan)]/30">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--champan)]">
              {copy.saveLabel} {plan.pricing.yearly.savePct}%
            </span>
          </span>
        )}
      </div>

      <p className="text-[13px] opacity-65 leading-[1.5] mb-2">{copy.description}</p>

      <FeatureList features={copy.features} />

      <CtaButton
        href={plan.ctaHref}
        label={copy.cta}
        ariaLabel={ariaLabel}
        variant={isHighlighted ? "solid" : "outline"}
      />
    </CardShell>
  );
}

function OneTimeCardInner({
  plan,
  copy,
  highlight,
  className,
}: Extract<PricingCardProps, { plan: OneTimePlan }>) {
  const isHighlighted = highlight ?? false;
  const headingId = `plan-${plan.id}-name`;
  const ariaLabel = buildCtaAriaLabel(copy.cta, copy.name);

  return (
    <CardShell highlighted={isHighlighted} headingId={headingId} className={className}>
      <h3
        id={headingId}
        className="font-bold text-[26px] max-[960px]:text-[24px] tracking-[-0.5px] leading-[1.1] mb-2"
      >
        {copy.name}
      </h3>
      <p className="text-[14px] opacity-70 leading-[1.4] mb-6">{copy.tagline}</p>

      <div className="mb-2">
        <span className="font-bold text-[clamp(40px,5vw,52px)] tracking-[-2px] leading-[1]">
          {plan.pricing.amount}€
        </span>
      </div>
      <p className="text-[12px] opacity-55 mb-5 tracking-[0.5px] uppercase">
        {copy.priceNote}
      </p>

      <p className="text-[13px] opacity-65 leading-[1.5] mb-2">{copy.description}</p>

      <FeatureList features={copy.features} />

      <CtaButton
        href={plan.ctaHref}
        label={copy.cta}
        ariaLabel={ariaLabel}
        variant={isHighlighted ? "solid" : "outline"}
      />
    </CardShell>
  );
}

function PackageCardInner({
  plan,
  copy,
  founderRateActive,
  highlight,
  className,
}: Extract<PricingCardProps, { plan: PackagePlan }>) {
  const isHighlighted = highlight ?? false;
  const headingId = `plan-${plan.id}-name`;
  const ariaLabel = buildCtaAriaLabel(copy.cta, copy.name);

  return (
    <CardShell highlighted={isHighlighted} headingId={headingId} className={className}>
      <h3
        id={headingId}
        className="font-bold text-[26px] max-[960px]:text-[24px] tracking-[-0.5px] leading-[1.1] mb-2"
      >
        {copy.name}
      </h3>
      <p className="text-[14px] opacity-70 leading-[1.4] mb-6">{copy.tagline}</p>

      {founderRateActive ? (
        <div className="mb-2">
          <div className="inline-flex self-start mb-3 px-2 py-[3px] rounded-[2px] bg-[var(--champan)]">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--negro-v)]">
              {copy.priceLabels.founder} · -{plan.pricing.founder.discountPct}%
            </span>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-bold text-[clamp(40px,5vw,52px)] tracking-[-2px] leading-[1] text-[var(--champan)]">
              {plan.pricing.founder.amount}€
            </span>
            <span
              className="text-[14px] opacity-50 line-through"
              aria-label={`${copy.priceLabels.public}: ${plan.pricing.public.amount} euros`}
            >
              {plan.pricing.public.amount}€
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-2">
          <span className="font-bold text-[clamp(40px,5vw,52px)] tracking-[-2px] leading-[1]">
            {plan.pricing.public.amount}€
          </span>
        </div>
      )}

      <p className="text-[12px] opacity-55 mb-5 tracking-[0.5px] uppercase">
        {copy.duration}
      </p>

      <p className="text-[13px] opacity-65 leading-[1.5] mb-2">{copy.description}</p>

      <FeatureList features={copy.features} />

      <CtaButton
        href={plan.ctaHref}
        label={copy.cta}
        ariaLabel={ariaLabel}
        variant={isHighlighted ? "solid" : "outline"}
      />
    </CardShell>
  );
}

function FreeCardInner({
  plan,
  copy,
  highlight,
  className,
}: Extract<PricingCardProps, { plan: FreePlan }>) {
  const isHighlighted = highlight ?? false;
  const headingId = `plan-${plan.id}-name`;
  const ariaLabel = buildCtaAriaLabel(copy.cta, copy.name);

  return (
    <CardShell highlighted={isHighlighted} headingId={headingId} className={className}>
      <h3
        id={headingId}
        className="font-bold text-[26px] max-[960px]:text-[24px] tracking-[-0.5px] leading-[1.1] mb-2"
      >
        {copy.name}
      </h3>
      <p className="text-[14px] opacity-70 leading-[1.4] mb-6">{copy.tagline}</p>

      <div className="mb-2">
        {/* Etiqueta visual hardcodeada en español. TODO i18n cuando se traduzca. */}
        <span className="font-bold text-[clamp(36px,4.5vw,48px)] tracking-[-1.5px] leading-[1] text-[var(--champan)]">
          Gratis
        </span>
      </div>
      <p className="text-[12px] opacity-55 mb-5 tracking-[0.5px] uppercase">
        {copy.meritNote}
      </p>

      <p className="text-[13px] opacity-65 leading-[1.5] mb-2">{copy.description}</p>

      <FeatureList features={copy.features} />

      <CtaButton
        href={plan.ctaHref}
        label={copy.cta}
        ariaLabel={ariaLabel}
        variant={isHighlighted ? "solid" : "outline"}
      />
    </CardShell>
  );
}
