"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

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
  return (
    <div
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

        {/* Items list */}
        <ul className="flex flex-col gap-5">
          {items.map((item, i) => (
            <li key={i} className="flex flex-col gap-1.5">
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
              {/* Description */}
              <p className="text-[12.5px] sm:text-[13px] text-[var(--wh)]/72 leading-[1.55] font-light pl-9">
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
            Lo que pedimos.
            <br />
            <span className="italic text-[var(--g1)]/95">Lo que ponemos.</span>
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

        {/* BLOQUE 1 — BALANCE: dos columnas paralelas */}
        <div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch mb-20 sm:mb-28"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            transition: `all 1.4s cubic-bezier(.16,1,.3,1) ${delay(4)}`,
          }}
        >
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
            footer="* El fee por alcance e imagen lo abrimos a final de 2026 — fuera del presupuesto actual. No es la prioridad ahora."
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

        {/* DIVIDER editorial — introduce los tres caminos */}
        <div
          className="text-center mb-12 sm:mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: `all 1.1s cubic-bezier(.16,1,.3,1) ${delay(5)}`,
          }}
        >
          <div className="inline-flex items-center gap-4 mb-5">
            <span aria-hidden className="block h-px w-12 bg-[var(--g1)]/45" />
            <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
              Activación
            </span>
            <span aria-hidden className="block h-px w-12 bg-[var(--g1)]/45" />
          </div>
          <h3
            className="font-serif font-light text-[#E8DDD0] tracking-[-0.012em] leading-[1.1] mb-3"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(28px, 4vw, 48px)",
            }}
          >
            Tres formas de <span className="italic text-[var(--g1)]/95">activarlo</span>.
          </h3>
          <p
            className="italic text-[var(--wh)]/65 max-w-[600px] mx-auto leading-[1.5]"
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(14px, 1.4vw, 17px)",
            }}
          >
            Coach360 ya está montada. La diferencia es por dónde entráis.
          </p>
        </div>

        {/* BLOQUE 2 — TRES CAMINOS */}
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 items-stretch"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(28px)",
            transition: `all 1.4s cubic-bezier(.16,1,.3,1) ${delay(6)}`,
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
              "Textil de pista llevado por los dos directivos.",
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
                Tecnifibre
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
              "Línea limitada con sello J3 — pala, textil técnico, accesorio.",
              "Coach360 como early-access club: producto antes de mercado.",
              "Drops anuales en sedes y eventos co-branded.",
              "Editorial dedicado en J3Ptv — la historia detrás de la línea.",
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
