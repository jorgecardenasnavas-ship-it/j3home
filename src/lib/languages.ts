/* ──────────────────────────────────────────────
   Language rendering helpers.
   El dataset guarda códigos ISO 639-1 ("es", "it"...).
   La UI los pinta con bandera SVG + código ("ES"/"IT")
   en chips. Los dropdowns HTML nativos no permiten SVG
   dentro de <option>, así que ahí va solo el código.

   Usamos `country-flag-icons` para SVGs de banderas
   reales — los emojis de bandera Unicode NO se
   renderizan en Windows/Chrome (Microsoft los pinta
   como pares de letras), así que confiar en el emoji
   flag no funciona multiplataforma.
   ────────────────────────────────────────────── */

/**
 * Mapa de código de idioma ISO 639-1 → código de país ISO 3166-1 alpha-2
 * para elegir qué bandera mostrar. Convención: país origen del idioma.
 * - en → GB (convención: bandera británica para inglés)
 * - sv → SE (Suecia)
 * - ar → SA (Arabia Saudí)
 * - ca/eu/gl → ES (no hay bandera ISO; usamos España)
 */
export const LANGUAGE_TO_COUNTRY: Record<string, string> = {
  es: "ES",
  en: "GB",
  fr: "FR",
  it: "IT",
  pt: "PT",
  nl: "NL",
  sv: "SE",
  de: "DE",
  ar: "SA",
  ca: "ES",
  eu: "ES",
  gl: "ES",
};

/** Código de país ISO alpha-2 correspondiente al idioma. `null` si no hay. */
export function languageCountry(code: string): string | null {
  return LANGUAGE_TO_COUNTRY[code] ?? null;
}

/** Solo el código del idioma en mayúsculas — para los dropdowns `<select>`. */
export function languageLabel(code: string): string {
  return code.toUpperCase();
}
