"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

interface ProductCard {
  nameParts: { text: string; white?: boolean }[];
  buttons: { href: string; variant: "gold" | "ghost" }[];
  actionsPosition: "top" | "bottom";
  solo?: boolean;
  featured?: boolean;
  watermark: string;
}

const cards: ProductCard[] = [
  {
    nameParts: [{ text: "Coach" }, { text: "360", white: true }],
    buttons: [
      { href: "/coach360", variant: "ghost" },
      { href: "https://j3padel.com/join", variant: "gold" },
    ],
    actionsPosition: "bottom",
    featured: true,
    watermark: "C360",
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
  },
  {
    nameParts: [{ text: "J3" }, { text: "Academy", white: true }],
    buttons: [
      { href: "/academy", variant: "gold" },
    ],
    actionsPosition: "bottom",
    watermark: "ACA",
  },
  {
    nameParts: [{ text: "Business" }, { text: "Plan", white: true }],
    buttons: [
      { href: "/business", variant: "ghost" },
      { href: "/business/llamada", variant: "gold" },
    ],
    actionsPosition: "top",
    watermark: "BIZ",
  },
  {
    nameParts: [{ text: "J3" }, { text: "Experience", white: true }],
    buttons: [{ href: "/experience", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "EXP",
  },
  {
    nameParts: [{ text: "J3" }, { text: "Partner", white: true }],
    buttons: [{ href: "/partner", variant: "ghost" }],
    actionsPosition: "bottom",
    solo: true,
    watermark: "PTR",
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
      className={`text-[12px] font-bold tracking-[2px] uppercase py-[11px] px-[26px] rounded-[980px] no-underline transition-all duration-300 cursor-pointer ${dark ? "text-[var(--g1)] border border-[rgba(220,175,100,.3)] bg-transparent hover:bg-[rgba(220,175,100,.07)] hover:border-[rgba(220,175,100,.5)]" : "text-[var(--bk)] border border-black/20 bg-transparent hover:bg-black/[.04] hover:border-black/40"}`}
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
        {cards.map((card, cardIdx) => {
          const isSolo = card.solo;
          const isDark = !isSolo;
          const tCard = t.products.cards[cardIdx];

          const content = (
            <div>
              <div className={`text-[10px] max-[960px]:text-[11px] font-normal tracking-[3.5px] max-[960px]:tracking-[2px] uppercase mb-4 ${isDark ? "text-[rgba(220,175,100,.65)]" : "text-black/45"}`}>
                {tCard.tag}
              </div>
              <div className={`font-bold uppercase tracking-[-1.5px] leading-[.9] ${card.featured ? "text-[clamp(44px,6vw,72px)]" : "text-[clamp(38px,5vw,64px)]"}`}>
                {card.nameParts.map((part, i) =>
                  part.white ? (
                    <span key={i} className={isDark ? "text-[var(--wh)]" : "text-[var(--bk)]"}>
                      {part.text}
                    </span>
                  ) : (
                    <span key={i} className={isDark ? "j3-grad-text" : ""} style={!isDark ? { color: "#b8943e" } : undefined}>
                      {part.text}
                    </span>
                  ),
                )}
              </div>
              <div className={`text-[10px] max-[960px]:text-[11px] font-light tracking-[2px] max-[960px]:tracking-[1.5px] uppercase mt-[10px] ${isDark ? "text-white/40" : "text-black/35"}`}>
                {tCard.forLabel}
              </div>
              {tCard.description && (
                <p className={`text-[13px] max-[960px]:text-[14px] font-light leading-[1.6] mt-3 text-center transition-opacity duration-500 ${
                  card.featured ? "opacity-60 group-hover:opacity-100 max-[960px]:opacity-80" : "opacity-0 group-hover:opacity-100 max-[960px]:opacity-70"
                } ${isDark ? "text-[var(--gy2)]" : "text-black/50"}`}>
                  {tCard.description}
                </p>
              )}
            </div>
          );

          const actions = (
            <div
              className={`flex gap-[10px] flex-wrap ${isSolo ? "justify-start max-[960px]:justify-center" : "justify-center"} ${card.actionsPosition === "bottom" ? "mt-7" : "mb-7 max-[960px]:mb-6 max-[960px]:mt-0"}`}
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

          const baseCardClasses = isDark
            ? "pc-card group relative overflow-hidden border-r border-white/[.06] border-b border-b-white/[.06] transition-all duration-300 cursor-pointer hover:bg-[var(--bk2)]"
            : "pc-card group relative overflow-hidden border-r border-black/[.08] border-b border-b-black/[.08] transition-all duration-300 cursor-pointer hover:bg-[#f5f5f7]";

          if (isSolo) {
            return (
              <div
                key={card.watermark}
                className={`${baseCardClasses} col-span-2 max-[960px]:col-span-1 min-h-[220px] max-[960px]:min-h-0 flex max-[960px]:flex-col items-center max-[960px]:items-center justify-center gap-20 max-[960px]:gap-0 py-[60px] px-20 max-[960px]:py-[52px] max-[960px]:px-8 text-left max-[960px]:text-center border border-[rgba(220,175,100,.15)]`}
                style={{
                  background: "linear-gradient(135deg, #faf8f4 0%, #f5f0e8 50%, #faf8f4 100%)",
                }}
              >
                {/* Oversized watermark */}
                <span className="absolute -bottom-6 -right-3 font-bold text-[140px] max-[960px]:text-[90px] uppercase leading-none tracking-[-4px] pointer-events-none select-none text-[var(--g1)]/[.06] group-hover:text-[var(--g1)]/[.12] transition-colors duration-700">
                  {card.watermark}
                </span>

                {/* Gold accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent opacity-40 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--g1)]/[.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative z-10 flex flex-col items-start max-[960px]:items-center">
                  {content}
                </div>
                <div className="relative z-10">{actions}</div>
              </div>
            );
          }

          return (
            <div
              key={card.watermark}
              className={`${baseCardClasses} bg-[var(--bk)] py-16 px-[52px] max-[960px]:py-[52px] max-[960px]:px-8 flex flex-col justify-between ${card.featured ? "min-h-[400px]" : "min-h-[320px]"} max-[960px]:min-h-0 text-center items-center`}
            >
              {/* Oversized watermark */}
              <span className="absolute -bottom-6 -right-3 font-bold text-[140px] max-[960px]:text-[90px] uppercase leading-none tracking-[-4px] pointer-events-none select-none text-white/[.015] group-hover:text-[var(--g1)]/[.05] transition-colors duration-700">
                {card.watermark}
              </span>

              {/* Gold accent line */}
              <div className={`absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-out ${
                card.featured ? "w-full opacity-50 group-hover:opacity-100" : "w-0 group-hover:w-full"
              }`} />

              {/* Hover gradient overlay */}
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
