"use client";

import { useEffect, useRef, useState } from "react";
import { ChapterFrame } from "./ChapterFrame";
import { ChapterNav } from "./ChapterNav";

/**
 * Capítulo 1 — Hero. Saludo personal a Raúl a pantalla completa.
 * Estilo alineado con la web J3: eyebrows champán, serif italic íntimo,
 * crema cálida #E8DDD0, ambient glow, reveal en cascada.
 */
export function HeroChapter() {
  const [revealed, setRevealed] = useState<[boolean, boolean, boolean, boolean]>([
    false,
    false,
    false,
    false,
  ]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Stagger reveal: eyebrow → headline → subtitle → bottom controls
    const timers = [200, 600, 1100, 1500].map((delay, i) =>
      setTimeout(() => {
        setRevealed((prev) => {
          const next: [boolean, boolean, boolean, boolean] = [...prev];
          next[i] = true;
          return next;
        });
      }, delay),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <ChapterFrame index={1} total={5} bgImage="/images/hero.jpeg">
      {/* Overlay verde profundo para contraste */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(14, 28, 22, 0.78) 0%, rgba(27, 61, 47, 0.55) 60%, rgba(14, 28, 22, 0.7) 100%)",
        }}
        aria-hidden
      />

      {/* Ambient radial glow champán */}
      <div
        className="absolute inset-0 z-[6] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 30% 50%, rgba(201,169,110,0.10) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      <div ref={sectionRef} className="relative z-10 flex flex-col flex-1">
        {/* Top labels — estilo eyebrow J3 */}
        <header className="flex items-center justify-between gap-4">
          <span className="text-[10px] font-bold tracking-[5px] uppercase text-[var(--g1)]">
            J3PÁDEL
          </span>
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] text-right">
            Para Raúl <span className="opacity-50">·</span> Tecnifibre × Lacoste
          </span>
        </header>

        {/* Center hero block */}
        <div className="flex-1 flex flex-col justify-center gap-6 max-w-3xl">
          <span
            className="text-[10px] font-bold tracking-[5px] uppercase text-[var(--g1)] block"
            style={{
              opacity: revealed[0] ? 1 : 0,
              transform: revealed[0] ? "none" : "translateY(8px)",
              transition: "all .9s cubic-bezier(.16,1,.3,1)",
            }}
          >
            — Una propuesta privada —
          </span>

          <h1
            className="text-[clamp(56px,9vw,128px)] leading-[0.92] tracking-[-0.02em] italic normal-case"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#E8DDD0",
              opacity: revealed[1] ? 1 : 0,
              transform: revealed[1] ? "none" : "translateY(28px)",
              filter: revealed[1] ? "blur(0)" : "blur(8px)",
              transition: "all 1.1s cubic-bezier(.16,1,.3,1)",
            }}
          >
            Hola, Raúl.
          </h1>

          <p
            className="text-[clamp(18px,2vw,24px)] leading-[1.45] text-[var(--wh)]/80 max-w-xl font-light"
            style={{
              opacity: revealed[2] ? 1 : 0,
              transform: revealed[2] ? "none" : "translateY(16px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1)",
            }}
          >
            Lo que podemos construir juntos.
          </p>
        </div>

        {/* Bottom — progress + scroll hint */}
        <footer
          className="flex items-end justify-between gap-4"
          style={{
            opacity: revealed[3] ? 1 : 0,
            transform: revealed[3] ? "none" : "translateY(12px)",
            transition: "all .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <ChapterNav current={1} total={5} />
          <div className="inline-flex items-center gap-[10px] text-[10px] font-bold tracking-[3px] uppercase text-[var(--wh)]/60">
            <span>Desliza</span>
            <span
              className="w-[5px] h-[5px] rounded-full"
              style={{
                background: "var(--g1)",
                animation: "j3HeroPulse 2.4s cubic-bezier(.16,1,.3,1) infinite",
              }}
            />
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes j3HeroPulse {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.4); }
        }
      `}</style>
    </ChapterFrame>
  );
}
