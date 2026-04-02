"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";

/* ───────── HOOKS ───────── */

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

function useParallax() {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const t = rect.top / window.innerHeight;
    setOffset(t * 80);
  }, []);
  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);
  return { ref, offset };
}

/* ───────── DATA ───────── */

/* ── Player data: tiered by achievement ── */
const playersHero = [
  { first: "Álex", last: "Ruiz", info: "Formado desde joven en Ocean Padel. Alcanzó el top 4 mundial.", tag: "Top 4 Mundial" },
  { first: "Momo", last: "González", info: "Cantera Ocean Padel / J3. 100 % malagueño. Top 5 mundial.", tag: "Top 5 Mundial" },
  { first: "Jordi", last: "Muñoz", info: "Top 8 mundial en el PPT. Cofundador de J3Padel.", tag: "Cofundador J3 · Top 8 PPT" },
];

const playersNextGen = [
  { first: "Guille", last: "Collado", tag: "Campeón de España y del Mundo" },
  { first: "Bea", last: "González", tag: "Campeona de España y del Mundo" },
  { first: "Raquel", last: "Segura", tag: "Campeona de España · Circuito Pro" },
  { first: "Ernesto", last: "Moreno", tag: "Campeón de España · Circuito Pro" },
  { first: "Marcos", last: "González", tag: "Campeón de España y del Mundo Junior" },
];

const playersNextGenPro = [
  { first: "Martina", last: "Fassio", tag: "Next Gen → Top 30" },
  { first: "José", last: "Jiménez Casas", tag: "Next Gen → Top 30" },
];

/* Featured pro collaborations — notable results together */
const playersFeatured = [
  { first: "Franco", last: "Stupaczuk", info: "5 finales y pareja n.º 4 del mundo en 2021.", tag: "3 Títulos · #4 Mundial 2021" },
  { first: "Fede", last: "Chingotto", info: "Semifinales del P2 Premier Padel en Milán 2022.", tag: "SF P2 Milán 2022" },
  { first: "Javi", last: "Garrido", info: "Semifinales del P2 Premier Padel en Milán 2022.", tag: "SF P2 Milán 2022" },
  { first: "Álex", last: "Arroyo", info: "Título FIP Platinum en Ciudad de México.", tag: "Título FIP Platinum CDMX" },
];

/* Rest of shared circuit players */
const playersShared = [
  { first: "Paquito", last: "Navarro", tag: "Top Mundial" },
  { first: "Maxi", last: "Sánchez", tag: "Top Mundial" },
  { first: "Fede", last: "Quiles", tag: "Circuito Pro" },
  { first: "Raquel", last: "Eugenio", tag: "Circuito Pro" },
  { first: "Álex", last: "Chozas", tag: "Circuito Pro" },
  { first: "Pincho", last: "Fernández", tag: "Circuito Pro" },
  { first: "Miguel Á.", last: "Benítez", tag: "Circuito Pro" },
  { first: "Martín", last: "Andornino", tag: "Circuito Pro" },
  { first: "Fran", last: "Jurado", tag: "Circuito Pro" },
  { first: "Pol", last: "Hernández", tag: "Circuito Pro" },
];

const brandsPast = ["Wilson", "Babolat", "Adidas", "Varlion"];

/* ───────── ANIMATED COUNTER ───────── */

function Counter({ val, prefix, suffix, label, className }: { val: number; prefix?: string; suffix?: string; label?: string; className?: string }) {
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
    <span ref={ref} className={className || "font-bold text-[clamp(28px,3.5vw,46px)] j3-grad-text leading-[1] block mb-2"}>
      {label || `${prefix || ""}${count}${suffix || ""}`}
    </span>
  );
}

/* ───────── STATS SECTION ───────── */

function StatsSection() {
  const { t } = useI18n();
  const stats = t.story.stats.items;
  const sectionReveal = useReveal(0.15);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(stats.length).fill(false));

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
        { threshold: 0.3 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section className="relative py-20 px-6 md:py-24 md:px-12 bg-[var(--bk)] border-t border-white/[.06]">
      {/* Subtle radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(220,175,100,.04) 0%, transparent 70%)" }}
      />

      {/* Header */}
      <div
        ref={sectionReveal.ref}
        className="text-center mb-14 md:mb-16"
        style={{
          opacity: sectionReveal.visible ? 1 : 0,
          transform: sectionReveal.visible ? "none" : "translateY(20px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)]">{t.story.stats.header}</span>
      </div>

      {/* Row 1 — 3 main stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-4 max-w-[900px] mx-auto">
        {stats.slice(0, 3).map((s, i) => {
          const visible = visibleItems[i];
          const isHero = i === 1; // #1 Mejor Club
          return (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className={`text-center ${isHero ? "col-span-2 md:col-span-1 order-first md:order-none" : ""}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px) scale(0.97)",
                transition: `all .8s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <div className={`relative inline-block ${isHero ? "mb-3" : ""}`}>
                <Counter
                  val={typeof s.val === "number" ? s.val : 0} prefix={s.prefix} suffix={s.suffix} label={s.label}
                  className={`font-bold j3-grad-text leading-[1] block mb-2 ${
                    isHero ? "text-[clamp(52px,6vw,80px)]" : "text-[clamp(36px,4vw,56px)]"
                  }`}
                />
                {isHero && (
                  <div className="absolute -inset-8 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,175,100,.06) 0%, transparent 70%)" }} />
                )}
              </div>
              <span className={`text-[10px] font-light tracking-[2px] uppercase leading-[1.6] whitespace-pre-line block ${
                isHero ? "text-[var(--gy2)]" : "text-[var(--gy2)]"
              }`}>{s.lbl}</span>
            </div>
          );
        })}
      </div>

      {/* Subtle divider */}
      <div className="flex items-center justify-center gap-3 my-10 md:my-12">
        <span className="h-px w-12 bg-[var(--g1)]/20" />
        <span className="w-1 h-1 rounded-full bg-[var(--g1)]/30" />
        <span className="h-px w-12 bg-[var(--g1)]/20" />
      </div>

      {/* Row 2 — 2 secondary stats */}
      <div className="grid grid-cols-2 gap-x-4 max-w-[500px] mx-auto">
        {stats.slice(3).map((s, i) => {
          const idx = i + 3;
          const visible = visibleItems[idx];
          return (
            <div
              key={idx}
              ref={el => { itemRefs.current[idx] = el; }}
              className="text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `all .8s cubic-bezier(.16,1,.3,1) ${idx * 0.12}s`,
              }}
            >
              <Counter val={typeof s.val === "number" ? s.val : 0} prefix={s.prefix} suffix={s.suffix} label={s.label}
                className="font-bold j3-grad-text/70 leading-[1] block mb-2 text-[clamp(28px,3.5vw,46px)]"
              />
              <span className="text-[10px] font-light text-[var(--gy2)] tracking-[2px] uppercase leading-[1.6] whitespace-pre-line block">{s.lbl}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── TIMELINE SECTION (scroll-driven) ───────── */

function TimelineSection() {
  const { t } = useI18n();
  const timeline = t.story.timeline.entries;
  const eras = t.story.timeline.eras;
  // Map era indices: entry 0→era[0], entry 3→era[1], entry 6→era[2], entry 12→era[3]
  const eraMap: Record<number, string> = { 0: eras[0], 3: eras[1], 6: eras[2], 12: eras[3] };

  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inView, setInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(timeline.length).fill(false));
  const headerReveal = useReveal(0.2);

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
        { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  useEffect(() => {
    function handleScroll() {
      const section = sectionRef.current;
      if (!section) return;
      const wH = window.innerHeight;
      const sRect = section.getBoundingClientRect();

      // Is timeline in view? Combine section + last item checks
      const lastEl = itemRefs.current[timeline.length - 1];
      const lastRect = lastEl?.getBoundingClientRect();
      // Hide when the last item's TOP has scrolled above the viewport center
      const lastItemPassed = lastRect ? lastRect.top < wH * 0.35 : sRect.bottom < wH;
      setInView(sRect.top < wH * 0.5 && !lastItemPassed);

      // Calculate scroll progress through the timeline
      const firstEl = itemRefs.current[0];
      if (firstEl && lastEl) {
        const start = firstEl.getBoundingClientRect().top;
        const end = lastEl.getBoundingClientRect().bottom;
        const total = end - start;
        const scrolled = wH * 0.5 - start;
        setScrollProgress(Math.max(0, Math.min(1, scrolled / total)));
      }

      // Find active item (last one past viewport center)
      let active = -1;
      for (let i = 0; i < timeline.length; i++) {
        const el = itemRefs.current[i];
        if (el && el.getBoundingClientRect().top < wH * 0.55) {
          active = i;
        }
      }
      setActiveIndex(active);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [timeline.length]);

  return (
    <section ref={sectionRef} className="relative px-4 sm:px-6 md:px-12 pb-[72px] md:pb-[100px] overflow-hidden">
      {/* Mini-map — desktop only */}
      <div
        className="hidden min-[800px]:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-[6px] pointer-events-none"
        style={{ opacity: inView ? 1 : 0, transition: "opacity .4s ease" }}
      >
        {timeline.map((item, i) => {
          const isPast = i <= activeIndex;
          const isActive = i === activeIndex;
          const isHL = item.highlight;
          const era = eraMap[i];
          return (
            <div key={i} className="flex items-center gap-2">
              <div
                className={`rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-[10px] h-[10px] bg-[var(--g1)]"
                    : isPast
                      ? `${isHL ? "w-[7px] h-[7px]" : "w-[5px] h-[5px]"} bg-[var(--g1)]/60`
                      : `${isHL ? "w-[7px] h-[7px]" : "w-[5px] h-[5px]"} bg-white/[.12]`
                }`}
                style={{
                  boxShadow: isActive ? "0 0 10px rgba(220,175,100,.5)" : "none",
                }}
              />
              {/* Show era label next to first dot of each era */}
              {era && isActive && (
                <span className="text-[8px] font-bold tracking-[2px] uppercase text-[var(--g1)]/70 whitespace-nowrap">{era}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile progress HUD — sticky bar + era pill */}
      {(() => {
        // Find current era from active item
        let currentEra = "";
        let currentYear = "";
        if (activeIndex >= 0) {
          currentYear = timeline[activeIndex].year;
          for (let j = activeIndex; j >= 0; j--) {
            if (eraMap[j]) { currentEra = eraMap[j]; break; }
          }
        }
        return (
          <div
            className="min-[800px]:hidden fixed top-[52px] left-0 right-0 z-50 pointer-events-none"
            style={{ opacity: inView ? 1 : 0, transition: "opacity .4s ease" }}
          >
            <div className="bg-[var(--bk2)] border-b border-white/[.06] backdrop-blur-md">
              {/* Progress bar */}
              <div className="h-[3px] w-full bg-white/[.06]">
                <div
                  className="h-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)]"
                  style={{ width: `${scrollProgress * 100}%`, transition: "width .15s linear" }}
                />
              </div>
              {/* Era + year */}
              {activeIndex >= 0 && (
                <div className="flex items-center justify-between px-4 py-[6px]">
                  <span className="text-[8px] font-bold tracking-[3px] uppercase text-[var(--g1)]/80">{currentEra}</span>
                  <span className="text-[10px] font-bold tracking-[2px] text-[var(--wh)]/70">{currentYear}</span>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Header */}
      <div
        ref={headerReveal.ref}
        className="pt-20 pb-[60px] max-[640px]:pt-14 max-[640px]:pb-10"
        style={{
          opacity: headerReveal.visible ? 1 : 0,
          transform: headerReveal.visible ? "none" : "translateY(30px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[640px]:text-[9px] max-[640px]:tracking-[3px]">{t.story.timeline.sectionLabel}</span>
        <h2 className="font-bold text-[clamp(28px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
          {t.story.timeline.heading1} <span className="j3-grad-text">{t.story.timeline.heading2}</span>
        </h2>
      </div>

      <div ref={trackRef} className="relative pl-8 max-[640px]:pl-4 w-full break-words">
        {/* Track line */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[rgba(220,175,100,.2)] to-transparent" />

        {timeline.map((item, i) => {
          const isHL = item.highlight;
          const visible = visibleItems[i];
          const era = eraMap[i];
          return (
            <div key={i} ref={el => { itemRefs.current[i] = el; }}>
              {/* Era separator */}
              {era && (
                <div className="relative pl-12 pb-5 pt-6 max-[640px]:pl-5">
                  <div className="flex items-center gap-3 max-[640px]:gap-2">
                    <span className="h-px w-6 bg-[var(--g1)]/25 max-[640px]:w-4" />
                    <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)]/70 max-[640px]:text-[8px] max-[640px]:tracking-[2.5px]">{era}</span>
                    <span className="h-px flex-1 bg-[var(--g1)]/10" />
                  </div>
                </div>
              )}
              <div
                className={`relative pl-12 max-[640px]:pl-5 min-w-0 group ${
                  isHL
                    ? "pb-10 mb-4 ml-[-1px] border-l-[2px] border-[rgba(220,175,100,.25)] bg-gradient-to-r from-[rgba(220,175,100,.04)] to-transparent rounded-r-lg pr-6 pt-6 max-[640px]:pr-2 max-[640px]:pt-4 max-[640px]:pb-7"
                    : "pb-12 max-[640px]:pb-8 max-[640px]:pr-1"
                }`}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "none" : `translateY(${isHL ? "30" : "20"}px) ${isHL ? "scale(.97)" : ""}`,
                  transition: `all .8s cubic-bezier(.16,1,.3,1) ${(i % 2) * 0.06}s`,
                }}
              >
                {/* Dot */}
                <div
                  className={`absolute rounded-full transition-all duration-700 ${
                    isHL
                      ? `left-[-8px] max-[640px]:left-[-7px] w-[15px] h-[15px] max-[640px]:w-[12px] max-[640px]:h-[12px] border-[2px] border-[var(--g1)] ${visible ? "bg-[var(--g1)] scale-100" : "bg-[var(--bk)] scale-0"}`
                      : `left-[-4px] max-[640px]:left-[-4px] w-[9px] h-[9px] max-[640px]:w-[7px] max-[640px]:h-[7px] border-[1.5px] border-[var(--g1)]/60 ${visible ? "bg-[var(--g1)]/40 scale-100" : "bg-[var(--bk)] scale-0"}`
                  }`}
                  style={{
                    top: isHL ? "30px" : "6px",
                    boxShadow: isHL && visible ? "0 0 14px rgba(220,175,100,.5)" : "none",
                  }}
                />
                <span className={`text-[11px] font-bold tracking-[3px] uppercase mb-2 block max-[640px]:text-[10px] max-[640px]:tracking-[2px] max-[640px]:mb-1 ${isHL ? "text-[var(--g1)]" : "text-[var(--g1)]/80"}`}>{item.year}</span>
                <h3 className={`font-bold uppercase tracking-[-0.5px] leading-[1.1] mb-[10px] max-[640px]:mb-[6px] ${
                  isHL ? "text-[clamp(18px,3vw,32px)]" : "text-[clamp(16px,2.5vw,26px)] text-[var(--gy3)]"
                }`}>
                  {isHL ? <span className="j3-grad-text">{item.title}</span> : item.title}
                </h3>
                <p className={`font-light leading-[1.75] max-w-[620px] max-[640px]:leading-[1.6] ${isHL ? "text-[15px] max-[640px]:text-[13px] text-[var(--gy2)]" : "text-[13px] max-[640px]:text-[12px] text-[var(--gy)]"}`}>{item.desc}</p>
                {item.badge && (
                  <span className={`inline-block text-[9px] max-[640px]:text-[8px] font-bold tracking-[2px] max-[640px]:tracking-[1.5px] uppercase px-3 max-[640px]:px-2.5 py-1 rounded-full mt-3 max-[640px]:mt-2 ${
                    isHL
                      ? "bg-[rgba(220,175,100,.1)] border border-[rgba(220,175,100,.35)] text-[var(--g1)]"
                      : "border border-[rgba(220,175,100,.2)] text-[var(--g1)]/80"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── PLAYER CARD ───────── */

/* ── Hero player card — large, prominent ── */
function HeroPlayerCard({ p, index }: { p: { first: string; last: string; info: string; tag: string }; index: number }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="relative p-8 max-[640px]:p-5 border border-white/[.07] bg-gradient-to-br from-[var(--bk2)] to-[var(--bk)] group/hero overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all .7s cubic-bezier(.16,1,.3,1) ${index * 0.12}s`,
      }}
    >
      {/* subtle gold accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--g1)] via-[var(--g2)] to-transparent opacity-40 group-hover/hero:opacity-70 transition-opacity" />
      <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/70 block mb-4">{p.tag}</span>
      <h4 className="font-bold text-[clamp(28px,3.5vw,42px)] uppercase tracking-[-1px] leading-[1] mb-3">
        <span className="j3-grad-text">{p.first}</span>
        <br />
        <span className="text-[var(--wh)]">{p.last}</span>
      </h4>
      <p className="text-[13px] font-light text-[var(--gy2)] leading-[1.7] max-w-[320px]">{p.info}</p>
    </div>
  );
}

/* ── Next-gen player row — compact, clean ── */
function NextGenRow({ p, index }: { p: { first: string; last: string; tag: string }; index: number }) {
  const { ref, visible } = useReveal(0.05);
  return (
    <div
      ref={ref}
      className="flex items-center justify-between py-[14px] border-b border-white/[.06] group/ng"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(-15px)",
        transition: `all .5s cubic-bezier(.16,1,.3,1) ${index * 0.04}s`,
      }}
    >
      <div className="flex items-baseline gap-3 min-w-0">
        <h4 className="font-bold text-[16px] max-[640px]:text-[14px] uppercase tracking-[-0.3px] leading-[1] whitespace-nowrap">
          <span className="j3-grad-text">{p.first}</span> <span className="text-[var(--wh)]/80">{p.last}</span>
        </h4>
      </div>
      <span className="text-[8px] font-bold tracking-[2px] uppercase text-[var(--gy)] whitespace-nowrap ml-4 group-hover/ng:text-[var(--g1)]/80 transition-colors">
        {p.tag}
      </span>
    </div>
  );
}

/* ── Featured collaboration card — mid-size, achievement focused ── */
function FeaturedCollab({ p, index }: { p: { first: string; last: string; info: string; tag: string }; index: number }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="p-5 max-[640px]:p-4 border border-white/[.05] bg-[var(--bk2)] group/fc"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
        transition: `all .5s cubic-bezier(.16,1,.3,1) ${index * 0.08}s`,
      }}
    >
      <h4 className="font-bold text-[18px] max-[640px]:text-[16px] uppercase tracking-[-0.3px] leading-[1.1] mb-2">
        <span className="j3-grad-text">{p.first}</span> <span className="text-[var(--wh)]/80">{p.last}</span>
      </h4>
      <p className="text-[11px] font-light text-[var(--gy2)] leading-[1.6] mb-3">{p.info}</p>
      <span className="text-[8px] font-bold tracking-[2px] uppercase text-[var(--g1)]/70">{p.tag}</span>
    </div>
  );
}

/* ── Shared player tag — subtle inline name ── */
function SharedPlayerTag({ p, index }: { p: { first: string; last: string; tag: string }; index: number }) {
  const { ref, visible } = useReveal(0.05);
  return (
    <span
      ref={ref}
      className="inline-flex items-baseline gap-2 group/sh"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(8px)",
        transition: `all .4s cubic-bezier(.16,1,.3,1) ${index * 0.03}s`,
      }}
    >
      <span className="font-bold text-[14px] max-[640px]:text-[12px] uppercase tracking-[-0.3px] text-[var(--wh)]/70 group-hover/sh:text-[var(--wh)]/80 transition-colors">
        {p.first} {p.last}
      </span>
      <span className="text-[8px] font-bold tracking-[1.5px] uppercase text-[var(--gy)]/70">{p.tag}</span>
    </span>
  );
}

/* ── Team member card ── */
function TeamCard({ m, index }: { m: { num: string; role: string; first: string; last: string; bio: string; quote: string }; index: number }) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className="bg-[var(--bk3)] p-14 max-[960px]:p-10 max-[640px]:p-6 relative overflow-hidden transition-colors hover:bg-[#161616] group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateX(${index === 0 ? "-40" : "40"}px)`,
        transition: `all .8s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
      }}
    >
      <span className="absolute top-8 right-10 max-[640px]:top-4 max-[640px]:right-4 font-bold text-[80px] max-[640px]:text-[60px] text-white/[.03] leading-[1] tracking-[-3px] transition-all duration-700 group-hover:text-white/[.06] group-hover:scale-110">{m.num}</span>
      <span className="text-[10px] font-normal tracking-[4px] uppercase text-[var(--g1)] mb-4 block">{m.role}</span>
      <h3 className="font-bold text-[clamp(28px,4vw,52px)] uppercase tracking-[-1.5px] leading-[.92] mb-5">
        <span className="j3-grad-text">{m.first}</span>
        <span className="text-[var(--wh)]"> {m.last}</span>
      </h3>
      <p className="text-[14px] max-[640px]:text-[13px] font-light text-[var(--gy2)] leading-[1.8] max-w-[420px] mb-7">{m.bio}</p>
      <blockquote className="text-[18px] max-[640px]:text-[16px] font-bold italic text-[var(--wh)] leading-[1.4] border-l-2 border-[var(--g1)] pl-5 opacity-85 transition-all group-hover:pl-7">
        &ldquo;{m.quote}&rdquo;
      </blockquote>
    </div>
  );
}

/* ── Higuerón hero + lesson aside ── */
function HigueronHero() {
  const { t } = useI18n();
  const clubHero = t.story.clubs.heroClub;
  const clubLesson = t.story.clubs.lesson;
  const heroReveal = useReveal(0.1);
  const lessonReveal = useReveal(0.1);
  return (
    <>
      {/* J3Padel Indoor — small aside */}
      <div
        ref={lessonReveal.ref}
        className="flex items-center max-[640px]:flex-col max-[640px]:items-start gap-4 max-[640px]:gap-1 my-6 py-4 px-5 max-[640px]:px-4 border-l-2 border-white/[.06]"
        style={{
          opacity: lessonReveal.visible ? 1 : 0,
          transform: lessonReveal.visible ? "none" : "translateX(-10px)",
          transition: "all .5s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[3px] uppercase text-[var(--gy)]/70 whitespace-nowrap">{clubLesson.flag}</span>
        <span className="text-[13px] font-light text-[var(--gy)]/80">{clubLesson.name} — {t.story.clubs.lessonAside}</span>
      </div>

      {/* Higuerón — hero card */}
      <div
        ref={heroReveal.ref}
        className="relative p-10 max-[640px]:p-6 border border-white/[.07] bg-gradient-to-br from-[var(--bk2)] to-[var(--bk)] overflow-hidden"
        style={{
          opacity: heroReveal.visible ? 1 : 0,
          transform: heroReveal.visible ? "none" : "translateY(30px) scale(.98)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        {/* Gold accent top */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--g1)] via-[var(--g2)] to-transparent opacity-50" />
        {/* Subtle large number background */}
        <span className="absolute top-4 right-6 max-[640px]:right-4 text-[clamp(80px,12vw,140px)] font-bold leading-[1] text-white/[.03] tracking-[-4px] select-none pointer-events-none">{clubHero.years}</span>

        <div className="relative z-10">
          <span className="text-[10px] font-normal tracking-[3px] uppercase text-[var(--g1)]/80 mb-4 block">{clubHero.flag}</span>
          <h3 className="font-bold text-[clamp(28px,4vw,48px)] uppercase tracking-[-1.5px] leading-[1] mb-4">
            <span className="j3-grad-text">Reserva del</span><br />
            <span className="text-[var(--wh)]">Higuerón</span>
          </h3>
          <p className="text-[14px] font-light text-[var(--gy2)] leading-[1.8] max-w-[560px] mb-5">{clubHero.detail}</p>
          <span className="inline-block text-[9px] max-[640px]:text-[8px] font-bold tracking-[2px] max-[640px]:tracking-[1px] uppercase px-3 py-[5px] rounded-full bg-[rgba(220,175,100,.1)] text-[var(--g1)] border border-[rgba(220,175,100,.25)]">{clubHero.highlight}</span>
        </div>
      </div>
    </>
  );
}

/* ── Club card — standard size ── */
function ClubCard({ c, index }: { c: { flag: string; name: string; detail: string; highlight?: string }; index: number }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <div
      ref={ref}
      className="bg-[var(--bk)] p-8 max-[640px]:p-5 border border-white/[.05] group/club"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: `all .6s cubic-bezier(.16,1,.3,1) ${index * 0.1}s`,
      }}
    >
      <span className="text-[10px] font-normal tracking-[3px] uppercase text-[var(--g1)]/80 mb-3 block">{c.flag}</span>
      <h4 className="font-bold text-[20px] max-[640px]:text-[18px] uppercase tracking-[-0.5px] leading-[1.1] mb-2 group-hover/club:text-[var(--g1)] transition-colors">{c.name}</h4>
      <p className="text-[12px] font-light text-[var(--gy2)] leading-[1.6]">{c.detail}</p>
      {c.highlight && (
        <span className="inline-block text-[9px] max-[640px]:text-[8px] font-bold tracking-[1.5px] max-[640px]:tracking-[1px] uppercase px-[10px] py-[3px] rounded-full bg-[rgba(220,175,100,.08)] text-[var(--g1)] border border-[rgba(220,175,100,.2)] mt-3">{c.highlight}</span>
      )}
    </div>
  );
}

/* ── Pillar item — filosofía section ── */
function PillarItem({ p, index }: { p: { num: string; label: string; title: string; body: string }; index: number }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div
      ref={ref}
      className={`py-7 border-b border-white/[.07] ${index === 0 ? "border-t" : ""}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateX(40px)",
        transition: `all .7s cubic-bezier(.16,1,.3,1) ${index * 0.12}s`,
      }}
    >
      <span className="text-[10px] font-bold tracking-[3px] text-[var(--g1)] uppercase mb-2 block">{p.num} — {p.label}</span>
      <h4 className="font-bold text-[22px] uppercase tracking-[-0.5px] mb-2">{p.title}</h4>
      <p className="text-[13px] font-light text-[var(--gy2)] leading-[1.7]">{p.body}</p>
    </div>
  );
}

/* ───────── STORY IMPACT (scroll-driven statement) ───────── */

function StoryImpact() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleScroll() {
      const rect = container!.getBoundingClientRect();
      const windowH = window.innerHeight;
      const totalH = container!.scrollHeight;
      // scrolled = how far into the section we are (0 when top hits viewport bottom)
      const scrolled = -rect.top;
      // animRange = total scrollable distance within sticky section
      const animRange = totalH - windowH;
      setProgress(Math.max(0, Math.min(1, scrolled / animRange)));
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Phase 1 (0-30%): Main quote line 1
  const p1 = Math.min(1, progress / 0.3);
  // Phase 2 (25-55%): Main quote line 2 (gold)
  const p2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.3));
  // Phase 3 (55-80%): Gold line + supporting text
  const p3 = Math.max(0, Math.min(1, (progress - 0.55) / 0.25));
  // Phase 4 (75-100%): Tagline details
  const p4 = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  const canteraLines = t.story.impact.cantera;
  const canteraDelays = [0.25, 0.30, 0.35, 0.40, 0.40];

  return (
    <div ref={containerRef} className="relative bg-[var(--bk)] -mt-[12vh]" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(220,175,100,${0.04 * p3}) 0%, transparent 70%)` }}
        />

        <div className="w-full max-w-[1100px] px-12 max-[960px]:px-6 text-center">
          {/* Line 1 */}
          <span
            className="block font-bold text-[clamp(32px,4.5vw,58px)] max-[960px]:text-[clamp(26px,7vw,52px)] uppercase tracking-[-2px] leading-[1.05] text-[var(--wh)]"
            style={{
              opacity: p1,
              transform: `translateY(${(1 - p1) * 60}px)`,
              filter: `blur(${(1 - p1) * 6}px)`,
            }}
          >
            {t.story.impact.line1}
          </span>

          {/* Line 2 — gold */}
          <span
            className="block font-bold text-[clamp(32px,4.5vw,58px)] max-[960px]:text-[clamp(22px,6vw,52px)] uppercase tracking-[-2px] leading-[1.05] j3-grad-text mt-1"
            style={{
              opacity: p2,
              transform: `translateY(${(1 - p2) * 60}px)`,
              filter: `blur(${(1 - p2) * 6}px)`,
            }}
          >
            {t.story.impact.line2}
          </span>

          {/* Gold accent line */}
          <div className="flex justify-center mt-10">
            <div
              className="h-px bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent"
              style={{ width: `${p3 * 100}%`, maxWidth: "320px", opacity: p3 * 0.6 }}
            />
          </div>

          {/* Block 1 — headline facts */}
          <div className="mt-10 flex flex-col items-center gap-[2px]">
            {[
              { text: t.story.impact.fact1, delay: 0 },
              { text: t.story.impact.fact2, delay: 0.07, accent: true },
            ].map((line, i) => {
              const lineP = Math.max(0, Math.min(1, (p3 - line.delay) / 0.45));
              return (
                <span
                  key={i}
                  className={`block py-[4px] text-[clamp(13px,1.5vw,17px)] tracking-[0.3px] leading-[1.5] ${
                    line.accent ? "font-medium text-[var(--g1)]" : "font-light text-[var(--gy2)]"
                  }`}
                  style={{
                    opacity: lineP,
                    transform: `translateY(${(1 - lineP) * 14}px)`,
                    filter: `blur(${(1 - lineP) * 3}px)`,
                  }}
                >
                  {line.text}
                </span>
              );
            })}
            {/* Closer block 1 */}
            {(() => {
              const closeP = Math.max(0, Math.min(1, (p3 - 0.12) / 0.4));
              return (
                <span
                  className="block mt-3 font-bold text-[clamp(16px,2vw,22px)] text-[var(--wh)] italic tracking-[-0.3px]"
                  style={{
                    opacity: closeP,
                    transform: `translateY(${(1 - closeP) * 18}px) scale(${0.97 + closeP * 0.03})`,
                    filter: `blur(${(1 - closeP) * 4}px)`,
                  }}
                >
                  {t.story.impact.closer}
                </span>
              );
            })()}
          </div>

          {/* Separator */}
          {(() => {
            const sepP = Math.max(0, Math.min(1, (p3 - 0.2) / 0.3));
            return (
              <div className="flex items-center justify-center gap-3 mt-8" style={{ opacity: sepP * 0.5 }}>
                <span className="h-px bg-gradient-to-r from-transparent to-[var(--g1)]" style={{ width: `${sepP * 40}px` }} />
                <span className="text-[8px] font-bold tracking-[4px] uppercase text-[var(--g1)]">{t.story.impact.proudLabel}</span>
                <span className="h-px bg-gradient-to-l from-transparent to-[var(--g1)]" style={{ width: `${sepP * 40}px` }} />
              </div>
            );
          })()}

          {/* Block 2 — cantera */}
          <div className="mt-5 flex flex-col items-center gap-[2px]">
            {canteraLines.map((text, i) => {
              const lineP = Math.max(0, Math.min(1, (p3 - canteraDelays[i]) / 0.4));
              return (
                <span
                  key={i}
                  className="block py-[3px] text-[clamp(12px,1.3vw,15px)] font-light text-[var(--gy)] tracking-[0.3px] leading-[1.55]"
                  style={{
                    opacity: lineP * 0.8,
                    transform: `translateY(${(1 - lineP) * 12}px)`,
                    filter: `blur(${(1 - lineP) * 3}px)`,
                  }}
                >
                  {text}
                </span>
              );
            })}
          </div>

          {/* Tagline with decorative lines */}
          <div
            className="flex items-center justify-center gap-4 mt-8"
            style={{ opacity: Math.max(0, (p4 - 0.3) / 0.7) }}
          >
            <span className="w-8 h-px bg-[var(--g1)]" style={{ opacity: 0.2 }} />
            <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--gy)]">
              {t.story.impact.historyLabel}
            </span>
            <span className="w-8 h-px bg-[var(--g1)]" style={{ opacity: 0.2 }} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────── PAGE ───────── */

export default function StoryPage() {
  const { t } = useI18n();

  /* Hero parallax */
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroY, setHeroY] = useState(0);
  const [heroOp, setHeroOp] = useState(1);
  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setHeroY(y * 0.4);
      setHeroOp(Math.max(0, 1 - y / 600));
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  /* Section reveals */
  const equipoHeader = useReveal(0.15);
  const jugadoresHeader = useReveal(0.15);
  const filHeader = useReveal(0.15);
  const clubesHeader = useReveal(0.15);
  const ctaReveal = useReveal(0.2);
  const marcasReveal = useReveal(0.2);

  /* Parallax for filosofia */
  const filParallax = useParallax();

  /* Dictionary data */
  const team = t.story.team.members;
  const pillars = t.story.philosophy.pillars;
  const clubOrigin = t.story.clubs.origins;
  const clubPresent = t.story.clubs.present;

  return (
    <main className="bg-[var(--bk)] text-[var(--wh)] font-sans w-full">
      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen min-h-[580px] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('https://j3padel.com/images/hero.jpeg')] bg-center bg-cover scale-110"
          style={{ transform: `translateY(${heroY}px) scale(1.1)`, opacity: 0.28 }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />
        <div
          className="relative z-10 px-12 pb-[72px] max-[960px]:px-6 max-[960px]:pb-14 w-full"
          style={{ opacity: heroOp, transform: `translateY(${-heroY * 0.2}px)` }}
        >
          <h1 className="font-bold uppercase tracking-[-3px] overflow-visible">
            <span className="text-[clamp(24px,3.5vw,48px)] max-[960px]:text-[clamp(20px,6vw,36px)] font-light text-[var(--gy2)] tracking-[1px] block mb-0 animate-[fadeInSoft_.9s_.2s_ease_both]">{t.story.hero.prefix}</span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] j3-grad-text block animate-[clipRevealUp_.9s_.5s_cubic-bezier(.16,1,.3,1)_both] leading-[1.15] -mb-[0.08em]">{t.story.hero.years}</span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] text-[var(--wh)] block animate-[slideFromLeft_.8s_.85s_cubic-bezier(.16,1,.3,1)_both] leading-[.92]">{t.story.hero.dentro}</span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] j3-stroke-gold block animate-[slideFromRight_.8s_1.1s_cubic-bezier(.16,1,.3,1)_both] leading-[.92]">{t.story.hero.delJuego}</span>
          </h1>
          <div className="mt-10 animate-[fadeInSoft_.8s_1.5s_ease_both] flex items-start gap-5">
            <span className="w-px h-[72px] bg-gradient-to-b from-[var(--g1)] to-[var(--g1)]/0 mt-1 shrink-0" />
            <div className="leading-[1.35]">
              <span className="text-[clamp(16px,2vw,24px)] font-light text-[var(--gy2)] uppercase tracking-[1px]">{t.story.hero.sub1}</span>
              <br />
              <span className="text-[clamp(20px,2.5vw,32px)] font-bold text-[var(--wh)] italic tracking-[-0.5px]">{t.story.hero.sub2}</span>
              <span className="text-[clamp(16px,2vw,24px)] font-light text-[var(--gy2)] tracking-[-0.3px] whitespace-nowrap"> {t.story.hero.sub3}</span>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/80">{t.story.hero.desde}</span>
                <span className="w-4 h-px bg-[var(--g1)]/25" />
                <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/80">{t.story.hero.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATEMENT (scroll-driven like ImpactSection) ─── */}
      <StoryImpact />

      {/* ─── TIMELINE ─── */}
      <TimelineSection />

      {/* ─── STATS ─── */}
      <StatsSection />

      {/* ─── EQUIPO ─── */}
      <section className="bg-[var(--bk2)] py-[100px] px-12 max-[960px]:py-[72px] max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.07]">
        <div
          ref={equipoHeader.ref}
          className="max-w-[580px] mb-[72px]"
          style={{
            opacity: equipoHeader.visible ? 1 : 0,
            transform: equipoHeader.visible ? "none" : "translateY(30px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block">{t.story.team.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.team.heading1}<br /><span className="j3-grad-text">{t.story.team.heading2}</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-[2px] max-[960px]:grid-cols-1">
          {team.map((m, i) => <TeamCard key={m.num} m={m} index={i} />)}
        </div>
      </section>

      {/* ─── JUGADORES ─── */}
      <section className="py-[100px] px-12 max-[960px]:py-[72px] max-[960px]:px-6 max-[640px]:px-4">
        {/* Header */}
        <div
          ref={jugadoresHeader.ref}
          className="max-w-[580px] mb-16 max-[640px]:mb-10"
          style={{
            opacity: jugadoresHeader.visible ? 1 : 0,
            transform: jugadoresHeader.visible ? "none" : "translateY(30px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block">{t.story.players.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.players.heading1}<br /><span className="j3-grad-text">{t.story.players.heading2}</span>
          </h2>
          <p className="text-[14px] font-light text-[var(--gy2)] leading-[1.8] mt-4">
            {t.story.players.description}
          </p>
        </div>

        {/* ── Tier 1: Hero players — top mundial ── */}
        <p className="text-[10px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--g1)]/80 mb-5">{t.story.players.heroLabel}</p>
        <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-3 mb-14">
          {playersHero.map((p, i) => <HeroPlayerCard key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 2: Next gen — de la cantera al circuito ── */}
        <p className="text-[10px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-2">{t.story.players.nextGenLabel}</p>
        <div className="max-w-[700px] mb-16">
          {playersNextGen.map((p, i) => <NextGenRow key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 2b: Next gen → circuito pro ── */}
        <p className="text-[10px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-2">{t.story.players.nextGenProLabel}</p>
        <div className="max-w-[700px] mb-16">
          {playersNextGenPro.map((p, i) => <NextGenRow key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 3: Featured pro collaborations ── */}
        <div className="border-t border-white/[.06] pt-10 mb-10">
          <p className="text-[10px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-5">{t.story.players.featuredLabel}</p>
          <div className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-3">
            {playersFeatured.map((p, i) => (
              <FeaturedCollab key={i} p={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Tier 4: Rest of shared circuit — subtle ── */}
        <div className="border-t border-white/[.06] pt-8">
          <p className="text-[10px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)]/70 mb-5">{t.story.players.sharedLabel}</p>
          <div className="flex flex-wrap gap-x-6 gap-y-3 max-[640px]:gap-x-4 max-[640px]:gap-y-2">
            {playersShared.map((p, i) => <SharedPlayerTag key={i} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── FILOSOFIA ─── */}
      <section className="bg-[var(--bk2)] py-[100px] px-12 max-[960px]:py-[72px] max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.07] overflow-hidden">
        <div
          ref={(el) => { (filHeader.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; (filParallax.ref as React.MutableRefObject<HTMLDivElement | null>).current = el; }}
          className="grid grid-cols-2 gap-20 max-w-[1200px] items-start max-[960px]:grid-cols-1 max-[960px]:gap-12"
        >
          <div
            style={{
              opacity: filHeader.visible ? 1 : 0,
              transform: filHeader.visible ? `translateY(${filParallax.offset * 0.3}px)` : "translateY(60px)",
              transition: "opacity .9s cubic-bezier(.16,1,.3,1), transform .9s cubic-bezier(.16,1,.3,1)",
            }}
          >
            <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block">{t.story.philosophy.label}</span>
            <h2 className="font-bold text-[clamp(40px,6vw,80px)] uppercase tracking-[-2px] leading-[.88] mb-8">
              <span className="j3-grad-text">{t.story.philosophy.word1}</span><br />
              <span className="j3-stroke">{t.story.philosophy.word2}</span><br />
              <span className="j3-stroke">{t.story.philosophy.word3}</span>
            </h2>
            <p className="text-[16px] font-light text-[var(--gy2)] leading-[1.8] max-w-[480px]">
              {t.story.philosophy.body}
            </p>
          </div>

          <div className="flex flex-col">
            {pillars.map((p, i) => <PillarItem key={i} p={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* ─── CLUBES ─── */}
      <section className="py-[100px] px-12 max-[960px]:py-[72px] max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.07]">
        <div
          ref={clubesHeader.ref}
          className="max-w-[520px] mb-16 max-[640px]:mb-10"
          style={{
            opacity: clubesHeader.visible ? 1 : 0,
            transform: clubesHeader.visible ? "none" : "translateY(30px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block">{t.story.clubs.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.clubs.heading1}<br /><span className="j3-grad-text">{t.story.clubs.heading2}</span>
          </h2>
          <p className="text-[14px] font-light text-[var(--gy2)] leading-[1.8] mt-4">
            {t.story.clubs.description}
          </p>
        </div>

        {/* ── Origins: Ocean Padel + Belife ── */}
        <p className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--gy)]/80 mb-4">{t.story.clubs.originLabel}</p>
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-3 mb-4">
          {clubOrigin.map((c, i) => <ClubCard key={i} c={c} index={i} />)}
        </div>

        {/* ── Lesson: J3Padel Indoor — subtle aside ── */}
        <HigueronHero />

        {/* ── Present: Finura + Vals ── */}
        <p className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--gy)]/80 mb-4 mt-12">{t.story.clubs.presentLabel}</p>
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-3">
          {clubPresent.map((c, i) => <ClubCard key={i} c={c} index={i} />)}
        </div>
      </section>

      {/* ─── MARCAS ─── */}
      <section className="bg-white py-14 px-14 max-[960px]:px-6 max-[960px]:py-10 max-[640px]:px-4 border-t border-black/[.06]">
        <div
          ref={marcasReveal.ref}
          style={{
            opacity: marcasReveal.visible ? 1 : 0,
            transform: marcasReveal.visible ? "none" : "translateY(20px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[3px] uppercase text-black/60 text-center mb-10 block">{t.story.brands.currentLabel}</span>
          <div className="flex items-center justify-center gap-16 mb-10 flex-wrap">
            <span className="font-bold text-[clamp(18px,2.5vw,32px)] uppercase text-black/60 tracking-[1px]">Technifibre</span>
            <span className="font-bold text-[clamp(18px,2.5vw,32px)] uppercase text-black/60 tracking-[1px]">Lacoste</span>
          </div>
          <div className="w-full h-px bg-black/[.08] my-8" />
          <p className="text-[10px] font-normal tracking-[3px] uppercase text-black/55 text-center mb-5">{t.story.brands.pastLabel}</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {brandsPast.map((b, i) => (
              <span key={i}>
                {i > 0 && <span className="text-black/15 text-[18px] mr-8">·</span>}
                <span className="font-bold text-[clamp(13px,1.8vw,20px)] uppercase text-black/[.45] tracking-[0.5px] hover:text-black/65 transition-colors">{b}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section className="bg-[var(--bk2)] border-t border-white/[.07] py-[140px] px-12 max-[960px]:py-[80px] max-[960px]:px-6 max-[640px]:px-4 flex flex-col items-center text-center">
        <div
          ref={ctaReveal.ref}
          className="max-w-[680px]"
          style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(40px)",
            transition: "all .9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--gy)]/70 mb-6 block">{t.story.cta.label}</span>
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-6">
            {t.story.cta.heading1}<br /><span className="j3-grad-text">{t.story.cta.heading2}</span>
          </h2>
          <p className="text-[16px] font-light text-[var(--gy2)] leading-[1.8] mb-10 max-w-[520px] mx-auto">
            {t.story.cta.body}
          </p>
        </div>
        <div
          className="flex gap-3 flex-wrap justify-center"
          style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(30px)",
            transition: "all .9s cubic-bezier(.16,1,.3,1) .2s",
          }}
        >
          <a href="/#contacto" className="text-[12px] font-bold tracking-[2px] uppercase px-[30px] py-[13px] rounded-full bg-[image:var(--j3-grad)] text-black no-underline transition-all hover:opacity-85 hover:scale-105">
            {t.story.cta.buttons[0]}
          </a>
          <a href="/coach360" className="text-[12px] font-bold tracking-[2px] uppercase px-[30px] py-[13px] rounded-full border border-[rgba(220,175,100,.3)] text-[var(--g1)] bg-transparent no-underline transition-all hover:bg-[rgba(220,175,100,.07)] hover:scale-105">
            {t.story.cta.buttons[1]}
          </a>
          <a href="/academy" className="text-[12px] font-bold tracking-[2px] uppercase px-[30px] py-[13px] rounded-full border border-[rgba(220,175,100,.3)] text-[var(--g1)] bg-transparent no-underline transition-all hover:bg-[rgba(220,175,100,.07)] hover:scale-105">
            {t.story.cta.buttons[2]}
          </a>
          <a href="/business" className="text-[12px] font-bold tracking-[2px] uppercase px-[30px] py-[13px] rounded-full border border-[rgba(220,175,100,.3)] text-[var(--g1)] bg-transparent no-underline transition-all hover:bg-[rgba(220,175,100,.07)] hover:scale-105">
            {t.story.cta.buttons[3]}
          </a>
        </div>
      </section>

      <Footer />
    </main>
  );
}
