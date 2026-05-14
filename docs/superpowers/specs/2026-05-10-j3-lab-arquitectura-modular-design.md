# J3 Lab · Arquitectura modular del paraguas formativo

**Fecha:** 2026-05-10
**Autor:** Jorge + Claude (sesión brainstorming)
**Estado:** Diseño cerrado, pendiente de implementación
**Reemplaza/actualiza:**
- `project_j3_lab_coach_planes.md` (memoria interna): naming antiguo "Plan Lab/Plan Pro"
- `project_j3_ecosistema.md` (memoria interna): pilar "Coach360" se renombra a "J3 Lab"

---

## 0. Contexto

J3 Padel es la marca madre con un ecosistema modular de varios pilares (Lab, Business, Academy, etc.). Este documento define la arquitectura completa de **J3 Lab** — la pata de formación digital del ecosistema.

Antes de este diseño, J3 Lab era ambiguo: existía un único producto (`/lab/coach`, antes "Plan Lab" / "Plan Pro") sin claridad sobre si era el producto entero o solo una parte del paraguas. El nombre "Plan Lab" colisionaba con "J3 Lab" (marca paraguas).

**Este spec define:**
1. J3 Lab como **paraguas**, no producto
2. Dos productos paralelos: **Coaches** (3 tiers progresivos) y **Players** (producto único)
3. Nomenclatura limpia sin solapamientos
4. Sistema de insignias unificado
5. Mecánicas concretas de cada producto
6. Arquitectura web
7. KPIs de éxito
8. Ciclo virtuoso entre productos

---

## 1. Visión paraguas

```
J3 PADEL (marca madre)
├─ J3 LAB ← pata de formación digital ← este spec
├─ J3 BUSINESS ← consultoría high-ticket para academias (separado)
├─ J3 ACADEMY ← cantera presencial de jugadores
└─ otros pilares
```

**J3 Lab** alberga dos productos digitales paralelos para públicos distintos:

- **Coaches** — programa para entrenadores con 3 tiers progresivos
- **Players** — programa para jugadores amateurs adultos (producto único, sin tiers)

J3 Business **queda explícitamente fuera del Lab**. Es pilar separado del ecosistema. Si un Head Coach del Lab quiere realmente abrir academia, el salto natural es J3 Business — pero NO se cross-linkea forzadamente desde la web del Lab.

---

## 2. Producto · COACHES

### 2.1 Estructura de tiers

```
COACH ──→ PRO COACH ──→ HEAD COACH
19€/mes   540€/año      840€/año
```

Tres tiers progresivos en eje vertical. Cada tier incluye lo del anterior.

### 2.2 Tier · COACH

- **Precio:** 19€/mes (sin opción anual)
- **Acceso:** abierto, sin pre-requisitos
- **Contenido:**
  - Acceso a Ruta 1 (Fundamentos del oficio)
  - Lote mensual de contenido complementario
  - Comunidad básica
- **Insignia obtenida:** ninguna (las insignias viven en Pro Coach)
- **Para quién:** coach que entra al laboratorio, recién empieza a estructurar su oficio

### 2.3 Tier · PRO COACH

- **Precio:** 540€/año pago único · 580€/año trimestral · 660€/año mensual fraccionado
- **Pre-requisito:** haber completado Ruta 1 (auto-declaración o quiz simple para V1)
- **Contenido:**
  - Las 3 rutas completas: Fundamentos del oficio, Fundamentos del juego, Diseño del jugador y del coach
  - Programa de directos en vivo
  - Comunidad activa
  - Acceso al equipo formativo (Javi + Jorge)
- **Insignias disponibles** (las 3 viven aquí):
  - **CUALIFICADO** — al completar las 3 rutas + Pro Coach al día. Vivo / Inactivo según pago
  - **CERTIFICADO** — vía Examen J3 (490€ pago único, servicio separado)
  - **VERIFICADO** — auditoría humana gratis, por mérito (12m activos + 30+ jugadores formados + 2 vídeos auditados). Revalidable cada 24m
- **Para quién:** coach que quiere dominar el oficio completo y los sellos de mérito profesional

### 2.4 Tier · HEAD COACH

- **Precio:** 840€/año pago único · 900€/año trimestral · 1.080€/año mensual fraccionado
- **Pre-requisito:** ser Pro Coach activo + haber completado las 3 rutas + tener insignia Cualificado activa
- **Contenido:** todo lo del Pro Coach + módulo de negocio (6 pilares fuera de pista):
  1. **Captación local** — Instagram, web, Google My Business, eventos club, referencias
  2. **Posicionamiento y autoridad** — marca personal, diferenciación, ser referente en su zona
  3. **Gestión y operación** — agenda, paquetes, sistemas, retención
  4. **Economía y precios** — subir tarifa, paquetizar, hablar de precio
  5. **Mentalidad y liderazgo** — creencias limitantes, hablar en público, comunicar autoridad
  6. **Dinamización de academia** — eventos, ligas internas, comunicación con familias
- **Mecánica:** membership continua con drip mensual + retos mensuales escalonados
- **Tipos de contenido** (sin compromiso de cantidad fija por mes — declaramos tipos, no cuotas):
  - Masterclasses sobre los pilares
  - Directos en vivo con análisis de casos reales
  - Casos de coaches del Lab que aplican
  - Plantillas y herramientas descargables
- **Reto mensual escalonado:**
  - Quien completa el reto + sube evidencia → entra a sesión grupal mensual con Javi/Jorge (60 min)
  - Top 3 del mes elegido por equipo J3 → sesión 1:1 con Javi o Jorge (45-60 min)
  - Top 3 se convierten en casos reales del lote siguiente
- **Track record público** — retos ganados acumulados como trayectoria visible. NO hay insignia formal en Head Coach. La reputación se construye con evidencia, no con sellos.
- **Para quién:** coach que ya domina el oficio y quiere construir su negocio (con o sin academia)

### 2.5 UX de upgrade entre tiers

**Modelo:** manual + recordatorios contextuales. El coach decide cuándo asciende. Le mostramos hitos:

- *"Has completado Ruta 1 → ya puedes pasar a Pro Coach"*
- *"Has consumido las 3 rutas → Head Coach está desbloqueado"*

Sin marketing automation invasivo. Sin upgrade automático. El coach controla su ritmo.

### 2.6 Comportamiento del sistema de insignias

- Si un coach baja de Head Coach a Pro Coach, **mantiene insignias activas** (Pro al día)
- Si un coach baja de Pro Coach a Coach base, **insignias quedan inactivas** (visibles en gris en su perfil) hasta que vuelva a Pro
- Las tres insignias se pueden ostentar en firma, panel del club, perfil público

---

## 3. Producto · PLAYERS

### 3.1 Estructura

**UN solo producto, sin tiers.** Membership único.

### 3.2 Precio

- **Mensual:** 9€/mes (cancela cuando quieras)
- **Anual:** 90€/año pago único + bonus tangible:
  - **1 sesión con coach J3 local incluida**, formato/ubicación/duración a elección del coach (60 min recomendado)
  - Bono canjeable en los 12 meses de vigencia
  - La sesión la liquida J3 al coach a tarifa pactada (no es trabajo gratis del coach)

### 3.3 Acceso

Abierto, sin filtros, sin gates. Cualquier jugador amateur paga y entra.

### 3.4 Quiz diagnóstico (entrada gratuita)

- Disponible en `/lab/players` sin login
- 4-5 preguntas sobre nivel, patrón de fallo, frecuencia, contexto (incluye "¿juegas con tus hijos?")
- **Lead capture mecánica:**
  1. Jugador responde el quiz
  2. Resultado bloqueado → "Déjanos tu email para desbloquear tu resultado personalizado"
  3. Email capturado → Resultado mostrado + CTA "Suscríbete a Players"
  4. Si no se suscribe → email automation segmentada por resultado del quiz:
     - Día 1: *"Tu resultado dice X. Mira lo que te falta."*
     - Día 7: *"Caso real: jugador con tu mismo patrón mejoró Y."*
     - Día 14: oferta blanda con descuento promocional

### 3.5 Onboarding tras suscripción

- Quiz determinó ruta personalizada → primeros vídeos recomendados según resultado
- Automation primer mes: bienvenida, recordatorios de progreso, hitos visibles, activación del reto del mes
- Día 30: email reflexión + recomendación siguiente pilar

### 3.6 Contenido — 6 pilares (drip mensual)

1. **Lectura del juego** — táctica básica + avanzada (criterio aplicado al jugador)
2. **Diagnóstico personal** — saber dónde fallas
3. **Lectura del rival** — detectar puntos débiles, decisiones tácticas
4. **Técnica** — feedback genérico (no individual 1:1)
5. **Físico complementario** — preparación al pádel
6. **Add-on padres** — guías + juegos + ejercicios para jugar con peques. **Incluido sin coste extra**

### 3.7 Reto mensual con premio escalonado

- **Quien completa el reto + evidencia** → entra al directo de ganadores con un coach J3 (NO Javi/Jorge — son Head Coaches verificados del Lab que cobran por dar esa sesión a J3)
- **Top 3 del mes** → mención pública + descuento en clases con coaches J3 verificados de su zona

### 3.8 Comunidad

- Canales regionales: España, Argentina, México, Italia, Portugal y los que apliquen
- Cada canal conecta orgánicamente con la red de Head Coaches J3 locales
- Cero coste de mantenimiento adicional, máximo valor de proximidad

### 3.9 Puente orgánico Players → Coach base

Dentro del contenido de Players, mencionar **orgánicamente** (no agresivamente) que el método se enseña a fondo en J3 Lab Coach:

> *"Si te gusta el método y quieres aprenderlo a fondo para enseñarlo a otros, descubre J3 Lab Coach."*

Esto:
- Capta talento internamente (cero coste)
- Refuerza percepción de ecosistema (no productos sueltos)
- Crea pipeline natural Players → Coach base

No es mecánica formal — es mención contextual en el copy del módulo.

---

## 4. Promesa de marca: el método J3 aplicado

Lo que une a Coaches y Players es **un único método** (Criterio · Método · Planificación), aplicado de dos formas distintas:

- **Coaches** lo **enseñan** a sus jugadores
- **Players** lo **aplican** en su propio juego

Esta coherencia es lo que diferencia:
- A **Players** de "YouTube de pádel gratuito" (Players da el método estructurado, no lista inconexa de tips)
- A **Coach base** de "otro curso online de pádel" (J3 forma con rúbrica + comunidad + sello)

**El método J3 es ancla narrativa común a los dos productos.** El copy de la web debe reforzar esto.

---

## 5. Ciclo virtuoso (motor estratégico del Lab)

Este es el activo más estratégico del diseño completo. Players y Coaches **NO son productos aislados** — se retroalimentan creando un flywheel autocontenido:

```
══════════════════════════════════════════════════════════════════════
                  EL CICLO VIRTUOSO J3 LAB
══════════════════════════════════════════════════════════════════════

   PLAYER paga 9€/mes ──→ Mejora su juego con el método J3
        │                       │
        │                       ↓
        │                  Conoce coach J3 local
        │                  (vía comunidad regional)
        │                       │
        │                       ↓
        │                  Contrata clases con él
        │                       │
        ↓                       ↓
   Recomienda Players      HEAD COACH llena su pista
   a sus amigos                 │
   (boca a boca)                ↓
        │                  Permanece en Head Coach
        ↓                       │
   Más Players                  ↓
   suscritos              Su práctica es caso real del
        ↑                  lote del Head Coach del Lab
        │                       │
        │                       ↓
        └───────────────  Players ve "casos de éxito"
                         reales, refuerza percepción
                         de marca y sigue pagando
══════════════════════════════════════════════════════════════════════
```

**Implicaciones operativas:**
- Players sin Head Coach no tiene flywheel (Players quedaría como producto aislado)
- Head Coach sin Players tampoco (Head Coach no tendría flujo de leads orgánicos)
- **Ambos productos validan al otro**. Lanzar ambos a corto plazo es estratégicamente superior a lanzar solo uno

Este ciclo justifica la priorización del roadmap: Head Coach primero (V1), Players poco después (V1.5), no años de diferencia entre ambos.

---

## 6. Servicios transversales (NO son productos del Lab)

Estos servicios existen en el ecosistema pero NO entran al Lab como productos paralelos. Son prestaciones puntuales que se contratan aparte:

### 6.1 Mentor J3

- Acompañamiento 1:1 con los hermanos (Javi y Jorge)
- Solo para coaches (no para Players)
- Tres formatos: Sprint (30d, 4 sesiones), Acompañamiento (90d, 8 sesiones), Programa (12m, 16 sesiones)
- Precios: 895€ / 1.495€ / 2.495€ (founder rate: -30% para coaches del Lab activos)
- Sesión cero obligatoria de 49€ para externos (descontable si contrata)
- **Visible en `/lab` home como banda secundaria + en `/lab/coach/precios`**

### 6.2 Examen J3

- 490€ pago único
- Auditoría escrita por equipo J3 en 7 días + llamada de evaluación 45-60 min
- Lleva a insignia **CERTIFICADO** (sobre Pro Coach activo)
- Si no aprueba: feedback escrito + 6 meses para volver a presentarse sin coste

### 6.3 Verificación J3

- Gratuita, por mérito
- Requisitos: 12m como coach activo, 30+ jugadores formados con metodología J3, 2 vídeos auditados, Pro Coach al día
- Llamada de evaluación 45-60 min
- Lleva a insignia **VERIFICADO**
- Revalidable cada 24 meses

---

## 7. Arquitectura web

```
══════════════════════════════════════════════════════════════════════
                  J3 LAB · ARQUITECTURA WEB
══════════════════════════════════════════════════════════════════════

  /lab                       Home del paraguas J3 Lab
                             • Hero del Lab
                             • Card Coaches → /lab/coach
                             • Card Players → /lab/players
                             • Banda secundaria: Mentor J3
                             • Banda inferior: ecosistema (Business,
                               Academy) sin cross-link forzado

  /lab/coach                 Camino del coach con 3 tiers
                             [REFACTOR de la landing actual]
                             Bloques:
                             • Hero
                             • Quiz EspejoQuiz (existe)
                             • El sistema (existe)
                             • Mensajes desde el laboratorio (existe)
                             • Los 3 tiers (Coach · Pro Coach · Head Coach)
                             • El Camino refactor (tiers + insignias)
                             • Bloque destacado Head Coach (6 pilares
                               + retos + sesiones ganadas)
                             • Cambio visible (existe)
                             • FAQ refactor con nueva nomenclatura
                             • CTA Final refactor

  /lab/coach/precios         Servicios + Mentor + Examen + Verificación
                             [REFACTOR — los tiers viven en /lab/coach,
                             esta página queda para servicios complementarios]

  /lab/players               V1 (pre-lanzamiento) — formulario de espera
                             + quiz diagnóstico gratuito (lead capture)
                             V1.5 (lanzamiento) — landing producto completa
                             con quiz + suscripción + onboarding

  (FUERA del Lab)
  /business                  J3 Business — pilar separado del ecosistema,
                             no se cross-linkea forzado desde /lab
══════════════════════════════════════════════════════════════════════
```

---

## 8. KPIs de éxito (medición V1)

| Producto / Servicio | KPI principal | Target V1 |
|---|---|---|
| **Coach base** | Conversión visitante landing → suscriptor | 3% |
| **Pro Coach** | Conversión Coach → Pro Coach a 12 meses | 40% |
| **Head Coach** | Conversión Pro → Head Coach a 12 meses | 25% |
| **Head Coach retención** | Renovación anual | 75% |
| **Head Coach engagement** | Coaches que completan reto mensual | 40% |
| **Players** | Conversión quiz → suscriptor | 5% |
| **Players retención** | Mensual | 70% |
| **Players engagement** | Activación reto mensual | 25% |
| **Ciclo virtuoso** | Players que contratan coach J3 local en 6m | 8% |
| **Lead capture quiz** | Visitantes que dejan email tras quiz | 30% |

Los targets son aproximaciones razonables para V1. Conviene revisar a los 3 meses del lanzamiento de cada producto y ajustar según realidad observada.

---

## 9. Resumen económico

| Producto / Servicio | Precio | Tipo |
|---|---|---|
| **Coach** | 19€/mes | Recurrente mensual |
| **Pro Coach** | 540€/año pago único · 580€/año trimestral · 660€/año mensual | Recurrente anual |
| **Head Coach** | 840€/año pago único · 900€/año trimestral · 1.080€/año mensual | Recurrente anual |
| **Players** | 9€/mes · 90€/año (+ 1 sesión coach J3 local) | Recurrente |
| **Examen J3** | 490€ | Pago único |
| **Mentor J3 Sprint** | 895€ (founder 625€) | Pago único |
| **Mentor J3 Acompañamiento** | 1.495€ (founder 1.045€) | Pago único |
| **Mentor J3 Programa** | 2.495€ (founder 1.745€) | Pago único |
| **Sesión Cero** | 49€ (externos al Lab) | Pago único |
| **Verificación J3** | Gratis (por mérito) | Servicio gratuito |

---

## 10. Decisiones explícitamente FUERA del scope V1

Para evitar scope creep en implementación:

- ❌ **Padres como público propio del Lab** — no entran. El add-on kids para padres-jugadores entra dentro de Players, no como producto independiente
- ❌ **Coaches externos que quieren módulos sueltos** — no se vende Head Coach a coaches que no son Pro Coach activos
- ❌ **Pro Players competitivos** (jugadores de circuito) — público demasiado pequeño y especializado, queda fuera del Lab
- ❌ **Niños como cliente directo** — no es público sostenible
- ❌ **Tiers en Players** (Pro Player, Master Player) — V1 es un solo producto Players, sin tiers
- ❌ **Insignia adicional para Head Coach** — el track record de retos es la prueba pública, no se crea otro sello
- ❌ **Niveles de mérito visibles en Players** (Iniciado, Lector, Estratega) — V1 sin gamificación de niveles
- ❌ **Trial gratuito en Players o Head Coach** — V1 lanza sin trial
- ❌ **Tier Family en Players** (para padres) — V1 sin tiers, kids ya incluido
- ❌ **Plataforma propia construida desde cero** — V1 usa la plataforma actual del Lab Coach

---

## 11. Refactor de código existente

Trabajo necesario en el repo `mi-clon` para implementar este diseño. Detalle por archivo en el plan de implementación.

### 11.1 Refactor /lab/coach
- Renombrar "Plan Lab" → "Coach" (sin "Plan")
- Renombrar "Plan Pro" → "Pro Coach"
- Añadir tier "Head Coach" como bloque destacado
- Refactorizar Bloque 5 "El Camino" (4 escalones grados → 3 tiers + insignias horizontales)
- Eliminar grados "Rookie", "Assistant Coach", "Master Coach" del léxico
- Reescribir insignias: eliminar prefijo "Master Coach" (queda solo Cualificado/Certificado/Verificado)
- Refactor FAQ con nueva nomenclatura
- Refactor CTA Final

### 11.2 Crear /lab home
- Nueva página `/src/app/lab/page.tsx`
- Hero del paraguas
- 2 cards (Coaches + Players)
- Banda Mentor J3
- Banda ecosistema (link suave a /business sin pressure)

### 11.3 Refactor /lab/coach/precios
- Quitar los tiers (Coach/Pro Coach/Head Coach viven en /lab/coach)
- Mantener Mentor J3, Examen, Sesión Cero, Verificación
- Actualizar nomenclatura

### 11.4 Crear /lab/players (V1 pre-lanzamiento)
- Hero
- Quiz diagnóstico (4-5 preguntas)
- Lead capture (email tras quiz, antes de mostrar resultado)
- Resultado personalizado + CTA suscripción / formulario espera
- Email automation segmentada (Día 1, 7, 14)

### 11.5 Stripe / cobro
- Productos para Coach (19€/mes), Pro Coach (540€/580€/660€ según ciclo), Head Coach (840€/900€/1.080€), Players (9€/mes, 90€/año)
- Webhooks para gestión de upgrades/downgrades entre tiers

### 11.6 Migración de coaches actuales
- Los coaches con "Plan Lab" → automigrados a tier "Coach" (mismo precio)
- Los coaches con "Plan Pro" → automigrados a tier "Pro Coach" (mismo precio)
- Comunicación clara: cambio de naming, no de servicio
- Insignias renombradas en perfiles (Master Coach Certificado → Certificado)

---

## 12. Próximos pasos

1. Usuario revisa este spec
2. Si aprueba, se invoca `superpowers:writing-plans` para crear el plan de implementación detallado (tareas, archivos a tocar, orden, dependencias)
3. Plan de implementación se ejecuta por fases (V1 Coaches + Head Coach primero, V1.5 Players después)

---

## 13. Decisiones tomadas durante el brainstorming

Resumen para trazabilidad futura. Cada decisión incluye el razonamiento clave.

| # | Decisión | Razón |
|---|---|---|
| Q1 | J3 Lab = hub multi-perfil | Públicos distintos requieren puertas paralelas |
| Q2 | Alcance: mapa + priorización | Evita PDFs de 8 módulos con 0 construidos |
| Q3 | Públicos con señal real: Coaches del Lab + Jugadores amateurs adultos | Filtró 2 públicos sin evidencia (padres aislados, coaches externos sueltos) |
| Q6 | Primer módulo nuevo: Head Coach | Mejor economía + autoridad pre-cualificada + construcción más simple |
| Q8 | Acceso Head Coach: Pro Coach + 3 rutas + Cualificado | Coherencia con "se gana, no se compra" |
| Q9 | Formato Head Coach: membership con drip | Coherente con comportamiento real ("contenido random + directos + entretenimiento") |
| Q10 | Head Coach = tier vertical (no producto separado) | 3 tiers progresivos · 1 sola línea de cobro · más sostenible que productos paralelos |
| Q11 | Naming: Coach / Pro Coach / Head Coach (sin "Plan") | Elimina solapamiento con "J3 Lab" paraguas · vocabulario natural del oficio |
| Q13 | Estructura contenido Head Coach: 6 pilares declarados + drip libre | Estructura visible + comportamiento real respetado |
| Q14 | Cadencia: mensual (no semanal) | Lote denso > goteo superficial · sostenible operativamente |
| Q15 | Sesiones por mérito (no incluidas en suscripción) | Coherencia con filosofía J3 + sostenibilidad operativa |
| Q16 | Premios escalonados (completa→grupal, Top 3→1:1) | Incentivo en dos niveles + marketing orgánico vía casos reales |
| Q17 | Precio Head Coach: 840€/año | +55% sobre Pro Coach, accesible con ROI tangible |
| Insignias en Pro Coach (corrección Jorge) | Las 3 insignias viven en Pro Coach, no transversales | Valida el oficio en el tier que lo enseña |
| Q21 | Arquitectura web: /lab + /lab/coach + /lab/players | Paraguas con su sitio · preparado para Players · catálogo en /precios |
| Q24 | Players: 1 solo producto, sin tiers | Validar categoría antes de complicar |
| Players · precio | 9€/mes · 90€/año + sesión coach J3 local | Mercado amateur volumen · ticket asequible · bonus tangible para anual |
| Mejora B · Lead capture | Email tras quiz, antes de resultado | Captamos visitantes no convertidos |
| Mejora C · Ciclo virtuoso | Destacado como pieza central | Motor estratégico que justifica lanzar Head Coach + Players juntos |
| Mejora F · Puente orgánico Players → Coach | Mención contextual, no mecánica formal | Pipeline interno sin coste |

---

## 14. Glosario

- **J3 Lab**: pata de formación digital del ecosistema J3 Padel. Marca paraguas, no producto.
- **Coaches / Players**: los dos productos del Lab.
- **Coach / Pro Coach / Head Coach**: los tres tiers del producto Coaches.
- **Tier**: nivel de suscripción dentro del producto Coaches. NO confundir con grado.
- **Insignia**: sello de mérito que el coach gana. Vive en Pro Coach. Cualificado, Certificado, Verificado.
- **Track record**: histórico público de retos ganados en Head Coach. NO es insignia formal — es trayectoria visible.
- **Reto mensual**: desafío opcional en Head Coach y Players con premio escalonado.
- **Ciclo virtuoso**: motor de retroalimentación entre Players y Head Coaches que justifica lanzar ambos juntos.
- **Método J3**: Criterio · Método · Planificación. Ancla narrativa común a Coaches y Players.
- **Pilar**: área de contenido dentro de un producto. Head Coach tiene 6, Players tiene 6.
- **Mentor J3**: servicio transversal de acompañamiento 1:1, solo para coaches. NO es producto del Lab.
- **Examen J3 / Verificación J3**: servicios para obtener insignias Certificado y Verificado.
