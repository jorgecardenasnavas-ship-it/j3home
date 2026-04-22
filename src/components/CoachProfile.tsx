"use client";

import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { type Coach, getCoachBadges } from "@/data/coaches";

interface CoachProfileProps {
  coach: Coach;
  relatedCoaches: Coach[];
}

function formatMonthYear(iso: string | undefined, months: readonly string[]) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const m = months[d.getMonth()] ?? "";
  return `${m} ${d.getFullYear()}`;
}

export function CoachProfile({ coach, relatedCoaches }: CoachProfileProps) {
  const { t } = useI18n();
  const badges = getCoachBadges(coach);
  const isHq = coach.type === "lab" || coach.type === "academy";
  const initials = coach.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  const months = t.academy.network.monthShort;
  const memberSince = formatMonthYear(coach.joinedAt, months);
  const certSince = coach.certifiedAt
    ? formatMonthYear(coach.certifiedAt, months)
    : "";

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${coach.location.coordinates[0]},${coach.location.coordinates[1]}`;

  const distinctionKeys = {
    "forma-coaches": t.academy.network.distinctionFormaCoaches,
    "jugadores-circuito": t.academy.network.distinctionJugadoresCircuito,
    multilingue: t.academy.network.distinctionMultilingue,
    "kids-iniciacion": t.academy.network.distinctionKidsIniciacion,
    "juniors-tecnificacion": t.academy.network.distinctionJuniorsTecnificacion,
    "protocolo-familiar": t.academy.network.distinctionProtocoloFamiliar,
    "iniciacion-adulto": t.academy.network.distinctionIniciacionAdulto,
    "reeducacion-tecnica": t.academy.network.distinctionReeducacionTecnica,
    "grupos-mixtos": t.academy.network.distinctionGruposMixtos,
    "bautismo-padel": t.academy.network.distinctionBautismoPadel,
    "experiencia-familiar": t.academy.network.distinctionExperienciaFamiliar,
  } as const;

  const distinctionList = [
    ...(badges.distinctions.map(
      (d) => distinctionKeys[d as keyof typeof distinctionKeys] ?? d,
    )),
    ...(badges.decano ? [t.academy.network.distinctionDecano] : []),
  ];

  const askChatbot = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("j3:chat:open", {
          detail: { context: `coach:${coach.slug}` },
        }),
      );
    }
  };

  return (
    <div className="coach-profile">
      {/* ── Hero ── */}
      <section className="coach-profile-hero">
        <Link href="/academy" className="coach-profile-back">
          <span className="text-[16px] font-light">←</span>
          Volver al mapa
        </Link>

        <div className="coach-profile-hero-inner">
          <div className="coach-profile-photo-wrap">
            {coach.photo ? (
              <img
                src={coach.photo}
                alt={coach.name}
                className="coach-profile-photo"
              />
            ) : (
              <div className="coach-profile-photo coach-profile-photo-initials">
                {initials}
              </div>
            )}
          </div>

          <div className="coach-profile-heading">
            {/* Badges */}
            <div className="coach-profile-badges">
              {isHq && (
                <span className="coach-profile-badge coach-profile-badge-hq">
                  {t.academy.network.badgeHq}
                </span>
              )}
              {!isHq && badges.founder && (
                <span className="coach-profile-badge coach-profile-badge-founder">
                  {t.academy.network.badgeFounder}
                </span>
              )}
              {!isHq && badges.genOne && !badges.founder && (
                <span className="coach-profile-badge coach-profile-badge-genone">
                  {t.academy.network.badgeGenOne}
                </span>
              )}
              {badges.verified && (
                <span className="coach-profile-badge coach-profile-badge-verified">
                  {t.academy.network.badgeVerified}
                </span>
              )}
            </div>

            <h1 className="coach-profile-name">{coach.name}</h1>

            <div className="coach-profile-meta">
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="coach-profile-location"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {coach.location.city}, {coach.location.country}
              </a>
              {memberSince && (
                <span className="coach-profile-joined">
                  {t.academy.network.memberSince.replace("{date}", memberSince)}
                </span>
              )}
            </div>

            {/* Languages */}
            {coach.languages && coach.languages.length > 0 && (
              <div className="coach-profile-languages">
                {coach.languages.map((lang) => (
                  <span key={lang} className="coach-profile-lang-chip">
                    {lang.toUpperCase()}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="coach-profile-content">
        <div className="coach-profile-grid">
          {/* Specialties */}
          {!isHq &&
            coach.specialties &&
            coach.specialties.length > 0 &&
            coach.certificationActive && (
              <div className="coach-profile-block">
                <h3 className="coach-profile-block-title">Especialidades</h3>
                <ul className="coach-profile-chips">
                  {coach.specialties.map((s) => (
                    <li key={s} className="coach-profile-chip">
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {/* Distinctions */}
          {distinctionList.length > 0 && (
            <div className="coach-profile-block">
              <h3 className="coach-profile-block-title">Distinciones</h3>
              <ul className="coach-profile-distinctions">
                {distinctionList.map((d, i) => (
                  <li key={i} className="coach-profile-distinction">
                    <span className="coach-profile-distinction-dot" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Dates */}
          <div className="coach-profile-block">
            <h3 className="coach-profile-block-title">Trayectoria J3</h3>
            <dl className="coach-profile-dates">
              {memberSince && (
                <div>
                  <dt>
                    {t.academy.network.memberSince.replace("{date}", "")}
                  </dt>
                  <dd>{memberSince}</dd>
                </div>
              )}
              {certSince && (
                <div>
                  <dt>
                    {badges.verified
                      ? t.academy.network.certifiedSince.replace("{date}", "")
                      : t.academy.network.qualifiedSince.replace("{date}", "")}
                  </dt>
                  <dd>{certSince}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Clubs */}
          {coach.clubs && coach.clubs.length > 0 && (
            <div className="coach-profile-block">
              <h3 className="coach-profile-block-title">Clubes</h3>
              <ul className="coach-profile-clubs">
                {coach.clubs.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="coach-profile-cta-wrap">
          <button
            type="button"
            onClick={askChatbot}
            className="coach-profile-cta"
          >
            {t.academy.network.askChatbot}
            <span className="text-[18px] font-light">→</span>
          </button>
        </div>

        {/* Socials */}
        {(coach.socials?.instagram ||
          coach.socials?.web ||
          coach.socials?.coach360) && (
          <div className="coach-profile-socials">
            {coach.socials?.web && (
              <a
                href={coach.socials.web}
                target="_blank"
                rel="noopener noreferrer"
                className="coach-profile-social"
              >
                Web →
              </a>
            )}
            {coach.socials?.instagram && (
              <a
                href={`https://instagram.com/${coach.socials.instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="coach-profile-social"
              >
                Instagram →
              </a>
            )}
            {coach.socials?.coach360 && (
              <a
                href={coach.socials.coach360}
                target="_blank"
                rel="noopener noreferrer"
                className="coach-profile-social"
              >
                Coach360 →
              </a>
            )}
          </div>
        )}
      </section>

      {/* ── Related coaches ── */}
      {relatedCoaches.length > 0 && (
        <section className="coach-profile-related">
          <h3 className="coach-profile-related-title">
            Coaches cerca de {coach.location.city}
          </h3>
          <div className="coach-profile-related-grid">
            {relatedCoaches.map((rc) => (
              <Link
                key={rc.slug}
                href={`/coach/${rc.slug}`}
                className="coach-profile-related-card"
              >
                <div className="coach-profile-related-photo-wrap">
                  {rc.photo ? (
                    <img src={rc.photo} alt={rc.name} />
                  ) : (
                    <div className="coach-profile-related-initials">
                      {rc.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                  )}
                </div>
                <div className="coach-profile-related-name">{rc.name}</div>
                <div className="coach-profile-related-city">
                  {rc.location.city}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
