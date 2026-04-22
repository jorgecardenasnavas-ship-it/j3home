"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type UseOrbitalOptions = {
  itemCount: number;
  initialIndex?: number;
  intervalMs?: number;
  autoAdvance: boolean;
};

type UseOrbitalReturn = {
  activeIndex: number;
  progress: number;
  goTo: (idx: number) => void;
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
};

export function useOrbital({
  itemCount,
  initialIndex = 0,
  intervalMs = 4000,
  autoAdvance,
}: UseOrbitalOptions): UseOrbitalReturn {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number>(0);

  const pause = useCallback(() => setIsPaused(true), []);
  const resume = useCallback(() => setIsPaused(false), []);

  const goTo = useCallback(
    (idx: number) => {
      const bounded = ((idx % itemCount) + itemCount) % itemCount;
      setActiveIndex(bounded);
      startTimeRef.current = null;
      pausedAtRef.current = 0;
      setProgress(0);
    },
    [itemCount],
  );

  useEffect(() => {
    if (!autoAdvance) return;
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    if (isPaused) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      pausedAtRef.current = progress;
      return;
    }

    const tick = (now: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = now - pausedAtRef.current * intervalMs;
      }
      const elapsed = now - startTimeRef.current;
      const p = Math.min(1, elapsed / intervalMs);
      setProgress(p);

      if (p >= 1) {
        setActiveIndex((i) => (i + 1) % itemCount);
        startTimeRef.current = null;
        pausedAtRef.current = 0;
        setProgress(0);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPaused, autoAdvance, intervalMs, itemCount, progress]);

  return { activeIndex, progress, goTo, pause, resume, isPaused };
}
