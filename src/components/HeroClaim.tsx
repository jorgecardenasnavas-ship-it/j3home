"use client";

import type { HomeProductAudience } from "@/data/home-products";
import { useI18n } from "@/i18n/context";

interface HeroClaimProps {
  activeAudience: HomeProductAudience;
}

export function HeroClaim({ activeAudience }: HeroClaimProps) {
  const { t } = useI18n();

  return (
    <div className="pointer-events-none">
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          activeAudience === "play" ? "" : "inactive"
        }`}
      >
        {t.hero.play}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)] ${
          activeAudience === "coach" ? "" : "inactive"
        }`}
      >
        {t.hero.coach}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          activeAudience === "manage" ? "" : "inactive"
        }`}
      >
        {t.hero.manage}
      </span>
    </div>
  );
}
