"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Stat {
  val: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  lbl: string;
}

const STATS: Stat[] = [
  { val: 20, suffix: "+", lbl: "Años de\nexperiencia" },
  { prefix: "#", val: 1, lbl: "Mejor club\ndel mundo 2018" },
  { val: 100, suffix: "+", lbl: "Coaches formados\nen J3lab" },
  { val: 2000, suffix: "+", lbl: "Jugadores amateur\nformados" },
  { val: 30, suffix: "+", lbl: "Jugadores profesionales\nentrenados" },
  { val: 5, lbl: "Campeones de España y del Mundo\nen etapa de formación" },
  { label: "N.º1", val: 0, lbl: "Entrenador español\nen ranking WPT 2022" },
  { val: 11, lbl: "Títulos profesionales\nen 18 finales disputadas" },
];

function Counter({
  val,
  prefix = "",
  suffix = "",
}: {
  val: number;
  prefix?: string;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const dur = 1400;
    const steps = 35;
    let frame = 0;
    const iv = setInterval(() => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / steps, 3);
      setCount(Math.min(Math.round(val * progress), val));
      if (frame >= steps) clearInterval(iv);
    }, dur / steps);
    return () => clearInterval(iv);
  }, [started, val]);

  return (
    <span ref={ref} className="j3-grad-text font-black tabular-nums">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/**
 * Paso D — Nuestra historia en números.
 * Stats con counters animados sobre foto de fondo del hero de /story
 * (`/images/story/hero-coach.jpeg`). Verde profundo overlay para legibilidad.
 */
export function StatsChapter() {
  const headerReveal = useReveal(0.2);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(STATS.length).fill(false),
  );

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleItems((prev) => {
              const n = [...prev];
              n[i] = true;
              return n;
            });
            io.disconnect();
          }
        },
        { threshold: 0.3 },
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach((io) => io.disconnect());
  }, []);

  const renderStat = (s: Stat, i: number) => {
    const visible = visibleItems[i];
    return (
      <div
        key={i}
        ref={(el) => {
          itemRefs.current[i] = el;
        }}
        className="text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px) scale(0.97)",
          transition: `all .8s cubic-bezier(.16,1,.3,1) ${i * 0.08}s`,
        }}
      >
        <div className="text-[clamp(36px,4vw,56px)] leading-[1] mb-2 inline-block">
          {s.label ? (
            <span className="j3-grad-text font-black">{s.label}</span>
          ) : (
            <Counter val={s.val} prefix={s.prefix} suffix={s.suffix} />
          )}
        </div>
        <span className="block text-[10px] sm:text-[11px] font-light tracking-[2px] uppercase leading-[1.6] whitespace-pre-line text-[#E8DDD0]/80">
          {s.lbl}
        </span>
      </div>
    );
  };

  return (
    <section className="relative min-h-[100dvh] bg-[var(--bk)] py-20 sm:py-28 px-6 md:px-12 overflow-hidden">
      {/* Background photo */}
      <Image
        src="/images/story/hero-coach.jpeg"
        alt=""
        aria-hidden
        fill
        className="object-cover opacity-25"
        sizes="100vw"
      />
      {/* Dark overlay con gradient para legibilidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,28,22,0.85) 0%, rgba(14,28,22,0.6) 50%, rgba(14,28,22,0.9) 100%)",
        }}
        aria-hidden
      />
      {/* Subtle radial glow champán */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,.05) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 max-w-[1100px] mx-auto">
        {/* Header */}
        <div
          ref={headerReveal.ref}
          className="text-center mb-14 md:mb-16"
          style={{
            opacity: headerReveal.visible ? 1 : 0,
            transform: headerReveal.visible ? "none" : "translateY(20px)",
            transition: "all .8s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
            Nuestra historia en números
          </span>
        </div>

        {/* Row 1: 4 stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 max-w-[1000px] mx-auto">
          {STATS.slice(0, 4).map((s, i) => renderStat(s, i))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-10 md:my-12">
          <span className="h-px w-12 bg-[var(--g1)]/20" />
          <span className="w-1 h-1 rounded-full bg-[var(--g1)]/30" />
          <span className="h-px w-12 bg-[var(--g1)]/20" />
        </div>

        {/* Row 2: 4 stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4 max-w-[1000px] mx-auto">
          {STATS.slice(4).map((s, i) => renderStat(s, i + 4))}
        </div>
      </div>
    </section>
  );
}
