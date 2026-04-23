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
      className="min-h-[88vh] relative flex flex-col items-center justify-end pb-20 max-[960px]:pb-14 bg-white"
    >
      {/* Curtain reveal */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-white pointer-events-none" />

      {/* Content — eyebrow + claim + CTA */}
      <div className="relative z-[5] flex flex-col items-center text-center gap-6">
        {/* Eyebrow */}
        <span className="text-[11px] font-normal tracking-[5px] uppercase text-[var(--g1)]">
          J3 ACADEMY
        </span>

        {/* Giant title */}
        <HeroClaim />

        {/* Pill CTA */}
        <Link
          href="/academy"
          className="mt-2 px-9 py-[13px] rounded-full border border-[var(--verde)] text-[var(--verde)] text-[11px] tracking-[3px] uppercase no-underline hover:bg-[var(--verde)] hover:text-white transition-all duration-500"
        >
          Descúbrenos
        </Link>
      </div>
    </section>
  );
}
