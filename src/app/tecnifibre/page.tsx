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

      // HISTERESIS AGRESIVA — zona muerta amplia para evitar flicker en
      // scroll rápido up/down. Una vez activo, el cream-mode SE QUEDA hasta
      // que el cap.4 está claramente fuera (top > 70vh = casi todo el viewport
      // por encima) o el cap.5 ocupa más de 30vh del viewport.
      const enterTop = r4.top < vh * 0.3 && r4.bottom > vh * 0.5;
      const exitTop = r4.top > vh * 0.7 || r4.bottom < vh * 0.2;
      const cap5Dominant = r5 ? r5.top < vh * 0.4 : false;

      let shouldBeActive = wasActive;
      if (!wasActive && enterTop && !cap5Dominant) {
        shouldBeActive = true;
      } else if (wasActive && (exitTop || cap5Dominant)) {
        shouldBeActive = false;
      }

      // Guard — solo tocar el classList si el estado realmente cambia.
      // Evita re-trigger de las CSS transitions con cada scroll event.
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
