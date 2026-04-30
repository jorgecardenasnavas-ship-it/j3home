"use client";

import { useEffect, useRef, useState } from "react";

const LINE_1 = "Jugamos. Entrenamos. Dirigimos.";
const LINE_2 = "Nuestra casa es el 20×10.";

/**
 * Paso B — Manifesto sobre crema.
 * Aparece tras el túnel del bridge. Word-by-word reveal con la misma
 * animación bridgeWordReveal de /story (definida en globals.css).
 */
export function ManifestoChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const line1Words = LINE_1.split(" ");
  const line2Words = LINE_2.split(" ");
  const totalLine1 = line1Words.length;

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--wh)] flex items-center justify-center px-6 min-h-[100dvh]"
    >
      <div className="text-center max-w-4xl">
        <p className="text-[clamp(22px,2.8vw,38px)] tracking-[0.04em] text-[#6e6e73] font-light leading-[1.6] flex flex-wrap justify-center gap-x-[0.3em]">
          {line1Words.map((word, i) => (
            <span
              key={`l1-${i}`}
              className="inline-block overflow-hidden"
              style={{ paddingBottom: "0.08em" }}
            >
              <span
                className="inline-block"
                style={{
                  animation: visible
                    ? `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.09}s both`
                    : "none",
                  opacity: visible ? undefined : 0,
                  transform: visible ? undefined : "translateY(110%)",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </p>
        <p className="text-[clamp(26px,3.4vw,46px)] tracking-[-0.01em] text-[#1d1d1f] font-bold leading-[1.4] mt-4 flex flex-wrap justify-center gap-x-[0.3em]">
          {line2Words.map((word, i) => (
            <span
              key={`l2-${i}`}
              className="inline-block overflow-hidden"
              style={{ paddingBottom: "0.08em" }}
            >
              <span
                className="inline-block"
                style={{
                  animation: visible
                    ? `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + (totalLine1 + i) * 0.09 + 0.15}s both`
                    : "none",
                  opacity: visible ? undefined : 0,
                  transform: visible ? undefined : "translateY(110%)",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
