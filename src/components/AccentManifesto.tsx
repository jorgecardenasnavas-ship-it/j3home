"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function AccentManifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="accent-manifesto relative bg-[var(--bk)] py-[16vh] max-[960px]:py-[12vh] px-12 max-[960px]:px-6 overflow-hidden border-t border-white/[.04] border-b border-white/[.04]"
    >
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 20% 50%, rgba(201,169,110,.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[1100px] mx-auto flex items-start gap-7 max-[960px]:gap-5">
        {/* Vertical gold brushstroke */}
        <span className="block w-px h-[120px] max-[960px]:h-[88px] mt-2 shrink-0 bg-gradient-to-b from-[var(--g1)] via-[var(--g1)]/40 to-transparent" />

        <div className="manifesto-content flex flex-col">
          {/* Eyebrow */}
          <span className="block text-j3-base font-light tracking-[1.5px] uppercase text-[var(--gy3)] leading-[1.2]">
            {t.hero.accentTouch.topLine}
          </span>

          {/* Protagonist line */}
          <p className="mt-3 text-j3-xl max-[960px]:text-j3-lg font-light text-[var(--gy3)] leading-[1.15]">
            <span className="text-j3-3xl font-bold italic tracking-[-0.5px] j3-grad-text inline-block pr-[0.18em] align-baseline">
              {t.hero.accentTouch.accentWord}
            </span>
            {t.hero.accentTouch.afterAccent}
          </p>

          {/* Bottom credits */}
          <div className="flex items-center gap-4 mt-8 flex-wrap">
            <span className="text-j3-xs font-bold tracking-[3px] uppercase text-[var(--g1)]/85">
              {t.hero.accentTouch.labelLeft}
            </span>
            <span className="w-6 h-px bg-[var(--g1)]/25" />
            <span className="text-j3-xs font-bold tracking-[3px] uppercase text-[var(--g1)]/55">
              {t.hero.accentTouch.labelRight}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .accent-manifesto :global(.manifesto-content) {
          opacity: 0;
          transform: translateY(28px);
          transition:
            opacity 1.1s var(--ease-out),
            transform 1.1s var(--ease-out);
        }
        .accent-manifesto.in :global(.manifesto-content) {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
