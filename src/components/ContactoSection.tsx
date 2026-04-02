"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const servicioOptions = [
  "Soy...",
  "Entrenador / Coach",
  "Jugador amateur",
  "Aficionado al pádel",
  "Director de academia / club",
  "Interesado en franquicia",
  "Otro",
] as const;

const interesOptions = [
  "Me interesa...",
  "Coach360 · Formación",
  "J3PTV · Contenido",
  "Academy · Entrenar en Málaga",
  "Franquicia · Sistema llave en mano",
  "J3 Experience · Venid a mi club",
  "Otra cosa",
] as const;

const contactItems: { icon: string; label: string; value: string; href?: string }[] = [
  { icon: "✉", label: "Email", value: "info@j3padel.com", href: "mailto:info@j3padel.com" },
  { icon: "📞", label: "Teléfono", value: "722 272 598", href: "tel:+34722272598" },
  { icon: "📍", label: "Sede", value: "Málaga, España" },
];

export function ContactoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [soy, setSoy] = useState("");
  const [interes, setInteres] = useState("");
  const [mensaje, setMensaje] = useState("");

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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <section
      id="contacto"
      ref={sectionRef}
      className="py-[100px] max-[960px]:py-[60px] px-12 max-[960px]:px-6 border-t border-white/[.06] grid grid-cols-2 max-[960px]:grid-cols-1 gap-20 items-start"
    >
      {/* Left Column */}
      <div>
        <span className="reveal-up text-[10px] font-normal tracking-[4px] uppercase text-[var(--g1)] mb-3.5 block">
          Contacto
        </span>

        <h2 className="reveal-up font-bold text-[clamp(32px,4vw,52px)] uppercase leading-none mb-3.5">
          <span className="text-[var(--wh)]">Cuéntanos</span>
          <br />
          <span className="j3-grad-text">qué buscas.</span>
        </h2>

        <p className="reveal-up text-[16px] font-light text-[var(--gy2)] leading-[1.7] max-w-[380px] mb-10">
          Si has llegado hasta aquí algo te ha resonado. Cuéntanos dónde estás
          y qué buscas.
        </p>

        {/* Contact Info — Apple-style stagger */}
        <div className="flex flex-col">
          {contactItems.map((item, idx) => (
            <div
              key={idx}
              className={`reveal-up flex gap-4 py-4 border-b border-white/[.06] ${idx === 0 ? "border-t border-t-white/[.06]" : ""}`}
            >
              <div className="text-[var(--g1)] text-[14px] shrink-0 mt-[2px]">
                {item.icon}
              </div>
              <div>
                <div className="text-[9px] font-normal tracking-[3px] uppercase text-[var(--gy)] mb-[3px]">
                  {item.label}
                </div>
                <div className="text-[14px] font-light">
                  {item.href ? (
                    <a href={item.href} className="text-[var(--gy3)] no-underline hover:text-[var(--wh)] transition-colors duration-200">
                      {item.value}
                    </a>
                  ) : (
                    <span className="text-[var(--gy3)]">{item.value}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column — Apple-style form */}
      <form onSubmit={handleSubmit} className="reveal-up flex flex-col gap-[10px]">
        <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-[10px]">
          <div>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="j3-input w-full bg-[var(--bk3)] border border-white/[.08] text-[var(--wh)]"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="j3-input w-full bg-[var(--bk3)] border border-white/[.08] text-[var(--wh)]"
            />
          </div>
        </div>

        <div>
          <select
            value={soy}
            onChange={(e) => setSoy(e.target.value)}
            className={`j3-input w-full bg-[var(--bk3)] border border-white/[.08] cursor-pointer ${soy ? "text-[var(--wh)]" : "text-[var(--gy)]"}`}
          >
            {servicioOptions.map((opt) => (
              <option key={opt} value={opt === "Soy..." ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={interes}
            onChange={(e) => setInteres(e.target.value)}
            className={`j3-input w-full bg-[var(--bk3)] border border-white/[.08] cursor-pointer ${interes ? "text-[var(--wh)]" : "text-[var(--gy)]"}`}
          >
            {interesOptions.map((opt) => (
              <option key={opt} value={opt === "Me interesa..." ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            rows={4}
            placeholder="Mensaje"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="j3-input w-full bg-[var(--bk3)] border border-white/[.08] text-[var(--wh)]"
          />
        </div>

        {/* Nike-style pill submit with glow */}
        <button
          type="submit"
          className="btn-glow w-full py-[15px] rounded-[980px] text-black font-bold text-[12px] tracking-[3px] uppercase border-none cursor-pointer mt-1.5"
          style={{ background: "var(--j3-grad)" }}
        >
          Enviar
        </button>
      </form>
    </section>
  );
}
