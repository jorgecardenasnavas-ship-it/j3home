# Hero Orbital — Design Spec

**Date:** 2026-04-22
**Status:** Approved

## Objetivo

Transformar el hero de exhibición estática de tipografía a un mecanismo dinámico que combina:
- Un carousel radial de 8 productos orbitando a la derecha
- El claim PLAY. / COACH. / MANAGE. a la izquierda reaccionando en vivo — solo la palabra que corresponde a la audiencia del producto activo está iluminada

El claim deja de ser decoración tipográfica y se vuelve el índice contextual del producto que se está mostrando. Efecto futurista con función real: "estos son los mundos por los que J3 te acompaña, según quién seas".

## Mapeo producto → audiencia

| Producto | Audiencia |
|---|---|
| Coach360 | Coach |
| Training Camp | Play |
| J3 Adults | Play |
| J3 Juniors | Play |
| J3PTV | Play |
| Business Plan | Manage |
| J3 Experience | Manage |
| J3 Partner | Manage |

## Layout (desktop ≥961px)

- Hero: 58vh, min-h 460px (sin cambios respecto al actual)
- Dos columnas:
  - **Izquierda 45%**: claim (PLAY. / COACH. / MANAGE. stacked)
  - **Derecha 55%**: área orbital

### Claim

- Palabra activa: oro gradiente (`.j3-grad-text`), opacity 1
- Palabras inactivas: solo stroke (outline, igual que `.j3-stroke-gold` actual), opacity 35%
- Crossfade al cambiar: 500ms, curve `cubic-bezier(0.22,1,0.36,1)`
- El cambio del claim ocurre **200ms DESPUÉS** de que empieza la rotación, para que visualmente el nuevo activo aparezca primero y luego la palabra reaccione

### Geometría del orbital

- **Semicírculo vertical abierto hacia la izquierda** (opción B del brainstorm)
- Centro del arco: ~30% desde el borde derecho del hero
- Radio: ~45% de la altura del hero
- El arco recorre de arriba-derecha a abajo-derecha, con la activa al punto izquierdo del semicírculo (pegada al claim)
- Línea visible del arco: 1px oro 15% opacity, uniendo los centros de las cards pequeñas

## Cards

### Card activa (1 slot, pegada al claim)

- **Tamaño**: 220×240px (reducida desde 300 de altura para caber con aire en el hero de 460px min-height)
- **Contenido**:
  - Título del producto (32-40px, bold, primera parte en oro gradiente ej. "Training Camp")
  - CTA ("Entrar →", "Reservar →", etc., 11px bold uppercase oro)
- **Sin tag superior, sin línea de audiencia**: ese rol lo cumple ya el claim (PLAY/COACH/MANAGE indica la audiencia)
- **Fondo**: mismo asset que la tile correspondiente en `ProductsGrid`, a 28-35% opacity, con blur-into-focus al aparecer
- **Borde**: 1px oro 35% opacity
- **Lazy-load**: solo se precargan los assets de la card activa + las 2 siguientes en la cola. El resto se carga cuando toca mostrarse (ahorra peso en la carga inicial)

### Cards pequeñas (7 en el arco)

- **Tamaño**: 60×80px
- **Contenido**:
  - Watermark (arriba): letras (C360, TC, ADT, JNR, TV, BIZ, EXP, PTR), 10px, tracking ancho, oro 45% opacity
  - Nombre (debajo): 8px, white/40, 1-2 líneas (ej. "Coach 360", "Training", "Adults")
- **Borde**: 1px 15% opacity
- **Sin color coding de audiencia**: la audiencia se comunica a través del claim, no de las cards
- **Hover (desktop)**: scale 1.1, borde al 40% opacity, auto-advance pausa
- **Click (desktop + mobile)**: salta a esa card (direct swap — ver sección Motion)

### Arco y progress indicator

- Arco visual: 1px oro 15% opacity, como línea continua curva uniendo centros de las 7 cards pequeñas
- **Segmento de progreso**: el tramo del arco entre la card activa y la siguiente en la rotación se rellena con oro sólido a lo largo de los 4s del timer
- Al completarse el relleno = rotación. Se resetea al segmento entre la nueva activa y la siguiente

## Motion

### Auto-advance (desktop)

- Intervalo: 4s entre rotaciones
- **Solo 2 cards animan por rotación** (no las 8):
  - La activa que sale encoge a su slot del arco (800ms)
  - La siguiente card crece al slot activo (800ms)
  - Las otras 6 no se mueven
- Curve: `cubic-bezier(0.22, 1, 0.36, 1)`
- Si la nueva card es de la misma audiencia que la anterior, el claim NO cambia

### Click-to-jump

- Direct swap sin rotar el anillo entero: la activa encoge a su slot, la clickeada crece al slot activo
- Ambas animaciones en paralelo (800ms)
- El timer auto-advance se pausa. Solo reanuda al salir del área del orbital completo (mouseleave sobre el contenedor), tras delay de 2s

### Hover

- En cualquier card (activa o pequeña): auto-advance pausa
- Al salir del área del orbital: reanuda tras 2s
- En card pequeña: scale 1.1 + borde al 40%

## Entrada en carga inicial

Preserva la animación cinemática actual del hero (curtain → palabras stagger → shimmer). Tras el final del stagger de palabras del claim (`wordsEnd + 200ms`):

1. Arco: se dibuja el trazo continuo de la línea (800ms, top a bottom)
2. Cards pequeñas: stagger de entrada, 120ms entre cada, fade + scale 0.9→1 (total ~1s para las 7)
3. Card activa: crece al tamaño grande + su asset aparece con blur-into-focus (500ms)

Total post-claim: ~2s de revelado del orbital.

## Orden inicial del anillo

Alternando audiencias al máximo para que cada rotación cambie la palabra iluminada del claim. Distribución: 4 Play / 1 Coach / 3 Manage. Sequence clockwise desde activa:

1. **Training Camp** (Play) — ACTIVA AL INICIO
2. Coach360 (Coach)
3. J3 Adults (Play)
4. Business Plan (Manage)
5. J3 Juniors (Play)
6. J3 Experience (Manage)
7. J3PTV (Play)
8. J3 Partner (Manage)

Transiciones del claim al rotar: PLAY → COACH → PLAY → MANAGE → PLAY → MANAGE → PLAY → MANAGE → (loop a PLAY). 8 transiciones, todas cambian palabra — máximo dinamismo del claim.

## Mobile (<961px)

El orbital radial no cabe ni se lee en mobile. Se adapta conceptualmente preservando el mecanismo claim↔card.

### Layout mobile

- Hero: 65vh (sube desde 58vh para dar espacio)
- Stack vertical:
  - Claim arriba (full-width)
  - Carrusel de cards debajo (full-width)

### Carrusel mobile

- Horizontal snap-scroll, **una card visible a la vez** (full-width)
- **Auto-advance OFF** (los timers chocan con el dedo del usuario)
- Swipe izquierda = siguiente, swipe derecha = anterior
- Dots indicator debajo: 8 puntos, uno oro activo, resto white 20% opacity
- **Hint una vez por carga de página**: tras completar la entrada del carrusel, la card activa hace un nudge 30px a la izquierda y vuelve (150ms) para indicar que se puede deslizar. Se ejecuta una sola vez por page load (no se persiste entre sesiones, pero no se repite al rotar)
- El claim reacciona 200ms después de que la card centrada cambie, igual que en desktop

## Accesibilidad

- **Keyboard**:
  - Tab navega por las cards pequeñas en orden clockwise desde la activa
  - Enter/Space sobre una card pequeña la activa (salta a slot activo)
  - Focus visible: ya existe en globals.css (`:focus-visible` con outline oro 2.5px)
- **ARIA**:
  - Contenedor del orbital: `role="region" aria-roledescription="carousel" aria-label="Catálogo de productos"`
  - Cada card pequeña: `role="button" aria-label="{nombre del producto}, audiencia {Play/Coach/Manage}"`
  - Live region: `aria-live="polite"` que anuncia la card activa cuando cambia
- **prefers-reduced-motion**:
  - Orbital congelado en la card inicial (J3 Adults)
  - Auto-advance OFF
  - Sin crossfades de claim
  - El claim muestra solo el estado de la audiencia inicial (PLAY activa, las otras con stroke)

## Archivos afectados

**Crear**:
- `src/components/HeroOrbital.tsx` — componente del carousel radial (arco SVG, cards, lógica de rotación)
- `src/components/HeroClaim.tsx` — extracción del claim del hero, recibe prop `activeAudience` para saber qué palabra iluminar
- `src/hooks/useOrbital.ts` — estado (activeIndex, timer, pause), interval logic, hover pause

**Modificar**:
- `src/components/HeroSection.tsx` — reestructura para usar `<HeroClaim activeAudience={...} />` + `<HeroOrbital onAudienceChange={...} />`, sincronización de estado entre ambos
- `src/app/globals.css` — clases nuevas para orbital, arc, cards, claim states, reglas reduced-motion

**Opcional**:
- `src/data/home-products.ts` — extracción del array de productos (hoy duplicado en memoria de `ProductsGrid.tsx`) para que ambos componentes lo consuman. Cada entrada con campo `audience: "play" | "coach" | "manage"` añadido.

## Criterios de éxito

- Al cargar la home: claim grande con una palabra iluminada, las otras en stroke al 25%. A la derecha, orbital con activa grande + 7 pequeñas en el arco
- Cada 4s: swap entre activa y siguiente. Claim reacciona 200ms después
- Hover pausa, click salta, mouseleave reanuda
- Mobile: claim arriba, carrusel abajo, swipe manual, dots indicator
- Keyboard + screen reader funcionales
- `prefers-reduced-motion` respetado
- No regresiones de performance (LCP no empeora más de 200ms respecto al estado actual)
- La rejilla de productos (`ProductsGrid`) y el footer siguen funcionando tal cual — este feature vive dentro del hero sin afectar nada más
