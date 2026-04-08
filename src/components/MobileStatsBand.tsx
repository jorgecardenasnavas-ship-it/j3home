"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

/**
 * Editorial vertical stats list — mobile only.
 *
 * Sits between ImpactSection and SystemReveal on the home page.
 * Each cred renders as a row with:
 *   • a small gold index (01, 02…)
 *   • the value as a big italic gold "brushstroke" word
 *   • the label uppercase underneath
 * A continuous gold hairline runs vertically on the left, tying the
 * rows together like a magazine pull-quote.
 */
export function MobileStatsBand() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hidden max-[960px]:!block relative bg-black border-y border-white/[.06] py-14 px-6 overflow-hidden"
    >
      {/* Subtle radial gold glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(220,175,100,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Header — eyebrow + kicker (brushstroke style) */}
      <div className="relative flex items-start gap-4 mb-9">
        <span className="w-px h-[44px] mt-1 shrink-0 bg-gradient-to-b from-[var(--g1)] via-[var(--g1)]/40 to-transparent" />
        <div
          className="leading-[1.25]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(10px)",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
          }}
        >
          <span className="block text-[10px] font-light tracking-[3px] uppercase text-[var(--gy3)]">
            {t.hero.credsHeading}
          </span>
          <span className="block text-[22px] font-bold italic j3-grad-text mt-[2px] tracking-[-0.3px]">
            {t.hero.credsKicker}
          </span>
        </div>
      </div>

      {/* Stats list — continuous gold hairline + 5 rows */}
      <ol className="relative pl-7">
        {/* Vertical hairline running through all rows */}
        <span
          aria-hidden
          className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--g1)]/60 via-[var(--g1)]/20 to-transparent"
        />

        {t.hero.credsMobile.map((cred, idx) => (
          <li
            key={idx}
            className="relative pb-6 last:pb-0"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateX(-12px)",
              transition: `all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.15 + idx * 0.09}s`,
            }}
          >
            {/* Index dot on the hairline */}
            <span
              aria-hidden
              className="absolute -left-[27px] top-[10px] w-[7px] h-[7px] rounded-full bg-[var(--g1)] ring-2 ring-black"
            />

            {/* Index number */}
            <span className="block text-[9px] font-bold tracking-[3px] text-[var(--g1)]/70 mb-1">
              {String(idx + 1).padStart(2, "0")}
            </span>

            {/* Big italic gold value + label */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-[34px] font-bold italic tracking-[-1px] j3-grad-text inline-block pr-[0.12em] leading-[1]">
                {cred.val}
              </span>
              <span className="text-[10px] font-light tracking-[1.2px] uppercase text-[var(--gy2)] leading-[1.35] flex-1 min-w-0">
                {cred.label}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
