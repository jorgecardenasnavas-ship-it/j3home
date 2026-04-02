"use client";

import { useEffect, useRef, useState } from "react";

export function SystemReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function handleScroll() {
      const rect = container!.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = container!.scrollHeight;

      const scrolled = windowH - rect.top - windowH * 0.35;
      const animRange = totalH * 0.8;
      const p = Math.max(0, Math.min(1, scrolled / animRange));
      setProgress(p);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1 (0-20%): "EL JUEGO" scales in
  const phase1 = Math.min(1, progress / 0.2);
  // Phase 2 (15-35%): "HA CAMBIADO" fades in
  const phase2 = Math.max(0, Math.min(1, (progress - 0.15) / 0.2));
  // Phase 3 (30-45%): gold line expands
  const phase3 = Math.max(0, Math.min(1, (progress - 0.3) / 0.15));
  // Phase 4 (40-55%): "EL ENTRENAMIENTO" appears
  const phase4 = Math.max(0, Math.min(1, (progress - 0.4) / 0.15));
  // Phase 5 (50-65%): "EVOLUCIONADO" appears
  const phase5 = Math.max(0, Math.min(1, (progress - 0.5) / 0.15));
  // Phase 6 (60-72%): tagline
  const phase6 = Math.max(0, Math.min(1, (progress - 0.6) / 0.12));
  // Phase 7 (70-90%): 6 dots + labels
  const phase7 = Math.max(0, Math.min(1, (progress - 0.7) / 0.2));
  // Phase 8 (85-100%): "6 verticales · 1 sistema"
  const phase8 = Math.max(0, Math.min(1, (progress - 0.85) / 0.15));

  const textScale = 2.5 - 1.5 * phase1;
  const blockY = -30 * phase4;

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--bk)]"
      style={{ height: "200vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 60% 40% at 50% 50%, rgba(220,175,100,${0.04 * phase3}) 0%, transparent 70%)`,
          }}
        />

        <div
          className="text-center px-6 max-w-[900px]"
          style={{
            transform: `translateY(${blockY}px)`,
            transition: "transform 0.1s linear",
          }}
        >
          {/* Block 1: EL JUEGO / HA CAMBIADO */}
          <div className="overflow-hidden">
            <h2
              className="font-bold uppercase tracking-[-3px] leading-[.85]"
              style={{
                fontSize: "clamp(48px, 8vw, 120px)",
                transform: `scale(${textScale})`,
                opacity: phase1,
                transition: "transform 0.05s linear, opacity 0.05s linear",
              }}
            >
              <span className="text-[var(--wh)] block">El juego</span>
              <span
                className="j3-grad-text block"
                style={{
                  opacity: phase2,
                  transform: `translateY(${20 - 20 * phase2}px)`,
                  transition: "transform 0.05s linear, opacity 0.05s linear",
                }}
              >
                ha cambiado.
              </span>
            </h2>
          </div>

          {/* Gold expanding line */}
          <div className="flex justify-center my-8">
            <div
              className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
              style={{
                width: `${phase3 * 100}%`,
                maxWidth: "400px",
                opacity: phase3,
              }}
            />
          </div>

          {/* Block 2: EL ENTRENAMIENTO / EVOLUCIONADO */}
          <div className="overflow-hidden">
            <h3
              className="font-bold uppercase tracking-[-2px] leading-[.85]"
              style={{ fontSize: "clamp(36px, 6vw, 90px)" }}
            >
              <span
                className="j3-grad-text block"
                style={{
                  opacity: phase4,
                  transform: `translateY(${30 - 30 * phase4}px)`,
                  filter: `blur(${(1 - phase4) * 4}px)`,
                  transition: "transform 0.05s linear, opacity 0.05s linear, filter 0.05s linear",
                }}
              >
                El entrenamiento
              </span>
              <span
                className="text-[var(--wh)] block"
                style={{
                  opacity: phase5,
                  transform: `translateY(${30 - 30 * phase5}px)`,
                  filter: `blur(${(1 - phase5) * 4}px)`,
                  transition: "transform 0.05s linear, opacity 0.05s linear, filter 0.05s linear",
                }}
              >
                evolucionado.
              </span>
            </h3>
          </div>

          {/* Short tagline */}
          <p
            className="text-[clamp(12px,1.3vw,16px)] font-light text-[var(--gy2)] leading-[1.6] max-w-[400px] mx-auto mt-6 mb-10"
            style={{
              opacity: phase6,
              transform: `translateY(${12 - 12 * phase6}px)`,
            }}
          >
            Un sistema completo para jugadores y entrenadores que quieren más.
          </p>

          {/* 6 product nodes */}
          <div
            className="flex items-center justify-center gap-6 max-[960px]:gap-4 flex-wrap"
            style={{
              opacity: phase7,
              transform: `translateY(${20 - 20 * phase7}px) scale(${0.9 + 0.1 * phase7})`,
            }}
          >
            {[
              "Coach360",
              "J3PTV",
              "Academy",
              "Business",
              "Experience",
              "Partner",
            ].map((name, i) => (
              <div
                key={name}
                className="flex flex-col items-center gap-2"
                style={{
                  opacity: Math.max(0, Math.min(1, (phase7 - i * 0.08) / 0.3)),
                  transform: `translateY(${10 - 10 * Math.max(0, Math.min(1, (phase7 - i * 0.08) / 0.3))}px)`,
                }}
              >
                <div className="w-[10px] h-[10px] rounded-full border border-[var(--g1)]/50 bg-[var(--g1)]/10" />
                <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]/70">
                  {name}
                </span>
              </div>
            ))}
          </div>

          {/* "6 verticales · 1 sistema" */}
          <div
            className="mt-10"
            style={{ opacity: phase8 }}
          >
            <span className="text-[11px] font-normal tracking-[5px] uppercase text-[var(--gy)]">
              6 verticales · 1 sistema
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
