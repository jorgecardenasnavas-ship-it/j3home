"use client";

import { useRef, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

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
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const st = ScrollTrigger.create({
        trigger: el,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          // Preserve original formula: (rect.top / windowH) * 80
          const rect = el.getBoundingClientRect();
          setOffset((rect.top / window.innerHeight) * 80);
        },
      });
      return () => st.kill();
    },
    { scope: ref }
  );
  return { ref, offset };
}

/* ───────── DATA ───────── */

/* ── Player names (proper nouns — not translated) ── */
const playerHeroNames = [
  { first: "\u00C1lex", last: "Ruiz" },
  { first: "Momo", last: "Gonz\u00E1lez" },
  { first: "Jordi", last: "Mu\u00F1oz" },
];

const playerNextGenNames = [
  { first: "Guille", last: "Collado" },
  { first: "Bea", last: "Gonz\u00E1lez" },
  { first: "Raquel", last: "Segura" },
  { first: "Ernesto", last: "Moreno" },
  { first: "Marcos", last: "Gonz\u00E1lez" },
];

const playerNextGenProNames = [
  { first: "Martina", last: "Fassio" },
  { first: "Jos\u00E9", last: "Jim\u00E9nez Casas" },
];

const playerFeaturedNames = [
  { first: "Franco", last: "Stupaczuk" },
  { first: "Fede", last: "Chingotto" },
  { first: "Javi", last: "Garrido" },
  { first: "\u00C1lex", last: "Arroyo" },
];

const playerSharedNames = [
  { first: "Paquito", last: "Navarro" },
  { first: "Maxi", last: "S\u00E1nchez" },
  { first: "Fede", last: "Quiles" },
  { first: "Raquel", last: "Eugenio" },
  { first: "\u00C1lex", last: "Chozas" },
  { first: "Pincho", last: "Fern\u00E1ndez" },
  { first: "Miguel \u00C1.", last: "Ben\u00EDtez" },
  { first: "Mart\u00EDn", last: "Andornino" },
  { first: "Fran", last: "Jurado" },
  { first: "Pol", last: "Hern\u00E1ndez" },
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

/* ───────── HERO CREDENTIALS BAR ───────── */

const heroCredentials = [
  { value: "#1", label: "MEJOR CLUB\nDEL MUNDO 2018" },
  { value: "100+", label: "COACHES FORMADOS\nEN COACH360" },
  { value: "2000+", label: "JUGADORES AMATEUR\nENTRENADOS" },
  { value: "30+", label: "JUGADORES PRO\nFORMADOS" },
  { value: "N.º1", label: "ENTRENADOR ESPAÑOL\nEN RANKING WPT 2022" },
  { value: "11", label: "TÍTULOS PROFESIONALES\nEN 18 FINALES" },
  { value: "WPT", label: "SEDE OFICIAL\nMÁLAGA 2014", isLabel: true },
] as const;

function HeroCredentials() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>(new Array(heroCredentials.length).fill(false));
  const [sectionVisible, setSectionVisible] = useState(false);

  /* Staggered reveal via IntersectionObserver */
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSectionVisible(true);
          heroCredentials.forEach((_, i) => {
            setTimeout(() => {
              setRevealed(prev => { const n = [...prev]; n[i] = true; return n; });
            }, 200 + i * 140);
          });
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(container);
    return () => io.disconnect();
  }, []);

  /* Animated counter for numeric values */
  const AnimVal = ({ raw }: { raw: string }) => {
    const numMatch = raw.match(/(\d+)/);
    const prefix = raw.match(/^([^\d]*)/)?.[1] || "";
    const suffix = raw.match(/(\D*)$/)?.[1] || "";
    const target = numMatch ? parseInt(numMatch[1], 10) : 0;
    const [count, setCount] = useState(0);
    const [started, setStarted] = useState(false);
    const ref = useRef<HTMLSpanElement>(null);

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
      if (!started || !target) return;
      const dur = 1400;
      const steps = 35;
      const inc = target / steps;
      let frame = 0;
      const iv = setInterval(() => {
        frame++;
        // Ease-out deceleration
        const progress = 1 - Math.pow(1 - frame / steps, 3);
        setCount(Math.min(Math.round(target * progress), target));
        if (frame >= steps) clearInterval(iv);
      }, dur / steps);
      return () => clearInterval(iv);
    }, [started, target]);

    return (
      <span ref={ref} className="j3-grad-text font-black tabular-nums">
        {prefix}{target ? count : raw}{suffix}
      </span>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative py-12 min-[960px]:py-16 px-6 min-[960px]:px-12 bg-[var(--bk)] overflow-hidden border-b border-white/[.04]"
    >
      {/* Ambient glow behind cards */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-[2s]"
        style={{
          opacity: sectionVisible ? 1 : 0,
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(220,175,100,.05) 0%, transparent 70%)",
        }}
      />

      {/* Shimmer sweep overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: sectionVisible ? 1 : 0,
          background: "linear-gradient(105deg, transparent 40%, rgba(220,175,100,.04) 45%, rgba(220,175,100,.08) 50%, rgba(220,175,100,.04) 55%, transparent 60%)",
          backgroundSize: "200% 100%",
          animation: sectionVisible ? "shimmer-sweep 3s 0.5s ease both" : "none",
        }}
      />

      {/* Grid: flexible wrap — 2 cols mobile, auto-fill desktop */}
      <div className="relative z-[1] max-w-[1100px] mx-auto grid grid-cols-2 min-[960px]:grid-cols-4 gap-3 min-[960px]:gap-4">
        {heroCredentials.map((cred, i) => {
          const isLabel = "isLabel" in cred && cred.isLabel;
          return (
            <div
              key={i}
              ref={el => { cardRefs.current[i] = el; }}
              className={`group relative rounded-xl p-5 min-[960px]:p-6 overflow-hidden
                ${revealed[i] ? "" : ""}
              `}
              style={{
                opacity: revealed[i] ? 1 : 0,
                transform: revealed[i] ? "translateY(0) scale(1)" : "translateY(40px) scale(0.92)",
                filter: revealed[i] ? "blur(0px)" : "blur(8px)",
                transition: `all .9s cubic-bezier(.16,1,.3,1) ${i * 0.05}s`,
                background: revealed[i]
                  ? "linear-gradient(160deg, rgba(220,175,100,.06) 0%, rgba(220,175,100,.01) 50%, rgba(0,0,0,.2) 100%)"
                  : "transparent",
                border: "0.5px solid",
                borderColor: revealed[i] ? "rgba(220,175,100,.15)" : "transparent",
              }}
            >
              {/* Glow dot top-left */}
              <div
                className="absolute top-0 left-0 w-24 h-24 pointer-events-none transition-opacity duration-1000"
                style={{
                  opacity: revealed[i] ? 1 : 0,
                  background: "radial-gradient(circle at top left, rgba(220,175,100,.12) 0%, transparent 70%)",
                }}
              />

              {/* Value */}
              <div className="relative text-[clamp(28px,3.5vw,42px)] leading-[1] mb-3 tracking-[-0.02em]">
                {isLabel ? (
                  <span className="j3-grad-text font-black">{cred.value}</span>
                ) : (
                  <AnimVal raw={cred.value} />
                )}
              </div>

              {/* Label */}
              <div
                className="relative text-[9px] min-[960px]:text-[10px] font-medium tracking-[1.5px] uppercase text-[var(--gy)] leading-[1.6] whitespace-pre-line"
                style={{
                  opacity: revealed[i] ? 1 : 0,
                  transition: `opacity .6s cubic-bezier(.16,1,.3,1) ${0.3 + i * 0.08}s`,
                }}
              >
                {cred.label}
              </div>
            </div>
          );
        })}
      </div>
    </section>
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

      {/* Row 1 — first 4 stats */}
      <div className="grid grid-cols-2 min-[960px]:grid-cols-4 gap-y-10 gap-x-4 max-w-[1000px] mx-auto">
        {stats.slice(0, 4).map((s, i) => {
          const visible = visibleItems[i];
          const isHero = i === 0; // #1 Mejor Club
          return (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className="text-center"
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
              <span className="text-[10px] max-[960px]:text-[11px] font-light tracking-[2px] uppercase leading-[1.6] whitespace-pre-line block text-[var(--gy2)]">{s.lbl}</span>
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

      {/* Row 2 — remaining 4 stats */}
      <div className="grid grid-cols-2 min-[960px]:grid-cols-4 gap-y-10 gap-x-4 max-w-[1000px] mx-auto">
        {stats.slice(4).map((s, i) => {
          const idx = i + 4;
          const visible = visibleItems[idx];
          return (
            <div
              key={idx}
              ref={el => { itemRefs.current[idx] = el; }}
              className={`text-center ${i === 2 ? "col-span-2 min-[960px]:col-span-1" : ""}`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(24px)",
                transition: `all .8s cubic-bezier(.16,1,.3,1) ${idx * 0.12}s`,
              }}
            >
              <Counter val={typeof s.val === "number" ? s.val : 0} prefix={s.prefix} suffix={s.suffix} label={s.label}
                className="font-bold j3-grad-text/70 leading-[1] block mb-2 text-[clamp(28px,3.5vw,46px)]"
              />
              <span className="text-[10px] max-[960px]:text-[11px] font-light text-[var(--gy2)] tracking-[2px] uppercase leading-[1.6] whitespace-pre-line block">{s.lbl}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ───────── ACCENT MANIFESTO — Á gigante con tilde que cae (scroll-driven, pinned) ───────── */

function AccentManifesto() {
  const { t } = useI18n();
  const { eyebrow, slogan, manifesto } = t.story.accent;
  const containerRef = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const slogan1Ref = useRef<HTMLSpanElement>(null);
  const slogan2Ref = useRef<HTMLSpanElement>(null);
  const slogan3Ref = useRef<HTMLSpanElement>(null);
  const hairlineRef = useRef<HTMLDivElement>(null);
  const manifestoRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const glow1Ref = useRef<HTMLDivElement>(null);
  const glow2Ref = useRef<HTMLDivElement>(null);
  const cordRef = useRef<HTMLDivElement>(null);
  const vignetteRef = useRef<HTMLDivElement>(null);
  const perspectiveRef = useRef<HTMLDivElement>(null);
  const fadeOverlayRef = useRef<HTMLDivElement>(null);
  const [accentTriggered, setAccentTriggered] = useState(false);

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Master timeline — driven by ScrollTrigger scrub. Time units = "phase units" (0..1).
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.4, // soft scrub — smoothes residual jitter
        },
      });

      // pA 0.00→0.18 — Á + eyebrow appear
      tl.to(
        aRef.current,
        { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.18 },
        0
      ).to(
        eyebrowRef.current,
        { opacity: 1, y: 0, duration: 0.18 },
        0
      ).to(
        [glow1Ref.current, glow2Ref.current, cordRef.current],
        { opacity: 1, duration: 0.18 },
        0
      );

      // Tilde trigger flag at progress 0.20 (one-shot CSS keyframe)
      tl.call(() => setAccentTriggered(true), [], 0.20);

      // pC 0.28→0.44 — slogan line 1 PÁDEL
      tl.to(
        slogan1Ref.current,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 },
        0.28
      );
      // pD 0.36→0.52 — slogan line 2 CON
      tl.to(
        slogan2Ref.current,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 },
        0.36
      );
      // pE 0.44→0.60 — slogan line 3 Acento
      tl.to(
        slogan3Ref.current,
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.16 },
        0.44
      );

      // pF 0.55→0.68 — gold hairline width grows
      tl.fromTo(
        hairlineRef.current,
        { width: 0 },
        { width: 240, duration: 0.13 },
        0.55
      );

      // pG 0.50→0.76 — manifesto lines staggered (3 lines, dejando margen para leer)
      manifestoRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = 0.50 + i * 0.07;
        tl.to(el, { opacity: 1, y: 0, duration: 0.14 }, start);
      });

      // Dwell 0.76→0.86 — todo visible, sin animaciones, solo lectura
      // pOutro 0.86→1.00 — el manifesto NO se mueve, sólo va perdiendo peso
      // (opacity baja gradualmente). La siguiente sección, solapada por margen
      // negativo, gana peso al mismo tiempo. No hay velo ni wipe.
      // Outro fade is handled imperatively in the cord ScrollTrigger below

      // ── Parallax depth layers (independent ScrollTriggers, run constantly) ──
      gsap.to(glow1Ref.current, {
        yPercent: -18,
        ease: "none",
        scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(glow2Ref.current, {
        yPercent: 22,
        ease: "none",
        scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(perspectiveRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.fromTo(
        vignetteRef.current,
        { opacity: 0.35 },
        {
          opacity: 0.65,
          ease: "none",
          scrollTrigger: { trigger: container, start: "top top", end: "bottom top", scrub: true },
        }
      );
    },
    { scope: containerRef }
  );

  // Cord clip-path needs to map directly to ScrollTrigger progress (not through TL).
  useGSAP(
    () => {
      const container = containerRef.current;
      const cord = cordRef.current;
      const fadeOverlay = fadeOverlayRef.current;
      if (!container || !cord) return;
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          cord.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`;
          // Outro fade: 0.86→1.0 — overlay fades to black
          if (fadeOverlay) {
            const fadeP = p <= 0.86 ? 0 : Math.min(1, (p - 0.86) / 0.14);
            fadeOverlay.style.opacity = String(fadeP);
          }
        },
      });
      return () => st.kill();
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative bg-[var(--bk)] overflow-clip"
      style={{ height: "320vh" }}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        {/* DEPTH LAYER 0 — perspective floor lines (very subtle, suggests court horizon) */}
        <div
          ref={perspectiveRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, transparent 55%, rgba(220,175,100,0.025) 65%, transparent 85%), repeating-linear-gradient(180deg, transparent 0px, transparent 78px, rgba(220,175,100,0.018) 79px, transparent 80px)",
            maskImage:
              "radial-gradient(ellipse 60% 45% at 50% 75%, black 0%, transparent 70%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 45% at 50% 75%, black 0%, transparent 70%)",
          }}
        />

        {/* DEPTH LAYER 1 — radial vignette (focuses eye, deepens void) */}
        <div
          ref={vignetteRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 70% 60% at 50% 50%, transparent 20%, rgba(0,0,0,0.70) 70%, #000 100%)",
            opacity: 0.55,
          }}
        />

        {/* DEPTH LAYER 2 — film grain SVG noise (visible texture) */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
            backgroundSize: "180px 180px",
            opacity: 0.16,
          }}
        />

        {/* Ambient breathing glow — continuous slow pulse behind everything */}
        <div
          ref={glow1Ref}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 30% 50%, rgba(220,175,100,0.22) 0%, transparent 65%)",
            opacity: 0,
            animation: "ambientPulse 6s ease-in-out infinite",
            transformOrigin: "30% 50%",
          }}
        />

        {/* Secondary ambient layer — offset so the breath isn't symmetric */}
        <div
          ref={glow2Ref}
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 45% 45% at 75% 60%, rgba(220,175,100,0.16) 0%, transparent 70%)",
            opacity: 0,
            animation: "ambientPulse 8s ease-in-out infinite 1.5s",
            transformOrigin: "75% 60%",
          }}
        />

        {/* Vertical scroll cord — right edge, descends with progress (set imperatively) */}
        <div
          ref={cordRef}
          aria-hidden
          className="absolute top-0 right-8 max-[960px]:right-4 w-px pointer-events-none hidden sm:block"
          style={{
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(220,175,100,.55) 15%, rgba(220,175,100,.55) 85%, transparent 100%)",
            clipPath: "inset(0 0 100% 0)",
            opacity: 0,
          }}
        />

        <div data-manifesto-content className="relative w-full max-w-[1400px] mx-auto px-12 max-[960px]:px-6 grid grid-cols-[1.1fr_1fr] gap-16 items-center max-[960px]:grid-cols-1 max-[960px]:gap-8">
          {/* ── LEFT: Giant Á ── */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative inline-block"
              style={{
                fontSize: "clamp(190px, 28vw, 380px)",
                lineHeight: 1,
              }}
            >
              {/* The A (base letter) — padding in em so glyph has breathing room */}
              <span
                ref={aRef}
                className="j3-grad-text font-bold block select-none"
                style={{
                  fontSize: "1em",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.25,
                  paddingTop: "0.15em",
                  paddingBottom: "0.28em",
                  paddingLeft: "0.08em",
                  paddingRight: "0.08em",
                  opacity: 0,
                  transform: "scale(0.92)",
                  transformOrigin: "center center",
                  filter: "blur(10px)",
                }}
              >
                A
              </span>

              {/* The acute accent — CSS-keyframe fall + bounce + settle */}
              <span
                aria-hidden
                className="absolute pointer-events-none"
                style={{
                  left: "50%",
                  top: "0.34em",
                  width: "0.18em",
                  height: "0.075em",
                  background:
                    "linear-gradient(135deg, #dcaf64 0%, #fff1b4 50%, #dcaf64 100%)",
                  borderRadius: "0.015em",
                  transformOrigin: "center center",
                  transform: "translate(-50%, -700%) rotate(-60deg)",
                  opacity: 0,
                  animation: accentTriggered
                    ? "accentFallBounce 1.7s cubic-bezier(.32,.72,.38,1) 0.15s both"
                    : "none",
                }}
              />
            </div>
          </div>

          {/* ── RIGHT: Slogan + manifiesto ── */}
          <div>
            {/* Eyebrow */}
            <span
              ref={eyebrowRef}
              className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-6 block max-[960px]:text-[11px] max-[960px]:tracking-[3px] max-[960px]:mb-4"
              style={{ opacity: 0, transform: "translateY(14px)" }}
            >
              {eyebrow}
            </span>

            {/* Slogan — three lines */}
            <h2 className="font-bold uppercase tracking-[-3px] leading-[0.92] mb-10 max-[960px]:mb-6">
              <span
                ref={slogan1Ref}
                className="j3-grad-text block text-[clamp(48px,7vw,110px)]"
                style={{ opacity: 0, transform: "translateY(60px)", filter: "blur(8px)" }}
              >
                {slogan[0]}
              </span>
              <span
                ref={slogan2Ref}
                className="j3-stroke block text-[clamp(48px,7vw,110px)]"
                style={{ opacity: 0, transform: "translateY(60px)", filter: "blur(8px)" }}
              >
                {slogan[1]}
              </span>
              <span
                ref={slogan3Ref}
                className="block text-[clamp(48px,7vw,110px)] text-[var(--wh)] font-[var(--font-serif)] italic normal-case tracking-[-1px]"
                style={{ opacity: 0, transform: "translateY(60px)", filter: "blur(8px)" }}
              >
                {slogan[2]}
              </span>
            </h2>

            {/* Gold hairline */}
            <div
              ref={hairlineRef}
              className="h-px bg-gradient-to-r from-[var(--g1)] via-[var(--g1)]/40 to-transparent mb-8 max-[960px]:mb-5"
              style={{ width: 0 }}
            />

            {/* Manifesto — 3 lines with diff. weight/pace (setup → punch → closer) */}
            <div className="flex flex-col gap-3 max-w-[560px]">
              {manifesto.map((line, i) => {
                const styles =
                  i === 0
                    ? "text-[clamp(15px,1.4vw,19px)] text-[var(--gy2)] leading-[1.55] font-light"
                    : i === 1
                    ? "text-[clamp(18px,1.7vw,24px)] text-[var(--wh)] leading-[1.35] font-medium tracking-[-0.2px]"
                    : "text-[clamp(15px,1.4vw,19px)] italic text-[var(--g1)]/85 leading-[1.5] font-light";
                return (
                  <p
                    key={i}
                    ref={el => { manifestoRefs.current[i] = el; }}
                    className={styles}
                    style={{
                      fontFamily: i === 2 ? "var(--font-serif)" : undefined,
                      opacity: 0,
                      transform: "translateY(18px)",
                    }}
                  >
                    {line}
                  </p>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fade-to-black overlay — covers content during outro phase */}
        <div
          ref={fadeOverlayRef}
          aria-hidden
          className="absolute inset-0 pointer-events-none z-50"
          style={{ background: "var(--bk)", opacity: 0 }}
        />
      </div>
    </div>
  );
}

/* ───────── TIMELINE SECTION (scroll-driven) ───────── */

function TimelineSection() {
  const { t } = useI18n();
  const timeline = t.story.timeline.entries;
  const eras = t.story.timeline.eras;
  // Map era indices: entry 0→era[0], entry 3→era[1], entry 6→era[2], entry 12→era[3]
  const eraMap: Record<number, string> = { 0: eras[0], 3: eras[1], 6: eras[2], 14: eras[3] };

  const sectionRef = useRef<HTMLDivElement>(null);
  const headerEntryRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [inView, setInView] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(timeline.length).fill(false));
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null); };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [lightbox]);

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

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      // ── Header "gana peso" durante el solapamiento con el manifesto ──
      // Scrubbed: desde que el header entra por abajo hasta que llega al centro
      // de la viewport va de (opacity 0, scale .92, blur 14, y 40) a su estado
      // final. Esto coincide en el tiempo con el fade-out del manifesto.
      const headerST = headerEntryRef.current
        ? gsap.to(headerEntryRef.current, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: headerEntryRef.current,
              start: "top bottom",
              end: "top 35%",
              scrub: 0.6,
            },
          })
        : null;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          const wH = window.innerHeight;
          const firstEl = itemRefs.current[0];
          const lastEl = itemRefs.current[timeline.length - 1];
          if (!firstEl || !lastEl) return;
          const firstRect = firstEl.getBoundingClientRect();
          const lastRect = lastEl.getBoundingClientRect();

          // Is timeline in view?
          const firstItemVisible = firstRect.top < wH * 0.8;
          const lastItemPassed = lastRect.top < wH * 0.35;
          setInView(firstItemVisible && !lastItemPassed);

          // Scroll progress through timeline
          const start = firstRect.top;
          const end = lastRect.bottom;
          const total = end - start;
          const scrolled = wH * 0.5 - start;
          setScrollProgress(Math.max(0, Math.min(1, scrolled / total)));

          // Active item (last past viewport center)
          let active = -1;
          for (let i = 0; i < timeline.length; i++) {
            const el = itemRefs.current[i];
            if (el && el.getBoundingClientRect().top < wH * 0.55) active = i;
          }
          setActiveIndex(active);
        },
      });
      return () => {
        st.kill();
        headerST?.scrollTrigger?.kill();
      };
    },
    { scope: sectionRef, dependencies: [timeline.length] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative px-4 sm:px-6 md:px-12 pb-[72px] md:pb-[100px] overflow-visible z-10"
      style={{ marginTop: "-60vh" }}
    >
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
                <span className="text-[8px] max-[960px]:text-[10px] font-bold tracking-[2px] uppercase text-[var(--g1)]/70 whitespace-nowrap">{era}</span>
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
            <div className="bg-black border-b border-white/[.06] backdrop-blur-md">
              {/* Era + year */}
              {activeIndex >= 0 && (
                <div className="flex items-center justify-between px-4 py-[6px]">
                  <span className="text-[8px] max-[960px]:text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]">{currentEra}</span>
                  <span className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[2px] text-white/50">{currentYear}</span>
                </div>
              )}
              {/* Progress bar — at the bottom of the banner */}
              <div className="h-[5px] w-full bg-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] rounded-full shadow-[0_0_8px_rgba(220,175,100,0.4)]"
                  style={{ width: `${scrollProgress * 100}%`, transition: "width .15s linear" }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* Header — scrub-driven entry; "gana peso" mientras el manifesto anterior
          se va desvaneciendo. Empieza con opacity 0, scale .92 y blur 14px,
          y converge a su estado final cuando la sección entra en la vista. */}
      <div
        ref={headerEntryRef}
        className="pt-20 pb-[60px] max-[640px]:pt-14 max-[640px]:pb-10 will-change-transform"
        style={{
          opacity: 0,
          transform: "translateY(40px) scale(0.92)",
          filter: "blur(14px)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[960px]:text-[12px] max-[960px]:tracking-[3px] max-[640px]:text-[9px] max-[640px]:tracking-[3px]">{t.story.timeline.sectionLabel}</span>
        <h2 className="font-bold text-[clamp(28px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
          {t.story.timeline.heading1} <span className="j3-grad-text">{t.story.timeline.heading2}</span>
        </h2>
      </div>

      <div className="relative pl-8 max-[640px]:pl-4 w-full max-w-[1180px] mx-auto break-words">
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
                    <span className="text-[9px] font-bold tracking-[4px] uppercase text-[var(--g1)]/70 max-[960px]:text-[10px] max-[640px]:text-[8px] max-[640px]:tracking-[2.5px]">{era}</span>
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
                <div className={item.image ? "min-[960px]:flex min-[960px]:gap-10 min-[960px]:items-start" : ""}>
                  <div className={item.image ? "min-[960px]:flex-1 min-[960px]:min-w-0" : ""}>
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
                  {item.image && (
                    <button
                      type="button"
                      onClick={() => setLightbox({ src: item.image!, alt: item.title })}
                      className="relative mt-4 min-[960px]:mt-0 min-[960px]:flex-shrink-0 w-full max-w-[420px] min-[960px]:w-[340px] min-[1280px]:w-[400px] max-[640px]:max-w-full overflow-hidden rounded-sm border border-white/[.08] aspect-[16/9] cursor-zoom-in group/img block"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80 group-hover/img:opacity-100 group-hover/img:scale-[1.03] transition-all duration-500"
                        style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/90 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300" aria-hidden="true">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10 cursor-zoom-out animate-[fadeIn_.25s_ease-out]"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.alt}
        >
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-full object-contain shadow-[0_30px_80px_rgba(0,0,0,.6)]"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md flex items-center justify-center text-white text-xl transition-colors"
            aria-label="Cerrar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
          <span className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[11px] font-bold tracking-[3px] uppercase text-white/60">{lightbox.alt}</span>
        </div>
      )}
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
      <span className="text-[8px] max-[960px]:text-[10px] font-bold tracking-[2px] max-[960px]:tracking-[1px] uppercase text-[var(--gy)] whitespace-nowrap ml-4 group-hover/ng:text-[var(--g1)]/80 transition-colors">
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
      <span className="text-[8px] max-[960px]:text-[10px] font-bold tracking-[2px] uppercase text-[var(--g1)]/70">{p.tag}</span>
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
      <span className="text-[8px] max-[960px]:text-[10px] font-bold tracking-[1.5px] uppercase text-[var(--gy)]/70">{p.tag}</span>
    </span>
  );
}

/* ── Photo map for team members ── */
const teamPhotos: Record<string, string> = {
  Javi: "/images/story/javi.jpeg",
  Jorge: "/images/story/jorge.jpeg",
};

/* ── Team member card ── */
function TeamCard({ m, index }: { m: { num: string; role: string; first: string; last: string; last2?: string; bio: string; quote: string }; index: number }) {
  const { ref, visible } = useReveal(0.15);
  const photo = teamPhotos[m.first];
  return (
    <div
      ref={ref}
      className="bg-[var(--bk3)] relative overflow-hidden transition-colors hover:bg-[#161616] group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : `translateX(${index === 0 ? "-40" : "40"}px)`,
        transition: `all .8s cubic-bezier(.16,1,.3,1) ${index * 0.15}s`,
      }}
    >
      {/* Photo */}
      {photo && (
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <img
            src={photo}
            alt={`${m.first} ${m.last}`}
            className="absolute inset-0 w-full h-full object-cover object-[center_25%] transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bk3)] via-transparent to-transparent" />
          <span className="absolute top-6 right-6 font-bold text-[80px] max-[640px]:text-[60px] text-white/[.08] leading-[1] tracking-[-3px]">{m.num}</span>
        </div>
      )}

      {/* Content */}
      <div className="p-14 max-[960px]:p-10 max-[640px]:p-6 relative">
        {!photo && <span className="absolute top-8 right-10 max-[640px]:top-4 max-[640px]:right-4 font-bold text-[80px] max-[640px]:text-[60px] text-white/[.03] leading-[1] tracking-[-3px] transition-all duration-700 group-hover:text-white/[.06] group-hover:scale-110">{m.num}</span>}
        <span className="text-[10px] font-normal tracking-[4px] uppercase text-[var(--g1)] mb-4 block">{m.role}</span>
        <h3 className="font-bold text-[clamp(28px,4vw,52px)] uppercase tracking-[-1.5px] leading-[.92] mb-5">
          <span className="j3-grad-text">{m.first}</span>
          <span className="text-[var(--wh)]"> {m.last}</span>
          {m.last2 && <span className="j3-stroke-gold font-[var(--font-serif)] italic normal-case tracking-[-0.5px] ml-[0.08em]">{m.last2}</span>}
        </h3>
        <p className="text-[14px] max-[640px]:text-[13px] font-light text-[var(--gy2)] leading-[1.8] max-w-[420px] mb-7">{m.bio}</p>
        <blockquote className="text-[20px] max-[640px]:text-[18px] italic text-[var(--wh)] leading-[1.4] border-l-2 border-[var(--g1)] pl-5 opacity-85 transition-all group-hover:pl-7" style={{ fontFamily: "var(--font-serif)" }}>
          &ldquo;{m.quote}&rdquo;
        </blockquote>
      </div>
    </div>
  );
}

/* ── Higuer\u00F3n hero + lesson aside ── */
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

      {/* Higuer\u00F3n — hero card */}
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
            <span className="text-[var(--wh)]">{"Higuer\u00F3n"}</span>
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

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;
      const st = ScrollTrigger.create({
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        onUpdate: () => {
          const rect = container.getBoundingClientRect();
          const windowH = window.innerHeight;
          const totalH = container.scrollHeight;
          const scrolled = -rect.top + windowH * 0.15;
          const animRange = totalH - windowH;
          setProgress(Math.max(0, Math.min(1, scrolled / animRange)));
        },
      });
      return () => st.kill();
    },
    { scope: containerRef }
  );

  // Phase 1 (0-30%): Main quote line 1
  const p1 = Math.min(1, progress / 0.3);
  // Phase 2 (25-55%): Main quote line 2 (gold)
  const p2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.3));
  // Phase 3 (55-80%): Gold line + supporting text
  const p3 = Math.max(0, Math.min(1, (progress - 0.55) / 0.25));
  // Phase 4 (75-100%): Tagline details
  const p4 = Math.max(0, Math.min(1, (progress - 0.75) / 0.25));

  const canteraLines = t.story.impact.cantera;
  const canteraDelays = [0.25, 0.30, 0.35, 0.40];

  return (
    <div ref={containerRef} className="relative bg-[var(--bk)] -mt-[12vh]" style={{ height: "200vh" }}>
      <div className="sticky top-0 h-screen flex items-center justify-center pt-[52px] max-[960px]:pt-[52px]">
        {/* Subtle radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse 70% 50% at 50% 50%, rgba(220,175,100,${0.04 * p3}) 0%, transparent 70%)` }}
        />

        <div className="w-full max-w-[1100px] px-12 max-[960px]:px-5 text-center">
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
                  className={`block py-[4px] text-[clamp(15px,1.5vw,17px)] max-[960px]:text-[16px] tracking-[0.3px] leading-[1.5] ${
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
                  className="block mt-3 font-bold text-[clamp(18px,2vw,22px)] max-[960px]:text-[20px] text-[var(--wh)] italic tracking-[-0.3px]"
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

          {/* Proud label — statement */}
          {(() => {
            const sepP = Math.max(0, Math.min(1, (p3 - 0.18) / 0.35));
            return (
              <div className="mt-10 max-[960px]:mt-8" style={{ opacity: sepP, transform: `translateY(${(1 - sepP) * 16}px)` }}>
                <div className="flex justify-center mb-3">
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent" style={{ width: `${sepP * 100}%`, maxWidth: "200px", opacity: 0.5 }} />
                </div>
                <span className="block text-center font-bold text-[clamp(13px,1.4vw,16px)] max-[960px]:text-[14px] tracking-[3px] max-[960px]:tracking-[2px] uppercase j3-grad-text">{t.story.impact.proudLabel}</span>
              </div>
            );
          })()}

          {/* Block 2 — cantera interactive steps */}
          <div className="mt-8 max-[960px]:mt-6 relative flex flex-col items-start max-w-[460px] mx-auto pl-10 max-[960px]:pl-8" style={{ opacity: p3 > 0.05 ? 1 : 0, transition: "opacity .4s ease" }}>
            {/* Vertical progress line */}
            {(() => {
              const lineProgress = Math.max(0, Math.min(1, (p3 - 0.22) / 0.5));
              return (
                <div className="absolute left-[14px] max-[960px]:left-[10px] top-[6px] bottom-[6px] w-[2px] bg-white/[.06] rounded-full overflow-hidden">
                  <div
                    className="w-full bg-gradient-to-b from-[var(--g1)] to-[var(--g2)] rounded-full transition-none"
                    style={{ height: `${lineProgress * 100}%` }}
                  />
                </div>
              );
            })()}

            {canteraLines.map((text, i) => {
              const stepP = Math.max(0, Math.min(1, (p3 - canteraDelays[i]) / 0.35));
              const isLast = i === canteraLines.length - 1;
              const stepNum = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={i}
                  className={`relative flex items-start gap-4 max-[960px]:gap-3 ${i > 0 ? "mt-5 max-[960px]:mt-4" : ""}`}
                  style={{
                    opacity: stepP,
                    transform: `translateX(${(1 - stepP) * 20}px)`,
                    filter: `blur(${(1 - stepP) * 3}px)`,
                  }}
                >
                  {/* Step dot */}
                  <div className="absolute -left-10 max-[960px]:-left-8 top-[5px] flex items-center justify-center">
                    <div
                      className="w-[10px] h-[10px] rounded-full border transition-all duration-500"
                      style={{
                        borderColor: stepP > 0.5 ? "var(--g1)" : "rgba(255,255,255,.12)",
                        background: stepP > 0.8 ? "rgba(220,175,100,.2)" : "transparent",
                        boxShadow: stepP > 0.8 ? "0 0 8px rgba(220,175,100,.15)" : "none",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <span
                      className={`block text-left leading-[1.6] max-[960px]:leading-[1.65] ${
                        isLast
                          ? "text-[clamp(15px,1.5vw,18px)] max-[960px]:text-[16px] italic text-[var(--wh)]"
                          : "text-[clamp(13px,1.3vw,15px)] max-[960px]:text-[15px] font-light text-[var(--gy2)]"
                      }`}
                      style={isLast ? { fontFamily: "var(--font-serif)" } : undefined}
                    >
                      {text}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* "Nuestra historia" — bridge to timeline */}
          {(() => {
            const hP = Math.max(0, (p4 - 0.2) / 0.8);
            return (
              <div className="mt-10 max-[960px]:mt-8 flex flex-col items-center" style={{ opacity: hP, transform: `translateY(${(1 - hP) * 10}px)` }}>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mb-5" style={{ width: `${hP * 100}%`, maxWidth: "280px", opacity: 0.6 }} />
                <span className="font-bold text-[clamp(14px,1.5vw,18px)] max-[960px]:text-[15px] tracking-[6px] max-[960px]:tracking-[4px] uppercase text-[var(--wh)]/80">
                  {t.story.impact.historyLabel}
                </span>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mt-5" style={{ width: `${hP * 100}%`, maxWidth: "280px", opacity: 0.6 }} />
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

/* ───────── PAGE ───────── */

/* ───────── J3 BALL LOGO (pelota + 3 rayas) ───────── */
/* Extracted from logo-gold.svg — only the ball portion, normalised to viewBox 0 0 150 155 */

const J3_BALL_OUTER = "M74.13,0c-99.18,1.72-98.49,148.91-.03,150.44,99.53-2.75,98.92-148.04.03-150.44Z";
const J3_BALL_OUTER_INNER = "M131.88,86.77c-14.47,68.36-115.43,59.57-116.69-11.57C17.88-9.88,145.93,2.79,131.88,86.77Z";
const J3_BALL_STRIPE_1 = "M68.83,30.97c-19.79,1.66-37.93,20.27-39.09,40.06,25.38-.94,49.5,23.19,48.56,48.56,19.79-1.16,38.4-19.3,40.06-39.09-12.75.21-25.57-4.53-35.29-14.25-9.71-9.71-14.45-22.54-14.25-35.29Z";
const J3_BALL_STRIPE_2 = "M77.28,30.77c-1.47,21.83,19.47,42.76,41.29,41.29-.69-20.97-20.33-40.6-41.29-41.29Z";
const J3_BALL_STRIPE_3 = "M29.75,79.48c1.21,20.15,19.96,38.91,40.12,40.11.75-20.96-19.16-40.87-40.12-40.11Z";

/* 3 vertical "leg" lines below the ball — extracted from logo-gold.svg */
const J3_LEG_LEFT = "M24.26,200.51h25.34l9.18-43.08c-8.22-1.53-16.18-4.32-23.59-8.23l-10.93,51.31Z";
const J3_LEG_CENTER = "M70.55,158.77l-8.88,41.75h25.33l9.52-44.72c-7.26,2.02-14.8,3.09-22.42,3.09-1.18,0-2.37-.07-3.55-.12Z";
const J3_LEG_RIGHT = "M127.02,140.02c-5.36,4.38-11.23,8.04-17.44,10.95l-10.53,49.56,25.35-.02,15.69-73.91c-3.83,4.92-8.2,9.44-13.07,13.42Z";

/* Circle circumference for stroke-dasharray draw-in animation */
const CIRCLE_R = 72;
const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * CIRCLE_R;

/* ───────── FLYING ACCENT ───────── */

const TOTAL_FRAMES = 97;

function FlyingAccent({ flyT, fadeOutT }: { flyT: number; fadeOutT: number; heroAccentRef: React.RefObject<HTMLSpanElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const [framesLoaded, setFramesLoaded] = useState(false);

  // Preload all frame images on mount
  useEffect(() => {
    let loaded = 0;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = `/videos/frames/f${String(i).padStart(3, "0")}.jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === TOTAL_FRAMES) {
          framesRef.current = images;
          setFramesLoaded(true);
        }
      };
      images.push(img);
    }
  }, []);

  // Draw current frame to canvas based on flyT
  useEffect(() => {
    if (!framesLoaded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Map flyT 0.12→0.88 to frames (matches fade in/out timing)
    const videoProgress = Math.max(0, Math.min(1, (flyT - 0.12) / 0.73));
    const frameIndex = Math.min(TOTAL_FRAMES - 1, Math.floor(videoProgress * (TOTAL_FRAMES - 1)));
    const img = framesRef.current[frameIndex];
    if (!img) return;

    if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
    if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
  }, [flyT, framesLoaded]);

  if (typeof window !== "undefined" && window.innerWidth < 960) return null;

  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  // ── Black bg overlay — fades in with video, fades out with logo ──
  const bgFadeIn = clamp((flyT - 0.01) / 0.08);
  const bgBlackOp = flyT <= 0 ? 0 : bgFadeIn * (1 - fadeOutT);

  // ── Video canvas opacity — fades in, then fades out (canvas only) ──
  const videoFadeIn = clamp((flyT - 0.12) / 0.10);
  const videoFadeOut = clamp((flyT - 0.92) / 0.07);
  const videoOp = flyT <= 0 ? 0 : videoFadeIn * (1 - videoFadeOut);

  // ── SVG overlay opacity — fades in with video but STAYS visible ──
  const svgOp = flyT <= 0 ? 0 : videoFadeIn;

  const showBg = bgBlackOp > 0.01;
  const showVideo = videoOp > 0.01;

  /* ── SVG stripe animation ──
     Ball position in 960×540 frame coords: center (479, 266), radius ~123
     SVG path coords: ball center ~(74, 75), radius 72
     Scale: 123/72 ≈ 1.708
     Translate: (479 - 74*1.708, 266 - 75*1.708) ≈ (352.6, 137.9)
  */
  const BALL_SCALE = 1.708;
  const BALL_TX = 352.6;
  const BALL_TY = 137.9;

  /* ── Interior stripes — assemble BEFORE the flash (flyT 0.62 → 0.74) ── */
  // Stripe 3 (bottom-left) from left, stripe 2 (top-right) from right, stripe 1 (big cross) from bottom
  const s3P = clamp((flyT - 0.62) / 0.10);  // starts first
  const s2P = clamp((flyT - 0.64) / 0.10);  // starts second
  const s1P = clamp((flyT - 0.66) / 0.10);  // starts last (biggest)

  const s3E = 1 - Math.pow(1 - s3P, 3);
  const s2E = 1 - Math.pow(1 - s2P, 3);
  const s1E = 1 - Math.pow(1 - s1P, 3);

  const s3Tx = (1 - s3E) * -90;   // from left
  const s2Tx = (1 - s2E) * 90;    // from right
  const s1Ty = (1 - s1E) * 90;    // from bottom

  const showStripes = svgOp > 0.01 && s3P > 0.01;

  /* ── 3 vertical legs — animate AFTER the flash (flyT 0.78 → 0.92) ── */
  const legProgress = clamp((flyT - 0.78) / 0.14);

  const legLeftP   = clamp((flyT - 0.78) / 0.11);
  const legRightP  = clamp((flyT - 0.80) / 0.11);
  const legCenterP = clamp((flyT - 0.82) / 0.11);

  const legLeftE   = 1 - Math.pow(1 - legLeftP, 3);
  const legRightE  = 1 - Math.pow(1 - legRightP, 3);
  const legCenterE = 1 - Math.pow(1 - legCenterP, 3);

  const legLeftTx   = (1 - legLeftE) * -60;
  const legRightTx  = (1 - legRightE) * 60;
  const legCenterTy = (1 - legCenterE) * 70;

  const showLegs = svgOp > 0.01 && legProgress > 0.01;

  // ── SVG logo fade out via fadeOutT ──
  const logoFinalOp = 1 - fadeOutT;

  return (
    <>
      {/* Scroll-driven frame sequence — canvas renders preloaded images */}
      <div
        className="fixed inset-0 z-[60] pointer-events-none hidden min-[960px]:flex items-center justify-center"
        style={{
          opacity: showVideo ? videoOp : 0,
          willChange: "opacity",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
          style={{ background: "#000" }}
        />
      </div>

      {/* SVG logo assembly — stripes, ring, legs + contour glow */}
      {(showStripes || showLegs) && (
        <div
          className="fixed inset-0 z-[61] pointer-events-none hidden min-[960px]:flex items-center justify-center"
          style={{
            opacity: svgOp * logoFinalOp,
            willChange: "opacity",
          }}
        >
          <svg
            viewBox="0 0 960 540"
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full"
            style={{ position: "absolute", inset: 0 }}
          >
            <defs>
              <linearGradient id="stripe-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#eddb7e" />
                <stop offset="30%" stopColor="#fff1b4" />
                <stop offset="60%" stopColor="#eede80" />
                <stop offset="100%" stopColor="#dcaf64" />
              </linearGradient>
              {/* Soft glow for contour */}
              <filter id="glow-soft" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="14" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                </feMerge>
              </filter>
              {/* Clip to ball circle */}
              <clipPath id="ball-clip">
                <circle cx={74} cy={75} r={72} transform={`translate(${BALL_TX}, ${BALL_TY}) scale(${BALL_SCALE})`} />
              </clipPath>
            </defs>

            {/* ═══ GLOW LAYER — traces every contour of the logo ═══ */}
            {(() => {
              // Glow appears as pieces assemble, peaks during transition, fades when complete
              const glowIn = clamp((flyT - 0.62) / 0.08);     // starts with first stripe
              const glowPeak = clamp((flyT - 0.88) / 0.03);   // peaks at ring transition
              const glowOut = clamp((flyT - 0.94) / 0.04);    // fades after everything settles
              const glowOp = glowIn * (1 - glowOut) * (0.3 + glowPeak * 0.4);
              if (glowOp < 0.01) return null;
              return (
                <g filter="url(#glow-soft)" opacity={glowOp}>
                  {/* Glow: Ball outer ring */}
                  <path
                    d={J3_BALL_OUTER}
                    fill="none"
                    stroke="#fff1b4"
                    strokeWidth={4}
                    transform={`translate(${BALL_TX}, ${BALL_TY}) scale(${BALL_SCALE})`}
                  />
                  {/* Glow: Inner circle */}
                  <path
                    d={J3_BALL_OUTER_INNER}
                    fill="none"
                    stroke="#fff1b4"
                    strokeWidth={3}
                    transform={`translate(${BALL_TX}, ${BALL_TY}) scale(${BALL_SCALE})`}
                  />
                  {/* Glow: Interior stripes */}
                  <g clipPath="url(#ball-clip)">
                    <path d={J3_BALL_STRIPE_3} fill="#fff1b4"
                      transform={`translate(${BALL_TX + s3Tx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                      opacity={s3E} />
                    <path d={J3_BALL_STRIPE_2} fill="#fff1b4"
                      transform={`translate(${BALL_TX + s2Tx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                      opacity={s2E} />
                    <path d={J3_BALL_STRIPE_1} fill="#fff1b4"
                      transform={`translate(${BALL_TX}, ${BALL_TY + s1Ty * BALL_SCALE}) scale(${BALL_SCALE})`}
                      opacity={s1E} />
                  </g>
                  {/* Glow: Legs */}
                  <path d={J3_LEG_LEFT} fill="#fff1b4"
                    transform={`translate(${BALL_TX + legLeftTx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                    opacity={legLeftE} />
                  <path d={J3_LEG_RIGHT} fill="#fff1b4"
                    transform={`translate(${BALL_TX + legRightTx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                    opacity={legRightE} />
                  <path d={J3_LEG_CENTER} fill="#fff1b4"
                    transform={`translate(${BALL_TX}, ${BALL_TY + legCenterTy * BALL_SCALE}) scale(${BALL_SCALE})`}
                    opacity={legCenterE} />
                </g>
              );
            })()}

            {/* ═══ SOLID LAYER — the actual logo pieces ═══ */}

            {/* Ball outer ring — fades in at transition */}
            <g
              transform={`translate(${BALL_TX}, ${BALL_TY}) scale(${BALL_SCALE})`}
              opacity={clamp((flyT - 0.89) / 0.04)}
            >
              <path d={J3_BALL_OUTER} fill="url(#stripe-gold)" />
              <path d={J3_BALL_OUTER_INNER} fill="#000" />
            </g>

            {/* Interior stripes — clipped to ball */}
            <g clipPath="url(#ball-clip)">
              <path d={J3_BALL_STRIPE_3} fill="url(#stripe-gold)"
                transform={`translate(${BALL_TX + s3Tx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                opacity={s3E} />
              <path d={J3_BALL_STRIPE_2} fill="url(#stripe-gold)"
                transform={`translate(${BALL_TX + s2Tx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
                opacity={s2E} />
              <path d={J3_BALL_STRIPE_1} fill="url(#stripe-gold)"
                transform={`translate(${BALL_TX}, ${BALL_TY + s1Ty * BALL_SCALE}) scale(${BALL_SCALE})`}
                opacity={s1E} />
            </g>

            {/* Legs */}
            <path d={J3_LEG_LEFT} fill="url(#stripe-gold)"
              transform={`translate(${BALL_TX + legLeftTx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
              opacity={legLeftE} />
            <path d={J3_LEG_RIGHT} fill="url(#stripe-gold)"
              transform={`translate(${BALL_TX + legRightTx * BALL_SCALE}, ${BALL_TY}) scale(${BALL_SCALE})`}
              opacity={legRightE} />
            <path d={J3_LEG_CENTER} fill="url(#stripe-gold)"
              transform={`translate(${BALL_TX}, ${BALL_TY + legCenterTy * BALL_SCALE}) scale(${BALL_SCALE})`}
              opacity={legCenterE} />
          </svg>
        </div>
      )}

      {/* Black background overlay */}
      {showBg && (
        <div
          className="fixed inset-0 z-[59] pointer-events-none hidden min-[960px]:block"
          style={{ background: "#000", opacity: bgBlackOp, willChange: "opacity" }}
        />
      )}
    </>
  );
}

export default function StoryPage() {
  const { t } = useI18n();

  /* ── Build i18n-aware player arrays ── */
  const playersHero = playerHeroNames.map((n, i) => ({
    ...n,
    info: t.story.players.heroPlayers[i].info,
    tag: t.story.players.heroPlayers[i].tag,
  }));
  const playersNextGen = playerNextGenNames.map((n, i) => ({
    ...n,
    tag: t.story.players.nextGenTags[i],
  }));
  const playersNextGenPro = playerNextGenProNames.map((n, i) => ({
    ...n,
    tag: t.story.players.nextGenProTags[i],
  }));
  const playersFeatured = playerFeaturedNames.map((n, i) => ({
    ...n,
    info: t.story.players.featuredPlayers[i].info,
    tag: t.story.players.featuredPlayers[i].tag,
  }));
  const playersShared = playerSharedNames.map((n, i) => ({
    ...n,
    tag: t.story.players.sharedTags[i],
  }));

  /* Hero parallax + pin for flying accent */
  const heroRef = useRef<HTMLDivElement>(null);
  const heroAccentRef = useRef<HTMLSpanElement>(null);
  const flyingAccentRef = useRef<HTMLDivElement>(null);
  const [heroY, setHeroY] = useState(0);
  const [heroOp, setHeroOp] = useState(1);
  const [flyT, setFlyT] = useState(0); // 0 = at hero, 1 = logo complete
  const [fadeOutT, setFadeOutT] = useState(0); // 0 = visible, 1 = faded out
  const bridgeLockRef = useRef(false); // true while bridge animation is playing
  const bridgeLockFiredRef = useRef(false); // ensures lock fires only once
  const bridgeLockY = useRef(0); // scrollY to lock to
  // Court reveal refs (inside hero pin)
  const bridgeTextRef = useRef<HTMLDivElement>(null);
  const courtBoxRef = useRef<HTMLDivElement>(null);
  const courtLinesRef = useRef<(SVGElement | null)[]>([]);
  const courtInitRef = useRef(false); // stroke-width set once

  /* Hard scroll-lock for bridge animation: pins scrollY via rAF + event suppression */
  useEffect(() => {
    let rafId = 0;
    const clampScroll = () => {
      if (bridgeLockRef.current) {
        window.scrollTo(0, bridgeLockY.current);
        rafId = requestAnimationFrame(clampScroll);
      }
    };
    const prevent = (e: Event) => {
      if (bridgeLockRef.current) { e.preventDefault(); e.stopPropagation(); }
    };
    const preventKey = (e: KeyboardEvent) => {
      if (bridgeLockRef.current && ["ArrowDown","ArrowUp","Space","PageDown","PageUp","Home","End"].includes(e.code)) {
        e.preventDefault();
      }
    };
    const opts = { passive: false } as AddEventListenerOptions;
    window.addEventListener("wheel", prevent, opts);
    window.addEventListener("touchmove", prevent, opts);
    window.addEventListener("keydown", preventKey, opts);

    // Watch for lock activation
    const checkLock = () => {
      if (bridgeLockRef.current && !rafId) {
        rafId = requestAnimationFrame(clampScroll);
      }
    };
    const interval = setInterval(checkLock, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(interval);
      window.removeEventListener("wheel", prevent, opts);
      window.removeEventListener("touchmove", prevent, opts);
      window.removeEventListener("keydown", preventKey, opts);
    };
  }, []);

  /* Pin the hero in place while the virgulilla animation plays */
  useGSAP(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const isDesktop = typeof window !== "undefined" && window.innerWidth >= 960;

    if (isDesktop) {
      // Desktop: pin the hero while virgulilla → logo → black plays
      const TOTAL = 5800;
      const st = ScrollTrigger.create({
        trigger: hero,
        start: "top top",
        end: `+=${TOTAL}`,
        pin: true,
        pinSpacing: true,
        onUpdate: (self) => {
          const scrolled = self.progress * TOTAL;
          const bt = bridgeTextRef.current;
          const cb = courtBoxRef.current;
          const lines = courtLinesRef.current;

          // Init court stroke-width once
          if (cb && !courtInitRef.current) {
            courtInitRef.current = true;
            const vw = window.innerWidth;
            const courtW = vw <= 960 ? Math.min(vw * 0.65, 300) : Math.min(vw * 0.5, 460);
            const sw = 200 / courtW;
            lines.forEach(l => l?.setAttribute("stroke-width", String(sw)));
          }

          // Phase 1 (0-176): hero text visible
          // Phase 2 (176-1804): flyT 0→1 (video + logo)
          // Phase 3 (1804-1980): hold logo
          // Phase 4 (1980-2200): logo fade out
          // Phase 5 (2200-3100): bridge text dwell (scroll locked 2.2s for CSS anim)
          // Phase 6 (3100-3500): text implodes to center point
          // Phase 7 (3500-3700): court line appears from center
          // Phase 8 (3700-4800): court takes shape + lines draw in
          // Phase 9 (4800-5500): court expands + lines undraw
          // Phase 10 (5500-5800): hold black

          if (scrolled <= 176) {
            setFlyT(0); setHeroOp(1); setHeroY(0); setFadeOutT(0);
            if (bt) { bt.style.opacity = "0"; bt.style.transform = "scale(1)"; }
            if (cb) { cb.style.width = "0px"; cb.style.height = "2px"; cb.style.display = "flex"; }
          } else if (scrolled <= 1804) {
            const flyProgress = Math.min(1, (scrolled - 176) / 1628);
            setFlyT(flyProgress);
            const fadeProgress = Math.min(1, flyProgress / 0.20);
            setHeroOp(Math.max(0, 1 - fadeProgress));
            setHeroY(fadeProgress * 60);
            setFadeOutT(0);
          } else if (scrolled <= 1980) {
            setFlyT(1); setHeroOp(0); setFadeOutT(0);
          } else if (scrolled <= 2200) {
            setFlyT(1); setHeroOp(0);
            setFadeOutT(Math.min(1, (scrolled - 1980) / 220));
          } else if (scrolled <= 3100) {
            // Bridge dwell — text visible, scroll locked for CSS animation
            setFlyT(1); setHeroOp(0); setFadeOutT(1);
            if (bt) { bt.style.opacity = "1"; bt.style.transform = "scale(1)"; bt.style.filter = "blur(0px)"; }
            if (cb) { cb.style.width = "0px"; cb.style.height = "2px"; }
            if (!bridgeLockFiredRef.current) {
              bridgeLockFiredRef.current = true;
              bridgeLockY.current = window.scrollY;
              bridgeLockRef.current = true;
              setTimeout(() => { bridgeLockRef.current = false; }, 2200);
            }
          } else if (scrolled <= 3500) {
            // Phase 6: text implodes toward center — scale down, blur, fade
            const p6 = (scrolled - 3100) / 400;
            if (bt) {
              bt.style.opacity = String(Math.max(0, 1 - p6 * 1.5));
              bt.style.transform = `scale(${1 - p6 * 0.7})`;
              bt.style.filter = `blur(${p6 * 12}px)`;
            }
            if (cb) { cb.style.width = "0px"; cb.style.height = "2px"; }
          } else if (scrolled <= 3700) {
            // Phase 7: court thin line appears from center
            const p7 = (scrolled - 3500) / 200;
            if (bt) { bt.style.opacity = "0"; }
            if (cb) {
              const vw = window.innerWidth;
              const courtW = vw <= 960 ? Math.min(vw * 0.65, 300) : Math.min(vw * 0.5, 460);
              cb.style.transitionDuration = "0s";
              cb.style.width = `${courtW * 0.6 * p7}px`;
              cb.style.height = "2px";
              cb.style.display = "flex";
            }
            // Reset lines
            lines.forEach(l => {
              if (!l) return;
              l.classList.remove("court-draw-in", "court-draw-out");
              l.style.strokeDashoffset = String(l.style.getPropertyValue("--court-len") || getComputedStyle(l).getPropertyValue("--court-len"));
            });
          } else if (scrolled <= 4800) {
            // Phase 8: court takes shape + lines draw in progressively
            const p8 = (scrolled - 3700) / 1100;
            if (bt) { bt.style.opacity = "0"; }
            if (cb) {
              const vw = window.innerWidth;
              const isMobile = vw <= 960;
              const courtW = isMobile ? Math.min(vw * 0.65, 300) : Math.min(vw * 0.5, 460);
              const courtH = isMobile ? courtW * 1.8 : courtW * 0.5;
              const sizeP = Math.min(1, p8 / 0.3); // size reaches full by 30% of phase
              cb.style.transitionDuration = "0s";
              cb.style.width = `${courtW * 0.6 + (courtW * 0.4) * sizeP}px`;
              cb.style.height = `${2 + (courtH - 2) * sizeP}px`;
            }
            // Draw lines in based on scroll — each line has a stagger
            const delays = [0.0, 0.12, 0.22, 0.32, 0.42, 0.52];
            lines.forEach((l, i) => {
              if (!l) return;
              const len = parseFloat(getComputedStyle(l).getPropertyValue("--court-len")) || 96;
              const lineP = Math.max(0, Math.min(1, (p8 - delays[i]) / 0.35));
              l.classList.remove("court-draw-in", "court-draw-out");
              l.style.transition = "none";
              l.style.strokeDasharray = String(len);
              l.style.strokeDashoffset = String(len * (1 - lineP));
            });
          } else if (scrolled <= 5500) {
            // Phase 9: court expands to viewport + lines undraw
            const p9 = (scrolled - 4800) / 700;
            if (cb) {
              const vw = window.innerWidth;
              const isMobile = vw <= 960;
              const courtW = isMobile ? Math.min(vw * 0.65, 300) : Math.min(vw * 0.5, 460);
              const courtH = isMobile ? courtW * 1.8 : courtW * 0.5;
              const expandW = courtW + (vw - courtW) * p9;
              const expandH = courtH + ((isMobile ? vw * 2 : vw * 0.5) - courtH) * p9;
              cb.style.transitionDuration = "0s";
              cb.style.width = `${expandW}px`;
              cb.style.height = `${expandH}px`;
            }
            // Undraw lines in reverse
            const delays = [0.5, 0.4, 0.3, 0.2, 0.1, 0.0];
            lines.forEach((l, i) => {
              if (!l) return;
              const len = parseFloat(getComputedStyle(l).getPropertyValue("--court-len")) || 96;
              const lineP = Math.max(0, Math.min(1, (p9 - delays[i]) / 0.35));
              l.style.strokeDashoffset = String(len * lineP);
            });
          } else {
            // Phase 10: hold black
            if (cb) { cb.style.display = "none"; }
            if (bt) { bt.style.opacity = "0"; }
          }
        },
      });
      return () => st.kill();
    } else {
      // Mobile: simple parallax without pin (no flying accent on mobile)
      const st = ScrollTrigger.create({
        trigger: document.body,
        start: "top top",
        end: "+=600",
        onUpdate: (self) => {
          const y = self.progress * 600;
          setHeroY(y * 0.4);
          setHeroOp(Math.max(0, 1 - y / 600));
        },
      });
      return () => st.kill();
    }
  }, []);

  /* After hero pin is set up, sort + refresh all ScrollTriggers so AccentManifesto
     (and others) recalculate their positions with pinSpacing accounted for. */
  useEffect(() => {
    const timer = setTimeout(() => {
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    }, 100);
    return () => clearTimeout(timer);
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
    <main className="relative bg-[var(--bk)] text-[var(--wh)] font-sans w-full">
      {/* ── Global atmosphere: grain + vignette over the whole /story page ── */}
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 50%, transparent 25%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.85) 100%)",
        }}
      />
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none z-[1] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          backgroundSize: "200px 200px",
          opacity: 0.13,
        }}
      />

      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative h-screen min-h-[580px] flex items-end overflow-hidden bg-black">
        {/* Video background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src="https://iframe.mediadelivery.net/embed/553002/e3949095-f75b-4c0b-9490-e3b17294ab31?autoplay=true&loop=true&muted=true&controls=false&responsive=false"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-0"
            style={{
              width: "177.78vh", minWidth: "100%",
              height: "56.25vw", minHeight: "100%",
              opacity: 0.4 * Math.max(0, 1 - flyT * 1.8),   // video fades out during flying accent
              transform: `translateY(${heroY}px)`,
            }}
            allow="autoplay"
            loading="lazy"
            title="J3 Pádel Story video"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" style={{ opacity: Math.max(0, 1 - flyT * 1.8) }} />
        <div
          className="relative z-10 px-12 pb-[72px] max-[960px]:px-6 max-[960px]:pb-14 w-full"
          style={{ opacity: heroOp, transform: `translateY(${-heroY * 0.2}px)` }}
        >
          <h1 className="font-bold uppercase tracking-[-3px] overflow-visible">
            <span className="text-[clamp(24px,3.5vw,48px)] max-[960px]:text-[clamp(20px,6vw,36px)] font-light text-[var(--gy2)] tracking-[1px] block mb-0 animate-[fadeInSoft_.9s_.2s_ease_both]">{t.story.hero.prefix}</span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] j3-grad-text block animate-[clipRevealUp_.9s_.5s_cubic-bezier(.16,1,.3,1)_both] leading-[1.15] -mb-[0.08em]">
              {/* Split "20 AÑOS" — the Ñ stays, only the tilde ref marks position for the flying effect */}
              20 A<span ref={heroAccentRef} className="relative inline-block j3-grad-text">Ñ</span>OS
            </span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] text-[var(--wh)] block animate-[slideFromLeft_.8s_.85s_cubic-bezier(.16,1,.3,1)_both] leading-[.92]">{t.story.hero.dentro}</span>
            <span className="text-[clamp(60px,9vw,140px)] max-[960px]:text-[clamp(52px,15vw,110px)] j3-stroke-gold block animate-[slideFromRight_.8s_1.1s_cubic-bezier(.16,1,.3,1)_both] leading-[.92]">{t.story.hero.delJuego}</span>
          </h1>
          {/* Spacer — hero breathes without subtitle */}
          <div className="mt-10" />
        </div>

        {/* Bridge text — appears when logo fades, implodes when court starts */}
        {fadeOutT >= 0.95 && (
          <div ref={bridgeTextRef} className="absolute inset-0 z-20 bg-black flex items-center justify-center" style={{ opacity: 1 }}>
            <div className="text-center">
              <p className="text-[clamp(22px,2.8vw,38px)] tracking-[0.04em] text-[var(--gy2)] font-light leading-[1.6] flex flex-wrap justify-center gap-x-[0.3em]">
                {t.story.bridge.line1.split(" ").map((word: string, i: number) => (
                  <span key={i} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
                    <span
                      className="inline-block"
                      style={{
                        animation: `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.09}s both`,
                      }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </p>
              <p className="text-[clamp(26px,3.4vw,46px)] tracking-[-0.01em] text-[var(--wh)] font-bold leading-[1.4] mt-4 flex flex-wrap justify-center gap-x-[0.3em]">
                {t.story.bridge.line2.split(" ").map((word: string, i: number) => (
                  <span key={i} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
                    <span
                      className="inline-block"
                      style={{
                        animation: `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + (t.story.bridge.line1.split(" ").length + i) * 0.09 + 0.15}s both`,
                      }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* Court SVG — lives inside hero pin, controlled by scroll phases 6-10 */}
        <div
          ref={courtBoxRef}
          className="absolute z-30 flex items-center justify-center overflow-hidden"
          style={{
            top: "50%", left: "50%", transform: "translate(-50%,-50%)",
            background: "var(--bk)",
            width: 0, height: "2px",
          }}
        >
          <svg
            viewBox="0 0 200 100"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full max-[960px]:rotate-90"
          >
            <rect ref={el => { courtLinesRef.current[0] = el; }} className="court-line-el" x="2" y="2" width="196" height="96" stroke="var(--g1)" fill="none" style={{ "--court-len": 584 } as React.CSSProperties} />
            <line ref={el => { courtLinesRef.current[1] = el; }} className="court-line-el" x1="100" y1="2" x2="100" y2="98" stroke="var(--g1)" style={{ "--court-len": 96 } as React.CSSProperties} />
            <line ref={el => { courtLinesRef.current[2] = el; }} className="court-line-el" x1="38" y1="2" x2="38" y2="98" stroke="var(--g1)" style={{ "--court-len": 96 } as React.CSSProperties} />
            <line ref={el => { courtLinesRef.current[3] = el; }} className="court-line-el" x1="162" y1="2" x2="162" y2="98" stroke="var(--g1)" style={{ "--court-len": 96 } as React.CSSProperties} />
            <line ref={el => { courtLinesRef.current[4] = el; }} className="court-line-el" x1="38" y1="50" x2="100" y2="50" stroke="var(--g1)" style={{ "--court-len": 62 } as React.CSSProperties} />
            <line ref={el => { courtLinesRef.current[5] = el; }} className="court-line-el" x1="100" y1="50" x2="162" y2="50" stroke="var(--g1)" style={{ "--court-len": 62 } as React.CSSProperties} />
          </svg>
        </div>
      </section>

      {/* ─── STATS — "Nuestra historia en números" ─── */}
      <StatsSection />

      {/* ─── ACCENT MANIFESTO — scroll-driven Á + tilde + slogan ─── */}
      <AccentManifesto />

      {/* ─── TIMELINE ─── */}
      <TimelineSection />

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
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[960px]:text-[12px] max-[960px]:tracking-[3px]">{t.story.team.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.team.heading1}<br />{t.story.team.heading2}<span className="j3-grad-text font-[var(--font-serif)] italic normal-case tracking-[-0.5px] ml-[0.08em]">{t.story.team.heading2Accent}</span>
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
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[960px]:text-[12px] max-[960px]:tracking-[3px]">{t.story.players.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.players.heading1}<br />{t.story.players.heading2}<span className="j3-grad-text font-[var(--font-serif)] italic normal-case tracking-[-0.5px] ml-[0.08em]">{t.story.players.heading2Accent}</span>
          </h2>
          <p className="text-[14px] font-light text-[var(--gy2)] leading-[1.8] mt-4">
            {t.story.players.description}
          </p>
        </div>

        {/* ── Tier 1: Hero players — top mundial ── */}
        <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--g1)]/80 mb-5">{t.story.players.heroLabel}</p>
        <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-3 mb-14">
          {playersHero.map((p, i) => <HeroPlayerCard key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 2: Next gen — de la cantera al circuito ── */}
        <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-2">{t.story.players.nextGenLabel}</p>
        <div className="max-w-[700px] mb-16">
          {playersNextGen.map((p, i) => <NextGenRow key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 2b: Next gen → circuito pro ── */}
        <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-2">{t.story.players.nextGenProLabel}</p>
        <div className="max-w-[700px] mb-16">
          {playersNextGenPro.map((p, i) => <NextGenRow key={i} p={p} index={i} />)}
        </div>

        {/* ── Tier 3: Featured pro collaborations ── */}
        <div className="border-t border-white/[.06] pt-10 mb-10">
          <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)] mb-5">{t.story.players.featuredLabel}</p>
          <div className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-3">
            {playersFeatured.map((p, i) => (
              <FeaturedCollab key={i} p={p} index={i} />
            ))}
          </div>
        </div>

        {/* ── Tier 4: Rest of shared circuit — subtle ── */}
        <div className="border-t border-white/[.06] pt-8">
          <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] max-[640px]:tracking-[1.5px] uppercase text-[var(--gy)]/70 mb-5">{t.story.players.sharedLabel}</p>
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
            <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[960px]:text-[12px] max-[960px]:tracking-[3px]">{t.story.philosophy.label}</span>
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
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] mb-3 block max-[960px]:text-[12px] max-[960px]:tracking-[3px]">{t.story.clubs.label}</span>
          <h2 className="font-bold text-[clamp(32px,4vw,52px)] uppercase tracking-[-1px] leading-[1]">
            {t.story.clubs.heading1}<br /><span className="j3-grad-text">{t.story.clubs.heading2}</span>
          </h2>
          <p className="text-[14px] font-light text-[var(--gy2)] leading-[1.8] mt-4">
            {t.story.clubs.description}
          </p>
        </div>

        {/* ── Origins: Ocean Padel + Belife ── */}
        <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] uppercase text-[var(--gy)]/80 mb-4">{t.story.clubs.originLabel}</p>
        <div className="grid grid-cols-2 max-[640px]:grid-cols-1 gap-3 mb-4">
          {clubOrigin.map((c, i) => <ClubCard key={i} c={c} index={i} />)}
        </div>

        {/* ── Lesson: J3Padel Indoor — subtle aside ── */}
        <HigueronHero />

        {/* ── Present: Finura + Vals ── */}
        <p className="text-[10px] max-[960px]:text-[11px] font-bold tracking-[3px] uppercase text-[var(--gy)]/80 mb-4 mt-12">{t.story.clubs.presentLabel}</p>
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
          <span className="text-[10px] max-[960px]:text-[12px] font-normal tracking-[3px] max-[960px]:tracking-[2px] uppercase text-black/60 text-center mb-10 block">{t.story.brands.currentLabel}</span>
          <div className="flex items-center justify-center gap-16 mb-10 flex-wrap">
            <span className="font-bold text-[clamp(18px,2.5vw,32px)] uppercase text-black/60 tracking-[1px]">Technifibre</span>
            <span className="font-bold text-[clamp(18px,2.5vw,32px)] uppercase text-black/60 tracking-[1px]">Lacoste</span>
          </div>
          <div className="w-full h-px bg-black/[.08] my-8" />
          <p className="text-[10px] max-[960px]:text-[12px] font-normal tracking-[3px] max-[960px]:tracking-[2px] uppercase text-black/55 text-center mb-5">{t.story.brands.pastLabel}</p>
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
          <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--gy)]/70 mb-6 block max-[960px]:text-[12px] max-[960px]:tracking-[3px]">{t.story.cta.label}</span>
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-6">
            {t.story.cta.heading1}<br /><span className="j3-grad-text">{t.story.cta.heading2}</span>
          </h2>
          <p className="text-[16px] max-[960px]:text-[16px] max-[960px]:leading-[1.7] font-light text-[var(--gy2)] leading-[1.8] mb-10 max-w-[520px] mx-auto">
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

      {/* ─── FLYING ACCENT — transitions from hero "Á" to manifesto "Á" ─── */}
      <FlyingAccent flyT={flyT} fadeOutT={fadeOutT} heroAccentRef={heroAccentRef} />
    </main>
  );
}
