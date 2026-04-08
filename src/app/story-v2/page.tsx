"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * /story-v2 — Pizarra en blanco. Reescritura desde cero del Story.
 *
 * Fase 0 (esto): andamio + hero "vivo desde el primer frame".
 * Próximas fases: transición continua, mask reveals, pinned sections, etc.
 */

export default function StoryV2() {
  return (
    <div className="bg-black text-white">
      <HeroV2 />
      <PlaceholderNext />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO — debe transmitir vida y tensión desde el primer frame, sin scroll.
// ─────────────────────────────────────────────────────────────────────────────

function HeroV2() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLImageElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      // ── ENTRADA "ON LOAD" — corre sin necesidad de scroll ──
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. Letterbox bars retract (cinematic open)
      tl.fromTo(
        [topBarRef.current, bottomBarRef.current],
        { scaleY: 1 },
        { scaleY: 0, duration: 1.4, ease: "power4.inOut" },
        0
      );

      // 2. Ken Burns slow zoom + drift on background — runs from t=0 forever
      gsap.fromTo(
        bgRef.current,
        { scale: 1.18, x: "-2%", y: "1.5%" },
        {
          scale: 1.0,
          x: "0%",
          y: "0%",
          duration: 24,
          ease: "none",
        }
      );

      // 3. Background fade-in from black
      tl.fromTo(
        bgRef.current,
        { opacity: 0, filter: "blur(20px)" },
        { opacity: 1, filter: "blur(0px)", duration: 2.2, ease: "power2.out" },
        0.2
      );

      // ── 4. PELOTA RODANDO — entra en escena antes que el texto ──
      // Empieza fuera de pantalla a la derecha, rodando rápido, y desacelera
      // hasta detenerse en su posición final (ligeramente a la izquierda del centro).
      tl.fromTo(
        ballRef.current,
        {
          opacity: 0,
          xPercent: 220,
          rotate: 0,
          scale: 0.85,
        },
        {
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.6
      ).to(
        ballRef.current,
        {
          xPercent: 0,
          rotate: -1080, // 3 vueltas completas
          scale: 1,
          duration: 2.4,
          ease: "power3.out",
        },
        0.6
      );
      // Pequeño "rebote" al detenerse
      tl.to(
        ballRef.current,
        {
          y: "-=10",
          duration: 0.18,
          ease: "power2.out",
        },
        2.7
      ).to(
        ballRef.current,
        {
          y: "+=10",
          duration: 0.22,
          ease: "bounce.out",
        },
        2.88
      );

      // 5. Eyebrow appears (después de que la pelota se detiene)
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12, letterSpacing: "10px" },
        { opacity: 1, y: 0, letterSpacing: "8px", duration: 1.0 },
        3.1
      );

      // 6. Title words stagger with blur and rise
      const wordEls = wordsRef.current?.querySelectorAll("[data-word]");
      if (wordEls && wordEls.length) {
        tl.fromTo(
          wordEls,
          { opacity: 0, y: 80, filter: "blur(14px)", scale: 1.08 },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.3,
            stagger: 0.11,
            ease: "expo.out",
          },
          3.3
        );
      }

      // 7. Gold hairline draws under title
      tl.fromTo(
        lineRef.current,
        { width: 0, opacity: 0 },
        { width: "100%", opacity: 1, duration: 1.4, ease: "expo.out" },
        4.2
      );

      // 8. Subtitle line fades up
      tl.fromTo(
        subRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1.0 },
        4.4
      );

      // 9. Scroll hint pulsing in
      tl.fromTo(
        scrollHintRef.current,
        { opacity: 0, y: -8 },
        { opacity: 1, y: 0, duration: 0.8 },
        4.9
      );

      // ── SCROLL-DRIVEN — el hero reacciona al scroll mientras sigue vivo ──
      // Background parallax + scale up as you scroll out
      gsap.to(bgRef.current, {
        yPercent: 18,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // Title parallax — moves slower than bg, classic depth
      gsap.to([wordsRef.current, lineRef.current, subRef.current, eyebrowRef.current], {
        yPercent: -40,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Ball parallax — sube más despacio que el bg
      gsap.to(ballRef.current, {
        yPercent: -25,
        rotate: "-=180",
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });

      // Scroll hint disappears as soon as user scrolls
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: 30,
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "10% top",
          scrub: true,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative h-[110vh] w-full overflow-hidden bg-black"
    >
      {/* ── BACKGROUND IMAGE LAYER ── */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{
          backgroundImage: "url('/images/story-v2/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* ── ATMOSPHERIC LAYERS ── */}
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.92) 100%)",
        }}
      />
      {/* Bottom-to-top dark gradient for legibility */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 30%, rgba(0,0,0,0.35) 70%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      {/* Subtle gold ambient at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 55%, rgba(220,175,100,0.12) 0%, transparent 60%)",
        }}
      />
      {/* Film grain via SVG noise */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none mix-blend-overlay"
        style={{ opacity: 0.18 }}
      >
        <filter id="v2-noise">
          <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#v2-noise)" />
      </svg>

      {/* ── BALL ── */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={ballRef}
        src="/images/story-v2/ball.png"
        alt=""
        aria-hidden
        className="absolute z-10 will-change-transform pointer-events-none select-none"
        style={{
          left: "calc(50% - 90px)",
          bottom: "18vh",
          width: "180px",
          height: "180px",
          mixBlendMode: "screen",
          opacity: 0,
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.6))",
        }}
        draggable={false}
      />

      {/* ── LETTERBOX BARS (cinematic open) ── */}
      <div
        ref={topBarRef}
        className="absolute top-0 left-0 right-0 h-[14vh] bg-black z-30 origin-top will-change-transform"
      />
      <div
        ref={bottomBarRef}
        className="absolute bottom-0 left-0 right-0 h-[14vh] bg-black z-30 origin-bottom will-change-transform"
      />

      {/* ── CONTENT ── */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-[1280px] flex flex-col items-center text-center">
          {/* Eyebrow */}
          <div
            ref={eyebrowRef}
            className="text-[10px] max-[960px]:text-[11px] font-bold uppercase text-[var(--g1)] mb-8"
            style={{ letterSpacing: "8px" }}
          >
            <span className="inline-block w-8 h-px bg-[var(--g1)] align-middle mr-3" />
            Desde 2004 · Málaga
            <span className="inline-block w-8 h-px bg-[var(--g1)] align-middle ml-3" />
          </div>

          {/* Title — palabra a palabra con stagger */}
          <h1
            ref={wordsRef}
            aria-label="Más de 20 años dentro del juego"
            className="font-bold uppercase tracking-[-3px] leading-[0.88] text-[clamp(48px,8.4vw,132px)] mb-6"
          >
            <span data-word className="inline-block text-[var(--wh)] mr-[0.16em]">
              Más
            </span>
            <span data-word className="inline-block text-[var(--wh)] mr-[0.16em]">
              de
            </span>
            <span data-word className="inline-block j3-grad-text mr-[0.16em]">
              20
            </span>
            <span data-word className="inline-block j3-grad-text">años</span>
            <br />
            <span data-word className="inline-block text-[var(--wh)] mr-[0.16em]">
              dentro
            </span>
            <span data-word className="inline-block text-[var(--wh)] mr-[0.16em]">
              del
            </span>
            <span data-word className="inline-block font-[var(--font-serif)] italic normal-case j3-grad-text">
              juego.
            </span>
          </h1>

          {/* Gold hairline */}
          <div className="w-full max-w-[420px] flex justify-center">
            <div
              ref={lineRef}
              className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
            />
          </div>

          {/* Subtitle */}
          <p
            ref={subRef}
            className="mt-6 text-[13px] max-[960px]:text-[12px] font-light tracking-[3px] uppercase text-[var(--gy2)] max-w-[640px]"
          >
            La historia de J3Pádel — Jordi · Javi · Jorge
          </p>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute bottom-[6vh] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 will-change-transform"
        >
          <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--gy)]">
            Scroll
          </span>
          <span className="block w-px h-10 bg-gradient-to-b from-[var(--g1)] to-transparent v2-pulse" />
        </div>
      </div>

      {/* keyframes */}
      <style jsx>{`
        :global(.v2-pulse) {
          animation: v2pulse 2.2s ease-in-out infinite;
        }
        @keyframes v2pulse {
          0%, 100% { transform: scaleY(1); opacity: 1; }
          50% { transform: scaleY(0.55); opacity: 0.45; }
        }
      `}</style>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Placeholder section 2 — solo para poder scrollear y ver el parallax salir.
// ─────────────────────────────────────────────────────────────────────────────

function PlaceholderNext() {
  return (
    <section className="relative min-h-[100vh] bg-black flex items-center justify-center px-6">
      <p className="text-[12px] tracking-[4px] uppercase text-[var(--gy)] font-light">
        Próximamente · Fase 1
      </p>
    </section>
  );
}
