"use client";

import { useEffect, useRef, useMemo } from "react";
import { COACHES } from "@/data/coaches";

const CHAMPAN_BRIGHT = "rgba(240,210,130,1)";
const CHAMPAN       = "rgba(201,169,110,1)";
const CHAMPAN_DIM   = "rgba(180,148,90,1)";

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
      { lat: hqLat, lng: hqLng, size: 0.6, color: CHAMPAN_BRIGHT },
      ...others.map((c) => ({
        lat: c.location.coordinates[0],
        lng: c.location.coordinates[1],
        size: 0.28,
        color: CHAMPAN,
      })),
    ];

    // Arcos con velocidades variadas — más orgánico
    const seed = [1.0, 0.75, 1.3, 0.9, 1.15, 0.6, 1.4, 0.85, 1.1, 0.7];
    const arcsData = hq
      ? others.map((c, i) => ({
          startLat: hqLat,
          startLng: hqLng,
          endLat: c.location.coordinates[0],
          endLng: c.location.coordinates[1],
          animateTime: Math.round(2400 * (seed[i % seed.length])),
        }))
      : [];

    // Anillos HQ
    const ringsData = [
      { lat: hqLat, lng: hqLng, maxR: 4, propagationSpeed: 0.8, repeatPeriod: 1800 },
      { lat: hqLat, lng: hqLng, maxR: 7, propagationSpeed: 0.5, repeatPeriod: 2600 },
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
        .atmosphereColor("rgba(90,160,110,0.5)")
        .atmosphereAltitude(0.28)
        // Puntos con jerarquía
        .pointsData(points)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointRadius("size")
        .pointAltitude(0.015)
        .pointsMerge(false)
        // Arcos con velocidades distintas
        .arcsData(arcs)
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => [`rgba(220,188,110,1)`, `rgba(201,169,110,0.04)`])
        .arcDashLength(0.3)
        .arcDashGap(0.12)
        .arcDashAnimateTime((d: { animateTime: number }) => d.animateTime)
        .arcStroke(0.5)
        .arcAltitudeAutoScale(0.4)
        // Anillos HQ
        .ringsData(rings)
        .ringLat("lat")
        .ringLng("lng")
        .ringColor(() => (t: number) => `rgba(201,169,110,${1 - t})`)
        .ringMaxRadius("maxR")
        .ringPropagationSpeed("propagationSpeed")
        .ringRepeatPeriod("repeatPeriod");

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.22;
      globe.controls().enableZoom = false;
      globe.controls().enablePan = false;
      globe.pointOfView({ lat: 38, lng: -2, altitude: 1.25 }, 0);

      const onResize = () => {
        if (!containerRef.current) return;
        globe.width(containerRef.current.clientWidth).height(containerRef.current.clientHeight);
      };
      window.addEventListener("resize", onResize);

      (el as HTMLDivElement & { _globeCleanup?: () => void })._globeCleanup = () => {
        window.removeEventListener("resize", onResize);
        containerRef.current?.replaceChildren();
      };
    });

    return () => {
      destroyed = true;
      (el as HTMLDivElement & { _globeCleanup?: () => void })._globeCleanup?.();
    };
  }, [points, arcs, rings]);

  const isMobile = typeof window !== "undefined" && window.innerWidth <= 960;

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={
        isMobile
          ? { left: "-25%", bottom: "-12%", width: "150%", height: "80%" }
          : { right: "-8%", top: "-18%", width: "72%", height: "136%" }
      }
    />
  );
}
