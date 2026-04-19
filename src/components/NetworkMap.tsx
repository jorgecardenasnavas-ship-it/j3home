"use client";

/* ──────────────────────────────────────────────
   NetworkMap — Leaflet + OpenStreetMap + clustering.
   Solo se carga en el cliente (dynamic import
   con ssr:false desde la página).

   Features:
   - Clustering (leaflet.markercluster) con círculos
     dorados mostrando el nº de coaches agrupados.
   - Auto-fit bounds opt-in: si hay pines, calcula
     el bound que los contiene a todos y ajusta el
     viewport (respetando un padding generoso).
   - Mini-leyenda flotante bottom-left.
   - Deep-link #coach=slug: al cargar, abre popup del
     coach indicado. Al abrir/cerrar popups, actualiza
     el hash sin provocar reload.
   - Botón "Ver en Maps" en el popup (abre Google Maps
     con las coordenadas del coach).

   Popup: renderToStaticMarkup convierte el JSX a HTML
   estático que se bindea al marker. Los handlers
   interactivos se resuelven con event delegation
   sobre el contenedor del mapa, usando data-attributes.

   3 tipos visuales de marker:
   - lab      → Málaga. Grande, halo pulsante.
   - academy  → Franquicia. Medio, borde distintivo.
   - coach    → Recomendado individual. Sobrio.
   ────────────────────────────────────────────── */

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet.markercluster"; // side-effect: registra L.markerClusterGroup
import { MapContainer, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import type { Coach, CoachDistinction } from "@/data/coaches";
import { getCoachBadges } from "@/data/coaches";
import type { LatLng } from "@/lib/geo";
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
  .j3-pin-inner:hover,
  .j3-pin-inner.is-hovered {
    transform: scale(1.25);
    box-shadow: 0 0 0 3px rgba(0,0,0,0.6), 0 8px 28px rgba(220,175,100,0.7);
  }
  /* Cuando el hover viene desde una card (sync externo), destacar más */
  .j3-pin-inner.is-hovered::after {
    border-color: #f0c478;
    background: #1a1408;
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
  /* Todos los coach pins son idénticos (democracia visual en el mapa).
     La diferenciación entre Recomendado, Certificado, Founder o
     distinciones vive EXCLUSIVAMENTE dentro de la card (popup), no
     en el pin. Esto evita jerarquía visible en el mapa. */
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
    position: relative;
    z-index: 0;
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
  /* Spiderfy: líneas doradas suaves */
  .leaflet-cluster-spider-leg {
    stroke: rgba(220,175,100,0.55) !important;
    stroke-width: 1.2 !important;
    stroke-opacity: 0.8 !important;
  }

  /* ── Pin "tú estás aquí" — color frío (azul cyan) para
     diferenciarlo inmediatamente de los pines dorados J3.
     Ring pulsante continuo para señalizar que es dinámico. ── */
  .j3-user-pin {
    background: transparent !important;
    border: none !important;
  }
  .j3-user-pin-inner {
    position: relative;
    width: 28px;
    height: 28px;
    border-radius: 999px;
    background: radial-gradient(circle at 50% 50%, rgba(130,200,255,0.98), rgba(100,180,240,0.6) 55%, rgba(100,180,240,0) 100%);
    box-shadow: 0 0 0 2px rgba(0,0,0,0.55), 0 4px 18px rgba(130,200,255,0.55);
  }
  .j3-user-pin-inner::after {
    content: "";
    position: absolute;
    inset: 6px;
    border-radius: 999px;
    background: #ffffff;
    border: 1px solid rgba(130,200,255,0.9);
  }
  .j3-user-pin-inner::before {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 999px;
    border: 1px solid rgba(130,200,255,0.5);
    animation: j3UserPulse 2s ease-out infinite;
  }
  @keyframes j3UserPulse {
    0%   { transform: scale(0.75); opacity: 1; }
    100% { transform: scale(2.1);  opacity: 0; }
  }

  /* ── Leyenda flotante (Leaflet control bottomleft) ── */
  .j3-legend {
    background: rgba(10,10,10,0.78) !important;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(220,175,100,0.28) !important;
    border-radius: 2px !important;
    box-shadow: 0 6px 20px rgba(0,0,0,0.4) !important;
    padding: 10px 12px !important;
    color: #f5f0e8;
    font-size: 10px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    line-height: 1;
    margin: 0 0 14px 12px !important;
    transition: padding .25s cubic-bezier(.4,0,.2,1), background .25s ease;
  }
  .j3-legend-details > summary { list-style: none; cursor: pointer; outline: none; }
  .j3-legend-details > summary::-webkit-details-marker { display: none; }
  .j3-legend-summary {
    display: flex;
    align-items: center;
    gap: 8px;
    user-select: none;
  }
  .j3-legend-summary-icon {
    display: none; /* desktop: oculto, el title ya comunica */
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: rgba(220,175,100,0.12);
    border: 1px solid rgba(220,175,100,0.45);
    color: #dcaf64;
    font-family: ui-serif, Georgia, serif;
    font-style: italic;
    font-size: 11px;
    line-height: 16px;
    font-weight: 700;
    text-align: center;
    text-transform: none;
    letter-spacing: 0;
  }
  .j3-legend-title {
    color: #dcaf64;
    font-weight: 700;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }
  .j3-legend-body { margin-top: 0; }
  /* Colapso unificado (desktop + móvil): si el details está cerrado,
     solo se ve el icono 'i' gold; al abrir se muestra el title + body. */
  .j3-legend-details:not([open]) .j3-legend-title,
  .j3-legend-details:not([open]) .j3-legend-body {
    display: none;
  }
  .j3-legend-details:not([open]) .j3-legend-summary-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .j3-legend:has(.j3-legend-details:not([open])) {
    padding: 6px !important;
  }
  /* Abierto: icono a la izquierda del título como "tap para cerrar". */
  .j3-legend-details[open] .j3-legend-summary-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .j3-legend-details[open] .j3-legend-summary {
    margin-bottom: 4px;
  }
  .j3-legend-details[open] .j3-legend-title {
    margin-bottom: 0;
  }
  .j3-legend-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    color: rgba(245,240,232,0.85);
    font-weight: 500;
  }
  .j3-legend-dot {
    display: inline-block;
    border-radius: 999px;
    flex-shrink: 0;
    background: radial-gradient(circle at 50% 50%, #f0c478 0%, #dcaf64 55%, #b8943e 100%);
    box-shadow: 0 0 0 1px rgba(0,0,0,0.55), 0 1px 4px rgba(220,175,100,0.4);
  }
  .j3-legend-dot-hq {
    width: 16px;
    height: 16px;
    box-shadow: 0 0 0 1.5px rgba(0,0,0,0.6), 0 2px 8px rgba(220,175,100,0.7);
  }
  /* Un solo dot "coach" para todos los coaches del mapa (certificados
     y recomendados). La diferenciación vive en la card, no en el pin. */
  .j3-legend-dot-coach {
    width: 10px;
    height: 10px;
    box-shadow: 0 0 0 1px rgba(0,0,0,0.55), 0 0 5px rgba(220,175,100,0.45);
  }
  .j3-legend-dot-cluster {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 9px;
    color: #0a0a0a;
    font-weight: 800;
    letter-spacing: 0;
  }

  /* ── Popup: pills de especialidad clickables con hover ── */
  .j3-popup-spec {
    position: relative;
    transition: background .18s ease, border-color .18s ease, color .18s ease, padding .18s ease;
  }
  .j3-popup-spec:hover {
    background: rgba(220,175,100,0.22) !important;
    border-color: rgba(220,175,100,0.7) !important;
    color: #f0c478 !important;
    padding-right: 14px !important;
  }
  .j3-popup-spec::after {
    content: "→";
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%) translateX(-2px);
    font-size: 10px;
    line-height: 1;
    opacity: 0;
    transition: opacity .18s ease, transform .18s ease;
    pointer-events: none;
  }
  .j3-popup-spec:hover::after {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }

  /* ── Popup: iconos sociales ghost con hover ── */
  .j3-popup-social {
    transition: background .18s ease, color .18s ease, border-color .18s ease;
  }
  .j3-popup-social:hover {
    background: rgba(220,175,100,0.18) !important;
    color: #f0c478 !important;
    border-color: rgba(220,175,100,0.55) !important;
  }

  /* En móvil la fila de filtros (hero-rise-5) vive a top-[16px] del
     mapa y se solapa con la X del popup cuando éste se abre cerca del
     borde superior. Cuando hay un popup abierto, atenuamos los filtros
     y les quitamos pointer-events — el click sobre la X ya no intercepta
     el selector del filtro. */
  @media (max-width: 960px) {
    .leaflet-container:has(.leaflet-popup) ~ .hero-rise-5 {
      pointer-events: none !important;
      opacity: 0.25 !important;
      transition: opacity .2s ease !important;
    }
  }
`;

function resolveKind(c: Coach): "lab" | "academy" | "coach" {
  if (c.type) return c.type;
  // Retrocompat: si no hay type, usamos tier para decidir.
  if (c.tier === "hq") return "lab";
  return "coach";
}

function makeIcon(kind: "lab" | "academy" | "coach"): L.DivIcon {
  /* Tres tamaños únicos — todos los coaches (recomendados, certificados,
     founders, cualquier combinación de distinciones) comparten el mismo
     pin 28px. La diferenciación se descubre al abrir la card. */
  const size =
    kind === "lab" ? 48 :
    kind === "academy" ? 36 :
    28;
  const kindModifier =
    kind === "lab" ? " j3-pin-lab" :
    kind === "academy" ? " j3-pin-academy" :
    "";
  return L.divIcon({
    className: "j3-pin",
    html: `<div class="j3-pin-inner${kindModifier}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

interface PopupLabels {
  /** Badge "Headquarter" — solo para tipo lab/academy */
  badgeHq: string;
  /** Badge "Founder" — distinción histórica (puede combinarse con cualquier estado) */
  badgeFounder: string;
  /** Prefijo de especialidad. Ej: "Especialista:" → "Especialista: Juniors" */
  specialtyLabel: string;
  /** Especialidades traducidas (juniors / adultos / competicion / camps) */
  specialtyJuniors: string;
  specialtyAdultos: string;
  specialtyCompeticion: string;
  specialtyCamps: string;
  /** Distinciones traducidas */
  distinctionFormaCoaches: string;
  distinctionJugadoresCircuito: string;
  distinctionMultilingue: string;
  distinctionDecano: string;
  /** Meses abreviados, índice 0 = Enero. */
  monthShort: readonly string[];
  /** Templates con placeholder {date} → "Ago 2025" */
  memberSince: string;
  certifiedSince: string;
  lastCertification: string;
  askChatbot: string;
  /** Labels de la mini-leyenda (Headquarter · Coach · Cluster) */
  legendTitle: string;
  legendHq: string;
  legendCoach: string;
  legendCluster: string;
  /** Label del botón "Ver en Maps" */
  viewInMaps: string;
  /** Tooltip del pin del usuario: "Estás aquí" */
  youAreHere?: string;
}

/** Formatea una fecha ISO (YYYY-MM-DD) a "Mes Año" legible usando los
 *  `monthShort` del idioma. Si falla el parseo devuelve la fecha cruda. */
function formatMonthYear(isoDate: string, monthShort: readonly string[]): string {
  const match = /^(\d{4})-(\d{2})/.exec(isoDate);
  if (!match) return isoDate;
  const year = match[1];
  const monthIdx = parseInt(match[2], 10) - 1;
  if (monthIdx < 0 || monthIdx > 11) return isoDate;
  return `${monthShort[monthIdx]} ${year}`;
}

/** Mapa de distinction key → label traducida. */
function distinctionLabel(d: CoachDistinction, labels: PopupLabels): string {
  switch (d) {
    case "forma-coaches": return labels.distinctionFormaCoaches;
    case "jugadores-circuito": return labels.distinctionJugadoresCircuito;
    case "multilingue": return labels.distinctionMultilingue;
  }
}

/** Mapa de specialty key → label traducida. */
function specialtyLabelText(s: "juniors" | "adultos" | "competicion" | "camps", labels: PopupLabels): string {
  switch (s) {
    case "juniors": return labels.specialtyJuniors;
    case "adultos": return labels.specialtyAdultos;
    case "competicion": return labels.specialtyCompeticion;
    case "camps": return labels.specialtyCamps;
  }
}

/**
 * BadgeChip — pequeño chip con dot y label. Se usa en el header del
 * popup para mostrar el stack de badges (HQ / Recomendado / Founder).
 * Tiene 3 tonos para diferenciarlos visualmente sin texto adicional.
 */
function BadgeChip({
  label,
  tone,
}: {
  label: string;
  tone: "hq" | "recommended" | "founder";
}) {
  /* hq: dorado más denso (sede oficial)
     recommended: dorado medio con fondo suave
     founder: outline dorado elegante, transmite historia */
  const palette =
    tone === "hq"
      ? {
          bg: "rgba(220,175,100,0.20)",
          border: "rgba(220,175,100,0.55)",
          color: "#f0c478",
          dot: "#f0c478",
        }
      : tone === "recommended"
      ? {
          bg: "rgba(220,175,100,0.14)",
          border: "rgba(220,175,100,0.42)",
          color: "#dcaf64",
          dot: "#dcaf64",
        }
      : {
          bg: "rgba(220,175,100,0.04)",
          border: "rgba(220,175,100,0.55)",
          color: "#dcaf64",
          dot: "transparent",
        };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 8.5,
        fontWeight: 700,
        letterSpacing: 1.6,
        textTransform: "uppercase",
        color: palette.color,
        background: palette.bg,
        border: `1px solid ${palette.border}`,
        padding: "2.5px 6px",
        borderRadius: 2,
      }}
    >
      {tone !== "founder" && (
        <span
          aria-hidden
          style={{
            width: 4,
            height: 4,
            borderRadius: 999,
            background: palette.dot,
            boxShadow: tone === "hq" ? `0 0 4px ${palette.dot}` : "none",
          }}
        />
      )}
      {/* Para Founder usamos un mini-asterisco serif en lugar de dot, marca
          visualmente la distinción histórica. */}
      {tone === "founder" && (
        <span
          aria-hidden
          style={{
            fontFamily: "ui-serif, Georgia, serif",
            fontStyle: "italic",
            fontSize: 10,
            lineHeight: 1,
            fontWeight: 400,
          }}
        >
          ✦
        </span>
      )}
      {label}
    </span>
  );
}

/**
 * Componente puro de popup — se renderiza a HTML estático
 * con renderToStaticMarkup y se bindea al marker. Los
 * handlers interactivos se conectan por event delegation
 * (data-j3-ask-slug para "Pregunta a J3"; IG, Web y Maps
 * son anchors nativos con target=_blank).
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
  const [lat, lng] = c.location.coordinates;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  /* Badges calculados por la lógica central (getCoachBadges):
     - Specialties solo si certificationActive.
     - Distinctions solo si mentorActive.
     - Founder es histórico, combinable con cualquier estado. */
  const badges = getCoachBadges(c);
  const isHqKind = kind === "lab" || kind === "academy";

  /* Texto de antigüedad en plataforma — siempre presente para coaches. */
  const memberSinceText = labels.memberSince.replace(
    "{date}",
    formatMonthYear(badges.joinedAt, labels.monthShort),
  );

  /* Texto de certificación según estado:
     - certified-active → "Certificado desde {fecha}"
     - ex-certified     → "Última certificación {fecha}"
     - base / hq        → null (no se pinta línea) */
  const certLine: { text: string; active: boolean } | null = badges.certifiedAt
    ? badges.status === "certified-active"
      ? { text: labels.certifiedSince.replace("{date}", formatMonthYear(badges.certifiedAt, labels.monthShort)), active: true }
      : badges.status === "ex-certified"
      ? { text: labels.lastCertification.replace("{date}", formatMonthYear(badges.certifiedAt, labels.monthShort)), active: false }
      : null
    : null;

  /* Distinciones a mostrar: las almacenadas + "Decano J3" si aplica (computado). */
  const distinctionLines: string[] = [
    ...badges.distinctions.map((d) => distinctionLabel(d, labels)),
  ];
  if (badges.decano) distinctionLines.push(labels.distinctionDecano);

  return (
    <div style={{ minWidth: 220 }}>
      {/* Header: foto + badges (HQ/Founder) + nombre + ubicación */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 6 }}>
        {c.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={c.photo}
            alt=""
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              objectFit: "cover",
              border: isHqKind ? "2px solid #dcaf64" : "1px solid rgba(220,175,100,0.3)",
              flexShrink: 0,
            }}
          />
        ) : (
          <div
            aria-hidden
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: "rgba(220,175,100,0.08)",
              border: "1px solid rgba(220,175,100,0.25)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 15,
              fontWeight: 700,
              color: "#dcaf64",
              letterSpacing: 1,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
        )}
        <div style={{ minWidth: 0, flex: 1 }}>
          {/* Badges: solo HQ (para sedes) o Founder (histórico). El estado
              del coach se comunica mediante las LÍNEAS DE FECHA de más abajo,
              no con badge de "Recomendado". */}
          {(isHqKind || badges.founder) && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
              {isHqKind && <BadgeChip label={labels.badgeHq} tone="hq" />}
              {!isHqKind && badges.founder && <BadgeChip label={labels.badgeFounder} tone="founder" />}
            </div>
          )}
          <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.15, marginBottom: 2, letterSpacing: "-0.3px" }}>
            {c.name}
          </div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>
            {c.location.city}, {c.location.country}
          </div>
        </div>
      </div>

      {/* Stack de fechas — el nuevo lenguaje del sistema.
          Coach360 desde X (siempre para coaches)
          + Certificado desde X (si activa) o Última certificación X (si histórica). */}
      {!isHqKind && (
        <div style={{ fontSize: 11, marginBottom: 8, lineHeight: 1.55 }}>
          <div style={{ opacity: 0.72 }}>{memberSinceText}</div>
          {certLine && (
            <div
              style={{
                color: certLine.active ? "#dcaf64" : "rgba(245,240,232,0.62)",
                fontWeight: certLine.active ? 600 : 400,
                fontStyle: certLine.active ? "normal" : "italic",
              }}
            >
              {certLine.text}
            </div>
          )}
        </div>
      )}

      {/* Especialista J3: [X, Y] — solo para recomendados con specialties.
          Es texto, no chips: comunica "J3 avala que este coach es especialista
          en esto". Los chips de navegación (filtros) van aparte más abajo. */}
      {badges.specialties.length > 0 && (
        <div style={{ fontSize: 11, marginBottom: 6, lineHeight: 1.3 }}>
          <span style={{ color: "#dcaf64", fontWeight: 600, letterSpacing: 0.3 }}>
            {labels.specialtyLabel}
          </span>
          <span style={{ opacity: 0.88, marginLeft: 4 }}>
            {badges.specialties.map((s) => specialtyLabelText(s, labels)).join(" · ")}
          </span>
        </div>
      )}

      {/* Distinciones (Forma coaches / Jugadores en circuito / Multilingüe /
          Decano). Solo para recomendados. Se pintan como lista suave con
          bullets dorados. */}
      {distinctionLines.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 10px 0", fontSize: 11, lineHeight: 1.5 }}>
          {distinctionLines.map((line) => (
            <li key={line} style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.82 }}>
              <span
                aria-hidden
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: 999,
                  background: "#dcaf64",
                  flexShrink: 0,
                }}
              />
              {line}
            </li>
          ))}
        </ul>
      )}

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

      {/* Especialidades como chips de filtro — siempre clickables para
          navegación cruzada. Event delegation en la page (data-j3-specialty). */}
      {c.specialties && c.specialties.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
          {c.specialties.map((s) => {
            const lbl = specialtyLabelText(s, labels);
            return (
              <button
                key={s}
                type="button"
                data-j3-specialty={s}
                className="j3-popup-spec"
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
                  padding: "3px 8px",
                  borderRadius: 2,
                  cursor: "pointer",
                  font: "inherit",
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
              </button>
            );
          })}
        </div>
      )}

      {/* CTA principal + iconos sociales (IG, Web, Maps).
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
            className="j3-popup-social"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              background: "transparent",
              border: "1px solid rgba(220,175,100,0.2)",
              color: "rgba(220,175,100,0.75)",
              borderRadius: 2,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
        )}
        {/* El icono web solo tiene sentido para coaches externos; en la
            propia tarjeta del Lab (estamos ya en su web) se oculta. */}
        {c.socials?.web && kind !== "lab" && (
          <a
            href={c.socials.web}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Web de ${c.name}`}
            className="j3-popup-social"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 30,
              background: "transparent",
              border: "1px solid rgba(220,175,100,0.2)",
              color: "rgba(220,175,100,0.75)",
              borderRadius: 2,
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </a>
        )}
        {/* "Ver en Maps" — siempre disponible (todos los coaches tienen coords) */}
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${labels.viewInMaps}: ${c.name}`}
          title={labels.viewInMaps}
          className="j3-popup-social"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 30,
            background: "transparent",
            border: "1px solid rgba(220,175,100,0.2)",
            color: "rgba(220,175,100,0.75)",
            borderRadius: 2,
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </a>
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
 *   sm (2-4) · md (5-9) · lg (10+).
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
 *
 * Escucha dos eventos:
 *  - `j3:map:focus` (custom event global)  → lleva el mapa
 *    al coach con el slug indicado y abre su popup.
 *  - `hashchange` (DOM)                    → si el hash cambia
 *    a `#coach=slug`, abre el popup correspondiente. Esto
 *    permite deep-links compartibles.
 *
 * Al abrir/cerrar popups, actualiza el hash de la URL sin
 * provocar reload (replaceState). Así compartir un coach es
 * copiar la URL del navegador.
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
      // Desactivamos zoomToBoundsOnClick nativo porque hace un salto
      // agresivo al fitBounds exacto del cluster — pierdes el contexto
      // regional (ej: click en el "11" de España y desaparece Italia).
      // En su lugar usamos un handler custom más abajo que sube 3
      // niveles de zoom centrado en el cluster → exploración progresiva.
      zoomToBoundsOnClick: false,
      animate: true,
      animateAddingMarkers: false,
      iconCreateFunction: (cluster) => makeClusterIcon(cluster.getChildCount()),
    });

    // Click en cluster → fitBounds de sus hijos con padding generoso.
    // El padding amplio ("aire alrededor") evita que el zoom sea
    // demasiado agresivo y da contexto regional (ej: clicar el cluster
    // de Europa muestra toda Europa con margen, no solo los pines
    // apretados). maxZoom 10 evita zoom absurdo si el cluster tiene
    // pocos pines muy juntos.
    group.on("clusterclick", (e: L.LeafletEvent) => {
      const cluster = (e as unknown as { layer: L.MarkerCluster }).layer;
      const bounds = cluster.getBounds();
      map.fitBounds(bounds, {
        padding: [120, 120],
        maxZoom: 10,
        animate: true,
      });
    });

    const markerBySlug = new Map<string, L.Marker>();
    // Markers del Lab/HQ: a zoom bajo viven en el cluster group
    // (vista mundial limpia). A partir de HQ_BREAKOUT_ZOOM se
    // extraen del grupo y se añaden directamente al mapa, así el
    // Lab es visible como pin independiente ANTES de que el resto
    // de coaches se expandan. Efecto: zoom 5 → Lab ya visible,
    // otros coaches aún agrupados en sub-clusters.
    const HQ_BREAKOUT_ZOOM = 5;
    const hqMarkers: L.Marker[] = [];
    let hqBrokenOut = false;

    coaches.forEach((c) => {
      const kind = resolveKind(c);
      const isHq = kind === "lab";
      const popupHtml = renderToStaticMarkup(
        <PopupContent coach={c} labels={labels} kind={kind} />
      );
      const m = L.marker(c.location.coordinates, { icon: makeIcon(kind) });
      m.bindPopup(popupHtml, { maxWidth: 280, minWidth: 240 });

      // Al abrir el popup, reflejar el coach en el hash de la URL
      // para que sea compartible. Al cerrar, limpiar.
      m.on("popupopen", () => {
        if (typeof window === "undefined") return;
        const next = `#coach=${c.slug}`;
        if (window.location.hash !== next) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${next}`);
        }
      });
      m.on("popupclose", () => {
        if (typeof window === "undefined") return;
        if (window.location.hash === `#coach=${c.slug}`) {
          window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
        }
      });

      // Hover bidireccional — emite eventos globales al pasar
      // el cursor por encima del pin. Las cards escuchan estos
      // mismos eventos y se resaltan si coincide el slug.
      m.on("mouseover", () => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("j3:hover:enter", { detail: { slug: c.slug } }));
      });
      m.on("mouseout", () => {
        if (typeof window === "undefined") return;
        window.dispatchEvent(new CustomEvent("j3:hover:leave", { detail: { slug: c.slug } }));
      });

      group.addLayer(m);
      if (isHq) hqMarkers.push(m);
      markerBySlug.set(c.slug, m);
    });

    map.addLayer(group);

    // Breakout dinámico: al cambiar de zoom, mueve los markers HQ
    // entre el cluster group y el mapa directo.
    const syncHqBreakout = () => {
      const z = map.getZoom();
      if (z >= HQ_BREAKOUT_ZOOM && !hqBrokenOut) {
        hqMarkers.forEach((m) => {
          group.removeLayer(m);
          m.addTo(map);
        });
        hqBrokenOut = true;
      } else if (z < HQ_BREAKOUT_ZOOM && hqBrokenOut) {
        hqMarkers.forEach((m) => {
          m.remove();
          group.addLayer(m);
        });
        hqBrokenOut = false;
      }
    };
    map.on("zoomend", syncHqBreakout);
    // Sync inicial por si el mapa arranca ya a zoom >= 5
    syncHqBreakout();

    // Event delegation para el botón "Pregunta a J3" y las pills
    // de especialidades (data-j3-specialty) — el JSX del popup se
    // serializa a HTML y los onClick de React no sobreviven.
    const container = map.getContainer();
    const onContainerClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const askBtn = target.closest("[data-j3-ask-slug]") as HTMLElement | null;
      if (askBtn) {
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
        return;
      }

      const specBtn = target.closest("[data-j3-specialty]") as HTMLElement | null;
      if (specBtn) {
        const s = specBtn.getAttribute("data-j3-specialty");
        if (!s) return;
        /* Map especialidad → anchor de sección en /academy. */
        const anchor =
          s === "adultos" ? "adultos" :
          s === "camps" ? "intensive" :
          /* juniors + competicion */ "juniors";
        window.dispatchEvent(new CustomEvent("j3:academy:goto", { detail: { anchor } }));
        return;
      }
    };
    container.addEventListener("click", onContainerClick);

    /** Foca un coach concreto: zoom + centra + abre popup.
     *  Para markers HQ usamos siempre flyTo directo: el breakout
     *  dinámico (syncHqBreakout) los saca del cluster group a
     *  zoom >= 5, lo que causa una race condition con zoomToShowLayer.
     *  flyTo es más fiable y siempre centra correctamente. */
    const focusCoach = (slug: string) => {
      const marker = markerBySlug.get(slug);
      if (!marker) return;
      if (hqMarkers.includes(marker)) {
        map.flyTo(marker.getLatLng(), 10, { duration: 1.2 });
        // Esperar a que el flyTo termine y el breakout se active
        // antes de abrir el popup.
        map.once("moveend", () => {
          marker.openPopup();
        });
      } else {
        group.zoomToShowLayer(marker, () => {
          marker.openPopup();
        });
      }
    };

    // j3:map:focus — evento custom disparado desde fuera del mapa
    const onFocusEvent = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (slug) focusCoach(slug);
    };
    window.addEventListener("j3:map:focus", onFocusEvent as EventListener);

    // Hover sync inverso: cuando una card emite hover, resaltar
    // el pin correspondiente añadiendo la clase .is-hovered al
    // div interno del marker. Usamos getElement() porque el
    // icono es un DivIcon y el contenedor existe siempre que
    // el marker esté visible (no dentro de un cluster colapsado).
    const togglePinHover = (slug: string, on: boolean) => {
      const marker = markerBySlug.get(slug);
      if (!marker) return;
      const el = marker.getElement();
      if (!el) return;
      const inner = el.querySelector<HTMLElement>(".j3-pin-inner");
      if (!inner) return;
      inner.classList.toggle("is-hovered", on);
    };
    const onHoverEnter = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (slug) togglePinHover(slug, true);
    };
    const onHoverLeave = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (slug) togglePinHover(slug, false);
    };
    window.addEventListener("j3:hover:enter", onHoverEnter as EventListener);
    window.addEventListener("j3:hover:leave", onHoverLeave as EventListener);

    // hashchange — deep-link reactivo durante la sesión
    const parseHashSlug = (): string | null => {
      if (typeof window === "undefined") return null;
      const m = window.location.hash.match(/^#coach=([a-z0-9-]+)$/i);
      return m ? m[1] : null;
    };
    const onHashChange = () => {
      const slug = parseHashSlug();
      if (slug) focusCoach(slug);
    };
    window.addEventListener("hashchange", onHashChange);

    // Deep-link al cargar: si el hash ya trae un coach, abrirlo
    // con un pequeño delay para dejar que el tile layer y el
    // cluster group terminen de montar.
    const initialSlug = parseHashSlug();
    const initialTimer = initialSlug
      ? window.setTimeout(() => focusCoach(initialSlug), 600)
      : null;

    return () => {
      window.removeEventListener("j3:map:focus", onFocusEvent as EventListener);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("j3:hover:enter", onHoverEnter as EventListener);
      window.removeEventListener("j3:hover:leave", onHoverLeave as EventListener);
      container.removeEventListener("click", onContainerClick);
      map.off("zoomend", syncHqBreakout);
      if (hqBrokenOut) hqMarkers.forEach((m) => m.remove());
      if (initialTimer !== null) window.clearTimeout(initialTimer);
      map.removeLayer(group);
      group.clearLayers();
    };
  }, [map, coaches, labels, onAsk]);

  return null;
}

/**
 * UserLocationMarker — pin cyan pulsante en la ubicación del
 * usuario. Se monta y desmonta cuando la prop `userLocation`
 * cambia. Muestra un popup simple con el label "Estás aquí".
 */
function UserLocationMarker({
  location,
  label,
}: {
  location: LatLng;
  label: string;
}) {
  const map = useMap();

  useEffect(() => {
    const icon = L.divIcon({
      className: "j3-user-pin",
      html: `<div class="j3-user-pin-inner"></div>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -14],
    });
    // Leaflet expects a mutable tuple; LatLng es readonly → copia.
    const marker = L.marker([location[0], location[1]], { icon, keyboard: false, interactive: true });
    marker.bindTooltip(label, {
      direction: "top",
      offset: [0, -14],
      opacity: 0.95,
      className: "j3-user-tooltip",
    });
    marker.addTo(map);
    return () => {
      marker.remove();
    };
  }, [map, location, label]);

  return null;
}

/**
 * AutoCenterOnUser — cuando se obtiene por primera vez la
 * ubicación del usuario, anima el mapa para centrarse ahí
 * con un zoom cómodo (regional). Solo dispara una vez por
 * cambio de location: si el usuario luego pan-ea, no se
 * vuelve a centrar.
 */
function AutoCenterOnUser({ location }: { location: LatLng | null | undefined }) {
  const map = useMap();
  const lastKey = useRef<string | null>(null);

  useEffect(() => {
    if (!location) return;
    const key = `${location[0].toFixed(4)},${location[1].toFixed(4)}`;
    if (lastKey.current === key) return;
    lastKey.current = key;
    // Leaflet expects a mutable tuple; LatLng es readonly → copia.
    map.flyTo([location[0], location[1]], 8, { duration: 1.2, easeLinearity: 0.25 });
  }, [map, location]);

  return null;
}

/**
 * AutoFitBounds — calcula el bound que contiene todos los
 * pines visibles y ajusta el viewport. Solo dispara una vez
 * por instancia del mapa para no sobreescribir las pan/zoom
 * del usuario.
 *
 * Si la lista de coaches está vacía o solo tiene uno, no
 * hace nada (deja el center/zoom que ya tenía el mapa).
 */
function AutoFitBounds({ coaches, padding = 48 }: { coaches: readonly Coach[]; padding?: number }) {
  const map = useMap();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    if (coaches.length < 2) return;
    const bounds = L.latLngBounds(coaches.map((c) => c.location.coordinates));
    if (!bounds.isValid()) return;
    map.fitBounds(bounds, { padding: [padding, padding], animate: false, maxZoom: 7 });
    done.current = true;
  }, [map, coaches, padding]);

  return null;
}

/**
 * FocusOnFilter — cuando el `trigger` cambia (típicamente un filtro
 * como país o idioma), re-fitea los bounds a la lista de coaches
 * actual con animación y un pelín de padding. Se salta el primer
 * render para dejar que AutoFitBounds haga el fit inicial.
 */
function FocusOnFilter({ coaches, trigger, padding = 70 }: { coaches: readonly Coach[]; trigger: string; padding?: number }) {
  const map = useMap();
  const initial = useRef(true);

  useEffect(() => {
    if (initial.current) { initial.current = false; return; }
    if (coaches.length === 0) return;
    const bounds = L.latLngBounds(coaches.map((c) => c.location.coordinates));
    if (!bounds.isValid()) return;
    map.flyToBounds(bounds, { padding: [padding, padding], maxZoom: 8, duration: 0.9 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  return null;
}

/**
 * MapLegend — mini-leyenda flotante (Leaflet control en
 * `bottomleft`) explicando qué significan los tres tipos de
 * pin y el cluster. Se monta como un L.control custom para
 * mantener el posicionamiento correcto dentro del mapa.
 */
function MapLegend({ labels }: { labels: PopupLabels }) {
  const map = useMap();

  useEffect(() => {
    const Legend = L.Control.extend({
      options: { position: "bottomleft" as L.ControlPosition },
      onAdd() {
        const div = L.DomUtil.create("div", "j3-legend");
        /* La leyenda monta colapsada (solo el icono 'i' gold) tanto en
           desktop como en móvil — libera espacio del mapa y la mantenemos
           disponible a un tap para quien la necesite. Click fuera cierra. */
        div.innerHTML = `
          <details class="j3-legend-details">
            <summary class="j3-legend-summary" aria-label="${labels.legendTitle}">
              <span class="j3-legend-summary-icon" aria-hidden>i</span>
              <span class="j3-legend-title">${labels.legendTitle}</span>
            </summary>
            <div class="j3-legend-body">
              <div class="j3-legend-row">
                <span class="j3-legend-dot j3-legend-dot-hq" aria-hidden></span>
                <span>${labels.legendHq}</span>
              </div>
              <div class="j3-legend-row">
                <span class="j3-legend-dot j3-legend-dot-coach" aria-hidden></span>
                <span>${labels.legendCoach}</span>
              </div>
              <div class="j3-legend-row">
                <span class="j3-legend-dot j3-legend-dot-cluster" aria-hidden>3</span>
                <span>${labels.legendCluster}</span>
              </div>
            </div>
          </details>
        `;
        // Permitir scroll/click dentro del control sin propagarlo al mapa.
        L.DomEvent.disableClickPropagation(div);
        /* Click-outside → colapsa el details (solo cuando está abierto).
           Importante en móvil: el usuario espera que tocar fuera cierre
           la leyenda expandida. */
        const details = div.querySelector(".j3-legend-details") as HTMLDetailsElement | null;
        if (details) {
          const onDocClick = (ev: Event) => {
            if (!details.open) return;
            const target = ev.target as Node;
            if (div.contains(target)) return;
            details.open = false;
          };
          document.addEventListener("click", onDocClick, { capture: true });
          document.addEventListener("touchstart", onDocClick, { capture: true, passive: true });
          // Guardamos el cleanup en el propio elemento para poder recuperarlo en onRemove.
          (div as HTMLElement & { __j3Cleanup?: () => void }).__j3Cleanup = () => {
            document.removeEventListener("click", onDocClick, { capture: true });
            document.removeEventListener("touchstart", onDocClick, { capture: true });
          };
        }
        return div;
      },
      onRemove(this: L.Control) {
        const container = (this as L.Control & { getContainer?: () => HTMLElement | undefined }).getContainer?.();
        const cleanup = (container as HTMLElement & { __j3Cleanup?: () => void } | undefined)?.__j3Cleanup;
        if (cleanup) cleanup();
      },
    });
    const control = new Legend();
    control.addTo(map);
    return () => {
      control.remove();
    };
  }, [map, labels]);

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
function FloatingZoomControls({
  topOffset = 180,
  coaches,
  initialZoom,
}: {
  topOffset?: number;
  coaches?: readonly Coach[];
  initialZoom?: number;
}) {
  const map = useMap();
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  /* En mobile el mapa está debajo del copy del hero; anclar arriba-derecha
     pisaba el H1 cuando ambos estaban en viewport. Cambiamos a abajo-derecha
     bajo 960px para que los controles floten cerca del mapa visible. */
  const [mobileAnchor, setMobileAnchor] = useState(false);
  /* En móvil, el zoom se ancla al borde SUPERIOR del mapa: aparece desde
     el primer pantallazo (cuando el usuario aún está viendo el hero y
     el mapa asoma por debajo) y al hacer scroll se pega al sticky header
     en vez de quedarse flotando sobre la siguiente sección. */
  const [mobileTopOffset, setMobileTopOffset] = useState(100);
  /* Botón "Reset view": visible solo cuando el usuario ha hecho zoom
     significativo (initialZoom + 2) y tenemos una lista de coaches a
     la que volver. Fit automático. */
  const [zoomedIn, setZoomedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(max-width: 960px)");
    const onChange = () => setMobileAnchor(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    /* Capturamos el zoom "reposado" después de que autoFitBounds se asiente.
       Si el usuario zoomea >= 2 niveles sobre esa línea base, asumimos que
       quiere volver a la vista general y mostramos el reset. */
    let baseline: number | null = null;
    const captureBaseline = () => {
      baseline = map.getZoom();
      setZoomedIn(false);
    };
    const t = window.setTimeout(captureBaseline, 900);
    const check = () => {
      if (baseline === null) return;
      setZoomedIn(map.getZoom() > baseline + 1.5);
    };
    map.on("zoomend", check);
    return () => {
      window.clearTimeout(t);
      map.off("zoomend", check);
    };
  }, [map]);

  const handleResetView = () => {
    if (!coaches || coaches.length < 2) {
      if (initialZoom !== undefined) map.setZoom(initialZoom, { animate: true });
      return;
    }
    const bounds = L.latLngBounds(coaches.map((c) => c.location.coordinates));
    if (!bounds.isValid()) return;
    map.flyToBounds(bounds, { padding: [60, 60], maxZoom: 7, duration: 0.8 });
  };

  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;
    /* Requisito: ocultar los controles antes de que la siguiente sección
       (p.ej. banda blanca) entre en viewport. Usamos un scroll listener
       que computa qué % del viewport cubre el mapa y oculta por debajo
       del 40%. Además, en móvil, reanclamos la posición vertical al
       fondo del mapa para que el zoom no quede sobre la zona blanca
       cuando el mapa sale por abajo. */
    /* Mínima porción de mapa visible para mostrar el zoom. El valor
       debe ocultarlo antes de que la sección blanca domine el viewport,
       para que el desvanecimiento ocurra sobre mapa (oscuro) y no sobre
       la banda blanca. En móvil el mapa mide 60vh (~487px) así que el
       umbral tiene que ser más bajo para que aparezca desde el inicio;
       en desktop el mapa es mucho más alto (~766px) y podemos pedir
       más visibilidad antes de esconder. */
    const MIN_VISIBLE_PX = window.innerWidth < 961 ? 220 : 380;
    /* Respeto al stack de headers (navbar + sticky program bar ≈ 82-134px). */
    const STICKY_TOP = 100;
    const update = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const visibleH = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
      setVisible(visibleH >= MIN_VISIBLE_PX);
      /* top-from-viewport: pegado al borde superior del mapa mientras
         esté por debajo del sticky; si el mapa se sube y tapa el
         sticky, el zoom se queda justo debajo del sticky. */
      setMobileTopOffset(Math.max(STICKY_TOP, rect.top + 16));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
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
        ...(mobileAnchor ? { top: mobileTopOffset } : { top: topOffset }),
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
      {/* Reset view: solo aparece cuando hay zoom significativo. Devuelve
          el mapa a la vista general (fitBounds de todos los coaches). */}
      {zoomedIn && (
        <button
          type="button"
          onClick={handleResetView}
          aria-label="Ver toda la red"
          title="Ver toda la red"
          style={{ ...btnBase, borderTop: "1px solid rgba(220,175,100,0.15)" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(220,175,100,0.14)"; e.currentTarget.style.color = "#f0c478"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(10,10,10,0.92)"; e.currentTarget.style.color = "#dcaf64"; }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ display: "inline-block", verticalAlign: "middle" }}>
            <path d="M3 8V5a2 2 0 0 1 2-2h3" />
            <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
            <path d="M3 16v3a2 2 0 0 0 2 2h3" />
            <path d="M21 16v3a2 2 0 0 1-2 2h-3" />
          </svg>
        </button>
      )}
    </div>,
    document.body,
  );
}

interface NetworkMapProps {
  /** Lista de coaches a pintar. La página pasa la lista ya filtrada. */
  coaches: readonly Coach[];
  /** Override opcional del handler del botón "Pregunta a J3". Default: dispara evento j3:chat:open. */
  onAsk?: (coach: Coach) => void;
  /** Centro inicial [lat, lng]. Default: Europa occidental. Ignorado si autoFitBounds=true. */
  center?: [number, number];
  /** Zoom inicial. Default: 4. Ignorado si autoFitBounds=true. */
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
  /**
   * Si true, calcula bounds de todos los pines y ajusta el viewport
   * una sola vez al montar. Respeta maxZoom:7 para no sobreacercarse
   * en casos de pocos pines concentrados.
   */
  autoFitBounds?: boolean;
  /** Si true, muestra la mini-leyenda bottom-left. Default: true. */
  showLegend?: boolean;
  /**
   * Clave de filtro externo (p.ej. país). Cuando cambia, el mapa
   * re-ajusta sus bounds a la lista actual de coaches con animación
   * — útil para centrar al seleccionar un país en el filtro.
   */
  focusKey?: string;
  /**
   * Coordenadas del usuario [lat, lng]. Si están presentes, se pinta
   * un pin cyan pulsante y el mapa se recentra automáticamente sobre
   * esa posición con un zoom regional.
   */
  userLocation?: LatLng | null;
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
  autoFitBounds = false,
  showLegend = true,
  userLocation = null,
  focusKey,
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
          <FloatingZoomControls topOffset={floatingZoomTopOffset} coaches={coaches} initialZoom={zoom} />
        ) : (
          <ZoomControl position="topright" />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {autoFitBounds && !userLocation && <AutoFitBounds coaches={coaches} />}
        {focusKey !== undefined && !userLocation && (
          <FocusOnFilter coaches={coaches} trigger={focusKey} />
        )}
        {userLocation && <AutoCenterOnUser location={userLocation} />}
        {userLocation && (
          <UserLocationMarker
            location={userLocation}
            label={labels.youAreHere ?? "You are here"}
          />
        )}
        {showLegend && <MapLegend labels={labels} />}
        <ClusteredMarkers coaches={coaches} labels={labels} onAsk={onAsk} />
      </MapContainer>
    </>
  );
}
