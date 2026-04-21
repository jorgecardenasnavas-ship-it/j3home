"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

type UseScrollScrubOptions = {
  framePathBuilder: (idx: number) => string;
  frameCount: number;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  sectionRef: RefObject<HTMLElement | null>;
  enabled: boolean;
  preloadTimeoutMs?: number;
};

type ScrubState = "idle" | "loading" | "ready" | "failed";

export function useScrollScrub({
  framePathBuilder,
  frameCount,
  canvasRef,
  sectionRef,
  enabled,
  preloadTimeoutMs = 8000,
}: UseScrollScrubOptions): ScrubState {
  const [state, setState] = useState<ScrubState>("idle");
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    setState("loading");

    imagesRef.current = [];
    let cancelled = false;
    let loadedCount = 0;

    const timeoutId = window.setTimeout(() => {
      if (loadedCount < frameCount && !cancelled) {
        cancelled = true;
        setState("failed");
      }
    }, preloadTimeoutMs);

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePathBuilder(i);
      img.onload = () => {
        if (cancelled) return;
        loadedCount++;
        if (loadedCount === frameCount) {
          window.clearTimeout(timeoutId);
          setState("ready");
        }
      };
      img.onerror = () => {
        if (cancelled) return;
        cancelled = true;
        window.clearTimeout(timeoutId);
        setState("failed");
      };
      imagesRef.current.push(img);
    }

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [enabled, frameCount, framePathBuilder, preloadTimeoutMs]);

  useEffect(() => {
    if (state !== "ready") return;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;

    let rafId = 0;
    let lastFrameIdx = -1;

    function resizeCanvas() {
      const rect = section!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawFrame(idx: number) {
      if (idx === lastFrameIdx) return;
      const img = images[idx];
      if (!img || !img.complete) return;
      const rect = section!.getBoundingClientRect();

      const canvasW = rect.width;
      const canvasH = rect.height;
      const imgW = img.naturalWidth;
      const imgH = img.naturalHeight;
      const canvasRatio = canvasW / canvasH;
      const imgRatio = imgW / imgH;

      let drawW: number, drawH: number, dx: number, dy: number;
      if (imgRatio > canvasRatio) {
        drawH = canvasH;
        drawW = canvasH * imgRatio;
        dx = (canvasW - drawW) / 2;
        dy = 0;
      } else {
        drawW = canvasW;
        drawH = canvasW / imgRatio;
        dx = 0;
        dy = (canvasH - drawH) / 2;
      }

      ctx!.clearRect(0, 0, canvasW, canvasH);
      ctx!.drawImage(img, dx, dy, drawW, drawH);
      lastFrameIdx = idx;
    }

    function update() {
      const y = window.scrollY;
      const max = window.innerHeight;
      const progress = Math.min(1, Math.max(0, y / max));
      const idx = Math.min(frameCount - 1, Math.floor(progress * (frameCount - 1)));
      drawFrame(idx);
      rafId = 0;
    }

    function onScroll() {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    }

    resizeCanvas();
    drawFrame(0);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [state, frameCount, canvasRef, sectionRef]);

  return state;
}
