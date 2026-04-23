"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import CoachCard from "@/components/CoachCard";
import { FilterSelect } from "@/components/FilterSelect";
import { FilterChips } from "@/components/FilterChips";
import { useI18n } from "@/i18n/context";
import { languageLabel } from "@/lib/languages";
import { haversineKm, formatDistance, type LatLng } from "@/lib/geo";
import { GeoProvider, useGeo } from "@/contexts/GeoContext";
import { FilterProvider, useFilters } from "@/contexts/FilterContext";
import {
  COACHES,
  COACH_COUNTRIES,
  COACH_LANGUAGES,
  COACH_SPECIALTIES,
  sortCoaches,
  filterCoaches,
  filterInProgressCoaches,
  pickDisplayCoaches,
  buildCoachesUrl,
  getCoachBadges,
  type Coach,
  type CoachSpecialty,
} from "@/data/coaches";

/* Leaflet map — only on client; heavy + uses window.
   Loading skeleton: shimmer dorado + grid de "meridianos" sutiles
   que evocan un atlas, con indicador de "buscando coaches"
   discreto en el centro. Más premium que un texto plano. */
const NetworkMap = dynamic(() => import("@/components/NetworkMap"), {
  ssr: false,
  loading: () => (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(circle at 30% 40%, rgba(201,169,110,0.06), transparent 55%), linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)",
      }}
      aria-label="Cargando mapa de la red J3"
      role="status"
    >
      {/* Meridianos sutiles — simulan un grid de atlas */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(201,169,110,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      {/* Shimmer dorado que barre de izquierda a derecha */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, transparent 35%, rgba(201,169,110,0.08) 50%, transparent 65%, transparent 100%)",
          animation: "j3ShimmerMap 2.2s linear infinite",
        }}
      />
      <style>{`
        @keyframes j3ShimmerMap {
          0%   { transform: translateX(-60%); }
          100% { transform: translateX(60%); }
        }
        @keyframes j3PulseDot {
          0%,100% { opacity: .35; transform: scale(1); }
          50%     { opacity: 1;   transform: scale(1.15); }
        }
      `}</style>
      {/* Indicador central: punto dorado pulsante + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <span
          aria-hidden
          className="block w-3 h-3 rounded-full"
          style={{
            background: "radial-gradient(circle at 50% 50%, #d4b882, #C9A96E 60%, #C9A96E 100%)",
            boxShadow: "0 0 0 2px rgba(0,0,0,0.55), 0 0 16px rgba(201,169,110,0.5)",
            animation: "j3PulseDot 1.6s ease-in-out infinite",
          }}
        />
        <span
          className="text-[9px] tracking-[4px] uppercase font-semibold"
          style={{ color: "rgba(201,169,110,0.85)" }}
        >
          Buscando coaches J3
        </span>
      </div>
    </div>
  ),
});


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
   PROGRAM BAR — Apple-style product navigation
   ═══════════════════════════════════════════════════════ */

/* Navegación sticky híbrida:
   - Primer tramo: sedes J3 (hoy solo el Lab · Málaga). Click centra el mapa
     en esa sede y vuelve al hero.
   - Separador dorado.
   - Segundo tramo: secciones navegables de la página (Coaches, Programas,
     Coach360). Click = anchor scroll.
   Cuando abramos franquicias, se añaden al array de sedes sin cambiar nada
   más. La jerarquía visual (sede grande · sección pequeña) hace que el
   inventario Lab/franquicia destaque sobre el resto. */

type SedeItem = {
  kind: "sede";
  name: string;
  sub: string;
  slug: string;   // para j3:map:focus
  img: string;
};

type SectionItem = {
  kind: "section";
  name: string;
  anchor: string; // id HTML sin "#"
};

const STICKY_SEDES: SedeItem[] = [
  { kind: "sede", name: "Headquarter", sub: "Málaga", slug: "j3-hq-malaga", img: "/images/imagotipo-gold.svg" },
];

const STICKY_SECTIONS: SectionItem[] = [
  { kind: "section", name: "Juniors",  anchor: "juniors" },
  { kind: "section", name: "Adultos",  anchor: "adultos" },
  { kind: "section", name: "Camps",    anchor: "intensive" },
  { kind: "section", name: "M\u00E9todo",   anchor: "metodo" },
];

/** Tarjetas de producto para el strip Apple-style bajo el sticky nav. */
type ProductCard = {
  name: string;
  tag: string;
  img: string;
  group: string;   // coincide con anchor de STICKY_SECTIONS
  anchor: string;  // id HTML al que navega el click (fallback si no hay cardId)
  cardId?: string; // data-card-id de la tarjeta concreta dentro de la sección
};

const PRODUCT_CARDS: ProductCard[] = [
  { name: "Kinder",             tag: "4 – 10 años",       img: "/images/academy/kinder.jpeg",       group: "juniors",   anchor: "juniors",   cardId: "card-kinder" },
  { name: "Kids",               tag: "10+",                img: "/images/academy/kids.jpeg",          group: "juniors",   anchor: "juniors",   cardId: "card-kids" },
  { name: "Junior",             tag: "14+ · Competición",  img: "/images/academy/nextgen.jpeg",       group: "juniors",   anchor: "juniors",   cardId: "card-nextgen" },
  { name: "Next Gen",           tag: "16+ · Circuito",     img: "/images/academy/nextgen-pro.jpeg",   group: "juniors",   anchor: "juniors",   cardId: "card-nextgenpro" },
  { name: "Amateur",            tag: "Adultos",            img: "/images/academy/amateur.jpeg",       group: "adultos",   anchor: "adultos",   cardId: "card-tuclub" },
  { name: "Intensive Training", tag: "Camps · Stages",     img: "/images/academy/stage-group.jpeg",   group: "intensive", anchor: "intensive", cardId: "card-intensive" },
];

/** Iconos gold para las secciones del sticky nav. */
function SectionIcon({ name }: { name: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "var(--g1)",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  if (name === "juniors") {
    /* Estrella — talento joven */
    return (
      <svg {...common} aria-hidden>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    );
  }
  if (name === "adultos") {
    /* Grupo — escuela adultos */
    return (
      <svg {...common} aria-hidden>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (name === "intensive") {
    /* Rayo — intensidad, camps & stages */
    return (
      <svg {...common} aria-hidden>
        <path d="M13 2L3 14h9l-1 10 10-12h-9l1-10z" />
      </svg>
    );
  }
  if (name === "metodo") {
    /* Brújula — método J3, orientación, criterio */
    return (
      <svg {...common} aria-hidden>
        <circle cx="12" cy="12" r="9" />
        <path d="m14.5 9.5-5 1.5 1.5 5 5-1.5-1.5-5Z" />
      </svg>
    );
  }
  return null;
}

function ProgramBar() {
  const [compact, setCompact] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  // Sección activa: detecta cuál de los anchors está visible en viewport
  // y la marca con un underline dorado.
  const [activeAnchor, setActiveAnchor] = useState<string | null>(null);

  useEffect(() => {
    const anchors = STICKY_SECTIONS.map((s) => s.anchor);
    const els = anchors.map((a) => document.getElementById(a)).filter(Boolean) as HTMLElement[];
    if (els.length === 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        // Buscar la primera entrada visible con más del 15% en viewport
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveAnchor(entry.target.id);
            return;
          }
        }
      },
      { threshold: 0.15, rootMargin: "-100px 0px -40% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const dragStateRef = useRef<{ active: boolean; startX: number; startScroll: number; moved: boolean }>({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
  });

  useEffect(() => {
    /* Hysteresis thresholds: enter compact después de scroll meaningful,
       salir compact sólo cuando casi volvemos a top. Evita jitter. */
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

  /* Limpiar selectedCard al entrar en compact para que no quede
     el borde gold "stuck" cuando el usuario vuelve arriba. */
  useEffect(() => {
    if (compact) setSelectedCard(null);
  }, [compact]);

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

  /* Auto-scroll product cards en móvil cuando la sección activa cambia */
  useEffect(() => {
    if (!activeAnchor || !scrollRef.current || compact) return;
    const firstCard = scrollRef.current.querySelector(`[data-group="${activeAnchor}"]`) as HTMLElement | null;
    if (firstCard) {
      firstCard.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  }, [activeAnchor, compact]);

  /* Mouse drag-to-scroll (PC) */
  const onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.button !== 0) return;
    dragStateRef.current = {
      active: true,
      startX: e.pageX,
      startScroll: el.scrollLeft,
      moved: false,
    };
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
    setTimeout(() => {
      dragStateRef.current.active = false;
    }, 0);
  };

  const handleClickSede = (sede: SedeItem) => {
    if (dragStateRef.current.moved) { dragStateRef.current.moved = false; return; }
    window.dispatchEvent(new CustomEvent("j3:map:focus", { detail: { slug: sede.slug } }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClickSection = (section: SectionItem) => {
    if (dragStateRef.current.moved) { dragStateRef.current.moved = false; return; }
    const el = document.getElementById(section.anchor);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    /* Desde compact: navbar 52 + bar 30 = 82 → 100 de guarda */
    const top = rect.top + window.scrollY - 100;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  return (
    <div className="sticky top-[52px] z-[100]">
      <div
        className="border-b border-white/[.06] relative"
        style={{ backgroundColor: "#121214", transition: "all 0.6s cubic-bezier(.4,0,.2,1)" }}
      >
        {/* Left fade hint */}
        <div
          className="pointer-events-none absolute top-0 bottom-0 left-0 w-5 z-10 min-[961px]:hidden"
          style={{
            background: "linear-gradient(to right, #121214 0%, rgba(18,18,20,0) 100%)",
            opacity: canScrollLeft ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        {/* Right fade hint */}
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
              paddingTop: compact ? "0px" : "10px",
              paddingBottom: compact ? "0px" : "10px",
              cursor: compact ? "default" : "grab",
              /* El padding top/bottom cae de 10→0 al volverse compact, y los
                 hijos colapsan al mismo tiempo — sin transition aquí se nota
                 un jump de 20px en la altura del sticky. Curva ease-in-out
                 (.4,0,.2,1) en lugar de la "snappy" .16,1,.3,1 para que el
                 colapso arranque gentle y no se sienta brusco en móvil. */
              transition: "padding 0.6s cubic-bezier(.4,0,.2,1)",
            }}
          >
            {/* ── SEDES — círculo destacado (logo J3 dorado) ── */}
            {STICKY_SEDES.map((sede) => (
              <button
                key={sede.slug}
                type="button"
                onClick={() => handleClickSede(sede)}
                className="group/pnav flex flex-col items-center shrink-0 cursor-pointer transition-all duration-500 hover:opacity-100 opacity-95"
                style={{
                  width: compact
                    ? "clamp(72px, calc((100vw - 14px) / 5), 130px)"
                    : "clamp(104px, calc(100vw / 3.8), 140px)",
                  paddingTop: compact ? "6px" : undefined,
                  paddingBottom: compact ? "6px" : undefined,
                }}
              >
                <div
                  className="j3-pnav-circle relative rounded-full flex items-center justify-center"
                  style={{
                    width: compact ? "0px" : undefined,
                    height: compact ? "0px" : undefined,
                    opacity: compact ? 0 : 1,
                    marginBottom: compact ? "0px" : "7px",
                    transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                    border: "2px solid rgba(201,169,110,1)",
                    boxShadow: "0 0 16px rgba(201,169,110,.35), 0 0 4px rgba(201,169,110,.4)",
                    background: "radial-gradient(circle at 30% 30%, rgba(201,169,110,.12) 0%, rgba(18,18,20,1) 70%)",
                  }}
                >
                  <div
                    className="w-[62px] h-[62px] min-[961px]:w-[72px] min-[961px]:h-[72px] rounded-full overflow-hidden flex items-center justify-center"
                  >
                    <img
                      src={sede.img}
                      alt={sede.name}
                      className="w-[58%] h-[58%] object-contain transition-transform duration-700 group-hover/pnav:scale-110"
                    />
                  </div>
                </div>
                <span
                  className="font-bold text-[var(--g1)] group-hover/pnav:text-white transition-all duration-300 whitespace-nowrap leading-tight uppercase tracking-[1.5px]"
                  style={{ fontSize: compact ? "10px" : "11px" }}
                >
                  {sede.name}
                </span>
                <span
                  className="text-[9px] min-[961px]:text-[10px] text-white/50 transition-all duration-500"
                  style={{
                    maxHeight: compact ? "0px" : "20px",
                    opacity: compact ? 0 : 1,
                    marginTop: compact ? "0px" : "2px",
                    overflow: "hidden",
                  }}
                >
                  {sede.sub}
                </span>
              </button>
            ))}

            {/* ── Separador gold sutil ── */}
            <span
              aria-hidden
              className="shrink-0"
              style={{
                width: "1px",
                height: compact ? "24px" : "64px",
                margin: compact ? "0 12px" : "0 16px",
                background: "linear-gradient(to bottom, transparent, rgba(201,169,110,.4), transparent)",
                transition: "height 0.6s cubic-bezier(.4,0,.2,1), margin 0.6s cubic-bezier(.4,0,.2,1)",
              }}
            />

            {/* ── PRODUCT CARDS — impacto visual al aterrizar, colapsan al scroll ── */}
            {PRODUCT_CARDS.map((card) => {
              const isSelected = selectedCard === card.name;
              return (
                <button
                  key={card.name}
                  type="button"
                  data-group={card.group}
                  data-card={card.name}
                  onMouseEnter={() => setHoveredCard(card.name)}
                  onMouseLeave={() => setHoveredCard(null)}
                  onClick={(e) => {
                    if (dragStateRef.current.moved) { dragStateRef.current.moved = false; return; }
                    setSelectedCard(card.name);

                    /* Centrar la tarjeta en el strip — scroll INSTANTÁNEO
                       (smooth competiría con el page-scroll y el compact
                       transition lo mata antes de completarse) */
                    const btn = e.currentTarget;
                    const container = scrollRef.current;
                    if (container) {
                      const cRect = container.getBoundingClientRect();
                      const bRect = btn.getBoundingClientRect();
                      const targetLeft = container.scrollLeft + (bRect.left - cRect.left) - cRect.width / 2 + bRect.width / 2;
                      container.scrollLeft = Math.max(0, targetLeft);
                    }

                    /* Scroll a la tarjeta específica centrándola en viewport.
                       En móvil hay dos elementos con el mismo data-card-id
                       (layout desktop + carrusel móvil); uno está colapsado a
                       0×0 por CSS. Cogemos el que tenga dimensiones reales.
                       Si no existe, caemos al anchor de sección. La sticky bar
                       mide ~82px en compact, así que compensamos para que la
                       tarjeta quede centrada en el área visible real. */
                    const cardEl = card.cardId
                      ? (Array.from(
                          document.querySelectorAll(`[data-card-id="${card.cardId}"]`),
                        ).find((el) => (el as HTMLElement).offsetHeight > 0) as
                          | HTMLElement
                          | undefined) ?? null
                      : null;
                    if (cardEl) {
                      /* Carrusel móvil: buscar el ancestro scrolleable
                         horizontalmente y centrar la tarjeta dentro. */
                      let scroller: HTMLElement | null = cardEl.parentElement;
                      while (scroller) {
                        const cs = getComputedStyle(scroller);
                        const ox = cs.overflowX;
                        if ((ox === "auto" || ox === "scroll") && scroller.scrollWidth > scroller.clientWidth) {
                          break;
                        }
                        scroller = scroller.parentElement;
                      }
                      if (scroller) {
                        const sRect = scroller.getBoundingClientRect();
                        const cRect = cardEl.getBoundingClientRect();
                        const targetLeft =
                          scroller.scrollLeft + (cRect.left - sRect.left) - sRect.width / 2 + cRect.width / 2;
                        scroller.scrollTo({ left: Math.max(0, targetLeft), behavior: "smooth" });
                      }

                      const rect = cardEl.getBoundingClientRect();
                      const stickyOffset = 82;
                      const visibleH = window.innerHeight - stickyOffset;
                      const top = rect.top + window.scrollY - stickyOffset - (visibleH - rect.height) / 2;
                      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                      return;
                    }
                    const el = document.getElementById(card.anchor);
                    if (!el) return;
                    const rect = el.getBoundingClientRect();
                    const top = rect.top + window.scrollY - 190;
                    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                  }}
                  className="group/card relative shrink-0 rounded-lg overflow-hidden cursor-pointer"
                  style={{
                    width: compact ? "0px" : "clamp(100px, 11vw, 150px)",
                    height: compact ? "0px" : "clamp(72px, 8.5vw, 95px)",
                    opacity: compact ? 0 : 1,
                    margin: compact ? "0" : "0 3px",
                    transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                    pointerEvents: compact ? "none" : "auto",
                    boxShadow: isSelected
                      ? "0 0 0 2px rgba(201,169,110,.9), 0 0 20px rgba(201,169,110,.3)"
                      : hoveredCard === card.name
                        ? "0 0 0 1.5px rgba(201,169,110,.7), 0 0 12px rgba(201,169,110,.2)"
                        : "0 0 0 1px rgba(255,255,255,.1)",
                  }}
                >
                  <img
                    src={card.img}
                    alt={card.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                    style={{
                      filter: (isSelected || hoveredCard === card.name)
                        ? "brightness(1) saturate(1)"
                        : "brightness(0.8) saturate(0.9)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <span className="text-[7px] font-bold tracking-[1.5px] uppercase text-[var(--g1)] block leading-tight">
                      {card.tag}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[-0.3px] text-white/90 leading-tight block">
                      {card.name}
                    </span>
                  </div>
                </button>
              );
            })}

            {/* ── CATEGORY TABS — aparecen al scroll (compact), texto puro ── */}
            {STICKY_SECTIONS.map((section) => {
              const isActive = activeAnchor === section.anchor;
              return (
                <button
                  key={section.anchor}
                  type="button"
                  onClick={() => handleClickSection(section)}
                  className="group/pnav relative flex flex-col items-center shrink-0 cursor-pointer hover:opacity-100"
                  style={{
                    opacity: compact ? (isActive ? 1 : 0.7) : 0,
                    width: compact ? "clamp(52px, calc((100vw - 14px) / 6.5), 100px)" : "0px",
                    paddingTop: compact ? "6px" : "0px",
                    paddingBottom: compact ? "6px" : "0px",
                    overflow: "hidden",
                    pointerEvents: compact ? "auto" : "none",
                    transition: "all 0.6s cubic-bezier(.4,0,.2,1)",
                  }}
                >
                  <span
                    className="font-semibold whitespace-nowrap leading-tight"
                    style={{
                      fontSize: "10px",
                      color: isActive ? "var(--g1)" : "rgba(255,255,255,.75)",
                    }}
                  >
                    {section.name}
                  </span>
                  <span
                    aria-hidden
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full transition-all duration-500"
                    style={{
                      width: isActive ? "60%" : "0%",
                      background: "linear-gradient(90deg, transparent, rgba(201,169,110,.85), transparent)",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroSection() {
  const { t } = useI18n();
  const isMobile = useIsMobile(960);
  const [ready, setReady] = useState(false);
  // Geolocalización compartida con NetworkSection. Cuando el usuario pulsa
  // "Cerca de mí" en el grid, `geo.coords` pasa a estar definido y el mapa
  // del hero recentrará automáticamente sobre el pin cyan "tú estás aquí".
  const geo = useGeo();

  /* Boot animation delay */
  useEffect(() => {
    const id = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(id);
  }, []);

  /* ── Filtros compartidos con NetworkSection via FilterContext ── */
  const allCoaches = useMemo(() => sortCoaches(COACHES), []);
  const { country, setCountry, language, setLanguage, specialty, setSpecialty } = useFilters();

  const filtered = useMemo(
    () => filterCoaches(allCoaches, { country, language, specialty }),
    [allCoaches, country, language, specialty],
  );

  /* Coaches en proceso de certificación — dots hollow en el mapa,
     con popup minimalista. No se filtran por país/idioma. */
  const inProgressCoaches = useMemo(
    () => filterInProgressCoaches(allCoaches),
    [allCoaches],
  );

  /* Total de entrenadores en la red J3 (suma de todos los tiers: base +
     PLUS en proceso + certificados + verificados). Señal de escala/
     crecimiento junto al mapa. Hardcoded — actualizar conforme crezca. */
  const TOTAL_COACHES_COUNT = 100;
  const baseCoachesLine = t.academy.network.baseCoachesLine
    .replace("{count}", String(TOTAL_COACHES_COUNT));

  const specialtyLabel = (s: CoachSpecialty) =>
    s === "juniors"
      ? t.academy.network.specialtyJuniors
      : s === "adultos"
      ? t.academy.network.specialtyAdultos
      : s === "competicion"
      ? t.academy.network.specialtyCompeticion
      : t.academy.network.specialtyCamps;

  const mapLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeFounder: t.academy.network.badgeFounder,
    badgeGenOne: t.academy.network.badgeGenOne,
    badgeVerified: t.academy.network.badgeVerified,
    distinctionFormaCoaches: t.academy.network.distinctionFormaCoaches,
    distinctionJugadoresCircuito: t.academy.network.distinctionJugadoresCircuito,
    distinctionMultilingue: t.academy.network.distinctionMultilingue,
    distinctionDecano: t.academy.network.distinctionDecano,
    distinctionKidsIniciacion: t.academy.network.distinctionKidsIniciacion,
    distinctionJuniorsTecnificacion: t.academy.network.distinctionJuniorsTecnificacion,
    distinctionProtocoloFamiliar: t.academy.network.distinctionProtocoloFamiliar,
    distinctionIniciacionAdulto: t.academy.network.distinctionIniciacionAdulto,
    distinctionReeducacionTecnica: t.academy.network.distinctionReeducacionTecnica,
    distinctionGruposMixtos: t.academy.network.distinctionGruposMixtos,
    distinctionBautismoPadel: t.academy.network.distinctionBautismoPadel,
    distinctionExperienciaFamiliar: t.academy.network.distinctionExperienciaFamiliar,
    monthShort: t.academy.network.monthShort,
    memberSince: t.academy.network.memberSince,
    qualifiedSince: t.academy.network.qualifiedSince,
    certifiedSince: t.academy.network.certifiedSince,
    askChatbot: t.academy.network.askChatbot,
    legendTitle: t.academy.network.legendTitle,
    legendHq: t.academy.network.legendHq,
    legendCoach: t.academy.network.legendCoach,
    legendCoachVerified: t.academy.network.legendCoachVerified,
    legendCoachInProgress: t.academy.network.legendCoachInProgress,
    legendCluster: t.academy.network.legendCluster,
    legendDistinctionsTitle: t.academy.network.legendDistinctionsTitle,
    legendDistGroupProfesional: t.academy.network.legendDistGroupProfesional,
    legendDistGroupKids: t.academy.network.legendDistGroupKids,
    legendDistGroupAmateur: t.academy.network.legendDistGroupAmateur,
    legendDistGroupVacacional: t.academy.network.legendDistGroupVacacional,
    viewInMaps: t.academy.network.viewInMaps,
    youAreHere: t.academy.network.youAreHere,
    inProgressBadge: t.academy.network.inProgressBadge,
    inProgressNote: t.academy.network.inProgressNote,
    stageCoach: t.academy.network.stageCoach,
    stageCoach360: t.academy.network.stageCoach360,
    stageCualificado: t.academy.network.stageCualificado,
    stageVerificado: t.academy.network.stageVerificado,
  };

  const handleScrollToNetwork = () => {
    /* En desktop el mapa del hero ya está side-by-side con el copy,
       no tiene sentido hacer scroll. En móvil el mapa queda debajo
       del copy → scrolleamos hasta su wrapper (#hero-map), no a la
       NetworkSection grande de más abajo. */
    if (typeof window === "undefined") return;
    if (window.innerWidth >= 961) return;
    const el = document.getElementById("hero-map");
    if (!el) return;
    const rect = el.getBoundingClientRect();
    /* Restamos 60px para dejar el sticky bar visible por encima sin
       tapar la parte superior del mapa. */
    const top = rect.top + window.scrollY - 60;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  const handleFocusLab = () => {
    window.dispatchEvent(
      new CustomEvent("j3:map:focus", { detail: { slug: "j3-hq-malaga" } }),
    );
  };

  /* Las pills de especialidad dentro del popup del mapa disparan este
     evento; aquí scrolleamos a la sección correspondiente en la página. */
  useEffect(() => {
    const handler = (e: Event) => {
      const anchor = (e as CustomEvent<{ anchor?: string }>).detail?.anchor;
      if (!anchor) return;
      const el = document.getElementById(anchor);
      if (!el) return;
      const top = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
    };
    window.addEventListener("j3:academy:goto", handler);
    return () => window.removeEventListener("j3:academy:goto", handler);
  }, []);

  /* Mapa centrado en Málaga (Lab) como epicentro. */
  const mapCenter: [number, number] = [36.72, -4.42];
  const mapZoom = isMobile ? 5 : 6;

  return (
    <section
      className="relative z-[1] overflow-hidden bg-black min-h-[640px] min-[961px]:h-[calc(100vh-134px)] min-[961px]:min-h-[600px]"
      role="region"
      aria-label="Academy J3 hero"
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity .8s ease .2s",
      }}
    >
      {/* Styles locales para las animaciones escalonadas del hero.
          Cada elemento tiene una clase .hero-rise y un delay custom.
          Usamos data-ready en el parent para triggerar la animación
          solo cuando el boot delay ha pasado. */}
      <style>{`
        @keyframes heroRise {
          from { opacity: 0; transform: translateY(18px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0);  }
        }
        [data-hero-ready="true"] .hero-rise {
          animation: heroRise .9s cubic-bezier(.16,1,.3,1) both;
        }
        .hero-rise-1 { animation-delay: .05s !important; }
        .hero-rise-2 { animation-delay: .18s !important; }
        .hero-rise-3 { animation-delay: .34s !important; }
        .hero-rise-4 { animation-delay: .48s !important; }
        .hero-rise-5 { animation-delay: .62s !important; }
        .hero-rise-6 { animation-delay: .76s !important; }
        @keyframes heroLineGrow {
          from { transform: scaleY(0); }
          to   { transform: scaleY(1); }
        }
        [data-hero-ready="true"] .hero-sidebar-line {
          animation: heroLineGrow 1.4s cubic-bezier(.16,1,.3,1) .2s both;
          transform-origin: top;
        }
      `}</style>

      <div className="relative w-full h-full min-[961px]:absolute min-[961px]:inset-0 flex flex-col min-[961px]:flex-row" data-hero-ready={ready ? "true" : "false"}>
        {/* ── Copy column (40%) ── */}
        <div className="relative z-10 w-full min-[961px]:w-[40%] flex flex-col justify-center px-6 max-[960px]:px-5 py-16 max-[960px]:pt-16 max-[960px]:pb-12 min-[961px]:px-10 min-[961px]:py-16 border-r border-white/[.06]">
          {/* Línea vertical dorada — ornamento lateral en desktop. Crece
              de arriba a abajo al entrar. Refuerza la jerarquía sin
              competir con el contenido. */}
          <span
            aria-hidden
            className="hero-sidebar-line hidden min-[961px]:block absolute left-0 top-[10%] bottom-[10%] w-px"
            style={{
              background:
                "linear-gradient(180deg, transparent 0%, rgba(201,169,110,0.45) 30%, rgba(201,169,110,0.6) 50%, rgba(201,169,110,0.45) 70%, transparent 100%)",
            }}
          />

          <div className="max-w-[460px] mx-auto min-[961px]:mx-0">
            <span className="hero-rise hero-rise-1 text-[10px] font-medium tracking-[5px] uppercase text-[var(--g1)] block mb-4 max-[960px]:text-[10px] max-[960px]:tracking-[3px]">
              {t.academy.hero.eyebrow}
            </span>

            <h1
              className="hero-rise hero-rise-2 font-bold max-[960px]:font-bold min-[961px]:font-medium tracking-[-1px] min-[961px]:tracking-[-1.5px] leading-[1.08] text-white text-[clamp(28px,3.2vw,44px)] max-[960px]:text-[clamp(28px,8.5vw,48px)]"
              style={{ textShadow: "0 0 60px rgba(201,169,110,0.15), 0 2px 12px rgba(0,0,0,0.4)" }}
            >
              {t.academy.hero.headingAccent ? (
                <>
                  {t.academy.hero.headingPre}
                  {/* En móvil forzamos el salto entre pre y accent para
                      que "Encuentra entrenadores con" quepa en la primera
                      fila y el accent italic ocupe la segunda completa. */}
                  <br className="min-[961px]:hidden" aria-hidden />
                  <span className="j3-grad-text font-[var(--font-serif)] italic normal-case font-medium inline-block pr-[0.25em]">
                    {t.academy.hero.headingAccent}
                  </span>
                  {t.academy.hero.headingPost}
                </>
              ) : (
                t.academy.hero.heading
              )}
            </h1>

            {/* Línea horizontal ultrafina — separa H1 del subtítulo */}
            <span
              aria-hidden
              className="hero-rise hero-rise-3 block mt-6 mb-5 h-px w-[56px]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(201,169,110,0.85), rgba(201,169,110,0.15) 100%)",
              }}
            />

            <p className="hero-rise hero-rise-3 text-[15px] max-[960px]:text-[14px] leading-[1.5] text-white/75 max-w-[420px]">
              {/* Partimos al fin de cada frase para que el wrap caiga en un
                  punto natural (". ") en vez de cortar mid-phrase. */}
              {t.academy.hero.sub.split(/(?<=\.) +/).map((s, i, arr) => (
                <React.Fragment key={i}>
                  {s}
                  {i < arr.length - 1 && <br />}
                </React.Fragment>
              ))}
            </p>

            {/* CTAs — el primario unifica el "Cerca de mí" del mapa:
                  · idle   → pide geo + scroll al mapa
                  · loading → disabled
                  · success → muestra estado activo + X para limpiar
                  · error  → reintentar + hint */}
            <div className="hero-rise hero-rise-4 mt-7 flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3">
              {geo.status === "success" ? (
                <div className="flex items-stretch rounded-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] text-black overflow-hidden sm:inline-flex sm:self-start">
                  <button
                    type="button"
                    onClick={handleScrollToNetwork}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-[12px] font-bold tracking-[2.5px] uppercase hover:brightness-110 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="22" y1="12" x2="18" y2="12" />
                      <line x1="6" y1="12" x2="2" y2="12" />
                      <line x1="12" y1="6" x2="12" y2="2" />
                      <line x1="12" y1="22" x2="12" y2="18" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                    {t.academy.network.nearMeActive}
                  </button>
                  <button
                    type="button"
                    onClick={geo.clear}
                    aria-label={t.academy.network.nearMe}
                    className="inline-flex items-center justify-center px-4 border-l border-black/20 hover:bg-black/10 transition"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (geo.status !== "loading") geo.request();
                    handleScrollToNetwork();
                  }}
                  disabled={geo.status === "loading"}
                  className="group/cta inline-flex items-center justify-center gap-2 whitespace-nowrap px-5 py-3 rounded-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] text-black text-[12px] font-bold tracking-[2px] uppercase transition-transform duration-500 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-wait"
                >
                  {geo.status === "loading" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" aria-hidden>
                      <path d="M21 12a9 9 0 1 1-6.2-8.55" />
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <circle cx="12" cy="12" r="10" />
                      <line x1="22" y1="12" x2="18" y2="12" />
                      <line x1="6" y1="12" x2="2" y2="12" />
                      <line x1="12" y1="6" x2="12" y2="2" />
                      <line x1="12" y1="22" x2="12" y2="18" />
                      <circle cx="12" cy="12" r="3" fill="currentColor" />
                    </svg>
                  )}
                  {geo.status === "loading" ? t.academy.network.nearMeLoading : t.academy.hero.ctaPrimary}
                </button>
              )}

              <button
                type="button"
                onClick={handleFocusLab}
                className="group/lab inline-flex items-center justify-center sm:justify-start gap-2 whitespace-nowrap px-2 py-3 text-[var(--g1)]/75 hover:text-[var(--g1)] text-[12px] font-semibold tracking-[1.5px] uppercase transition-colors duration-500"
              >
                {t.academy.hero.ctaSecondary}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-500 group-hover/lab:translate-x-1">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {geo.status === "error" && (
              <p className="hero-rise hero-rise-4 mt-3 text-[11px] tracking-[1px] uppercase text-white/55">
                {t.academy.network.nearMeError}
              </p>
            )}

          </div>
        </div>

        {/* ── Mapa column (60%) ──
            El .leaflet-container recibe z-index:0 (vía pinStyles en
            NetworkMap) para contener sus panes internos (hasta z-1000)
            dentro de su propio stacking context. Así los floating pills
            de filtros (z-1100) quedan por encima del mapa pero la navbar
            (z-110 fixed) sigue por encima de todo. */}
        <div id="hero-map" className="relative w-full min-[961px]:w-[60%] h-[60vh] min-[961px]:h-auto min-[961px]:min-h-full">
          <NetworkMap
            coaches={filtered}
            inProgressCoaches={inProgressCoaches}
            labels={mapLabels}
            center={mapCenter}
            zoom={mapZoom}
            scrollWheelZoom={false}
            floatingZoomControls
            floatingZoomTopOffset={240}
            autoFitBounds
            showLegend
            userLocation={geo.coords}
            focusKey={`${country}|${language}`}
          />

          {/* ── Contador de Coach360 base — dentro del mapa, esquina
              inferior derecha. Balancea visualmente con la leyenda
              (inferior izquierda) y pertenece al relato del mapa:
              "lo que ves + lo que viene detrás". Se queda por encima
              de la atribución de Leaflet sin tapar los tiles. */}
          <div
            className="pointer-events-none absolute bottom-[26px] right-[10px] z-[4] max-w-[min(70vw,300px)] hidden min-[420px]:block"
            aria-label={baseCoachesLine}
          >
            <div
              className="inline-flex items-center gap-2 text-[10.5px] leading-[1.25] tracking-[0.3px] text-white/72 px-[10px] py-[7px] rounded-[2px]"
              style={{
                background: "rgba(10,10,10,0.78)",
                backdropFilter: "blur(6px)",
                border: "1px solid rgba(201,169,110,0.28)",
                boxShadow: "0 4px 14px rgba(0,0,0,0.4)",
              }}
            >
              <span
                aria-hidden
                className="inline-block shrink-0"
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  border: "1.5px solid rgba(201,169,110,0.6)",
                  background: "rgba(201,169,110,0.12)",
                }}
              />
              <span>{baseCoachesLine}</span>
            </div>
          </div>

          {/* ── Floating filter pills over the map ── */}
          <div className="hero-rise hero-rise-5 absolute top-[16px] min-[961px]:top-[96px] left-3 right-3 z-[10] flex flex-wrap items-center gap-2">
            <FilterSelect
              compact
              label={t.academy.network.filterCountry}
              value={country}
              onChange={setCountry}
              options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_COUNTRIES.map(c => ({ value: c, label: c }))]}
            />
            <FilterSelect
              compact
              label={t.academy.network.filterLanguage}
              value={language}
              onChange={setLanguage}
              options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_LANGUAGES.map(l => ({ value: l, label: languageLabel(l) }))]}
            />

            {/* El pill "Cerca de mí" se ha consolidado en el CTA primario
                del hero (más prominente, sin duplicación). Los estados de
                loading/success/error viven allí. */}
          </div>

          {/* Subtle fade-left on desktop para fundir con copy column */}
          <div
            className="hidden min-[961px]:block absolute inset-y-0 left-0 w-[80px] pointer-events-none z-[450]"
            style={{ background: "linear-gradient(to right, rgba(0,0,0,.55), transparent)" }}
            aria-hidden
          />
        </div>
      </div>

      {/* Scroll-down indicator — 3 chevrons apilados estilo Ferrari.
          Solo desktop; en móvil el scroll es obvio y no aporta. */}
      <style>{`
        @keyframes j3ChevPulse {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 1;    }
        }
      `}</style>
      <div
        aria-hidden
        className="hero-rise hero-rise-6 hidden min-[961px]:flex absolute bottom-5 left-1/2 -translate-x-1/2 z-[12] flex-col items-center gap-[2px] p-2 pointer-events-none"
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
            {t.academy.band.eyebrow}
          </span>

          {/* Heading — sujeto afirmativo + accent serif-italic gold
              (mismo patrón de jerarquía que en el hero). */}
          <h2
            className="text-[clamp(28px,3.5vw,42px)] font-bold uppercase tracking-[-0.5px] leading-[1.1] text-black mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1) 0.4s",
            }}
          >
            {t.academy.band.headingLead}
            <br />
            <span className="j3-grad-text font-[var(--font-serif)] italic normal-case font-medium inline-block pr-[0.18em]">
              {t.academy.band.headingAccent}
            </span>
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
          <cite className="text-[11px] font-medium tracking-[2.5px] uppercase text-[var(--g1)] not-italic">
            &mdash;&nbsp;{t.academy.claim.author}
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
  const { t } = useI18n();
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
        {/* Main claim — mismo patrón de accent que hero y AcademyBand */}
        <h2 className="text-[clamp(28px,4vw,48px)] font-light uppercase tracking-[3px] max-[640px]:tracking-[1.5px] leading-[1.3] text-black">
          {t.academy.banner.headingBefore}
          <span className="font-[var(--font-serif)] italic normal-case tracking-[0px] text-[var(--g1)] inline-block pr-[0.12em]">
            {t.academy.banner.headingAccent}
          </span>
          <br />
          {t.academy.banner.headingAfter}
        </h2>

        {/* Gold accent line */}
        <div className="w-[50px] h-[1px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] opacity-50" />

        {/* Tagline */}
        <p className="text-[clamp(13px,1.4vw,16px)] font-light uppercase tracking-[4px] max-[640px]:tracking-[2px] leading-[2] text-black/35" style={{ textWrap: "balance" }}>
          {t.academy.banner.tagline}
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
    <section id="metodo" className="stmt-section relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 overflow-hidden flex items-center scroll-mt-[100px]">
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
              {t.academy.statement.statYears}
            </span>
          </div>

          {/* Support stats row — 2 columns */}
          <div className="grid grid-cols-2 items-center justify-items-center w-full max-w-[560px] max-[640px]:max-w-[360px] relative">
            {[
              { num: 2000, suffix: "+", label: t.academy.statement.statPlayers },
              { num: 18, suffix: "", label: t.academy.statement.statTitles },
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
        background: "linear-gradient(135deg, rgba(201,169,110,.08) 0%, rgba(201,169,110,.02) 100%)",
        border: "1px solid rgba(201,169,110,.28)",
        boxShadow: expanded ? "0 0 22px rgba(201,169,110,.18)" : "none",
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
          background: "linear-gradient(135deg, rgba(201,169,110,.22) 0%, rgba(201,169,110,.06) 100%)",
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

/**
 * PorscheCoachRow — variante del PorscheRow pensada para N cards (4-6).
 *
 * Diferencia con PorscheRow: éste ajusta las proporciones en función de
 * N para mantener un ratio de expansión de 1.5x entre la card hover y
 * las no-hover, independientemente del número de items. Útil para la
 * grid de coaches destacados, donde PorscheRow se quedaba corto (su
 * ratio efectivo colapsa al 1.22x cuando N>2).
 *
 * Fórmula: basis del hovered = 150/(N+0.5), basis de los otros = 100/(N+0.5).
 * Suman 150 + 100*(N-1) y flex los normaliza a 100%, dejando al hovered
 * siempre ~1.5x los demás.
 */
function PorscheCoachRow({ children, hoveredIdx }: { children: React.ReactNode[]; hoveredIdx: number | null }) {
  const n = children.length;
  const hoveredBasis = 150 / (n + 0.5);
  const otherBasis  = 100 / (n + 0.5);
  return (
    <div className="hidden min-[961px]:flex gap-3">
      {children.map((child, i) => {
        const basis =
          hoveredIdx === null
            ? 100 / n
            : hoveredIdx === i
            ? hoveredBasis
            : otherBasis;
        return (
          <div
            key={i}
            style={{
              flex: `1 1 ${basis}%`,
              height: "clamp(340px, 28vw, 460px)",
              transition: "flex 0.6s cubic-bezier(0, 0, 0.2, 1)",
              minWidth: 0,
            }}
          >
            {child}
          </div>
        );
      })}
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
      <div id="juniors" className="border-t theme-border scroll-mt-[100px]">
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
      <div id="adultos" className="border-t theme-border scroll-mt-[100px]">
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
              <h3 className="font-bold text-[clamp(28px,2.6vw,44px)] uppercase tracking-[-1px] leading-[1.05] mb-4">
                <span className="theme-text">{t.academy.programs.adultosInfoHeadingPre} </span>
                <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.adultosInfoHeadingAccent}</span>
              </h3>
              <p className="j3-grad-text font-[var(--font-serif)] italic text-[clamp(16px,1.2vw,20px)] leading-[1.2] mb-5">
                {t.academy.programs.adultosInfoTagline}
              </p>
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
            <h3 className="font-bold text-[clamp(24px,5vw,32px)] uppercase tracking-[-0.5px] leading-[1.1] mb-3">
              <span className="theme-text">{t.academy.programs.adultosInfoHeadingPre} </span>
              <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">{t.academy.programs.adultosInfoHeadingAccent}</span>
            </h3>
            <p className="j3-grad-text font-[var(--font-serif)] italic text-[15px] leading-[1.2] mb-4">
              {t.academy.programs.adultosInfoTagline}
            </p>
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
      <div id="intensive" className="border-t theme-border scroll-mt-[100px]">
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
   S5b — NETWORK (HQ Málaga + mapa + coaches + Coach360 CTA)
   ═══════════════════════════════════════════════════════ */

function useIsMobile(breakpoint: number = 960): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

/* ──────────────────────────────────────────────
   SedeCard + SedesBlock — bloque de sedes físicas del Lab.
   La tarjeta tiene video/gradient de fondo, eyebrow con pulse dot,
   título, subtítulo y CTA con flecha. Los estados inCarousel/
   forceExpand permiten reusar el patrón ScrollCarousel del mobile.
   ────────────────────────────────────────────── */

type Sede = {
  readonly name: string;
  readonly flag: string;
  readonly cta: string;
  readonly href: string;
  readonly video?: string;
  readonly openingSoon?: string;
  readonly schedule?: string;
};

function SedeCard({
  sede, eyebrow, isHovered, onHover, onLeave, forceExpand = false, inCarousel = false,
}: {
  sede: Sede;
  eyebrow: string;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
  forceExpand?: boolean;
  inCarousel?: boolean;
}) {
  /* Misma lógica de expanded que ProgramTile: en carrusel móvil, el
     active-slide fuerza expand; en desktop con PorscheRow lo dicta hover. */
  const expanded = inCarousel ? forceExpand : isHovered;
  return (
    <a
      href={sede.href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative overflow-hidden rounded-2xl cursor-pointer block h-full group"
      style={{ background: "#000" }}
    >
      {/* Media — video si existe, gradient placeholder si no */}
      {sede.video ? (
        <video
          src={sede.video}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: expanded ? "scale3d(1.035,1.035,1.035)" : "scale3d(1,1,1)",
            transition: "transform 0.9s cubic-bezier(0,0,0.2,1), filter 0.9s cubic-bezier(.16,1,.3,1)",
            filter: expanded
              ? "saturate(0.95) brightness(1.01) contrast(0.98)"
              : "saturate(0.88) brightness(0.98) contrast(0.96)",
          }}
        />
      ) : (
        /* Placeholder "blueprint" para sedes sin asset — plano de pista
           padel en gold sobre fondo oscuro con noise sutil. Da estética
           de "en construcción / proyecto" en vez de un gradient plano. */
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(140% 90% at 50% 100%, rgba(201,169,110,0.12) 0%, rgba(201,169,110,0.02) 45%, #050505 85%)",
            transform: expanded ? "scale3d(1.03,1.03,1.03)" : "scale3d(1,1,1)",
            transition: "transform 0.9s cubic-bezier(0,0,0.2,1)",
          }}
          aria-hidden
        >
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 400 500"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden
          >
            <defs>
              <linearGradient id="blueprint-lines" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(201,169,110,0.35)" />
                <stop offset="100%" stopColor="rgba(201,169,110,0.08)" />
              </linearGradient>
              <pattern id="blueprint-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(201,169,110,0.06)" strokeWidth="0.5" />
              </pattern>
            </defs>
            {/* Grid técnico sutil */}
            <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
            {/* Court outline centrado */}
            <g transform="translate(100 130)" stroke="url(#blueprint-lines)" strokeWidth="1.2" fill="none">
              <rect x="0" y="0" width="200" height="260" />
              <line x1="0" y1="130" x2="200" y2="130" />
              <line x1="0" y1="70" x2="200" y2="70" />
              <line x1="0" y1="190" x2="200" y2="190" />
              <line x1="100" y1="70" x2="100" y2="190" strokeDasharray="4 4" />
            </g>
            {/* Medidas — estética de plano técnico */}
            <g stroke="rgba(201,169,110,0.28)" strokeWidth="0.8" fill="none">
              <line x1="80" y1="130" x2="95" y2="130" />
              <line x1="305" y1="130" x2="320" y2="130" />
              <line x1="80" y1="125" x2="80" y2="135" />
              <line x1="320" y1="125" x2="320" y2="135" />
            </g>
            <text x="200" y="120" textAnchor="middle" fill="rgba(201,169,110,0.45)" fontSize="10" fontFamily="ui-monospace, monospace" letterSpacing="2">20m</text>
          </svg>
          {/* Code chip bottom-left — estética técnica */}
          <span
            className="absolute bottom-3 left-3 text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]/60"
            style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}
          >
            PLANO · J3·LIM·001
          </span>
        </div>
      )}

      {/* Línea gold superior — expande de 55% → 100% al hover/active */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] z-[10] pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent 0%, var(--g1) 50%, transparent 100%)",
          width: expanded ? "100%" : "55%",
          opacity: expanded ? 0.9 : 0.35,
          transition: "width 0.7s cubic-bezier(.16,1,.3,1), opacity 0.5s ease-out",
        }}
      />

      {/* Top gradient — denso para legibilidad de título + flag */}
      <div
        className="absolute top-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: "45%",
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

      {/* Nombre (top-center) + flag (tag debajo) — misma jerarquía que ProgramTile */}
      <div
        className="absolute top-0 left-0 right-0 z-[6] flex flex-col items-center pt-7 max-[640px]:pt-5 px-4 text-center"
        style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)" }}
      >
        <h4 className="font-bold text-[clamp(22px,2.8vw,38px)] uppercase tracking-[-1px] leading-[1] text-white">
          {sede.name}
        </h4>
        <span className="mt-[6px] text-[10px] max-[640px]:text-[9.5px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
          {eyebrow}
        </span>
        <span className="mt-[3px] text-[10px] max-[640px]:text-[9px] font-normal tracking-[1.5px] uppercase text-white/65">
          {sede.flag}
        </span>
        {/* Horario de la sede — icono de reloj + texto. Se lee debajo de la
            ubicación sin competir con el nombre de la sede. */}
        {sede.schedule && (
          <span className="mt-[8px] inline-flex items-center gap-1.5 text-[10px] max-[640px]:text-[9px] font-normal tracking-[1.2px] text-[var(--g1)]/85">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {sede.schedule}
          </span>
        )}
      </div>

      {/* Bottom — openingSoon badge (izquierda) + CTA arrow (derecha) */}
      <div className="absolute bottom-0 left-0 right-0 z-[13] p-[18px] min-[961px]:p-[clamp(16px,1.25vw+12px,36px)]">
        <div className="flex items-end justify-between gap-3">
          {sede.openingSoon ? (
            <span
              className="inline-flex items-center px-2.5 py-[5px] text-[9px] font-bold tracking-[1.5px] uppercase text-black"
              style={{
                background: "#C9A96E",
                borderRadius: 2,
              }}
            >
              {sede.openingSoon}
            </span>
          ) : (
            <span aria-hidden />
          )}
          <span
            className="shrink-0 flex items-center gap-2 text-[10px] font-bold tracking-[2px] uppercase text-[var(--g1)]"
            style={{
              transform: expanded ? "translateX(4px)" : "translateX(0)",
              transition: "transform .5s cubic-bezier(.16,1,.3,1)",
              textShadow: "0 2px 10px rgba(0,0,0,0.55)",
            }}
          >
            <span className="hidden min-[640px]:inline">{sede.cta}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </a>
  );
}

/** Devuelve las 2 primeras iniciales del nombre, en mayúsculas.
 *  "Alejandro Coscollano González" → "AC". Nombres de una sola palabra
 *  (ej. "Maya") devuelven una sola letra. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* ──────────────────────────────────────────────
   PorscheCoachCard — misma estética visual que ProgramTile (Juniors)
   y SedeCard. Media full-bleed, título centrado arriba + tag con rol,
   top/bottom gradients, gold line superior que expande al hover,
   badge tier top-left, km top-right, CTA arrow abajo.
   ────────────────────────────────────────────── */

function PorscheCoachCard({
  coach,
  labels,
  userCoords,
  onAsk,
  isHovered,
  onHover,
  onLeave,
}: {
  coach: Coach;
  labels: {
    badgeHq: string;
    badgeFounder: string;
    badgeGenOne: string;
    badgeVerified: string;
    monthShort: readonly string[];
    memberSince: string;
    qualifiedSince: string;
    certifiedSince: string;
    askChatbot: string;
    kmFromYou?: string;
  };
  userCoords?: LatLng | null;
  onAsk?: (c: Coach) => void;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  const isHq = coach.tier === "hq";
  const expanded = isHovered;
  /* Badges normalizados por la lógica central:
     - Founder / Gen ONE históricos, combinables con cualquier estado
     - Specialties solo si certificación activa (J3 solo avala actuales)
     - Distinctions permanentes (independientes del plan actual) */
  const badges = getCoachBadges(coach);
  /* Primer club — info extra que ayuda a identificar al coach.
     Máx. 1 en la card pequeña para no saturar. */
  const primaryClub = coach.clubs && coach.clubs.length > 0 ? coach.clubs[0] : null;
  /* Solo los coaches con cert activa llegan a la card (filterCoaches los
     filtra). Mostramos "✓ Certificado" siempre que sea tier coach. */
  const showCertLine = !isHq && badges.status === "certified-active";
  return (
    <button
      type="button"
      onClick={() => onAsk?.(coach)}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className="relative overflow-hidden rounded-lg cursor-pointer block h-full w-full group text-left"
      style={{ background: "#000" }}
    >
      {/* Media — foto si existe; si no, placeholder con iniciales gold.
          Las iniciales (p.ej. 'AC' para Alejandro Coscollano) sobre un
          gradient radial gold → dark convierten un estado "sin foto" en
          un brand moment, diferenciando visualmente a cada coach. */}
      {coach.photo ? (
        <img
          src={coach.photo}
          alt={coach.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            transform: expanded ? "scale3d(1.08,1.08,1.08)" : "scale3d(1,1,1)",
            transition: "transform 1.2s cubic-bezier(.16,1,.3,1), filter 0.8s cubic-bezier(.16,1,.3,1)",
            filter: expanded
              ? "saturate(1.02) brightness(1.05) contrast(1)"
              : "saturate(0.82) brightness(0.85) contrast(0.95)",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background:
              "radial-gradient(circle at 50% 42%, rgba(201,169,110,0.14) 0%, rgba(18,18,20,1) 65%)",
            transform: expanded ? "scale3d(1.03,1.03,1.03)" : "scale3d(1,1,1)",
            transition: "transform 0.9s cubic-bezier(0,0,0.2,1)",
          }}
          aria-hidden
        >
          <span
            className="j3-grad-text font-bold font-[var(--font-serif)] italic normal-case tracking-[-2px] leading-[0.9] select-none"
            style={{
              fontSize: "clamp(56px, 10vw, 92px)",
              transform: expanded ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.7s cubic-bezier(.16,1,.3,1)",
              filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.45))",
            }}
          >
            {getInitials(coach.name)}
          </span>
        </div>
      )}

      {/* Gold line superior — expande al hover */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-[1.5px] z-[10] pointer-events-none"
        style={{
          background: "linear-gradient(to right, transparent 0%, var(--g1) 50%, transparent 100%)",
          width: expanded ? "100%" : "55%",
          opacity: expanded ? 0.9 : 0.35,
          transition: "width 0.7s cubic-bezier(.16,1,.3,1), opacity 0.5s ease-out",
        }}
      />

      {/* Top gradient */}
      <div
        className="absolute top-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: "45%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.2) 60%, transparent 100%)",
        }}
      />
      {/* Bottom gradient — crece al hover para dar más espacio al reveal sin
          perder legibilidad. Transición lenta para sentir la transformación. */}
      <div
        className="absolute bottom-0 left-0 w-full z-[5] pointer-events-none"
        style={{
          height: expanded ? "72%" : "50%",
          background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.7) 30%, rgba(0,0,0,0.35) 65%, transparent 100%)",
          transition: "height 0.7s cubic-bezier(.16,1,.3,1)",
        }}
      />

      {/* Badges top-left. HQ / Founder / Gen ONE (mutuamente exclusivos
          excepto HQ). El estado del coach (cert activa / ex-cert) se
          comunica abajo con las líneas de fecha. */}
      {(isHq || badges.founder || badges.genOne) && (
        <div className="absolute top-3 left-3 z-[10] flex flex-wrap items-center gap-1.5 max-w-[calc(100%-24px)]">
          {isHq && (
            <span className="inline-flex items-center gap-1 px-1.5 py-[2px] bg-black/55 backdrop-blur-[2px]" style={{ borderRadius: 2 }}>
              <span className="w-[4px] h-[4px] rounded-full bg-[var(--g1)]" aria-hidden
                style={{ boxShadow: "0 0 4px var(--g1)" }} />
              <span className="text-[8px] font-bold tracking-[1.6px] uppercase text-[var(--g1)]">
                {labels.badgeHq}
              </span>
            </span>
          )}
          {!isHq && badges.founder && (
            <span className="inline-flex items-center gap-1 px-1.5 py-[2px] bg-black/55 backdrop-blur-[2px] border border-[var(--g1)]/55" style={{ borderRadius: 2 }}>
              <span className="font-[var(--font-serif)] italic text-[9px] leading-none text-[var(--g1)]" aria-hidden>✦</span>
              <span className="text-[8px] font-bold tracking-[1.6px] uppercase text-[var(--g1)]">
                {labels.badgeFounder}
              </span>
            </span>
          )}
          {!isHq && badges.genOne && !badges.founder && (
            <span className="inline-flex items-center gap-1 px-1.5 py-[2px] bg-black/55 backdrop-blur-[2px] border border-[var(--g1)]/40" style={{ borderRadius: 2 }}>
              <span className="text-[6px] leading-none text-[var(--g1)] opacity-85" aria-hidden>◆</span>
              <span className="text-[8px] font-bold tracking-[1.6px] uppercase text-[var(--g1)]">
                {labels.badgeGenOne}
              </span>
            </span>
          )}
        </div>
      )}

      {/* Km from user — top-right si hay coords */}
      {userCoords && labels.kmFromYou && (
        <div className="absolute top-3 right-3 z-[10]">
          <span
            className="inline-flex items-center gap-1 px-2 py-[3px] bg-black/60 backdrop-blur-[2px] text-[8px] font-bold tracking-[1.2px] text-[var(--g1)]"
            style={{ borderRadius: 2 }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {formatDistance(haversineKm(userCoords, coach.location.coordinates), labels.kmFromYou)}
          </span>
        </div>
      )}

      {/* Bottom content — estilo Porsche editorial:
          Default (no hover): solo nombre + ciudad. Minimalista.
          Hover: se revela ✓ Cualificado/Certificado + club con slide-up.
          El CTA arrow crece y aparece un label gold.
          Esta progresión convierte el hover en un "momento" de card. */}
      <div className="absolute bottom-0 left-0 right-0 z-[13] p-[14px] min-[640px]:p-[18px]">
        <div className="flex items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3
              className="font-bold text-[16px] min-[640px]:text-[18px] text-white leading-[1.05] tracking-[-0.4px] truncate"
              style={{
                textShadow: "0 2px 14px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.4)",
                transform: expanded ? "translateY(-2px)" : "translateY(0)",
                transition: "transform 0.5s cubic-bezier(.16,1,.3,1)",
              }}
            >
              {coach.name}
            </h3>
            <p
              className="mt-[4px] text-[10.5px] font-medium text-white/75 tracking-[0.4px] truncate"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
            >
              {coach.location.city} · {coach.location.country}
            </p>

            {/* Reveal area — hidden por default, slide-up al hover.
                Alberga la línea ✓ Cualificado/Certificado y el club principal.
                max-height animado para transición suave sin flicker. */}
            <div
              className="overflow-hidden"
              style={{
                maxHeight: expanded ? "90px" : "0px",
                opacity: expanded ? 1 : 0,
                transition: expanded
                  ? "max-height 0.55s cubic-bezier(.16,1,.3,1), opacity 0.4s ease 0.1s"
                  : "max-height 0.35s cubic-bezier(.16,1,.3,1), opacity 0.2s ease",
              }}
            >
              {showCertLine && (
                <p
                  className="mt-[10px] text-[10px] tracking-[0.5px] truncate flex items-center gap-[5px] font-bold text-[var(--g1)]"
                  style={{ textShadow: "0 1px 6px rgba(0,0,0,0.6)" }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="shrink-0">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="truncate uppercase">{badges.verified ? labels.certifiedSince : labels.qualifiedSince}</span>
                </p>
              )}
              {primaryClub && (
                <p
                  className="mt-[4px] text-[10px] font-medium text-white/60 tracking-[0.2px] truncate"
                  style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
                >
                  {primaryClub}
                </p>
              )}
            </div>
          </div>

          {/* CTA arrow — crece y se acompaña de label en hover.
              El label "conocer" aparece con un pequeño delay para
              que primero veas el zoom de foto, luego la llamada. */}
          <span
            className="shrink-0 inline-flex items-center gap-1.5 text-[var(--g1)] self-end"
            aria-label={labels.askChatbot}
          >
            <svg
              width={expanded ? 20 : 16}
              height={expanded ? 20 : 16}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
              style={{
                transform: expanded ? "translateX(4px)" : "translateX(0)",
                transition: "transform 0.55s cubic-bezier(.16,1,.3,1), width 0.4s ease, height 0.4s ease",
              }}
            >
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>
    </button>
  );
}

/**
 * CoachesCarousel — wrapper que conmuta entre dos layouts según viewport:
 *   - Desktop (≥961px): PorscheCoachRow con flex-expand al hover. Hasta
 *     6 cards destacadas visibles a la vez, la hovered crece ~1.5x.
 *   - Mobile  (<961px): scroll carrusel horizontal drag-to-scroll con
 *     snap + progress bar. Funciona bien en touch.
 *
 * Ambos comparten el mismo hoveredSlug (aunque en mobile el hover no
 * se dispara de forma fiable) y renderizan el mismo PorscheCoachCard.
 */
function CoachesCarousel({
  coaches,
  labels,
  userCoords,
  onAsk,
}: {
  coaches: readonly Coach[];
  labels: {
    badgeHq: string;
    badgeFounder: string;
    badgeGenOne: string;
    badgeVerified: string;
    monthShort: readonly string[];
    memberSince: string;
    qualifiedSince: string;
    certifiedSince: string;
    askChatbot: string;
    kmFromYou?: string;
  };
  userCoords?: LatLng | null;
  onAsk?: (c: Coach) => void;
}) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredIdx = hoveredSlug
    ? coaches.findIndex((c) => c.slug === hoveredSlug)
    : null;

  /* Las cards son las mismas en desktop y mobile — renderizadas una
     vez para evitar duplicación. Cada wrapper (PorscheCoachRow /
     mobile scroll) les da su container y dimensiones propias. */
  const cards = coaches.map((c) => (
    <PorscheCoachCard
      key={c.slug}
      coach={c}
      labels={labels}
      userCoords={userCoords}
      onAsk={onAsk}
      isHovered={hoveredSlug === c.slug}
      onHover={() => setHoveredSlug(c.slug)}
      onLeave={() => setHoveredSlug(null)}
    />
  ));

  return (
    <div className="relative">
      {/* Desktop — fila flex-expand estilo Porsche */}
      <PorscheCoachRow hoveredIdx={hoveredIdx === -1 ? null : hoveredIdx}>
        {cards}
      </PorscheCoachRow>

      {/* Mobile — carrusel drag con snap */}
      <CoachesMobileCarousel coaches={coaches}>{cards}</CoachesMobileCarousel>
    </div>
  );
}

/**
 * CoachesMobileCarousel — versión mobile del carrusel de coaches.
 * Scroll horizontal con drag, snap al inicio de cada card, fade a la
 * derecha como hint de "hay más", y progress bar debajo. Solo se
 * pinta bajo 961px.
 */
function CoachesMobileCarousel({
  coaches,
  children,
}: {
  coaches: readonly Coach[];
  children: React.ReactNode[];
}) {
  const { scrollRef, progress } = useDragScroll(coaches.length);
  const showRightFade = progress < 0.98;
  return (
    <div className="min-[961px]:hidden relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide snap-x snap-mandatory -mx-3 px-3"
        style={{ cursor: "grab", scrollPadding: "0 12px" }}
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="shrink-0 snap-start"
            style={{ width: "clamp(220px, 70vw, 280px)", aspectRatio: "3 / 4" }}
          >
            {child}
          </div>
        ))}
        <div className="shrink-0 w-1" aria-hidden />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 bottom-0 right-0 w-10 z-[2] transition-opacity duration-300"
        style={{
          background:
            "linear-gradient(to left, rgba(12,12,14,1), rgba(12,12,14,0))",
          opacity: showRightFade ? 1 : 0,
        }}
      />
      <CarouselProgress progress={progress} />
    </div>
  );
}

/** Barra de progreso delgada bajo un scroll horizontal — un track
 *  tenue + un fill gold que escala al `progress` (0-1). */
function CarouselProgress({ progress }: { progress: number }) {
  return (
    <div className="mt-5 h-[2px] w-full bg-white/[.07] relative overflow-hidden" aria-hidden>
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: "28%",
          transform: `translateX(${progress * (100 / 0.28 - 100)}%)`,
          background: "linear-gradient(to right, rgba(201,169,110,0.25), var(--g1), rgba(201,169,110,0.25))",
          transition: "transform .18s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

function SedesBlock({ sedes, eyebrow }: { sedes: readonly Sede[]; eyebrow: string }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const cards = sedes.map((s, i) => (
    <SedeCard
      key={s.name}
      sede={s}
      eyebrow={eyebrow}
      isHovered={hoveredIdx === i}
      onHover={() => setHoveredIdx(i)}
      onLeave={() => setHoveredIdx(null)}
    />
  ));
  return (
    <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-12 max-[960px]:pb-10">
      <PorscheRow hoveredIdx={hoveredIdx}>{cards}</PorscheRow>
      <ScrollCarousel
        cardWidth="clamp(280px, 78vw, 360px)"
        cardHeight="clamp(240px, 58vw, 320px)"
      >
        {cards}
      </ScrollCarousel>
    </div>
  );
}

/**
 * TopOfMonthBadge — chip con el counter histórico "veces Top del mes".
 * Reconoce la RECURRENCIA: los coaches que vuelven al podio mes a mes
 * son pilares de la red, no flashes de un momento. Solo se renderiza
 * si el counter > 0.
 */
function TopOfMonthBadge({ count }: { count: number | undefined }) {
  if (!count || count < 1) return null;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-[4px] backdrop-blur-sm"
      style={{
        background: "rgba(10,10,10,0.72)",
        border: "1px solid rgba(201,169,110,0.45)",
        borderRadius: 2,
      }}
      title={`${count}× Top del mes`}
    >
      {/* Icono corona minimalista — refleja "recurrencia en el podio" */}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ color: "var(--g1)" }}>
        <path d="M3 18h18" />
        <path d="M4 9l4 4 4-7 4 7 4-4-1 9H5z" />
      </svg>
      <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
        {count}× Top
      </span>
    </span>
  );
}

/**
 * MonthlyRankingBlock — Top 3 del mes.
 *
 * Estructura:
 *   - Eyebrow row: "TOP DEL MES" ── rule ── "ABRIL 2026"
 *   - Hero #1: tratamiento editorial completo (foto grande, Nº 01,
 *     nombre huge, achievement pull-quote, CTA gold, outcomes bullets)
 *   - Satélites #2 y #3: cards más compactas, horizontal, con foto
 *     mediana, nombre, ciudad, outcomes cortos. Sin achievement.
 *
 * DATA SOURCE: i18n (`network.monthlyRanking.top3`). Cuando la API de
 * XP esté lista, sustituir por useMonthlyRanking() sin tocar la UI.
 *
 * ROADMAP (cuando el sistema XP esté definido):
 *   - Outcomes derivados de XP crudo (sessions, hours, certs, etc.)
 *   - Real-time update (hoy: snapshot manual mensual)
 *   - timesTopOfMonth se deriva automáticamente del histórico
 *   - XP raw nunca se expone — solo outcomes cualitativos
 */
function MonthlyRankingBlock() {
  const { t } = useI18n();
  const s = t.academy.network.monthlyRanking;

  /* Resolver coaches de cada posición a partir del slug. Si algún
     slug no existe en COACHES, se filtra (no rompe el render). */
  const ranked = s.top3
    .map((entry) => ({ entry, coach: COACHES.find((c) => c.slug === entry.coachSlug) }))
    .filter((x): x is { entry: typeof s.top3[number]; coach: Coach } => !!x.coach);

  if (ranked.length === 0) return null;

  const [first, ...rest] = ranked;

  const handleAsk = (coach: Coach) => {
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: coach.name,
          coachLocation: `${coach.location.city}, ${coach.location.country}`,
        },
      }),
    );
  };

  return (
    <div className="relative border-t border-white/[.07]">
      {/* Halo radial sutil — da énfasis al bloque sin romper el dark continuo. */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 25% 40%, rgba(201,169,110,0.05), transparent 55%)",
        }}
      />

      <div className="relative px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-20 max-[960px]:py-14">
        {/* Eyebrow row con rule gold separando eyebrow y periodo */}
        <div className="flex items-center gap-4 mb-10 max-[640px]:mb-7">
          <span className="text-[10px] font-bold tracking-[5px] uppercase text-[var(--g1)]">
            {s.eyebrow}
          </span>
          <span aria-hidden className="h-px flex-1 bg-[var(--g1)]/25" />
          <span className="text-[10px] tracking-[3px] uppercase text-white/45 font-medium">
            {s.period}
          </span>
        </div>

        {/* ═══ HERO #1 — Editorial completo ═══ */}
        <MonthlyRankingHero
          coach={first.coach}
          entry={first.entry}
          labels={{
            edition: s.edition,
            achievementLabel: s.achievementLabel,
            outcomesLabel: s.outcomesLabel,
            ctaLabel: s.ctaLabel,
            badgeVerified: t.academy.network.badgeVerified,
          }}
          onAsk={handleAsk}
        />

        {/* ═══ SATÉLITES #2 y #3 — Cards más sobrias ═══ */}
        {rest.length > 0 && (
          <div className="mt-10 max-[640px]:mt-7 grid min-[960px]:grid-cols-2 gap-6 max-[640px]:gap-5">
            {rest.map((r, i) => (
              <MonthlyRankingSatellite
                key={r.coach.slug}
                rank={i + 2}
                coach={r.coach}
                entry={r.entry}
                labels={{
                  outcomesLabel: s.outcomesLabel,
                  badgeVerified: t.academy.network.badgeVerified,
                }}
                onAsk={handleAsk}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** Hero #1 del ranking — foto grande + editorial completo. */
function MonthlyRankingHero({
  coach,
  entry,
  labels,
  onAsk,
}: {
  coach: Coach;
  entry: { achievement?: string; outcomes: readonly string[] };
  labels: {
    edition: string;
    achievementLabel: string;
    outcomesLabel: string;
    ctaLabel: string;
    badgeVerified: string;
  };
  onAsk: (c: Coach) => void;
}) {
  const badges = getCoachBadges(coach);
  return (
    <div className="grid min-[960px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-10 max-[960px]:gap-7 min-[960px]:items-stretch">
      {/* FOTO */}
      <div className="relative overflow-hidden aspect-[4/3] min-[960px]:aspect-auto min-[960px]:min-h-[520px]" style={{ background: "#000" }}>
        {coach.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coach.photo}
            alt={coach.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "saturate(0.92) contrast(0.98)" }}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(201,169,110,0.15) 0%, rgba(18,18,20,1) 65%)",
            }}
          >
            <span
              className="j3-grad-text font-bold font-[var(--font-serif)] italic normal-case select-none"
              style={{
                fontSize: "clamp(80px, 14vw, 140px)",
                letterSpacing: "-3px",
                filter: "drop-shadow(0 6px 24px rgba(0,0,0,0.55))",
              }}
            >
              {getInitials(coach.name)}
            </span>
          </div>
        )}

        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.45) 100%)",
          }}
        />

        {/* Badges overlay top-left: Certificado + Veces Top (histórico) */}
        <div className="absolute top-5 left-5 flex flex-wrap gap-1.5 max-w-[calc(100%-40px)]">
          {badges.verified && (
            <div
              className="inline-flex items-center gap-1.5 px-2.5 py-[5px] backdrop-blur-sm"
              style={{
                background: "rgba(10,10,10,0.72)",
                border: "1px solid rgba(201,169,110,0.6)",
                borderRadius: 2,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: 999,
                  background: "#C9A96E",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
                {labels.badgeVerified}
              </span>
            </div>
          )}
          <TopOfMonthBadge count={coach.timesTopOfMonth} />
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-col justify-between gap-8 max-[960px]:gap-6 py-2">
        <div>
          <span
            className="block j3-grad-text font-[var(--font-serif)] italic leading-[0.85]"
            style={{ fontSize: "clamp(64px, 7vw, 104px)", letterSpacing: "-3px" }}
          >
            {labels.edition}
          </span>
          <h3
            className="mt-5 font-bold leading-[1] tracking-[-1.5px]"
            style={{ color: "var(--wh)", fontSize: "clamp(34px, 3.8vw, 56px)" }}
          >
            {coach.name}
          </h3>
          <p className="mt-3 text-[14px] font-medium tracking-[0.4px] text-white/70">
            {coach.location.city} · {coach.location.country}
          </p>
        </div>

        {/* Logro del mes — pull-quote (solo #1). Si no hay achievement
            en i18n, caemos a listar outcomes como bullet. */}
        {entry.achievement ? (
          <div className="relative pl-5 py-1" style={{ borderLeft: "2px solid rgba(201,169,110,0.55)" }}>
            <span className="block text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)] mb-2">
              {labels.achievementLabel}
            </span>
            <p className="text-[14px] max-[960px]:text-[13px] leading-[1.55] italic" style={{ color: "rgba(245,240,232,0.88)" }}>
              {entry.achievement}
            </p>
          </div>
        ) : entry.outcomes.length > 0 ? (
          <OutcomesList label={labels.outcomesLabel} outcomes={entry.outcomes} />
        ) : null}

        {/* CTA gold lleno */}
        <button
          type="button"
          onClick={() => onAsk(coach)}
          className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[#000] px-6 py-3 self-start transition-all duration-300"
          style={{
            background: "#C9A96E",
            borderRadius: 2,
            boxShadow: "0 4px 16px rgba(201,169,110,0.25)",
          }}
        >
          {labels.ctaLabel}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
            <path d="M5 12h14" />
            <path d="M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/** Satélite #2/#3 — card compacta horizontal (foto 40% + contenido 60%). */
function MonthlyRankingSatellite({
  rank,
  coach,
  entry,
  labels,
  onAsk,
}: {
  rank: number;
  coach: Coach;
  entry: { outcomes: readonly string[] };
  labels: { outcomesLabel: string; badgeVerified: string };
  onAsk: (c: Coach) => void;
}) {
  const badges = getCoachBadges(coach);
  const editionLabel = `Nº 0${rank}`;
  return (
    <button
      type="button"
      onClick={() => onAsk(coach)}
      className="group relative overflow-hidden border border-white/[.08] hover:border-[var(--g1)]/40 transition-colors duration-500 text-left"
      style={{ borderRadius: 2, background: "#0a0a0a" }}
    >
      <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] min-h-[220px] max-[640px]:min-h-[180px]">
        {/* FOTO izquierda */}
        <div className="relative overflow-hidden" style={{ background: "#000" }}>
          {coach.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={coach.photo}
              alt={coach.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: "saturate(0.9) contrast(0.98) brightness(0.92)" }}
            />
          ) : (
            <div
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, rgba(201,169,110,0.14) 0%, rgba(18,18,20,1) 65%)",
              }}
            >
              <span
                className="j3-grad-text font-bold font-[var(--font-serif)] italic normal-case"
                style={{
                  fontSize: "clamp(48px, 6vw, 72px)",
                  letterSpacing: "-2px",
                }}
              >
                {getInitials(coach.name)}
              </span>
            </div>
          )}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.4) 100%)",
            }}
          />
          {/* Badges overlay top-left: Certificado + Veces Top */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1 max-w-[calc(100%-24px)]">
            {badges.verified && (
              <span
                className="inline-flex items-center gap-1 px-1.5 py-[3px] backdrop-blur-sm"
                style={{
                  background: "rgba(10,10,10,0.72)",
                  border: "1px solid rgba(201,169,110,0.55)",
                  borderRadius: 2,
                }}
                title={labels.badgeVerified}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ color: "var(--g1)" }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
            )}
            <TopOfMonthBadge count={coach.timesTopOfMonth} />
          </div>
        </div>

        {/* CONTENIDO derecha */}
        <div className="flex flex-col justify-between gap-4 p-5 max-[640px]:p-4">
          <div>
            <span
              className="block j3-grad-text font-[var(--font-serif)] italic leading-[0.9]"
              style={{ fontSize: "clamp(28px, 3vw, 40px)", letterSpacing: "-1.5px" }}
            >
              {editionLabel}
            </span>
            <h4
              className="mt-2 font-bold leading-[1.1] tracking-[-0.5px]"
              style={{ color: "var(--wh)", fontSize: "clamp(18px, 2vw, 22px)" }}
            >
              {coach.name}
            </h4>
            <p className="mt-1 text-[11px] font-medium tracking-[0.3px] text-white/60">
              {coach.location.city} · {coach.location.country}
            </p>
          </div>

          {entry.outcomes.length > 0 && (
            <OutcomesList label={labels.outcomesLabel} outcomes={entry.outcomes} compact />
          )}
        </div>
      </div>
    </button>
  );
}

/** Lista compartida de outcomes — bullets gold con texto muted. */
function OutcomesList({
  label,
  outcomes,
  compact = false,
}: {
  label: string;
  outcomes: readonly string[];
  compact?: boolean;
}) {
  return (
    <div>
      <span className={`block font-bold tracking-[2.5px] uppercase text-[var(--g1)] mb-2 ${compact ? "text-[8px] mb-1" : "text-[9px]"}`}>
        {label}
      </span>
      <ul className="flex flex-col gap-[3px]">
        {outcomes.map((o, i) => (
          <li
            key={i}
            className={`flex items-start gap-2 leading-[1.45] ${compact ? "text-[11px]" : "text-[13px]"}`}
            style={{ color: "rgba(245,240,232,0.82)" }}
          >
            <span
              aria-hidden
              className="shrink-0 mt-[6px]"
              style={{
                width: 4,
                height: 4,
                borderRadius: 999,
                background: "var(--g1)",
              }}
            />
            <span>{o}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NetworkSection({ markerSlot }: { markerSlot?: React.ReactNode }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);
  const isMobile = useIsMobile(960);

  // Coaches visibles en la red (sin HQ — HQ tiene bloque propio arriba).
  // Ordenados por tier → joinedAt (ver sortCoaches).
  const allCoaches = useMemo(() => sortCoaches(COACHES).filter(c => c.tier !== "hq"), []);

  // Filtros compartidos con HeroSection via FilterContext.
  const { country, setCountry, language, setLanguage, specialty, setSpecialty, hasAnyFilter, resetAll: resetFilters } = useFilters();

  // Geolocalización opt-in compartida vía GeoContext. `coords` es null
  // hasta que el usuario pulsa "Cerca de mí" y el navegador concede
  // permiso. Al estar en context, el mapa del hero recibe las mismas
  // coords y se recentra automáticamente.
  const geo = useGeo();

  const filtered = useMemo(() => {
    const list = filterCoaches(allCoaches, { country, language, specialty });
    if (!geo.coords) return list;
    // Mutable copy para sort. Haversine es trivial computacionalmente.
    const withDistance = [...list].map((c) => ({
      coach: c,
      km: haversineKm(geo.coords!, c.location.coordinates),
    }));
    withDistance.sort((a, b) => a.km - b.km);
    return withDistance.map((x) => x.coach);
  }, [allCoaches, country, language, specialty, geo.coords]);

  /* Desktop (PorscheRow flex-expand): 6 destacadas es el máximo que se
     lee bien sin que las cards queden demasiado estrechas. Mobile
     (scroll carrusel): 10 para dar sensación de abundancia al swipe.
     El CTA "Ver los X coaches" lleva al listado completo. */
  const displayCount = isMobile ? 10 : 6;
  const display = useMemo(
    () => pickDisplayCoaches(filtered, displayCount),
    [filtered, displayCount],
  );

  const gridLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeFounder: t.academy.network.badgeFounder,
    badgeGenOne: t.academy.network.badgeGenOne,
    badgeVerified: t.academy.network.badgeVerified,
    monthShort: t.academy.network.monthShort,
    memberSince: t.academy.network.memberSince,
    qualifiedSince: t.academy.network.qualifiedSince,
    certifiedSince: t.academy.network.certifiedSince,
    askChatbot: t.academy.network.askChatbot,
    kmFromYou: t.academy.network.kmFromYou,
  };

  const specialtyLabel = (s: CoachSpecialty) =>
    s === "juniors"
      ? t.academy.network.specialtyJuniors
      : s === "adultos"
      ? t.academy.network.specialtyAdultos
      : s === "competicion"
      ? t.academy.network.specialtyCompeticion
      : t.academy.network.specialtyCamps;

  const handleAsk = (coach: Coach) => {
    // Flujo J3: el usuario pasa SIEMPRE por nuestro chatbot antes de llegar al coach.
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: coach.name,
          coachLocation: `${coach.location.city}, ${coach.location.country}`,
        },
      }),
    );
  };

  // CTA "ver todos": cambia de texto según haya filtros activos.
  const viewAllHref = buildCoachesUrl({ country, language, specialty });
  const viewAllLabel = hasAnyFilter
    ? t.academy.network.viewFilteredCta.replace("{count}", filtered.length.toString())
    : t.academy.network.viewAllCta.replace("{count}", allCoaches.length.toString());
  // Si hay filtros y ya vemos todos los resultados en el bloque reducido, ocultamos el CTA.
  const showViewAllCta = !hasAnyFilter || filtered.length > displayCount;

  return (
    <section id="network" className="sedes-section relative overflow-hidden border-b border-white/[.07]">
      {markerSlot}

      {/* Header */}
      <div
        ref={ref}
        className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-[72px] pb-10 max-[960px]:pt-[56px] max-[960px]:pb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-2 max-[960px]:text-[11px] max-[960px]:tracking-[3px]">
          {t.academy.network.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(28px,3vw,44px)] uppercase tracking-[-0.5px] leading-[1.05]">
          <span className="sedes-heading">{t.academy.network.headingPre}</span>
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">
            {t.academy.network.headingAccent}
          </span>
        </h2>
        {t.academy.network.headingSub && (
          <p className="max-w-[640px] mt-4 text-[14px] max-[960px]:text-[13px] opacity-75 leading-[1.55] theme-text">
            {t.academy.network.headingSub}
          </p>
        )}
      </div>

      {/* Sedes block — eyebrow "Coach360" + 2 cards (Los Limoneros + Finura).
          Desktop: PorscheRow (2 columnas con flex-expand al hover).
          Mobile: ScrollCarousel horizontal con snap. */}
      <SedesBlock sedes={t.academy.network.sedes} eyebrow={t.academy.network.sedesLabel} />

      {/* Coaches grid */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-12 max-[960px]:pb-10">
        {/* Header de la grid: eyebrow + heading (sin contador, ahora vive
            en la stat-line más abajo junto a los filtros). */}
        <div className="flex items-baseline flex-wrap gap-x-5 gap-y-1 mb-3">
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
            {t.academy.network.gridLabel}
          </span>
          <h3 className="font-[var(--font-serif)] italic text-[clamp(18px,1.5vw,22px)] j3-grad-text">
            {t.academy.network.gridHeading}
          </h3>
        </div>

        {/* Stat-line — conecta los filtros con su resultado. Se actualiza
            reactivamente conforme cambian país/idioma/especialidad. Los
            números van en gold bold para destacar sobre el texto muted.
            Template con 4 placeholders: {showing} {total} {countries} {languages}. */}
        <p className="text-[11px] tracking-[1.8px] uppercase text-white/55 mb-5">
          {(() => {
            const values: Record<string, string> = {
              showing: filtered.length.toString(),
              total: allCoaches.length.toString(),
              countries: new Set(filtered.map(c => c.location.country)).size.toString(),
              languages: new Set(filtered.flatMap(c => c.languages ?? [])).size.toString(),
            };
            /* Split en cualquier placeholder {xxx}, devolviendo una lista
               intercalada de texto plano y tokens a sustituir. Render como
               spans para poder estilar los números en gold. */
            return t.academy.network.statsLine.split(/(\{[^}]+\})/).map((part, i) => {
              const m = part.match(/^\{([^}]+)\}$/);
              if (m) {
                return (
                  <span key={i} className="font-bold text-[var(--g1)]">
                    {values[m[1]] ?? part}
                  </span>
                );
              }
              return <span key={i}>{part}</span>;
            });
          })()}
        </p>

        {/* Filtros — fila unificada con estados activos visibles */}
        <div className="flex flex-wrap items-center gap-2.5 max-[960px]:gap-2 mb-6 text-[12px] max-[960px]:text-[11px]" style={{ color: "var(--wh)" }}>
          <FilterSelect
            label={t.academy.network.filterCountry}
            value={country}
            onChange={setCountry}
            isActive={country !== "all"}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_COUNTRIES.map(c => ({ value: c, label: c }))]}
          />
          <FilterSelect
            label={t.academy.network.filterLanguage}
            value={language}
            onChange={setLanguage}
            isActive={language !== "all"}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_LANGUAGES.map(l => ({ value: l, label: languageLabel(l) }))]}
          />

          {/* Especialidad como chips — 5 opciones, tap directo sin abrir
              dropdown. Más táctil y rápido que un <select> para pocas opciones. */}
          <FilterChips
            label={t.academy.network.filterSpecialty}
            value={specialty}
            onChange={setSpecialty}
            options={[
              { value: "all", label: t.academy.network.filterAll },
              ...COACH_SPECIALTIES.map(s => ({ value: s, label: specialtyLabel(s) })),
            ]}
          />

          {/* Divider sutil antes de las acciones (geo + reset) — separa
              "filtros de contenido" de "acciones globales". */}
          <span aria-hidden className="h-5 w-px bg-white/15 max-[960px]:hidden" />

          {/* Cerca de mí — botón de geolocalización opt-in. Cambia de
              aspecto según el estado del hook (idle/loading/success/error).
              Cuando success, aparece un 'X' para limpiar y volver al orden
              por defecto. */}
          {geo.status === "success" ? (
            <button
              type="button"
              onClick={geo.clear}
              className="group inline-flex items-center gap-2 px-3 py-[7px] text-[10px] tracking-[2px] uppercase font-bold text-[#0E1C16] bg-[#C9A96E] hover:brightness-110 transition-all"
              style={{ borderRadius: 2, boxShadow: "0 2px 10px rgba(201,169,110,0.25)" }}
              aria-label={t.academy.network.nearMeActive}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <circle cx="12" cy="12" r="10" />
                <line x1="22" y1="12" x2="18" y2="12" />
                <line x1="6" y1="12" x2="2" y2="12" />
                <line x1="12" y1="6" x2="12" y2="2" />
                <line x1="12" y1="22" x2="12" y2="18" />
                <circle cx="12" cy="12" r="3" fill="currentColor" />
              </svg>
              <span>{t.academy.network.nearMeActive}</span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="opacity-60 group-hover:opacity-100">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={geo.request}
              disabled={geo.status === "loading"}
              className="inline-flex items-center gap-2 px-3 py-[7px] text-[10px] tracking-[2px] uppercase font-bold text-[var(--g1)] border border-[var(--g1)]/50 hover:border-[var(--g1)] hover:bg-[var(--g1)]/10 disabled:opacity-60 transition-all"
              style={{ borderRadius: 2 }}
            >
              {geo.status === "loading" ? (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.2-8.55" />
                </svg>
              ) : (
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="22" y1="12" x2="18" y2="12" />
                  <line x1="6" y1="12" x2="2" y2="12" />
                  <line x1="12" y1="6" x2="12" y2="2" />
                  <line x1="12" y1="22" x2="12" y2="18" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
              <span>
                {geo.status === "loading" ? t.academy.network.nearMeLoading : t.academy.network.nearMe}
              </span>
            </button>
          )}

          {/* Reset — botón con forma consistente (no link) cuando hay filtros
              activos. Icono 'undo' para señalizar "deshacer filtros". */}
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-[7px] text-[10px] tracking-[2px] uppercase font-bold text-[var(--g1)] border border-[var(--g1)]/30 hover:border-[var(--g1)]/70 hover:bg-[var(--g1)]/5 transition-all"
              style={{ borderRadius: 2 }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
              <span>{t.academy.network.filterReset}</span>
            </button>
          )}
        </div>

        {/* Mensaje de error de geolocalización — discreto, con cierre
            manual (se recupera reiniciando el estado al clicar "×"). */}
        {geo.status === "error" && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-3 px-4 py-3 border border-[var(--g1)]/25 bg-[var(--g1)]/5"
            style={{ borderRadius: 2, color: "var(--wh)" }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--g1)] flex-shrink-0 mt-0.5" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[12px] opacity-85 leading-[1.5] flex-1">
              {t.academy.network.nearMeError}
            </p>
            <button
              type="button"
              onClick={geo.clear}
              className="text-[var(--g1)] opacity-60 hover:opacity-100 transition"
              aria-label="Cerrar"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        )}

        {filtered.length === 0 ? (
          <div
            className="relative border theme-border px-8 py-14 min-[768px]:py-16 text-center flex flex-col items-center gap-4"
            style={{
              color: "var(--wh)",
              background:
                "radial-gradient(circle at 50% 30%, rgba(201,169,110,0.06), transparent 60%)",
            }}
            role="status"
            aria-live="polite"
          >
            {/* Icono — lupa con guión inclinado (sin resultados) */}
            <div
              aria-hidden
              className="relative flex items-center justify-center"
              style={{
                width: 64,
                height: 64,
                borderRadius: 999,
                background:
                  "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.12), rgba(201,169,110,0.04) 60%, transparent 100%)",
                border: "1px solid rgba(201,169,110,0.3)",
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--g1)", opacity: 0.9 }}
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.5" y2="16.5" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>

            <h3 className="text-[16px] min-[768px]:text-[18px] font-bold tracking-[-0.2px] leading-[1.2]">
              {t.academy.network.filterEmptyTitle}
            </h3>
            <p className="text-[13px] opacity-65 max-w-[380px] leading-[1.5]">
              {t.academy.network.filterEmptyDesc}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
              {hasAnyFilter && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] border border-[var(--g1)]/50 hover:border-[var(--g1)] hover:bg-[var(--g1)]/10 px-5 py-2.5 transition-all duration-300"
                  style={{ borderRadius: 2 }}
                >
                  {t.academy.network.filterReset}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("j3:chat:open", {
                      detail: { coachName: "J3", coachLocation: "" },
                    }),
                  )
                }
                className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[2.5px] uppercase text-[#0E1C16] bg-[#C9A96E] hover:brightness-110 px-5 py-2.5 transition-all duration-300"
                style={{ borderRadius: 2 }}
              >
                {t.academy.network.askChatbot}
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Scroll horizontal estilo Porsche — cards pequeñas que se
                arrastran con drag/touch, snap al borde. Damos un pelín de
                padding virtual a la derecha para hint de "hay más". */}
            <CoachesCarousel
              coaches={display}
              labels={gridLabels}
              userCoords={geo.coords}
              onAsk={handleAsk}
            />

            {showViewAllCta && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={viewAllHref}
                  className="group inline-flex items-center gap-3 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] border border-[var(--g1)]/40 hover:border-[var(--g1)] px-6 py-3 transition-all duration-300"
                  style={{ borderRadius: 2 }}
                >
                  {viewAllLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Top 3 del mes — ranking editorial que cierra la sección con
          emoción antes del CTA Coach360. #1 con tratamiento hero
          completo, #2 y #3 como cards satélite más sobrias. Se
          actualiza vía i18n (top3 + outcomes); pasará a fuente API
          cuando el sistema XP esté listo — ver comentario en el
          componente MonthlyRankingBlock. */}
      <MonthlyRankingBlock />

      {/* Coach360 CTA */}
      <div id="coach360" className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-[80px] max-[960px]:pb-[56px] scroll-mt-[120px]">
        <a
          href={t.academy.network.coachCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden border border-white/[.08] hover:border-[var(--g1)]/40 transition-colors duration-500 px-8 py-10 max-[640px]:px-6 max-[640px]:py-8"
        >
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[50%] opacity-70 group-hover:w-full group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700"
            aria-hidden
          />
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-3">
            {t.academy.network.coachCta.eyebrow}
          </span>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-[640px]">
              <h3 className="font-bold text-[clamp(22px,2.4vw,34px)] uppercase tracking-[-0.5px] leading-[1.05]" style={{ color: "var(--wh)" }}>
                {t.academy.network.coachCta.title}
              </h3>
              <p className="mt-3 text-[13px] max-[640px]:text-[12px] opacity-70 leading-[1.55]" style={{ color: "var(--wh)" }}>
                {t.academy.network.coachCta.description}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] group-hover:gap-3 transition-all duration-500">
              {t.academy.network.coachCta.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </a>
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
    { name: "Adultos", tag: "Programa mensual", img: "/images/academy/amateur.jpeg", href: "#programas" },
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

        {/* CTA block below grid — wired a i18n (subtitle/button/note/waMsg). */}
        <div className="text-center mt-14 max-[960px]:mt-10">
          <p className="text-[clamp(14px,1.5vw,18px)] text-[var(--gy2)] leading-[1.6] font-light mb-8 max-w-[620px] mx-auto" style={{ textWrap: "balance" }}>
            {t.academy.cta.subtitle}
          </p>
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
          <p className="text-[11px] text-[var(--gy)] tracking-[2px] uppercase mt-8" style={{ textWrap: "balance" }}>
            {t.academy.cta.note}
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(201,169,110,.03) 0%, transparent 70%)" }} />

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
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,169,110,.07) 0%, transparent 70%)" }}
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

      {/* GeoProvider envuelve Hero + Network: ambas secciones consumen
          la misma instancia de `useUserLocation`, de modo que al pulsar
          "Cerca de mí" en el grid, el mapa del hero también recibe las
          coords y recentra al usuario (y viceversa). Evita dos prompts
          simultáneos del navegador y mantiene un único estado. */}
      <GeoProvider>
      <FilterProvider>
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

      <NetworkSection markerSlot={
        /* Marker 3: white→dark — inside NetworkSection (which has its own
           dark bg) so body goes dark invisibly while section is visible */
        <ScrollMarker index={3} to="dark" refs={markerRefs} />
      } />
      </FilterProvider>
      </GeoProvider>

      {/* Empieza hoy — cierre del funnel del jugador: recordatorio de
          los programas que tenemos en Málaga + WhatsApp directo. Es el
          core del negocio y debe ser la última impresión. */}
      <ProgramasGridSection />

      {/* Hand-off para clubes — mini-banner discreto antes del footer
          para que los dueños de club no queden sin ruta desde /academy.
          El pitch B2B completo vive en su propia página (/clubes). */}
      <ClubesHandoffBanner />

      <Footer />
    </main>
  );
}

/**
 * ClubesHandoffBanner — banner mini al final de /academy que redirige
 * a la página /clubes para los pocos lectores que son dueños de club.
 *
 * Separado del funnel principal del jugador: vive después del "Empieza
 * hoy" para no diluir la última impresión. Estética sobria, bajo peso
 * visual — no compite con el CTA anterior.
 */
function ClubesHandoffBanner() {
  const { t } = useI18n();
  const c = t.academy.clubesHandoff;
  return (
    <section className="border-t border-white/[.06] bg-[var(--bk)]">
      <div className="max-w-[1600px] mx-auto px-4 max-[960px]:px-3 py-10 max-[960px]:py-8">
        <Link
          href="/clubes"
          className="group relative block overflow-hidden border border-white/[.07] hover:border-[var(--g1)]/35 transition-colors duration-500 px-6 py-6 max-[640px]:px-5 max-[640px]:py-5"
          style={{ borderRadius: 2 }}
        >
          <span
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-[40%] group-hover:w-full opacity-60 group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700"
          />
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              {/* Preguntas paralelas como eyebrow — cada una con su línea,
                  mismo peso visual. Amplía la red a ya-tienes-club vs
                  quieres-montarlo sin un copy pesado. */}
              <div className="mb-2 leading-[1.55]">
                {c.questions.map((q, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)] block"
                  >
                    {q}
                  </span>
                ))}
              </div>
              <p className="text-[14px] max-[640px]:text-[13px] text-white/85 leading-[1.4] max-w-[640px]">
                {c.body}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] group-hover:gap-3 transition-all duration-500 shrink-0">
              {c.cta}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </Link>
      </div>
    </section>
  );
}
