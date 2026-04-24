"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { HeroClaim } from "@/components/HeroClaim";

const VIDEO_START = 16.8;
const VIDEO_END = 35.1;

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
          if (entry.isIntersecting) { curtain?.classList.add("in"); observer.disconnect(); }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const startPlayback = () => {
      video.currentTime = VIDEO_START;
      video.play().catch(() => {});
    };

    const onTimeUpdate = () => {
      if (video.currentTime >= VIDEO_END) {
        video.currentTime = VIDEO_START;
      }
    };

    // readyState >= 1 means metadata already loaded (common on cached/fast loads)
    if (video.readyState >= 1) {
      startPlayback();
    } else {
      video.addEventListener("loadedmetadata", startPlayback);
    }

    video.addEventListener("timeupdate", onTimeUpdate);
    return () => {
      video.removeEventListener("loadedmetadata", startPlayback);
      video.removeEventListener("timeupdate", onTimeUpdate);
    };
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
        src="/videos/higueron-hero.mp4"
        muted
        playsInline
        preload="auto"
        className="absolute inset-x-0 top-0 w-full h-[118%] object-cover [object-position:center_38%]"
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
          SINCE 2004
        </span>

        <HeroClaim />

        <Link
          href="/academy"
          className="mt-2 px-9 py-[13px] rounded-full border border-[var(--wh)]/60 text-[var(--wh)] text-[11px] tracking-[3px] uppercase no-underline hover:border-[var(--wh)] hover:bg-[var(--wh)]/10 transition-all duration-500"
        >
          Descúbrenos
        </Link>
        {/* Espaciador para mantener la posición del botón igual que antes */}
        <div className="h-[34px]" />
      </div>

      {/* Chevrons anclados al borde inferior de la sección */}
      <div aria-hidden className="absolute bottom-7 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-[2px] pointer-events-none">
        {[0, 1, 2].map((i) => (
          <svg
            key={i}
            width="20"
            height="10"
            viewBox="0 0 20 10"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            style={{
              stroke: "#F8F5EF",
              animation: "j3ChevPulse 1.6s cubic-bezier(.4,0,.6,1) infinite",
              animationDelay: `${i * 0.18}s`,
            }}
          >
            <path d="M2 2 L10 8 L18 2" />
          </svg>
        ))}
      </div>
    </section>
  );
}
