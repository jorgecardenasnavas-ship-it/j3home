"use client";

/* ──────────────────────────────────────────────
   FilterChips — set de botones-chip para filtros de pocas opciones.
   Alternativa al FilterSelect cuando el número de opciones es pequeño
   (≤6) y queremos tap directo en lugar de abrir dropdown.

   Casos de uso típicos: specialty (4+1 options), idioma primario,
   rango de precio, etc. Para más opciones, FilterSelect sigue siendo
   preferible (no saturar visualmente).

   Estética J3: chip activo = fill gold + texto negro bold. Chip
   inactivo = borde sutil + texto white. Transición suave al toggle.
   ────────────────────────────────────────────── */

export interface FilterChipsOption {
  value: string;
  label: string;
}

export interface FilterChipsProps {
  /** Eyebrow arriba del set de chips. Ej: "Especialidad". */
  label: string;
  /** Valor seleccionado. Debe coincidir con una de las `options[].value`. */
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterChipsOption[];
}

export function FilterChips({ label, value, onChange, options }: FilterChipsProps) {
  return (
    <div className="inline-flex flex-wrap items-center gap-2 max-[960px]:gap-1.5">
      <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)] shrink-0">
        {label}
      </span>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={isActive}
            className="px-3 py-[7px] max-[960px]:px-2.5 max-[960px]:py-[5px] text-[11px] max-[960px]:text-[10.5px] font-bold tracking-[0.5px] transition-all duration-300"
            style={{
              borderRadius: 2,
              /* Chip activa: gradient gold lleno, texto negro — destaca como
                 una "selección" sin ambigüedad. Inactiva: borde sutil con
                 hover que sube al gold.  */
              background: isActive
                ? "#C9A96E"
                : "transparent",
              color: isActive ? "#0a0a0a" : "var(--wh)",
              border: `1px solid ${isActive ? "var(--g1)" : "rgba(255,255,255,0.15)"}`,
              boxShadow: isActive
                ? "0 2px 10px rgba(201,169,110,0.25)"
                : "none",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "rgba(201,169,110,0.5)";
                e.currentTarget.style.color = "var(--g1)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.color = "var(--wh)";
              }
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
