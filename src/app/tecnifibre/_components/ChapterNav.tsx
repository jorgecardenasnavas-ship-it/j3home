"use client";

interface ChapterNavProps {
  current: number;
  total: number;
}

/**
 * Indicador de progreso compartido por todos los capítulos.
 * Estilo coherente con eyebrows de la marca J3 (champán + tracking generoso).
 */
export function ChapterNav({ current, total }: ChapterNavProps) {
  return (
    <div className="flex items-center justify-between text-[10px] font-medium tracking-[2.5px] uppercase text-[var(--wh)]/55">
      <div className="inline-flex items-center gap-[6px]">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className="block h-[2px] w-[20px] transition-colors"
            style={{
              background:
                i < current ? "var(--g1)" : "rgba(248, 245, 239, 0.18)",
              transitionDuration: "600ms",
              transitionTimingFunction: "cubic-bezier(.16,1,.3,1)",
            }}
          />
        ))}
      </div>
      <span className="tabular-nums tracking-[3px]">
        {String(current).padStart(2, "0")}
        <span className="opacity-40 mx-[3px]">/</span>
        {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
