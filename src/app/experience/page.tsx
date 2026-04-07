"use client";

import { useRef, useEffect, useState } from "react";
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

const WA_BASE = "https://wa.me/34722272598";

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
   S1 — HERO
   ═══════════════════════════════════════════════════════ */

function HeroSection() {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  const titleStyles = ["j3-grad-text", "j3-stroke", "j3-stroke"];
  const titleWords = t.experience.hero.titleLines.map((text, i) => ({
    text,
    style: titleStyles[i] ?? "j3-stroke",
  }));

  return (
    <section className="relative h-screen min-h-[640px] flex items-end overflow-hidden bg-black">
      {/* Atmospheric gold gradient background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 80% 60% at 75% 25%, rgba(220,175,100,.13) 0%, transparent 60%)",
              "radial-gradient(ellipse 60% 80% at 15% 75%, rgba(220,175,100,.07) 0%, transparent 55%)",
              "radial-gradient(ellipse 100% 100% at 50% 50%, #0d0d0d 0%, #000 100%)",
            ].join(","),
          }}
        />
        {/* Gold grid pattern overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(220,175,100,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(220,175,100,.025) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse 90% 80% at 65% 35%, rgba(0,0,0,1) 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse 90% 80% at 65% 35%, rgba(0,0,0,1) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black z-[1]" />

      {/* Content */}
      <div className="relative z-10 px-12 pb-20 max-[960px]:px-6 max-[960px]:pb-16 w-full max-w-[1200px]">
        {/* Gold accent line */}
        <div
          className="w-[40px] h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] mb-5"
          style={{
            opacity: ready ? 0.7 : 0,
            transform: ready ? "scaleX(1)" : "scaleX(0)",
            transformOrigin: "left",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.3s",
          }}
        />

        {/* Eyebrow */}
        <span
          className="text-[10px] font-bold tracking-[5px] uppercase block mb-6"
          style={{
            color: "var(--g1)",
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(12px)",
            filter: ready ? "blur(0px)" : "blur(8px)",
            transition: "all 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s",
          }}
        >
          {t.experience.hero.eyebrow}
        </span>

        {/* Title — word-by-word reveal with blur */}
        <h1 className="font-bold uppercase tracking-[-5px] max-[960px]:tracking-[-3px] leading-[0.84] text-[clamp(80px,13vw,180px)] mb-8">
          {titleWords.map((w, i) => (
            <span key={i}>
              <span
                className={`${w.style} inline-block`}
                style={{
                  opacity: ready ? 1 : 0,
                  transform: ready ? "none" : "translateY(120%) scale(1.05)",
                  filter: ready ? "blur(0px)" : "blur(8px)",
                  transition: `all 1.1s cubic-bezier(0.16,1,0.3,1) ${0.6 + i * 0.15}s`,
                }}
              >
                {w.text}
              </span>
              {i < titleWords.length - 1 && <br />}
            </span>
          ))}
        </h1>

        {/* Subtitle — brushstroke layout */}
        <div
          className="flex items-start gap-5 max-w-[760px]"
          style={{
            opacity: ready ? 1 : 0,
            transform: ready ? "none" : "translateY(16px)",
            filter: ready ? "blur(0px)" : "blur(6px)",
            transition: "all 0.9s cubic-bezier(0.16,1,0.3,1) 1.2s",
          }}
        >
          {/* Vertical gold hairline */}
          <span className="w-px h-[60px] max-[960px]:h-[54px] mt-1 shrink-0 bg-gradient-to-b from-[var(--g1)] via-[var(--g1)]/40 to-transparent" />

          <p className="text-[clamp(15px,1.7vw,21px)] font-light text-[var(--gy3)] tracking-[-0.2px] leading-[1.45]">
            {t.experience.hero.subtitleBefore}
            <span className="font-bold italic j3-grad-text">{t.experience.hero.subtitleAccent}</span>
            {t.experience.hero.subtitleAfter}
          </p>
        </div>
      </div>

      {/* Chevron indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        style={{
          opacity: ready ? 0.5 : 0,
          transition: "opacity 1s ease 2s",
        }}
      >
        <svg
          width="20" height="10" viewBox="0 0 20 10"
          className="animate-[heroChevronBounce_2s_ease-in-out_infinite]"
          fill="none" stroke="var(--g1)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="2,2 10,8 18,2" />
        </svg>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S2 — STATEMENT
   ═══════════════════════════════════════════════════════ */

function StatementSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  const lineStyles: { style: string; accentStyle?: string; align: string }[] = [
    { style: "j3-grad-text", accentStyle: "font-[var(--font-serif)] italic normal-case text-[var(--wh)]", align: "text-left" },
    { style: "j3-stroke", align: "text-right" },
    { style: "text-[var(--wh)]", accentStyle: "font-[var(--font-serif)] italic normal-case j3-grad-text", align: "text-left pl-[8%] max-[960px]:pl-0" },
  ];
  const lines = t.experience.statement.lines.map((l, i) => ({ ...l, ...lineStyles[i] }));

  const { itemRefs, visibleItems } = useStaggerReveal(lines.length, 0.2);

  return (
    <section className="relative bg-[var(--bk2)] py-32 max-[960px]:py-24 px-12 max-[960px]:px-6 border-b border-[var(--g1)]/15 overflow-hidden">
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
            transition: "all 0.8s var(--ease-out)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[5px] uppercase text-[var(--g1)]">
            {t.experience.statement.eyebrow}
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
                transition: `all 1s var(--ease-out) ${i * 0.25}s`,
              }}
            >
              <span className={`${line.style} font-bold text-[clamp(44px,8vw,120px)] uppercase tracking-[-2px] leading-[1.05] inline-block`}>
                {line.before}
              </span>
              {line.accent && (
                <>
                  <span className="inline-block w-[0.25em]" />
                  <span className={`${line.accentStyle || line.style} font-bold text-[clamp(44px,8vw,120px)] tracking-[-1px] leading-[1.05] inline-block pr-[0.15em] py-[0.1em] -mr-[0.15em]`}>
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
   S3 — FLOW CAMP (main product section)
   ═══════════════════════════════════════════════════════ */

function CampCard({
  label, title, desc, index, visible, num,
}: {
  label: string;
  title: string;
  desc: string;
  index: number;
  visible: boolean;
  num: string;
}) {
  return (
    <div
      className="relative group p-8 max-[960px]:p-6 bg-[var(--bk3)] border border-white/[.06] overflow-hidden min-h-[220px] flex flex-col justify-end"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 0.8s var(--ease-out) ${index * 0.12}s`,
      }}
    >
      {/* Gold accent line — top, expands on hover */}
      <div className="absolute top-0 left-0 w-[40px] group-hover:w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-[var(--ease-out)] opacity-50 group-hover:opacity-80" />

      {/* Watermark number */}
      <span className="absolute top-4 right-6 font-bold text-[clamp(60px,8vw,80px)] j3-grad-text leading-[1] opacity-[0.06] group-hover:opacity-[0.12] transition-opacity duration-700 pointer-events-none select-none">
        {num}
      </span>

      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
        style={{ background: "radial-gradient(600px circle at 50% 30%, rgba(220,175,100,0.05), transparent 50%)" }}
      />

      <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)]/60 block mb-3">{label}</span>
      <h4 className="font-bold text-[18px] max-[960px]:text-[16px] uppercase tracking-[-0.2px] text-[var(--wh)] mb-3 group-hover:text-[var(--g1)] transition-colors duration-300">{title}</h4>
      <p className="text-[13px] font-light text-[var(--gy2)] leading-[1.65]">{desc}</p>
    </div>
  );
}

function FlowCampSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  const jovenesCards = t.experience.flowCamp.jovenesCards;
  const { itemRefs: jRefs, visibleItems: jVis } = useStaggerReveal(jovenesCards.length, 0.15);

  const adultosCards = t.experience.flowCamp.adultosCards;
  const { itemRefs: aRefs, visibleItems: aVis } = useStaggerReveal(adultosCards.length, 0.15);

  return (
    <section className="relative bg-[var(--bk)] overflow-hidden border-t border-[rgba(220,175,100,.2)]">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto pt-28 max-[960px]:pt-20 pb-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s var(--ease-out)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-4">
          {t.experience.flowCamp.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(56px,9vw,130px)] uppercase tracking-[-3px] leading-[0.88]">
          <span className="j3-grad-text">{t.experience.flowCamp.headingFlow}</span>{" "}
          <span className="j3-stroke">{t.experience.flowCamp.headingCamp}</span>
        </h2>
        <p className="text-[clamp(14px,1.5vw,18px)] font-light text-[var(--gy2)] leading-[1.7] max-w-[520px] mt-6">
          {t.experience.flowCamp.introBefore}
          <span className="font-[var(--font-serif)] italic text-[var(--wh)]">{t.experience.flowCamp.introAccent}</span>
        </p>
      </div>

      {/* Sub-block A: Flow Camp - Jóvenes */}
      <div className="border-t border-white/[.06]">
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.06]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">01</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.experience.flowCamp.jovenesLabel}</span>
        </div>

        {/* Intro text */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto pt-10 pb-4">
          <h3 className="font-bold text-[clamp(22px,3vw,32px)] uppercase tracking-[-1px] text-[var(--wh)] max-w-[800px]">
            <span className="j3-grad-text">{t.experience.flowCamp.jovenesTitleAccent}</span>
            {t.experience.flowCamp.jovenesTitleRest}
          </h3>
        </div>

        {/* Cards grid */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-8 grid grid-cols-3 max-[960px]:grid-cols-1 gap-5">
          {jovenesCards.map((c, i) => (
            <div key={i} ref={el => { jRefs.current[i] = el; }}>
              <CampCard {...c} num={`0${i + 1}`} index={i} visible={jVis[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* Gold separator */}
      <div className="h-[3px] bg-[rgba(220,175,100,.15)]" />

      {/* Sub-block B: Players Camp - Adultos */}
      <div>
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.06]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">02</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.experience.flowCamp.adultosLabel}</span>
        </div>

        {/* Intro text */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto pt-10 pb-4">
          <h3 className="font-bold text-[clamp(22px,3vw,32px)] uppercase tracking-[-1px] text-[var(--wh)] max-w-[800px]">
            <span className="j3-grad-text">{t.experience.flowCamp.adultosTitleAccent}</span>
            {t.experience.flowCamp.adultosTitleMid}
            <span className="font-[var(--font-serif)] italic normal-case text-[var(--wh)]">{t.experience.flowCamp.adultosTitleSerif}</span>
          </h3>
        </div>

        {/* Cards grid */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-8 grid grid-cols-3 max-[960px]:grid-cols-1 gap-5">
          {adultosCards.map((c, i) => (
            <div key={i} ref={el => { aRefs.current[i] = el; }}>
              <CampCard {...c} num={`0${i + 1}`} index={i} visible={aVis[i]} />
            </div>
          ))}
        </div>
      </div>

      {/* WhatsApp CTA bar */}
      <div className="border-t border-white/[.06] px-12 max-[960px]:px-6">
        <div className="max-w-[1200px] mx-auto py-12 flex items-center justify-between flex-wrap gap-5">
          <span className="text-[13px] font-light text-[var(--gy2)] max-w-[480px]">
            {t.experience.flowCamp.ctaText}
          </span>
          <a
            href={waLink(t.experience.flowCamp.waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="j3-press btn-ghost inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--g1)]/35 text-[12px] font-bold tracking-[2px] uppercase text-[var(--g1)] hover:bg-[rgba(220,175,100,.07)]"
          >
            <WaIcon size={13} />
            {t.experience.flowCamp.ctaButton}
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S4 — EMPRESAS
   ═══════════════════════════════════════════════════════ */

function EmpresasSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.1);

  const formatos = t.experience.empresas.formatos;

  const { itemRefs, visibleItems } = useStaggerReveal(formatos.length, 0.2);

  const leftReveal = useReveal(0.15);

  return (
    <section className="relative bg-[var(--bk)] overflow-hidden border-t border-[rgba(220,175,100,.2)]">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto pt-28 max-[960px]:pt-20 pb-14"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s var(--ease-out)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-4">
          {t.experience.empresas.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(56px,9vw,130px)] uppercase tracking-[-3px] leading-[0.88]">
          <span className="j3-grad-text">{t.experience.empresas.heading}</span>
        </h2>
        <p className="text-[clamp(14px,1.5vw,18px)] font-light text-[var(--gy2)] leading-[1.7] max-w-[520px] mt-6">
          {t.experience.empresas.introBefore}
          <span className="font-[var(--font-serif)] italic text-[var(--wh)]">{t.experience.empresas.introAccent}</span>
          {t.experience.empresas.introAfter}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="border-t border-white/[.06]">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 max-[960px]:grid-cols-1">
          {/* Left — description + CTA */}
          <div
            ref={leftReveal.ref}
            className="px-12 max-[960px]:px-6 py-16 border-r border-white/[.06] max-[960px]:border-r-0 max-[960px]:border-b max-[960px]:border-b-white/[.06] flex flex-col justify-between"
            style={{
              opacity: leftReveal.visible ? 1 : 0,
              transform: leftReveal.visible ? "none" : "translateX(-30px)",
              transition: "all 0.9s var(--ease-out)",
            }}
          >
            <div>
              <p className="text-[15px] font-light text-[var(--gy2)] leading-[1.8] max-w-[400px] mb-6">
                {t.experience.empresas.leftPara1}
              </p>
              <p className="text-[15px] font-light text-[var(--gy2)] leading-[1.8] max-w-[400px] mb-10">
                {t.experience.empresas.leftPara2}
              </p>
            </div>
            <a
              href={waLink(t.experience.empresas.waMsg)}
              target="_blank"
              rel="noopener noreferrer"
              className="j3-press btn-ghost inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[var(--g1)]/35 text-[12px] font-bold tracking-[2px] uppercase text-[var(--g1)] hover:bg-[rgba(220,175,100,.07)] self-start"
            >
              <WaIcon size={13} />
              {t.experience.empresas.ctaButton}
            </a>
          </div>

          {/* Right — format cards */}
          <div className="bg-[var(--bk3)] px-12 max-[960px]:px-6 py-16">
            {formatos.map((f, i) => (
              <div
                key={i}
                ref={el => { itemRefs.current[i] = el; }}
                className={`group relative py-7 flex gap-5 items-start ${
                  i === 0 ? "border-t border-white/[.06]" : ""
                } border-b border-white/[.06] cursor-default`}
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(20px)",
                  transition: `all 0.8s var(--ease-out) ${i * 0.15}s`,
                }}
              >
                {/* Big number */}
                <span className="font-bold text-[clamp(28px,3vw,40px)] j3-grad-text leading-[1] opacity-30 group-hover:opacity-60 transition-opacity duration-500 shrink-0 mt-1">
                  {`0${i + 1}`}
                </span>
                <div className="flex flex-col gap-1.5">
                  <h4 className="font-bold text-[17px] uppercase tracking-[-0.2px] text-[var(--wh)] group-hover:text-[var(--g1)] transition-colors duration-300">
                    {f.name}
                  </h4>
                  <p className="text-[12px] font-light text-[var(--gy2)] leading-[1.6]">{f.desc}</p>
                </div>
                {/* Gold accent line — bottom, expands on hover */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-[var(--ease-out)]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S5 — STATS
   ═══════════════════════════════════════════════════════ */

function StatsSection() {
  const { t } = useI18n();

  const statValues: { val: number; suffix: string; label?: string }[] = [
    { val: 20, suffix: "+" },
    { val: 0, suffix: "", label: "#1" },
    { val: 0, suffix: "", label: "\uD83E\uDD4711\u00B7\uD83E\uDD482" },
    { val: 0, suffix: "", label: "WPT" },
  ];
  const stats = statValues.map((s, i) => ({ ...s, lbl: t.experience.stats.items[i].lbl }));

  const { itemRefs, visibleItems } = useStaggerReveal(stats.length, 0.3);

  return (
    <section className="relative bg-[var(--bk)] py-24 max-[960px]:py-16 px-12 max-[960px]:px-6 border-t border-[rgba(220,175,100,.2)] border-b border-b-[rgba(220,175,100,.2)] overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,175,100,.03) 0%, transparent 70%)" }} />

      <div className="max-w-[1200px] mx-auto grid grid-cols-4 max-[960px]:grid-cols-2 gap-y-12 relative z-10">
        {stats.map((s, i) => (
          <div
            key={i}
            ref={el => { itemRefs.current[i] = el; }}
            className={`text-center ${
              i < stats.length - 1 ? "border-r border-white/[.06]" : ""
            } ${i === 1 || i === 3 ? "max-[960px]:border-r-0" : ""}`}
            style={{
              opacity: visibleItems[i] ? 1 : 0,
              transform: visibleItems[i] ? "none" : "translateY(24px) scale(0.95)",
              transition: `all 0.8s var(--ease-out) ${i * 0.12}s`,
            }}
          >
            <Counter
              val={s.val}
              suffix={s.suffix}
              label={s.label}
            />
            <span className="text-[11px] max-[960px]:text-[10px] font-light tracking-[2px] uppercase text-[var(--gy)] leading-[1.5] block mt-3 px-4 whitespace-pre-line">
              {s.lbl}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   S6 — CTA FINAL
   ═══════════════════════════════════════════════════════ */

function CtaFinalSection() {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);

  return (
    <section
      ref={ref}
      className="relative bg-[var(--bk2)] py-32 max-[960px]:py-24 px-12 max-[960px]:px-6 overflow-hidden"
    >
      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[var(--g1)]/20 to-transparent" />

      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(220,175,100,.07) 0%, transparent 70%)" }}
      />

      <div
        className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-2 max-[960px]:grid-cols-1 gap-20 max-[960px]:gap-10 items-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(30px)",
          transition: "all 1s var(--ease-out)",
        }}
      >
        {/* Left — title */}
        <h2 className="font-bold text-[clamp(52px,8vw,100px)] uppercase tracking-[-3px] leading-[0.88]">
          <span className="j3-grad-text">{t.experience.cta.titleLine1}</span><br />
          <span className="j3-stroke">{t.experience.cta.titleLine2}</span><br />
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case inline-block pr-[0.15em] py-[0.1em] -mr-[0.15em]">{t.experience.cta.titleAccent}</span>
          <span className="j3-stroke">{t.experience.cta.titleEnd}</span>
        </h2>

        {/* Right — CTA content */}
        <div className="flex flex-col gap-6">
          <p className="text-[16px] font-light text-[var(--gy2)] leading-[1.75] max-w-[380px]">
            {t.experience.cta.body}
          </p>

          <a
            href={waLink(t.experience.cta.waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="j3-press btn-glow inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-[12px] tracking-[2px] uppercase text-black self-start"
            style={{ background: "var(--j3-grad)" }}
          >
            <WaIcon size={15} />
            {t.experience.cta.button}
          </a>

          <span className="text-[11px] font-light text-[var(--gy)] tracking-[1px]">
            {t.experience.cta.note}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE EXPORT
   ═══════════════════════════════════════════════════════ */

export default function ExperiencePage() {
  return (
    <main className="bg-[var(--bk)] text-[var(--wh)] font-sans w-full">
      <Navbar />

      {/* S1 — Hero */}
      <HeroSection />

      {/* S2 — Statement */}
      <StatementSection />

      {/* S3 — Flow Camp */}
      <FlowCampSection />

      {/* S4 — Empresas */}
      <EmpresasSection />

      {/* S5 — Stats */}
      <StatsSection />

      {/* S6 — CTA Final */}
      <CtaFinalSection />

      <Footer />
    </main>
  );
}
