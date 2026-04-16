"use client";

/* ──────────────────────────────────────────────
   GeoContext — comparte la geolocalización del
   usuario entre todas las secciones de /academy
   (hero, grid, futuras secciones).

   Por qué un context y no `useUserLocation` en cada
   sección: las peticiones a navigator.geolocation
   dan resultados diferentes si se piden a la vez
   (el navegador puede mostrar dos prompts, cache
   warm vs cold). Además, cuando el usuario pulsa
   "Cerca de mí" en la NetworkSection, queremos que
   el mapa del hero se recentre. Un único estado
   compartido es la solución limpia.

   Uso:
     <GeoProvider>
       <HeroSection />
       <NetworkSection />
     </GeoProvider>

     // En cualquier descendiente:
     const { coords, status, errorKind, request, clear } = useGeo();

   Si un consumer se monta fuera del Provider, el
   hook lanza — así detectamos faltas de wrap temprano.
   ────────────────────────────────────────────── */

import { createContext, useContext, type ReactNode } from "react";
import {
  useUserLocation,
  type UseUserLocationResult,
} from "@/hooks/useUserLocation";

const GeoContext = createContext<UseUserLocationResult | null>(null);

export function GeoProvider({ children }: { children: ReactNode }) {
  // Una sola instancia del hook para toda la subtree.
  const value = useUserLocation();
  return <GeoContext.Provider value={value}>{children}</GeoContext.Provider>;
}

export function useGeo(): UseUserLocationResult {
  const ctx = useContext(GeoContext);
  if (!ctx) {
    throw new Error(
      "useGeo must be used within a <GeoProvider>. Wrap the subtree that needs geolocation.",
    );
  }
  return ctx;
}
