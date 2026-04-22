"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { HomeMap } from "@/components/HomeMap";

export function CoachFinder() {
  const { t } = useI18n();

  return (
    <section
      id="coach-finder"
      className="relative w-full h-[70vh] min-h-[520px] max-[960px]:h-[60vh] max-[960px]:min-h-[460px] overflow-hidden bg-black border-t border-white/[0.06]"
    >
      {/* Home map — HQ Málaga hub + curved lines + dots */}
      <div className="absolute inset-0">
        <HomeMap />
      </div>

      {/* Dark gradient overlay for text legibility (left side) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/40 to-transparent max-[960px]:from-black/92 max-[960px]:via-black/65 max-[960px]:to-black/30" />

      {/* Content — left-aligned on desktop, centered on mobile */}
      <div className="relative z-10 h-full flex flex-col justify-center gap-5 max-w-[620px] px-12 max-[960px]:px-6 max-[960px]:max-w-full pointer-events-none">
        <span className="text-[10px] tracking-[4px] uppercase text-[var(--g1)]/70 font-bold">
          {t.home.coachFinder.label}
        </span>
        <h2 className="text-[clamp(40px,5.6vw,82px)] font-black leading-[0.95] tracking-[-2px] text-white">
          {t.home.coachFinder.title}
        </h2>
        <p className="text-[clamp(14px,1.2vw,17px)] text-white/55 font-light leading-[1.5] max-w-[440px]">
          {t.home.coachFinder.subtitle}
        </p>
        <Link
          href="/academy#map"
          className="inline-flex items-center gap-[10px] mt-2 text-[11px] font-bold tracking-[2px] uppercase no-underline text-[var(--g1)] w-fit transition-[gap] duration-200 hover:gap-[18px] pointer-events-auto"
        >
          {t.home.coachFinder.cta}
          <span className="text-[16px] font-light">→</span>
        </Link>
      </div>
    </section>
  );
}
