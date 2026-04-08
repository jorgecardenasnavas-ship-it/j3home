"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Global smooth-scroll wrapper.
 * Uses the official Lenis React binding with root mode so a single
 * Lenis instance controls <html> scrolling across the entire app.
 *
 * Tuning notes:
 *  - duration: 1.2 → balance between snappy and buttery
 *  - easing:   exponential ease-out, the canonical "premium" curve
 *  - smoothWheel: true → desktop wheel gets momentum
 *  - default touch behaviour is kept native (iOS already feels good)
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
