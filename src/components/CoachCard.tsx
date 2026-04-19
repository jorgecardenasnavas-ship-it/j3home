"use client";

/* ──────────────────────────────────────────────
   CoachCard — ficha de coach J3 Recommended.
   Se renderiza en el grid bajo el mapa y como
   resultado de un click en un pin.

   Hover bidireccional pin ↔ card (Sprint D-hover):
   - Al entrar/salir del card se emite un CustomEvent
     global `j3:hover:enter` / `j3:hover:leave` con el
     slug, que NetworkMap escucha para resaltar el pin
     correspondiente.
   - Inversamente, se escuchan esos mismos eventos
     (los dispara el propio marcador al hover) y se
     aplica un estado visual destacado a este card
     cuando el slug coincide.
   ────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import type { Coach } from "@/data/coaches";
import { LanguageChip } from "@/components/LanguageChip";
import { formatDistance, haversineKm, type LatLng } from "@/lib/geo";

interface CoachCardProps {
  coach: Coach;
  labels: {
    badgeHq: string;
    badgeRecommended: string;
    askChatbot: string;
    /** Template "a {km} km de ti". Opcional: solo se muestra si hay userCoords. */
    kmFromYou?: string;
  };
  /** Coordenadas del usuario. Si están presentes, se muestra badge de distancia. */
  userCoords?: LatLng | null;
  onAsk?: (coach: Coach) => void;
}

export default function CoachCard({ coach, labels, userCoords, onAsk }: CoachCardProps) {
  const isHq = coach.tier === "hq";
  const [isHovered, setIsHovered] = useState(false);

  // Escuchar eventos globales del mapa: si el pin del mismo slug
  // está siendo hovered, marcar este card como "is-hovered".
  useEffect(() => {
    const onEnter = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (slug === coach.slug) setIsHovered(true);
    };
    const onLeave = (ev: Event) => {
      const slug = (ev as CustomEvent<{ slug?: string }>).detail?.slug;
      if (slug === coach.slug) setIsHovered(false);
    };
    window.addEventListener("j3:hover:enter", onEnter as EventListener);
    window.addEventListener("j3:hover:leave", onLeave as EventListener);
    return () => {
      window.removeEventListener("j3:hover:enter", onEnter as EventListener);
      window.removeEventListener("j3:hover:leave", onLeave as EventListener);
    };
  }, [coach.slug]);

  const fireEnter = () => {
    window.dispatchEvent(new CustomEvent("j3:hover:enter", { detail: { slug: coach.slug } }));
  };
  const fireLeave = () => {
    window.dispatchEvent(new CustomEvent("j3:hover:leave", { detail: { slug: coach.slug } }));
  };

  return (
    <article
      onMouseEnter={fireEnter}
      onMouseLeave={fireLeave}
      className="group relative flex flex-col theme-surface border theme-border hover:border-[var(--g1)]/40 transition-all duration-300 overflow-hidden"
      data-featured={coach.featured ? "true" : undefined}
      data-hovered={isHovered ? "true" : undefined}
      style={
        isHovered
          ? {
              borderColor: "rgba(220,175,100,0.85)",
              transform: "translateY(-2px)",
              boxShadow: "0 10px 32px rgba(220,175,100,0.18), 0 2px 8px rgba(0,0,0,0.35)",
            }
          : undefined
      }
    >
      {/* Badge superior — gradiente */}
      <span
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent opacity-60 group-hover:opacity-100 transition-opacity"
        aria-hidden
      />

      {/* Foto / placeholder */}
      <div className="relative aspect-[4/3] overflow-hidden theme-surface-alt">
        {coach.photo ? (
          <img
            src={coach.photo}
            alt={coach.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            style={{ filter: "saturate(0.9) brightness(1) contrast(0.97)" }}
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="theme-text opacity-25"
              aria-hidden
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
            </svg>
          </div>
        )}

        {/* Badge tier — HQ y Recommended. Trained no lleva badge:
            su credencial es aparecer en la red J3. */}
        {(isHq || coach.tier === "recommended") && (
          <span
            className="absolute top-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[var(--g1)]/40"
            style={{ borderRadius: 2 }}
          >
            <span className="w-[5px] h-[5px] rounded-full bg-[var(--g1)]" aria-hidden />
            <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
              {isHq ? labels.badgeHq : labels.badgeRecommended}
            </span>
          </span>
        )}

        {/* Badge de distancia — solo visible cuando el usuario ha
            compartido su ubicación. Se pinta arriba-derecha con icono
            de pin para que sea inmediatamente legible. */}
        {userCoords && labels.kmFromYou && (
          <span
            className="absolute top-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 bg-black/75 backdrop-blur-sm border border-[var(--g1)]/50"
            style={{ borderRadius: 2 }}
            aria-label={formatDistance(
              haversineKm(userCoords, coach.location.coordinates),
              labels.kmFromYou,
            )}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--g1)]" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-[10px] font-bold tracking-[1.2px] text-[var(--g1)] font-variant-numeric-tabular">
              {formatDistance(
                haversineKm(userCoords, coach.location.coordinates),
                labels.kmFromYou,
              )}
            </span>
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-4 min-[768px]:p-5">
        <div>
          <h3 className="font-bold text-[15px] min-[768px]:text-[16px] theme-text tracking-[-0.3px] leading-[1.2]">
            {coach.name}
          </h3>
          {coach.role && (
            <p className="text-[11px] theme-text opacity-55 tracking-[1.5px] uppercase mt-1">
              {coach.role}
            </p>
          )}
        </div>

        <div className="flex items-baseline gap-2 text-[12px] theme-text opacity-70">
          <span className="font-medium">{coach.location.city}</span>
          <span className="opacity-50">·</span>
          <span className="opacity-70">{coach.location.country}</span>
        </div>

        {coach.clubs && coach.clubs.length > 0 && (
          <p className="text-[11px] theme-text opacity-55 leading-[1.45]">
            {coach.clubs.join(" · ")}
          </p>
        )}

        {coach.languages && coach.languages.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {coach.languages.map((lng) => (
              <LanguageChip key={lng} code={lng} variant="card" />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => onAsk?.(coach)}
          className="mt-3 inline-flex items-center gap-2 text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] hover:gap-3 transition-all duration-300"
        >
          {labels.askChatbot}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </article>
  );
}
