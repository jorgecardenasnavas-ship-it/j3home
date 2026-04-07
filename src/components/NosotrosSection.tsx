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

      {/* Right — Stats */}
      <div ref={statsRef} className="reveal-up will-change-transform">
        <div className="flex flex-wrap rounded-xl border border-white/[.06] bg-white/[.02] backdrop-blur-[2px] overflow-hidden">
          {t.nosotros.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`py-5 px-7 relative group transition-colors duration-300 ease-[var(--ease-out)] hover:bg-white/[.03] ${idx > 0 ? "border-l border-white/[.06]" : ""}`}
            >
              {/* Subtle gold glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(ellipse at 50% 30%, rgba(220,175,100,.06) 0%, transparent 70%)" }}
              />
              <span
                className={`relative font-bold j3-grad-text leading-none block mb-[5px] ${
                  stat.val.length > 4 ? "text-[17px]" : "text-[24px]"
                }`}
              >
                {stat.val}
              </span>
              {[stat.line1, stat.line2].map((line, li) => (
                <span
                  key={li}
                  className="relative text-[10px] max-[960px]:text-[11px] font-light text-[var(--gy2)] tracking-[1px] max-[960px]:tracking-[0.5px] uppercase leading-[1.5] block"
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
