# Microsite J3Pádel × Tecnifibre / Lacoste — Design Spec

**Fecha:** 2026-04-29
**Autor:** Jorge Cárdenas (CSO J3Padel) + diseño en colaboración
**Estado:** Diseño aprobado — pendiente de plan de implementación
**Ruta de la página:** `j3padel.com/tecnifibre` (alias `/tecnifibre` en el repo `mi-clon`)
**Audiencia:** Raúl (Tecnifibre / Lacoste), interlocutor único en la negociación.

---

## 1. Contexto y objetivo

### Contexto
Raúl ha enviado un correo iniciando los pasos operativos de la colaboración (reunión con Nico, perfiles TecniVIP, contrato). Pide datos cuantitativos y cualitativos: cajones de pelotas, equipación, staff, presencia en clubes, foco de propuesta de valor.

J3Padel tiene preparado un borrador de respuesta vía email que cumple la petición pero también introduce una propuesta estratégica de tres palancas (Club, J3PTV, Coach360). En lugar de mandar ese email, se decide **construir un microsite privado** que dramatice la propuesta y **acompañarlo de un email corto** con link y los datos operativos como P.D.

### Objetivo
Pasar de "responder a una petición operativa" a **enmarcar la conversación al nivel estratégico** que Coach360 merece, sin descuidar la operativa que Raúl necesita para arrancar el contrato.

### Éxito (cómo sabremos que funciona)
- Raúl abre el link, lo lee del tirón, y responde **proponiendo siguiente conversación específicamente sobre Coach360 co-branded**, no solo sobre operativa.
- La reunión con Nico se cuadra esa misma semana.
- Jorge / Tecnifibre / Lacoste salen de la conversación con sensación de estar construyendo algo distinto, no firmando un contrato estándar de marca-club.

---

## 2. Decisiones de alto nivel (locked)

| Decisión | Valor |
|---|---|
| Formato del envío | Microsite privado + email corto |
| Email | 3 líneas con link + P.D. con datos operativos |
| Estructura del microsite | **Capítulos puros** (5 capítulos a pantalla completa, estilo coherente con `/story`) |
| Tono | Visión cálida — primera persona del plural, frases cortas, pensado para Raúl específicamente |
| URL | `/tecnifibre` (privada, sin login, share-link suficiente) |
| Mobile | Mobile-first; capítulos en swipe vertical/horizontal según corresponda |
| Email de contacto en CTA | `jorge@j3padel.com` |
| Firma de cierre | "Jorge Cárdenas" (sin frase filosófica) |
| Nombre del programa co-branded | **Sin nombre fijo** — "programa co-branded por definir juntos" |
| Subject del email | "Una propuesta para Tecnifibre × Lacoste" |
| Hermano que envió datos personales | Javi (sustituye `[hermano]` en email PD) |
| Cierre del email/microsite | Activo: *"Cuando lo veas, te llamo yo y lo aterrizamos."* (alineado microsite + email) |
| Eyebrow Cap 1 (top-right) | **PARA RAÚL · TECNIFIBRE × LACOSTE** (triple personalización) |
| Eyebrow Cap 4 | *"— Raúl, aquí está donde queremos llegar contigo —"* (segunda mención personal) |
| Título Cap 4 | *"Dos marcas. Una operación."* (paralelismo punzante) |
| Visualización Coach360 (Cap 3 P03) | Mapamundi estilizado + dots champán pulsantes (10+ países, +100 entrenadores) |

---

## 3. Estructura del microsite

5 capítulos, cada uno a pantalla completa, navegación tipo `/story`. Indicador de progreso visible (pips arriba + contador "XX / 05").

### Capítulo 1 · Hero — *Hola, Raúl.*

**Función narrativa:** saludo personal + impacto inmediato.

- Fondo: imagen full-screen de instalación J3 (candidato: `/public/images/hero.jpeg`) con overlay verde oscuro lineal `rgba(14, 28, 22, 0.7)` → `rgba(27, 61, 47, 0.45)`.
- Etiqueta arriba-izquierda: `J3PADEL`. Etiqueta arriba-derecha: `PARA RAÚL · TECNIFIBRE × LACOSTE`. Tipografía small caps champán. **Triple personalización al primer vistazo** — antes de que el ojo baje al "Hola, Raúl.", ya ha visto su nombre arriba.
- Pre-headline: `— Una propuesta privada —` en champán.
- **Headline:** `Hola, Raúl.` — serif fina, ~72-96px, color crema, peso 300.
- **Subtítulo:** `Lo que podemos construir juntos.` — peso 300, opacidad 0.85.
- Indicador inferior derecha: `DESLIZA` + dot animado en champán.

### Capítulo 2 · Quiénes somos en 3 datos — *Veinte años de club. Una plataforma global.*

**Función narrativa:** posicionar peso del club en 3 números, sin párrafos.

- Fondo: foto academia o pista (candidato: `/public/images/academy/stage-group.jpeg`) con overlay verde profundo más oscuro que Cap 1.
- Eyebrow: `— Capítulo 2`.
- **Título de capítulo:** *Veinte años de club. Una plataforma global.*
- Tres bloques en grid horizontal (mobile: vertical), cada uno con barra champán a la izquierda:
  1. **20+** · Años en Málaga operando como club.
  2. **Jun '26** · Inauguramos nueva sede.
  3. **100+** · Entrenadores en nuestra plataforma global.
- Pip indicator arriba-izquierda mostrando `02 / 05`. Contador abajo-derecha.

### Capítulo 3 · Tres palancas que ofrecemos.

**Función narrativa:** mostrar las tres palancas de colaboración con sub-navegación interna. Coach360 cierra preparando el clímax.

Sub-navegación: **carrusel horizontal** — el usuario hace swipe (mobile) o usa flechas/teclado (desktop) para pasar de una palanca a la siguiente. Cada palanca a pantalla completa con su propio background y paleta. Indicador de progreso interno: pips pequeños "01 · 02 · 03" en la parte superior del capítulo, debajo del breadcrumb global.

#### Palanca 01 · Club y academia física
- Eyebrow: `— PALANCA 01`.
- Subtag: *El día a día*.
- **Headline:** *Lo que el jugador ve cada día en pista.*
- **Body:** Pelotas de academia. Equipación de staff. Imagen corporativa del club. La nueva sede de Málaga abre con vuestra marca en escena desde el día uno.
- **Datos al pie:** `1 cajón · entrenador / mes` · `+ crecimiento progresivo conforme suma academia`.
- Imagen sugerida: instalación pista (`hero.jpeg` u otra similar).

#### Palanca 02 · J3PTV
- Eyebrow: `— PALANCA 02`.
- Subtag: *Contenido propio*.
- **Headline:** *Calidad, no volumen.*
- **Body:** Podcast con jugadores top. Vlogs desde eventos de marca premium. Activaciones en Instagram y TikTok. Producimos cuando hay algo que contar — no por llenar feed.
- **Datos al pie:** `Producción propia · activable en cualquier momento` · `Foco editorial · ejes acordados con marca`.
- Imagen sugerida: `/public/images/j3/j3ptv-bg.jpg`.

#### Palanca 03 · Coach360 — *la grande*
- Eyebrow: `— PALANCA 03 · la grande` (champán resaltado).
- Subtag: *Red global · prescripción real*.
- **Headline:** *Lo que ningún otro club os ofrece.*
- **Body:** Más de 100 entrenadores en plataforma. Staffs propios. Tiendas de club. Prescripción directa al jugador amateur — no figurantes. Una red activable a vuestra marca.
- **Datos al pie:** `+100 entrenadores` · `+10 países` · `→ Continúa en Cap. 04` (en champán, tease al clímax).
- Paleta: ligeramente más champán que las otras dos para destacar jerarquía.
- **Visualización (sustituye foto de fondo):** **mapamundi estilizado en silueta** verde profunda sobre fondo negro verdoso. Sobre el mapa, **dots en champán** (`#C9A96E`) marcando clusters de entrenadores activos — un dot por país/región, distintos tamaños según densidad. **Animación de pulso lento** (heartbeat) en cada dot para transmitir "red viva". El texto "+100 entrenadores · +10 países" se superpone al mapa en posición central-baja.
- **Razón del cambio de textura visual:** Palanca 01 (Club) tiene foto de pista (lo físico). Palanca 02 (J3PTV) tiene foto de podcast/streaming (lo digital). Palanca 03 (Coach360) tiene MAPA (la red). Cada palanca = una textura. Refuerza la narrativa visualmente.
- **Implementación:** SVG estático con dots posicionados manualmente, o paquete `react-simple-maps` si añade poco peso. Animación CSS pulse simple. **NO** funcionalidad clic-en-coach (eso es directorio funcional, fuera de alcance).

### Capítulo 4 · Dos marcas. Una operación. *(Clímax)*

**Función narrativa:** la propuesta concreta. Dos partes encadenadas con scroll interno.

- **Eyebrow del capítulo:** *"— Raúl, aquí está donde queremos llegar contigo —"* (segunda mención personal en el microsite, justo antes del clímax — funciona psicológicamente para que Raúl sienta que el documento no se desviste de él en ningún momento).
- **Título del capítulo:** *"Dos marcas. Una operación."* (paralelismo que hace mirror del contenido: Tecnifibre + Lacoste → propuesta unificada).

#### 4 a · Diferenciación de marcas

Dos cards en grid horizontal (mobile: stack), fondo crema (`#F8F5EF`), texto oscuro.

**Card Tecnifibre** (border-top verde `#1B3D2F`):
- Marca: `TECNIFIBRE` en small caps.
- Headline: *Rendimiento. Prescripción técnica.*
- Body: El producto que toca al jugador. Lo que el entrenador recomienda porque funciona en pista.
- Activación J3: `Pelotas de academia · palas y material técnico · presencia en eventos de marca · prescripción a través de la red de entrenadores.`

**Card Lacoste** (border-top champán `#C9A96E`):
- Marca: `LACOSTE` en small caps.
- Headline: *Imagen. Lifestyle aspiracional.*
- Body: La marca que el jugador quiere vestir. Lo que define la experiencia premium del club.
- Activación J3: `Equipación de staff · imagen corporativa de la nueva sede · eventos exclusivos en club · contenido lifestyle en J3PTV.`

#### 4 b · La jugada conjunta

Bloque oscuro full-width (verde profundo a negro), texto crema/champán.

- Eyebrow: `— Programa propuesto`.
- **Headline:** *Un programa co-branded por definir juntos.* (sin nombre fijo, decisión locked).
- **Sub-headline:** Entrenadores firmados por Tecnifibre acceden a la formación J3 y obtienen un badge propio en el directorio "Encuentra a tu Coach". Vosotros sumáis prescripción real al jugador amateur. Nosotros sumamos potencia de marca a nuestros entrenadores. Todos ganan.
- **Flujo en 3 pasos** (cards horizontales):
  1. Tecnifibre firma a un entrenador de su elección.
  2. El entrenador accede a la formación de J3 y obtiene certificación.
  3. Aparece en el directorio público con badge co-branded.
- **Badge mockup:** elemento visual abstracto — combinación de **logos J3 + Tecnifibre + check** sobre fondo champán, **sin texto comprometedor de naming**. Visualiza el "premio" como ícono, no como nombre comercial. Concretamente: pequeña pastilla redondeada con logo J3 a la izquierda, separador vertical fino, logo Tecnifibre a la derecha, check de verificación. Sin texto de programa.
- **Cierre del capítulo:** *"Esto es lo que ningún otro club os puede ofrecer."* — cursiva, serif, color champán, separado por borde superior fino.

### Capítulo 5 · Hablamos.

**Función narrativa:** cierre, una sola pantalla, sin formularios, mucho aire.

- Fondo: gradiente verde profundo a negro.
- Pip indicator arriba: todos encendidos. Contador `05 / 05`.
- Eyebrow: `— Y ahora —` en champán.
- **Headline:** *Hablamos.* — serif fina, ~96px, peso 300.
- **Subtítulo:** *Cuando lo hayas visto, te llamo yo y lo aterrizamos.* (alineado con el cierre del email — misma voz, mismo registro activo).
- **CTA primario:** botón redondeado champán → "Escríbenos →" → `mailto:jorge@j3padel.com`.
- **CTA secundario:** texto al lado → "o directamente jorge@j3padel.com" (link).
- **Firma:** *Jorge Cárdenas* (sin frase, abajo-izquierda, color crema con opacidad).
- **Volver al inicio:** abajo-derecha, "↑ Volver al inicio", anclaje al Cap 1.

---

## 4. Sistema visual

### Paleta (oficial J3 — locked)
- **Verde profundo:** `#1B3D2F` (color principal).
- **Champán:** `#C9A96E` (acentos, badge, links).
- **Crema:** `#F8F5EF` (fondos claros, texto sobre oscuro).
- **Negro verdoso:** `#0E1C16` (texto oscuro, gradientes).
- **NUNCA usar `#FFFFFF` puro ni white.** Memoria explícita de marca J3.

### Tipografía
- Display / headlines: serif (Georgia o equivalente disponible en el stack actual de `mi-clon`). Peso 300 dominante. Tamaños grandes en hero (96px) y CTA (96px).
- Body: sans-serif del stack actual. Pesos 300/400.
- Eyebrows / labels: sans-serif, 11-12px, letter-spacing 2-3px, uppercase.

### Tono visual de cada capítulo
| Cap | Fondo dominante | Sensación |
|---|---|---|
| 1 Hero | Foto J3 + overlay verde 70% | Apertura cinematográfica |
| 2 Quiénes somos | Foto + overlay verde 85% | Datos pesando, peso histórico |
| 3 Palancas | Foto distinta por palanca + overlay | Capítulo más "explorable" |
| 4 Propuesta | 4a fondo crema (cambio de tono) / 4b verde→negro | Cambio de "informar" a "proponer" |
| 5 CTA | Verde→negro | Cierre, "fin del viaje" |

### Animaciones
- Fade-in al entrar cada capítulo.
- Parallax sutil en imágenes de fondo de Cap 1 y Cap 2.
- Stagger reveal de los tres datos del Cap 2.
- Stagger reveal de las cards del Cap 4 (Tecnifibre primero, Lacoste segundo, programa co-branded tercero).
- Cursor de "DESLIZA" pulsando en Cap 1.
- Sin animaciones decorativas — cada animación tiene función narrativa.
- Coherencia total con `useReveal` y patrón GSAP existente en `/story`.

### Iconografía / elementos
- Logos: `/public/images/j3/tecnifibre.png` y `/public/images/j3/lacoste.png` disponibles si se necesita.
- Icono de J3: imagotipo dorado/verde según cap.
- Pips de progreso: estilo line-segments minimalista.

---

## 5. Email acompañante

Subject **locked**: **"Una propuesta para Tecnifibre × Lacoste"**

```
Hola Raúl,

He montado esto pensando en ti específicamente:
→ j3padel.com/tecnifibre

Cuando lo veas, te llamo yo y lo aterrizamos.

Un abrazo,
Jorge

—

P.D. — Por avanzar lo que pediste para el contrato:
• Cajones de pelotas: 1 / entrenador / mes (hoy 2 entrenadores; crecemos con la academia).
• Equipación: staff técnico (2 personas hoy + entrenadores que sumemos).
• Imagen corporativa: foco en la nueva sede que abrimos en junio.
• Staff confirmado: Jordi y Jorge. Datos personales ya os los pasó Javi.
• Presencia y prescripción: detallado en el microsite (capítulo 3).
• Foco de propuesta de valor: capítulos 3 y 4.

Lo de Nico lo cuadramos esta semana y te confirmo. Tema IVA intracomunitario, anotado.
```

---

## 6. Approach técnico

- **Framework:** Next.js 16 (App Router) + Tailwind CSS v4 — stack actual de `mi-clon`. **NO** introducir librerías nuevas salvo que sea imprescindible.
- **Ruta:** `src/app/tecnifibre/page.tsx` (+ `layout.tsx` si conviene aislar layout del navbar global).
- **Layout aislado:** la página NO debería usar el `Navbar` y `Footer` globales del proyecto — es una experiencia separada. Considerar `layout.tsx` propio o early-return en `RootLayout` para esta ruta.
- **Animaciones:** GSAP + ScrollTrigger ya están en el proyecto (ver `/story`). Reutilizar `useReveal` y `useParallax` hooks.
- **Componentes:** crear componentes específicos en `src/components/tecnifibre/` (HeroChapter, StatsChapter, LeversChapter, ProposalChapter, CTAChapter, ChapterNav). NO reutilizar componentes de la web pública para evitar acoplamiento.
- **Imágenes:** todas desde `/public/images/`. Optimizar con `<Image>` de Next.js. Lazy-load para cap 2-5.
- **Privacidad:** `noindex, nofollow` en metadata. URL share-only, sin login.
- **SEO:** meta title `J3Pádel × Tecnifibre / Lacoste` (no público pero por si Raúl comparte).
- **Despliegue:** Vercel automático tras commit + push a master (memoria del proyecto).
- **Mobile:** breakpoints 768 / 1024. Testar Chrome iOS y Android. Capítulos a pantalla completa con `100dvh` (no `vh`, que falla con address bar).

---

## 7. Out of scope

Para que el alcance no se infle:

- **NO** implementar el directorio "Encuentra a tu Coach" funcional — solo lo mencionamos como propuesta. Es trabajo posterior una vez se firme.
- **NO** crear sistema de gestión de microsites por cliente — esto es una página única hardcodeada para Raúl.
- **NO** internacionalizar — solo español.
- **NO** A/B test ni analytics complejos — es una página privada para una persona.
- **NO** formulario de contacto — solo `mailto:` directo.
- **NO** tracking de scroll depth ni tiempo en página — innecesario.

---

## 8. Riesgos abiertos

- **Logos Tecnifibre/Lacoste:** los tenemos en `public/images/j3/`. Verificar que la calidad sea suficiente para uso en mockup; si no, descargar versiones vectoriales oficiales.
- **Imagen del hero:** `hero.jpeg` puede no ser la idónea. Revisar al implementar y, si hace falta, seleccionar otra de `public/images/`.
- **Móvil con address bar:** el `100dvh` resuelve el caso pero hay que validar en Chrome iOS real, no solo emulador.
- **Mapa Cap 3 P03:** decidir entre SVG manual vs `react-simple-maps` (peso adicional). Preferir SVG manual si los dots cubren menos de 15 países — no hace falta dataset completo.
- **Posiciones de los dots en el mapa:** validar geográficamente con Jorge cuáles son los 10+ países concretos. Si no se quiere precisión absoluta, posiciones aproximadas + cluster grande sirven (la lectura emocional manda sobre la cartográfica).

---

## 9. Aprobaciones

- [x] Revisión de Jorge de esta spec — **aprobada en bloque** (sesión 2026-04-29).
- [x] Subject del email confirmado: *"Una propuesta para Tecnifibre × Lacoste"*.
- [x] Hermano confirmado: **Javi**.
- [x] Tres mejoras finales aprobadas: título Cap 4, harmonización cierres, eyebrow Cap 1.
- [ ] **Siguiente paso:** invocar skill `writing-plans` para generar el plan de implementación paso a paso.

---

*Spec generada en sesión de brainstorming colaborativo el 2026-04-29.*
