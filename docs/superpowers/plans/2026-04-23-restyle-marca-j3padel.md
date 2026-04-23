# Restyle de marca J3Padel — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sustituir la paleta de color completa de la web J3Padel — de negro/oro a verde-academia/champán/crema/negro-verdoso — siguiendo el spec aprobado en `docs/superpowers/specs/2026-04-23-restyle-marca-j3padel-design.md`.

**Architecture:** El cambio se centraliza en `src/app/globals.css` (tokens CSS + colores hardcodeados + keyframes). Ajustes puntuales en `Navbar.tsx`, `Footer.tsx` y archivos SVG del logo en `public/images/`. El resto de componentes hereda automáticamente mediante los tokens CSS.

**Tech Stack:** Next.js 16, Tailwind CSS v4, CSS custom properties en `:root`, archivos SVG estáticos.

---

## Mapeo de colores de referencia

| Antes | Después | Uso |
|---|---|---|
| `#dcaf64` / `rgba(220, 175, 100, ...)` | `#C9A96E` / `rgba(201, 169, 110, ...)` | Oro → Champán |
| `#eede80` | `#d4b882` | Oro claro → Champán claro |
| `#fff1b4` | `#e8d4a8` | Oro blanco → Champán crema |
| `#f0d080` | `#dfc28a` | Oro hover → Champán hover |
| `#b8943e` | `#C9A96E` | Oro oscuro → Champán |
| `#000` / `#0a0a0a` / `#0a0a0b` / `#111` | `#0E1C16` / `#1B3D2F` | Negros → Negro verdoso / Verde Academia |
| `#f5f5f7` / `#fff` (fondos claros) | `#F8F5EF` | Blanco frío → Crema |
| `rgba(0, 0, 0, 0.72)` navbar blur | `rgba(27, 61, 47, 0.85)` | Navbar scrolled → Verde blur |

---

## Task 1: Actualizar tokens CSS en globals.css

**Files:**
- Modify: `src/app/globals.css:31-50`

- [ ] **Step 1: Reemplazar el bloque `:root` completo**

Sustituir las líneas 31–50 (bloque `:root`) con:

```css
:root {
  /* J3Pádel Design Tokens — Nueva paleta 2026 */
  --g1: #C9A96E;
  --g2: #d4b882;
  --g3: #e8d4a8;
  --j3-grad: #C9A96E;
  --j3-grad-r: #C9A96E;
  --bk: #0E1C16;
  --bk2: #0E1C16;
  --bk3: #1B3D2F;
  --gy: #6e6e73;
  --gy2: #a1a1a6;
  --gy3: #d1d1d6;
  --wh: #F8F5EF;

  /* Nuevos tokens de marca */
  --verde: #1B3D2F;
  --champan: #C9A96E;
  --crema: #F8F5EF;
  --negro-v: #0E1C16;
  --section-border: rgba(201, 169, 110, 0.2);

  /* Custom easing curves */
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

- [ ] **Step 2: Verificar que el servidor de desarrollo compila sin errores**

```bash
cd mi-clon && npm run dev
```
Expected: Sin errores de compilación en terminal.

- [ ] **Step 3: Commit**

```bash
cd mi-clon && git add src/app/globals.css && git commit -m "style: update CSS design tokens to new brand palette"
```

---

## Task 2: Reemplazar valores rgba del oro en globals.css

**Files:**
- Modify: `src/app/globals.css`

Todos los `rgba(220, 175, 100, ...)` → `rgba(201, 169, 110, ...)`. Hay aproximadamente 40 ocurrencias. Hacer una sustitución global en el archivo.

- [ ] **Step 1: Reemplazar todas las ocurrencias de `rgba(220, 175, 100,`**

En `src/app/globals.css`, reemplazar TODAS las ocurrencias (usar replace_all o sed):

```
rgba(220, 175, 100,  →  rgba(201, 169, 110,
```

Esto afecta a: `.j3-hero-cta`, `@keyframes j3-heartbeat`, `@keyframes j3-circle-pulse`, `.j3-pnav-circle`, `.j3-cta-active`, `[data-card-id]:hover`, `@keyframes cardHighlight`, `.hero-claim-word.inactive`, `.hero-orbital-arc path`, `.hero-orbital-arc-progress`, `.hero-orbital-active`, `.hero-orbital-small-watermark`, `.hero-orbital-mobile-card`, `.hero-orbital-small-watermark`, `.home-map-hq-halo`, `.home-map-hq-pin`, `.home-map-pill-popup`, `.home-map-pill-cta:hover`, `.coach-profile-*`, `.hero-shimmer-bar`, `body scrollbar-color`, `::selection`, `:focus-visible`, `.leaflet-marker-icon:focus-visible`, `.j3-input:focus`, `.btn-glow`, `.footer-close-manifesto`, `.story-teaser-eyebrow`, `.proximamente-eyebrow`, `.academy-scroller-eyebrow`.

- [ ] **Step 2: Reemplazar `rgba(220,175,100,` (sin espacios, variante compacta)**

Buscar y reemplazar en el archivo — algunas referencias usan formato sin espacios:
```
rgba(220,175,100,  →  rgba(201,169,110,
```

Verificar en: `Navbar.tsx`, `Footer.tsx` (línea con el glow radial del footer), y en `globals.css` sección de `.navbar-scrolled`, `.floating-cta`.

- [ ] **Step 3: Verificar build**

```bash
cd mi-clon && npm run build 2>&1 | tail -20
```
Expected: `Route (app)` table visible, sin errores TypeScript.

- [ ] **Step 4: Commit**

```bash
cd mi-clon && git add src/app/globals.css src/components/Navbar.tsx src/components/Footer.tsx && git commit -m "style: replace hardcoded gold rgba to Champán rgba"
```

---

## Task 3: Reemplazar hex y valores restantes en globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Reemplazar el color del stroke del mapa**

En la clase `.home-map-curve` (línea ~1379), cambiar:
```css
stroke: #dcaf64;
```
Por:
```css
stroke: #C9A96E;
```

- [ ] **Step 2: Reemplazar `#f0d080` (hover dorado de los puntos del mapa)**

Buscar todas las ocurrencias de `#f0d080` en `globals.css`. Reemplazar por `#dfc28a`.

Afecta a: `.home-map-dot--verified:hover` y `.home-map-dot--qualified:hover`.

- [ ] **Step 3: Reemplazar el color del acento manifesto**

En `.home-manifesto-accent`:
```css
color: #8a6d2a;
```
Por:
```css
color: #C9A96E;
```

- [ ] **Step 4: Reemplazar `#f0c478` en focus de Leaflet**

En las reglas de `.j3-legend a:focus-visible`:
```css
outline: 2px solid #f0c478;
```
Por:
```css
outline: 2px solid #dfc28a;
```

- [ ] **Step 5: Actualizar `navbar-scrolled` al Verde Academia**

En la clase `.navbar-scrolled` (línea ~903):
```css
/* Antes */
.navbar-scrolled {
  background-color: rgba(0, 0, 0, 0.72) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: rgba(212, 169, 74, 0.08) !important;
}

/* Después */
.navbar-scrolled {
  background-color: rgba(27, 61, 47, 0.85) !important;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: rgba(201, 169, 110, 0.15) !important;
}
```

- [ ] **Step 6: Actualizar fondos de tarjetas oscuras (#0a0a0b → #0E1C16)**

Buscar todas las ocurrencias de `#0a0a0b` en `globals.css`. Reemplazar por `#0E1C16`.

Afecta a: `.hero-orbital-active`, `.hero-orbital-small`, `.hero-orbital-mobile-card`, `.academy-scroller-card`, `.coach-profile-related-card`.

- [ ] **Step 7: Actualizar fondo de secciones oscuras hardcodeadas**

Buscar secciones con `background: #000` explícito (no via variable):
- `.story-teaser { background: #000; }` → `background: var(--bk);`
- `.footer-close { background: #000 }` → `background: var(--bk);` (ya era `#000`, ahora hereda negro-v)
- `.proximamente-header { background: #000; }` → `background: var(--bk);`
- `.academy-scroller { background: #000; }` → `background: var(--bk);`
- `.coach-profile { background: #000; }` → `background: var(--bk);`
- `#coach-finder .leaflet-container { background: #0a0a0a; }` → `background: var(--bk);`

- [ ] **Step 8: Actualizar fondo del manifesto (blanco → crema)**

En `.home-manifesto`:
```css
background: #fff;
```
→
```css
background: var(--wh);
```

En `.academy-scroller-card-img`:
```css
background: #111;
```
→
```css
background: var(--bk3);
```

- [ ] **Step 9: Commit**

```bash
cd mi-clon && git add src/app/globals.css && git commit -m "style: replace remaining hardcoded hex colors to new palette"
```

---

## Task 4: Convertir gradientes dorados a Champán sólido

**Files:**
- Modify: `src/app/globals.css`

Los siguientes elementos usan `linear-gradient(... var(--g1) ... var(--g2) ...)`. Con tokens actualizados g1 y g2 serían Champán y Champán-claro, produciendo un degradado. Según el diseño aprobado, deben ser sólidos.

- [ ] **Step 1: Convertir `.coach-profile-cta` a sólido**

Buscar `.coach-profile-cta` (línea ~1237). Cambiar:
```css
background: linear-gradient(135deg, var(--g1), var(--g2));
```
Por:
```css
background: var(--champan);
```
Y en `.coach-profile-cta:hover`, quitar el `box-shadow` con `rgba(220, 175, 100, 0.4)` (ya sustituido por Task 2) y cambiar color del texto de `#0a0a0a` a `#0E1C16`.

- [ ] **Step 2: Convertir `.floating-cta` a sólido**

Buscar `.floating-cta` (línea ~1755). Cambiar:
```css
background: linear-gradient(135deg, var(--g1), var(--g2));
```
Por:
```css
background: var(--champan);
```

- [ ] **Step 3: Convertir `.home-map-pill-cta` a sólido**

Buscar `.home-map-pill-cta` (línea ~1630). Cambiar:
```css
background: linear-gradient(135deg, var(--g1), var(--g2));
```
Por:
```css
background: var(--champan);
```

- [ ] **Step 4: Convertir `.footer-close-tagline` a texto sólido**

El tagline de cierre usa gradient-text. Cambiar:
```css
.footer-close-tagline {
  /* ... */
  background: linear-gradient(135deg, var(--g1) 0%, var(--g2) 45%, #b8943e 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  /* ... */
}
```
Por:
```css
.footer-close-tagline {
  /* ... */
  color: var(--champan);
  -webkit-text-fill-color: var(--champan);
  /* ... */
}
```
(Eliminar las propiedades `background`, `-webkit-background-clip`, `background-clip`, `-webkit-text-fill-color: transparent`.)

- [ ] **Step 5: Verificar build y commit**

```bash
cd mi-clon && npm run build 2>&1 | tail -20
```
Expected: Build exits 0 sin errores.

```bash
cd mi-clon && git add src/app/globals.css && git commit -m "style: convert gold gradient buttons/tagline to solid Champán"
```

---

## Task 5: Añadir separadores de sección

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Añadir `border-bottom` a las secciones principales**

Localizar las clases de sección que actúan como bloques principales de la página. Añadir `border-bottom: 1px solid var(--section-border)` a:

```css
/* Añadir a cada una de estas clases existentes */
.stmt-section { border-bottom: 1px solid var(--section-border); }
.sedes-section { border-bottom: 1px solid var(--section-border); }
.story-teaser  { border-bottom: 1px solid var(--section-border); }
.academy-scroller { border-bottom: 1px solid var(--section-border); }
.home-manifesto { border-bottom: 1px solid var(--section-border); }
```

Hacer esta adición dentro de la regla CSS existente de cada clase (no crear clases nuevas), por ejemplo:
```css
.stmt-section {
  background: var(--bk);
  transition: background-color 1.4s cubic-bezier(.16,1,.3,1);
  border-bottom: 1px solid var(--section-border); /* ← añadir */
}
```

- [ ] **Step 2: Commit**

```bash
cd mi-clon && git add src/app/globals.css && git commit -m "style: add Champán section separators"
```

---

## Task 6: Headline del hero en Champán

**Files:**
- Modify: `src/components/HeroOrbital.tsx` (o el componente que renderice el hero principal)

El spec indica que el título principal del hero (`<h1>`) debe usar Champán en lugar de blanco/crema.

- [ ] **Step 1: Localizar el headline del hero**

Abrir `src/components/HeroOrbital.tsx`. Buscar el elemento `<h1>` o el contenedor con las clases del título principal (probablemente usa clases Tailwind `text-[var(--wh)]` o `text-white`).

- [ ] **Step 2: Cambiar el color del headline a Champán**

Donde el título principal tenga `text-[var(--wh)]` o `text-white`:

```tsx
/* Antes */
className="... text-[var(--wh)] ..."

/* Después */
className="... text-[var(--champan)] ..."
```

Si usa clase `.hero-claim-word` sin color explícito (hereda blanco del body), añadir en `globals.css`:

```css
/* En .hero-claim-word (estado activo/visible, no .inactive) */
.hero-claim-word {
  color: var(--champan);
  /* mantener el resto de propiedades existentes */
}
```

El texto del eyebrow (label pequeño sobre el título), subtítulo y tagline mantienen Crema (`var(--wh)`) al 60% de opacidad — no cambiarlos.

- [ ] **Step 3: Commit**

```bash
cd mi-clon && git add src/components/HeroOrbital.tsx src/app/globals.css && git commit -m "style: hero headline color to Champán"
```

---

## Task 7: Actualizar Navbar.tsx

**Files:**
- Modify: `src/components/Navbar.tsx:121`

El `<nav>` tiene el fondo hardcodeado `#0a0a0b` para el estado en-hero.

- [ ] **Step 1: Cambiar el fondo del navbar en estado hero**

En la línea ~121:
```tsx
style={{ backgroundColor: offHero ? "transparent" : "#0a0a0b" }}
```
Por:
```tsx
style={{ backgroundColor: offHero ? "transparent" : "#1B3D2F" }}
```

- [ ] **Step 2: Actualizar el overlay del menú móvil**

En la línea ~338, el overlay del menú móvil:
```tsx
className={`fixed inset-0 z-[90] bg-black/95 backdrop-blur-[30px] ...`}
```
Por:
```tsx
className={`fixed inset-0 z-[90] backdrop-blur-[30px] ...`}
style={{ backgroundColor: "rgba(14, 28, 22, 0.97)" }}
```
O directamente como clase Tailwind con color arbitrario:
```tsx
className={`fixed inset-0 z-[90] bg-[rgba(14,28,22,0.97)] backdrop-blur-[30px] ...`}
```

- [ ] **Step 3: Actualizar el dropdown de idiomas**

En la línea ~230, el dropdown de idiomas tiene `bg-black/90`:
```tsx
className={`... bg-black/90 backdrop-blur-[20px] border border-white/[.08] ...`}
```
Por:
```tsx
className={`... bg-[rgba(14,28,22,0.95)] backdrop-blur-[20px] border border-white/[.08] ...`}
```

Mismo ajuste para el dropdown de idiomas mobile (~289).

- [ ] **Step 4: Verificar TypeScript**

```bash
cd mi-clon && npm run typecheck
```
Expected: Sin errores.

- [ ] **Step 5: Commit**

```bash
cd mi-clon && git add src/components/Navbar.tsx && git commit -m "style: update navbar background to Verde Academia"
```

---

## Task 8: Actualizar Footer.tsx

**Files:**
- Modify: `src/components/Footer.tsx:28-32`

El footer tiene un glow radial hardcodeado en un `style` inline.

- [ ] **Step 1: Actualizar el estilo inline del glow**

En las líneas ~28-32:
```tsx
style={{
  background:
    "linear-gradient(90deg, transparent, rgba(220,175,100,.2) 50%, transparent)",
}}
```
Por:
```tsx
style={{
  background:
    "linear-gradient(90deg, transparent, rgba(201,169,110,.2) 50%, transparent)",
}}
```

- [ ] **Step 2: Commit**

```bash
cd mi-clon && git add src/components/Footer.tsx && git commit -m "style: update footer glow to Champán"
```

---

## Task 9: Actualizar los archivos SVG del logo

**Files:**
- Modify: `public/images/j3padel-text-gold.svg`
- Modify: `public/images/j3-ball-gold.svg`
- Modify: `public/images/imagotipo-gold.svg`
- Modify: `public/images/j3padel-academy-horizontal.svg`

El logo actual tiene el "3" en `fill="#ffffff"` (blanco) y el resto en gradiente dorado. Según el diseño aprobado: "3" → Champán (`#C9A96E`), J/PADEL → Crema (`#F8F5EF`) o mantienen color claro. El gradiente SVG se actualiza a tonos Champán.

- [ ] **Step 1: Actualizar `j3padel-text-gold.svg`**

El archivo tiene una `<linearGradient id="tg">` con stops dorados. Actualizar:

```xml
<!-- Antes -->
<linearGradient id="tg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#dcaf64"/>
  <stop offset=".23" stop-color="#eddb7e"/>
  <stop offset=".29" stop-color="#fff1b4"/>
  <stop offset=".59" stop-color="#eede80"/>
  <stop offset=".78" stop-color="#deb065"/>
  <stop offset="1" stop-color="#dcaf64"/>
</linearGradient>

<!-- Después — Crema sólido para J/PADEL (más limpio sin gradiente) -->
```
Dado que el diseño aprobado usa Champán sólido (no gradiente), simplificar el gradiente a color sólido eliminando el `<linearGradient>` y usando `fill="#F8F5EF"` directamente en las letras J, P, A, D, E, L (los paths que usaban `fill="url(#tg)"`).

Para el "3" (actualmente `fill="#ffffff"`):
```xml
<!-- Antes -->
<path fill="#ffffff" d="M270.69..."/>
<!-- Después -->
<path fill="#C9A96E" d="M270.69..."/>
```

Resultado final del SVG: J/PADEL en `#F8F5EF`, 3 en `#C9A96E`. Eliminar el bloque `<defs>` completo si ya no se usa el gradiente.

- [ ] **Step 2: Actualizar `j3-ball-gold.svg`**

El ball tiene el mismo gradiente dorado. Actualizar los stops a Champán y cambiar el `fill="#000"` de los recortes interiores a `fill="#0E1C16"` para coherencia con el nuevo negro verdoso.

```xml
<!-- Gradiente → stops Champán -->
<stop offset="0" stop-color="#C9A96E"/>
<stop offset=".23" stop-color="#d4b882"/>
<stop offset=".29" stop-color="#e8d4a8"/>
<stop offset=".59" stop-color="#d4b882"/>
<stop offset=".78" stop-color="#b8a060"/>
<stop offset="1" stop-color="#C9A96E"/>

<!-- Recortes interiores -->
<!-- fill="#000" → fill="#0E1C16" -->
```

- [ ] **Step 3: Actualizar `imagotipo-gold.svg` y `j3padel-academy-horizontal.svg`**

Aplicar el mismo criterio: gradiente dorado → Champán sólido (`#C9A96E`) para accents, Crema (`#F8F5EF`) para letras principales, `#0E1C16` para recortes negros.

Para cada SVG: reemplazar los stops del `<linearGradient>` por el stop Champán, o directamente eliminar el gradiente y usar `fill="#C9A96E"` / `fill="#F8F5EF"` según corresponda.

- [ ] **Step 4: Verificar visualmente en el navegador**

```bash
cd mi-clon && npm run dev
```
Abrir `http://localhost:3000` y verificar que:
- El logo en el Navbar muestra "J3PADEL" con el "3" en tono cálido champán (no blanco ni dorado brillante)
- El logo del Footer se ve correctamente
- El ball icon en el centro del nav tiene el color actualizado

- [ ] **Step 5: Commit**

```bash
cd mi-clon && git add public/images/ && git commit -m "style: update SVG logos to Champán/Crema brand palette"
```

---

## Task 10: Verificación final y deploy

**Files:** ninguno nuevo

- [ ] **Step 1: Build de producción**

```bash
cd mi-clon && npm run check
```
Expected: lint + typecheck + build todos en verde, sin errores.

- [ ] **Step 2: Revisión visual en dev server**

```bash
cd mi-clon && npm run dev
```

Verificar página a página:
- `/` — Hero verde, sección de productos, mapa, manifesto
- `/academy` — Scroller de coaches
- `/coach/[slug]` — Perfil de entrenador
- `/story` — Sección de historia

Para cada página comprobar:
- Navbar: fondo Verde Academia, "3" en Champán
- Fondos de sección: alternancia verde/crema
- Botones: Champán sólido (no gradiente)
- Animaciones: glow en Champán en hover de CTAs y tarjetas
- Mapa: curvas y puntos en Champán

- [ ] **Step 3: Commit de cierre**

```bash
cd mi-clon && git add -A && git commit -m "style: complete brand restyle to Verde Academia / Champán / Crema palette"
```

- [ ] **Step 4: Push a master para deploy en Vercel**

```bash
cd mi-clon && git push origin master
```
Expected: Vercel recibe el push y despliega automáticamente.
