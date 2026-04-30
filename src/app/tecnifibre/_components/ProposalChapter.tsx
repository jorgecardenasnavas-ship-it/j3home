"use client";

import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────
   Capítulo 04 — La propuesta.
   Estructura en tres bloques:
   1) BALANCE — Lo que pedimos / Lo que ponemos (responde directo a Raúl)
   2) CAMINOS — Tres formas de activarlo (Tecnifibre / Lacoste / Co-branded)
   3) CIERRE — Empezamos por uno. O por los tres.
   ────────────────────────────────────────────────────────────── */

interface BalanceItem {
  title: string;
  description: string;
}

interface BalanceColumnProps {
  num: string;
  title: string;
  subtitle: string;
  items: BalanceItem[];
  footer?: string;
  accent?: "verde" | "champan";
}

function BalanceColumn({
  num,
  title,
  subtitle,
  items,
  footer,
  accent = "verde",
}: BalanceColumnProps) {
  const isCham = accent === "champan";
  // Reveal stagger por columna — al entrar en viewport se activan los items
  const colRef = useRef<HTMLDivElement>(null);
  const [colVisible, setColVisible] = useState(false);
  useEffect(() => {
    const el = colRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setColVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={colRef}
      className="relative flex flex-col overflow-hidden rounded-[6px] border border-[var(--g1)]/22 backdrop-blur-[14px] h-full"
      style={{
        background: isCham
          ? "linear-gradient(155deg, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0.04) 50%, rgba(14,28,22,0.94) 100%)"
          : "linear-gradient(155deg, rgba(27,61,47,0.92) 0%, rgba(27,61,47,0.84) 50%, rgba(14,28,22,0.94) 100%)",
        boxShadow:
          "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.65)",
      }}
    >
      {/* Top hairline */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--g1)]/55 to-transparent"
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

      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(201,169,110,0.10) 0%, transparent 60%)",
        }}
      />

      {/* Grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-7 p-7 sm:p-9 h-full">
        {/* Header — número grande + título + subtítulo */}
        <div className="flex flex-col gap-3">
          {/* Numeral grande */}
          <div className="flex items-baseline gap-4">
            <span
              className="font-serif italic text-[var(--g1)] leading-none"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(36px, 4vw, 52px)",
                letterSpacing: "-0.02em",
              }}
            >
              {num}
            </span>
            <span aria-hidden className="block flex-1 h-px bg-[var(--g1)]/30" />
          </div>

          {/* Title display */}
          <h3
            className="font-serif font-light text-[#E8DDD0] tracking-[-0.012em] leading-[1.0]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 3.4vw, 40px)",
            }}
          >
            {title}
          </h3>

          {/* Subtitle italic */}
          <p
            className="italic text-[var(--g1)]/85 tracking-[0.2px]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(13px, 1.3vw, 15px)",
            }}
          >
            {subtitle}
          </p>
        </div>

        {/* Items list — reveal stagger por item */}
        <ul className="flex flex-col gap-5">
          {items.map((item, i) => (
            <li
              key={i}
              className="flex flex-col gap-1.5"
              style={{
                opacity: colVisible ? 1 : 0,
                transform: colVisible ? "none" : "translateY(14px)",
                filter: colVisible ? "blur(0)" : "blur(3px)",
                transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${
                  0.15 + i * 0.12
                }s, transform .9s cubic-bezier(.16,1,.3,1) ${
                  0.15 + i * 0.12
                }s, filter .9s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.12}s`,
              }}
            >
              {/* Title del item */}
              <div className="flex items-baseline gap-3">
                <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]/55 tabular-nums shrink-0 mt-px">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className="font-semibold text-[#E8DDD0] tracking-[-0.005em] leading-[1.3]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(14px, 1.4vw, 16px)",
                  }}
                >
                  {item.title}
                </span>
              </div>
              {/* Description — pl reducido en mobile para dar más ancho de texto */}
              <p className="text-[12.5px] sm:text-[13px] text-[var(--wh)]/72 leading-[1.55] font-light pl-7 sm:pl-9">
                {item.description}
              </p>
            </li>
          ))}
        </ul>

        {/* Spacer flex */}
        <div className="flex-1" />

        {/* Footer note */}
        {footer && (
          <div className="pt-4 border-t border-[var(--g1)]/15">
            <p className="text-[11px] italic text-[var(--wh)]/55 leading-[1.5] font-light">
              {footer}
            </p>
          </div>
        )}
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

      {/* Numeral fantasma 04 — anclaje editorial. Reducido en mobile. */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden
        style={{
          right: "-3vw",
          top: "50%",
          transform: visible ? "translate(0, -50%)" : "translate(40px, -50%)",
          fontSize: "clamp(160px, 42vw, 600px)",
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

          {/* Headline — conceptual, no repite las columnas */}
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
            La cuenta{" "}
            <span className="italic text-[var(--g1)]/95">clara</span>.
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
            No es patrocinio.
            <br className="hidden sm:block" />
            Es palanca.
          </p>
        </div>

        {/* BLOQUE 1 — BALANCE: dos columnas paralelas + símbolo central de intercambio */}
        <div
          className="relative mb-12 sm:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: `all 1.4s cubic-bezier(.16,1,.3,1) ${delay(4)}`,
          }}
        >
          {/* Símbolo central ⇆ — solo visible en desktop, posicionado al medio */}
          <div
            aria-hidden
            className="hidden lg:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
          >
            <div
              className="relative flex items-center justify-center w-14 h-14 rounded-full border border-[var(--g1)]/40 backdrop-blur-[8px]"
              style={{
                background:
                  "radial-gradient(circle, rgba(14,28,22,0.95) 0%, rgba(14,28,22,0.7) 100%)",
                boxShadow:
                  "0 0 24px rgba(201,169,110,0.25), 0 0 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* SVG flecha de intercambio horizontal */}
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--g1)"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 8 L20 8" />
                <polyline points="16 4 20 8 16 12" />
                <path d="M21 16 L4 16" />
                <polyline points="8 12 4 16 8 20" />
              </svg>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 items-stretch">
          <BalanceColumn
            num="01"
            accent="verde"
            title="Lo que pedimos."
            subtitle="No material. Aval, acceso, palanca."
            items={[
              {
                title: "Un partner que avale el proyecto.",
                description:
                  "Legitimidad de marca premium para acelerar la curva de J3 — no necesitamos producto, lo tenemos. Necesitamos respaldo institucional.",
              },
              {
                title: "Acceso a la red de entrenadores Tecnifibre.",
                description:
                  "Son leads altamente cualificados para Coach360. La marca puede comprar licencias y repartirlas a los coaches que elija, o lanzar una campaña con código promocional para que entren en la comunidad.",
              },
              {
                title: "Insignia «Entrenador Tecnifibre» en Encuentra a tu coach.",
                description:
                  "Marca personalizada dentro del directorio Coach360. Refuerza pertenencia y visibiliza la red ante el jugador final.",
              },
              {
                title: "Acceso a eventos premium de la marca.",
                description:
                  "Tecnifibre y Lacoste, allí donde ocurran. Para cubrirlos editorialmente y producir contenido propio en J3Ptv.",
              },
              {
                title: "Acceso a jugadores y embajadores de la marca.",
                description:
                  "Para creación de contenido editorial y como recurso dentro de la formación Coach360.",
              },
              {
                title: "Apoyo a los embajadores J3-firmados.",
                description:
                  "Activos vehiculados por nosotros — textil, palas, presencia — para los embajadores que vosotros designéis. No patrocinio monetario, sí coordinación.",
              },
            ]}
            footer="* Marco económico abierto a Q4 2026 — fuera del foco actual, pero sí del calendario."
          />

          <BalanceColumn
            num="02"
            accent="champan"
            title="Lo que ponemos."
            subtitle="Activos compartidos. Win-win sin presupuesto."
            items={[
              {
                title: "Coach360 a los entrenadores firmados por la marca.",
                description:
                  "Si prescriben producto, entran en la plataforma de formación con pre-acceso al lanzamiento de novedades. Vínculo coach → marca → producto, sellado en plataforma.",
              },
              {
                title: "Canal de venta para los entrenadores de la comunidad.",
                description:
                  "Dos opciones: e-commerce dentro de Coach360 sin inversión inicial (comisión por venta), o introducción de la marca en la tienda física de su club. La red se convierte en distribuidor activo.",
              },
              {
                title: "3M de views/mes · 1M de cuentas alcanzadas/mes.",
                description:
                  "En Instagram. Solo orgánico — sin ads. Visibilidad real de J3 al servicio de la marca.",
              },
              {
                title: "Formaciones presenciales a clubes patrocinados.",
                description:
                  "Cuando la marca firma exclusiva con un club, J3 va y forma in situ. Argumento extra de venta para Tecnifibre y Lacoste hacia clubes.",
              },
              {
                title: "Cobertura editorial de los eventos de la marca por el mundo.",
                description:
                  "Donde haya un evento Tecnifibre o Lacoste, J3Ptv lo cubre con criterio editorial. Calidad, no volumen.",
              },
              {
                title: "Reporte trimestral de impacto.",
                description:
                  "Dashboard con coaches activados, contenido producido, alcance y ventas. Control y munición interna para defender el partnership.",
              },
            ]}
          />
          </div>
        </div>

        {/* CIERRE del balance — frase puente entre balance y KPIs */}
        <div
          className="text-center mb-20 sm:mb-24"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(14px)",
            transition: `all 1.1s cubic-bezier(.16,1,.3,1) ${delay(5)}`,
          }}
        >
          {/* En mobile: stack vertical (hairline arriba/abajo). En desktop: línea horizontal con hairlines a los lados */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <span aria-hidden className="block h-px w-16 sm:w-10 bg-[var(--g1)]/45" />
            <p
              className="font-serif italic text-[#E8DDD0] tracking-[-0.005em] leading-[1.3] text-center"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(18px, 2.2vw, 26px)",
              }}
            >
              Cuando uno gana,{" "}
              <span className="text-[var(--g1)]">el otro gana también</span>.
            </p>
            <span aria-hidden className="block h-px w-16 sm:w-10 bg-[var(--g1)]/45" />
          </div>
        </div>

        {/* BLOQUE — CÓMO LO MEDIMOS (4 KPIs concretos) */}
        <div
          className="mb-20 sm:mb-24"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: `all 1.2s cubic-bezier(.16,1,.3,1) ${delay(6)}`,
          }}
        >
          {/* Mini-divider editorial */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 mb-4">
              <span aria-hidden className="block h-px w-10 bg-[var(--g1)]/45" />
              <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
                Cómo lo medimos
              </span>
              <span aria-hidden className="block h-px w-10 bg-[var(--g1)]/45" />
            </div>
            <p
              className="italic text-[var(--wh)]/65 max-w-[560px] mx-auto leading-[1.5]"
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(14px, 1.4vw, 16px)",
              }}
            >
              Cuatro métricas. Reporte trimestral. Sin humo.
            </p>
          </div>

          {/* Grid de KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[var(--g1)]/15 border border-[var(--g1)]/22 rounded-[4px] overflow-hidden">
            {[
              {
                num: "01",
                label: "Coaches activos",
                detail: "Por trimestre, en la red Coach360",
              },
              {
                num: "02",
                label: "Producto recomendado",
                detail: "Prescripción coach → jugador",
              },
              {
                num: "03",
                label: "Alcance editorial",
                detail: "Views, cuentas, presencia generada",
              },
              {
                num: "04",
                label: "Eventos cubiertos",
                detail: "Contenido producido por trimestre",
              },
            ].map((kpi) => (
              <div
                key={kpi.num}
                className="relative flex flex-col gap-2 p-4 sm:p-7 bg-[var(--bk)]/85 backdrop-blur-[6px]"
              >
                {/* Numeral italic serif */}
                <span
                  className="font-serif italic text-[var(--g1)] leading-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(28px, 3vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {kpi.num}
                </span>
                {/* Hairline */}
                <span
                  aria-hidden
                  className="block h-px w-8 bg-[var(--g1)]/35 my-1"
                />
                {/* Label */}
                <span
                  className="font-semibold text-[#E8DDD0] tracking-[-0.005em] leading-[1.2]"
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: "clamp(14px, 1.4vw, 16px)",
                  }}
                >
                  {kpi.label}
                </span>
                {/* Detail */}
                <span className="text-[11px] sm:text-[12px] text-[var(--wh)]/60 leading-[1.4] font-light">
                  {kpi.detail}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* BLOQUE — POR QUÉ AHORA + SOCIAL PROOF INSTITUCIONAL */}
        <div
          className="text-center max-w-[760px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: `all 1.3s cubic-bezier(.16,1,.3,1) ${delay(7)}`,
          }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-4 mb-6">
            <span aria-hidden className="block h-px w-10 bg-[var(--g1)]/45" />
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
              Por qué ahora
            </span>
            <span aria-hidden className="block h-px w-10 bg-[var(--g1)]/45" />
          </div>

          {/* Frase de urgencia — el <br> se vuelve opcional en mobile para no forzar una línea muy corta */}
          <p
            className="font-serif text-[#E8DDD0] leading-[1.3] sm:leading-[1.25] tracking-[-0.012em] mb-10"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(20px, 3.2vw, 36px)",
              fontWeight: 300,
            }}
          >
            Coach360 cierra su primer ciclo en 2026.{" "}
            <span className="italic text-[var(--g1)] block sm:inline mt-1 sm:mt-0">
              El partner que entre primero define las reglas
            </span>
            .
          </p>

          {/* Hairline separador */}
          <span
            aria-hidden
            className="block h-px w-full bg-gradient-to-r from-transparent via-[var(--g1)]/35 to-transparent mb-8"
          />

          {/* Social proof institucional — marcas con las que ya hemos trabajado */}
          <p
            className="italic text-[var(--wh)]/72 leading-[1.55] max-w-[600px] mx-auto"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(14px, 1.45vw, 17px)",
            }}
          >
            Hemos trabajado con{" "}
            <span className="not-italic font-semibold tracking-[0.5px] text-[#E8DDD0]">
              Wilson · Babolat · Adidas · Varlion
            </span>
            .
            <br />
            Hoy elegimos a quien defina la próxima década con nosotros.
          </p>
        </div>

      </div>
    </section>
  );
}
