"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  COACHES,
  COACH_COUNTRIES,
  COACH_LANGUAGES,
  COACH_SPECIALTIES,
  sortCoaches,
  filterCoaches,
  parseCoachesFilters,
  buildCoachesUrl,
  type Coach,
  type CoachSpecialty,
} from "@/data/coaches";
import CoachCard from "@/components/CoachCard";
import { FilterSelect } from "@/components/FilterSelect";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";
import { languageLabel } from "@/lib/languages";

function CoachesCatalogContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Orden global: tier → joinedAt. HQ incluido (será el primer resultado si no hay filtro país != España).
  const allCoaches = useMemo(() => sortCoaches(COACHES), []);

  // Estado de filtros = URL.
  const filters = useMemo(() => parseCoachesFilters(searchParams), [searchParams]);

  const filtered = useMemo(
    () => filterCoaches(allCoaches, filters),
    [allCoaches, filters],
  );

  const setFilter = (key: "country" | "language" | "specialty", value: string) => {
    const next = { ...filters, [key]: value };
    router.replace(buildCoachesUrl(next), { scroll: false });
  };

  const resetFilters = () => {
    router.replace("/academy/coaches", { scroll: false });
  };

  const hasAnyFilter =
    filters.country !== "all" || filters.language !== "all" || filters.specialty !== "all";

  const countriesCount = useMemo(
    () => new Set(allCoaches.filter(c => c.tier !== "hq").map(c => c.location.country)).size,
    [allCoaches],
  );
  const languagesCount = useMemo(
    () => new Set(allCoaches.filter(c => c.tier !== "hq").flatMap(c => c.languages ?? [])).size,
    [allCoaches],
  );

  const stats = t.academy.coachesPage.statsTemplate
    .replace("{coaches}", allCoaches.length.toString())
    .replace("{countries}", countriesCount.toString())
    .replace("{languages}", languagesCount.toString());

  const gridLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeRecommended: t.academy.network.badgeRecommended,
    badgeFounder: t.academy.network.badgeFounder,
    specialtyLabel: t.academy.network.specialtyLabel,
    specialtyJuniors: t.academy.network.specialtyJuniors,
    specialtyAdultos: t.academy.network.specialtyAdultos,
    specialtyCompeticion: t.academy.network.specialtyCompeticion,
    specialtyCamps: t.academy.network.specialtyCamps,
    distinctionFormaCoaches: t.academy.network.distinctionFormaCoaches,
    distinctionJugadoresCircuito: t.academy.network.distinctionJugadoresCircuito,
    distinctionMultilingue: t.academy.network.distinctionMultilingue,
    distinctionDecano: t.academy.network.distinctionDecano,
    askChatbot: t.academy.network.askChatbot,
  };

  const specialtyLabel = (s: CoachSpecialty) =>
    s === "juniors"
      ? t.academy.network.specialtyJuniors
      : s === "adultos"
      ? t.academy.network.specialtyAdultos
      : s === "competicion"
      ? t.academy.network.specialtyCompeticion
      : t.academy.network.specialtyCamps;

  const handleAsk = (coach: Coach) => {
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: coach.name,
          coachLocation: `${coach.location.city}, ${coach.location.country}`,
        },
      }),
    );
  };

  return (
    <main className="min-h-screen bg-[var(--bk)] pb-[80px] max-[960px]:pb-[56px]">
      <Navbar />

      {/* Header */}
      <header className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-[120px] pb-10 max-[960px]:pt-[96px] max-[960px]:pb-8">
        <Link
          href="/academy#network"
          className="text-[11px] tracking-[2px] uppercase text-[var(--g1)] hover:underline underline-offset-4 inline-block mb-5"
        >
          {t.academy.coachesPage.backLink}
        </Link>
        <h1 className="font-bold text-[clamp(26px,3vw,42px)] uppercase tracking-[-0.5px] leading-[1.05]" style={{ color: "var(--wh)" }}>
          {t.academy.coachesPage.heading}
        </h1>
        <p className="mt-3 text-[12px] tracking-[2px] uppercase opacity-60" style={{ color: "var(--wh)" }}>
          {stats}
        </p>
      </header>

      {/* Filtros (sticky en scroll) */}
      <div
        className="sticky top-0 z-30 border-y border-white/[.07] backdrop-blur-md"
        style={{ background: "rgba(10,10,10,0.85)" }}
      >
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-4 flex flex-wrap items-center gap-3 max-[960px]:gap-2 text-[12px] max-[960px]:text-[11px]" style={{ color: "var(--wh)" }}>
          <FilterSelect
            label={t.academy.network.filterCountry}
            value={filters.country}
            onChange={(v) => setFilter("country", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_COUNTRIES.map(c => ({ value: c, label: c }))]}
          />
          <FilterSelect
            label={t.academy.network.filterLanguage}
            value={filters.language}
            onChange={(v) => setFilter("language", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_LANGUAGES.map(l => ({ value: l, label: languageLabel(l) }))]}
          />
          <FilterSelect
            label={t.academy.network.filterSpecialty}
            value={filters.specialty}
            onChange={(v) => setFilter("specialty", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_SPECIALTIES.map(s => ({ value: s, label: specialtyLabel(s) }))]}
          />
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] tracking-[2px] uppercase text-[var(--g1)] hover:underline underline-offset-4"
            >
              {t.academy.network.filterReset}
            </button>
          )}
          <span className="ml-auto text-[11px] opacity-55 tracking-[2px] uppercase" style={{ color: "var(--wh)" }}>
            {filtered.length} / {allCoaches.length}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-10">
        {filtered.length === 0 ? (
          <div className="border theme-border px-6 py-14 text-center" style={{ color: "var(--wh)" }}>
            <p className="text-[14px] opacity-80 mb-4">{t.academy.coachesPage.emptyTitle}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] border border-[var(--g1)]/40 hover:border-[var(--g1)] px-5 py-2.5 transition-all duration-300"
              style={{ borderRadius: 2 }}
            >
              {t.academy.coachesPage.emptyCta}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 max-[960px]:gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" }}>
            {filtered.map((c) => (
              <CoachCard
                key={c.slug}
                coach={c}
                labels={gridLabels}
                onAsk={handleAsk}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}

export default function CoachesCatalogPage() {
  // useSearchParams requiere Suspense boundary en App Router.
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bk)]" />}>
      <CoachesCatalogContent />
    </Suspense>
  );
}
