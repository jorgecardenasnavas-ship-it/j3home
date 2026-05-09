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
              recommendation: "Tu Camino: empiezas por el Plan Lab. Lo siguiente lo descubres dentro.",
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
              recommendation: "Tu Camino: empiezas por el Plan Lab. Lo siguiente se desbloquea solo cuando completes la Ruta 1.",
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
              recommendation: "Tu Camino: empiezas por el Plan Lab. La Ruta 1 te coloca los tres pilares antes de seguir.",
              ctaLabel: "Dar el salto",
              ctaHref: "https://j3padel.com/join",
            },
          ],
        },
      },

      metodo: {
        eyebrow: "El sistema",
        heading: "Criterio, método, planificación. La forma de decidir.",
        sub: "Tres habilidades en secuencia: decides el foco, construyes el camino, conectas las semanas. Lo que enseña Fundamentos del oficio.",
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
        heading: "Tu rol en el club no cambia. Tu criterio sí.",
        sub: "Dentro de J3 hablamos de Rookie, Assistant Coach, Coach y Master Coach para describir tu progreso con el método, no tu puesto en la pista. Si ya diriges el cuerpo técnico de tu club, sigues haciéndolo. Aquí marcamos hasta dónde has llegado en la rúbrica J3, no a quién mandas el lunes.",
      },

      inversion: {
        eyebrow: "El debut",
        heading: "De Rookie a Master Coach.",
        sub: "Aquí todos empiezan como Rookie. Algunos duran días, otros tardan meses. Depende del nivel que traigas como entrenador. Lo que pase después depende de ti. Los siguientes grados se ganan en el Camino — Assistant Coach, Coach, Master Coach. Tu progreso queda en tu perfil. Tu nombre, en el directorio público.",
        cta: {
          label: "Dar el salto",
          href: "https://j3padel.com/join",
        },
      },

      queHayDentro: {
        eyebrow: "El laboratorio",
        heading: "Tu primer experimento.",
        sub: "Sin maratones de vídeo, sin descargas pasivas. Aquí cada decisión es un experimento que se valida en tu propia pista.",
        cards: [
          {
            badge: "Plan Lab",
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
        heading: "Lo que un padre, un director y tu cuenta a fin de mes notáis a los tres meses.",
        sub: "Cuatro escenas concretas. Antes y después. Sin promesas de carrera.",
        items: [
          {
            scene: "Reunión trimestral con un padre.",
            before: "Improvisas qué va a trabajar su hija este trimestre y rezas para que suene a plan.",
            after: "Abres un documento con la ruta del trimestre, los criterios de evaluación y el siguiente escalón. La conversación dura la mitad y termina con un sí.",
          },
          {
            scene: "Te llaman del club de al lado por una sustitución.",
            before: "Cobras lo mismo que el monitor que entró en septiembre y los padres no notan la diferencia.",
            after: "Tu sello Cualificado J3 está en tu firma, en el panel del club y en tu perfil. La diferencia se nota antes de pisar la pista.",
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
        eyebrow: "Coaches dentro del Lab",
        heading: "82 coaches están escribiendo su Camino.",
        sub: "El sello no se compra, se gana. Esta es la pirámide del Lab a día de hoy. Cada nombre es real, con su club, sus años de oficio y el escalón en el que está.",
        tiers: [
          { count: 6, label: "Master Coach · certificados" },
          { count: 18, label: "Coach · cualificados" },
          { count: 27, label: "Assistant Coaches" },
          { count: 31, label: "Rookies en activo" },
        ],
        total: 82,
        closer: "Tu nombre en la pirámide. O ningún nombre.",
        ctaLabel: "Ver el directorio público",
      },

      noEsParaTi: {
        eyebrow: "Honestidad antes que matrícula",
        heading: "No es para ti si...",
        sub: "Mejor decirlo antes que decepcionarte después.",
        items: [
          "Si buscas un atajo a la titulación oficial, esto no lo da. La titulación habilitante la firma la FIP, no nosotros.",
          "Si solo quieres consumir vídeos sin aplicar rúbrica ni mostrar entrenamientos, hay plataformas más baratas y YouTube es gratis.",
          "Si todavía no entrenas de forma regular en pista, espera. El método se apoya en que tengas sesiones reales que auditar.",
        ],
      },

      faq: {
        eyebrow: "Preguntas",
        heading: "Lo que ya nos han preguntado",
        items: [
          {
            q: "¿Qué pasa si no apruebo el examen?",
            a: "Recibes la devolución escrita completa con la rúbrica aplicada y seis meses para volver a presentarte sin coste adicional. El examen no es un peaje. Es la auditoría que firma tu trabajo.",
          },
          {
            q: "Si al final del año no renuevo el Plan Pro y vuelvo al Plan Lab, ¿qué conservo?",
            a: "Conservas la insignia Cualificado J3 si ya la habías obtenido, pero queda inactiva mientras no estés al día con el contenido del Plan Pro. Mientras estés en el Plan Lab solo accedes a la Ruta 1 y al lote semanal complementario. Si más adelante vuelves al Pro, retomas el Camino donde lo dejaste.",
          },
          {
            q: "¿Cómo accedo al Mentor J3?",
            a: "Para coaches externos, una sesión cero obligatoria de 49€ y 30 minutos. Sirve de filtro mínimo y nos permite ver si tiene sentido el acompañamiento. Si contratas un formato (Sprint, Acompañamiento o Programa), esos 49€ se descuentan.",
          },
          {
            q: "¿Por qué la sesión cero cuesta 49€?",
            a: "Porque el tiempo de Javi y Jorge en pista tiene un techo. Los 49€ filtran a quien viene a hablar en serio y se descuentan si el acompañamiento sigue adelante.",
          },
          {
            q: "¿Y si quiero darme de baja?",
            a: "El Plan Lab es mensual y se cancela desde tu panel cuando quieras, sin penalización. Mantienes acceso hasta el final del mes pagado. El Plan Pro es un compromiso anual de 12 meses con pago único o fraccionado en 12 cuotas — no es cancelable mes a mes, pero al final del año decides si renuevas o vuelves al Plan Lab.",
          },
          {
            q: "¿Cómo se gana y se mantiene la insignia Cualificado?",
            a: "Se concede al entrar al Plan Pro tras haber completado la Ruta 1 desde el Plan Lab. Se mantiene activa mientras sigues consumiendo el contenido publicado y superando los tests asociados a las rutas. Si te descuelgas, dispones de 30 días para ponerte al día antes de que la insignia quede inactiva. Las otras dos insignias (Certificado y Verificado) sí requieren intervención humana del equipo J3.",
          },
          {
            q: "¿Y mi titulación FIP?",
            a: "Sigue siendo válida y necesaria. J3 trabaja después de la FIP, junto a la FIP. No la sustituye, no la imita y no la enfrenta.",
          },
          {
            q: "Si contrato Mentor J3, ¿recibo alguna insignia?",
            a: "No. El Mentor J3 mejora al coach pero no entrega ningún sello. Las insignias se ganan por la ruta de mérito, no por contratar acompañamiento.",
          },
        ],
      },

      ctaFinal: {
        eyebrow: "Empieza por el escalón, no por el sello",
        headingPre: "El sello esperará.",
        headingAccent: "Empieza el escalón.",
        sub: "Suscríbete al método por 19€ al mes. Si después quieres subir al Plan Pro, lo desbloqueas completando la Ruta 1. Si quieres hablarlo antes con uno de los hermanos, reserva la sesión cero.",
        ctaPrimary: "Dar el salto",
        ctaSecondary: "Reservar sesión cero · 49€ · 30 min",
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
        heading: "De Assistant Coach a Master Coach Verificado",
        sub: "Cuatro pasos, tres insignias acumulativas. El grado va con tu progreso, no con el plan que pagas.",
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
          eyebrow: "Y desde Master Coach, dos caminos opcionales",
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
        eyebrow: "PASO 1 · FORMACIÓN",
        heading: "Elige tu suscripción",
        sub: "El plan da acceso al contenido. El grado lo ganas tú completándolo.",
        billingToggle: {
          monthly: "Mensual",
          yearly: "Anual",
          saveLabel: "Ahorra",
        },
        coachBase: {
          name: "Plan Lab",
          tagline: "La puerta del Camino. Empieza por los fundamentos del oficio.",
          description: "Acceso a la Ruta 1 desde el día 1 y un lote semanal de contenido complementario que solo avanza si lo consumes. Llegas hasta Assistant Coach al completar la Ruta 1.",
          features: [
            "Ruta 1 — Fundamentos del oficio (acceso libre)",
            "Lote semanal de contenido complementario con condición de consumo",
            "Un directo pasado curado por semana, rotando temáticas",
            "Algunos recursos descargables seleccionados",
            "Sello Assistant Coach al completar la Ruta 1",
          ],
          cta: "Dar el salto",
        },
        coachPro: {
          badge: "EL CAMINO COMPLETO",
          name: "Plan Pro",
          tagline: "Las tres rutas, el programa de directos y el sello Cualificado vivo.",
          description: "Acceso libre a las tres rutas, programa de directos en vivo, archivo permanente, comunidad y acceso al equipo formativo. Compromiso anual con tres modalidades de pago. Se desbloquea al completar la Ruta 1 desde el Plan Lab.",
          features: [
            "Acceso libre a las 3 rutas: Fundamentos del oficio, Fundamentos del juego, Diseño del jugador y del coach",
            "Programa de directos en vivo · todas las temáticas",
            "Archivo permanente y libre de directos pasados",
            "Todos los recursos descargables",
            "Comunidad de coaches J3",
            "Acceso al equipo formativo de Javi y Jorge",
            "Sello Coach + insignia Cualificado (vivo)",
            "Pre-requisito para el Examen de certificación",
          ],
          cta: "Dar el salto",
        },
      },

      examen: {
        eyebrow: "PASO 2 · CERTIFICACIÓN",
        heading: "Examen de pruebas prácticas",
        sub: "No es ruta. Es un examen evaluado por humanos. Te lleva de Coach a Master Coach con la insignia Certificado J3.",
        plan: {
          name: "Examen de certificación",
          tagline: "Evaluación humana del equipo J3",
          description: "Grabas dos sesiones reales con tus alumnos. El equipo J3 las audita con la rúbrica completa y te devuelve un informe escrito en 7 días. Después, una llamada de evaluación de 45-60 minutos.",
          priceNote: "Pago único",
          features: [
            "Auditoría escrita por el equipo J3 en 7 días",
            "Llamada de evaluación 45-60 min",
            "Sello Master Coach + insignia Certificado J3 al aprobar",
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
            "12 meses como Master Coach activo",
            "30+ jugadores formados con metodología J3",
            "2 vídeos de sesiones reales auditados por J3",
            "Llamada de evaluación de 45-60 min",
            "Plan Pro activo y al día",
          ],
          cta: "Ver requisitos completos",
        },
      },

      firstYearMath: {
        eyebrow: "INVERSIÓN AÑO 1",
        heading: "Cuánto te cuesta cada camino",
        sub: "Referencia comercial sobre los caminos típicos. La Verificación no aparece porque es gratuita.",
        rows: {
          base: "Plan Lab anual",
          pro: "Plan Pro anual",
          proExamen: "Plan Pro + examen",
          proExamenSprint: "Plan Pro + examen + Mentor Sprint",
          proExamenProg: "Plan Pro + examen + Mentor Programa",
        },
        note: "El founder rate (solo coaches actuales de J3 Lab) reduce los paquetes Mentor un 30%.",
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
            q: "¿Puedo saltarme el Plan Lab e ir directo al Plan Pro?",
            a: "No. El Plan Pro se desbloquea cuando completas la Ruta 1 desde el Plan Lab. Es un sistema de progresión por mérito, no un menú comercial. Los 19€/mes del Plan Lab son la puerta para todos.",
          },
        ],
      },

      ctaFinal: {
        eyebrow: "EMPEZAR",
        heading: "El Camino empieza por la misma puerta",
        sub: "Plan Lab · 19€/mes. Cancelas cuando quieras. El Plan Pro y el Examen se desbloquean conforme avances.",
        ctaPrimary: "Dar el salto",
        ctaSecondary: "Ver el Camino completo",
      },
    },
  },
} as const;
