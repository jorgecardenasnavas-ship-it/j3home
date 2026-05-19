"use client";

/* ──────────────────────────────────────────────
   CaminoBlock — los 3 tiers verticales del camino del coach J3.

   Reescritura V1 (mayo 2026): pasamos de 4 escalones de grados
   (Rookie/Assistant/Coach/Master Coach) a 3 tiers verticales
   (Coach/Pro Coach/Head Coach) + 3 insignias horizontales
   (Cualificado/Certificado/Verificado) que viven en Pro Coach.

   Reutilizable entre /lab/coach (landing) y /lab/coach/precios.
   Recibe el copy ya pre-extraído desde la página padre — no lee el
   diccionario directamente para mantener el componente agnóstico.

   El tier Head Coach (el tercero) se diferencia visualmente con
   paleta morado (#534AB7 borde, #a89efc texto) y banda superior
   gradiente, indicando que es el tier superior del Camino.

   Las 3 insignias se muestran debajo de los tiers, horizontales,
   cada una con paleta propia: cualificado verde (#9bd1c0),
   certificado champán (#e8c79a), verificado morado (#a89efc).
   ────────────────────────────────────────────── */

import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface CaminoTexts {
  // Header opcional. Si no se pasa, el bloque renderiza solo los tiers + insignias.
  eyebrow?: string;
  heading?: string;
  sub?: string;
  // Remate opcional bajo todo el bloque — gancho aspiracional.
  closer?: string;
  // Los 3 tiers verticales del Camino.
  tiers: {
    coach: { name: string; desc: string; price: string };
    proCoach: { name: string; desc: string; price: string };
    headCoach: { name: string; desc: string; price: string };
  };
  // Las 3 insignias horizontales que viven en Pro Coach.
  insignias: {
    cualificado: { name: string; desc: string };
    certificado: { name: string; desc: string };
    verificado: { name: string; desc: string };
  };
}

interface CaminoBlockProps {
  texts: CaminoTexts;
  className?: string;
}

export function CaminoBlock({ texts, className }: CaminoBlockProps) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(3, 0.2);

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
              <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
                {texts.sub}
              </p>
            )}
          </div>
        )}

        {/* 3 tiers verticales */}
        <ol className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-4 mb-14 max-[960px]:mb-10">
          {(["coach", "proCoach", "headCoach"] as const).map((tierKey, i) => {
            const tier = texts.tiers[tierKey];
            const isHeadCoach = tierKey === "headCoach";
            const isProCoach = tierKey === "proCoach";
            return (
              <li
                key={tierKey}
                ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
                className={cn(
                  "relative flex flex-col p-6 rounded-[2px] border transition-colors duration-500",
                  isHeadCoach
                    ? "border-[rgba(83,74,183,0.5)] bg-[rgba(83,74,183,0.03)]"
                    : isProCoach
                    ? "border-[var(--champan)]/45 bg-[rgba(201,169,110,0.04)]"
                    : "border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012]",
                )}
                style={{
                  opacity: visibleItems[i] ? 1 : 0,
                  transform: visibleItems[i] ? "none" : "translateY(20px)",
                  transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
                }}
              >
                {isHeadCoach && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
                  />
                )}
                {isProCoach && (
                  <span
                    className="absolute top-0 right-4 -translate-y-1/2 text-[9.5px] font-bold tracking-[2px] uppercase px-2.5 py-1 rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)]"
                  >
                    Recomendado
                  </span>
                )}
                <span
                  aria-hidden
                  className="block font-bold text-[40px] leading-[1] tracking-[-1.5px] text-[var(--champan)]/85 mb-4"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={cn(
                  "text-[18px] max-[960px]:text-[16px] font-bold uppercase tracking-[-0.2px] mb-2 leading-[1.2]",
                  isHeadCoach && "text-[#a89efc]",
                )}>
                  {tier.name}
                </h3>
                <p className="text-[13px] opacity-70 leading-[1.5] mb-4 flex-1">
                  {tier.desc}
                </p>
                <div className="mt-auto pt-3 border-t border-white/[.08]">
                  <span className={cn(
                    "text-[12px] tracking-[1px] uppercase font-bold",
                    isHeadCoach ? "text-[#a89efc]" : "text-[var(--champan)]",
                  )}>
                    {tier.price}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Insignias horizontales (viven en Pro Coach) */}
        <div className="relative max-w-[920px] mx-auto">
          <div className="text-center mb-6">
            <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]">
              Insignias disponibles en Pro Coach
            </span>
          </div>
          <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-4">
            {(["cualificado", "certificado", "verificado"] as const).map((insigniaKey) => {
              const insignia = texts.insignias[insigniaKey];
              return (
                <article
                  key={insigniaKey}
                  className={cn(
                    "flex flex-col items-start p-4 rounded-[2px] border bg-white/[0.012]",
                    insigniaKey === "cualificado" && "border-[rgba(155,209,192,0.45)]",
                    insigniaKey === "certificado" && "border-[rgba(232,199,154,0.45)]",
                    insigniaKey === "verificado" && "border-[rgba(83,74,183,0.65)]",
                  )}
                >
                  <span
                    className={cn(
                      "text-[10px] font-bold tracking-[1.5px] uppercase mb-2",
                      insigniaKey === "cualificado" && "text-[#9bd1c0]",
                      insigniaKey === "certificado" && "text-[#e8c79a]",
                      insigniaKey === "verificado" && "text-[#a89efc]",
                    )}
                  >
                    {insignia.name}
                  </span>
                  <p className="text-[12.5px] opacity-70 leading-[1.45]">
                    {insignia.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Closer opcional — remate aspiracional bajo el bloque */}
        {texts.closer && (
          <p className="max-w-[680px] mx-auto text-center text-[14px] max-[640px]:text-[13px] leading-[1.55] mt-14 max-[960px]:mt-10 text-[var(--champan)]/85 font-medium">
            {texts.closer}
          </p>
        )}
      </div>
    </section>
  );
}
