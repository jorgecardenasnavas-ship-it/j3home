"use client";

/* ──────────────────────────────────────────────
   useUserLocation — hook para pedir/gestionar
   la geolocalización del navegador.

   Estados:
     idle     → no se ha pedido todavía
     loading  → esperando la respuesta del navegador
     success  → tenemos [lat, lng]
     error    → el usuario denegó o el navegador falló

   API:
     request()  → dispara la petición (pide permiso)
     clear()    → vuelve a idle (el usuario quita el filtro)
     coords     → [lat, lng] | null
     status     → el estado actual
     errorKind  → "denied" | "unavailable" | "timeout" | null

   Nota UX: solo se pide al hacer click en el botón,
   nunca automáticamente al entrar en la página.
   Ningún usuario quiere que le pidan ubicación al aterrizar.
   ────────────────────────────────────────────── */

import { useCallback, useRef, useState } from "react";
import type { LatLng } from "@/lib/geo";

export type GeoStatus = "idle" | "loading" | "success" | "error";
export type GeoErrorKind = "denied" | "unavailable" | "timeout" | null;

export interface UseUserLocationResult {
  coords: LatLng | null;
  status: GeoStatus;
  errorKind: GeoErrorKind;
  request: () => void;
  clear: () => void;
}

export function useUserLocation(): UseUserLocationResult {
  const [coords, setCoords] = useState<LatLng | null>(null);
  const [status, setStatus] = useState<GeoStatus>("idle");
  const [errorKind, setErrorKind] = useState<GeoErrorKind>(null);
  const pendingRef = useRef(false);

  const request = useCallback(() => {
    if (pendingRef.current) return;
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setStatus("error");
      setErrorKind("unavailable");
      return;
    }
    pendingRef.current = true;
    setStatus("loading");
    setErrorKind(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pendingRef.current = false;
        setCoords([pos.coords.latitude, pos.coords.longitude]);
        setStatus("success");
      },
      (err) => {
        pendingRef.current = false;
        setStatus("error");
        // err.code: 1=PERMISSION_DENIED, 2=POSITION_UNAVAILABLE, 3=TIMEOUT
        setErrorKind(
          err.code === 1 ? "denied" : err.code === 3 ? "timeout" : "unavailable",
        );
      },
      {
        // 10 s es razonable. En móvil con GPS frío puede tardar.
        timeout: 10000,
        // Aceptamos una cached position de hasta 5 min — no necesitamos
        // precisión callejera para "tu coach a 45 km".
        maximumAge: 5 * 60 * 1000,
        // Baja precisión = más rápido + ahorra batería. Nos vale sobrado.
        enableHighAccuracy: false,
      },
    );
  }, []);

  const clear = useCallback(() => {
    setCoords(null);
    setStatus("idle");
    setErrorKind(null);
  }, []);

  return { coords, status, errorKind, request, clear };
}
