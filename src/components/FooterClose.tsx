"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function FooterClose() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const manifestoLines = section.querySelectorAll<HTMLElement>(".footer-close-manifesto > div");
    const line = section.querySelector<HTMLElement>(".footer-close-line");
    const tagline = section.querySelector<HTMLElement>(".footer-close-tagline");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            manifestoLines.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 220);
            });
            const manifestoEnd = manifestoLines.length * 220;
            setTimeout(() => line?.classList.add("in"), manifestoEnd + 200);
            setTimeout(() => tagline?.classList.add("in"), manifestoEnd + 600);
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
    <section ref={sectionRef} className="footer-close">
      <div className="footer-close-manifesto">
        {t.system.blocks.map((block, i) => (
          <div key={i}>
            <span className="font-light text-white/45">
              {block.line1}{" "}
            </span>
            <span
              className={
                i === 1
                  ? "j3-grad-text font-black"
                  : "text-white/85 font-black"
              }
            >
              {block.line2}
            </span>
          </div>
        ))}
      </div>
      <div className="footer-close-line" aria-hidden="true" />
      <h2 className="footer-close-tagline">{t.home.closer}</h2>
    </section>
  );
}
