"use client";

import { useEffect, useRef } from "react";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  city: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "J3Pádel me dio un método real y una comunidad de coaches que te empuja a crecer cada semana.",
    author: "María S.",
    role: "Coach certificada",
    city: "Málaga",
  },
  {
    quote:
      "Mi hijo lleva dos años en Juniors. La diferencia entre una academia y J3 es obvia desde la primera clase.",
    author: "Pablo R.",
    role: "Padre de alumno",
    city: "Marbella",
  },
  {
    quote:
      "Más que certificado, formo parte de una red que marca la dirección del pádel en España.",
    author: "Luis M.",
    role: "Coach Verificado J3",
    city: "Madrid",
  },
];

export function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const cards = section.querySelectorAll<HTMLElement>(".testimonial-card");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((el, i) => {
              setTimeout(() => el.classList.add("in"), i * 180);
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
    <section ref={sectionRef} className="testimonials">
      <div className="testimonials-header">
        <span className="testimonials-eyebrow">La voz de la red</span>
        <h3 className="testimonials-title">Lo que dicen quienes la forman</h3>
      </div>
      <div className="testimonials-grid">
        {TESTIMONIALS.map((t, i) => (
          <figure key={i} className="testimonial-card">
            <blockquote className="testimonial-quote">“{t.quote}”</blockquote>
            <figcaption className="testimonial-author">
              <span className="testimonial-name">{t.author}</span>
              <span className="testimonial-role">
                {t.role} · {t.city}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
