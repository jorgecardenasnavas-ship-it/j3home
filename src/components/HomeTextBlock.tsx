"use client";

import { useI18n } from "@/i18n/context";

export function HomeTextBlock() {
  const { t } = useI18n();

  return (
    <div className="bg-[var(--bk)] py-20 max-[960px]:py-14 px-8 text-center border-t border-white/[.06] border-b border-white/[.06]">
      <div className="flex flex-col items-center gap-[2px]">
        <span className="block py-[4px] text-[clamp(14px,1.6vw,18px)] tracking-[0.3px] leading-[1.5] font-light text-[var(--gy2)]">
          {t.home.line1}
        </span>
        <span className="block py-[4px] text-[clamp(14px,1.6vw,18px)] tracking-[0.3px] leading-[1.5] font-medium text-[var(--g1)]">
          {t.home.line2}
        </span>
        <span className="block mt-4 font-bold text-[clamp(17px,2vw,24px)] text-[var(--wh)] italic tracking-[-0.3px]">
          {t.home.closer}
        </span>
      </div>
    </div>
  );
}
