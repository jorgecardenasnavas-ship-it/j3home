"use client";

/* ──────────────────────────────────────────────
   /lab/coach — Landing comercial de J3 Lab Coach.

   Estructura (orden Growth Hacker):
   1. Hero
   2. Quiénes firman esto (Javi + Jorge + cifras duras)
   3. Posicionamiento (FIP 2026 + crisis "diplomas falsos")
   4. El Camino (CaminoBlock con disclaimer de nomenclatura)
   5. Inversión total a la vista (tabla + Mentor + Verificado)
   6. Qué hay dentro (3 cards + tabla comparativa Coach vs Pro)
   7. Qué cambia en tu negocio
   8. Coaches dentro del Lab (cifra real + CTA al directorio)
   9. No es para ti si...
   10. FAQ comercial
   11. CTA final

   Toda la voz, vocabulario, claims y palabras vetadas vienen del
   Brand Guardian. El copy completo vive en el diccionario.
   ────────────────────────────────────────────── */

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaminoBlock } from "@/components/CaminoBlock";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { CAMINO_STEPS } from "@/data/lab-coach-pricing";

const PRECIOS_HREF = "/lab/coach/precios";
const SESION_CERO_HREF = "/lab/coach/precios#sesion-cero";
const COACH_CHECKOUT = "https://j3padel.com/join";
const COACH_PRO_CHECKOUT = "https://j3padel.com/join";
const DIRECTORIO_HREF = "/academy/coaches";

type LandingTexts = ReturnType<typeof useI18n>["t"]["lab"]["coach"]["landing"];

/* ═══════════════════════════════════════════════════════
   1. HERO
   ═══════════════════════════════════════════════════════ */
function HeroSection({ texts }: { texts: LandingTexts["hero"] }) {
  const { ref, visible } = useReveal(0.05);
  return (
    <section
      className="relative overflow-hidden pt-[140px] max-[960px]:pt-[120px] pb-[100px] max-[960px]:pb-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4"
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
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1 rounded-[2px] border border-[var(--champan)]/40">
          <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-[var(--champan)]" />
          <span className="text-[10px] tracking-[2.5px] uppercase text-[var(--champan)] font-bold">
            {texts.eyebrow}
          </span>
        </div>
        <h1 className="font-bold text-[clamp(40px,7vw,96px)] uppercase tracking-[-2px] leading-[0.96] mb-8 max-w-[1000px]">
          {texts.headingPre}{" "}
          <span className="italic font-[var(--font-serif)] normal-case tracking-[-1.5px] text-[var(--champan)]">
            {texts.headingAccent}
          </span>
        </h1>
        <p className="text-[clamp(15px,1.6vw,19px)] leading-[1.55] opacity-80 max-w-[680px] font-light mb-10">
          {texts.sub}
        </p>
        <div className="flex gap-4 max-[640px]:flex-col max-[640px]:items-stretch mb-10">
          <a
            href={COACH_CHECKOUT}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
          >
            {texts.ctaPrimary}
          </a>
          <a
            href="#metodo"
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            {texts.ctaSecondary}
          </a>
        </div>
        <div className="flex flex-wrap gap-3">
          {texts.chips.map((chip) => (
            <span
              key={chip}
              className="inline-flex items-center px-3 py-1 rounded-[2px] text-[10px] font-bold tracking-[2px] uppercase border border-white/[.12] bg-white/[0.02] text-[var(--wh)]/70"
            >
              {chip}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   2. QUIÉNES FIRMAN ESTO
   ═══════════════════════════════════════════════════════ */
function HermanosSection({ texts }: { texts: LandingTexts["hermanos"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.members.length, 0.15);
  const chipRefs = useStaggerReveal(texts.chips.length, 0.2);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,4vw,48px)] uppercase tracking-[-1px] leading-[1.1] mb-4 max-w-[880px] mx-auto">
            {texts.heading}
          </h2>
          <p className="text-[14px] opacity-70 max-w-[560px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-5 mb-10">
          {texts.members.map((m, i) => (
            <article
              key={m.name}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="relative flex flex-col p-7 max-[960px]:p-6 rounded-[2px] border border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012] transition-colors duration-500"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <h3 className="font-bold text-[24px] tracking-[-0.5px] leading-[1.1] mb-2">
                {m.name}
              </h3>
              <p className="text-[12px] tracking-[1.5px] uppercase text-[var(--champan)] font-bold mb-5">
                {m.role}
              </p>
              <p className="italic font-[var(--font-serif)] text-[clamp(18px,1.8vw,22px)] leading-[1.4] text-[var(--champan)] mb-5">
                &ldquo;{m.quote}&rdquo;
              </p>
              <p className="text-[13px] opacity-75 leading-[1.55]">
                {m.palmares}
              </p>
            </article>
          ))}
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-4">
          {texts.chips.map((chip, i) => (
            <div
              key={chip}
              ref={(el) => { chipRefs.itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex items-center justify-center p-5 rounded-[2px] border border-[var(--champan)]/30 bg-[rgba(201,169,110,0.04)]"
              style={{
                opacity: chipRefs.visibleItems[i] ? 1 : 0,
                transform: chipRefs.visibleItems[i] ? "none" : "translateY(15px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <span className="text-[12px] max-[640px]:text-[11.5px] font-bold tracking-[1px] uppercase text-[var(--champan)] text-center leading-[1.4]">
                {chip}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   3. POSICIONAMIENTO
   ═══════════════════════════════════════════════════════ */
function PosicionamientoSection({ texts }: { texts: LandingTexts["posicionamiento"] }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div
        ref={ref}
        className="max-w-[760px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-5 font-bold">
          {texts.eyebrow}
        </div>
        <h2 className="font-bold text-[clamp(32px,4.5vw,52px)] tracking-[-1px] leading-[1.1] mb-8">
          <span className="italic font-[var(--font-serif)] normal-case tracking-[-0.5px] text-[var(--champan)]">
            {texts.claim}
          </span>
        </h2>
        <p className="text-[clamp(15px,1.5vw,17px)] leading-[1.65] opacity-80 mb-5">
          {texts.body}
        </p>
        <p className="text-[clamp(15px,1.5vw,17px)] leading-[1.65] opacity-80">
          {texts.body2}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   5. INVERSIÓN TOTAL A LA VISTA
   ═══════════════════════════════════════════════════════ */
function InversionSection({ texts }: { texts: LandingTexts["inversion"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.plans.length, 0.15);
  const mentorReveal = useReveal(0.1);
  const verifReveal = useReveal(0.1);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-1px] leading-[1.15] mb-4 max-w-[880px] mx-auto">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-5 mb-12">
          {texts.plans.map((plan, i) => {
            const highlighted = !!plan.badge;
            return (
              <article
                key={plan.name}
                ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                className={cn(
                  "relative flex flex-col p-6 max-[960px]:p-5 rounded-[2px] border transition-colors duration-500",
                  highlighted
                    ? "border-[var(--champan)]/55 bg-[rgba(201,169,110,0.04)]"
                    : "border-white/[.10] bg-white/[0.012]",
                )}
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(20px)",
                  transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
                }}
              >
                {highlighted && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
                  />
                )}
                {plan.badge && (
                  <div className="inline-flex items-center gap-2 self-start mb-4">
                    <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-[var(--champan)]" />
                    <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <h3 className="font-bold text-[20px] tracking-[-0.3px] leading-[1.2] mb-2">
                  {plan.name}
                </h3>
                <p className="font-bold text-[clamp(28px,3vw,36px)] tracking-[-1px] leading-[1] mb-2 text-[var(--champan)]">
                  {plan.price}
                </p>
                <p className="text-[12.5px] opacity-70 leading-[1.5] mb-4">
                  {plan.desc}
                </p>
                <div className="mt-auto pt-4 border-t border-white/[.08]">
                  <p className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--champan)] mb-2">
                    {plan.total}
                  </p>
                  {plan.note && (
                    <p className="text-[11px] opacity-65 leading-[1.5] italic">
                      {plan.note}
                    </p>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Mentor sub-bloque */}
        <div
          ref={mentorReveal.ref}
          className="relative p-7 max-[960px]:p-5 rounded-[2px] border border-white/[.10] bg-white/[0.012] mb-6"
          style={{
            opacity: mentorReveal.visible ? 1 : 0,
            transform: mentorReveal.visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="grid grid-cols-[1fr_2fr] max-[960px]:grid-cols-1 gap-8 max-[960px]:gap-5">
            <div>
              <h3 className="font-bold text-[22px] tracking-[-0.5px] leading-[1.2] mb-2">
                {texts.mentor.title}
              </h3>
              <p className="text-[13px] opacity-70 leading-[1.55] mb-4">
                {texts.mentor.sub}
              </p>
              <p className="text-[12px] font-bold leading-[1.5] text-[var(--champan)] italic">
                {texts.mentor.clause}
              </p>
            </div>
            <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-3">
              {texts.mentor.tiers.map((tier) => (
                <div
                  key={tier.name}
                  className="flex flex-col p-4 rounded-[2px] border border-white/[.10] bg-[rgba(201,169,110,0.02)]"
                >
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--champan)] mb-2">
                    {tier.name}
                  </span>
                  <span className="text-[11.5px] opacity-70 mb-3 leading-[1.4]">
                    {tier.duration}
                  </span>
                  <span className="font-bold text-[20px] tracking-[-0.5px] mt-auto">
                    {tier.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Verificado sub-bloque */}
        <div
          ref={verifReveal.ref}
          className="relative p-7 max-[960px]:p-5 rounded-[2px] border border-[rgba(83,74,183,0.5)] bg-[rgba(83,74,183,0.03)] mb-6"
          style={{
            opacity: verifReveal.visible ? 1 : 0,
            transform: verifReveal.visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.15s",
          }}
        >
          <span
            aria-hidden
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
          />
          <div className="grid grid-cols-[1fr_2fr] max-[960px]:grid-cols-1 gap-8 max-[960px]:gap-4 items-center">
            <div className="flex items-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="#a89efc"
                aria-hidden
                className="flex-shrink-0"
              >
                <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
              </svg>
              <h3 className="font-bold text-[22px] tracking-[-0.5px] leading-[1.2]">
                {texts.verificado.title}
              </h3>
            </div>
            <p className="text-[13px] opacity-80 leading-[1.6]">
              {texts.verificado.body}
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] opacity-55 tracking-[0.5px]">
          {texts.smallPrint}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   6. QUÉ HAY DENTRO
   ═══════════════════════════════════════════════════════ */
function QueHayDentroSection({ texts }: { texts: LandingTexts["queHayDentro"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.cards.length, 0.15);
  const tableReveal = useReveal(0.1);

  return (
    <section
      id="metodo"
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06] scroll-mt-[120px]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-1px] leading-[1.15] mb-4 max-w-[880px] mx-auto">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-5 mb-10">
          {texts.cards.map((card, i) => (
            <article
              key={card.title}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="relative flex flex-col p-6 max-[960px]:p-5 rounded-[2px] border border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012] transition-colors duration-500"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <div className="inline-flex items-center gap-2 self-start mb-4">
                <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-[var(--champan)]" />
                <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
                  {card.badge}
                </span>
              </div>
              <h3 className="font-bold text-[19px] max-[960px]:text-[18px] tracking-[-0.3px] leading-[1.25] mb-2">
                {card.title}
              </h3>
              <p className="text-[13px] opacity-65 italic leading-[1.45] mb-3">
                {card.subtitle}
              </p>
              <p className="text-[12.5px] opacity-75 leading-[1.55] mb-5">
                {card.body}
              </p>
              <ul className="mt-auto pt-4 border-t border-white/[.08] space-y-2">
                {card.entregables.map((e) => (
                  <li
                    key={e}
                    className="flex items-start gap-2.5 text-[12px] leading-[1.5] opacity-85"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] w-[3px] h-[3px] rounded-full bg-[var(--champan)] flex-shrink-0"
                    />
                    <span>{e}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="text-center text-[12.5px] max-w-[760px] mx-auto opacity-70 leading-[1.6] mb-10 italic">
          {texts.desbloqueoNote}
        </p>

        {/* Tabla comparativa */}
        <div
          ref={tableReveal.ref}
          className="relative max-w-[920px] mx-auto"
          style={{
            opacity: tableReveal.visible ? 1 : 0,
            transform: tableReveal.visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-center mb-8">
            <h3 className="font-bold text-[clamp(20px,2.4vw,28px)] tracking-[-0.5px] mb-2">
              {texts.comparativa.title}
            </h3>
            <p className="text-[13px] opacity-65">{texts.comparativa.sub}</p>
          </div>

          <div className="overflow-x-auto rounded-[2px] border border-white/[.10]">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="p-4 text-[10px] font-bold tracking-[1.5px] uppercase opacity-50">
                    Característica
                  </th>
                  <th className="p-4 text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--wh)]/70">
                    {texts.comparativa.colCoach}
                  </th>
                  <th className="p-4 text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--champan)]">
                    {texts.comparativa.colCoachPro}
                  </th>
                </tr>
              </thead>
              <tbody>
                {texts.comparativa.rows.map((row) => (
                  <tr
                    key={row.feature}
                    className="border-t border-white/[.06] hover:bg-white/[0.012] transition-colors duration-200"
                  >
                    <td className="p-4 text-[13px] font-bold opacity-85">{row.feature}</td>
                    <td className="p-4 text-[13px] opacity-65">{row.coach}</td>
                    <td className="p-4 text-[13px] text-[var(--champan)] font-bold">
                      {row.coachPro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   7. QUÉ CAMBIA EN TU NEGOCIO
   ═══════════════════════════════════════════════════════ */
function NegocioSection({ texts }: { texts: LandingTexts["negocio"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.items.length, 0.15);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1100px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.5vw,40px)] tracking-[-1px] leading-[1.15] mb-4 max-w-[880px] mx-auto">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-5">
          {texts.items.map((item, i) => (
            <div
              key={item}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex flex-col p-6 rounded-[2px] border border-white/[.10] bg-white/[0.012]"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <span className="font-bold text-[28px] leading-[1] tracking-[-1px] text-[var(--champan)]/80 mb-4">
                0{i + 1}
              </span>
              <p className="text-[13.5px] leading-[1.65] opacity-85">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   8. COACHES DENTRO DEL LAB
   ═══════════════════════════════════════════════════════ */
function CoachesDentroSection({ texts }: { texts: LandingTexts["coachesDentro"] }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div
        ref={ref}
        className="relative text-center max-w-[760px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
          {texts.eyebrow}
        </div>
        <h2 className="font-bold text-[clamp(36px,5vw,64px)] uppercase tracking-[-1.5px] leading-[1.05] mb-5">
          {texts.heading}
        </h2>
        <p className="text-[14px] max-[640px]:text-[13px] opacity-75 max-w-[600px] mx-auto leading-[1.6] mb-10">
          {texts.sub}
        </p>
        <a
          href={DIRECTORIO_HREF}
          className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
        >
          {texts.ctaLabel}
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   9. NO ES PARA TI SI...
   ═══════════════════════════════════════════════════════ */
function NoEsParaTiSection({ texts }: { texts: LandingTexts["noEsParaTi"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.items.length, 0.15);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[920px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-1px] leading-[1.15] mb-3">
            {texts.heading}
          </h2>
          <p className="text-[14px] opacity-70 max-w-[560px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <ul className="space-y-3">
          {texts.items.map((item, i) => (
            <li
              key={item}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex items-start gap-4 p-5 rounded-[2px] border border-white/[.08] bg-white/[0.012]"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateX(-15px)",
                transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <span
                aria-hidden
                className="text-[var(--champan)]/70 text-[18px] leading-none mt-[1px] flex-shrink-0"
              >
                ×
              </span>
              <span className="text-[13.5px] leading-[1.6] opacity-85">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   10. FAQ
   ═══════════════════════════════════════════════════════ */
function FaqSection({ texts }: { texts: LandingTexts["faq"] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[760px] mx-auto">
        <div
          ref={headerRef}
          className="text-center mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-1px] leading-[1.15]">
            {texts.heading}
          </h2>
        </div>

        <div className="border-t border-white/[.08]">
          {texts.items.map((item, i) => {
            const isOpen = openIdx === i;
            const buttonId = `faq-landing-${i}-button`;
            const panelId = `faq-landing-${i}-panel`;
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
                  className="pb-6 pr-8 text-[13.5px] max-[640px]:text-[13px] opacity-75 leading-[1.65]"
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
   11. CTA FINAL
   ═══════════════════════════════════════════════════════ */
function CtaFinalSection({ texts }: { texts: LandingTexts["ctaFinal"] }) {
  const { ref, visible } = useReveal(0.1);
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
        className="relative text-center max-w-[760px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-5 font-bold">
          {texts.eyebrow}
        </div>
        <h2 className="font-bold text-[clamp(36px,5vw,64px)] uppercase tracking-[-1.5px] leading-[1.02] mb-6">
          {texts.headingPre}{" "}
          <span className="italic font-[var(--font-serif)] normal-case tracking-[-1px] text-[var(--champan)]">
            {texts.headingAccent}
          </span>
        </h2>
        <p className="text-[14px] max-[640px]:text-[13px] opacity-85 max-w-[600px] mx-auto leading-[1.6] mb-10">
          {texts.sub}
        </p>
        <div className="flex gap-4 justify-center max-[640px]:flex-col max-[640px]:items-stretch">
          <a
            href={COACH_CHECKOUT}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
          >
            {texts.ctaPrimary}
          </a>
          <a
            href={SESION_CERO_HREF}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            {texts.ctaSecondary}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PÁGINA — orden Growth Hacker
   ═══════════════════════════════════════════════════════ */
export default function LabCoachPage() {
  const { t } = useI18n();
  const tl = t.lab.coach.landing;
  const tp = t.lab.coach.pricing;

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />
      <HeroSection texts={tl.hero} />
      <HermanosSection texts={tl.hermanos} />
      <PosicionamientoSection texts={tl.posicionamiento} />
      <CaminoBlock
        steps={CAMINO_STEPS}
        texts={{
          eyebrow: tl.camino.eyebrow,
          heading: tl.camino.heading,
          sub: tl.camino.sub,
          grados: tp.camino.grados,
          insignias: tp.camino.insignias,
          unlocks: tp.camino.unlocks,
          hitos: tp.camino.hitos,
        }}
      />
      <InversionSection texts={tl.inversion} />
      <QueHayDentroSection texts={tl.queHayDentro} />
      <NegocioSection texts={tl.negocio} />
      <CoachesDentroSection texts={tl.coachesDentro} />
      <NoEsParaTiSection texts={tl.noEsParaTi} />
      <FaqSection texts={tl.faq} />
      <CtaFinalSection texts={tl.ctaFinal} />
      <Footer />
    </div>
  );
}
