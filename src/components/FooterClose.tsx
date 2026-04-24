"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function FooterClose() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.25 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  // "Jugamos. Entrenamos. Dirigimos." → ["Jugamos.", "Entrenamos.", "Dirigimos."]
  const raw = t.home.brandTagline.split(". ");
  const words = raw.map((w, i) => (i < raw.length - 1 ? w + "." : w));

  return (
    <section ref={sectionRef} className="footer-close">
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 50% 55%, rgba(201,169,110,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Gold line */}
      <div className="footer-close-line" aria-hidden />

      {/* Three words — JUGAMOS / ENTRENAMOS / DIRIGIMOS */}
      <div className="footer-close-words">
        {words.map((word, i) => (
          <span key={i} className={`footer-close-word footer-close-word-${i + 1}`}>
            {word}
          </span>
        ))}
      </div>
    </section>
  );
}
