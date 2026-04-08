"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";


export function ImpactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const { t } = useI18n();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      const rect = container!.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = container!.scrollHeight;

      // Start animation as soon as the section enters viewport
      const scrolled = -rect.top + windowH * 0.5;
      // Tighter range for faster reveal
      const animRange = totalH * 0.5;
      const p = Math.max(0, Math.min(1, scrolled / animRange));
      setProgress(p);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1 (0-30%): line1 rises from below + deblurs
  const p1 = Math.min(1, progress / 0.3);
  // Phase 2 (25-55%): line2 rises from below
  const p2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.3));
  // Phase 3 (50-80%): line3 rises from below
  const p3 = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
  // Phase 4 (75-100%): Gold accent line + tagline
  const p4 = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--bk)]"
      style={{ height: "160vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(220,175,100,${0.05 * p4}) 0%, transparent 70%)`,
          }}
        />

        <div className="w-full max-w-[1200px] px-12 max-[960px]:px-6">
          {/* Line 1 — gold gradient */}
          <div className="text-left overflow-hidden">
            <span
              className="block font-bold text-j3-hero uppercase tracking-[-2px] leading-[1] j3-grad-text"
              style={{
                opacity: p1,
                transform: `translateY(${(1 - p1) * 80}px)`,
                filter: `blur(${(1 - p1) * 6}px)`,
              }}
            >
              {t.impact.line1}
            </span>
          </div>

          {/* Line 2 — stroke outline, right-aligned */}
          <div className="text-right overflow-hidden">
            <span
              className="block font-bold text-j3-hero uppercase tracking-[-2px] leading-[1] pt-[0.15em]"
              style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,.18)",
                color: "transparent",
                opacity: p2,
                transform: `translateY(${(1 - p2) * 80}px)`,
                filter: `blur(${(1 - p2) * 6}px)`,
              }}
            >
              {t.impact.line2}
            </span>
          </div>

          {/* Line 3 — white, left with offset */}
          <div className="text-left pl-[8vw] max-[960px]:pl-0 overflow-hidden">
            <span
              className="block font-bold text-j3-4xl uppercase tracking-[-2px] leading-[1] text-[var(--wh)] whitespace-nowrap"
              style={{
                opacity: p3,
                transform: `translateY(${(1 - p3) * 80}px)`,
                filter: `blur(${(1 - p3) * 6}px)`,
              }}
            >
              {t.impact.line3}
            </span>
          </div>

          {/* Gold accent line — asymmetric, starts from left */}
          <div className="mt-6 overflow-hidden">
            <div
              className="h-[2px] bg-gradient-to-r from-[var(--g1)] via-[var(--g2)] to-transparent"
              style={{
                width: `${p4 * 100}%`,
                maxWidth: "400px",
                opacity: p4,
              }}
            />
          </div>

          {/* Tagline — left-aligned to match asymmetry */}
          <p
            className="text-left text-[11px] max-[960px]:text-[12px] font-normal tracking-[5px] max-[960px]:tracking-[3px] uppercase text-[var(--gy2)] mt-4"
            style={{
              opacity: Math.max(0, (p4 - 0.3) / 0.7),
            }}
          >
            {t.impact.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}
