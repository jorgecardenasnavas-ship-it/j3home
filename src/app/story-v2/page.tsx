"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

/* ───────── HOOKS ───────── */

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

/* ───────── DATA ───────── */

const chapters = [
  { id: 1, label: "Origen" },
  { id: 2, label: "Trayectoria" },
  { id: 3, label: "Jugadores" },
  { id: 4, label: "Sistema" },
  { id: 5, label: "Lo que viene" },
] as const;

const stats = [
  { value: "#1", label: "MEJOR CLUB DEL MUNDO 2018" },
  { value: "Top 4", label: "WPT · ÁLEX RUIZ 2021" },
  { value: "100+", label: "COACHES EN COACH360" },
  { value: "20", label: "AÑOS EN EL SECTOR" },
];

interface TimelineEntry {
  year: string;
  title: string;
  desc: string;
  key?: boolean;
  badge?: string;
}

const timeline: TimelineEntry[] = [
  { year: "2000", title: "El pádel nos encuentra", desc: "Aficionados compitiendo por Andalucía. Selección malagueña y Universidad de Málaga.", key: true },
  { year: "2005–2008", title: "Las primeras clases", desc: "La Capellanía y el Club de Tenis Málaga. Enseñamos lo que el juego nos enseñó." },
  { year: "2009–2010", title: "Ocean Padel", desc: "Los tres juntos por primera vez. Javi, Jorge y Jordi Muñoz. Empieza la escala real.", key: true },
  { year: "2010–2014", title: "Mejor academia de menores", desc: "Álex Ruiz, Momo González, Guille Collado. Selección española.", key: true, badge: "REFERENCIA NACIONAL" },
  { year: "2014", title: "Nace J3Padel", desc: "WPT Málaga con cerca de 300 parejas inscritas.", key: true, badge: "SEDE OFICIAL WPT" },
  { year: "2016", title: "Higuerón Resort", desc: "El ciclo más largo y más exigente. Dirección técnica completa." },
  { year: "2018", title: "Mejor club del mundo", desc: "Dos años de trabajo silencioso y ambicioso. Reconocimiento internacional.", key: true, badge: "#1 BEST PADEL CLUB" },
  { year: "2021", title: "Álex Ruiz · Top 4 Mundial", desc: "Con Franco Stupaczuk. Resultado histórico en el WPT.", key: true, badge: "TOP 4 WPT" },
  { year: "2022", title: "Final WPT Marbella", desc: "100% malagueños. Formados en Ocean Padel / J3. En casa, con los suyos en la grada.", key: true },
  { year: "2024", title: "Fin de un ciclo", desc: "Casi una década gestionando el mejor club del mundo. Ese ciclo se cierra." },
  { year: "2025", title: "Nace Coach360", desc: "Primera comunidad global de entrenadores. 100+ coaches, 40+ lecciones.", key: true, badge: "COACH360" },
  { year: "2026", title: "Nueva sede · Málaga capital", desc: "Finura Padel y Vals Los Limoneros. El ecosistema completo.", key: true, badge: "PRÓXIMO VERANO" },
];

interface PlayerCard {
  rank: string;
  name: string;
  detail: string;
  tag?: string;
  star?: boolean;
}

const players: PlayerCard[] = [
  { rank: "TOP 4 MUNDIAL · WPT 2021", name: "Álex Ruiz", detail: "Formado desde joven en Ocean Padel. Alcanzó el top 4 mundial junto a Franco Stupaczuk.", tag: "Ocean Padel → WPT", star: true },
  { rank: "TOP 5 MUNDIAL · WPT 2022", name: "Momo González", detail: "Cantera Ocean Padel / J3. 100% malagueño. Top 5 mundial en el WPT.", tag: "Ocean Padel → Top 5", star: true },
  { rank: "TOP 8 PPT · COFUNDADOR J3", name: "Jordi Muñoz", detail: "Top 8 mundial en el PPT. Uno de los tres fundadores originales de J3Padel.", star: true },
  { rank: "CAMPEÓN DE ESPAÑA Y DEL MUNDO", name: "Guille Collado", detail: "Primera generación Ocean Padel. Competición internacional con representación española." },
  { rank: "CAMPEONA DE ESPAÑA Y DEL MUNDO", name: "Bea González", detail: "Cantera J3. Títulos nacionales e internacionales. Referente del circuito femenino." },
  { rank: "COLABORACIÓN · #4 MUNDIAL 2021", name: "Franco Stupaczuk", detail: "5 finales y pareja n.º 4 del mundo en 2021, junto a Álex Ruiz. 3 títulos WPT.", tag: "SF P2 Milán 2022" },
];

const collabs = [
  "Paquito Navarro", "Maxi Sánchez", "Fede Chingotto", "Javi Garrido",
  "Álex Arroyo", "Fede Quiles", "Raquel Eugeni", "Pincho Fernández",
];

const pillars = [
  { num: "01", tag: "CRITERIO", title: "Saber por qué,\nno solo qué", text: "Un entrenador con criterio no ejecuta ejercicios — toma decisiones. La base de todo lo que hacemos." },
  { num: "02", tag: "MÉTODO", title: "Repetibilidad\ny progresión", text: "El método J3 está diseñado para producir mejora sistemática. Sin método, el talento no escala." },
  { num: "03", tag: "SISTEMA", title: "Estructura que\nfunciona sola", text: "Un buen sistema trabaja cuando tú no estás. Construido para clubs, academias y entrenadores." },
  { num: "04", tag: "PISTA", title: "Todo parte del\njuego real", text: "Cada concepto ha pasado por la pista — con jugadores reales, en competición real. Sin excepción." },
];

const ecosystem = [
  { label: "COACH360", name: "Formación online", desc: "100+ coaches · 40+ lecciones" },
  { label: "ACADEMY", name: "Cantera de élite", desc: "Málaga capital · 2026" },
  { label: "J3PTV", name: "Contenido y análisis", desc: "El pádel desde dentro" },
  { label: "BUSINESS", name: "Gestión de clubes", desc: "Dirección técnica integral" },
  { label: "EXPERIENCE", name: "Experiencias premium", desc: "Costa del Sol · Internacional" },
  { label: "NUEVA SEDE", name: "Finura + Vals Los Limoneros", desc: "Verano 2026 →" },
];

/* ───────── EASE ───────── */
const ease = "cubic-bezier(.16,1,.3,1)";

/* ═══════════════════════════════════════════════════════
   CH1 · HERO / ORIGEN
   ═══════════════════════════════════════════════════════ */

function ChapterHero() {
  const line = useReveal(0.1);
  const eyebrow = useReveal(0.1);
  const headline = useReveal(0.05);
  const sub = useReveal(0.1);
  const statsReveal = useReveal(0.1);

  return (
    <section className="relative flex flex-col justify-end min-h-[calc(100vh-57px)] px-8 pb-14 pt-20 min-[960px]:px-14 overflow-hidden">
      {/* Huge background number */}
      <span
        className="absolute -right-5 -bottom-10 text-[clamp(200px,28vw,340px)] font-black text-[var(--g1)] opacity-[.06] leading-none tracking-tighter pointer-events-none select-none"
        aria-hidden
      >
        20
      </span>

      {/* Chapter position indicator */}
      <div className="absolute top-20 right-8 min-[960px]:right-14 flex flex-col items-end gap-2">
        {chapters.map((ch, i) => (
          <div
            key={ch.id}
            className={`h-px ${i === 0 ? "w-4 bg-[var(--g1)]" : "w-7 bg-[var(--g1)] opacity-20"}`}
          />
        ))}
        <span className="text-[10px] tracking-[0.1em] text-[var(--g1)] opacity-35 mt-1">
          01 / 05
        </span>
      </div>

      {/* Gold line */}
      <div
        ref={line.ref}
        className="w-10 h-px bg-[var(--g1)] mb-7"
        style={{
          opacity: line.visible ? 1 : 0,
          transform: line.visible ? "none" : "scaleX(0)",
          transformOrigin: "left",
          transition: `all .6s ${ease}`,
        }}
      />

      {/* Eyebrow */}
      <div
        ref={eyebrow.ref}
        className="text-[11px] font-medium tracking-[0.22em] text-[var(--g1)] opacity-65 mb-5"
        style={{
          opacity: eyebrow.visible ? 0.65 : 0,
          transform: eyebrow.visible ? "none" : "translateY(12px)",
          transition: `all .7s ${ease} .1s`,
        }}
      >
        DESDE MÁLAGA · DESDE 2004
      </div>

      {/* Headline */}
      <div
        ref={headline.ref}
        className="mb-0"
        style={{
          opacity: headline.visible ? 1 : 0,
          transform: headline.visible ? "none" : "translateY(40px)",
          transition: `all .9s ${ease} .15s`,
        }}
      >
        <span className="block text-[clamp(48px,8vw,86px)] font-black text-[var(--wh)] leading-[.88] tracking-[-0.04em]">
          MÁS DE
        </span>
        <span className="block text-[clamp(48px,8vw,86px)] font-black j3-grad-text leading-[.88] tracking-[-0.04em]">
          20 AÑOS
        </span>
        <span className="block text-[clamp(48px,8vw,86px)] font-black leading-[.88] tracking-[-0.04em] text-transparent j3-stroke-gold">
          DENTRO DEL JUEGO.
        </span>
      </div>

      {/* Subtitle */}
      <p
        ref={sub.ref}
        className="text-[var(--gy2)] text-base leading-[1.65] max-w-[500px] mt-8"
        style={{
          opacity: sub.visible ? 1 : 0,
          transform: sub.visible ? "none" : "translateY(20px)",
          transition: `all .8s ${ease} .3s`,
        }}
      >
        Uno de los equipos más influyentes en el mundo del pádel. Formamos campeones,
        gestionamos el mejor club del mundo y construimos el sistema que define cómo se entrena hoy.
      </p>

      {/* Stats */}
      <div
        ref={statsReveal.ref}
        className="flex flex-wrap gap-6 min-[960px]:gap-12 mt-10 pt-9 border-t border-white/[.06]"
      >
        {stats.map((s, i) => (
          <div
            key={i}
            className="flex flex-col gap-[5px]"
            style={{
              opacity: statsReveal.visible ? 1 : 0,
              transform: statsReveal.visible ? "none" : "translateY(16px)",
              transition: `all .7s ${ease} ${0.4 + i * 0.08}s`,
            }}
          >
            <span className="text-[var(--g1)] text-[26px] font-extrabold tracking-[-0.02em]">
              {s.value}
            </span>
            <span className="text-[var(--gy)] text-[10px] tracking-[0.14em]">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CH2 · TIMELINE HORIZONTAL
   ═══════════════════════════════════════════════════════ */

function ChapterTimeline() {
  const header = useReveal(0.1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  /* Drag to scroll */
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const el = scrollRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    el.scrollLeft = scrollLeft.current - (x - startX.current);
  }, []);

  const stopDrag = useCallback(() => {
    isDragging.current = false;
    if (scrollRef.current) scrollRef.current.style.cursor = "grab";
  }, []);

  /* Reveal items as they scroll into view */
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(timeline.length).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const observers: IntersectionObserver[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleItems(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold: 0.3, root: container }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section className="flex flex-col py-13 min-h-[calc(100vh-57px)]">
      {/* Header */}
      <div
        ref={header.ref}
        className="px-8 min-[960px]:px-14 pb-9"
        style={{
          opacity: header.visible ? 1 : 0,
          transform: header.visible ? "none" : "translateY(24px)",
          transition: `all .8s ${ease}`,
        }}
      >
        <h2 className="text-[var(--wh)] text-[clamp(28px,4vw,38px)] font-extrabold tracking-[-0.03em] mb-2">
          Trayectoria
        </h2>
        <p className="text-[var(--gy)] text-[13px]">
          Hitos que nos definen — arrastra para recorrer 20 años de historia →
        </p>
      </div>

      {/* Scrollable timeline */}
      <div
        ref={scrollRef}
        className="overflow-x-auto px-8 min-[960px]:px-14 pb-8 cursor-grab select-none"
        style={{ scrollbarWidth: "none" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
      >
        <div className="flex items-start min-w-max">
          {timeline.map((item, i) => (
            <div
              key={i}
              ref={el => { itemRefs.current[i] = el; }}
              className="flex flex-col w-[190px] shrink-0"
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(16px)",
                transition: `all .6s ${ease} ${i * 0.05}s`,
              }}
            >
              {/* Connector: dot + line */}
              <div className="flex items-center h-5">
                <div
                  className={`shrink-0 rounded-full transition-colors duration-200 ${
                    item.key
                      ? "w-3.5 h-3.5 border-2 border-[var(--g1)] bg-[var(--bk)]"
                      : "w-2.5 h-2.5 bg-[var(--g1)] opacity-30"
                  }`}
                />
                {i < timeline.length - 1 && (
                  <div className="flex-1 h-px bg-[var(--g1)] opacity-15" />
                )}
              </div>

              {/* Content */}
              <div className="mt-5 pr-6">
                <div className="text-[var(--g1)] text-[11px] font-bold tracking-[0.12em] mb-2">
                  {item.year}
                </div>
                <div className="text-[var(--wh)] text-[13px] font-semibold leading-[1.4] mb-[5px]">
                  {item.title}
                </div>
                <div className="text-[var(--gy)] text-[11px] leading-[1.55]">
                  {item.desc}
                </div>
                {item.badge && (
                  <span className="inline-block mt-2.5 bg-[var(--g1)]/[.08] border border-[var(--g1)]/25 text-[var(--g1)] opacity-80 text-[10px] px-2 py-[3px] rounded tracking-[0.06em]">
                    {item.badge}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className="px-8 min-[960px]:px-14 text-[var(--gy)] opacity-50 text-[11px] flex items-center gap-2 tracking-[0.06em]">
        <span className="text-[var(--g1)] opacity-40 text-lg animate-[bounce-x_1.8s_ease-in-out_infinite]">→</span>
        Arrastra la línea de tiempo para explorar la historia completa
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CH3 · JUGADORES
   ═══════════════════════════════════════════════════════ */

function ChapterPlayers() {
  const header = useReveal(0.1);
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(players.length).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const collabReveal = useReveal(0.1);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleCards(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section className="flex flex-col py-13 px-8 min-[960px]:px-14 min-h-[calc(100vh-57px)]">
      {/* Header */}
      <div
        ref={header.ref}
        className="pb-9"
        style={{
          opacity: header.visible ? 1 : 0,
          transform: header.visible ? "none" : "translateY(24px)",
          transition: `all .8s ${ease}`,
        }}
      >
        <h2 className="text-[var(--wh)] text-[clamp(28px,4vw,38px)] font-extrabold tracking-[-0.03em] mb-2">
          Jugadores
        </h2>
        <p className="text-[var(--gy)] text-[13px]">
          Cada jugador tiene su roadmap. Formados desde base hasta lo más alto del circuito.
        </p>
      </div>

      {/* Players grid */}
      <div className="grid grid-cols-1 min-[640px]:grid-cols-2 min-[960px]:grid-cols-3 gap-3.5 mb-8">
        {players.map((p, i) => (
          <div
            key={i}
            ref={el => { cardRefs.current[i] = el; }}
            className={`group relative bg-white/[.02] border rounded-[10px] p-5 overflow-hidden transition-all duration-300
              ${p.star ? "border-[var(--g1)]/20" : "border-white/[.07]"}
              hover:border-[var(--g1)]/25 hover:bg-[var(--g1)]/[.03]`}
            style={{
              opacity: visibleCards[i] ? 1 : 0,
              transform: visibleCards[i] ? "none" : "translateY(24px)",
              transition: `all .7s ${ease} ${i * 0.08}s`,
            }}
          >
            {/* Top accent line on hover */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-transparent group-hover:bg-[var(--g1)] transition-colors duration-300" />

            <div className="text-[var(--g1)] opacity-60 text-[10px] font-bold tracking-[0.12em] mb-2.5">
              {p.rank}
            </div>
            <div className="text-[var(--wh)] text-[17px] font-bold tracking-[-0.01em] mb-1.5">
              {p.name}
            </div>
            <div className="text-[var(--gy)] text-[12px] leading-[1.55]">
              {p.detail}
            </div>
            {p.tag && (
              <span className="inline-block mt-2.5 bg-[var(--g1)]/[.08] text-[var(--g1)] text-[10px] px-2 py-[3px] rounded border border-[var(--g1)]/20">
                {p.tag}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Collaborators */}
      <div
        ref={collabReveal.ref}
        className="mt-6"
        style={{
          opacity: collabReveal.visible ? 1 : 0,
          transform: collabReveal.visible ? "none" : "translateY(20px)",
          transition: `all .8s ${ease} .1s`,
        }}
      >
        <div className="text-[var(--gy)] opacity-60 text-[10px] tracking-[0.15em] mb-3">
          TAMBIÉN HAN COMPARTIDO EQUIPO CON J3
        </div>
        <div className="flex flex-wrap gap-2">
          {collabs.map((name, i) => (
            <span
              key={i}
              className="bg-white/[.03] border border-white/[.08] text-[var(--gy2)] text-[11px] px-3 py-[5px] rounded-md transition-all duration-200 hover:border-[var(--g1)]/20 hover:text-[var(--g1)] opacity-70 hover:opacity-100"
              style={{
                opacity: collabReveal.visible ? 0.7 : 0,
                transition: `all .5s ${ease} ${0.2 + i * 0.04}s`,
              }}
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CH4 · EL SISTEMA J3
   ═══════════════════════════════════════════════════════ */

function ChapterSistema() {
  const header = useReveal(0.1);
  const [visiblePillars, setVisiblePillars] = useState<boolean[]>(new Array(pillars.length).fill(false));
  const pillarRefs = useRef<(HTMLDivElement | null)[]>([]);
  const quote = useReveal(0.1);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    pillarRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisiblePillars(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section className="flex flex-col py-13 px-8 min-[960px]:px-14 min-h-[calc(100vh-57px)]">
      {/* Header */}
      <div
        ref={header.ref}
        style={{
          opacity: header.visible ? 1 : 0,
          transform: header.visible ? "none" : "translateY(24px)",
          transition: `all .8s ${ease}`,
        }}
      >
        <h2 className="text-[var(--wh)] text-[clamp(28px,4vw,38px)] font-extrabold tracking-[-0.03em] mb-2">
          El Sistema J3
        </h2>
        <p className="text-[var(--gy)] text-[13px] mt-2">
          No entrenamos por ejercicios sueltos. Cada cosa responde a un sistema construido durante 20 años.
        </p>
      </div>

      {/* Pillars grid */}
      <div className="grid grid-cols-1 min-[640px]:grid-cols-2 gap-4 my-9">
        {pillars.map((p, i) => (
          <div
            key={i}
            ref={el => { pillarRefs.current[i] = el; }}
            className="group relative bg-white/[.02] border border-white/[.07] rounded-xl p-7 overflow-hidden transition-all duration-300 hover:border-[var(--g1)]/25 hover:bg-[var(--g1)]/[.025]"
            style={{
              opacity: visiblePillars[i] ? 1 : 0,
              transform: visiblePillars[i] ? "none" : "translateY(28px)",
              transition: `all .7s ${ease} ${i * 0.1}s`,
            }}
          >
            {/* Background number */}
            <span
              className="absolute -bottom-2.5 right-3 text-[72px] font-black text-[var(--g1)] opacity-[.06] leading-none tracking-[-0.02em] pointer-events-none"
              aria-hidden
            >
              {p.num}
            </span>

            <div className="text-[var(--g1)] text-[10px] font-bold tracking-[0.18em] mb-3.5">
              {p.tag}
            </div>
            <div className="text-[var(--wh)] text-[20px] font-extrabold tracking-[-0.02em] mb-2.5 whitespace-pre-line">
              {p.title}
            </div>
            <div className="text-[var(--gy2)] text-[13px] leading-[1.65]">
              {p.text}
            </div>
          </div>
        ))}
      </div>

      {/* Quote */}
      <div
        ref={quote.ref}
        className="border-l-2 border-[var(--g1)]/35 pl-6 py-4 bg-[var(--g1)]/[.03] rounded-r-lg"
        style={{
          opacity: quote.visible ? 1 : 0,
          transform: quote.visible ? "none" : "translateX(-20px)",
          transition: `all .8s ${ease} .2s`,
        }}
      >
        <p className="text-[var(--gy2)] text-base leading-[1.6] italic font-[var(--font-serif)]">
          &ldquo;Ver el juego antes de que ocurra. Eso es entrenar.&rdquo;
        </p>
        <p className="text-[var(--g1)] opacity-55 text-[11px] mt-3 tracking-[0.08em]">
          — JORGE CÁRDENAS NAVAS · Co-founder · CSO
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CH5 · LO QUE VIENE
   ═══════════════════════════════════════════════════════ */

function ChapterFuturo() {
  const eyebrow = useReveal(0.1);
  const headline = useReveal(0.05);
  const sub = useReveal(0.1);
  const [visibleEco, setVisibleEco] = useState<boolean[]>(new Array(ecosystem.length).fill(false));
  const ecoRefs = useRef<(HTMLDivElement | null)[]>([]);
  const ctaReveal = useReveal(0.1);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    ecoRefs.current.forEach((el, i) => {
      if (!el) return;
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleEco(prev => { const n = [...prev]; n[i] = true; return n; });
            io.disconnect();
          }
        },
        { threshold: 0.15 }
      );
      io.observe(el);
      observers.push(io);
    });
    return () => observers.forEach(io => io.disconnect());
  }, []);

  return (
    <section className="relative flex flex-col justify-center py-13 px-8 min-[960px]:px-14 min-h-[calc(100vh-57px)] overflow-hidden">
      {/* Huge background text */}
      <span
        className="absolute -right-[60px] top-1/2 -translate-y-1/2 text-[clamp(200px,35vw,420px)] font-black text-[var(--g1)] opacity-[.04] tracking-[-0.06em] pointer-events-none select-none leading-none"
        aria-hidden
      >
        J3
      </span>

      <div className="relative z-[1]">
        {/* Eyebrow */}
        <div
          ref={eyebrow.ref}
          className="text-[var(--g1)] opacity-50 text-[11px] tracking-[0.22em] mb-5"
          style={{
            opacity: eyebrow.visible ? 0.5 : 0,
            transform: eyebrow.visible ? "none" : "translateY(12px)",
            transition: `all .7s ${ease}`,
          }}
        >
          LO QUE VIENE · 2026
        </div>

        {/* Big headline */}
        <div
          ref={headline.ref}
          style={{
            opacity: headline.visible ? 1 : 0,
            transform: headline.visible ? "none" : "translateY(30px)",
            transition: `all .9s ${ease} .1s`,
          }}
        >
          <h2 className="text-[var(--wh)] text-[clamp(32px,5vw,52px)] font-black leading-[1] tracking-[-0.03em] mb-2">
            Hasta aquí,<br />
            todo es <span className="j3-grad-text">historia.</span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          ref={sub.ref}
          className="text-[var(--gy2)] text-[15px] leading-[1.65] max-w-[520px] my-6 min-[960px]:mt-6 min-[960px]:mb-9"
          style={{
            opacity: sub.visible ? 1 : 0,
            transform: sub.visible ? "none" : "translateY(16px)",
            transition: `all .8s ${ease} .2s`,
          }}
        >
          Lo que viene se escribe con las personas que decidan ser parte.
          Si eres entrenador, tienes un club o simplemente quieres entrenar con nosotros — este es el momento.
        </p>

        {/* Ecosystem grid */}
        <div className="grid grid-cols-2 min-[960px]:grid-cols-3 gap-2.5 mb-9 max-w-[640px]">
          {ecosystem.map((item, i) => (
            <div
              key={i}
              ref={el => { ecoRefs.current[i] = el; }}
              className="bg-white/[.02] border border-white/[.07] rounded-lg p-4 transition-all duration-200 hover:border-[var(--g1)]/30 hover:bg-[var(--g1)]/[.04]"
              style={{
                opacity: visibleEco[i] ? 1 : 0,
                transform: visibleEco[i] ? "none" : "translateY(16px)",
                transition: `all .6s ${ease} ${0.3 + i * 0.06}s`,
              }}
            >
              <div className="text-[var(--g1)] text-[10px] font-bold tracking-[0.14em] mb-1.5">
                {item.label}
              </div>
              <div className="text-[var(--wh)] text-[13px] font-semibold">
                {item.name}
              </div>
              <div className="text-[var(--gy)] text-[11px] mt-[3px]">
                {item.desc}
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div
          ref={ctaReveal.ref}
          className="flex flex-wrap gap-3 items-center"
          style={{
            opacity: ctaReveal.visible ? 1 : 0,
            transform: ctaReveal.visible ? "none" : "translateY(16px)",
            transition: `all .7s ${ease} .5s`,
          }}
        >
          <button className="bg-[var(--g1)] text-[var(--bk)] text-[12px] font-bold px-6 py-3 rounded-[7px] tracking-[0.08em] transition-opacity duration-200 hover:opacity-85">
            HABLA CON NOSOTROS
          </button>
          <button className="bg-transparent border border-[var(--g1)]/30 text-[var(--g1)] opacity-65 text-[12px] px-6 py-[11px] rounded-[7px] tracking-[0.08em] transition-all duration-200 hover:border-[var(--g1)] hover:opacity-100">
            EXPLORAR COACH360
          </button>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */

export default function StoryV2Page() {
  const [activeChapter, setActiveChapter] = useState(1);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  /* Scroll-spy: update active chapter based on scroll position */
  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      for (let i = sectionRefs.current.length - 1; i >= 0; i--) {
        const el = sectionRefs.current[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveChapter(i + 1);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Navigate to chapter */
  const goTo = useCallback((chapter: number) => {
    const el = sectionRefs.current[chapter - 1];
    if (el) {
      const navHeight = 52;
      const tabHeight = 44;
      const y = el.offsetTop - navHeight - tabHeight;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  return (
    <>
      <Navbar />

      {/* Chapter navigation — sticky below navbar */}
      <nav
        className="sticky top-[52px] z-50 flex items-center justify-center gap-1 px-4 py-1.5 bg-[var(--bk)]/90 backdrop-blur-md border-b border-[var(--g1)]/[.12]"
        role="tablist"
      >
        {chapters.map(ch => (
          <button
            key={ch.id}
            role="tab"
            aria-selected={activeChapter === ch.id}
            onClick={() => goTo(ch.id)}
            className={`text-[11px] tracking-[0.08em] px-3 py-[7px] rounded-md transition-all duration-200 whitespace-nowrap
              ${activeChapter === ch.id
                ? "bg-[var(--g1)]/[.12] text-[var(--g1)] border border-[var(--g1)]/35"
                : "text-white/35 border border-transparent hover:text-white/70 hover:bg-white/[.04]"
              }`}
          >
            {`0${ch.id} · ${ch.label}`}
          </button>
        ))}
      </nav>

      {/* All chapters as scrollable sections */}
      <main className="w-full max-w-[1100px] mx-auto bg-[var(--bk2)]">
        <div ref={el => { sectionRefs.current[0] = el; }}>
          <ChapterHero />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--g1)]/15 to-transparent" />

        <div ref={el => { sectionRefs.current[1] = el; }}>
          <ChapterTimeline />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--g1)]/15 to-transparent" />

        <div ref={el => { sectionRefs.current[2] = el; }}>
          <ChapterPlayers />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--g1)]/15 to-transparent" />

        <div ref={el => { sectionRefs.current[3] = el; }}>
          <ChapterSistema />
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-[var(--g1)]/15 to-transparent" />

        <div ref={el => { sectionRefs.current[4] = el; }}>
          <ChapterFuturo />
        </div>
      </main>

      <Footer />
    </>
  );
}
