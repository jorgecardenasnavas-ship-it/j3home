"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function HomeManifesto() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const lines = section.querySelectorAll<HTMLElement>(".home-manifesto-line");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            lines.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 220);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="home-manifesto">
      {t.system.blocks.map((block, i) => (
        <div key={i} className="home-manifesto-line">
          <span className="home-manifesto-light">{block.line1} </span>
          <span
            className={`home-manifesto-bold ${i === 1 ? "home-manifesto-accent" : ""}`}
          >
            {block.line2}
          </span>
        </div>
      ))}
    </section>
  );
}
