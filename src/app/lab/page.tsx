"use client";

/* ──────────────────────────────────────────────
   /lab — Home del paraguas J3 Lab.

   Presenta los dos productos del Lab (Coaches funcionando, Players
   placeholder pre-lanzamiento) + banda secundaria de Mentor J3.

   J3 Business queda explícitamente FUERA del Lab — sigue siendo
   pilar separado del ecosistema, accesible por su propia URL.
   ────────────────────────────────────────────── */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";

export default function LabHomePage() {
  const { t } = useI18n();
  const tu = t.lab.umbrella;

  const { ref: heroRef, visible: heroVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(2, 0.15);
  const { ref: mentorRef, visible: mentorVisible } = useReveal(0.1);

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />

      {/* Hero del paraguas */}
      <section
        className="relative pt-[200px] pb-[100px] max-[960px]:pt-[160px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
        style={{ background: "var(--bk)" }}
      >
        <div
          ref={heroRef}
          className="relative max-w-[920px] mx-auto text-center"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[4px] uppercase text-[var(--champan)] mb-6 font-bold">
            {tu.hero.eyebrow}
          </div>
          <h1 className="font-bold text-[clamp(40px,6vw,72px)] uppercase tracking-[-2px] leading-[1.0] mb-6">
            {tu.hero.headingPre}{" "}
            <span className="italic font-[var(--font-serif)] normal-case tracking-[-1.5px] text-[var(--champan)]">
              {tu.hero.headingAccent}
            </span>
          </h1>
          <p className="text-[15px] max-[640px]:text-[14px] opacity-80 max-w-[640px] mx-auto leading-[1.55]">
            {tu.hero.sub}
          </p>
        </div>
      </section>

      {/* 2 cards: Coaches y Players */}
      <section
        className="relative py-[60px] max-[960px]:py-[40px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
        style={{ background: "var(--bk)" }}
      >
        <div className="relative max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-5">
            {/* Card Coaches */}
            <article
              ref={(el) => { itemRefs.current[0] = el as HTMLDivElement | null; }}
              className="flex flex-col p-8 max-[960px]:p-6 rounded-[2px] border border-white/[.10] hover:border-[var(--champan)]/40 bg-white/[0.012] transition-colors duration-500"
              style={{
                opacity: visibleItems[0] ? 1 : 0,
                transform: visibleItems[0] ? "none" : "translateY(20px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)] mb-4">
                {tu.cards.coaches.badge}
              </span>
              <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.5px] leading-[1.15] mb-4">
                {tu.cards.coaches.title}
              </h2>
              <p className="text-[14px] opacity-75 leading-[1.55] mb-7 flex-1">
                {tu.cards.coaches.description}
              </p>
              <Link
                href="/lab/coach"
                className="inline-flex items-center justify-center self-start min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
              >
                {tu.cards.coaches.cta}
                <span aria-hidden className="ml-2">→</span>
              </Link>
            </article>

            {/* Card Players (placeholder pre-lanzamiento) */}
            <article
              ref={(el) => { itemRefs.current[1] = el as HTMLDivElement | null; }}
              className="flex flex-col p-8 max-[960px]:p-6 rounded-[2px] border border-dashed border-[var(--champan)]/35 bg-[rgba(201,169,110,0.025)]"
              style={{
                opacity: visibleItems[1] ? 1 : 0,
                transform: visibleItems[1] ? "none" : "translateY(20px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.12s",
              }}
            >
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]/70 mb-4">
                {tu.cards.players.badge}
              </span>
              <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.5px] leading-[1.15] mb-4">
                {tu.cards.players.title}
              </h2>
              <p className="text-[14px] opacity-75 leading-[1.55] mb-3 flex-1">
                {tu.cards.players.description}
              </p>
              <p className="text-[11.5px] italic opacity-60 mb-7">
                {tu.cards.players.comingSoon}
              </p>
              <Link
                href="/lab/players"
                className="inline-flex items-center justify-center self-start min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
              >
                {tu.cards.players.cta}
                <span aria-hidden className="ml-2">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Banda Mentor J3 */}
      <section
        ref={mentorRef}
        className="relative py-[60px] max-[960px]:py-[40px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
        style={{
          background: "var(--verde)",
          opacity: mentorVisible ? 1 : 0,
          transform: mentorVisible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="relative max-w-[920px] mx-auto text-center">
          <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] uppercase tracking-[-0.5px] leading-[1.15] mb-4">
            {tu.mentorBanner.title}
          </h2>
          <p className="text-[14px] opacity-85 max-w-[600px] mx-auto leading-[1.55] mb-6">
            {tu.mentorBanner.description}
          </p>
          <Link
            href="/lab/coach/precios#mentor"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            {tu.mentorBanner.cta}
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
