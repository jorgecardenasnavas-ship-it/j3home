"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function StoryTeaser() {
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
      { threshold: 0.3 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="story-teaser">
      <div className="story-teaser-inner">
        <span className="story-teaser-eyebrow">La historia</span>
        <p className="story-teaser-text">
          Hay proyectos que se imaginan. Y proyectos que se ganan. J3 nació de veinte años compitiendo, entrenando y construyendo al más alto nivel.
        </p>
        <Link href="/story" className="story-teaser-cta">
          Conoce el origen
          <span className="text-[16px] font-light">→</span>
        </Link>
      </div>
    </section>
  );
}
