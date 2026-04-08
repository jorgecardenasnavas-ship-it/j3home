"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const curtain = section.querySelector<HTMLElement>(".hero-curtain");
    const video = section.querySelector<HTMLVideoElement>(".hero-video");
    const words = section.querySelectorAll<HTMLElement>(".hero-word");
    const shimmer = section.querySelector<HTMLElement>(".hero-shimmer");
    const actions = section.querySelector<HTMLElement>(".hero-actions");
    const timeline = section.querySelector<HTMLElement>(".hero-timeline");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            curtain?.classList.add("in");
            setTimeout(() => video?.classList.add("in"), 600);

            words.forEach((word, i) => {
              setTimeout(() => word.classList.add("in"), 900 + i * 500);
            });

            const wordsEnd = 900 + words.length * 500;
            // Timeline appears first, shimmer syncs with it
            setTimeout(() => timeline?.classList.add("in"), wordsEnd + 200);
            setTimeout(() => shimmer?.classList.add("in"), wordsEnd + 300);
            setTimeout(() => actions?.classList.add("in"), wordsEnd + 700);

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        id="hero"
        ref={heroRef}
        className="h-[92vh] min-h-[640px] relative overflow-hidden flex flex-col justify-end"
      >
        {/* Background Video */}
        <video
          className="hero-video absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-[2000ms] ease-out"
          src="/videos/play_1080.webm"
          autoPlay
          loop
          muted
          playsInline
          style={{ transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}
        />

        {/* Dramatic fade overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,.3) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,.55) 60%, #000 100%)",
          }}
        />

        {/* Black curtain */}
        <div className="hero-curtain absolute inset-0 z-[4] bg-black pointer-events-none" />

        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)]/20 to-transparent z-[5]" />

        {/* Golden shimmer sweep */}
        <div className="hero-shimmer absolute inset-0 z-[3] pointer-events-none opacity-0">
          <div className="hero-shimmer-bar absolute top-0 left-0 w-full h-full" />
        </div>

        {/* Main content — two columns on desktop */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-[55%] z-[5] px-12 max-[960px]:px-6 flex items-start justify-between gap-16 max-[960px]:block">
          {/* Left — Claim */}
          <div className="pointer-events-none">
            <span className="hero-word block font-bold text-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text">
              {t.hero.play}
            </span>
            <span className="hero-word block font-bold text-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)]">
              {t.hero.coach}
            </span>
            <span className="hero-word block font-bold text-hero uppercase tracking-[-3px] leading-[.88] j3-stroke-gold">
              {t.hero.manage}
            </span>
          </div>

          {/* Right — Milestones timeline (desktop only) */}
          <div className="hero-timeline reveal-up hidden min-[961px]:flex flex-col gap-5 pt-2 min-w-[200px]">
            {t.hero.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-sm font-bold j3-grad-text leading-none mt-[2px] whitespace-nowrap">
                  {m.year}
                </span>
                <div className="flex flex-col gap-0">
                  <div className="w-[1px] h-3 bg-[var(--g1)]/30 mb-1 hidden" />
                  <span className="text-xs font-light text-[var(--gy2)] tracking-[1px] leading-[1.3]">
                    {m.text}
                  </span>
                </div>
              </div>
            ))}
            <div className="h-[1px] w-full bg-gradient-to-r from-[var(--g1)]/20 to-transparent mt-1" />
            <span className="text-xs font-light text-[var(--gy)] tracking-[3px] uppercase">
              {t.hero.tagline}
            </span>
          </div>
        </div>

        {/* Bottom bar — "Pádel con acento" brushstroke */}
        <div className="relative z-[5] px-12 max-[960px]:px-6 pb-14 max-[960px]:pb-11">
          <div className="hero-actions reveal-up flex items-start gap-5 max-w-[760px]">
            {/* Vertical gold hairline */}
            <span className="w-px h-[68px] max-[960px]:h-[60px] mt-1 shrink-0 bg-gradient-to-b from-[var(--g1)] via-[var(--g1)]/40 to-transparent" />

            <div className="leading-[1.35]">
              {/* Top line — small uppercase */}
              <span className="block text-base font-light tracking-[1px] uppercase text-[var(--gy3)]">
                {t.hero.accentTouch.topLine}
              </span>

              {/* Big italic gold word + rest of phrase, baseline-aligned */}
              <p className="text-xl font-light text-[var(--gy3)] leading-[1.2] mt-[2px]">
                <span className="text-2xl font-bold italic tracking-[-0.5px] j3-grad-text inline-block pr-[0.18em] align-baseline">
                  {t.hero.accentTouch.accentWord}
                </span>
                {t.hero.accentTouch.afterAccent}
              </p>

              <div className="flex items-center gap-4 mt-4 flex-wrap">
                <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--g1)]/85">
                  {t.hero.accentTouch.labelLeft}
                </span>
                <span className="w-4 h-px bg-[var(--g1)]/25" />
                <span className="text-xs font-bold tracking-[3px] uppercase text-[var(--g1)]/55">
                  {t.hero.accentTouch.labelRight}
                </span>
              </div>
            </div>
          </div>
        </div>


      </section>
    </>
  );
}
