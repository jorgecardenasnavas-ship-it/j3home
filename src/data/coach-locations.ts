/* ──────────────────────────────────────────────
   Países donde J3 Lab Coach tiene entrenadores activos.

   Posiciones aproximadas (capitales o ciudad principal).
   El campo `id` es ISO-639 simplificado para sincronizar con
   los testimonios del chat (ver MensajesLaboratorio.tsx).
   El `size` representa peso visual relativo (densidad estimada).
   ────────────────────────────────────────────── */

export interface CoachLocation {
  id: string;       // "es" | "it" | "pt" | "fr" | "ar" | "mx" | "br" | "us" | "se" | "nl" | "be"
  name: string;
  lat: number;
  lng: number;
  size: number;     // 0..1
  flag: string;     // emoji bandera
}

export const COACH_LOCATIONS: CoachLocation[] = [
  { id: "es", name: "España",         lat: 40.4168, lng:  -3.7038, size: 1.0, flag: "🇪🇸" },
  { id: "it", name: "Italia",         lat: 41.9028, lng:  12.4964, size: 0.7, flag: "🇮🇹" },
  { id: "pt", name: "Portugal",       lat: 38.7223, lng:  -9.1393, size: 0.6, flag: "🇵🇹" },
  { id: "fr", name: "Francia",        lat: 48.8566, lng:   2.3522, size: 0.6, flag: "🇫🇷" },
  { id: "ar", name: "Argentina",      lat: -34.6037, lng: -58.3816, size: 0.7, flag: "🇦🇷" },
  { id: "mx", name: "México",         lat: 19.4326, lng: -99.1332, size: 0.5, flag: "🇲🇽" },
  { id: "br", name: "Brasil",         lat: -23.5505, lng: -46.6333, size: 0.5, flag: "🇧🇷" },
  { id: "us", name: "Estados Unidos", lat: 25.7617, lng: -80.1918, size: 0.5, flag: "🇺🇸" },
  { id: "se", name: "Suecia",         lat: 59.3293, lng:  18.0686, size: 0.4, flag: "🇸🇪" },
  { id: "nl", name: "Países Bajos",   lat: 52.3676, lng:   4.9041, size: 0.4, flag: "🇳🇱" },
  { id: "be", name: "Bélgica",        lat: 50.8503, lng:   4.3517, size: 0.3, flag: "🇧🇪" },
];

export const TOTAL_COUNTRIES = COACH_LOCATIONS.length;
