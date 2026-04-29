# Microsite Tecnifibre/Lacoste — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir un microsite privado en la ruta `/tecnifibre` con 5 capítulos a pantalla completa siguiendo la spec de diseño en `docs/superpowers/specs/2026-04-29-microsite-tecnifibre-design.md`.

**Architecture:** Nueva ruta dentro del proyecto Next.js 16 (`mi-clon`). Layout aislado del global (sin ChatBubble en esta ruta — se mostrará null por pathname). Página orquestadora que monta cada capítulo como componente independiente. Animaciones GSAP + ScrollTrigger reutilizando los hooks `useReveal` y `useParallax` de `/story`. Visualización 3D del globo en Capítulo 3 / Coach360 con `react-globe.gl` (ya instalado).

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 · GSAP + ScrollTrigger · `react-globe.gl` · `Instrument_Serif` (display) + `Roboto_Condensed` (sans).

---

## File Structure

**Crear (nuevos):**
- `src/app/tecnifibre/layout.tsx` — metadata `noindex`, no Navbar/Footer.
- `src/app/tecnifibre/page.tsx` — orquesta los 5 capítulos.
- `src/app/tecnifibre/_components/ChapterFrame.tsx` — wrapper común para todos los capítulos (full-height, indicador de progreso).
- `src/app/tecnifibre/_components/HeroChapter.tsx` — Capítulo 1.
- `src/app/tecnifibre/_components/StatsChapter.tsx` — Capítulo 2.
- `src/app/tecnifibre/_components/LeversChapter.tsx` — Capítulo 3 (carrusel de 3 palancas).
- `src/app/tecnifibre/_components/LeverSlide.tsx` — sub-slide individual de palanca.
- `src/app/tecnifibre/_components/CoachGlobe.tsx` — visualización 3D para Coach360.
- `src/app/tecnifibre/_components/ProposalChapter.tsx` — Capítulo 4 (4a + 4b).
- `src/app/tecnifibre/_components/BrandCard.tsx` — card individual Tecnifibre/Lacoste.
- `src/app/tecnifibre/_components/CoachBadge.tsx` — badge abstracto del programa.
- `src/app/tecnifibre/_components/CTAChapter.tsx` — Capítulo 5.
- `src/app/tecnifibre/_components/ChapterNav.tsx` — pips superior + contador "XX / 05".
- `src/app/tecnifibre/_data/coachLocations.ts` — coordenadas de los 10+ países para el globo.
- `docs/superpowers/specs/2026-04-29-microsite-tecnifibre-email.md` — borrador final del email para Jorge.

**Modificar (existentes):**
- `src/components/ChatBubble.tsx` — añadir guard `usePathname` para no renderizar en `/tecnifibre`.

---

## Verification approach

Esta es una página one-off de marketing. Tests unitarios para componentes visuales aportan poco valor. **Verification = visual check + smoke test:**

- Tras cada capítulo: `npm run dev`, navegar a `http://localhost:3000/tecnifibre`, comprobar que el capítulo renderiza con texto y estilo correctos.
- Tras task final: `npm run check` (lint + typecheck + build) debe pasar limpio.
- Antes del commit final: revisar visualmente en mobile (Chrome DevTools responsive) y desktop.

---

## Tasks

### Task 1: Crear ruta aislada y layout

**Files:**
- Create: `src/app/tecnifibre/layout.tsx`
- Modify: `src/components/ChatBubble.tsx` (añadir pathname guard)

- [ ] **Step 1: Crear `tecnifibre/layout.tsx` con metadata privada**

```tsx
// src/app/tecnifibre/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Una propuesta para Tecnifibre × Lacoste",
  description: "Propuesta privada de colaboración J3Pádel × Tecnifibre / Lacoste.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function TecnifibreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Modificar `ChatBubble.tsx` para no renderizar en `/tecnifibre`**

Leer el archivo primero para conocer su estructura, luego añadir al inicio del componente:

```tsx
"use client";
import { usePathname } from "next/navigation";
// ... existing imports

export function ChatBubble() {
  const pathname = usePathname();
  if (pathname?.startsWith("/tecnifibre")) return null;
  // ... resto del componente sin cambios
}
```

- [ ] **Step 3: Crear `tecnifibre/page.tsx` placeholder**

```tsx
// src/app/tecnifibre/page.tsx
export default function TecnifibrePage() {
  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-[#0E1C16] text-[#F8F5EF]">
      <p className="font-serif text-2xl">Microsite Tecnifibre/Lacoste — work in progress</p>
    </div>
  );
}
```

- [ ] **Step 4: Verificar ruta accesible**

Run: `npm run dev`
Open: `http://localhost:3000/tecnifibre`
Expected: pantalla negro-verdosa con texto crema. Sin Navbar global, sin ChatBubble.

- [ ] **Step 5: Commit**

```bash
git add src/app/tecnifibre/ src/components/ChatBubble.tsx
git commit -m "feat(tecnifibre): scaffold route aislada con layout sin chatbubble"
```

---

### Task 2: ChapterFrame — wrapper común

**Files:**
- Create: `src/app/tecnifibre/_components/ChapterFrame.tsx`

- [ ] **Step 1: Crear ChapterFrame**

```tsx
// src/app/tecnifibre/_components/ChapterFrame.tsx
"use client";

import { ReactNode } from "react";

interface ChapterFrameProps {
  index: number; // 1..5
  total: number; // 5
  children: ReactNode;
  background?: "image" | "stats" | "lever" | "proposal" | "cta";
  bgImage?: string;
  className?: string;
}

export function ChapterFrame({
  index,
  total,
  children,
  bgImage,
  className = "",
}: ChapterFrameProps) {
  return (
    <section
      className={`relative min-h-[100dvh] w-full flex flex-col text-[#F8F5EF] overflow-hidden ${className}`}
      data-chapter={index}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
          aria-hidden
        />
      )}
      <div className="relative z-10 flex flex-col flex-1 px-6 py-8 sm:px-12 sm:py-12 lg:px-20 lg:py-16">
        {children}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verificar compila**

Run: `npm run typecheck`
Expected: PASS sin errores de tipos.

- [ ] **Step 3: Commit**

```bash
git add src/app/tecnifibre/_components/ChapterFrame.tsx
git commit -m "feat(tecnifibre): wrapper ChapterFrame para todos los capítulos"
```

---

### Task 3: ChapterNav — indicador de progreso

**Files:**
- Create: `src/app/tecnifibre/_components/ChapterNav.tsx`

- [ ] **Step 1: Crear ChapterNav**

```tsx
// src/app/tecnifibre/_components/ChapterNav.tsx
"use client";

interface ChapterNavProps {
  current: number; // 1..5
  total: number; // 5
}

export function ChapterNav({ current, total }: ChapterNavProps) {
  return (
    <div className="flex items-center justify-between text-[11px] tracking-[2px] uppercase text-[#F8F5EF]/55">
      <div className="inline-flex gap-[6px]">
        {Array.from({ length: total }).map((_, i) => (
          <span
            key={i}
            className={`block h-[2px] w-[18px] transition-colors duration-500 ${
              i < current ? "bg-[#C9A96E]" : "bg-[#F8F5EF]/25"
            }`}
          />
        ))}
      </div>
      <span>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
    </div>
  );
}
```

- [ ] **Step 2: Verificar compila**

Run: `npm run typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add src/app/tecnifibre/_components/ChapterNav.tsx
git commit -m "feat(tecnifibre): ChapterNav con pips y contador"
```

---

### Task 4: Capítulo 1 — Hero

**Files:**
- Create: `src/app/tecnifibre/_components/HeroChapter.tsx`
- Modify: `src/app/tecnifibre/page.tsx`

- [ ] **Step 1: Crear HeroChapter**

```tsx
// src/app/tecnifibre/_components/HeroChapter.tsx
"use client";

import { ChapterFrame } from "./ChapterFrame";
import { ChapterNav } from "./ChapterNav";

export function HeroChapter() {
  return (
    <ChapterFrame
      index={1}
      total={5}
      bgImage="/images/hero.jpeg"
      className="bg-[#0E1C16]"
    >
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(14, 28, 22, 0.7), rgba(27, 61, 47, 0.45))",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col flex-1">
        <header className="flex items-center justify-between text-[11px] tracking-[3px] uppercase text-[#C9A96E]/85">
          <span>J3PÁDEL</span>
          <span>Para Raúl · Tecnifibre × Lacoste</span>
        </header>

        <div className="flex-1 flex flex-col justify-center gap-4 max-w-3xl">
          <span className="text-[12px] tracking-[3px] uppercase text-[#C9A96E]/85">
            — Una propuesta privada —
          </span>
          <h1 className="font-serif font-light text-[64px] sm:text-[88px] lg:text-[112px] leading-[1] tracking-[-0.02em] text-[#F8F5EF]">
            Hola, Raúl.
          </h1>
          <p className="font-light text-[18px] sm:text-[22px] leading-[1.4] text-[#F8F5EF]/85 max-w-xl">
            Lo que podemos construir juntos.
          </p>
        </div>

        <footer className="flex items-end justify-between gap-4">
          <ChapterNav current={1} total={5} />
          <div className="inline-flex items-center gap-2 text-[11px] tracking-[1px] text-[#F8F5EF]/70">
            <span>Desliza</span>
            <span className="w-[6px] h-[6px] rounded-full bg-[#C9A96E] animate-pulse" />
          </div>
        </footer>
      </div>
    </ChapterFrame>
  );
}
```

- [ ] **Step 2: Modificar `page.tsx` para incluir HeroChapter**

```tsx
// src/app/tecnifibre/page.tsx
import { HeroChapter } from "./_components/HeroChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[#0E1C16]">
      <HeroChapter />
    </main>
  );
}
```

- [ ] **Step 3: Verificar visual**

Run: `npm run dev`
Open: `http://localhost:3000/tecnifibre`
Expected: hero a pantalla completa con foto de fondo, "Hola, Raúl." enorme en serif, etiquetas arriba "J3PÁDEL" + "PARA RAÚL · TECNIFIBRE × LACOSTE", subtítulo, indicador "Desliza" abajo derecha pulsando, pips de progreso abajo izquierda con el primero en champán.

- [ ] **Step 4: Commit**

```bash
git add src/app/tecnifibre/_components/HeroChapter.tsx src/app/tecnifibre/page.tsx
git commit -m "feat(tecnifibre): capítulo 1 hero con triple personalización a Raúl"
```

---

### Task 5: Capítulo 2 — Quiénes somos en 3 datos

**Files:**
- Create: `src/app/tecnifibre/_components/StatsChapter.tsx`
- Modify: `src/app/tecnifibre/page.tsx`

- [ ] **Step 1: Crear StatsChapter**

```tsx
// src/app/tecnifibre/_components/StatsChapter.tsx
"use client";

import { ChapterFrame } from "./ChapterFrame";
import { ChapterNav } from "./ChapterNav";

const stats = [
  {
    big: "20",
    sup: "+",
    label: "Años en Málaga\noperando como club.",
  },
  {
    big: "Jun",
    sup: " '26",
    label: "Inauguramos\nnueva sede.",
  },
  {
    big: "100",
    sup: "+",
    label: "Entrenadores en\nnuestra plataforma global.",
  },
];

export function StatsChapter() {
  return (
    <ChapterFrame
      index={2}
      total={5}
      bgImage="/images/academy/stage-group.jpeg"
      className="bg-[#0E1C16]"
    >
      <div
        className="absolute inset-0 z-[5] pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(14, 28, 22, 0.85), rgba(27, 61, 47, 0.7))",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex flex-col flex-1 gap-10">
        <div className="flex flex-col gap-2 max-w-3xl">
          <span className="text-[11px] tracking-[3px] uppercase text-[#C9A96E]/85">
            — Capítulo 2
          </span>
          <h2 className="font-serif font-light text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.15] tracking-[-0.01em] text-[#F8F5EF]">
            Veinte años de club.<br />
            Una plataforma global.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 flex-1 items-center">
          {stats.map((s, i) => (
            <div key={i} className="flex flex-col gap-2 border-l-2 border-[#C9A96E] pl-5">
              <div className="font-serif font-light text-[56px] leading-[1] text-[#C9A96E]">
                {s.big}
                <span className="text-[24px] opacity-80 ml-[2px]">{s.sup}</span>
              </div>
              <div className="text-[13px] leading-[1.4] text-[#F8F5EF]/90 whitespace-pre-line">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <ChapterNav current={2} total={5} />
      </div>
    </ChapterFrame>
  );
}
```

- [ ] **Step 2: Añadir a `page.tsx`**

```tsx
import { HeroChapter } from "./_components/HeroChapter";
import { StatsChapter } from "./_components/StatsChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[#0E1C16]">
      <HeroChapter />
      <StatsChapter />
    </main>
  );
}
```

- [ ] **Step 3: Verificar visual**

Run: `npm run dev` (si no está ya corriendo)
Open: `http://localhost:3000/tecnifibre`, scroll a Capítulo 2.
Expected: pantalla completa con tres datos en columnas (móvil: stack vertical), barras champán a la izquierda de cada dato, número grande en serif champán, label al lado.

- [ ] **Step 4: Commit**

```bash
git add src/app/tecnifibre/_components/StatsChapter.tsx src/app/tecnifibre/page.tsx
git commit -m "feat(tecnifibre): capítulo 2 con tres datos clave"
```

---

### Task 6: Capítulo 3 — LeversChapter (carrusel de palancas)

**Files:**
- Create: `src/app/tecnifibre/_components/LeverSlide.tsx`
- Create: `src/app/tecnifibre/_components/LeversChapter.tsx`
- Modify: `src/app/tecnifibre/page.tsx`

- [ ] **Step 1: Crear LeverSlide (un slide)**

```tsx
// src/app/tecnifibre/_components/LeverSlide.tsx
"use client";

import { ReactNode } from "react";

interface LeverSlideProps {
  number: string;
  isHighlight?: boolean;
  name: string;
  tag: string;
  headline: ReactNode;
  body: string;
  stats: { strong: string; rest?: string }[];
  visual: ReactNode;
  footnote?: string;
}

export function LeverSlide({
  number,
  isHighlight,
  name,
  tag,
  headline,
  body,
  stats,
  visual,
  footnote,
}: LeverSlideProps) {
  return (
    <article className="relative min-h-[100dvh] w-full flex flex-col px-6 py-10 sm:px-12 sm:py-14 lg:px-20 lg:py-16 text-[#F8F5EF] overflow-hidden">
      <div className="absolute inset-0 z-0">{visual}</div>

      <header className="relative z-10 flex flex-col gap-1 max-w-3xl">
        <span className="text-[11px] tracking-[3px] uppercase text-[#C9A96E]">
          — PALANCA {number}
          {isHighlight && (
            <span className="text-[#C9A96E] ml-1"> · la grande</span>
          )}
        </span>
        <h3 className="font-serif text-[22px] sm:text-[26px] tracking-[-0.01em] text-[#F8F5EF]">
          {name}
        </h3>
      </header>

      <div className="relative z-10 flex-1 flex flex-col justify-center gap-5 max-w-2xl my-10">
        <span className="text-[10px] tracking-[2px] uppercase text-[#C9A96E]">
          {tag}
        </span>
        <h4 className="font-serif font-light text-[28px] sm:text-[36px] leading-[1.2] text-[#F8F5EF]">
          {headline}
        </h4>
        <p className="text-[14px] sm:text-[15px] leading-[1.55] text-[#F8F5EF]/88">
          {body}
        </p>
      </div>

      <footer className="relative z-10 flex flex-col gap-2 pt-4 border-t border-[#C9A96E]/30 max-w-2xl">
        {stats.map((s, i) => (
          <div key={i} className="flex items-baseline gap-2 text-[12px] text-[#F8F5EF]/85">
            <strong className="text-[#C9A96E] font-semibold text-[14px]">
              {s.strong}
            </strong>
            {s.rest && <span>· {s.rest}</span>}
          </div>
        ))}
        {footnote && (
          <div className="text-[12px] text-[#C9A96E] font-medium mt-2">
            {footnote}
          </div>
        )}
      </footer>
    </article>
  );
}
```

- [ ] **Step 2: Crear LeversChapter (orquesta los 3 slides)**

```tsx
// src/app/tecnifibre/_components/LeversChapter.tsx
"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChapterNav } from "./ChapterNav";
import { LeverSlide } from "./LeverSlide";

const CoachGlobe = dynamic(() => import("./CoachGlobe").then(m => m.CoachGlobe), {
  ssr: false,
  loading: () => <div className="absolute inset-0 bg-[#0E1C16]" />,
});

export function LeversChapter() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const idx = Math.round(track.scrollLeft / track.clientWidth);
    if (idx !== activeIndex) setActiveIndex(idx);
  };

  return (
    <section
      className="relative w-full bg-[#0E1C16]"
      data-chapter={3}
    >
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: "none" }}
      >
        <div className="snap-start shrink-0 w-full">
          <LeverSlide
            number="01"
            name="Club y academia física"
            tag="El día a día"
            headline={<>Lo que el jugador<br />ve cada día en pista.</>}
            body="Pelotas de academia. Equipación de staff. Imagen corporativa del club. La nueva sede de Málaga abre con vuestra marca en escena desde el día uno."
            stats={[
              { strong: "1 cajón", rest: "entrenador / mes" },
              { strong: "+", rest: "crecimiento progresivo conforme suma academia" },
            ]}
            visual={
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(160deg, rgba(14,28,22,0.85), rgba(27,61,47,0.75)), url('/images/hero.jpeg')",
                }}
              />
            }
          />
        </div>

        <div className="snap-start shrink-0 w-full">
          <LeverSlide
            number="02"
            name="J3PTV"
            tag="Contenido propio"
            headline={<>Calidad,<br />no volumen.</>}
            body="Podcast con jugadores top. Vlogs desde eventos de marca premium. Activaciones en Instagram y TikTok. Producimos cuando hay algo que contar — no por llenar feed."
            stats={[
              { strong: "Producción propia", rest: "activable en cualquier momento" },
              { strong: "Foco editorial", rest: "ejes acordados con marca" },
            ]}
            visual={
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "linear-gradient(160deg, rgba(14,28,22,0.9), rgba(27,61,47,0.7)), url('/images/j3/j3ptv-bg.jpg')",
                }}
              />
            }
          />
        </div>

        <div className="snap-start shrink-0 w-full">
          <LeverSlide
            number="03"
            isHighlight
            name="Coach360"
            tag="Red global · prescripción real"
            headline={<>Lo que ningún<br />otro club os ofrece.</>}
            body="Más de 100 entrenadores en plataforma. Staffs propios. Tiendas de club. Prescripción directa al jugador amateur — no figurantes. Una red activable a vuestra marca."
            stats={[
              { strong: "+100", rest: "entrenadores" },
              { strong: "+10", rest: "países" },
            ]}
            footnote="→ Continúa en Cap. 04"
            visual={
              <div className="absolute inset-0">
                <CoachGlobe />
              </div>
            }
          />
        </div>
      </div>

      <div className="absolute top-8 left-6 right-6 sm:left-12 sm:right-12 lg:left-20 lg:right-20 z-20 flex items-center justify-between">
        <ChapterNav current={3} total={5} />
        <div className="inline-flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-[6px] w-[6px] rounded-full transition ${
                i === activeIndex ? "bg-[#C9A96E]" : "bg-[#F8F5EF]/25"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[10px] tracking-[2px] uppercase text-[#F8F5EF]/55 pointer-events-none">
        ↔ desliza para ver las tres
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Añadir a `page.tsx`**

```tsx
import { HeroChapter } from "./_components/HeroChapter";
import { StatsChapter } from "./_components/StatsChapter";
import { LeversChapter } from "./_components/LeversChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[#0E1C16]">
      <HeroChapter />
      <StatsChapter />
      <LeversChapter />
    </main>
  );
}
```

- [ ] **Step 4: Verificar typecheck (CoachGlobe se crea en Task 7)**

Run: `npm run typecheck`
Expected: error de import en CoachGlobe — esperado, se resuelve en Task 7.

- [ ] **Step 5: Commit (con CoachGlobe pendiente)**

```bash
git add src/app/tecnifibre/_components/LeverSlide.tsx src/app/tecnifibre/_components/LeversChapter.tsx src/app/tecnifibre/page.tsx
git commit -m "feat(tecnifibre): capítulo 3 carrusel con tres palancas (CoachGlobe pendiente)"
```

---

### Task 7: CoachGlobe — visualización 3D para Coach360

**Files:**
- Create: `src/app/tecnifibre/_data/coachLocations.ts`
- Create: `src/app/tecnifibre/_components/CoachGlobe.tsx`

- [ ] **Step 1: Crear datos de localizaciones**

```ts
// src/app/tecnifibre/_data/coachLocations.ts
export interface CoachLocation {
  name: string;
  lat: number;
  lng: number;
  size: number; // peso visual (0.3..1.0)
}

// Los 10+ países donde Coach360 tiene entrenadores activos.
// Posiciones aproximadas a la capital o ciudad principal.
// Tamaño según densidad estimada (Jorge confirmará en revisión).
export const COACH_LOCATIONS: CoachLocation[] = [
  { name: "España", lat: 40.4168, lng: -3.7038, size: 1.0 },
  { name: "Italia", lat: 41.9028, lng: 12.4964, size: 0.7 },
  { name: "Portugal", lat: 38.7223, lng: -9.1393, size: 0.6 },
  { name: "Francia", lat: 48.8566, lng: 2.3522, size: 0.6 },
  { name: "Argentina", lat: -34.6037, lng: -58.3816, size: 0.7 },
  { name: "México", lat: 19.4326, lng: -99.1332, size: 0.5 },
  { name: "Brasil", lat: -23.5505, lng: -46.6333, size: 0.5 },
  { name: "Estados Unidos", lat: 25.7617, lng: -80.1918, size: 0.5 }, // Miami
  { name: "Suecia", lat: 59.3293, lng: 18.0686, size: 0.4 },
  { name: "Países Bajos", lat: 52.3676, lng: 4.9041, size: 0.4 },
  { name: "Bélgica", lat: 50.8503, lng: 4.3517, size: 0.3 },
];
```

- [ ] **Step 2: Crear CoachGlobe**

```tsx
// src/app/tecnifibre/_components/CoachGlobe.tsx
"use client";

import { useEffect, useRef } from "react";
import Globe, { GlobeMethods } from "react-globe.gl";
import { COACH_LOCATIONS } from "../_data/coachLocations";

export function CoachGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);

  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    const controls = g.controls() as { autoRotate: boolean; autoRotateSpeed: number; enableZoom: boolean };
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false;
    g.pointOfView({ lat: 30, lng: -10, altitude: 2.2 }, 0);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-[#0E1C16]" />
      <Globe
        ref={globeRef}
        width={typeof window !== "undefined" ? window.innerWidth : 800}
        height={typeof window !== "undefined" ? window.innerHeight : 800}
        backgroundColor="rgba(14, 28, 22, 0)"
        showAtmosphere
        atmosphereColor="#C9A96E"
        atmosphereAltitude={0.18}
        globeMaterial={
          // material custom: verde profundo opaco
          // (importado dinámicamente para no romper SSR)
          undefined
        }
        showGlobe
        showGraticules={false}
        pointsData={COACH_LOCATIONS}
        pointLat="lat"
        pointLng="lng"
        pointColor={() => "#C9A96E"}
        pointAltitude={(d) => 0.02 + (d as { size: number }).size * 0.04}
        pointRadius={(d) => 0.4 + (d as { size: number }).size * 0.6}
        ringsData={COACH_LOCATIONS}
        ringLat="lat"
        ringLng="lng"
        ringColor={() => "#C9A96E"}
        ringMaxRadius={(d) => 2 + (d as { size: number }).size * 3}
        ringPropagationSpeed={1.5}
        ringRepeatPeriod={2000}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 50%, rgba(14, 28, 22, 0.6) 100%)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 3: Verificar typecheck y visual**

Run: `npm run typecheck` → debe pasar.
Run: `npm run dev`, navegar a `/tecnifibre`, scroll a Cap 3, swipe horizontal hasta llegar a Coach360.
Expected: globo verde profundo rotando lentamente, dots y ondas champán pulsantes en los 11 países, viñeta radial oscureciendo bordes.

- [ ] **Step 4: Commit**

```bash
git add src/app/tecnifibre/_data/coachLocations.ts src/app/tecnifibre/_components/CoachGlobe.tsx
git commit -m "feat(tecnifibre): globo 3D con red Coach360 en Cap 3 P03"
```

---

### Task 8: Capítulo 4 — Proposal (4a brand cards + 4b co-branded)

**Files:**
- Create: `src/app/tecnifibre/_components/BrandCard.tsx`
- Create: `src/app/tecnifibre/_components/CoachBadge.tsx`
- Create: `src/app/tecnifibre/_components/ProposalChapter.tsx`
- Modify: `src/app/tecnifibre/page.tsx`

- [ ] **Step 1: Crear BrandCard**

```tsx
// src/app/tecnifibre/_components/BrandCard.tsx
"use client";

import { ReactNode } from "react";

interface BrandCardProps {
  brand: "tecnifibre" | "lacoste";
  headline: ReactNode;
  body: string;
  activations: string;
}

export function BrandCard({ brand, headline, body, activations }: BrandCardProps) {
  const borderColor = brand === "tecnifibre" ? "#1B3D2F" : "#C9A96E";
  return (
    <div
      className="flex flex-col gap-4 p-6 sm:p-7 bg-white rounded-md border min-h-[280px]"
      style={{ borderTop: `3px solid ${borderColor}`, borderColor: "rgba(27,61,47,0.12)" }}
    >
      <div className="text-[14px] tracking-[4px] uppercase font-bold text-[#0E1C16]">
        {brand === "tecnifibre" ? "Tecnifibre" : "Lacoste"}
      </div>
      <h4 className="font-serif font-light text-[22px] leading-[1.25] text-[#0E1C16]">
        {headline}
      </h4>
      <p className="text-[13px] leading-[1.55] text-[#444]">{body}</p>
      <div className="mt-auto pt-4 border-t border-[#1B3D2F]/8 flex flex-col gap-2">
        <span className="text-[10px] tracking-[1.5px] uppercase text-[#1B3D2F]/60">
          Activación J3
        </span>
        <span className="text-[13px] leading-[1.5] text-[#0E1C16]">{activations}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Crear CoachBadge (badge abstracto sin texto comprometedor)**

```tsx
// src/app/tecnifibre/_components/CoachBadge.tsx
"use client";

export function CoachBadge() {
  return (
    <div className="inline-flex items-center gap-3 px-5 py-3 bg-[#C9A96E] text-[#0E1C16] rounded-full">
      <span className="font-bold tracking-[2px] text-[12px] uppercase">J3</span>
      <span className="w-px h-4 bg-[#0E1C16]/30" />
      <span className="font-bold tracking-[2px] text-[12px] uppercase">Tecnifibre</span>
      <span className="w-5 h-5 rounded-full bg-[#1B3D2F] text-[#C9A96E] inline-flex items-center justify-center text-[10px] font-bold">
        ✓
      </span>
    </div>
  );
}
```

- [ ] **Step 3: Crear ProposalChapter**

```tsx
// src/app/tecnifibre/_components/ProposalChapter.tsx
"use client";

import { ChapterNav } from "./ChapterNav";
import { BrandCard } from "./BrandCard";
import { CoachBadge } from "./CoachBadge";

export function ProposalChapter() {
  return (
    <section
      className="relative w-full bg-[#F8F5EF] text-[#0E1C16] px-6 py-12 sm:px-12 sm:py-16 lg:px-20 lg:py-20"
      data-chapter={4}
    >
      <header className="flex items-center justify-between mb-10">
        <ChapterNav current={4} total={5} />
      </header>

      <span className="block text-[11px] tracking-[3px] uppercase text-[#1B3D2F]/70 mb-2">
        — Raúl, aquí está donde queremos llegar contigo —
      </span>
      <h2 className="font-serif font-light text-[32px] sm:text-[44px] lg:text-[52px] leading-[1.15] tracking-[-0.01em] text-[#0E1C16] mb-12 max-w-3xl">
        Dos marcas. Una operación.
      </h2>

      <span className="block text-[12px] tracking-[2px] uppercase text-[#C9A96E] font-semibold mb-4">
        4 a · Diferenciación de marcas
      </span>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <BrandCard
          brand="tecnifibre"
          headline={<>Rendimiento.<br />Prescripción técnica.</>}
          body="El producto que toca al jugador. Lo que el entrenador recomienda porque funciona en pista."
          activations="Pelotas de academia · palas y material técnico · presencia en eventos de marca · prescripción a través de la red de entrenadores."
        />
        <BrandCard
          brand="lacoste"
          headline={<>Imagen.<br />Lifestyle aspiracional.</>}
          body="La marca que el jugador quiere vestir. Lo que define la experiencia premium del club."
          activations="Equipación de staff · imagen corporativa de la nueva sede · eventos exclusivos en club · contenido lifestyle en J3PTV."
        />
      </div>

      <span className="block text-[12px] tracking-[2px] uppercase text-[#C9A96E] font-semibold mb-4">
        4 b · La jugada conjunta
      </span>
      <div className="rounded-lg p-8 sm:p-10 bg-gradient-to-br from-[#1B3D2F] to-[#0E1C16] text-[#F8F5EF]">
        <span className="block text-[11px] tracking-[3px] uppercase text-[#C9A96E] mb-3">
          — Programa propuesto
        </span>
        <h3 className="font-serif font-light text-[28px] sm:text-[36px] leading-[1.1] text-[#F8F5EF] mb-3">
          Un programa co-branded<br />por definir juntos.
        </h3>
        <p className="text-[14px] leading-[1.55] text-[#F8F5EF]/85 max-w-2xl mb-6">
          Entrenadores firmados por Tecnifibre acceden a la formación J3 y obtienen un badge propio en el directorio "Encuentra a tu Coach". Vosotros sumáis prescripción real al jugador amateur. Nosotros sumamos potencia de marca a nuestros entrenadores. Todos ganan.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {[
            "Tecnifibre firma a un entrenador de su elección.",
            "El entrenador accede a la formación de J3 y obtiene certificación.",
            "Aparece en el directorio público con badge co-branded.",
          ].map((step, i) => (
            <div
              key={i}
              className="bg-[#F8F5EF]/6 border border-[#C9A96E]/25 rounded-md p-4"
            >
              <div className="text-[11px] tracking-[2px] text-[#C9A96E] mb-1">
                — 0{i + 1}
              </div>
              <div className="text-[13px] leading-[1.45] text-[#F8F5EF]/90">
                {step}
              </div>
            </div>
          ))}
        </div>

        <div className="my-4">
          <CoachBadge />
        </div>

        <p className="font-serif italic text-[16px] leading-[1.4] text-[#C9A96E] mt-6 pt-5 border-t border-[#C9A96E]/20">
          Esto es lo que ningún otro club os puede ofrecer.
        </p>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Añadir a `page.tsx`**

```tsx
import { HeroChapter } from "./_components/HeroChapter";
import { StatsChapter } from "./_components/StatsChapter";
import { LeversChapter } from "./_components/LeversChapter";
import { ProposalChapter } from "./_components/ProposalChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[#0E1C16]">
      <HeroChapter />
      <StatsChapter />
      <LeversChapter />
      <ProposalChapter />
    </main>
  );
}
```

- [ ] **Step 5: Verificar visual**

Run: `npm run dev`, navegar a `/tecnifibre`, scroll a Cap 4.
Expected: fondo crema con eyebrow personal "Raúl, aquí está donde queremos llegar contigo", título "Dos marcas. Una operación.", dos cards Tecnifibre/Lacoste, bloque verde oscuro con propuesta co-branded, badge champán abstracto, frase final en cursiva.

- [ ] **Step 6: Commit**

```bash
git add src/app/tecnifibre/_components/BrandCard.tsx src/app/tecnifibre/_components/CoachBadge.tsx src/app/tecnifibre/_components/ProposalChapter.tsx src/app/tecnifibre/page.tsx
git commit -m "feat(tecnifibre): capítulo 4 propuesta con cards y programa co-branded"
```

---

### Task 9: Capítulo 5 — CTA

**Files:**
- Create: `src/app/tecnifibre/_components/CTAChapter.tsx`
- Modify: `src/app/tecnifibre/page.tsx`

- [ ] **Step 1: Crear CTAChapter**

```tsx
// src/app/tecnifibre/_components/CTAChapter.tsx
"use client";

import { ChapterFrame } from "./ChapterFrame";
import { ChapterNav } from "./ChapterNav";

export function CTAChapter() {
  return (
    <ChapterFrame
      index={5}
      total={5}
      className="bg-gradient-to-b from-[#1B3D2F] to-[#0E1C16]"
    >
      <header className="relative z-10">
        <ChapterNav current={5} total={5} />
      </header>

      <div className="relative z-10 flex flex-col flex-1 justify-center gap-7 max-w-3xl">
        <span className="text-[12px] tracking-[4px] uppercase text-[#C9A96E]/85">
          — Y ahora —
        </span>
        <h2 className="font-serif font-light text-[64px] sm:text-[88px] lg:text-[112px] leading-[1] tracking-[-0.03em] text-[#F8F5EF]">
          Hablamos.
        </h2>
        <p className="font-light text-[16px] sm:text-[18px] leading-[1.5] text-[#F8F5EF]/85 max-w-xl">
          Cuando lo hayas visto, te llamo yo y lo aterrizamos.
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-2">
          <a
            href="mailto:jorge@j3padel.com"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#C9A96E] text-[#0E1C16] rounded-full font-semibold text-[14px] tracking-[0.5px] hover:bg-[#F8F5EF] transition-colors"
          >
            Escríbenos →
          </a>
          <span className="text-[13px] text-[#F8F5EF]/70">
            o directamente{" "}
            <a href="mailto:jorge@j3padel.com" className="text-[#C9A96E] hover:text-[#F8F5EF] transition-colors">
              jorge@j3padel.com
            </a>
          </span>
        </div>
      </div>

      <footer className="relative z-10 flex items-end justify-between gap-4">
        <span className="text-[12px] leading-[1.6] text-[#F8F5EF]/75 max-w-[280px]">
          <strong className="text-[#F8F5EF]/95 font-medium">Jorge Cárdenas</strong>
        </span>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-[11px] tracking-[1px] uppercase text-[#C9A96E]/70 hover:text-[#C9A96E] transition-colors"
        >
          ↑ Volver al inicio
        </a>
      </footer>
    </ChapterFrame>
  );
}
```

- [ ] **Step 2: Añadir a `page.tsx`**

```tsx
import { HeroChapter } from "./_components/HeroChapter";
import { StatsChapter } from "./_components/StatsChapter";
import { LeversChapter } from "./_components/LeversChapter";
import { ProposalChapter } from "./_components/ProposalChapter";
import { CTAChapter } from "./_components/CTAChapter";

export default function TecnifibrePage() {
  return (
    <main className="bg-[#0E1C16]">
      <HeroChapter />
      <StatsChapter />
      <LeversChapter />
      <ProposalChapter />
      <CTAChapter />
    </main>
  );
}
```

- [ ] **Step 3: Verificar visual**

Run: `npm run dev`, scroll hasta el final.
Expected: pantalla verde profunda a negro, "Hablamos." enorme, botón champán "Escríbenos →" + email visible al lado, firma "Jorge Cárdenas", "↑ Volver al inicio" funcional.

- [ ] **Step 4: Commit**

```bash
git add src/app/tecnifibre/_components/CTAChapter.tsx src/app/tecnifibre/page.tsx
git commit -m "feat(tecnifibre): capítulo 5 cierre con cta y volver al inicio"
```

---

### Task 10: Animaciones GSAP — reveals al hacer scroll

**Files:**
- Modify: `src/app/tecnifibre/_components/HeroChapter.tsx`
- Modify: `src/app/tecnifibre/_components/StatsChapter.tsx`
- Modify: `src/app/tecnifibre/_components/ProposalChapter.tsx`
- Modify: `src/app/tecnifibre/_components/CTAChapter.tsx`

Reutilizamos el patrón `useReveal` que ya existe en `/story` (`src/app/story/page.tsx`). Si está exportado como hook utilizable, importarlo. Si no, **inline el hook directamente** en cada componente que lo necesite (DRY se relaja aquí porque mover a util compartida implica refactor de `/story`).

- [ ] **Step 1: Crear hook compartido `useReveal`**

```tsx
// src/app/tecnifibre/_components/useReveal.ts
"use client";

import { useEffect, useRef, useState } from "react";

export function useReveal<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, visible };
}
```

- [ ] **Step 2: Aplicar revelar en StatsChapter (stagger 100ms entre los 3 datos)**

Modificar `StatsChapter.tsx` para envolver cada stat en un div con clase condicional según `useReveal`. Cada stat debe tener un `transition-delay` distinto: 0ms, 100ms, 200ms. Estado inicial: `opacity-0 translate-y-4`. Estado visible: `opacity-100 translate-y-0`.

```tsx
// dentro de StatsChapter, antes del return:
const { ref, visible } = useReveal<HTMLDivElement>(0.3);

// envolver el grid:
<div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-10 flex-1 items-center">
  {stats.map((s, i) => (
    <div
      key={i}
      className={`flex flex-col gap-2 border-l-2 border-[#C9A96E] pl-5 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
      style={{ transitionDelay: `${i * 100}ms` }}
    >
      {/* ... resto sin cambios */}
    </div>
  ))}
</div>
```

- [ ] **Step 3: Aplicar reveal en ProposalChapter (cards Tecnifibre y Lacoste, después bloque co-branded)**

Mismo patrón en las cards de marca y el bloque co-branded. Tres elementos con stagger: Tecnifibre (0ms), Lacoste (150ms), bloque co-branded (300ms).

- [ ] **Step 4: Verificar visual**

Run: `npm run dev`. Scroll lento por todos los capítulos.
Expected: los datos del Cap 2 aparecen en cascada al entrar a la pantalla. Las cards y el bloque co-branded del Cap 4 aparecen en cascada también.

- [ ] **Step 5: Commit**

```bash
git add src/app/tecnifibre/_components/useReveal.ts src/app/tecnifibre/_components/StatsChapter.tsx src/app/tecnifibre/_components/ProposalChapter.tsx
git commit -m "feat(tecnifibre): reveals con stagger en caps 2 y 4"
```

---

### Task 11: Mobile polish — 100dvh + safe areas

**Files:**
- Modify: todos los chapters que usen alturas full-screen

Verificar:
- Que `min-h-[100dvh]` está aplicado (no `min-h-screen` que usa `vh` y rompe con la barra de Chrome iOS).
- Que el contenido del Hero y CTA no queda recortado por la barra de address en mobile.
- Que el carrusel de Cap 3 funciona con swipe táctil.

- [ ] **Step 1: Auditar uso de `min-h-screen` y reemplazar por `min-h-[100dvh]`**

Run grep manualmente:
```bash
cd src/app/tecnifibre && grep -rn "min-h-screen" .
```

Reemplazar todas las ocurrencias por `min-h-[100dvh]`. Si la versión de Tailwind no soporta `dvh` directamente, añadir clase utility en `globals.css`.

- [ ] **Step 2: Verificar en Chrome DevTools responsive iPhone**

Run: `npm run dev`, abrir DevTools, modo responsive, perfil iPhone 13 Pro. Recorrer los 5 capítulos.
Expected: ningún capítulo recortado por la barra de URL. El swipe en Cap 3 cambia entre palancas. El globe del Cap 3 P03 se muestra centrado.

- [ ] **Step 3: Commit**

```bash
git add src/app/tecnifibre
git commit -m "fix(tecnifibre): 100dvh para evitar recorte con address bar móvil"
```

---

### Task 12: SEO metadata + privacidad

**Files:**
- Verificar: `src/app/tecnifibre/layout.tsx` ya tiene `noindex, nofollow` (Task 1).

- [ ] **Step 1: Verificar metadata final**

Open `src/app/tecnifibre/layout.tsx`. Confirmar que tiene:
- `robots: { index: false, follow: false }` ✓
- `title: "Una propuesta para Tecnifibre × Lacoste"` ✓

Sin cambios necesarios si Task 1 se completó correctamente.

- [ ] **Step 2: Skip — no commit si no hay cambios.**

---

### Task 13: Documento de email para Jorge

**Files:**
- Create: `docs/superpowers/specs/2026-04-29-microsite-tecnifibre-email.md`

- [ ] **Step 1: Crear el archivo con el email final**

```markdown
# Email a Raúl — borrador final

**Asunto:** Una propuesta para Tecnifibre × Lacoste

---

Hola Raúl,

He montado esto pensando en ti específicamente:
→ https://j3home.vercel.app/tecnifibre

Cuando lo veas, te llamo yo y lo aterrizamos.

Un abrazo,
Jorge

---

P.D. — Por avanzar lo que pediste para el contrato:
- Cajones de pelotas: 1 / entrenador / mes (hoy 2 entrenadores; crecemos con la academia).
- Equipación: staff técnico (2 personas hoy + entrenadores que sumemos).
- Imagen corporativa: foco en la nueva sede que abrimos en junio.
- Staff confirmado: Jordi y Jorge. Datos personales ya os los pasó Javi.
- Presencia y prescripción: detallado en el microsite (capítulo 3).
- Foco de propuesta de valor: capítulos 3 y 4.

Lo de Nico lo cuadramos esta semana y te confirmo. Tema IVA intracomunitario, anotado.

---

**Notas para Jorge antes de enviar:**
- Confirmar que la URL sea la final (`j3padel.com/tecnifibre` o `j3home.vercel.app/tecnifibre` según dónde se despliegue).
- Confirmar que efectivamente vas a llamar tú — si no, cambiar el cierre activo a la versión pasiva.
- El nombre "Javi" en la P.D. está confirmado por Jorge en sesión 2026-04-29.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-04-29-microsite-tecnifibre-email.md
git commit -m "docs(tecnifibre): borrador final del email para Jorge"
```

---

### Task 14: Verificación final + push

- [ ] **Step 1: Smoke test completo**

```bash
npm run check
```

Expected: PASS lint + typecheck + build sin errores.

Si build falla, revisar errores y corregir antes de continuar.

- [ ] **Step 2: Test visual completo en navegador**

Run: `npm run dev`. Abrir `http://localhost:3000/tecnifibre` en:
- Chrome desktop (1440×900)
- Chrome DevTools responsive iPhone 13 Pro
- Chrome DevTools responsive iPad

Recorrer los 5 capítulos en cada viewport. Verificar:
- [ ] Cap 1: imagen de fondo carga, "Hola, Raúl." legible, etiquetas top y "Desliza" abajo.
- [ ] Cap 2: tres datos se revelan en cascada al entrar.
- [ ] Cap 3: swipe horizontal funciona; las 3 palancas tienen sus visuales correctos; en P03 el globo gira y los rings pulsan.
- [ ] Cap 4: cards Tecnifibre/Lacoste, bloque co-branded con steps y badge.
- [ ] Cap 5: "Hablamos." grande, botón mailto funcional, "↑ Volver al inicio" hace scroll-to-top.

- [ ] **Step 3: Push a master para deploy automático en Vercel**

```bash
git push origin master
```

- [ ] **Step 4: Verificar deploy de Vercel**

Esperar ~2 minutos, abrir `https://j3home.vercel.app/tecnifibre`. Verificar que se renderiza igual que en local.

- [ ] **Step 5: Avisar a Jorge**

El microsite está vivo en su URL final. Pasamos el control a Jorge para:
1. Revisar visualmente y decir si algo cambia.
2. Aprobar el email definitivo (ver `docs/superpowers/specs/2026-04-29-microsite-tecnifibre-email.md`).
3. Enviar a Raúl.

---

## Self-review (post-write)

**Spec coverage:**
- Cap 1 Hero ✓ Task 4
- Cap 2 Stats ✓ Task 5
- Cap 3 Levers + Globe ✓ Tasks 6 + 7
- Cap 4 Proposal ✓ Task 8
- Cap 5 CTA ✓ Task 9
- Email draft ✓ Task 13
- Privacy / noindex ✓ Tasks 1 + 12
- Mobile 100dvh ✓ Task 11
- Animations ✓ Task 10
- Triple personalization (Raúl) ✓ Cap 1 eyebrow (Task 4) + Cap 4 eyebrow (Task 8)
- Active closing ✓ Cap 5 (Task 9) + email (Task 13)
- Coach360 con +10 países y mapa estilizado ✓ Task 7

**Placeholder scan:** Ninguno. Todo el copy está concreto. Las posiciones del globe son aproximadas y se documentan como tal en el comentario del archivo de datos.

**Type consistency:** Componentes usan tipos consistentes. `LeverSlide` define `LeverSlideProps`; `BrandCard` define `BrandCardProps`. `useReveal` exporta tipos genéricos.

**Open items finales:**
- Densidades exactas por país en `coachLocations.ts` — Jorge puede ajustar si tiene números reales.
- URL final de la página: `j3padel.com/tecnifibre` (alias) vs `j3home.vercel.app/tecnifibre` (canónica). Confirmar en Task 14.
