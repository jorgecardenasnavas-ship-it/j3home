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
      className="h-screen relative flex flex-col items-center justify-end pb-20 max-[960px]:pb-14 overflow-hidden"
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

      {/* Curtain reveal */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-[var(--bk3)] pointer-events-none" />

      {/* Scroll indicator — igual que /academy */}
      <style>{`
        @keyframes j3ChevPulse {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 1;    }
        }
      `}</style>
      <div
        aria-hidden
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-[2px] p-2 pointer-events-none"
      >
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            stroke="#d4b882"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{
              animation: "j3ChevPulse 1.6s cubic-bezier(.4,0,.6,1) infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <path d="M2 2 L10 8 L18 2" />
          </svg>
        ))}
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
