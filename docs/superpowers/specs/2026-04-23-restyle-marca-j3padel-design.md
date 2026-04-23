# Restyle de marca J3Padel — Diseño

**Fecha:** 2026-04-23  
**Proyecto:** mi-clon (Next.js, Tailwind v4, shadcn/ui)  
**Alcance:** Sustitución completa de la paleta de color — tokens CSS, componentes y logo

---

## 1. Nueva paleta oficial

| Nombre | HEX | Uso principal |
|---|---|---|
| Verde Academia | `#1B3D2F` | Navbar, hero, secciones oscuras |
| Champán | `#C9A96E` | Acento universal (botones, badges, "3" del logo) |
| Crema | `#F8F5EF` | Fondos claros, secciones de contenido |
| Negro verdoso | `#0E1C16` | Footer, overlays, fondo más profundo |

---

## 2. Estructura de tema — Híbrido claro/oscuro

La web alterna secciones oscuras y claras siguiendo este patrón:

- **Navbar:** fondo Verde Academia, logo con "J/PADEL" en Crema y "3" en Champán
- **Hero:** fondo Verde Academia, headline principal en Champán, subtítulo en Crema 60% opacidad
- **Secciones de contenido:** fondo Crema (`#F8F5EF`), tarjetas en blanco puro (`#fff`), texto principal en Verde Academia
- **Secciones destacadas alternadas:** fondo Verde Academia, texto en Crema, acento en Champán
- **Footer:** fondo Negro verdoso (`#0E1C16`), texto en Crema, logo con "3" en Champán

---

## 3. Sistema de tokens CSS — Mapeo exacto

Todos los cambios se aplican en `src/app/globals.css` dentro del bloque `:root` y `@theme`.

### Tokens existentes a modificar

| Token | Valor actual | Valor nuevo |
|---|---|---|
| `--bk` | `#000` | `#0E1C16` |
| `--bk2` | `#0a0a0a` | `#0E1C16` |
| `--bk3` | `#111` | `#1B3D2F` |
| `--g1` | `#dcaf64` | `#C9A96E` |
| `--g2` | `#eede80` | `#d4b882` |
| `--g3` | `#fff1b4` | `#e8d4a8` |
| `--wh` | `#f5f5f7` | `#F8F5EF` |

### Gradiente — eliminar el degradado, reemplazar por sólido

```css
/* Antes */
--j3-grad: linear-gradient(110deg, #dcaf64, #eede80 55%, #fff1b4);
--j3-grad-r: linear-gradient(280deg, #dcaf64, #eede80 55%, #fff1b4);

/* Después — Champán sólido */
--j3-grad: #C9A96E;
--j3-grad-r: #C9A96E;
```

### Nuevos tokens a añadir

```css
--verde: #1B3D2F;
--champan: #C9A96E;
--crema: #F8F5EF;
--negro-v: #0E1C16;
--section-border: rgba(201, 169, 110, 0.2);
```

---

## 4. Logo J3 — Sistema adaptativo

El "3" es siempre en **Champán** (`#C9A96E`) en todos los contextos. Las letras "J" y "PADEL" se adaptan al fondo:

| Contexto | J / PADEL | 3 |
|---|---|---|
| Fondo oscuro (Verde / Negro verdoso) | `#F8F5EF` (Crema) | `#C9A96E` (Champán) |
| Fondo claro (Crema / blanco) | `#1B3D2F` (Verde Academia) | `#C9A96E` (Champán) |

Implementación: el Navbar usa clases `text-[#F8F5EF]` para "J" y "PADEL" con `text-[#C9A96E]` para el "3". Las versiones sobre fondo claro (si aparece el logo en tarjetas o footer alternativo) usan `text-[#1B3D2F]` para "J" y "PADEL".

---

## 5. Detalles de acabado

### Headline hero en Champán
El título principal del hero (`<h1>`) usa `color: var(--champan)` en lugar de blanco/crema. El resto de texto en el hero (eyebrow, subtítulo, tagline) sigue en Crema (`#F8F5EF`) al 60% de opacidad.

### Línea de separación entre secciones
Cada sección lleva `border-bottom: 1px solid var(--section-border)` (`rgba(201,169,110,0.2)`). Invisible a distancia, pero añade ritmo visual y conecta las secciones con el color de acento.

---

## 6. Tema claro/oscuro (data-theme)

El sitio mantiene soporte para `data-theme="light"` y `data-theme="dark"`. Bajo el nuevo sistema:

- **dark (default):** backgrounds usan `--bk` (`#0E1C16`) y `--bk3` (`#1B3D2F`)
- **light:** backgrounds usan `--wh` (`#F8F5EF`), textos en `#1B3D2F`

Las clases `.theme-text`, `.theme-text-muted`, `.theme-border` no requieren cambios de lógica — solo los valores de los tokens cambian.

---

## 7. Animaciones — ajuste de color

Las animaciones actuales usan el gold `#dcaf64` hardcodeado en keyframes:
- `j3-heartbeat` — pulso en CTA hover
- `j3-circle-pulse` — pulso en nav hover
- `cardHighlight` — glow en tarjetas

Todas se actualizan a `#C9A96E` (Champán). Los `box-shadow` y `text-shadow` con referencias al oro también se sustituyen.

---

## 8. Archivos a modificar

| Archivo | Qué cambia |
|---|---|
| `src/app/globals.css` | Tokens CSS, gradientes, keyframes — **cambio principal** |
| `src/components/Navbar.tsx` | Color del "3" en el logo |
| `src/components/Footer.tsx` | Color del "3" en el logo, fondo a `#0E1C16` |
| `src/components/FooterClose.tsx` | Mismo ajuste que Footer |

El resto de componentes hereda los cambios automáticamente a través de los tokens CSS.

---

## 9. Lo que NO cambia

- Tipografía: Roboto Condensed + Instrument Serif se mantienen
- Estructura de páginas y componentes
- Sistema de rutas y datos
- Animaciones GSAP (solo el color de acento cambia)
- Lógica de tema claro/oscuro
