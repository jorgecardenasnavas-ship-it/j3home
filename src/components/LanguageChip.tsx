"use client";

/* ──────────────────────────────────────────────
   LanguageChip — bandera SVG + código ISO del idioma.
   Usa country-flag-icons (SVGs inline reales) porque
   los emojis de bandera Unicode no se renderizan en
   Windows/Chrome.

   Pre-importamos las 9 banderas que usamos (ES, GB,
   FR, IT, PT, NL, SE, DE, SA). Si aparece un idioma
   sin bandera registrada, el chip pinta solo el código.
   ────────────────────────────────────────────── */

import ES from "country-flag-icons/react/3x2/ES";
import GB from "country-flag-icons/react/3x2/GB";
import FR from "country-flag-icons/react/3x2/FR";
import IT from "country-flag-icons/react/3x2/IT";
import PT from "country-flag-icons/react/3x2/PT";
import NL from "country-flag-icons/react/3x2/NL";
import SE from "country-flag-icons/react/3x2/SE";
import DE from "country-flag-icons/react/3x2/DE";
import SA from "country-flag-icons/react/3x2/SA";
import { languageCountry, languageLabel } from "@/lib/languages";

type FlagComponent = React.ComponentType<{ title?: string; className?: string; style?: React.CSSProperties }>;

const FLAGS: Record<string, FlagComponent> = {
  ES, GB, FR, IT, PT, NL, SE, DE, SA,
};

export interface LanguageChipProps {
  /** Código de idioma ISO 639-1 (ej: "es", "en", "nl") */
  code: string;
  /** Estilo del chip: "card" (para CoachCard) o "popup" (para popup del mapa) */
  variant?: "card" | "popup";
}

/**
 * Renderiza un chip compacto con bandera SVG + código del idioma.
 * La bandera proviene de country-flag-icons (SVG inline).
 */
export function LanguageChip({ code, variant = "card" }: LanguageChipProps) {
  const countryCode = languageCountry(code);
  const Flag = countryCode ? FLAGS[countryCode] : undefined;

  if (variant === "popup") {
    // Estilo inline (popup del mapa). Sin border/bg para que no compita
    // con las pills — solo la bandera y el código en minúsculas.
    return (
      <span
        style={{
          fontSize: 10,
          letterSpacing: 0.5,
          color: "rgba(245,240,232,0.7)",
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          lineHeight: 1,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {Flag ? (
          <Flag
            style={{ width: 14, height: 10, display: "block", borderRadius: 1 }}
            title={countryCode ?? undefined}
          />
        ) : null}
        <span>{code.toUpperCase()}</span>
      </span>
    );
  }

  // Variant "card" — usa clases Tailwind para integrarse con CoachCard
  return (
    <span
      className="text-[10px] font-semibold tracking-[0.5px] theme-text opacity-70 border theme-border px-1.5 py-0.5 inline-flex items-center gap-1"
      style={{ borderRadius: 2 }}
    >
      {Flag ? (
        <Flag
          style={{ width: 14, height: 10, display: "block", borderRadius: 1 }}
          title={countryCode ?? undefined}
        />
      ) : null}
      <span>{languageLabel(code)}</span>
    </span>
  );
}
