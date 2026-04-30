"use client";

import { Children, ReactNode, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

/* ──────────────────────────────────────────────────────────────
   MobileSwipe — wrapper editorial premium.
   Mobile: scroll horizontal con snap + peek-of-next + dots indicator.
   Desktop: grid normal con la clase que se le pase.
   ────────────────────────────────────────────────────────────── */
interface MobileSwipeProps {
  children: ReactNode;
  /** Tailwind classes para el grid de desktop, ej: "sm:grid-cols-3 gap-3" */
  desktopGrid?: string;
  /** Render alternativo para desktop (ej: container unificado en lugar del grid) */
  desktopOverride?: ReactNode;
  /** Ancho de cada card en mobile (default 85% para peek) */
  cardWidthMobile?: string;
}

function MobileSwipe({
  children,
  desktopGrid,
  desktopOverride,
  cardWidthMobile = "w-[85%]",
}: MobileSwipeProps) {
  const items = Children.toArray(children);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  // Mantener ref sincronizado para uso en handlers sin re-binding
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Track de qué card está activa al hacer scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const cards = el.querySelectorAll("[data-swipe-card]");
      if (cards.length === 0) return;
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const c = card as HTMLElement;
        const cardCenter = c.offsetLeft + c.clientWidth / 2;
        const dist = Math.abs(scrollCenter - cardCenter);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = i;
        }
      });
      setActiveIndex(closestIdx);
    };
    el.addEventListener("scroll", handler, { passive: true });
    handler();
    return () => el.removeEventListener("scroll", handler);
  }, [items.length]);

  // MOUSE WHEEL — convertir scroll vertical en horizontal mientras hay
  // espacio para scrollear lateralmente. Al llegar al borde, libera el
  // scroll vertical para que la página siga su curso natural.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const wheelHandler = (e: WheelEvent) => {
      // Threshold mínimo — ignora micro-movimientos del trackpad
      if (Math.abs(e.deltaY) < 4) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      const canScrollFurther =
        e.deltaY > 0
          ? el.scrollLeft < maxScroll - 1
          : el.scrollLeft > 0;
      if (canScrollFurther) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
      // Si no hay más recorrido lateral, deja que el wheel siga su curso
    };
    el.addEventListener("wheel", wheelHandler, { passive: false });
    return () => el.removeEventListener("wheel", wheelHandler);
  }, []);

  // DRAG-TO-SCROLL con ratón — patrón premium tipo Stripe.
  // Click y arrastre lateral para navegar entre cards. Threshold de
  // 5px para no interferir con clicks normales en links de las cards.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let isDown = false;
    let startX = 0;
    let startScrollLeft = 0;
    let hasMoved = false;

    const onMouseDown = (e: MouseEvent) => {
      // Ignorar si el click es sobre un link/botón (no interceptar navegación)
      const target = e.target as HTMLElement;
      if (target.closest("a, button")) return;
      isDown = true;
      hasMoved = false;
      startX = e.pageX;
      startScrollLeft = el.scrollLeft;
      el.style.cursor = "grabbing";
      el.style.scrollSnapType = "none"; // Desactiva snap durante el drag
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDown) return;
      const dx = e.pageX - startX;
      if (Math.abs(dx) > 5) {
        hasMoved = true;
        e.preventDefault();
        el.scrollLeft = startScrollLeft - dx;
      }
    };
    const endDrag = () => {
      if (!isDown) return;
      isDown = false;
      el.style.cursor = "";
      el.style.scrollSnapType = "";
      // Si hubo drag real, hacer snap al card más cercano
      if (hasMoved) {
        const cards = el.querySelectorAll("[data-swipe-card]");
        if (cards.length > 0) {
          const scrollCenter = el.scrollLeft + el.clientWidth / 2;
          let closestIdx = 0;
          let closestDist = Infinity;
          cards.forEach((card, i) => {
            const c = card as HTMLElement;
            const cardCenter = c.offsetLeft + c.clientWidth / 2;
            const dist = Math.abs(scrollCenter - cardCenter);
            if (dist < closestDist) {
              closestDist = dist;
              closestIdx = i;
            }
          });
          (cards[closestIdx] as HTMLElement).scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "nearest",
          });
        }
      }
    };
    // onClickCapture: bloquea clicks accidentales tras un drag
    const onClickCapture = (e: MouseEvent) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
        hasMoved = false;
      }
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endDrag);
    el.addEventListener("click", onClickCapture, true);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endDrag);
      el.removeEventListener("click", onClickCapture, true);
    };
  }, []);

  // TECLADO — flechas ← → navegan entre cards. Home/End van a primera/última.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    const cards = el.querySelectorAll("[data-swipe-card]");
    if (cards.length === 0) return;
    let targetIdx = activeIndexRef.current;
    if (e.key === "ArrowRight") {
      targetIdx = Math.min(cards.length - 1, activeIndexRef.current + 1);
    } else if (e.key === "ArrowLeft") {
      targetIdx = Math.max(0, activeIndexRef.current - 1);
    } else if (e.key === "Home") {
      targetIdx = 0;
    } else if (e.key === "End") {
      targetIdx = cards.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    const targetCard = cards[targetIdx] as HTMLElement;
    targetCard.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <>
      {/* Mobile: scroll horizontal con peek-of-next + soporte teclado/wheel */}
      <div className="sm:hidden -mx-6">
        <div
          ref={containerRef}
          tabIndex={0}
          role="region"
          aria-label="Carrusel de tarjetas — usa las flechas izquierda y derecha para navegar"
          onKeyDown={handleKeyDown}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--g1)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bk)] rounded-[2px] cursor-grab select-none active:cursor-grabbing"
          style={{ scrollbarWidth: "none" }}
        >
          {items.map((child, i) => (
            <div
              key={i}
              data-swipe-card
              className={`snap-center shrink-0 ${cardWidthMobile}`}
            >
              {child}
            </div>
          ))}
        </div>
        {/* Dots indicator — clickeables para navegación directa */}
        {items.length > 1 && (
          <div
            className="flex justify-center items-center gap-1.5 mt-4"
            role="tablist"
            aria-label="Navegación directa entre tarjetas"
          >
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activeIndex}
                aria-label={`Ir a tarjeta ${i + 1}`}
                onClick={() => {
                  const el = containerRef.current;
                  if (!el) return;
                  const cards = el.querySelectorAll("[data-swipe-card]");
                  const targetCard = cards[i] as HTMLElement | undefined;
                  targetCard?.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest",
                  });
                }}
                className="block h-[3px] rounded-full transition-all duration-300 ease-out cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--g1)]/60"
                style={{
                  width: i === activeIndex ? "22px" : "6px",
                  backgroundColor:
                    i === activeIndex
                      ? "var(--g1)"
                      : "rgba(201,169,110,0.28)",
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: render alternativo si está definido, si no grid normal */}
      {desktopOverride !== undefined ? (
        <div className="hidden sm:block">{desktopOverride}</div>
      ) : (
        <div className={`hidden sm:grid ${desktopGrid ?? ""} items-stretch`}>
          {children}
        </div>
      )}
    </>
  );
}

const TecnifibreGlobe = dynamic(
  () =>
    import("./TecnifibreGlobe").then((m) => ({ default: m.TecnifibreGlobe })),
  { ssr: false, loading: () => null },
);

interface Stat {
  strong: string;
  rest?: string;
}

interface LeverChapterProps {
  num: string;
  isHighlight?: boolean;
  name: ReactNode;
  tag: string;
  headline: ReactNode;
  body: ReactNode;
  stats?: Stat[];
  /** Override del bloque inferior — para casos como palanca 1 donde queremos
   *  sede-cards en vez de los chips estándar. */
  customFooter?: ReactNode;
  bgImage?: string;
  bgVisual?: ReactNode;
  /** Estilo del overlay — útil para palancas con visual a la derecha (globo) */
  overlayStyle?: string;
}

interface FormatCardProps {
  index: string;
  type: string;
  name: string;
  description: string;
  meta?: string;
  icon?: "mic" | "play" | "stack" | "target" | "seal" | "shield";
}

function FormatIcon({
  kind,
}: {
  kind: "mic" | "play" | "stack" | "target" | "seal" | "shield";
}) {
  const stroke = "var(--g1)";
  const common = {
    width: 14,
    height: 14,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (kind === "mic")
    return (
      <svg {...common}>
        <rect x="9" y="2" width="6" height="12" rx="3" />
        <path d="M5 11a7 7 0 0 0 14 0" />
        <line x1="12" y1="19" x2="12" y2="22" />
      </svg>
    );
  if (kind === "play")
    return (
      <svg {...common}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <polygon points="10 8 16 12 10 16 10 8" fill={stroke} />
      </svg>
    );
  if (kind === "stack")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  if (kind === "target")
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" fill={stroke} />
      </svg>
    );
  if (kind === "seal")
    return (
      <svg {...common}>
        <circle cx="12" cy="9" r="6" />
        <path d="M8 14 L8 22 L12 19 L16 22 L16 14" />
        <polyline points="9.5 9 11 10.5 14.5 7" />
      </svg>
    );
  // shield
  return (
    <svg {...common}>
      <path d="M12 2 L4 5 L4 12 C4 17 7.5 20.5 12 22 C16.5 20.5 20 17 20 12 L20 5 Z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function FormatCard({
  index,
  type,
  name,
  description,
  meta,
  icon,
}: FormatCardProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden bg-gradient-to-br from-[var(--g1)]/[0.085] via-[var(--g1)]/[0.04] to-transparent border border-[var(--g1)]/22 rounded-[3px] transition-[background,border-color] duration-700"
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {/* Top hairline gradient */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--g1)]/55 via-[var(--g1)]/15 to-transparent"
      />
      {/* Inner highlight */}
      <span
        aria-hidden
        className="absolute top-px left-0 right-0 h-[1px] bg-white/[0.03]"
      />

      {/* Index marker top-right */}
      <span className="absolute top-3 right-3 text-[9px] tracking-[2.5px] uppercase text-[var(--g1)]/45 font-bold tabular-nums">
        {index}
      </span>

      <div className="relative flex flex-col gap-3 px-5 pt-5 pb-5 h-full">
        {/* Type label con icono específico de formato */}
        <div className="flex items-center gap-2">
          {icon ? (
            <FormatIcon kind={icon} />
          ) : (
            <span
              aria-hidden
              className="block w-1.5 h-1.5 rounded-full bg-[var(--g1)]"
              style={{ boxShadow: "0 0 8px rgba(201,169,110,0.5)" }}
            />
          )}
          <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
            {type}
          </span>
        </div>

        {/* Name — fluido y nowrap para que palabras largas (Certificados / Verificados) no rompan en 2 líneas */}
        <h5
          className="font-semibold text-[#E8DDD0] tracking-[-0.014em] leading-[1.05] whitespace-nowrap"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(15px, 1.55vw, 19px)",
          }}
        >
          {name}
        </h5>

        {/* Hairline separator */}
        <span aria-hidden className="block h-px w-8 bg-[var(--g1)]/30" />

        {/* Description */}
        <p className="text-[12px] sm:text-[13px] text-[var(--wh)]/70 leading-[1.55] font-light flex-1">
          {description}
        </p>

        {/* Meta footer — specs técnicos */}
        {meta && (
          <div className="flex items-center gap-2 pt-2.5 border-t border-[var(--g1)]/15">
            <span
              aria-hidden
              className="block w-1 h-1 rounded-full bg-[var(--g1)]/55"
            />
            <span className="text-[10px] tracking-[1.2px] uppercase text-[var(--wh)]/55 font-light">
              {meta}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   NetworkTierCard — versión card standalone para mobile (carrusel).
   Misma información que NetworkTier (rows desktop) pero como card
   independiente con borde propio, alineada con SedeCard / FormatCard.
   ────────────────────────────────────────────────────────────── */
function NetworkTierCard({
  index,
  tierLevel,
  name,
  type,
  description,
  meta,
}: NetworkTierProps) {
  return (
    <div
      className="group relative flex flex-col overflow-hidden bg-gradient-to-br from-[var(--g1)]/[0.085] via-[var(--g1)]/[0.04] to-transparent border border-[var(--g1)]/22 rounded-[3px] h-full transition-[background,border-color] duration-700"
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {/* Top hairline gradient */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--g1)]/55 via-[var(--g1)]/15 to-transparent"
      />
      <span
        aria-hidden
        className="absolute top-px left-0 right-0 h-[1px] bg-white/[0.03]"
      />

      <div className="relative flex flex-col gap-3 px-5 pt-5 pb-5 h-full">
        {/* Header: anillos + index marker */}
        <div className="flex items-center justify-between gap-3">
          <TierRings level={tierLevel} />
          <span className="text-[9px] tracking-[2.5px] uppercase text-[var(--g1)]/55 font-bold tabular-nums">
            {index}
          </span>
        </div>

        {/* Type chip */}
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="block w-1 h-1 rounded-full bg-[var(--g1)]"
            style={{ boxShadow: "0 0 6px rgba(201,169,110,0.55)" }}
          />
          <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
            {type}
          </span>
        </div>

        {/* Name */}
        <h5
          className="font-semibold text-[#E8DDD0] tracking-[-0.014em] leading-[1.05]"
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: "clamp(17px, 2vw, 20px)",
          }}
        >
          {name}
        </h5>

        {/* Hairline separator */}
        <span aria-hidden className="block h-px w-8 bg-[var(--g1)]/30" />

        {/* Description */}
        <p className="text-[12.5px] sm:text-[13px] text-[var(--wh)]/70 leading-[1.55] font-light flex-1">
          {description}
        </p>

        {/* Meta footer */}
        <div className="flex items-center gap-2 pt-2.5 border-t border-[var(--g1)]/15">
          <span
            aria-hidden
            className="block w-1 h-1 rounded-full bg-[var(--g1)]/55"
          />
          <span className="text-[10px] tracking-[1.2px] uppercase text-[var(--wh)]/55 font-light">
            {meta}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────
   NetworkTier — fila editorial para los tres anillos de Coach360.
   Indicador concéntrico (●●● núcleo, ●●○ medio, ●○○ exterior),
   index marker, nombre semibold, descripción inline y meta a la
   derecha. Layout horizontal en desktop, apilado en mobile.
   ────────────────────────────────────────────────────────────── */
interface NetworkTierProps {
  index: string;
  tierLevel: 1 | 2 | 3;
  name: string;
  type: string;
  description: string;
  meta: string;
  divider?: boolean;
}

function TierRings({ level }: { level: 1 | 2 | 3 }) {
  // 3 dots: filled hasta `level`, vacíos el resto. Núcleo = 3, exterior = 1.
  return (
    <div className="flex items-center gap-1" aria-hidden>
      {[3, 2, 1].map((i) => {
        const filled = i <= level;
        return (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full"
            style={{
              backgroundColor: filled ? "var(--g1)" : "transparent",
              border: filled ? "none" : "1px solid rgba(201,169,110,0.45)",
              boxShadow: filled
                ? "0 0 6px rgba(201,169,110,0.55)"
                : "none",
            }}
          />
        );
      })}
    </div>
  );
}

function NetworkTier({
  index,
  tierLevel,
  name,
  type,
  description,
  meta,
  divider,
}: NetworkTierProps) {
  return (
    <div className="relative">
      {divider && (
        <span
          aria-hidden
          className="absolute top-0 left-5 right-5 h-px bg-[var(--g1)]/15"
        />
      )}
      <div className="relative grid grid-cols-12 gap-x-4 gap-y-2 items-baseline px-5 py-5">
        {/* Col 1-3: Anillos + index marker */}
        <div className="col-span-12 sm:col-span-3 flex items-center gap-3">
          <TierRings level={tierLevel} />
          <span className="text-[9px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]/55 tabular-nums">
            {index}
          </span>
        </div>

        {/* Col 4-12: Contenido */}
        <div className="col-span-12 sm:col-span-9 flex flex-col gap-1.5">
          {/* Header: nombre + type chip — fluid sizing para que nombres largos
              ("Certificados / Verificados") encajen en una sola línea */}
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h5
              className="font-semibold text-[#E8DDD0] tracking-[-0.012em] leading-[1.0]"
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: "clamp(16px, 1.7vw, 20px)",
              }}
            >
              {name}
            </h5>
            <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)] whitespace-nowrap">
              · {type}
            </span>
          </div>

          {/* Descripción + meta — flex en desktop, apilados en mobile */}
          <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-6">
            <p className="text-[12.5px] sm:text-[13px] text-[var(--wh)]/75 leading-[1.5] font-light max-w-[420px]">
              {description}
            </p>
            <span className="text-[9.5px] tracking-[1.5px] uppercase text-[var(--wh)]/55 font-light whitespace-nowrap shrink-0">
              {meta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SedeCardProps {
  badge: string;
  badgeAccent?: "champan" | "verde";
  name: string;
  location: string;
  detail: string;
  meta: string;
  href?: string;
  index?: string;
}

function SedeCard({
  badge,
  badgeAccent = "champan",
  name,
  location,
  detail,
  meta,
  href,
  index,
}: SedeCardProps) {
  const isCham = badgeAccent === "champan";
  return (
    <div
      className="group relative flex flex-col overflow-hidden bg-gradient-to-br from-[var(--g1)]/[0.085] via-[var(--g1)]/[0.04] to-transparent border border-[var(--g1)]/22 rounded-[3px] transition-[background,border-color,transform] duration-700"
      style={{ transitionTimingFunction: "cubic-bezier(.16,1,.3,1)" }}
    >
      {/* Top hairline gradient */}
      <span
        aria-hidden
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-[var(--g1)]/55 via-[var(--g1)]/15 to-transparent"
      />
      {/* Top inner highlight */}
      <span
        aria-hidden
        className="absolute top-px left-0 right-0 h-[1px] bg-white/[0.03]"
      />

      {/* Index marker top-right */}
      {index && (
        <span className="absolute top-3.5 right-4 text-[9px] tracking-[2.5px] uppercase text-[var(--g1)]/45 font-bold tabular-nums">
          {index}
        </span>
      )}

      <div className="relative flex flex-col gap-3.5 px-5 pt-5 pb-5">
        {/* Badge con dot indicator */}
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className={`block w-1.5 h-1.5 rounded-full ${
              isCham ? "bg-[var(--g1)]" : "bg-[#5BA070]"
            }`}
            style={{
              boxShadow: isCham
                ? "0 0 8px rgba(201,169,110,0.6)"
                : "0 0 8px rgba(91,160,112,0.6)",
            }}
          />
          <span
            className={`text-[9px] font-bold tracking-[3px] uppercase ${
              isCham ? "text-[var(--g1)]" : "text-[#9DC9A8]"
            }`}
          >
            {badge}
          </span>
        </div>

        {/* Nombre */}
        <h5
          className="text-[19px] sm:text-[22px] font-semibold text-[#E8DDD0] tracking-[-0.012em] leading-[1.05]"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {name}
        </h5>

        {/* Ubicación */}
        <p className="text-[11px] sm:text-[12px] text-[var(--wh)]/55 tracking-[0.4px] font-light -mt-2.5">
          {location}
        </p>

        {/* Hairline divisor con marker */}
        <div className="flex items-center gap-2 my-1">
          <span aria-hidden className="block w-1 h-1 rounded-full bg-[var(--g1)]/45" />
          <span aria-hidden className="block flex-1 h-px bg-[var(--g1)]/20" />
        </div>

        {/* Detalle con jerarquía clara */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] sm:text-[15px] text-[var(--g1)] font-semibold tracking-[0.2px]">
            {detail}
          </span>
          <span className="text-[10px] sm:text-[11px] text-[var(--wh)]/65 tracking-[0.6px] uppercase font-light">
            {meta}
          </span>
        </div>

        {/* CTA — refinado con underline animado */}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center gap-2 self-start mt-3 text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)] hover:text-[#E8DDD0] transition-colors duration-300"
          >
            <span className="relative">
              Ver sede
              <span
                aria-hidden
                className="absolute left-0 right-0 -bottom-1 h-px bg-[var(--g1)] origin-left scale-x-100 group-hover:bg-[#E8DDD0] transition-colors duration-300"
              />
            </span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </a>
        )}
      </div>
    </div>
  );
}

function useReveal(threshold = 0.3) {
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

function LeverChapter({
  num,
  isHighlight,
  name,
  tag,
  headline,
  body,
  stats,
  customFooter,
  bgImage,
  bgVisual,
  overlayStyle,
}: LeverChapterProps) {
  const { ref, visible } = useReveal(0.25);

  // Stagger delays para los elementos del contenido
  const delay = (i: number) => `${i * 0.08}s`;

  return (
    <section
      ref={ref}
      className="relative min-h-[100dvh] w-full bg-[var(--bk)] flex items-center overflow-hidden"
      data-lever={num}
    >
      {bgImage && (
        <Image
          src={bgImage}
          alt=""
          aria-hidden
          fill
          className="object-cover"
          sizes="100vw"
          style={{
            transform: visible ? "scale(1)" : "scale(1.08)",
            transition: "transform 2.2s cubic-bezier(.16,1,.3,1)",
          }}
        />
      )}
      {bgVisual}

      {/* Overlay para legibilidad */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            overlayStyle ??
            "linear-gradient(160deg, rgba(14,28,22,0.88) 0%, rgba(14,28,22,0.55) 55%, rgba(14,28,22,0.78) 100%)",
        }}
        aria-hidden
      />

      {/* Ambient glow champán */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 25% 55%, rgba(201,169,110,0.10) 0%, transparent 65%)",
        }}
        aria-hidden
      />

      {/* Numeral fantasma — anclaje editorial. Reducido en mobile. */}
      <div
        className="absolute pointer-events-none select-none"
        aria-hidden
        style={{
          right: "-2vw",
          top: "50%",
          transform: visible
            ? "translate(0, -50%)"
            : "translate(40px, -50%)",
          fontSize: "clamp(150px, 38vw, 520px)",
          lineHeight: "0.78",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontWeight: 400,
          color: "transparent",
          WebkitTextStroke: "1.5px rgba(201,169,110,0.22)",
          letterSpacing: "-0.04em",
          opacity: visible ? 1 : 0,
          transition: "all 1.6s cubic-bezier(.16,1,.3,1) 0.2s",
          willChange: "opacity, transform",
        }}
      >
        {num}
      </div>

      {/* Línea vertical accent en el borde izquierdo */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] bg-[var(--g1)] pointer-events-none"
        aria-hidden
        style={{
          height: visible ? "min(60vh, 400px)" : "0px",
          opacity: visible ? 1 : 0,
          transition:
            "height 1.4s cubic-bezier(.16,1,.3,1) 0.3s, opacity 0.6s ease 0.3s",
        }}
      />

      {/* Etiqueta vertical "PALANCA XX" rotada en el borde izquierdo */}
      <div
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 pointer-events-none hidden lg:block"
        aria-hidden
        style={{
          writingMode: "vertical-rl",
          transform: "rotate(180deg)",
          opacity: visible ? 0.8 : 0,
          transition: "opacity 1s cubic-bezier(.16,1,.3,1) 0.5s",
        }}
      >
        <span className="text-[10px] font-bold tracking-[6px] uppercase text-[var(--g1)] whitespace-nowrap">
          Palanca {num}
          {isHighlight && " · la grande"}
        </span>
      </div>

      {/* Content panel — tarjeta verde academy editorial premium */}
      <div className="relative z-10 w-full max-w-[660px] mr-auto pl-6 pr-4 sm:pl-16 sm:pr-8 lg:pl-24 lg:pr-12 py-12 sm:py-16">
        <div
          className="relative overflow-hidden border border-[var(--g1)]/20 rounded-[8px] backdrop-blur-[14px]"
          style={{
            background:
              "linear-gradient(155deg, rgba(27,61,47,0.94) 0%, rgba(27,61,47,0.90) 45%, rgba(14,28,22,0.95) 100%)",
            boxShadow:
              "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 30px 80px -40px rgba(0,0,0,0.65), 0 12px 32px -16px rgba(0,0,0,0.4)",
          }}
        >
          {/* Top hairline gradient — accent champán */}
          <span
            aria-hidden
            className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--g1)]/65 to-transparent"
          />
          {/* Inner highlight superior — luminescencia sutil */}
          <span
            aria-hidden
            className="absolute top-px left-4 right-4 h-[1px] bg-white/[0.06]"
          />

          {/* Corner brackets — L-marks champán en las cuatro esquinas */}
          <span
            aria-hidden
            className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[var(--g1)]/50"
          />
          <span
            aria-hidden
            className="absolute top-3 right-3 w-3 h-3 border-t border-r border-[var(--g1)]/50"
          />
          <span
            aria-hidden
            className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-[var(--g1)]/50"
          />
          <span
            aria-hidden
            className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[var(--g1)]/50"
          />

          {/* Glow ambient interno — wash sutil champán desde top-left */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 70% 50% at 15% 10%, rgba(201,169,110,0.10) 0%, transparent 60%)",
            }}
          />

          {/* Texture grain — micro noise (SVG inline, casi imperceptible) */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
          />

          {/* Content padding container */}
          <div className="relative p-6 sm:p-9 lg:p-11">
        {/* Eyebrow móvil/tablet (la versión vertical solo aparece en lg+) */}
        <div
          className="text-[10px] sm:text-[11px] font-bold tracking-[3px] sm:tracking-[4px] uppercase text-[var(--g1)] mb-3 lg:hidden"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateX(-12px)",
            transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay(0)}`,
          }}
        >
          — Palanca {num}
          {isHighlight && <span className="ml-1"> · la grande</span>}
        </div>

        {/* Nombre de la palanca con divisor */}
        <h3
          className="font-serif text-[22px] sm:text-[28px] tracking-[-0.01em] text-[#E8DDD0] mb-10 relative"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: `all 1s cubic-bezier(.16,1,.3,1) ${delay(1)}`,
          }}
        >
          {name}
          <span
            className="block mt-4 h-px w-16 bg-[var(--g1)]/45"
            aria-hidden
          />
        </h3>

        {/* Subtag */}
        <div
          className="text-[10px] sm:text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay(2)}`,
          }}
        >
          {tag}
        </div>

        {/* Headline */}
        <h4
          className="font-serif font-light leading-[1.12] tracking-[-0.012em] text-[#E8DDD0] mb-7"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 5vw, 64px)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(24px)",
            filter: visible ? "blur(0)" : "blur(6px)",
            transition: `all 1.2s cubic-bezier(.16,1,.3,1) ${delay(3)}`,
          }}
        >
          {headline}
        </h4>

        {/* Body — acepta string o JSX (para parrafos, énfasis, etc.) */}
        <div
          className="text-[14px] sm:text-[16px] leading-[1.6] text-[var(--wh)]/82 max-w-xl mb-12 font-light space-y-3.5"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: `all 1s cubic-bezier(.16,1,.3,1) ${delay(4)}`,
          }}
        >
          {body}
        </div>

        {/* Footer — customFooter (sede-cards, etc.) o stats genéricos */}
        <div
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(12px)",
            transition: `all .9s cubic-bezier(.16,1,.3,1) ${delay(5)}`,
          }}
        >
          {customFooter ? (
            customFooter
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
              {stats?.map((s, i) => (
                <div
                  key={i}
                  className="relative flex flex-col gap-1.5 px-4 py-3.5 bg-[var(--g1)]/[0.06] border border-[var(--g1)]/25 rounded-[3px]"
                >
                  <span
                    className="absolute top-3 left-0 w-[3px] h-[18px] bg-[var(--g1)]"
                    aria-hidden
                  />
                  <strong className="text-[var(--g1)] text-[14px] sm:text-[15px] font-semibold tracking-[0.3px] leading-tight">
                    {s.strong}
                  </strong>
                  {s.rest && (
                    <span className="text-[11px] sm:text-[12px] text-[var(--wh)]/70 leading-snug font-light">
                      {s.rest}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
        </div>
      </div>
    </section>
  );
}

export function LeversSection() {
  return (
    <>
      <LeverChapter
        num="01"
        name="El laboratorio."
        tag="El día a día"
        headline={
          <>
            Donde vuestra marca
            <br />
            entra en juego.
          </>
        }
        body={
          <>
            <p>
              Dos sedes en Málaga. Marbella en estudio. Triple ancla en la
              Costa del Sol.
            </p>
            <p>
              <strong className="text-[var(--g1)]/95 font-medium">
                Finura
              </strong>{" "}
              <span className="text-[var(--wh)]/55">(indoor)</span> ya activa:
              academia de jugadores profesionales y stages.
            </p>
            <p>
              <strong className="text-[var(--g1)]/95 font-medium">
                Vals Limoneros
              </strong>{" "}
              <span className="text-[var(--wh)]/55">(outdoor)</span> abre el 1 de
              junio con la academia completa — Kinder, Kids, Junior, Next Gen,
              Amateur — más camps.
            </p>
            <p>
              <strong className="text-[var(--g1)]/95 font-medium">
                Marbella
              </strong>{" "}
              <span className="text-[var(--wh)]/55">(en estudio)</span> — el
              corazón premium de la Costa del Sol.
            </p>
            <p
              className="italic text-[var(--wh)]/60 pt-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              18 pistas y contando. Método propio desde 2004. Marca a todos los
              niveles, todos los días.
            </p>
          </>
        }
        bgImage="/images/academy/stage-group.jpeg"
        customFooter={
          <MobileSwipe desktopGrid="sm:grid-cols-2 gap-3 max-w-xl">
            <SedeCard
              index="S/01"
              badge="Nueva · 1 jun '26"
              badgeAccent="champan"
              name="Vals Limoneros"
              location="Puerto de la Torre · Málaga"
              detail="11 pistas outdoor"
              meta="Academia completa + camps"
              href="https://valssportlimoneros.com"
            />
            <SedeCard
              index="S/02"
              badge="Activa"
              badgeAccent="verde"
              name="Finura Padel"
              location="Málaga capital"
              detail="7 pistas indoor"
              meta="Pros + stages"
              href="https://finurapadelgym.com"
            />
          </MobileSwipe>
        }
      />
      <LeverChapter
        num="02"
        name={
          <>
            J3P<span className="text-[var(--g1)] font-medium">tv</span>
          </>
        }
        tag="Editorial."
        headline={
          <>
            Calidad,
            <br />
            no volumen.
          </>
        }
        body={
          <>
            <p>
              Mesa de producción propia. Lista, cuando hay algo que decir.
            </p>
            <p>
              <strong className="text-[var(--g1)]/95 font-medium">
                Tres formatos en activo
              </strong>{" "}
              <span className="text-[var(--wh)]/55">
                — largo, evento y social.
              </span>{" "}
              Cada uno con su criterio editorial y calendario co-acordado con
              la marca.
            </p>
            <p
              className="italic text-[var(--wh)]/60 pt-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              No producimos por llenar feed. Producimos por contar bien.
            </p>
          </>
        }
        bgImage="/images/j3/j3ptv-bg.jpg"
        customFooter={
          <div className="space-y-5">
            <MobileSwipe desktopGrid="sm:grid-cols-3 gap-3">
              <FormatCard
                index="F/01"
                icon="mic"
                type="Audio · Long form"
                name="Podcast"
                description="Conversaciones de fondo con jugadores y figuras del circuito profesional."
                meta="30–45 min · cadencia mensual"
              />
              <FormatCard
                index="F/02"
                icon="play"
                type="Video · Evento"
                name="Vlogs"
                description="Coverage cinematográfico desde eventos premium y lanzamientos."
                meta="3–6 min · activable on-demand"
              />
              <FormatCard
                index="F/03"
                icon="stack"
                type="Social · Short"
                name="Píldoras"
                description="Reels y shorts editoriales en Instagram y TikTok."
                meta="15–60 s · una por momento"
              />
            </MobileSwipe>

            {/* Sistema editorial — una sola línea fluida */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-3 border-t border-[var(--g1)]/15">
              <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85 mr-1">
                — Sistema editorial
              </span>
              <span className="text-[10px] tracking-[1.2px] uppercase text-[var(--wh)]/60 font-light">
                Calendario co-acordado{" "}
                <span aria-hidden className="text-[var(--g1)]/45 mx-1">·</span>{" "}
                Líneas editoriales claras{" "}
                <span aria-hidden className="text-[var(--g1)]/45 mx-1">·</span>{" "}
                Output co-firmado
              </span>
            </div>

            {/* Canales — inline, sutil */}
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 pt-1">
              <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85 mr-1">
                — Canales
              </span>
              <a
                href="https://instagram.com/j3padel"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1.5 text-[11px] font-semibold tracking-[0.3px] text-[var(--wh)]/80 hover:text-[var(--g1)] transition-colors duration-300"
              >
                <span
                  aria-hidden
                  className="text-[var(--g1)]/70 group-hover:text-[var(--g1)] transition-colors"
                >
                  IG
                </span>
                <span className="relative">
                  @j3padel
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-0 right-0 h-px bg-[var(--g1)]/30 group-hover:bg-[var(--g1)] transition-colors"
                  />
                </span>
              </a>
              <a
                href="https://instagram.com/the_coach.padel"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-baseline gap-1.5 text-[11px] font-semibold tracking-[0.3px] text-[var(--wh)]/80 hover:text-[var(--g1)] transition-colors duration-300"
              >
                <span
                  aria-hidden
                  className="text-[var(--g1)]/70 group-hover:text-[var(--g1)] transition-colors"
                >
                  IG
                </span>
                <span className="relative">
                  @the_coach.padel
                  <span
                    aria-hidden
                    className="absolute -bottom-px left-0 right-0 h-px bg-[var(--g1)]/30 group-hover:bg-[var(--g1)] transition-colors"
                  />
                </span>
              </a>
            </div>
          </div>
        }
      />
      <LeverChapter
        num="03"
        isHighlight
        name={
          <>
            Coach
            <span
              className="text-[var(--g1)] italic font-medium"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              360
            </span>
          </>
        }
        tag="Formación online."
        headline={
          <>
            El amateur cambia de pala cada año.
            <br />
            Su coach decide cuál.
          </>
        }
        body={
          <>
            <p>
              <strong className="text-[var(--g1)]/95 font-medium">
                Plataforma de formación online.
              </strong>{" "}
              <strong className="text-[var(--g1)]/95 font-medium">
                Comunidad
              </strong>{" "}
              global.{" "}
              <strong className="text-[var(--g1)]/95 font-medium">
                Red
              </strong>{" "}
              activable.
            </p>
            <p>
              <span className="text-[var(--wh)]/55">Tres anillos:</span>{" "}
              HQ propio, Cualificados en el método y
              Certificados/Verificados por su criterio en pista. Cada uno
              con su rol.
            </p>
            <p
              className="italic text-[var(--wh)]/60 pt-2"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              No figurantes. Cuando ellos recomiendan, el jugador compra.
            </p>

            {/* Caption editorial — "De Málaga al mundo" como ancla temática
                que da contexto a la banda de stats: origen + ambición */}
            <div className="flex items-center gap-3 pt-4 mt-2">
              <span
                aria-hidden
                className="block h-px w-6 bg-[var(--g1)]/45"
              />
              <span
                className="italic text-[var(--g1)]/85 tracking-[0.2px] leading-none"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(13px, 1.3vw, 15px)",
                }}
              >
                De Málaga al mundo.
              </span>
            </div>

            {/* Stat band — proof points en 3 columnas, sutil pero contundente */}
            <div
              className="grid grid-cols-3 gap-0 pt-4 border-t border-[var(--g1)]/20"
              role="group"
              aria-label="Cobertura de la red"
            >
              <div className="relative flex flex-col gap-1 px-1">
                <span
                  className="font-serif italic text-[var(--g1)] leading-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(26px, 3.4vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  +100
                </span>
                <span className="text-[9px] tracking-[2.2px] uppercase text-[var(--wh)]/65 font-light">
                  Coaches
                </span>
              </div>
              <div className="relative flex flex-col gap-1 px-1 border-l border-[var(--g1)]/15">
                <span
                  className="font-serif italic text-[var(--g1)] leading-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(26px, 3.4vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  10+
                </span>
                <span className="text-[9px] tracking-[2.2px] uppercase text-[var(--wh)]/65 font-light">
                  Países
                </span>
              </div>
              <div className="relative flex flex-col gap-1 px-1 border-l border-[var(--g1)]/15">
                <span
                  className="font-serif italic text-[var(--g1)] leading-none"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: "clamp(26px, 3.4vw, 38px)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ∞
                </span>
                <span className="text-[9px] tracking-[2.2px] uppercase text-[var(--wh)]/65 font-light">
                  Amateurs alcanzados
                </span>
              </div>
            </div>
          </>
        }
        bgVisual={<TecnifibreGlobe />}
        overlayStyle="linear-gradient(to right, rgba(14,28,22,0.85) 0%, rgba(14,28,22,0.5) 40%, rgba(14,28,22,0) 70%)"
        customFooter={
          <div className="space-y-5">
            {/* Sistema de anillos — mobile: cards swipe / desktop: container unificado */}
            <MobileSwipe
              desktopOverride={
                <div
                  className="relative border border-[var(--g1)]/20 rounded-[4px] overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(201,169,110,0.045) 0%, rgba(201,169,110,0.015) 100%)",
                  }}
                >
                  {/* Top hairline gradient */}
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--g1)]/55 to-transparent"
                  />
                  <NetworkTier
                    index="N/01"
                    tierLevel={3}
                    name="HQ"
                    type="Núcleo"
                    description="Staff J3 directo. El método nace aquí y desde aquí se irradia al resto de la red."
                    meta="Málaga · sede propia"
                  />
                  <NetworkTier
                    index="N/02"
                    tierLevel={2}
                    name="Cualificados"
                    type="Método"
                    description="Coaches formados internamente en el método J3. Han pasado por la academia, conocen el sistema y están cualificados para aplicarlo."
                    meta="Formación interna J3"
                    divider
                  />
                  <NetworkTier
                    index="N/03"
                    tierLevel={1}
                    name="Certificados / Verificados"
                    type="Criterio"
                    description="Coaches con criterio contrastado en pista. Los conocemos, los hemos visto trabajar, y por eso entran en la red."
                    meta="Validación J3"
                    divider
                  />
                </div>
              }
            >
              <NetworkTierCard
                index="N/01"
                tierLevel={3}
                name="HQ"
                type="Núcleo"
                description="Staff J3 directo. El método nace aquí y desde aquí se irradia al resto de la red."
                meta="Málaga · sede propia"
              />
              <NetworkTierCard
                index="N/02"
                tierLevel={2}
                name="Cualificados"
                type="Método"
                description="Coaches formados internamente en el método J3. Han pasado por la academia, conocen el sistema y están cualificados para aplicarlo."
                meta="Formación interna J3"
              />
              <NetworkTierCard
                index="N/03"
                tierLevel={1}
                name="Certificados / Verificados"
                type="Criterio"
                description="Coaches con criterio contrastado en pista. Los conocemos, los hemos visto trabajar, y por eso entran en la red."
                meta="Validación J3"
              />
            </MobileSwipe>

            {/* Sistema — una línea */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-3 border-t border-[var(--g1)]/15">
              <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85 mr-1">
                — Sistema
              </span>
              <span className="text-[10px] tracking-[1.2px] uppercase text-[var(--wh)]/60 font-light">
                Formación online{" "}
                <span aria-hidden className="text-[var(--g1)]/45 mx-1">·</span>{" "}
                Comunidad global{" "}
                <span aria-hidden className="text-[var(--g1)]/45 mx-1">·</span>{" "}
                Activable a marca
              </span>
            </div>

            {/* Teaser a Cap. 04 — pulido, una sola línea editorial */}
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 pt-1">
              <span className="text-[9px] font-bold tracking-[3px] uppercase text-[var(--g1)]/85">
                — Continúa
              </span>
              <span className="text-[11px] tracking-[1.2px] uppercase text-[var(--wh)]/65 font-light">
                El programa co-branded
              </span>
              <span aria-hidden className="text-[var(--g1)]/45">·</span>
              <span className="text-[11px] font-semibold tracking-[2.5px] uppercase text-[var(--g1)]">
                capítulo 04 →
              </span>
            </div>
          </div>
        }
      />
    </>
  );
}
