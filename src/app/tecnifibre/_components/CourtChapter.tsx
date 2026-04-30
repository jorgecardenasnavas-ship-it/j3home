"use client";

import { useEffect, useRef, useState } from "react";

const clamp = (v: number) => Math.max(0, Math.min(1, v));

/**
 * Paso C — La pista de pádel scroll-driven.
 * Aparece tras el manifiesto. Crece de una línea fina a un rectángulo completo,
 * con las 6 líneas internas dibujándose en orden con stagger.
 *
 * Fondo crema continuo del manifiesto. Inner sticky 100dvh, sección 200dvh
 * para tener 100dvh de scroll que driving la animación.
 */
export function CourtChapter() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 960);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const update = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const sectionTopAbs = rect.top + window.scrollY;
      const scrolledIntoSection = window.scrollY - sectionTopAbs;
      // Progress: 0 cuando section top toca viewport top.
      // 1 cuando hemos scrolleado 1 viewport (sticky termina su recorrido útil).
      const t = clamp(scrolledIntoSection / vh);
      setProgress(t);
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ─── Animación por fases ───
  // Fase 1 (0→0.30): Box aparece como línea fina, crece en ancho
  // Fase 2 (0.30→0.60): Box se expande verticalmente
  // Fase 3 (0.60→1.0): Las 6 líneas se dibujan con stagger

  const phase1 = clamp(progress / 0.3); // 0→1 en 0-30%
  const phase2 = clamp((progress - 0.3) / 0.3); // 0→1 en 30-60%
  const phase3 = clamp((progress - 0.6) / 0.4); // 0→1 en 60-100%

  // Tamaño del box
  const boxW = isMobile ? Math.min(280, 260) : 460;
  const boxH = isMobile ? boxW * 1.8 : boxW * 0.5;

  // Width: empieza a crecer en fase 1, completa en fase 2
  const currentW = boxW * (0.05 + 0.95 * phase1);
  // Height: empieza en 2px (línea fina), crece en fase 2 hasta H final
  const currentH = 2 + (boxH - 2) * phase2;

  // Stagger delays para las 6 líneas (orden en que se dibujan)
  const lineDelays = [0.0, 0.08, 0.18, 0.28, 0.4, 0.5];
  const lineLengths = [584, 96, 96, 96, 62, 62];
  const drawProgress = (i: number) => clamp((phase3 - lineDelays[i]) / 0.35);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--wh)]"
      style={{ minHeight: "200dvh" }}
    >
      <div className="sticky top-0 h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        {/* Court box — crece de línea fina a rectángulo */}
        <div
          className="relative flex items-center justify-center overflow-hidden"
          style={{
            width: `${currentW}px`,
            height: `${currentH}px`,
            background: "var(--bk)",
            transition: "none",
          }}
        >
          {/* Court SVG — solo visible cuando el box ya tiene tamaño suficiente */}
          {phase2 > 0.4 && (
            <svg
              viewBox="0 0 200 100"
              fill="none"
              preserveAspectRatio="none"
              className={`absolute inset-0 w-full h-full ${isMobile ? "rotate-90" : ""}`}
            >
              {[
                <rect
                  key="rect"
                  x="2"
                  y="2"
                  width="196"
                  height="96"
                  fill="none"
                  stroke="var(--g1)"
                  strokeWidth={isMobile ? 1.5 : 1.2}
                />,
                <line key="lc" x1="100" y1="2" x2="100" y2="98" stroke="var(--g1)" strokeWidth={isMobile ? 1.5 : 1.2} />,
                <line key="ll" x1="38" y1="2" x2="38" y2="98" stroke="var(--g1)" strokeWidth={isMobile ? 1.5 : 1.2} />,
                <line key="lr" x1="162" y1="2" x2="162" y2="98" stroke="var(--g1)" strokeWidth={isMobile ? 1.5 : 1.2} />,
                <line key="hl" x1="38" y1="50" x2="100" y2="50" stroke="var(--g1)" strokeWidth={isMobile ? 1.5 : 1.2} />,
                <line key="hr" x1="100" y1="50" x2="162" y2="50" stroke="var(--g1)" strokeWidth={isMobile ? 1.5 : 1.2} />,
              ].map((el, i) => {
                const len = lineLengths[i];
                const dp = drawProgress(i);
                const dashoffset = len * (1 - dp);
                return (
                  <g
                    key={i}
                    style={{
                      strokeDasharray: len,
                      strokeDashoffset: dashoffset,
                    }}
                  >
                    {el}
                  </g>
                );
              })}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
