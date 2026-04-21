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

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            line?.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="footer-close">
      <h2 className="footer-close-tagline">{t.home.closer}</h2>
      <div className="footer-close-line" aria-hidden="true" />
    </section>
  );
}
