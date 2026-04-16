"use client";

import { useEffect, useRef, useCallback } from "react";
import { useI18n } from "@/i18n/context";

interface ProductCard {
  nameParts: { text: string; white?: boolean }[];
  buttons: { href: string; variant: "gold" | "ghost" }[];
  actionsPosition: "top" | "bottom";
  solo?: boolean;
  featured?: boolean;
  watermark: string;
  dark: boolean;
}

const cards: ProductCard[] = [
  {
    nameParts: [{ text: "Coach" }, { text: "360", white: true }],
    buttons: [
      { href: "https://j3padel.com/join", variant: "ghost" },
      { href: "https://j3padel.com/join", variant: "gold" },
    ],
    actionsPosition: "bottom",
    featured: true,
    watermark: "C360",
    dark: true,
  },
  {
    nameParts: [{ text: "J3P" }, { text: "TV", white: true }],
    buttons: [
      { href: "/j3ptv", variant: "ghost" },
      { href: "/j3ptv/acceder", variant: "gold" },
    ],
    actionsPosition: "top",
    featured: true,
    watermark: "TV",
    dark: false,
  },
  {
    nameParts: [{ text: "J3" }, { text: "Academy", white: true }],
    buttons: [{ href: "/academy", variant: "gold" }],
    actionsPosition: "bottom",
    watermark: "ACA",
    dark: true,
  },
  {
    nameParts: [{ text: "Business" }, { text: "Plan", white: true }],
    buttons: [
      { href: "/business", variant: "ghost" },
      { href: "/business/llamada", variant: "gold" },
    ],
    actionsPosition: "top",
    watermark: "BIZ",
    dark: false,
  },
  {
    nameParts: [{ text: "J3" }, { text: "Experience", white: true }],
    buttons: [{ href: "/experience", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "EXP",
    dark: true,
  },
  {
    nameParts: [{ text: "J3" }, { text: "Partner", white: true }],
    buttons: [{ href: "/partner", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "PTR",
    dark: false,
  },
];

function PillButton({
  label,
  href,
  variant,
  dark = true,
}: {
  label: string;
  href: string;
  variant: "gold" | "ghost";
  dark?: boolean;
}) {
  if (variant === "gold") {
    return (
      <a
        href={href}
        className="btn-glow j3-press text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer border-none hover:opacity-85"
        style={{ background: "var(--j3-grad)", color: "#000" }}
      >
        {label}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`btn-ghost j3-press text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline cursor-pointer ${dark ? "text-[var(--g1)] border border-[rgba(220,175,100,.3)] bg-transparent hover:bg-[rgba(220,175,100,.07)] hover:border-[rgba(220,175,100,.5)]" : "text-[var(--bk)] border border-black/20 bg-transparent hover:bg-black/[.04] hover:border-black/40"}`}
    >
      {label}
    </a>
  );
}

export function ProductsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const cardElements = section.querySelectorAll<HTMLDivElement>(".pc-card");

    // Staggered reveal per card via IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const delay = parseInt(card.dataset.idx || "0", 10) * 80;
            setTimeout(() => card.classList.add("in"), delay);
            observer.unobserve(card);
          }
        });
      },
      { threshold: 0.15 },
    );

    cardElements.forEach((card) => observer.observe(card));

    // Radial hover glow + 3D tilt — desktop only
    const isDesktop = window.matchMedia("(min-width: 961px) and (hover: hover)").matches;
    if (!isDesktop) return () => observer.disconnect();

    const handlers = new Map<HTMLDivElement, { move: (e: MouseEvent) => void; leave: () => void }>();

    cardElements.forEach((card) => {
      const glowEl = card.querySelector<HTMLElement>(".pc-glow");

      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // 3D tilt
        const rotateX = (y - 0.5) * -4;
        const rotateY = (x - 0.5) * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;

        // Radial glow follows cursor
        if (glowEl) {
          glowEl.style.opacity = "1";
          glowEl.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(220,175,100,0.06), transparent 60%)`;
        }
      };
      const leave = () => {
        card.style.transform = "";
        if (glowEl) {
          glowEl.style.opacity = "0";
        }
      };
      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      handlers.set(card, { move, leave });
    });

    return () => {
      observer.disconnect();
      handlers.forEach(({ move, leave }, card) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section id="productos" ref={sectionRef}>
      <div className="grid grid-cols-2 max-[960px]:grid-cols-1">
        {cards.map((card, cardIdx) => {
          const isDark = card.dark;
          const tCard = t.products.cards[cardIdx];

          const content = (
            <div>
              {/* Tag */}
              <div
                className={`text-[10px] max-[960px]:text-[11px] font-normal tracking-[3.5px] max-[960px]:tracking-[2px] uppercase mb-4 ${isDark ? "text-[rgba(220,175,100,.65)]" : "text-black/45"}`}
              >
                {tCard.tag}
              </div>

              {/* Product name — tight leading, negative tracking */}
              <div
                className={`font-bold uppercase leading-[1.07] tracking-[-1.5px] ${card.featured ? "text-[clamp(44px,4.5vw,60px)]" : "text-[clamp(38px,4vw,52px)]"}`}
              >
                {card.nameParts.map((part, i) =>
                  part.white ? (
                    <span key={i} className={isDark ? "text-[var(--wh)]" : "text-[#1d1d1f]"}>
                      {part.text}
                    </span>
                  ) : (
                    <span
                      key={i}
                      className={isDark ? "j3-grad-text" : ""}
                      style={!isDark ? { color: "#b8943e" } : undefined}
                    >
                      {part.text}
                    </span>
                  ),
                )}
              </div>

              {/* For label */}
              <div
                className={`text-[10px] max-[960px]:text-[11px] font-light tracking-[2px] max-[960px]:tracking-[1.5px] uppercase mt-[10px] ${isDark ? "text-white/40" : "text-black/35"}`}
              >
                {tCard.forLabel}
              </div>

              {/* Description — reveal on hover (desktop), always visible (mobile) */}
              {tCard.description && (
                <p
                  className={`text-[14px] font-light leading-[1.47] tracking-[-0.2px] mt-4 max-w-[380px] mx-auto transition-all duration-500 ease-[var(--ease-out)] ${
                    isDark ? "text-[var(--gy2)]" : "text-[rgba(0,0,0,0.56)]"
                  } opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 max-[960px]:opacity-80 max-[960px]:translate-y-0`}
                >
                  {tCard.description}
                </p>
              )}
            </div>
          );

          const actions = (
            <div
              className={`flex gap-[10px] flex-wrap justify-center max-[960px]:mt-6 ${
                card.actionsPosition === "bottom"
                  ? "min-[961px]:mt-8"
                  : "min-[961px]:mb-8"
              }`}
            >
              {card.buttons.map((btn, btnIdx) => (
                <PillButton
                  key={btn.href}
                  label={tCard.buttons[btnIdx]}
                  href={btn.href}
                  variant={btn.variant}
                  dark={isDark}
                />
              ))}
            </div>
          );

          // Solo cards — horizontal layout desktop
          if (card.solo) {
            return (
              <div
                key={card.watermark}
                data-idx={cardIdx}
                className={`pc-card group relative overflow-hidden transition-all duration-300 col-span-2 max-[960px]:col-span-1 ${
                  isDark ? "bg-black" : "bg-[#f5f5f7]"
                }`}
              >
                {/* Radial hover glow */}
                <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />

                {/* Gold accent line */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] ${isDark ? "bg-white/[.06]" : "bg-black/[.06]"}`} />

                {/* Watermark */}
                <span className={`absolute -bottom-4 -right-2 font-bold text-[120px] max-[960px]:text-[80px] uppercase leading-none tracking-[-4px] pointer-events-none select-none transition-colors duration-700 ${
                  isDark ? "text-white/[.015] group-hover:text-[var(--g1)]/[.04]" : "text-black/[.03] group-hover:text-[var(--g1)]/[.08]"
                }`}>
                  {card.watermark}
                </span>

                <div className="relative z-10 flex max-[960px]:flex-col items-center max-[960px]:items-center justify-center gap-16 max-[960px]:gap-0 py-14 px-16 max-[960px]:py-12 max-[960px]:px-8 text-center max-[960px]:text-center">
                  <div className="flex flex-col items-center max-[960px]:items-center">
                    {content}
                  </div>
                  <div>{actions}</div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={card.watermark}
              data-idx={cardIdx}
              className={`pc-card group relative overflow-hidden transition-all duration-300 cursor-pointer ${
                isDark ? "bg-black" : "bg-[#f5f5f7]"
              }`}
            >
              {/* Radial hover glow — follows cursor on desktop */}
              <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />

              {/* Gold accent line — expands on hover */}
              <div className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] ${
                card.featured ? "w-[60%] opacity-40 group-hover:w-full group-hover:opacity-80" : "w-0 opacity-0 group-hover:w-[80%] group-hover:opacity-60"
              }`} />

              {/* Bottom separator */}
              <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${isDark ? "bg-white/[.06]" : "bg-black/[.06]"}`} />
              {/* Right separator — desktop only */}
              <div className={`absolute top-0 right-0 bottom-0 w-[1px] max-[960px]:hidden ${isDark ? "bg-white/[.06]" : "bg-black/[.06]"}`} />

              {/* Watermark — ultra subtle depth */}
              <span className={`absolute -bottom-4 -right-2 font-bold text-[130px] max-[960px]:text-[80px] uppercase leading-none tracking-[-4px] pointer-events-none select-none transition-colors duration-700 ${
                isDark ? "text-white/[.015] group-hover:text-[var(--g1)]/[.04]" : "text-black/[.025] group-hover:text-[var(--g1)]/[.06]"
              }`}>
                {card.watermark}
              </span>

              <div
                className={`relative z-10 flex flex-col items-center text-center justify-center ${
                  card.featured
                    ? "py-16 px-10 max-[960px]:py-14 max-[960px]:px-8 min-h-[340px] max-[960px]:min-h-0"
                    : "py-16 px-10 max-[960px]:py-14 max-[960px]:px-8 min-h-[300px] max-[960px]:min-h-0"
                }`}
              >
                {/* DOM siempre content→actions (orden natural en móvil).
                    En desktop, las cards "top" invierten visualmente vía flex order. */}
                <div className={`w-full ${card.actionsPosition === "top" ? "min-[961px]:order-2" : ""}`}>
                  {content}
                </div>
                <div className={`w-full ${card.actionsPosition === "top" ? "min-[961px]:order-1" : ""}`}>
                  {actions}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
