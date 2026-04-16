# Red J3 · Scroll-Killer · Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminar la sensación de scroll infinito en la sección Red J3, crear una página catálogo dedicada (`/academy/coaches`) con filtros por URL, y convertir el clic en los pines del mapa en un popup enriquecido en lugar de un scroll al grid.

**Architecture:** La sección Red J3 de `/academy` pasa a mostrar sólo 6 coaches destacados (3 en móvil) con CTA a la página dedicada. La página dedicada `/academy/coaches` lee filtros desde la URL (compartible, indexable). El orden es híbrido tier→antigüedad (`joinedAt`).

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, Tailwind CSS v4, react-leaflet 5, Leaflet.

**Base branch:** `master` (trabajando directo en master; el user despliega a Vercel en cada push).

**Verification model:** No hay framework de tests en este repo. La verificación por task es:
1. `npm run typecheck` (debe pasar sin errores).
2. Visual QA manual en `npm run dev` cuando aplique.
3. `npm run build` al final de cada task que toque páginas.
4. Commit por task (commits atómicos, rollback fácil).

---

## File Map

| Acción | Ruta | Responsabilidad |
|---|---|---|
| Modify | `src/data/coaches.ts` | `+ joinedAt` field, `+ sortCoaches()`, `+ buildCoachesUrl()`, `+ parseCoachesFilters()`, marcar 6 `featured: true` |
| Create | `src/components/FilterSelect.tsx` | Dropdown extraído para reutilizar en `/academy` y `/academy/coaches` |
| Modify | `src/components/NetworkMap.tsx` | Popup enriquecido (foto, idiomas, botón "Pregunta a J3" que dispara `j3:chat:open`); eliminar prop `onSelect` |
| Modify | `src/i18n/dictionaries/types.ts` | `+ viewAllCta`, `+ viewFilteredCta`, `+ coachesPage` block |
| Modify | `src/i18n/dictionaries/{es,en,fr,pt,sv}.ts` | Nuevas keys (ES real, resto ES placeholder) |
| Modify | `src/app/academy/page.tsx` | Extraer uso de `FilterSelect` del fichero; reducir `NetworkSection` a 6/3 destacados + CTA ver todos; eliminar `handleMapSelect` y `highlightSlug` |
| Create | `src/app/academy/coaches/page.tsx` | Catálogo completo con filtros leídos de `useSearchParams` |

---

## Task 1 — Data layer (joinedAt, sortCoaches, URL helpers, featured flags)

**Files:**
- Modify: `src/data/coaches.ts`

- [ ] **Step 1.1: Añadir `joinedAt: string` al interface `Coach`**

Abre `src/data/coaches.ts` y en el `interface Coach` (alrededor de la línea 17), añade el campo después de `featured?`:

```ts
  /** Destacar en la home / como primer pin abierto */
  featured?: boolean;
  /** Fecha ISO de alta en Coach360 (YYYY-MM-DD). Usada para ordenar dentro de cada tier. */
  joinedAt: string;
}
```

- [ ] **Step 1.2: Añadir `joinedAt` a los 17 registros**

Usa esta tabla exacta (ordenada por slug) para asignar `joinedAt` a cada coach. Añade el campo al final de cada objeto, antes del `}` de cierre del coach:

| slug | joinedAt | Rationale |
|---|---|---|
| `j3-hq-malaga` | `"2005-01-01"` | Fundación J3 |
| `arturo-san-jose-esparza` | `"2024-03-12"` | Real, Coach360 reciente |
| `alejandro-coscollano-gonzalez` | `"2024-06-04"` | Real, Coach360 reciente |
| `carlos-herrera-madrid` | `"2023-09-18"` | Mock plausible |
| `sofia-moreno-barcelona` | `"2023-11-22"` | Mock plausible |
| `ramon-delgado-valencia` | `"2024-01-15"` | Mock plausible |
| `elena-ruiz-sevilla` | `"2024-08-30"` | Mock plausible |
| `nacho-castro-bilbao` | `"2025-02-11"` | Mock plausible |
| `miguel-ferreira-lisboa` | `"2023-10-05"` | Mock plausible |
| `ines-pereira-porto` | `"2024-04-20"` | Mock plausible |
| `julien-martin-paris` | `"2024-05-14"` | Mock plausible |
| `amelie-laurent-marseille` | `"2025-01-08"` | Mock plausible |
| `anders-lindqvist-stockholm` | `"2024-11-02"` | Mock plausible |
| `lorenzo-rossi-milano` | `"2024-07-19"` | Mock plausible |
| `james-whitmore-london` | `"2023-12-01"` | Mock plausible |
| `khalid-al-maktoum-dubai` | `"2025-03-25"` | Mock plausible |
| `diego-ortega-cdmx` | `"2024-09-11"` | Mock plausible |

Para cada coach en el array `COACHES`, añade `joinedAt: "YYYY-MM-DD",` como última propiedad antes del `},`.

- [ ] **Step 1.3: Marcar 6 coaches como `featured: true`**

Son los que aparecerán en `/academy`. Asegúrate de que estos 6 coaches (y SÓLO estos 6) tienen `featured: true`:

1. `j3-hq-malaga` — ya tiene `featured: true`
2. `arturo-san-jose-esparza` — añadir `featured: true`
3. `alejandro-coscollano-gonzalez` — añadir `featured: true`
4. `julien-martin-paris` — añadir `featured: true`
5. `miguel-ferreira-lisboa` — añadir `featured: true`
6. `anders-lindqvist-stockholm` — añadir `featured: true`

El resto NO debe tener `featured: true` (o no debe tener el campo).

- [ ] **Step 1.4: Añadir helper `sortCoaches()` al final del archivo**

Al final de `src/data/coaches.ts`, justo antes del último `export const COACH_SPECIALTIES` ya existente, inserta este bloque:

```ts
/* ──────────────────────────────────────────────
   Ordenación híbrida: tier → antigüedad dentro del tier.
   HQ siempre primero · dentro de Recommended, los más
   antiguos (joinedAt menor) van delante. Es la palanca
   de retención Coach360 — darse de baja hace que al volver
   se pierda posicionamiento dentro del tier.
   ────────────────────────────────────────────── */

const TIER_ORDER: Record<CoachTier, number> = {
  hq: 0,
  elite: 1,
  recommended: 2,
};

/**
 * Devuelve una copia ordenada por (tier ascendente) → (joinedAt ascendente).
 */
export function sortCoaches(coaches: readonly Coach[]): Coach[] {
  return [...coaches].sort((a, b) => {
    const tierDiff = TIER_ORDER[a.tier] - TIER_ORDER[b.tier];
    if (tierDiff !== 0) return tierDiff;
    return a.joinedAt.localeCompare(b.joinedAt);
  });
}
```

- [ ] **Step 1.5: Añadir helpers de URL `buildCoachesUrl()` y `parseCoachesFilters()`**

Al final del archivo (después de `sortCoaches`):

```ts
/* ──────────────────────────────────────────────
   URL helpers para la página catálogo /academy/coaches.
   Mantienen el estado de filtros sincronizado con la URL
   para que sean compartibles e indexables.
   ────────────────────────────────────────────── */

export interface CoachFilters {
  country: string;   // "all" o un país concreto
  language: string;  // "all" o código ISO
  specialty: string; // "all" o "juniors"/"adultos"/"competicion"
}

/**
 * Construye la URL de /academy/coaches con los filtros como query params.
 * Sólo serializa los filtros que no son "all".
 */
export function buildCoachesUrl(filters: CoachFilters): string {
  const params = new URLSearchParams();
  if (filters.country !== "all") params.set("country", filters.country);
  if (filters.language !== "all") params.set("language", filters.language);
  if (filters.specialty !== "all") params.set("specialty", filters.specialty);
  const qs = params.toString();
  return `/academy/coaches${qs ? `?${qs}` : ""}`;
}

/**
 * Lee filtros desde URLSearchParams. Valores ausentes o inválidos caen en "all".
 */
export function parseCoachesFilters(params: URLSearchParams | ReadonlyURLSearchParams): CoachFilters {
  const country = params.get("country") ?? "all";
  const language = params.get("language") ?? "all";
  const specialty = params.get("specialty") ?? "all";
  const validSpecialty = (COACH_SPECIALTIES as readonly string[]).includes(specialty) ? specialty : "all";
  return {
    country: COACH_COUNTRIES.includes(country) ? country : "all",
    language: COACH_LANGUAGES.includes(language) ? language : "all",
    specialty: validSpecialty,
  };
}

// Alias de tipado para los dos tipos que Next puede dar (mutable o readonly)
type ReadonlyURLSearchParams = { get(name: string): string | null };

/**
 * Aplica filtros a una lista de coaches.
 * "all" en cualquier dimensión = sin filtro en esa dimensión.
 */
export function filterCoaches(coaches: readonly Coach[], filters: CoachFilters): Coach[] {
  return coaches.filter(c => {
    if (filters.country !== "all" && c.location.country !== filters.country) return false;
    if (filters.language !== "all" && !(c.languages ?? []).includes(filters.language)) return false;
    if (filters.specialty !== "all" && !(c.specialties ?? []).includes(filters.specialty as CoachSpecialty)) return false;
    return true;
  });
}

/**
 * Toma los N destacados de una lista ya filtrada. Si hay menos featured que N,
 * completa con no-featured (mismo orden) hasta llegar a N. Si la lista filtrada
 * es menor que N, devuelve la lista entera.
 */
export function pickDisplayCoaches(sortedFiltered: readonly Coach[], n: number): Coach[] {
  const featured = sortedFiltered.filter(c => c.featured);
  if (featured.length >= n) return featured.slice(0, n);
  const needed = n - featured.length;
  const rest = sortedFiltered.filter(c => !c.featured).slice(0, needed);
  return [...featured, ...rest];
}
```

- [ ] **Step 1.6: Verificar typecheck**

```bash
npm run typecheck
```

Expected: sin errores. Si hay errores de `ReadonlyURLSearchParams` no resuelto, comprueba que el alias de tipo está dentro del mismo archivo.

- [ ] **Step 1.7: Commit**

```bash
git add src/data/coaches.ts
git commit -m "data(coaches): + joinedAt · sortCoaches · URL helpers · 6 featured"
```

---

## Task 2 — Extraer `FilterSelect` a su propio archivo

**Files:**
- Create: `src/components/FilterSelect.tsx`
- Modify: `src/app/academy/page.tsx`

- [ ] **Step 2.1: Crear `src/components/FilterSelect.tsx`**

```tsx
"use client";

/* ──────────────────────────────────────────────
   FilterSelect — dropdown compacto con estética J3.
   Usado por /academy (sección Red J3) y /academy/coaches.
   ────────────────────────────────────────────── */

export interface FilterSelectOption {
  value: string;
  label: string;
}

export interface FilterSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly FilterSelectOption[];
}

export function FilterSelect({ label, value, onChange, options }: FilterSelectProps) {
  return (
    <label
      className="inline-flex items-center gap-2 border theme-border px-3 py-2 hover:border-[var(--g1)]/40 transition-colors duration-300"
      style={{ borderRadius: 2 }}
    >
      <span className="text-[9px] font-bold tracking-[2px] uppercase text-[var(--g1)]">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-none outline-none text-[12px] font-medium cursor-pointer"
        style={{ color: "var(--wh)" }}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value} style={{ background: "#0a0a0a", color: "#f5f0e8" }}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
```

- [ ] **Step 2.2: Eliminar la definición local de `FilterSelect` en `academy/page.tsx` y añadir el import**

En `src/app/academy/page.tsx`:

1. Elimina las líneas 2512-2539 (interface `FilterSelectProps` + función `FilterSelect`). El nuevo archivo las sustituye.
2. Añade al bloque de imports superior (junto al resto de imports de `@/components`):

```tsx
import { FilterSelect } from "@/components/FilterSelect";
```

- [ ] **Step 2.3: Typecheck**

```bash
npm run typecheck
```

Expected: sin errores. El componente se sigue usando en `NetworkSection` sin cambios.

- [ ] **Step 2.4: Commit**

```bash
git add src/components/FilterSelect.tsx src/app/academy/page.tsx
git commit -m "refactor(filter): extraer FilterSelect a su propio componente"
```

---

## Task 3 — i18n keys nuevas

**Files:**
- Modify: `src/i18n/dictionaries/types.ts`
- Modify: `src/i18n/dictionaries/es.ts`
- Modify: `src/i18n/dictionaries/en.ts`
- Modify: `src/i18n/dictionaries/fr.ts`
- Modify: `src/i18n/dictionaries/pt.ts`
- Modify: `src/i18n/dictionaries/sv.ts`

- [ ] **Step 3.1: Añadir tipos a `types.ts`**

En `src/i18n/dictionaries/types.ts`, localiza el bloque `network` dentro de `academy`. Añade dos keys al final del bloque `network` y un bloque hermano `coachesPage` al mismo nivel que `network`:

Dentro de `network: { ... }`, antes del `}` de cierre, añade:

```ts
      viewAllCta: string;          // "Ver los {count} coaches" — plantilla con placeholder
      viewFilteredCta: string;     // "Ver los {count} resultados completos" — con filtros
```

Después de cerrar el bloque `network` y antes de cerrar `academy`, añade:

```ts
    coachesPage: {
      metaTitle: string;
      metaDescription: string;
      heading: string;
      statsTemplate: string;       // "{coaches} coaches · {countries} países · {languages} idiomas"
      emptyTitle: string;
      emptyCta: string;
      backLink: string;
    };
```

- [ ] **Step 3.2: Añadir valores reales a `es.ts`**

En `src/i18n/dictionaries/es.ts`, localiza el bloque `network` dentro de `academy`. Añade al final del bloque `network` (antes del `}`):

```ts
      viewAllCta: "Ver los {count} coaches",
      viewFilteredCta: "Ver los {count} resultados completos",
```

Al mismo nivel que `network`, después de cerrar `network`, añade el bloque:

```ts
    coachesPage: {
      metaTitle: "Coaches J3 · Directorio completo",
      metaDescription: "Red global de coaches certificados por J3. Filtra por país, idioma o especialidad.",
      heading: "Red J3 — directorio completo",
      statsTemplate: "{coaches} coaches · {countries} países · {languages} idiomas",
      emptyTitle: "Ningún coach coincide con tus filtros.",
      emptyCta: "Quitar filtros",
      backLink: "← Volver a Academy",
    },
```

- [ ] **Step 3.3: Replicar en `en.ts`, `fr.ts`, `pt.ts`, `sv.ts` con los MISMOS valores en español**

Siguiendo la política actual del proyecto ("hasta que el ES esté maduro, los otros 4 idiomas llevan el mismo texto en español"), copia los mismos strings de `es.ts` a los otros 4 diccionarios.

Para cada archivo (`en.ts`, `fr.ts`, `pt.ts`, `sv.ts`):

Dentro de `academy.network`, añade:

```ts
      viewAllCta: "Ver los {count} coaches",
      viewFilteredCta: "Ver los {count} resultados completos",
```

Dentro de `academy`, al mismo nivel que `network`:

```ts
    coachesPage: {
      metaTitle: "Coaches J3 · Directorio completo",
      metaDescription: "Red global de coaches certificados por J3. Filtra por país, idioma o especialidad.",
      heading: "Red J3 — directorio completo",
      statsTemplate: "{coaches} coaches · {countries} países · {languages} idiomas",
      emptyTitle: "Ningún coach coincide con tus filtros.",
      emptyCta: "Quitar filtros",
      backLink: "← Volver a Academy",
    },
```

- [ ] **Step 3.4: Typecheck**

```bash
npm run typecheck
```

Expected: sin errores. Si falta alguna key en alguno de los diccionarios, el typecheck te lo indica — corrige y vuelve a ejecutar.

- [ ] **Step 3.5: Commit**

```bash
git add src/i18n/dictionaries/
git commit -m "i18n(academy): + viewAllCta · + coachesPage (ES + 4 placeholder)"
```

---

## Task 4 — NetworkMap popup enriquecido

**Files:**
- Modify: `src/components/NetworkMap.tsx`

- [ ] **Step 4.1: Actualizar `NetworkMapProps` y firma del componente**

En `src/components/NetworkMap.tsx`:

- Elimina el prop `onSelect?: (slug: string) => void;` de la interfaz.
- Añade al prop `labels`: `askChatbot: string;` (texto del botón "Pregunta a J3"). El resto (`badgeHq`, `badgeRecommended`) ya estaba; elimina `viewProfile` si sigue ahí — ya no se usa.
- Añade prop opcional `onAsk?: (coach: Coach) => void;` — si no se pasa, el componente dispara directamente el evento `j3:chat:open` (comportamiento por defecto).

Reemplaza el bloque interface + firma por:

```tsx
interface NetworkMapProps {
  /** Lista de coaches a pintar. La página pasa la lista ya filtrada. */
  coaches: readonly Coach[];
  /** Override opcional del handler del botón "Pregunta a J3". Default: dispara evento j3:chat:open. */
  onAsk?: (coach: Coach) => void;
  labels: {
    badgeHq: string;
    badgeRecommended: string;
    askChatbot: string;
  };
}

export default function NetworkMap({ coaches: coachesProp, onAsk, labels }: NetworkMapProps) {
  const coaches = useMemo(() => [...coachesProp], [coachesProp]);

  const handleAsk = (c: Coach) => {
    if (onAsk) {
      onAsk(c);
      return;
    }
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: c.name,
          coachLocation: `${c.location.city}, ${c.location.country}`,
        },
      }),
    );
  };

  // Centro en Europa occidental con un zoom razonable para ver España + Europa.
  const center: [number, number] = [42, 5];
  const zoom = 4;
```

- [ ] **Step 4.2: Eliminar el `eventHandlers: { click: ... }` del Marker y rediseñar el Popup**

Dentro del `.map((c) => (...))` de coaches, reemplaza el bloque `<Marker>...</Marker>` completo por:

```tsx
          <Marker
            key={c.slug}
            position={c.location.coordinates}
            icon={makeIcon(c.tier)}
          >
            <Popup maxWidth={280} minWidth={240}>
              <div style={{ minWidth: 220 }}>
                {/* Header: foto + nombre + tier */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 8 }}>
                  {c.photo ? (
                    <img
                      src={c.photo}
                      alt=""
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        objectFit: "cover",
                        border: c.tier === "hq" ? "2px solid #dcaf64" : "1px solid rgba(220,175,100,0.3)",
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      aria-hidden
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 999,
                        background: "rgba(220,175,100,0.08)",
                        border: "1px solid rgba(220,175,100,0.25)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#dcaf64",
                        letterSpacing: 1,
                        flexShrink: 0,
                      }}
                    >
                      {c.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 9,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        color: "#dcaf64",
                        marginBottom: 2,
                      }}
                    >
                      {c.tier === "hq" ? labels.badgeHq : labels.badgeRecommended}
                    </div>
                    <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.15, marginBottom: 2 }}>
                      {c.name}
                    </div>
                    <div style={{ fontSize: 11, opacity: 0.7 }}>
                      {c.location.city}, {c.location.country}
                    </div>
                  </div>
                </div>

                {/* Clubs */}
                {c.clubs && c.clubs.length > 0 && (
                  <div style={{ fontSize: 11, opacity: 0.6, marginBottom: 8 }}>
                    {c.clubs.slice(0, 2).join(" · ")}
                  </div>
                )}

                {/* Idiomas */}
                {c.languages && c.languages.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
                    {c.languages.map(l => (
                      <span
                        key={l}
                        style={{
                          fontSize: 9,
                          letterSpacing: 1,
                          textTransform: "uppercase",
                          color: "#dcaf64",
                          border: "1px solid rgba(220,175,100,0.3)",
                          padding: "2px 6px",
                          borderRadius: 2,
                        }}
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                )}

                {/* CTA "Pregunta a J3" */}
                <button
                  type="button"
                  onClick={() => handleAsk(c)}
                  style={{
                    width: "100%",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "#000",
                    background: "linear-gradient(135deg, #dcaf64, #b8943e)",
                    border: "none",
                    padding: "8px 12px",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  {labels.askChatbot}
                </button>
              </div>
            </Popup>
          </Marker>
```

- [ ] **Step 4.3: Typecheck**

```bash
npm run typecheck
```

Expected: fallará porque `/academy/page.tsx` sigue pasando `onSelect` y `viewProfile`. Lo arreglaremos en la Task 5. Si el typecheck falla SÓLO por esto, continúa a la Task 5. Si hay otros errores, investiga antes.

- [ ] **Step 4.4: NO commitear todavía** — el typecheck falla. Commiteamos al final de la Task 5 junto con la limpieza en `/academy/page.tsx`.

---

## Task 5 — `/academy` NetworkSection reducido a 6/3 destacados + CTA ver todos

**Files:**
- Modify: `src/app/academy/page.tsx`

- [ ] **Step 5.1: Actualizar imports en la cabecera del archivo**

En la zona de imports de `src/app/academy/page.tsx`, localiza el import de `@/data/coaches`. Amplíalo para incluir los nuevos helpers:

```tsx
import {
  COACHES,
  COACH_COUNTRIES,
  COACH_LANGUAGES,
  COACH_SPECIALTIES,
  sortCoaches,
  filterCoaches,
  pickDisplayCoaches,
  buildCoachesUrl,
  type Coach,
  type CoachSpecialty,
} from "@/data/coaches";
```

Nota: si el import original usaba otra forma (p. ej. `import type`), conserva el estilo del fichero; el importante es añadir los 4 nuevos nombres (`sortCoaches`, `filterCoaches`, `pickDisplayCoaches`, `buildCoachesUrl`).

- [ ] **Step 5.2: Hook de detección móvil — reutilizar si existe, si no añadir uno simple al fichero**

Busca en el fichero si ya existe un hook tipo `useIsMobile()`. Si no existe, añade este helper justo antes de `function NetworkSection(...)`:

```tsx
function useIsMobile(breakpoint: number = 960): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}
```

- [ ] **Step 5.3: Reemplazar el cuerpo de `NetworkSection` completo**

Sustituye todo el contenido de la función `NetworkSection` (desde la línea que dice `function NetworkSection(...)` hasta su `}` de cierre, aproximadamente líneas 2541-2819) por:

```tsx
function NetworkSection({ markerSlot }: { markerSlot?: React.ReactNode }) {
  const { t } = useI18n();
  const { ref, visible } = useReveal(0.15);
  const isMobile = useIsMobile(960);

  // Coaches visibles en la red (sin HQ — HQ tiene bloque propio arriba).
  // Ordenados por tier → joinedAt (ver sortCoaches).
  const allCoaches = useMemo(() => sortCoaches(COACHES).filter(c => c.tier !== "hq"), []);

  // Filtros. "all" = sin filtro en esa dimensión.
  const [country, setCountry] = useState<string>("all");
  const [language, setLanguage] = useState<string>("all");
  const [specialty, setSpecialty] = useState<string>("all");

  const filtered = useMemo(
    () => filterCoaches(allCoaches, { country, language, specialty }),
    [allCoaches, country, language, specialty],
  );

  // 6 destacados en desktop, 3 en mobile.
  const displayCount = isMobile ? 3 : 6;
  const display = useMemo(
    () => pickDisplayCoaches(filtered, displayCount),
    [filtered, displayCount],
  );

  const mapLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeRecommended: t.academy.network.badgeRecommended,
    askChatbot: t.academy.network.askChatbot,
  };

  const gridLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeRecommended: t.academy.network.badgeRecommended,
    askChatbot: t.academy.network.askChatbot,
  };

  const specialtyLabel = (s: CoachSpecialty) =>
    s === "juniors"
      ? t.academy.network.specialtyJuniors
      : s === "adultos"
      ? t.academy.network.specialtyAdultos
      : t.academy.network.specialtyCompeticion;

  const handleAsk = (coach: Coach) => {
    // El usuario pasa SIEMPRE por nuestro chatbot antes de llegar al coach.
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: coach.name,
          coachLocation: `${coach.location.city}, ${coach.location.country}`,
        },
      }),
    );
  };

  const hasAnyFilter = country !== "all" || language !== "all" || specialty !== "all";
  const resetFilters = () => {
    setCountry("all");
    setLanguage("all");
    setSpecialty("all");
  };

  // CTA "ver todos": cambia de texto según haya filtros activos.
  const viewAllHref = buildCoachesUrl({ country, language, specialty });
  const viewAllLabel = hasAnyFilter
    ? t.academy.network.viewFilteredCta.replace("{count}", filtered.length.toString())
    : t.academy.network.viewAllCta.replace("{count}", allCoaches.length.toString());
  // Si hay filtros y ya vemos todos los resultados en el bloque reducido, ocultamos el CTA.
  const showViewAllCta = !hasAnyFilter || filtered.length > displayCount;

  return (
    <section id="network" className="sedes-section relative overflow-hidden border-b border-white/[.07]">
      {markerSlot}

      {/* Header */}
      <div
        ref={ref}
        className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-[72px] pb-10 max-[960px]:pt-[56px] max-[960px]:pb-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(24px)",
          transition: "all .8s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <span className="text-[10px] font-normal tracking-[5px] uppercase text-[var(--g1)] block mb-2 max-[960px]:text-[11px] max-[960px]:tracking-[3px]">
          {t.academy.network.eyebrow}
        </span>
        <h2 className="font-bold text-[clamp(28px,3vw,44px)] uppercase tracking-[-0.5px] leading-[1.05]">
          <span className="sedes-heading">{t.academy.network.headingPre}</span>
          <span className="j3-grad-text font-[var(--font-serif)] italic normal-case">
            {t.academy.network.headingAccent}
          </span>
        </h2>
        <p className="max-w-[640px] mt-4 text-[14px] max-[960px]:text-[13px] opacity-75 leading-[1.55]" style={{ color: "var(--wh)" }}>
          {t.academy.network.headingSub}
        </p>
      </div>

      {/* HQ Hero block */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-12 max-[960px]:pb-10">
        <a
          href="https://finurapadelgym.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden border border-white/[.08] hover:border-[var(--g1)]/40 transition-colors duration-500"
          style={{ aspectRatio: "16 / 7" }}
        >
          <video
            src="https://finurapadelgym.com/wp-content/uploads/2025/10/home-2.webm"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            style={{ filter: "saturate(0.88) brightness(0.88) contrast(0.96)" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" aria-hidden />
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[70%] opacity-70 group-hover:w-full group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700"
            aria-hidden
          />

          <div className="absolute top-6 left-6 max-[640px]:top-4 max-[640px]:left-5 z-10 flex items-center gap-2">
            <span className="relative inline-flex shrink-0" aria-hidden>
              <span className="w-[6px] h-[6px] rounded-full bg-[var(--g1)]" />
              <span className="absolute inset-0 w-[6px] h-[6px] rounded-full bg-[var(--g1)] animate-ping" />
            </span>
            <span className="text-[10px] font-bold tracking-[3px] uppercase text-[var(--g1)]">
              {t.academy.network.hqLabel}
            </span>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 p-6 max-[640px]:p-5 flex items-end justify-between gap-4">
            <div className="max-w-[620px]">
              <h3 className="font-bold text-[clamp(22px,2.8vw,40px)] uppercase tracking-[-0.5px] leading-[1.05] text-white">
                {t.academy.network.hqTitle}
              </h3>
              <p className="mt-2 text-[13px] max-[640px]:text-[12px] font-light leading-[1.5] text-white/70">
                {t.academy.network.hqSubtitle}
              </p>
            </div>
            <span
              className="shrink-0 flex items-center gap-2 text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--g1)]"
              style={{ transform: "translateX(0)", transition: "transform .5s cubic-bezier(.16,1,.3,1)" }}
            >
              {t.academy.network.hqCta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </a>
      </div>

      {/* Map block */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-12 max-[960px]:pb-10">
        <div className="flex items-baseline flex-wrap gap-x-4 gap-y-1 mb-5">
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
            {t.academy.network.mapLabel}
          </span>
          <span className="text-[12px] opacity-60" style={{ color: "var(--wh)" }}>
            {t.academy.network.mapHint}
          </span>
        </div>
        <div
          className="relative overflow-hidden border border-white/[.08]"
          style={{ height: "clamp(380px, 55vh, 620px)" }}
        >
          <NetworkMap coaches={filtered} labels={mapLabels} />
        </div>
      </div>

      {/* Coaches grid */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-12 max-[960px]:pb-10">
        <div className="flex items-baseline flex-wrap gap-x-5 gap-y-1 mb-6">
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)]">
            {t.academy.network.gridLabel}
          </span>
          <h3 className="font-[var(--font-serif)] italic text-[clamp(18px,1.5vw,22px)] j3-grad-text">
            {t.academy.network.gridHeading}
          </h3>
          <span className="ml-auto text-[11px] opacity-55 tracking-[2px] uppercase" style={{ color: "var(--wh)" }}>
            {filtered.length} / {allCoaches.length}
          </span>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3 max-[960px]:gap-2 mb-6 text-[12px] max-[960px]:text-[11px]" style={{ color: "var(--wh)" }}>
          <FilterSelect
            label={t.academy.network.filterCountry}
            value={country}
            onChange={setCountry}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_COUNTRIES.map(c => ({ value: c, label: c }))]}
          />
          <FilterSelect
            label={t.academy.network.filterLanguage}
            value={language}
            onChange={setLanguage}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_LANGUAGES.map(l => ({ value: l, label: l.toUpperCase() }))]}
          />
          <FilterSelect
            label={t.academy.network.filterSpecialty}
            value={specialty}
            onChange={setSpecialty}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_SPECIALTIES.map(s => ({ value: s, label: specialtyLabel(s) }))]}
          />
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] tracking-[2px] uppercase text-[var(--g1)] hover:underline underline-offset-4"
            >
              {t.academy.network.filterReset}
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="border theme-border px-6 py-10 text-center text-[13px] opacity-70" style={{ color: "var(--wh)" }}>
            {t.academy.network.filterEmpty}
          </div>
        ) : (
          <>
            <div className="grid gap-4 max-[960px]:gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" }}>
              {display.map((c) => (
                <CoachCard key={c.slug} coach={c} labels={gridLabels} onAsk={handleAsk} />
              ))}
            </div>

            {showViewAllCta && (
              <div className="mt-8 flex justify-center">
                <Link
                  href={viewAllHref}
                  className="group inline-flex items-center gap-3 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] border border-[var(--g1)]/40 hover:border-[var(--g1)] px-6 py-3 transition-all duration-300"
                  style={{ borderRadius: 2 }}
                >
                  {viewAllLabel}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1">
                    <path d="M5 12h14" />
                    <path d="M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>

      {/* Coach360 CTA */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-[80px] max-[960px]:pb-[56px]">
        <a
          href={t.academy.network.coachCta.href}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block overflow-hidden border border-white/[.08] hover:border-[var(--g1)]/40 transition-colors duration-500 px-8 py-10 max-[640px]:px-6 max-[640px]:py-8"
        >
          <span
            className="absolute top-0 left-1/2 -translate-x-1/2 h-[3px] w-[50%] opacity-70 group-hover:w-full group-hover:opacity-100 bg-gradient-to-r from-transparent via-[var(--g1)] to-transparent transition-all duration-700"
            aria-hidden
          />
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[var(--g1)] block mb-3">
            {t.academy.network.coachCta.eyebrow}
          </span>
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-[640px]">
              <h3 className="font-bold text-[clamp(22px,2.4vw,34px)] uppercase tracking-[-0.5px] leading-[1.05]" style={{ color: "var(--wh)" }}>
                {t.academy.network.coachCta.title}
              </h3>
              <p className="mt-3 text-[13px] max-[640px]:text-[12px] opacity-70 leading-[1.55]" style={{ color: "var(--wh)" }}>
                {t.academy.network.coachCta.description}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[2.5px] uppercase text-[var(--g1)] group-hover:gap-3 transition-all duration-500">
              {t.academy.network.coachCta.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </a>
      </div>
    </section>
  );
}
```

Nota clave sobre el Coach360 CTA: como el `href` ahora apunta a `https://j3padel.com/join`, añadimos `target="_blank"` y `rel="noopener noreferrer"` al `<a>` (no estaba antes — confirma que esto no rompe el estilo visual).

- [ ] **Step 5.4: Asegurar que `Link` está importado**

En los imports del fichero, si `Link` no está ya importado, añade:

```tsx
import Link from "next/link";
```

- [ ] **Step 5.5: Typecheck**

```bash
npm run typecheck
```

Expected: sin errores. Ahora las Tasks 4 y 5 están alineadas.

- [ ] **Step 5.6: Arrancar dev server y verificar visualmente**

```bash
npm run dev
```

Abre `http://localhost:3000/academy` y comprueba:
- Desktop: la sección Red J3 muestra 6 coaches en grid.
- Mobile (responsive 375px): muestra 3 coaches.
- CTA "Ver los 16 coaches →" visible debajo del grid (hay 17 coaches totales - 1 HQ = 16 en `allCoaches`).
- Filtrar por país "España" → CTA cambia a "Ver los X resultados completos →" (o se oculta si ≤6 resultados).
- Click en un pin del mapa → popup con foto (o iniciales si no hay foto), nombre, ciudad, idiomas, botón "Pregunta a J3".
- Click en "Pregunta a J3" del popup → se abre el ChatBubble con el mensaje contextual precargado.
- El click en el pin NO hace scroll al grid. El mapa se queda donde está.

Mata el dev server con Ctrl+C cuando hayas terminado.

- [ ] **Step 5.7: Commit (incluye cambios pendientes de Task 4)**

```bash
git add src/components/NetworkMap.tsx src/app/academy/page.tsx
git commit -m "feat(network): /academy reducido a 6/3 destacados · popup mapa enriquecido"
```

---

## Task 6 — Nueva página `/academy/coaches`

**Files:**
- Create: `src/app/academy/coaches/page.tsx`

- [ ] **Step 6.1: Crear directorio y archivo**

```bash
mkdir -p src/app/academy/coaches
```

- [ ] **Step 6.2: Escribir `src/app/academy/coaches/page.tsx`**

```tsx
"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  COACHES,
  COACH_COUNTRIES,
  COACH_LANGUAGES,
  COACH_SPECIALTIES,
  sortCoaches,
  filterCoaches,
  parseCoachesFilters,
  buildCoachesUrl,
  type Coach,
  type CoachSpecialty,
} from "@/data/coaches";
import { CoachCard } from "@/components/CoachCard";
import { FilterSelect } from "@/components/FilterSelect";
import { useI18n } from "@/i18n/context";

function CoachesCatalogContent() {
  const { t } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Orden global: tier → joinedAt. HQ incluido (será el primer resultado si no hay filtro país != España).
  const allCoaches = useMemo(() => sortCoaches(COACHES), []);

  // Estado de filtros = URL.
  const filters = useMemo(() => parseCoachesFilters(searchParams), [searchParams]);

  const filtered = useMemo(
    () => filterCoaches(allCoaches, filters),
    [allCoaches, filters],
  );

  const setFilter = (key: "country" | "language" | "specialty", value: string) => {
    const next = { ...filters, [key]: value };
    router.replace(buildCoachesUrl(next), { scroll: false });
  };

  const resetFilters = () => {
    router.replace("/academy/coaches", { scroll: false });
  };

  const hasAnyFilter =
    filters.country !== "all" || filters.language !== "all" || filters.specialty !== "all";

  const countriesCount = useMemo(
    () => new Set(allCoaches.filter(c => c.tier !== "hq").map(c => c.location.country)).size,
    [allCoaches],
  );
  const languagesCount = useMemo(
    () => new Set(allCoaches.filter(c => c.tier !== "hq").flatMap(c => c.languages ?? [])).size,
    [allCoaches],
  );

  const stats = t.academy.coachesPage.statsTemplate
    .replace("{coaches}", allCoaches.length.toString())
    .replace("{countries}", countriesCount.toString())
    .replace("{languages}", languagesCount.toString());

  const gridLabels = {
    badgeHq: t.academy.network.badgeHq,
    badgeRecommended: t.academy.network.badgeRecommended,
    askChatbot: t.academy.network.askChatbot,
  };

  const specialtyLabel = (s: CoachSpecialty) =>
    s === "juniors"
      ? t.academy.network.specialtyJuniors
      : s === "adultos"
      ? t.academy.network.specialtyAdultos
      : t.academy.network.specialtyCompeticion;

  const handleAsk = (coach: Coach) => {
    window.dispatchEvent(
      new CustomEvent("j3:chat:open", {
        detail: {
          coachName: coach.name,
          coachLocation: `${coach.location.city}, ${coach.location.country}`,
        },
      }),
    );
  };

  return (
    <main className="min-h-screen bg-[var(--bk)] pt-[72px] pb-[80px] max-[960px]:pt-[56px] max-[960px]:pb-[56px]">
      {/* Header */}
      <header className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pb-10 max-[960px]:pb-8">
        <Link
          href="/academy#network"
          className="text-[11px] tracking-[2px] uppercase text-[var(--g1)] hover:underline underline-offset-4 inline-block mb-5"
        >
          {t.academy.coachesPage.backLink}
        </Link>
        <h1 className="font-bold text-[clamp(26px,3vw,42px)] uppercase tracking-[-0.5px] leading-[1.05]" style={{ color: "var(--wh)" }}>
          {t.academy.coachesPage.heading}
        </h1>
        <p className="mt-3 text-[12px] tracking-[2px] uppercase opacity-60" style={{ color: "var(--wh)" }}>
          {stats}
        </p>
      </header>

      {/* Filtros (sticky en scroll) */}
      <div
        className="sticky top-0 z-30 border-y border-white/[.07] backdrop-blur-md"
        style={{ background: "rgba(10,10,10,0.85)" }}
      >
        <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto py-4 flex flex-wrap items-center gap-3 max-[960px]:gap-2 text-[12px] max-[960px]:text-[11px]" style={{ color: "var(--wh)" }}>
          <FilterSelect
            label={t.academy.network.filterCountry}
            value={filters.country}
            onChange={(v) => setFilter("country", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_COUNTRIES.map(c => ({ value: c, label: c }))]}
          />
          <FilterSelect
            label={t.academy.network.filterLanguage}
            value={filters.language}
            onChange={(v) => setFilter("language", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_LANGUAGES.map(l => ({ value: l, label: l.toUpperCase() }))]}
          />
          <FilterSelect
            label={t.academy.network.filterSpecialty}
            value={filters.specialty}
            onChange={(v) => setFilter("specialty", v)}
            options={[{ value: "all", label: t.academy.network.filterAll }, ...COACH_SPECIALTIES.map(s => ({ value: s, label: specialtyLabel(s) }))]}
          />
          {hasAnyFilter && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-[10px] tracking-[2px] uppercase text-[var(--g1)] hover:underline underline-offset-4"
            >
              {t.academy.network.filterReset}
            </button>
          )}
          <span className="ml-auto text-[11px] opacity-55 tracking-[2px] uppercase" style={{ color: "var(--wh)" }}>
            {filtered.length} / {allCoaches.length}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 max-[960px]:px-3 max-w-[1600px] mx-auto pt-10">
        {filtered.length === 0 ? (
          <div className="border theme-border px-6 py-14 text-center" style={{ color: "var(--wh)" }}>
            <p className="text-[14px] opacity-80 mb-4">{t.academy.coachesPage.emptyTitle}</p>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-bold tracking-[2px] uppercase text-[var(--g1)] border border-[var(--g1)]/40 hover:border-[var(--g1)] px-5 py-2.5 transition-all duration-300"
              style={{ borderRadius: 2 }}
            >
              {t.academy.coachesPage.emptyCta}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 max-[960px]:gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(min(260px, 100%), 1fr))" }}>
            {filtered.map((c) => (
              <CoachCard
                key={c.slug}
                coach={c}
                labels={gridLabels}
                onAsk={handleAsk}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export default function CoachesCatalogPage() {
  // useSearchParams requiere Suspense boundary en App Router.
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bk)]" />}>
      <CoachesCatalogContent />
    </Suspense>
  );
}
```

- [ ] **Step 6.3: Typecheck**

```bash
npm run typecheck
```

Expected: sin errores. Si falla por el tipo `ReadonlyURLSearchParams` en `parseCoachesFilters`, ya lo resolvimos con el alias local en Task 1. Si persiste, comprueba que `useSearchParams()` devuelve un objeto que tiene `.get(name)`.

- [ ] **Step 6.4: Verificación visual**

```bash
npm run dev
```

Abre los siguientes URLs y comprueba:
1. `http://localhost:3000/academy/coaches` — carga el catálogo completo (17 coaches, HQ primero).
2. Cambia el filtro de país a "Portugal" — la URL debe pasar a `?country=Portugal`, el grid se filtra.
3. `http://localhost:3000/academy/coaches?country=Francia&specialty=juniors` — carga directamente con filtros aplicados.
4. Click en "Volver a Academy" lleva a `/academy#network`.
5. Click en "Pregunta a J3" de cualquier card abre el ChatBubble con contexto.
6. Filtro que no coincide con nada (p.ej. país Francia + especialidad competicion) → empty state con "Quitar filtros".

Vuelve a `/academy`, filtra por país "Francia" en la sección Red J3, click en "Ver los X resultados completos →" — debe llevarte a `/academy/coaches?country=Francia` con el filtro ya aplicado.

Mata el dev server con Ctrl+C.

- [ ] **Step 6.5: Build completo para verificar que `/academy/coaches` genera ruta válida**

```bash
npm run build
```

Expected: éxito. En la tabla de rutas al final debe aparecer `/academy/coaches` (puede ser estática o dinámica, ambas son OK).

- [ ] **Step 6.6: Commit**

```bash
git add src/app/academy/coaches/
git commit -m "feat(coaches): nueva página /academy/coaches · filtros por URL"
```

---

## Task 7 — Check final y push

- [ ] **Step 7.1: Typecheck + build completos**

```bash
npm run typecheck && npm run build
```

Expected: ambos pasan sin errores.

- [ ] **Step 7.2: Verificar que no hemos roto otras páginas**

Arranca `npm run dev` y haz un smoke test rápido en:
- `http://localhost:3000/` — home
- `http://localhost:3000/academy` — academy completa (scrollea hasta Red J3)
- `http://localhost:3000/academy/coaches` — catálogo
- `http://localhost:3000/story` — story (por el cambio de href Coach360)
- Click en cualquier CTA Coach360 del site → debe abrir `https://j3padel.com/join` en pestaña nueva.
- Scroll por la home hasta el footer → enlaces funcionan.

- [ ] **Step 7.3: Push**

```bash
git push origin master
```

Vercel desplegará automáticamente. Comprueba el despliegue.

- [ ] **Step 7.4: Verificación post-deploy**

Una vez Vercel haya desplegado, verifica en la URL de producción:
1. `/academy` — sección Red J3 reducida, scroll corto.
2. `/academy/coaches` — catálogo completo.
3. `/academy/coaches?country=Portugal` — filtro compartible funciona.
4. Click en pin del mapa → popup enriquecido, no scroll.

---

## Resumen de verificación contra el spec

| Requisito del spec | Task | Verificación |
|---|---|---|
| `/academy` reducido a 6 (desktop) / 3 (mobile) destacados | Task 5 | Step 5.6 visual QA |
| Pick fallback: si faltan featured, rellenar con no-featured | Task 1 | `pickDisplayCoaches()` helper |
| CTA "Ver los N coaches" / "Ver los X resultados completos" | Task 5 | Step 5.6 visual QA |
| `/academy/coaches` nueva página con filtros URL | Task 6 | Step 6.4 (URLs compartibles) |
| Orden híbrido tier → joinedAt | Task 1 | `sortCoaches()` usado en Task 5 y Task 6 |
| Popup mapa enriquecido con foto/idiomas/CTA chat | Task 4 | Step 5.6 visual QA |
| Pin click NO hace scroll al grid | Task 4/5 | Step 5.6 visual QA (eliminado `handleMapSelect`) |
| `j3:chat:open` dispara con `coachName` + `coachLocation` | Task 4 | Step 5.6 visual QA (chat abre con mensaje) |
| `FilterSelect` reutilizado en ambas páginas | Tasks 2, 5, 6 | Typecheck + visual |
| i18n keys nuevas en 5 diccionarios | Task 3 | Typecheck |
| `joinedAt` en los 17 coaches | Task 1 | Typecheck (campo obligatorio) |
| 6 coaches `featured: true` | Task 1 | Step 5.6 visual QA (6 destacados visibles) |
