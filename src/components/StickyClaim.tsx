"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();
  const [show, setShow]             = useState(false);
  const [overOrigin, setOverOrigin] = useState(false);
  const lastScrollY                 = useRef(0);
  const showRef                     = useRef(false);

  useEffect(() => {
    /**
     * Lee --nav-offset (publicado por Navbar.tsx) para saber dónde está
     * físicamente la barra en el viewport en este momento.
     */
    function getNavOffset(): number {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--nav-offset")
        .trim();
      const n = parseFloat(raw);
      return Number.isFinite(n) ? n : 64;
    }

    /**
     * Comprueba si .home-origin solapa con la franja de la barra.
     * La barra ocupa [navOffset, navOffset + 32] en el viewport.
     */
    function checkOverOrigin() {
      const origin = document.querySelector<HTMLElement>(".home-origin");
      if (!origin) return;

      const navOffset = getNavOffset();
      const barTop    = navOffset;
      const barBottom = navOffset + 32;

      const rect = origin.getBoundingClientRect();
      setOverOrigin(rect.top < barBottom && rect.bottom > barTop);
    }

    function handleScroll() {
      const y  = window.scrollY;
      const vh = window.innerHeight;

      /* Hysteresis: aparece a 70 % vh, desaparece a 40 % vh */
      const nextShow = showRef.current ? y > vh * 0.4 : y > vh * 0.7;
      showRef.current = nextShow;
      setShow(nextShow);

      lastScrollY.current = y;

      /* Solo comprobamos el solapamiento cuando la barra es visible */
      if (nextShow) checkOverOrigin();
      else setOverOrigin(false);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bg        = overOrigin ? "rgba(248,245,239,0.95)" : "var(--verde)";
  const border    = overOrigin ? "1px solid rgba(27,61,47,0.12)"    : "1px solid rgba(201,169,110,0.18)";
  const dotColor  = overOrigin ? "rgba(27,61,47,0.25)"  : "rgba(201,169,110,0.35)";
  const textColor = overOrigin ? "rgba(27,61,47,0.55)"  : "rgba(248,245,239,0.70)";

  return (
    <div
      className={`fixed left-0 right-0 z-[80] h-[32px] flex items-center justify-center pointer-events-none ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: "var(--nav-offset, 64px)",
        background: bg,
        borderBottom: border,
        transition: "top 300ms cubic-bezier(.4,0,.2,1), opacity 300ms, background-color 300ms, border-color 300ms",
      }}
    >
      <span className="text-[10px] tracking-[5px] uppercase font-normal select-none">
        <span className="j3-grad-text font-bold">{t.hero.play}</span>
        <span className="mx-3" style={{ color: dotColor }}>·</span>
        <span className="font-bold" style={{ color: textColor }}>{t.hero.coach}</span>
        <span className="mx-3" style={{ color: dotColor }}>·</span>
        <span className="font-bold" style={{ color: textColor }}>{t.hero.manage}</span>
      </span>
    </div>
  );
}
