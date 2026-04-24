"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();
  const [show, setShow]           = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [overVerde, setOverVerde] = useState(false);

  const lastScrollY   = useRef(0);
  const navHiddenRef  = useRef(false); // ref síncrono para no depender de state stale

  useEffect(() => {
    function checkOverVerde(hidden: boolean) {
      const barTop = hidden ? 0 : 64;
      const barMid = barTop + 16;

      /* Solo hijos directos de <main> para no cazar elementos anidados */
      const candidates = document.querySelectorAll<HTMLElement>("main > *");
      let isOver = false;
      candidates.forEach((el) => {
        if (isOver) return;
        const rect = el.getBoundingClientRect();
        if (rect.top <= barMid && rect.bottom > barMid) {
          const bg = getComputedStyle(el).backgroundColor;
          if (bg === "rgb(27, 61, 47)") isOver = true;
        }
      });
      setOverVerde(isOver);
    }

    function handleScroll() {
      const y  = window.scrollY;
      const vh = window.innerHeight;

      setShow((prev) => (prev ? y > vh * 0.4 : y > vh * 0.7));

      /* Preservar estado anterior sin depender del state asíncrono */
      let hidden = navHiddenRef.current;
      if (y < vh * 0.4)                    hidden = false;
      else if (y > lastScrollY.current + 4) hidden = true;
      else if (y < lastScrollY.current - 4) hidden = false;
      /* else: mantiene el valor anterior sin modificarlo */

      if (hidden !== navHiddenRef.current) {
        navHiddenRef.current = hidden;
        setNavHidden(hidden);
      }
      lastScrollY.current = y;

      checkOverVerde(hidden);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bg        = overVerde ? "rgba(248,245,239,0.95)" : "var(--verde)";
  const border    = overVerde ? "1px solid rgba(27,61,47,0.12)" : "1px solid rgba(201,169,110,0.18)";
  const dotColor  = overVerde ? "rgba(27,61,47,0.25)"  : "rgba(201,169,110,0.35)";
  const textColor = overVerde ? "rgba(27,61,47,0.55)"  : "rgba(248,245,239,0.70)";

  return (
    <div
      className={`fixed left-0 right-0 z-[80] h-[32px] flex items-center justify-center pointer-events-none transition-[top,opacity,background-color,border-color] duration-300 ${
        navHidden ? "top-0" : "top-[64px]"
      } ${show ? "opacity-100" : "opacity-0"}`}
      style={{ background: bg, borderBottom: border }}
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
