"use client";

/* ──────────────────────────────────────────────
   NetworkMap — Leaflet + OpenStreetMap.
   Solo se carga en el cliente (dynamic import
   con ssr:false desde la página).
   Los pines usan divIcon con HTML inline para
   que hereden la marca J3 (gold glow, monograma).

   3 tipos visuales de marker:
   - lab      → Málaga. Grande, halo pulsante.
   - academy  → Franquicia. Medio, borde distintivo.
   - coach    → Recomendado individual. Sobrio.
   ────────────────────────────────────────────── */

import { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
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

/**
 * Escucha el evento global `j3:map:focus` con `{ slug }` y hace fly+open
 * en el marker correspondiente. Permite que elementos fuera del mapa
 * (ej. el carrusel sticky de sedes) centren el mapa sin prop-drilling.
 */
function MapFocusListener({
  coaches,
  markerRefs,
}: {
  coaches: readonly Coach[];
  markerRefs: React.MutableRefObject<Map<string, L.Marker>>;
}) {
  const map = useMap();
  useEffect(() => {
    const onFocus = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (!slug) return;
      const coach = coaches.find((c) => c.slug === slug);
      if (!coach) return;
      const [lat, lng] = coach.location.coordinates;
      map.flyTo([lat, lng], Math.max(map.getZoom(), 6), { duration: 0.9 });
      const marker = markerRefs.current.get(slug);
      if (marker) {
        // Abrir popup tras el flyTo para que no se cierre a media animación.
        window.setTimeout(() => marker.openPopup(), 950);
      }
    };
    window.addEventListener("j3:map:focus", onFocus as EventListener);
    return () => window.removeEventListener("j3:map:focus", onFocus as EventListener);
  }, [coaches, map, markerRefs]);
  return null;
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
  labels: {
    badgeHq: string;
    badgeRecommended: string;
    askChatbot: string;
  };
}

export default function NetworkMap({
  coaches: coachesProp,
  onAsk,
  center = [42, 5],
  zoom = 4,
  scrollWheelZoom = false,
  labels,
}: NetworkMapProps) {
  const coaches = useMemo(() => [...coachesProp], [coachesProp]);
  const markerRefs = useRef<Map<string, L.Marker>>(new Map());

  const handleAsk = (c: Coach) => {
    if (onAsk) {
      onAsk(c);
      return;
    }
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: c.name,
          coachLocation: `${c.location.city}, ${c.location.country}`,
        },
      }),
    );
  };

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
        {/* Controles +/- en esquina superior derecha:
            - Visibles nada más cargar el mapa (vs. bottomleft que
              quedaba fuera del viewport inicial si el mapa es alto).
            - Libres del sticky nav, que ocupa centro-izquierda. */}
        <ZoomControl position="topright" />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapFocusListener coaches={coaches} markerRefs={markerRefs} />
        {coaches.map((c) => {
          const kind = resolveKind(c);
          return (
          <Marker
            key={c.slug}
            position={c.location.coordinates}
            icon={makeIcon(kind)}
            ref={(instance) => {
              if (instance) markerRefs.current.set(c.slug, instance);
              else markerRefs.current.delete(c.slug);
            }}
          >
            <Popup maxWidth={280} minWidth={240}>
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
                      {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
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
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                    {c.languages.map(l => (
                      <LanguageChip key={l} code={l} variant="popup" />
                    ))}
                  </div>
                )}

                {/* CTA "Pregunta a J3" */}
                <button
                  type="button"
                  onClick={() => handleAsk(c)}
                  style={{
                    width: "100%",
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
              </div>
            </Popup>
          </Marker>
          );
        })}
      </MapContainer>
    </>
  );
}
