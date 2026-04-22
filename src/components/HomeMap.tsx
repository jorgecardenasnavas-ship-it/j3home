"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { COACHES, type Coach } from "@/data/coaches";

/* ── Geometry helpers ── */

/** Quadratic-bezier points from start → end, arcing upward (consistent visual). */
function computeCurve(
  start: [number, number],
  end: [number, number],
  numPoints = 32,
): [number, number][] {
  const midLat = (start[0] + end[0]) / 2;
  const midLng = (start[1] + end[1]) / 2;
  const dLat = end[0] - start[0];
  const dLng = end[1] - start[1];
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  // Arc height scales with distance — short hops stay flat, long hops arc more.
  const offsetScale = 0.18;
  const ctrlLat = midLat + dist * offsetScale;
  const ctrlLng = midLng;

  const points: [number, number][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const lat =
      (1 - t) * (1 - t) * start[0] +
      2 * (1 - t) * t * ctrlLat +
      t * t * end[0];
    const lng =
      (1 - t) * (1 - t) * start[1] +
      2 * (1 - t) * t * ctrlLng +
      t * t * end[1];
    points.push([lat, lng]);
  }
  return points;
}

/** Euclidean latlng distance — good enough for sort order. */
function approxDistance(a: [number, number], b: [number, number]): number {
  const dLat = b[0] - a[0];
  const dLng = b[1] - a[1];
  return Math.sqrt(dLat * dLat + dLng * dLng);
}

/* ── Layer manager: runs inside MapContainer, has access to the map via useMap ── */

function MapLayers({
  hq,
  others,
  onDotHover,
}: {
  hq: Coach;
  others: Coach[];
  onDotHover: (slug: string | null) => void;
}) {
  const map = useMap();
  const router = useRouter();

  useEffect(() => {
    /* Sort coaches by distance from HQ — stagger order for animations. */
    const sortedOthers = [...others].sort(
      (a, b) =>
        approxDistance(hq.location.coordinates, a.location.coordinates) -
        approxDistance(hq.location.coordinates, b.location.coordinates),
    );

    /* Fit bounds to include HQ + all coaches */
    const bounds = L.latLngBounds(
      [hq, ...sortedOthers].map((c) => c.location.coordinates),
    );
    map.fitBounds(bounds, { padding: [60, 60], maxZoom: 6 });

    /* ── HQ pin ── */
    const hqIcon = L.divIcon({
      className: "home-map-hq",
      html: `
        <div class="home-map-hq-halo"></div>
        <div class="home-map-hq-pin"></div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });
    const hqMarker = L.marker(hq.location.coordinates, {
      icon: hqIcon,
      zIndexOffset: 1000,
    }).addTo(map);
    hqMarker.on("click", () => router.push("/academy"));

    /* ── Curves + dots (staggered reveal) ── */
    const curves: L.Polyline[] = [];
    const dots: L.Marker[] = [];
    const revealTimers: number[] = [];

    sortedOthers.forEach((c, i) => {
      // Curve
      const points = computeCurve(
        hq.location.coordinates,
        c.location.coordinates,
      );
      const pl = L.polyline(points, {
        color: "#dcaf64",
        weight: 1,
        opacity: 1, // CSS controls visibility via .home-map-curve rules
        interactive: false,
        className: `home-map-curve home-map-curve-${c.slug}`,
      }).addTo(map);
      curves.push(pl);

      // Dot
      const dotIcon = L.divIcon({
        className: "home-map-dot",
        html: `<div class="home-map-dot-inner"></div>`,
        iconSize: [10, 10],
        iconAnchor: [5, 5],
      });
      const dm = L.marker(c.location.coordinates, { icon: dotIcon }).addTo(map);

      // Pill content: verification badge + name + invitation + CTA to /academy#coach=slug
      const isVerified =
        !!c.mentorActive &&
        !!c.certifiedAt &&
        c.certificationActive !== false;
      const isQualified =
        !!c.certifiedAt &&
        c.certificationActive !== false &&
        !c.mentorActive;
      const badgeHtml = isVerified
        ? '<svg class="home-map-pill-badge" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#dcaf64"/><path d="M7.5 12.5l3 3 6-6" stroke="#0a0a0a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : isQualified
          ? '<svg class="home-map-pill-badge" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="#dcaf64" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#dcaf64"/></svg>'
          : "";
      const pillHtml = `
        <div class="home-map-pill">
          <div class="home-map-pill-header">
            <span class="home-map-pill-name">${c.name}</span>
            ${badgeHtml}
          </div>
          <p class="home-map-pill-question">¿Buscar coach por esta zona?</p>
          <a class="home-map-pill-cta" href="/academy#coach=${c.slug}">
            Sí, llévame
            <span class="home-map-pill-cta-arrow">→</span>
          </a>
        </div>
      `;
      dm.bindPopup(pillHtml, {
        closeButton: true,
        autoPan: false,
        keepInView: false,
        className: "home-map-pill-popup",
        offset: [0, -6],
      });

      // Double-click = shortcut directo (para quien ya entiende la mecánica).
      dm.on("dblclick", (e) => {
        L.DomEvent.stopPropagation(e);
        router.push(`/academy#coach=${c.slug}`);
      });

      dm.on("mouseover", () => onDotHover(c.slug));
      dm.on("mouseout", () => onDotHover(null));
      dots.push(dm);

      // Stagger reveal — 30ms between each, starts after 150ms initial delay
      const delay = 150 + i * 30;
      const t = window.setTimeout(() => {
        const curveEl = pl.getElement() as SVGPathElement | null;
        if (curveEl) curveEl.classList.add("in");
        const dotEl = dm.getElement();
        if (dotEl) dotEl.classList.add("in");
      }, delay);
      revealTimers.push(t);
    });

    /* ── HQ breathing — starts after all curves are drawn ── */
    const totalReveal = 150 + sortedOthers.length * 30 + 1000;
    const breatheTimer = window.setTimeout(() => {
      const hqEl = hqMarker.getElement();
      if (hqEl) hqEl.classList.add("breathing");
    }, totalReveal);

    return () => {
      revealTimers.forEach((t) => window.clearTimeout(t));
      window.clearTimeout(breatheTimer);
      curves.forEach((c) => map.removeLayer(c));
      dots.forEach((d) => map.removeLayer(d));
      map.removeLayer(hqMarker);
    };
  }, [map, hq, others, onDotHover, router]);

  return null;
}

/* ── Hover state propagator — toggles classes on map container ── */

function HoverState({ hoveredSlug }: { hoveredSlug: string | null }) {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    if (hoveredSlug) {
      container.classList.add("home-map-dim");
      const highlighted = container.querySelector<SVGPathElement>(
        `.home-map-curve-${hoveredSlug}`,
      );
      if (highlighted) highlighted.classList.add("home-map-highlighted");
      return () => {
        container.classList.remove("home-map-dim");
        if (highlighted) highlighted.classList.remove("home-map-highlighted");
      };
    }
  }, [map, hoveredSlug]);

  return null;
}

/* ── Public component ── */

export function HomeMap() {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

  const hq = useMemo(() => COACHES.find((c) => c.type === "lab"), []);
  const others = useMemo(() => COACHES.filter((c) => c.type !== "lab"), []);

  if (!hq) return null;

  return (
    <MapContainer
      center={hq.location.coordinates}
      zoom={5}
      scrollWheelZoom={false}
      style={{ width: "100%", height: "100%" }}
      zoomControl={false}
      attributionControl={false}
      worldCopyJump
    >
      <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
      <MapLayers hq={hq} others={others} onDotHover={setHoveredSlug} />
      <HoverState hoveredSlug={hoveredSlug} />
    </MapContainer>
  );
}
