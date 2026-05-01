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

      // "Accedido" = el top del cap.4 ya cruzó el 35% del viewport hacia
      // arriba (estamos plenamente dentro, no solo asomándonos).
      const accessed = r4.top < vh * 0.35 && r4.bottom > vh * 0.4;

      // Cap.5 está entrando — desactivar cream-mode antes de salir del cap.4
      const cap5Coming = r5 ? r5.top < vh * 0.6 : false;

      if (accessed && !cap5Coming) {
        html.classList.add("tecnifibre-cream-mode");
      } else {
        html.classList.remove("tecnifibre-cream-mode");
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
