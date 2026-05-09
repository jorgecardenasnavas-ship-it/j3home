"use client";

/* ──────────────────────────────────────────────
   /lab/coach — Landing comercial de J3 Lab Coach (V2).

   Estructura (13 bloques, orden Growth Hacker + ajustes):
   1. Hero (claim coach-céntrico)
   2. Si esto te suena (dolor antes que solución)
   3. Quiénes firman esto (autoridad)
   4. Por qué te sirve (anti-objeción senior + abre target a novato)
   5. El método (Criterio · Método · Planificación)
   6. El Camino (CaminoBlock con disclaimer de nomenclatura)
   7. Inversión total a la vista (tabla + Mentor + Verificado)
   8. Qué hay dentro (Rutas + Examen + tabla comparativa)
   9. Qué cambia en tu negocio (4 escenas antes/después)
   10. Coaches dentro del Lab (cifra real + CTA al directorio)
   11. No es para ti si...
   12. FAQ comercial
   13. CTA final

   Toda la voz, vocabulario y palabras vetadas vienen del Brand Guardian.
   El copy completo vive en el diccionario.
   ────────────────────────────────────────────── */

import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CaminoBlock } from "@/components/CaminoBlock";
import { EspejoQuiz } from "@/components/EspejoQuiz";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { useI18n } from "@/i18n/context";
import { cn } from "@/lib/utils";
import { CAMINO_STEPS, CAMINO_DESTINOS } from "@/data/lab-coach-pricing";

const SESION_CERO_HREF = "/lab/coach/precios#sesion-cero";
const COACH_CHECKOUT = "https://j3padel.com/join";
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
        <div className="flex gap-4 max-[640px]:flex-col max-[640px]:items-stretch">
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
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   2. EL ESPEJO · MODO CARRERA · DIAGNÓSTICO DE CRITERIO
   (Bloque interactivo — el componente vive en /components/EspejoQuiz)
   ═══════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════
   3. EL MÉTODO
   ═══════════════════════════════════════════════════════ */
function MetodoSection({ texts }: { texts: LandingTexts["metodo"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.cards.length, 0.15);
  const closerReveal = useReveal(0.1);
  const noteReveal = useReveal(0.1);

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
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-5 mb-12">
          {texts.cards.map((card, i) => (
            <article
              key={card.title}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="relative flex flex-col p-7 max-[960px]:p-6 rounded-[2px] border border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012] transition-colors duration-500"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <span className="font-bold text-[14px] tracking-[2px] uppercase text-[var(--champan)] mb-4">
                0{i + 1}
              </span>
              <h3 className="font-bold text-[24px] tracking-[-0.5px] leading-[1.1] mb-3">
                {card.title}
              </h3>
              <p className="italic font-[var(--font-serif)] text-[15px] leading-[1.4] text-[var(--champan)] mb-5">
                {card.subtitle}
              </p>
              <ul className="space-y-2 mb-5">
                {card.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2.5 text-[13px] leading-[1.45] opacity-90"
                  >
                    <span
                      aria-hidden
                      className="mt-[7px] w-[3px] h-[3px] rounded-full bg-[var(--champan)] flex-shrink-0"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[12.5px] italic opacity-65 leading-[1.55] pt-3 border-t border-white/[.08]">
                {card.closer}
              </p>
            </article>
          ))}
        </div>

        {/* Frase clave del método */}
        <div
          ref={closerReveal.ref}
          className="relative my-14 max-[960px]:my-10 text-center"
          style={{
            opacity: closerReveal.visible ? 1 : 0,
            transform: closerReveal.visible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div
            aria-hidden
            className="mx-auto mb-8 h-px w-[120px] bg-gradient-to-r from-transparent via-[var(--champan)]/40 to-transparent"
          />
          <p className="italic font-[var(--font-serif)] text-[clamp(22px,3vw,34px)] leading-[1.3] text-[var(--champan)] max-w-[760px] mx-auto">
            &ldquo;{texts.closer}&rdquo;
          </p>
          <div
            aria-hidden
            className="mx-auto mt-8 h-px w-[120px] bg-gradient-to-r from-transparent via-[var(--champan)]/40 to-transparent"
          />
        </div>

        {/* Nota humilde de los hermanos */}
        <div
          ref={noteReveal.ref}
          className="text-center max-w-[680px] mx-auto"
          style={{
            opacity: noteReveal.visible ? 1 : 0,
            transform: noteReveal.visible ? "none" : "translateY(15px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.2s",
          }}
        >
          <p className="text-[13px] opacity-70 leading-[1.65] italic">
            {texts.humbleNote}
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   7. INVERSIÓN TOTAL A LA VISTA
   ═══════════════════════════════════════════════════════ */
function InversionSection({ texts }: { texts: LandingTexts["inversion"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const ctaReveal = useReveal(0.1);

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
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[760px] mx-auto leading-[1.6]">
            {texts.sub}
          </p>
        </div>

        {/* CTA único — la puerta de entrada */}
        <div
          ref={ctaReveal.ref}
          className="relative mb-12 max-[960px]:mb-10"
          style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="relative max-w-[820px] mx-auto p-10 max-[960px]:p-7 max-[640px]:p-5 rounded-[2px] border border-[var(--champan)]/55 bg-[rgba(201,169,110,0.04)] text-center overflow-hidden">
            <span
              aria-hidden
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
            />

            {/* Mini-timeline del Camino — modo carrera (bifurcación final solo en bloque "El Camino") */}
            <div className="relative mb-9 max-[640px]:mb-7" aria-hidden>
              {/* Línea conectora horizontal detrás de los puntos (solo desktop) */}
              <div className="absolute top-[34px] left-[10%] right-[10%] h-px bg-[var(--champan)]/25 max-[640px]:hidden" />

              <div className="relative grid grid-cols-4 max-[640px]:grid-cols-2 gap-2 max-[640px]:gap-y-5">
                {[
                  { grade: "Rookie", insignia: null, isStart: true },
                  { grade: "Assistant Coach", insignia: null, isStart: false },
                  { grade: "Coach", insignia: "cualificado", isStart: false },
                  { grade: "Master Coach", insignia: "certificado", isStart: false },
                ].map((hito) => (
                  <div key={hito.grade} className="flex flex-col items-center text-center px-1 relative">
                    {hito.isStart ? (
                      <span className="text-[8.5px] font-bold tracking-[2px] uppercase text-[var(--champan)] mb-2 px-2 py-[2px] rounded-[2px] border border-[var(--champan)]/50 bg-[rgba(201,169,110,0.08)]">
                        Empiezas aquí
                      </span>
                    ) : (
                      <span className="text-[8.5px] mb-2 opacity-0">·</span>
                    )}
                    <span
                      className={cn(
                        "w-[14px] h-[14px] rounded-full border-2 border-[var(--champan)] mb-3 relative z-10",
                        hito.isStart
                          ? "bg-[var(--champan)] shadow-[0_0_0_4px_rgba(201,169,110,0.15)]"
                          : "bg-[var(--bk)]",
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] max-[640px]:text-[10.5px] font-bold tracking-[1px] uppercase leading-[1.3]",
                        hito.isStart ? "text-[var(--champan)]" : "text-[var(--wh)]/60",
                      )}
                    >
                      {hito.grade}
                    </span>
                    {hito.insignia && (
                      <span className="mt-1 text-[9px] tracking-[0.5px] lowercase italic text-[var(--champan)]/65 leading-[1.2]">
                        {hito.insignia}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <a
              href={texts.cta.href}
              className="inline-flex items-center justify-center min-h-[56px] px-9 py-4 text-[13px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
            >
              {texts.cta.label}
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   8. QUÉ HAY DENTRO
   ═══════════════════════════════════════════════════════ */
function QueHayDentroSection({ texts }: { texts: LandingTexts["queHayDentro"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.cards.length, 0.15);
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

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

        {/* Una sola card: el primer experimento (Plan Lab) */}
        <div className="max-w-[720px] mx-auto">
          {texts.cards.map((card, i) => {
            const currentPricing = card.pricing[billing];
            const ctaHref = billing === "monthly" ? card.cta.hrefMonthly : card.cta.hrefYearly;
            return (
            <article
              key={card.title}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="relative flex flex-col p-8 max-[960px]:p-6 max-[640px]:p-5 rounded-[2px] border border-[var(--champan)]/55 bg-[rgba(201,169,110,0.04)]"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
              />
              <span className="absolute -top-3 right-6 text-[9px] font-bold tracking-[2px] uppercase text-[var(--champan)] px-2 py-[3px] rounded-[2px] border border-[var(--champan)]/55 bg-[var(--bk)]">
                Empieza aquí
              </span>

              <div className="inline-flex items-center gap-2 self-start mb-5">
                <span aria-hidden className="w-[5px] h-[5px] rounded-full bg-[var(--champan)]" />
                <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
                  {card.badge}
                </span>
              </div>

              {/* Switch mensual/anual */}
              <div
                role="tablist"
                aria-label="Modalidad de pago"
                className="inline-flex self-start mb-4 rounded-[2px] border border-[var(--champan)]/35 bg-[rgba(201,169,110,0.04)] overflow-hidden"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={billing === "monthly"}
                  onClick={() => setBilling("monthly")}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold tracking-[1.5px] uppercase transition-colors duration-200 cursor-pointer",
                    billing === "monthly"
                      ? "bg-[var(--champan)] text-[var(--negro-v)]"
                      : "text-[var(--wh)]/60 hover:text-[var(--wh)]/85",
                  )}
                >
                  {card.pricing.monthly.label}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={billing === "yearly"}
                  onClick={() => setBilling("yearly")}
                  className={cn(
                    "px-4 py-2 text-[10px] font-bold tracking-[1.5px] uppercase transition-colors duration-200 cursor-pointer",
                    billing === "yearly"
                      ? "bg-[var(--champan)] text-[var(--negro-v)]"
                      : "text-[var(--wh)]/60 hover:text-[var(--wh)]/85",
                  )}
                >
                  {card.pricing.yearly.label}
                </button>
              </div>

              {/* Precio dinámico */}
              <div className="mb-6">
                <div className="font-bold text-[clamp(28px,3.4vw,40px)] tracking-[-0.8px] leading-[1] text-[var(--champan)] mb-1.5">
                  {currentPricing.price}
                </div>
                <div className="text-[12px] opacity-65 italic">
                  {currentPricing.microcopy}
                </div>
              </div>

              <h3 className="font-bold text-[clamp(20px,2.4vw,26px)] tracking-[-0.4px] leading-[1.2] mb-2">
                {card.title}
              </h3>
              <p className="text-[14px] max-[640px]:text-[13.5px] opacity-70 italic leading-[1.45] mb-5">
                {card.subtitle}
              </p>
              <div className="space-y-4 mb-6">
                {card.body.map((paragraph, j) => (
                  <p
                    key={j}
                    className="text-[13.5px] max-[640px]:text-[13px] opacity-85 leading-[1.6]"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Stats del coach — modo carrera con barras vacías */}
              <div className="pt-6 pb-1 border-t border-white/[.08] mb-6">
                <div className="flex items-baseline justify-between mb-3">
                  <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
                    {card.stats.label}
                  </div>
                  <div className="text-[9.5px] tracking-[0.5px] italic opacity-55">
                    {card.stats.sublabel}
                  </div>
                </div>
                <ul className="space-y-3">
                  {card.stats.items.map((stat) => (
                    <li
                      key={stat}
                      className="flex items-center gap-3"
                    >
                      <span className="text-[11px] font-bold tracking-[1px] uppercase opacity-85 w-[110px] flex-shrink-0">
                        {stat}
                      </span>
                      <div
                        aria-hidden
                        className="flex gap-1 flex-1"
                      >
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className="h-[6px] flex-1 rounded-[1px] border border-[var(--champan)]/25 bg-transparent"
                          />
                        ))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 border-t border-white/[.08] space-y-5">
                {card.entregables.map((group) => (
                  <div key={group.label}>
                    <div className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)] mb-2.5">
                      {group.label}
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 text-[13px] max-[640px]:text-[12.5px] leading-[1.5] opacity-90"
                        >
                          <span
                            aria-hidden
                            className="mt-[7px] w-[4px] h-[4px] rounded-full bg-[var(--champan)] flex-shrink-0"
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Teaser del próximo tier — modo carrera (opcional) */}
              {card.nextTier && (
                <div className="mt-7 pt-5 border-t border-dashed border-[var(--champan)]/30">
                  <div className="text-[9.5px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]/70 mb-1">
                    {card.nextTier.label}
                  </div>
                  <div className="text-[12.5px] opacity-65 italic">
                    {card.nextTier.text}
                  </div>
                </div>
              )}

              {/* CTA al carrito de compra */}
              <a
                href={ctaHref}
                className="inline-flex items-center justify-center min-h-[52px] px-8 py-3 mt-7 text-[12px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
              >
                {card.cta.label}
                <span aria-hidden className="ml-2">→</span>
              </a>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   9. QUÉ CAMBIA EN TU NEGOCIO (4 escenas antes/después)
   ═══════════════════════════════════════════════════════ */
function NegocioSection({ texts }: { texts: LandingTexts["negocio"] }) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.items.length, 0.15);

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
          <h2 className="font-bold text-[clamp(26px,3.4vw,40px)] tracking-[-0.8px] leading-[1.2] mb-4 max-w-[880px] mx-auto">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-5">
          {texts.items.map((item, i) => (
            <article
              key={item.scene}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex flex-col p-7 max-[960px]:p-5 rounded-[2px] border border-white/[.10] bg-white/[0.012]"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
                  Escena 0{i + 1}
                </span>
                <span aria-hidden className="flex-1 h-px bg-white/[.08]" />
              </div>
              <h3 className="font-bold text-[clamp(16px,1.6vw,18px)] tracking-[-0.2px] leading-[1.3] mb-5">
                {item.scene}
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--wh)]/40 block mb-1">
                    Antes
                  </span>
                  <p className="text-[13px] opacity-65 leading-[1.55]">{item.before}</p>
                </div>
                <div className="pt-3 border-t border-white/[.06]">
                  <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--champan)] block mb-1">
                    Después
                  </span>
                  <p className="text-[13px] opacity-90 leading-[1.55]">{item.after}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   10. COACHES DENTRO DEL LAB
   ═══════════════════════════════════════════════════════ */
function CoachesDentroSection({ texts }: { texts: LandingTexts["coachesDentro"] }) {
  const { ref, visible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(texts.tiers.length, 0.15);
  const closerReveal = useReveal(0.1);
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
        <h2 className="font-bold text-[clamp(32px,4.4vw,52px)] tracking-[-1.2px] leading-[1.05] mb-5">
          {texts.heading}
        </h2>
        <p className="text-[14px] max-[640px]:text-[13px] opacity-75 max-w-[600px] mx-auto leading-[1.6] mb-12">
          {texts.sub}
        </p>

        {/* Pirámide del mérito */}
        <div className="relative max-w-[520px] mx-auto mb-12 max-[640px]:mb-10">
          <ul className="flex flex-col gap-3">
            {texts.tiers.map((tier, i) => {
              const widthPct = Math.min(100, (tier.count / texts.total) * 100 * 2.2);
              return (
                <li
                  key={tier.label}
                  ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                  className="flex items-center gap-4 max-[640px]:gap-3"
                  style={{
                    opacity: visibleItems[i] ? 1 : 0,
                    transform: visibleItems[i] ? "none" : "translateX(-15px)",
                    transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
                  }}
                >
                  {/* Cantidad */}
                  <span className="font-bold text-[24px] max-[640px]:text-[20px] tracking-[-0.5px] text-[var(--champan)] w-[48px] max-[640px]:w-[40px] text-right flex-shrink-0">
                    {tier.count}
                  </span>
                  {/* Barra + label */}
                  <div className="flex-1 text-left">
                    <div className="text-[11px] max-[640px]:text-[10.5px] font-bold tracking-[1.5px] uppercase opacity-85 mb-1.5 leading-[1.3]">
                      {tier.label}
                    </div>
                    <div className="h-[6px] w-full bg-[rgba(201,169,110,0.10)] rounded-[2px] overflow-hidden">
                      <div
                        className="h-full bg-[var(--champan)]/60 rounded-[2px]"
                        style={{ width: `${widthPct}%` }}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Cierre cortante */}
        <p
          ref={closerReveal.ref}
          className="italic font-[var(--font-serif)] text-[clamp(16px,2vw,20px)] leading-[1.4] text-[var(--champan)] mb-10 max-w-[520px] mx-auto"
          style={{
            opacity: closerReveal.visible ? 1 : 0,
            transform: closerReveal.visible ? "none" : "translateY(12px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          &ldquo;{texts.closer}&rdquo;
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
   11. NO ES PARA TI SI...
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
   12. FAQ
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
   13. CTA FINAL
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
   PÁGINA — orden de 13 bloques
   ═══════════════════════════════════════════════════════ */
export default function LabCoachPage() {
  const { t } = useI18n();
  const tl = t.lab.coach.landing;
  const tp = t.lab.coach.pricing;

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />
      <HeroSection texts={tl.hero} />
      <EspejoQuiz texts={tl.siEstoTeSuena} />
      <MetodoSection texts={tl.metodo} />
      <QueHayDentroSection texts={tl.queHayDentro} />
      <CaminoBlock
        steps={CAMINO_STEPS}
        destinos={CAMINO_DESTINOS}
        texts={{
          eyebrow: tl.camino.eyebrow,
          heading: tl.camino.heading,
          sub: tl.camino.sub,
          grados: tp.camino.grados,
          insignias: tp.camino.insignias,
          unlocks: tp.camino.unlocks,
          hitos: tp.camino.hitos,
          destinos: tp.camino.destinos,
        }}
      />
      <InversionSection texts={tl.inversion} />
      <NegocioSection texts={tl.negocio} />
      <CoachesDentroSection texts={tl.coachesDentro} />
      <NoEsParaTiSection texts={tl.noEsParaTi} />
      <FaqSection texts={tl.faq} />
      <CtaFinalSection texts={tl.ctaFinal} />
      <Footer />
    </div>
  );
}
