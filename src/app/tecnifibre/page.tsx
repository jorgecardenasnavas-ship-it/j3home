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
    if (!cap4) return;

    const html = document.documentElement;

    const update = () => {
      const r4 = cap4.getBoundingClientRect();
      const vh = window.innerHeight;
      const wasActive = html.classList.contains("tecnifibre-cream-mode");

      // ACTIVAR cream-mode: el cap.4 entra al viewport (top < 30vh, bottom > 50vh)
      const enterTop = r4.top < vh * 0.3 && r4.bottom > vh * 0.5;

      // DESACTIVAR cream-mode SOLO al volver al cap.3 (subir).
      // No desactivar al entrar al cap.5 — el cap.4 se mantiene cream
      // detrás (no visible) y la transición a cap.5 verde es un cut directo.
      // Solo se quita cuando el cap.4 reaparece desde abajo del viewport
      // (estamos volviendo a scrollear hacia arriba al cap.3).
      const exitGoingUp = r4.top > vh * 0.7;

      let shouldBeActive = wasActive;
      if (!wasActive && enterTop) {
        shouldBeActive = true;
      } else if (wasActive && exitGoingUp) {
        shouldBeActive = false;
      }

      // Guard — solo tocar el classList si el estado realmente cambia.
      if (shouldBeActive !== wasActive) {
        if (shouldBeActive) {
          html.classList.add("tecnifibre-cream-mode");
        } else {
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
