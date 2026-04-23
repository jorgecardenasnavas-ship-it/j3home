"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";

export function HeroClaim() {
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
    <div className="pointer-events-none text-center">
      <span className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${visible[0] ? "in" : ""}`}>
        {t.hero.play}
      </span>
      <span className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)] ${visible[1] ? "in" : ""}`}>
        {t.hero.coach}
      </span>
      <span className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${visible[2] ? "in" : ""}`}>
        {t.hero.manage}
      </span>
    </div>
  );
}
