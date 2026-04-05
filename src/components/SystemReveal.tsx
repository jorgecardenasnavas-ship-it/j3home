"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function SystemReveal() {
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

      const scrolled = windowH - rect.top - windowH * 0.2;
      const animRange = totalH * 0.75;
      const p = Math.max(0, Math.min(1, scrolled / animRange));
      setProgress(p);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Block 1 (0-18%)
  const p1 = Math.min(1, progress / 0.18);
  // Line 1 (16-24%)
  const line1 = Math.max(0, Math.min(1, (progress - 0.16) / 0.08));
  // Block 2 (22-38%)
  const p2 = Math.max(0, Math.min(1, (progress - 0.22) / 0.16));
  // Line 2 (36-44%)
  const line2 = Math.max(0, Math.min(1, (progress - 0.36) / 0.08));
  // Block 3 (42-58%)
  const p3 = Math.max(0, Math.min(1, (progress - 0.42) / 0.16));
  // 6 dots (60-82%)
  const pDots = Math.max(0, Math.min(1, (progress - 0.60) / 0.22));

  const blocks = t.system.blocks;

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--bk)]"
      style={{ height: "180vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(220,175,100,${0.04 * line1}) 0%, transparent 70%)`,
          }}
        />

        <div className="text-center px-6 max-w-[900px]">
          {/* Block 1 */}
          <h2
            className="font-bold uppercase tracking-[-3px] leading-[.85] text-[clamp(36px,5.5vw,80px)]"
            style={{ opacity: p1 }}
          >
            <span className="text-[var(--wh)] block">{blocks[0].line1}</span>
            <span className="j3-grad-text block">{blocks[0].line2}</span>
          </h2>

          {/* Gold line 1 */}
          <div className="flex justify-center my-6">
            <div
              className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
              style={{
                width: `${line1 * 100}%`,
                maxWidth: "400px",
                opacity: line1,
              }}
            />
          </div>

          {/* Block 2 */}
          <h3
            className="font-bold uppercase tracking-[-2px] leading-[.85] text-[clamp(36px,5.5vw,80px)]"
            style={{ opacity: p2 }}
          >
            <span className="j3-grad-text block">{blocks[1].line1}</span>
            <span className="text-[var(--wh)] block">{blocks[1].line2}</span>
          </h3>

          {/* Gold line 2 */}
          <div className="flex justify-center my-6">
            <div
              className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
              style={{
                width: `${line2 * 100}%`,
                maxWidth: "400px",
                opacity: line2,
              }}
            />
          </div>

          {/* Block 3 */}
          <h3
            className="font-bold uppercase tracking-[-2px] leading-[.85] text-[clamp(36px,5.5vw,80px)]"
            style={{ opacity: p3 }}
          >
            <span className="text-[var(--wh)] block">{blocks[2].line1}</span>
            <span className="j3-grad-text block">{blocks[2].line2}</span>
          </h3>

          {/* 6 product nodes */}
          <div
            className="grid grid-cols-6 max-[960px]:grid-cols-3 items-center justify-items-center gap-6 max-[960px]:gap-4 mt-10"
            style={{ opacity: pDots }}
          >
            {t.system.nodes.map((name) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2"
              >
                <div className="w-[10px] h-[10px] rounded-full border border-[var(--g1)]/50 bg-[var(--g1)]/10" />
                <span className="text-[9px] max-[960px]:text-[11px] font-bold tracking-[2px] max-[960px]:tracking-[1px] uppercase text-[var(--g1)]/70">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
