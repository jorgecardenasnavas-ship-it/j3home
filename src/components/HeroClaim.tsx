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
      {/* PLAY — gradiente champán */}
      <span className={`hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${visible[0] ? "in" : ""}`}>
        {t.hero.play}
      </span>

      {/* COACH — blanco puro */}
      <span
        className={`hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] ${visible[1] ? "in" : ""}`}
        style={{ color: "#ffffff", WebkitTextFillColor: "#ffffff" }}
      >
        {t.hero.coach}
      </span>

      {/* MANAGE — crema cálida */}
      <span
        className={`hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] ${visible[2] ? "in" : ""}`}
        style={{ WebkitTextStroke: "2px var(--g1)", color: "transparent", WebkitTextFillColor: "transparent" }}
      >
        {t.hero.manage}
      </span>
    </div>
  );
}
