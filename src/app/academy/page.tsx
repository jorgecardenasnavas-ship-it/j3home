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
   S1 — HERO
   ═══════════════════════════════════════════════════════ */

function HeroSection() {
  const { t } = useI18n();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] flex items-end overflow-hidden bg-black">
      {/* Atmospheric fallback gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[rgba(220,175,100,0.06)] via-transparent to-[rgba(220,175,100,0.03)]" />

      {/* Video background — oversized iframe trick for object-fit:cover behavior */}
      {ready && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src="https://iframe.mediadelivery.net/embed/553002/087de751-9d65-48f2-8b33-27b73ea3d3a3?autoplay=true&loop=true&muted=true&controls=false&responsive=false"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
            style={{
              width: "177.78vh", minWidth: "100%",
              height: "56.25vw", minHeight: "100%",
              opacity: 0.45,
              transition: "opacity 1.4s ease",
            }}
            allow="autoplay"
            loading="lazy"
            title="J3 Academy video"
          />
        </div>
      )}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/30 z-[1]" />

      {/* Content */}
      <div className="relative z-10 px-12 pb-[72px] max-[960px]:px-6 max-[960px]:pb-14 w-full max-w-[1200px]">
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

        {/* Location label */}
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
          {t.academy.hero.locationLabel}
        </span>

        {/* Title */}
        <h1 className="font-bold uppercase tracking-[-3px] leading-[0.88] mb-8">
          {/* Line 1 — REPEAT. gold */}
          <span
            className="j3-grad-text block text-[clamp(72px,12vw,168px)]"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(120%) scale(1.05)",
              filter: ready ? "blur(0px)" : "blur(8px)",
              transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.6s",
            }}
          >
            {t.academy.hero.titleLine1}
          </span>
          {/* Line 2 — REPEAT. stroke */}
          <span
            className="j3-stroke block text-[clamp(72px,12vw,168px)]"
            style={{
              opacity: ready ? 1 : 0,
              transform: ready ? "none" : "translateY(120%) scale(1.05)",
              filter: ready ? "blur(0px)" : "blur(8px)",
              transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.75s",
            }}
          >
            {t.academy.hero.titleLine2}
          </span>
          {/* Line 3 — AND white + repeat gold cursive */}
          <span className="block text-[clamp(72px,12vw,168px)]">
            <span
              className="text-[var(--wh)] inline-block"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(120%) scale(1.05)",
                filter: ready ? "blur(0px)" : "blur(8px)",
                transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 0.9s",
              }}
            >
              {t.academy.hero.titleLine3a}
            </span>
            <span
              className="j3-grad-text inline-block font-[var(--font-serif)] italic normal-case"
              style={{
                opacity: ready ? 1 : 0,
                transform: ready ? "none" : "translateY(120%) scale(1.05)",
                filter: ready ? "blur(0px)" : "blur(8px)",
                transition: "all 1.1s cubic-bezier(0.16,1,0.3,1) 1.05s",
              }}
            >
              {" "}{t.academy.hero.titleLine3b}
            </span>
          </span>
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
          <span className="w-px h-[68px] max-[960px]:h-[60px] mt-1 shrink-0 bg-gradient-to-b from-[var(--g1)] via-[var(--g1)]/40 to-transparent" />

          <div className="leading-[1.35]">
            {/* Top line — small uppercase */}
            <span className="block text-[clamp(13px,1.4vw,18px)] font-light tracking-[1px] uppercase text-[var(--gy3)]">
              {t.academy.hero.subtitleBefore}
            </span>

            {/* Big italic gold word + rest of phrase */}
            <p className="text-[clamp(16px,1.8vw,22px)] font-light text-[var(--gy3)] leading-[1.2] mt-[2px]">
              <span className="text-[clamp(26px,3.2vw,42px)] font-bold italic tracking-[-0.5px] j3-grad-text mr-1 align-baseline">
                {t.academy.hero.subtitleAccent}
              </span>
              {t.academy.hero.subtitleAfter}
            </p>

            <span className="block text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]/75 mt-4">
              {t.academy.hero.subtitleLine2}
            </span>
          </div>
        </div>
      </div>

      {/* Chevron animado */}
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
                transition: `all 1s var(--ease-out) ${i * 0.25}s`,
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
    <section ref={ref} className="relative bg-[var(--bk)] py-28 max-[960px]:py-20 px-12 max-[960px]:px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 max-[960px]:grid-cols-1 gap-16 max-[960px]:gap-10 items-center">
        {/* Left — image placeholder */}
        <div
          className="aspect-[3/4] max-[960px]:aspect-[16/10] rounded-lg overflow-hidden relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-40px)",
            transition: "all 1s var(--ease-out)",
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
            transition: "all 1s var(--ease-out) 0.15s",
          }}
        >
          {/* Eyebrow */}
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-6">
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
                  transition: `all 0.7s var(--ease-out) ${i * 0.1}s`,
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
              : "bg-[var(--bk3)] border border-white/[.06]"
          : "border border-white/[.06]"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(30px)",
        transition: `all 0.8s var(--ease-out) ${index * 0.12}s`,
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
    <section className="relative bg-[var(--bk)] py-28 max-[960px]:py-20 overflow-hidden">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto mb-16"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s var(--ease-out)",
        }}
      >
        <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-4">
          {t.academy.programs.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(36px,5vw,72px)] uppercase tracking-[-2px] leading-[1]">
          <span className="text-[var(--wh)]">{t.academy.programs.headingPre}</span>
          <span className="j3-grad-text">{t.academy.programs.headingAccent}</span>
        </h2>
      </div>

      {/* Block 1: Juniors — dark */}
      <div className="bg-[var(--bk)] border-t border-white/[.06]">
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.06]">
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
      <div className="bg-[var(--bk)] border-t border-white/[.06]">
        {/* Block label */}
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.06]">
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
      <div className="bg-[var(--bk)] border-t border-white/[.06]">
        <div className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-5 flex items-center gap-4 border-b border-white/[.06]">
          <span className="font-bold text-[clamp(20px,2.5vw,32px)] j3-grad-text tracking-[-1px]">03</span>
          <span className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{t.academy.programs.intensiveLabel}</span>
        </div>

        <div
          ref={itReveal.ref}
          className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto py-16 max-[960px]:py-12"
          style={{
            opacity: itReveal.visible ? 1 : 0,
            transform: itReveal.visible ? "none" : "translateY(30px)",
            transition: "all 1s var(--ease-out)",
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
              <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-3">
                {t.academy.programs.intensiveEyebrow}
              </span>

              <h3 className="font-bold text-[clamp(32px,5vw,72px)] uppercase tracking-[-2px] leading-[1] mb-3">
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
        transition: `all 1s var(--ease-out) ${index * 0.2}s`,
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
    <section className="relative bg-[var(--bk)] overflow-hidden">
      {/* Section header */}
      <div
        ref={ref}
        className="px-12 max-[960px]:px-6 max-w-[1200px] mx-auto pt-28 pb-14 max-[960px]:pt-20 max-[960px]:pb-10"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all 0.9s var(--ease-out)",
        }}
      >
        <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-4">
          {t.academy.headquarters.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(36px,5vw,72px)] uppercase tracking-[-2px] leading-[1]">
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
    <section className="relative bg-[var(--bk3)] py-28 max-[960px]:py-20 px-12 max-[960px]:px-6 overflow-hidden">
      <div className="max-w-[1200px] mx-auto grid grid-cols-[1fr_1.5fr] max-[960px]:grid-cols-1 gap-16 max-[960px]:gap-10">
        {/* Left — header */}
        <div
          ref={ref}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: "all 0.9s var(--ease-out)",
          }}
        >
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-4">
            {t.academy.method.eyebrow}
          </span>
          <h2 className="font-bold text-[clamp(36px,5vw,72px)] uppercase tracking-[-2px] leading-[1]">
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
                  transition: `all 0.8s var(--ease-out) ${i * 0.15}s`,
                }}
              >
                {/* Numbered dot */}
                <div className="shrink-0 w-[23px] h-[23px] rounded-full border-2 border-[var(--g1)]/40 flex items-center justify-center relative z-10 bg-[var(--bk3)]">
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
    <section className="relative bg-[var(--bk)] py-24 max-[960px]:py-16 px-12 max-[960px]:px-6 border-t border-white/[.06] border-b border-b-white/[.06] overflow-hidden">
      {/* Subtle glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,175,100,.03) 0%, transparent 70%)" }} />

      <div className="max-w-[1200px] mx-auto grid grid-cols-5 max-[960px]:grid-cols-2 gap-y-12 relative z-10">
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
      className="relative bg-[var(--bk2)] py-32 max-[960px]:py-24 px-12 max-[960px]:px-6 overflow-hidden text-center"
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
          transition: "all 1s var(--ease-out)",
        }}
      >
        {/* Eyebrow */}
        <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-6">
          {t.academy.cta.eyebrow}
        </span>

        {/* Title */}
        <h2 className="font-bold text-[clamp(48px,7vw,96px)] uppercase tracking-[-3px] leading-[0.95] mb-6">
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

export default function AcademyPage() {
  return (
    <main className="bg-[var(--bk)] text-[var(--wh)] font-sans w-full">
      <Navbar />

      {/* S1 — Hero */}
      <HeroSection />

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
