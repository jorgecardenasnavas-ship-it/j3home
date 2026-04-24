"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();
  const [show, setShow] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      setShow((prev) => (prev ? y > vh * 0.4 : y > vh * 0.7));
      if (y < vh * 0.4) {
        setNavHidden(false);
      } else if (y > lastScrollY.current + 4) {
        setNavHidden(true);
      } else if (y < lastScrollY.current - 4) {
        setNavHidden(false);
      }
      lastScrollY.current = y;
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-[80] h-[32px] flex items-center justify-center pointer-events-none transition-[top,opacity] duration-300 ${
        navHidden ? "top-0" : "top-[64px]"
      } ${show ? "opacity-100" : "opacity-0"}`}
      style={{ background: "rgba(27,61,47,0.82)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", borderBottom: "1px solid rgba(201,169,110,0.18)" }}
    >
      <span className="text-[10px] tracking-[5px] uppercase font-normal select-none">
        <span className="j3-grad-text font-bold">{t.hero.play}</span>
        <span className="mx-3" style={{ color: "rgba(201,169,110,0.3)" }}>·</span>
        <span className="font-bold" style={{ color: "rgba(248,245,239,0.7)" }}>{t.hero.coach}</span>
        <span className="mx-3" style={{ color: "rgba(201,169,110,0.3)" }}>·</span>
        <span className="font-bold" style={{ color: "rgba(248,245,239,0.7)" }}>{t.hero.manage}</span>
      </span>
    </div>
  );
}
