"use client";

interface ChapterNavProps {
  current: number;
  total: number;
}

/**
 * Indicador de progreso compartido por todos los capítulos.
 * Pips a la izquierda + contador "XX / 05" a la derecha.
 */
export function ChapterNav({ current, total }: ChapterNavProps) {
  return (
    <div className="flex items-center justify-between text-[11px] tracking-[2px] uppercase text-[#F8F5EF]/55">
      <div className="inline-flex gap-[6px]">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`block h-[2px] w-[18px] transition-colors duration-500 ${
              i < current ? "bg-[#C9A96E]" : "bg-[#F8F5EF]/25"
            }`}
          />
        ))}
      </div>
      <span>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
