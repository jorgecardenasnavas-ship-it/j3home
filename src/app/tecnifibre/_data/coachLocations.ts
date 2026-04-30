export interface CoachLocation {
  name: string;
  lat: number;
  lng: number;
  size: number; // peso visual 0..1
}

/**
 * Países donde Coach360 tiene entrenadores activos. Posiciones aproximadas.
 * Tamaño según densidad estimada — Jorge puede ajustar.
 */
export const COACH_LOCATIONS: CoachLocation[] = [
  { name: "España", lat: 40.4168, lng: -3.7038, size: 1.0 },
  { name: "Italia", lat: 41.9028, lng: 12.4964, size: 0.7 },
  { name: "Portugal", lat: 38.7223, lng: -9.1393, size: 0.6 },
  { name: "Francia", lat: 48.8566, lng: 2.3522, size: 0.6 },
  { name: "Argentina", lat: -34.6037, lng: -58.3816, size: 0.7 },
  { name: "México", lat: 19.4326, lng: -99.1332, size: 0.5 },
  { name: "Brasil", lat: -23.5505, lng: -46.6333, size: 0.5 },
  { name: "Estados Unidos", lat: 25.7617, lng: -80.1918, size: 0.5 },
  { name: "Suecia", lat: 59.3293, lng: 18.0686, size: 0.4 },
  { name: "Países Bajos", lat: 52.3676, lng: 4.9041, size: 0.4 },
  { name: "Bélgica", lat: 50.8503, lng: 4.3517, size: 0.3 },
];
