"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function CredentialsTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  // Last entry in the milestones array is a stat (11×), not a year.
  const years = t.hero.milestones.slice(0, 5);
  const stat = t.hero.milestones[5];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in");
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="credentials-timeline relative bg-[var(--bk)] py-[16vh] max-[960px]:py-[12vh] px-12 max-[960px]:px-6 overflow-hidden"
    >
      {/* Subtle radial glow on right side */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(220,175,100,.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-[920px] mx-auto">
        {/* Heading — tagline as italic editorial statement */}
        <h2
          className="text-j3-2xl max-[960px]:text-j3-xl font-light italic text-[var(--wh)] leading-[1.15] tracking-[-0.3px] max-w-[640px]"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          {t.hero.tagline}
        </h2>

        {/* Timeline rows */}
        <ol className="timeline-list mt-12 max-[960px]:mt-10 flex flex-col">
          {years.map((m, i) => (
            <li
              key={i}
              className="timeline-row group relative grid grid-cols-[88px_1fr] max-[960px]:grid-cols-[64px_1fr] items-baseline gap-6 max-[960px]:gap-4 py-5 max-[960px]:py-4 border-t border-white/[.06]"
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <span className="text-j3-xl max-[960px]:text-j3-lg font-bold j3-grad-text leading-none whitespace-nowrap">
                {m.year}
              </span>
              <span className="text-j3-base max-[960px]:text-j3-sm font-light text-[var(--gy3)] tracking-[0.2px] leading-[1.4]">
                {m.text}
              </span>
            </li>
          ))}
          <li className="border-t border-white/[.06]" aria-hidden="true" />
        </ol>

        {/* Closing stat — 11× highlight */}
        <div className="stat-row mt-12 max-[960px]:mt-10 flex items-baseline gap-5 max-[960px]:gap-4">
          <span className="text-j3-3xl font-bold j3-grad-text leading-none whitespace-nowrap">
            {stat.year}
          </span>
          <span className="text-j3-lg max-[960px]:text-j3-base font-light text-[var(--wh)] tracking-[-0.1px] leading-[1.3]">
            {stat.text}
          </span>
        </div>
      </div>

      <style jsx>{`
        .credentials-timeline :global(.timeline-row),
        .credentials-timeline :global(.stat-row) {
          opacity: 0;
          transform: translateY(20px);
          transition:
            opacity 0.9s var(--ease-out),
            transform 0.9s var(--ease-out);
        }
        .credentials-timeline.in :global(.timeline-row),
        .credentials-timeline.in :global(.stat-row) {
          opacity: 1;
          transform: translateY(0);
        }
        .credentials-timeline :global(.stat-row) {
          transition-delay: 600ms;
        }
      `}</style>
    </section>
  );
}
