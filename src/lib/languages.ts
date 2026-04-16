/* ──────────────────────────────────────────────
   Language rendering helpers.
   El dataset guarda códigos ISO 639-1 ("es", "it"...).
   La UI los pinta con bandera + código en mayúsculas
   ("🇪🇸 ES") para que se reconozca de un vistazo en
   cualquier idioma que tenga puesto el usuario.
   ────────────────────────────────────────────── */

/**
 * Bandera por código de idioma. Convención: país origen
 * dominante del idioma (en → 🇬🇧, nl → 🇳🇱, etc.).
 * Fallback: 🌐 para códigos sin bandera registrada.
 */
export const LANGUAGE_FLAGS: Record<string, string> = {
  es: "🇪🇸",
  en: "🇬🇧",
  fr: "🇫🇷",
  it: "🇮🇹",
  pt: "🇵🇹",
  nl: "🇳🇱",
  sv: "🇸🇪",
  de: "🇩🇪",
  ar: "🇸🇦",
  ca: "🇪🇸",
  eu: "🇪🇸",
  gl: "🇪🇸",
};

/** "🇪🇸 ES" — formato estándar para chips y dropdowns. */
export function formatLanguage(code: string): string {
  const flag = LANGUAGE_FLAGS[code] ?? "🌐";
  return `${flag} ${code.toUpperCase()}`;
}

/** Solo la bandera, sin código — para chips muy compactos. */
export function languageFlag(code: string): string {
  return LANGUAGE_FLAGS[code] ?? "🌐";
}
