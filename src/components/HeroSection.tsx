"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HeroClaim } from "@/components/HeroClaim";

const VIDEO_START = 3;

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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
      className="h-[84vh] max-[960px]:h-[62vh] relative flex flex-col items-center justify-end pb-16 max-[960px]:pb-8 overflow-hidden"
    >
      {/* Video */}
      <video
        ref={videoRef}
        src="/videos/coach360-higueron.mp4"
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-[1.08]"
        onLoadedMetadata={() => { if (videoRef.current) videoRef.current.currentTime = VIDEO_START; }}
        onSeeked={() => { videoRef.current?.play().catch(() => {}); }}
      />

      {/* Overlay */}
      <div className="absolute inset-0" style={{ background: "rgba(14,28,22,0.52)" }} />

      {/* Curtain reveal */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-[var(--bk3)] pointer-events-none" />

      {/* Content + chevrons en flujo */}
      <style>{`
        @keyframes j3ChevPulse {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 1;    }
        }
      `}</style>
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

        {/* Chevrons debajo del botón, en flujo */}
        <div aria-hidden className="flex flex-col items-center gap-[2px] pointer-events-none mt-[-8px]">
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
      </div>
    </section>
  );
}
