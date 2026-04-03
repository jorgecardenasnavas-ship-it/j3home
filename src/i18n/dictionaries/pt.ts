import type { Dictionary } from "./types";

export const pt = {
  /* ── Shared components ── */

  nav: {
    soluciones: "Premium",
    acceder: "Entrar",
    inicio: "Início",
  },

  footer: {
    copyright: "\u00A9 2026 J3Pádel",
  },

  sponsors: {
    items: [
      { src: "/images/j3/tecnifibre.png", alt: "Tecnifibre", w: 200, h: 52 },
      { src: "/images/j3/lacoste.png", alt: "Lacoste", w: 200, h: 52 },
      { src: "/images/j3/alquilavisual.jpg", alt: "Alquilavisual", w: 200, h: 56 },
    ],
  },

  chat: {
    tooltip: "Fale connosco",
  },

  /* ── Home page ── */

  hero: {
    play: "Play.",
    coach: "Coach.",
    manage: "Manage.",
    milestones: [
      { year: "2004", text: "O caminho começa" },
      { year: "2014", text: "Sede World Padel Tour" },
      { year: "2018", text: "Melhor clube do mundo" },
      { year: "2022", text: "Melhor treinador espanhol no ranking pro" },
      { year: "2024", text: "10.º aniversário de J3" },
      { year: "11\u00D7", text: "Títulos em circuito profissional" },
    ],
    tagline: "Formação campeã de Espanha e do Mundo",
    cta1: "Ver produtos",
    cta2: "Coach360",
    credsMobile: [
      { val: "#1", label: "Melhor clube 2018" },
      { val: "20+", label: "Anos" },
      { val: "WPT", label: "Sede 2014" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", label: "Vitórias pro" },
      { val: "\uD83C\uDFC6", label: "Campeões" },
    ],
  },

  impact: {
    line1: "A academia",
    line2: "de padel #1",
    line3: "na Costa del Sol.",
    tagline: "Desde 2004 · Málaga, Espanha",
  },

  system: {
    blocks: [
      { line1: "O jogo", line2: "mudou." },
      { line1: "O coach", line2: "evoluiu." },
      { line1: "A gestão", line2: "otimizada." },
    ],
    nodes: ["Coach360", "J3PTV", "Academy", "Business", "Experience", "Partner"],
  },

  home: {
    line1: "Um ambiente completo para amadores, jogadores e treinadores exigentes.",
    line2: "Um sistema de gestão integral para academias e clubes de padel.",
    closer: "Otimizar. Automatizar. Escalar.",
  },

  products: {
    cards: [
      {
        tag: "Online · Formação",
        forLabel: "Treinadores de padel",
        description: "Critério, método e comunidade. Conteúdo novo todas as semanas.",
        buttons: ["Ver mais", "Aderir"],
      },
      {
        tag: "Online · Conteúdo · Entretenimento",
        forLabel: "Todos os perfis",
        description: "Análise, debate e o jogo moderno sem ruído.",
        buttons: ["Ver mais", "Entrar"],
      },
      {
        tag: "Headquarters · Stages · Camps",
        forLabel: "Kids · Amateur · Next Gen",
        description: "O mesmo sistema do circuito profissional, adaptado a si.",
        buttons: ["Treine connosco"],
      },
      {
        tag: "Automatização · Gestão · Otimização",
        forLabel: "Academias e clubes",
        description: "Aumente o rendimento com o nosso know-how e acompanhamento 1:1.",
        buttons: ["Saber mais", "Agendar chamada"],
      },
      {
        tag: "Serviço · Presencial",
        forLabel: "Clubes, academias e grupos",
        buttons: ["Solicitar"],
      },
      {
        tag: "Expansão · Chave na mão",
        forLabel: "Clubes e academias",
        buttons: ["Saber mais"],
      },
    ],
  },

  nosotros: {
    label: "Quem somos",
    heading1: "Mais de 20 anos",
    heading2: "dentro do padel.",
    body: "Começámos quando o padel era outro desporto. Formámos jogadores que hoje estão no circuito, gerimos o melhor clube do mundo e treinámos profissionais do WPT. É isso que está por trás.",
    link: "Conheça a nossa trajetória",
    stats: [
      { val: "#1", line1: "Melhor clube /", line2: "do mundo 2018" },
      { val: "20+", line1: "Anos no /", line2: "setor" },
      { val: "\uD83C\uDFC6", line1: "Campeões /", line2: "Espanha e Mundo" },
      { val: "\uD83E\uDD47\u0031\u0031\u00B7\uD83E\uDD48\u0037", line1: "Circuito /", line2: "profissional" },
    ],
  },

  contacto: {
    label: "Contacto",
    heading1: "Conte-nos",
    heading2: "o que procura.",
    body: "Se chegou até aqui, algo lhe despertou interesse. Conte-nos onde está e o que procura.",
    email: "Email",
    telefono: "Telefone",
    sede: "Sede",
    placeholders: {
      nombre: "Nome",
      email: "Email",
      mensaje: "Mensagem",
    },
    soyOptions: [
      "Sou...",
      "Treinador / Coach",
      "Jogador amador",
      "Aficionado de padel",
      "Diretor de academia / clube",
      "Interessado em franquia",
      "Outro",
    ],
    interesOptions: [
      "Tenho interesse em...",
      "Coach360 · Formação",
      "J3PTV · Conteúdo",
      "Academy · Treinar em Málaga",
      "Franquia · Sistema chave na mão",
      "J3 Experience · Venham ao meu clube",
      "Outra coisa",
    ],
    submit: "Enviar",
    sending: "A enviar...",
    sent: "\u2713 Enviado",
    error: "Por favor, preencha nome, email e mensagem.",
  },

  /* ── Story page ── */

  story: {
    hero: {
      prefix: "Mais de",
      years: "20 anos",
      dentro: "dentro",
      delJuego: "do jogo.",
      sub1: "Uma das equipas mais",
      sub2: "influentes",
      sub3: "no mundo do padel.",
      desde: "Desde 2004",
      location: "Málaga, Espanha",
    },

    impact: {
      line1: "Apontamos ao céu, mas",
      line2: "sempre com os pés na terra.",
      fact1: "Treinámos jogadores no top 8 do circuito profissional.",
      fact2: "Dez anos à frente de um dos melhores clubes do mundo.",
      closer: "E continuamos em campo.",
      proudLabel: "Do que mais nos orgulhamos",
      cantera: [
        "Formámos e acompanhámos dezenas de menores.",
        "Alguns conseguiram ser campeões de Espanha ou do mundo.",
        "Outros chegaram a competir no circuito profissional.",
        "E muitos acederam à universidade que escolheram",
        "por serem considerados desportistas de alto rendimento pelo CSD.",
      ],
      historyLabel: "A nossa história",
    },

    stats: {
      header: "A nossa história em números",
      items: [
        { val: 20, suffix: "+", lbl: "Anos no\nsetor" },
        { prefix: "#", val: 1, lbl: "Melhor clube\ndo mundo 2018" },
        { val: 11, lbl: "Títulos profissionais\nem 18 finais disputadas" },
        { val: 100, suffix: "+", lbl: "Coaches formados\nem Coach360" },
        { label: "WPT", val: 0, lbl: "Sede oficial\nMálaga 2014" },
      ],
    },

    timeline: {
      sectionLabel: "Trajetória",
      heading1: "Marcos que",
      heading2: "nos definem",
      eras: ["Os inícios", "Ocean Padel · J3Padel", "Reserva del Higuerón", "Mudança de jogo"],
      entries: [
        {
          year: "Início dos anos 2000",
          title: "O padel encontra-nos",
          desc: "Descobrimos o padel como amadores. O que começa como um desporto transforma-se rapidamente em obsessão. Anos a competir por toda a Andaluzia, presença assídua na seleção malaguenha e representando a Universidade de Málaga (UMA).",
        },
        {
          year: "2005-2008",
          title: "As primeiras aulas",
          desc: "Enquanto continuamos a competir, começamos a dar aulas em paralelo. La Capellanía e o Club de Tenis Málaga são os primeiros locais onde começámos a ensinar o que o jogo nos tinha ensinado.",
        },
        {
          year: "2009-2010",
          title: "Smash Padel \u2192 Ocean Padel",
          desc: "Juntamo-nos pela primeira vez os três — Javi, Jorge e Jordi Muñoz — para montar uma academia de menores no Smash Padel. Pouco depois transforma-se em Ocean Padel, e começa a escala real.",
          highlight: true,
        },
        {
          year: "2010-2014",
          title: "A melhor academia de menores de Espanha",
          desc: "Ocean Padel torna-se referência nacional. Aqui formam-se Álex Ruiz, Momo González, Guille Collado, Bea González e toda a primeira geração. Vários chegam à seleção espanhola e competem internacionalmente.",
          badge: "Campeões Andaluzia · Espanha · Mundo (menores)",
        },
        {
          year: "2014",
          title: "Nasce J3Padel",
          desc: "Quando fecha Ocean Padel, a equipa divide-se mas a marca J3 nasce como entidade própria. Organizamos o WPT de Málaga com quase 300 pares inscritos.",
          badge: "World Padel Tour · Sede oficial Málaga 2014",
        },
        {
          year: "2015",
          title: "J3Padel Indoor",
          desc: "Nas mesmas instalações de Ocean Padel abrimos um clube próprio. Um projeto que não prosperou, mas que deixou uma lição clara sobre gestão.",
        },
        {
          year: "2016",
          title: "Higuerón Resort",
          desc: "Incorporamo-nos na Reserva del Higuerón — hoje Higuerón Resort. Começa o ciclo mais longo e mais exigente do projeto. Jordi Muñoz abandona Málaga e o projeto J3 por motivos pessoais. A sua essência continua presente.",
        },
        {
          year: "2018",
          title: "Melhor Clube de Padel do Mundo",
          desc: "Higuerón Resort, sob a nossa gestão, é reconhecido como o melhor clube de padel do mundo. Um título que chega depois de dois anos de trabalho silencioso e ambicioso.",
          badge: "#1 Best Padel Club in the World · 2018",
          highlight: true,
        },
        {
          year: "2016-2022",
          title: "Escola de competição · Internacionalização",
          desc: "Durante seis anos, o foco está na formação de base e na internacionalização. O que já fizemos em Ocean Padel, replicámo-lo de novo. Além disso, conseguimos que a Costa del Sol se tornasse num destino internacional de jogadores amadores.",
        },
        {
          year: "2021",
          title: "Álex Ruiz e Franco Stupaczuk",
          desc: "Voltamos ao alto rendimento. O resultado é histórico: terminamos o ano no top 4 do mundo no WPT.",
          badge: "Top 4 Mundial WPT · 2021",
          highlight: true,
        },
        {
          year: "2022-2023",
          title: "Álex Ruiz e Momo González",
          desc: "Dupla 100% malaguenha e formada em Ocean Padel / J3. Alcançam o top 5 do mundo. Final do WPT em Marbella — em casa.",
          badge: "Top 5 Mundial · Final WPT Marbella",
        },
        {
          year: "2023-2024",
          title: "Varlion",
          desc: "Javi entra na Varlion como responsável de expansão da marca. Etapa de aprendizagem estratégica fora do campo.",
        },
        {
          year: "2024",
          title: "Fim de um ciclo",
          desc: "Desvinculamo-nos do Higuerón Resort e da Varlion. Quase uma década a gerir o que foi o melhor clube do mundo. Esse ciclo fecha-se.",
        },
        {
          year: "2024-2025",
          title: "De Málaga para o mundo",
          desc: "Dedicados em exclusivo a construir J3Padel como ecossistema: formação, gestão, conteúdo e alto rendimento.",
        },
        {
          year: "Meados de 2025",
          title: "Nasce Coach360",
          desc: "Formação online para treinadores de padel. Após viajar pelo mundo inteiro e constatar o vazio que a expansão do padel tinha gerado no âmbito formativo, decidimos partilhar todo o nosso conhecimento de forma única. Criámos a primeira comunidade de treinadores.",
          badge: "Coach360 · 100+ coaches · 40+ lições",
        },
        {
          year: "2026",
          title: "Nova sede · Málaga capital",
          desc: "J3Padel volta a ter sede física — Finura Padel e Vals Los Limoneros. O ecossistema completo: Coach360, J3PTV, Academy, Business e Experience.",
          badge: "Finura Padel · Vals Los Limoneros · Verão 2026",
        },
      ],
    },

    team: {
      label: "A equipa",
      heading1: "Duas pessoas.",
      heading2: "Um mesmo critério.",
      members: [
        {
          num: "01",
          role: "Co-founder · CEO",
          first: "Javi",
          last: "Cárdenas",
          bio: "Jogador, treinador, executor. Cresce no campo e continua a treinar, mas com um dom natural para transformar ideias em estrutura. Organiza o WPT Málaga com quase 300 pares, gere o Higuerón até o converter no melhor clube do mundo e hoje lidera a operação de todo o ecossistema J3.",
          quote: "Sem execução, a visão fica em conversa.",
        },
        {
          num: "02",
          role: "Co-founder · CSO",
          first: "Jorge",
          last: "Cárdenas",
          bio: "Jogador, treinador, estratega. Sempre com a visão no que está por vir. Define a metodologia J3 a partir do campo, forma dezenas de menores que chegam ao mais alto e leva jogadores ao top 5 mundial. Hoje desenha o rumo de J3Padel.",
          quote: "Ver o jogo antes de acontecer. Isso é treinar.",
        },
      ],
    },

    players: {
      label: "Jogadores",
      heading1: "Formados com",
      heading2: "o sistema J3.",
      description: "Dois tipos de relação. Os que formámos desde a base — hoje no circuito profissional. E os que contaram com J3 para preparação de alto nível.",
      heroLabel: "Formados desde a base · O mais alto do circuito",
      nextGenLabel: "Da formação ao circuito profissional",
      nextGenProLabel: "Chegaram como promessa · Consolidados no circuito",
      featuredLabel: "Colaborações profissionais de destaque",
      sharedLabel: "Também partilharam equipa com J3",
    },

    philosophy: {
      label: "Filosofia",
      word1: "Critério.",
      word2: "Método.",
      word3: "Sistema.",
      body: "Não treinamos com exercícios soltos. Não gerimos por intuição. Tudo o que fazemos em J3Padel responde a um sistema construído ao longo de 20 anos.",
      pillars: [
        {
          num: "01",
          label: "Critério",
          title: "Saber porquê, não apenas o quê",
          body: "Um treinador com critério não executa exercícios — toma decisões.",
        },
        {
          num: "02",
          label: "Método",
          title: "Repetibilidade e progressão",
          body: "O método J3 foi desenhado para produzir melhoria sistemática. Sem método, o talento não escala.",
        },
        {
          num: "03",
          label: "Sistema",
          title: "Estrutura que funciona sozinha",
          body: "Um bom sistema trabalha quando não estás presente. Construímo-lo para clubes, academias e treinadores.",
        },
        {
          num: "04",
          label: "Campo",
          title: "Tudo parte do jogo real",
          body: "Cada conceito do sistema J3 passou pelo campo — com jogadores reais, em competição real.",
        },
      ],
    },

    clubs: {
      label: "Gestão de clubes",
      heading1: "Clubes onde",
      heading2: "deixámos marca.",
      description: "Direção técnica, gestão operacional e desenvolvimento de formação.",
      originLabel: "Onde tudo começou",
      presentLabel: "Na atualidade",
      lessonAside: "Um projeto que não prosperou, mas deixou uma lição clara.",
      origins: [
        {
          flag: "Málaga · 2009–2014",
          name: "Ocean Padel",
          detail: "Onde tudo começou à escala real. A melhor academia de menores de Espanha. Aqui formaram-se Álex Ruiz, Momo González, Guille Collado e toda a primeira geração J3.",
          highlight: "Melhor academia de menores",
        },
        {
          flag: "Málaga · 2014",
          name: "Belife",
          detail: "Sede oficial do World Padel Tour. Cerca de 300 pares inscritos.",
          highlight: "WPT · Sede oficial 2014",
        },
      ],
      heroClub: {
        flag: "Marbella · 2016–2024",
        name: "Reserva del Higuerón",
        detail: "Quase uma década a gerir o clube reconhecido como o melhor do mundo. Direção técnica completa, formação de elite e operação em grande escala.",
        highlight: "Best Padel Club in the World · 2018",
        years: "9",
      },
      lesson: {
        flag: "Málaga · 2015",
        name: "J3Padel Indoor",
      },
      present: [
        {
          flag: "Málaga capital · 2026",
          name: "Finura Padel",
          detail: "Primeira sede da nova etapa em Málaga capital.",
          highlight: "Sede atual · Operacional",
        },
        {
          flag: "Puerto de la Torre · 2026",
          name: "Vals Los Limoneros",
          detail: "Nova instalação. Clube de nova abertura.",
          highlight: "Próxima abertura · Verão 2026",
        },
      ],
    },

    brands: {
      currentLabel: "Marcas que confiam em J3Padel",
      pastLabel: "Confiaram em J3Padel",
    },

    cta: {
      label: "20 anos depois",
      heading1: "Até aqui,",
      heading2: "tudo é história.",
      body: "O que vem a seguir escreve-se com as pessoas que decidirem fazer parte. Se é treinador, tem um clube ou simplesmente quer treinar connosco — este é o momento.",
      buttons: ["Fale connosco", "Coach360", "Academy", "Business"],
    },
  },
} as const satisfies Dictionary;

export default pt;
