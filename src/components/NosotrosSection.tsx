"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";

export function NosotrosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

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
          {t.nosotros.label}
        </span>

        <h2 className="reveal-up font-bold text-[clamp(22px,3vw,36px)] uppercase leading-none mb-3.5">
          <span className="text-[var(--wh)]">{t.nosotros.heading1}</span>
          <br />
          <span className="j3-grad-text">{t.nosotros.heading2}</span>
        </h2>

        <p className="reveal-up text-[15px] max-[960px]:text-[16px] font-light text-[var(--gy2)] leading-[1.7] max-[960px]:leading-[1.75] mb-5">
          {t.nosotros.body}
        </p>

        <Link
          href="/story"
          className="reveal-up text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] no-underline inline-flex items-center gap-2 hover:gap-3.5 transition-[gap] duration-200"
        >
          {t.nosotros.link}
          <span>→</span>
        </Link>
      </div>

      {/* Right — Stats */}
      <div className="reveal-up">
        <div className="flex flex-wrap">
          {t.nosotros.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`py-4 px-6 ${idx > 0 ? "border-l border-white/[.07]" : ""}`}
            >
              <span
                className={`font-bold j3-grad-text leading-none block mb-[5px] ${
                  stat.val.length > 4 ? "text-[17px]" : "text-[24px]"
                }`}
              >
                {stat.val}
              </span>
              {[stat.line1, stat.line2].map((line, li) => (
                <span
                  key={li}
                  className="text-[10px] max-[960px]:text-[11px] font-light text-[var(--gy2)] tracking-[1px] max-[960px]:tracking-[0.5px] uppercase leading-[1.5] block"
                >
                  {line.replace(" /", "")}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
