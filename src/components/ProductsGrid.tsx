"use client";

import React, { useEffect, useRef, useState } from "react";
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
          <span className="text-[13px] font-bold text-[var(--wh)] leading-tight">
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
      className="pc-card group relative overflow-hidden transition-all duration-300 bg-black"
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

/* ─── Barra de progreso del scroll horizontal (igual que en Academy) ─── */

function CarouselProgress({ progress }: { progress: number }) {
  return (
    <div className="mt-5 h-[2px] w-full bg-white/[.07] relative overflow-hidden" aria-hidden>
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: "28%",
          transform: `translateX(${progress * (100 / 0.28 - 100)}%)`,
          background: "linear-gradient(to right, rgba(201,169,110,0.25), var(--g1), rgba(201,169,110,0.25))",
          transition: "transform .18s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

/* ─────────── Academy horizontal scroll (Apple-style) ─────────── */

function AcademyScroller() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

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
      <div ref={trackRef} className="academy-scroller-track">
        {ACADEMY_PROGRAMS.map((program) => (
          <Link
            key={program.id}
            href={`/academy#${program.anchor}`}
            className="academy-scroller-card j3-press"
          >
            <img
              src={program.image}
              alt={program.name}
              loading="lazy"
              className="academy-scroller-card-img"
            />
            <div className="academy-scroller-card-line" />
            <div className="academy-scroller-card-grad-top" />
            <div className="academy-scroller-card-grad-bot" />
            <div className="academy-scroller-card-top">
              <div className="academy-scroller-card-name">{program.name}</div>
              <span className="academy-scroller-card-tag">{program.tag}</span>
            </div>
            <div className="academy-scroller-card-cta">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
      <div className="px-12 max-[960px]:px-6">
        <CarouselProgress progress={progress} />
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const proxScrollerRef = useRef<HTMLDivElement>(null);
  const [proxProgress, setProxProgress] = useState(0);
  const { t } = useI18n();

  /* Progreso del scroller de Próximamente */
  useEffect(() => {
    const el = proxScrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollWidth - el.clientWidth;
      setProxProgress(max > 0 ? el.scrollLeft / max : 0);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-linked body background + data-theme transition.
     Triggers at 70% of AcademyScroller height (descending → cream, ascending → verde).
     Bidirectional: scrolling back up reverts to dark verde. */
  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    document.body.style.transition = "background-color 1.4s cubic-bezier(.16,1,.3,1)";

    function onScrollBg() {
      const scrollerRect = scroller!.getBoundingClientRect();
      const triggerPoint = scrollerRect.top + window.scrollY + scrollerRect.height * 0.70;
      const mid = window.scrollY + window.innerHeight * 0.5;

      if (mid >= triggerPoint) {
        document.body.style.backgroundColor = "#F8F5EF";
        document.documentElement.setAttribute("data-theme", "light");
        scroller!.classList.add("is-light");
      } else {
        document.body.style.backgroundColor = "";
        document.documentElement.removeAttribute("data-theme");
        scroller!.classList.remove("is-light");
      }
    }

    window.addEventListener("scroll", onScrollBg, { passive: true });
    onScrollBg();

    return () => {
      window.removeEventListener("scroll", onScrollBg);
      document.body.style.transition = "";
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

    return () => {
      revealObserver.disconnect();
    };
  }, []);

  /* Drag-to-scroll — mismo patrón que useDragScroll() en academy/page.tsx */
  useEffect(() => {
    const scrollers = document.querySelectorAll<HTMLElement>(
      ".academy-scroller-track, .prox-scroller",
    );
    const cleanups: (() => void)[] = [];

    scrollers.forEach((el) => {
      const drag = { startX: 0, scrollLeft: 0, active: false, moved: false };

      const onDown = (e: MouseEvent) => {
        e.preventDefault();
        drag.startX = e.pageX;
        drag.scrollLeft = el.scrollLeft;
        drag.active = true;
        drag.moved = false;
        el.style.cursor = "grabbing";
        el.style.userSelect = "none";
        el.style.scrollSnapType = "none";
      };

      const onMove = (e: MouseEvent) => {
        if (!drag.active) return;
        e.preventDefault();
        const walk = (e.pageX - drag.startX) * 1.2;
        if (Math.abs(walk) > 3) drag.moved = true;
        el.scrollLeft = drag.scrollLeft - walk;
      };

      const onUp = () => {
        if (!drag.active) return;
        drag.active = false;
        el.style.cursor = "grab";
        el.style.userSelect = "";
        el.style.scrollSnapType = "";
        if (drag.moved) {
          const block = (ev: Event) => { ev.preventDefault(); ev.stopPropagation(); };
          el.addEventListener("click", block, { capture: true, once: true });
        }
      };

      el.style.cursor = "grab";
      el.addEventListener("mousedown", onDown);
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);

      cleanups.push(() => {
        el.removeEventListener("mousedown", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      });
    });

    return () => cleanups.forEach((fn) => fn());
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
      <div ref={scrollerRef}>
        <AcademyScroller />
      </div>

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
        <div className="proximamente-inner">
          <div className="proximamente-rule" />
          <div className="proximamente-badge">
            <span className="proximamente-dot" />
            <span className="proximamente-eyebrow">Próximamente</span>
          </div>
          <div className="proximamente-rule" />
        </div>
        <p className="proximamente-sub">Nuevos productos en desarrollo</p>
      </div>

      {/* ── Próximamente horizontal scroll ── */}
      <div ref={proxScrollerRef} className="prox-scroller">
        {proximamenteProducts.map((product, i) => {
          const tCard = proximamenteTCards[i];
          return (
            <div key={product.id} className="prox-card" data-idx={i} data-product-id={product.id}>
              {/* Media — full-bleed, siempre visible */}
              <TileBackground asset={product.asset} />

              {/* Línea dorada superior — se expande al hover */}
              <div className="prox-gold-line absolute top-0 left-1/2 -translate-x-1/2 z-[10] pointer-events-none" />

              {/* Gradiente superior */}
              <div
                className="absolute top-0 left-0 w-full h-[50%] z-[5] pointer-events-none"
                style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 30%, rgba(0,0,0,0.18) 65%, transparent 100%)" }}
              />
              {/* Gradiente inferior */}
              <div
                className="absolute bottom-0 left-0 w-full h-[50%] z-[5] pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.15) 65%, transparent 100%)" }}
              />

              {/* Contenido superior — nombre + tag */}
              <div
                className="absolute top-0 left-0 right-0 z-[6] flex flex-col items-center pt-7 max-[960px]:pt-5 px-5 text-center"
                style={{ textShadow: "0 2px 14px rgba(0,0,0,0.55), 0 1px 3px rgba(0,0,0,0.4)" }}
              >
                <div className="font-black uppercase tracking-[-2px] leading-[0.95] text-[clamp(28px,3.2vw,44px)]">
                  {product.nameParts.map((part, j) =>
                    part.gold ? (
                      <span key={j} style={{ color: "var(--g1)" }}>{part.text}</span>
                    ) : (
                      <span key={j} className="text-[var(--wh)]">{part.text}</span>
                    )
                  )}
                </div>
                <span className="mt-[9px] text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
                  {tCard.tag}
                </span>
              </div>

              {/* Contenido inferior — badge + flecha */}
              <div className="absolute bottom-0 left-0 right-0 z-[13] p-[18px] max-[960px]:p-[14px]">
                <div className="flex items-end justify-between gap-3">
                  <span
                    className="inline-flex items-center px-2.5 py-[5px] text-[9px] font-bold tracking-[1.5px] uppercase text-black"
                    style={{ background: "#C9A96E", borderRadius: 2 }}
                  >
                    {tCard.cta}
                  </span>
                  <span
                    className="prox-cta shrink-0 text-[var(--g1)]"
                    style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55)" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M5 12h14" />
                      <path d="M12 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-12 max-[960px]:px-6">
        <CarouselProgress progress={proxProgress} />
      </div>

    </section>
  );
}
