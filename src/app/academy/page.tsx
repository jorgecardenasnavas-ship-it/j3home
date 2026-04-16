"use client";

import React, { useRef, useEffect, useState } from "react";
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

  /* Mouse drag (desktop viewing mobile layout) */
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      e.preventDefault(); // Prevent link drag / text selection
      dragState.current = { startX: e.pageX, scrollLeft: el.scrollLeft, active: true, moved: false };
      setIsDragging(true);
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
      // Disable snap during drag so it doesn't fight
      el.style.scrollSnapType = "none";
    };

    const onMove = (e: MouseEvent) => {
      if (!dragState.current.active) return;
      e.preventDefault();
      const walk = (e.pageX - dragState.current.startX) * 1.2;
      if (Math.abs(walk) > 3) dragState.current.moved = true;
      el.scrollLeft = dragState.current.scrollLeft - walk;
    };

    const onUp = () => {
      if (!dragState.current.active) return;
      dragState.current.active = false;
      setIsDragging(false);
      el.style.cursor = "grab";
      el.style.userSelect = "";
      // Restore scroll-snap from CSS (will snap to nearest card on release if CSS sets it)
      el.style.scrollSnapType = "";
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
    const scrollLeft = child.offsetLeft - (el.clientWidth / 2) + (child.offsetWidth / 2);
    el.scrollTo({ left: scrollLeft, behavior: "smooth" });
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
      viewBox="0 -5 155 210"
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

      {/* Wrapper group — shifts down to center ball at rest, up on hover to show full logo */}
      <g className="j3-ball-content">
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
      </g>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════
   PROGRAM BAR — Apple-style product navigation
   ═══════════════════════════════════════════════════════ */

const PROGRAM_NAV = [
  { name: "Kinder", img: "/images/academy/kinder.jpeg", target: "juniors", cardId: "card-kinder", tag: "4+" },
  { name: "Kids", img: "/images/academy/kids.jpeg", target: "juniors", cardId: "card-kids", tag: "10+" },
  { name: "Junior", img: "/images/academy/nextgen.jpeg", target: "juniors", cardId: "card-nextgen", tag: "14+" },
  { name: "Next Gen", img: "/images/academy/nextgen-pro.jpeg", target: "juniors", cardId: "card-nextgenpro", tag: "16+" },
  { name: "Tu Club", img: "/images/academy/amateur.jpeg", target: "adultos", cardId: "card-tuclub", tag: "Adultos" },
  { name: "Intensive", img: "/images/academy/stage-group.jpeg", target: "intensive", cardId: "card-intensive", tag: "Camps" },
];

function ProgramBar() {
  const [compact, setCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const dragStateRef = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  useEffect(() => {
    /* Hysteresis thresholds: enter compact after a meaningful scroll,
       exit compact only when scrolled nearly back to top. Prevents jitter
       if the user hovers near the transition point. */
    const ENTER = 180;
    const EXIT = 80;
    const onScroll = () => {
      const y = window.scrollY;
      setCompact((prev) => (prev ? y > EXIT : y > ENTER));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const updateEdges = () => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      setCanScrollLeft(el.scrollLeft > 2);
      setCanScrollRight(el.scrollLeft < maxScroll - 2);
    };
    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    window.addEventListener("resize", updateEdges);
    return () => {
      el.removeEventListener("scroll", updateEdges);
      window.removeEventListener("resize", updateEdges);
    };
  }, [compact]);

  /* Nudge animation retirada: el peek del siguiente círculo (width = 100vw/5.5)
     ya sirve de hint visual y en móviles reales la animación era molesta. */

  /* Mouse drag-to-scroll (PC) */
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    /* Only left button */
    if (e.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: e.pageX,
      startScroll: el.scrollLeft,
      moved: false,
    };
    /* Disable smooth scroll while dragging so scrollLeft follows the pointer 1:1 */
    el.style.scrollBehavior = "auto";
    el.style.cursor = "grabbing";
    e.preventDefault();
  };
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const state = dragStateRef.current;
    if (!state.active) return;
    const el = scrollRef.current;
    if (!el) return;
    const walk = e.pageX - state.startX;
    if (Math.abs(walk) > 3) state.moved = true;
    el.scrollLeft = state.startScroll - walk;
    e.preventDefault();
  };
  const endDrag = () => {
    const el = scrollRef.current;
    if (!dragStateRef.current.active) return;
    if (el) {
      el.style.cursor = "";
      el.style.scrollBehavior = "";
    }
    /* Keep "moved" true for a tick so the click handler can see it */
    setTimeout(() => {
      dragStateRef.current.active = false;
    }, 0);
  };

  return (
    <div className="sticky top-[52px] z-[90]">
      <div
        className="border-b border-white/[.06] relative"
        style={{ backgroundColor: "#121214", transition: "all 0.5s cubic-bezier(.16,1,.3,1)" }}
      >
        {/* Left fade hint — narrow so previous circle is still visible */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-5 z-10 min-[961px]:hidden"
          style={{
            background: "linear-gradient(to right, #121214 0%, rgba(18,18,20,0) 100%)",
            opacity: canScrollLeft ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Right fade hint — narrow so next circle is still visible */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 right-0 w-5 z-10 min-[961px]:hidden"
          style={{
            background: "linear-gradient(to left, #121214 0%, rgba(18,18,20,0) 100%)",
            opacity: canScrollRight ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <div className="max-w-[1200px] mx-auto">
          <div
            ref={scrollRef}
            onMouseDown={compact ? undefined : onMouseDown}
            onMouseMove={compact ? undefined : onMouseMove}
            onMouseUp={compact ? undefined : endDrag}
            onMouseLeave={compact ? undefined : endDrag}
            className={`flex items-center gap-0 scrollbar-hide min-[961px]:justify-center select-none ${compact ? "overflow-hidden justify-center" : "overflow-x-auto"}`}
            style={{
              scrollBehavior: "smooth",
              paddingTop: compact ? "0px" : "8px",
              paddingBottom: compact ? "0px" : "8px",
              cursor: compact ? "default" : "grab",
            }}
          >
            {PROGRAM_NAV.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  /* Suppress click if user was dragging */
                  if (dragStateRef.current.moved) {
                    dragStateRef.current.moved = false;
                    return;
                  }
                  const isMobileView = window.innerWidth < 961;
                  const cards = document.querySelectorAll(`[data-card-id="${p.cardId}"]`);
                  /* Pick correct card: desktop = first (inside PorscheRow), mobile = last (inside ScrollCarousel) */
                  const target = isMobileView
                    ? Array.from(cards).pop()
                    : Array.from(cards)[0];
                  if (!target) {
                    document.getElementById(p.target)?.scrollIntoView({ behavior: "smooth" });
                    return;
                  }

                  if (isMobileView) {
                    /* Mobile: scroll carousel horizontally + page vertically */
                    const carousel = target.closest(".overflow-x-auto");
                    if (carousel) {
                      const cardWrapper = target.closest(".shrink-0") as HTMLElement;
                      if (cardWrapper) {
                        const scrollLeft = cardWrapper.offsetLeft - (carousel.clientWidth / 2) + (cardWrapper.offsetWidth / 2);
                        carousel.scrollTo({ left: scrollLeft, behavior: "smooth" });
                      }
                      const cRect = carousel.getBoundingClientRect();
                      const offset = 52 + 40;
                      const top = cRect.top + window.scrollY - (window.innerHeight / 2) + (cRect.height / 2) + offset;
                      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                    }
                  } else {
                    /* Desktop: scroll page to center the card */
                    const rect = target.getBoundingClientRect();
                    const offset = 52 + 40;
                    const top = rect.top + window.scrollY - (window.innerHeight / 2) + (rect.height / 2) + offset;
                    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                  }

                  target.classList.add("j3-card-highlight");
                  setTimeout(() => target.classList.remove("j3-card-highlight"), 3200);
                }}
                className="group/pnav flex flex-col items-center shrink-0 cursor-pointer transition-all duration-500 hover:opacity-100 opacity-70"
                style={{
                  /* Non-compact: ~4.5 items visible → 4 círculos completos + 50% del 5º
                     asomando como peek claro que invita al scroll. En móviles estándar
                     (360–430px) el 5º siempre queda cortado por la mitad.
                     Compact: fit all 7 labels at once (buffer of 14px para scrollbars). */
                  width: compact
                    ? "clamp(48px, calc((100vw - 14px) / 7), 90px)"
                    : "clamp(74px, calc(100vw / 4.5), 110px)",
                  paddingTop: compact ? "6px" : undefined,
                  paddingBottom: compact ? "6px" : undefined,
                }}
              >
                {/* Thumbnail — hidden in compact mode */}
                <div
                  className="j3-pnav-circle relative rounded-full"
                  style={{
                    width: compact ? "0px" : undefined,
                    height: compact ? "0px" : undefined,
                    opacity: compact ? 0 : 1,
                    marginBottom: compact ? "0px" : "6px",
                    transition: "all 0.5s cubic-bezier(.16,1,.3,1)",
                    border: "1.75px solid rgba(220,175,100,1)",
                    boxShadow: "0 0 10px rgba(220,175,100,.25), 0 0 3px rgba(220,175,100,.3)",
                  }}
                >
                  <div className="w-[42px] h-[42px] min-[961px]:w-[52px] min-[961px]:h-[52px] rounded-full overflow-hidden">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/pnav:scale-110"
                      style={{ filter: "saturate(0.9) brightness(0.98) contrast(0.98)" }}
                    />
                  </div>
                </div>
                {/* Name */}
                <span
                  className="font-semibold text-white/80 group-hover/pnav:text-[var(--g1)] transition-all duration-300 whitespace-nowrap leading-tight"
                  style={{ fontSize: compact ? "10px" : undefined }}
                >
                  {p.name}
                </span>
                {/* Age tag — hidden in compact */}
                <span
                  className="text-[9px] min-[961px]:text-[10px] text-white/40 group-hover/pnav:text-white/60 transition-all duration-500"
                  style={{
                    maxHeight: compact ? "0px" : "20px",
                    opacity: compact ? 0 : 1,
                    marginTop: compact ? "0px" : "1px",
                    overflow: "hidden",
                  }}
                >
                  {p.tag}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
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

const AUTO_ADVANCE_MS = 3000;

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
                ? "saturate(0.88) brightness(0.98) contrast(0.98)"
                : "saturate(0.9) brightness(1) contrast(0.97)",
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

          {/* CTA — scroll to programs (reference-style: ball left, text right) */}
          <button
            type="button"
            onClick={(e) => {
              const btn = e.currentTarget;
              btn.classList.add("j3-cta-active");
              setTimeout(() => {
                btn.classList.remove("j3-cta-active");
                document.getElementById("programas")?.scrollIntoView({ behavior: "smooth" });
              }, 1200);
            }}
            className="group/cta j3-hero-cta relative inline-flex items-center cursor-pointer w-fit mx-auto mt-6 rounded-full border border-white/[.12] hover:border-[var(--g1)]/30 transition-all duration-700 ease-out"
            style={{
              background: "rgba(255,255,255,.04)",
              backdropFilter: "blur(12px)",
              padding: "6px 28px 6px 6px",
            }}
          >
            {/* Ball container — circular, prominent */}
            <span className="j3-hero-ball relative flex items-center justify-center w-[48px] h-[48px] max-[960px]:w-[42px] max-[960px]:h-[42px] rounded-full overflow-visible shrink-0"
              style={{ background: "linear-gradient(135deg, rgba(220,175,100,.12) 0%, rgba(220,175,100,.04) 100%)" }}
            >
              <span className="j3-ball-wrap w-[32px] h-[32px] max-[960px]:w-[28px] max-[960px]:h-[28px] transition-all duration-700 ease-out">
                <J3Ball className="w-full h-full" />
              </span>
              {/* Glow ring on hover */}
              <span className="absolute inset-0 rounded-full opacity-0 group-hover/cta:opacity-100 transition-opacity duration-700"
                style={{ boxShadow: "0 0 20px rgba(220,175,100,.25), inset 0 0 12px rgba(220,175,100,.08)" }} />
            </span>

            {/* Text right */}
            <span className="flex flex-col ml-4 max-[960px]:ml-3 text-left">
              <span
                className="text-[13px] max-[960px]:text-[12px] font-semibold tracking-[2.5px] uppercase text-[var(--g1)] group-hover/cta:text-white transition-colors duration-500"
                style={isMobile ? { textShadow: "0 1px 8px rgba(0,0,0,.6)" } : undefined}
              >
                {t.academy.hero.ctaLabel}
              </span>
              <span className="j3-cta-line h-[1.5px] w-full mt-[4px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] origin-left scale-x-[0.3] group-hover/cta:scale-x-100 transition-transform duration-700 ease-out" />
            </span>

            {/* Arrow hint — slides in on hover */}
            <span className="j3-hero-arrow ml-3 max-[960px]:ml-2 opacity-0 -translate-x-2 group-hover/cta:opacity-70 group-hover/cta:translate-x-0 transition-all duration-500 ease-out">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--g1)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
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
        style={{ opacity: 0.55, filter: "saturate(0.8) brightness(0.96) contrast(0.97)", transform: "scale(1.15)" }}
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

        {/* Stats — silent authority (hero + support) */}
        <div className="flex flex-col items-center w-full max-w-[720px] max-[640px]:max-w-[420px] mx-auto gap-8 max-[640px]:gap-6">
          {/* Hero stat — 20+ años */}
          <div
            className="text-center"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: `all 0.8s cubic-bezier(.16,1,.3,1) 0.7s`,
            }}
          >
            <Counter
              val={20}
              suffix="+"
              className="block stmt-stat font-extrabold text-[clamp(48px,7vw,80px)] tracking-[-2px] leading-[1] drop-shadow-[0_2px_16px_rgba(212,175,55,0.4)]"
            />
            <span className="block text-[12px] max-[640px]:text-[11px] font-semibold tracking-[3px] max-[640px]:tracking-[2.5px] uppercase theme-muted mt-3">
              años
            </span>
          </div>

          {/* Support stats row — 2 columns */}
          <div className="grid grid-cols-2 items-center justify-items-center w-full max-w-[560px] max-[640px]:max-w-[360px] relative">
            {[
              { num: 2000, suffix: "+", label: "jugadores formados" },
              { num: 18, suffix: "", label: "títulos profesionales" },
            ].map((stat, i) => (
              <div key={i} className="relative w-full flex items-center justify-center">
                {i > 0 && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[44px] max-[640px]:h-[36px] bg-gradient-to-b from-transparent via-[var(--g1)]/30 to-transparent" />
                )}
                <div
                  className="text-center"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "none" : "translateY(16px)",
                    transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${0.9 + i * 0.15}s`,
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
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S2b — STATEMENT STATS (authority numbers after philosophy)
   ═══════════════════════════════════════════════════════ */

function StatementStats() {
  const { ref, visible } = useReveal(0.3);

  const supportStats: { num: number; suffix: string; label: string }[] = [
    { num: 2000, suffix: "+", label: "jugadores formados" },
    { num: 18, suffix: "", label: "títulos profesionales" },
  ];

  return (
    <section className="relative pb-[100px] pt-[20px] max-[960px]:pb-[64px] max-[960px]:pt-[12px] px-12 max-[960px]:px-6 max-[640px]:px-4">
      <div
        ref={ref}
        className="flex flex-col items-center w-full max-w-[720px] max-[640px]:max-w-[420px] mx-auto gap-8 max-[640px]:gap-6"
      >
        {/* Hero stat — 20+ años */}
        <div
          className="text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: "all 0.8s cubic-bezier(.16,1,.3,1) 0s",
          }}
        >
          <Counter
            val={20}
            suffix="+"
            className="block j3-grad-text font-extrabold text-[clamp(48px,7vw,80px)] tracking-[-2px] leading-[1] drop-shadow-[0_2px_16px_rgba(212,175,55,0.4)]"
          />
          <span className="block text-[12px] max-[640px]:text-[11px] font-semibold tracking-[3px] max-[640px]:tracking-[2.5px] uppercase text-white/60 mt-3">
            años
          </span>
        </div>

        {/* Support stats row */}
        <div className="grid grid-cols-2 items-center justify-items-center w-full max-w-[560px] max-[640px]:max-w-[360px] relative">
          {supportStats.map((stat, i) => (
            <div key={i} className="relative w-full flex items-center justify-center">
              {i > 0 && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-[44px] max-[640px]:h-[36px] bg-gradient-to-b from-transparent via-[var(--g1)]/30 to-transparent" />
              )}
              <div
                className="text-center"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : "translateY(16px)",
                  transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${0.2 + i * 0.15}s`,
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

/* WhatsApp icon SVG path */
const WA_PATH = "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z";

/** Pill CTA with WhatsApp icon. Collapsed: only gold circle. Expanded: reveals text + progress + arrow. */
function WaCtaPill({ label, size = "md", expanded = false }: { label: string; size?: "md" | "sm"; expanded?: boolean }) {
  const isSm = size === "sm";
  // Option 2: pill wrapper, small circle anchored RIGHT, text reveals to the LEFT
  const circleSz = isSm ? "28px" : "32px";
  const iconSz = isSm ? 15 : 17;
  const textSz = isSm ? "10px" : "12px";
  const pad = isSm ? "5px" : "6px";
  const textMarginLeft = isSm ? "14px" : "18px";
  const textMarginRight = isSm ? "10px" : "12px";
  return (
    <span
      className="j3-wa-cta relative inline-flex items-center rounded-full transition-all duration-700 ease-out"
      style={{
        padding: pad,
        background: "linear-gradient(135deg, rgba(220,175,100,.08) 0%, rgba(220,175,100,.02) 100%)",
        border: "1px solid rgba(220,175,100,.28)",
        boxShadow: expanded ? "0 0 22px rgba(220,175,100,.18)" : "none",
      }}
    >
      {/* Reveal group: collapses to 0 width when !expanded, text sits to the LEFT of the circle */}
      <span
        className="flex items-center overflow-hidden transition-all duration-700 ease-out"
        style={{
          maxWidth: expanded ? "260px" : "0px",
          opacity: expanded ? 1 : 0,
          marginLeft: expanded ? textMarginLeft : "0px",
          marginRight: expanded ? textMarginRight : "0px",
        }}
      >
        <span className="flex flex-col text-right whitespace-nowrap">
          <span
            className="font-semibold tracking-[2.5px] uppercase text-[var(--g1)] whitespace-nowrap"
            style={{ fontSize: textSz }}
          >
            {label}
          </span>
          <span
            className="h-[1.5px] w-full mt-[3px] origin-right transition-transform duration-700 ease-out"
            style={{
              transform: expanded ? "scaleX(1)" : "scaleX(0)",
              background: "linear-gradient(to left, var(--g1), var(--g2))",
            }}
          />
        </span>
      </span>
      {/* Circle with gold WhatsApp icon — always visible, anchored right */}
      <span
        className="j3-wa-circle relative flex items-center justify-center rounded-full shrink-0"
        style={{
          width: circleSz,
          height: circleSz,
          background: "linear-gradient(135deg, rgba(220,175,100,.22) 0%, rgba(220,175,100,.06) 100%)",
        }}
      >
        <svg width={iconSz} height={iconSz} viewBox="0 0 24 24" fill="var(--g1)" className="shrink-0">
          <path d={WA_PATH} />
        </svg>
      </span>
    </span>
  );
}

/* Porsche-style program tile — full-bleed image, info overlay at bottom */
function ProgramTile({
  tag, title, sub, cta, image, href, isHovered, onHover, onLeave, index, visible, cardId, forceExpand = false, inCarousel = false,
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
  cardId?: string;
  forceExpand?: boolean;
  inCarousel?: boolean;
}) {
  // In a carousel (mobile), expansion depends ONLY on visual weight (active slide),
  // not on mouse hover. On desktop, hover drives expansion.
  const expanded = inCarousel ? forceExpand : isHovered;
  return (
    <a
      data-card-id={cardId}
      href={cta.href}
      target="_blank"
      rel="noopener noreferrer"
      className="relative overflow-hidden rounded-lg cursor-pointer block h-full"
      style={{
        background: "#000",
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(.16,1,.3,1), transform 0.7s cubic-bezier(.16,1,.3,1), box-shadow 0.5s cubic-bezier(.22,1,.36,1)",
        transitionDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Image — full cover con tratamiento sutil:
          reposo → ligera desaturación / brightness bajado, expanded → plenitud + zoom suave */}
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          transform: expanded ? "scale3d(1.035,1.035,1.035)" : "scale3d(1,1,1)",
          transition: "transform 0.9s cubic-bezier(0,0,0.2,1), filter 0.9s cubic-bezier(.16,1,.3,1)",
          filter: expanded
            ? "saturate(0.95) brightness(1.01) contrast(0.98)"
            : "saturate(0.88) brightness(0.98) contrast(0.96)",
        }}
      />

      {/* Línea gold superior — expande de 50% → 100% al hover/active (estilo featured de ProductsSection) */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] z-[10] pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent 0%, var(--g1) 50%, transparent 100%)",
          width: expanded ? "100%" : "55%",
          opacity: expanded ? 0.9 : 0.35,
          transition: "width 0.7s cubic-bezier(.16,1,.3,1), opacity 0.5s ease-out",
        }}
      />

      {/* Top gradient — ampliado y más denso para asegurar legibilidad de título+etapa+edad */}
      <div
        className="absolute top-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: "40%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.6) 25%, rgba(0,0,0,0.3) 55%, rgba(0,0,0,0.1) 80%, transparent 100%)",
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

      {/* Title + etapa — top center (text-shadow sutil como red de seguridad sobre zonas claras de la imagen) */}
      <div
        className="absolute top-0 left-0 right-0 z-[6] flex flex-col items-center pt-7 max-[640px]:pt-5 px-4 text-center"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <h4 className="font-bold text-[clamp(26px,3.5vw,48px)] uppercase tracking-[-1.5px] leading-[1] text-white">
          {title}
        </h4>
        <span className="mt-[6px] text-[10px] max-[640px]:text-[9.5px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
          {tag}
        </span>
      </div>

      {/* Bottom — edad (izquierda) + CTA (derecha) */}
      <div className="absolute bottom-0 left-0 right-0 z-[13] p-[18px] min-[961px]:p-[clamp(16px,1.25vw+12px,36px)]">
        <div className="flex items-end justify-between gap-3">
          <span
            className="text-[13px] max-[640px]:text-[12px] font-normal text-white/90 leading-[1.3] tracking-[0.2px]"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)" }}
          >
            {sub}
          </span>
          <span className="hidden min-[961px]:inline-flex shrink-0">
            <WaCtaPill label={cta.label} size="md" expanded={expanded} />
          </span>
          <span className="inline-flex min-[961px]:hidden shrink-0">
            <WaCtaPill label={cta.label} size="sm" expanded={expanded} />
          </span>
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

/** Mobile-only horizontal scroll carousel with drag, snap, and Porsche dots */
function ScrollCarousel({
  children,
  cardWidth = "clamp(260px, 70vw, 340px)",
  cardHeight = "clamp(320px, 80vw, 420px)",
}: {
  children: React.ReactNode[];
  cardWidth?: string;
  cardHeight?: string;
}) {
  const { scrollRef, activeSlide, goTo } = useDragScroll(children.length);

  return (
    <div className="min-[961px]:hidden">
      <div
        ref={scrollRef}
        className="flex gap-[18px] overflow-x-auto scrollbar-hide -mx-3 px-3"
        style={{ cursor: "grab" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {React.isValidElement<{ forceExpand?: boolean; inCarousel?: boolean }>(child)
              ? React.cloneElement(child, { forceExpand: i === activeSlide, inCarousel: true })
              : child}
          </div>
        ))}
        <div className="shrink-0 w-1" aria-hidden />
      </div>
      <div className="px-3">
        <PorscheDots total={children.length} active={activeSlide} onDotClick={goTo} />
      </div>
    </div>
  );
}

/** Porsche-style flex row: 2 cards that expand/shrink on hover (desktop only) */
function PorscheRow({ children, hoveredIdx }: { children: React.ReactNode[]; hoveredIdx: number | null }) {
  return (
    <div className="hidden min-[961px]:flex gap-[clamp(16px,1.25vw+12px,36px)]">
      {children.map((child, i) => (
        <div
          key={i}
          style={{
            flex: hoveredIdx === null ? "1 1 50%" : hoveredIdx === i ? "1 1 55%" : "1 1 45%",
            height: "clamp(320px, calc(7vh + 30vw), 540px)",
            transition: "flex 0.6s cubic-bezier(0, 0, 0.2, 1)",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

function PerfilesSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  /* Hover state — desktop PorscheRow (per row of 2) + mobile carousel */
  const [jRow0Hover, setJRow0Hover] = useState<number | null>(null);
  const [jRow1Hover, setJRow1Hover] = useState<number | null>(null);
  const [aRow0Hover, setARow0Hover] = useState<number | null>(null);
  const [iRow0Hover, setIRow0Hover] = useState<number | null>(null);
  const [jMobileHover, setJMobileHover] = useState<number | null>(null);
  const [aMobileHover, setAMobileHover] = useState<number | null>(null);
  const [iMobileHover, setIMobileHover] = useState<number | null>(null);

  /* Juniors cards — visual data merged with i18n strings */
  const juniorsImages = [
    "/images/academy/kinder.jpeg",
    "/images/academy/kids.jpeg",
    "/images/academy/nextgen.jpeg",
    "/images/academy/nextgen-pro.jpeg",
  ];
  const juniorsCardIds = ["card-kinder", "card-kids", "card-nextgen", "card-nextgenpro"];
  const juniorsCards = t.academy.programs.juniorsCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    image: juniorsImages[i],
    cta: { label: c.ctaLabel, href: waLink(c.waMsg) },
    cardId: juniorsCardIds[i],
  }));
  const { itemRefs: jRefs, visibleItems: jVis } = useStaggerReveal(2, 0.15); // 2 desktop rows
  const jMobileReveal = useReveal(0.15);

  /* Adultos cards */
  const adultosImages = ["/images/academy/amateur.jpeg", "/images/academy/pro.jpeg"];
  const adultosCardIds = ["card-tuclub", "card-adultos-2"];
  const adultosCards = t.academy.programs.adultosCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    image: adultosImages[i] || adultosImages[0],
    cta: { label: c.ctaLabel, href: waLink(c.waMsg) },
    cardId: adultosCardIds[i] || `card-adultos-${i}`,
  }));
  const { itemRefs: aRefs, visibleItems: aVis } = useStaggerReveal(1, 0.15); // 1 desktop row
  const aMobileReveal = useReveal(0.15);

  /* Intensive Training cards — standalone section */
  const intensiveImages = ["/images/academy/stage-group.jpeg"];
  const intensiveCardIds = ["card-intensive"];
  const intensiveCards = t.academy.programs.intensiveCards.map((c, i) => ({
    tag: c.tag,
    title: c.title,
    sub: c.sub,
    image: intensiveImages[i] || intensiveImages[0],
    cta: { label: c.ctaLabel, href: waLink(c.waMsg) },
    cardId: intensiveCardIds[i] || `card-intensive-${i}`,
  }));
  const { itemRefs: iRefs, visibleItems: iVis } = useStaggerReveal(1, 0.15);
  const iMobileReveal = useReveal(0.15);

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
        <p className="max-w-[720px] mt-5 text-[15px] max-[960px]:text-[14px] theme-text opacity-75 leading-[1.55]">
          {t.academy.programs.headingSub}
        </p>
      </div>

      {/* Block 1: Juniors */}
      <div id="juniors" className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">01</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.juniorsLabel}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">De los 4 a los 16+. Cada etapa, un objetivo.</span>
        </div>
        {/* Desktop: PorscheRow (2 rows of 2) */}
        <div className="px-4 max-w-[1600px] mx-auto py-10 hidden min-[961px]:flex flex-col gap-[clamp(16px,1.25vw+12px,36px)]">
          <div ref={el => { jRefs.current[0] = el as HTMLDivElement | null; }}>
            <PorscheRow hoveredIdx={jRow0Hover}>
              {juniorsCards.slice(0, 2).map((c, i) => (
                <ProgramTile
                  key={i} tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                  image={c.image} href={c.cta.href} cardId={c.cardId}
                  isHovered={jRow0Hover === i}
                  onHover={() => setJRow0Hover(i)} onLeave={() => setJRow0Hover(null)}
                  index={i} visible={jVis[0]}
                />
              ))}
            </PorscheRow>
          </div>
          <div ref={el => { jRefs.current[1] = el as HTMLDivElement | null; }}>
            <PorscheRow hoveredIdx={jRow1Hover}>
              {juniorsCards.slice(2, 4).map((c, i) => (
                <ProgramTile
                  key={i} tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                  image={c.image} href={c.cta.href} cardId={c.cardId}
                  isHovered={jRow1Hover === i}
                  onHover={() => setJRow1Hover(i)} onLeave={() => setJRow1Hover(null)}
                  index={i} visible={jVis[1]}
                />
              ))}
            </PorscheRow>
          </div>
        </div>
        {/* Mobile: Horizontal scroll carousel with Porsche dots */}
        <div
          ref={jMobileReveal.ref}
          className="max-w-[1600px] mx-auto py-10 min-[961px]:hidden"
          style={{
            opacity: jMobileReveal.visible ? 1 : 0,
            transform: jMobileReveal.visible ? "none" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <ScrollCarousel>
            {juniorsCards.map((c, i) => (
              <ProgramTile
                key={i} tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                image={c.image} href={c.cta.href} cardId={c.cardId}
                isHovered={jMobileHover === i}
                onHover={() => setJMobileHover(i)} onLeave={() => setJMobileHover(null)}
                index={i} visible={jMobileReveal.visible}
              />
            ))}
          </ScrollCarousel>
        </div>
      </div>

      {/* Block 2: Adultos */}
      <div id="adultos" className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">02</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.adultosLabel}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">Cada jugador tiene su momento y evolución.</span>
        </div>
        {/* Desktop: split layout — cards + info panel */}
        <div className="px-4 max-w-[1600px] mx-auto py-10 hidden min-[961px]:block">
          <div
            ref={el => { aRefs.current[0] = el as HTMLDivElement | null; }}
            className="grid grid-cols-[1.25fr_1fr] gap-[clamp(24px,2vw+16px,56px)] items-stretch"
          >
            {/* Card(s) — full-height column */}
            <div
              className="flex flex-col gap-[clamp(16px,1.25vw+12px,36px)]"
              style={{ height: "clamp(360px, calc(7vh + 30vw), 540px)" }}
            >
              {adultosCards.map((c, i) => (
                <div key={i} className="flex-1 min-h-0">
                  <ProgramTile
                    tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                    image={c.image} href={c.cta.href} cardId={c.cardId}
                    isHovered={aRow0Hover === i}
                    onHover={() => setARow0Hover(i)} onLeave={() => setARow0Hover(null)}
                    index={i} visible={aVis[0]}
                  />
                </div>
              ))}
            </div>
            {/* Info panel */}
            <div
              className="flex flex-col justify-center py-6"
              style={{
                opacity: aVis[0] ? 1 : 0,
                transform: aVis[0] ? "none" : "translateY(24px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.2s",
              }}
            >
              <span className="theme-eyebrow text-[10px] font-normal tracking-[5px] uppercase block mb-3">
                {t.academy.programs.adultosInfoEyebrow}
              </span>
              <h3 className="font-bold text-[clamp(28px,2.6vw,44px)] uppercase tracking-[-1px] leading-[1.05] mb-5">
                <span className="theme-text">{t.academy.programs.adultosInfoHeadingPre} </span>
                <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.adultosInfoHeadingAccent}</span>
              </h3>
              <p className="text-[15px] theme-text opacity-80 leading-[1.55] max-w-[460px] mb-6">
                {t.academy.programs.adultosInfoDesc}
              </p>
              <ul className="flex flex-col divide-y theme-border">
                {t.academy.programs.adultosFeatures.map((f, idx) => (
                  <li key={idx} className="py-3 grid grid-cols-[140px_1fr] gap-4 items-baseline">
                    <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--g1)]">
                      {f.label}
                    </span>
                    <span className="theme-text opacity-80 text-[14px] leading-[1.45]">
                      {f.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile: card(s) on top, info panel below */}
        <div
          ref={aMobileReveal.ref}
          className="max-w-[1600px] mx-auto py-10 min-[961px]:hidden"
          style={{
            opacity: aMobileReveal.visible ? 1 : 0,
            transform: aMobileReveal.visible ? "none" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {adultosCards.length === 1 ? (
            <div className="flex justify-center px-4">
              {adultosCards.map((c, i) => (
                <div
                  key={i}
                  style={{
                    width: "min(92vw, 420px)",
                    height: "clamp(360px, 90vw, 480px)",
                  }}
                >
                  <ProgramTile
                    tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                    image={c.image} href={c.cta.href} cardId={c.cardId}
                    isHovered={aMobileHover === i}
                    onHover={() => setAMobileHover(i)} onLeave={() => setAMobileHover(null)}
                    index={i} visible={aMobileReveal.visible}
                    inCarousel forceExpand
                  />
                </div>
              ))}
            </div>
          ) : (
            <ScrollCarousel>
              {adultosCards.map((c, i) => (
                <ProgramTile
                  key={i} tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                  image={c.image} href={c.cta.href} cardId={c.cardId}
                  isHovered={aMobileHover === i}
                  onHover={() => setAMobileHover(i)} onLeave={() => setAMobileHover(null)}
                  index={i} visible={aMobileReveal.visible}
                />
              ))}
            </ScrollCarousel>
          )}
          {/* Info panel — mobile */}
          <div className="px-4 mt-8">
            <span className="theme-eyebrow text-[11px] font-normal tracking-[3px] uppercase block mb-3">
              {t.academy.programs.adultosInfoEyebrow}
            </span>
            <h3 className="font-bold text-[clamp(24px,5vw,32px)] uppercase tracking-[-0.5px] leading-[1.1] mb-4">
              <span className="theme-text">{t.academy.programs.adultosInfoHeadingPre} </span>
              <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.adultosInfoHeadingAccent}</span>
            </h3>
            <p className="text-[14px] theme-text opacity-80 leading-[1.55] mb-5">
              {t.academy.programs.adultosInfoDesc}
            </p>
            <ul className="flex flex-col divide-y theme-border">
              {t.academy.programs.adultosFeatures.map((f, idx) => (
                <li key={idx} className="py-3 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--g1)]">
                    {f.label}
                  </span>
                  <span className="theme-text opacity-80 text-[14px] leading-[1.45]">
                    {f.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Block 3: Intensive Training */}
      <div id="intensive" className="border-t theme-border">
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-5 flex items-center gap-4 border-b theme-border">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] theme-text tracking-[-1px]">03</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.intensiveLabel}</span>
          <span className="ml-auto text-[16px] theme-text opacity-70 italic tracking-normal normal-case hidden min-[961px]:inline">Formatos a medida para grupos y particulares.</span>
        </div>
        {/* Desktop: split layout — card + info panel */}
        <div className="px-4 max-w-[1600px] mx-auto py-10 hidden min-[961px]:block">
          <div
            ref={el => { iRefs.current[0] = el as HTMLDivElement | null; }}
            className="grid grid-cols-[1.25fr_1fr] gap-[clamp(24px,2vw+16px,56px)] items-stretch"
          >
            {/* Card */}
            <div style={{ height: "clamp(360px, calc(7vh + 30vw), 540px)" }}>
              {intensiveCards.map((c, i) => (
                <ProgramTile
                  key={i} tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                  image={c.image} href={c.cta.href} cardId={c.cardId}
                  isHovered={iRow0Hover === i}
                  onHover={() => setIRow0Hover(i)} onLeave={() => setIRow0Hover(null)}
                  index={i} visible={iVis[0]}
                />
              ))}
            </div>
            {/* Info panel */}
            <div
              className="flex flex-col justify-center py-6"
              style={{
                opacity: iVis[0] ? 1 : 0,
                transform: iVis[0] ? "none" : "translateY(24px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.2s",
              }}
            >
              <span className="theme-eyebrow text-[10px] font-normal tracking-[5px] uppercase block mb-3">
                {t.academy.programs.intensiveInfoEyebrow}
              </span>
              <h3 className="font-bold text-[clamp(28px,2.6vw,44px)] uppercase tracking-[-1px] leading-[1.05] mb-5">
                <span className="theme-text">{t.academy.programs.intensiveInfoHeadingPre} </span>
                <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.intensiveInfoHeadingAccent}</span>
              </h3>
              <p className="text-[15px] theme-text opacity-80 leading-[1.55] max-w-[460px] mb-6">
                {t.academy.programs.intensiveInfoDesc}
              </p>
              <ul className="flex flex-col divide-y theme-border">
                {t.academy.programs.intensiveFeatures.map((f, i) => (
                  <li key={i} className="py-3 grid grid-cols-[140px_1fr] gap-4 items-baseline">
                    <span className="text-[11px] font-semibold tracking-[2px] uppercase text-[var(--g1)]">
                      {f.label}
                    </span>
                    <span className="theme-text opacity-80 text-[14px] leading-[1.45]">
                      {f.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* Mobile: single centered card on top, info panel below */}
        <div
          ref={iMobileReveal.ref}
          className="max-w-[1600px] mx-auto py-10 min-[961px]:hidden"
          style={{
            opacity: iMobileReveal.visible ? 1 : 0,
            transform: iMobileReveal.visible ? "none" : "translateY(24px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="flex justify-center px-4">
            {intensiveCards.map((c, i) => (
              <div
                key={i}
                style={{
                  width: "min(92vw, 420px)",
                  height: "clamp(360px, 90vw, 480px)",
                }}
              >
                <ProgramTile
                  tag={c.tag} title={c.title} sub={c.sub} cta={c.cta}
                  image={c.image} href={c.cta.href} cardId={c.cardId}
                  isHovered={iMobileHover === i}
                  onHover={() => setIMobileHover(i)} onLeave={() => setIMobileHover(null)}
                  index={i} visible={iMobileReveal.visible}
                  inCarousel forceExpand
                />
              </div>
            ))}
          </div>
          {/* Info panel — mobile */}
          <div className="px-4 mt-8">
            <span className="theme-eyebrow text-[11px] font-normal tracking-[3px] uppercase block mb-3">
              {t.academy.programs.intensiveInfoEyebrow}
            </span>
            <h3 className="font-bold text-[clamp(24px,5vw,32px)] uppercase tracking-[-0.5px] leading-[1.1] mb-4">
              <span className="theme-text">{t.academy.programs.intensiveInfoHeadingPre} </span>
              <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.intensiveInfoHeadingAccent}</span>
            </h3>
            <p className="text-[14px] theme-text opacity-80 leading-[1.55] mb-5">
              {t.academy.programs.intensiveInfoDesc}
            </p>
            <ul className="flex flex-col divide-y theme-border">
              {t.academy.programs.intensiveFeatures.map((f, i) => (
                <li key={i} className="py-3 flex flex-col gap-1">
                  <span className="text-[10px] font-semibold tracking-[2px] uppercase text-[var(--g1)]">
                    {f.label}
                  </span>
                  <span className="theme-text opacity-80 text-[14px] leading-[1.45]">
                    {f.desc}
                  </span>
                </li>
              ))}
            </ul>
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
  video, images, videoStart, eyebrow, pulseDot, name, tag, href, index,
}: {
  video?: string;
  images?: string[];
  videoStart?: number;
  eyebrow?: string;
  pulseDot?: boolean;
  name: string;
  tag: string;
  href: string;
  index: number;
}) {
  const { ref, visible } = useReveal(0.15);
  const videoRef = useRef<HTMLVideoElement>(null);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [currentImg, setCurrentImg] = useState(0);
  const [hovered, setHovered] = useState(false);

  // Auto-rotate images every 4s
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImg(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  /* Radial gold glow that follows cursor — same as ProductsSection */
  useEffect(() => {
    const card = anchorRef.current;
    if (!card) return;
    const isDesktop = window.matchMedia("(min-width: 961px) and (hover: hover)").matches;
    if (!isDesktop) return;

    const glowEl = card.querySelector<HTMLElement>(".pc-glow");

    const move = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      if (glowEl) {
        glowEl.style.opacity = "1";
        glowEl.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(220,175,100,0.06), transparent 60%)`;
      }
    };
    const leave = () => {
      if (glowEl) glowEl.style.opacity = "0";
    };

    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 1s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
      }}
    >
      <a
        ref={anchorRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block overflow-hidden rounded-2xl bg-black no-underline border border-white/[.07] hover:border-[var(--g1)]/40 transition-colors duration-500"
        style={{ aspectRatio: "3 / 4" }}
      >
        {/* Radial gold glow — follows cursor on desktop (same as ProductsSection) */}
        <span className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-[5]" aria-hidden />

        {/* Gold accent line — siempre visible, se expande al hover (featured style de ProductsSection) */}
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[60%] opacity-40 group-hover:w-full group-hover:opacity-90 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] z-[6]"
          aria-hidden
        />

        {/* Media */}
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
            style={{
              filter: "saturate(0.9) brightness(1) contrast(0.97)",
              transform: hovered ? "scale3d(1.04,1.04,1.04)" : "scale3d(1,1,1)",
              transition: "transform .8s cubic-bezier(.16,1,.3,1)",
            }}
            onLoadedMetadata={() => { if (videoStart && videoRef.current) videoRef.current.currentTime = videoStart; }}
            onSeeking={() => { if (videoStart && videoRef.current && videoRef.current.currentTime < videoStart) videoRef.current.currentTime = videoStart; }}
          />
        ) : images && images.length > 0 ? (
          <div
            className="absolute inset-0"
            style={{
              transform: hovered ? "scale3d(1.04,1.04,1.04)" : "scale3d(1,1,1)",
              transition: "transform .8s cubic-bezier(.16,1,.3,1)",
            }}
          >
            {images.map((src, i) => (
              <img
                key={src}
                src={src}
                alt={`${name} ${i + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: currentImg === i ? 1 : 0,
                  transition: "opacity 1.2s ease",
                  filter: "saturate(0.9) brightness(1) contrast(0.97)",
                }}
              />
            ))}
          </div>
        ) : null}

        {/* Bottom gradient for legibility */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,.18) 45%, transparent 72%)" }}
        />

        {/* Eyebrow — top left (badge/status) */}
        {eyebrow && (
          <div className="absolute top-5 left-6 max-[640px]:top-4 max-[640px]:left-5 z-10 flex items-center gap-2">
            {pulseDot && (
              <span className="relative inline-flex shrink-0" aria-hidden>
                <span className="w-[6px] h-[6px] rounded-full bg-[var(--g1)]" />
                <span className="absolute inset-0 w-[6px] h-[6px] rounded-full bg-[var(--g1)] animate-ping" />
              </span>
            )}
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{eyebrow}</span>
          </div>
        )}

        {/* Bottom row: name + subtitle (left) · arrow (right) */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 max-[640px]:p-5 flex items-end justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0 flex-1">
            <span className="font-semibold text-[22px] max-[640px]:text-[18px] text-[var(--wh)] leading-[1.1] tracking-[-.4px]">
              {name}
            </span>
            <span className="text-[12px] max-[640px]:text-[11px] text-white/65">
              {tag}
            </span>
          </div>
          <span
            className="shrink-0"
            style={{
              color: hovered ? "var(--g1)" : "rgba(255,255,255,.9)",
              transform: hovered ? "translateX(6px)" : "translateX(0)",
              transition: "transform .5s cubic-bezier(.16,1,.3,1), color .35s ease",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  );
}

/** CTA card — "¿Tu club? Monta J3 en tu club". Misma aspect 3/4 que las sedes, sin imagen, foco en texto + gradiente gold sutil */
function ClubCtaCard({ index }: { index: number }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);
  const anchorRef = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  /* Mismo radial gold glow que SedeCard */
  useEffect(() => {
    const card = anchorRef.current;
    if (!card) return;
    const isDesktop = window.matchMedia("(min-width: 961px) and (hover: hover)").matches;
    if (!isDesktop) return;
    const glowEl = card.querySelector<HTMLElement>(".pc-glow");
    const move = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      if (glowEl) {
        glowEl.style.opacity = "1";
        glowEl.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(220,175,100,0.10), transparent 60%)`;
      }
    };
    const leave = () => { if (glowEl) glowEl.style.opacity = "0"; };
    card.addEventListener("mousemove", move);
    card.addEventListener("mouseleave", leave);
    return () => {
      card.removeEventListener("mousemove", move);
      card.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 1s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
      }}
    >
      <a
        ref={anchorRef}
        href="/business/llamada"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative block overflow-hidden rounded-2xl no-underline border border-[var(--g1)]/25 hover:border-[var(--g1)]/60 transition-colors duration-500"
        style={{
          aspectRatio: "3 / 4",
          background: "radial-gradient(140% 90% at 0% 100%, rgba(220,175,100,0.18) 0%, rgba(220,175,100,0.04) 40%, #050505 80%)",
        }}
      >
        {/* Pattern de pista — líneas SVG sutiles como "court outline" */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-[2]"
          viewBox="0 0 300 400"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
        >
          <defs>
            <linearGradient id="court-lines" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(220,175,100,0.18)" />
              <stop offset="100%" stopColor="rgba(220,175,100,0.04)" />
            </linearGradient>
          </defs>
          {/* Court outline centrado */}
          <rect x="60" y="90" width="180" height="230" fill="none" stroke="url(#court-lines)" strokeWidth="1" />
          {/* Línea central */}
          <line x1="60" y1="205" x2="240" y2="205" stroke="url(#court-lines)" strokeWidth="1" />
          {/* Líneas de servicio */}
          <line x1="60" y1="155" x2="240" y2="155" stroke="url(#court-lines)" strokeWidth="1" />
          <line x1="60" y1="255" x2="240" y2="255" stroke="url(#court-lines)" strokeWidth="1" />
          {/* Red central */}
          <line x1="150" y1="155" x2="150" y2="255" stroke="url(#court-lines)" strokeWidth="1" strokeDasharray="3 3" />
        </svg>

        {/* Radial gold glow sigue cursor */}
        <span className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-[5]" aria-hidden />

        {/* Línea gold superior (featured style, más intensa que en sedes) */}
        <span
          className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[70%] opacity-70 group-hover:w-full group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] z-[6]"
          aria-hidden
        />

        {/* Eyebrow top-left con dot pulsante */}
        <div className="absolute top-5 left-6 max-[640px]:top-4 max-[640px]:left-5 z-10 flex items-center gap-2">
          <span className="relative inline-flex shrink-0" aria-hidden>
            <span className="w-[6px] h-[6px] rounded-full bg-[var(--g1)]" />
            <span className="absolute inset-0 w-[6px] h-[6px] rounded-full bg-[var(--g1)] animate-ping" />
          </span>
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
            {t.academy.headquarters.clubCta.eyebrow}
          </span>
        </div>

        {/* Icono grande: handshake / partnership — arriba derecha */}
        <div
          className="absolute top-5 right-6 max-[640px]:top-4 max-[640px]:right-5 z-10 text-[var(--g1)]/60"
          style={{
            transform: hovered ? "scale(1.08) rotate(-4deg)" : "scale(1) rotate(0)",
            transition: "transform .6s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M11 17l2 2a1 1 0 1 0 3-3" />
            <path d="M14 14l2.5 2.5a1 1 0 1 0 3-3L15 9" />
            <path d="M3 7l6-2 4 3h1a2 2 0 1 1 0 4c-.6 0-2-.5-3.5-2" />
            <path d="M3 8l2 10 4-1 3 3" />
          </svg>
        </div>

        {/* Título + descripción — centrado vertical con aire */}
        <div className="absolute inset-x-0 bottom-[96px] max-[640px]:bottom-[84px] z-10 px-6 max-[640px]:px-5 text-left">
          <h3 className="font-bold text-[clamp(22px,2.1vw,28px)] uppercase tracking-[-0.6px] leading-[1.05] text-[var(--wh)]">
            {t.academy.headquarters.clubCta.title}
          </h3>
          <p className="mt-3 text-[12px] max-[640px]:text-[11px] font-light leading-[1.5] text-white/65">
            {t.academy.headquarters.clubCta.description}
          </p>
        </div>

        {/* CTA bottom row */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 max-[640px]:p-5 flex items-end justify-between gap-3">
          <span className="text-[11px] max-[640px]:text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]">
            {t.academy.headquarters.clubCta.cta}
          </span>
          <span
            className="shrink-0 text-[var(--g1)]"
            style={{
              transform: hovered ? "translateX(6px)" : "translateX(0)",
              transition: "transform .5s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </a>
    </div>
  );
}

function SedesSection({ markerSlot }: { markerSlot?: React.ReactNode }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);
  const { scrollRef, activeSlide, goTo } = useDragScroll(3);

  return (
    <section className="sedes-section relative overflow-hidden border-b border-white/[.07]">
      {/* Dark marker — at top of section so transition starts earlier */}
      {markerSlot}

      {/* Section header — compact, sección secundaria */}
      <div
        ref={ref}
        className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-[56px] pb-8 max-[960px]:pt-[44px] max-[960px]:pb-7"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-2 max-[960px]:text-[11px] max-[960px]:tracking-[3px]">
          {t.academy.headquarters.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(24px,2.6vw,36px)] uppercase tracking-[-0.5px] leading-[1.05]">
          <span className="sedes-heading">{t.academy.headquarters.headingPre}</span>
          <span className="j3-grad-text">{t.academy.headquarters.headingAccent}</span>
        </h2>
      </div>

      {/* Sedes — drag-scroll unificado (2 sedes + 1 CTA card), alineado a la izquierda */}
      <div className="max-w-[1600px] mx-auto pb-[56px] max-[960px]:pb-[44px] relative">
        <div
          ref={scrollRef}
          className="flex gap-6 max-[768px]:gap-4 overflow-x-auto scrollbar-hide px-4 max-[960px]:px-3"
          style={{ cursor: "grab", scrollSnapType: "x mandatory", scrollPadding: "0 16px" }}
        >
          <div className="shrink-0 snap-start" style={{ width: "clamp(220px, min(72vw, 36vh), 360px)" }}>
            <SedeCard
              video="https://finurapadelgym.com/wp-content/uploads/2025/10/home-2.webm"
              videoStart={5}
              eyebrow={t.academy.headquarters.sedes[0].badge}
              name={t.academy.headquarters.sedes[0].name}
              tag={t.academy.headquarters.sedes[0].tag}
              href="https://finurapadelgym.com"
              index={0}
            />
          </div>
          <div className="shrink-0 snap-start" style={{ width: "clamp(220px, min(72vw, 36vh), 360px)" }}>
            <SedeCard
              images={["/images/vals-1.jpg", "/images/vals-2.jpg", "/images/vals-3.jpg"]}
              eyebrow={t.academy.headquarters.sedes[1].badge}
              pulseDot
              name={t.academy.headquarters.sedes[1].name}
              tag={t.academy.headquarters.sedes[1].tag}
              href="https://valssport.com/limoneros/"
              index={1}
            />
          </div>
          <div className="shrink-0 snap-start" style={{ width: "clamp(220px, min(72vw, 36vh), 360px)" }}>
            <ClubCtaCard index={2} />
          </div>
          <div className="shrink-0 w-1" aria-hidden />
        </div>

        {/* Fade-out gradient a la derecha — hint de "hay más contenido" (solo móvil/tablet) */}
        <div
          className="pointer-events-none absolute top-0 right-0 bottom-[60px] w-16 max-[768px]:w-10 bg-gradient-to-l from-[var(--bk)] to-transparent z-[2] min-[1200px]:hidden"
          aria-hidden
          style={{ opacity: activeSlide < 2 ? 1 : 0, transition: "opacity .4s ease" }}
        />

        {/* Dots — solo móvil/tablet, centrados (en desktop se ven las 3 tarjetas a la vez) */}
        <div className="min-[1200px]:hidden px-4 max-[960px]:px-3 pt-5 flex items-center justify-center">
          <PorscheDots total={3} active={activeSlide} onDotClick={goTo} />
        </div>
      </div>
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
    { name: "Junior", tag: "14+ · Competición", img: "/images/academy/nextgen.jpeg", href: "#programas" },
    { name: "Next Gen", tag: "16+ · Circuito", img: "/images/academy/nextgen-pro.jpeg", href: "#programas" },
    { name: "Tu Club", tag: "Adultos", img: "/images/academy/amateur.jpeg", href: "#programas" },
    { name: "Intensive Training", tag: "Camps · Stages", img: "/images/academy/stage-group.jpeg", href: "#programas" },
  ];

  const { scrollRef: gridScrollRef, activeSlide: gridActive, goTo: gridGoTo } = useDragScroll(programs.length);

  /* Shared card renderer */
  const renderCard = (p: typeof programs[0]) => (
    <a
      key={p.name}
      href={p.href}
      className="group relative border border-white/[.07] hover:border-[var(--g1)]/30 overflow-hidden flex flex-col justify-end rounded-xl h-full"
    >
      <img
        src={p.img}
        alt={p.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        style={{ filter: "saturate(0.9) brightness(1) contrast(0.97)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
      <div className="relative z-10 p-4 max-[640px]:p-3">
        <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)] block mb-1">{p.tag}</span>
        <span className="font-bold text-[15px] max-[640px]:text-[13px] uppercase tracking-[-0.5px] text-[var(--wh)] leading-[1.1]">{p.name}</span>
      </div>
    </a>
  );

  return (
    <section data-hide-chat className="relative bg-[var(--bk)] py-[80px] max-[960px]:py-[60px] border-b border-white/[.07]">
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

        {/* Desktop: all 6 in a single flex row */}
        <div className="hidden min-[961px]:flex gap-3 px-4">
          {programs.map(p => (
            <div key={p.name} className="flex-1" style={{ height: "clamp(160px, 15vw, 220px)" }}>
              {renderCard(p)}
            </div>
          ))}
        </div>

        {/* Mobile: horizontal scroll with Porsche dots */}
        <div className="min-[961px]:hidden">
          <div
            ref={gridScrollRef}
            className="flex gap-[18px] overflow-x-auto snap-x snap-mandatory scrollbar-hide px-3"
            style={{ cursor: "grab" }}
          >
            {programs.map(p => (
              <div key={p.name} className="snap-start shrink-0" style={{ width: "clamp(150px, 42vw, 200px)", height: "clamp(150px, 42vw, 200px)" }}>
                {renderCard(p)}
              </div>
            ))}
            <div className="shrink-0 w-1" aria-hidden />
          </div>
          <div className="px-3">
            <PorscheDots total={programs.length} active={gridActive} onDotClick={gridGoTo} />
          </div>
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
      data-hide-chat
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
      <ProgramBar />

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
