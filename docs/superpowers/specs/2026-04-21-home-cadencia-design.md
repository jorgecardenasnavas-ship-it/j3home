# Home Cadencia — Design Spec
**Date:** 2026-04-21
**Status:** Approved

## Objetivo

Subir la home de J3Pádel del nivel "estática con reveals básicos" al nivel "editorial cinematográfico". Añadir ritmo, respiración y profundidad al scroll sin romper la estructura actual ni añadir contenido nuevo. El visitante debe sentir que recorre un film, no que carga una página.

Referencia estilística: Chanel / Aston Martin — editorial de lujo, no scroll-gimmick.

## Arquitectura

Estructura final de `src/app/page.tsx`:

```
Navbar              (reactiva por transparencia/blur, sin auto-hide)
HeroSection         (+ scroll scrubbing post-entrada)
SponsorsBanner      (+ padding-top extendido + stagger reveal)
CatalogIntro        [NUEVO] — "08" + "productos"
ProductsGrid        (+ tile-bg con blur-into-focus, Coach360 overflow)
FooterClose         [NUEVO] — tagline + línea oro scroll-drawn
Footer              (sin cambios)
```

No se crea `SponsorsTransition` — la transición se resuelve con arquitectura del espacio (padding generoso + stagger reveal) dentro de `SponsorsBanner`.

## Principios transversales

- **`prefers-reduced-motion`**: todo movimiento se congela o sustituye por fade simple
- **Mobile (<961px)**: scrubbing y Coach360 overflow OFF; el resto mantiene estructura pero con alturas reducidas
- **Performance**: 1 solo `requestAnimationFrame` compartido para scroll listeners; IntersectionObserver con `threshold: 0.12` para reveals
- **Sin assets nuevos**: se usa todo lo que ya hay en `public/images/` y `public/videos/`

## 1. Navbar reactiva

**Estado actual:** transparente, siempre visible.

**Cambios:**
- Mientras `scrollY <= 90vh` (sobre el hero): sin cambios
- Cuando `scrollY > 90vh`: fondo `rgba(0,0,0,0.72)` + `backdrop-filter: blur(20px)` + `border-bottom: 1px solid rgba(212,169,74,0.08)`
- **Sin auto-hide**. La nav siempre está visible — solo cambia su peso visual según dónde estés
- Transición: `background 0.5s var(--ease-out)`, `border-color 0.5s var(--ease-out)`

**Implementación:** hook local en `Navbar.tsx` con `useEffect` + `scroll` listener pasivo que actualiza un estado booleano `onHero`. Aplica clase condicional.

## 2. Hero con scroll scrubbing

**Principio:** la entrada cinematográfica actual (curtain → words → shimmer → manifesto, ~4s) **no se toca**. El scrubbing se activa al terminar.

**Funcionamiento:**
1. Al montar, `HeroSection` renderiza como hoy — el vídeo actual de fondo, las palabras, shimmer, manifesto
2. En paralelo, se precargan los 193 frames de `public/videos/frames/f001.jpg` … `f193.jpg` en background (no bloqueante)
3. Al completar la entrada (~4s) **Y** al completar el preload, se superpone un `<canvas>` encima del vídeo (no lo sustituye — lo oculta con opacity 1 solo cuando todo está listo)
4. `useScrollScrub` mapea `scrollY ∈ [0, windowHeight]` → `frameIndex ∈ [0, 192]`. `requestAnimationFrame` throttle. Fuera del rango, clamp a 0 o 192
5. Al redibujar en canvas, usar `drawImage` con `object-fit: cover` manual (calcular dimensiones)

**Fallback:**
- Si el preload falla o tarda más de 8s: no se activa el canvas. La hero se queda con el vídeo actual
- `prefers-reduced-motion`: canvas no se activa
- Mobile: canvas no se activa; se reproduce `j3-brand-evolution.mp4` en loop muted como fondo del hero

## 3. SponsorsBanner — padding + stagger

**Estado actual:** logos en una fila con marquee/grid estático.

**Cambios:**
- Añadir padding-top de `20vh` extra (sobre el existente) — crea negro respirado entre hero y logos
- Cada logo entra con stagger: `opacity 0 → 1`, `translateY(20px → 0)`, 500ms por logo, 120ms entre logos
- Trigger: IntersectionObserver del banner entero con `threshold: 0.15`
- Al pasarse, se quedan fijos sin animación adicional

**Estilo:** los logos mantienen su color/opacidad actual. Solo la entrada cambia.

## 4. CatalogIntro (NUEVO)

**Propósito:** exhalación entre sponsors y productos. Numeral elegante que invita curiosidad sin gritar.

**Estructura:**
```tsx
<section className="catalog-intro">
  <span className="label">productos</span>  {/* i18n */}
  <div className="number">08</div>
</section>
```

**Medidas y estilo:**
- Section: `height: 50vh`, `display: flex`, `flex-direction: column`, `align-items: center`, `justify-content: center`, `gap: 24px`, `background: #000`
- Label: `text-[10px] tracking-[4px] uppercase text-white/30`
- Número "08": `font-size: clamp(120px, 16vw, 240px)`, `font-weight: 200`, `letter-spacing: -8px`, gold gradient via `.j3-grad-text`

**Reveal al entrar viewport:**
- Label fade-in primero (400ms)
- "08" sube `translateY(30px → 0)` + fade-in (800ms), retrasado 200ms respecto al label
- Threshold: 0.3

**Mobile:** `height: 35vh`, número a `clamp(80px, 20vw, 160px)`.

**i18n** (nueva clave `home.catalogIntro.label`):
- es: "productos"
- en: "products"
- fr: "produits"
- sv: "produkter"
- pt: "produtos"

## 5. ProductsGrid — blur-into-focus + Coach360 overflow

**Estructura nueva del tile:**
```tsx
<div className="pc-card group ...">
  <div className="tile-bg" />        {/* NUEVO */}
  <div className="pc-glow" />         {/* existente */}
  <div className="top-accent" />      {/* existente */}
  <span className="watermark" />      {/* existente */}
  <div className="tile-content">      {/* tag/title/for/cta existente */}
</div>
```

### Tile background — blur-into-focus

- `.tile-bg`: `position: absolute`, `inset: 0`, `overflow: hidden`, `z-index: 0` (debajo de todo excepto el card base)
- Dentro: `<video>` o `<img>` con `object-fit: cover`, `width: 100%`, `height: 100%`, `opacity: 0.15`, `filter: blur(20px)`
- Estado inicial: blur 20px
- Al añadirse `.pc-card.in`: `transition: filter 1.8s var(--ease-out), opacity 1.8s var(--ease-out)` → `filter: blur(0)`, `opacity: 0.22`
- Hover (desktop, min-width 961px): `opacity: 0.32`, `scale: 1.04`, transition 0.6s

### Coach360 signature overflow

El tile Coach360 (idx=0) es el flagship y merece un momento de asimetría:
- Su `.tile-bg` tiene `inset: -8%` (desborda 8% en los 4 lados)
- El card tiene `overflow: visible` solo para Coach360 (exception a la regla)
- Un pseudo `::after` con `position: absolute; inset: 0; overflow: hidden` contiene los elementos internos del card — el fondo se sale, el contenido no
- Visualmente, el vídeo del Coach360 se percibe "más grande que la caja"

### Asset mapping

| Tile | Asset | Tipo |
|---|---|---|
| Coach360 | `public/videos/empresas-bg.mp4` (fallback: `public/images/academy/empresas.jpeg`) | video muted loop |
| Training Camp | `public/images/academy/pro.jpeg` | img |
| J3 Adults | `public/images/academy/amateur.jpeg` | img |
| J3 Juniors | `public/images/academy/kids.jpeg` | img |
| J3PTV | `public/videos/play_1080.webm` | video muted loop |
| Business Plan | `public/images/academy/stage-group.jpeg` | img |
| J3 Experience | `public/videos/j3-brand-evolution.mp4` | video muted loop |
| J3 Partner | `public/images/j3/alquilavisual.jpg` | img |

Los `<video>` llevan `autoplay muted loop playsinline preload="metadata"`.

### Mobile

- Blur-into-focus mantenido (funciona bien)
- Sin hover
- Sin Coach360 overflow — en mobile todos los tiles son iguales
- Vídeos: reemplazados por el primer frame como imagen estática (poster) si el dispositivo tiene conexión lenta (heurística con `navigator.connection.effectiveType === "2g" || "slow-2g"`)

## 6. FooterClose (NUEVO)

**Propósito:** cierre cinemático antes del footer. El "fundido en gris" del film.

**Estructura:**
```tsx
<section className="footer-close">
  <h2 className="tagline">Optimizar · Automatizar · Escalar</h2>
  <div className="line" />
</section>
```

**Medidas y estilo:**
- Section: `padding-block: 18vh`, `background: #000`, `display: flex`, `flex-direction: column`, `align-items: center`, `gap: 40px`
- Tagline: `clamp(40px, 5vw, 72px)`, `font-weight: 900`, `letter-spacing: -1px`, gold gradient
- Line: `height: 1px`, `width: var(--line-progress, 0%)`, `max-width: 60%`, `background: linear-gradient(90deg, transparent, var(--g1), transparent)`, `transition: width 1.2s cubic-bezier(0.22, 1, 0.36, 1)`

**Scroll-linked line draw:**
- IntersectionObserver con `threshold: 0.4`
- Al entrar: set `--line-progress` a `60%` (la transition hace el resto)
- Al salir: revierte a `0%` (se redibuja cuando se vuelve)

**i18n:** usa la clave existente `home.closer` ("Optimizar · Automatizar · Escalar") — ya está en los 5 idiomas. Se reutiliza el texto del hero manifesto.

**Mobile:** `padding-block: 12vh`, tagline a `clamp(32px, 7vw, 52px)`, line max-width 80%.

## Archivos afectados

**Crear:**
- `src/components/CatalogIntro.tsx` — numeral + label
- `src/components/FooterClose.tsx` — tagline + línea
- `src/hooks/useScrollScrub.ts` — hook con preload + canvas scrubbing

**Modificar:**
- `src/components/Navbar.tsx` — scroll listener + clase condicional
- `src/components/HeroSection.tsx` — integrar `useScrollScrub` post-entrada
- `src/components/SponsorsBanner.tsx` — top padding extra + stagger reveal de logos
- `src/components/ProductsGrid.tsx` — añadir `.tile-bg` en cada tile + mapping de assets + Coach360 overflow exception
- `src/app/page.tsx` — insertar `<CatalogIntro />` entre `<SponsorsBanner />` y `<ProductsGrid />`, insertar `<FooterClose />` entre `<ProductsGrid />` y `<Footer />`
- `src/app/globals.css` — añadir estilos base de `.tile-bg`, `.catalog-intro`, `.footer-close`, `.navbar-scrolled`

**Añadir i18n:**
- `src/i18n/dictionaries/types.ts` — nueva clave `home.catalogIntro.label: string`
- `src/i18n/dictionaries/es.ts`, `en.ts`, `fr.ts`, `sv.ts`, `pt.ts` — valores traducidos

## Criterios de éxito

- La página se siente significativamente más cinematográfica sin haber cambiado el contenido
- El scroll scrubbing del hero funciona en desktop sin jank (60fps sostenidos en Chrome)
- Los tiles con vídeos no degradan la performance — el LCP no empeora más de 200ms respecto al estado actual
- `prefers-reduced-motion` respetado en todos los movimientos
- Mobile mantiene la estructura sin scrubbing ni Coach360 overflow
- Sin links rotos, sin regresiones en los productos "Soon"
- Typecheck + lint + build 0 errores en los archivos creados/modificados
