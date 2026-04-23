"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

const HomeGlobe = dynamic(
  () => import("@/components/HomeGlobe").then((m) => ({ default: m.HomeGlobe })),
  { ssr: false },
);

export function CoachFinder() {
  const { t } = useI18n();

  return (
    <section
      id="coach-finder"
      className="relative w-full h-[70vh] min-h-[520px] max-[960px]:h-[65vh] max-[960px]:min-h-[480px] overflow-hidden bg-black border-t border-white/[0.06]"
    >
      {/* Globe 3D */}
      <div className="absolute inset-0 z-0">
        <HomeGlobe />
      </div>

      {/* Desktop gradient — horizontal, darkens left side for text */}
      <div className="absolute inset-0 z-[5] pointer-events-none bg-gradient-to-r from-black/85 via-black/40 to-transparent max-[960px]:hidden" />

      {/* Mobile gradient — vertical, only covers top portion so map is visible below */}
      <div className="absolute top-0 left-0 right-0 h-[58%] z-[5] pointer-events-none bg-gradient-to-b from-black/95 via-black/70 to-transparent hidden max-[960px]:block" />

      {/* Content — desktop: centered vertical / mobile: top-anchored, tighter */}
      <div className="relative z-10 h-full flex flex-col justify-center gap-5 max-w-[620px] px-12 max-[960px]:px-6 max-[960px]:max-w-full max-[960px]:justify-start max-[960px]:pt-10 max-[960px]:gap-3 pointer-events-none">
        <span className="text-[10px] tracking-[4px] uppercase text-[var(--g1)]/70 font-bold">
          {t.home.coachFinder.label}
        </span>
        <h2 className="text-[clamp(40px,5.6vw,82px)] max-[960px]:text-[clamp(30px,8vw,44px)] font-black leading-[0.95] tracking-[-2px] text-white">
          {t.home.coachFinder.title}
        </h2>
        <p className="text-[clamp(14px,1.2vw,17px)] max-[960px]:text-[13px] text-white/55 font-light leading-[1.5] max-w-[440px]">
          {t.home.coachFinder.subtitle}
        </p>
        <Link
          href="/academy#map"
          className="inline-flex items-center gap-[10px] mt-2 max-[960px]:mt-1 text-[11px] font-bold tracking-[2px] uppercase no-underline text-[var(--g1)] w-fit transition-[gap] duration-200 hover:gap-[18px] pointer-events-auto"
        >
          {t.home.coachFinder.cta}
          <span className="text-[16px] font-light">→</span>
        </Link>
      </div>
    </section>
  );
}
