"use client";

/* ──────────────────────────────────────────────
   HeadCoachCard — bloque destacado del tier Head Coach
   dentro de /lab/coach.

   Presenta el tier superior con sus 6 pilares + mecánica de
   retos mensuales + track record. Diferenciado visualmente
   con paleta morado/champán para no confundir con el Coach
   card que ya existe (tier base).

   Toda la información viene por props (texts) — el componente
   es agnóstico del dictionary.
   ────────────────────────────────────────────── */

import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface HeadCoachTexts {
  eyebrow: string;
  heading: string;
  sub: string;
  tagline: string;
  price: {
    main: string;
    subline: string;
  };
  pilares: readonly {
    num: string;
    title: string;
    desc: string;
  }[];
  retos: {
    title: string;
    description: string;
    tiers: readonly {
      label: string;
      reward: string;
    }[];
  };
  trackRecord: {
    title: string;
    description: string;
  };
  cta: string;
  access: string;
}

interface HeadCoachCardProps {
  texts: HeadCoachTexts;
  ctaHref: string;
  className?: string;
}

export function HeadCoachCard({ texts, ctaHref, className }: HeadCoachCardProps) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs: pilarRefs, visibleItems: pilarVisible } = useStaggerReveal(texts.pilares.length, 0.08);
  const { ref: retosRef, visible: retosVisible } = useReveal(0.1);
  const { ref: trackRef, visible: trackVisible } = useReveal(0.1);

  return (
    <section
      className={cn(
        "relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]",
        className,
      )}
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        {/* Banda superior gradiente — mismo lenguaje visual que el tier Head Coach del CaminoBlock */}
        <span
          aria-hidden
          className="absolute top-0 left-12 right-12 max-[960px]:left-6 max-[960px]:right-6 max-[640px]:left-4 max-[640px]:right-4 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
        />

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[#a89efc] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-75 max-w-[680px] mx-auto leading-[1.55] mb-3">
            {texts.sub}
          </p>
          <p className="text-[13px] italic opacity-65 max-w-[600px] mx-auto leading-[1.5]">
            {texts.tagline}
          </p>
        </div>

        {/* 6 pilares */}
        <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4 mb-14">
          {texts.pilares.map((p, i) => (
            <article
              key={p.num}
              ref={(el) => { pilarRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex flex-col p-5 rounded-[2px] border border-white/[.10] bg-white/[0.012] hover:border-[rgba(83,74,183,0.4)] transition-colors duration-500"
              style={{
                opacity: pilarVisible[i] ? 1 : 0,
                transform: pilarVisible[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.07}s`,
              }}
            >
              <span aria-hidden className="block font-bold text-[28px] leading-[1] tracking-[-1px] text-[#a89efc]/85 mb-3">
                {p.num}
              </span>
              <h3 className="text-[14px] font-bold uppercase tracking-[-0.2px] mb-2 leading-[1.2]">
                {p.title}
              </h3>
              <p className="text-[12.5px] opacity-70 leading-[1.5]">
                {p.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Retos mensuales */}
        <div
          ref={retosRef}
          className="max-w-[920px] mx-auto p-7 max-[960px]:p-5 rounded-[2px] border border-[rgba(83,74,183,0.4)] bg-[rgba(83,74,183,0.03)] mb-10"
          style={{
            opacity: retosVisible ? 1 : 0,
            transform: retosVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.1s",
          }}
        >
          <h3 className="font-bold text-[18px] uppercase tracking-[-0.2px] mb-2 text-[#a89efc]">
            {texts.retos.title}
          </h3>
          <p className="text-[13px] opacity-75 leading-[1.55] mb-5">
            {texts.retos.description}
          </p>
          <div className="space-y-2.5">
            {texts.retos.tiers.map((t) => (
              <div key={t.label} className="flex items-start gap-3">
                <span aria-hidden className="text-[#a89efc] text-[14px] leading-none mt-[2px] flex-shrink-0">
                  ●
                </span>
                <div className="flex-1">
                  <span className="text-[12.5px] font-bold uppercase tracking-[0.5px] text-[var(--cream)]">
                    {t.label}
                  </span>
                  <span className="text-[12.5px] opacity-70 ml-2">
                    → {t.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track record */}
        <div
          ref={trackRef}
          className="max-w-[680px] mx-auto text-center mb-10"
          style={{
            opacity: trackVisible ? 1 : 0,
            transform: trackVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.15s",
          }}
        >
          <h3 className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#a89efc] mb-2">
            {texts.trackRecord.title}
          </h3>
          <p className="text-[13.5px] opacity-80 leading-[1.55]">
            {texts.trackRecord.description}
          </p>
        </div>

        {/* Precio + CTA */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-[22px] font-bold text-[var(--cream)] tracking-[-0.5px]">
              {texts.price.main}
            </span>
          </div>
          <p className="text-[12px] opacity-65 mb-6">
            {texts.price.subline}
          </p>
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3 text-[12px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[#534AB7] text-[var(--cream)] border border-[#534AB7] hover:bg-[#3d3690] hover:border-[#3d3690] transition-all duration-300"
          >
            {texts.cta}
            <span aria-hidden className="ml-2">→</span>
          </a>
          <p className="text-[11.5px] opacity-55 mt-4 italic max-w-[560px] mx-auto leading-[1.45]">
            {texts.access}
          </p>
        </div>
      </div>
    </section>
  );
}
