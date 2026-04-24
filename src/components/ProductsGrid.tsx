"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import { HOME_PRODUCTS, type HomeProduct } from "@/data/home-products";
import { ACADEMY_PROGRAMS } from "@/data/academy-programs";

/* ───────────────────────── helpers ───────────────────────── */

function TileBackground({
  asset,
  objectPosition,
  eager = false,
}: {
  asset: HomeProduct["asset"];
  objectPosition?: string;
  eager?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const style = objectPosition ? { objectPosition } : undefined;

  useEffect(() => {
    if (asset.type !== "video") return;
    const video = videoRef.current;
    if (!video) return;

    const { videoStart, videoEnd } = asset;

    if (videoStart !== undefined) {
      // Segment mode: seek + loop between timestamps
      const startPlayback = () => {
        video.currentTime = videoStart;
        video.play().catch(() => {});
      };
      const onTimeUpdate = () => {
        if (videoEnd !== undefined && video.currentTime >= videoEnd) {
          video.currentTime = videoStart;
        }
      };
      if (video.readyState >= 1) {
        startPlayback();
      } else {
        video.addEventListener("loadedmetadata", startPlayback);
      }
      video.addEventListener("timeupdate", onTimeUpdate);
      return () => {
        video.removeEventListener("loadedmetadata", startPlayback);
        video.removeEventListener("timeupdate", onTimeUpdate);
      };
    } else if (eager) {
      // Eager non-segment: trigger play programmatically as fallback
      if (video.readyState >= 3) {
        video.play().catch(() => {});
      } else {
        video.addEventListener("canplay", () => video.play().catch(() => {}), { once: true });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (asset.type === "video") {
    const hasSegment = asset.videoStart !== undefined;
    return (
      <div className="tile-bg">
        <video
          ref={hasSegment || eager ? videoRef : undefined}
          src={asset.src}
          poster={asset.poster}
          autoPlay={!hasSegment}
          muted
          loop={!hasSegment}
          playsInline
          preload={eager ? "auto" : "none"}
          aria-hidden="true"
          style={style}
        />
      </div>
    );
  }
  return (
    <div className="tile-bg">
      <img
        src={asset.src}
        alt=""
        aria-hidden="true"
        style={style}
        loading={eager ? "eager" : "lazy"}
      />
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
  tall = false,
  imagePosition,
  eager = false,
}: {
  product: HomeProduct;
  tCard: { tag: string; forLabel: string; cta: string };
  flagship?: boolean;
  showCoachBadge?: boolean;
  tall?: boolean;
  imagePosition?: string;
  eager?: boolean;
}) {
  const isDark = product.dark;

  return (
    <article
      data-flagship={flagship ? "true" : undefined}
      className="pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 bg-black hover:bg-[rgba(201,169,110,.03)]"
    >
      <TileBackground
        asset={product.asset}
        objectPosition={imagePosition}
        eager={eager}
      />
      <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
      {/* Text protection scrim — keeps title legible over any background */}
      <div className="absolute inset-0 z-[2] pointer-events-none bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      {/* Top accent line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] w-[60%] opacity-60 group-hover:w-full group-hover:opacity-90 z-[3]" />
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
      <div
        className={`relative z-10 flex flex-col justify-end py-20 px-12 max-[960px]:py-14 max-[960px]:px-6 ${
          tall
            ? "min-h-[88vh] max-[960px]:min-h-[75vh]"
            : "min-h-[62vh] max-[960px]:min-h-[58vh]"
        }`}
      >
        <div className="max-w-[640px]">
          <div
            className={`text-[10px] font-normal tracking-[3.5px] uppercase mb-4 ${
              isDark ? "text-[rgba(201,169,110,.7)]" : "text-black/40"
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

/* ──── Split featured block: image full on one side, content on other ──── */

function FeaturedSplitBlock({
  product,
  tCard,
}: {
  product: HomeProduct;
  tCard: { tag: string; forLabel: string; cta: string };
}) {
  return (
    <article className="pc-card group relative overflow-hidden border-t border-white/[.06] bg-black">
      <div className="grid grid-cols-[55%_45%] max-[960px]:grid-cols-1 min-h-[68vh] max-[960px]:min-h-0">
        {/* Image side — full, no crop tricks */}
        <div className="relative overflow-hidden max-[960px]:aspect-[4/3] bg-[#0a0a0b]">
          {product.asset.type === "video" ? (
            <video
              src={product.asset.src}
              poster={product.asset.poster}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={product.asset.src}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
            />
          )}
          {/* Premium badge on the image corner */}
          {product.premiumBadge && (
            <span
              className="absolute top-8 left-8 max-[960px]:top-5 max-[960px]:left-5 z-10 px-[9px] py-[3px] rounded-[999px] text-[9px] font-bold tracking-[2px] uppercase border border-[rgba(212,169,74,.5)] backdrop-blur-md"
              style={{ background: "rgba(10,10,10,.6)", color: "var(--g1)" }}
            >
              Premium
            </span>
          )}
        </div>
        {/* Content side */}
        <div className="relative flex flex-col justify-between py-16 px-14 max-[960px]:py-14 max-[960px]:px-6 max-[960px]:min-h-[360px]">
          {/* Top accent — subtle gold line growing on hover */}
          <div className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-[var(--g1)] to-transparent transition-all duration-700 ease-[var(--ease-out)] w-[25%] opacity-60 group-hover:w-[70%] group-hover:opacity-90" />
          <div>
            <div className="text-[10px] font-normal tracking-[3.5px] uppercase mb-5 text-[rgba(201,169,110,.7)]">
              {tCard.tag}
            </div>
            <h3 className="font-bold uppercase tracking-[-2.5px] leading-[0.95] text-[clamp(48px,5.5vw,84px)] max-[960px]:text-[clamp(40px,10vw,60px)]">
              {product.nameParts.map((part, i) =>
                part.gold ? (
                  <span key={i} className="j3-grad-text">
                    {part.text}
                  </span>
                ) : (
                  <span key={i} className="text-[var(--wh)]">
                    {part.text}
                  </span>
                ),
              )}
            </h3>
            <div className="text-[10px] font-light tracking-[2px] uppercase mt-5 text-white/45 max-w-[400px] leading-[1.6]">
              {tCard.forLabel}
            </div>
          </div>
          <div className="mt-10 max-[960px]:mt-8">
            {product.isExternal ? (
              <a
                href={product.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[18px] text-[var(--g1)]"
              >
                {tCard.cta}
                <span className="text-[16px] font-light">→</span>
              </a>
            ) : (
              <Link
                href={product.href}
                className="inline-flex items-center gap-[10px] text-[11px] font-bold tracking-[2px] uppercase no-underline transition-[gap] duration-200 hover:gap-[18px] text-[var(--g1)]"
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
        isDark ? "bg-black hover:bg-[rgba(201,169,110,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
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
              isDark ? "text-[rgba(201,169,110,.6)]" : "text-black/35"
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
        isDark ? "bg-black hover:bg-[rgba(201,169,110,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
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
              isDark ? "text-[rgba(201,169,110,.6)]" : "text-black/35"
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
  const mantraBridgeRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  /* Scroll-linked body background + data-theme transition (Academy-style).
     Bridge starts dark verde (#0E1C16). Cream kicks in when viewport center
     enters the bridge; reverts to dark when exiting into Business Plan. */
  useEffect(() => {
    const bridge = mantraBridgeRef.current;
    if (!bridge) return;

    document.body.style.transition = "background-color 1.4s cubic-bezier(.16,1,.3,1)";

    function onScrollBg() {
      const bridgeRect = bridge!.getBoundingClientRect();
      const bridgeTop = bridgeRect.top + window.scrollY;
      const bridgeBottom = bridgeTop + bridge!.offsetHeight;
      const mid = window.scrollY + window.innerHeight * 0.5;

      if (mid >= bridgeTop && mid <= bridgeBottom) {
        document.body.style.backgroundColor = "#F8F5EF";
        document.documentElement.setAttribute("data-theme", "light");
      } else {
        document.body.style.backgroundColor = "";
        document.documentElement.removeAttribute("data-theme");
      }
    }

    window.addEventListener("scroll", onScrollBg, { passive: true });
    onScrollBg();

    return () => {
      window.removeEventListener("scroll", onScrollBg);
      document.body.style.transition = "";
      document.body.style.backgroundColor = "";
      document.documentElement.removeAttribute("data-theme");
    };
  }, []);

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
        const rx = (y - 0.5) * -2;
        const ry = (x - 0.5) * 2;
        card.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      };
      const leave = () => {
        card.style.transform = "";
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

  const proximamenteProducts = [j3ptv, experience, partner];
  const proximamenteTCards = [
    tCardOf("j3ptv"),
    tCardOf("experience"),
    tCardOf("partner"),
  ];

  return (
    <section id="productos" ref={gridRef}>
      {/* ── Coach360 — featured standalone ── */}
      <FeaturedBlock
        product={coach360}
        tCard={tCardOf("coach360")}
        showCoachBadge
        eager
      />

      {/* ── Training Camp — featured standalone ── */}
      <FeaturedBlock
        product={trainingCamp}
        tCard={tCardOf("training-camp")}
        tall
        imagePosition="center 25%"
      />

      {/* ── Academy horizontal scroll ── */}
      <AcademyScroller />

      {/* ── Business mantra bridge ──
          Starts dark verde (#0E1C16), same palette as AcademyScroller cards.
          When viewport center enters, body transitions to cream and data-theme="light"
          drives all text/bg colour adaptations. */}
      <div
        ref={mantraBridgeRef}
        className="mantra-bridge relative py-[13vh] max-[960px]:py-[10vh] px-12 max-[960px]:px-6 text-center overflow-hidden"
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(27,61,47,.12) 0%, transparent 70%)" }}
        />
        <div className="relative flex flex-col items-center gap-5">
          <div className="mantra-bridge-accent w-px h-14" />
          <h2 className="font-black tracking-[-2px] leading-[1] text-[clamp(36px,5.5vw,80px)] max-[960px]:text-[clamp(28px,7vw,48px)]">
            {t.home.closer.split(". ").map((word, i, arr) => (
              <span key={i}>
                <span className={
                  i === 0 ? "mantra-bridge-word-1" :
                  i === arr.length - 1 ? "mantra-bridge-word-3" :
                  "mantra-bridge-word-2"
                }>
                  {word}{i < arr.length - 1 ? "." : ""}
                </span>
                {i < arr.length - 1 && " "}
              </span>
            ))}
          </h2>
          <p className="mantra-bridge-subtitle text-[11px] font-light tracking-[2.5px] uppercase mt-1">
            {t.home.line2}
          </p>
        </div>
      </div>

      {/* ── Business Plan — protagonismo propio ── */}
      <FeaturedBlock
        product={businessPlan}
        tCard={tCardOf("business-plan")}
        tall
      />

      {/* ── Próximamente header ── */}
      <div className="proximamente-header">
        <span className="proximamente-eyebrow">Próximamente</span>
      </div>

      {/* ── Próximamente horizontal scroll ── */}
      <div className="prox-scroller">
        {proximamenteProducts.map((product, i) => {
          const tCard = proximamenteTCards[i];
          const isDark = product.dark;
          return (
            <div key={product.id} className="prox-card pc-card" data-idx={i}>
              <TileBackground asset={product.asset} />
              <div className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="relative z-10 flex flex-col justify-end h-full p-8 max-[960px]:p-6">
                <div className={`text-[10px] font-bold tracking-[3px] uppercase mb-2 ${isDark ? "text-[rgba(201,169,110,.6)]" : "text-black/40"}`}>
                  {tCard.tag}
                </div>
                <div className="font-black uppercase tracking-[-2px] leading-[0.95] text-[clamp(32px,3.5vw,48px)] text-white">
                  {product.nameParts.map((part, j) =>
                    part.gold ? (
                      <span key={j} className="j3-grad-text">{part.text}</span>
                    ) : (
                      <span key={j} className="text-white">{part.text}</span>
                    )
                  )}
                </div>
                <div className="mt-4 text-[10px] font-bold tracking-[2.5px] uppercase text-white/25">
                  {tCard.cta}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
