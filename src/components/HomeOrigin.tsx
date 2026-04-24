"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function HomeOrigin() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>(
      ".home-origin-from, .home-origin-to",
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            elements.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 280);
            });
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
    <section ref={sectionRef} className="home-origin">
      <p className="home-origin-from">{t.home.origin.from}</p>
      <p className="home-origin-to">{t.home.origin.to}</p>
    </section>
  );
}
