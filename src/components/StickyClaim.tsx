"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();
  const [show, setShow]           = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [overOrigin, setOverOrigin] = useState(false);

  const lastScrollY  = useRef(0);
  const navHiddenRef = useRef(false);

  useEffect(() => {
    function getAbsTop(el: HTMLElement): number {
      let top = 0;
      let cur: HTMLElement | null = el;
      while (cur) { top += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; }
      return top;
    }

    function checkOverOrigin(hidden: boolean) {
      const origin = document.querySelector<HTMLElement>(".home-origin");
      if (!origin) return;

      const elTop    = getAbsTop(origin);
      const elBottom = elTop + origin.offsetHeight;
      const barTop   = window.scrollY + (hidden ? 0 : 64);
      const barBottom = barTop + 32;

      setOverOrigin(barTop < elBottom && barBottom > elTop);
    }

    function handleScroll() {
      const y  = window.scrollY;
      const vh = window.innerHeight;

      setShow((prev) => (prev ? y > vh * 0.4 : y > vh * 0.7));

      let hidden = navHiddenRef.current;
      if (y < vh * 0.4)                     hidden = false;
      else if (y > lastScrollY.current + 4)  hidden = true;
      else if (y < lastScrollY.current - 4)  hidden = false;

      if (hidden !== navHiddenRef.current) {
        navHiddenRef.current = hidden;
        setNavHidden(hidden);
      }
      lastScrollY.current = y;

      checkOverOrigin(hidden);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const bg        = overOrigin ? "rgba(248,245,239,0.95)" : "var(--verde)";
  const border    = overOrigin ? "1px solid rgba(27,61,47,0.12)" : "1px solid rgba(201,169,110,0.18)";
  const dotColor  = overOrigin ? "rgba(27,61,47,0.25)"  : "rgba(201,169,110,0.35)";
  const textColor = overOrigin ? "rgba(27,61,47,0.55)"  : "rgba(248,245,239,0.70)";

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
