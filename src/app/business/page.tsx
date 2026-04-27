"use client";

/* ──────────────────────────────────────────────
   /business — J3Padel Business landing.

   Arquitectura comercial de dos peldaños:
   Step 1 (1.800 €) diseña y filtra; Step 2 (4.500 €
   bundle desde el inicio, incluye Step 1) ejecuta.
   CTA principal: WhatsApp (placeholder hasta que
   esté lista la app de booking propia).
   ────────────────────────────────────────────── */

import { useRef, useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/i18n/context";

const WA_BASE = "https://wa.me/34722272598";
const waLink = (msg: string) => `${WA_BASE}?text=${encodeURIComponent(msg)}`;

function WaIcon({ size = 14, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

/* Reveal hook (used across sections). */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); io.disconnect(); } },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function useStaggerReveal(count: number, threshold = 0.15) {
  const [visible, setVisible] = useState<boolean[]>(() => new Array(count).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisible(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, [count, threshold]);
  return { itemRefs, visible };
}

/* ═══════════════════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════════════════ */
function HeroSection() {
  const { t } = useI18n();
  const h = t.business.hero;

  return (
    <section
      className="relative overflow-hidden pt-[140px] max-[960px]:pt-[120px] pb-[80px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
      style={{ background: "var(--verde)", color: "var(--wh)" }}
    >
      {/* Champán radial top accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 60%)" }}
      />
      <div className="relative max-w-[1200px] mx-auto">
        <div className="text-[11px] tracking-[4px] uppercase text-[var(--g1)] mb-6 font-bold">{h.eyebrow}</div>
        <h1 className="font-bold text-[clamp(40px,7vw,92px)] uppercase tracking-[-2px] leading-[0.96] mb-8 max-w-[980px]">
          {h.headingPre}{" "}
          <span className="italic font-[var(--font-serif)] normal-case tracking-[-1.5px] text-[var(--g1)]">
            {h.headingAccent}
          </span>
        </h1>
        <p className="text-[clamp(15px,1.6vw,19px)] leading-[1.55] opacity-80 max-w-[680px] mb-10 font-light">
          {h.sub}
        </p>
        <a
          href={waLink(h.waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="j3-press inline-flex items-center gap-2.5 px-6 py-3.5 max-[640px]:px-5 max-[640px]:py-3 rounded-full text-[12px] font-bold tracking-[2px] uppercase transition-all duration-300"
          style={{ background: "var(--g1)", color: "var(--bk)" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <WaIcon size={14} />
          {h.cta}
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   AUDIENCE
   ═══════════════════════════════════════════════════════ */
function AudienceSection() {
  const { t } = useI18n();
  const a = t.business.audience;
  const { ref, visible } = useReveal(0.15);
  const { itemRefs, visible: itemsV } = useStaggerReveal(a.items.length, 0.2);

  return (
    <section className="bg-[var(--bk)] text-[var(--wh)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.06]">
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div
          className="mb-12 max-[960px]:mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4">{a.eyebrow}</div>
          <h2 className="font-bold text-[clamp(28px,4vw,48px)] tracking-[-0.8px] leading-[1.1] max-w-[820px]">{a.heading}</h2>
        </div>

        <div className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4 mb-10">
          {a.items.map((it, i) => (
            <div
              key={it.title}
              ref={el => { itemRefs.current[i] = el; }}
              className="border border-white/[.08] hover:border-[var(--g1)]/30 transition-colors duration-500 p-6"
              style={{
                background: "rgba(255,255,255,0.012)",
                borderRadius: 2,
                opacity: itemsV[i] ? 1 : 0,
                transform: itemsV[i] ? "none" : "translateY(20px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              <span className="block w-[5px] h-[5px] rounded-full bg-[var(--g1)] mb-4" aria-hidden />
              <h3 className="font-bold text-[16px] tracking-[-0.3px] mb-2.5 leading-[1.2]">{it.title}</h3>
              <p className="text-[13px] opacity-70 leading-[1.55]">{it.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[12px] tracking-[1.5px] uppercase font-medium text-[var(--g1)]/80 leading-[1.6] max-w-[760px]">
          {a.filter}
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FUNNEL
   ═══════════════════════════════════════════════════════ */
function FunnelSection() {
  const { t } = useI18n();
  const f = t.business.funnel;
  const { ref, visible } = useReveal(0.1);
  const { itemRefs, visible: stepsV } = useStaggerReveal(f.steps.length, 0.15);

  return (
    <section className="bg-[var(--wh)] text-[var(--bk)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-[var(--verde)]/[.10]">
      <div ref={ref} className="max-w-[1200px] mx-auto">
        <div
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4 font-bold">{f.eyebrow}</div>
          <h2 className="font-bold text-[clamp(26px,3.6vw,42px)] tracking-[-0.5px] leading-[1.15] max-w-[760px] mx-auto text-[var(--verde)]">{f.heading}</h2>
        </div>

        <div className="grid grid-cols-4 max-[1100px]:grid-cols-2 max-[560px]:grid-cols-1 gap-4">
          {f.steps.map((s, i) => (
            <div
              key={s.num}
              ref={el => { itemRefs.current[i] = el; }}
              className="relative border p-6 flex flex-col"
              style={{
                background: s.soon ? "rgba(248,245,239,0.5)" : "var(--wh)",
                borderColor: "rgba(27,61,47,0.12)",
                borderRadius: 2,
                opacity: stepsV[i] ? 1 : 0,
                transform: stepsV[i] ? "none" : "translateY(24px)",
                transition: `all 0.8s cubic-bezier(.16,1,.3,1) ${i * 0.12}s`,
              }}
            >
              <span className="block font-extrabold text-[34px] leading-[1] tracking-[-1px] text-[var(--g1)] mb-3">{s.num}</span>
              <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--g1)]/85 mb-2">{s.label}</span>
              <h3 className="font-bold text-[16px] tracking-[-0.3px] leading-[1.2] mb-2.5 text-[var(--verde)]">{s.title}</h3>
              <p className="text-[13px] text-[var(--bk)]/70 leading-[1.55] mb-3">{s.desc}</p>
              {s.soon && (
                <span
                  className="mt-auto inline-block self-start text-[9px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(201,169,110,0.18)", color: "var(--g1)" }}
                >
                  Próximamente
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP CARD (used by Step1 + Step2)
   ═══════════════════════════════════════════════════════ */
type StepData = {
  eyebrow: string;
  title: string;
  price: string;
  duration: string;
  sessions: string;
  audience: string;
  deliverable: string;
  cta: string;
  waMsg: string;
  pasosLabel: string;
  pasosLede: string;
  priceNote?: string;
};

function StepHeader({ data, dark }: { data: StepData; dark: boolean }) {
  const { ref, visible } = useReveal(0.15);
  const fg = dark ? "var(--wh)" : "var(--verde)";
  const fgSoft = dark ? "rgba(248,245,239,0.78)" : "rgba(27,61,47,0.78)";

  return (
    <div
      ref={ref}
      className="grid grid-cols-12 gap-6 max-[960px]:grid-cols-1 mb-14 max-[960px]:mb-10"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(24px)",
        transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
      }}
    >
      <div className="col-span-7 max-[960px]:col-span-1">
        <div className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)] mb-4">{data.eyebrow}</div>
        <h2 className="font-bold text-[clamp(34px,5vw,64px)] uppercase tracking-[-1.5px] leading-[1] mb-6" style={{ color: fg }}>
          {data.title}
        </h2>
        <p className="text-[15px] leading-[1.65] mb-5 max-w-[580px]" style={{ color: fgSoft }}>
          {data.audience}
        </p>
        <p className="text-[14px] leading-[1.6] max-w-[580px] italic" style={{ color: fgSoft, fontFamily: "var(--font-serif)" }}>
          → {data.deliverable}
        </p>
      </div>

      <div className="col-span-5 max-[960px]:col-span-1">
        <div
          className="border p-6 flex flex-col gap-4"
          style={{
            borderColor: "rgba(201,169,110,0.35)",
            background: dark ? "rgba(201,169,110,0.04)" : "rgba(201,169,110,0.06)",
            borderRadius: 2,
          }}
        >
          <div className="flex items-baseline gap-3">
            <span className="font-bold text-[clamp(38px,5vw,56px)] tracking-[-1px] j3-grad-text leading-[1]">{data.price}</span>
          </div>
          {data.priceNote && (
            <p className="text-[11px] leading-[1.5] tracking-[0.2px]" style={{ color: fgSoft }}>{data.priceNote}</p>
          )}
          <div className="flex flex-col gap-1.5 pt-3 border-t" style={{ borderColor: dark ? "rgba(248,245,239,0.10)" : "rgba(27,61,47,0.10)" }}>
            <span className="text-[12px] font-medium" style={{ color: fg }}><span className="opacity-50 mr-1.5">·</span> {data.duration}</span>
            <span className="text-[12px] font-medium" style={{ color: fg }}><span className="opacity-50 mr-1.5">·</span> {data.sessions}</span>
          </div>
          <a
            href={waLink(data.waMsg)}
            target="_blank"
            rel="noopener noreferrer"
            className="j3-press inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-[11px] font-bold tracking-[2px] uppercase transition-all duration-300 mt-1"
            style={{ background: "var(--g1)", color: "var(--bk)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            <WaIcon size={12} />
            {data.cta}
          </a>
        </div>
      </div>
    </div>
  );
}

/* Pasos grid (used inside Step1 + Step2) */
function PasosGrid({
  pasos,
  dark,
}: {
  pasos: readonly { num: string; week: string; title: string; desc: string }[];
  dark: boolean;
}) {
  const { itemRefs, visible } = useStaggerReveal(pasos.length, 0.1);
  const fg = dark ? "var(--wh)" : "var(--verde)";
  const fgSoft = dark ? "rgba(248,245,239,0.70)" : "rgba(27,61,47,0.70)";
  const border = dark ? "rgba(248,245,239,0.08)" : "rgba(27,61,47,0.10)";
  const bg = dark ? "rgba(255,255,255,0.012)" : "rgba(255,255,255,0.6)";

  return (
    <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-3 max-[960px]:gap-2.5">
      {pasos.map((p, i) => (
        <div
          key={p.num}
          ref={el => { itemRefs.current[i] = el; }}
          className="flex gap-5 max-[640px]:gap-4 p-5 max-[640px]:p-4 border"
          style={{
            background: bg,
            borderColor: border,
            borderRadius: 2,
            opacity: visible[i] ? 1 : 0,
            transform: visible[i] ? "none" : "translateY(16px)",
            transition: `all 0.7s cubic-bezier(.16,1,.3,1) ${i * 0.05}s`,
          }}
        >
          <span className="font-extrabold text-[28px] leading-[1] tracking-[-1px] text-[var(--g1)] flex-shrink-0">{p.num}</span>
          <div className="flex-1 min-w-0">
            <span className="block text-[9.5px] font-bold tracking-[2px] uppercase text-[var(--g1)]/75 mb-1.5">{p.week}</span>
            <h4 className="font-bold text-[14px] leading-[1.25] mb-1.5 tracking-[-0.2px]" style={{ color: fg }}>{p.title}</h4>
            <p className="text-[12.5px] leading-[1.5]" style={{ color: fgSoft }}>{p.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 1
   ═══════════════════════════════════════════════════════ */
function Step1Section() {
  const { t } = useI18n();
  const s = t.business.step1;

  return (
    <section className="bg-[var(--bk)] text-[var(--wh)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.06]">
      <div className="max-w-[1200px] mx-auto">
        <StepHeader data={s} dark={true} />
        <div className="border-t border-white/[.06] pt-10">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)] mb-2.5">{s.pasosLabel}</div>
          <p className="text-[13px] leading-[1.6] text-white/55 max-w-[640px] mb-8 font-light">{s.pasosLede}</p>
          <PasosGrid pasos={s.pasos} dark={true} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2
   ═══════════════════════════════════════════════════════ */
function Step2Section() {
  const { t } = useI18n();
  const s = t.business.step2;

  // Split pasos by phase
  const captacion = s.pasos.filter(p => p.phase === "cap");
  const operacion = s.pasos.filter(p => p.phase === "ops");

  return (
    <section className="bg-[var(--wh)] text-[var(--verde)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-[var(--verde)]/[.10]">
      <div className="max-w-[1200px] mx-auto">
        <StepHeader data={s} dark={false} />
        <div className="border-t border-[var(--verde)]/[.10] pt-10">
          <div className="text-[11px] font-bold tracking-[3px] uppercase text-[var(--g1)] mb-2.5">{s.pasosLabel}</div>
          <p className="text-[13px] leading-[1.6] text-[var(--verde)]/65 max-w-[640px] mb-10 font-light">{s.pasosLede}</p>

          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] mb-4">{s.phaseCaptacion}</div>
          <PasosGrid pasos={captacion} dark={false} />

          <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] mt-12 mb-4">{s.phaseOperacion}</div>
          <PasosGrid pasos={operacion} dark={false} />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   COMPARATIVA
   ═══════════════════════════════════════════════════════ */
function ComparativaSection() {
  const { t } = useI18n();
  const c = t.business.comparativa;
  const { ref, visible } = useReveal(0.1);

  return (
    <section className="bg-[var(--bk)] text-[var(--wh)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.06]">
      <div ref={ref} className="max-w-[1100px] mx-auto">
        <div
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4 font-bold">{c.eyebrow}</div>
          <h2 className="font-bold text-[clamp(26px,3.6vw,42px)] tracking-[-0.5px] leading-[1.15] max-w-[760px] mx-auto">{c.heading}</h2>
        </div>

        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th className="text-left py-4 px-3 text-[10px] font-bold tracking-[2px] uppercase text-[var(--g1)] border-b border-white/[.10]">&nbsp;</th>
                <th className="text-left py-4 px-3 text-[11px] font-bold tracking-[2px] uppercase text-[var(--wh)] border-b border-white/[.10]">{c.colStep1}</th>
                <th className="text-left py-4 px-3 text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] border-b border-white/[.20]">{c.colStep2}</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.label} className="border-b border-white/[.05]">
                  <td className="py-4 px-3 text-[11px] font-medium tracking-[1.5px] uppercase text-white/55 align-top">{r.label}</td>
                  <td className="py-4 px-3 text-[14px] text-white/85 leading-[1.45] align-top">{r.step1}</td>
                  <td className="py-4 px-3 text-[14px] text-[var(--g1)]/95 leading-[1.45] align-top">{r.step2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   POSICIONAMIENTO + REGLA
   ═══════════════════════════════════════════════════════ */
function PosicionamientoSection() {
  const { t } = useI18n();
  const p = t.business.posicionamiento;
  const r = t.business.regla;
  const reveal = useReveal(0.15);

  return (
    <section className="bg-[var(--wh)] text-[var(--verde)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-[var(--verde)]/[.10]">
      <div ref={reveal.ref} className="max-w-[1000px] mx-auto">
        <div
          className="mb-16 max-[960px]:mb-12"
          style={{
            opacity: reveal.visible ? 1 : 0,
            transform: reveal.visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4 font-bold">{p.eyebrow}</div>
          <h2 className="font-bold text-[clamp(24px,3.4vw,40px)] tracking-[-0.4px] leading-[1.2] mb-7 max-w-[860px]">{p.heading}</h2>
          <p className="text-[15px] max-[640px]:text-[14px] leading-[1.7] max-w-[760px] text-[var(--verde)]/75 font-light">{p.body}</p>
        </div>

        <div
          className="border-l-[3px] pl-7 max-[640px]:pl-5 py-2"
          style={{
            borderColor: "var(--g1)",
            opacity: reveal.visible ? 1 : 0,
            transform: reveal.visible ? "none" : "translateX(-12px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.3s",
          }}
        >
          <div className="text-[10px] tracking-[3px] uppercase text-[var(--g1)] mb-3 font-bold">{r.eyebrow}</div>
          <p className="text-[clamp(17px,1.9vw,22px)] leading-[1.45] tracking-[-0.2px] font-bold max-w-[820px]">{r.body}</p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOUNDER
   ═══════════════════════════════════════════════════════ */
function FounderSection() {
  const { t } = useI18n();
  const f = t.business.founder;
  const { ref, visible } = useReveal(0.15);

  return (
    <section className="bg-[var(--bk)] text-[var(--wh)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-white/[.06]">
      <div ref={ref} className="max-w-[1100px] mx-auto grid grid-cols-12 gap-10 max-[960px]:grid-cols-1">
        <div
          className="col-span-5 max-[960px]:col-span-1"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="relative aspect-[4/5] max-[960px]:aspect-[16/9] overflow-hidden border border-white/[.10]" style={{ borderRadius: 2 }}>
            <img
              src="/images/story/javi.jpeg"
              alt={f.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center 30%" }}
            />
          </div>
        </div>

        <div
          className="col-span-7 max-[960px]:col-span-1 flex flex-col justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.15s",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4 font-bold">{f.eyebrow}</div>
          <h2 className="font-bold text-[clamp(28px,4vw,48px)] tracking-[-1px] leading-[1] mb-2">{f.name}</h2>
          <span className="text-[12px] tracking-[2px] uppercase text-[var(--g1)]/85 mb-6 font-bold">{f.role}</span>
          <p className="text-[15px] leading-[1.7] text-white/75 mb-7 font-light max-w-[640px]">{f.bio}</p>
          <ul className="space-y-2.5">
            {f.cred.map((c) => (
              <li key={c} className="flex items-start gap-3 text-[13px] text-white/85">
                <span aria-hidden className="mt-[7px] w-[5px] h-[5px] rounded-full bg-[var(--g1)] flex-shrink-0" />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FAQ
   ═══════════════════════════════════════════════════════ */
function FaqSection() {
  const { t } = useI18n();
  const f = t.business.faq;
  const { ref, visible } = useReveal(0.1);
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-[var(--wh)] text-[var(--verde)] py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-b border-[var(--verde)]/[.10]">
      <div ref={ref} className="max-w-[860px] mx-auto">
        <div
          className="mb-10 max-[960px]:mb-8"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-4 font-bold">{f.eyebrow}</div>
          <h2 className="font-bold text-[clamp(26px,3.6vw,42px)] tracking-[-0.5px] leading-[1.15]">{f.heading}</h2>
        </div>

        <div className="space-y-2">
          {f.items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={item.q}
                className="border border-[var(--verde)]/[.12] overflow-hidden"
                style={{ borderRadius: 2 }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full text-left flex items-start justify-between gap-4 px-5 py-4 transition-colors duration-300 hover:bg-[var(--verde)]/[.02]"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-[14.5px] leading-[1.4] flex-1 tracking-[-0.2px]">{item.q}</span>
                  <span
                    className="flex-shrink-0 mt-1 transition-transform duration-300 text-[var(--g1)]"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0)" }}
                    aria-hidden
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div
                  className="overflow-hidden transition-[max-height,opacity] duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
                  style={{
                    maxHeight: isOpen ? "400px" : "0px",
                    opacity: isOpen ? 1 : 0,
                  }}
                >
                  <p className="px-5 pb-5 text-[13.5px] leading-[1.65] text-[var(--verde)]/75 font-light">{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FINAL CTA
   ═══════════════════════════════════════════════════════ */
function FinalCtaSection() {
  const { t } = useI18n();
  const c = t.business.finalCta;
  const { ref, visible } = useReveal(0.2);

  return (
    <section className="bg-[var(--verde)] text-[var(--wh)] py-[110px] max-[960px]:py-[80px] px-12 max-[960px]:px-6 max-[640px]:px-4 relative overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[420px] pointer-events-none"
        style={{ background: "radial-gradient(circle at 50% 0%, rgba(201,169,110,0.10) 0%, transparent 60%)" }}
      />
      <div ref={ref} className="relative max-w-[860px] mx-auto text-center">
        <div
          className="text-[11px] tracking-[3px] uppercase text-[var(--g1)] mb-6 font-bold max-w-[680px] mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(16px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {c.eyebrow}
        </div>
        <h2
          className="font-bold text-[clamp(40px,6vw,72px)] uppercase tracking-[-1.5px] leading-[1] mb-7"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.1s",
          }}
        >
          <span className="j3-grad-text">{c.heading}</span>
        </h2>
        <p
          className="text-[15px] leading-[1.65] opacity-80 max-w-[600px] mx-auto mb-10 font-light"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.2s",
          }}
        >
          {c.body}
        </p>
        <a
          href={waLink(c.waMsg)}
          target="_blank"
          rel="noopener noreferrer"
          className="j3-press inline-flex items-center gap-2.5 px-7 py-4 max-[640px]:px-6 max-[640px]:py-3.5 rounded-full text-[12px] font-bold tracking-[2px] uppercase transition-all duration-300"
          style={{
            background: "var(--g1)",
            color: "var(--bk)",
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "transform .3s cubic-bezier(.16,1,.3,1) 0.3s, opacity .9s cubic-bezier(.16,1,.3,1) 0.3s",
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.03)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          <WaIcon size={14} />
          {c.cta}
        </a>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PAGE
   ═══════════════════════════════════════════════════════ */
export default function BusinessPage() {
  return (
    <main className="font-sans w-full bg-[var(--bk)]">
      <Navbar />
      <HeroSection />
      <AudienceSection />
      <FunnelSection />
      <Step1Section />
      <Step2Section />
      <ComparativaSection />
      <PosicionamientoSection />
      <FounderSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  );
}
