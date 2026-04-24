"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function FooterClose() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const line = section.querySelector<HTMLElement>(".footer-close-line");
    const tagline = section.querySelector<HTMLElement>(".footer-close-tagline");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => line?.classList.add("in"), 200);
            setTimeout(() => tagline?.classList.add("in"), 600);
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
      <div className="footer-close-line" aria-hidden="true" />
      <h2 className="footer-close-tagline">{t.home.brandTagline}</h2>
    </section>
  );
}
