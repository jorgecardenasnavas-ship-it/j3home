"use client";

import { useEffect, useRef, useMemo } from "react";
import { COACHES } from "@/data/coaches";

const CHAMPAN = "#C9A96E";

export function HomeGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { points, arcs, rings } = useMemo(() => {
    const hq = COACHES.find((c) => c.type === "lab");
    const others = COACHES.filter((c) => {
      if (c.type === "lab") return false;
      const isCertified = !!c.certifiedAt && c.certificationActive !== false;
      const isInProgress = !!c.plusActive && !c.certifiedAt;
      return isCertified || isInProgress;
    });

    const hqLat = hq?.location.coordinates[0] ?? 36.73;
    const hqLng = hq?.location.coordinates[1] ?? -4.48;

    const pts = [
      { lat: hqLat, lng: hqLng, size: 0.55, color: CHAMPAN },
      ...others.map((c) => ({
        lat: c.location.coordinates[0],
        lng: c.location.coordinates[1],
        size: 0.28,
        color: CHAMPAN,
      })),
    ];

    const arcsData = hq
      ? others.map((c) => ({
          startLat: hqLat,
          startLng: hqLng,
          endLat: c.location.coordinates[0],
          endLng: c.location.coordinates[1],
        }))
      : [];

    // Pulsing rings at HQ
    const ringsData = [
      { lat: hqLat, lng: hqLng, maxR: 4, propagationSpeed: 0.8, repeatPeriod: 1800 },
      { lat: hqLat, lng: hqLng, maxR: 6, propagationSpeed: 0.6, repeatPeriod: 2400 },
    ];

    return { points: pts, arcs: arcsData, rings: ringsData };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let destroyed = false;

    import("globe.gl").then(({ default: Globe }) => {
      if (destroyed || !containerRef.current) return;

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      const globe = Globe()(containerRef.current)
        .width(w)
        .height(h)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .bumpImageUrl("//unpkg.com/three-globe/example/img/earth-topology.png")
        .showAtmosphere(true)
        .atmosphereColor("rgba(80,140,100,0.3)")
        .atmosphereAltitude(0.18)
        // Points
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointRadius("size")
        .pointAltitude(0.015)
        .pointsMerge(false)
        // Arcs — thicker, brighter
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => [`rgba(212,180,100,1)`, `rgba(201,169,110,0.05)`])
        .arcDashLength(0.3)
        .arcDashGap(0.12)
        .arcDashAnimateTime(2800)
        .arcStroke(1.4)
        .arcAltitudeAutoScale(0.4)
        // HQ pulsing rings
        .ringsData(rings)
        .ringLat("lat")
        .ringLng("lng")
        .ringColor(() => (t: number) => `rgba(201,169,110,${1 - t})`)
        .ringMaxRadius("maxR")
        .ringPropagationSpeed("propagationSpeed")
        .ringRepeatPeriod("repeatPeriod");

      // Controls
      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.22;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;

      // Closer + centered on Iberia
      globe.pointOfView({ lat: 38, lng: -2, altitude: 1.25 }, 0);

      const onResize = () => {
        if (!containerRef.current) return;
        globe
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      };
      window.addEventListener("resize", onResize);

      // Store cleanup
      (el as HTMLDivElement & { _globeCleanup?: () => void })._globeCleanup = () => {
        window.removeEventListener("resize", onResize);
        containerRef.current?.replaceChildren();
      };
    });

    return () => {
      destroyed = true;
      const cleanup = (el as HTMLDivElement & { _globeCleanup?: () => void })._globeCleanup;
      cleanup?.();
    };
  }, [points, arcs, rings]);

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={{
        right: "-8%",
        top: "-18%",
        width: "72%",
        height: "136%",
      }}
    />
  );
}
