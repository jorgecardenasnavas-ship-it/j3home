"use client";

/* ──────────────────────────────────────────────
   /sello — Página dedicada al estándar J3.
   Responde: "¿qué garantiza J3 cuando ves un pin en el mapa o un
   coach en la red?". Audiencia: jugador que quiere entender qué
   compra, periodista, partner potencial, coach que investiga.

   Contenido:
     - Hero mini con tagline
     - SelloSection (tiers + criterios)

   Antes vivía dentro de /academy — se separó para dar foco al
   player journey en /academy y dejar aquí la documentación del
   estándar para quien la busque.
   ────────────────────────────────────────────── */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";

function SelloSection() {
  const { t } = useI18n();
  const s = t.academy.sello;
  const { ref, visible } = useReveal(0.1);
  const { itemRefs: tierRefs, visibleItems: tierVisible } = useStaggerReveal(s.tiers.length, 0.15);
  const { itemRefs: critRefs, visibleItems: critVisible } = useStaggerReveal(s.criteriaItems.length, 0.15);

  return (
    <section
      id="sello"
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 scroll-mt-[120px] overflow-hidden"
      style={{ background: "var(--bk)", color: "var(--wh)" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(220,175,100,0.08) 0%, rgba(220,175,100,0) 60%)",
        }}
      />

      <div ref={ref} className="relative z-10 max-w-[1400px] mx-auto">
        <div
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4">
            {s.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(36px,5.5vw,72px)] uppercase tracking-[-1.5px] leading-[1.02]">
            {s.headingPre}
            <span className="italic font-[var(--font-serif)] normal-case tracking-[-1px] text-[var(--g1)]">
              {s.headingAccent}
            </span>
          </h2>
          <p className="mt-5 max-w-[640px] mx-auto text-[14px] max-[640px]:text-[13px] leading-[1.5] opacity-70">
            {s.lede}
          </p>
        </div>

        <div className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-5 max-[960px]:gap-4 mb-20 max-[960px]:mb-14">
          {s.tiers.map((tier, i) => (
            <div
              key={tier.key}
              ref={(el) => { tierRefs.current[i] = el; }}
              className="relative border border-white/[.08] hover:border-[var(--g1)]/35 transition-colors duration-500 p-6 max-[960px]:p-5 flex flex-col"
              style={{
                background: "rgba(255,255,255,0.015)",
                borderRadius: 2,
                opacity: tierVisible[i] ? 1 : 0,
                transform: tierVisible[i] ? "none" : "translateY(24px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 right-0 h-[2px]"
                style={{
                  background:
                    tier.key === "hq"
                      ? "linear-gradient(90deg, transparent, var(--g1), transparent)"
                      : "linear-gradient(90deg, transparent, rgba(220,175,100,0.35), transparent)",
                  opacity: tier.key === "hq" ? 1 : 0.6,
                }}
              />
              <div className="inline-flex items-center gap-2 mb-4 self-start">
                <span className="w-[5px] h-[5px] rounded-full bg-[var(--g1)]" aria-hidden />
                <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]">
                  {tier.badge}
                </span>
              </div>
              <h3 className="font-bold text-[20px] max-[960px]:text-[18px] tracking-[-0.5px] leading-[1.2] mb-2">
                {tier.title}
              </h3>
              <p className="text-[13px] opacity-70 leading-[1.5] mb-5">
                {tier.summary}
              </p>
              <ul className="mt-auto space-y-2 pt-4 border-t border-white/[.06]">
                {tier.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[12px] leading-[1.45] opacity-80">
                    <span aria-hidden className="mt-[7px] w-[3px] h-[3px] rounded-full bg-[var(--g1)] flex-shrink-0" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mx-auto mb-14 max-[960px]:mb-10 h-px bg-gradient-to-r from-transparent via-[var(--g1)]/40 to-transparent"
          style={{
            width: visible ? "120px" : "0px",
            transition: "width 1.2s cubic-bezier(.16,1,.3,1) 0.6s",
          }}
        />

        <div className="text-center mb-10 max-[960px]:mb-8">
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-3">
            {s.criteriaEyebrow}
          </div>
          <h3 className="font-bold text-[clamp(22px,3vw,34px)] tracking-[-0.5px] leading-[1.2] max-w-[720px] mx-auto">
            {s.criteriaHeading}
          </h3>
        </div>

        <div className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4">
          {s.criteriaItems.map((item, i) => (
            <div
              key={item.num}
              ref={(el) => { critRefs.current[i] = el; }}
              className="relative border border-white/[.07] hover:border-[var(--g1)]/30 transition-colors duration-500 p-5"
              style={{
                background: "rgba(255,255,255,0.012)",
                borderRadius: 2,
                opacity: critVisible[i] ? 1 : 0,
                transform: critVisible[i] ? "none" : "translateY(20px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <span className="block font-extrabold text-[34px] leading-[1] tracking-[-1px] text-[var(--g1)]/90 mb-3">
                {item.num}
              </span>
              <h4 className="font-bold text-[15px] tracking-[-0.3px] mb-2">
                {item.title}
              </h4>
              <p className="text-[12px] opacity-65 leading-[1.5]">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Back-to-academy — pie sutil que cierra la página */}
        <div className="mt-16 max-[960px]:mt-12 text-center">
          <Link
            href="/academy"
            className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]/70 hover:text-[var(--g1)] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
            Volver a J3 Academy
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function SelloPage() {
  return (
    <main className="font-sans w-full bg-[var(--bk)]">
      <Navbar />
      <SelloSection />
      <Footer />
    </main>
  );
}
