"use client";

import { useEffect, useRef } from "react";

interface Stat {
  value: string;
  label: string;
}

const STATS: Stat[] = [
  { value: "+200", label: "Coaches certificados" },
  { value: "15", label: "Países" },
  { value: "8", label: "Años formando la élite" },
  { value: "+50", label: "Clubes asociados" },
];

export function StatsBar() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const items = section.querySelectorAll<HTMLElement>(".stats-bar-item");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            items.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 120);
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
    <section ref={sectionRef} className="stats-bar">
      <div className="stats-bar-inner">
        {STATS.map((stat, i) => (
          <div key={i} className="stats-bar-item">
            <div className="stats-bar-value">{stat.value}</div>
            <div className="stats-bar-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
