"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import {
  HOME_PRODUCTS,
  ORBITAL_RING_ORDER,
  type HomeProduct,
} from "@/data/home-products";
import { useOrbital } from "@/hooks/useOrbital";

interface HeroOrbitalProps {
  onActiveChange: (product: HomeProduct) => void;
}

// Build the ordered products array using ORBITAL_RING_ORDER.
const RING_PRODUCTS: HomeProduct[] = ORBITAL_RING_ORDER.map((id) => {
  const p = HOME_PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`ORBITAL_RING_ORDER references unknown id: ${id}`);
  return p;
});

// Desktop arc geometry
const ARC_CENTER_X_PCT = 72;
const ARC_CENTER_Y_PCT = 50;
const ARC_RADIUS_PCT = 42;
const RING_SIZE = 8;

function smallCardPositions(): { xPct: number; yPct: number }[] {
  const positions: { xPct: number; yPct: number }[] = [];
  const startDeg = -80;
  const endDeg = 80;
  const step = (endDeg - startDeg) / (RING_SIZE - 1);
  for (let i = 0; i < RING_SIZE; i++) {
    const angleDeg = startDeg + step * i;
    const angleRad = (angleDeg * Math.PI) / 180;
    const xPct = ARC_CENTER_X_PCT + ARC_RADIUS_PCT * 1.5 * Math.cos(angleRad);
    const yPct = ARC_CENTER_Y_PCT + ARC_RADIUS_PCT * Math.sin(angleRad);
    positions.push({ xPct, yPct });
  }
  return positions;
}

const SMALL_POSITIONS = smallCardPositions();

export function HeroOrbital({ onActiveChange }: HeroOrbitalProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [hintPlayed, setHintPlayed] = useState(false);

  // Detect viewport
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 960px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { activeIndex, progress, goTo, pause, resume } = useOrbital({
    itemCount: RING_PRODUCTS.length,
    initialIndex: 0,
    intervalMs: 4000,
    autoAdvance: !isMobile,
  });

  const activeProduct = RING_PRODUCTS[activeIndex];

  // Notify parent with 200ms delay so the new card appears first
  useEffect(() => {
    const timer = setTimeout(() => onActiveChange(activeProduct), 200);
    return () => clearTimeout(timer);
  }, [activeProduct, onActiveChange]);

  // Entrance animation — triggered after the hero claim finishes
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => setEntranceDone(true), 2500);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Mobile hint nudge once after entrance
  useEffect(() => {
    if (!isMobile || !entranceDone || hintPlayed) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    track.classList.add("hint");
    const timer = setTimeout(() => {
      track.classList.remove("hint");
      setHintPlayed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [isMobile, entranceDone, hintPlayed]);

  // Stagger delays for small-card entrance (120ms per card)
  const smallStaggerMs = (i: number) => 400 + i * 120;

  // Arc SVG path — semicircle opening to the left
  const arcPath = useMemo(() => {
    const cx = ARC_CENTER_X_PCT;
    const cy = ARC_CENTER_Y_PCT;
    const r = ARC_RADIUS_PCT * 1.5;
    const startX = cx + r * Math.cos((-80 * Math.PI) / 180);
    const startY = cy + r * Math.sin((-80 * Math.PI) / 180);
    const endX = cx + r * Math.cos((80 * Math.PI) / 180);
    const endY = cy + r * Math.sin((80 * Math.PI) / 180);
    return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  }, []);

  const handleSmallClick = (i: number) => {
    pause();
    goTo(i);
  };

  const handlePointerLeave = () => {
    setTimeout(resume, 2000);
  };

  // Helper to get cta text for a product
  const ctaTextFor = (product: HomeProduct) => {
    const idxInOriginal = HOME_PRODUCTS.findIndex((p) => p.id === product.id);
    return t.products.cards[idxInOriginal]?.cta ?? "Entrar";
  };

  return (
    <div
      ref={containerRef}
      className="hero-orbital"
      onPointerLeave={handlePointerLeave}
    >
      {/* Desktop version */}
      <div
        className="hero-orbital-desktop"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Arc SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`hero-orbital-arc ${entranceDone ? "in" : ""}`}
          aria-hidden="true"
        >
          <path d={arcPath} />
          {entranceDone && !isMobile && (
            <path
              d={arcPath}
              pathLength={RING_PRODUCTS.length}
              strokeDasharray={`${progress} ${RING_PRODUCTS.length - progress}`}
              strokeDashoffset={-activeIndex}
              className="hero-orbital-arc-progress"
            />
          )}
        </svg>

        {/* Active card */}
        <div
          className={`hero-orbital-active ${entranceDone ? "in" : ""}`}
          role="region"
          aria-live="polite"
          aria-label={`Producto activo: ${activeProduct.shortName}`}
          onPointerEnter={pause}
        >
          <div className="hero-orbital-active-bg">
            {activeProduct.asset.type === "video" ? (
              <video
                key={activeProduct.id}
                src={activeProduct.asset.src}
                poster={activeProduct.asset.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            ) : (
              <img
                key={activeProduct.id}
                src={activeProduct.asset.src}
                alt=""
                aria-hidden="true"
              />
            )}
          </div>
          <div className="hero-orbital-active-content">
            <div className="hero-orbital-active-title">
              {activeProduct.nameParts.map((part, i) => (
                <span
                  key={i}
                  className={part.gold ? "j3-grad-text" : "text-[var(--wh)]"}
                >
                  {part.text}
                </span>
              ))}
            </div>
            {activeProduct.soon ? (
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/25">
                {ctaTextFor(activeProduct)}
              </span>
            ) : activeProduct.isExternal ? (
              <a
                href={activeProduct.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-orbital-active-cta"
              >
                {ctaTextFor(activeProduct)}
                <span className="text-[16px] font-light">→</span>
              </a>
            ) : (
              <Link href={activeProduct.href} className="hero-orbital-active-cta">
                {ctaTextFor(activeProduct)}
                <span className="text-[16px] font-light">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Small cards — 8 fixed positions, active one hides via .active-hidden */}
        {RING_PRODUCTS.map((product, i) => {
          const pos = SMALL_POSITIONS[i];
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              type="button"
              className={`hero-orbital-small ${entranceDone ? "in" : ""} ${isActive ? "active-hidden" : ""}`}
              style={{
                left: `${pos.xPct}%`,
                top: `${pos.yPct}%`,
                transitionDelay: entranceDone ? "0ms" : `${smallStaggerMs(i)}ms`,
              }}
              aria-label={`${product.shortName}, audiencia ${product.audience}`}
              onClick={() => handleSmallClick(i)}
              onPointerEnter={pause}
              tabIndex={isActive ? -1 : 0}
            >
              <span className="hero-orbital-small-watermark">{product.watermark}</span>
              <span className="hero-orbital-small-name">{product.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile version */}
      <div className="hero-orbital-mobile">
        <div ref={mobileTrackRef} className="hero-orbital-mobile-track">
          {RING_PRODUCTS.map((product) => (
            <div key={product.id} className="hero-orbital-mobile-card">
              <div className="hero-orbital-mobile-card-bg">
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
                  />
                ) : (
                  <img
                    src={product.asset.src}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                  />
                )}
              </div>
              <div className="hero-orbital-mobile-card-title">
                {product.nameParts.map((part, j) => (
                  <span
                    key={j}
                    className={part.gold ? "j3-grad-text" : "text-[var(--wh)]"}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
              {product.soon ? (
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/30">
                  {ctaTextFor(product)}
                </span>
              ) : product.isExternal ? (
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-orbital-mobile-card-cta"
                >
                  {ctaTextFor(product)}
                  <span className="text-[16px] font-light">→</span>
                </a>
              ) : (
                <Link href={product.href} className="hero-orbital-mobile-card-cta">
                  {ctaTextFor(product)}
                  <span className="text-[16px] font-light">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
        <div
          className="hero-orbital-mobile-dots"
          role="tablist"
          aria-label="Productos"
        >
          {RING_PRODUCTS.map((product, i) => (
            <span
              key={product.id}
              className={`hero-orbital-mobile-dot ${i === activeIndex ? "active" : ""}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
