"use client";

import { useEffect, useRef } from "react";

const CLIPS = [
  { src: "/videos/j3-brand-evolution.mp4", start: 1 },
  { src: "/videos/coach360-higueron.mp4", start: 3 },
  { src: "/videos/play_1080.webm", start: 0 },
  { src: "/videos/jmd-higueron.mp4", start: 5 },
  { src: "/videos/empresas-bg.mp4", start: 4 },
];

const CLIP_DURATION_MS = 2200;
const FADE_MS = 500;

export function HeroVideoMontage() {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const activeSlot = useRef<0 | 1>(0);
  const clipIdx = useRef(0);

  useEffect(() => {
    const vA = refA.current;
    const vB = refB.current;
    if (!vA || !vB) return;

    const slots = [vA, vB];
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;

    const prepareVideo = (video: HTMLVideoElement, index: number): Promise<void> =>
      new Promise((resolve) => {
        const { src, start } = CLIPS[index % CLIPS.length];
        const onReady = () => {
          video.currentTime = start;
          video.removeEventListener("canplay", onReady);
          resolve();
        };
        video.addEventListener("canplay", onReady);
        video.src = src;
        video.load();
      });

    const advance = async () => {
      if (!alive) return;
      const current = activeSlot.current;
      const next = (1 - current) as 0 | 1;
      const nextIdx = (clipIdx.current + 1) % CLIPS.length;

      await prepareVideo(slots[next], nextIdx);
      if (!alive) return;

      slots[next].play().catch(() => {});
      slots[next].style.opacity = "1";
      slots[current].style.opacity = "0";

      activeSlot.current = next;
      clipIdx.current = nextIdx;

      timer = setTimeout(advance, CLIP_DURATION_MS);
    };

    prepareVideo(vA, 0).then(() => {
      if (!alive) return;
      vA.play().catch(() => {});
      vA.style.opacity = "1";
      timer = setTimeout(advance, CLIP_DURATION_MS);
    });

    return () => {
      alive = false;
      clearTimeout(timer);
      slots.forEach((v) => v.pause());
    };
  }, []);

  const base: React.CSSProperties = {
    transition: `opacity ${FADE_MS}ms ease-in-out`,
    opacity: 0,
  };

  return (
    <>
      <video
        ref={refA}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        style={base}
      />
      <video
        ref={refB}
        className="absolute inset-0 w-full h-full object-cover"
        muted
        playsInline
        style={base}
      />
    </>
  );
}
