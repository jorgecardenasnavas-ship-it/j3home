"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function ChatBubble() {
  const [hovered, setHovered] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const { t } = useI18n();
  const rafRef = useRef(0);

  useEffect(() => {
    function check() {
      const footer = document.querySelector("footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      const viewH = window.innerHeight;
      // If footer is visible, push the button above it
      if (rect.top < viewH) {
        const overlap = viewH - rect.top;
        setBottomOffset(overlap + 16); // 16px gap above footer
      } else {
        setBottomOffset(window.innerWidth < 961 ? 80 : 24);
      }
    }

    function onScroll() {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(check);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    check();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <a
      href="#contacto"
      aria-label="Iniciar conversación"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="fixed right-4 max-[960px]:right-3 z-100 flex items-center gap-3 no-underline group cursor-pointer"
      style={{
        bottom: `${bottomOffset}px`,
        transition: "bottom .25s ease-out",
      }}
    >
      {/* Tooltip label */}
      <span
        className={`text-[11px] font-medium tracking-[1px] uppercase text-[var(--wh)] bg-black/80 backdrop-blur-[12px] border border-white/[.08] rounded-full py-2 px-4 shadow-[0_4px_20px_rgba(0,0,0,.4)] transition-all duration-300 whitespace-nowrap max-[960px]:hidden ${
          hovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-2 pointer-events-none"
        }`}
      >
        {t.chat.tooltip}
      </span>

      {/* Button */}
      <div
        className="relative w-[52px] h-[52px] max-[960px]:w-[44px] max-[960px]:h-[44px] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(220,175,100,.3)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] group-hover:shadow-[0_4px_32px_rgba(220,175,100,.45)] group-hover:scale-105 group-active:scale-95"
        style={{ background: "var(--j3-grad)" }}
      >
        {/* Chat icon */}
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#000"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
        </svg>

        {/* Pulse ring */}
        <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--j3-grad)" }} />
      </div>
    </a>
  );
}
