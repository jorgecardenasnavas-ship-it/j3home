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
            <span className="hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text">
              {t.hero.play}
            </span>
            <span className="hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)]">
              {t.hero.coach}
            </span>
            <span className="hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-stroke-gold">
              {t.hero.manage}
            </span>
          </div>

          {/* Right — Milestones timeline (desktop only) */}
          <div className="hero-timeline reveal-up hidden min-[961px]:flex flex-col gap-5 pt-2 min-w-[200px]">
            {t.hero.milestones.map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-[13px] font-bold j3-grad-text leading-none mt-[2px] whitespace-nowrap">
                  {m.year}
                </span>
                <div className="flex flex-col gap-0">
                  <div className="w-[1px] h-3 bg-[var(--g1)]/30 mb-1 hidden" />
                  <span className="text-[11px] font-light text-[var(--gy2)] tracking-[1px] leading-[1.3]">
                    {m.text}
                  </span>
                </div>
              </div>
            ))}
            <div className="h-[1px] w-full bg-gradient-to-r from-[var(--g1)]/20 to-transparent mt-1" />
            <span className="text-[9px] font-light text-[var(--gy)] tracking-[3px] uppercase">
              {t.hero.tagline}
            </span>
          </div>
        </div>

      </section>
    </>
  );
}
