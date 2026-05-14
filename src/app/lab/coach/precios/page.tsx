"use client";

/* ──────────────────────────────────────────────
   /lab/coach/precios — Página de precios de J3 Lab Coach.

   Estructura: Hero · Camino · Suscripciones (con toggle) · Examen ·
   Mentor (con founder rate condicional) · Sesión cero · Verificación ·
   First Year Math · FAQ · CTA final.

   Estado:
     - billingPeriod (yearly por defecto) controla las 2 cards de suscripción
     - founderRateActive viene de ?founder=<algo> (V1: solo presencia)

   Las secciones que NO usan PricingCard van inline aquí — solo CaminoBlock
   y PricingCard son componentes externos por reutilización.
   ────────────────────────────────────────────── */

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  PricingCard,
  type SubscriptionCardCopy,
  type OneTimeCardCopy,
  type PackageCardCopy,
  type FreeCardCopy,
} from "@/components/PricingCard";
import { CaminoBlock } from "@/components/CaminoBlock";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import {
  SUBSCRIPTION_PLANS,
  EXAM_PLAN,
  MENTOR_PLANS,
  SESION_CERO_PLAN,
  VERIFICACION_PLAN,
  CAMINO_STEPS,
  FIRST_YEAR_ROWS,
} from "@/data/lab-coach-pricing";

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function HeroSection({
  texts,
}: {
  texts: { eyebrow: string; headingPre: string; headingAccent: string; sub: string };
}) {
  const { ref, visible } = useReveal(0.05);
  return (
    <section
      className="relative overflow-hidden pt-[140px] max-[960px]:pt-[120px] pb-[80px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 60%)",
        }}
      />
      <div
        ref={ref}
        className="relative max-w-[1200px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="text-[11px] tracking-[4px] uppercase text-[var(--champan)] mb-6 font-bold">
          {texts.eyebrow}
        </div>
        <h1 className="font-bold text-[clamp(40px,7vw,92px)] uppercase tracking-[-2px] leading-[0.96] mb-8 max-w-[900px]">
          {texts.headingPre}{" "}
          <span className="italic font-[var(--font-serif)] normal-case tracking-[-1.5px] text-[var(--champan)]">
            {texts.headingAccent}
          </span>
        </h1>
        <p className="text-[clamp(15px,1.6vw,19px)] leading-[1.55] opacity-80 max-w-[680px] font-light">
          {texts.sub}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION HEADER — eyebrow + heading + sub centrado
   ═══════════════════════════════════════════════════════ */
function SectionHeader({
  eyebrow,
  heading,
  sub,
  children,
}: {
  eyebrow: string;
  heading: string;
  sub?: string;
  children?: React.ReactNode;
}) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="text-center mb-12 max-[960px]:mb-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "all 1s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
        {eyebrow}
      </div>
      <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
        {heading}
      </h2>
      {sub && (
        <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
          {sub}
        </p>
      )}
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BILLING TOGGLE — controlado, mensual / anual
   ═══════════════════════════════════════════════════════ */
function BillingToggle({
  billingPeriod,
  onChange,
  monthlyLabel,
  yearlyLabel,
}: {
  billingPeriod: "monthly" | "yearly";
  onChange: (p: "monthly" | "yearly") => void;
  monthlyLabel: string;
  yearlyLabel: string;
}) {
  return (
    <div className="flex justify-center mb-10">
      <div
        role="tablist"
        aria-label="Periodicidad de facturación"
        className="inline-flex p-1 rounded-[2px] border border-white/[.10] bg-white/[0.015]"
      >
        {(["monthly", "yearly"] as const).map((period) => {
          const isActive = billingPeriod === period;
          const label = period === "monthly" ? monthlyLabel : yearlyLabel;
          return (
            <button
              key={period}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => onChange(period)}
              className={cn(
                "px-5 py-2 text-[11px] font-bold tracking-[1.8px] uppercase transition-all duration-300 rounded-[2px]",
                isActive
                  ? "bg-[var(--champan)] text-[var(--negro-v)]"
                  : "text-[var(--wh)] opacity-60 hover:opacity-100",
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUSCRIPCIONES — 2 cards subscription + toggle
   ═══════════════════════════════════════════════════════ */
function SuscripcionesSection({
  tp,
  billingPeriod,
  setBillingPeriod,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
  billingPeriod: "monthly" | "yearly";
  setBillingPeriod: (p: "monthly" | "yearly") => void;
}) {
  const s = tp.suscripciones;
  const { itemRefs, visibleItems } = useStaggerReveal(SUBSCRIPTION_PLANS.length, 0.15);

  const buildCopy = (planId: string): SubscriptionCardCopy => {
    if (planId === "pro-coach") {
      return { ...s.proCoach, saveLabel: s.billingToggle.saveLabel };
    }
    return { ...s.coach, saveLabel: s.billingToggle.saveLabel };
  };

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <SectionHeader eyebrow={s.eyebrow} heading={s.heading} sub={s.sub} />
        <BillingToggle
          billingPeriod={billingPeriod}
          onChange={setBillingPeriod}
          monthlyLabel={s.billingToggle.monthly}
          yearlyLabel={s.billingToggle.yearly}
        />
        <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-6 max-w-[840px] mx-auto">
          {SUBSCRIPTION_PLANS.map((plan, i) => (
            <div
              key={plan.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <PricingCard
                plan={plan}
                copy={buildCopy(plan.id)}
                billingPeriod={billingPeriod}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   EXAMEN — 1 card one-time, centrada
   ═══════════════════════════════════════════════════════ */
function ExamenSection({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const e = tp.examen;
  const { ref, visible } = useReveal(0.15);
  const copy: OneTimeCardCopy = e.plan;

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <SectionHeader eyebrow={e.eyebrow} heading={e.heading} sub={e.sub} />
        <div
          ref={ref}
          className="max-w-[480px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <PricingCard plan={EXAM_PLAN} copy={copy} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MENTOR — 3 cards package + founder banner condicional
   ═══════════════════════════════════════════════════════ */
function MentorSection({
  tp,
  founderRateActive,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
  founderRateActive: boolean;
}) {
  const m = tp.mentor;
  const { itemRefs, visibleItems } = useStaggerReveal(MENTOR_PLANS.length, 0.15);

  const buildCopy = (planId: string, durationKey: "30d" | "90d" | "12m"): PackageCardCopy => {
    const planCopy =
      planId === "mentor-sprint"
        ? m.sprint
        : planId === "mentor-acompanamiento"
          ? m.acompanamiento
          : m.programa;
    return {
      ...planCopy,
      duration: tp.duraciones[durationKey],
      priceLabels: m.priceLabels,
    };
  };

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        <SectionHeader eyebrow={m.eyebrow} heading={m.heading} sub={m.sub}>
          {founderRateActive && (
            <div className="mt-6 inline-flex items-center px-4 py-2 rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)]">
              <span className="text-[11px] font-bold tracking-[1.5px] uppercase">
                {m.founderBanner}
              </span>
            </div>
          )}
        </SectionHeader>
        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-6">
          {MENTOR_PLANS.map((plan, i) => (
            <div
              key={plan.id}
              ref={(el) => { itemRefs.current[i] = el; }}
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <PricingCard
                plan={plan}
                copy={buildCopy(plan.id, plan.durationKey)}
                founderRateActive={founderRateActive}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SESIÓN CERO — destino del ancla #sesion-cero
   ═══════════════════════════════════════════════════════ */
function SesionCeroSection({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const sc = tp.sesionCero;
  const { ref, visible } = useReveal(0.15);
  const copy: OneTimeCardCopy = sc.plan;

  return (
    <section
      id="sesion-cero"
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 scroll-mt-[120px]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <SectionHeader eyebrow={sc.eyebrow} heading={sc.heading} sub={sc.sub} />
        <div
          ref={ref}
          className="max-w-[480px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <PricingCard plan={SESION_CERO_PLAN} copy={copy} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   VERIFICACIÓN — card free
   ═══════════════════════════════════════════════════════ */
function VerificacionSection({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const v = tp.verificacion;
  const { ref, visible } = useReveal(0.15);
  const copy: FreeCardCopy = v.plan;

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <SectionHeader eyebrow={v.eyebrow} heading={v.heading} sub={v.sub} />
        <div
          ref={ref}
          className="max-w-[560px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <PricingCard plan={VERIFICACION_PLAN} copy={copy} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FIRST YEAR MATH — tabla informativa
   ═══════════════════════════════════════════════════════ */
function FirstYearMathBlock({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const fym = tp.firstYearMath;
  const { itemRefs, visibleItems } = useStaggerReveal(FIRST_YEAR_ROWS.length, 0.2);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <SectionHeader eyebrow={fym.eyebrow} heading={fym.heading} sub={fym.sub} />
        <ul className="max-w-[720px] mx-auto">
          {FIRST_YEAR_ROWS.map((row, i) => (
            <li
              key={row.id}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex items-baseline justify-between gap-6 py-5 border-b border-white/[.08]"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(15px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <span className="text-[14px] max-[640px]:text-[13px] opacity-80 leading-[1.4]">
                {fym.rows[row.id as keyof typeof fym.rows]}
              </span>
              <span className="font-bold text-[clamp(20px,2.4vw,28px)] tracking-[-0.5px] text-[var(--champan)] flex-shrink-0">
                {row.amount}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[12px] opacity-55 text-center max-w-[560px] mx-auto leading-[1.5]">
          {fym.note}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FAQ — acordeón
   ═══════════════════════════════════════════════════════ */
function FaqSection({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const f = tp.faq;
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[760px] mx-auto">
        <SectionHeader eyebrow={f.eyebrow} heading={f.heading} />
        <div className="border-t border-white/[.08]">
          {f.items.map((item, i) => {
            const isOpen = openIdx === i;
            const buttonId = `faq-${i}-button`;
            const panelId = `faq-${i}-panel`;
            return (
              <div key={item.q} className="border-b border-white/[.08]">
                <button
                  id={buttonId}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left hover:opacity-90 transition-opacity duration-200"
                >
                  <span className="text-[15px] max-[640px]:text-[14px] font-bold tracking-[-0.3px] leading-[1.3]">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      "text-[var(--champan)] text-[20px] leading-none transition-transform duration-300 flex-shrink-0",
                      isOpen && "rotate-45",
                    )}
                  >
                    +
                  </span>
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!isOpen}
                  className="pb-6 pr-8 text-[13.5px] max-[640px]:text-[13px] opacity-75 leading-[1.6]"
                >
                  {item.a}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA FINAL
   ═══════════════════════════════════════════════════════ */
function CtaFinalSection({
  tp,
}: {
  tp: ReturnType<typeof useI18n>["t"]["lab"]["coach"]["pricing"];
}) {
  const c = tp.ctaFinal;
  const { ref, visible } = useReveal(0.1);
  const proPlan = SUBSCRIPTION_PLANS.find((p) => p.id === "pro-coach");
  const basePlan = SUBSCRIPTION_PLANS.find((p) => p.id === "coach");

  return (
    <section
      className="relative py-[120px] max-[960px]:py-[80px] px-12 max-[960px]:px-6 max-[640px]:px-4 overflow-hidden"
      style={{ background: "var(--verde)" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 60%)",
        }}
      />
      <div
        ref={ref}
        className="relative text-center max-w-[720px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
          {c.eyebrow}
        </div>
        <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-5">
          {c.heading}
        </h2>
        <p className="text-[14px] max-[640px]:text-[13px] opacity-80 max-w-[560px] mx-auto leading-[1.55] mb-10">
          {c.sub}
        </p>
        <div className="flex gap-4 justify-center max-[640px]:flex-col max-[640px]:items-stretch">
          <a
            href={proPlan?.ctaHref ?? "#"}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
          >
            {c.ctaPrimary}
          </a>
          <a
            href={basePlan?.ctaHref ?? "#"}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            {c.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PÁGINA — contenido (lee searchParams) + wrapper (Suspense)
   ═══════════════════════════════════════════════════════ */
function PreciosContent() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("yearly");
  const searchParams = useSearchParams();
  const founderParam = searchParams.get("founder");
  const founderRateActive = !!(founderParam && founderParam.length > 0);

  const { t } = useI18n();
  const tp = t.lab.coach.pricing;

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />
      <HeroSection texts={tp.hero} />
      <CaminoBlock
        steps={CAMINO_STEPS}
        texts={{
          eyebrow: tp.camino.eyebrow,
          heading: tp.camino.heading,
          sub: tp.camino.sub,
          grados: tp.camino.grados,
          insignias: tp.camino.insignias,
          unlocks: tp.camino.unlocks,
          hitos: tp.camino.hitos,
        }}
      />
      <SuscripcionesSection
        tp={tp}
        billingPeriod={billingPeriod}
        setBillingPeriod={setBillingPeriod}
      />
      <ExamenSection tp={tp} />
      <MentorSection tp={tp} founderRateActive={founderRateActive} />
      <SesionCeroSection tp={tp} />
      <VerificacionSection tp={tp} />
      <FirstYearMathBlock tp={tp} />
      <FaqSection tp={tp} />
      <CtaFinalSection tp={tp} />
      <Footer />
    </div>
  );
}

export default function PreciosPage() {
  return (
    <Suspense fallback={null}>
      <PreciosContent />
    </Suspense>
  );
}
