"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

export function StickyClaim() {
  const { t } = useI18n();
  const [show, setShow]       = useState(false);
  const lastScrollY           = useRef(0);
  const showRef               = useRef(false);

  useEffect(() => {
    function handleScroll() {
      const y  = window.scrollY;
      const vh = window.innerHeight;
      const nextShow = showRef.current ? y > vh * 0.4 : y > vh * 0.7;
      showRef.current = nextShow;
      setShow(nextShow);
      lastScrollY.current = y;
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed left-0 right-0 z-[80] h-[32px] flex items-center justify-center pointer-events-none ${
        show ? "opacity-100" : "opacity-0"
      }`}
      style={{
        top: "var(--nav-offset, 64px)",
        background: "var(--verde)",
        borderBottom: "1px solid rgba(201,169,110,0.18)",
        transition: "top 300ms cubic-bezier(.4,0,.2,1), opacity 300ms",
      }}
    >
      <span className="text-[10px] tracking-[5px] uppercase font-normal select-none">
        <span className="j3-grad-text font-bold">{t.hero.play}</span>
        <span className="mx-3" style={{ color: "rgba(201,169,110,0.35)" }}>·</span>
        <span className="font-bold" style={{ color: "rgba(248,245,239,0.70)" }}>{t.hero.coach}</span>
        <span className="mx-3" style={{ color: "rgba(201,169,110,0.35)" }}>·</span>
        <span className="font-bold" style={{ color: "rgba(248,245,239,0.70)" }}>{t.hero.manage}</span>
      </span>
    </div>
  );
}
