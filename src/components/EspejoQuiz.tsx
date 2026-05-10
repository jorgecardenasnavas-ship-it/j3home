"use client";

/* ──────────────────────────────────────────────
   EspejoQuiz — Modo Carrera · Diagnóstico de Criterio.

   Bloque interactivo de 6 escenas (2 por pilar: Criterio · Método ·
   Planificación) que diagnostica cómo decide el coach en pista.

   Mecánica:
   - Una escena a la vez con 4 opciones (3 trampas + 1 respuesta J3).
   - El visitante selecciona, confirma, ve la respuesta J3.
   - Avanza a la siguiente escena.
   - Al final: pantalla de diagnóstico con score y Camino sugerido.

   El componente recibe el copy completo desde el padre (siEstoTeSuena).
   ────────────────────────────────────────────── */

import { useEffect, useMemo, useRef, useState } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type SiEstoTeSuena = {
  eyebrow: string;
  heading: string;
  sub: string;
  closer: string;
  progressLabel: string;
  scenes: ReadonlyArray<{
    pillar: "criterio" | "metodo" | "planificacion";
    pillarLabel: string;
    sceneNumber: number;
    situation: string;
    options: readonly string[];
    correctIndex: number;
    j3Response: {
      title: string;
      body: string;
      anchor: string;
    };
  }>;
  ui: {
    confirmLabel: string;
    nextLabel: string;
    j3Badge: string;
    correctBadge: string;
    trapBadge: string;
    seeResultsLabel: string;
  };
  results: {
    eyebrow: string;
    scoreLabel: string;
    tiers: ReadonlyArray<{
      minScore: number;
      maxScore: number;
      statusBadge: {
        prefix: string;
        rhythm: string;
      };
      heading: string;
      body: string;
      recommendation: string;
      ctaLabel: string;
      ctaHref: string;
    }>;
  };
};

interface EspejoQuizProps {
  texts: SiEstoTeSuena;
}

export function EspejoQuiz({ texts }: EspejoQuizProps) {
  const totalScenes = texts.scenes.length;

  // Estado: índice de escena actual (0..totalScenes), selecciones por escena, confirmadas por escena.
  // Cuando currentIndex === totalScenes → mostrar resultados.
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selections, setSelections] = useState<Record<number, number | undefined>>({});
  const [confirmed, setConfirmed] = useState<Record<number, boolean>>({});

  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);

  // Calcular score: cuántas respuestas correctas tiene el usuario.
  const score = useMemo(() => {
    return texts.scenes.reduce((acc, scene, i) => {
      if (confirmed[i] && selections[i] === scene.correctIndex) {
        return acc + 1;
      }
      return acc;
    }, 0);
  }, [confirmed, selections, texts.scenes]);

  const isFinished = currentIndex >= totalScenes;

  // Tier de resultados según score.
  const resultsTier = useMemo(() => {
    if (!isFinished) return null;
    return texts.results.tiers.find(
      (t) => score >= t.minScore && score <= t.maxScore,
    );
  }, [isFinished, score, texts.results.tiers]);

  return (
    <section
      className="relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[920px] mx-auto">
        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-12 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(28px,3.8vw,44px)] tracking-[-1px] leading-[1.15] mb-4">
            {texts.heading}
          </h2>
          <p className="text-[14px] opacity-65 max-w-[560px] mx-auto leading-[1.55] italic">
            {texts.sub}
          </p>
        </div>

        {!isFinished ? (
          <SceneCard
            key={currentIndex}
            scene={texts.scenes[currentIndex]}
            totalScenes={totalScenes}
            currentIndex={currentIndex}
            progressLabel={texts.progressLabel}
            ui={texts.ui}
            isLast={currentIndex === totalScenes - 1}
            selection={selections[currentIndex]}
            confirmed={!!confirmed[currentIndex]}
            onSelect={(idx) =>
              setSelections((prev) => ({ ...prev, [currentIndex]: idx }))
            }
            onConfirm={() =>
              setConfirmed((prev) => ({ ...prev, [currentIndex]: true }))
            }
            onNext={() => setCurrentIndex(currentIndex + 1)}
          />
        ) : (
          <ResultsCard
            score={score}
            total={totalScenes}
            tier={resultsTier}
            resultsEyebrow={texts.results.eyebrow}
            scoreLabel={texts.results.scoreLabel}
            closer={texts.closer}
          />
        )}
      </div>
    </section>
  );
}

/* ──────────────────────────────────────────────
   Una escena
   ────────────────────────────────────────────── */
interface SceneCardProps {
  scene: SiEstoTeSuena["scenes"][number];
  totalScenes: number;
  currentIndex: number;
  progressLabel: string;
  ui: SiEstoTeSuena["ui"];
  isLast: boolean;
  selection: number | undefined;
  confirmed: boolean;
  onSelect: (idx: number) => void;
  onConfirm: () => void;
  onNext: () => void;
}

function SceneCard({
  scene,
  totalScenes,
  currentIndex,
  progressLabel,
  ui,
  isLast,
  selection,
  confirmed,
  onSelect,
  onConfirm,
  onNext,
}: SceneCardProps) {
  const { ref, visible } = useReveal(0.05);
  const j3PanelRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll suave al panel J3 cuando el usuario confirma su respuesta.
  // Importante en mobile, donde el panel queda fuera del viewport.
  useEffect(() => {
    if (confirmed && j3PanelRef.current) {
      // Delay mínimo para que el DOM termine de pintar el panel antes de hacer scroll.
      const t = window.setTimeout(() => {
        j3PanelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 80);
      return () => window.clearTimeout(t);
    }
  }, [confirmed]);

  return (
    <div
      ref={ref}
      className="relative max-w-[760px] mx-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "all 0.8s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* Progress + Pillar tag */}
      <div className="flex items-center justify-between mb-5 max-[640px]:mb-4">
        <span className="text-[10px] font-bold tracking-[2px] uppercase text-[var(--champan)]">
          {progressLabel} {currentIndex + 1} / {totalScenes} · {scene.pillarLabel}
        </span>
        {/* Mini progress bar */}
        <div className="flex gap-1">
          {Array.from({ length: totalScenes }).map((_, i) => (
            <span
              key={i}
              aria-hidden
              className={cn(
                "w-[18px] h-[2px] rounded-[1px] transition-colors duration-300",
                i < currentIndex
                  ? "bg-[var(--champan)]"
                  : i === currentIndex
                  ? "bg-[var(--champan)]/60"
                  : "bg-white/[.10]",
              )}
            />
          ))}
        </div>
      </div>

      {/* Caja de la escena */}
      <div className="relative p-8 max-[960px]:p-6 max-[640px]:p-5 rounded-[2px] border border-[var(--champan)]/35 bg-[rgba(201,169,110,0.025)]">
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
        />

        {/* Situación */}
        <h3 className="font-bold text-[clamp(18px,2.2vw,24px)] tracking-[-0.3px] leading-[1.3] mb-7 max-[640px]:mb-6">
          {scene.situation}
        </h3>

        {/* Opciones */}
        <ul className="space-y-3 mb-7 max-[640px]:mb-6">
          {scene.options.map((option, idx) => {
            const isSelected = selection === idx;
            const isCorrect = idx === scene.correctIndex;

            // Estados visuales tras confirmación:
            // - opción correcta: verde
            // - opción seleccionada incorrecta: atenuada con marca
            // - resto: atenuadas
            let stateClass = "";
            if (confirmed) {
              if (isCorrect) {
                stateClass =
                  "border-[#9bd1c0]/60 bg-[rgba(155,209,192,0.06)] text-[var(--wh)]";
              } else if (isSelected) {
                stateClass =
                  "border-white/[.10] bg-white/[0.012] text-[var(--wh)]/40";
              } else {
                stateClass =
                  "border-white/[.05] bg-white/[0.005] text-[var(--wh)]/30";
              }
            } else {
              stateClass = isSelected
                ? "border-[var(--champan)]/55 bg-[rgba(201,169,110,0.06)]"
                : "border-white/[.10] hover:border-[var(--champan)]/30 bg-white/[0.012]";
            }

            return (
              <li key={option}>
                <button
                  type="button"
                  disabled={confirmed}
                  onClick={() => onSelect(idx)}
                  className={cn(
                    "relative w-full text-left p-4 max-[640px]:p-3.5 rounded-[2px] border transition-all duration-300 cursor-pointer disabled:cursor-default",
                    stateClass,
                  )}
                >
                  <div className="flex items-start gap-3">
                    {/* Marker */}
                    <span
                      aria-hidden
                      className={cn(
                        "mt-[3px] flex items-center justify-center w-[16px] h-[16px] rounded-full border-2 flex-shrink-0 transition-colors duration-300",
                        confirmed && isCorrect
                          ? "border-[#9bd1c0] bg-[#9bd1c0]"
                          : isSelected
                          ? "border-[var(--champan)] bg-[var(--champan)]"
                          : "border-white/[.25] bg-transparent",
                      )}
                    >
                      {confirmed && isCorrect && (
                        <svg
                          width="9"
                          height="9"
                          viewBox="0 0 12 12"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M2 6.5L4.5 9L10 3.5"
                            stroke="var(--bk)"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    <span className="text-[14px] max-[640px]:text-[13.5px] leading-[1.5]">
                      {option}
                    </span>
                  </div>

                  {/* Badge tras confirmación */}
                  {confirmed && isCorrect && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold tracking-[1.5px] uppercase text-[#9bd1c0] px-2 py-[2px] rounded-[2px] border border-[#9bd1c0]/40 bg-[rgba(155,209,192,0.08)]">
                      {ui.j3Badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {/* Confirm / Next button */}
        {!confirmed ? (
          <button
            type="button"
            disabled={selection === undefined}
            onClick={onConfirm}
            className={cn(
              "inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] transition-all duration-300",
              selection === undefined
                ? "bg-white/[0.04] text-[var(--wh)]/30 cursor-not-allowed"
                : "bg-[var(--champan)] text-[var(--negro-v)] hover:bg-[var(--g2)] cursor-pointer",
            )}
          >
            {ui.confirmLabel}
          </button>
        ) : (
          <>
            {/* Panel J3: explicación de la respuesta correcta */}
            <div
              ref={j3PanelRef}
              className="relative mb-6 p-5 max-[640px]:p-4 rounded-[2px] border border-[#9bd1c0]/30 bg-[rgba(155,209,192,0.04)] scroll-mt-20"
              aria-live="polite"
            >
              <div className="text-[10px] font-bold tracking-[2px] uppercase text-[#9bd1c0] mb-2">
                {ui.j3Badge}
              </div>
              <h4 className="font-bold text-[16px] max-[640px]:text-[15px] leading-[1.3] mb-2 text-[var(--wh)]">
                {scene.j3Response.title}
              </h4>
              <p className="text-[13.5px] max-[640px]:text-[13px] leading-[1.55] opacity-85 mb-3">
                {scene.j3Response.body}
              </p>
              <p className="italic font-[var(--font-serif)] text-[14px] max-[640px]:text-[13.5px] leading-[1.4] text-[#9bd1c0]">
                &ldquo;{scene.j3Response.anchor}&rdquo;
              </p>
            </div>

            <button
              type="button"
              onClick={onNext}
              className="inline-flex items-center justify-center min-h-[48px] px-7 py-3 text-[12px] font-bold tracking-[1.8px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] hover:bg-[var(--g2)] transition-all duration-300 cursor-pointer"
            >
              {isLast ? ui.seeResultsLabel : ui.nextLabel}
              <span aria-hidden className="ml-2">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Resultados (al completar las 6 escenas)
   ────────────────────────────────────────────── */
interface ResultsCardProps {
  score: number;
  total: number;
  tier: SiEstoTeSuena["results"]["tiers"][number] | null | undefined;
  resultsEyebrow: string;
  scoreLabel: string;
  closer: string;
}

function ResultsCard({
  score,
  total,
  tier,
  resultsEyebrow,
  scoreLabel,
  closer,
}: ResultsCardProps) {
  const { ref, visible } = useReveal(0.05);

  if (!tier) return null;

  return (
    <div
      ref={ref}
      className="relative max-w-[760px] mx-auto"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px)",
        transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
      }}
    >
      {/* Score visual */}
      <div className="text-center mb-8">
        <div className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)] mb-3">
          {resultsEyebrow}
        </div>
        <div className="font-bold text-[clamp(48px,8vw,80px)] tracking-[-2px] leading-[1] text-[var(--champan)] mb-2">
          {score}<span className="opacity-40">/{total}</span>
        </div>
        <div className="text-[11px] tracking-[2px] uppercase opacity-50">
          {scoreLabel}
        </div>
      </div>

      {/* Status badge — modo carrera */}
      <div className="flex justify-center mb-7 max-[640px]:mb-6">
        <div className="inline-flex items-center gap-3 max-[640px]:gap-2 px-5 py-2 max-[640px]:px-4 max-[640px]:py-2 rounded-[2px] border border-[var(--champan)]/55 bg-[rgba(201,169,110,0.06)]">
          <span aria-hidden className="w-[6px] h-[6px] rounded-full bg-[var(--champan)] flex-shrink-0" />
          <span className="text-[10px] max-[640px]:text-[9.5px] font-bold tracking-[2px] uppercase text-[var(--champan)] leading-[1.3]">
            {tier.statusBadge.prefix}
          </span>
          <span aria-hidden className="text-[var(--champan)]/50">·</span>
          <span className="text-[10px] max-[640px]:text-[9.5px] font-bold tracking-[2px] uppercase text-[var(--wh)]/85 leading-[1.3]">
            {tier.statusBadge.rhythm}
          </span>
        </div>
      </div>

      {/* Tier de resultados */}
      <div className="relative p-8 max-[960px]:p-6 max-[640px]:p-5 rounded-[2px] border border-[var(--champan)]/45 bg-[rgba(201,169,110,0.04)]">
        <span
          aria-hidden
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--champan)] to-transparent"
        />

        <h3 className="font-bold text-[clamp(22px,2.8vw,30px)] tracking-[-0.5px] leading-[1.2] mb-4">
          {tier.heading}
        </h3>

        <p className="text-[14px] max-[640px]:text-[13.5px] opacity-85 leading-[1.6] mb-4">
          {tier.body}
        </p>

        <p className="text-[14px] max-[640px]:text-[13.5px] font-bold leading-[1.55] text-[var(--champan)] mb-7">
          {tier.recommendation}
        </p>

        <a
          href={tier.ctaHref}
          className="inline-flex items-center justify-center min-h-[52px] px-8 py-3 text-[12px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
        >
          {tier.ctaLabel}
          <span aria-hidden className="ml-2">→</span>
        </a>
      </div>

      <p className="text-center text-[12.5px] opacity-60 italic mt-8">
        {closer}
      </p>
    </div>
  );
}
