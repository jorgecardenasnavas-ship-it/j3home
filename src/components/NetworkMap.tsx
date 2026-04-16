"use client";

/* ──────────────────────────────────────────────
   NetworkMap — Leaflet + OpenStreetMap.
   Solo se carga en el cliente (dynamic import
   con ssr:false desde la página).
   Los pines usan divIcon con HTML inline para
   que hereden la marca J3 (gold glow, monograma).
   ────────────────────────────────────────────── */

import { useMemo } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Coach } from "@/data/coaches";

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
  .j3-pin-hq {
    width: 44px;
    height: 44px;
    box-shadow: 0 0 0 3px rgba(0,0,0,0.6), 0 6px 24px rgba(220,175,100,0.65);
  }
  .j3-pin-hq::after {
    inset: 9px;
  }
  .j3-pin-hq::before {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 999px;
    border: 1px solid rgba(220,175,100,0.35);
    animation: j3PulseRing 2.4s ease-out infinite;
  }
  @keyframes j3PulseRing {
    0%   { transform: scale(0.8); opacity: 1; }
    100% { transform: scale(1.8); opacity: 0; }
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
`;

function makeIcon(tier: Coach["tier"]): L.DivIcon {
  const isHq = tier === "hq";
  const size = isHq ? 44 : 28;
  return L.divIcon({
    className: "j3-pin",
    html: `<div class="j3-pin-inner${isHq ? " j3-pin-hq" : ""}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

interface NetworkMapProps {
  /** Lista de coaches a pintar. La página pasa la lista ya filtrada. */
  coaches: readonly Coach[];
  onSelect?: (slug: string) => void;
  labels: {
    badgeHq: string;
    badgeRecommended: string;
    viewProfile: string;
  };
}

export default function NetworkMap({ coaches: coachesProp, onSelect, labels }: NetworkMapProps) {
  const coaches = useMemo(() => [...coachesProp], [coachesProp]);

  // Centro en Europa occidental con un zoom razonable para ver España + Europa.
  const center: [number, number] = [42, 5];
  const zoom = 4;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: pinStyles }} />
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={2}
        maxZoom={14}
        scrollWheelZoom={false}
        style={{ width: "100%", height: "100%" }}
        worldCopyJump
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {coaches.map((c) => (
          <Marker
            key={c.slug}
            position={c.location.coordinates}
            icon={makeIcon(c.tier)}
            eventHandlers={{
              click: () => onSelect?.(c.slug),
            }}
          >
            <Popup>
              <div style={{ minWidth: 180 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#dcaf64",
                    marginBottom: 4,
                  }}
                >
                  {c.tier === "hq" ? labels.badgeHq : labels.badgeRecommended}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  {c.location.city}, {c.location.country}
                </div>
                {c.clubs && c.clubs.length > 0 && (
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                    {c.clubs.join(" · ")}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onSelect?.(c.slug)}
                  style={{
                    marginTop: 10,
                    fontSize: 10,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#dcaf64",
                    background: "transparent",
                    border: "1px solid rgba(220,175,100,0.4)",
                    padding: "6px 10px",
                    cursor: "pointer",
                  }}
                >
                  {labels.viewProfile} →
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
