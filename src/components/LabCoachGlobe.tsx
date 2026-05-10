"use client";

/* ──────────────────────────────────────────────
   LabCoachGlobe — globo 3D del Lab Coach.

   Diferencias respecto al globo de tecnifibre:

   - Carga un GeoJSON de países (Natural Earth 110m) y los renderiza
     como polígonos con paleta J3:
       · Mundo base → verde oscuro semi-transparente
       · Países donde hay coaches del Lab → champán resaltado
       · País destacado (highlightedCountryId) → champán brillante + borde
   - Anillos pulsantes y puntos sobre los países activos para reforzar.
   - Sin atmósfera azul ni texturas tipo NASA — identidad J3 100%.
   - Acepta prop `highlightedCountryId` para sincronizar con el chat.
   - Auto-rotate suave + camera tween hacia el país destacado.
   ────────────────────────────────────────────── */

import { useEffect, useMemo, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import * as THREE from "three";
import { COACH_LOCATIONS, type CoachLocation } from "@/data/coach-locations";

interface LabCoachGlobeProps {
  /** Id del país a destacar (ej: "es", "it"). Si null, todos los países activos por igual. */
  highlightedCountryId?: string | null;
  /** Tamaño del contenedor en px. */
  size?: number;
}

/* ─── Tipos GeoJSON minimalistas ─── */
interface CountryFeature {
  type: "Feature";
  properties: {
    ISO_A2?: string;
    ISO_A2_EH?: string;
    ADM0_A3?: string;
    NAME?: string;
    [key: string]: unknown;
  };
  geometry: unknown;
}

interface WorldGeoJson {
  type: "FeatureCollection";
  features: CountryFeature[];
}

/* Set de IDs de países activos del Lab — para coloreado rápido. */
const ACTIVE_COUNTRY_IDS = new Set(COACH_LOCATIONS.map((l) => l.id));

/* Devuelve el id ISO-2 lowercase del feature, normalizando los varios
   campos que usa Natural Earth (ISO_A2, ISO_A2_EH, ADM0_A3 fallback). */
function getFeatureId(f: CountryFeature): string | null {
  const a2 = f.properties.ISO_A2 ?? f.properties.ISO_A2_EH;
  if (a2 && a2 !== "-99") return a2.toLowerCase();
  return null;
}

export function LabCoachGlobe({ highlightedCountryId, size = 520 }: LabCoachGlobeProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  // Lazy initializer: evita el primer render en SSR.
  const [mounted] = useState(() => typeof window !== "undefined");
  const [countries, setCountries] = useState<CountryFeature[]>([]);

  /* Material custom para la esfera base del globo: verde negro J3 mate.
     Reemplaza el color azul/negro por defecto. */
  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color("#0E1C16"),     // negro verdoso J3
      emissive: new THREE.Color("#1B3D2F"),  // verde J3 sutil para que no quede plano
      emissiveIntensity: 0.18,
      shininess: 4,
    });
  }, []);

  /* Carga del GeoJSON (servido desde /public/data/world.geojson). */
  useEffect(() => {
    if (!mounted) return;
    let aborted = false;
    fetch("/data/world.geojson")
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("geojson fetch failed"))))
      .then((data: WorldGeoJson) => {
        if (aborted) return;
        // Filtramos la Antártida — distrae visualmente y no aporta.
        const filtered = data.features.filter(
          (f) => f.properties.ADM0_A3 !== "ATA" && f.properties.NAME !== "Antarctica",
        );
        setCountries(filtered);
      })
      .catch(() => {
        // Silencioso: si falla el fetch, el globo se queda con los puntos.
      });
    return () => {
      aborted = true;
    };
  }, [mounted]);

  /* Configuración inicial del globo. */
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

  /* Tween de cámara al país destacado. */
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

  /* Helpers de color por país (función pasada a react-globe.gl). */
  const polygonCapColor = (d: object) => {
    const id = getFeatureId(d as CountryFeature);
    if (id && id === highlightedCountryId) return "rgba(248,245,239,0.55)"; // crema brillante
    if (id && ACTIVE_COUNTRY_IDS.has(id)) return "rgba(201,169,110,0.32)"; // champán medio
    return "rgba(27,61,47,0.55)"; // verde oscuro J3 base
  };

  const polygonSideColor = (d: object) => {
    const id = getFeatureId(d as CountryFeature);
    if (id && id === highlightedCountryId) return "rgba(201,169,110,0.50)";
    if (id && ACTIVE_COUNTRY_IDS.has(id)) return "rgba(201,169,110,0.18)";
    return "rgba(14,28,22,0.30)";
  };

  const polygonStrokeColor = () => "rgba(248,245,239,0.10)";

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
        // Color base del globo (océano) — verde negro J3 mate identitario.
        globeMaterial={globeMaterial}
        polygonsData={countries}
        polygonAltitude={(d: object) => {
          const id = getFeatureId(d as CountryFeature);
          if (id && id === highlightedCountryId) return 0.012;
          if (id && ACTIVE_COUNTRY_IDS.has(id)) return 0.008;
          return 0.005;
        }}
        polygonCapColor={polygonCapColor}
        polygonSideColor={polygonSideColor}
        polygonStrokeColor={polygonStrokeColor}
        polygonsTransitionDuration={400}
        pointsData={COACH_LOCATIONS}
        pointLat={(d: object) => (d as CoachLocation).lat}
        pointLng={(d: object) => (d as CoachLocation).lng}
        pointColor={(d: object) =>
          isHighlighted(d as CoachLocation) ? "#F8F5EF" : "#C9A96E"
        }
        pointAltitude={(d: object) => {
          const loc = d as CoachLocation;
          const base = 0.015 + loc.size * 0.025;
          return isHighlighted(loc) ? base * 2.4 : base;
        }}
        pointRadius={(d: object) => {
          const loc = d as CoachLocation;
          const base = 0.35 + loc.size * 0.45;
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
