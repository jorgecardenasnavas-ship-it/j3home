# Hero Orbital Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el hero estático por un carousel radial de 8 productos orbitando + claim PLAY/COACH/MANAGE que reacciona en vivo iluminando la palabra correspondiente a la audiencia del producto activo.

**Architecture:** Dos componentes nuevos (`HeroClaim`, `HeroOrbital`) + un hook (`useOrbital`) orquestados desde `HeroSection`. La data de productos se extrae a `src/data/home-products.ts` (compartida con `ProductsGrid`). El orbital tiene dos variantes renderizadas condicionalmente por CSS media queries: radial en desktop (arc SVG + cards posicionadas con trig), swipe horizontal en mobile. Timing y motion via CSS transitions + un único `setInterval` controlado por el hook.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, IntersectionObserver API, SVG inline.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `src/data/home-products.ts` | Shared product data with audience field |
| Modify | `src/components/ProductsGrid.tsx` | Import products from shared data (remove inline TILES) |
| Modify | `src/app/globals.css` | Orbital CSS (arc, cards, claim states, mobile, reduced-motion) |
| Create | `src/hooks/useOrbital.ts` | Rotation state + timer + hover pause + progress |
| Create | `src/components/HeroClaim.tsx` | PLAY/COACH/MANAGE dynamic claim |
| Create | `src/components/HeroOrbital.tsx` | Arc + cards + rotation (desktop) and swipe carousel (mobile) |
| Modify | `src/components/HeroSection.tsx` | Compose HeroClaim + HeroOrbital, shared state |

---

## Task 1: Extract product data to shared module

**Files:**
- Create: `src/data/home-products.ts`
- Modify: `src/components/ProductsGrid.tsx`

- [ ] **Step 1: Create `src/data/home-products.ts` with the full products array**

Write the file with this exact content:

```typescript
export type HomeProductAudience = "play" | "coach" | "manage";

export interface HomeProduct {
  id: string;
  nameParts: { text: string; gold: boolean }[];
  watermark: string;
  shortName: string;
  dark: boolean;
  featured: boolean;
  premiumBadge: boolean;
  href: string;
  isExternal: boolean;
  soon: boolean;
  fullWidth: boolean;
  asset: { type: "image" | "video"; src: string; poster?: string };
  audience: HomeProductAudience;
}

export const HOME_PRODUCTS: HomeProduct[] = [
  {
    id: "coach360",
    nameParts: [{ text: "Coach", gold: true }, { text: "\u00A0360", gold: false }],
    watermark: "C360",
    shortName: "Coach 360",
    dark: true,
    featured: true,
    premiumBadge: false,
    href: "https://j3padel.com/join",
    isExternal: true,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/empresas.jpeg" },
    audience: "coach",
  },
  {
    id: "training-camp",
    nameParts: [{ text: "Training", gold: true }, { text: "\u00A0Camp", gold: false }],
    watermark: "TC",
    shortName: "Training",
    dark: true,
    featured: true,
    premiumBadge: true,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/stage-group.jpeg" },
    audience: "play",
  },
  {
    id: "adults",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Adults", gold: false }],
    watermark: "ADT",
    shortName: "Adults",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/amateur.jpeg" },
    audience: "play",
  },
  {
    id: "juniors",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Juniors", gold: false }],
    watermark: "JNR",
    shortName: "Juniors",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/kids.jpeg" },
    audience: "play",
  },
  {
    id: "j3ptv",
    nameParts: [{ text: "J3P", gold: true }, { text: "TV", gold: false }],
    watermark: "TV",
    shortName: "J3PTV",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "video", src: "/videos/play_1080.webm" },
    audience: "play",
  },
  {
    id: "business-plan",
    nameParts: [{ text: "Business", gold: true }, { text: "\u00A0Plan", gold: false }],
    watermark: "BIZ",
    shortName: "Business",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/pro.jpeg" },
    audience: "manage",
  },
  {
    id: "experience",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Experience", gold: false }],
    watermark: "EXP",
    shortName: "Experience",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "video", src: "/videos/empresas-bg.mp4" },
    audience: "manage",
  },
  {
    id: "partner",
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Partner", gold: false }],
    watermark: "PTR",
    shortName: "Partner",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "image", src: "/images/j3/alquilavisual.jpg" },
    audience: "manage",
  },
];

// Orbital ring order: alternates audiences for maximum claim dynamism.
// Index 0 is the initial active. Rotation advances clockwise (next index).
export const ORBITAL_RING_ORDER: string[] = [
  "training-camp", // Play — initial active
  "coach360",      // Coach
  "adults",        // Play
  "business-plan", // Manage
  "juniors",       // Play
  "experience",    // Manage
  "j3ptv",         // Play
  "partner",       // Manage
];
```

- [ ] **Step 2: Refactor `src/components/ProductsGrid.tsx` to use shared data**

Read `src/components/ProductsGrid.tsx`. Replace the lines that define `interface TileConfig` and `const TILES: TileConfig[] = [...]` (near the top, around lines 6-116) with imports from the new module:

Find this block (the full TileConfig interface + TILES array):

```typescript
interface TileConfig {
  nameParts: { text: string; gold: boolean }[];
  // ... rest of interface
}

const TILES: TileConfig[] = [
  // ... 8 product objects
];
```

Replace with:

```typescript
import { HOME_PRODUCTS, type HomeProduct } from "@/data/home-products";

type TileConfig = HomeProduct;
const TILES: readonly TileConfig[] = HOME_PRODUCTS;
```

- [ ] **Step 3: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors. ProductsGrid should still render the same 8 products as before (same asset mapping, same everything) — just sourced from the new file.

- [ ] **Step 4: Commit**

```bash
git add src/data/home-products.ts src/components/ProductsGrid.tsx
git commit -m "refactor: extract home products data to shared module with audience field"
```

---

## Task 2: Add orbital CSS foundations

**Files:**
- Modify: `src/app/globals.css`

All CSS for the orbital (desktop + mobile + reduced-motion) goes in one pass so subsequent tasks only need to apply classnames.

- [ ] **Step 1: Insert the new CSS block after the existing `.hero-manifesto.in` rule (around line 623)**

Read `src/app/globals.css` to find the `.hero-manifesto.in` block. Insert the following CSS block immediately after it:

```css
/* ─── Hero Orbital — claim + radial cards (desktop) / swipe (mobile) ─── */

/* Claim word states */
.hero-claim-word {
  transition:
    opacity 500ms cubic-bezier(0.22, 1, 0.36, 1),
    color 500ms cubic-bezier(0.22, 1, 0.36, 1),
    -webkit-text-fill-color 500ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-claim-word.inactive {
  opacity: 0.35;
  /* stroke-only: outline effect via webkit text-stroke */
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.35);
}

/* Orbital container */
.hero-orbital {
  position: relative;
  width: 100%;
  height: 100%;
}

/* Arc line SVG (desktop) */
.hero-orbital-arc {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 800ms var(--ease-out);
}
.hero-orbital-arc.in {
  opacity: 1;
}
.hero-orbital-arc path {
  fill: none;
  stroke: rgba(220, 175, 100, 0.15);
  stroke-width: 1;
}
.hero-orbital-arc .hero-orbital-arc-progress {
  stroke: rgba(220, 175, 100, 0.85);
  stroke-width: 1.5;
  stroke-linecap: round;
  transition: none;
}

/* Active card */
.hero-orbital-active {
  position: absolute;
  width: 220px;
  height: 240px;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  background: #0a0a0b;
  border: 1px solid rgba(220, 175, 100, 0.35);
  border-radius: 2px;
  overflow: hidden;
  opacity: 0;
  transition:
    opacity 500ms var(--ease-out),
    transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hero-orbital-active.in {
  opacity: 1;
}
.hero-orbital-active-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.hero-orbital-active-bg > img,
.hero-orbital-active-bg > video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.32;
  filter: blur(20px);
  transition:
    opacity 1.2s var(--ease-out),
    filter 1.2s var(--ease-out);
}
.hero-orbital-active.in .hero-orbital-active-bg > img,
.hero-orbital-active.in .hero-orbital-active-bg > video {
  filter: blur(0);
}
.hero-orbital-active-content {
  position: relative;
  z-index: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 28px 24px;
}
.hero-orbital-active-title {
  font-size: clamp(28px, 3vw, 40px);
  font-weight: 900;
  letter-spacing: -1.5px;
  line-height: 1;
  text-transform: uppercase;
}
.hero-orbital-active-cta {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--g1);
  text-decoration: none;
  transition: gap 200ms var(--ease-out);
}
.hero-orbital-active-cta:hover {
  gap: 16px;
}

/* Small cards on the arc */
.hero-orbital-small {
  position: absolute;
  width: 60px;
  height: 80px;
  background: #0a0a0b;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  padding: 8px 6px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.9);
  transition:
    opacity 400ms var(--ease-out),
    transform 800ms cubic-bezier(0.22, 1, 0.36, 1),
    border-color 200ms var(--ease-out);
}
.hero-orbital-small.in {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.hero-orbital-small:hover,
.hero-orbital-small:focus-visible {
  transform: translate(-50%, -50%) scale(1.1);
  border-color: rgba(255, 255, 255, 0.4);
}
.hero-orbital-small.active-hidden {
  opacity: 0 !important;
  pointer-events: none;
  transform: translate(-50%, -50%) scale(0.7);
  transition:
    opacity 500ms var(--ease-out),
    transform 500ms var(--ease-out);
}
.hero-orbital-small-watermark {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: rgba(220, 175, 100, 0.45);
  text-transform: uppercase;
}
.hero-orbital-small-name {
  font-size: 8px;
  font-weight: 500;
  letter-spacing: 0.5px;
  color: rgba(255, 255, 255, 0.4);
  text-align: center;
  line-height: 1.2;
}

/* Hide desktop orbital on mobile */
@media (max-width: 960px) {
  .hero-orbital-desktop {
    display: none;
  }
}

/* Mobile swipe carousel */
.hero-orbital-mobile {
  display: none;
}
@media (max-width: 960px) {
  .hero-orbital-mobile {
    display: block;
    width: 100%;
  }
  .hero-orbital-mobile-track {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    padding: 0 16px;
    gap: 12px;
  }
  .hero-orbital-mobile-track::-webkit-scrollbar {
    display: none;
  }
  .hero-orbital-mobile-card {
    flex: 0 0 calc(100% - 32px);
    scroll-snap-align: center;
    height: 200px;
    background: #0a0a0b;
    border: 1px solid rgba(220, 175, 100, 0.25);
    border-radius: 2px;
    position: relative;
    overflow: hidden;
    padding: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .hero-orbital-mobile-card-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
  }
  .hero-orbital-mobile-card-bg > img,
  .hero-orbital-mobile-card-bg > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.28;
  }
  .hero-orbital-mobile-card > * {
    position: relative;
    z-index: 1;
  }
  .hero-orbital-mobile-card-title {
    font-size: clamp(22px, 6vw, 32px);
    font-weight: 900;
    letter-spacing: -1px;
    line-height: 1;
    text-transform: uppercase;
  }
  .hero-orbital-mobile-card-cta {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--g1);
    text-decoration: none;
  }
  .hero-orbital-mobile-dots {
    display: flex;
    justify-content: center;
    gap: 6px;
    margin-top: 16px;
  }
  .hero-orbital-mobile-dot {
    width: 6px;
    height: 6px;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.2);
    transition: background 300ms var(--ease-out);
  }
  .hero-orbital-mobile-dot.active {
    background: var(--g1);
  }
  /* First-load nudge hint */
  .hero-orbital-mobile-track.hint {
    animation: hero-orbital-nudge 600ms var(--ease-out) 800ms 1;
  }
  @keyframes hero-orbital-nudge {
    0%   { transform: translateX(0); }
    40%  { transform: translateX(-30px); }
    100% { transform: translateX(0); }
  }
}
```

- [ ] **Step 2: Extend the reduced-motion rule**

Find the `@media (prefers-reduced-motion: reduce)` block. Inside the second rule (around line 897-907), add new selectors to the opacity-reset list. Find this block:

```css
  .reveal-up,
  .reveal-scale,
  .impact-text,
  .pc-card,
  .sp-logo,
  .sponsor-logo,
  .sponsor-line,
  .tile-bg > img,
  .tile-bg > video,
  .footer-close-manifesto > div,
  .footer-close-tagline {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
```

Replace with (adds 3 new selectors):

```css
  .reveal-up,
  .reveal-scale,
  .impact-text,
  .pc-card,
  .sp-logo,
  .sponsor-logo,
  .sponsor-line,
  .tile-bg > img,
  .tile-bg > video,
  .footer-close-manifesto > div,
  .footer-close-tagline,
  .hero-orbital-active,
  .hero-orbital-small,
  .hero-orbital-arc {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
```

Then, inside the same media query, add these new rules AFTER the `.hero-curtain` rule (at the end of the block):

```css
  .hero-orbital-mobile-track.hint {
    animation: none !important;
  }
  .hero-orbital-arc-progress {
    stroke-dasharray: none !important;
  }
```

- [ ] **Step 3: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors (CSS doesn't affect typecheck, but confirms the project builds).

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add hero-orbital CSS foundations"
```

---

## Task 3: Create `useOrbital` hook

**Files:**
- Create: `src/hooks/useOrbital.ts`

- [ ] **Step 1: Create the hook file with exact content**

Write `src/hooks/useOrbital.ts`:

```typescript
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
```

- [ ] **Step 2: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useOrbital.ts
git commit -m "feat: create useOrbital hook (rotation state + timer + pause)"
```

---

## Task 4: Create `HeroClaim` component

**Files:**
- Create: `src/components/HeroClaim.tsx`

- [ ] **Step 1: Create the component file**

Write `src/components/HeroClaim.tsx`:

```typescript
"use client";

import type { HomeProductAudience } from "@/data/home-products";
import { useI18n } from "@/i18n/context";

interface HeroClaimProps {
  activeAudience: HomeProductAudience;
}

export function HeroClaim({ activeAudience }: HeroClaimProps) {
  const { t } = useI18n();

  return (
    <div className="pointer-events-none">
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          activeAudience === "play" ? "" : "inactive"
        }`}
      >
        {t.hero.play}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] text-[var(--wh)] ${
          activeAudience === "coach" ? "" : "inactive"
        }`}
      >
        {t.hero.coach}
      </span>
      <span
        className={`hero-claim-word hero-word block font-bold text-j3-hero uppercase tracking-[-3px] leading-[.88] j3-grad-text ${
          activeAudience === "manage" ? "" : "inactive"
        }`}
      >
        {t.hero.manage}
      </span>
    </div>
  );
}
```

Note: all three words use `j3-grad-text` or `text-[var(--wh)]` as their active color. The `.inactive` class (from Task 2 CSS) overrides with stroke-only.

- [ ] **Step 2: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroClaim.tsx
git commit -m "feat: create HeroClaim component (dynamic claim with active audience)"
```

---

## Task 5: Create `HeroOrbital` component

**Files:**
- Create: `src/components/HeroOrbital.tsx`

This is the biggest component. Desktop: radial arc with active card + 7 small cards. Mobile: horizontal swipe carousel with dots.

- [ ] **Step 1: Create the component file with full implementation**

Write `src/components/HeroOrbital.tsx`:

```typescript
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/i18n/context";
import {
  HOME_PRODUCTS,
  ORBITAL_RING_ORDER,
  type HomeProduct,
} from "@/data/home-products";
import { useOrbital } from "@/hooks/useOrbital";

interface HeroOrbitalProps {
  onActiveChange: (product: HomeProduct) => void;
}

// Build the ordered products array using ORBITAL_RING_ORDER.
const RING_PRODUCTS: HomeProduct[] = ORBITAL_RING_ORDER.map((id) => {
  const p = HOME_PRODUCTS.find((x) => x.id === id);
  if (!p) throw new Error(`ORBITAL_RING_ORDER references unknown id: ${id}`);
  return p;
});

// Desktop arc geometry:
// - Active slot: left side of the arc, vertically centered.
// - Small cards: 7 slots distributed on a semicircle opening to the left.
// The arc is rendered via SVG path. Small card positions are computed by trig.
const ARC_CENTER_X_PCT = 72; // % from left of container (i.e., ~28% from right)
const ARC_CENTER_Y_PCT = 50;
const ARC_RADIUS_PCT = 42; // % of container height (clamped)
const RING_SIZE = 8;

/**
 * Fixed positions for each product on the arc (one per product, 8 total).
 * Each product always renders at its fixed position; when active, its small
 * card hides via opacity (not reshuffling), so rotation feels anchored.
 */
function smallCardPositions(): { xPct: number; yPct: number }[] {
  const positions: { xPct: number; yPct: number }[] = [];
  const startDeg = -80;
  const endDeg = 80;
  const step = (endDeg - startDeg) / (RING_SIZE - 1);
  for (let i = 0; i < RING_SIZE; i++) {
    const angleDeg = startDeg + step * i;
    const angleRad = (angleDeg * Math.PI) / 180;
    const xPct = ARC_CENTER_X_PCT + (ARC_RADIUS_PCT * 1.5) * Math.cos(angleRad);
    const yPct = ARC_CENTER_Y_PCT + ARC_RADIUS_PCT * Math.sin(angleRad);
    positions.push({ xPct, yPct });
  }
  return positions;
}

const SMALL_POSITIONS = smallCardPositions();

export function HeroOrbital({ onActiveChange }: HeroOrbitalProps) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [entranceDone, setEntranceDone] = useState(false);
  const [hintPlayed, setHintPlayed] = useState(false);
  const mobileTrackRef = useRef<HTMLDivElement>(null);

  // Detect viewport
  useEffect(() => {
    const check = () => setIsMobile(window.matchMedia("(max-width: 960px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const { activeIndex, progress, goTo, pause, resume } = useOrbital({
    itemCount: RING_PRODUCTS.length,
    initialIndex: 0,
    intervalMs: 4000,
    autoAdvance: !isMobile,
  });

  const activeProduct = RING_PRODUCTS[activeIndex];

  // Notify parent when active changes — with a 200ms delay so the new card
  // appears visually before the claim reacts.
  useEffect(() => {
    const t = setTimeout(() => onActiveChange(activeProduct), 200);
    return () => clearTimeout(t);
  }, [activeProduct, onActiveChange]);

  // Entrance animation trigger
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Orbital entrance delayed to let claim words finish first.
            // Claim takes ~2.3s; orbital starts ~200ms after that.
            setTimeout(() => setEntranceDone(true), 2500);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  // Play hint nudge once on mobile after entrance
  useEffect(() => {
    if (!isMobile || !entranceDone || hintPlayed) return;
    const track = mobileTrackRef.current;
    if (!track) return;
    track.classList.add("hint");
    const t = setTimeout(() => {
      track.classList.remove("hint");
      setHintPlayed(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [isMobile, entranceDone, hintPlayed]);

  // Build stagger delays for small card entrance (120ms per card)
  const smallStaggerMs = (i: number) => 400 + i * 120;

  // Compute the NEXT index for the progress segment on the arc
  const nextIndex = (activeIndex + 1) % RING_PRODUCTS.length;

  // Arc SVG path — semicircle opening to the left
  const arcPath = useMemo(() => {
    // SVG viewport: 0..100 x 0..100 coordinate system
    // Start top, sweep to bottom, through the right side
    const cx = ARC_CENTER_X_PCT;
    const cy = ARC_CENTER_Y_PCT;
    const r = ARC_RADIUS_PCT * 1.5;
    const startX = cx + r * Math.cos((-80 * Math.PI) / 180);
    const startY = cy + r * Math.sin((-80 * Math.PI) / 180);
    const endX = cx + r * Math.cos((80 * Math.PI) / 180);
    const endY = cy + r * Math.sin((80 * Math.PI) / 180);
    return `M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`;
  }, []);

  // Handle click on a small card
  const handleSmallClick = (i: number) => {
    pause();
    goTo(i);
  };

  // Handle pointer leave from container to resume
  const handlePointerLeave = () => {
    setTimeout(resume, 2000);
  };

  return (
    <div
      ref={containerRef}
      className="hero-orbital"
      onPointerLeave={handlePointerLeave}
    >
      {/* Desktop version */}
      <div
        className="hero-orbital-desktop"
        style={{ position: "absolute", inset: 0 }}
      >
        {/* Arc SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className={`hero-orbital-arc ${entranceDone ? "in" : ""}`}
          aria-hidden="true"
        >
          <path d={arcPath} />
          {/* Progress indicator — a portion of the arc from active to next */}
          {entranceDone && !isMobile && (
            <path
              d={arcPath}
              pathLength={RING_PRODUCTS.length}
              strokeDasharray={`${progress} ${RING_PRODUCTS.length - progress}`}
              strokeDashoffset={-activeIndex}
              className="hero-orbital-arc-progress"
            />
          )}
        </svg>

        {/* Active card */}
        <div
          className={`hero-orbital-active ${entranceDone ? "in" : ""}`}
          role="region"
          aria-live="polite"
          aria-label={`Producto activo: ${activeProduct.shortName}`}
          onPointerEnter={pause}
        >
          <div className="hero-orbital-active-bg">
            {activeProduct.asset.type === "video" ? (
              <video
                key={activeProduct.id}
                src={activeProduct.asset.src}
                poster={activeProduct.asset.poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            ) : (
              <img
                key={activeProduct.id}
                src={activeProduct.asset.src}
                alt=""
                aria-hidden="true"
              />
            )}
          </div>
          <div className="hero-orbital-active-content">
            <div className="hero-orbital-active-title">
              {activeProduct.nameParts.map((part, i) => (
                <span
                  key={i}
                  className={part.gold ? "j3-grad-text" : "text-[var(--wh)]"}
                >
                  {part.text}
                </span>
              ))}
            </div>
            {activeProduct.soon ? (
              <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/25">
                {t.products.cards[HOME_PRODUCTS.indexOf(activeProduct)]?.cta ?? "Próximamente"}
              </span>
            ) : activeProduct.isExternal ? (
              <a
                href={activeProduct.href}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-orbital-active-cta"
              >
                {t.products.cards[HOME_PRODUCTS.indexOf(activeProduct)]?.cta ?? "Entrar"}
                <span className="text-[16px] font-light">→</span>
              </a>
            ) : (
              <Link href={activeProduct.href} className="hero-orbital-active-cta">
                {t.products.cards[HOME_PRODUCTS.indexOf(activeProduct)]?.cta ?? "Entrar"}
                <span className="text-[16px] font-light">→</span>
              </Link>
            )}
          </div>
        </div>

        {/* Small cards on the arc — 8 fixed positions, active one hides via opacity */}
        {RING_PRODUCTS.map((product, i) => {
          const pos = SMALL_POSITIONS[i];
          const isActive = i === activeIndex;
          return (
            <button
              key={product.id}
              type="button"
              className={`hero-orbital-small ${entranceDone ? "in" : ""} ${isActive ? "active-hidden" : ""}`}
              style={{
                left: `${pos.xPct}%`,
                top: `${pos.yPct}%`,
                transitionDelay: entranceDone ? "0ms" : `${smallStaggerMs(i)}ms`,
              }}
              aria-label={`${product.shortName}, audiencia ${product.audience}`}
              onClick={() => handleSmallClick(i)}
              onPointerEnter={pause}
              tabIndex={isActive ? -1 : 0}
            >
              <span className="hero-orbital-small-watermark">{product.watermark}</span>
              <span className="hero-orbital-small-name">{product.shortName}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile version */}
      <div className="hero-orbital-mobile">
        <div ref={mobileTrackRef} className="hero-orbital-mobile-track">
          {RING_PRODUCTS.map((product, i) => (
            <div key={product.id} className="hero-orbital-mobile-card">
              <div className="hero-orbital-mobile-card-bg">
                {product.asset.type === "video" ? (
                  <video
                    src={product.asset.src}
                    poster={product.asset.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                ) : (
                  <img src={product.asset.src} alt="" aria-hidden="true" loading="lazy" />
                )}
              </div>
              <div className="hero-orbital-mobile-card-title">
                {product.nameParts.map((part, j) => (
                  <span
                    key={j}
                    className={part.gold ? "j3-grad-text" : "text-[var(--wh)]"}
                  >
                    {part.text}
                  </span>
                ))}
              </div>
              {product.soon ? (
                <span className="text-[11px] font-bold tracking-[2px] uppercase text-white/30">
                  {t.products.cards[HOME_PRODUCTS.indexOf(product)]?.cta ?? "Próximamente"}
                </span>
              ) : product.isExternal ? (
                <a
                  href={product.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-orbital-mobile-card-cta"
                >
                  {t.products.cards[HOME_PRODUCTS.indexOf(product)]?.cta ?? "Entrar"}
                  <span className="text-[16px] font-light">→</span>
                </a>
              ) : (
                <Link href={product.href} className="hero-orbital-mobile-card-cta">
                  {t.products.cards[HOME_PRODUCTS.indexOf(product)]?.cta ?? "Entrar"}
                  <span className="text-[16px] font-light">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>
        <div
          className="hero-orbital-mobile-dots"
          role="tablist"
          aria-label="Productos"
        >
          {RING_PRODUCTS.map((product, i) => (
            <span
              key={product.id}
              className={`hero-orbital-mobile-dot ${i === activeIndex ? "active" : ""}`}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/HeroOrbital.tsx
git commit -m "feat: create HeroOrbital component (desktop radial + mobile swipe)"
```

---

## Task 6: Wire up HeroSection with orbital + dynamic claim

**Files:**
- Modify: `src/components/HeroSection.tsx`

- [ ] **Step 1: Rewrite `src/components/HeroSection.tsx`**

Replace the full contents of `src/components/HeroSection.tsx` with:

```typescript
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { HeroClaim } from "@/components/HeroClaim";
import { HeroOrbital } from "@/components/HeroOrbital";
import {
  HOME_PRODUCTS,
  type HomeProduct,
  type HomeProductAudience,
} from "@/data/home-products";

export function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  const [activeAudience, setActiveAudience] = useState<HomeProductAudience>(
    () => HOME_PRODUCTS.find((p) => p.id === "training-camp")?.audience ?? "play",
  );

  const handleActiveChange = useCallback((product: HomeProduct) => {
    setActiveAudience(product.audience);
  }, []);

  useEffect(() => {
    const section = heroRef.current;
    if (!section) return;

    const curtain = section.querySelector<HTMLElement>(".hero-curtain");
    const words = section.querySelectorAll<HTMLElement>(".hero-word");
    const shimmer = section.querySelector<HTMLElement>(".hero-shimmer");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            curtain?.classList.add("in");

            words.forEach((word, i) => {
              setTimeout(() => word.classList.add("in"), 900 + i * 500);
            });

            const wordsEnd = 900 + words.length * 500;
            setTimeout(() => shimmer?.classList.add("in"), wordsEnd + 300);

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="hero"
      ref={heroRef}
      className="h-[58vh] min-h-[460px] relative overflow-hidden flex flex-col justify-end max-[960px]:h-[65vh]"
    >
      {/* Background — solid black */}
      <div className="absolute inset-0 bg-black" />

      {/* Black curtain */}
      <div className="hero-curtain absolute inset-0 z-[4] bg-black pointer-events-none" />

      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--g1)]/20 to-transparent z-[5]" />

      {/* Golden shimmer sweep */}
      <div className="hero-shimmer absolute inset-0 z-[3] pointer-events-none opacity-0">
        <div className="hero-shimmer-bar absolute top-0 left-0 w-full h-full" />
      </div>

      {/* Content grid — claim left, orbital right (desktop) / stacked (mobile) */}
      <div className="relative z-[5] w-full h-full grid grid-cols-[45%_55%] max-[960px]:grid-cols-1 items-center px-12 max-[960px]:px-6">
        {/* Claim */}
        <div className="flex items-center max-[960px]:mb-4">
          <HeroClaim activeAudience={activeAudience} />
        </div>
        {/* Orbital */}
        <div className="relative h-full max-[960px]:h-auto">
          <HeroOrbital onActiveChange={handleActiveChange} />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000 and verify top-to-bottom:

1. **Hero entrance**: curtain lifts, PLAY / COACH / MANAGE stagger in (same as before). First word PLAY is illuminated (gold gradient), COACH and MANAGE show as outline at 35% opacity.
2. **Orbital entrance**: after the claim finishes (~2.5s), the arc draws, 7 small cards fade in with stagger, active card grows.
3. **Initial active**: Training Camp (Play audience), so PLAY stays illuminated.
4. **4s rotation (desktop)**: active shrinks to its slot on the arc, next card grows to active slot. 200ms later, the claim word updates. Arc progress fills gold between active and next.
5. **Hover on any card**: auto-advance pauses. Leave area: resumes after 2s.
6. **Click on small card**: direct swap to that card.
7. **Mobile (DevTools, width <960)**: hero stacks vertically. Claim on top, carousel below with one card full-width. Dots indicator. Swipe left/right to advance. First-load nudge.
8. **prefers-reduced-motion** (DevTools > Rendering): orbital frozen on first card. No rotation. Claim shows PLAY active only.

- [ ] **Step 4: Commit and push**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: wire HeroSection with HeroClaim + HeroOrbital + dynamic audience"
git push origin master
```
