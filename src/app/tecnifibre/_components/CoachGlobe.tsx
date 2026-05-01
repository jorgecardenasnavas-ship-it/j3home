"use client";

import { useEffect, useRef, useState } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { COACH_LOCATIONS, CoachLocation } from "../_data/coachLocations";

/**
 * Visualización 3D del globo para J3lab.
 * Auto-rotate lento, dots champán pulsantes (rings) en los países activos.
 */
export function CoachGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 800, h: 800 });

  useEffect(() => {
    const update = () => {
      setSize({ w: window.innerWidth, h: window.innerHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableZoom: boolean;
    };
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    g.pointOfView({ lat: 25, lng: -10, altitude: 2.4 }, 0);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <Globe
        ref={globeRef as React.MutableRefObject<GlobeMethods | undefined>}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(14, 28, 22, 0)"
        showAtmosphere
        atmosphereColor="#C9A96E"
        atmosphereAltitude={0.18}
        showGlobe
        showGraticules={false}
        pointsData={COACH_LOCATIONS}
        pointLat={(d: object) => (d as CoachLocation).lat}
        pointLng={(d: object) => (d as CoachLocation).lng}
        pointColor={() => "#C9A96E"}
        pointAltitude={(d: object) => 0.02 + (d as CoachLocation).size * 0.04}
        pointRadius={(d: object) => 0.4 + (d as CoachLocation).size * 0.6}
        ringsData={COACH_LOCATIONS}
        ringLat={(d: object) => (d as CoachLocation).lat}
        ringLng={(d: object) => (d as CoachLocation).lng}
        ringColor={() => "#C9A96E"}
        ringMaxRadius={(d: object) => 2 + (d as CoachLocation).size * 3}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={2000}
      />
    </div>
  );
}
