# Home Page — Design Spec
**Date:** 2026-04-21  
**Status:** Approved

## Objetivo

Rediseñar la home de J3Pádel como un escaparate de productos directo, estilo editorial de lujo (referencia: Chanel). El objetivo principal es la segmentación de audiencias mediante pixel: cada tile de producto dispara un evento de interés distinto. No hay copy explicativo — solo nombre, categoría y dirección.

## Estructura final (`page.tsx`)

```
Navbar
HeroSection        ← adaptado: añadir manifiesto overlay
SponsorsBanner     ← existente, sin cambios
ProductsGrid       ← componente nuevo
Footer             ← existente, sin cambios
```

Secciones eliminadas de la home: `AccentManifesto`, `CredentialsTimeline`, `ImpactSection`, `SystemReveal`, `HomeTextBlock`, `NosotrosSection`, `ContactoSection`.

## HeroSection (adaptación)

**Cambios respecto al actual:**
- Mantener la animación existente: cortina negra → vídeo/fondo → palabras en stagger → shimmer
- Añadir overlay bottom-right con el manifiesto:
  - "El juego **ha cambiado.**"
  - "El coach **evolucionado.**" (gold gradient)
  - "La gestión **optimizada.**"
  - Separador fino + "Optimizar · Automatizar · Escalar" en tracking ancho
- El manifiesto entra con fade-in después del shimmer (última fase de la animación)
- Texto pequeño (~14px light), no compite con el claim principal

**i18n:** añadir claves `hero.manifesto.line1/2/3` y `hero.manifesto.closer` en todos los idiomas.

## SponsorsBanner

Sin cambios. Posición: entre hero y ProductsGrid. Actúa como credibilidad antes del catálogo.

## ProductsGrid (componente nuevo)

Reemplaza `ProductsSection`. Grid 2 columnas, layout editorial oscuro/claro alternado.

### Tiles y orden

| Posición | Producto | Fondo | Estado | CTA |
|---|---|---|---|---|
| 1 (izq) | Coach360 | Dark, featured | Live | "Entrar →" |
| 2 (dcha) | Training Camp | Dark, featured + badge Premium | Live | "Reservar →" |
| — | Separador "Academy" | Franja full-width, 1px | — | — |
| 3 (izq) | J3 Adults | Dark | Live | "Entrar →" |
| 4 (dcha) | J3 Juniors | Light | Live | "Entrar →" |
| 5 (izq) | J3PTV | Light | Soon | "Próximamente" |
| 6 (dcha) | Business Plan | Dark | Soon | "Próximamente" |
| 7 (full) | J3 Experience | Dark | Soon | "Próximamente" |
| 8 (full) | J3 Partner | Light | Soon | "Próximamente" |

### Visual por tile

- **Tag:** 10px, tracking 3.5px, uppercase — categoría del producto
- **Título:** clamp(34px–52px), font-weight 900, uppercase, tracking −2px
  - Primera parte: gold gradient (J3, Coach, Training, Business, J3P)
  - Segunda parte: blanco en dark / `#1d1d1f` en light
- **For:** 10px, tracking 2px, uppercase — audiencia objetivo (para pixel)
- **CTA:** flecha `→` con gap animado en hover, sin botón contenedor
- **Watermark:** letra grande fondo, opacity 0.018 → 0.04 en hover
- **Featured tiles:** línea superior dorada al 100%, fondo `rgba(212,169,74,0.04)`
- **Badge Premium:** pill dorado en Training Camp

### Interacciones (heredadas de ProductsSection existente)

- **Entrada:** stagger reveal por IntersectionObserver, delay 80ms por tile
- **Hover desktop:** 3D tilt perspective(800px) rotateX/Y ±4°, scale 1.01
- **Hover glow:** radial gradient dorado siguiendo el cursor
- **Top accent line:** se expande de 0% → 100% en hover (0.5s ease)
- **CTA gap:** 10px → 16px en hover (0.2s)

### Separador de sección Academy

Franja full-width entre Training Camp y Adults:
- Altura ~40px, padding horizontal 48px
- Texto: "Academy · También disponible para" — 9px, tracking 4px, uppercase, `rgba(255,255,255,0.18)`
- Background: `rgba(255,255,255,0.01)`
- Border-bottom: `rgba(255,255,255,0.06)`

## i18n

Añadir en todos los idiomas (es, en, fr, sv, pt):
- `hero.manifesto.line1` → "El juego"
- `hero.manifesto.line1bold` → "ha cambiado."
- `hero.manifesto.line2` → "El coach"
- `hero.manifesto.line2bold` → "evolucionado." (gold)
- `hero.manifesto.line3` → "La gestión"
- `hero.manifesto.line3bold` → "optimizada."
- `hero.manifesto.closer` → "Optimizar · Automatizar · Escalar"
- `products.trainingCamp.*`, `products.adults.*`, `products.juniors.*` — tag, name, for, cta

## Hrefs por producto

| Producto | href | Notas |
|---|---|---|
| Coach360 | `https://j3padel.com/join` | Externo, target _blank |
| Training Camp | `/academy` | Hasta que haya sub-ruta propia |
| J3 Adults | `/academy` | Hasta que haya sub-ruta propia |
| J3 Juniors | `/academy` | Hasta que haya sub-ruta propia |
| J3PTV | `#` deshabilitado | Sin href activo |
| Business Plan | `#` deshabilitado | Sin href activo |
| J3 Experience | `#` deshabilitado | Sin href activo |
| J3 Partner | `#` deshabilitado | Sin href activo |

## Criterios de éxito

- Sin links rotos en el lanzamiento (productos "soon" no tienen href activo)
- El pixel puede asociar eventos click/hover a cada tile individualmente
- La página funciona correctamente en mobile (single column)
- Mantiene las animaciones premium ya construidas
