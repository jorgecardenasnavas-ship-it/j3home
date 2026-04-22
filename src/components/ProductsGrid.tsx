"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { HOME_PRODUCTS, type HomeProduct } from "@/data/home-products";
import { ACADEMY_PROGRAMS } from "@/data/academy-programs";

/* ───────────────────────── helpers ───────────────────────── */

function TileBackground({ asset }: { asset: HomeProduct["asset"] }) {
  if (asset.type === "video") {
    return (
      <div className="tile-bg">
        <video
          src={asset.src}
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
    );
  }
  return (
    <div className="tile-bg">
      <img src={asset.src} alt="" aria-hidden="true" />
    </div>
  );
}

function Coach360Feature() {
  return (
    <div className="absolute top-6 right-6 z-30 max-[960px]:top-4 max-[960px]:right-4 pointer-events-none">
      <div className="flex items-center gap-3 bg-black/55 backdrop-blur-md border border-[rgba(212,169,74,0.3)] rounded-md pl-2 pr-4 py-2 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-[14px] shrink-0"
          style={{ background: "var(--j3-grad)", color: "#000" }}
        >
          MV
        </div>
        <div className="flex flex-col gap-[2px]">
          <span className="text-[8px] tracking-[2.5px] uppercase font-bold j3-grad-text">
            Coach del mes
          </span>
          <span className="text-[13px] font-bold text-white leading-tight">
            Martín Vega
          </span>
          <span className="text-[9px] text-white/50 leading-tight">
            Marbella · ★ 4.9
          </span>
        </div>
      </div>
    </div>
  );
}

/* ───── Standalone featured block: full-width, large, dramatic ───── */

function FeaturedBlock({
  product,
  tCard,
  flagship = false,
  showCoachBadge = false,
}: {
  product: HomeProduct;
  tCard: { tag: string; forLabel: string; cta: string };
  flagship?: boolean;
  showCoachBadge?: boolean;
}) {
  const isDark = product.dark;

  return (
    <article
      data-flagship={flagship ? "true" : undefined}
      className="pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 bg-black hover:bg-[rgba(220,175,100,.03)]"
    >
      <TileBackground asset={product.asset} />
      <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] w-[60%] opacity-60 group-hover:w-full group-hover:opacity-90" />
      {/* Watermark */}
      <span
        className={`absolute -bottom-6 -right-4 font-bold text-[clamp(140px,16vw,240px)] uppercase leading-none tracking-[-6px] pointer-events-none select-none transition-colors duration-700 ${
          isDark
            ? "text-white/[.02] group-hover:text-[var(--g1)]/[.05]"
            : "text-black/[.03] group-hover:text-[var(--g1)]/[.08]"
        }`}
      >
        {product.watermark}
      </span>
      {showCoachBadge && <Coach360Feature />}
      {product.premiumBadge && (
        <span
          className="absolute top-8 left-12 max-[960px]:top-5 max-[960px]:left-6 z-30 px-[9px] py-[3px] rounded-[999px] text-[9px] font-bold tracking-[2px] uppercase border border-[rgba(212,169,74,.4)]"
          style={{ background: "rgba(212,169,74,.15)", color: "var(--g1)" }}
        >
          Premium
        </span>
      )}
      <div className="relative z-10 min-h-[62vh] max-[960px]:min-h-[58vh] flex flex-col justify-end py-20 px-12 max-[960px]:py-14 max-[960px]:px-6">
        <div className="max-w-[640px]">
          <div
            className={`text-[10px] font-normal tracking-[3.5px] uppercase mb-4 ${
              isDark ? "text-[rgba(220,175,100,.7)]" : "text-black/40"
            }`}
          >
            {tCard.tag}
          </div>
          <h3 className="font-bold uppercase tracking-[-2.5px] leading-[0.95] text-[clamp(52px,7vw,92px)] max-[960px]:text-[clamp(44px,11vw,68px)]">
            {product.nameParts.map((part, i) =>
              part.gold ? (
                <span key={i} className="j3-grad-text">
                  {part.text}
                </span>
              ) : (
                <span
                  key={i}
                  className={isDark ? "text-[var(--wh)]" : "text-[#1d1d1f]"}
                >
                  {part.text}
                </span>
              ),
            )}
          </h3>
          <div
            className={`text-[10px] font-light tracking-[2px] uppercase mt-4 ${
              isDark ? "text-white/45" : "text-black/40"
            }`}
          >
            {tCard.forLabel}
          </div>
          <div className="mt-10 max-[960px]:mt-8">
            {product.isExternal ? (
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[18px] ${
                  isDark ? "text-[var(--g1)]" : "text-[#8a6d2a]"
                }`}
              >
                {tCard.cta}
                <span className="text-[16px] font-light">→</span>
              </a>
            ) : (
              <Link
                href={product.href}
                className={`inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[18px] ${
                  isDark ? "text-[var(--g1)]" : "text-[#8a6d2a]"
                }`}
              >
                {tCard.cta}
                <span className="text-[16px] font-light">→</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─────────── Academy horizontal scroll (Apple-style) ─────────── */

function AcademyScroller() {
  return (
    <section className="academy-scroller">
      <div className="academy-scroller-header">
        <div>
          <span className="academy-scroller-eyebrow">Academy</span>
          <h3 className="academy-scroller-title">Programas por edad y nivel</h3>
        </div>
        <Link href="/academy" className="academy-scroller-cta">
          Ver todos los programas
          <span className="text-[16px] font-light">→</span>
        </Link>
      </div>
      <div className="academy-scroller-track">
        {ACADEMY_PROGRAMS.map((program) => (
          <Link
            key={program.id}
            href={`/academy#${program.anchor}`}
            className="academy-scroller-card j3-press"
          >
            <div className="academy-scroller-card-img">
              <img src={program.image} alt={program.name} loading="lazy" />
            </div>
            <div className="academy-scroller-card-body">
              <div className="academy-scroller-card-tag">{program.tag}</div>
              <div className="academy-scroller-card-name">{program.name}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ─────── Standard 2-col tile (for J3PTV, Business Plan) ─────── */

function StandardTile({
  product,
  tCard,
  idx,
}: {
  product: HomeProduct;
  tCard: { tag: string; forLabel: string; cta: string };
  idx: number;
}) {
  const isDark = product.dark;
  const ctaEl = product.soon ? (
    <span
      className={`text-[11px] font-bold tracking-[2px] uppercase ${
        isDark ? "text-[rgba(255,255,255,.25)]" : "text-black/30"
      }`}
    >
      {tCard.cta}
    </span>
  ) : (
    <a
      href={product.href}
      {...(product.isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[16px] ${
        isDark ? "text-[var(--g1)]" : "text-[#8a6d2a]"
      }`}
    >
      {tCard.cta}
      <span className="text-[16px] font-light">→</span>
    </a>
  );

  return (
    <div
      data-idx={idx}
      className={`pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 ${
        isDark ? "bg-black hover:bg-[rgba(220,175,100,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
      } ${idx % 2 === 0 ? "border-r border-r-white/[.06] max-[960px]:border-r-0" : ""}`}
    >
      <TileBackground asset={product.asset} />
      <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
      {/* top accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] w-0 opacity-0 group-hover:w-[80%] group-hover:opacity-60" />
      {/* watermark */}
      <span
        className={`absolute -bottom-4 -right-2 font-bold text-[120px] max-[960px]:text-[80px] uppercase leading-none tracking-[-4px] pointer-events-none select-none transition-colors duration-700 ${
          isDark
            ? "text-white/[.015] group-hover:text-[var(--g1)]/[.04]"
            : "text-black/[.03] group-hover:text-[var(--g1)]/[.08]"
        }`}
      >
        {product.watermark}
      </span>
      <div className="relative z-10 flex flex-col justify-between min-h-[400px] max-[960px]:min-h-[320px] py-24 px-12 max-[960px]:py-16 max-[960px]:px-8">
        <div>
          <div
            className={`text-[10px] font-normal tracking-[3.5px] uppercase mb-3 ${
              isDark ? "text-[rgba(220,175,100,.6)]" : "text-black/35"
            }`}
          >
            {tCard.tag}
          </div>
          <div className="font-bold uppercase tracking-[-2px] leading-[1] text-[clamp(38px,4.5vw,56px)] max-[960px]:text-[clamp(36px,8vw,52px)]">
            {product.nameParts.map((part, i) =>
              part.gold ? (
                <span key={i} className="j3-grad-text">
                  {part.text}
                </span>
              ) : (
                <span
                  key={i}
                  className={isDark ? "text-[var(--wh)]" : "text-[#1d1d1f]"}
                >
                  {part.text}
                </span>
              ),
            )}
          </div>
          <div
            className={`text-[10px] font-light tracking-[2px] uppercase mt-[10px] ${
              isDark ? "text-white/40" : "text-black/35"
            }`}
          >
            {tCard.forLabel}
          </div>
        </div>
        <div className="mt-14 max-[960px]:mt-10">{ctaEl}</div>
      </div>
    </div>
  );
}

/* ────────────── Full-width tile (Experience, Partner) ────────────── */

function FullWidthTile({
  product,
  tCard,
  idx,
}: {
  product: HomeProduct;
  tCard: { tag: string; forLabel: string; cta: string };
  idx: number;
}) {
  const isDark = product.dark;
  const ctaEl = product.soon ? (
    <span
      className={`text-[11px] font-bold tracking-[2px] uppercase ${
        isDark ? "text-[rgba(255,255,255,.25)]" : "text-black/30"
      }`}
    >
      {tCard.cta}
    </span>
  ) : (
    <a
      href={product.href}
      {...(product.isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={`inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[16px] ${
        isDark ? "text-[var(--g1)]" : "text-[#8a6d2a]"
      }`}
    >
      {tCard.cta}
      <span className="text-[16px] font-light">→</span>
    </a>
  );

  return (
    <div
      data-idx={idx}
      className={`pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 ${
        isDark ? "bg-black hover:bg-[rgba(220,175,100,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
      }`}
    >
      <TileBackground asset={product.asset} />
      <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] w-0 opacity-0 group-hover:w-[80%] group-hover:opacity-60" />
      <span
        className={`absolute -bottom-4 -right-2 font-bold text-[120px] max-[960px]:text-[80px] uppercase leading-none tracking-[-4px] pointer-events-none select-none transition-colors duration-700 ${
          isDark
            ? "text-white/[.015] group-hover:text-[var(--g1)]/[.04]"
            : "text-black/[.03] group-hover:text-[var(--g1)]/[.08]"
        }`}
      >
        {product.watermark}
      </span>
      <div className="relative z-10 flex items-center justify-between gap-16 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-6 py-24 px-14 max-[960px]:py-16 max-[960px]:px-8">
        <div>
          <div
            className={`text-[10px] font-normal tracking-[3.5px] uppercase mb-3 ${
              isDark ? "text-[rgba(220,175,100,.6)]" : "text-black/35"
            }`}
          >
            {tCard.tag}
          </div>
          <div className="font-bold uppercase tracking-[-2px] leading-[1] text-[clamp(38px,4.5vw,56px)] max-[960px]:text-[clamp(36px,8vw,52px)]">
            {product.nameParts.map((part, i) =>
              part.gold ? (
                <span key={i} className="j3-grad-text">
                  {part.text}
                </span>
              ) : (
                <span
                  key={i}
                  className={isDark ? "text-[var(--wh)]" : "text-[#1d1d1f]"}
                >
                  {part.text}
                </span>
              ),
            )}
          </div>
          <div
            className={`text-[10px] font-light tracking-[2px] uppercase mt-[10px] ${
              isDark ? "text-white/40" : "text-black/35"
            }`}
          >
            {tCard.forLabel}
          </div>
        </div>
        <div className="shrink-0">{ctaEl}</div>
      </div>
    </div>
  );
}

/* ───────────────────────── main component ───────────────────────── */

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
        const rx = (y - 0.5) * -3;
        const ry = (x - 0.5) * 3;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
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

  // Find products by id to avoid index coupling
  const byId = (id: string) => HOME_PRODUCTS.find((p) => p.id === id)!;
  const tCardOf = (id: string) => {
    const idx = HOME_PRODUCTS.findIndex((p) => p.id === id);
    return t.products.cards[idx];
  };

  const coach360 = byId("coach360");
  const trainingCamp = byId("training-camp");
  const j3ptv = byId("j3ptv");
  const businessPlan = byId("business-plan");
  const experience = byId("experience");
  const partner = byId("partner");

  return (
    <section id="productos" ref={gridRef}>
      {/* ── Coach360 — featured standalone ── */}
      <FeaturedBlock
        product={coach360}
        tCard={tCardOf("coach360")}
        flagship
        showCoachBadge
      />

      {/* ── Training Camp — featured standalone ── */}
      <FeaturedBlock
        product={trainingCamp}
        tCard={tCardOf("training-camp")}
      />

      {/* ── Academy horizontal scroll ── */}
      <AcademyScroller />

      {/* ── J3PTV + Business Plan (2-col) ── */}
      <div className="grid grid-cols-2 max-[960px]:grid-cols-1">
        <StandardTile product={j3ptv} tCard={tCardOf("j3ptv")} idx={0} />
        <StandardTile
          product={businessPlan}
          tCard={tCardOf("business-plan")}
          idx={1}
        />
      </div>

      {/* ── Experience + Partner (full-width each) ── */}
      <FullWidthTile product={experience} tCard={tCardOf("experience")} idx={2} />
      <FullWidthTile product={partner} tCard={tCardOf("partner")} idx={3} />
    </section>
  );
}
