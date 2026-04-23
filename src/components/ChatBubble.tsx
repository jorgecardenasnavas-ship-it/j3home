"use client";

import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

/**
 * Número de WhatsApp oficial J3 — backend provisional del chat.
 * Cuando haya chatbot real, basta cambiar el `sendMessage` para
 * dejar de abrir WhatsApp y hablar con el bot.
 */
const J3_WHATSAPP = "34722272598";

/** Payload opcional que el resto del sitio puede dispararle al chat. */
export interface ChatOpenDetail {
  /** Texto exacto a precargar en el input */
  prefill?: string;
  /** Nombre del coach para mensaje contextual (si no hay prefill) */
  coachName?: string;
  /** Ciudad/país del coach para dar contexto */
  coachLocation?: string;
}

export function ChatBubble() {
  const [hovered, setHovered] = useState(false);
  const [bottomOffset, setBottomOffset] = useState(24);
  const [pastHero, setPastHero] = useState(false);
  const [inHideZone, setInHideZone] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { t } = useI18n();
  const rafRef = useRef(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  /* ── Scroll-aware visibility (unchanged) ── */
  useEffect(() => {
    function check() {
      const viewH = window.innerHeight;

      const nextSection = document.querySelector("section.bg-white");
      if (nextSection) {
        const sRect = nextSection.getBoundingClientRect();
        setPastHero(sRect.top < viewH * 0.95);
      } else {
        setPastHero(window.scrollY > viewH * 0.6);
      }

      const hideZones = document.querySelectorAll<HTMLElement>("[data-hide-chat]");
      let hide = false;
      for (const el of hideZones) {
        const r = el.getBoundingClientRect();
        if (r.top < viewH && r.bottom > 0) {
          hide = true;
          break;
        }
      }
      setInHideZone(hide);

      const footer = document.querySelector("footer");
      if (!footer) return;
      const rect = footer.getBoundingClientRect();
      if (rect.top < viewH) {
        const overlap = viewH - rect.top;
        setBottomOffset(overlap + 16);
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

  /* ── External trigger: abrir chat con contexto ── */
  useEffect(() => {
    function onChatOpen(e: Event) {
      const custom = e as CustomEvent<ChatOpenDetail>;
      const { prefill, coachName, coachLocation } = custom.detail ?? {};
      setOpen(true);
      if (prefill) {
        setInput(prefill);
      } else if (coachName) {
        const loc = coachLocation ? ` (${coachLocation})` : "";
        setInput(`Hola, quiero info sobre entrenar con ${coachName}${loc}.`);
      }
      // Focus con pequeño delay para que el panel termine de montarse.
      window.setTimeout(() => inputRef.current?.focus(), 120);
    }
    window.addEventListener("j3:chat:open", onChatOpen as EventListener);
    return () => window.removeEventListener("j3:chat:open", onChatOpen as EventListener);
  }, []);

  /* ── ESC cierra el panel ── */
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /* ── Enviar mensaje → por ahora abre WhatsApp ── */
  function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text) return;
    const url = `https://wa.me/${J3_WHATSAPP}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  const visible = pastHero && !inHideZone;

  return (
    <>
      {/* ── Chat panel ── */}
      <div
        className="fixed right-4 max-[960px]:right-3 max-[960px]:left-3 z-[101] overflow-hidden"
        style={{
          bottom: `${bottomOffset + 62}px`,
          width: "min(360px, calc(100vw - 24px))",
          maxHeight: "min(520px, calc(100vh - 140px))",
          background: "#0a0a0a",
          border: "1px solid rgba(201,169,110,0.25)",
          borderRadius: 2,
          boxShadow: "0 20px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,169,110,0.08)",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(16px) scale(0.96)",
          transformOrigin: "bottom right",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity .35s cubic-bezier(.16,1,.3,1), transform .35s cubic-bezier(.16,1,.3,1), bottom .25s ease-out",
        }}
        role="dialog"
        aria-label="J3 Assistant"
        aria-hidden={!open}
      >
        {/* Top accent line */}
        <span
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent opacity-60"
          aria-hidden
        />

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[.08]">
          <div className="flex items-center gap-3">
            <span
              className="relative inline-flex shrink-0 items-center justify-center w-[32px] h-[32px] rounded-full"
              style={{ background: "var(--j3-grad)" }}
              aria-hidden
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
              </svg>
            </span>
            <div className="min-w-0">
              <div className="text-[13px] font-bold tracking-[0.2px] text-[var(--wh)]">J3 Assistant</div>
              <div className="text-[10px] tracking-[2px] uppercase text-[var(--g1)] opacity-80">Online</div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Cerrar chat"
            className="w-[28px] h-[28px] flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Intro bubble — siempre el primero que ve */}
        <div className="px-5 py-4 space-y-3 overflow-y-auto" style={{ maxHeight: 260 }}>
          <div className="inline-block max-w-[88%] border border-white/[.08] px-4 py-3 text-[13px] leading-[1.5] text-[var(--wh)]/85" style={{ borderRadius: 2 }}>
            ¡Hola! Soy J3. Cuéntame qué buscas — un coach concreto, una sede, un intensivo… — y te llevo al camino más rápido.
          </div>
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="border-t border-white/[.08] p-3 flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            rows={2}
            placeholder="Escribe tu mensaje…"
            className="flex-1 bg-transparent border border-white/[.08] focus:border-[var(--g1)]/40 outline-none text-[13px] leading-[1.4] px-3 py-2 resize-none text-[var(--wh)] placeholder:text-white/30"
            style={{ borderRadius: 2, minHeight: 58, maxHeight: 120 }}
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!input.trim()}
            className="shrink-0 w-[42px] h-[42px] flex items-center justify-center transition-opacity"
            style={{
              background: "var(--j3-grad)",
              borderRadius: 2,
              opacity: input.trim() ? 1 : 0.35,
              cursor: input.trim() ? "pointer" : "not-allowed",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2L11 13" />
              <path d="M22 2l-7 20-4-9-9-4z" />
            </svg>
          </button>
        </form>

        {/* Footer hint */}
        <div className="px-5 pb-3 pt-0">
          <span className="text-[10px] tracking-[1.5px] uppercase text-white/35">
            Al enviar se abre WhatsApp con tu mensaje
          </span>
        </div>
      </div>

      {/* ── Floating bubble ── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-label={open ? "Cerrar chat" : "Iniciar conversación"}
        aria-expanded={open}
        className="fixed right-4 max-[960px]:right-3 z-[100] flex items-center gap-3 no-underline group cursor-pointer border-none bg-transparent p-0"
        style={{
          bottom: `${bottomOffset}px`,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          pointerEvents: visible ? "auto" : "none",
          transition: "bottom .25s ease-out, opacity .5s ease, transform .5s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <span
          className={`text-[11px] font-medium tracking-[1px] uppercase text-[var(--wh)] bg-black/80 backdrop-blur-[12px] border border-white/[.08] rounded-full py-2 px-4 shadow-[0_4px_20px_rgba(0,0,0,.4)] transition-all duration-300 whitespace-nowrap max-[960px]:hidden ${
            hovered && !open ? "opacity-100 translate-x-0" : "opacity-0 translate-x-2 pointer-events-none"
          }`}
        >
          {t.chat.tooltip}
        </span>

        <div
          className="relative w-[52px] h-[52px] max-[960px]:w-[44px] max-[960px]:h-[44px] rounded-full flex items-center justify-center shadow-[0_4px_24px_rgba(201,169,110,.3)] transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)] group-hover:shadow-[0_4px_32px_rgba(201,169,110,.45)] group-hover:scale-105"
          style={{ background: "var(--j3-grad)" }}
        >
          {open ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18" />
              <path d="M6 6l12 12" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
            </svg>
          )}
          {!open && <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: "var(--j3-grad)" }} />}
        </div>
      </button>
    </>
  );
}
