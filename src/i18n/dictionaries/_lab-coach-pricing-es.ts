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
        eyebrow: "Para coaches con oficio",
        headingPre: "Llevas años entrenando bien.",
        headingAccent: "Aquí lo escribes.",
        sub: "Tu método existe en pista. Le falta criterio, método y orden — escritos. Una buena sesión no garantiza progreso. Lo garantiza la continuidad.",
        ctaPrimary: "Empezar el Plan Coach · 19€/mes",
        ctaSecondary: "Ver el método antes de decidir",
        chips: [
          "22 años en pista",
          "82 coaches en el Lab",
        ],
      },

      siEstoTeSuena: {
        eyebrow: "Antes de seguir",
        heading: "Tres preguntas que un coach con oficio se contesta solo.",
        sub: "No hay respuestas correctas. Hay respuestas honestas. Léelas en voz baja.",
        items: [
          "Cuando un padre te pregunta qué va a aprender su hijo este trimestre, improvisas algo que suena bien y luego lo cumples sobre la marcha.",
          "Tienes cien ejercicios guardados en redes, pero no sabes cuándo aplicar cuál con el alumno que tienes delante.",
          "El monitor del club de al lado cobra lo mismo que tú y los padres no notan la diferencia.",
        ],
        closer: "Si las tres te incomodan un poco, J3 Lab Coach es para ti.",
      },

      hermanos: {
        eyebrow: "Quiénes firman esto",
        heading: "Dos hermanos. Veintidós años en pista.",
        sub: "El método sale de aquí, no de un PDF.",
        members: [
          {
            name: "Javi Cárdenas",
            role: "CEO · Ejecución y operativa del ecosistema J3",
            quote: "Sin ejecución, la visión se queda en conversación.",
            palmares: "Llevó al Higuerón a ser elegido mejor club del mundo en 2018. Organiza el WPT Málaga desde su sede oficial en 2014.",
          },
          {
            name: "Jorge Cárdenas",
            role: "CSO · Metodología y criterio de pista",
            quote: "Ver el juego antes de que ocurra. Eso es entrenar.",
            palmares: "N.º 1 entrenador español en el ranking WPT 2022. Ha formado a jugadores que hoy compiten en el circuito profesional.",
          },
        ],
        chips: [
          "#1 mejor club del mundo · 2018",
          "5 campeones de España y del Mundo formados",
          "N.º1 entrenador español WPT · 2022",
        ],
      },

      porQueTeSirve: {
        eyebrow: "Lectura para escépticos",
        heading: "Esto no es para empezar. Es para poner por escrito lo que ya haces — o aprender bien lo que aún no.",
        sub: "Tres aclaraciones para que sepas exactamente qué compras y qué no.",
        items: [
          {
            highlight: "Ruta 1 no te enseña a entrenar.",
            body: "Te da el criterio, método y orden para decidir qué ejercicio aplicar con el alumno que tienes delante. Si llevas años, te lo escribes. Si empiezas, lo aprendes bien hecho.",
          },
          {
            highlight: "Ruta 2 no es teoría aislada.",
            body: "Te desbloquea los fundamentos técnicos y, sobre todo, tácticos del pádel moderno en micro. No solo cómo juegan los profesionales — también cómo lo aplica un amateur cuando tiene un coach que lo entiende.",
          },
          {
            highlight: "El examen no es un test de conocimientos.",
            body: "Son dos vídeos de tus sesiones reales, una auditoría escrita en siete días y una llamada de 45-60 minutos con alguien con palmarés. O firma. O no firma.",
          },
        ],
      },

      metodo: {
        eyebrow: "El método",
        heading: "Criterio · Método · Planificación.",
        sub: "Tres ejes que separan al coach con criterio del improvisador con buena memoria. Son el corazón de la Ruta 1.",
        cards: [
          {
            title: "Criterio",
            subtitle: "Saber qué entrenar y qué no, según el momento.",
            body: "Tres herramientas: lectura del jugador, priorización del foco, intervención. Es la diferencia entre repetir un ejercicio porque lo hiciste el lunes y elegirlo porque hoy le toca.",
          },
          {
            title: "Método",
            subtitle: "Darle lógica a la sesión y a la semana.",
            body: "Tres decisiones: dónde presentas el problema, dónde lo trabajas, dónde compruebas si aparece. Y un criterio de salida del foco — cuándo puedes darlo por suficientemente trabajado.",
          },
          {
            title: "Planificación",
            subtitle: "Conectar lo de hoy con lo que quieres que pase mañana.",
            body: "Repite · Ajusta · Avanza. Roadmap del jugador, no calendario rígido. Si el alumno no ha asimilado el concepto, no lo abandonas porque el papel diga que este mes toca otra cosa.",
          },
        ],
        closer: "Una buena sesión no garantiza progreso. Lo garantiza la continuidad.",
        humbleNote: "Llevamos 22 años entrenando. Hace dos descubrimos que el concepto de \"planificación\" lo teníamos mal definido. Por eso existe la Ruta 1.",
      },

      camino: {
        eyebrow: "El Camino",
        heading: "Tu rol en el club no cambia. Tu criterio sí.",
        sub: "Dentro de J3 hablamos de Rookie, Assistant Coach, Coach y Head Coach para describir tu progreso con el método, no tu puesto en la pista. Si ya eres Head Coach en tu club, sigues siéndolo. Aquí marcamos hasta dónde has llegado en la rúbrica J3, no a quién mandas el lunes.",
      },

      inversion: {
        eyebrow: "Inversión total a la vista",
        heading: "Esto es lo que cuesta entero. Lo ves antes de pagar nada.",
        sub: "Tres techos posibles, sin upsell oculto. Eliges escalón y ya. El Mentor J3 va aparte porque no entrega ningún sello, y queremos que eso quede claro desde el primer minuto.",
        plans: [
          {
            name: "Plan Coach",
            price: "19€/mes",
            desc: "Acceso a Ruta 1 y a la cohorte",
            total: "228€ a 12 meses",
            note: null,
            badge: null,
          },
          {
            name: "Plan Coach Pro",
            price: "49€/mes",
            desc: "Ruta 1 + Ruta 2 + directos en vivo + WhatsApp grupal",
            total: "588€ a 12 meses",
            note: "Se desbloquea al completar Plan Coach + tests/XP",
            badge: "Recomendado por defecto",
          },
          {
            name: "Coach Pro + Examen",
            price: "+ 490€ pago único",
            desc: "Coach Pro 49€/mes + Examen una vez",
            total: "1.078€ primer año",
            note: "Te lleva a Head Coach con la insignia Certificado J3",
            badge: null,
          },
        ],
        mentor: {
          title: "Mentor J3",
          sub: "Acompañamiento 1:1 con Javi y Jorge en tres tiers. Para externos, sesión cero obligatoria de 49€ y 30 minutos como filtro mínimo, descontable si contratas.",
          tiers: [
            { name: "Sprint", duration: "30 días · 4 sesiones", price: "895€" },
            { name: "Acompañamiento", duration: "90 días · 8 sesiones", price: "1.495€" },
            { name: "Programa", duration: "12 meses · 16 sesiones", price: "2.495€" },
          ],
          clause: "El Mentor J3 mejora al coach. No entrega ninguna insignia. El sello sigue ganándose por la ruta de mérito.",
        },
        verificado: {
          title: "Verificado J3",
          body: "Gratis. Por mérito puro. Doce meses como Head Coach activo, treinta o más jugadores formados, auditoría de dos vídeos reales y llamada de evaluación. No se compra.",
        },
        smallPrint: "Sin permanencia. Cancelas cuando quieras. IVA incluido.",
      },

      queHayDentro: {
        eyebrow: "Qué hay dentro",
        heading: "Las dos rutas y el examen",
        sub: "Sin maratones de vídeo, sin descargas pasivas. Cada escalón pide lectura, observación y devolución sobre tu propio entrenamiento.",
        cards: [
          {
            badge: "Plan Coach · 19€/mes",
            title: "Ruta 1 · Fundamentos del oficio",
            subtitle: "Para el coach que ya entrena por instinto.",
            body: "Tienes oficio. Lees un partido en cinco minutos y sabes lo que falla. Ruta 1 te da la rúbrica explícita detrás de eso: el lenguaje, la pizarra y el criterio para que tu intención en pista sea legible para un padre, para un director deportivo y para ti mismo dentro de tres años.",
            entregables: [
              "7 masterclass de ~90 min",
              "Cuatro bloques: marco mental, habilidad del criterio, método y estructura de sesión, planificación y autoridad",
              "Acceso a directos en diferido",
              "2 consultas con el equipo al mes (respuesta en 72 h)",
              "Recursos descargables básicos",
            ],
          },
          {
            badge: "Plan Coach Pro · 49€/mes",
            title: "Ruta 2 · Fundamentos del juego",
            subtitle: "Para el coach que quiere entrenar la lectura, no solo el gesto.",
            body: "La Ruta 2 entra donde la formación de fin de semana no llega: intención táctica, lectura del partido, construcción del punto y diseño de temporada. Es el material que separa al coach que corrige golpes del coach que dirige a un jugador hacia un palmarés.",
            entregables: [
              "10 directos en vivo de ~90-120 min",
              "Todos los martes, con Javi y Jorge",
              "Acceso completo a la videoteca",
              "WhatsApp grupal de la promoción",
              "4 consultas al mes (respuesta en 24 h)",
              "Acceso completo a todo lo de Ruta 1",
            ],
          },
          {
            badge: "Pago único · 490€",
            title: "Examen práctico humano",
            subtitle: "El vídeo no te examina. Nosotros sí.",
            body: "Envías dos entrenamientos reales grabados en tu pista. El equipo J3 los audita con la rúbrica completa y te devuelve un informe escrito en 7 días. Después, una llamada de evaluación de 45-60 minutos contigo.",
            entregables: [
              "2 vídeos de sesiones reales en tu pista",
              "Auditoría escrita por el equipo J3 en 7 días",
              "Llamada de evaluación 45-60 min",
              "Insignia Certificado J3 al aprobar",
              "Si no apruebas: feedback escrito + 6 meses para volver sin coste extra",
            ],
          },
        ],
        desbloqueoNote: "Plan Coach Pro no se compra al vuelo. Se desbloquea al completar la Ruta 1 más los tests y el XP requeridos. Es la primera prueba de que el sistema premia mérito, no inscripción.",
        comparativa: {
          title: "Diferencias entre planes",
          sub: "Lo que cambia cuando subes de escalón.",
          colCoach: "Plan Coach",
          colCoachPro: "Plan Coach Pro",
          rows: [
            { feature: "Tu ruta personal", coach: "5 contenidos al día", coachPro: "Sin límite" },
            { feature: "Programas formativos", coach: "Solo el de upgrade", coachPro: "Catálogo completo" },
            { feature: "Directos en vivo", coach: "En diferido", coachPro: "En vivo · martes" },
            { feature: "Videoteca", coach: "—", coachPro: "Completa" },
            { feature: "Mails exclusivos", coach: "—", coachPro: "Bandeja completa" },
            { feature: "Historias diarias dentro", coach: "—", coachPro: "Sí" },
            { feature: "Recursos descargables", coach: "Solo básicos", coachPro: "Todos" },
            { feature: "Consultas con el equipo", coach: "2/mes · respuesta 72 h", coachPro: "4/mes · respuesta 24 h" },
            { feature: "WhatsApp grupal", coach: "—", coachPro: "Sí" },
            { feature: "Insignias automáticas", coach: "—", coachPro: "Sí (Cualificado J3)" },
          ],
        },
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
        heading: "82 coaches ya están dentro.",
        sub: "No son testimonios. Son perfiles reales del directorio J3, con su club, sus años de oficio y el escalón en el que están. Un buen modo de medir si esta cohorte es la tuya.",
        ctaLabel: "Ver todos los coaches J3",
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
            a: "Recibes la devolución escrita completa con la rúbrica aplicada y seis meses para volver a presentarte sin coste adicional. El examen no es un peaje, es una mirada.",
          },
          {
            q: "Si me bajo de Plan Coach Pro a Plan Coach, ¿qué conservo?",
            a: "Conservas la insignia Cualificado J3 si ya la habías obtenido. Pierdes el acceso al material de Ruta 2, los directos en vivo y las consultas avanzadas mientras dura la baja. Cuando vuelvas, retomas donde lo dejaste.",
          },
          {
            q: "¿Cómo accedo al Mentor J3?",
            a: "Para coaches externos, una sesión cero obligatoria de 49€ y 30 minutos. Sirve de filtro mínimo y nos permite ver si tiene sentido el acompañamiento. Si contratas un tier, esos 49€ se descuentan.",
          },
          {
            q: "¿Por qué la sesión cero cuesta 49€?",
            a: "Porque el tiempo de Javi y Jorge en pista tiene un techo. Los 49€ filtran a quien viene a hablar en serio y se descuentan si el acompañamiento sigue adelante.",
          },
          {
            q: "¿Y si quiero darme de baja?",
            a: "Te das de baja desde tu panel cuando quieras. Sin permanencia, sin penalización. Mantienes acceso hasta el final del mes pagado.",
          },
          {
            q: "¿Cuánto tarda en llegar la insignia Cualificado tras completar la Ruta 2?",
            a: "Es automática. La emite el sistema cuando completas las dos rutas y superas los tests y el XP requeridos. Cero espera humana. Las otras dos insignias (Certificado y Verificado) sí requieren intervención humana.",
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
        sub: "Suscríbete al método por 19€ al mes. Si después quieres subir a Plan Coach Pro, lo desbloqueas completando la Ruta 1. Si quieres hablarlo antes con uno de los hermanos, reserva la sesión cero.",
        ctaPrimary: "Empezar Plan Coach · 19€/mes",
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
        heading: "De Assistant Coach a Verificado J3",
        sub: "Cuatro pasos, tres insignias acumulativas. El grado va con tu progreso, no con el plan que pagas.",
        grados: {
          assistantCoach: "Assistant Coach",
          coach: "Coach",
          headCoach: "Head Coach",
        },
        insignias: {
          cualificado: "Cualificado J3",
          certificado: "Certificado J3",
          verificado: "Verificado J3",
        },
        unlocks: {
          planCoach: "Plan Coach · 19€/mes",
          planCoachPro: "Plan Coach Pro · 49€/mes",
          examen: "Examen · 490€",
          merito: "Por mérito · gratis",
        },
        hitos: {
          "01": "Completas la Ruta 1 — Fundamentos del oficio",
          "02": "Completas la Ruta 2 — Fundamentos del juego",
          "03": "Pasas las pruebas prácticas",
          "04": "J3 audita tu trabajo real con jugadores reales",
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
          name: "Plan Coach",
          tagline: "Empieza por los fundamentos del oficio",
          description: "Acceso a la Ruta 1 y a la comunidad J3. Llegas hasta Assistant Coach.",
          features: [
            "Ruta 1 — Fundamentos del oficio",
            "Comunidad de coaches J3",
            "Grado Assistant Coach al completar la ruta",
            "Acceso a actualizaciones del método",
          ],
          cta: "Empezar plan Coach",
        },
        coachPro: {
          badge: "RECOMENDADO",
          name: "Plan Coach Pro",
          tagline: "El camino completo hasta Coach con sello Cualificado J3",
          description: "Acceso a las dos rutas y a todo el contenido formativo. El plan que recomendamos por defecto.",
          features: [
            "Todo lo del plan Coach",
            "Ruta 2 — Fundamentos del juego",
            "Grado Coach + insignia Cualificado J3 al terminar la Ruta 2",
            "Acceso prioritario a sesiones en vivo",
            "Requisito para examen de certificación",
          ],
          cta: "Empezar Coach Pro",
        },
      },

      examen: {
        eyebrow: "PASO 2 · CERTIFICACIÓN",
        heading: "Examen de pruebas prácticas",
        sub: "No es ruta. Es un examen evaluado por humanos. Te lleva de Coach a Head Coach con la insignia Certificado J3.",
        plan: {
          name: "Examen de certificación",
          tagline: "Evaluación humana del equipo J3",
          description: "Grabas contenido propio, te grabas entrenando, lo evaluamos en J3 con feedback escrito.",
          priceNote: "Pago único",
          features: [
            "Evaluación humana del equipo J3",
            "Feedback escrito y estructurado",
            "Grado Head Coach + insignia Certificado J3 al aprobar",
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
            "Propuesta del tier que encaja, o redirección honesta",
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
            "12 meses como Head Coach activo",
            "30+ jugadores formados con metodología J3",
            "2 vídeos de sesiones reales auditados por J3",
            "Llamada de evaluación de 45-60 min",
            "Plan Coach Pro activo",
            "2.000 XP histórico + 200 últimos 12 meses",
          ],
          cta: "Ver requisitos completos",
        },
      },

      firstYearMath: {
        eyebrow: "INVERSIÓN AÑO 1",
        heading: "Cuánto te cuesta cada camino",
        sub: "Referencia comercial sobre los caminos típicos. La Verificación no aparece porque es gratuita.",
        rows: {
          base: "Plan Coach anual",
          pro: "Plan Coach Pro anual",
          proExamen: "Coach Pro anual + examen",
          proExamenSprint: "Coach Pro anual + examen + Mentor Sprint",
          proExamenProg: "Coach Pro anual + examen + Mentor Programa",
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
            q: "¿Puedo saltarme el plan base e ir directo al Pro?",
            a: "Sí. El plan Pro te da acceso a las dos rutas. Pero la Ruta 1 es obligatoria antes de la Ruta 2: la lógica es lineal, no se puede saltar.",
          },
        ],
      },

      ctaFinal: {
        eyebrow: "EMPEZAR",
        heading: "El plan que recomendamos por defecto",
        sub: "Plan Coach Pro · 49€/mes o 396€/año (-33%). Las dos rutas, la comunidad, el camino completo.",
        ctaPrimary: "Empezar Coach Pro",
        ctaSecondary: "Ver plan Coach base",
      },
    },
  },
} as const;
