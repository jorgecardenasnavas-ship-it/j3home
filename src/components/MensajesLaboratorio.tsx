"use client";

/* ──────────────────────────────────────────────
   MensajesLaboratorio — bloque "Coaches dentro" del Lab Coach.

   Concepto: chat estilizado en paleta J3 que simula los mensajes
   reales de coaches del Lab apareciendo en directo. Cada mensaje
   se "escribe" con efecto typewriter, mientras el punto del país
   correspondiente en el globo SE ILUMINA.

   Origen: testimonios reales recogidos en /join (capturas de
   chat WhatsApp del grupo privado). Citas curadas, autoría
   anonimizada (solo país visible) hasta que tengamos firmas.
   ────────────────────────────────────────────── */

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { COACH_LOCATIONS, TOTAL_COUNTRIES } from "@/data/coach-locations";
import { useReveal } from "@/hooks/useReveal";

/* react-globe.gl referencia `window` al cargar el módulo. Lo cargamos
   solo en cliente para evitar errores durante el prerender estático. */
const LabCoachGlobe = dynamic(
  () => import("./LabCoachGlobe").then((m) => m.LabCoachGlobe),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center w-full h-full" aria-hidden>
        <div className="w-2 h-2 rounded-full bg-[var(--champan)] opacity-50 animate-pulse" />
      </div>
    ),
  },
);

interface Testimonio {
  id: string;
  text: string;
  countryId: string;  // matches CoachLocation.id
}

/* Citas reales extraídas de capturas de testimonios en /join.
   Asignación de país editorial — el coach es anónimo, solo se
   muestra la bandera para que el efecto del globo tenga variedad. */
const TESTIMONIOS: Testimonio[] = [
  {
    id: "t1",
    text: "Tres meses después, mi forma de dar las clases ha cambiado radicalmente. Ya no siento que sigo haciendo lo de siempre.",
    countryId: "es",
  },
  {
    id: "t2",
    text: "Estamos tocando temas que no se enseñan. Yo tengo el curso de la FEP y ni por el forro.",
    countryId: "es",
  },
  {
    id: "t3",
    text: "He conseguido mejora salarial.",
    countryId: "es",
  },
  {
    id: "t4",
    text: "Mamma mia. Hoy entrené la volea con un chico de 2ª que jugó FIP Promises hace poco. Lo volvió loco.",
    countryId: "it",
  },
  {
    id: "t5",
    text: "Habéis conseguido crear una conexión brutal. El factor diferencial es vuestro compromiso. Se nota a kilómetros.",
    countryId: "pt",
  },
  {
    id: "t6",
    text: "El nivel que estáis dando es similar al de Xavi e Iniesta. La comunidad de este grupo es la de más calidad que he visto.",
    countryId: "ar",
  },
];

interface CopyTexts {
  eyebrow: string;
  heading: string;
  sub: string;
  footerCount: string;     // "82 coaches en {N} países escribiendo su Camino."
  ctaLabel: string;
  ctaHref: string;
  chatTitle: string;       // "Lab · canal abierto" o similar
  chatSubtitle: string;    // "Mensajes recientes"
}

interface MensajesLaboratorioProps {
  texts: CopyTexts;
}

const TYPING_DELAY_MS = 1200;       // los 3 puntos antes del mensaje
const TYPE_SPEED_MS_PER_CHAR = 28;  // velocidad del typewriter
const READ_TIME_MS = 4500;          // tiempo visible una vez completado
const TRANSITION_MS = 600;          // fade out al siguiente mensaje

type Phase = "typing-dots" | "typing-text" | "reading" | "fading";

export function MensajesLaboratorio({ texts }: MensajesLaboratorioProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing-dots");
  const [typedChars, setTypedChars] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = usePrefersReducedMotion();

  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { ref: stageRef, visible: stageVisible } = useReveal(0.05);

  const current = TESTIMONIOS[activeIndex];
  const country = COACH_LOCATIONS.find((l) => l.id === current.countryId);

  // El país se enciende SOLO mientras se está escribiendo o leyendo activamente.
  const highlightedCountryId =
    phase === "typing-text" || phase === "reading" ? current.countryId : null;

  /* Loop principal de fases. Cada fase agenda el cambio a la siguiente. */
  useEffect(() => {
    if (paused || reduceMotion) return;
    let timeoutId: ReturnType<typeof setTimeout>;

    if (phase === "typing-dots") {
      timeoutId = setTimeout(() => {
        setTypedChars(0);
        setPhase("typing-text");
      }, TYPING_DELAY_MS);
    } else if (phase === "typing-text") {
      if (typedChars < current.text.length) {
        timeoutId = setTimeout(() => {
          setTypedChars((c) => c + 1);
        }, TYPE_SPEED_MS_PER_CHAR);
      } else {
        timeoutId = setTimeout(() => setPhase("reading"), 0);
      }
    } else if (phase === "reading") {
      timeoutId = setTimeout(() => setPhase("fading"), READ_TIME_MS);
    } else if (phase === "fading") {
      timeoutId = setTimeout(() => {
        setActiveIndex((i) => (i + 1) % TESTIMONIOS.length);
        setTypedChars(0);
        setPhase("typing-dots");
      }, TRANSITION_MS);
    }

    return () => clearTimeout(timeoutId);
  }, [phase, typedChars, current.text.length, paused, reduceMotion]);

  /* Si el usuario prefiere menos movimiento, mostramos el texto completo
     en cada cambio de mensaje (sin typewriter ni typing dots). El loop
     entre mensajes sigue funcionando vía el effect principal cuando
     reduceMotion es false. */
  const visibleText = reduceMotion
    ? current.text
    : current.text.slice(0, typedChars);
  const isOpaque = phase !== "fading";

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06] overflow-hidden"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
            {texts.sub}
          </p>
        </div>

        {/* Stage: globo + chat */}
        <div
          ref={stageRef}
          className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] max-[960px]:grid-cols-1 gap-10 max-[960px]:gap-8 items-center"
          style={{
            opacity: stageVisible ? 1 : 0,
            transform: stageVisible ? "none" : "translateY(24px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.1s",
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* IZQ: Globo */}
          <div className="relative flex items-center justify-center min-h-[480px] max-[640px]:min-h-[360px]">
            <ResponsiveGlobe highlightedCountryId={highlightedCountryId} />
            {/* Resplandor radial sutil */}
            <div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(201,169,110,0.07) 0%, transparent 60%)",
              }}
            />
          </div>

          {/* DER: Chat estilizado */}
          <div className="relative">
            <ChatWindow
              countryName={country?.name ?? ""}
              countryFlag={country?.flag ?? ""}
              text={visibleText}
              phase={phase}
              isOpaque={isOpaque}
              chatTitle={texts.chatTitle}
              chatSubtitle={texts.chatSubtitle}
              currentIndex={activeIndex}
              total={TESTIMONIOS.length}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-14 max-[960px]:mt-10 text-center">
          <p className="text-[13px] opacity-60 mb-5">
            {texts.footerCount.replace("{N}", String(TOTAL_COUNTRIES))}
          </p>
          <a
            href={texts.ctaHref}
            className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/55 text-[var(--champan)] hover:bg-[var(--champan)] hover:text-[var(--negro-v)] transition-all duration-300"
          >
            {texts.ctaLabel}
            <span aria-hidden className="ml-2">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── Globo responsive (resize por viewport) ─── */
function ResponsiveGlobe({ highlightedCountryId }: { highlightedCountryId: string | null }) {
  // Lazy init basado en window — evita setState dentro de useEffect.
  const [size, setSize] = useState(() => {
    if (typeof window === "undefined") return 480;
    const w = window.innerWidth;
    if (w < 640) return 320;
    if (w < 960) return 420;
    return 480;
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setSize(320);
      else if (w < 960) setSize(420);
      else setSize(480);
    };
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return <LabCoachGlobe highlightedCountryId={highlightedCountryId} size={size} />;
}

/* ─── Ventana de chat estilizada ─── */
interface ChatWindowProps {
  countryName: string;
  countryFlag: string;
  text: string;
  phase: Phase;
  isOpaque: boolean;
  chatTitle: string;
  chatSubtitle: string;
  currentIndex: number;
  total: number;
}

function ChatWindow({
  countryName,
  countryFlag,
  text,
  phase,
  isOpaque,
  chatTitle,
  chatSubtitle,
  currentIndex,
  total,
}: ChatWindowProps) {
  return (
    <div
      className="relative rounded-[6px] border border-white/[.10] bg-gradient-to-b from-[rgba(27,61,47,0.45)] to-[rgba(14,28,22,0.85)] backdrop-blur-sm overflow-hidden"
      style={{ minHeight: 360 }}
    >
      {/* Top bar — header del "canal" */}
      <header className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[.08] bg-[rgba(14,28,22,0.65)]">
        <div className="w-2 h-2 rounded-full bg-[#9bd1c0] shadow-[0_0_8px_rgba(155,209,192,0.7)]" />
        <div className="flex flex-col leading-[1.15]">
          <span className="text-[11px] font-bold tracking-[1.5px] uppercase text-[var(--champan)]">
            {chatTitle}
          </span>
          <span className="text-[10px] opacity-55 tracking-[0.5px]">
            {chatSubtitle}
          </span>
        </div>
        <div className="ml-auto text-[10px] opacity-40 tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </header>

      {/* Cuerpo: mensaje */}
      <div
        className="px-5 py-7 min-h-[260px] flex flex-col justify-end"
        style={{
          opacity: isOpaque ? 1 : 0,
          transition: `opacity ${TRANSITION_MS}ms ease`,
        }}
      >
        {/* Pie del autor (país) — aparece arriba del mensaje */}
        <div className="text-[10.5px] tracking-[1.5px] uppercase text-[var(--champan)]/70 font-bold mb-2.5 flex items-center gap-2">
          <span aria-hidden className="text-[14px] leading-none">{countryFlag}</span>
          <span>Coach del Lab · {countryName}</span>
        </div>

        {/* Burbuja del mensaje */}
        <div className="relative max-w-[92%] rounded-[4px] rounded-tl-[1px] bg-[rgba(248,245,239,0.06)] border border-white/[.08] px-4 py-3.5">
          <p className="text-[14.5px] max-[640px]:text-[13.5px] leading-[1.55] text-[var(--cream)]">
            {phase === "typing-dots" ? (
              <TypingDots />
            ) : (
              <>
                {text}
                {phase === "typing-text" && (
                  <span
                    aria-hidden
                    className="inline-block w-[2px] h-[1em] bg-[var(--champan)] ml-[2px] align-middle animate-pulse"
                  />
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Indicador de progreso (puntos abajo) */}
      <div className="flex items-center justify-center gap-1.5 px-5 py-3.5 border-t border-white/[.06] bg-[rgba(14,28,22,0.4)]">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width: i === currentIndex ? 18 : 6,
              background:
                i === currentIndex
                  ? "var(--champan)"
                  : "rgba(248,245,239,0.18)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── 3 puntos de "está escribiendo" ─── */
function TypingDots() {
  return (
    <span aria-label="escribiendo" className="inline-flex items-center gap-1.5 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-[var(--champan)]/70"
          style={{
            animation: `typingBounce 1.2s ease-in-out ${i * 0.18}s infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.45; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}

/* ─── Hook: respeta prefers-reduced-motion ─── */
function usePrefersReducedMotion() {
  // Lazy initializer evita el setState inicial dentro de useEffect.
  const [reduce, setReduce] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = (e: MediaQueryListEvent) => setReduce(e.matches);
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduce;
}

/* ─── Tipos exportados (por si page.tsx lo necesita para mocks) ─── */
export type { CopyTexts as MensajesLaboratorioCopy };
