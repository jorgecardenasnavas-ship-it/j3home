/* ──────────────────────────────────────────────
   Copy en español del bloque lab.coach.pricing.

   Compartido entre las 5 locales (es / en / fr / pt / sv)
   porque la pricing page de J3 Lab Coach se lanza primero
   solo en español. Cuando se traduzca, cada locale
   reemplazará la referencia por su propia constante.

   El `as const` mantiene los tipos literales para que
   `as const satisfies Dictionary` siga funcionando en
   los archivos que lo importan.
   ────────────────────────────────────────────── */

export const LAB_COACH_ES = {
  coach: {
    landing: {
      hero: {
        eyebrow: "Para coaches comprometidos",
        headingPre: "Años en pista. Mismo techo.",
        headingAccent: "Aquí lo rompes.",
        sub: "Llevas años creyendo que te falta planificación. Lo que te falta es saber cuándo aplicar cuál. Planificar no es escribir doce meses por delante — es leer al jugador. Aquí lo aprendes.",
        ctaPrimary: "Dar el salto",
        ctaSecondary: "Ver el método",
      },

      siEstoTeSuena: {
        eyebrow: "Modo Carrera · Diagnóstico de criterio",
        heading: "Seis decisiones. Solo tú sabes cómo terminan.",
        sub: "No hay respuesta correcta. Solo honesta. Decide como decidirías en pista.",
        closer: "El siguiente bloque te dice por dónde empezar tu Camino según cómo decides hoy.",
        progressLabel: "Decisión",
        scenes: [
          {
            pillar: "criterio",
            pillarLabel: "Criterio",
            sceneNumber: 1,
            situation: "Te llegan 4 jugadores que no conoces. 60 minutos. ¿Por dónde empiezas?",
            options: [
              "Calentamiento dinámico para activarlos antes de entrar al ejercicio principal.",
              "Tarea simple, mínima corrección. Observas cómo deciden los primeros 10 minutos.",
              "Aplicas la progresión que tenías planificada para esta semana.",
              "Ejercicios variados los primeros minutos para ver el nivel del grupo.",
            ],
            correctIndex: 1,
            j3Response: {
              title: "Activación observada.",
              body: "10-15 minutos de tarea simple, mínima corrección, máxima observación. El criterio del día se decide después de leer al grupo, no antes.",
              anchor: "Aquí no mejoras. Aquí lees.",
            },
          },
          {
            pillar: "criterio",
            pillarLabel: "Criterio",
            sceneNumber: 2,
            situation: "Habías planificado la sesión para 4 jugadores. Te aparecen 3. ¿Qué cambias?",
            options: [
              "Cambias el ejercicio entero porque estaba pensado para 4 jugadores.",
              "Llamas a un sparring para llegar a los 4 jugadores que esperabas.",
              "Te metes tú como cuarto jugador para que el ejercicio funcione.",
              "Mantienes el foco pero cambias tu rol: con 3 intervienes más.",
            ],
            correctIndex: 3,
            j3Response: {
              title: "No cambias el ejercicio. Cambias tu rol.",
              body: "Con 4 priorizas y observas. Con 3 lees y ajustas — intervienes más. El número de jugadores define el formato, no el foco.",
              anchor: "El foco no se toca.",
            },
          },
          {
            pillar: "metodo",
            pillarLabel: "Método",
            sceneNumber: 3,
            situation: "Diseñas una sesión sobre \"decidir cuándo subir a la red\". ¿Cómo la ordenas?",
            options: [
              "Entrada con foco claro → desarrollo con repeticiones → cierre con menos ayuda.",
              "Calentamiento → ejercicio analítico → global → puntos para terminar.",
              "Empiezas con puntos para que aparezca el problema, corriges sobre la marcha.",
              "Trabajas la subida a la red con muchas variantes durante toda la sesión.",
            ],
            correctIndex: 0,
            j3Response: {
              title: "Presento → Trabajo → Compruebo.",
              body: "Entrada (10'): el jugador entiende qué entrena, sin presión. Desarrollo (30'): el problema aparece muchas veces, ajustas dificultad sin tocar foco. Cierre (20'): quitas ayudas y compruebas si la decisión aparece sola.",
              anchor: "Tres decisiones metodológicas, no una lista de ejercicios.",
            },
          },
          {
            pillar: "metodo",
            pillarLabel: "Método",
            sceneNumber: 4,
            situation: "A mitad de sesión, la decisión que buscabas no aparece. ¿Qué haces?",
            options: [
              "Cambias a otro ejercicio de menor dificultad para que les salga.",
              "Le explicas mejor y le das más ejemplos para que lo entienda.",
              "Reduces el espacio o cambias una norma — el foco no se toca.",
              "Terminas la sesión y les dejas jugar libre. Han venido a disfrutar.",
            ],
            correctIndex: 2,
            j3Response: {
              title: "Ajustas UNA variable. Nunca el foco.",
              body: "Si falta comprensión → espacio. Si falta presión → tiempo. Si falta consecuencia → norma.",
              anchor: "Si ajustas dos cosas a la vez, no sabes qué ha funcionado.",
            },
          },
          {
            pillar: "planificacion",
            pillarLabel: "Planificación",
            sceneNumber: 5,
            situation: "Trabajaste un foco la semana pasada. Apareció algunas veces, pero no se sostiene. ¿Y esta semana?",
            options: [
              "Cambias de foco esta semana para que no se aburra el jugador.",
              "Sostienes el mismo foco y ajustas las condiciones de la sesión.",
              "Avanzas al siguiente foco que tenías en tu plan trimestral.",
              "Repites exactamente la misma sesión que la semana pasada.",
            ],
            correctIndex: 1,
            j3Response: {
              title: "Ajustas. Sostienes el foco, ajustas las condiciones.",
              body: "Repite si no aparece. Ajusta si aparece a medias. Avanza solo cuando se sostiene solo.",
              anchor: "No planifiques por sensaciones. Planifica por señales.",
            },
          },
          {
            pillar: "planificacion",
            pillarLabel: "Planificación",
            sceneNumber: 6,
            situation: "¿Cuándo das un foco por trabajado y pasas al siguiente?",
            options: [
              "Cuando ya has hecho entre 4 y 6 sesiones sobre ese foco.",
              "Cuando el jugador lo ejecuta de forma perfecta y limpia.",
              "Cuando ya lo tiene dominado y dejas de ver el error.",
              "Cuando el jugador lo sostiene solo, con menos intervención tuya.",
            ],
            correctIndex: 3,
            j3Response: {
              title: "Cuando ya se sostiene solo.",
              body: "En un contexto más abierto, con menos intervención tuya, en situaciones reales de partido.",
              anchor: "No cambias de foco porque esté dominado. Lo cambias porque ya se sostiene.",
            },
          },
        ],
        ui: {
          confirmLabel: "Confirmar respuesta",
          nextLabel: "Siguiente decisión",
          j3Badge: "La respuesta J3",
          correctBadge: "Bien visto",
          trapBadge: "Tu respuesta",
          seeResultsLabel: "Ver mi diagnóstico",
        },
        results: {
          eyebrow: "Tu diagnóstico de criterio",
          scoreLabel: "Decisiones leídas con criterio",
          tiers: [
            {
              minScore: 6,
              maxScore: 6,
              statusBadge: {
                prefix: "Status inicial: Rookie",
                rhythm: "Ritmo rápido",
              },
              heading: "Coach con criterio.",
              body: "Las seis decisiones leídas con oficio. Eso ya es nivel de Coach Cualificado en cabeza. Pero el Camino empieza igual para todos: como Rookie. La diferencia es que tú la Ruta 1 la haces en semanas, no en meses.",
              recommendation: "Tu Camino: empiezas como Coach. Lo siguiente lo descubres dentro.",
              ctaLabel: "Dar el salto",
              ctaHref: "https://j3padel.com/join",
            },
            {
              minScore: 4,
              maxScore: 5,
              statusBadge: {
                prefix: "Status inicial: Rookie",
                rhythm: "Ritmo medio",
              },
              heading: "Tienes parte del oficio. Falta cerrar el resto.",
              body: "Reconoces las trampas. Decides bien la mayoría de las veces. Pero hay momentos en pista donde aún tiras de instinto, no de método. Empiezas como Rookie, igual que todos — la diferencia es que tu base te hace ir más rápido.",
              recommendation: "Tu Camino: empiezas como Coach. Lo siguiente se desbloquea solo cuando completes la Ruta 1.",
              ctaLabel: "Dar el salto",
              ctaHref: "https://j3padel.com/join",
            },
            {
              minScore: 0,
              maxScore: 3,
              statusBadge: {
                prefix: "Status inicial: Rookie",
                rhythm: "Empiezas por la base",
              },
              heading: "Esto no es un fallo. Es el punto de partida.",
              body: "Las trampas que has marcado no son fallos tuyos. Son lo que te enseñaron a hacer. Empiezas como Rookie, y la Ruta 1 te coloca los tres pilares: criterio, método y planificación, desde la base.",
              recommendation: "Tu Camino: empiezas como Coach. La Ruta 1 te coloca los tres pilares antes de seguir.",
              ctaLabel: "Dar el salto",
              ctaHref: "https://j3padel.com/join",
            },
          ],
        },
      },

      metodo: {
        eyebrow: "El sistema",
        heading: "Antes del ejercicio, la decisión.",
        sub: "Tres habilidades en secuencia: decides el foco, construyes el camino, conectas las semanas.",
        cards: [
          {
            title: "Criterio",
            subtitle: "Saber qué entrenar y qué no, según el momento.",
            items: [
              "Lectura del jugador",
              "Priorización del foco",
              "Intervención",
            ],
            closer: "Es la diferencia entre repetir un ejercicio porque lo hiciste el lunes y elegirlo porque hoy le toca.",
          },
          {
            title: "Método",
            subtitle: "El camino de la sesión, no la lista de ejercicios.",
            items: [
              "Dónde presentas el problema",
              "Dónde lo trabajas",
              "Dónde compruebas si aparece",
            ],
            closer: "No es una lista de ejercicios — es un orden con sentido.",
          },
          {
            title: "Planificación",
            subtitle: "Conectar lo de hoy con lo que quieres que pase mañana.",
            items: [
              "Repite — si no aparece",
              "Ajusta — si aparece a medias",
              "Avanza — si se sostiene solo",
            ],
            closer: "Roadmap del jugador, no calendario rígido. Si no ha asimilado un concepto, no lo abandonas porque el plan diga que ya tocaba otra cosa.",
          },
        ],
        closer: "Antes ibas con cien ejercicios. Aquí vas con tres decisiones.",
        humbleNote: "Más de 2 décadas en pista. Y hace poco descubrimos que el concepto de \"planificación\" lo teníamos mal definido. Lo escribimos en una guía de 7 días: Fundamentos del oficio.",
      },

      camino: {
        eyebrow: "El Camino",
        heading: "Aquí todos empiezan como Coach. Pocos se pasan el juego.",
        sub: "Todos sabemos meternos en pista. Nadie nos enseñó a salir.",
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
        cta: "Apúntate · te avisamos cuando abra",
        access: "Pre-lanzamiento. Te enviamos el email de apertura en cuanto esté listo. Requerirá Pro Coach activo + las 3 rutas completadas + insignia Cualificado al día.",
      },

      queHayDentro: {
        eyebrow: "El laboratorio",
        heading: "Tu primer experimento.",
        sub: "Sin maratones de vídeo, sin descargas pasivas. Aquí cada decisión es un experimento que se valida en tu propia pista.",
        cards: [
          {
            badge: "Coach",
            title: "Aquí empieza el experimento.",
            subtitle: "El laboratorio te espera.",
            body: [
              "Cada semana vas a pista con un plan, no con cien ejercicios. Cada decisión tiene un porqué.",
              "Para que tu intención en pista sea legible — para un padre, para un director deportivo y para ti mismo dentro de tres años.",
            ],
            stats: {
              label: "Stats del coach",
              sublabel: "Por desbloquear con la Ruta 1",
              items: ["Criterio", "Método", "Planificación"],
            },
            entregables: [
              {
                label: "Lo que incluye el plan",
                items: [
                  "Ruta completa: Fundamentos del oficio",
                  "Actualización semanal: directos pasados curados",
                  "Lote mensual de materiales de trabajo",
                ],
              },
            ],
            pricing: {
              monthly: {
                label: "Mensual",
                price: "19€/mes",
                microcopy: "Mes a mes. Sin atadura.",
              },
              yearly: {
                label: "Anual · -37%",
                price: "144€/año",
                microcopy: "Equivale a 12€/mes.",
              },
            },
            cta: {
              label: "Dar el salto",
              hrefMonthly: "https://j3padel.com/join?plan=lab&billing=monthly",
              hrefYearly: "https://j3padel.com/join?plan=lab&billing=yearly",
            },
          },
        ],
      },

      negocio: {
        eyebrow: "Cambio visible",
        heading: "Cuatro escenas a tres meses.",
        sub: "El antes que vives hoy y el después que aparece tres meses dentro del laboratorio.",
        items: [
          {
            scene: "Reunión trimestral con un padre.",
            before: "Improvisas qué va a trabajar su hija este trimestre y rezas para que suene a plan.",
            after: "Abres un documento con la ruta del trimestre, los criterios de evaluación y el siguiente escalón. La conversación dura la mitad y termina con un sí.",
          },
          {
            scene: "Te llaman del club de al lado por una sustitución.",
            before: "Cobras lo mismo que el monitor que entró en septiembre y los padres no notan la diferencia.",
            after: "Tu nombre está en el directorio público de J3. Lo notan antes de que pises la pista.",
          },
          {
            scene: "Director deportivo te pide tu metodología.",
            before: "Dices que la tienes \"en la cabeza\" y prometes pasársela esta semana.",
            after: "La envías esa misma tarde, escrita, con su rúbrica y su rastro de evidencia. Y la firma lleva tu nombre.",
          },
          {
            scene: "Tu cuenta a fin de mes.",
            before: "Miras el precio/hora y lo comparas con lo que cobra el coach del club de al lado.",
            after: "Miras la facturación total — retención de grupos, frecuencia de clases, paquetes de varias semanas. Pasas de calcular tu salario a diseñar tu negocio.",
          },
        ],
      },

      coachesDentro: {
        eyebrow: "Coaches dentro",
        heading: "Mensajes desde el laboratorio.",
        sub: "Lo que están escribiendo los coaches que ya hacen el Camino. Citas reales, recogidas del canal privado del Lab.",
        chatTitle: "Lab · canal del laboratorio",
        chatSubtitle: "Mensajes recientes",
        footerCount: "82 coaches en {N} países escribiendo su Camino.",
        ctaLabel: "Ver el directorio público",
        ctaHref: "https://j3padel.com/join",
      },

      faq: {
        eyebrow: "Preguntas",
        heading: "Lo que ya nos han preguntado",
        items: [
          {
            q: "¿Y mi titulación FIP?",
            a: "Sigue siendo válida y necesaria. J3 trabaja después de la FIP, junto a la FIP. No la sustituye, no la imita y no la enfrenta.",
          },
          {
            q: "¿Cuánto tarda completar la Ruta 1?",
            a: "Depende del nivel que traigas. Algunos coaches la completan en semanas. Otros en meses. La Ruta no avanza en automático — se desbloquea conforme la consumes y la aplicas en pista.",
          },
          {
            q: "¿Y si quiero darme de baja?",
            a: "El tier Coach es mensual. Cancelas desde tu panel cuando quieras, sin penalización. Mantienes acceso hasta el final del mes pagado.",
          },
          {
            q: "¿Qué pasa después de la Ruta 1?",
            a: "El laboratorio crece. Lo que se desbloquea después lo descubres dentro — no es un menú comercial, es un Camino que se gana.",
          },
          {
            q: "¿Quién está detrás del laboratorio?",
            a: "Javi y Jorge — hermanos, coaches en activo. Más de dos décadas en pista entre los dos. El equipo formativo lo dirigen ellos directamente, no se delega.",
          },
        ],
      },

      ctaFinal: {
        eyebrow: "Última puerta",
        headingPre: "Aquí dejas de leer.",
        headingAccent: "Aquí empiezas.",
        sub: "Tier Coach · 19€/mes. Mes a mes. Cancelas cuando quieras.",
        ctaPrimary: "Dar el salto",
        ctaSecondary: "Ver el Camino completo",
      },
    },

    pricing: {
      hero: {
        eyebrow: "J3 LAB · COACH · PRECIOS",
        headingPre: "El camino completo,",
        headingAccent: "transparente.",
        sub: "Cuatro modelos de cobro, una sola lógica: pagas por lo que avanzas. Sin paquetes inflados. Sin letra pequeña.",
      },

      camino: {
        eyebrow: "EL CAMINO",
        heading: "De Coach a Pro Coach a Head Coach",
        sub: "Tres tiers, tres insignias. El tier va con lo que pagas. Las insignias se ganan en Pro Coach.",
        // NOTA: las sub-claves grados/insignias/unlocks/hitos/destinos
        // se mantienen aquí temporalmente por compatibilidad con el
        // CaminoBlock antiguo. Se eliminan en Fase 2 cuando se
        // refactorice el componente y su uso.
        grados: {
          assistantCoach: "Assistant Coach",
          coach: "Coach",
          masterCoach: "Master Coach",
        },
        insignias: {
          cualificado: "Cualificado J3",
          certificado: "Certificado J3",
          verificado: "Verificado J3",
        },
        unlocks: {
          planBase: "Plan Lab · 19€/mes",
          planPro: "Plan Pro · desde 540€/año",
          examen: "Examen · 490€",
          merito: "Por mérito · gratis",
        },
        hitos: {
          "01": "Completas la Ruta 1 — Fundamentos del oficio",
          "02": "Completas la Ruta 2 — Fundamentos del juego",
          "03": "Pasas las pruebas prácticas",
          "04": "J3 audita tu trabajo real con jugadores reales",
        },
        destinos: {
          eyebrow: "Master Coach no es el final. Se bifurca.",
          items: {
            business: {
              name: "Camino Business",
              desc: "Monta tu academia, tu club, tu marca.",
            },
            proCoach: {
              name: "Pro Coach",
              desc: "Entrena a jugadores en el circuito profesional.",
            },
          },
        },
      },

      duraciones: {
        "30d": "30 días",
        "90d": "90 días",
        "12m": "12 meses",
      },

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

      mentor: {
        eyebrow: "PASO 3 · MENTORÍA 1:1",
        heading: "Mentor J3",
        sub: "Servicio premium 1:1, estrictamente sobre coaching de pista. Lo dan los hermanos. Capacidad estructuralmente limitada.",
        founderBanner: "Founder rate activo · 30% de descuento aplicado para coaches actuales de J3 Lab.",
        priceLabels: {
          public: "Precio público",
          founder: "Founder rate",
        },
        sprint: {
          name: "Sprint",
          tagline: "Acelerón corto para resolver un bloqueo concreto",
          description: "30 días, 4 sesiones. Diagnóstico + plan + ejecución corta.",
          features: [
            "4 sesiones 1:1",
            "Plan personalizado de 30 días",
            "Soporte entre sesiones",
          ],
          cta: "Reservar sesión cero",
        },
        acompanamiento: {
          name: "Acompañamiento",
          tagline: "Trimestre completo de mentoría",
          description: "90 días, 8 sesiones. Tiempo real para cambiar la práctica.",
          features: [
            "8 sesiones 1:1",
            "Plan trimestral",
            "Revisión de vídeos de tus sesiones",
            "Soporte continuo entre sesiones",
          ],
          cta: "Reservar sesión cero",
        },
        programa: {
          name: "Programa",
          tagline: "Acompañamiento anual orientado al sello Verificado J3",
          description: "12 meses, 16 sesiones. Para coaches que quieren llegar al sello.",
          features: [
            "16 sesiones 1:1",
            "Plan anual",
            "Revisión continua de vídeos",
            "Acceso directo entre sesiones",
            "Camino preparado hacia los requisitos del Verificado",
          ],
          cta: "Reservar sesión cero",
        },
      },

      sesionCero: {
        eyebrow: "PUNTO DE ENTRADA",
        heading: "Sesión cero",
        sub: "30 minutos con el equipo J3 para diagnóstico y propuesta. Solo para externos a J3 Lab.",
        plan: {
          name: "Sesión cero",
          tagline: "Filtro de encaje + onboarding metodológico",
          description: "30 min: 5 de contexto, 15 de diagnóstico, 7 de propuesta, 3 de cierre. Si después contratas paquete, los 49€ se descuentan.",
          priceNote: "Pago único · 30 min",
          features: [
            "Diagnóstico estructurado de tu práctica actual",
            "Propuesta del formato que encaja, o redirección honesta",
            "Cierre con próximo paso concreto",
            "Descontable del paquete Mentor que contrates después",
          ],
          cta: "Reservar sesión cero",
        },
      },

      verificacion: {
        eyebrow: "EL SELLO",
        heading: "Verificación J3",
        sub: "Gratis. Por mérito. El sello más respetado del sistema.",
        plan: {
          name: "Verificado J3",
          tagline: "El aval continuo de J3 sobre tu trabajo real",
          description: "J3 mira tu trabajo con jugadores reales y dice que cumple el estándar. No es examen ni certificación: es un aval que se revalida cada 24 meses.",
          meritNote: "Por mérito · proceso gratuito",
          features: [
            "12 meses como Pro Coach activo",
            "30+ jugadores formados con metodología J3",
            "2 vídeos de sesiones reales auditados por J3",
            "Llamada de evaluación de 45-60 min",
            "Pro Coach activo y al día",
          ],
          cta: "Ver requisitos completos",
        },
      },

      firstYearMath: {
        eyebrow: "INVERSIÓN AÑO 1",
        heading: "Cuánto te cuesta cada camino",
        sub: "Referencia comercial sobre los caminos típicos del coach. La Verificación no aparece porque es gratuita.",
        rows: {
          pro: "Pro Coach anual",
          proExamen: "Pro Coach + examen",
          proExamenSprint: "Pro Coach + examen + Mentor Sprint",
          proExamenProg: "Pro Coach + examen + Mentor Programa",
        },
        note: "El founder rate (solo coaches actuales del Lab) reduce los paquetes Mentor un 30%.",
      },

      faq: {
        eyebrow: "PREGUNTAS",
        heading: "Las dudas habituales",
        items: [
          {
            q: "¿Por qué la Verificación J3 es gratis?",
            a: "Si pudiera comprarse, valdría menos. Quien la consigue ya ha invertido entre 1.500 y 3.000€ en el plan Pro anual + examen + posible Mentor. Cobrar otra vez por validar su trabajo sería miope.",
          },
          {
            q: "¿Por qué el examen no está incluido en la cuota?",
            a: "El coste real del examen es humano: lo evalúa nuestro equipo con feedback escrito. Si lo incluyésemos en la cuota, lo subvencionarían los coaches que no se examinan. Además, el pago único genera un momento real, equivalente a una matrícula.",
          },
          {
            q: "¿Mentor J3 me da la Verificación automáticamente?",
            a: "No. Mentor es servicio de formación; Verificado es validación de trabajo real con jugadores reales. Son cosas distintas. Comprar Mentor no compra el sello — y eso es lo que protege su valor.",
          },
          {
            q: "¿Qué pasa si no apruebo el examen?",
            a: "Recibes feedback escrito estructurado y vuelves a presentarte en 6 meses sin coste adicional en la siguiente convocatoria. El examen se aprueba: no se compra.",
          },
          {
            q: "¿Puedo saltarme el Coach e ir directo al Pro Coach?",
            a: "No. El Pro Coach se desbloquea cuando completas la Ruta 1 desde el tier Coach. Es un sistema de progresión por mérito, no un menú comercial. Los 19€/mes del Coach son la puerta para todos.",
          },
        ],
      },

      ctaFinal: {
        eyebrow: "EMPEZAR",
        heading: "El Camino empieza por la misma puerta",
        sub: "Coach · 19€/mes. Cancelas cuando quieras. El Pro Coach y el Examen se desbloquean conforme avances.",
        ctaPrimary: "Dar el salto",
        ctaSecondary: "Ver el Camino completo",
      },
    },
  },

  /* ── Home del paraguas J3 Lab ── */
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
} as const;
