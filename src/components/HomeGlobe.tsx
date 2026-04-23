"use client";

import { useEffect, useRef, useMemo } from "react";
import { COACHES } from "@/data/coaches";

const CHAMPAN = "#C9A96E";
const HQ_COORDS = { lat: 36.73, lng: -4.48 };

export function HomeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { points, arcs } = useMemo(() => {
    const hq = COACHES.find((c) => c.type === "lab");
    const others = COACHES.filter((c) => {
      if (c.type === "lab") return false;
      const isCertified = !!c.certifiedAt && c.certificationActive !== false;
      const isInProgress = !!c.plusActive && !c.certifiedAt;
      return isCertified || isInProgress;
    });

    const pts = [
      ...(hq ? [{ lat: hq.location.coordinates[0], lng: hq.location.coordinates[1], size: 0.7, color: CHAMPAN }] : []),
      ...others.map((c) => ({ lat: c.location.coordinates[0], lng: c.location.coordinates[1], size: 0.25, color: CHAMPAN })),
    ];

    const arcsData = (hq ? others : []).map((c) => ({
      startLat: hq!.location.coordinates[0],
      startLng: hq!.location.coordinates[1],
      endLat: c.location.coordinates[0],
      endLng: c.location.coordinates[1],
    }));

    return { points: pts, arcs: arcsData };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let globe: ReturnType<typeof import("globe.gl")["default"]> | null = null;
    let destroyed = false;

    import("globe.gl").then(({ default: Globe }) => {
      if (destroyed || !containerRef.current) return;

      globe = Globe()(containerRef.current)
        .width(containerRef.current.clientWidth)
        .height(containerRef.current.clientHeight)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("rgba(100,160,120,0.25)")
        .atmosphereAltitude(0.15)
        // Points
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointRadius("size")
        .pointAltitude(0.01)
        .pointsMerge(false)
        // Arcs
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => [`rgba(201,169,110,0.9)`, `rgba(201,169,110,0.1)`])
        .arcDashLength(0.35)
        .arcDashGap(0.15)
        .arcDashAnimateTime(3500)
        .arcStroke(0.4)
        .arcAltitudeAutoScale(0.35);

      // Auto-rotate
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.25;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;

      // Start centered on Iberia
      globe.pointOfView({ lat: HQ_COORDS.lat, lng: HQ_COORDS.lng, altitude: 1.8 }, 0);

      // Resize handler
      const onResize = () => {
        if (!containerRef.current || !globe) return;
        globe.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight);
      };
      window.addEventListener("resize", onResize);

      (globe as unknown as { _cleanup?: () => void })._cleanup = () => {
        window.removeEventListener("resize", onResize);
      };
    });

    return () => {
      destroyed = true;
      if (globe) {
        const g = globe as unknown as { _cleanup?: () => void; _destructor?: () => void };
        g._cleanup?.();
        g._destructor?.();
        containerRef.current?.replaceChildren();
      }
    };
  }, [points, arcs]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ background: "transparent" }}
    />
  );
}
