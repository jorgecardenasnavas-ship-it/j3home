"use client";

/* ──────────────────────────────────────────────
   CaminoBlock — los 4 pasos del recorrido del coach J3.

   Reutilizable entre /lab/coach (landing) y /lab/coach/precios.
   Recibe el copy ya pre-extraído desde la página padre — no lee el
   diccionario directamente para mantener el componente agnóstico.

   El paso 04 comparte grado (Head Coach) con el 03; la diferenciación
   visual va por la insignia: morado #534AB7 + check tipo Instagram.
   ────────────────────────────────────────────── */

import type { CaminoStep } from "@/data/lab-coach-pricing";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface CaminoTexts {
  // Header opcional. Si no se pasa, el bloque renderiza solo la grid de pasos.
  eyebrow?: string;
  heading?: string;
  sub?: string;
  // Resolución de claves del catálogo a texto humano.
  grados: { assistantCoach: string; coach: string; headCoach: string };
  insignias: { cualificado: string; certificado: string; verificado: string };
  unlocks: { planCoach: string; planCoachPro: string; examen: string; merito: string };
  hitos: { "01": string; "02": string; "03": string; "04": string };
}

interface CaminoBlockProps {
  steps: readonly CaminoStep[];
  texts: CaminoTexts;
  className?: string;
}

const INSIGNIA_STYLES: Record<NonNullable<CaminoStep["insigniaKey"]>, string> = {
  cualificado: "border-[rgba(155,209,192,0.45)] text-[#9bd1c0]",
  certificado: "border-[rgba(232,199,154,0.45)] text-[#e8c79a]",
  verificado:  "border-[rgba(83,74,183,0.65)]   text-[#a89efc]",
};

/* SVG check tipo Instagram (path "verified" estándar), morado J3 Lab. */
function VerifiedCheck({ size = 16 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="#a89efc"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
    </svg>
  );
}

export function CaminoBlock({ steps, texts, className }: CaminoBlockProps) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(steps.length, 0.2);

  const hasHeader = !!(texts.eyebrow || texts.heading || texts.sub);

  return (
    <section
      className={cn(
        "relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4",
        className,
      )}
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        {hasHeader && (
          <div
            ref={headerRef}
            className="text-center mb-14 max-[960px]:mb-10"
            style={{
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "none" : "translateY(20px)",
              transition: "all 1s cubic-bezier(.16,1,.3,1)",
            }}
          >
            {texts.eyebrow && (
              <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
                {texts.eyebrow}
              </div>
            )}
            {texts.heading && (
              <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
                {texts.heading}
              </h2>
            )}
            {texts.sub && (
              <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[560px] mx-auto leading-[1.55]">
                {texts.sub}
              </p>
            )}
          </div>
        )}

        <ol className="grid grid-cols-4 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4">
          {steps.map((step, i) => {
            const gradoText = texts.grados[step.gradoKey];
            const insigniaText = step.insigniaKey ? texts.insignias[step.insigniaKey] : null;
            const hitoText = texts.hitos[step.num as keyof CaminoTexts["hitos"]];
            const unlockText = texts.unlocks[step.unlockKey];
            const isVerified = step.insigniaKey === "verificado";

            return (
              <li
                key={step.num}
                ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                className={cn(
                  "relative flex flex-col p-5 rounded-[2px] border transition-colors duration-500",
                  isVerified
                    ? "border-[rgba(83,74,183,0.5)] bg-[rgba(83,74,183,0.03)]"
                    : "border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012]",
                )}
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(20px)",
                  transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
                }}
              >
                {isVerified && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
                  />
                )}

                <span
                  aria-hidden
                  className="block font-bold text-[40px] leading-[1] tracking-[-1.5px] text-[var(--champan)]/85 mb-4"
                >
                  {step.num}
                </span>

                {insigniaText && (
                  <div
                    className={cn(
                      "inline-flex items-center gap-1.5 self-start mb-3 px-2 py-[3px] rounded-[2px] border",
                      INSIGNIA_STYLES[step.insigniaKey!],
                    )}
                  >
                    {isVerified && <VerifiedCheck size={12} />}
                    <span className="text-[10px] font-bold tracking-[1.5px] uppercase">
                      {insigniaText}
                    </span>
                  </div>
                )}

                <h3 className="text-[14px] max-[960px]:text-[13px] font-bold uppercase tracking-[-0.2px] mb-3 leading-[1.2]">
                  {gradoText}
                </h3>

                <p className="text-[12.5px] opacity-70 leading-[1.5] mb-4">
                  {hitoText}
                </p>

                <div className="mt-auto pt-3 border-t border-white/[.08]">
                  <span className="text-[10px] tracking-[1.5px] uppercase text-[var(--champan)] font-bold">
                    {unlockText}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
