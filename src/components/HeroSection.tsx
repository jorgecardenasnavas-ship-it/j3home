"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HeroClaim } from "@/components/HeroClaim";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const curtain = section.querySelector<HTMLElement>(".hero-curtain");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            curtain?.classList.add("in");
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
    <section
      id="hero"
      ref={heroRef}
      className="min-h-[88vh] relative flex flex-col items-center justify-end pb-20 max-[960px]:pb-14 overflow-hidden"
    >
      {/* Background video */}
      <video
        src="/videos/coach360-higueron.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(14,28,22,0.52)" }} />

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-28 bg-gradient-to-t from-[var(--bk3)] to-transparent" />

      {/* Curtain reveal */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-[var(--bk3)] pointer-events-none" />

      {/* Scroll indicator */}
      <div aria-hidden className="scroll-arrows absolute bottom-8 left-1/2 -translate-x-1/2 z-[5]">
        <svg className="scroll-arrow scroll-arrow-1" width="22" height="11" viewBox="0 0 20 10" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 2 L10 8 L18 2" />
        </svg>
        <svg className="scroll-arrow scroll-arrow-2" width="22" height="11" viewBox="0 0 20 10" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 2 L10 8 L18 2" />
        </svg>
        <svg className="scroll-arrow scroll-arrow-3" width="22" height="11" viewBox="0 0 20 10" fill="none" stroke="#C9A96E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 2 L10 8 L18 2" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-[5] flex flex-col items-center text-center gap-6">
        <span className="text-[11px] font-normal tracking-[5px] uppercase text-[var(--g1)]">
          J3 ACADEMY
        </span>

        <HeroClaim />

        <Link
          href="/academy"
          className="mt-2 px-9 py-[13px] rounded-full border border-[var(--wh)]/60 text-[var(--wh)] text-[11px] tracking-[3px] uppercase no-underline hover:border-[var(--wh)] hover:bg-white/10 transition-all duration-500"
        >
          Descúbrenos
        </Link>
      </div>
    </section>
  );
}
