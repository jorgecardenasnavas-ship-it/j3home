# Red J3 · Scroll-Killer · Design

**Fecha:** 2026-04-16
**Autor:** Jorge Cárdenas (CSO J3Padel) + Claude
**Estado:** Approved — pendiente de implementación
**Ámbito:** `src/app/academy/**`, `src/components/NetworkMap.tsx`, `src/data/coaches.ts`, diccionarios i18n

---

## Problema

La sección **Red J3** de `/academy` genera sensación de scroll infinito:

- Mobile: los 17 coaches en una columna convierten la sección en una lista interminable.
- Desktop: el grid 3×n también es demasiado denso; rompe el ritmo de la página y diluye la narrativa (método → niveles → equipo → pistas → **red** → método J3 → CTA).
- Interacción actual del mapa: al clicar un pin se hace scroll al grid + halo gold. Útil pero saca al usuario del contexto del mapa y refuerza la sensación de listado largo.

## Objetivos

1. **Matar el scroll infinito** en `/academy` sin perder la demostración de alcance (mapa + coaches).
2. **Crear un catálogo navegable** (`/academy/coaches`) que escale a 100+ coaches con URLs compartibles/indexables.
3. **Mejorar la interacción mapa→info** — el pin clic muestra la ficha sin desplazar al usuario.
4. **Introducir una palanca de retención Coach360** — orden por antigüedad dentro de cada tier.

## No-objetivos

- Sistema de búsqueda por texto libre (nombre, club). Queda para más adelante.
- Página de perfil individual `/academy/coaches/[slug]`. Queda para cuando los coaches tengan contenido propio (vídeos, bio larga, calendario). Por ahora, toda conversión pasa por el chatbot J3.
- Admin/CMS para gestionar coaches. Dataset sigue siendo estático en `src/data/coaches.ts`.
- Paginación del catálogo. Con 17 coaches y espacio para crecer hasta ~50 no hace falta. Se añadirá cuando superemos esa cifra.

---

## Arquitectura

### Rutas

```
/academy                       → presentación (home de la academia)
  └─ sección Red J3            → 6 destacados desktop / 3 mobile + CTA "Ver los N coaches"
/academy/coaches               → NUEVA · catálogo completo indexable
  └─ query params              → ?country=es&language=es&specialty=juniors
```

### Componentes

| Archivo | Rol | Cambio |
|---|---|---|
| `src/app/academy/page.tsx` | Home academia | Reducir `NetworkSection` a 6/3 destacados + CTA ver todos |
| `src/app/academy/coaches/page.tsx` | Catálogo completo | **NUEVO** — client component con filtros por URL |
| `src/components/NetworkMap.tsx` | Mapa Leaflet | Popup enriquecido (foto + info + CTA chat), sin scroll al grid |
| `src/components/CoachCard.tsx` | Card reutilizable | Sin cambios |
| `src/components/FilterSelect.tsx` | Filtro dropdown | **NUEVO** — extraído de `academy/page.tsx` para reutilizar en la página dedicada |
| `src/data/coaches.ts` | Dataset | `+ joinedAt: string` por coach, `+ sortCoaches()` helper |
| `src/i18n/dictionaries/es.ts` (+ 4 idiomas) | i18n | Nuevas keys (ver sección i18n) |

### Flujo de datos

```
COACHES (data/coaches.ts)
    │
    ├─ sortCoaches(COACHES)        ← tier → joinedAt asc
    │      │
    │      ├─ /academy (NetworkSection)
    │      │     ├─ filtered = applyFilters(sorted, {country, language, specialty})
    │      │     ├─ display6 = preferFeatured(filtered, 6)
    │      │     │             · sin filtros: filtered.filter(featured).slice(0,6)
    │      │     │             · con filtros, featured dentro queda <6:
    │      │     │               completa con no-featured para llegar a 6
    │      │     │             · con filtros, 0 resultados: empty state
    │      │     │             (mobile usa 3 en vez de 6)
    │      │     └─ CTA "Ver los {filtered.length} coaches" → /academy/coaches?<params>
    │      │
    │      └─ /academy/coaches (CoachesCatalogPage)
    │            ├─ searchParams → filterState
    │            ├─ filtered = applyFilters(sorted, filterState)
    │            └─ render todos con grid responsive
```

---

## Interacciones

### Mapa (desktop y mobile)

**Antes:** Click en pin → scroll al grid + halo gold 2.6s en la card correspondiente.

**Ahora:** Click en pin → popup Leaflet enriquecido. No hay scroll. El grid de abajo queda como descubrimiento secundario, no como respuesta al mapa.

**Contenido del popup:**

```
┌─────────────────────────────────┐
│ [foto40] Jordi Cárdenas         │  ← foto circular, borde gold si HQ
│          Director técnico       │
│          Málaga · España 🇪🇸    │
│                                 │
│ Club J3 HQ · Málaga             │
│ [ES] [EN]                       │  ← chips idiomas
│                                 │
│ [  Pregunta a J3  ]             │  ← btn gold, dispara j3:chat:open
└─────────────────────────────────┘
```

**Styling:** fondo `#0a0a0a`, borde `rgba(220,175,100,.25)`, consistente con `ChatBubble` panel. Ancho ~260px. Implementación: string HTML dentro de `L.popup({ className: 'j3-popup' })` + CSS global en el mismo `dangerouslySetInnerHTML` que ya usa `NetworkMap`.

**Botón "Pregunta a J3":** dispara el mismo evento `j3:chat:open` que ya usa `CoachCard` — sin cambios en `ChatBubble`. Detalle técnico: como el popup se renderiza fuera del árbol React, el onClick va por `event delegation` (listener global en el `map` container que lee `data-coach-slug` del botón).

### `/academy` · sección Red J3

**Layout desktop (min 961px):**

```
Header (eyebrow + título + copy)
Hero HQ Málaga (video Finura)
──────────────────────────────
Mapa mundial (altura fija 480px)
──────────────────────────────
Filtros (país · idioma · especialidad · reset)
Grid 3×2 = 6 destacados
──────────────────────────────
CTA:
  · Sin filtros → "Ver los 17 coaches →"
  · Con filtros, ≤6 resultados → ocultar CTA (ya se ven todos)
  · Con filtros, >6 resultados → "Ver los X resultados completos →"
──────────────────────────────
Bloque Coach360 CTA (igual que hoy)
```

**Layout mobile (≤960px):**

Igual pero: mapa altura 360px, grid 1 columna × 3 destacados (no 6), filtros apilados, CTA siempre full-width.

**Selección de los 6 destacados:**

Coaches marcados `featured: true` en `src/data/coaches.ts`. Reparto inicial propuesto (6 de 17):

1. HQ Málaga (1)
2. Arturo San José — Pamplona (real)
3. Alejandro Coscollano — Talavera (real)
4. 1 mock Francia (Lyon o París)
5. 1 mock Portugal (Lisboa)
6. 1 mock Suecia o UK (para mostrar alcance norte)

Si cambia la disponibilidad real, se ajusta el flag `featured`. La página dedicada muestra todos.

### `/academy/coaches` · catálogo completo

**Estructura:**

```
┌─ Breadcrumb ─ Academy / Coaches ─────────────────┐
│                                                   │
│  Red J3 — directorio completo                    │
│  17 coaches · 9 países · 6 idiomas               │
│                                                   │
├─ Filtros sticky ──────────────────────────────────┤
│  [País ▾] [Idioma ▾] [Especialidad ▾] [Reset]   │
├───────────────────────────────────────────────────┤
│                                                   │
│  Grid responsive (3 col desktop / 2 tab / 1 mob) │
│  (orden: tier → joinedAt)                        │
│                                                   │
│  [card] [card] [card]                            │
│  [card] [card] [card]                            │
│  [card] [card] [card]                            │
│  ...                                              │
│                                                   │
│  Si filtered.length === 0:                        │
│    "Ningún coach coincide con tus filtros."       │
│    [Quitar filtros]                               │
│                                                   │
├───────────────────────────────────────────────────┤
│  ← Volver a /academy#network                      │
└───────────────────────────────────────────────────┘
```

**Filtros por URL:**

- Estado vive en `searchParams` (App Router) + `useRouter().replace()` al cambiar — sin recarga.
- Query params: `country`, `language`, `specialty`. Si vacíos, se omiten de la URL.
- URL compartible: `/academy/coaches?country=es&specialty=juniors` abre directamente el filtro aplicado.
- Linkable desde `/academy` cuando el usuario filtra y pulsa "Ver los X resultados completos".

**Cards:** reutilizan `CoachCard`, mismo `onAsk` handler que dispara `j3:chat:open`.

**No hay mapa** en esta página (el mapa es pieza narrativa de `/academy`; aquí el foco es el listado exhaustivo).

---

## Orden · Híbrido tier → antigüedad

**Tier priority:**

```ts
const TIER_ORDER: Record<CoachTier, number> = {
  hq: 0,          // HQ Málaga siempre primero
  elite: 1,       // reservado para futuro
  recommended: 2, // coaches Coach360 activos
};
```

**Helper `sortCoaches()` en `src/data/coaches.ts`:**

```ts
export function sortCoaches(coaches: Coach[]): Coach[] {
  return [...coaches].sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.joinedAt.localeCompare(b.joinedAt); // más antiguo primero
  });
}
```

**Campo nuevo en `Coach`:**

```ts
interface Coach {
  // ... campos existentes
  joinedAt: string; // ISO date, p.ej. "2024-03-15" · fecha alta Coach360
}
```

**Asignación inicial (mock plausible):**

- HQ Málaga: `2005-01-01` (fundación).
- Arturo, Alejandro: `2024-XX-XX` (reales recientes).
- Mock: distribuidos entre `2023-06` y `2025-11` — variedad realista.

**Narrativa comercial:** *"tu antigüedad cuenta — si te das de baja y vuelves pierdes posicionamiento dentro de tu tier"*. Esto no se comunica explícitamente en la web pública (queda en los materiales de Coach360), pero el orden resultante lo refleja.

---

## i18n

**Nuevas keys** (añadir a `types.ts` y a los 5 diccionarios — ES como fuente de verdad, el resto ES placeholder hasta revisión manual):

```ts
academy: {
  network: {
    // existentes...
    viewAllCta: "Ver los {count} coaches",            // sin filtros
    viewFilteredCta: "Ver los {count} resultados completos", // con filtros
  },
  coachesPage: {
    metaTitle: "Coaches J3 · Directorio completo",
    metaDescription: "Red global de coaches certificados por J3. Filtra por país, idioma o especialidad.",
    heading: "Red J3 — directorio completo",
    statsTemplate: "{coaches} coaches · {countries} países · {languages} idiomas",
    emptyTitle: "Ningún coach coincide con tus filtros.",
    emptyCta: "Quitar filtros",
    backLink: "← Volver a Academy",
  },
}
```

**Placeholders:** `{count}`, `{coaches}`, `{countries}`, `{languages}` se sustituyen en el componente con `.replace('{count}', n.toString())`.

---

## Estrategia de implementación

### Orden de ejecución (secuencial, cada paso verificable)

1. **Datos** — añadir `joinedAt` a los 17 coaches + `sortCoaches()` helper + marcar 6 `featured`. Typecheck.
2. **FilterSelect extraído** — mover el componente actual de `academy/page.tsx` a su propio archivo. Typecheck + visual check en `/academy`.
3. **NetworkMap popup enriquecido** — rediseñar el popup, añadir listener `j3:chat:open` vía event delegation. Eliminar lógica de scroll al grid. Visual check: click en pin abre popup, botón abre chat.
4. **`/academy` reducido** — `NetworkSection` muestra solo 6 destacados (3 en mobile) + CTA "Ver los N coaches". Lógica `viewAllCta` vs `viewFilteredCta` según filtros activos. Visual check.
5. **`/academy/coaches` nueva página** — catálogo completo con filtros leídos de `searchParams`. Visual check: URLs compartibles funcionan, filtros se reflejan en URL.
6. **i18n** — nuevas keys en los 5 diccionarios (ES real, resto ES placeholder).
7. **Typecheck + build + commit + push.**

### Qué puede salir mal

- **Event delegation en el popup Leaflet:** el popup se renderiza fuera del árbol React, así que el `onClick` del botón "Pregunta a J3" no llega por el sistema de eventos de React. Solución: listener global en el `map` container que detecta `data-coach-slug` del botón y dispara el evento custom con el coach correspondiente.
- **SSR `/academy/coaches`:** igual que `/academy`, el mapa no se usa aquí, pero sí `useSearchParams` que exige `Suspense` boundary. Envolver el contenido del client component en `<Suspense fallback={...}>`.
- **Query params y SEO:** Next 16 por defecto prerender estáticos. `/academy/coaches` pasa a dinámico por `searchParams`. Aceptable — es un catálogo.

---

## Métricas de éxito

- `/academy` altura total se reduce significativamente (visual check en dev tools · objetivo: ≤60% de la altura previa en mobile).
- `/academy/coaches` indexable (revisar `next build` — debe aparecer como ruta estática o dinámica válida).
- Click en pin del mapa **no** provoca scroll (manual QA).
- Filtros en `/academy/coaches` escriben la URL (manual QA).
- Compartir URL `/academy/coaches?country=fr` carga con filtro aplicado (manual QA).

---

## Fuera de scope (para futuras iteraciones)

- Paginación `/academy/coaches` cuando pasemos de 50 coaches.
- Búsqueda por texto.
- Página `[slug]` de perfil individual.
- Ordenar por distancia al usuario (geolocation).
- Sistema de reviews / ratings de coaches.
- Comunicación explícita de la regla de antigüedad en la web pública.
