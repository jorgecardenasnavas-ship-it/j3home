"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function HomeManifesto() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>(
      ".home-manifesto-statement, .home-manifesto-question",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            elements.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 350);
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
      <p className="home-manifesto-statement">
        {t.system.manifesto.statement}
      </p>
      <p className="home-manifesto-question">
        {t.system.manifesto.question}
      </p>
    </section>
  );
}
