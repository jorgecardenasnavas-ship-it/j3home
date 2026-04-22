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

    /* ── Curves + dots (staggered reveal triggered on viewport enter) ── */
    const curves: L.Polyline[] = [];
    const dots: L.Marker[] = [];
    const revealTimers: number[] = [];
    const revealTargets: Array<{
      pl: L.Polyline | null;
      dm: L.Marker;
      idx: number;
    }> = [];

    sortedOthers.forEach((c, i) => {
      // Determine status: verified, qualified, plus — basic was already filtered out upstream
      const isVerified =
        !!c.mentorActive &&
        !!c.certifiedAt &&
        c.certificationActive !== false;
      const isQualified =
        !!c.certifiedAt &&
        c.certificationActive !== false &&
        !c.mentorActive;
      const isPlus = !!c.plusActive && !c.certifiedAt;
      const status: "verified" | "qualified" | "plus" = isVerified
        ? "verified"
        : isQualified
          ? "qualified"
          : "plus";

      // Curve — only for established connections (verified + qualified). Plus
      // coaches show as hollow dots without lines (still in progress).
      let pl: L.Polyline | null = null;
      if (status !== "plus") {
        const points = computeCurve(
          hq.location.coordinates,
          c.location.coordinates,
        );
        pl = L.polyline(points, {
          color: "#dcaf64",
          weight: 1,
          opacity: 1, // CSS controls visibility via .home-map-curve rules
          interactive: false,
          className: `home-map-curve home-map-curve-${c.slug}`,
        }).addTo(map);
        curves.push(pl);
      }

      // Dot — styled per status
      const dotIcon = L.divIcon({
        className: `home-map-dot home-map-dot--${status}`,
        html: `<div class="home-map-dot-inner"></div>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });
      const dm = L.marker(c.location.coordinates, { icon: dotIcon }).addTo(map);

      // Click: detecta si hay otros coaches cercanos (misma zona visual).
      // Si sí → pill agregada "N coaches en [Ciudad]". Si no → pill individual.
      // Pixel-distance en el zoom actual: así se adapta automáticamente cuando
      // el usuario hace zoom (a más zoom, pines separados → pill individual).
      const ZONE_RADIUS_PX = 30;
      const badgeHtml = isVerified
        ? '<svg class="home-map-pill-badge" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><circle cx="12" cy="12" r="12" fill="#dcaf64"/><path d="M7.5 12.5l3 3 6-6" stroke="#0a0a0a" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : isQualified
          ? '<svg class="home-map-pill-badge" viewBox="0 0 24 24" width="11" height="11" aria-hidden="true"><circle cx="12" cy="12" r="10" fill="none" stroke="#dcaf64" stroke-width="2.5"/><circle cx="12" cy="12" r="4" fill="#dcaf64"/></svg>'
          : "";

      dm.on("click", () => {
        const clickedPoint = map.latLngToContainerPoint(c.location.coordinates);
        const nearbyCount = sortedOthers.reduce((count, other) => {
          if (other.slug === c.slug) return count;
          const p = map.latLngToContainerPoint(other.location.coordinates);
          const dx = p.x - clickedPoint.x;
          const dy = p.y - clickedPoint.y;
          if (Math.sqrt(dx * dx + dy * dy) <= ZONE_RADIUS_PX) return count + 1;
          return count;
        }, 0);

        const html =
          nearbyCount > 0
            ? `
              <div class="home-map-pill home-map-pill-zone">
                <div class="home-map-pill-header">
                  <span class="home-map-pill-name">${nearbyCount + 1} coaches en ${c.location.city}</span>
                </div>
                <p class="home-map-pill-question">Explora esta zona en el buscador detallado.</p>
                <a class="home-map-pill-cta" href="/academy#coach=${c.slug}">
                  Abrir mapa completo
                  <span class="home-map-pill-cta-arrow">→</span>
                </a>
              </div>
            `
            : `
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

        L.popup({
          closeButton: true,
          autoPan: false,
          keepInView: false,
          className: "home-map-pill-popup",
          offset: [0, -6],
        })
          .setLatLng(c.location.coordinates)
          .setContent(html)
          .openOn(map);
      });

      // Double-click = shortcut directo (para quien ya entiende la mecánica).
      dm.on("dblclick", (e) => {
        L.DomEvent.stopPropagation(e);
        router.push(`/academy#coach=${c.slug}`);
      });

      dm.on("mouseover", () => onDotHover(c.slug));
      dm.on("mouseout", () => onDotHover(null));
      dots.push(dm);

      // Store reveal target (fired later via IntersectionObserver)
      revealTargets.push({ pl, dm, idx: i });
    });

    /* ── Defer the stagger until the section enters the viewport ──
     * Map layers are created on mount (so they're ready the moment the user
     * scrolls there), but the animated reveal only kicks off when the map
     * is actually visible. Prevents the animation from finishing silently
     * while the user is still looking at the hero.
     */
    const container = map.getContainer();
    let revealed = false;

    const triggerReveal = () => {
      if (revealed) return;
      revealed = true;
      revealTargets.forEach(({ pl, dm, idx }) => {
        const delay = 150 + idx * 30;
        const t = window.setTimeout(() => {
          if (pl) {
            const curveEl = pl.getElement() as SVGPathElement | null;
            if (curveEl) curveEl.classList.add("in");
          }
          const dotEl = dm.getElement();
          if (dotEl) dotEl.classList.add("in");
        }, delay);
        revealTimers.push(t);
      });
      // HQ breathing starts after all the items have finished drawing
      const breatheDelay = 150 + revealTargets.length * 30 + 1000;
      const breatheT = window.setTimeout(() => {
        const hqEl = hqMarker.getElement();
        if (hqEl) hqEl.classList.add("breathing");
      }, breatheDelay);
      revealTimers.push(breatheT);
    };

    /* Trigger only when the section is squarely in focus:
     * rootMargin shrinks the effective viewport by 20% top & bottom,
     * so the map must overlap the CENTER 60% of the screen before firing.
     * Threshold 0.5 means at least half the (clipped) container must hit
     * that center band. Result: on page load the section is above the
     * band (below the hero), so nothing fires until the user scrolls into it.
     */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            triggerReveal();
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.5,
        rootMargin: "-20% 0px -20% 0px",
      },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      revealTimers.forEach((t) => window.clearTimeout(t));
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
  /* Filter out:
   *  - HQ (rendered separately with its own pin)
   *  - Basic coaches (no certification, no plusActive): invisible per spec
   * Show:
   *  - Verified (mentorActive + cert + certActive)
   *  - Qualified (cert + certActive, no mentor)
   *  - Plus active (plusActive, no cert) — as "in-progress" hollow dots
   */
  const others = useMemo(
    () =>
      COACHES.filter((c) => {
        if (c.type === "lab") return false;
        const isCertified =
          !!c.certifiedAt && c.certificationActive !== false;
        const isInProgress = !!c.plusActive && !c.certifiedAt;
        return isCertified || isInProgress;
      }),
    [],
  );

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
