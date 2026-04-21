# Home Cadencia Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Subir la home al nivel editorial cinematográfico añadiendo scroll scrubbing al hero, respiración entre secciones, parallax reveal (blur-into-focus) en tiles, signature overflow en Coach360 y cierre cinemático antes del footer.

**Architecture:** El movimiento nuevo se añade como capas sobre la estructura existente sin romperla. Dos componentes nuevos (`CatalogIntro`, `FooterClose`), un hook nuevo (`useScrollScrub`), mejoras puntuales en `Navbar`, `HeroSection`, `SponsorsBanner`, `ProductsGrid`, `globals.css`. El hero scrubbing usa un `<canvas>` superpuesto con 193 frames precargados. Todo movimiento respeta `prefers-reduced-motion` y tiene fallback en mobile.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript strict, Tailwind CSS v4, Canvas 2D API, IntersectionObserver API.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `src/i18n/dictionaries/types.ts` | Add `home.catalogIntro` type |
| Modify | `src/i18n/dictionaries/{es,en,fr,sv,pt}.ts` | Add `home.catalogIntro.label` values |
| Modify | `src/app/globals.css` | Add `.tile-bg`, `.catalog-intro-*`, `.footer-close-*`, `.navbar-scrolled`, reduced-motion rules |
| Modify | `src/components/Navbar.tsx` | Toggle `.navbar-scrolled` class when `scrollY > 90vh` |
| Create | `src/hooks/useScrollScrub.ts` | Preload 193 frames + canvas scrubbing |
| Modify | `src/components/HeroSection.tsx` | Integrate `useScrollScrub` with canvas overlay post-entrada |
| Modify | `src/components/SponsorsBanner.tsx` | Add `mt-[20vh]` for breathing space |
| Create | `src/components/CatalogIntro.tsx` | "08 / productos" numeral intro |
| Create | `src/components/FooterClose.tsx` | Tagline + scroll-drawn gold line |
| Modify | `src/components/ProductsGrid.tsx` | Add `.tile-bg` per tile + Coach360 overflow exception |
| Modify | `src/app/page.tsx` | Insert `<CatalogIntro />` and `<FooterClose />` |

---

## Task 1: i18n — add `home.catalogIntro.label`

**Files:**
- Modify: `src/i18n/dictionaries/types.ts`
- Modify: `src/i18n/dictionaries/es.ts`, `en.ts`, `fr.ts`, `sv.ts`, `pt.ts`

- [ ] **Step 1: Update the `home` type in `types.ts`**

Read `src/i18n/dictionaries/types.ts` and find the `home` block (around line 58-62). Replace:

```typescript
  home: {
    line1: string;
    line2: string;
    closer: string;
  };
```

With:

```typescript
  home: {
    line1: string;
    line2: string;
    closer: string;
    catalogIntro: {
      label: string;
    };
  };
```

- [ ] **Step 2: Run typecheck — expect 5 errors in language files**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck 2>&1 | grep "catalogIntro"
```

Expected: 5 errors saying `catalogIntro` is missing from `home` in es.ts, en.ts, fr.ts, sv.ts, pt.ts.

- [ ] **Step 3: Update `es.ts` — find the `home:` block and add `catalogIntro`**

Open `src/i18n/dictionaries/es.ts`, find the `home:` object. After the `closer:` line (keeping the closing brace), add:

```typescript
    catalogIntro: {
      label: "productos",
    },
```

- [ ] **Step 4: Update `en.ts`**

Same change — inside `home:`:

```typescript
    catalogIntro: {
      label: "products",
    },
```

- [ ] **Step 5: Update `fr.ts`**

```typescript
    catalogIntro: {
      label: "produits",
    },
```

- [ ] **Step 6: Update `sv.ts`**

```typescript
    catalogIntro: {
      label: "produkter",
    },
```

- [ ] **Step 7: Update `pt.ts`**

```typescript
    catalogIntro: {
      label: "produtos",
    },
```

- [ ] **Step 8: Run typecheck — should be clean**

```bash
npm run typecheck 2>&1 | grep "catalogIntro"
```

Expected: no output (no errors about `catalogIntro`).

- [ ] **Step 9: Commit**

```bash
git add src/i18n/dictionaries/
git commit -m "i18n: add home.catalogIntro.label for CatalogIntro component"
```

---

## Task 2: Add new CSS to globals.css

**Files:**
- Modify: `src/app/globals.css`

All CSS foundations for the new components and behaviors go in one edit. This way subsequent tasks only need to apply classnames.

- [ ] **Step 1: Insert the new CSS block after the existing `.hero-manifesto.in` block (around line 623)**

Open `src/app/globals.css` and find the `.hero-manifesto.in` block. After its closing `}` (around line 623), insert:

```css
/* ─── Navbar scrolled — blur + dark background when off-hero ─── */
.navbar-scrolled {
  background-color: rgba(0, 0, 0, 0.72) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: rgba(212, 169, 74, 0.08) !important;
}

/* ─── Tile background — blur-into-focus on reveal ─── */
.tile-bg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
.tile-bg > img,
.tile-bg > video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.15;
  filter: blur(20px);
  transition:
    opacity 1.8s var(--ease-out),
    filter 1.8s var(--ease-out),
    transform 0.6s var(--ease-out);
  will-change: filter, opacity, transform;
}
.pc-card.in .tile-bg > img,
.pc-card.in .tile-bg > video {
  opacity: 0.22;
  filter: blur(0);
}
@media (hover: hover) and (min-width: 961px) {
  .pc-card:hover .tile-bg > img,
  .pc-card:hover .tile-bg > video {
    opacity: 0.32;
    transform: scale(1.04);
  }
}

/* Coach360 signature overflow — flagship tile only */
.pc-card[data-flagship="true"] {
  overflow: visible !important;
}
.pc-card[data-flagship="true"] .tile-bg {
  inset: -8%;
}

/* ─── CatalogIntro — numeral 08 + label ─── */
.catalog-intro {
  height: 50vh;
  min-height: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: #000;
}
@media (max-width: 960px) {
  .catalog-intro {
    height: 35vh;
    min-height: 200px;
  }
}
.catalog-intro-label {
  font-size: 10px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.3);
  opacity: 0;
  transform: translateY(10px);
  transition:
    opacity 0.8s var(--ease-out),
    transform 0.8s var(--ease-out);
}
.catalog-intro-label.in {
  opacity: 1;
  transform: translateY(0);
}
.catalog-intro-number {
  font-size: clamp(120px, 16vw, 240px);
  font-weight: 200;
  letter-spacing: -8px;
  line-height: 1;
  background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 45%, #b8943e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 1.2s var(--ease-out),
    transform 1.2s var(--ease-out);
  transition-delay: 200ms;
}
.catalog-intro-number.in {
  opacity: 1;
  transform: translateY(0);
}
@media (max-width: 960px) {
  .catalog-intro-number {
    font-size: clamp(80px, 20vw, 160px);
    letter-spacing: -5px;
  }
}

/* ─── FooterClose — tagline + gold line scroll-drawn ─── */
.footer-close {
  padding-block: 18vh;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
@media (max-width: 960px) {
  .footer-close {
    padding-block: 12vh;
    gap: 28px;
  }
}
.footer-close-tagline {
  font-size: clamp(40px, 5vw, 72px);
  font-weight: 900;
  letter-spacing: -1px;
  line-height: 1.05;
  text-align: center;
  background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 45%, #b8943e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
@media (max-width: 960px) {
  .footer-close-tagline {
    font-size: clamp(32px, 7vw, 52px);
  }
}
.footer-close-line {
  height: 1px;
  width: 0;
  max-width: 60%;
  background: linear-gradient(90deg, transparent, var(--g1), transparent);
  transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1);
}
.footer-close-line.in {
  width: 60%;
}
@media (max-width: 960px) {
  .footer-close-line {
    max-width: 80%;
  }
  .footer-close-line.in {
    width: 80%;
  }
}

/* ─── Hero scroll-scrub canvas ─── */
.hero-scrub-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.8s var(--ease-out);
  z-index: 1;
  pointer-events: none;
}
.hero-scrub-canvas.active {
  opacity: 1;
}
```

- [ ] **Step 2: Extend the reduced-motion block**

Find the `@media (prefers-reduced-motion: reduce)` block (around line 782). Inside its second nested rule (the one listing `.reveal-up, .reveal-scale, ...` selectors — around line 795-805), add four new selectors to the existing list:

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
  .catalog-intro-label,
  .catalog-intro-number {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
```

Then immediately below that rule, add a new rule for footer close and canvas:

```css
  .footer-close-line {
    width: 60% !important;
    transition: none !important;
  }

  .hero-scrub-canvas {
    display: none !important;
  }
```

- [ ] **Step 3: Run typecheck (sanity, even though CSS doesn't affect it)**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css
git commit -m "style: add home-cadencia CSS foundations"
```

---

## Task 3: Navbar — toggle `navbar-scrolled` class off-hero

**Files:**
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Read the existing scroll logic**

In `src/components/Navbar.tsx`, find the existing `useEffect` with `handleScroll` (around lines 66-73). Currently it sets `scrolled` when `scrollY > 10`.

We keep `scrolled` as-is (it controls the existing border/shadow) and add a second state `offHero` that triggers when `scrollY > 90vh`.

- [ ] **Step 2: Add `offHero` state**

Find the line `const [scrolled, setScrolled] = useState(false);` (around line 56) and add below it:

```typescript
  const [offHero, setOffHero] = useState(false);
```

- [ ] **Step 3: Update the scroll effect**

Replace the existing `useEffect` scroll block (around lines 66-73) with:

```typescript
  useEffect(() => {
    function handleScroll() {
      const y = window.scrollY;
      setScrolled(y > 10);
      setOffHero(y > window.innerHeight * 0.9);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
```

- [ ] **Step 4: Add `navbar-scrolled` class conditionally**

Find the `<nav>` element (around line 102). Its `className` currently uses a template with `scrolled ?` ternary. Add `${offHero ? "navbar-scrolled" : ""}` to the class list. The full replacement — find this exact block:

```tsx
      <nav
        className={`fixed top-0 left-0 right-0 z-[110] h-[52px] flex items-center justify-between px-12 max-[960px]:px-6 border-b transition-all duration-500 ${
          scrolled
            ? "border-white/[.07] shadow-[0_1px_20px_rgba(0,0,0,.5)]"
            : "border-white/[.04]"
        }`}
        style={{ backgroundColor: "#0a0a0b" }}
      >
```

Replace with:

```tsx
      <nav
        className={`fixed top-0 left-0 right-0 z-[110] h-[52px] flex items-center justify-between px-12 max-[960px]:px-6 border-b transition-all duration-500 ${
          scrolled
            ? "border-white/[.07] shadow-[0_1px_20px_rgba(0,0,0,.5)]"
            : "border-white/[.04]"
        } ${offHero ? "navbar-scrolled" : ""}`}
        style={{ backgroundColor: offHero ? "transparent" : "#0a0a0b" }}
      >
```

(The `backgroundColor` becomes transparent when off-hero so the `.navbar-scrolled` class's `rgba(0,0,0,0.72)` shows through with its blur.)

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: navbar gains blur background when scrolled past hero"
```

---

## Task 4: Create `useScrollScrub` hook

**Files:**
- Create: `src/hooks/useScrollScrub.ts`

The hook preloads a sequence of frames and maps `scrollY` to a frame index, rendering the current frame on a canvas. Used by the HeroSection.

- [ ] **Step 1: Create the file**

Write `src/hooks/useScrollScrub.ts` with this exact content:

```typescript
"use client";

import { useEffect, useState, type RefObject } from "react";

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

  useEffect(() => {
    if (!enabled) return;
    if (typeof window === "undefined") return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    setState("loading");

    const images: HTMLImageElement[] = [];
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
      images.push(img);
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

    const images: HTMLImageElement[] = [];
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = framePathBuilder(i);
      images.push(img);
    }

    let rafId = 0;
    let lastFrameIdx = -1;

    function resizeCanvas() {
      const rect = section!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      canvas!.style.width = `${rect.width}px`;
      canvas!.style.height = `${rect.height}px`;
      ctx!.scale(dpr, dpr);
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
  }, [state, frameCount, framePathBuilder, canvasRef, sectionRef]);

  return state;
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors in the new file.

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useScrollScrub.ts
git commit -m "feat: create useScrollScrub hook for canvas frame scrubbing"
```

---

## Task 5: HeroSection — integrate scroll scrubbing

**Files:**
- Modify: `src/components/HeroSection.tsx`

The hero keeps its current cinematic entrance. After the entrance completes, if we're on desktop and the 193 frames are preloaded, a canvas overlay takes over with scroll-synced scrubbing.

- [ ] **Step 1: Add imports and refs**

At the top of `src/components/HeroSection.tsx`, update the React import and add the hook import:

```typescript
"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";
import { useScrollScrub } from "@/hooks/useScrollScrub";
```

- [ ] **Step 2: Add canvas ref and enablement state inside the component**

Inside `HeroSection`, replace the existing `const heroRef = useRef<HTMLElement>(null);` with:

```typescript
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [entranceDone, setEntranceDone] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
```

- [ ] **Step 3: Detect desktop viewport once**

Add this `useEffect` immediately below the refs/state (before the existing animation `useEffect`):

```typescript
  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia("(min-width: 961px)").matches);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
```

- [ ] **Step 4: Mark entrance as done after the last setTimeout**

In the existing animation `useEffect` (the one with the `IntersectionObserver` at around lines 10-44), find the line:

```typescript
            setTimeout(() => manifesto?.classList.add("in"), wordsEnd + 900);
```

Immediately after it, add:

```typescript
            setTimeout(() => setEntranceDone(true), wordsEnd + 1400);
```

The full IntersectionObserver callback becomes:

```typescript
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            curtain?.classList.add("in");
            setTimeout(() => video?.classList.add("in"), 600);

            words.forEach((word, i) => {
              setTimeout(() => word.classList.add("in"), 900 + i * 500);
            });

            const wordsEnd = 900 + words.length * 500;
            setTimeout(() => shimmer?.classList.add("in"), wordsEnd + 300);
            setTimeout(() => manifesto?.classList.add("in"), wordsEnd + 900);
            setTimeout(() => setEntranceDone(true), wordsEnd + 1400);

            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );
```

- [ ] **Step 5: Call the hook inside the component**

After the desktop-detection `useEffect` and before the `return`, add:

```typescript
  const scrubState = useScrollScrub({
    framePathBuilder: (i) => `/videos/frames/f${String(i + 1).padStart(3, "0")}.jpg`,
    frameCount: 193,
    canvasRef,
    sectionRef: heroRef,
    enabled: entranceDone && isDesktop,
  });
```

- [ ] **Step 6: Add the canvas element at the start of the `<section>` children**

Find the existing JSX `<section ...>` opening (around line 48). Just after the opening `<section>` tag, before `{/* Background — solid black (video removed) */}`, insert:

```tsx
        {/* Scroll-scrub canvas — only active post-entrance on desktop, when frames loaded */}
        <canvas
          ref={canvasRef}
          className={`hero-scrub-canvas ${scrubState === "ready" ? "active" : ""}`}
          aria-hidden="true"
        />
```

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors in HeroSection.tsx.

- [ ] **Step 8: Commit**

```bash
git add src/components/HeroSection.tsx
git commit -m "feat: HeroSection gains canvas scroll-scrub after entrance"
```

---

## Task 6: SponsorsBanner — add breathing space

**Files:**
- Modify: `src/components/SponsorsBanner.tsx`

The banner already has stagger reveal (`.sp-logo.in`). We only need to push it down with margin to create black breath between hero and logos.

- [ ] **Step 1: Add margin-top to the banner container**

In `src/components/SponsorsBanner.tsx`, find the root `<div>` (around line 38). Its `className` currently is:

```
bg-white w-full py-10 max-[960px]:py-6 px-14 max-[960px]:px-6 flex flex-col items-center justify-center border-t border-black/[.06] overflow-hidden z-10
```

Add `mt-[20vh] max-[960px]:mt-[12vh]` at the start of the class list:

```tsx
    <div
      id="partners"
      ref={bannerRef}
      className="mt-[20vh] max-[960px]:mt-[12vh] bg-white w-full py-10 max-[960px]:py-6 px-14 max-[960px]:px-6 flex flex-col items-center justify-center border-t border-black/[.06] overflow-hidden z-10"
    >
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/SponsorsBanner.tsx
git commit -m "style: add breathing space above SponsorsBanner"
```

---

## Task 7: Create `CatalogIntro` component

**Files:**
- Create: `src/components/CatalogIntro.tsx`

- [ ] **Step 1: Create the component file with exact content**

Write `src/components/CatalogIntro.tsx`:

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function CatalogIntro() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const label = section.querySelector<HTMLElement>(".catalog-intro-label");
    const number = section.querySelector<HTMLElement>(".catalog-intro-number");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            label?.classList.add("in");
            number?.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="catalog-intro" aria-hidden="true">
      <span className="catalog-intro-label">{t.home.catalogIntro.label}</span>
      <div className="catalog-intro-number">08</div>
    </section>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/CatalogIntro.tsx
git commit -m "feat: create CatalogIntro component (08 numeral intro)"
```

---

## Task 8: Create `FooterClose` component

**Files:**
- Create: `src/components/FooterClose.tsx`

- [ ] **Step 1: Create the component file with exact content**

Write `src/components/FooterClose.tsx`:

```typescript
"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/i18n/context";

export function FooterClose() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const line = section.querySelector<HTMLElement>(".footer-close-line");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            line?.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="footer-close">
      <h2 className="footer-close-tagline">{t.home.closer}</h2>
      <div className="footer-close-line" aria-hidden="true" />
    </section>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/FooterClose.tsx
git commit -m "feat: create FooterClose component (tagline + gold line)"
```

---

## Task 9: ProductsGrid — add `.tile-bg` with assets and Coach360 overflow

**Files:**
- Modify: `src/components/ProductsGrid.tsx`

Add a `tile-bg` element inside each tile's card div. Its contents (img or video) depend on the tile's asset mapping. The Coach360 tile gets a `data-flagship="true"` attribute that activates the overflow CSS.

- [ ] **Step 1: Extend the `TileConfig` interface and add `asset` to each tile**

In `src/components/ProductsGrid.tsx`, find the `interface TileConfig { ... }` block (near the top of the file). Add a new field `asset`:

```typescript
interface TileConfig {
  nameParts: { text: string; gold: boolean }[];
  watermark: string;
  dark: boolean;
  featured: boolean;
  premiumBadge: boolean;
  href: string;
  isExternal: boolean;
  soon: boolean;
  fullWidth: boolean;
  asset: { type: "image" | "video"; src: string; poster?: string };
}
```

- [ ] **Step 2: Add `asset` to each of the 8 tiles in the `TILES` array**

Find the `TILES: TileConfig[] = [ ... ]` array. For each tile, add an `asset` field. Keep all existing fields. The final TILES array looks like:

```typescript
const TILES: TileConfig[] = [
  {
    nameParts: [{ text: "Coach", gold: true }, { text: "\u00A0360", gold: false }],
    watermark: "C360",
    dark: true,
    featured: true,
    premiumBadge: false,
    href: "https://j3padel.com/join",
    isExternal: true,
    soon: false,
    fullWidth: false,
    asset: { type: "video", src: "/videos/empresas-bg.mp4", poster: "/images/academy/empresas.jpeg" },
  },
  {
    nameParts: [{ text: "Training", gold: true }, { text: "\u00A0Camp", gold: false }],
    watermark: "TC",
    dark: true,
    featured: true,
    premiumBadge: true,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/pro.jpeg" },
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Adults", gold: false }],
    watermark: "ADT",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/amateur.jpeg" },
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Juniors", gold: false }],
    watermark: "JNR",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "/academy",
    isExternal: false,
    soon: false,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/kids.jpeg" },
  },
  {
    nameParts: [{ text: "J3P", gold: true }, { text: "TV", gold: false }],
    watermark: "TV",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "video", src: "/videos/play_1080.webm" },
  },
  {
    nameParts: [{ text: "Business", gold: true }, { text: "\u00A0Plan", gold: false }],
    watermark: "BIZ",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: false,
    asset: { type: "image", src: "/images/academy/stage-group.jpeg" },
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Experience", gold: false }],
    watermark: "EXP",
    dark: true,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "video", src: "/videos/j3-brand-evolution.mp4" },
  },
  {
    nameParts: [{ text: "J3\u00A0", gold: true }, { text: "Partner", gold: false }],
    watermark: "PTR",
    dark: false,
    featured: false,
    premiumBadge: false,
    href: "#",
    isExternal: false,
    soon: true,
    fullWidth: true,
    asset: { type: "image", src: "/images/j3/alquilavisual.jpg" },
  },
];
```

- [ ] **Step 3: Create a TileBackground helper inside the component file**

At the top of `src/components/ProductsGrid.tsx`, after the `TILES` const and before the `ProductsGrid` function, add:

```typescript
function TileBackground({ asset }: { asset: TileConfig["asset"] }) {
  if (asset.type === "video") {
    return (
      <div className="tile-bg">
        <video
          src={asset.src}
          poster={asset.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      </div>
    );
  }
  return (
    <div className="tile-bg">
      <img src={asset.src} alt="" aria-hidden="true" />
    </div>
  );
}
```

- [ ] **Step 4: Inject `<TileBackground>` and flagship attribute inside each return branch**

The component has two return branches inside the `.map()` — one for `fullWidth` tiles and one for standard tiles. In both, we:
1. Add `data-flagship={idx === 0 ? "true" : undefined}` to the inner `<div>` (Coach360 is idx 0)
2. Render `<TileBackground asset={tile.asset} />` as the FIRST child of that inner `<div>`, before `pc-glow`

Find this fullWidth branch block (around lines 285-308):

```tsx
        if (tile.fullWidth) {
          return (
            <React.Fragment key={tile.watermark}>
              <div
                data-idx={idx}
                className={`pc-card group relative overflow-hidden col-span-2 max-[960px]:col-span-1 border-t border-white/[.06] transition-all duration-300 ${
                  isDark ? "bg-black hover:bg-[rgba(220,175,100,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
                }`}
              >
                <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
                {topAccent}
                {watermark}
                <div className="relative z-10 flex items-center justify-between gap-16 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-6 py-14 px-12 max-[960px]:py-12 max-[960px]:px-8">
                  <div>
                    {tagLine}
                    {productName}
                    {forLabel}
                  </div>
                  <div className="shrink-0">{ctaEl}</div>
                </div>
              </div>
              {divider}
            </React.Fragment>
          );
        }
```

Replace with:

```tsx
        if (tile.fullWidth) {
          return (
            <React.Fragment key={tile.watermark}>
              <div
                data-idx={idx}
                data-flagship={idx === 0 ? "true" : undefined}
                className={`pc-card group relative overflow-hidden col-span-2 max-[960px]:col-span-1 border-t border-white/[.06] transition-all duration-300 ${
                  isDark ? "bg-black hover:bg-[rgba(220,175,100,.02)]" : "bg-[#f5f5f7] hover:bg-[#efefef]"
                }`}
              >
                <TileBackground asset={tile.asset} />
                <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
                {topAccent}
                {watermark}
                <div className="relative z-10 flex items-center justify-between gap-16 max-[960px]:flex-col max-[960px]:items-start max-[960px]:gap-6 py-14 px-12 max-[960px]:py-12 max-[960px]:px-8">
                  <div>
                    {tagLine}
                    {productName}
                    {forLabel}
                  </div>
                  <div className="shrink-0">{ctaEl}</div>
                </div>
              </div>
              {divider}
            </React.Fragment>
          );
        }
```

- [ ] **Step 5: Same change for the standard return branch**

Find the standard-tile return branch (the last `return (...)` in the map, around lines 311-345):

```tsx
        return (
          <React.Fragment key={tile.watermark}>
            <div
              data-idx={idx}
              className={`pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 ${
                tile.featured
                  ? isDark
                    ? "bg-[rgba(220,175,100,.04)] hover:bg-[rgba(220,175,100,.06)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
                  : isDark
                    ? "bg-black hover:bg-[rgba(220,175,100,.02)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
              } ${
                idx % 2 === 0
                  ? "border-r border-r-white/[.06] max-[960px]:border-r-0"
                  : ""
              }`}
            >
              <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
              {topAccent}
              {watermark}
              <div className="relative z-10 flex flex-col justify-between min-h-[280px] max-[960px]:min-h-0 py-14 px-10 max-[960px]:py-12 max-[960px]:px-8">
                <div>
                  {tagLine}
                  {productName}
                  {forLabel}
                </div>
                <div className="mt-8 max-[960px]:mt-6">{ctaEl}</div>
              </div>
            </div>
            {divider}
          </React.Fragment>
        );
```

Replace with:

```tsx
        return (
          <React.Fragment key={tile.watermark}>
            <div
              data-idx={idx}
              data-flagship={idx === 0 ? "true" : undefined}
              className={`pc-card group relative overflow-hidden border-t border-white/[.06] transition-all duration-300 ${
                tile.featured
                  ? isDark
                    ? "bg-[rgba(220,175,100,.04)] hover:bg-[rgba(220,175,100,.06)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
                  : isDark
                    ? "bg-black hover:bg-[rgba(220,175,100,.02)]"
                    : "bg-[#f5f5f7] hover:bg-[#efefef]"
              } ${
                idx % 2 === 0
                  ? "border-r border-r-white/[.06] max-[960px]:border-r-0"
                  : ""
              }`}
            >
              <TileBackground asset={tile.asset} />
              <div className="pc-glow absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-500 z-0" />
              {topAccent}
              {watermark}
              <div className="relative z-10 flex flex-col justify-between min-h-[280px] max-[960px]:min-h-0 py-14 px-10 max-[960px]:py-12 max-[960px]:px-8">
                <div>
                  {tagLine}
                  {productName}
                  {forLabel}
                </div>
                <div className="mt-8 max-[960px]:mt-6">{ctaEl}</div>
              </div>
            </div>
            {divider}
          </React.Fragment>
        );
```

- [ ] **Step 6: Run typecheck**

```bash
npm run typecheck
```

Expected: 0 errors. If there are errors about `data-flagship`, that's odd — React allows `data-*` attributes with string or undefined values. The `undefined` omits the attribute.

- [ ] **Step 7: Commit**

```bash
git add src/components/ProductsGrid.tsx
git commit -m "feat: ProductsGrid tiles gain blur-into-focus backgrounds + Coach360 overflow"
```

---

## Task 10: Wire CatalogIntro and FooterClose into page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace the full contents of `src/app/page.tsx`**

```typescript
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { SponsorsBanner } from "@/components/SponsorsBanner";
import { CatalogIntro } from "@/components/CatalogIntro";
import { ProductsGrid } from "@/components/ProductsGrid";
import { FooterClose } from "@/components/FooterClose";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <SponsorsBanner />
        <CatalogIntro />
        <ProductsGrid />
        <FooterClose />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run full check**

```bash
cd "C:\Users\Jorge\Desktop\Code Claude\mi-clon" && npm run typecheck
```

Expected: 0 errors in the files this plan has touched. Pre-existing errors in other pages (`academy/page.tsx`, `experience/page.tsx`, `useReveal.ts`) are unrelated and acceptable.

- [ ] **Step 3: Start dev server and verify visually**

```bash
npm run dev
```

Open http://localhost:3000 (or the port the dev server reports) and verify, top to bottom:

1. **Hero entrance** — cortina, palabras, shimmer, manifiesto aparecen como antes. Tras ~5s la hero queda en reposo.
2. **Hero scrubbing** — al empezar a scrollear en el hero, detrás del texto aparece una secuencia de frames que avanza con el scroll. Debe sentirse fluido (60fps). Mobile: no hay scrubbing, se ve el fondo negro básico.
3. **Navbar** — transparente sobre el hero (fondo oscuro semiconstante). Al pasar el hero, adquiere fondo negro con blur.
4. **Sponsors** — hay un buen trozo de negro entre el hero y los logos. Los logos aparecen con stagger (uno a uno).
5. **CatalogIntro** — section negra con el número "08" enorme en oro fino y la palabra "productos" pequeña encima. Aparece con fade al entrar en viewport.
6. **ProductsGrid** — cada tile tiene una imagen/vídeo de fondo muy desenfocado al entrar, que se enfoca suavemente. Al hacer hover en desktop, el fondo se intensifica y escala ligero.
7. **Coach360** — su imagen de fondo (vídeo) se sale ligeramente de los bordes del tile. Asimetría intencional.
8. **FooterClose** — antes del footer actual aparece "Optimizar · Automatizar · Escalar" en oro enorme, y al entrar en viewport se dibuja una línea de oro debajo.
9. **Footer** — como siempre.
10. **prefers-reduced-motion** — abrir DevTools > Rendering > Emulate CSS prefers-reduced-motion: reduce. Las animaciones se sustituyen por apariciones simples.

- [ ] **Step 4: Commit and push**

```bash
git add src/app/page.tsx
git commit -m "feat: wire CatalogIntro and FooterClose into home page"
git push origin master
```
