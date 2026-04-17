"use client";

/* ──────────────────────────────────────────────
   FilterSelect — dropdown compacto con estética J3.
   Usado por /academy (sección Red J3) y /academy/coaches.
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
}

export function FilterSelect({ label, value, onChange, options, compact = false }: FilterSelectProps & { compact?: boolean }) {
  if (compact) {
    return (
      <label
        className="inline-flex items-center gap-1.5 bg-black/60 backdrop-blur-[12px] border border-white/[.1] px-2.5 py-[6px] rounded-full hover:border-[var(--g1)]/40 transition-colors duration-300 cursor-pointer"
      >
        <span className="text-[8px] font-bold tracking-[1.5px] uppercase text-[var(--g1)]">
          {label}
        </span>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-transparent border-none outline-none text-[11px] font-medium cursor-pointer"
          style={{ color: "var(--wh)" }}
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
      className="inline-flex items-center gap-2 border theme-border px-3 py-2 hover:border-[var(--g1)]/40 transition-colors duration-300"
      style={{ borderRadius: 2 }}
    >
      <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none text-[12px] font-medium cursor-pointer"
        style={{ color: "var(--wh)" }}
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
