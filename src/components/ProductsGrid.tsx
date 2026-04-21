"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

interface TileConfig {
  nameParts: { text: string; gold: boolean }[];
  watermark: string;
  dark: boolean;
  featured: boolean;
  premiumBadge: boolean;
  href: string;
  isExternal: boolean;
  soon: boolean;
  fullWidth: boolean;
}

const TILES: TileConfig[] = [
  {
    nameParts: [{ text: "Coach", gold: true }, { text: "\u00A0360", gold: false }],
    watermark: "C360",
    dark: true,
    featured: true,
    premiumBadge: false,
    href: "https://j3padel.com/join",
    isExternal: true,
    soon: false,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "Training", gold: true }, { text: "\u00A0Camp", gold: false }],
    watermark: "TC",
    dark: true,
    featured: true,
    premiumBadge: true,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Adults", gold: false }],
    watermark: "ADT",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Juniors", gold: false }],
    watermark: "JNR",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "J3P", gold: true }, { text: "TV", gold: false }],
    watermark: "TV",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "Business", gold: true }, { text: "\u00A0Plan", gold: false }],
    watermark: "BIZ",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Experience", gold: false }],
    watermark: "EXP",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Partner", gold: false }],
    watermark: "PTR",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
  },
];

const DIVIDER_AFTER_INDEX = 1;

export function ProductsGrid() {
  const gridRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLDivElement>(".pc-card");

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const card = entry.target as HTMLElement;
            const delay = parseInt(card.dataset.idx ?? "0", 10) * 90;
            setTimeout(() => card.classList.add("in"), delay);
            revealObserver.unobserve(card);
          }
        });
      },
      { threshold: 0.12 },
    );

    cards.forEach((card) => revealObserver.observe(card));

    const isDesktop = window.matchMedia(
      "(min-width: 961px) and (hover: hover)",
    ).matches;
    if (!isDesktop) return () => revealObserver.disconnect();

    const handlers = new Map<
      HTMLDivElement,
      { move: (e: MouseEvent) => void; leave: () => void }
    >();

    cards.forEach((card) => {
      const glow = card.querySelector<HTMLElement>(".pc-glow");

      const move = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rx = (y - 0.5) * -4;
        const ry = (x - 0.5) * 4;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.01)`;
        if (glow) {
          glow.style.opacity = "1";
          glow.style.background = `radial-gradient(600px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(220,175,100,0.06), transparent 60%)`;
        }
      };

      const leave = () => {
        card.style.transform = "";
        if (glow) glow.style.opacity = "0";
      };

      card.addEventListener("mousemove", move);
      card.addEventListener("mouseleave", leave);
      handlers.set(card, { move, leave });
    });

    return () => {
      revealObserver.disconnect();
      handlers.forEach(({ move, leave }, card) => {
        card.removeEventListener("mousemove", move);
        card.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section id="productos" ref={gridRef} className="grid grid-cols-2 max-[960px]:grid-cols-1">
      {TILES.map((tile, idx) => {
        const tCard = t.products.cards[idx];
        const isDark = tile.dark;

        const topAccent = (
          <div
            className={`absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] ${
              tile.featured
                ? "w-[60%] opacity-40 group-hover:w-full group-hover:opacity-80"
                : "w-0 opacity-0 group-hover:w-[80%] group-hover:opacity-60"
            }`}
          />
        );

        const watermark = (
          <span
            className={`absolute -bottom-4 -right-2 font-bold text-[120px] max-[960px]:text-[80px] uppercase leading-none tracking-[-4px] pointer-events-none select-none transition-colors duration-700 ${
              isDark
                ? "text-white/[.015] group-hover:text-[var(--g1)]/[.04]"
                : "text-black/[.03] group-hover:text-[var(--g1)]/[.08]"
            }`}
          >
            {tile.watermark}
          </span>
        );

        const productName = (
          <div className="font-bold uppercase tracking-[-2px] leading-[1] text-[clamp(38px,4.5vw,56px)] max-[960px]:text-[clamp(36px,8vw,52px)]">
            {tile.nameParts.map((part, i) =>
              part.gold ? (
                <span key={i} className="j3-grad-text">
                  {part.text}
                </span>
              ) : (
                <span key={i} className={isDark ? "text-[var(--wh)]" : "text-[#1d1d1f]"}>
                  {part.text}
                </span>
              ),
            )}
          </div>
        );

        const tagLine = (
          <div
            className={`text-[10px] font-normal tracking-[3.5px] uppercase mb-3 ${
              isDark ? "text-[rgba(220,175,100,.6)]" : "text-black/35"
            }`}
          >
            {tCard.tag}
            {tile.premiumBadge && (
              <span
                className="ml-2 px-[7px] py-[2px] rounded-[999px] text-[9px] font-bold tracking-[2px] border border-[rgba(212,169,74,.35)]"
                style={{ background: "rgba(212,169,74,.12)", color: "var(--g1)" }}
              >
                Premium
              </span>
            )}
          </div>
        );

        const forLabel = (
          <div
            className={`text-[10px] font-light tracking-[2px] uppercase mt-[10px] ${
              isDark ? "text-white/40" : "text-black/35"
            }`}
          >
            {tCard.forLabel}
          </div>
        );

        const ctaEl = tile.soon ? (
          <span
            className={`text-[11px] font-bold tracking-[2px] uppercase ${
              isDark ? "text-[rgba(255,255,255,.25)]" : "text-black/30"
            }`}
          >
            {tCard.cta}
          </span>
        ) : (
          <a
            href={tile.href}
            {...(tile.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[16px] ${
              isDark ? "text-[var(--g1)]" : "text-[#8a6d2a]"
            }`}
          >
            {tCard.cta}
            <span className="text-[16px] font-light">→</span>
          </a>
        );

        const divider =
          idx === DIVIDER_AFTER_INDEX ? (
            <div
              key="academy-divider"
              className="col-span-2 max-[960px]:col-span-1 px-12 max-[960px]:px-6 py-[14px] border-b border-white/[.06] bg-white/[.01] text-[9px] font-normal tracking-[4px] uppercase text-white/[.18]"
            >
              {t.products.academyDivider}
            </div>
          ) : null;

        if (tile.fullWidth) {
          return (
            <>
              {divider}
              <div
                key={tile.watermark}
                data-idx={idx}
                className={`pc-card group relative overflow-hidden col-span-2 max-[960px]:col-span-1 border-t border-white/[.06] transition-all duration-300 ${
                  isDark ? "bg-black hover:bg-[rgba(220,175,100,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
                }`}
              >
                <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
                {topAccent}
                {watermark}
                <div className="relative z-10 flex items-center justify-between gap-16 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-6 py-14 px-12 max-[960px]:py-12 max-[960px]:px-8">
                  <div>
                    {tagLine}
                    {productName}
                    {forLabel}
                  </div>
                  <div className="shrink-0">{ctaEl}</div>
                </div>
              </div>
            </>
          );
        }

        return (
          <>
            {divider}
            <div
              key={tile.watermark}
              data-idx={idx}
              className={`pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 ${
                tile.featured
                  ? isDark
                    ? "bg-[rgba(220,175,100,.04)] hover:bg-[rgba(220,175,100,.06)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
                  : isDark
                    ? "bg-black hover:bg-[rgba(220,175,100,.02)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
              } ${
                idx % 2 === 0
                  ? "border-r border-r-white/[.06] max-[960px]:border-r-0"
                  : ""
              }`}
            >
              <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
              {topAccent}
              {watermark}
              <div className="relative z-10 flex flex-col justify-between min-h-[280px] max-[960px]:min-h-0 py-14 px-10 max-[960px]:py-12 max-[960px]:px-8">
                <div>
                  {tagLine}
                  {productName}
                  {forLabel}
                </div>
                <div className="mt-8 max-[960px]:mt-6">{ctaEl}</div>
              </div>
            </div>
          </>
        );
      })}
    </section>
  );
}
