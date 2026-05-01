"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChapterFrame } from "./ChapterFrame";

/**
 * Capítulo 1 — Hero. Saludo personal a Raúl a pantalla completa.
 * Estilo alineado con la web J3: logo wordmark champán arriba-izquierda,
 * logos Tecnifibre + Lacoste arriba-derecha (co-branding visual sin texto),
 * "Hola, Raúl." en serif italic crema, subtítulo concreto, ambient glow.
 */
export function HeroChapter() {
  const [revealed, setRevealed] = useState<[boolean, boolean, boolean]>([
    false,
    false,
    false,
  ]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timers = [400, 900, 1300].map((delay, i) =>
      setTimeout(() => {
        setRevealed((prev) => {
          const next: [boolean, boolean, boolean] = [...prev];
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

      {/* BOTTOM VIGNETTE — fundido suave de la foto al verde del bridge.
          Evita el corte brusco entre hero y bridge animation. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[28vh] z-[7] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, rgba(14,28,22,0.55) 55%, var(--bk) 100%)",
        }}
        aria-hidden
      />

      <div ref={sectionRef} className="relative z-10 flex flex-col flex-1">
        {/* Top header — J3 logo izquierda, T × L derecha (co-branding visual)
            En móvil reducido para no saturar el viewport estrecho. */}
        <header className="flex items-start justify-between gap-3 sm:gap-4">
          <div className="flex flex-col gap-[4px] sm:gap-[6px] shrink-0">
            <Image
              src="/images/logo-tecnifibre-hero.svg"
              alt="J3Pádel"
              width={156}
              height={50}
              priority
              className="h-[32px] sm:h-[48px] w-auto"
            />
            <span className="block w-[120px] sm:w-[180px] text-center text-[6.5px] sm:text-[9px] font-bold tracking-[1.5px] sm:tracking-[1.8px] uppercase text-[var(--g1)]/75">
              <span className="text-[#F8F5EF]">Play</span>{" "}
              <span className="opacity-50">·</span> Coach{" "}
              <span className="opacity-50">·</span> Manage
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-8 shrink-0">
            <div
              role="img"
              aria-label="Tecnifibre"
              className="h-[36px] sm:h-[88px] aspect-[1.81/1]"
              style={{
                backgroundColor: "#F8F5EF",
                WebkitMaskImage: "url(/images/j3/tecnifibre-transparent.png)",
                maskImage: "url(/images/j3/tecnifibre-transparent.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
            <span className="text-[var(--g1)]/55 text-[14px] sm:text-[24px] font-light">
              ×
            </span>
            <div
              role="img"
              aria-label="Lacoste"
              className="h-[40px] sm:h-[96px] aspect-square"
              style={{
                backgroundColor: "#F8F5EF",
                WebkitMaskImage: "url(/images/j3/lacoste-transparent.png)",
                maskImage: "url(/images/j3/lacoste-transparent.png)",
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            />
          </div>
        </header>

        {/* Center hero block — guiño a Lacoste + invitación personal */}
        <div className="flex-1 flex flex-col justify-center gap-8 max-w-4xl">
          <h1
            className="text-[clamp(44px,7vw,104px)] leading-[1.02] tracking-[-0.015em] italic normal-case"
            style={{
              fontFamily: "var(--font-serif)",
              color: "#E8DDD0",
              opacity: revealed[0] ? 1 : 0,
              transform: revealed[0] ? "none" : "translateY(28px)",
              filter: revealed[0] ? "blur(0)" : "blur(8px)",
              transition: "all 1.1s cubic-bezier(.16,1,.3,1)",
            }}
          >
            Padel is a beautiful sport.
          </h1>

          <p
            className="text-[clamp(32px,4.5vw,64px)] leading-[1.05] tracking-[-0.02em] italic normal-case font-light"
            style={{
              fontFamily: "var(--font-serif)",
              color: "var(--g1)",
              opacity: revealed[1] ? 1 : 0,
              transform: revealed[1] ? "none" : "translateY(16px)",
              transition: "all 1.2s cubic-bezier(.16,1,.3,1)",
            }}
          >
            ¿Lo jugamos en equipo?
          </p>
        </div>

      </div>

      {/* Chevrons J3 — mismo patrón que el hero del home, anclados al borde inferior */}
      <div
        aria-hidden
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[20] flex flex-col items-center gap-[2px] pointer-events-none"
        style={{
          opacity: revealed[2] ? 1 : 0,
          transition: "opacity 1.2s cubic-bezier(.16,1,.3,1) .2s",
        }}
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="22"
            height="11"
            viewBox="0 0 20 10"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{
              stroke: "#E8DDD0",
              animation: "j3ChevPulse 1.6s cubic-bezier(.4,0,.6,1) infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <path d="M2 2 L10 8 L18 2" />
          </svg>
        ))}
      </div>

      <style>{`
        @keyframes j3ChevPulse {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 1;    }
        }
      `}</style>
    </ChapterFrame>
  );
}
