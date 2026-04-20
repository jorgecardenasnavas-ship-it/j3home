"use client";

/* ──────────────────────────────────────────────
   /clubes — Página dedicada al pitch B2B de franquicia J3.
   Audiencia: dueños de club de pádel, emprendedores del sector,
   inversores evaluando llevar J3 a su espacio.

   Contenido:
     - FranquiciasSection (pillars + CTA destacado + disclaimer)

   Antes vivía dentro de /academy como último bloque antes de Stats —
   se separó para evitar que el funnel del jugador termine con un
   pitch B2B que no le concierne. Ahora /academy se cierra en
   "Empieza hoy" (programas Málaga) y los clubes tienen su propia
   página con foco completo.
   ────────────────────────────────────────────── */

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";

function FranquiciasSection() {
  const { t } = useI18n();
  const f = t.academy.franquicias;
  const { ref, visible } = useReveal(0.12);
  const { itemRefs: pillarRefs, visibleItems: pillarVisible } = useStaggerReveal(f.pillars.length, 0.15);

  return (
    <section
      id="franquicias"
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 scroll-mt-[120px] overflow-hidden"
      style={{ background: "var(--bk)", color: "var(--wh)" }}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[340px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, rgba(220,175,100,0.12) 0%, rgba(220,175,100,0) 65%)",
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
          <div className="inline-flex items-center gap-2 border border-[var(--g1)]/35 px-3 py-1.5 mb-5" style={{ borderRadius: 2 }}>
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--g1)]" aria-hidden />
            <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]">
              {f.eyebrow}
            </span>
          </div>
          <h2 className="font-bold text-[clamp(40px,6vw,80px)] uppercase tracking-[-2px] leading-[1.02]">
            {f.headingPre}
            <span className="italic font-[var(--font-serif)] normal-case tracking-[-1px] text-[var(--g1)]">
              {f.headingAccent}
            </span>
          </h2>
          <p className="mt-5 max-w-[700px] mx-auto text-[14px] max-[640px]:text-[13px] leading-[1.55] opacity-72">
            {f.lede}
          </p>
        </div>

        <div className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4 mb-16 max-[960px]:mb-12">
          {f.pillars.map((p, i) => (
            <div
              key={p.num}
              ref={(el) => { pillarRefs.current[i] = el; }}
              className="relative border border-white/[.07] hover:border-[var(--g1)]/35 transition-colors duration-500 p-6 max-[960px]:p-5"
              style={{
                background: "rgba(255,255,255,0.018)",
                borderRadius: 2,
                opacity: pillarVisible[i] ? 1 : 0,
                transform: pillarVisible[i] ? "none" : "translateY(20px)",
                transition: `all 0.85s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-extrabold text-[28px] leading-[1] tracking-[-0.5px] text-[var(--g1)]">
                  {p.num}
                </span>
                <span className="h-px flex-1 bg-[var(--g1)]/25" aria-hidden />
              </div>
              <h4 className="font-bold text-[16px] tracking-[-0.3px] mb-2.5">
                {p.title}
              </h4>
              <p className="text-[12.5px] opacity-68 leading-[1.55]">
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div
          className="relative border border-[var(--g1)]/30 overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(220,175,100,0.06) 0%, rgba(10,10,10,0.4) 55%, rgba(220,175,100,0.08) 100%)",
            borderRadius: 2,
          }}
        >
          <span aria-hidden className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent" />
          <span aria-hidden className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)]/60 to-transparent" />

          <div className="grid grid-cols-[1.3fr_1fr] max-[960px]:grid-cols-1 gap-10 max-[960px]:gap-6 p-10 max-[960px]:p-6">
            <div>
              <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-3">
                {f.ctaEyebrow}
              </div>
              <h3 className="font-bold text-[clamp(28px,4vw,48px)] tracking-[-1px] leading-[1.05] mb-4">
                {f.ctaHeading}
              </h3>
              <p className="text-[13px] opacity-75 leading-[1.55] max-w-[460px]">
                {f.ctaSub}
              </p>
            </div>

            <div className="flex flex-col gap-3 self-center max-[960px]:self-stretch">
              <a
                href={f.ctaPrimaryHref}
                className="inline-flex items-center justify-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-black px-6 py-3.5 hover:gap-3 transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #dcaf64, #b8943e)", borderRadius: 2 }}
              >
                {f.ctaPrimary}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </a>
              <button
                type="button"
                disabled
                title="Próximamente"
                className="inline-flex items-center justify-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]/60 border border-[var(--g1)]/25 px-6 py-3.5 cursor-not-allowed"
                style={{ borderRadius: 2 }}
              >
                {f.ctaSecondary}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center mt-8 text-[10.5px] tracking-[2px] uppercase opacity-45">
          {f.disclaimer}
        </p>

        {/* Back-to-academy — cierre sutil */}
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

export default function ClubesPage() {
  return (
    <main className="font-sans w-full bg-[var(--bk)]">
      <Navbar />
      <FranquiciasSection />
      <Footer />
    </main>
  );
}
