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
    let raf = 0;
    let pending = false;

    const compute = () => {
      pending = false;
      const r4 = cap4.getBoundingClientRect();
      const vh = window.innerHeight;
      const wasActive = html.classList.contains("tecnifibre-cream-mode");

      // ACTIVAR cream-mode: el cap.4 entra al viewport (top < 30vh, bottom > 50vh)
      const enterTop = r4.top < vh * 0.3 && r4.bottom > vh * 0.5;
      // DESACTIVAR cream-mode SOLO al volver al cap.3 (subir).
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

    // Throttle con rAF — scroll events disparan muchos por segundo.
    // Coalescemos a un solo cómputo por frame para no competir con
    // Lenis ni causar layout thrashing (que era el origen del flicker).
    const schedule = () => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
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
