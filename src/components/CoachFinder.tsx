"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { COACHES } from "@/data/coaches";

const NetworkMap = dynamic(() => import("@/components/NetworkMap"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(circle at 40% 45%, rgba(220,175,100,0.08), transparent 55%), linear-gradient(180deg, #0a0a0a 0%, #0d0d0f 100%)",
      }}
      aria-hidden="true"
    />
  ),
});

export function CoachFinder() {
  const { t } = useI18n();

  const mapLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeFounder: t.academy.network.badgeFounder,
    badgeGenOne: t.academy.network.badgeGenOne,
    badgeVerified: t.academy.network.badgeVerified,
    distinctionFormaCoaches: t.academy.network.distinctionFormaCoaches,
    distinctionJugadoresCircuito: t.academy.network.distinctionJugadoresCircuito,
    distinctionMultilingue: t.academy.network.distinctionMultilingue,
    distinctionDecano: t.academy.network.distinctionDecano,
    distinctionKidsIniciacion: t.academy.network.distinctionKidsIniciacion,
    distinctionJuniorsTecnificacion: t.academy.network.distinctionJuniorsTecnificacion,
    distinctionProtocoloFamiliar: t.academy.network.distinctionProtocoloFamiliar,
    distinctionIniciacionAdulto: t.academy.network.distinctionIniciacionAdulto,
    distinctionReeducacionTecnica: t.academy.network.distinctionReeducacionTecnica,
    distinctionGruposMixtos: t.academy.network.distinctionGruposMixtos,
    distinctionBautismoPadel: t.academy.network.distinctionBautismoPadel,
    distinctionExperienciaFamiliar: t.academy.network.distinctionExperienciaFamiliar,
    monthShort: t.academy.network.monthShort,
    memberSince: t.academy.network.memberSince,
    qualifiedSince: t.academy.network.qualifiedSince,
    certifiedSince: t.academy.network.certifiedSince,
    askChatbot: t.academy.network.askChatbot,
    legendTitle: t.academy.network.legendTitle,
    legendHq: t.academy.network.legendHq,
    legendCoach: t.academy.network.legendCoach,
    legendCoachVerified: t.academy.network.legendCoachVerified,
    legendCoachInProgress: t.academy.network.legendCoachInProgress,
    legendCluster: t.academy.network.legendCluster,
    legendDistinctionsTitle: t.academy.network.legendDistinctionsTitle,
    legendDistGroupProfesional: t.academy.network.legendDistGroupProfesional,
    legendDistGroupKids: t.academy.network.legendDistGroupKids,
    legendDistGroupAmateur: t.academy.network.legendDistGroupAmateur,
    legendDistGroupVacacional: t.academy.network.legendDistGroupVacacional,
    viewInMaps: t.academy.network.viewInMaps,
    youAreHere: t.academy.network.youAreHere,
    inProgressBadge: t.academy.network.inProgressBadge,
    inProgressNote: t.academy.network.inProgressNote,
    stageCoach: t.academy.network.stageCoach,
    stageCoach360: t.academy.network.stageCoach360,
    stageCualificado: t.academy.network.stageCualificado,
    stageVerificado: t.academy.network.stageVerificado,
  };

  return (
    <section
      id="coach-finder"
      className="relative w-full h-[70vh] min-h-[520px] max-[960px]:h-[60vh] max-[960px]:min-h-[460px] overflow-hidden bg-black border-t border-white/[0.06]"
    >
      {/* NetworkMap as background — non-interactive on the home */}
      <div className="absolute inset-0 pointer-events-none">
        <NetworkMap
          coaches={COACHES}
          labels={mapLabels}
          center={[40, -3]}
          zoom={5}
          scrollWheelZoom={false}
          showLegend={false}
        />
      </div>

      {/* Dark gradient overlay for text legibility */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/85 via-black/50 to-black/20 max-[960px]:from-black/90 max-[960px]:via-black/70 max-[960px]:to-black/50" />

      {/* Content — left-aligned on desktop, centered on mobile */}
      <div className="relative z-10 h-full flex flex-col justify-center gap-5 max-w-[620px] px-12 max-[960px]:px-6 max-[960px]:max-w-full">
        <span className="text-[10px] tracking-[4px] uppercase text-[var(--g1)]/70 font-bold">
          {t.home.coachFinder.label}
        </span>
        <h2 className="text-[clamp(40px,5.6vw,82px)] font-black leading-[0.95] tracking-[-2px] text-white">
          {t.home.coachFinder.title}
        </h2>
        <p className="text-[clamp(14px,1.2vw,17px)] text-white/55 font-light leading-[1.5] max-w-[440px]">
          {t.home.coachFinder.subtitle}
        </p>
        <Link
          href="/academy#map"
          className="inline-flex items-center gap-[10px] mt-2 text-[11px] font-bold tracking-[2px] uppercase no-underline text-[var(--g1)] w-fit transition-[gap] duration-200 hover:gap-[18px]"
        >
          {t.home.coachFinder.cta}
          <span className="text-[16px] font-light">→</span>
        </Link>
      </div>
    </section>
  );
}
