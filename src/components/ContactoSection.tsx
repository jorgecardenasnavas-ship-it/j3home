"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/i18n/context";

const contactItems: { icon: string; key: "email" | "telefono" | "sede"; value: string; href?: string }[] = [
  { icon: "✉", key: "email", value: "info@j3padel.com", href: "mailto:info@j3padel.com" },
  { icon: "📞", key: "telefono", value: "722 272 598", href: "tel:+34722272598" },
  { icon: "📍", key: "sede", value: "Málaga, España" },
];

export function ContactoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { t } = useI18n();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [soy, setSoy] = useState("");
  const [interes, setInteres] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

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
    if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    // Simulate sending (replace with real API later)
    setTimeout(() => {
      setStatus("sent");
      setNombre(""); setEmail(""); setSoy(""); setInteres(""); setMensaje("");
      setTimeout(() => setStatus("idle"), 3000);
    }, 1500);
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
          {t.contacto.label}
        </span>

        <h2 className="reveal-up font-bold text-[clamp(32px,4vw,52px)] uppercase leading-none mb-3.5">
          <span className="text-[var(--wh)]">{t.contacto.heading1}</span>
          <br />
          <span className="j3-grad-text">{t.contacto.heading2}</span>
        </h2>

        <p className="reveal-up text-[16px] font-light text-[var(--gy2)] leading-[1.7] max-w-[380px] mb-10">
          {t.contacto.body}
        </p>

        {/* Contact Info */}
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
                  {t.contacto[item.key]}
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

      {/* Right Column — Form */}
      <form onSubmit={handleSubmit} className="reveal-up flex flex-col gap-[10px]">
        <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-[10px]">
          <div>
            <input
              type="text"
              placeholder={t.contacto.placeholders.nombre}
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="j3-input w-full bg-[var(--bk3)] border border-white/[.08] text-[var(--wh)]"
            />
          </div>
          <div>
            <input
              type="email"
              placeholder={t.contacto.placeholders.email}
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
            {t.contacto.soyOptions.map((opt, i) => (
              <option key={opt} value={i === 0 ? "" : opt}>
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
            {t.contacto.interesOptions.map((opt, i) => (
              <option key={opt} value={i === 0 ? "" : opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div>
          <textarea
            rows={4}
            placeholder={t.contacto.placeholders.mensaje}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            className="j3-input w-full bg-[var(--bk3)] border border-white/[.08] text-[var(--wh)]"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className={`btn-glow w-full py-[15px] rounded-[980px] font-bold text-[12px] tracking-[3px] uppercase border-none cursor-pointer mt-1.5 transition-all duration-300 ${
            status === "sent"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : status === "sending"
              ? "opacity-70 cursor-wait"
              : ""
          }`}
          style={status === "sent" ? undefined : { background: "var(--j3-grad)", color: "#000" }}
        >
          {status === "sending" ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              {t.contacto.sending}
            </span>
          ) : status === "sent" ? (
            <span className="flex items-center justify-center gap-2">
              {t.contacto.sent}
            </span>
          ) : (
            t.contacto.submit
          )}
        </button>
        {status === "error" && (
          <p className="text-[12px] text-red-400 mt-2 text-center">
            {t.contacto.error}
          </p>
        )}
      </form>
    </section>
  );
}
