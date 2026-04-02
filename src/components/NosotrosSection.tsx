"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const stats: { value: string; lines: string[]; valueFontSize?: string }[] = [
  { value: "#1", lines: ["Mejor club", "del mundo 2018"] },
  { value: "20+", lines: ["Años en", "el sector"] },
  { value: "🏆", lines: ["Campeones", "España y Mundo"] },
  { value: "🥇11·🥈7", lines: ["Circuito", "profesional"], valueFontSize: "17px" },
];

export function NosotrosSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll<HTMLElement>(".reveal-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 150);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="py-20 max-[960px]:py-[60px] px-12 max-[960px]:px-6 border-t border-white/[.06] flex items-center justify-between gap-12 flex-wrap max-[960px]:flex-col"
    >
      {/* Left */}
      <div className="flex-1 min-w-[260px] max-w-[440px]">
        <span className="reveal-up text-[10px] font-normal tracking-[4px] uppercase text-[var(--g1)] mb-3.5 block">
          Quiénes somos
        </span>

        <h2 className="reveal-up font-bold text-[clamp(22px,3vw,36px)] uppercase leading-none mb-3.5">
          <span className="text-[var(--wh)]">Más de 20 años</span>
          <br />
          <span className="j3-grad-text">dentro del pádel.</span>
        </h2>

        <p className="reveal-up text-[15px] font-light text-[var(--gy2)] leading-[1.7] mb-5">
          Empezamos cuando el pádel era otro deporte. Hemos formado jugadores
          que hoy están en el circuito, gestionado el mejor club del mundo y
          entrenado a profesionales del WPT. Eso es lo que hay detrás.
        </p>

        <Link
          href="/nosotros"
          className="reveal-up text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] no-underline inline-flex items-center gap-2 hover:gap-3.5 transition-[gap] duration-200"
        >
          Conoce nuestra trayectoria
          <span>→</span>
        </Link>
      </div>

      {/* Right — Stats with Apple-style reveal */}
      <div className="reveal-up">
        <div className="flex flex-wrap">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className={`py-4 px-6 ${idx > 0 ? "border-l border-white/[.07]" : ""}`}
            >
              <span
                className="font-bold text-[24px] j3-grad-text leading-none block mb-[5px]"
                style={stat.valueFontSize ? { fontSize: stat.valueFontSize } : undefined}
              >
                {stat.value}
              </span>
              {stat.lines.map((line, li) => (
                <span
                  key={li}
                  className="text-[10px] font-light text-[var(--gy)] tracking-[1px] uppercase leading-[1.5] block"
                >
                  {line}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
