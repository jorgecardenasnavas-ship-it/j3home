"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";


/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

/** Scroll-triggered reveal — fires once */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Multiple items revealed with stagger */
function useStaggerReveal(count: number, threshold = 0.2) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleItems(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, [count, threshold]);

  return { containerRef, itemRefs, visibleItems };
}

/* ═══════════════════════════════════════════════════════
   WHATSAPP HELPERS
   ═══════════════════════════════════════════════════════ */

const WA_BASE = "https://wa.me/34XXXXXXXXX";

function waLink(msg: string) {
  return `${WA_BASE}?text=${encodeURIComponent(msg)}`;
}

/** Inline WhatsApp SVG icon — 14x14 */
function WaIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   ANIMATED COUNTER
   ═══════════════════════════════════════════════════════ */

function Counter({ val, prefix, suffix, label }: { val: number; prefix?: string; suffix?: string; label?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setStarted(true); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started || label) return;
    const dur = 1200;
    const steps = 30;
    const inc = val / steps;
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setCount(Math.min(Math.round(inc * i), val));
      if (i >= steps) clearInterval(iv);
    }, dur / steps);
    return () => clearInterval(iv);
  }, [started, val, label]);

  return (
    <span ref={ref} className="font-bold text-[clamp(36px,6vw,72px)] j3-grad-text leading-[1] block">
      {label || `${prefix || ""}${count}${suffix || ""}`}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════
   S1 — HERO CAROUSEL (3 slides: Juniors · Adultos · Intensive)
   ═══════════════════════════════════════════════════════ */

/* ── J3 Ball icon — extracted from logo-gold.svg ── */
function J3Ball({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 -5 155 215"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="j3bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#dcaf64" />
          <stop offset=".23" stopColor="#eddb7e" />
          <stop offset=".29" stopColor="#fff1b4" />
          <stop offset=".59" stopColor="#eede80" />
          <stop offset=".78" stopColor="#deb065" />
          <stop offset="1" stopColor="#dcaf64" />
        </linearGradient>
      </defs>

      {/* ── Ball (always visible) ── */}
      <g>
        {/* Outer ring + seams */}
        <path fill="url(#j3bg)" d="M74.13,0c-99.18,1.72-98.49,148.91-.03,150.44,99.53-2.75,98.92-148.04.03-150.44ZM131.88,86.77c-14.47,68.36-115.43,59.57-116.69-11.57C17.88-9.88,145.93,2.79,131.88,86.77Z" />
        {/* Quadrant fills */}
        <path fill="url(#j3bg)" d="M68.83,30.97c-19.79,1.66-37.93,20.27-39.09,40.06,25.38-.94,49.5,23.19,48.56,48.56,19.79-1.16,38.4-19.3,40.06-39.09-12.75.21-25.57-4.53-35.29-14.25-9.71-9.71-14.45-22.54-14.25-35.29Z" />
        <path fill="url(#j3bg)" d="M77.28,30.77c-1.47,21.83,19.47,42.76,41.29,41.29-.69-20.97-20.33-40.6-41.29-41.29Z" />
        <path fill="url(#j3bg)" d="M29.75,79.48c1.21,20.15,19.96,38.91,40.12,40.11.75-20.96-19.16-40.87-40.12-40.11Z" />
        {/* Inner cutouts (background holes) */}
        <path fill="var(--bk, #000)" d="M15.19,75.2c1.26,71.14,102.22,79.93,116.69,11.57C145.93,2.79,17.88-9.88,15.19,75.2ZM69.87,119.59c-20.15-1.21-38.9-19.97-40.12-40.11,20.96-.76,40.87,19.15,40.12,40.11ZM78.31,119.59c.93-25.37-23.19-49.5-48.56-48.56,1.16-19.79,19.29-38.4,39.09-40.06-.21,12.75,4.53,25.58,14.25,35.29,9.71,9.71,22.53,14.45,35.29,14.25-1.65,19.79-20.27,37.93-40.06,39.09ZM77.28,30.77c20.97.7,40.6,20.32,41.29,41.29-21.82,1.47-42.76-19.47-41.29-41.29Z" />
      </g>

      {/* ── Legs (hidden by default, visible on hover) ── */}
      <g className="j3-ball-legs">
        <path fill="url(#j3bg)" d="M24.26,200.51h25.34l9.18-43.08c-8.22-1.53-16.18-4.32-23.59-8.23l-10.93,51.31Z" />
        <path fill="url(#j3bg)" d="M70.55,158.77l-8.88,41.75h25.33l9.52-44.72c-7.26,2.02-14.8,3.09-22.42,3.09-1.18,0-2.37-.07-3.55-.12Z" />
        <path fill="url(#j3bg)" d="M127.02,140.02c-5.36,4.38-11.23,8.04-17.44,10.95l-10.53,49.56,25.35-.02,15.69-73.91c-3.83,4.92-8.2,9.44-13.07,13.42Z" />
      </g>
    </svg>
  );
}

type SlideImage = { src: string; pos: string; mobilePos?: string };

const HERO_SLIDES: {
  key: string;
  images: SlideImage[];
  labelKey: "juniorsLabel" | "adultosLabel" | "intensiveLabel";
  tagline: string;
  waMsg: string;
}[] = [
  {
    key: "juniors",
    images: [
      { src: "/images/academy/kinder.jpeg", pos: "center", mobilePos: "70% center" },
      { src: "/images/academy/kids.jpeg", pos: "center" },
      { src: "/images/academy/gemita.jpeg", pos: "center 25%" },
      { src: "/images/academy/nextgen.jpeg", pos: "center" },
      { src: "/images/academy/nextgen-pro.jpeg", pos: "center" },
    ],
    labelKey: "juniorsLabel" ,
    tagline: "4 – 16+ años",
    waMsg: "Hola, quiero info sobre los programas Juniors",
  },
  {
    key: "adultos",
    images: [
      { src: "/images/academy/amateur.jpeg", pos: "center 12%" },
      { src: "/images/academy/pro.jpeg", pos: "center" },
      { src: "/images/academy/elena.jpeg", pos: "center 40%" },
    ],
    labelKey: "adultosLabel" ,
    tagline: "Amateur · Pro",
    waMsg: "Hola, quiero info sobre los programas Adultos",
  },
  {
    key: "intensive",
    images: [
      { src: "/images/academy/stage-group.jpeg", pos: "center 28%", mobilePos: "center 65%" },
    ],
    labelKey: "intensiveLabel" ,
    tagline: "Camps · Stages · A medida",
    waMsg: "Hola, quiero info sobre Intensive Training",
  },
];

const AUTO_ADVANCE_MS = 3500;

function HeroSection() {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 961);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /* Rotate image each time a slide leaves — delayed until swipe finishes */
  const [imgIndex, setImgIndex] = useState<number[]>(HERO_SLIDES.map(() => 0));
  const prevActive = useRef(0);
  useEffect(() => {
    const leaving = prevActive.current;
    prevActive.current = active;
    if (leaving !== active && HERO_SLIDES[leaving].images.length > 1) {
      const id = setTimeout(() => {
        setImgIndex(prev => {
          const next = [...prev];
          next[leaving] = (next[leaving] + 1) % HERO_SLIDES[leaving].images.length;
          return next;
        });
      }, 1100); /* after swipe animation (1000ms) completes */
      return () => clearTimeout(id);
    }
  }, [active]);

  /* Boot animation delay */
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  /* Start progress + auto-advance */
  const startAutoPlay = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(0);
    const step = 50; /* update every 50ms */
    const steps = AUTO_ADVANCE_MS / step;
    let tick = 0;
    progressRef.current = setInterval(() => {
      tick++;
      setProgress(tick / steps);
      if (tick >= steps) {
        if (progressRef.current) clearInterval(progressRef.current);
      }
    }, step);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_ADVANCE_MS);
  };

  useEffect(() => {
    startAutoPlay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Restart progress bar on slide change */
  useEffect(() => {
    setProgress(0);
    if (progressRef.current) clearInterval(progressRef.current);
    const step = 50;
    const steps = AUTO_ADVANCE_MS / step;
    let tick = 0;
    progressRef.current = setInterval(() => {
      tick++;
      setProgress(tick / steps);
      if (tick >= steps) {
        if (progressRef.current) clearInterval(progressRef.current);
      }
    }, step);
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [active]);

  const goTo = (i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(prev => (prev + 1) % HERO_SLIDES.length);
    }, AUTO_ADVANCE_MS);
  };

  const labels: Record<string, string> = {
    juniorsLabel: t.academy.programs.juniorsLabel,
    adultosLabel: t.academy.programs.adultosLabel,
    intensiveLabel: t.academy.programs.intensiveLabel,
  };

  return (
    <section className="relative h-screen min-h-[580px] overflow-hidden bg-black">
      {/* ── Slides — crossfade stack ── */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.key}
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: active === i ? 1 : 0,
            transition: "opacity 1.2s ease",
            zIndex: active === i ? 1 : 0,
          }}
        >
          <Image
            src={slide.images[imgIndex[i]].src}
            alt={labels[slide.labelKey]}
            fill
            sizes="100vw"
            quality={90}
            priority={i === 0}
            className="object-cover transition-transform duration-[7000ms] ease-out"
            style={{
              opacity: 0.7,
              filter: "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)",
              transform: active === i ? "scale(1.08)" : "scale(1)",
              objectPosition: (isMobile && slide.images[imgIndex[i]].mobilePos) || slide.images[imgIndex[i]].pos,
            }}
          />
          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: slide.key === "intensive"
                ? "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,.08) 55%, rgba(0,0,0,.10) 100%)"
                : "linear-gradient(to top, rgba(0,0,0,.90) 0%, rgba(0,0,0,.40) 40%, rgba(0,0,0,.15) 100%)",
            }}
          />
        </div>
      ))}

      {/* ── Content — lower center ── */}
      <div
        className="absolute inset-0 z-10 flex flex-col justify-end"
        style={{
          opacity: ready ? 1 : 0,
          transition: "opacity .8s ease .3s",
        }}
      >
        <div className="px-12 max-[960px]:px-6 pb-[120px] min-[961px]:pb-[100px] w-full max-w-[1200px] mx-auto text-center">
          {/* Slide content — crossfade */}
          <div className="relative min-h-[180px] max-[960px]:min-h-[160px]">
            {HERO_SLIDES.map((slide, i) => (
              <div
                key={slide.key}
                className="absolute inset-0 flex flex-col justify-end items-center"
                style={{
                  opacity: active === i ? 1 : 0,
                  transform: active === i ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                  filter: active === i ? "blur(0px)" : "blur(6px)",
                  transition: active === i
                    ? "opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1), filter .8s ease"
                    : "opacity .5s ease, transform .5s ease, filter .5s ease",
                  pointerEvents: active === i ? "auto" : "none",
                  visibility: active === i ? "visible" : "hidden",
                }}
              >
                {/* Tag */}
                <span className="text-[12px] font-medium tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[11px] max-[960px]:tracking-[3px]">
                  {slide.tagline}
                </span>

                {/* Title */}
                <h1
                  className={`font-bold uppercase tracking-[-3px] leading-[.90] text-[var(--wh)] ${
                    slide.key === "intensive"
                      ? "text-[clamp(40px,8vw,100px)] max-[960px]:text-[clamp(36px,11vw,72px)]"
                      : "text-[clamp(56px,10vw,140px)] max-[960px]:text-[clamp(44px,14vw,100px)]"
                  }`}
                >
                  {labels[slide.labelKey]}
                </h1>
              </div>
            ))}
          </div>

          {/* CTA — animate then scroll to programs */}
          <button
            type="button"
            onClick={(e) => {
              const btn = e.currentTarget;
              const legs = btn.querySelectorAll<HTMLElement>(".j3-ball-legs");
              const line = btn.querySelector(".j3-cta-line") as HTMLElement;
              const ballSvgs = btn.querySelectorAll<SVGElement>(".j3-ball-wrap svg");

              const isDesktop = window.matchMedia("(hover: hover)").matches;

              if (isDesktop) {
                /* Desktop: quick flash → instant scroll */
                if (line) { line.style.scale = "1 1"; line.style.transition = "scale .15s ease-out"; }
                legs.forEach((leg) => { leg.style.opacity = "1"; leg.style.transform = "translateY(0)"; leg.style.transition = "all .15s ease-out"; });
                ballSvgs.forEach((svg) => { svg.style.filter = "brightness(1.6) saturate(0.2)"; svg.style.transition = "filter .15s ease-out"; });
                setTimeout(() => {
                  document.getElementById("programas")?.scrollIntoView({ behavior: "smooth" });
                }, 180);
                setTimeout(() => {
                  legs.forEach((leg) => { leg.style.opacity = ""; leg.style.transform = ""; leg.style.transition = ""; });
                  ballSvgs.forEach((svg) => { svg.style.filter = ""; svg.style.transition = ""; });
                  if (line) { line.style.scale = ""; line.style.transition = ""; }
                }, 1500);
              } else {
                /* Mobile: sequential animation → scroll */
                if (line) {
                  line.style.scale = "1 1";
                  line.style.transition = "scale .6s cubic-bezier(.22,1,.36,1)";
                }
                setTimeout(() => {
                  legs.forEach((leg) => { leg.style.opacity = "1"; leg.style.transform = "translateY(0)"; leg.style.transition = "all .45s cubic-bezier(.22,1,.36,1)"; });
                  ballSvgs.forEach((svg) => { svg.style.filter = "brightness(1.6) saturate(0.2)"; svg.style.transition = "filter .45s ease"; });
                }, 540);
                setTimeout(() => {
                  document.getElementById("programas")?.scrollIntoView({ behavior: "smooth" });
                }, 920);
                setTimeout(() => {
                  legs.forEach((leg) => { leg.style.opacity = ""; leg.style.transform = ""; leg.style.transition = ""; });
                  ballSvgs.forEach((svg) => { svg.style.filter = ""; svg.style.transition = ""; });
                  if (line) { line.style.scale = ""; line.style.transition = ""; }
                }, 2000);
              }
            }}
            className="group/cta inline-flex items-center gap-3 cursor-pointer w-fit mx-auto mt-4"
          >
            <span className="relative text-[13px] font-semibold tracking-[3px] uppercase text-[var(--g1)]">
              {t.academy.hero.ctaLabel}
              <span className="j3-cta-line absolute left-0 -bottom-[5px] h-[1.5px] w-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] origin-left scale-x-[0.4] group-hover/cta:scale-x-100 transition-transform duration-700 ease-out" />
            </span>
            <span className="j3-ball-wrap w-[22px] h-[22px] group-hover/cta:w-[28px] group-hover/cta:h-[28px] transition-all duration-500 ease-out">
              <J3Ball className="w-full h-full" />
            </span>
          </button>

          {/* ── Leg navigation (3 patas del logo — progress fill) ── */}
          <div className="flex items-end justify-center gap-[4px] mt-8 min-[961px]:scale-[1.3] min-[961px]:mt-10">
            {HERO_SLIDES.map((_, i) => {
              const isActive = active === i;
              const isPast = i < active;
              /* Real leg paths from the J3 logo, translated to own viewBox */
              const paths = [
                "M0,51.31h25.34l9.18-43.08c-8.22-1.53-16.18-4.32-23.59-8.23L0,51.31Z",
                "M8.88,2.97l-8.88,41.75h25.33l9.52-44.72c-7.26,2.02-14.8,3.09-22.42,3.09-1.18,0-2.37-.07-3.55-.12Z",
                "M27.97,13.42c-5.36,4.38-11.23,8.04-17.44,10.95L0,73.93l25.35-.02L41.04,0c-3.83,4.92-8.2,9.44-13.07,13.42Z",
              ];
              const widths = [35, 35, 42];
              const heights = [52, 45, 74];
              /* Fill from bottom: clipPath reveals gold as progress advances */
              const fillPct = isActive ? progress : isPast ? 1 : 0;
              return (
                <button
                  key={i}
                  aria-label={`Slide ${i + 1}`}
                  onClick={() => goTo(i)}
                  className="transition-all duration-500 ease-out"
                  style={{
                    opacity: isActive || isPast ? 1 : 0.4,
                    transform: isActive ? "scaleY(1.1)" : "scaleY(1)",
                    transformOrigin: "bottom",
                  }}
                >
                  <svg width={14} height={Math.round(heights[i] * 14 / widths[i])} viewBox={`0 0 ${widths[i]} ${heights[i]}`}>
                    <defs>
                      <linearGradient id={`legGold${i}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#dcaf64" />
                        <stop offset=".5" stopColor="#fff1b4" />
                        <stop offset="1" stopColor="#dcaf64" />
                      </linearGradient>
                      <clipPath id={`legClip${i}`}>
                        <rect x="0" y={heights[i] * (1 - fillPct)} width={widths[i]} height={heights[i] * fillPct} />
                      </clipPath>
                    </defs>
                    {/* Base — white subtle */}
                    <path d={paths[i]} fill="rgba(255,255,255,0.25)" />
                    {/* Gold fill — clipped by progress */}
                    <path d={paths[i]} fill={`url(#legGold${i})`} clipPath={`url(#legClip${i})`} />
                  </svg>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Bottom banner — "repetir · ajustar · avanzar" ── */}
        <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/[.06]" style={{ background: "linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)" }}>
          <div className="flex items-center justify-center gap-8 max-[640px]:gap-5 py-5 max-[960px]:py-4">
            <span className="text-[13px] max-[640px]:text-[11px] font-semibold tracking-[6px] max-[640px]:tracking-[3px] uppercase text-white/60">
              {t.academy.hero.titleLine1.replace(".", "")}
            </span>
            <span className="text-[var(--g1)]/40 text-[8px]">·</span>
            <span className="text-[13px] max-[640px]:text-[11px] font-semibold tracking-[6px] max-[640px]:tracking-[3px] uppercase text-white/60">
              {t.academy.hero.titleLine2.replace(".", "")}
            </span>
            <span className="text-[var(--g1)]/40 text-[8px]">·</span>
            <span className="text-[13px] max-[640px]:text-[11px] font-semibold tracking-[6px] max-[640px]:tracking-[3px] uppercase j3-grad-text">
              {t.academy.hero.titleLine3b.replace(".", "")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S1b — CLAIM (white band)
   ═══════════════════════════════════════════════════════ */

function ClaimSection() {
  const { ref, visible } = useReveal(0.15);

  return (
    <section className="bg-white py-[80px] max-[960px]:py-[56px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-black/[.06] overflow-hidden">
      <div
        ref={ref}
        className="max-w-[900px] mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <h2 className="font-bold text-[clamp(32px,5vw,64px)] uppercase tracking-[-2px] leading-[1.05] text-black">
          La academia de{" "}
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case tracking-[-0.5px]">referencia</span>
          <br />
          en la Costa del Sol.
        </h2>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S2 — STATEMENT (scroll-triggered typography)
   ═══════════════════════════════════════════════════════ */

function StatementSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  /* Visual styles per line — kept in component since they're presentation, not copy */
  const lineStyles: { style: string; accentStyle?: string; align: string }[] = [
    { style: "j3-grad-text", accentStyle: "font-[var(--font-serif)] italic normal-case", align: "text-left" },
    { style: "j3-stroke", accentStyle: "font-[var(--font-serif)] italic normal-case j3-stroke", align: "text-right" },
    { style: "text-[var(--wh)]", accentStyle: "font-[var(--font-serif)] italic normal-case j3-grad-text", align: "text-left pl-[8%] max-[960px]:pl-0" },
  ];

  const lines = t.academy.statement.lines.map((l, i) => ({ ...l, ...lineStyles[i] }));

  const { itemRefs, visibleItems } = useStaggerReveal(lines.length, 0.2);

  return (
    <section className="relative bg-[var(--bk2)] py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.07] overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(220,175,100,.04) 0%, transparent 70%)" }} />

      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Eyebrow */}
        <div
          ref={ref}
          className="mb-14 max-[960px]:mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: "all 0.8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
            {t.academy.statement.eyebrow}
          </span>
        </div>

        {lines.map((line, i) => (
          <div key={i}>
            <div
              ref={el => { itemRefs.current[i] = el; }}
              className={`${line.align} mb-6 max-[960px]:mb-4 last:mb-0`}
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(40px)",
                filter: visibleItems[i] ? "blur(0px)" : "blur(8px)",
                transition: `all 1s cubic-bezier(.16,1,.3,1) ${i * 0.25}s`,
              }}
            >
              <span className={`${line.style} font-bold text-[clamp(44px,8vw,120px)] uppercase tracking-[-2px] leading-[1.05] inline-block`}>
                {line.before}
              </span>
              {line.accent && (
                <>
                  <span className="inline-block w-[0.25em]" />
                  <span className={`${line.accentStyle || line.style} font-bold text-[clamp(44px,8vw,120px)] tracking-[-1px] leading-[1.05] inline-block`}>
                    {line.accent}
                  </span>
                </>
              )}
            </div>

            {/* Gold divider between lines */}
            {i < lines.length - 1 && (
              <div
                className="flex justify-center my-4 max-[960px]:my-2"
                style={{
                  opacity: visibleItems[i] ? 0.25 : 0,
                  transition: `opacity 0.8s ease ${i * 0.25 + 0.5}s`,
                }}
              >
                <div className="w-[60px] h-px bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S3 — PROOF (emotional social proof)
   ═══════════════════════════════════════════════════════ */

function ProofSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);
  const players = t.academy.proof.players;

  const { itemRefs, visibleItems } = useStaggerReveal(players.length, 0.2);

  return (
    <section ref={ref} className="relative bg-[var(--bk)] py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.07] overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 max-[960px]:grid-cols-1 gap-16 max-[960px]:gap-10 items-center">
        {/* Left — image placeholder */}
        <div
          className="aspect-[3/4] max-[960px]:aspect-[16/10] rounded-lg overflow-hidden relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-40px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <img
            src="/images/proof-players.jpg"
            alt={t.academy.proof.imageAlt}
            className="w-full h-full object-cover object-[center_20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 max-[960px]:bg-gradient-to-b max-[960px]:from-transparent max-[960px]:via-transparent max-[960px]:to-black/70" />
        </div>

        {/* Right — content */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(40px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.15s",
          }}
        >
          {/* Eyebrow */}
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-6 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
            {t.academy.proof.eyebrow}
          </span>

          {/* Quote */}
          <blockquote className="font-[var(--font-serif)] italic text-[clamp(24px,3.5vw,42px)] leading-[1.25] tracking-[-0.5px] mb-10">
            <span className="text-[var(--wh)]">{t.academy.proof.quoteOpen}</span>
            <span className="j3-grad-text inline-block pr-[0.15em] py-[0.1em] -mr-[0.15em]">{t.academy.proof.quoteAccent}</span>
            <span className="text-[var(--wh)]">{t.academy.proof.quoteClose}</span>
          </blockquote>

          {/* Player names — subtle, secondary */}
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {players.map((p, i) => (
              <span
                key={i}
                ref={el => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                className="text-[13px] font-medium text-[var(--gy2)] tracking-[0.5px]"
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(8px)",
                  transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
                }}
              >
                {p.name}{i < players.length - 1 && <span className="text-[var(--g1)]/30 ml-5">{"\u00B7"}</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S4 — PERFILES (Apple-style program grid)
   ═══════════════════════════════════════════════════════ */

/* Program card component */
function ProgramCard({
  tag, title, sub, featured, ctas, index, visible, light, image,
}: {
  tag: string;
  title: string;
  sub: string;
  featured?: boolean;
  ctas: { label: string; href: string; ghost?: boolean }[];
  index: number;
  visible: boolean;
  light?: boolean;
  image?: string;
}) {
  return (
    <div
      className={`relative group overflow-hidden ${
        image
          ? "min-h-[380px] max-[960px]:min-h-[320px] flex flex-col justify-end"
          : ""
      } ${
        !image
          ? light
            ? featured
              ? "bg-white border border-[var(--g1)]/20 shadow-[0_2px_20px_rgba(0,0,0,.06)]"
              : "bg-[#f0f0f0] border border-black/[.06]"
            : featured
              ? "bg-[var(--bk2)] border border-[var(--g1)]/20"
              : "bg-[var(--bk)] border border-white/[.07]"
          : "border border-white/[.07]"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${index * 0.12}s`,
      }}
    >
      {/* Background image */}
      {image && (
        <>
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
        </>
      )}

      {/* Gold accent line — top */}
      <div
        className={`absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-out z-10 ${
          featured ? "w-full opacity-50 group-hover:opacity-80" : ""
        }`}
        style={featured ? {} : { width: "40px" }}
      />
      {/* Hover glow (desktop) */}
      {!image && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
          style={{ background: `radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(220,175,100,${light ? "0.06" : "0.04"}), transparent 40%)` }}
        />
      )}

      <div className={`relative z-10 ${image ? "p-8 max-[960px]:p-6 mt-auto" : "p-8 max-[960px]:p-6"}`}>
        <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)] block mb-2">{tag}</span>
        <h4 className={`font-bold text-[clamp(28px,4vw,44px)] uppercase tracking-[-1.5px] leading-[1] mb-2 ${light && !image ? "text-[var(--bk)]" : "text-[var(--wh)]"}`}>{title}</h4>
        <p className={`text-[13px] tracking-[0.5px] mb-8 ${light && !image ? "text-[var(--gy)]" : "text-[var(--gy2)]"}`}>{sub}</p>

        <div className="flex flex-wrap gap-3">
          {ctas.map((cta, ci) => (
            <a
              key={ci}
              href={cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`j3-press inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[12px] font-semibold tracking-[0.5px] ${
                cta.ghost
                  ? "btn-ghost border border-white/15 text-[var(--wh)] hover:border-[var(--g1)]/40 hover:text-[var(--g1)]"
                  : "btn-glow text-black"
              }`}
              style={cta.ghost ? {} : { background: "var(--j3-grad)" }}
            >
              {!cta.ghost && <WaIcon size={12} />}
              {cta.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function PerfilesSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  /* Juniors cards — visual data merged with i18n strings */
  const juniorsImages = [
    "/images/academy/kinder.jpeg",
    "/images/academy/kids.jpeg",
    "/images/academy/nextgen.jpeg",
    "/images/academy/nextgen-pro.jpeg",
  ];
  const juniorsFeatured = [false, false, true, false];
  const juniorsCards = t.academy.programs.juniorsCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    featured: juniorsFeatured[i],
    image: juniorsImages[i],
    ctas: [{ label: c.ctaLabel, href: waLink(c.waMsg) }],
  }));
  const { itemRefs: jRefs, visibleItems: jVis } = useStaggerReveal(juniorsCards.length, 0.15);

  /* Adultos cards */
  const adultosImages = ["/images/academy/amateur.jpeg", "/images/academy/pro.jpeg"];
  const adultosFeatured = [false, true];
  const adultosCards = t.academy.programs.adultosCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    featured: adultosFeatured[i],
    image: adultosImages[i],
    ctas: [{ label: c.ctaLabel, href: waLink(c.waMsg) }],
  }));
  const { itemRefs: aRefs, visibleItems: aVis } = useStaggerReveal(adultosCards.length, 0.15);

  /* Intensive Training — standalone reveal */
  const itReveal = useReveal(0.15);

  return (
    <section id="programas" className="relative bg-[var(--bk)] py-[100px] max-[960px]:py-[72px] overflow-hidden">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-[640px]:px-4 max-w-[1200px] mx-auto mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
          {t.academy.programs.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
          <span className="text-[var(--wh)]">{t.academy.programs.headingPre}</span>
          <span className="j3-grad-text">{t.academy.programs.headingAccent}</span>
        </h2>
      </div>

      {/* Block 1: Juniors — dark */}
      <div className="bg-[var(--bk)] border-t border-white/[.07]">
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.07]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">01</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.juniorsLabel}</span>
        </div>
        {/* Cards grid */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-10 grid grid-cols-2 max-[960px]:grid-cols-1 gap-5">
          {juniorsCards.map((c, i) => (
            <div key={i} ref={el => { jRefs.current[i] = el; }}>
              <ProgramCard {...c} index={i} visible={jVis[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* Block 2: Adultos */}
      <div className="bg-[var(--bk)] border-t border-white/[.07]">
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.07]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">02</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.adultosLabel}</span>
        </div>
        {/* Cards grid */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-10 grid grid-cols-2 max-[960px]:grid-cols-1 gap-5">
          {adultosCards.map((c, i) => (
            <div key={i} ref={el => { aRefs.current[i] = el; }}>
              <ProgramCard {...c} index={i} visible={aVis[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* Block 3: Intensive Training — hero-style standalone */}
      <div className="bg-[var(--bk)] border-t border-white/[.07]">
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.07]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">03</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.intensiveLabel}</span>
        </div>

        <div
          ref={itReveal.ref}
          className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-16 max-[960px]:py-12"
          style={{
            opacity: itReveal.visible ? 1 : 0,
            transform: itReveal.visible ? "none" : "translateY(30px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="relative overflow-hidden p-12 max-[960px]:p-6 border border-[var(--g1)]/20 min-h-[650px] max-[960px]:min-h-[600px] flex flex-col justify-end">
            {/* Background image */}
            <img
              src="/images/academy/stage-group.jpeg"
              alt={t.academy.programs.intensiveImageAlt}
              className="absolute inset-0 w-full h-full object-cover object-[center_25%]"
              style={{ opacity: 0.45 }}
            />
            {/* Dark overlay — lighter at top to show photo, darker at bottom for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/10" />

            {/* Full-width gold accent */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] opacity-60 z-10" />

            <div className="relative z-10 text-center">
              <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
                {t.academy.programs.intensiveEyebrow}
              </span>

              <h3 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1] mb-3">
                <span className="text-[var(--wh)]">{t.academy.programs.intensiveTitlePre}</span>
                <br />
                <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.intensiveTitleAccent}</span>
              </h3>

              <p className="text-[clamp(14px,1.5vw,17px)] text-[var(--gy2)] leading-[1.5] font-light mb-6">
                {t.academy.programs.intensiveDesc}
              </p>

              <div className="flex flex-wrap gap-3 justify-center">
                <a
                  href={waLink(t.academy.programs.intensiveWaMsgBook)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="j3-press btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.5px] text-black"
                  style={{ background: "var(--j3-grad)" }}
                >
                  <WaIcon size={13} />
                  {t.academy.programs.intensiveCtaBook}
                </a>
                <a
                  href={waLink(t.academy.programs.intensiveWaMsgInfo)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="j3-press btn-ghost inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/15 text-[13px] font-semibold tracking-[0.5px] text-[var(--wh)] hover:border-[var(--g1)]/40 hover:text-[var(--g1)]"
                >
                  {t.academy.programs.intensiveCtaInfo}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S5 — SEDES (full-bleed venue sections)
   ═══════════════════════════════════════════════════════ */

function SedeCard({
  video, images, tag, name, detail, href, ctaLabel, index,
}: {
  video?: string;
  images?: string[];
  tag: string;
  name: string;
  detail: string;
  href: string;
  ctaLabel: string;
  index: number;
}) {
  const { ref, visible } = useReveal(0.15);
  const [currentImg, setCurrentImg] = useState(0);

  // Auto-rotate images every 4s
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div
      ref={ref}
      className="relative h-[70vh] min-h-[500px] max-[960px]:h-[60vh] max-[960px]:min-h-[400px] flex items-end overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(40px)",
        transition: `all 1s cubic-bezier(.16,1,.3,1) ${index * 0.2}s`,
      }}
    >
      {/* Background */}
      {video ? (
        <video
          src={video}
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.3 }}
        />
      ) : images && images.length > 0 ? (
        <>
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`${name} ${i + 1}`}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                opacity: currentImg === i ? 0.35 : 0,
                transition: "opacity 1.2s ease",
              }}
            />
          ))}
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #1a1715 50%, #0f0d0b 100%)" }}
        />
      )}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-12 max-[960px]:px-6 pb-14 w-full max-w-[1200px] mx-auto">
        <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-3">{tag}</span>
        <h3 className="font-bold text-[clamp(40px,6vw,80px)] uppercase tracking-[-2px] leading-[0.95] text-[var(--wh)] mb-2">{name}</h3>
        <p className="text-[14px] text-[var(--gy2)] tracking-[0.5px] mb-8">{detail}</p>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="j3-press btn-ghost inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-[13px] font-semibold text-[var(--wh)] hover:border-[var(--g1)]/40 hover:text-[var(--g1)]"
        >
          {ctaLabel}
        </a>
      </div>
    </div>
  );
}

function SedesSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  return (
    <section className="relative bg-[var(--bk2)] overflow-hidden border-b border-white/[.07]">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-[640px]:px-4 max-w-[1200px] mx-auto pt-[100px] pb-14 max-[960px]:pt-[72px] max-[960px]:pb-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
          {t.academy.headquarters.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
          <span className="text-[var(--wh)]">{t.academy.headquarters.headingPre}</span>
          <span className="j3-grad-text">{t.academy.headquarters.headingAccent}</span>
        </h2>
      </div>

      {/* Sede 1 */}
      <SedeCard
        video="https://finurapadelgym.com/wp-content/uploads/2025/10/home-2.webm"
        tag={t.academy.headquarters.sedes[0].tag}
        name={t.academy.headquarters.sedes[0].name}
        detail={t.academy.headquarters.sedes[0].detail}
        href="https://finurapadelgym.com"
        ctaLabel={t.academy.headquarters.sedeCta}
        index={0}
      />

      {/* Sede 2 */}
      <SedeCard
        images={["/images/vals-1.jpg", "/images/vals-2.jpg", "/images/vals-3.jpg"]}
        tag={t.academy.headquarters.sedes[1].tag}
        name={t.academy.headquarters.sedes[1].name}
        detail={t.academy.headquarters.sedes[1].detail}
        href="https://valssport.com/limoneros/"
        ctaLabel={t.academy.headquarters.sedeCta}
        index={1}
      />
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S6 — MÉTODO (timeline methodology)
   ═══════════════════════════════════════════════════════ */

function MetodoSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  const steps = t.academy.method.steps;

  const { itemRefs, visibleItems } = useStaggerReveal(steps.length, 0.2);

  return (
    <section className="relative bg-[var(--bk)] py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.07] overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_1.5fr] max-[960px]:grid-cols-1 gap-16 max-[960px]:gap-10">
        {/* Left — header */}
        <div
          ref={ref}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
            {t.academy.method.eyebrow}
          </span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            <span className="text-[var(--wh)]">{t.academy.method.headingPre}</span>
            <span className="j3-grad-text">{t.academy.method.headingAccent}</span>
          </h2>
        </div>

        {/* Right — timeline */}
        <div className="relative">
          {/* Connecting gold line */}
          <div className="absolute left-[11px] top-3 bottom-3 w-px bg-gradient-to-b from-[var(--g1)]/40 via-[var(--g1)]/20 to-transparent max-[960px]:left-[11px]" />

          <div className="space-y-10">
            {steps.map((step, i) => (
              <div
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                className="flex gap-6 items-start"
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(24px)",
                  transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.15}s`,
                }}
              >
                {/* Numbered dot */}
                <div className="shrink-0 w-[23px] h-[23px] rounded-full border-2 border-[var(--g1)]/40 flex items-center justify-center relative z-10 bg-[var(--bk)]">
                  <span className="j3-grad-text text-[10px] font-bold">{i + 1}</span>
                </div>

                <div>
                  <h4 className="font-bold text-[18px] max-[960px]:text-[16px] uppercase tracking-[-0.5px] text-[var(--wh)] mb-2">{step.title}</h4>
                  <p className="text-[14px] max-[960px]:text-[13px] text-[var(--gy2)] leading-[1.6] font-light">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S7 — STATS (animated counters)
   ═══════════════════════════════════════════════════════ */

function StatsSection() {
  const { t } = useI18n();

  /* Numeric values are presentation, labels come from i18n */
  const statValues: { val: number; suffix: string; label?: string }[] = [
    { val: 20, suffix: "+" },
    { val: 0, suffix: "", label: "#1" },
    { val: 30, suffix: "+" },
    { val: 18, suffix: "" },
    { val: 2000, suffix: "+" },
  ];
  const stats = statValues.map((s, i) => ({ ...s, lbl: t.academy.stats.items[i].lbl }));

  const { itemRefs, visibleItems } = useStaggerReveal(stats.length, 0.3);

  return (
    <section className="relative bg-[var(--bk2)] py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.07] overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,175,100,.03) 0%, transparent 70%)" }} />

      <div className="max-w-[1200px] mx-auto grid grid-cols-5 max-[960px]:grid-cols-2 gap-y-12 relative z-10">
        {stats.map((s, i) => (
          <div
            key={i}
            ref={el => { itemRefs.current[i] = el; }}
            className={`text-center ${
              i < stats.length - 1 ? "border-r border-white/[.07]" : ""
            } ${i === 1 || i === 3 ? "max-[960px]:border-r-0" : ""}`}
            style={{
              opacity: visibleItems[i] ? 1 : 0,
              transform: visibleItems[i] ? "none" : "translateY(24px) scale(0.95)",
              transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
            }}
          >
            <Counter
              val={s.val}
              suffix={s.suffix}
              label={s.label}
            />
            <span className="text-[11px] max-[960px]:text-[10px] font-light tracking-[2px] uppercase text-[var(--gy)] leading-[1.5] block mt-3 px-4">
              {s.lbl}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S8 — CTA FINAL (emotional closing)
   ═══════════════════════════════════════════════════════ */

function CtaFinalSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  return (
    <section
      ref={ref}
      className="relative bg-[var(--bk)] py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 overflow-hidden text-center"
    >
      {/* Gold accent line top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-px bg-gradient-to-r from-transparent via-[var(--g1)]/40 to-transparent" />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,175,100,.07) 0%, transparent 70%)" }}
      />

      <div
        className="relative z-10 max-w-[700px] mx-auto"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(30px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Eyebrow */}
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-6 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
          {t.academy.cta.eyebrow}
        </span>

        {/* Title */}
        <h2 className="font-bold text-[clamp(40px,6vw,72px)] uppercase tracking-[-2px] leading-[0.95] mb-6">
          <span className="j3-stroke">{t.academy.cta.titlePre}</span>{" "}
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.cta.titleAccent}</span>
        </h2>

        {/* Subtitle */}
        <p className="text-[clamp(14px,1.5vw,18px)] text-[var(--gy2)] leading-[1.6] font-light mb-10 max-w-[560px] mx-auto">
          {t.academy.cta.subtitle}
        </p>

        {/* CTA */}
        <a
          href={waLink(t.academy.cta.waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="j3-press btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[15px] tracking-[0.5px] text-black"
          style={{ background: "var(--j3-grad)" }}
        >
          <WaIcon size={15} />
          {t.academy.cta.button}
        </a>

        {/* Note */}
        <p className="text-[11px] text-[var(--gy)] tracking-[2px] uppercase mt-8">
          {t.academy.cta.note}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════ */

export default function AcademyV2Page() {
  return (
    <main className="bg-[var(--bk)] text-[var(--wh)] font-sans w-full">
      <Navbar />

      {/* S1 — Hero Carousel */}
      <HeroSection />

      {/* S1b — Claim */}
      <ClaimSection />

      {/* S2 — Statement */}
      <StatementSection />

      {/* S3 — Proof */}
      <ProofSection />

      {/* S4 — Perfiles */}
      <PerfilesSection />

      {/* S5 — Sedes */}
      <SedesSection />

      {/* S6 — Método */}
      <MetodoSection />

      {/* S7 — Stats */}
      <StatsSection />

      {/* S8 — CTA Final */}
      <CtaFinalSection />

      <Footer />
    </main>
  );
}
