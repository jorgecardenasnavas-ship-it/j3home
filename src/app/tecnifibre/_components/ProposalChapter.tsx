"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   Capítulo 04 — La propuesta co-branded.
   Tres caminos para activar la red Coach360:
   01 Tecnifibre · 02 Lacoste · 03 J3 × Tecnifibre × Lacoste (la grande)
   ────────────────────────────────────────────────────────────── */

interface PathCardProps {
  num: string;
  brand: ReactNode;
  tag: string;
  pitch: ReactNode;
  vias: string[];
  anchor: string;
  highlight?: boolean;
  highlightLabel?: string;
}

function PathCard({
  num,
  brand,
  tag,
  pitch,
  vias,
  anchor,
  highlight,
  highlightLabel,
}: PathCardProps) {
  return (
    <div
      className={`relative flex flex-col overflow-hidden rounded-[6px] border backdrop-blur-[14px] ${
        highlight
          ? "border-[var(--g1)]/45"
          : "border-[var(--g1)]/22"
      }`}
      style={{
        background: highlight
          ? "linear-gradient(160deg, rgba(201,169,110,0.15) 0%, rgba(201,169,110,0.06) 45%, rgba(14,28,22,0.92) 100%)"
          : "linear-gradient(155deg, rgba(27,61,47,0.92) 0%, rgba(27,61,47,0.84) 50%, rgba(14,28,22,0.94) 100%)",
        boxShadow: highlight
          ? "0 1px 0 0 rgba(255,255,255,0.06) inset, 0 30px 80px -40px rgba(0,0,0,0.7), 0 0 60px -30px rgba(201,169,110,0.4)"
          : "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.65)",
      }}
    >
      {/* Top hairline */}
      <span
        aria-hidden
        className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${
          highlight
            ? "from-[var(--g1)]/30 via-[var(--g1)] to-[var(--g1)]/30"
            : "from-transparent via-[var(--g1)]/55 to-transparent"
        }`}
      />
      {/* Inner highlight */}
      <span
        aria-hidden
        className="absolute top-px left-3 right-3 h-[1px] bg-white/[0.06]"
      />

      {/* Corner brackets */}
      <span aria-hidden className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[var(--g1)]/50" />
      <span aria-hidden className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[var(--g1)]/50" />
      <span aria-hidden className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[var(--g1)]/50" />
      <span aria-hidden className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[var(--g1)]/50" />

      {/* Highlight badge — solo en la card "la grande" */}
      {highlight && highlightLabel && (
        <div className="absolute top-0 right-0 overflow-hidden">
          <div
            className="text-[8px] font-bold tracking-[3px] uppercase text-[var(--bk)] bg-[var(--g1)] px-3 py-1.5"
            style={{ letterSpacing: "3px" }}
          >
            {highlightLabel}
          </div>
        </div>
      )}

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: highlight
            ? "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,169,110,0.18) 0%, transparent 65%)"
            : "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(201,169,110,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Grain texture */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-5 p-7 sm:p-8 h-full">
        {/* Header con tier marker */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold tracking-[3.5px] uppercase text-[var(--g1)] tabular-nums">
            Camino {num}
          </span>
          <span aria-hidden className="block flex-1 h-px bg-[var(--g1)]/25" />
        </div>

        {/* Tag */}
        <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85">
          {tag}
        </div>

        {/* Brand — display, serif */}
        <h4
          className="font-serif font-light leading-[1.0] tracking-[-0.012em] text-[#E8DDD0] -mt-2"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 3.2vw, 40px)",
          }}
        >
          {brand}
        </h4>

        {/* Pitch — italic editorial */}
        <p
          className="italic text-[var(--wh)]/85 leading-[1.35]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(15px, 1.4vw, 17px)",
          }}
        >
          {pitch}
        </p>

        {/* Divider */}
        <span aria-hidden className="block h-px w-10 bg-[var(--g1)]/35" />

        {/* Vías list */}
        <div className="flex flex-col gap-3">
          <div className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85">
            — Vías de activación
          </div>
          <ul className="flex flex-col gap-2.5">
            {vias.map((via, i) => (
              <li
                key={i}
                className="flex items-baseline gap-2.5 text-[12.5px] sm:text-[13px] text-[var(--wh)]/82 leading-[1.5] font-light"
              >
                <span
                  aria-hidden
                  className="inline-block w-1 h-1 rounded-full bg-[var(--g1)] mt-[7px] shrink-0"
                  style={{ boxShadow: "0 0 5px rgba(201,169,110,0.5)" }}
                />
                <span>{via}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Spacer flex */}
        <div className="flex-1" />

        {/* Anchor footer */}
        <div className="pt-4 border-t border-[var(--g1)]/15">
          <div className="text-[10px] tracking-[1.2px] uppercase text-[var(--wh)]/60 font-light">
            <span className="text-[var(--g1)]/85 font-semibold tracking-[2px]">
              {highlight ? "Anclaje · " : "Anclaje · "}
            </span>
            <span className="italic text-[var(--wh)]/75">{anchor}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function useReveal(threshold = 0.2) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

export function ProposalChapter() {
  const { ref, visible } = useReveal(0.2);
  const delay = (i: number) => `${i * 0.1}s`;

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full bg-[var(--bk)] flex items-center overflow-hidden py-24 sm:py-28"
      data-chapter="04"
    >
      {/* Background — degradado verde profundo con punto de luz champán */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(27,61,47,0.55) 0%, rgba(14,28,22,0.95) 65%)",
        }}
      />

      {/* Ambient glow champán */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 100%, rgba(201,169,110,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Grain global */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Numeral fantasma 04 — anclaje editorial */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden
        style={{
          right: "-3vw",
          top: "50%",
          transform: visible ? "translate(0, -50%)" : "translate(40px, -50%)",
          fontSize: "clamp(280px, 42vw, 600px)",
          lineHeight: "0.78",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(201,169,110,0.18)",
          letterSpacing: "-0.04em",
          opacity: visible ? 1 : 0,
          transition: "all 1.6s cubic-bezier(.16,1,.3,1) 0.2s",
        }}
      >
        04
      </div>

      {/* Etiqueta vertical "CAPÍTULO 04 · LA PROPUESTA" */}
      <div
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block z-10"
        aria-hidden
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          opacity: visible ? 0.8 : 0,
          transition: "opacity 1s cubic-bezier(.16,1,.3,1) 0.5s",
        }}
      >
        <span className="text-[10px] font-bold tracking-[6px] uppercase text-[var(--g1)] whitespace-nowrap">
          Capítulo 04 · La propuesta
        </span>
      </div>

      {/* Container central */}
      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header — eyebrow + headline + subhead, centrado */}
        <div className="text-center mb-14 sm:mb-20">
          {/* Eyebrow */}
          <div
            className="text-[10px] sm:text-[11px] font-bold tracking-[4px] uppercase text-[var(--g1)] mb-6 lg:hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(-8px)",
              transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay(0)}`,
            }}
          >
            — Capítulo 04 · La propuesta
          </div>

          {/* Subtag champán */}
          <div
            className="text-[10px] sm:text-[11px] tracking-[3.5px] uppercase text-[var(--g1)]/90 mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: `all 1s cubic-bezier(.16,1,.3,1) ${delay(1)}`,
            }}
          >
            La propuesta
          </div>

          {/* Headline */}
          <h2
            className="font-serif font-light leading-[1.05] tracking-[-0.014em] text-[#E8DDD0] mb-8 max-w-[900px] mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(40px, 6.5vw, 88px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(24px)",
              filter: visible ? "blur(0)" : "blur(6px)",
              transition: `all 1.4s cubic-bezier(.16,1,.3,1) ${delay(2)}`,
            }}
          >
            Tres formas de activar.
            <br />
            <span className="italic text-[var(--g1)]/95">Una sola red.</span>
          </h2>

          {/* Subhead */}
          <p
            className="italic text-[var(--wh)]/75 max-w-[640px] mx-auto leading-[1.5]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(16px, 1.7vw, 22px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: `all 1.1s cubic-bezier(.16,1,.3,1) ${delay(3)}`,
            }}
          >
            Coach360 ya está montada.
            <br className="hidden sm:block" />
            La diferencia es cómo entráis.
          </p>
        </div>

        {/* 3 caminos — grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(28px)",
            transition: `all 1.4s cubic-bezier(.16,1,.3,1) ${delay(4)}`,
          }}
        >
          <PathCard
            num="01"
            brand="Tecnifibre"
            tag="Producto técnico"
            pitch={
              <>
                Donde el coach decide
                <br />
                qué pala recomienda.
              </>
            }
            vias={[
              "Drops en sedes — Vals Limoneros + Finura.",
              "Embajadores activos en la red Coach360.",
              "Demo days y presencia en stages técnicos.",
              "Contenido de rendimiento en J3Ptv.",
            ]}
            anchor="Palanca técnica."
          />
          <PathCard
            num="02"
            brand="Lacoste"
            tag="Lifestyle premium"
            pitch={
              <>
                El Padel premium
                <br />
                se viste con criterio.
              </>
            }
            vias={[
              "Textil y calzado de pista, llevados por los dos directivos.",
              "Capsule editorial co-firmada con J3.",
              "Presencia en J3Ptv — calidad, no volumen.",
              "Embajadores con criterio aspiracional.",
            ]}
            anchor="Palanca lifestyle."
          />
          <PathCard
            num="03"
            highlight
            highlightLabel="La grande"
            brand={
              <>
                J3{" "}
                <span className="text-[var(--g1)]/90 font-medium">×</span>{" "}
                Tecnifibre{" "}
                <span className="text-[var(--g1)]/90 font-medium">×</span>{" "}
                Lacoste
              </>
            }
            tag="Programa exclusivo"
            pitch={
              <>
                Una línea que solo
                <br />
                existe aquí.
              </>
            }
            vias={[
              "Línea limitada con sello J3 — pala, textil, accesorio.",
              "Coach360 como early-access club: producto antes de mercado.",
              "Drops anuales en sedes y eventos co-branded.",
              "Editorial dedicado en J3Ptv — la historia detrás de la línea.",
              "Activación cruzada Tecnifibre + Lacoste en una sola narrativa.",
            ]}
            anchor="El programa que convierte la red en canal."
          />
        </div>

        {/* Cierre del capítulo */}
        <div
          className="mt-16 sm:mt-20 text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: `all 1.2s cubic-bezier(.16,1,.3,1) ${delay(6)}`,
          }}
        >
          <div className="inline-flex items-center gap-4 mb-5">
            <span aria-hidden className="block h-px w-12 bg-[var(--g1)]/45" />
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
              Cierre
            </span>
            <span aria-hidden className="block h-px w-12 bg-[var(--g1)]/45" />
          </div>
          <p
            className="font-serif italic text-[#E8DDD0] leading-[1.25] tracking-[-0.01em] max-w-[700px] mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(22px, 3vw, 36px)",
            }}
          >
            Empezamos por una. O por las tres.
            <br />
            <span className="text-[var(--g1)]">Vosotros decidís.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
