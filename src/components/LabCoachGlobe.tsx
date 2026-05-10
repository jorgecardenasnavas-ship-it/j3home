"use client";

/* ──────────────────────────────────────────────
   LabCoachGlobe — globo 3D con países activos del Lab.

   Versión específica del bloque "Mensajes desde el laboratorio"
   en /lab/coach. Diferencias respecto al globo de tecnifibre:

   - Tamaño contenido (no full-screen)
   - Acepta prop `highlightedCountryId` para enfatizar un país
     concreto: el punto se hace más grande y el anillo brilla
     más fuerte. Sincroniza con el chat de testimonios.
   - Auto-rotate suave
   - Click sin efecto (decorativo)
   ────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { COACH_LOCATIONS, type CoachLocation } from "@/data/coach-locations";

interface LabCoachGlobeProps {
  /** Id del país a destacar (ej: "es", "it"). Si null, todos por igual. */
  highlightedCountryId?: string | null;
  /** Tamaño del contenedor en px. */
  size?: number;
}

export function LabCoachGlobe({ highlightedCountryId, size = 520 }: LabCoachGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  // Lazy initializer: en SSR es false, en cliente es true desde el primer render.
  const [mounted] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    if (!mounted) return;
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableZoom: boolean;
    };
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.45;
    controls.enableZoom = false;
    g.pointOfView({ lat: 25, lng: -10, altitude: 2.2 }, 0);
  }, [mounted]);

  // Cuando cambia el país destacado, suavemente apunta la cámara hacia él.
  useEffect(() => {
    if (!mounted) return;
    const g = globeRef.current;
    if (!g || !highlightedCountryId) return;
    const target = COACH_LOCATIONS.find((l) => l.id === highlightedCountryId);
    if (!target) return;
    g.pointOfView({ lat: target.lat, lng: target.lng, altitude: 2.0 }, 1800);
  }, [highlightedCountryId, mounted]);

  if (!mounted) {
    return (
      <div
        style={{ width: size, height: size }}
        className="flex items-center justify-center"
        aria-hidden
      >
        <div className="w-2 h-2 rounded-full bg-[var(--champan)] opacity-50 animate-pulse" />
      </div>
    );
  }

  // Función que devuelve un peso reforzado si el punto está destacado.
  const isHighlighted = (d: CoachLocation) => d.id === highlightedCountryId;

  return (
    <div
      style={{ width: size, height: size }}
      className="pointer-events-none"
      aria-hidden
    >
      <Globe
        ref={globeRef as React.MutableRefObject<GlobeMethods | undefined>}
        width={size}
        height={size}
        backgroundColor="rgba(14, 28, 22, 0)"
        showAtmosphere
        atmosphereColor="#C9A96E"
        atmosphereAltitude={0.18}
        showGlobe
        showGraticules={false}
        pointsData={COACH_LOCATIONS}
        pointLat={(d: object) => (d as CoachLocation).lat}
        pointLng={(d: object) => (d as CoachLocation).lng}
        pointColor={(d: object) =>
          isHighlighted(d as CoachLocation) ? "#F8F5EF" : "#C9A96E"
        }
        pointAltitude={(d: object) => {
          const loc = d as CoachLocation;
          const base = 0.02 + loc.size * 0.04;
          return isHighlighted(loc) ? base * 2.4 : base;
        }}
        pointRadius={(d: object) => {
          const loc = d as CoachLocation;
          const base = 0.4 + loc.size * 0.6;
          return isHighlighted(loc) ? base * 1.8 : base;
        }}
        ringsData={COACH_LOCATIONS}
        ringLat={(d: object) => (d as CoachLocation).lat}
        ringLng={(d: object) => (d as CoachLocation).lng}
        ringColor={(d: object) =>
          isHighlighted(d as CoachLocation) ? "#F8F5EF" : "#C9A96E"
        }
        ringMaxRadius={(d: object) => {
          const loc = d as CoachLocation;
          const base = 2 + loc.size * 3;
          return isHighlighted(loc) ? base * 1.8 : base;
        }}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={(d: object) =>
          isHighlighted(d as CoachLocation) ? 1100 : 2000
        }
      />
    </div>
  );
}
