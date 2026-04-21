"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function CatalogIntro() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const label = section.querySelector<HTMLElement>(".catalog-intro-label");
    const number = section.querySelector<HTMLElement>(".catalog-intro-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            label?.classList.add("in");
            number?.classList.add("in");
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
    <section ref={sectionRef} className="catalog-intro" aria-hidden="true">
      <span className="catalog-intro-label">{t.home.catalogIntro.label}</span>
      <div className="catalog-intro-number">08</div>
    </section>
  );
}
