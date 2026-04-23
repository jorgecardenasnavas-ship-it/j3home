"use client";

/* ──────────────────────────────────────────────
   FilterSelect — dropdown con estética J3.
   Usado por /academy (sección Red J3) y /academy/coaches.

   Dos variantes:
   - compact: pill redondeada con fondo dark blur, para flotar sobre el mapa.
   - default: caja con borde, integrada en la sección de filtros.

   Ambas soportan `isActive` — cuando true, el dropdown adopta estilo
   gold (border + tint + texto) para comunicar visualmente que tiene
   un valor seleccionado distinto al default.
   ────────────────────────────────────────────── */

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
  /** Cuando true, el filtro adopta estilo gold (tiene valor != default). */
  isActive?: boolean;
}

export function FilterSelect({ label, value, onChange, options, compact = false, isActive = false }: FilterSelectProps & { compact?: boolean }) {
  if (compact) {
    return (
      <label
        className="inline-flex items-center gap-1.5 backdrop-blur-[16px] px-2.5 py-[6px] rounded-full shadow-[0_2px_12px_rgba(0,0,0,.5)] transition-all duration-300 cursor-pointer"
        style={{
          background: isActive ? "rgba(201,169,110,0.14)" : "rgba(26,26,28,0.9)",
          border: `1px solid ${isActive ? "rgba(201,169,110,0.6)" : "rgba(255,255,255,0.15)"}`,
        }}
      >
        <span className="text-[8px] font-bold tracking-[1.5px] uppercase text-[var(--g1)]">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none text-[11px] font-medium cursor-pointer"
          style={{ color: isActive ? "var(--g1)" : "var(--wh)" }}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value} style={{ background: "#0a0a0a", color: "#f5f0e8" }}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <label
      className="inline-flex items-center gap-2 px-3 py-2 transition-all duration-300 relative"
      style={{
        borderRadius: 2,
        border: `1px solid ${isActive ? "var(--g1)" : "rgba(255,255,255,0.12)"}`,
        background: isActive ? "rgba(201,169,110,0.08)" : "transparent",
        boxShadow: isActive ? "0 0 0 1px rgba(201,169,110,0.25)" : "none",
      }}
    >
      <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none text-[12px] font-medium cursor-pointer appearance-none pr-5"
        style={{
          color: isActive ? "var(--g1)" : "var(--wh)",
          fontWeight: isActive ? 700 : 500,
        }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: "#0a0a0a", color: "#f5f0e8" }}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Chevron propio — reemplaza el nativo del OS para consistencia visual */}
      <svg
        aria-hidden
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="absolute right-2.5 pointer-events-none"
        style={{ color: "var(--g1)", opacity: isActive ? 0.95 : 0.6 }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </label>
  );
}
