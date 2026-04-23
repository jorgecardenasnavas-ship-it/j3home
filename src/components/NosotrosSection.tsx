"use client";

import { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";


export function NosotrosSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Stagger reveal
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reveals = section.querySelectorAll<HTMLElement>(".reveal-up");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            reveals.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 120);
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

  // Subtle parallax — stats move slower than text
  const onScroll = useCallback(() => {
    const section = sectionRef.current;
    const stats = statsRef.current;
    const text = textRef.current;
    if (!section || !stats || !text) return;

    const rect = section.getBoundingClientRect();
    const windowH = window.innerHeight;

    // Only apply when section is in view
    if (rect.bottom < 0 || rect.top > windowH) return;

    const center = rect.top + rect.height / 2;
    const offset = (center - windowH / 2) / windowH; // -0.5 to 0.5

    text.style.transform = `translateY(${offset * -12}px)`;
    stats.style.transform = `translateY(${offset * 8}px)`;
  }, []);

  useEffect(() => {
    // Only apply parallax on desktop
    const mq = window.matchMedia("(min-width: 961px)");
    if (!mq.matches) return;

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return (
    <section
      id="nosotros"
      ref={sectionRef}
      className="relative py-20 max-[960px]:py-[60px] px-12 max-[960px]:px-6 border-t border-white/[.06] flex items-center justify-between gap-12 flex-wrap max-[960px]:flex-col overflow-hidden"
    >
      {/* Decorative gold accent — bleeds from left edge */}
      <div className="absolute top-0 left-0 w-[80px] max-[960px]:w-[40px] h-[2px] bg-gradient-to-r from-[var(--g1)]/40 to-transparent pointer-events-none" />

      {/* Left */}
      <div ref={textRef} className="flex-1 min-w-[260px] max-w-[440px] will-change-transform">
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
          className="reveal-up j3-press text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] no-underline inline-flex items-center gap-2 hover:gap-3.5 transition-[gap] duration-200"
        >
          {t.nosotros.link}
          <span>→</span>
        </Link>
      </div>

      {/* Right — Editorial credentials ledger */}
      <div
        ref={statsRef}
        className="reveal-up will-change-transform flex-1 min-w-[320px] max-w-[460px] max-[960px]:max-w-full max-[960px]:w-full"
      >
        {/* Eyebrow header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="block w-[26px] h-px bg-[var(--g1)]/70" />
          <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]/80">
            {t.nosotros.statsLabel}
          </span>
        </div>

        <ol className="relative pl-7">
          {/* Continuous gold hairline */}
          <span className="absolute left-[3px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--g1)]/60 via-[var(--g1)]/25 to-transparent pointer-events-none" />

          {t.nosotros.stats.map((stat, idx) => (
            <li
              key={idx}
              className="relative group pb-5 last:pb-0"
            >
              {/* Dot marker */}
              <span className="absolute -left-[27px] top-1/2 -translate-y-[60%] w-[7px] h-[7px] rounded-full bg-[var(--g1)] ring-2 ring-black transition-transform duration-300 ease-[var(--ease-out)] group-hover:scale-125" />

              {/* Hover glow */}
              <div
                className="absolute inset-y-0 -left-2 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-md"
                style={{ background: "linear-gradient(90deg, rgba(201,169,110,.06) 0%, transparent 80%)" }}
              />

              {/* Value + label row */}
              <div className="relative flex items-baseline gap-3 flex-wrap">
                <span
                  className={`font-bold italic tracking-[-1px] j3-grad-text inline-block pr-[0.14em] leading-[1] ${
                    stat.val.length > 3 ? "text-[26px]" : "text-[34px]"
                  }`}
                >
                  {stat.val}
                </span>
                <span className="text-[10px] font-light tracking-[1.4px] uppercase text-[var(--gy2)] leading-[1.45]">
                  {stat.line1.replace(" /", "")} {stat.line2.replace(" /", "")}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
