"use client";

import { useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/i18n/context";

export function HomeTextBlock() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onScroll = useCallback(() => {
    const section = sectionRef.current;
    const content = contentRef.current;
    if (!section || !content) return;

    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;
    if (rect.bottom < 0 || rect.top > windowH) return;

    const center = rect.top + rect.height / 2;
    const offset = (center - windowH / 2) / windowH;

    content.style.transform = `translateY(${offset * -15}px)`;
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <div
      ref={sectionRef}
      className="relative bg-[var(--bk)] py-20 max-[960px]:py-14 px-8 text-center border-t border-white/[.06] border-b border-white/[.06] overflow-hidden"
    >
      {/* Radial glow behind */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,175,100,.04) 0%, transparent 70%)",
        }}
      />

      <div ref={contentRef} className="relative flex flex-col items-center gap-[2px] will-change-transform">
        {/* Top gold accent line */}
        <div className="w-[40px] h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mb-6 opacity-40" />

        <span className="block py-[4px] text-[clamp(14px,1.6vw,18px)] max-[960px]:text-[16px] tracking-[0.3px] leading-[1.5] font-light text-[var(--gy2)]">
          {t.home.line1}
        </span>
        <span className="block py-[4px] text-[clamp(14px,1.6vw,18px)] max-[960px]:text-[16px] tracking-[0.3px] leading-[1.5] font-medium text-[var(--g1)]">
          {t.home.line2}
        </span>
        <span className="block mt-4 text-[clamp(20px,2.2vw,28px)] max-[960px]:text-[22px] text-[var(--wh)] italic tracking-[-0.3px]" style={{ fontFamily: "var(--font-serif)" }}>
          {t.home.closer}
        </span>

        {/* Bottom gold accent line */}
        <div className="w-[40px] h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mt-6 opacity-40" />
      </div>
    </div>
  );
}
