"use client";

import { useEffect, useRef } from "react";

interface ProductCard {
  tag: string;
  nameParts: { text: string; white?: boolean }[];
  forLabel: string;
  description?: string;
  buttons: { label: string; href: string; variant: "gold" | "ghost" }[];
  actionsPosition: "top" | "bottom";
  solo?: boolean;
  watermark: string;
}

const cards: ProductCard[] = [
  {
    tag: "Online · Formación",
    nameParts: [{ text: "Coach" }, { text: "360", white: true }],
    forLabel: "Entrenadores de pádel",
    description: "Criterio, método y comunidad. Contenido nuevo cada semana.",
    buttons: [
      { label: "Ver más", href: "/coach360", variant: "ghost" },
      { label: "Unirse", href: "https://j3padel.com/join", variant: "gold" },
    ],
    actionsPosition: "bottom",
    watermark: "C360",
  },
  {
    tag: "Online · Contenido",
    nameParts: [{ text: "J3P" }, { text: "TV", white: true }],
    forLabel: "Todos los perfiles",
    description: "Análisis, debate y el juego moderno sin ruido.",
    buttons: [
      { label: "Ver más", href: "/j3ptv", variant: "ghost" },
      { label: "Acceder", href: "/j3ptv/acceder", variant: "gold" },
    ],
    actionsPosition: "top",
    watermark: "TV",
  },
  {
    tag: "Headquarters · Stages · Camps",
    nameParts: [{ text: "J3" }, { text: "Academy", white: true }],
    forLabel: "Kids · Amateur · Next Gen",
    description: "El mismo sistema del circuito profesional, adaptado a ti.",
    buttons: [
      { label: "Entrena con nosotros", href: "/academy", variant: "gold" },
    ],
    actionsPosition: "bottom",
    watermark: "ACA",
  },
  {
    tag: "Gestión · Optimización",
    nameParts: [{ text: "Business" }, { text: "Plan", white: true }],
    forLabel: "Academias y clubes",
    description: "Optimiza tu club con nuestro know-how.",
    buttons: [
      { label: "Saber más", href: "/business", variant: "ghost" },
      { label: "Agendar llamada", href: "/business/llamada", variant: "gold" },
    ],
    actionsPosition: "top",
    watermark: "BIZ",
  },
  {
    tag: "Servicio · Presencial",
    nameParts: [{ text: "J3" }, { text: "Experience", white: true }],
    forLabel: "Clubes, academias y grupos",
    buttons: [{ label: "Solicitar", href: "/experience", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "EXP",
  },
  {
    tag: "Expansión · Llave en mano",
    nameParts: [{ text: "J3" }, { text: "Partner", white: true }],
    forLabel: "Clubes y academias",
    buttons: [{ label: "Saber más", href: "/partner", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "PTR",
  },
];

function PillButton({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "gold" | "ghost";
}) {
  if (variant === "gold") {
    return (
      <a
        href={href}
        className="btn-glow text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer border-none hover:opacity-85"
        style={{ background: "var(--j3-grad)", color: "#000" }}
      >
        {label}
      </a>
    );
  }
  return (
    <a
      href={href}
      className="text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline transition-all duration-300 cursor-pointer text-[var(--g1)] border border-[rgba(220,175,100,.3)] bg-transparent hover:bg-[rgba(220,175,100,.07)] hover:border-[rgba(220,175,100,.5)]"
    >
      {label}
    </a>
  );
}

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cardElements = section.querySelectorAll<HTMLDivElement>(".pc-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLDivElement;
            const index = Array.from(cardElements).indexOf(target);
            setTimeout(() => target.classList.add("in"), index * 120);
            observer.unobserve(target);
          }
        });
      },
      { threshold: 0.1 },
    );

    cardElements.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="productos"
      ref={sectionRef}
      className="border-t border-[rgba(220,175,100,.2)] border-b border-b-[rgba(220,175,100,.2)]"
    >

      <div className="grid grid-cols-2 max-[960px]:grid-cols-1 border-l border-white/[.06]">
        {cards.map((card) => {
          const isSolo = card.solo;

          const content = (
            <div>
              <div className="text-[10px] font-normal tracking-[3.5px] uppercase text-[rgba(220,175,100,.55)] mb-4">
                {card.tag}
              </div>
              <div className="font-bold text-[clamp(38px,5vw,64px)] uppercase tracking-[-1.5px] leading-[.9]">
                {card.nameParts.map((part, i) =>
                  part.white ? (
                    <span key={i} className="text-[var(--wh)]">
                      {part.text}
                    </span>
                  ) : (
                    <span key={i} className="j3-grad-text">
                      {part.text}
                    </span>
                  ),
                )}
              </div>
              <div className="text-[10px] font-light tracking-[2px] uppercase text-white/30 mt-[10px]">
                {card.forLabel}
              </div>
              {card.description && (
                <p className="text-[13px] font-light text-[var(--gy2)] leading-[1.6] mt-3 max-w-[280px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {card.description}
                </p>
              )}
            </div>
          );

          const actions = (
            <div
              className={`flex gap-[10px] flex-wrap ${isSolo ? "justify-start max-[960px]:justify-center" : "justify-center"} ${card.actionsPosition === "bottom" ? "mt-7" : "mb-7 max-[960px]:mb-6 max-[960px]:mt-0"}`}
            >
              {card.buttons.map((btn) => (
                <PillButton
                  key={btn.label}
                  label={btn.label}
                  href={btn.href}
                  variant={btn.variant}
                />
              ))}
            </div>
          );

          const baseCardClasses =
            "pc-card group relative overflow-hidden border-r border-white/[.06] border-b border-b-white/[.06] transition-all duration-300 cursor-pointer hover:bg-[var(--bk2)]";

          if (isSolo) {
            return (
              <div
                key={card.tag}
                className={`${baseCardClasses} col-span-2 max-[960px]:col-span-1 bg-[var(--bk)] min-h-[180px] max-[960px]:min-h-0 flex max-[960px]:flex-col items-center max-[960px]:items-center justify-center gap-20 max-[960px]:gap-0 py-[52px] px-20 max-[960px]:py-[52px] max-[960px]:px-8 text-left max-[960px]:text-center`}
              >
                {/* Adidas-style oversized watermark */}
                <span className="absolute -bottom-6 -right-3 font-bold text-[140px] max-[960px]:text-[90px] uppercase leading-none tracking-[-4px] pointer-events-none select-none text-white/[.015] group-hover:text-[var(--g1)]/[.05] transition-colors duration-700">
                  {card.watermark}
                </span>

                {/* Nike-style gold accent line on hover */}
                <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-out" />

                {/* Nike hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--g1)]/[.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start max-[960px]:items-center">
                  {content}
                </div>
                <div className="relative z-10">{actions}</div>
              </div>
            );
          }

          return (
            <div
              key={card.tag}
              className={`${baseCardClasses} bg-[var(--bk)] py-16 px-[52px] max-[960px]:py-[52px] max-[960px]:px-8 flex flex-col justify-between min-h-[320px] max-[960px]:min-h-0 text-center items-center`}
            >
              {/* Adidas-style oversized watermark */}
              <span className="absolute -bottom-6 -right-3 font-bold text-[140px] max-[960px]:text-[90px] uppercase leading-none tracking-[-4px] pointer-events-none select-none text-white/[.015] group-hover:text-[var(--g1)]/[.05] transition-colors duration-700">
                {card.watermark}
              </span>

              {/* Nike-style gold accent line on hover */}
              <div className="absolute top-0 left-0 w-0 group-hover:w-full h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-out" />

              {/* Nike hover gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--g1)]/[.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center w-full h-full justify-between">
                {card.actionsPosition === "top" ? (
                  <>
                    {actions}
                    {content}
                  </>
                ) : (
                  <>
                    {content}
                    {actions}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
