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
        className="h-screen min-h-[640px] relative overflow-hidden flex flex-col justify-end"
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
            <span className="hero-word block font-bold text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] uppercase tracking-[-3px] leading-[.88] j3-grad-text">
              {t.hero.play}
            </span>
            <span className="hero-word block font-bold text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] uppercase tracking-[-3px] leading-[.88] text-[var(--wh)]">
              {t.hero.coach}
            </span>
            <span className="hero-word block font-bold text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] uppercase tracking-[-3px] leading-[.88] j3-stroke-gold">
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

        {/* Bottom bar */}
        <div className="relative z-[5] px-12 max-[960px]:px-6 pb-14 max-[960px]:pb-11 flex items-end justify-between gap-6 flex-wrap">
          <div className="hero-actions reveal-up flex gap-3">
            <a
              href="#productos"
              className="btn-glow text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer border-none"
              style={{ background: "var(--j3-grad)", color: "#000" }}
            >
              {t.hero.cta1}
            </a>
            <a
              href="/coach360"
              className="text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline transition-all duration-300 cursor-pointer text-[var(--g1)] border border-[rgba(220,175,100,.3)] bg-transparent hover:bg-[rgba(220,175,100,.07)] hover:border-[rgba(220,175,100,.5)]"
            >
              {t.hero.cta2}
            </a>
          </div>
        </div>
      </section>

      {/* Mobile Creds */}
      <div className="hidden max-[960px]:!flex bg-black/90 border-t border-white/[.07] justify-around flex-wrap py-3.5">
        {t.hero.credsMobile.map((cred, idx) => (
          <div key={idx} className="text-center py-1.5 px-2">
            <span className="text-[14px] font-bold j3-grad-text block mb-[3px]">
              {cred.val}
            </span>
            <span className="text-[8px] font-light text-[var(--gy)] tracking-[1px] uppercase block">
              {cred.label}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
