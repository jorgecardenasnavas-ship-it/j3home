"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   Capítulo 05 — Hablamos.
   Cierre del documento. Pone cara al proyecto: las dos personas
   detrás de J3. Editorial, directo, sin saturar.
   ────────────────────────────────────────────────────────────── */

interface FounderCardProps {
  num: string;
  role: string;
  first: string;
  last: string;
  quote: string;
  highlights: string[];
  photo: string;
  photoAlt: string;
}

function FounderCard({
  num,
  role,
  first,
  last,
  quote,
  highlights,
  photo,
  photoAlt,
}: FounderCardProps) {
  // Reveal por card
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="relative flex flex-col overflow-hidden rounded-[6px] border border-[var(--g1)]/30 h-full min-h-[560px] sm:min-h-[600px]"
      style={{
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.7)",
      }}
    >
      {/* Foto de fondo — los hermanos en BK */}
      <Image
        src={photo}
        alt={photoAlt}
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover object-center pointer-events-none select-none"
        style={{
          transform: visible ? "scale(1)" : "scale(1.06)",
          transition: "transform 1.8s cubic-bezier(.16,1,.3,1)",
        }}
        priority={false}
      />

      {/* Overlay verde dramático — más opaco abajo (legibilidad) y sutil arriba (foto visible) */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14,28,22,0.35) 0%, rgba(14,28,22,0.55) 35%, rgba(14,28,22,0.88) 65%, rgba(14,28,22,0.96) 100%)",
        }}
      />
      {/* Wash champán sutil para integrar con el resto del documento */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(201,169,110,0.12) 0%, transparent 60%)",
        }}
      />

      {/* Top hairline */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--g1)]/60 to-transparent z-10"
      />
      <span
        aria-hidden
        className="absolute top-px left-3 right-3 h-[1px] bg-white/[0.06] z-10"
      />

      {/* Corner brackets */}
      <span aria-hidden className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[var(--g1)]/55 z-10" />
      <span aria-hidden className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[var(--g1)]/55 z-10" />
      <span aria-hidden className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[var(--g1)]/55 z-10" />
      <span aria-hidden className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[var(--g1)]/55 z-10" />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content — alineado abajo para que la foto respire arriba */}
      <div className="relative z-20 flex flex-col gap-5 p-7 sm:p-9 h-full justify-end">
        {/* Header — número + rol, en la parte superior */}
        <div
          className="absolute top-7 left-7 right-7 sm:top-9 sm:left-9 sm:right-9 flex items-baseline gap-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(8px)",
            transition: "all .9s cubic-bezier(.16,1,.3,1) .1s",
          }}
        >
          <span
            className="font-serif italic text-[var(--g1)] leading-none"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.4vw, 42px)",
              letterSpacing: "-0.02em",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            {num}
          </span>
          <span aria-hidden className="block flex-1 h-px bg-[var(--g1)]/45" />
          <span
            className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)] whitespace-nowrap"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.7)" }}
          >
            {role}
          </span>
        </div>

        {/* Nombre — display serif */}
        <h3
          className="font-serif font-light text-[#FFFAF0] tracking-[-0.012em] leading-[1.0]"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 4.4vw, 56px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            filter: visible ? "blur(0)" : "blur(4px)",
            transition: "all 1.1s cubic-bezier(.16,1,.3,1) .25s",
            textShadow: "0 4px 24px rgba(0,0,0,0.7)",
          }}
        >
          {first}
          <br />
          <span className="text-[var(--g1)]">{last}</span>
        </h3>

        {/* Quote italic */}
        <blockquote
          className="relative pl-5 border-l-2 border-[var(--g1)]/55"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-8px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) .4s",
          }}
        >
          <p
            className="italic text-[#F8F5EF]/95 leading-[1.4]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(15px, 1.55vw, 19px)",
              textShadow: "0 2px 12px rgba(0,0,0,0.6)",
            }}
          >
            «{quote}»
          </p>
        </blockquote>

        {/* Hitos — lista compacta */}
        <ul className="flex flex-col gap-2.5 pt-4 border-t border-[var(--g1)]/25">
          {highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-baseline gap-3 text-[12.5px] sm:text-[13px] text-[#F8F5EF]/85 leading-[1.5] font-light"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(8px)",
                transition: `all .9s cubic-bezier(.16,1,.3,1) ${
                  0.55 + i * 0.1
                }s`,
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              <span
                aria-hidden
                className="inline-block w-1 h-1 rounded-full bg-[var(--g1)] mt-[7px] shrink-0"
                style={{ boxShadow: "0 0 6px rgba(201,169,110,0.7)" }}
              />
              <span>{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function useReveal(threshold = 0.15) {
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

export function HablamosChapter() {
  const { ref, visible } = useReveal(0.15);
  const delay = (i: number) => `${i * 0.1}s`;

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full bg-[var(--bk)] flex items-center overflow-hidden py-24 sm:py-28"
      data-chapter="05"
    >
      {/* Background — degradado */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 60% at 50% 30%, rgba(27,61,47,0.55) 0%, rgba(14,28,22,0.95) 65%)",
        }}
      />
      {/* Ambient glow champán abajo */}
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

      {/* Numeral fantasma 05 */}
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
        05
      </div>

      {/* Etiqueta vertical */}
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
          Capítulo 05 · Hablamos
        </span>
      </div>

      {/* Container */}
      <div className="relative z-10 w-full max-w-[1100px] mx-auto px-6 sm:px-12 lg:px-20">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-20">
          <div
            className="text-[10px] sm:text-[11px] font-bold tracking-[4px] uppercase text-[var(--g1)] mb-6 lg:hidden"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(-8px)",
              transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay(0)}`,
            }}
          >
            — Capítulo 05 · Hablamos
          </div>

          <div
            className="text-[10px] sm:text-[11px] tracking-[3.5px] uppercase text-[var(--g1)]/90 mb-6"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(12px)",
              transition: `all 1s cubic-bezier(.16,1,.3,1) ${delay(1)}`,
            }}
          >
            El ADN
          </div>

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
            Dos personas.
            <br />
            Un mismo{" "}
            <span className="italic text-[var(--g1)]/95">criterio</span>.
          </h2>

          <p
            className="italic text-[var(--wh)]/72 max-w-[600px] mx-auto leading-[1.5]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(15px, 1.6vw, 19px)",
              opacity: visible ? 1 : 0,
              transform: visible ? "none" : "translateY(16px)",
              transition: `all 1.1s cubic-bezier(.16,1,.3,1) ${delay(3)}`,
            }}
          >
            Detrás del proyecto.
          </p>
        </div>

        {/* Grid 2 cards */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-16 sm:mb-20"
        >
          <FounderCard
            num="01"
            role="Co-founder · CEO"
            first="Javi"
            last="Cárdenas Navas"
            photo="/images/story/javi.jpeg"
            photoAlt="Javi Cárdenas Navas"
            quote="Sin ejecución, la visión se queda en conversación."
            highlights={[
              "Sede oficial del WPT Málaga 2014 — casi 300 parejas inscritas.",
              "Dirigió el Higuerón Resort hasta el #1 del mundo (2018).",
              "Hoy lidera la operativa de todo el ecosistema J3.",
            ]}
          />
          <FounderCard
            num="02"
            role="Co-founder · CSO"
            first="Jorge"
            last="Cárdenas Navas"
            photo="/images/story/jorge.jpeg"
            photoAlt="Jorge Cárdenas Navas"
            quote="Ver el juego antes de que ocurra. Eso es entrenar."
            highlights={[
              "Definió la metodología J3 desde la pista.",
              "Llevó jugadores al Top 5 mundial WPT.",
              "En 2022, el entrenador español mejor situado en el ranking.",
            ]}
          />
        </div>

        {/* CTA — Hablamos */}
        <div
          className="text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: `all 1.2s cubic-bezier(.16,1,.3,1) ${delay(6)}`,
          }}
        >
          {/* Hairline previo */}
          <span
            aria-hidden
            className="block h-px w-full max-w-[300px] mx-auto bg-gradient-to-r from-transparent via-[var(--g1)]/40 to-transparent mb-10"
          />

          {/* Título grande "Hablamos." — a solas, sin sub-frase intermedia */}
          <h3
            className="font-serif font-light text-[#E8DDD0] tracking-[-0.014em] leading-[0.95] mb-12"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(48px, 8vw, 110px)",
            }}
          >
            <span className="italic text-[var(--g1)]">Hablamos</span>.
          </h3>

          {/* Datos de contacto */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 mb-2">
            <a
              href="mailto:jorge@j3padel.com"
              className="group inline-flex items-baseline gap-2 text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] text-[#E8DDD0] hover:text-[var(--g1)] transition-colors duration-300"
            >
              <span aria-hidden className="text-[var(--g1)]/70 text-[10px] tracking-[2px] uppercase font-bold">
                Email
              </span>
              <span className="relative">
                jorge@j3padel.com
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 right-0 h-px bg-[var(--g1)]/40 group-hover:bg-[var(--g1)] transition-colors"
                />
              </span>
            </a>

            <span aria-hidden className="hidden sm:block w-px h-4 bg-[var(--g1)]/30" />

            <a
              href="https://wa.me/34654542622"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-baseline gap-2 text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] text-[#E8DDD0] hover:text-[var(--g1)] transition-colors duration-300"
            >
              <span aria-hidden className="text-[var(--g1)]/70 text-[10px] tracking-[2px] uppercase font-bold">
                WhatsApp
              </span>
              <span className="relative">
                +34 654 54 26 22
                <span
                  aria-hidden
                  className="absolute -bottom-px left-0 right-0 h-px bg-[var(--g1)]/40 group-hover:bg-[var(--g1)] transition-colors"
                />
              </span>
            </a>
          </div>

          {/* CTA con fecha concreta — crea momentum operativo */}
          <div
            className="mt-12 inline-flex flex-col items-center gap-1 px-6 py-4 border border-[var(--g1)]/35 rounded-[3px] backdrop-blur-[6px]"
            style={{
              background:
                "linear-gradient(160deg, rgba(201,169,110,0.08) 0%, rgba(14,28,22,0.5) 100%)",
            }}
          >
            <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
              — Próximo paso
            </span>
            <span
              className="font-semibold text-[#E8DDD0] tracking-[-0.005em]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(14px, 1.4vw, 16px)",
              }}
            >
              Llamada de 30 minutos
            </span>
            <span
              className="italic text-[var(--g1)]/95 tracking-[0.2px]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(13px, 1.3vw, 15px)",
              }}
            >
              Disponibilidad: semana del 4 al 8 de mayo.
            </span>
          </div>

          {/* Firma final — declaración institucional */}
          <p
            className="italic text-[var(--wh)]/55 mt-14 tracking-[0.2px]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(14px, 1.4vw, 17px)",
            }}
          >
            La academia de referencia en la Costa del Sol.
          </p>
        </div>
      </div>
    </section>
  );
}
