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
        {/* Background — solid black (video removed) */}
        <div className="absolute inset-0 bg-black" />

        {/* Black curtain */}
        <div className="hero-curtain absolute inset-0 z-[4] bg-black pointer-events-none" />

        {/* Gold accent line top */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)]/20 to-transparent z-[5]" />

        {/* Golden shimmer sweep */}
        <div className="hero-shimmer absolute inset-0 z-[3] pointer-events-none opacity-0">
          <div className="hero-shimmer-bar absolute top-0 left-0 w-full h-full" />
        </div>

        {/* Main content — claim */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-[55%] z-[5] px-12 max-[960px]:px-6">
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
        </div>

      </section>
    </>
  );
}
