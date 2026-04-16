/* ──────────────────────────────────────────────
   geo.ts — utilidades de geolocalización.

   haversineKm:
     Distancia en km entre dos pares de coordenadas
     (lat, lng), usando la fórmula de Haversine sobre
     una esfera de radio 6371 km (Tierra media).

     No es exacta al metro (la Tierra no es una esfera
     perfecta), pero para "distancia a tu coach" con
     precisión de ±1 km en escala de cientos de km es
     sobrada. Mucho más barata que una Vincenty o
     una API externa.

   formatDistance:
     "a 45 km" — UX-friendly. <1 km muestra "<1 km"
     para no mostrar decimales raros ("0.3 km"). Por
     encima de 10 km redondea a entero.
   ────────────────────────────────────────────── */

export type LatLng = readonly [number, number];

const EARTH_RADIUS_KM = 6371;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Distancia en km entre dos puntos (fórmula de Haversine).
 * Orden de los args: [lat, lng] en ambos.
 */
export function haversineKm(a: LatLng, b: LatLng): number {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const sLat1 = Math.sin(dLat / 2);
  const sLng1 = Math.sin(dLng / 2);
  const h =
    sLat1 * sLat1 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * sLng1 * sLng1;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  return EARTH_RADIUS_KM * c;
}

/**
 * Formato humano de la distancia. Template puede ser
 * "a {km} km de ti" y reemplazamos {km}.
 */
export function formatDistance(km: number, template: string): string {
  let displayKm: string;
  if (km < 1) {
    displayKm = "<1";
  } else if (km < 10) {
    // Entre 1 y 10 km, un decimal ayuda a diferenciar "2.3" de "9.1"
    displayKm = km.toFixed(1);
  } else {
    displayKm = Math.round(km).toString();
  }
  return template.replace("{km}", displayKm);
}
