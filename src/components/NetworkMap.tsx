"use client";

/* ──────────────────────────────────────────────
   NetworkMap — Leaflet + OpenStreetMap + clustering.
   Solo se carga en el cliente (dynamic import
   con ssr:false desde la página).

   Clustering: leaflet.markercluster. A zoom bajo los
   pines cercanos se agrupan en un círculo dorado con
   el número de coaches dentro. Click en un cluster →
   zoom automático al bound; si al zoom máximo siguen
   pisándose (misma coord), el spiderfy despliega los
   pines en forma de estrella.

   Popup: renderToStaticMarkup convierte el JSX a HTML
   estático que se bindea al marker. Los handlers
   interactivos ("Pregunta a J3") se resuelven con
   event delegation sobre el contenedor del mapa,
   usando data-attributes.

   3 tipos visuales de marker:
   - lab      → Málaga. Grande, halo pulsante.
   - academy  → Franquicia. Medio, borde distintivo.
   - coach    → Recomendado individual. Sobrio.
   ────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet.markercluster"; // side-effect: registra L.markerClusterGroup
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { Coach } from "@/data/coaches";
import { LanguageChip } from "@/components/LanguageChip";

const pinStyles = `
  .j3-pin {
    background: transparent !important;
    border: none !important;
  }
  .j3-pin-inner {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: radial-gradient(circle at 50% 50%, rgba(220,175,100,0.95), rgba(220,175,100,0.55) 60%, rgba(220,175,100,0) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 4px 16px rgba(220,175,100,0.4);
    transition: transform .3s cubic-bezier(.16,1,.3,1);
  }
  .j3-pin-inner::after {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 999px;
    background: #0a0a0a;
    border: 1px solid rgba(220,175,100,0.9);
  }
  .j3-pin-inner:hover {
    transform: scale(1.2);
  }
  .j3-pin-lab {
    width: 48px;
    height: 48px;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.6), 0 6px 28px rgba(220,175,100,0.75);
  }
  .j3-pin-lab::after {
    inset: 10px;
  }
  .j3-pin-lab::before {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 999px;
    border: 1px solid rgba(220,175,100,0.4);
    animation: j3PulseRing 2.4s ease-out infinite;
  }
  .j3-pin-academy {
    width: 36px;
    height: 36px;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 5px 20px rgba(220,175,100,0.55);
  }
  .j3-pin-academy::after {
    inset: 7px;
  }
  @keyframes j3PulseRing {
    0%   { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.9); opacity: 0; }
  }
  .leaflet-popup-content-wrapper {
    background: #0a0a0a !important;
    color: #f5f0e8 !important;
    border: 1px solid rgba(220,175,100,0.25);
    border-radius: 2px !important;
    box-shadow: 0 10px 40px rgba(0,0,0,0.6) !important;
    padding: 0 !important;
  }
  .leaflet-popup-content {
    margin: 14px 16px !important;
    font-family: inherit;
    line-height: 1.4;
  }
  .leaflet-popup-tip {
    background: #0a0a0a !important;
    border-left: 1px solid rgba(220,175,100,0.25);
    border-bottom: 1px solid rgba(220,175,100,0.25);
  }
  .leaflet-container {
    background: #0f0f0f;
    font-family: inherit;
  }
  .leaflet-control-attribution {
    background: rgba(10,10,10,0.7) !important;
    color: rgba(245,240,232,0.5) !important;
    font-size: 10px !important;
  }
  .leaflet-control-attribution a {
    color: rgba(220,175,100,0.75) !important;
  }
  /* Controles de zoom (+/-) con estética J3 dark+gold */
  .leaflet-control-zoom {
    border: 1px solid rgba(220,175,100,0.3) !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4) !important;
    border-radius: 2px !important;
    overflow: hidden !important;
  }
  .leaflet-control-zoom a {
    background: rgba(10,10,10,0.9) !important;
    color: #dcaf64 !important;
    border: none !important;
    border-bottom: 1px solid rgba(220,175,100,0.15) !important;
    font-size: 18px !important;
    font-weight: 300 !important;
    width: 32px !important;
    height: 32px !important;
    line-height: 32px !important;
    transition: background 0.2s ease, color 0.2s ease !important;
  }
  .leaflet-control-zoom a:last-child {
    border-bottom: none !important;
  }
  .leaflet-control-zoom a:hover {
    background: rgba(220,175,100,0.12) !important;
    color: #f0c478 !important;
  }
  .leaflet-control-zoom a.leaflet-disabled {
    opacity: 0.35 !important;
    cursor: not-allowed !important;
  }

  /* ── Clusters (leaflet.markercluster) ── */
  .j3-cluster {
    background: transparent !important;
    border: none !important;
  }
  .j3-cluster-inner {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    color: #0a0a0a;
    font-weight: 800;
    letter-spacing: -0.5px;
    font-variant-numeric: tabular-nums;
    background: radial-gradient(circle at 50% 50%, #f0c478 0%, #dcaf64 55%, #b8943e 100%);
    transition: transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s ease;
    cursor: pointer;
  }
  .j3-cluster-inner::after {
    content: "";
    position: absolute;
    inset: -3px;
    border-radius: 999px;
    border: 1px solid rgba(220,175,100,0.55);
    pointer-events: none;
  }
  .j3-cluster-inner:hover {
    transform: scale(1.08);
  }
  .j3-cluster-sm {
    width: 32px;
    height: 32px;
    font-size: 13px;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 3px 14px rgba(220,175,100,0.45);
  }
  .j3-cluster-md {
    width: 40px;
    height: 40px;
    font-size: 15px;
    box-shadow: 0 0 0 2px rgba(0,0,0,0.6), 0 5px 20px rgba(220,175,100,0.6);
  }
  .j3-cluster-lg {
    width: 52px;
    height: 52px;
    font-size: 17px;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.65), 0 7px 28px rgba(220,175,100,0.75);
  }
  .j3-cluster-lg::before {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 999px;
    border: 1px solid rgba(220,175,100,0.4);
    animation: j3PulseRing 2.6s ease-out infinite;
    pointer-events: none;
  }
  /* Spiderfy: líneas doradas suaves */
  .leaflet-cluster-spider-leg {
    stroke: rgba(220,175,100,0.55) !important;
    stroke-width: 1.2 !important;
    stroke-opacity: 0.8 !important;
  }
`;

function resolveKind(c: Coach): "lab" | "academy" | "coach" {
  if (c.type) return c.type;
  // Retrocompat: si no hay type, usamos tier para decidir.
  if (c.tier === "hq") return "lab";
  return "coach";
}

function makeIcon(kind: "lab" | "academy" | "coach"): L.DivIcon {
  const sizes = { lab: 48, academy: 36, coach: 28 } as const;
  const modifier = kind === "lab" ? " j3-pin-lab" : kind === "academy" ? " j3-pin-academy" : "";
  const size = sizes[kind];
  return L.divIcon({
    className: "j3-pin",
    html: `<div class="j3-pin-inner${modifier}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

interface PopupLabels {
  badgeHq: string;
  badgeRecommended: string;
  askChatbot: string;
}

/**
 * Componente puro de popup — se renderiza a HTML estático
 * con renderToStaticMarkup y se bindea al marker. Los
 * handlers interactivos se conectan por event delegation
 * (data-j3-ask-slug para "Pregunta a J3"; IG y Web son
 * anchors nativos con target=_blank).
 */
function PopupContent({
  coach: c,
  labels,
  kind,
}: {
  coach: Coach;
  labels: PopupLabels;
  kind: "lab" | "academy" | "coach";
}) {
  const initials = c.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return (
    <div style={{ minWidth: 220 }}>
      {/* Header: foto + nombre + tier */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
        {c.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.photo}
            alt=""
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              objectFit: "cover",
              border: kind !== "coach" ? "2px solid #dcaf64" : "1px solid rgba(220,175,100,0.3)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              background: "rgba(220,175,100,0.08)",
              border: "1px solid rgba(220,175,100,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              fontWeight: 700,
              color: "#dcaf64",
              letterSpacing: 1,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#dcaf64",
              marginBottom: 2,
            }}
          >
            {kind === "lab" || kind === "academy" ? labels.badgeHq : labels.badgeRecommended}
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.15, marginBottom: 2 }}>
            {c.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            {c.location.city}, {c.location.country}
          </div>
        </div>
      </div>

      {/* Clubs */}
      {c.clubs && c.clubs.length > 0 && (
        <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
          {c.clubs.slice(0, 2).join(" · ")}
        </div>
      )}

      {/* Idiomas */}
      {c.languages && c.languages.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
          {c.languages.map((l) => (
            <LanguageChip key={l} code={l} variant="popup" />
          ))}
        </div>
      )}

      {/* Especialidades — chips dorados suaves */}
      {c.specialties && c.specialties.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {c.specialties.map((s) => {
            const lbl = s === "juniors" ? "Juniors" : s === "adultos" ? "Adultos" : "Competición";
            return (
              <span
                key={s}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  fontSize: 9,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  fontWeight: 600,
                  color: "#dcaf64",
                  background: "rgba(220,175,100,0.08)",
                  border: "1px solid rgba(220,175,100,0.25)",
                  padding: "2px 6px",
                  borderRadius: 2,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: 3,
                    height: 3,
                    borderRadius: 999,
                    background: "#dcaf64",
                  }}
                />
                {lbl}
              </span>
            );
          })}
        </div>
      )}

      {/* CTA principal + iconos sociales (IG, Web)
          El botón "Pregunta a J3" usa data-j3-ask-slug para event delegation
          (no podemos poner onClick porque el HTML está serializado). */}
      <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
        <button
          type="button"
          data-j3-ask-slug={c.slug}
          style={{
            flex: 1,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 2,
            textTransform: "uppercase",
            color: "#000",
            background: "linear-gradient(135deg, #dcaf64, #b8943e)",
            border: "none",
            padding: "8px 12px",
            cursor: "pointer",
            borderRadius: 2,
          }}
        >
          {labels.askChatbot}
        </button>
        {c.socials?.instagram && (
          <a
            href={c.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram de ${c.name}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              background: "rgba(220,175,100,0.08)",
              border: "1px solid rgba(220,175,100,0.35)",
              color: "#dcaf64",
              borderRadius: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        )}
        {c.socials?.web && (
          <a
            href={c.socials.web}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Web de ${c.name}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 34,
              background: "rgba(220,175,100,0.08)",
              border: "1px solid rgba(220,175,100,0.35)",
              color: "#dcaf64",
              borderRadius: 2,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}

/**
 * Radio (px) de agrupación del cluster. 60px agrupa coaches
 * que en pantalla están a menos de esa distancia — probado
 * para no ser agresivo a zoom medio pero juntar los duplicados
 * reales (misma ciudad) a zoom continental.
 */
const MAX_CLUSTER_RADIUS = 60;

/**
 * iconCreateFunction — el cluster se pinta como círculo dorado
 * con el conteo dentro. Tres tamaños según cantidad:
 *   sm (2-4) · md (5-9) · lg (10+, con halo pulsante).
 */
function makeClusterIcon(count: number): L.DivIcon {
  const size = count < 5 ? "sm" : count < 10 ? "md" : "lg";
  const px = size === "sm" ? 32 : size === "md" ? 40 : 52;
  return L.divIcon({
    className: "j3-cluster",
    html: `<div class="j3-cluster-inner j3-cluster-${size}"><span>${count}</span></div>`,
    iconSize: [px, px],
    iconAnchor: [px / 2, px / 2],
  });
}

/**
 * ClusteredMarkers — crea y gestiona el markerClusterGroup.
 * Escucha el evento global `j3:map:focus` para centrar + abrir
 * popup de un coach concreto (sustituye al antiguo MapFocusListener).
 *
 * El botón "Pregunta a J3" del popup se resuelve por event
 * delegation sobre el contenedor del mapa (data-j3-ask-slug).
 */
function ClusteredMarkers({
  coaches,
  labels,
  onAsk,
}: {
  coaches: readonly Coach[];
  labels: PopupLabels;
  onAsk?: (coach: Coach) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const group = L.markerClusterGroup({
      maxClusterRadius: MAX_CLUSTER_RADIUS,
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      zoomToBoundsOnClick: true,
      animate: true,
      animateAddingMarkers: false,
      iconCreateFunction: (cluster) => makeClusterIcon(cluster.getChildCount()),
    });

    // slug → marker, para j3:map:focus
    const markerBySlug = new Map<string, L.Marker>();

    coaches.forEach((c) => {
      const kind = resolveKind(c);
      const popupHtml = renderToStaticMarkup(
        <PopupContent coach={c} labels={labels} kind={kind} />
      );
      const m = L.marker(c.location.coordinates, { icon: makeIcon(kind) });
      m.bindPopup(popupHtml, { maxWidth: 280, minWidth: 240 });
      group.addLayer(m);
      markerBySlug.set(c.slug, m);
    });

    map.addLayer(group);

    // Event delegation para el botón "Pregunta a J3"
    const container = map.getContainer();
    const onContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const askBtn = target.closest("[data-j3-ask-slug]") as HTMLElement | null;
      if (!askBtn) return;
      const slug = askBtn.getAttribute("data-j3-ask-slug");
      if (!slug) return;
      const coach = coaches.find((c) => c.slug === slug);
      if (!coach) return;
      if (onAsk) {
        onAsk(coach);
        return;
      }
      window.dispatchEvent(
        new CustomEvent("j3:chat:open", {
          detail: {
            coachName: coach.name,
            coachLocation: `${coach.location.city}, ${coach.location.country}`,
          },
        }),
      );
    };
    container.addEventListener("click", onContainerClick);

    // j3:map:focus — centrar y abrir popup del coach indicado
    const onFocus = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (!slug) return;
      const marker = markerBySlug.get(slug);
      if (!marker) return;
      // zoomToShowLayer: hace zoom al nivel donde el marker deja
      // de estar agrupado, luego abre el popup.
      group.zoomToShowLayer(marker, () => {
        marker.openPopup();
      });
    };
    window.addEventListener("j3:map:focus", onFocus as EventListener);

    return () => {
      window.removeEventListener("j3:map:focus", onFocus as EventListener);
      container.removeEventListener("click", onContainerClick);
      map.removeLayer(group);
      group.clearLayers();
    };
  }, [map, coaches, labels, onAsk]);

  return null;
}

/**
 * Controles de zoom flotantes con `position:fixed` (vía createPortal
 * a document.body para escapar de cualquier containing block del
 * wrapper del mapa — en el hero, el wrapper tiene `contain:layout
 * paint` que de otro modo atraparía los controles).
 *
 * Con IntersectionObserver sobre el MapContainer: los controles sólo
 * se pintan cuando el mapa está parcialmente visible en el viewport.
 * Así no aparecen botones de zoom cuando el usuario ha scrolleado
 * fuera del mapa.
 *
 * `topOffset` en px — distancia desde el top del viewport donde
 * anclar los controles. Para el hero de /academy, el valor correcto
 * es navbar (52px) + altura del sticky ProgramBar (~110px) + margen
 * = ~180px.
 */
function FloatingZoomControls({ topOffset = 180 }: { topOffset?: number }) {
  const map = useMap();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0, rootMargin: "-80px 0px -80px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  if (!mounted || typeof document === "undefined") return null;
  if (!visible) return null;

  const btnBase: React.CSSProperties = {
    width: 36,
    height: 36,
    background: "rgba(10,10,10,0.92)",
    color: "#dcaf64",
    border: "none",
    cursor: "pointer",
    fontSize: 18,
    fontWeight: 300,
    lineHeight: "36px",
    padding: 0,
    transition: "background .18s ease, color .18s ease",
  };

  return createPortal(
    <div
      role="group"
      aria-label="Zoom controls"
      style={{
        position: "fixed",
        top: topOffset,
        right: 16,
        zIndex: 95,
        display: "flex",
        flexDirection: "column",
        border: "1px solid rgba(220,175,100,0.3)",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: "0 4px 18px rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
    >
      <button
        type="button"
        onClick={() => map.zoomIn()}
        aria-label="Acercar"
        style={{ ...btnBase, borderBottom: "1px solid rgba(220,175,100,0.15)" }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,175,100,0.14)"; e.currentTarget.style.color = "#f0c478"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.92)"; e.currentTarget.style.color = "#dcaf64"; }}
      >
        +
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        aria-label="Alejar"
        style={btnBase}
        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,175,100,0.14)"; e.currentTarget.style.color = "#f0c478"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.92)"; e.currentTarget.style.color = "#dcaf64"; }}
      >
        −
      </button>
    </div>,
    document.body,
  );
}

interface NetworkMapProps {
  /** Lista de coaches a pintar. La página pasa la lista ya filtrada. */
  coaches: readonly Coach[];
  /** Override opcional del handler del botón "Pregunta a J3". Default: dispara evento j3:chat:open. */
  onAsk?: (coach: Coach) => void;
  /** Centro inicial [lat, lng]. Default: Europa occidental. */
  center?: [number, number];
  /** Zoom inicial. Default: 4. */
  zoom?: number;
  /** Permitir scroll-zoom (útil cuando el mapa ocupa la mayor parte del viewport). */
  scrollWheelZoom?: boolean;
  /**
   * Si true, usa controles de zoom flotantes (position:fixed via portal)
   * con offset para no quedar tapados por sticky nav. Para el hero.
   * Si false (default), usa el ZoomControl nativo de Leaflet en topright.
   */
  floatingZoomControls?: boolean;
  /** Offset top para los controles flotantes, en px. Default 180 (navbar + sticky + margen). */
  floatingZoomTopOffset?: number;
  labels: PopupLabels;
}

export default function NetworkMap({
  coaches: coachesProp,
  onAsk,
  center = [42, 5],
  zoom = 4,
  scrollWheelZoom = false,
  floatingZoomControls = false,
  floatingZoomTopOffset = 180,
  labels,
}: NetworkMapProps) {
  const coaches = useMemo(() => [...coachesProp], [coachesProp]);

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pinStyles }} />
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2}
        maxZoom={14}
        scrollWheelZoom={scrollWheelZoom}
        style={{ width: "100%", height: "100%" }}
        worldCopyJump
        zoomControl={false}
      >
        {/* Controles de zoom: flotantes (portal al body, position:fixed)
            cuando el mapa está bajo un sticky nav que lo taparía; nativos
            de Leaflet (topright dentro del mapa) en cualquier otro caso. */}
        {floatingZoomControls ? (
          <FloatingZoomControls topOffset={floatingZoomTopOffset} />
        ) : (
          <ZoomControl position="topright" />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ClusteredMarkers coaches={coaches} labels={labels} onAsk={onAsk} />
      </MapContainer>
    </>
  );
}
