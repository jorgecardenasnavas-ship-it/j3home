"use client";

import { useEffect, useMemo, useRef } from "react";
import { COACHES } from "@/data/coaches";

const CHAMPAN_BRIGHT = "rgba(240,210,130,1)";
const CHAMPAN = "rgba(201,169,110,1)";

/** Showcase points para la propuesta — refleja la ambición global de la red.
 *  Estos puntos son adicionales a los coaches reales y se muestran solo en
 *  el microsite Tecnifibre/Lacoste. */
const SHOWCASE_POINTS: Array<{ lat: number; lng: number }> = [
  // EE.UU.
  { lat: 40.7128, lng: -74.006 }, // Nueva York
  { lat: 25.7617, lng: -80.1918 }, // Miami
  { lat: 34.0522, lng: -118.2437 }, // Los Ángeles
  { lat: 41.8781, lng: -87.6298 }, // Chicago
  // Australia
  { lat: -33.8688, lng: 151.2093 }, // Sídney
  // Sudamérica
  { lat: -34.6037, lng: -58.3816 }, // Buenos Aires
  { lat: -23.5505, lng: -46.6333 }, // São Paulo
  { lat: -12.0464, lng: -77.0428 }, // Lima
  { lat: 4.711, lng: -74.0721 }, // Bogotá
];

/**
 * Globo 3D específico para el microsite Tecnifibre/Lacoste.
 * Basado en HomeGlobe pero añade puntos showcase en EE.UU., Australia y
 * Sudamérica para reflejar la ambición de cobertura global.
 */
export function TecnifibreGlobe() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { hqPoint, coachPoints, arcs, rings } = useMemo(() => {
    const hq = COACHES.find((c) => c.type === "lab");
    const others = COACHES.filter((c) => {
      if (c.type === "lab") return false;
      const isCertified = !!c.certifiedAt && c.certificationActive !== false;
      const isInProgress = !!c.plusActive && !c.certifiedAt;
      return isCertified || isInProgress;
    });

    const hqLat = hq?.location.coordinates[0] ?? 36.73;
    const hqLng = hq?.location.coordinates[1] ?? -4.48;

    const hqPt = { lat: hqLat, lng: hqLng, size: 0.6, color: CHAMPAN_BRIGHT };

    // Coach points reales + showcase points para extender la cobertura
    const realPts = others.map((c) => ({
      lat: c.location.coordinates[0],
      lng: c.location.coordinates[1],
      size: 0.28,
      color: CHAMPAN,
    }));
    const showcasePts = SHOWCASE_POINTS.map((p) => ({
      lat: p.lat,
      lng: p.lng,
      size: 0.28,
      color: CHAMPAN,
    }));
    const coPts = [...realPts, ...showcasePts];

    // Arcos desde HQ — ahora también a los showcase
    const seed = [1.0, 0.75, 1.3, 0.9, 1.15, 0.6, 1.4, 0.85, 1.1, 0.7];
    const allDestinations = [
      ...others.map((c) => ({
        endLat: c.location.coordinates[0],
        endLng: c.location.coordinates[1],
      })),
      ...SHOWCASE_POINTS.map((p) => ({ endLat: p.lat, endLng: p.lng })),
    ];
    const arcsData = hq
      ? allDestinations.map((d, i) => ({
          startLat: hqLat,
          startLng: hqLng,
          endLat: d.endLat,
          endLng: d.endLng,
          animateTime: Math.round(2400 * seed[i % seed.length]),
        }))
      : [];

    const ringsData = [
      {
        lat: hqLat,
        lng: hqLng,
        maxR: 4,
        propagationSpeed: 0.8,
        repeatPeriod: 1800,
      },
      {
        lat: hqLat,
        lng: hqLng,
        maxR: 7,
        propagationSpeed: 0.5,
        repeatPeriod: 2600,
      },
    ];

    return { hqPoint: hqPt, coachPoints: coPts, arcs: arcsData, rings: ringsData };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let destroyed = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    import("globe.gl").then(({ default: Globe }) => {
      if (destroyed || !containerRef.current) return;

      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const globe = (Globe as any)()(containerRef.current)
        .width(w)
        .height(h)
        .backgroundColor("rgba(0,0,0,0)")
        .globeImageUrl(
          "//unpkg.com/three-globe/example/img/earth-night.jpg",
        )
        .bumpImageUrl(
          "//unpkg.com/three-globe/example/img/earth-topology.png",
        )
        .showAtmosphere(true)
        .atmosphereColor("rgba(90,160,110,0.5)")
        .atmosphereAltitude(0.28)
        .pointsData([hqPoint])
        .pointLat("lat")
        .pointLng("lng")
        .pointColor("color")
        .pointRadius("size")
        .pointAltitude(0.015)
        .pointsMerge(false)
        .arcsData([])
        .arcStartLat("startLat")
        .arcStartLng("startLng")
        .arcEndLat("endLat")
        .arcEndLng("endLng")
        .arcColor(() => [`rgba(220,188,110,1)`, `rgba(201,169,110,0.04)`])
        .arcDashLength(0.3)
        .arcDashGap(0.12)
        .arcDashAnimateTime(
          (d: { animateTime: number }) => d.animateTime,
        )
        .arcStroke(0.5)
        .arcAltitudeAutoScale(0.4)
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
      // POV alejado — vista global completa para que se aprecien los puntos
      // de EE.UU., Sudamérica y Australia sin presión visual sobre el card.
      globe.pointOfView({ lat: 28, lng: -20, altitude: 2.1 }, 0);

      const onResize = () => {
        if (!containerRef.current) return;
        globe
          .width(containerRef.current.clientWidth)
          .height(containerRef.current.clientHeight);
      };
      window.addEventListener("resize", onResize);

      const observeTarget = el.closest("section") ?? el;
      let animationStarted = false;

      const startDotLineAnimation = () => {
        if (animationStarted || destroyed) return;
        animationStarted = true;

        const visiblePoints = [hqPoint];
        const POINT_DELAY = 600;
        const POINT_STEP = 30;

        coachPoints.forEach((pt, i) => {
          timers.push(
            setTimeout(() => {
              if (destroyed) return;
              visiblePoints.push(pt);
              globe.pointsData([...visiblePoints]);
            }, POINT_DELAY + i * POINT_STEP),
          );
        });

        const LINES_START = POINT_DELAY + coachPoints.length * POINT_STEP + 100;
        const LINE_STEP = 30;
        const visibleArcs: typeof arcs = [];

        arcs.forEach((arc, i) => {
          timers.push(
            setTimeout(() => {
              if (destroyed) return;
              visibleArcs.push(arc);
              globe.arcsData([...visibleArcs]);
            }, LINES_START + i * LINE_STEP),
          );
        });
      };

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startDotLineAnimation();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 },
      );
      observer.observe(observeTarget);

      (
        el as HTMLDivElement & { _globeCleanup?: () => void }
      )._globeCleanup = () => {
        window.removeEventListener("resize", onResize);
        observer.disconnect();
        timers.forEach(clearTimeout);
        containerRef.current?.replaceChildren();
      };
    });

    return () => {
      destroyed = true;
      timers.forEach(clearTimeout);
      (
        el as HTMLDivElement & { _globeCleanup?: () => void }
      )._globeCleanup?.();
    };
  }, [hqPoint, coachPoints, arcs, rings]);

  const isMobile =
    typeof window !== "undefined" && window.innerWidth <= 960;

  return (
    <div
      ref={containerRef}
      className="absolute"
      style={
        isMobile
          ? // Mobile: globo en la parte SUPERIOR (donde antes iba el bg image hero)
            // Centrado horizontal, ocupa los primeros ~55vh para coherencia con el resto de palancas
            { left: "-25%", top: "0", width: "150%", height: "55vh" }
          : { right: "-8%", top: "-18%", width: "72%", height: "136%" }
      }
    />
  );
}
