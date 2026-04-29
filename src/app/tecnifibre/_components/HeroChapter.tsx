"use client";

import { ChapterFrame } from "./ChapterFrame";
import { ChapterNav } from "./ChapterNav";

/**
 * Capítulo 1 — Hero. Saludo personal a Raul a pantalla completa.
 * Triple personalización: etiqueta arriba derecha + título + contexto.
 */
export function HeroChapter() {
  return (
    <ChapterFrame
      index={1}
      total={5}
      bgImage="/images/hero.jpeg"
      className="bg-[#0E1C16]"
    >
      {/* Overlay verde para contraste de texto */}
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(14, 28, 22, 0.7), rgba(27, 61, 47, 0.45))",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col flex-1">
        <header className="flex items-center justify-between gap-4 text-[11px] tracking-[3px] uppercase text-[#C9A96E]/85">
          <span>J3PÁDEL</span>
          <span className="text-right">
            Para Raul · Tecnifibre × Lacoste
          </span>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-5 max-w-3xl">
          <span className="text-[12px] tracking-[3px] uppercase text-[#C9A96E]/85">
            — Una propuesta privada —
          </span>
          <h1 className="font-serif font-light text-[64px] sm:text-[88px] lg:text-[112px] leading-[1] tracking-[-0.02em] text-[#F8F5EF]">
            Hola, Raul.
          </h1>
          <p className="font-light text-[18px] sm:text-[22px] leading-[1.4] text-[#F8F5EF]/85 max-w-xl">
            Lo que podemos construir juntos.
          </p>
        </div>

        <footer className="flex items-end justify-between gap-4">
          <ChapterNav current={1} total={5} />
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[1px] uppercase text-[#F8F5EF]/70">
            <span>Desliza</span>
            <span className="w-[6px] h-[6px] rounded-full bg-[#C9A96E] animate-pulse" />
          </div>
        </footer>
      </div>
    </ChapterFrame>
  );
}
