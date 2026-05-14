# J3 Lab V1 · Coaches + Head Coach Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactorizar el producto Coaches a la arquitectura definitiva (3 tiers + insignias limpias en Pro Coach + Head Coach como tier superior) y crear `/lab` como home del paraguas, dejando V1.5 (Players) como plan separado.

**Architecture:**
- Renombrado de nomenclatura en cascada (dictionary → types → data → componentes → páginas) sin tocar la mecánica funcional preservando todo el trabajo de copy existente.
- Adición del tier Head Coach como tercer escalón vertical encima del Pro Coach con su propia card destacada, sin convertirlo en página separada (vive como sección dentro de `/lab/coach`).
- Creación de `/lab` home como paraguas con cards a Coaches y Players (placeholder pre-lanzamiento).
- Refactor del componente `CaminoBlock` para presentar los 3 tiers + insignias horizontales en lugar de 4 escalones de grados.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript strict, Tailwind v4, shadcn/ui. Validación por fase: `npm run typecheck` + `npm run build` + revisión visual en `npm run dev`.

---

## File Structure

### Archivos que se MODIFICAN

| Archivo | Responsabilidad después del cambio |
|---|---|
| `src/i18n/dictionaries/_lab-coach-pricing-es.ts` | Copy ES de los 3 tiers + Head Coach + insignias limpias |
| `src/i18n/dictionaries/types.ts` | Tipos actualizados: keys renombradas, tipos del Head Coach añadidos |
| `src/data/lab-coach-pricing.ts` | Catálogo con 3 tiers, keys `coach`/`proCoach`/`headCoach`, sin grados intermedios |
| `src/components/CaminoBlock.tsx` | Componente refactorizado para mostrar 3 tiers + 3 insignias horizontales (en vez de 4 escalones de grados) |
| `src/app/lab/coach/page.tsx` | Landing del coach: nomenclatura refactor + bloque destacado Head Coach |
| `src/app/lab/coach/precios/page.tsx` | Servicios complementarios (Mentor, Examen, Verificación, Sesión Cero). Sin tiers (viven en /lab/coach) |

### Archivos que se CREAN

| Archivo | Responsabilidad |
|---|---|
| `src/app/lab/page.tsx` | Home del paraguas J3 Lab: hero + 2 cards (Coaches/Players) + banda Mentor |
| `src/app/lab/layout.tsx` | Metadata SEO del paraguas |
| `src/components/HeadCoachCard.tsx` | Bloque destacado del tier Head Coach dentro de /lab/coach: 6 pilares + retos + sesiones ganadas + track record |

---

## Plan de fases

```
FASE 1 — Refactor nomenclatura en cascada (sin Head Coach todavía)
   Cambios cosméticos y estructurales que no rompen mecánica.
   Validación: typecheck + build limpios después de cada tarea.

FASE 2 — Refactor del Camino (4 grados → 3 tiers + insignias)
   Refactor del componente CaminoBlock y su uso en /lab/coach.

FASE 3 — Añadir Head Coach como tercer tier
   Nuevos datos, copy, tipos y card destacada.

FASE 4 — Crear /lab home (paraguas)
   Nueva página con cards a Coaches y Players.

FASE 5 — Refactor /lab/coach/precios
   Limpiar la página de servicios complementarios.
```

---

# FASE 1 — Refactor de nomenclatura en cascada

Cambia los nombres en cascada empezando por las hojas (dictionary, types, data) y subiendo hacia las páginas. Sin tocar mecánica funcional. Sin añadir Head Coach todavía.

## Task 1.1: Renombrar tiers y limpiar insignias en el dictionary ES

**Files:**
- Modify: `src/i18n/dictionaries/_lab-coach-pricing-es.ts`

- [ ] **Step 1: Modificar la sección `pricing.suscripciones`**

En `_lab-coach-pricing-es.ts`, dentro de `coach.pricing.suscripciones`, renombrar las claves `coachBase` → `coach` y `coachPro` → `proCoach`. Cambiar los nombres visibles ("Plan Lab" → "Coach", "Plan Pro" → "Pro Coach"). Eliminar la referencia "Assistant Coach" del último feature de `coachBase` (queda "Cualificado al completar la Ruta 1" o similar — ver step 2 para texto exacto).

Reemplazar la sección completa por:

```ts
suscripciones: {
  eyebrow: "EL CAMINO",
  heading: "Elige tu tier",
  sub: "Cada tier incluye lo del anterior. Las insignias se ganan en Pro Coach.",
  billingToggle: {
    monthly: "Mensual",
    yearly: "Anual",
    saveLabel: "Ahorra",
  },
  coach: {
    name: "Coach",
    tagline: "La puerta del laboratorio. Empieza por los fundamentos del oficio.",
    description: "Acceso a la Ruta 1 desde el día 1 y un lote mensual de contenido complementario. Para coaches que entran al laboratorio.",
    features: [
      "Ruta 1 — Fundamentos del oficio (acceso libre)",
      "Lote mensual de contenido complementario",
      "Comunidad básica de coaches del Lab",
    ],
    cta: "Dar el salto",
  },
  proCoach: {
    badge: "EL CAMINO COMPLETO",
    name: "Pro Coach",
    tagline: "Las tres rutas, los directos en vivo y los sellos del oficio.",
    description: "Acceso libre a las tres rutas, programa de directos en vivo, archivo permanente, comunidad y acceso al equipo formativo. Las tres insignias se ganan aquí.",
    features: [
      "Acceso libre a las 3 rutas: Fundamentos del oficio, Fundamentos del juego, Diseño del jugador y del coach",
      "Programa de directos en vivo · todas las temáticas",
      "Archivo permanente y libre de directos pasados",
      "Todos los recursos descargables",
      "Comunidad activa de coaches J3",
      "Acceso al equipo formativo de Javi y Jorge",
      "Insignias disponibles: Cualificado · Certificado · Verificado",
      "Pre-requisito para el tier Head Coach",
    ],
    cta: "Dar el salto",
  },
},
```

- [ ] **Step 2: Modificar la sección `pricing.examen`**

Actualizar `examen.sub` y `examen.plan.features` para eliminar la mención a "Master Coach" como adjetivo. Reemplazar:

```ts
examen: {
  eyebrow: "PASO 2 · CERTIFICACIÓN",
  heading: "Examen de pruebas prácticas",
  sub: "No es ruta. Es un examen evaluado por humanos. Te lleva a la insignia Certificado.",
  plan: {
    name: "Examen de certificación",
    tagline: "Evaluación humana del equipo J3",
    description: "Grabas dos sesiones reales con tus alumnos. El equipo J3 las audita con la rúbrica completa y te devuelve un informe escrito en 7 días. Después, una llamada de evaluación de 45-60 minutos.",
    priceNote: "Pago único",
    features: [
      "Auditoría escrita por el equipo J3 en 7 días",
      "Llamada de evaluación 45-60 min",
      "Insignia Certificado al aprobar (sobre Pro Coach activo)",
      "Si no apruebas, recibes feedback escrito y vuelves a presentarte en 6 meses sin coste adicional",
    ],
    cta: "Solicitar examen",
  },
},
```

- [ ] **Step 3: Modificar el resto de claves obsoletas**

Buscar y reemplazar en el mismo archivo:
- `"Master Coach"` → eliminar el adjetivo. Casos concretos: `Master Coach Certificado` → `Certificado`, `Master Coach Verificado` → `Verificado`.
- `"Assistant Coach"` → eliminar referencias en features y descripciones. Si aparece como grado, eliminarlo. Si aparece como contexto, reformular.
- En `pricing.camino` (el objeto que define grados/insignias para el CaminoBlock), eliminar `assistantCoach` y `masterCoach` de la sub-clave `grados`, y actualizar `unlocks` para que use `coach`/`proCoach`/`headCoach` en vez de `planBase`/`planPro`. **NOTA:** este step requiere también actualizar `types.ts` (Task 1.2) y `data/lab-coach-pricing.ts` (Task 1.3) — los tres archivos deben quedar sincronizados al final de la Fase 1.

Para este step, deja TEMPORALMENTE las claves antiguas en pricing.camino. Las eliminaremos al refactorizar el CaminoBlock en Fase 2 (Task 2.2). Solo cambia los TEXTOS visibles dentro de pricing.camino:

```ts
camino: {
  eyebrow: "EL CAMINO",
  heading: "De Coach a Pro Coach a Head Coach",
  sub: "Tres tiers, tres insignias. El tier va con lo que pagas. Las insignias se ganan en Pro Coach.",
  // grados, insignias, unlocks, hitos, destinos: SE MANTIENEN INTACTOS POR AHORA.
  // Se refactorizan en Fase 2 (Task 2.2) cuando toquemos el CaminoBlock.
},
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS sin errores. Los tipos en `types.ts` aún apuntan a `coachBase`/`coachPro` así que el typecheck FALLARÁ con errores tipo "Object literal may only specify known properties, and 'coach' does not exist in type". **Esto es esperado** — lo arreglamos en Task 1.2.

- [ ] **Step 5: NO commit todavía**

No commiteamos hasta que types.ts y data/lab-coach-pricing.ts estén alineados con el dictionary (Tasks 1.2 y 1.3). Solo entonces el typecheck pasará. Si commiteamos ahora, dejamos master roto.

---

## Task 1.2: Actualizar types.ts con la nueva nomenclatura

**Files:**
- Modify: `src/i18n/dictionaries/types.ts`

- [ ] **Step 1: Buscar las claves `coachBase` y `coachPro` en el tipo `pricing.suscripciones`**

Abrir `src/i18n/dictionaries/types.ts` y localizar la sección `readonly suscripciones: { ... }` (línea aproximada 1180-1230, dentro de `pricing`).

- [ ] **Step 2: Renombrar las claves**

Reemplazar:

```ts
readonly suscripciones: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly billingToggle: {
    readonly monthly: string;
    readonly yearly: string;
    readonly saveLabel: string;
  };
  readonly coachBase: {
    readonly name: string;
    readonly tagline: string;
    readonly description: string;
    readonly features: readonly string[];
    readonly cta: string;
  };
  readonly coachPro: {
    readonly badge: string;
    readonly name: string;
    readonly tagline: string;
    readonly description: string;
    readonly features: readonly string[];
    readonly cta: string;
  };
};
```

Por:

```ts
readonly suscripciones: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly billingToggle: {
    readonly monthly: string;
    readonly yearly: string;
    readonly saveLabel: string;
  };
  readonly coach: {
    readonly name: string;
    readonly tagline: string;
    readonly description: string;
    readonly features: readonly string[];
    readonly cta: string;
  };
  readonly proCoach: {
    readonly badge: string;
    readonly name: string;
    readonly tagline: string;
    readonly description: string;
    readonly features: readonly string[];
    readonly cta: string;
  };
};
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio (el dictionary y los tipos ya están alineados). Si hay errores residuales en `precios/page.tsx` por referencias a `coachBase`/`coachPro`, los arreglamos en Task 1.6. Ignora por ahora errores en `src/app/lab/coach/precios/page.tsx` — los abordamos en su tarea propia.

- [ ] **Step 4: NO commit todavía**

Esperamos a que data/lab-coach-pricing.ts también esté sincronizado (Task 1.3).

---

## Task 1.3: Actualizar data/lab-coach-pricing.ts con los nuevos IDs

**Files:**
- Modify: `src/data/lab-coach-pricing.ts`

- [ ] **Step 1: Renombrar IDs de planes**

Abrir `src/data/lab-coach-pricing.ts` y localizar `SUBSCRIPTION_PLANS` (línea ~65). Renombrar:

- `id: "coach-base"` → `id: "coach"`
- `id: "coach-pro"` → `id: "pro-coach"`

Y actualizar los `ctaHref` correspondientes:

- `coach-base` actual: `https://j3padel.com/join?plan=coach` → mantener
- `coach-pro` actual: `https://j3padel.com/join?plan=coach-pro` → mantener (o renombrar a `pro-coach` por consistencia, pero solo si el backend lo soporta — preguntar a Jorge antes de cambiar URLs Stripe en producción)

Decisión: **para V1, mantenemos los ctaHref existentes para evitar romper enlaces ya activos**. Solo renombramos los `id` internos. Lo que el coach ve en Stripe sigue siendo el mismo producto.

```ts
export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: "coach",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach",
    pricing: {
      monthly: { amount: 19, currency: "EUR" },
      yearly:  { amount: 144, currency: "EUR", savePct: 37 },
    },
  },
  {
    id: "pro-coach",
    variant: "subscription",
    ctaHref: "https://j3padel.com/join?plan=coach-pro",
    recommended: true,
    pricing: {
      monthly: { amount: 55, currency: "EUR" },
      yearly:  { amount: 540, currency: "EUR", savePct: 18 },
    },
  },
];
```

- [ ] **Step 2: Refactorizar CaminoStep (eliminar headCoach/masterCoach del campo gradoKey)**

Localizar el bloque `CaminoStep` (línea ~149) y `CAMINO_STEPS` (línea ~157). Por ahora, dejarlo como está — el refactor completo del Camino se hace en Fase 2. Solo verifica que no haya errores.

- [ ] **Step 3: Eliminar comentarios obsoletos**

Buscar y eliminar comentarios que mencionen "Plan Lab" o "Plan Pro" como si fueran nombres oficiales. Reemplazar por "Coach" / "Pro Coach". Por ejemplo, en el comentario sobre el TODO de los ctaHref (línea ~60), no es necesario tocarlo todavía — el plan de migración Stripe es trabajo futuro.

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio en los archivos modificados. Posibles errores en lugares que importan `SUBSCRIPTION_PLANS` y usan `id === "coach-base"` literalmente. Buscar y arreglar:

```bash
grep -rn '"coach-base"\|"coach-pro"' src/ --include="*.ts" --include="*.tsx"
```

Si hay coincidencias en `precios/page.tsx`, las arreglamos en Task 1.6. Otras coincidencias se arreglan en su tarea correspondiente.

- [ ] **Step 5: Commit (primer commit consolidado de Fase 1)**

```bash
git add src/i18n/dictionaries/_lab-coach-pricing-es.ts src/i18n/dictionaries/types.ts src/data/lab-coach-pricing.ts
git commit -m "refactor(lab/coach): renombrar tiers Plan Lab→Coach, Plan Pro→Pro Coach

- Dictionary ES con nueva nomenclatura
- Tipos sincronizados (coachBase/coachPro → coach/proCoach)
- Catálogo de datos con IDs renombrados internamente
- ctaHref de Stripe preservados (no se rompen enlaces actuales)
- Master Coach eliminado del léxico (solo Cualificado/Certificado/Verificado)
- Camino aún por refactorizar (Fase 2)

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 1.4: Refactorizar /lab/coach/page.tsx — comentarios y referencias en bloques existentes

**Files:**
- Modify: `src/app/lab/coach/page.tsx`

- [ ] **Step 1: Actualizar el comentario del header del archivo**

En el comentario superior del archivo (líneas 1-30 aprox), reemplazar referencias a "Plan Lab" / "Plan Pro" por "Coach" / "Pro Coach". Reemplazar bloque "5. El laboratorio (Plan Lab card)" por "5. El laboratorio (tier Coach card)" o similar.

- [ ] **Step 2: Buscar referencias internas a "Plan Lab" y "Plan Pro" en código**

```bash
grep -n "Plan Lab\|Plan Pro\|Master Coach\|Assistant Coach\|Rookie" src/app/lab/coach/page.tsx
```

Casos esperados (línea exacta puede variar tras edits anteriores):
- Comentarios del header
- Comentarios dentro de funciones (por ejemplo "Una sola card: el primer experimento (Plan Lab)")
- Tal vez algún string de copy hardcodeado (si lo hay)

Reemplazar cada uno por la nomenclatura correcta. Casos exactos:
- `"Plan Lab card"` → `"Coach card"` o `"Tier Coach card"`
- `"Plan Pro"` → `"Pro Coach"`
- Comentarios sobre "Master Coach" o "Assistant Coach" → eliminar o reformular

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 4: Commit**

```bash
git add src/app/lab/coach/page.tsx
git commit -m "refactor(lab/coach): comentarios y referencias a nueva nomenclatura

Comentarios internos del archivo actualizados:
- Plan Lab → Coach / tier Coach
- Plan Pro → Pro Coach
- Eliminadas menciones a Master Coach y Assistant Coach
- Header del archivo refleja arquitectura V3 con 3 tiers

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 1.5: Verificar arranque visual tras refactor de nomenclatura

**Files:** Sin cambios. Verificación visual.

- [ ] **Step 1: Levantar el dev server**

```bash
npm run dev
```

Expected: server arranca sin errores en puerto 3000 (o el que use el proyecto).

- [ ] **Step 2: Visitar /lab/coach en navegador**

URL: `http://localhost:3000/lab/coach`

Expected: la página se renderiza sin errores. Verificar visualmente:
- El bloque del Plan Lab card sigue diciendo "Coach" o lo que toque (depende del estado actual del bloque — pero NO debe decir "Plan Lab")
- El bloque del Camino aún muestra grados Rookie/Assistant/Master Coach **temporalmente** — eso es ESPERADO porque el refactor del Camino es Fase 2

Si hay errores en consola del navegador o errores de hidratación, parar y diagnosticar.

- [ ] **Step 3: Run build**

```bash
npm run build
```

Expected: build de producción limpio. Si falla, parar.

- [ ] **Step 4: NO commit (es solo verificación)**

---

# FASE 2 — Refactor del Camino (4 grados → 3 tiers + insignias horizontales)

Toca el componente `CaminoBlock` que actualmente muestra 4 escalones de grados (Rookie → Assistant Coach → Coach → Master Coach) para que muestre 3 tiers (Coach → Pro Coach → Head Coach) + 3 insignias horizontales (Cualificado · Certificado · Verificado).

## Task 2.1: Refactorizar el componente CaminoBlock

**Files:**
- Modify: `src/components/CaminoBlock.tsx`

- [ ] **Step 1: Leer el componente actual y entender su estructura**

```bash
cat src/components/CaminoBlock.tsx | head -80
```

Identifica:
- Las props `steps: CaminoStep[]` y `destinos`
- El render de los 4 escalones (grid 4 columnas)
- El render de la bifurcación final (destinos)
- Cómo se usan `grados`, `insignias`, `unlocks`, `hitos` del catalog

- [ ] **Step 2: Rediseñar las props de `CaminoTexts`**

Modificar la interfaz `CaminoTexts` para reflejar la nueva estructura: 3 tiers + 3 insignias horizontales. Reemplazar:

```ts
export interface CaminoTexts {
  eyebrow?: string;
  heading?: string;
  sub?: string;
  disclaimer?: string;
  closer?: string;
  grados: { assistantCoach: string; coach: string; masterCoach: string };
  insignias: { cualificado: string; certificado: string; verificado: string };
  unlocks?: { planBase: string; planPro: string; examen: string; merito: string };
  hitos?: { "01": string; "02": string; "03": string; "04": string };
  destinos?: {
    eyebrow: string;
    items: { business: { name: string; desc: string }; proCoach: { name: string; desc: string } };
  };
}
```

Por:

```ts
export interface CaminoTexts {
  eyebrow?: string;
  heading?: string;
  sub?: string;
  closer?: string;
  // Los 3 tiers verticales del Camino
  tiers: {
    coach: { name: string; desc: string; price: string };
    proCoach: { name: string; desc: string; price: string };
    headCoach: { name: string; desc: string; price: string };
  };
  // Las 3 insignias horizontales que viven en Pro Coach
  insignias: {
    cualificado: { name: string; desc: string };
    certificado: { name: string; desc: string };
    verificado: { name: string; desc: string };
  };
}
```

Eliminar `grados`, `unlocks`, `hitos`, `destinos`, `disclaimer` — ya no se usan en este componente.

- [ ] **Step 3: Eliminar la prop `steps` y `destinos` del componente**

Eliminar:

```ts
interface CaminoBlockProps {
  steps: readonly CaminoStep[];
  destinos?: readonly CaminoDestino[];
  texts: CaminoTexts;
  className?: string;
}
```

Reemplazar por:

```ts
interface CaminoBlockProps {
  texts: CaminoTexts;
  className?: string;
}
```

Y dentro del componente, eliminar todo el uso de `steps`, `destinos`, `step.gradoKey`, `step.insigniaKey`, `step.unlockKey`, `step.num`. El componente ya no es data-driven por catálogo — el copy y los datos vienen todos por `texts`.

- [ ] **Step 4: Reescribir el render**

Reemplazar todo el contenido del return del componente por una estructura más simple que muestre los 3 tiers verticalmente y las 3 insignias horizontalmente. El render debe quedar así:

```tsx
return (
  <section
    className={cn(
      "relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4",
      className,
    )}
    style={{ background: "var(--bk)" }}
  >
    <div className="relative max-w-[1200px] mx-auto">
      {/* Header opcional */}
      {(texts.eyebrow || texts.heading || texts.sub) && (
        <div
          ref={headerRef}
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          {texts.eyebrow && (
            <div className="text-[11px] tracking-[3px] uppercase text-[var(--champan)] mb-4 font-bold">
              {texts.eyebrow}
            </div>
          )}
          {texts.heading && (
            <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
              {texts.heading}
            </h2>
          )}
          {texts.sub && (
            <p className="text-[14px] max-[640px]:text-[13px] opacity-70 max-w-[640px] mx-auto leading-[1.55]">
              {texts.sub}
            </p>
          )}
        </div>
      )}

      {/* 3 tiers verticales */}
      <ol className="grid grid-cols-3 max-[960px]:grid-cols-1 gap-4 mb-14 max-[960px]:mb-10">
        {(["coach", "proCoach", "headCoach"] as const).map((tierKey, i) => {
          const tier = texts.tiers[tierKey];
          const isHeadCoach = tierKey === "headCoach";
          return (
            <li
              key={tierKey}
              ref={(el) => { itemRefs.current[i] = el as HTMLDivElement | null; }}
              className={cn(
                "relative flex flex-col p-6 rounded-[2px] border transition-colors duration-500",
                isHeadCoach
                  ? "border-[rgba(83,74,183,0.5)] bg-[rgba(83,74,183,0.03)]"
                  : "border-white/[.10] hover:border-[var(--champan)]/35 bg-white/[0.012]",
              )}
              style={{
                opacity: visibleItems[i] ? 1 : 0,
                transform: visibleItems[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.1}s`,
              }}
            >
              {isHeadCoach && (
                <span
                  aria-hidden
                  className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
                />
              )}
              <span aria-hidden className="block font-bold text-[40px] leading-[1] tracking-[-1.5px] text-[var(--champan)]/85 mb-4">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[18px] max-[960px]:text-[16px] font-bold uppercase tracking-[-0.2px] mb-2 leading-[1.2]">
                {tier.name}
              </h3>
              <p className="text-[13px] opacity-70 leading-[1.5] mb-4">
                {tier.desc}
              </p>
              <div className="mt-auto pt-3 border-t border-white/[.08]">
                <span className="text-[12px] tracking-[1px] uppercase text-[var(--champan)] font-bold">
                  {tier.price}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Insignias horizontales (viven en Pro Coach) */}
      <div className="relative max-w-[920px] mx-auto">
        <div className="text-center mb-6">
          <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]">
            Insignias disponibles en Pro Coach
          </span>
        </div>
        <div className="grid grid-cols-3 max-[640px]:grid-cols-1 gap-4">
          {(["cualificado", "certificado", "verificado"] as const).map((insigniaKey) => {
            const insignia = texts.insignias[insigniaKey];
            const isVerificado = insigniaKey === "verificado";
            return (
              <article
                key={insigniaKey}
                className={cn(
                  "flex flex-col items-start p-4 rounded-[2px] border bg-white/[0.012]",
                  insigniaKey === "cualificado" && "border-[rgba(155,209,192,0.45)]",
                  insigniaKey === "certificado" && "border-[rgba(232,199,154,0.45)]",
                  isVerificado && "border-[rgba(83,74,183,0.65)]",
                )}
              >
                <span
                  className={cn(
                    "text-[10px] font-bold tracking-[1.5px] uppercase mb-2",
                    insigniaKey === "cualificado" && "text-[#9bd1c0]",
                    insigniaKey === "certificado" && "text-[#e8c79a]",
                    isVerificado && "text-[#a89efc]",
                  )}
                >
                  {insignia.name}
                </span>
                <p className="text-[12.5px] opacity-70 leading-[1.45]">
                  {insignia.desc}
                </p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Closer opcional */}
      {texts.closer && (
        <p className="max-w-[680px] mx-auto text-center text-[14px] max-[640px]:text-[13px] leading-[1.55] mt-14 max-[960px]:mt-10 text-[var(--champan)]/85 font-medium">
          {texts.closer}
        </p>
      )}
    </div>
  </section>
);
```

- [ ] **Step 5: Eliminar imports no usados**

Tras el refactor, eliminar el import `import type { CaminoStep, CaminoDestino } from "@/data/lab-coach-pricing";` si ya no se usa. Eliminar también la función `VerifiedCheck` y la constante `INSIGNIA_STYLES` si ya no se usan (probablemente sí — el `VerifiedCheck` aún es útil si queremos mantener el check Instagram en la insignia Verificado, pero la versión propuesta arriba no lo usa; descartar para simplificar).

- [ ] **Step 6: Eliminar el useStaggerReveal o ajustar a length 3**

El hook `useStaggerReveal(steps.length, 0.2)` ya no recibe `steps`. Ajustar a:

```ts
const { itemRefs, visibleItems } = useStaggerReveal(3, 0.2);
```

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```

Expected: errores en `src/app/lab/coach/page.tsx` porque el uso del componente CaminoBlock ya no cuadra con la nueva interfaz. Esos los arreglamos en Task 2.2. Otros errores deberían ser cero.

- [ ] **Step 8: NO commit todavía**

Esperamos a tener actualizado el uso del componente en `/lab/coach/page.tsx` (Task 2.2).

---

## Task 2.2: Actualizar el uso del CaminoBlock en /lab/coach/page.tsx

**Files:**
- Modify: `src/app/lab/coach/page.tsx`
- Modify: `src/i18n/dictionaries/_lab-coach-pricing-es.ts` (sección `landing.camino`)
- Modify: `src/i18n/dictionaries/types.ts` (tipo de `landing.camino`)

- [ ] **Step 1: Actualizar el tipo `landing.camino` en types.ts**

Localizar el tipo `readonly camino: { ... }` dentro de `landing` en `types.ts` (línea ~980). Reemplazar:

```ts
readonly camino: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly closer?: string;
};
```

Por:

```ts
readonly camino: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly closer?: string;
  readonly tiers: {
    readonly coach: { readonly name: string; readonly desc: string; readonly price: string };
    readonly proCoach: { readonly name: string; readonly desc: string; readonly price: string };
    readonly headCoach: { readonly name: string; readonly desc: string; readonly price: string };
  };
  readonly insignias: {
    readonly cualificado: { readonly name: string; readonly desc: string };
    readonly certificado: { readonly name: string; readonly desc: string };
    readonly verificado: { readonly name: string; readonly desc: string };
  };
};
```

- [ ] **Step 2: Añadir copy del Camino al dictionary**

En `_lab-coach-pricing-es.ts`, dentro de `coach.landing.camino`, AÑADIR tiers e insignias al objeto existente:

```ts
camino: {
  eyebrow: "El Camino",
  heading: "Aquí todos empiezan como Coach.",
  sub: "Tres tiers. Cada uno incluye lo del anterior. Las insignias se ganan en Pro Coach.",
  closer: "Tu progreso queda en tu perfil. Tu nombre, en el directorio público.",
  tiers: {
    coach: {
      name: "Coach",
      desc: "Entras al laboratorio. Aprendes los fundamentos del oficio.",
      price: "19€/mes",
    },
    proCoach: {
      name: "Pro Coach",
      desc: "Dominas el oficio completo. Las tres rutas, los directos en vivo, la comunidad. Aquí se ganan las insignias.",
      price: "desde 540€/año",
    },
    headCoach: {
      name: "Head Coach",
      desc: "Te ocupas del negocio. Captación, posicionamiento, gestión, comunicación. Retos mensuales y sesiones ganadas con el equipo J3.",
      price: "desde 840€/año",
    },
  },
  insignias: {
    cualificado: {
      name: "Cualificado",
      desc: "Al completar las 3 rutas con Pro Coach al día.",
    },
    certificado: {
      name: "Certificado",
      desc: "Vía Examen J3 (490€ pago único).",
    },
    verificado: {
      name: "Verificado",
      desc: "Auditoría humana, gratis, por mérito.",
    },
  },
},
```

- [ ] **Step 3: Actualizar la invocación del CaminoBlock en page.tsx**

Localizar la invocación de `<CaminoBlock ... />` en `src/app/lab/coach/page.tsx` (línea ~682) y reemplazar por:

```tsx
<CaminoBlock
  texts={{
    eyebrow: tl.camino.eyebrow,
    heading: tl.camino.heading,
    sub: tl.camino.sub,
    closer: tl.camino.closer,
    tiers: tl.camino.tiers,
    insignias: tl.camino.insignias,
  }}
/>
```

Eliminar las props `steps`, `destinos`, `grados`, `insignias` (las viejas), `unlocks`, `hitos`, `destinos` que se pasaban antes.

- [ ] **Step 4: Eliminar el import `CAMINO_STEPS`**

En page.tsx, eliminar el import si ya no se usa:

```tsx
import { CAMINO_STEPS } from "@/data/lab-coach-pricing";  // ← ELIMINAR
```

Verificar que no hay otros usos en el archivo: `grep -n "CAMINO_STEPS\|CAMINO_DESTINOS" src/app/lab/coach/page.tsx`. Si aparece solo en el import, eliminar la línea entera.

- [ ] **Step 5: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio en page.tsx y CaminoBlock.tsx. Posibles errores residuales en `precios/page.tsx` (lo abordamos en Task 1.6). Si hay errores en otros archivos por usos legacy de `CAMINO_STEPS`, arreglarlos.

- [ ] **Step 6: Run build**

```bash
npm run build
```

Expected: build limpio. Si falla, parar y diagnosticar.

- [ ] **Step 7: Verificar visualmente**

```bash
npm run dev
```

Visitar `http://localhost:3000/lab/coach` y comprobar que el bloque "El Camino" se renderiza con:
- 3 tiers verticales (Coach · Pro Coach · Head Coach), no 4 escalones de grados
- Head Coach con borde violeta (rgba 83,74,183) y banda superior gradiente
- 3 insignias horizontales debajo (Cualificado · Certificado · Verificado)
- El closer si está presente

Si algo se ve mal, arreglar antes de commit.

- [ ] **Step 8: Commit**

```bash
git add src/components/CaminoBlock.tsx src/app/lab/coach/page.tsx src/i18n/dictionaries/_lab-coach-pricing-es.ts src/i18n/dictionaries/types.ts
git commit -m "refactor(camino): 4 grados → 3 tiers + 3 insignias horizontales

- CaminoBlock rediseñado: data-driven por texts.tiers/texts.insignias,
  no por catálogo de pasos.
- Tipo CaminoTexts simplificado: sin grados ni unlocks ni hitos.
- Dictionary landing.camino con tiers (Coach/Pro Coach/Head Coach)
  + insignias (Cualificado/Certificado/Verificado).
- /lab/coach: el bloque del Camino ahora muestra los 3 tiers verticales
  + 3 insignias horizontales. Head Coach destacado visualmente.
- Eliminado uso de CAMINO_STEPS desde page.tsx.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 2.3: Limpiar /lab/coach/precios/page.tsx — eliminar tiers y referencias obsoletas

**Files:**
- Modify: `src/app/lab/coach/precios/page.tsx`
- Modify: `src/i18n/dictionaries/_lab-coach-pricing-es.ts` (sección `pricing.firstYearMath`)

- [ ] **Step 1: Identificar bloques a eliminar de /precios**

`/precios` actualmente muestra suscripciones (Plan Lab + Plan Pro), examen, mentor, sesión cero, verificación, firstYearMath, faq. Tras este refactor:

- **Eliminar:** el bloque de suscripciones (los tiers viven en `/lab/coach`)
- **Mantener:** examen, mentor, sesión cero, verificación, firstYearMath (actualizado), faq

Abrir `src/app/lab/coach/precios/page.tsx` y localizar el componente que renderiza las suscripciones (probablemente `SuscripcionesSection` o similar). Eliminar su uso del JSX principal de la página.

- [ ] **Step 2: Eliminar la función SuscripcionesSection**

Eliminar la función entera que renderiza las suscripciones desde el archivo `precios/page.tsx`. Si se llama de otra manera, identificarla con:

```bash
grep -n "coachBase\|coachPro\|suscripciones" src/app/lab/coach/precios/page.tsx
```

Eliminar la función y todas sus referencias. También eliminar el hook `useState` para el billing toggle si ya no se usa en otros lugares.

- [ ] **Step 3: Actualizar comentarios y referencias en `precios/page.tsx`**

Buscar y reemplazar en el archivo:

```bash
grep -n "Plan Lab\|Plan Pro\|Master Coach\|Assistant Coach" src/app/lab/coach/precios/page.tsx
```

Para cada coincidencia:
- "Plan Lab" → "Coach" (si es un tier nombrado)
- "Plan Pro" → "Pro Coach"
- "Master Coach" → eliminar adjetivo o reformular
- "Assistant Coach" → eliminar (no aparece como grado activo)

- [ ] **Step 4: Refactorizar el tipo `pricing.suscripciones` (revisión)**

Si tras la eliminación de la sección de suscripciones nadie usa el tipo `pricing.suscripciones`, lo dejamos en types.ts por si se reutiliza en el futuro (no rompe nada). Pero si quieres limpiar:

Opción A (mantener tipo, no usado): no hacer nada. Útil si algún día se reactiva.
Opción B (eliminar tipo): eliminar `readonly suscripciones: { ... }` del tipo `pricing`.

Recomendación: **Opción A** (mantener). El tipo es solo declaración, no genera bundle.

- [ ] **Step 5: Actualizar `pricing.firstYearMath` con precios V1**

En `_lab-coach-pricing-es.ts`, dentro de `coach.pricing.firstYearMath.rows`, actualizar los nombres:

```ts
firstYearMath: {
  eyebrow: "INVERSIÓN AÑO 1",
  heading: "Cuánto te cuesta cada camino",
  sub: "Referencia comercial sobre los caminos típicos. La Verificación no aparece porque es gratuita.",
  rows: {
    base: "Coach anual (referencia)",
    pro: "Pro Coach anual",
    proExamen: "Pro Coach + examen",
    proExamenSprint: "Pro Coach + examen + Mentor Sprint",
    proExamenProg: "Pro Coach + examen + Mentor Programa",
  },
  note: "El founder rate (solo coaches actuales del Lab) reduce los paquetes Mentor un 30%.",
},
```

Si la fila base "Coach anual" no tiene sentido (porque Coach es solo mensual a 19€), eliminarla del `rows` y también del array `FIRST_YEAR_ROWS` en `data/lab-coach-pricing.ts`. Decisión rápida: eliminar la fila `base` para no confundir.

Editar `data/lab-coach-pricing.ts`:

```ts
export const FIRST_YEAR_ROWS: FirstYearRow[] = [
  { id: "pro",             amount: "540€"   },
  { id: "proExamen",       amount: "1.030€" },
  { id: "proExamenSprint", amount: "1.925€" },
  { id: "proExamenProg",   amount: "3.525€" },
];
```

Y en el dictionary, eliminar `rows.base`.

Y en `types.ts`, ajustar el tipo `pricing.firstYearMath.rows`:

```ts
readonly firstYearMath: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly rows: {
    readonly pro: string;
    readonly proExamen: string;
    readonly proExamenSprint: string;
    readonly proExamenProg: string;
  };
  readonly note: string;
};
```

- [ ] **Step 6: Actualizar FAQ de /precios para nueva nomenclatura**

En `_lab-coach-pricing-es.ts`, dentro de `coach.pricing.faq.items`, revisar cada pregunta-respuesta y reemplazar referencias a "Plan Lab" / "Plan Pro" / "Master Coach" por la nueva nomenclatura. Por ejemplo:

- "¿Puedo saltarme el Plan Lab e ir directo al Plan Pro?" → "¿Puedo saltarme el Coach e ir directo al Pro Coach?"
- "Los 19€/mes del Plan Lab son la puerta para todos." → "Los 19€/mes del Coach son la puerta para todos."
- "Master Coach" → eliminar el adjetivo en referencias a insignias.

Hacer la revisión exhaustivamente sobre cada FAQ existente.

- [ ] **Step 7: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 8: Run build**

```bash
npm run build
```

Expected: build limpio.

- [ ] **Step 9: Verificar visualmente**

```bash
npm run dev
```

Visitar `http://localhost:3000/lab/coach/precios`. Comprobar:
- El bloque de suscripciones ya NO aparece (los tiers están en /lab/coach)
- Examen, Mentor, Sesión Cero, Verificación se ven correctamente con nueva nomenclatura
- firstYearMath sin la fila base, con nombres actualizados
- FAQ sin "Plan Lab" / "Plan Pro" / "Master Coach"

- [ ] **Step 10: Commit**

```bash
git add src/app/lab/coach/precios/page.tsx src/i18n/dictionaries/_lab-coach-pricing-es.ts src/i18n/dictionaries/types.ts src/data/lab-coach-pricing.ts
git commit -m "refactor(precios): eliminar tiers, actualizar nomenclatura

- Eliminado bloque de suscripciones de /lab/coach/precios.
  Los tiers (Coach/Pro Coach/Head Coach) viven en /lab/coach.
- /precios queda con servicios complementarios:
  Examen, Mentor, Sesión Cero, Verificación, firstYearMath, FAQ.
- firstYearMath actualizado: fila 'base' eliminada (Coach es mensual,
  no anual). Nomenclatura nueva en rows.
- FAQ revisado pregunta a pregunta: nueva nomenclatura.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

# FASE 3 — Añadir Head Coach como tercer tier

Hasta aquí hemos refactorizado la nomenclatura existente. Ahora añadimos el tier nuevo: Head Coach.

## Task 3.1: Añadir Head Coach al catálogo de datos

**Files:**
- Modify: `src/data/lab-coach-pricing.ts`

- [ ] **Step 1: Añadir HEAD_COACH_PLAN al catálogo**

Después del bloque `SUBSCRIPTION_PLANS` en `lab-coach-pricing.ts`, AÑADIR:

```ts
// Head Coach: tercer tier vertical. Requiere Pro Coach activo + 3 rutas
// completadas + insignia Cualificado activa (validación operativa).
export const HEAD_COACH_PLAN: SubscriptionPlan = {
  id: "head-coach",
  variant: "subscription",
  ctaHref: "https://j3padel.com/join?plan=head-coach",
  recommended: false,
  pricing: {
    monthly: { amount: 90, currency: "EUR" },   // mensual fraccionado: 1.080€/año
    yearly:  { amount: 840, currency: "EUR", savePct: 22 },  // anual pago único
  },
};

// Modalidad trimestral de Head Coach: 900€/año (4 pagos de 225€).
// Como SUBSCRIPTION_PLANS solo soporta monthly + yearly, exponemos el
// trimestral como dato auxiliar para la UI.
export const HEAD_COACH_QUARTERLY: { amount: number; currency: Currency; perPaymentAmount: number } = {
  amount: 900,
  currency: "EUR",
  perPaymentAmount: 225,
};
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio. Si hay error porque `Currency` no está importado en el scope donde lo usamos, asegurarse de que el tipo `Currency` está definido en el mismo archivo (ya lo está, línea 15).

- [ ] **Step 3: Commit**

```bash
git add src/data/lab-coach-pricing.ts
git commit -m "feat(data): añadir HEAD_COACH_PLAN al catálogo

- Tier Head Coach: 840€/año pago único, 900€ trimestral (225€/cuota),
  90€/mes fraccionado.
- recommended: false (Pro Coach mantiene el recommended).
- Trimestral expuesto como dato auxiliar (HEAD_COACH_QUARTERLY) para
  la UI ya que SubscriptionPlan solo soporta monthly + yearly.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

## Task 3.2: Añadir tipo + copy del Head Coach al dictionary

**Files:**
- Modify: `src/i18n/dictionaries/types.ts`
- Modify: `src/i18n/dictionaries/_lab-coach-pricing-es.ts`

- [ ] **Step 1: Añadir tipo `landing.headCoach` a types.ts**

En `types.ts`, dentro del tipo `landing` (al mismo nivel que `hero`, `metodo`, `camino`, etc.), AÑADIR el tipo nuevo:

```ts
readonly headCoach: {
  readonly eyebrow: string;
  readonly heading: string;
  readonly sub: string;
  readonly tagline: string;
  readonly price: {
    readonly main: string;  // ej: "840€/año"
    readonly subline: string; // ej: "o 90€/mes mensualizado · 225€/trimestral"
  };
  readonly pilares: readonly {
    readonly num: string;
    readonly title: string;
    readonly desc: string;
  }[];
  readonly retos: {
    readonly title: string;
    readonly description: string;
    readonly tiers: readonly {
      readonly label: string;
      readonly reward: string;
    }[];
  };
  readonly trackRecord: {
    readonly title: string;
    readonly description: string;
  };
  readonly cta: string;
  readonly access: string;  // texto sobre requisitos de acceso
};
```

- [ ] **Step 2: Añadir el copy correspondiente al dictionary**

En `_lab-coach-pricing-es.ts`, dentro de `coach.landing`, AÑADIR después de `camino`:

```ts
headCoach: {
  eyebrow: "Tier Head Coach",
  heading: "El siguiente nivel: tu negocio como coach.",
  sub: "Para coaches que ya dominan el oficio y quieren ocuparse de lo que pasa fuera de pista: llenar la pista, subir la tarifa, dinamizar su práctica o su academia.",
  tagline: "Membership continua con drip mensual + retos con premio.",
  price: {
    main: "840€/año pago único",
    subline: "o 225€/trimestral · 90€/mes mensualizado",
  },
  pilares: [
    { num: "01", title: "Captación local", desc: "Instagram, web simple, Google My Business, eventos club, referencias estructuradas." },
    { num: "02", title: "Posicionamiento y autoridad", desc: "Marca personal del coach. Diferenciación. Ser referente en tu comunidad." },
    { num: "03", title: "Gestión y operación", desc: "Agenda, paquetes, sistemas de reservas, retención de alumnos, fidelización de familias." },
    { num: "04", title: "Economía y precios", desc: "Cómo subir tarifa sin perder alumnos. Paquetizar. Hablar de precio." },
    { num: "05", title: "Mentalidad y liderazgo", desc: "Creencias limitantes. Hablar en público. Comunicar autoridad. Dirigir equipo si lo tienes." },
    { num: "06", title: "Dinamización de academia", desc: "Eventos, ligas internas, comunicación con familias, comunidad alrededor de tu academia." },
  ],
  retos: {
    title: "Retos mensuales · se ganan, no se compran",
    description: "Cada mes hay un reto opcional con criterios públicos. Lo completas con evidencia real, no con respuesta teórica.",
    tiers: [
      { label: "Completas el reto", reward: "Sesión grupal mensual con Javi/Jorge (60 min)" },
      { label: "Top 3 del mes", reward: "Sesión 1:1 con Javi o Jorge (45-60 min)" },
      { label: "Top 3 destacados", reward: "Caso real en el lote siguiente del módulo" },
    ],
  },
  trackRecord: {
    title: "Track record público",
    description: "Los retos ganados se acumulan como trayectoria visible de tu trabajo. No es una insignia más — es evidencia real de tu práctica.",
  },
  cta: "Dar el salto al Head Coach",
  access: "Requiere Pro Coach activo + las 3 rutas completadas + insignia Cualificado al día.",
},
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 4: NO commit todavía**

Esperamos a tener el componente `HeadCoachCard` y su uso en page.tsx (Task 3.3 y 3.4).

---

## Task 3.3: Crear el componente HeadCoachCard

**Files:**
- Create: `src/components/HeadCoachCard.tsx`

- [ ] **Step 1: Crear el archivo del componente**

Crear el archivo `src/components/HeadCoachCard.tsx` con el siguiente contenido:

```tsx
"use client";

/* ──────────────────────────────────────────────
   HeadCoachCard — bloque destacado del tier Head Coach
   dentro de /lab/coach.

   Presenta el tier superior con sus 6 pilares + mecánica de
   retos mensuales + track record. Diferenciado visualmente
   con paleta morado/champán para no confundir con el Plan
   Coach card que ya existe.

   Toda la información viene por props (texts) — el componente
   es agnóstico del dictionary.
   ────────────────────────────────────────────── */

import { useReveal, useStaggerReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

export interface HeadCoachTexts {
  eyebrow: string;
  heading: string;
  sub: string;
  tagline: string;
  price: {
    main: string;
    subline: string;
  };
  pilares: readonly {
    num: string;
    title: string;
    desc: string;
  }[];
  retos: {
    title: string;
    description: string;
    tiers: readonly {
      label: string;
      reward: string;
    }[];
  };
  trackRecord: {
    title: string;
    description: string;
  };
  cta: string;
  access: string;
}

interface HeadCoachCardProps {
  texts: HeadCoachTexts;
  ctaHref: string;
  className?: string;
}

export function HeadCoachCard({ texts, ctaHref, className }: HeadCoachCardProps) {
  const { ref: headerRef, visible: headerVisible } = useReveal(0.1);
  const { itemRefs: pilarRefs, visibleItems: pilarVisible } = useStaggerReveal(texts.pilares.length, 0.08);
  const { ref: retosRef, visible: retosVisible } = useReveal(0.1);
  const { ref: trackRef, visible: trackVisible } = useReveal(0.1);

  return (
    <section
      className={cn(
        "relative py-[100px] max-[960px]:py-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]",
        className,
      )}
      style={{ background: "var(--bk)" }}
    >
      <div className="relative max-w-[1200px] mx-auto">
        {/* Banda superior gradiente (mismo lenguaje visual que el tier en CaminoBlock) */}
        <span
          aria-hidden
          className="absolute top-0 left-12 right-12 max-[960px]:left-6 max-[960px]:right-6 max-[640px]:left-4 max-[640px]:right-4 h-[2px] bg-gradient-to-r from-transparent via-[#534AB7] to-transparent"
        />

        {/* Header */}
        <div
          ref={headerRef}
          className="text-center mb-14 max-[960px]:mb-10"
          style={{
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[3px] uppercase text-[#a89efc] mb-4 font-bold">
            {texts.eyebrow}
          </div>
          <h2 className="font-bold text-[clamp(32px,4.5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-4">
            {texts.heading}
          </h2>
          <p className="text-[14px] max-[640px]:text-[13px] opacity-75 max-w-[680px] mx-auto leading-[1.55] mb-3">
            {texts.sub}
          </p>
          <p className="text-[13px] italic opacity-65 max-w-[600px] mx-auto leading-[1.5]">
            {texts.tagline}
          </p>
        </div>

        {/* 6 pilares */}
        <div className="grid grid-cols-3 max-[960px]:grid-cols-2 max-[640px]:grid-cols-1 gap-4 mb-14">
          {texts.pilares.map((p, i) => (
            <article
              key={p.num}
              ref={(el) => { pilarRefs.current[i] = el as HTMLDivElement | null; }}
              className="flex flex-col p-5 rounded-[2px] border border-white/[.10] bg-white/[0.012] hover:border-[rgba(83,74,183,0.4)] transition-colors duration-500"
              style={{
                opacity: pilarVisible[i] ? 1 : 0,
                transform: pilarVisible[i] ? "none" : "translateY(20px)",
                transition: `all 0.9s cubic-bezier(.16,1,.3,1) ${i * 0.07}s`,
              }}
            >
              <span aria-hidden className="block font-bold text-[28px] leading-[1] tracking-[-1px] text-[#a89efc]/85 mb-3">
                {p.num}
              </span>
              <h3 className="text-[14px] font-bold uppercase tracking-[-0.2px] mb-2 leading-[1.2]">
                {p.title}
              </h3>
              <p className="text-[12.5px] opacity-70 leading-[1.5]">
                {p.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Retos mensuales */}
        <div
          ref={retosRef}
          className="max-w-[920px] mx-auto p-7 max-[960px]:p-5 rounded-[2px] border border-[rgba(83,74,183,0.4)] bg-[rgba(83,74,183,0.03)] mb-10"
          style={{
            opacity: retosVisible ? 1 : 0,
            transform: retosVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.1s",
          }}
        >
          <h3 className="font-bold text-[18px] uppercase tracking-[-0.2px] mb-2 text-[#a89efc]">
            {texts.retos.title}
          </h3>
          <p className="text-[13px] opacity-75 leading-[1.55] mb-5">
            {texts.retos.description}
          </p>
          <div className="space-y-2.5">
            {texts.retos.tiers.map((t) => (
              <div key={t.label} className="flex items-start gap-3">
                <span aria-hidden className="text-[#a89efc] text-[14px] leading-none mt-[2px] flex-shrink-0">
                  ●
                </span>
                <div className="flex-1">
                  <span className="text-[12.5px] font-bold uppercase tracking-[0.5px] text-[var(--cream)]">
                    {t.label}
                  </span>
                  <span className="text-[12.5px] opacity-70 ml-2">
                    → {t.reward}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Track record */}
        <div
          ref={trackRef}
          className="max-w-[680px] mx-auto text-center mb-10"
          style={{
            opacity: trackVisible ? 1 : 0,
            transform: trackVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1) 0.15s",
          }}
        >
          <h3 className="text-[11px] font-bold tracking-[2.5px] uppercase text-[#a89efc] mb-2">
            {texts.trackRecord.title}
          </h3>
          <p className="text-[13.5px] opacity-80 leading-[1.55]">
            {texts.trackRecord.description}
          </p>
        </div>

        {/* Precio + CTA */}
        <div className="text-center">
          <div className="mb-2">
            <span className="text-[22px] font-bold text-[var(--cream)] tracking-[-0.5px]">
              {texts.price.main}
            </span>
          </div>
          <p className="text-[12px] opacity-65 mb-6">
            {texts.price.subline}
          </p>
          <a
            href={ctaHref}
            className="inline-flex items-center justify-center min-h-[52px] px-8 py-3 text-[12px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[#534AB7] text-[var(--cream)] border border-[#534AB7] hover:bg-[#3d3690] hover:border-[#3d3690] transition-all duration-300"
          >
            {texts.cta}
            <span aria-hidden className="ml-2">→</span>
          </a>
          <p className="text-[11.5px] opacity-55 mt-4 italic max-w-[560px] mx-auto leading-[1.45]">
            {texts.access}
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 3: NO commit todavía**

Esperamos a usar el componente en page.tsx (Task 3.4).

---

## Task 3.4: Usar HeadCoachCard en /lab/coach/page.tsx

**Files:**
- Modify: `src/app/lab/coach/page.tsx`

- [ ] **Step 1: Importar HeadCoachCard**

En el bloque de imports de `src/app/lab/coach/page.tsx`, AÑADIR:

```tsx
import { HeadCoachCard } from "@/components/HeadCoachCard";
import { HEAD_COACH_PLAN } from "@/data/lab-coach-pricing";
```

- [ ] **Step 2: Insertar HeadCoachCard en el JSX principal**

Decisión de posición: insertar **después** del bloque `CaminoBlock` y **antes** del bloque `NegocioSection`. Es decir, la secuencia narrativa queda:

```
Hero → Quiz → Sistema → MensajesLaboratorio → QueHayDentro (Coach card)
  → CaminoBlock (3 tiers visibles, Head Coach destacado dentro)
  → HeadCoachCard (deep dive del tier superior)  ← NUEVO
  → NegocioSection → FaqSection → CtaFinalSection
```

Localizar el `<CaminoBlock ... />` en el JSX (línea aproximada 690) y añadir inmediatamente después:

```tsx
<CaminoBlock
  texts={{
    eyebrow: tl.camino.eyebrow,
    heading: tl.camino.heading,
    sub: tl.camino.sub,
    closer: tl.camino.closer,
    tiers: tl.camino.tiers,
    insignias: tl.camino.insignias,
  }}
/>
<HeadCoachCard
  texts={tl.headCoach}
  ctaHref={HEAD_COACH_PLAN.ctaHref}
/>
<NegocioSection texts={tl.negocio} />
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 4: Run build**

```bash
npm run build
```

Expected: build limpio.

- [ ] **Step 5: Verificar visualmente**

```bash
npm run dev
```

Visitar `http://localhost:3000/lab/coach`. Scroll hasta debajo del Camino. Verificar:
- El bloque Head Coach aparece con paleta morado/champán
- 6 pilares numerados 01-06 en grid 3 columnas (1 columna en mobile)
- Bloque de retos mensuales con tres tiers de premios
- Track record textual
- Precio + CTA "Dar el salto al Head Coach"
- Pie con "Requiere Pro Coach activo + las 3 rutas..."

- [ ] **Step 6: Commit**

```bash
git add src/i18n/dictionaries/types.ts src/i18n/dictionaries/_lab-coach-pricing-es.ts src/components/HeadCoachCard.tsx src/app/lab/coach/page.tsx
git commit -m "feat(lab/coach): añadir bloque destacado Head Coach

- Tipo landing.headCoach con 6 pilares + retos + trackRecord.
- Copy ES completo del tier.
- Componente HeadCoachCard: paleta morado/champán (#534AB7 / #a89efc),
  6 pilares numerados, bloque de retos con premios escalonados,
  track record, precio principal + CTA.
- Insertado en /lab/coach después del CaminoBlock y antes del Negocio:
  deep dive del tier superior tras presentación del Camino.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

# FASE 4 — Crear /lab home (paraguas)

Página nueva que presenta J3 Lab como paraguas con cards a Coaches y Players (placeholder pre-lanzamiento).

## Task 4.1: Añadir copy del paraguas al dictionary

**Files:**
- Modify: `src/i18n/dictionaries/types.ts`
- Modify: `src/i18n/dictionaries/_lab-coach-pricing-es.ts`

- [ ] **Step 1: Añadir tipo `lab.umbrella` a types.ts**

En `types.ts`, dentro de `lab` (sibling a `coach`), AÑADIR el nuevo bloque de tipos. Si `lab.umbrella` aún no existe como sección, agregarlo. Si existe, completarlo. Localizar el nodo `readonly lab: { ... }` en types.ts (línea ~870) y añadir antes del `coach`:

```ts
readonly umbrella: {
  readonly hero: {
    readonly eyebrow: string;
    readonly headingPre: string;
    readonly headingAccent: string;
    readonly sub: string;
  };
  readonly cards: {
    readonly coaches: {
      readonly badge: string;
      readonly title: string;
      readonly description: string;
      readonly cta: string;
    };
    readonly players: {
      readonly badge: string;
      readonly title: string;
      readonly description: string;
      readonly cta: string;
      readonly comingSoon: string;
    };
  };
  readonly mentorBanner: {
    readonly title: string;
    readonly description: string;
    readonly cta: string;
  };
};
```

- [ ] **Step 2: Añadir copy correspondiente al dictionary**

En `_lab-coach-pricing-es.ts`, ANTES de `coach`, AÑADIR:

```ts
umbrella: {
  hero: {
    eyebrow: "J3 LAB",
    headingPre: "La pata de formación digital",
    headingAccent: "de J3 Padel.",
    sub: "Aquí entrenamos a coaches y jugadores con el mismo método. Criterio, método y planificación. Para que la cancha la decidas tú.",
  },
  cards: {
    coaches: {
      badge: "Coaches",
      title: "Forma el oficio. Construye el negocio.",
      description: "Tres tiers progresivos desde Coach hasta Head Coach. Aprende el oficio, gana los sellos, escala tu práctica.",
      cta: "Ver el camino del coach",
    },
    players: {
      badge: "Players",
      title: "El método aplicado a tu juego.",
      description: "Para jugadores amateurs que dan clases pero no entienden el juego. Táctica, diagnóstico, feedback técnico y físico.",
      cta: "Avísame cuando esté disponible",
      comingSoon: "Próximamente · Lista de espera abierta",
    },
  },
  mentorBanner: {
    title: "Mentor J3",
    description: "Acompañamiento 1:1 con los hermanos. Para coaches que quieren acelerar. Tres formatos: Sprint, Acompañamiento y Programa.",
    cta: "Reservar sesión cero · 49€",
  },
},
```

- [ ] **Step 3: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio. Si la estructura de `lab.umbrella` no encaja con el tipo existente, ajustar `types.ts` para que el tipo `lab` admita el nuevo nodo `umbrella`.

- [ ] **Step 4: NO commit todavía**

Esperamos a tener la página `/lab/page.tsx` creada.

---

## Task 4.2: Crear /lab/page.tsx con el componente UmbrellaSection

**Files:**
- Create: `src/app/lab/page.tsx`
- Create: `src/app/lab/layout.tsx`

- [ ] **Step 1: Crear src/app/lab/layout.tsx**

Crear el archivo con metadata SEO del paraguas:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "J3 Lab — Formación digital para coaches y jugadores de pádel",
  description:
    "La pata de formación digital de J3 Padel. Programas para coaches (3 tiers progresivos: Coach, Pro Coach, Head Coach) y para jugadores amateurs. Mismo método J3, dos caminos.",
  alternates: {
    canonical: "/lab",
  },
  openGraph: {
    title: "J3 Lab — Formación digital de J3 Padel",
    description:
      "Programas digitales para coaches y jugadores. Mismo método J3, dos caminos.",
    type: "website",
    url: "/lab",
  },
  twitter: {
    card: "summary_large_image",
    title: "J3 Lab — Formación digital de J3 Padel",
    description: "Programas digitales para coaches y jugadores.",
  },
};

export default function LabLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Crear src/app/lab/page.tsx**

Crear el archivo con la home del paraguas:

```tsx
"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useI18n } from "@/hooks/useI18n";
import { useReveal, useStaggerReveal } from "@/hooks/useReveal";

export default function LabHomePage() {
  const { t } = useI18n();
  const tu = t.lab.umbrella;

  const { ref: heroRef, visible: heroVisible } = useReveal(0.1);
  const { itemRefs, visibleItems } = useStaggerReveal(2, 0.15);
  const { ref: mentorRef, visible: mentorVisible } = useReveal(0.1);

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />

      {/* Hero del paraguas */}
      <section
        className="relative pt-[200px] pb-[100px] max-[960px]:pt-[160px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
        style={{ background: "var(--bk)" }}
      >
        <div
          ref={heroRef}
          className="relative max-w-[920px] mx-auto text-center"
          style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[4px] uppercase text-[var(--champan)] mb-6 font-bold">
            {tu.hero.eyebrow}
          </div>
          <h1 className="font-bold text-[clamp(40px,6vw,72px)] uppercase tracking-[-2px] leading-[1.0] mb-6">
            {tu.hero.headingPre}{" "}
            <span className="italic font-[var(--font-serif)] normal-case tracking-[-1.5px] text-[var(--champan)]">
              {tu.hero.headingAccent}
            </span>
          </h1>
          <p className="text-[15px] max-[640px]:text-[14px] opacity-80 max-w-[640px] mx-auto leading-[1.55]">
            {tu.hero.sub}
          </p>
        </div>
      </section>

      {/* 2 cards: Coaches y Players */}
      <section
        className="relative py-[60px] max-[960px]:py-[40px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
        style={{ background: "var(--bk)" }}
      >
        <div className="relative max-w-[1200px] mx-auto">
          <div className="grid grid-cols-2 max-[960px]:grid-cols-1 gap-5">
            {/* Card Coaches */}
            <article
              ref={(el) => { itemRefs.current[0] = el as HTMLDivElement | null; }}
              className="flex flex-col p-8 max-[960px]:p-6 rounded-[2px] border border-white/[.10] hover:border-[var(--champan)]/40 bg-white/[0.012] transition-colors duration-500"
              style={{
                opacity: visibleItems[0] ? 1 : 0,
                transform: visibleItems[0] ? "none" : "translateY(20px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1)",
              }}
            >
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)] mb-4">
                {tu.cards.coaches.badge}
              </span>
              <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.5px] leading-[1.15] mb-4">
                {tu.cards.coaches.title}
              </h2>
              <p className="text-[14px] opacity-75 leading-[1.55] mb-7 flex-1">
                {tu.cards.coaches.description}
              </p>
              <Link
                href="/lab/coach"
                className="inline-flex items-center justify-center self-start min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] bg-[var(--champan)] text-[var(--negro-v)] border border-[var(--champan)] hover:bg-[var(--g2)] hover:border-[var(--g2)] transition-all duration-300"
              >
                {tu.cards.coaches.cta}
                <span aria-hidden className="ml-2">→</span>
              </Link>
            </article>

            {/* Card Players (placeholder pre-lanzamiento) */}
            <article
              ref={(el) => { itemRefs.current[1] = el as HTMLDivElement | null; }}
              className="flex flex-col p-8 max-[960px]:p-6 rounded-[2px] border border-dashed border-[var(--champan)]/35 bg-[rgba(201,169,110,0.025)]"
              style={{
                opacity: visibleItems[1] ? 1 : 0,
                transform: visibleItems[1] ? "none" : "translateY(20px)",
                transition: "all 0.9s cubic-bezier(.16,1,.3,1) 0.12s",
              }}
            >
              <span className="text-[10px] font-bold tracking-[2.5px] uppercase text-[var(--champan)]/70 mb-4">
                {tu.cards.players.badge}
              </span>
              <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] tracking-[-0.5px] leading-[1.15] mb-4">
                {tu.cards.players.title}
              </h2>
              <p className="text-[14px] opacity-75 leading-[1.55] mb-3 flex-1">
                {tu.cards.players.description}
              </p>
              <p className="text-[11.5px] italic opacity-60 mb-7">
                {tu.cards.players.comingSoon}
              </p>
              <Link
                href="/lab/players"
                className="inline-flex items-center justify-center self-start min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
              >
                {tu.cards.players.cta}
                <span aria-hidden className="ml-2">→</span>
              </Link>
            </article>
          </div>
        </div>
      </section>

      {/* Banda Mentor J3 */}
      <section
        ref={mentorRef}
        className="relative py-[60px] max-[960px]:py-[40px] px-12 max-[960px]:px-6 max-[640px]:px-4 border-t border-white/[.06]"
        style={{
          background: "var(--verde)",
          opacity: mentorVisible ? 1 : 0,
          transform: mentorVisible ? "none" : "translateY(20px)",
          transition: "all 1s cubic-bezier(.16,1,.3,1)",
        }}
      >
        <div className="relative max-w-[920px] mx-auto text-center">
          <h2 className="font-bold text-[clamp(22px,2.6vw,30px)] uppercase tracking-[-0.5px] leading-[1.15] mb-4">
            {tu.mentorBanner.title}
          </h2>
          <p className="text-[14px] opacity-85 max-w-[600px] mx-auto leading-[1.55] mb-6">
            {tu.mentorBanner.description}
          </p>
          <Link
            href="/lab/coach/precios#mentor"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            {tu.mentorBanner.cta}
            <span aria-hidden className="ml-2">→</span>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Crear src/app/lab/players/page.tsx (placeholder mínimo)**

Para que el link de la card Players no dé 404, crear un placeholder:

```tsx
"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useReveal } from "@/hooks/useReveal";

export default function LabPlayersPlaceholder() {
  const { ref, visible } = useReveal(0.1);

  return (
    <div className="font-sans w-full bg-[var(--bk)] text-[var(--wh)]">
      <Navbar />
      <section
        className="relative pt-[200px] pb-[100px] max-[960px]:pt-[160px] max-[960px]:pb-[64px] px-12 max-[960px]:px-6 max-[640px]:px-4"
        style={{ background: "var(--bk)" }}
      >
        <div
          ref={ref}
          className="relative max-w-[680px] mx-auto text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "none" : "translateY(20px)",
            transition: "all 1s cubic-bezier(.16,1,.3,1)",
          }}
        >
          <div className="text-[11px] tracking-[4px] uppercase text-[var(--champan)] mb-6 font-bold">
            J3 Lab Players
          </div>
          <h1 className="font-bold text-[clamp(36px,5vw,56px)] uppercase tracking-[-1.5px] leading-[1.05] mb-6">
            El método J3 aplicado a tu juego.
          </h1>
          <p className="text-[15px] max-[640px]:text-[14px] opacity-80 max-w-[560px] mx-auto leading-[1.55] mb-10">
            Estamos construyendo Players. Para jugadores amateurs que dan clases pero no entienden el juego de verdad.
            <br /><br />
            Apúntate a la lista y te avisamos cuando esté listo. Si lo lanzamos en los próximos meses tendrás acceso preferente.
          </p>
          <p className="text-[12px] italic opacity-60 mb-8">
            (Formulario de lista de espera próximamente)
          </p>
          <a
            href="/lab"
            className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 text-[11.5px] font-bold tracking-[2px] uppercase rounded-[2px] border border-[var(--champan)]/60 text-[var(--champan)] hover:border-[var(--champan)] hover:bg-[rgba(201,169,110,0.08)] transition-all duration-300"
          >
            ← Volver al Lab
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 4: Run typecheck**

```bash
npm run typecheck
```

Expected: PASS limpio.

- [ ] **Step 5: Run build**

```bash
npm run build
```

Expected: build limpio. Las nuevas rutas `/lab` y `/lab/players` deberían aparecer en el listado de páginas pre-renderizadas.

- [ ] **Step 6: Verificar visualmente**

```bash
npm run dev
```

- Visitar `http://localhost:3000/lab` — debería ver el paraguas con hero + 2 cards + banda Mentor
- Visitar `http://localhost:3000/lab/coach` desde la card de Coaches — link funciona
- Visitar `http://localhost:3000/lab/players` — placeholder se renderiza
- Volver desde Players con el link "← Volver al Lab" — funciona

- [ ] **Step 7: Commit**

```bash
git add src/i18n/dictionaries/types.ts src/i18n/dictionaries/_lab-coach-pricing-es.ts src/app/lab/page.tsx src/app/lab/layout.tsx src/app/lab/players/page.tsx
git commit -m "feat(lab): crear /lab home (paraguas) + /lab/players placeholder

- /lab: home del paraguas J3 Lab.
  Hero + 2 cards (Coaches funcionando, Players placeholder dashed) +
  banda Mentor J3 en fondo verde.
- /lab/players: placeholder pre-lanzamiento con copy de la futura
  lista de espera (formulario diferido a Plan V1.5).
- /lab/layout.tsx: metadata SEO del paraguas.
- Dictionary lab.umbrella con hero + cards + mentorBanner.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>"
```

---

# FASE 5 — Validación final y cierre

## Task 5.1: Validación cruzada — recorrer todas las páginas afectadas

**Files:** Sin cambios. Solo verificación.

- [ ] **Step 1: Levantar dev server**

```bash
npm run dev
```

- [ ] **Step 2: Recorrido manual de la experiencia completa**

Recorrer en orden:

1. **`/lab`** (NUEVO) — Verificar:
   - Hero del paraguas con el subtítulo correcto
   - Card Coaches con CTA "Ver el camino del coach" → lleva a /lab/coach
   - Card Players con CTA "Avísame..." → lleva a /lab/players
   - Banda Mentor → lleva a /lab/coach/precios#mentor

2. **`/lab/coach`** (REFACTORIZADA) — Recorrer todos los bloques:
   - Hero
   - Quiz EspejoQuiz (existe, intacto)
   - El sistema (existe, intacto)
   - Mensajes desde el laboratorio (existe, intacto)
   - **Bloque Coach card (QueHayDentroSection)** — verificar que dice "Coach" no "Plan Lab"
   - **CaminoBlock refactorizado** — 3 tiers verticales + 3 insignias horizontales. Head Coach con borde violeta. Verificar que NO aparecen Rookie/Assistant/Master Coach.
   - **HeadCoachCard** (NUEVO) — 6 pilares, retos con premios, track record, CTA "Dar el salto al Head Coach"
   - Cambio visible (NegocioSection)
   - FAQ
   - CTA Final

3. **`/lab/coach/precios`** (REFACTORIZADA) — Verificar:
   - El bloque de suscripciones (tiers) NO aparece más
   - Examen visible con copy actualizado (sin "Master Coach Certificado", solo "Certificado")
   - Mentor (Sprint, Acompañamiento, Programa) intacto
   - Sesión Cero intacta
   - Verificación intacta
   - firstYearMath sin fila "base", con nomenclatura nueva
   - FAQ sin referencias a Plan Lab / Plan Pro

4. **`/lab/players`** (NUEVO PLACEHOLDER) — Verificar:
   - Hero "El método J3 aplicado a tu juego"
   - Texto del placeholder con mención al formulario diferido
   - Link de vuelta a /lab

- [ ] **Step 3: Lighthouse rápido o revisión de consola**

Abrir DevTools en `/lab` y en `/lab/coach`. Verificar:
- Sin errores en consola
- Sin warnings de hidratación
- Sin imágenes rotas

- [ ] **Step 4: NO commit (es validación)**

Si todo OK, marcar la task como completada y pasar a Task 5.2.

---

## Task 5.2: Crear/actualizar memoria del proyecto con la nueva arquitectura

**Files:**
- Create or update: `~/.claude/projects/.../memory/project_j3_lab_arquitectura.md`

- [ ] **Step 1: Crear archivo de memoria que documente la nueva arquitectura**

Esta memoria reemplaza/actualiza la antigua `project_j3_lab_coach_planes.md` (que hablaba de Plan Lab / Plan Pro).

Crear el archivo con el siguiente contenido:

```markdown
---
name: J3 Lab Arquitectura V1
description: Arquitectura completa de J3 Lab tras refactor V1 (mayo 2026). Reemplaza project_j3_lab_coach_planes.md.
type: project
---

J3 Lab es la **pata de formación digital** del ecosistema J3 Padel. Tras refactor V1 de mayo 2026, la arquitectura es:

## Productos del Lab

**Coaches** (3 tiers progresivos):
- Coach — 19€/mes — entrada al laboratorio, Ruta 1
- Pro Coach — 540€/año (580 trimestral, 660 mensual) — oficio completo + insignias
- Head Coach — 840€/año (900 trimestral, 1.080 mensual) — negocio fuera de pista

**Players** — producto único — 9€/mes · 90€/año + sesión coach J3 local incluida en anual. **No lanzado todavía**. Placeholder en /lab/players.

## Insignias (todas viven en Pro Coach)

- Cualificado — al completar 3 rutas con Pro Coach al día
- Certificado — vía Examen J3 (490€ pago único)
- Verificado — auditoría humana gratis, por mérito

**Eliminados del léxico**: Rookie, Assistant Coach, Master Coach (como grados o adjetivos de insignia).

## Servicios transversales (no son productos)

- Mentor J3 (Sprint, Acompañamiento, Programa) — solo coaches
- Examen J3 — 490€
- Verificación J3 — gratis, mérito

## Arquitectura web

- /lab — home del paraguas
- /lab/coach — los 3 tiers + bloque destacado Head Coach
- /lab/coach/precios — servicios complementarios (Mentor, Examen, Verificación)
- /lab/players — placeholder pre-lanzamiento

## J3 Business

Queda explícitamente FUERA del Lab. Es pilar separado del ecosistema. No se cross-linkea forzado desde /lab. Es el salto natural desde Head Coach cuando un coach quiere realmente montar academia.

## Próximo paso

V1.5 — construir Players (plan separado).

## Why

El refactor V1 limpia la confusión histórica entre "Plan Lab" (suscripción) y "J3 Lab" (paraguas marca). Los nombres comerciales pasan a ser nomenclatura natural del oficio (Coach / Pro Coach / Head Coach). Las insignias se consolidan en Pro Coach para reforzar el valor de ese tier como corazón del Camino. Head Coach se añade como tier superior para coaches que ya dominan el oficio y quieren ocuparse del negocio fuera de pista.
```

- [ ] **Step 2: NO commit del archivo de memoria**

El directorio de memoria es local del usuario, no del repo. No se commitea al repositorio del proyecto.

---

## Task 5.3: Commit final + tag de versión

**Files:** Sin cambios. Solo tagging.

- [ ] **Step 1: Verificar que master está al día y limpio**

```bash
git status
```

Expected: nothing to commit, working tree clean.

- [ ] **Step 2: Crear tag de versión**

```bash
git tag -a v-lab-v1-coaches -m "J3 Lab V1 · Coaches + Head Coach lanzamiento

Refactor completo de nomenclatura (Plan Lab/Plan Pro → Coach/Pro Coach).
Insignias unificadas en Pro Coach (Cualificado, Certificado, Verificado).
Head Coach añadido como tercer tier (840€/año).
/lab home creada como paraguas.
/lab/players placeholder pre-lanzamiento.
Camino visual rediseñado: 3 tiers verticales + 3 insignias horizontales.

V1.5 (Players) se construirá en plan separado."
```

- [ ] **Step 3: Push del tag**

```bash
git push origin v-lab-v1-coaches
git push origin master
```

Expected: tag y commits subidos al remoto. Vercel desplegará automáticamente.

- [ ] **Step 4: Verificación en producción**

Tras el deploy de Vercel (1-2 minutos):
- Visitar `https://j3home.vercel.app/lab` (con cache buster `?_t=$(date +%s)` si fuera necesario)
- Visitar `https://j3home.vercel.app/lab/coach`
- Visitar `https://j3home.vercel.app/lab/coach/precios`
- Visitar `https://j3home.vercel.app/lab/players`

Si todo OK, **V1 está LANZADA**.

---

# Self-Review del plan

## Spec coverage
Reviso cada sección del spec contra las tasks:

- ✅ **Visión paraguas**: cubierta en Task 4.1 (copy umbrella) y 4.2 (página /lab)
- ✅ **3 tiers Coaches**: cubiertos en Tasks 1.1-1.3 (Coach, Pro Coach renombrados) y 3.1-3.4 (Head Coach añadido)
- ✅ **Sistema de insignias**: cubierto en Task 1.1 (eliminar "Master Coach" adjetivo) y 2.1-2.2 (insignias en CaminoBlock como nodo propio)
- ✅ **Mecánica Head Coach**: cubierta en Task 3.2 (6 pilares + retos + track record en dictionary) y 3.3 (componente)
- ⚠️ **Mecánica Players**: NO cubierta (es V1.5, plan separado). Solo placeholder en Task 4.2 Step 3.
- ✅ **Promesa de marca método J3**: copy refleja esto en /lab umbrella hero.sub y en /lab/coach
- ⚠️ **Ciclo virtuoso**: mencionado conceptualmente pero NO implementado todavía. Es V1.5 cuando Players esté listo.
- ✅ **Servicios transversales**: preservados en Task 2.3 (refactor de /precios)
- ✅ **Arquitectura web /lab + /lab/coach + /lab/coach/precios + /lab/players**: cubierta en todas las fases
- ⚠️ **KPIs**: NO se implementan en código en V1. Son métricas de medición, no de código. Se trackeará desde Stripe + analytics existentes.
- ⚠️ **Lead capture quiz Players**: NO se implementa en V1 (es V1.5)
- ❌ **Migración de coaches actuales**: NO está en el plan técnico (Jorge lo gestiona aparte como comunicación, no como código)
- ❌ **Stripe productos para Head Coach**: NO se implementa en código aquí. El `ctaHref` apunta a `j3padel.com/join?plan=head-coach` pero el producto en Stripe debe configurarse aparte por Jorge. Lo dejo así porque está fuera del scope del repo.

**Resumen:** plan V1 cubre el 80% del spec. El 20% restante (Players, lead capture quiz, KPIs detallados, Stripe Head Coach) son trabajo posterior o fuera de scope del código.

## Placeholder scan

Reviso el plan en busca de placeholders prohibidos:
- "TBD" / "TODO" / "implement later": **0 ocurrencias**
- "Add appropriate error handling": **0 ocurrencias**
- "Similar to Task N": **0 ocurrencias** (todos los pasos repiten código necesario)
- "Write tests for the above": **0 ocurrencias**

✅ **Placeholders limpios.**

## Type consistency

Verifico que los nombres usados en tareas posteriores coincidan con los definidos en tareas anteriores:

- Tier IDs en data: `"coach"`, `"pro-coach"`, `"head-coach"` ✓ (Tasks 1.3, 3.1 consistentes)
- Dictionary keys: `coach`, `proCoach` (camelCase) ✓ (Tasks 1.1, 1.2)
- Component props: `tiers: { coach, proCoach, headCoach }` ✓ (Task 2.1 y 2.2 consistentes)
- Color paleta Head Coach: `#534AB7` borde / `#a89efc` texto ✓ (Tasks 2.1 y 3.3 consistentes)

✅ **Tipos y nombres consistentes.**

## Scope final

Plan es **monolítico para V1** (V1 = Coaches + Head Coach + paraguas). Mantenible en una sola sesión de implementación de un developer. V1.5 (Players completo con quiz + lead capture + email automation) será plan separado.

✅ **Scope sano para una iteración de implementación.**
