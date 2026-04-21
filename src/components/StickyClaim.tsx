"use client";

import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();

  return (
    <div
      className="fixed top-[52px] left-0 right-0 z-[80] h-[32px] max-[960px]:hidden bg-black/55 backdrop-blur-md border-b border-white/[0.04] flex items-center justify-center pointer-events-none"
    >
      <span className="text-[10px] tracking-[5px] uppercase text-white/45 font-normal select-none">
        <span className="j3-grad-text font-bold">{t.hero.play}</span>
        <span className="mx-3 text-white/20">·</span>
        <span className="text-white/65 font-bold">{t.hero.coach}</span>
        <span className="mx-3 text-white/20">·</span>
        <span className="text-white/65 font-bold">{t.hero.manage}</span>
      </span>
    </div>
  );
}
