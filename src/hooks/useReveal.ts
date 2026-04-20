"use client";

/* ──────────────────────────────────────────────
   useReveal + useStaggerReveal — hooks para animaciones de entrada
   basadas en IntersectionObserver. Usados por múltiples secciones
   de /academy, /sello, /clubes y otras.

   Ambos manejan el caso edge de "scroll recargado a mitad de página":
   si el elemento ya está por encima del viewport al mount, se revelan
   inmediatamente sin esperar a un scroll que no va a llegar.
   ────────────────────────────────────────────── */

import { useEffect, useRef, useState } from "react";

/** Reveal para un único elemento. Se marca `visible` cuando entra viewport. */
export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Si ya scrolleamos por debajo, reveal inmediato (ej: reload a mitad).
    const rect = el.getBoundingClientRect();
    if (rect.bottom < window.innerHeight) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Reveal para N items con stagger — cada uno tiene su propio IO. */
export function useStaggerReveal(count: number, threshold = 0.2) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(count).fill(false));
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    const alreadyVisible: number[] = [];
    itemRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) {
        alreadyVisible.push(i);
        return;
      }
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            setVisibleItems((prev) => {
              const n = [...prev];
              n[i] = true;
              return n;
            });
            io.disconnect();
          }
        },
        { threshold },
      );
      io.observe(el);
      observers.push(io);
    });
    if (alreadyVisible.length > 0) {
      setVisibleItems((prev) => {
        const n = [...prev];
        alreadyVisible.forEach((i) => {
          n[i] = true;
        });
        return n;
      });
    }
    return () => observers.forEach((io) => io.disconnect());
  }, [count, threshold]);

  return { containerRef, itemRefs, visibleItems };
}
