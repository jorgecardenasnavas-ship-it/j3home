"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

const sponsors = [
  { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52 },
  { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52 },
  { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56 },
];

// Total "virtual scroll" pixels needed to complete the logo animation
const SCROLL_BUDGET = 350;

export function SponsorsBanner() {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const lockedRef = useRef(false);
  const virtualScrollRef = useRef(0);
  const doneRef = useRef(false);
  const hasScrolledPastRef = useRef(false);

  const unlock = useCallback(() => {
    lockedRef.current = false;
    doneRef.current = true;
    document.body.style.overflow = "";
  }, []);

  useEffect(() => {
    const banner = bannerRef.current;
    if (!banner) return;

    // If the page loads already scrolled past the banner, mark as done
    const rect = banner.getBoundingClientRect();
    if (rect.bottom < 0) {
      doneRef.current = true;
      setProgress(1);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            !lockedRef.current &&
            !doneRef.current &&
            !hasScrolledPastRef.current
          ) {
            lockedRef.current = true;
            virtualScrollRef.current = 0;
            document.body.style.overflow = "hidden";
          }
        });
      },
      { threshold: 0.9 },
    );

    observer.observe(banner);

    function handleWheel(e: WheelEvent) {
      if (!lockedRef.current) return;
      e.preventDefault();

      // Only advance on scroll down (positive deltaY)
      if (e.deltaY > 0) {
        virtualScrollRef.current += e.deltaY;
      } else if (e.deltaY < 0) {
        // Allow scrolling back to reduce progress
        virtualScrollRef.current = Math.max(
          0,
          virtualScrollRef.current + e.deltaY,
        );
      }

      const p = Math.min(1, virtualScrollRef.current / SCROLL_BUDGET);
      setProgress(p);

      if (p >= 1) {
        unlock();
      }
    }

    let touchStartY = 0;
    function handleTouchStart(e: TouchEvent) {
      if (!lockedRef.current) return;
      touchStartY = e.touches[0].clientY;
    }
    function handleTouchMove(e: TouchEvent) {
      if (!lockedRef.current) return;
      e.preventDefault();

      const currentY = e.touches[0].clientY;
      const delta = touchStartY - currentY; // positive = scroll down
      touchStartY = currentY;

      if (delta > 0) {
        virtualScrollRef.current += delta;
      } else {
        virtualScrollRef.current = Math.max(
          0,
          virtualScrollRef.current + delta,
        );
      }

      const p = Math.min(1, virtualScrollRef.current / SCROLL_BUDGET);
      setProgress(p);

      if (p >= 1) {
        unlock();
      }
    }

    // Check if user has already scrolled past banner area on scroll
    function handleScroll() {
      const r = banner!.getBoundingClientRect();
      if (r.bottom < 0 && !lockedRef.current) {
        hasScrolledPastRef.current = true;
        doneRef.current = true;
        setProgress(1);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("scroll", handleScroll);
      document.body.style.overflow = "";
    };
  }, [unlock]);

  // Animation phases — compact so unlock happens soon after last logo
  const lineP = Math.min(1, progress / 0.12);
  const logo1 = Math.max(0, Math.min(1, (progress - 0.05) / 0.25));
  const logo2 = Math.max(0, Math.min(1, (progress - 0.25) / 0.25));
  const logo3 = Math.max(0, Math.min(1, (progress - 0.5) / 0.3));
  const logoProgress = [logo1, logo2, logo3];

  return (
    <div
      ref={bannerRef}
      id="partners"
      className="bg-white w-full py-10 max-[960px]:py-6 px-14 max-[960px]:px-6 flex flex-col items-center justify-center border-t border-black/[.06] overflow-hidden z-10"
    >
      {/* Expanding gold line */}
      <div
        className="h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent mb-8 max-[960px]:mb-5"
        style={{
          width: `${lineP * 100}%`,
          maxWidth: "400px",
          opacity: lineP,
        }}
      />

      <div className="inline-flex items-center flex-nowrap gap-[72px] max-[960px]:gap-10">
        {sponsors.map((s, i) => {
          const p = logoProgress[i];
          return (
            <div
              key={s.alt}
              style={{
                opacity: p,
                filter: `blur(${(1 - p) * 12}px) grayscale(${1 - p}) brightness(${1 + (1 - p) * 0.8})`,
                transform: `scale(${0.85 + 0.15 * p})`,
              }}
            >
              <Image
                src={s.src}
                alt={s.alt}
                width={s.w}
                height={s.h}
                className="h-[52px] max-[960px]:h-9 w-auto object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
