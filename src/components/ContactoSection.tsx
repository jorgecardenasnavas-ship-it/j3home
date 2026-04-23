"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const pillars = [
  {
    number: "01",
    title: "Academy",
    desc: "Formamos jugadores desde los 4 a\u00f1os hasta el circuito profesional.",
    href: "/academy",
    cta: "Explorar Academy",
  },
  {
    number: "02",
    title: "Coach360",
    desc: "Sistema de formaci\u00f3n integral para entrenadores de p\u00e1del.",
    href: "https://j3padel.com/join",
    cta: "Descubrir Coach360",
  },
  {
    number: "03",
    title: "Experience",
    desc: "Llevamos el m\u00e9todo J3 a tu club. Stages, camps y clinics a medida.",
    href: "/experience",
    cta: "Ver Experience",
  },
  {
    number: "04",
    title: "Story",
    desc: "20 a\u00f1os construyendo un camino propio en el p\u00e1del profesional.",
    href: "/story",
    cta: "Leer nuestra historia",
  },
];

export function ContactoSection() {
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
              setTimeout(() => el.classList.add("in"), i * 120);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="relative py-[120px] max-[960px]:py-[80px] px-12 max-[960px]:px-6 border-t border-white/[.06] overflow-hidden"
    >
      {/* Radial gold glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,169,110,.05) 0%, transparent 70%)",
        }}
      />

      {/* Header */}
      <div className="relative z-10 max-w-[1200px] mx-auto text-center mb-20 max-[960px]:mb-14">
        <span className="reveal-up text-[10px] font-bold tracking-[5px] uppercase text-[var(--g1)] block mb-6">
          Ecosistema J3
        </span>

        <h2 className="reveal-up font-bold text-j3-4xl uppercase tracking-[-3px] leading-[0.95] mb-6">
          <span className="j3-stroke">Un sistema.</span>
          <br />
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">Infinitas posibilidades.</span>
        </h2>

        <p className="reveal-up text-[clamp(14px,1.5vw,18px)] text-[var(--gy2)] leading-[1.6] font-light max-w-[540px] mx-auto">
          Todo lo que hacemos est&aacute; conectado. Entrenamos jugadores, formamos entrenadores y llevamos el m&eacute;todo a cualquier club del mundo.
        </p>
      </div>

      {/* Pillars grid */}
      <div className="relative z-10 max-w-[1200px] mx-auto grid grid-cols-4 max-[960px]:grid-cols-2 max-[600px]:grid-cols-1 gap-px bg-white/[.06]">
        {pillars.map((p, i) => (
          <Link
            key={p.number}
            href={p.href}
            className="reveal-up group relative bg-[var(--bk)] p-8 max-[960px]:p-6 no-underline flex flex-col justify-between min-h-[240px] transition-colors duration-500 hover:bg-[var(--bk2)]"
          >
            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(201,169,110,.06) 0%, transparent 70%)",
              }}
            />

            {/* Top — number + title */}
            <div className="relative z-10">
              <span className="text-[clamp(32px,4vw,48px)] font-bold j3-grad-text leading-none block mb-3 opacity-30 group-hover:opacity-60 transition-opacity duration-500">
                {p.number}
              </span>
              <h3 className="font-bold text-[clamp(22px,2.5vw,32px)] uppercase tracking-[-1px] leading-[1] text-[var(--wh)] mb-3">
                {p.title}
              </h3>
              <p className="text-[13px] text-[var(--gy2)] leading-[1.6] font-light">
                {p.desc}
              </p>
            </div>

            {/* Bottom — CTA */}
            <div className="relative z-10 mt-6">
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--gy)] group-hover:text-[var(--g1)] transition-colors duration-300 inline-flex items-center gap-2 group-hover:gap-3">
                {p.cta}
                <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </span>
            </div>

            {/* Gold accent line — bottom, expands on hover */}
            <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full bg-gradient-to-r from-[var(--g1)] to-[var(--g2)] transition-all duration-700 ease-[var(--ease-out)]" />
          </Link>
        ))}
      </div>

      {/* Contact info — minimal */}
      <div className="relative z-10 max-w-[1200px] mx-auto mt-16 max-[960px]:mt-12 flex items-center justify-center gap-8 max-[960px]:flex-col max-[960px]:gap-4">
        <a
          href="mailto:info@j3padel.com"
          className="reveal-up text-[13px] font-light text-[var(--gy)] hover:text-[var(--wh)] transition-colors duration-200 no-underline tracking-[0.5px]"
        >
          info@j3padel.com
        </a>
        <span className="text-[var(--gy)]/30 max-[960px]:hidden">&middot;</span>
        <a
          href="tel:+34722272598"
          className="reveal-up text-[13px] font-light text-[var(--gy)] hover:text-[var(--wh)] transition-colors duration-200 no-underline tracking-[0.5px]"
        >
          +34 722 272 598
        </a>
        <span className="text-[var(--gy)]/30 max-[960px]:hidden">&middot;</span>
        <span className="reveal-up text-[13px] font-light text-[var(--gy)] tracking-[0.5px]">
          M&aacute;laga, Espa&ntilde;a
        </span>
      </div>
    </section>
  );
}
