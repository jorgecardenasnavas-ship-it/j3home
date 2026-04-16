"use client";

/* ──────────────────────────────────────────────
   CoachCard — ficha de coach J3 Recommended.
   Se renderiza en el grid bajo el mapa y como
   resultado de un click en un pin.
   ────────────────────────────────────────────── */

import type { Coach } from "@/data/coaches";
import { LanguageChip } from "@/components/LanguageChip";

interface CoachCardProps {
  coach: Coach;
  labels: {
    badgeHq: string;
    badgeRecommended: string;
    askChatbot: string;
  };
  onAsk?: (coach: Coach) => void;
}

export default function CoachCard({ coach, labels, onAsk }: CoachCardProps) {
  const isHq = coach.tier === "hq";

  return (
    <article
      className="group relative flex flex-col theme-surface border theme-border hover:border-[var(--g1)]/40 transition-colors duration-300 overflow-hidden"
      data-featured={coach.featured ? "true" : undefined}
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

        {/* Badge tier */}
        <span
          className="absolute top-3 left-3 inline-flex items-center gap-2 px-2.5 py-1 bg-black/70 backdrop-blur-sm border border-[var(--g1)]/40"
          style={{ borderRadius: 2 }}
        >
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--g1)]" aria-hidden />
          <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
            {isHq ? labels.badgeHq : labels.badgeRecommended}
          </span>
        </span>
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
