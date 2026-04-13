"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";


/* ═══════════════════════════════════════════════════════
   HOOKS
   ═══════════════════════════════════════════════════════ */

/** Drag-to-scroll + active slide tracking for horizontal carousels */
function useDragScroll(totalSlides: number = 0) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, active: false, moved: false });

  /* Track scroll position → progress 0-1 + active slide index */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      const p = max > 0 ? el.scrollLeft / max : 0;
      setProgress(p);
      if (totalSlides > 0) {
        setActiveSlide(Math.round(p * (totalSlides - 1)));
      }
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, [totalSlides]);

  /* Mouse drag (desktop) */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onDown = (e: MouseEvent) => {
      dragState.current = { startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, active: true, moved: false };
      setIsDragging(true);
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onMove = (e: MouseEvent) => {
      if (!dragState.current.active) return;
      e.preventDefault();
      const x = e.pageX - el.offsetLeft;
      const walk = (x - dragState.current.startX) * 1.5;
      if (Math.abs(walk) > 3) dragState.current.moved = true;
      el.scrollLeft = dragState.current.scrollLeft - walk;
    };
    const onUp = () => {
      if (!dragState.current.active) return;
      dragState.current.active = false;
      setIsDragging(false);
      el.style.cursor = "grab";
      el.style.userSelect = "";
      /* Block click if we dragged */
      if (dragState.current.moved) {
        const block = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
        el.addEventListener("click", block, { capture: true, once: true });
      }
    };
    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    el.style.cursor = "grab";
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  /* Navigate to a specific slide */
  const goTo = (index: number) => {
    const el = scrollRef.current;
    if (!el || !el.children[index]) return;
    const child = el.children[index] as HTMLElement;
    el.scrollTo({ left: child.offsetLeft - 16, behavior: "smooth" });
  };

  return { scrollRef, progress, activeSlide, isDragging, goTo };
}

/** Scroll-triggered reveal — fires once */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If we already scrolled past this element (e.g. page reload mid-page), show immediately
    const rect = el.getBoundingClientRect();
    if (rect.bottom < window.innerHeight) { setVisible(true); return; }
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
    const alreadyVisible: number[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      // If already scrolled past, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) { alreadyVisible.push(i); return; }
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
    if (alreadyVisible.length > 0) {
      setVisibleItems(prev => { const n = [...prev]; alreadyVisible.forEach(i => { n[i] = true; }); return n; });
    }
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

function Counter({ val, prefix, suffix, label, className }: { val: number; prefix?: string; suffix?: string; label?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If already scrolled past, start counting immediately
    const rect = el.getBoundingClientRect();
    if (rect.bottom < window.innerHeight) { setStarted(true); return; }
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
    <span ref={ref} className={className || "font-bold text-[clamp(36px,6vw,72px)] j3-grad-text leading-[1] block"}>
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
      { src: "/images/academy/kids.jpeg", pos: "center", mobilePos: "center 35%" },
      { src: "/images/academy/gemita.jpeg", pos: "center 25%", mobilePos: "center 30%" },
      { src: "/images/academy/nextgen.jpeg", pos: "center", mobilePos: "center 30%" },
      { src: "/images/academy/nextgen-pro.jpeg", pos: "center 20%", mobilePos: "center 25%" },
    ],
    labelKey: "juniorsLabel" ,
    tagline: "4 – 16+ años",
    waMsg: "Hola, quiero info sobre los programas Juniors",
  },
  {
    key: "adultos",
    images: [
      { src: "/images/academy/amateur.jpeg", pos: "center 5%", mobilePos: "center 20%" },
      { src: "/images/academy/pro.jpeg", pos: "center", mobilePos: "center 25%" },
      { src: "/images/academy/elena.jpeg", pos: "center 40%", mobilePos: "center 35%" },
    ],
    labelKey: "adultosLabel" ,
    tagline: "Amateur · Pro",
    waMsg: "Hola, quiero info sobre los programas Adultos",
  },
  {
    key: "intensive",
    images: [
      { src: "/images/academy/stage-group.jpeg", pos: "center 28%", mobilePos: "42% 78%" },
    ],
    labelKey: "intensiveLabel" ,
    tagline: "Camps · Stages · A medida",
    waMsg: "Hola, quiero info sobre Intensive Training",
  },
];

const AUTO_ADVANCE_MS = 5000;

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

  /* Rotate image when leaving a slide — wait for crossfade to finish */
  const [imgIndex, setImgIndex] = useState<number[]>(HERO_SLIDES.map(() => 0));
  const prevActive = useRef(0);
  const rotateTimers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const leaving = prevActive.current;
    prevActive.current = active;
    if (leaving !== active && HERO_SLIDES[leaving].images.length > 1) {
      /* Fire-and-forget: don't cancel on next active change */
      const id = setTimeout(() => {
        setImgIndex(prev => {
          const next = [...prev];
          next[leaving] = (next[leaving] + 1) % HERO_SLIDES[leaving].images.length;
          return next;
        });
      }, 1300);
      rotateTimers.current.push(id);
    }
    /* Cleanup only on unmount */
    return undefined;
  }, [active]);
  /* Clear all timers on unmount */
  useEffect(() => {
    return () => { rotateTimers.current.forEach(clearTimeout); };
  }, []);

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

  /* Touch swipe support */
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < 50 || Math.abs(dy) > Math.abs(dx)) return; /* too short or vertical */
    if (dx < 0) goTo((active + 1) % HERO_SLIDES.length); /* swipe left → next */
    else goTo((active - 1 + HERO_SLIDES.length) % HERO_SLIDES.length); /* swipe right → prev */
  };

  const labels: Record<string, string> = {
    juniorsLabel: t.academy.programs.juniorsLabel,
    adultosLabel: t.academy.programs.adultosLabel,
    intensiveLabel: t.academy.programs.intensiveLabel,
  };

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goTo((active + 1) % HERO_SLIDES.length);
    else if (e.key === "ArrowLeft") goTo((active - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  /* Reduced motion preference */
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <section
      className="relative h-screen min-h-[580px] overflow-hidden bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Hero carousel"
    >
      {/* ── Slides — crossfade stack ── */}
      {HERO_SLIDES.map((slide, i) => (
        <div
          key={slide.key}
          className="absolute inset-0 overflow-hidden"
          style={{
            opacity: active === i ? 1 : 0,
            transition: prefersReducedMotion ? "opacity 0.01s" : "opacity 1.2s ease",
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
            className={`object-cover ${prefersReducedMotion ? "" : "transition-transform duration-[7000ms] ease-out"}`}
            style={{
              opacity: 0.7,
              filter: isMobile
                ? "contrast(1.10) saturate(0.80) brightness(1.0) sepia(0.12)"
                : "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)",
              transform: !prefersReducedMotion && active === i ? "scale(1.08)" : "scale(1)",
              objectPosition: (isMobile && slide.images[imgIndex[i]].mobilePos) || slide.images[imgIndex[i]].pos,
            }}
          />
          {/* Gradient overlay — stronger on mobile for outdoor readability */}
          <div
            className="absolute inset-0"
            style={{
              background: isMobile
                ? slide.key === "intensive"
                  ? "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.45) 35%, rgba(0,0,0,.12) 55%, rgba(0,0,0,.12) 100%)"
                  : "linear-gradient(to top, rgba(0,0,0,.92) 0%, rgba(0,0,0,.38) 40%, rgba(0,0,0,.12) 100%)"
                : slide.key === "intensive"
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
                  transform: prefersReducedMotion
                    ? undefined
                    : active === i ? "translateY(0) scale(1)" : "translateY(24px) scale(0.97)",
                  filter: prefersReducedMotion
                    ? undefined
                    : active === i ? "blur(0px)" : "blur(6px)",
                  transition: prefersReducedMotion
                    ? "opacity 0.01s"
                    : active === i
                      ? "opacity .8s ease, transform .9s cubic-bezier(.16,1,.3,1), filter .8s ease"
                      : "opacity .5s ease, transform .5s ease, filter .5s ease",
                  pointerEvents: active === i ? "auto" : "none",
                  visibility: active === i ? "visible" : "hidden",
                }}
              >
                {/* Tag */}
                <span
                  className="text-[12px] font-medium tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[11px] max-[960px]:tracking-[3px]"
                  style={isMobile ? { textShadow: "0 1px 8px rgba(0,0,0,.7)" } : undefined}
                >
                  {slide.tagline}
                </span>

                {/* Title — only active slide is h1 for SEO */}
                {active === i ? (
                  <h1
                    className={`font-bold uppercase tracking-[-3px] leading-[.90] text-[var(--wh)] ${
                      slide.key === "intensive"
                        ? "text-[clamp(40px,8vw,100px)] max-[960px]:text-[clamp(36px,11vw,72px)]"
                        : "text-[clamp(56px,10vw,140px)] max-[960px]:text-[clamp(44px,14vw,100px)]"
                    }`}
                    style={isMobile ? { textShadow: "0 2px 16px rgba(0,0,0,.8), 0 0 40px rgba(0,0,0,.4)" } : undefined}
                  >
                    {labels[slide.labelKey]}
                  </h1>
                ) : (
                  <span
                    aria-hidden="true"
                    className={`block font-bold uppercase tracking-[-3px] leading-[.90] text-[var(--wh)] ${
                      slide.key === "intensive"
                        ? "text-[clamp(40px,8vw,100px)] max-[960px]:text-[clamp(36px,11vw,72px)]"
                        : "text-[clamp(56px,10vw,140px)] max-[960px]:text-[clamp(44px,14vw,100px)]"
                    }`}
                    style={isMobile ? { textShadow: "0 2px 16px rgba(0,0,0,.8), 0 0 40px rgba(0,0,0,.4)" } : undefined}
                  >
                    {labels[slide.labelKey]}
                  </span>
                )}
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
            <span
              className="relative text-[13px] font-semibold tracking-[3px] uppercase text-[var(--g1)]"
              style={isMobile ? { textShadow: "0 1px 8px rgba(0,0,0,.6)" } : undefined}
            >
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
        <div className="absolute bottom-0 left-0 w-full z-20 border-t border-white/[.06]" style={{ background: isMobile ? "linear-gradient(to top, rgba(0,0,0,.75) 0%, rgba(0,0,0,.3) 100%)" : "linear-gradient(to top, rgba(0,0,0,.6) 0%, transparent 100%)" }}>
          <div className="flex items-center justify-center gap-8 max-[640px]:gap-5 py-5 max-[960px]:py-4">
            {([t.academy.hero.titleLine1, t.academy.hero.titleLine2, t.academy.hero.titleLine3b] as string[]).map((word, i) => (
              <span key={i} className="flex items-center gap-8 max-[640px]:gap-5">
                {i > 0 && <span className="text-[var(--g1)]/40 text-[8px]">·</span>}
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className={`text-[13px] max-[640px]:text-[11px] tracking-[6px] max-[640px]:tracking-[3px] uppercase transition-all duration-700 cursor-pointer bg-transparent border-none p-0 ${
                    i === 2
                      ? `j3-grad-text font-[var(--font-serif)] italic normal-case tracking-[3px] max-[640px]:tracking-[1px] text-[15px] max-[640px]:text-[13px] ${active === i ? "opacity-100" : "opacity-60"}`
                      : `font-semibold ${active === i ? "text-white opacity-100" : isMobile ? "text-white/50 hover:text-white/70" : "text-white/40 hover:text-white/70"}`
                  }`}
                  style={isMobile ? { textShadow: "0 1px 6px rgba(0,0,0,.5)" } : undefined}
                >
                  {word.replace(".", "")}
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S1a — ACADEMY LOGO BAND (white breather)
   ═══════════════════════════════════════════════════════ */

function AcademyBand() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.05);

  return (
    <section className="bg-white py-[80px] max-[960px]:py-[56px] overflow-hidden">
      <div
        ref={ref}
        className="relative max-w-[1600px] mx-auto px-4 max-[960px]:px-3"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(20px)",
          transition: "all 1.2s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Left — text block */}
        <div className="max-w-[560px]">
          {/* Eyebrow */}
          <span
            className="text-[10px] font-medium tracking-[5px] uppercase text-[var(--g1)] block mb-5"
            style={{
              opacity: visible ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s",
            }}
          >
            Pádel Academy · Costa del Sol
          </span>

          {/* Heading */}
          <h2
            className="text-[clamp(28px,3.5vw,42px)] font-bold uppercase tracking-[-0.5px] leading-[1.1] text-black mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) 0.4s",
            }}
          >
            Desde 2004.
            <br />
            <span className="text-black/25">Málaga, España.</span>
          </h2>

          {/* Gold divider */}
          <div
            className="h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] mb-6"
            style={{
              width: visible ? "60px" : "0px",
              transition: "width 1s cubic-bezier(.16,1,.3,1) 0.5s",
            }}
          />

          {/* Description */}
          <p
            className="text-[clamp(15px,1.4vw,17px)] leading-[1.75] text-black/50 font-light"
            style={{
              textWrap: "balance",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) 0.6s",
            }}
          >
            {t.academy.band.description}
          </p>
        </div>

        {/* Imagotipo — absolute positioned, vertically centered */}
        <img
          src="/images/imagotipo-black.svg"
          alt=""
          className="absolute right-12 top-1/2 -translate-y-1/2 w-[180px] h-auto select-none max-[960px]:hidden"
          draggable={false}
          style={{
            opacity: visible ? 0.06 : 0,
            transition: "opacity 1.5s ease 0.8s",
          }}
        />
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S1b — CLAIM (video background + stats — Ferrari style)
   ═══════════════════════════════════════════════════════ */

function ClaimSection({ markerSlot }: { markerSlot?: React.ReactNode }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Parallax — subtle scroll-based offset on video */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const el = video;
    function onScroll() {
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const progress = 1 - rect.bottom / (window.innerHeight + rect.height);
      el.style.transform = `scale(1.15) translateY(${progress * -30}px)`;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const stats: { num: number; suffix: string; label: string }[] = [];

  return (
    <section className="relative overflow-hidden bg-[var(--bk)]">

      {/* Dark marker — placed at top of ClaimSection so theme=dark fires
           while this section (with its own dark bg) is still covering the viewport */}
      {markerSlot}

      {/* Video background with parallax */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        src="/videos/play_1080.webm"
        autoPlay
        loop
        muted
        playsInline
        style={{ opacity: 0.55, filter: "contrast(1.08) saturate(0.7) brightness(1.0) sepia(0.15)", transform: "scale(1.15)" }}
      />
      {/* Overlay — subtle, let the video breathe */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/30" />
      {/* Cinematic vignette */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 120px 40px rgba(0,0,0,.5)" }} />

      {/* Cinematic with iconic quote */}
      <div
        ref={ref}
        className="relative z-10 py-[220px] max-[960px]:py-[140px] flex items-center justify-center px-12 max-[960px]:px-6"
      >
        <blockquote
          className="max-w-[700px] text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 1.4s cubic-bezier(.16,1,.3,1) 0.3s",
          }}
        >
          <p className="text-[clamp(20px,2.5vw,32px)] font-[var(--font-serif)] italic text-white/80 leading-[1.5] mb-4" style={{ textWrap: "balance" }}>
            &ldquo;{t.academy.claim.quote}&rdquo;
          </p>
          <cite className="text-[11px] font-medium tracking-[4px] uppercase text-[var(--g1)] not-italic">
            {t.academy.claim.author}
          </cite>
        </blockquote>
      </div>

    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S1c — BANNER (bold typographic statement on white)
   ═══════════════════════════════════════════════════════ */

function BannerSection() {
  const { ref, visible } = useReveal(0.05);

  return (
    <section className="bg-white py-[56px] max-[960px]:py-[40px] overflow-hidden">
      <div
        ref={ref}
        className="max-w-[1200px] mx-auto px-12 max-[960px]:px-6 max-[640px]:px-4 text-center flex flex-col items-center gap-6"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(16px)",
          transition: "all 1.2s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Main claim */}
        <h2 className="text-[clamp(28px,4vw,48px)] font-light uppercase tracking-[3px] max-[640px]:tracking-[1.5px] leading-[1.3] text-black">
          La academia de{" "}
          <span className="font-[var(--font-serif)] italic normal-case tracking-[0px] text-[var(--g1)]">referencia</span>
          <br />
          en la Costa del Sol.
        </h2>

        {/* Gold accent line */}
        <div className="w-[50px] h-[1px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] opacity-50" />

        {/* Tagline */}
        <p className="text-[clamp(13px,1.4vw,16px)] font-light uppercase tracking-[4px] max-[640px]:tracking-[2px] leading-[2] text-black/35" style={{ textWrap: "balance" }}>
          Todas las edades · Todos los niveles · Todo el año
        </p>
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

  /* Visual styles per line — adapt to scroll theme
     Dark: gold/stroke/grad  |  Light: black text + gold accents */
  const lineStyles: { style: string; accentStyle?: string; align: string }[] = [
    { style: "stmt-before", accentStyle: "font-[var(--font-serif)] italic normal-case stmt-accent", align: "text-left" },
    { style: "stmt-accent", accentStyle: "font-[var(--font-serif)] italic normal-case stmt-stroke-gold", align: "text-right" },
  ];

  const lines = t.academy.statement.lines.map((l, i) => ({ ...l, ...lineStyles[i] }));

  const { itemRefs, visibleItems } = useStaggerReveal(lines.length, 0.2);

  return (
    <section className="stmt-section relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 overflow-hidden flex items-center">
      <div ref={ref} className="absolute top-0 left-0" />

      <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col items-center gap-10 max-[960px]:gap-6 w-full">

        {lines.map((line, i) => (
          <div
            key={i}
            ref={el => { itemRefs.current[i] = el; }}
            className="text-center"
            style={{
              opacity: visibleItems[i] ? 1 : 0,
              transform: visibleItems[i] ? "none" : "translateY(40px)",
              filter: visibleItems[i] ? "blur(0px)" : "blur(8px)",
              transition: `all 1s cubic-bezier(.16,1,.3,1) ${i * 0.3}s`,
            }}
          >
            <span className={`${line.style} font-bold text-[clamp(48px,7vw,100px)] uppercase tracking-[-3px] leading-[1] inline-block`}>
              {line.before}
            </span>
            {line.accent && (
              <>
                <span className="inline-block w-[0.2em]" />
                <span className={`${line.accentStyle || line.style} font-bold text-[clamp(48px,7vw,100px)] tracking-[-2px] leading-[1] inline-block`}>
                  {line.accent}
                </span>
              </>
            )}
          </div>
        ))}

        {/* Gold divider */}
        <div
          className="mx-auto mt-14 mb-10 max-[960px]:mt-10 max-[960px]:mb-8 h-px bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
          style={{
            width: visible ? "100px" : "0px",
            transition: "width 1.2s cubic-bezier(.16,1,.3,1) 0.6s",
          }}
        />

        {/* Stats — silent authority */}
        <div className="flex items-start justify-center">
          {[
            { num: 20, suffix: "+", label: "años" },
            { num: 2000, suffix: "+", label: "jugadores formados" },
            { num: 18, suffix: "", label: "títulos profesionales" },
          ].map((stat, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && (
                <div className="w-px h-[44px] max-[640px]:h-[36px] bg-gradient-to-b from-transparent via-[var(--g1)]/30 to-transparent mx-10 max-[960px]:mx-6 max-[640px]:mx-4" />
              )}
              <div
                className="text-center min-w-[80px] max-[640px]:min-w-[60px]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(16px)",
                  transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${0.7 + i * 0.15}s`,
                }}
              >
                <Counter val={stat.num} suffix={stat.suffix} className="block stmt-stat font-bold text-[clamp(26px,3.5vw,44px)] tracking-[-1px] leading-[1]" />
                <span className="block text-[10px] max-[640px]:text-[9px] font-medium tracking-[2px] max-[640px]:tracking-[1.5px] uppercase theme-muted mt-2">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S2b — STATEMENT STATS (authority numbers after philosophy)
   ═══════════════════════════════════════════════════════ */

function StatementStats() {
  const { ref, visible } = useReveal(0.3);

  const stats: { num: number; suffix: string; label: string }[] = [
    { num: 20, suffix: "+", label: "años" },
    { num: 2000, suffix: "+", label: "jugadores formados" },
    { num: 18, suffix: "", label: "títulos profesionales" },
  ];

  return (
    <section className="relative pb-[100px] pt-[20px] max-[960px]:pb-[64px] max-[960px]:pt-[12px] px-12 max-[960px]:px-6 max-[640px]:px-4">
      <div
        ref={ref}
        className="max-w-[900px] mx-auto flex items-start justify-center"
      >
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center">
            {i > 0 && (
              <div className="w-px h-[44px] max-[640px]:h-[36px] bg-gradient-to-b from-transparent via-[var(--g1)]/30 to-transparent mx-10 max-[960px]:mx-6 max-[640px]:mx-4" />
            )}
            <div
              className="text-center min-w-[80px] max-[640px]:min-w-[60px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.15}s`,
              }}
            >
              <Counter val={stat.num} suffix={stat.suffix} className="block j3-grad-text font-bold text-[clamp(26px,3.5vw,44px)] tracking-[-1px] leading-[1]" />
              <span className="block text-[10px] max-[640px]:text-[9px] font-medium tracking-[2px] max-[640px]:tracking-[1.5px] uppercase text-white/50 mt-2">
                {stat.label}
              </span>
            </div>
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
    <section ref={ref} className="relative py-[100px] max-[960px]:py-[72px] px-12 max-[960px]:px-6 max-[640px]:px-4 overflow-hidden text-[var(--wh)] bg-white/[.03]">
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
            loading="lazy"
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

/* Porsche-style program tile — full-bleed image, info overlay at bottom */
function ProgramTile({
  tag, title, sub, cta, image, href, isHovered, onHover, onLeave, index, visible,
}: {
  tag: string;
  title: string;
  sub: string;
  cta: { label: string; href: string };
  image: string;
  href: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  index: number;
  visible: boolean;
}) {
  return (
    <a
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-lg cursor-pointer block h-full"
      style={{
        background: "#000",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1)",
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image — full cover with Porsche zoom */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: isHovered ? "scale3d(1.05,1.05,1.05)" : "scale3d(1,1,1)",
          transition: "transform 0.6s cubic-bezier(0, 0, 0.2, 1)",
          filter: "contrast(1.08) saturate(0.85) brightness(1.02) sepia(0.08)",
        }}
      />

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: "25%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.15) 60%, transparent 100%)",
        }}
      />

      {/* Bottom gradient */}
      <div
        className="absolute bottom-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: "45%",
          background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />

      {/* Title — top center (Porsche model signature style) */}
      <div className="absolute top-0 left-0 right-0 z-[6] flex justify-center pt-7 max-[640px]:pt-5">
        <h4 className="font-bold text-[clamp(26px,3.5vw,48px)] uppercase tracking-[-1.5px] leading-[1] text-white/90">
          {title}
        </h4>
      </div>

      {/* Bottom content — tag + sub left, CTA right */}
      <div className="absolute bottom-0 left-0 right-0 z-[13] flex items-end justify-between p-[clamp(16px,1.25vw+12px,36px)]">
        {/* Left: frosted tag + description */}
        <div className="flex flex-col gap-1.5">
          <span
            className="inline-block w-fit text-[12px] max-[640px]:text-[11px] font-normal leading-[1.5] px-2 py-0.5 rounded"
            style={{ background: "rgba(215,215,218,0.25)", backdropFilter: "blur(12px)", color: "rgba(255,255,255,0.85)" }}
          >
            {tag}
          </span>
          <p className="text-[14px] max-[640px]:text-[13px] text-white/80 leading-[1.5]">
            {sub}
          </p>
        </div>

        {/* Right: CTA — arrow only, label expands on card hover */}
        <div className="flex items-center gap-1 shrink-0">
          <span
            className="text-[13px] font-normal text-white/90 whitespace-nowrap overflow-hidden"
            style={{
              maxWidth: isHovered ? "160px" : "0px",
              opacity: isHovered ? 1 : 0,
              transition: isHovered
                ? "max-width 1.2s cubic-bezier(0, 0, 0.2, 1), opacity 0.6s cubic-bezier(0, 0, 0.2, 1)"
                : "max-width 0.4s cubic-bezier(0, 0, 0.2, 1), opacity 0.25s cubic-bezier(0, 0, 0.2, 1)",
            }}
          >
            {cta.label}
          </span>
          <svg className="w-6 h-6 max-[640px]:w-5 max-[640px]:h-5 text-white/90 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </div>
    </a>
  );
}

/** Porsche-style flex row: 2 cards that expand/shrink on hover */
/** Porsche-style scroll progress bar */
/** Porsche-style pill dots — active dot stretches to pill, others stay circular */
function PorscheDots({ total, active, onDotClick }: { total: number; active: number; onDotClick: (i: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-[6px] mt-6">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="relative rounded-full overflow-hidden"
          style={{
            width: active === i ? "32px" : "10px",
            height: "10px",
            background: "rgba(215,215,218,0.25)",
            transition: "width 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)",
            cursor: "pointer",
            border: "none",
            padding: 0,
          }}
          aria-label={`Slide ${i + 1}`}
        >
          {active === i && (
            <div
              className="absolute inset-0 rounded-full"
              style={{ background: "var(--j3-grad)" }}
            />
          )}
        </button>
      ))}
    </div>
  );
}

/** Horizontal scroll carousel with drag, snap, and Porsche-style dots */
function ScrollCarousel({
  children,
  cardWidth = "clamp(280px, 38vw, 520px)",
  cardHeight = "clamp(320px, calc(7vh + 30vw), 540px)",
}: {
  children: React.ReactNode[];
  cardWidth?: string;
  cardHeight?: string;
}) {
  const { scrollRef, activeSlide, goTo } = useDragScroll(children.length);

  return (
    <div>
      <div
        ref={scrollRef}
        className="flex gap-[18px] overflow-x-auto snap-x snap-mandatory scrollbar-hide -mx-4 px-4 max-[960px]:-mx-3 max-[960px]:px-3"
        style={{ cursor: "grab" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="snap-start shrink-0"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {child}
          </div>
        ))}
        {/* End spacer so last card can snap flush */}
        <div className="shrink-0 w-1" aria-hidden />
      </div>
      <div className="px-4 max-[960px]:px-3">
        <PorscheDots total={children.length} active={activeSlide} onDotClick={goTo} />
      </div>
    </div>
  );
}

function PerfilesSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  /* Hover state per card in each carousel */
  const [jHover, setJHover] = useState<number | null>(null);
  const [aHover, setAHover] = useState<number | null>(null);

  /* Juniors cards — visual data merged with i18n strings */
  const juniorsImages = [
    "/images/academy/kinder.jpeg",
    "/images/academy/kids.jpeg",
    "/images/academy/nextgen.jpeg",
    "/images/academy/nextgen-pro.jpeg",
  ];
  const juniorsCards = t.academy.programs.juniorsCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    image: juniorsImages[i],
    cta: { label: c.ctaLabel, href: waLink(c.waMsg) },
  }));
  const jReveal = useReveal(0.15);

  /* Adultos cards */
  const adultosImages = ["/images/academy/amateur.jpeg", "/images/academy/stage-group.jpeg"];
  const adultosCards = t.academy.programs.adultosCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    image: adultosImages[i],
    cta: { label: c.ctaLabel, href: waLink(c.waMsg) },
  }));
  const aReveal = useReveal(0.15);

  /* Empresas — standalone reveal */
  const empReveal = useReveal(0.15);

  return (
    <section id="programas" className="relative pt-[100px] pb-[60px] max-[960px]:pt-[72px] max-[960px]:pb-[48px] overflow-hidden">
      {/* Section header */}
      <div
        ref={ref}
        className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="theme-eyebrow text-[10px] font-normal tracking-[5px] uppercase block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
          {t.academy.programs.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
          <span className="theme-text">{t.academy.programs.headingPre}</span>
          <span className="j3-grad-text">{t.academy.programs.headingAccent}</span>
        </h2>
      </div>

      {/* Block 1: Juniors — horizontal scroll carousel */}
      <div className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">01</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.juniorsLabel}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">De los 4 a los 16+. Cada etapa, un objetivo.</span>
        </div>
        <div
          ref={jReveal.ref}
          className="max-w-[1600px] mx-auto py-10"
          style={{
            opacity: jReveal.visible ? 1 : 0,
            transform: jReveal.visible ? "none" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <ScrollCarousel>
            {juniorsCards.map((c, i) => (
              <ProgramTile
                key={i}
                tag={c.tag}
                title={c.title}
                sub={c.sub}
                cta={c.cta}
                image={c.image}
                href={c.cta.href}
                isHovered={jHover === i}
                onHover={() => setJHover(i)}
                onLeave={() => setJHover(null)}
                index={i}
                visible={jReveal.visible}
              />
            ))}
          </ScrollCarousel>
        </div>
      </div>

      {/* Block 2: Adultos — horizontal scroll carousel */}
      <div className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">02</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.adultosLabel}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">Cada jugador tiene su momento y evolución.</span>
        </div>
        <div
          ref={aReveal.ref}
          className="max-w-[1600px] mx-auto py-10"
          style={{
            opacity: aReveal.visible ? 1 : 0,
            transform: aReveal.visible ? "none" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <ScrollCarousel>
            {adultosCards.map((c, i) => (
              <ProgramTile
                key={i}
                tag={c.tag}
                title={c.title}
                sub={c.sub}
                cta={c.cta}
                image={c.image}
                href={c.cta.href}
                isHovered={aHover === i}
                onHover={() => setAHover(i)}
                onLeave={() => setAHover(null)}
                index={i}
                visible={aReveal.visible}
              />
            ))}
          </ScrollCarousel>
        </div>
      </div>

      {/* Block 3: Empresas — Team Building */}
      <div className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">03</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.experience.empresas.heading}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">El pádel como herramienta de equipo.</span>
        </div>

        <div
          ref={empReveal.ref}
          className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-16 max-[960px]:py-12"
          style={{
            opacity: empReveal.visible ? 1 : 0,
            transform: empReveal.visible ? "none" : "translateY(30px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="relative overflow-hidden p-12 max-[960px]:p-6 border border-[var(--g1)]/20 min-h-[400px] max-[960px]:min-h-[400px] flex flex-col justify-end">
            {/* Background video */}
            <video
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
              style={{
                filter: "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)",
              }}
            >
              <source src="/videos/empresas-bg.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] opacity-60 z-10" />

            <div className="relative z-10 text-center">
              <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
                {t.experience.empresas.eyebrow}
              </span>

              <h3 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1] mb-3">
                <span className="text-[var(--wh)]">{t.experience.empresas.introBefore}</span>
                <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.experience.empresas.introAccent}</span>
              </h3>

              <p className="text-[clamp(14px,1.5vw,17px)] text-[var(--gy2)] leading-[1.5] font-light mb-6 max-w-[600px] mx-auto">
                {t.experience.empresas.introAfter}
              </p>

              <a
                href={waLink(t.experience.empresas.waMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="j3-press btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.5px] text-black"
                style={{ background: "var(--j3-grad)" }}
              >
                <WaIcon size={13} />
                {t.experience.empresas.ctaButton}
              </a>
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
  video, images, tag, name, detail, href, ctaLabel, features, badge, videoStart, index,
}: {
  video?: string;
  images?: string[];
  tag: string;
  name: string;
  detail: string;
  href: string;
  ctaLabel: string;
  features?: readonly string[];
  badge?: string;
  videoStart?: number;
  index: number;
}) {
  const { ref, visible } = useReveal(0.15);
  const videoRef = useRef<HTMLVideoElement>(null);
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
      className="mx-4 max-[960px]:mx-3 max-w-[1600px] xl:mx-auto mb-10 last:mb-0 border border-white/[.07] overflow-hidden rounded-sm"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 1s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
      }}
    >
      <div className="flex max-[768px]:flex-col">
        {/* Image / Video side */}
        <div className="relative w-[45%] max-[768px]:w-full min-h-[320px] max-[768px]:min-h-[240px] overflow-hidden">
          {video ? (
            <video
              ref={videoRef}
              src={video}
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)" }}
              onLoadedMetadata={() => { if (videoStart && videoRef.current) videoRef.current.currentTime = videoStart; }}
              onSeeking={() => { if (videoStart && videoRef.current && videoRef.current.currentTime < videoStart) videoRef.current.currentTime = videoStart; }}
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
                    opacity: currentImg === i ? 1 : 0,
                    transition: "opacity 1.2s ease",
                    filter: "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)",
                  }}
                />
              ))}
            </>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-r max-[768px]:bg-gradient-to-t from-transparent via-transparent to-black/40 max-[768px]:from-transparent max-[768px]:via-transparent max-[768px]:to-black/30" />

          {/* Badge */}
          {badge && (
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-[1.5px] uppercase text-black" style={{ background: "var(--j3-grad)" }}>
              {badge}
            </div>
          )}
        </div>

        {/* Info side */}
        <div className="flex-1 p-10 max-[960px]:p-8 max-[640px]:p-6 flex flex-col justify-between bg-[var(--bk2)]">
          <div>
            <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-3">{tag}</span>
            <h3 className="font-bold text-[clamp(28px,4vw,44px)] uppercase tracking-[-1.5px] leading-[1] text-[var(--wh)] mb-2">{name}</h3>
            <p className="text-[14px] text-[var(--gy2)] tracking-[0.5px] mb-6">{detail}</p>

            {/* Features grid */}
            {features && features.length > 0 && (
              <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mb-8">
                {features.map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-[13px] text-[var(--gy2)]">
                    <span className="w-1 h-1 rounded-full bg-[var(--g1)] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
            )}
          </div>

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="j3-press btn-glow inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-[13px] font-semibold tracking-[0.5px] text-black self-start"
            style={{ background: "var(--j3-grad)" }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </div>
  );
}

function SedesSection({ markerSlot }: { markerSlot?: React.ReactNode }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  return (
    <section className="sedes-section relative overflow-hidden border-b border-white/[.07]">
      {/* Dark marker — at top of section so transition starts earlier */}
      {markerSlot}

      {/* Section header */}
      <div
        ref={ref}
        className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-[72px] pb-14 max-[960px]:pt-[56px] max-[960px]:pb-10"
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
          <span className="sedes-heading">{t.academy.headquarters.headingPre}</span>
          <span className="j3-grad-text">{t.academy.headquarters.headingAccent}</span>
        </h2>
      </div>

      {/* Sede 1 */}
      <SedeCard
        video="https://finurapadelgym.com/wp-content/uploads/2025/10/home-2.webm"
        videoStart={5}
        tag={t.academy.headquarters.sedes[0].tag}
        name={t.academy.headquarters.sedes[0].name}
        detail={t.academy.headquarters.sedes[0].detail}
        features={t.academy.headquarters.sedes[0].features}
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
        features={t.academy.headquarters.sedes[1].features}
        badge={t.academy.headquarters.sedes[1].badge}
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

function ProgramasGridSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  const programs = [
    { name: "Kinder", tag: "4 – 10 años", img: "/images/academy/kinder.jpeg", href: "#programas" },
    { name: "Kids", tag: "10+", img: "/images/academy/kids.jpeg", href: "#programas" },
    { name: "Next Gen", tag: "14+ · Competición", img: "/images/academy/nextgen.jpeg", href: "#programas" },
    { name: "Next Gen Pro", tag: "16+ · Circuito", img: "/images/academy/nextgen-pro.jpeg", href: "#programas" },
    { name: "Tu Club", tag: "Adultos", img: "/images/academy/amateur.jpeg", href: "#programas" },
    { name: "Intensive Training", tag: "Camps · Stages", img: "/images/academy/stage-group.jpeg", href: "#programas" },
  ];

  const { scrollRef: gridScrollRef, activeSlide: gridActive, goTo: gridGoTo } = useDragScroll(programs.length);

  return (
    <section className="relative bg-[var(--bk)] py-[80px] max-[960px]:py-[60px] border-b border-white/[.07]">
      <div className="max-w-[1600px] mx-auto">
        <div
          ref={ref}
          className="mb-10 px-4 max-[960px]:px-3"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-3 max-[960px]:text-[12px] max-[960px]:tracking-[3px]">
            {t.academy.cta.eyebrow}
          </span>
          <h2 className="font-bold text-[clamp(28px,3.5vw,44px)] uppercase tracking-[-1px] leading-[1]">
            <span className="j3-stroke">{t.academy.cta.titlePre}</span>{" "}
            <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.cta.titleAccent}</span>
          </h2>
        </div>

        <div
          ref={gridScrollRef}
          className="flex gap-[18px] overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4 max-[960px]:px-3"
          style={{ cursor: "grab" }}
        >
          {programs.map((p, i) => (
            <a
              key={p.name}
              href={p.href}
              className="group relative border border-white/[.07] hover:border-[var(--g1)]/30 overflow-hidden snap-start shrink-0 flex flex-col justify-end rounded-xl"
              style={{
                width: "clamp(160px, 15vw, 220px)",
                height: "clamp(160px, 15vw, 220px)",
              }}
            >
              <img
                src={p.img}
                alt={p.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                style={{ filter: "contrast(1.08) saturate(0.85) brightness(1.05) sepia(0.12)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              <div className="relative z-10 p-4 max-[640px]:p-3">
                <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)] block mb-1">{p.tag}</span>
                <span className="font-bold text-[15px] max-[640px]:text-[13px] uppercase tracking-[-0.5px] text-[var(--wh)] leading-[1.1]">{p.name}</span>
              </div>
            </a>
          ))}
          <div className="shrink-0 w-1" aria-hidden />
        </div>
        <div className="px-4 max-[960px]:px-3">
          <PorscheDots total={programs.length} active={gridActive} onDotClick={gridGoTo} />
        </div>

        {/* CTA block below grid */}
        <div className="text-center mt-14 max-[960px]:mt-10">
          <p className="text-[clamp(14px,1.5vw,18px)] text-[var(--gy2)] leading-[1.6] font-light mb-8 max-w-[560px] mx-auto" style={{ textWrap: "balance" }}>
            Cuéntanos tu nivel, tus objetivos y tu disponibilidad. Del resto nos encargamos nosotros.
          </p>
          <a
            href={waLink("Hola J3Pádel, me gustaría información sobre vuestros programas.")}
            target="_blank"
            rel="noopener noreferrer"
            className="j3-press btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-semibold text-[15px] tracking-[0.5px] text-black"
            style={{ background: "var(--j3-grad)" }}
          >
            <WaIcon size={15} />
            Escribir por WhatsApp
          </a>
          <p className="text-[11px] text-[var(--gy)] tracking-[2px] uppercase mt-8" style={{ textWrap: "balance" }}>
            Sin compromiso · Sin formularios · Respuesta directa
          </p>
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

/**
 * Scroll-linked background color transition (Porsche style).
 *
 * Markers are placed INSIDE sections at the exact scroll position
 * where the transition should begin. When the viewport crosses a marker,
 * the ENTIRE page background (body) smoothly transitions over ~250px
 * of scroll to the target color. This affects everything visible on screen.
 *
 * Each marker has data-to="dark"|"light" indicating the target color.
 */
function useScrollBg(markerRefs: React.RefObject<(HTMLDivElement | null)[]>) {
  useEffect(() => {
    document.body.style.transition = "background-color 1.4s cubic-bezier(.16,1,.3,1)";

    function onScroll() {
      const markers = markerRefs.current;
      if (!markers) return;

      const scrollMid = window.scrollY + window.innerHeight * 0.5;

      // Build sorted list of transitions using absolute page position
      const transitions: { y: number; toDark: boolean }[] = [];
      for (const m of markers) {
        if (!m) continue;
        const rect = m.getBoundingClientRect();
        transitions.push({
          y: rect.top + window.scrollY,
          toDark: m.dataset.to === "dark",
        });
      }
      transitions.sort((a, b) => a.y - b.y);

      // Find which color we should be in — just check which markers we've passed
      let color = "#000"; // start dark (hero)
      for (const tr of transitions) {
        if (scrollMid >= tr.y) {
          color = tr.toDark ? "#000" : "#fff";
        } else {
          break;
        }
      }

      document.body.style.backgroundColor = color;
      document.documentElement.dataset.theme = color === "#000" ? "dark" : "light";
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.body.style.transition = "";
      document.body.style.backgroundColor = "";
      delete document.documentElement.dataset.theme;
    };
  }, [markerRefs]);
}

/** Invisible scroll marker — place inside a section where transition should trigger */
function ScrollMarker({ index, to, refs }: { index: number; to: "dark" | "light"; refs: React.RefObject<(HTMLDivElement | null)[]> }) {
  return (
    <div
      ref={(el) => { if (refs.current) refs.current[index] = el; }}
      data-to={to}
      className="h-0 w-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}

export default function AcademyV2Page() {
  const markerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useScrollBg(markerRefs);

  return (
    <main className="font-sans w-full">
      <Navbar />

      {/* Hero (starts dark — body default) */}
      <HeroSection />

      {/* Marker 0: hero→white — triggers at top of AcademyBand */}
      <ScrollMarker index={0} to="light" refs={markerRefs} />

      {/* White zone: AcademyBand + Claim */}
      <AcademyBand />
      <ClaimSection markerSlot={
        /* Marker 1: white→dark — placed at bottom of ClaimSection (which has
           its own dark bg) so body goes dark invisibly, well before
           StatementSection enters the viewport */
        <ScrollMarker index={1} to="dark" refs={markerRefs} />
      } />
      <BannerSection />

      {/* Statement section — theme already dark when this enters viewport */}
      <StatementSection />

      {/* Marker 2: dark→white — triggers between Statement and Programs */}
      <ScrollMarker index={2} to="light" refs={markerRefs} />

      {/* Programs section */}
      <PerfilesSection />

      <SedesSection markerSlot={
        /* Marker 3: white→dark — inside SedesSection (which has its own
           dark bg) so body goes dark invisibly while section is visible */
        <ScrollMarker index={3} to="dark" refs={markerRefs} />
      } />

      <ProgramasGridSection />

      <Footer />
    </main>
  );
}
