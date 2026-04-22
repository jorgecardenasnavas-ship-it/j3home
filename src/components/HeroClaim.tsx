"use client";

import { useEffect, useState } from "react";
import type { HomeProductAudience } from "@/data/home-products";
import { useI18n } from "@/i18n/context";

interface HeroClaimProps {
  activeAudience: HomeProductAudience;
}

export function HeroClaim({ activeAudience }: HeroClaimProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState<[boolean, boolean, boolean]>([false, false, false]);

  useEffect(() => {
    const timers = [0, 1, 2].map((i) =>
      setTimeout(() => {
        setVisible((prev) => {
          const next: [boolean, boolean, boolean] = [...prev];
          next[i] = true;
          return next;
        });
      }, 900 + i * 500),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="pointer-events-none">
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          visible[0] ? "in" : ""
        } ${activeAudience === "play" ? "" : "inactive"}`}
      >
        {t.hero.play}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)] ${
          visible[1] ? "in" : ""
        } ${activeAudience === "coach" ? "" : "inactive"}`}
      >
        {t.hero.coach}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          visible[2] ? "in" : ""
        } ${activeAudience === "manage" ? "" : "inactive"}`}
      >
        {t.hero.manage}
      </span>
    </div>
  );
}
