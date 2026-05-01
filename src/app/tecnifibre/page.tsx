"use client";

import { useEffect } from "react";
import { HeroChapter } from "./_components/HeroChapter";
import { BridgeAnimation } from "./_components/BridgeAnimation";
import { LeversSection } from "./_components/LeversSection";
import { ProposalChapter } from "./_components/ProposalChapter";
import { HablamosChapter } from "./_components/HablamosChapter";

/**
 * Controller del modo cream coordinado entre cap.3 (J3lab) y cap.4
 * (Propuesta). Cuando el usuario "accede" plenamente al cap.4
 * (su top ya cruzó el 35% del viewport hacia arriba), tanto el cap.3
 * como el cap.4 cambian a cream con transition coordinada.
 * Se desactiva cuando el cap.5 (Hablamos) está a punto de entrar.
 */
function useCreamModeController() {
  useEffect(() => {
    const cap4 = document.querySelector(
      '[data-chapter="04"]',
    ) as HTMLElement | null;
    const cap5 = document.querySelector(
      '[data-chapter="05"]',
    ) as HTMLElement | null;
    if (!cap4) return;

    const html = document.documentElement;

    const update = () => {
      const r4 = cap4.getBoundingClientRect();
      const r5 = cap5?.getBoundingClientRect();
      const vh = window.innerHeight;
      const wasActive = html.classList.contains("tecnifibre-cream-mode");

      // HISTERESIS — usamos dos thresholds distintos para activar y
      // desactivar el cream-mode. Esto evita el flicker cuando el usuario
      // hace micro-scrolls (subir/bajar) cerca del borde de activación.
      // Activar:    cap.4 entró >35% del viewport (top < 35vh)
      // Desactivar: cap.4 salió >50% del viewport (top > 50vh)
      const enterThreshold = r4.top < vh * 0.35 && r4.bottom > vh * 0.4;
      const exitThreshold = r4.top > vh * 0.5 || r4.bottom < vh * 0.3;
      const cap5Active = r5 ? r5.top < vh * 0.55 : false;

      if (!wasActive) {
        // No activo — solo activamos si cruzamos el threshold de entrada
        // y el cap.5 no está activo todavía
        if (enterThreshold && !cap5Active) {
          html.classList.add("tecnifibre-cream-mode");
        }
      } else {
        // Activo — solo desactivamos si cruzamos el threshold de salida
        // (más alejado) o si el cap.5 ya está activo
        if (exitThreshold || cap5Active) {
          html.classList.remove("tecnifibre-cream-mode");
        }
      }
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      html.classList.remove("tecnifibre-cream-mode");
    };
  }, []);
}

export default function TecnifibrePage() {
  useCreamModeController();
  return (
    <main className="bg-[var(--bk)]">
      <HeroChapter />
      <BridgeAnimation />
      <LeversSection />
      <ProposalChapter />
      <HablamosChapter />
    </main>
  );
}
