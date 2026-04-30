"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import { useLenis } from "lenis/react";

const TOTAL_FRAMES_DESKTOP = 175;
const TOTAL_FRAMES_MOBILE = 169;
const FRAME_DURATION_MS = 33;

/* ───────── J3 BALL + STRIPES + LEGS — paths del logo-gold.svg ───────── */
const J3_BALL_STRIPE_1 =
  "M68.83,30.97c-19.79,1.66-37.93,20.27-39.09,40.06,25.38-.94,49.5,23.19,48.56,48.56,19.79-1.16,38.4-19.3,40.06-39.09-12.75.21-25.57-4.53-35.29-14.25-9.71-9.71-14.45-22.54-14.25-35.29Z";
const J3_BALL_STRIPE_2 =
  "M77.28,30.77c-1.47,21.83,19.47,42.76,41.29,41.29-.69-20.97-20.33-40.6-41.29-41.29Z";
const J3_BALL_STRIPE_3 =
  "M29.75,79.48c1.21,20.15,19.96,38.91,40.12,40.11.75-20.96-19.16-40.87-40.12-40.11Z";
const J3_LEG_LEFT =
  "M24.26,200.51h25.34l9.18-43.08c-8.22-1.53-16.18-4.32-23.59-8.23l-10.93,51.31Z";
const J3_LEG_CENTER =
  "M70.55,158.77l-8.88,41.75h25.33l9.52-44.72c-7.26,2.02-14.8,3.09-22.42,3.09-1.18,0-2.37-.07-3.55-.12Z";
const J3_LEG_RIGHT =
  "M127.02,140.02c-5.36,4.38-11.23,8.04-17.44,10.95l-10.53,49.56,25.35-.02,15.69-73.91c-3.83,4.92-8.2,9.44-13.07,13.42Z";

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const easeOutBack = (t: number) => {
  const c = 1.7;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};

const MANIFESTO_LINE_1 = "Jugamos. Entrenamos. Dirigimos.";
const MANIFESTO_LINE_2 = "Nuestra casa es el 20×10.";

interface StatItem {
  val: number;
  prefix?: string;
  suffix?: string;
  label?: string;
  lbl: string;
}

const STATS_ITEMS: StatItem[] = [
  { val: 20, suffix: "+", lbl: "Años de\nexperiencia" },
  { prefix: "#", val: 1, lbl: "Mejor club\ndel mundo 2018" },
  { val: 100, suffix: "+", lbl: "Coaches formados\nen Coach360" },
  { val: 2000, suffix: "+", lbl: "Jugadores amateur\nformados" },
  { val: 30, suffix: "+", lbl: "Jugadores profesionales\nentrenados" },
  { val: 5, lbl: "Campeones de España\ny del Mundo en formación" },
  { label: "N.º1", val: 0, lbl: "Entrenador español\nen ranking WPT 2022" },
  { val: 11, lbl: "Títulos profesionales\nen 18 finales" },
];

function StatCell({
  stat,
  index,
  progress,
}: {
  stat: StatItem;
  index: number;
  /** statsT 0→1 — el contador cuenta proporcional al scroll */
  progress: number;
}) {
  // Cell visible cuando progress > 0.2 (poco después de que los stats aparezcan).
  const visible = progress > 0.2;
  // Stagger por columna: el counter del primer cell arranca antes que el del último.
  // Cada cell tiene su propia ventana de scroll dentro de la fase stats.
  const cellStart = 0.25 + index * 0.05; // primer cell arranca a 0.25, último a ~0.6
  const cellEnd = Math.min(0.95, cellStart + 0.4);
  const cellProgress = Math.max(
    0,
    Math.min(1, (progress - cellStart) / (cellEnd - cellStart)),
  );
  // Easing cúbico ease-out para que la cuenta termine suave.
  const easedCount = 1 - Math.pow(1 - cellProgress, 3);
  const count = Math.round(stat.val * easedCount);

  return (
    <div
      className="text-center"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(20px) scale(0.97)",
        transition: `all .8s cubic-bezier(.16,1,.3,1) ${index * 0.06}s`,
      }}
    >
      <div className="text-[26px] sm:text-[clamp(32px,3.4vw,52px)] leading-[1] mb-1 sm:mb-2 inline-block">
        {stat.label ? (
          <span className="j3-grad-text font-black">{stat.label}</span>
        ) : (
          <span className="j3-grad-text font-black tabular-nums">
            {stat.prefix ?? ""}
            {count}
            {stat.suffix ?? ""}
          </span>
        )}
      </div>
      <span className="block text-[8px] sm:text-[10px] font-light tracking-[1.5px] sm:tracking-[2px] uppercase leading-[1.4] sm:leading-[1.6] whitespace-pre-line text-[#E8DDD0]/80">
        {stat.lbl}
      </span>
    </div>
  );
}

/**
 * Sección "Journey" pinned: contiene en un solo sticky toda la transición
 * desde la pelota J3 → tunnel → cream → manifiesto → pista creciendo.
 * Mismo patrón que /story (todo sucede en el mismo sticky, sin "saltar"
 * a otra sección).
 *
 * Fases por scroll (medido desde el momento en que el auto-play del logo
 * completa, "releaseScrollY"):
 * - fadeOutT  0→1  en  0     → 0.9vh  (tunnel + cream)
 * - manifT    0→1  en  0.9vh → 1.6vh  (manifiesto display + fade out al final)
 * - courtT    0→1  en  1.6vh → 2.9vh  (pista crece + 6 líneas dibujándose)
 */
export function BridgeAnimation() {
  const lenis = useLenis();
  const lenisRef = useRef<ReturnType<typeof useLenis>>(null);
  const lockScrollYRef = useRef<number | null>(null);
  const autoPlayClampCleanupRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const offscreenRef = useRef<HTMLCanvasElement | null>(null);
  const framesRef = useRef<HTMLImageElement[]>([]);
  const animationRef = useRef<number>(0);
  const startedRef = useRef(false);
  const isMobileRef = useRef(false);
  const holdTRef = useRef(0);
  const releaseScrollYRef = useRef<number | null>(null);
  const manifReleaseScrollYRef = useRef<number | null>(null);
  const manifTriggeredRef = useRef(false);
  const manifAppearOpRef = useRef(0);
  const [manifAppearOp, setManifAppearOp] = useState(0);

  const [flyT, setFlyT] = useState(0);
  const [holdT, setHoldT] = useState(0);
  const [fadeOutT, setFadeOutT] = useState(0);
  const [manifT, setManifT] = useState(0);
  const [courtT, setCourtT] = useState(0);
  const [courtFinaleT, setCourtFinaleT] = useState(0);
  const [statsT, setStatsT] = useState(0);
  const [statsAnimProgress, setStatsAnimProgress] = useState(0);
  const [manifTriggered, setManifTriggered] = useState(false);
  const statsLockedRef = useRef(false);
  const statsLockEndedRef = useRef(false);
  const statsLockEndScrollYRef = useRef<number | null>(null);

  // Sync holdT a ref + capturar releaseScrollY
  useEffect(() => {
    holdTRef.current = holdT;
    if (holdT >= 1 && releaseScrollYRef.current === null) {
      releaseScrollYRef.current = window.scrollY;
    }
  }, [holdT]);

  // Bloquear scroll cuando termina el auto-play se gestiona dentro de
  // startPlayback (lock al arrancar) y holdTick (unlock al completar).
  // Cleanup defensivo si el componente se desmonta a media animación:
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Trigger manifesto reveal una sola vez. Tras ~3.5s captura scrollY como
  // nuevo punto de partida para las siguientes fases. Esos 3.5s incluyen:
  //  - ~1.6s de animación word-by-word
  //  - ~1.9s de pausa de lectura (el manifiesto respira sin que el scroll lo afecte)
  // Gateado por ref para evitar que el cleanup del effect cancele el timeout.
  // Lock scroll cuando los stats empiezan a aparecer. Los counters cuentan
  // vía TIMER (no scroll) para asegurar que se reproduzcan completos. Tras
  // completar + pausa breve, libera el scroll. Post-lock: statsAnimProgress
  // sigue a statsT (para que al scrollear arriba los stats se desvanezcan).
  useEffect(() => {
    if (statsT >= 0.1 && !statsLockedRef.current) {
      statsLockedRef.current = true;
      lenisRef.current?.stop();

      const startTime = performance.now();
      const COUNT_DURATION = 2200;
      const PAUSE_AFTER = 250;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / COUNT_DURATION);
        setStatsAnimProgress(t);
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          window.setTimeout(() => {
            lenisRef.current?.start();
            statsLockEndedRef.current = true;
            // Capturar scrollY al liberar el lock — referencia para
            // fade-in/out limpio cuando el usuario sigue scrolleando.
            statsLockEndScrollYRef.current = window.scrollY;
          }, PAUSE_AFTER);
        }
      };
      requestAnimationFrame(tick);
    }
    // Post-lock: lo calcula el scroll listener directamente — más fiable.
  }, [statsT]);

  useEffect(() => {
    // Trigger cuando el cream ya está casi formado (85%). El fundido + el
    // manifiesto se sienten encadenados pero no superpuestos a la fuerza.
    if (fadeOutT >= 0.85 && !manifTriggeredRef.current) {
      manifTriggeredRef.current = true;
      setManifTriggered(true);
      // CRÍTICO: en el momento del trigger, marcar el manifiesto como visible
      // (manifAppearOp=1). Durante el gate, el scroll listener no actualiza
      // esta variable, así que sin esto el manifiesto sería invisible.
      manifAppearOpRef.current = 1;
      setManifAppearOp(1);
      // BLOQUEAR scroll vía Lenis (sin tocar body.overflow para evitar
      // flicker por scrollbar que aparece/desaparece).
      lenisRef.current?.stop();
      // 2s de pausa: ~1.6s revelación + ~0.4s respiro. Después libera
      // y captura el punto de partida para las fases siguientes.
      window.setTimeout(() => {
        lenisRef.current?.start();
        manifReleaseScrollYRef.current = window.scrollY;
      }, 2000);
    }
  }, [fadeOutT]);

  // Preload frames + actualizar detección móvil ante resize/rotación
  useEffect(() => {
    isMobileRef.current = window.innerWidth < 960;
    const isMobile = isMobileRef.current;
    const totalFrames = isMobile ? TOTAL_FRAMES_MOBILE : TOTAL_FRAMES_DESKTOP;
    const images: HTMLImageElement[] = [];
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      img.src = isMobile
        ? `/videos/frames-mobile/frame_${String(i).padStart(4, "0")}.jpg`
        : `/videos/frames/f${String(i).padStart(3, "0")}.jpg`;
      images.push(img);
    }
    framesRef.current = images;

    // Pintar el PRIMER FRAME en cuanto se carga, así el bridge tiene
    // contenido visible mientras el usuario scrolea hacia la sección
    // (no aparece de golpe). El auto-play sobreescribirá luego.
    const paintFirstFrame = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const firstImg = images[0];
      if (!canvas || !ctx || !firstImg) return;
      if (!firstImg.complete || firstImg.naturalWidth === 0) {
        firstImg.addEventListener("load", paintFirstFrame, { once: true });
        return;
      }
      canvas.width = firstImg.naturalWidth;
      canvas.height = firstImg.naturalHeight;
      // Misma lógica de blend para tener tono champán desde el primer pixel
      if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
      const off = offscreenRef.current;
      if (off.width !== canvas.width) off.width = canvas.width;
      if (off.height !== canvas.height) off.height = canvas.height;
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      offCtx.fillStyle = "#000000";
      offCtx.fillRect(0, 0, off.width, off.height);
      offCtx.globalCompositeOperation = "lighten";
      offCtx.drawImage(firstImg, 0, 0);
      offCtx.globalCompositeOperation = "color";
      offCtx.fillStyle = "#C9A96E";
      offCtx.fillRect(0, 0, off.width, off.height);
      offCtx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#0E1C16";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighten";
      ctx.drawImage(off, 0, 0);
      ctx.globalCompositeOperation = "source-over";
    };
    paintFirstFrame();

    // Resize listener — actualiza isMobileRef si el viewport cruza el breakpoint
    const onResize = () => {
      const wasMobile = isMobileRef.current;
      const nowMobile = window.innerWidth < 960;
      if (wasMobile !== nowMobile) {
        isMobileRef.current = nowMobile;
        // Force re-render — toggle a ref state if necesario.
        // Por ahora basta con que la próxima animación o scroll lo coja.
      }
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Auto-play
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const startPlayback = () => {
      if (startedRef.current) return;
      startedRef.current = true;
      // Snap-scroll a la alineación del bridge. Tras la transición, instala
      // un clamp que solo bloquea scroll-DOWN (forward). Scroll-up sigue libre.
      const sectionEl = sectionRef.current;
      if (sectionEl && lenisRef.current) {
        const rect = sectionEl.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        lenisRef.current.scrollTo(sectionTop, {
          duration: 0.6,
          lock: true,
        });
        window.setTimeout(() => {
          // Capturar la posición de bloqueo tras el snap
          lockScrollYRef.current = window.scrollY;
          const onScroll = () => {
            const lock = lockScrollYRef.current;
            if (lock === null || holdTRef.current >= 1) return;
            // Solo bloquea scroll DOWN (window.scrollY > lock).
            // Scroll UP (window.scrollY < lock) se permite libremente.
            if (window.scrollY > lock + 4) {
              lenisRef.current?.scrollTo(lock, {
                immediate: true,
                force: true,
              });
            }
          };
          window.addEventListener("scroll", onScroll, { passive: true });
          autoPlayClampCleanupRef.current = () => {
            window.removeEventListener("scroll", onScroll);
            lockScrollYRef.current = null;
          };
        }, 700);
      }
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;
      const totalFrames = framesRef.current.length;
      const startTime = performance.now();
      const totalDuration = totalFrames * FRAME_DURATION_MS;
      const holdDuration = 1200;

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const frameIndex = Math.min(
          totalFrames - 1,
          Math.floor(elapsed / FRAME_DURATION_MS),
        );
        const img = framesRef.current[frameIndex];

        if (img && img.complete && img.naturalWidth > 0) {
          if (canvas.width !== img.naturalWidth) canvas.width = img.naturalWidth;
          if (canvas.height !== img.naturalHeight) canvas.height = img.naturalHeight;

          if (!offscreenRef.current) offscreenRef.current = document.createElement("canvas");
          const off = offscreenRef.current;
          if (off.width !== canvas.width) off.width = canvas.width;
          if (off.height !== canvas.height) off.height = canvas.height;
          const offCtx = off.getContext("2d");
          if (!offCtx) return;

          offCtx.globalCompositeOperation = "source-over";
          offCtx.fillStyle = "#000000";
          offCtx.fillRect(0, 0, off.width, off.height);
          offCtx.globalCompositeOperation = "lighten";
          offCtx.drawImage(img, 0, 0);
          offCtx.globalCompositeOperation = "color";
          offCtx.fillStyle = "#C9A96E";
          offCtx.fillRect(0, 0, off.width, off.height);
          offCtx.globalCompositeOperation = "source-over";

          ctx.globalCompositeOperation = "source-over";
          ctx.fillStyle = "#0E1C16";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.globalCompositeOperation = "lighten";
          ctx.drawImage(off, 0, 0);
          ctx.globalCompositeOperation = "source-over";
        }

        const progress = Math.min(1, elapsed / totalDuration);
        setFlyT(progress);

        if (elapsed < totalDuration) {
          animationRef.current = requestAnimationFrame(tick);
        } else {
          const holdStart = now;
          const holdTick = (now2: number) => {
            const heldFor = now2 - holdStart;
            const ht = Math.min(1, heldFor / holdDuration);
            setHoldT(ht);
            if (ht < 1) {
              animationRef.current = requestAnimationFrame(holdTick);
            } else {
              // Logo terminado — libera el clamp para avanzar al tunnel.
              autoPlayClampCleanupRef.current?.();
              autoPlayClampCleanupRef.current = null;
            }
          };
          animationRef.current = requestAnimationFrame(holdTick);
        }
      };
      animationRef.current = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startPlayback();
          io.disconnect();
        }
      },
      {
        // rootMargin "0px 0px -25% 0px" dispara el IO cuando el top de la
        // sección llega al ~75% del viewport (sección está al ~25% dentro).
        // El logo empieza a formarse temprano, mucho antes de la alineación
        // completa — el usuario siente la transición como continua.
        threshold: 0,
        rootMargin: "0px 0px -25% 0px",
      },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Scroll-driven phases
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const vh = window.innerHeight;
      if (holdTRef.current < 1 || releaseScrollYRef.current === null) {
        setFadeOutT(0);
        setManifT(0);
        setCourtT(0);
        setCourtFinaleT(0);
        return;
      }
      const scrollPastUnlock = window.scrollY - releaseScrollYRef.current;
      // Fase tunnel — scroll-driven con suavidad (0.9vh). Da espacio a que
      // el usuario sienta que está scrolleando y la pelota se zoomea
      // gradualmente hacia el cream.
      setFadeOutT(clamp(scrollPastUnlock / (vh * 0.9)));

      // GATE: hasta que la animación de revelación del manifiesto no haya
      // completado, las siguientes fases se quedan en 0. Eso permite que el
      // manifiesto se vea entero antes de empezar a salir.
      if (manifReleaseScrollYRef.current === null) {
        setManifT(0);
        setCourtT(0);
        setCourtFinaleT(0);
        return;
      }

      const scrollPastManif = window.scrollY - manifReleaseScrollYRef.current;
      // manifT: 0→1 sobre 0.7vh post-release (fade-out forward). Más responsive
      // que antes — un scroll moderado tras la pausa colapsa el manifiesto y
      // deja paso a la pista. Si scrollPastManif < 0 (scroll up), queda en 0.
      setManifT(clamp(scrollPastManif / (vh * 0.7)));
      // manifAppearOp: 0→1 sobre los últimos 0.3vh ANTES del release (para fade
      // smooth al hacer scroll up de vuelta hacia el bridge).
      // Cuando scrollPastManif >= 0 → 1. Cuando < -0.3vh → 0.
      const appearOp = clamp((scrollPastManif + vh * 0.3) / (vh * 0.3));
      manifAppearOpRef.current = appearOp;
      setManifAppearOp(appearOp);
      // Fase court (creación): arranca cuando el manifiesto está casi
      // desaparecido. Primero el manifesto se desvanece a un punto, después
      // la pista nace de ese punto y crece.
      setCourtT(clamp((scrollPastManif - vh * 0.55) / (vh * 1.0)));
      // Fase finale: cuando la pista está casi formada del todo
      setCourtFinaleT(clamp((scrollPastManif - vh * 1.55) / (vh * 0.9)));
      // Fase stats: aparecen sobre el verde tras la pista
      setStatsT(clamp((scrollPastManif - vh * 2.45) / (vh * 0.9)));

      // Post-lock stats: si el lock ya completó, statsAnimProgress sigue
      // al scroll directamente para que al subir se desvanezca limpio
      // (sin depender de cambios en statsT, que clampea a 0 y bloquea).
      if (
        statsLockEndedRef.current &&
        statsLockEndScrollYRef.current !== null
      ) {
        const scrollPastLockEnd =
          window.scrollY - statsLockEndScrollYRef.current;
        const postLockOp = clamp((scrollPastLockEnd + vh * 0.5) / (vh * 0.5));
        setStatsAnimProgress(postLockOp);
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ─── Tunnel + flash math ───
  const zoomT = clamp(fadeOutT / 0.7);
  const tunnelScale = 1 + Math.pow(zoomT, 2.5) * 11;
  const motionBlur = Math.pow(zoomT, 3) * 12;
  // Cream entra a partir del 60% del fadeOut, completa al 100%. Curva más
  // suave que da sensación de zoom progresivo antes del fundido.
  const whiteoutOp = clamp((fadeOutT - 0.6) / 0.4);
  const pulseOp =
    fadeOutT > 0 && fadeOutT < 0.2
      ? Math.sin(clamp(fadeOutT / 0.2) * Math.PI) * 0.7
      : 0;
  const vignetteOp = clamp(zoomT * 0.8);

  // ─── Manifesto math ───
  // 0→0.7: visible. 0.7→1.0: el manifiesto COLAPSA hacia un punto central
  // (de donde nace la pista). Compresión acelerada (ease cúbico) + blur leve
  // + opacity que se aguanta hasta el final para que se vea la compresión.
  // Compresión sincronizada con la creación de la pista: arranca en cuanto
  // el usuario scrollea (manifT > 0) — manifesto y court avanzan juntos.
  const manifFadeOut = clamp(manifT);
  const collapseEase = Math.pow(manifFadeOut, 2.5); // 0→1 acelerando
  // Opacity se mantiene visible hasta el 50% del fade, luego cae rápido al
  // final cuando el court ya está formándose claramente.
  const manifFadeAlpha = clamp((manifFadeOut - 0.5) / 0.5);
  const manifBaseOp = manifTriggered
    ? Math.max(0, 1 - manifFadeAlpha) * manifAppearOp
    : 0;
  // Gate adicional: si el cream no es visible, el manifiesto tampoco (evita texto
  // flotando sobre el bridge oscuro durante scroll up).
  const manifVisibilityFactor = clamp(whiteoutOp / 0.4);
  const manifOpacity = manifBaseOp * manifVisibilityFactor;
  const manifBlur = collapseEase * 8; // blur sutil mientras se concentra
  const manifScale = 1 - collapseEase * 0.97; // 1 → 0.03 (casi un punto)

  // ─── Court math ───
  // courtT 0→0.15: línea fina crece en width (parece línea de luz)
  // courtT 0.15→1.0: la pista CRECE continuamente Y las líneas se dibujan en paralelo
  //                  (al estilo /story Phase 8 — todo simultáneo)
  const isMob = isMobileRef.current;
  // Móvil: court portrait. La SVG está rotada 90° vía CSS; usamos un container
  // 1:2 que es lo que el SVG rotado necesita para encajar limpio sin sobrar.
  const courtBoxW = isMob
    ? Math.min((typeof window !== "undefined" ? window.innerWidth : 375) * 0.45, 200)
    : 460;
  const courtBoxH = isMob ? courtBoxW * 2 : courtBoxW * 0.5;

  // Width crece linealmente a lo largo de TODO courtT
  const widthGrow = clamp(courtT);
  // Height empieza después de la línea inicial (courtT > 0.15)
  const heightGrow = clamp((courtT - 0.15) / 0.85);
  // Lines draw progress: empieza cuando el court ya tiene cierto tamaño
  const lineDrawT = clamp((courtT - 0.2) / 0.8);

  // Tamaño base (al final de courtT). Si courtFinaleT > 0, expande a viewport.
  const baseW = courtBoxW * (0.05 + 0.95 * widthGrow);
  const baseH = 2 + (courtBoxH - 2) * heightGrow;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1920;
  const vhSize = typeof window !== "undefined" ? window.innerHeight : 1080;
  const fullW = vw;
  const fullH = isMob ? vw * 2 : vhSize;
  const courtCurrentW = baseW + (fullW - baseW) * courtFinaleT;
  const courtCurrentH = baseH + (fullH - baseH) * courtFinaleT;

  const courtLineDelays = [0.0, 0.08, 0.18, 0.28, 0.4, 0.5];
  const courtLineLengths = [584, 96, 96, 96, 62, 62];
  const courtDrawProgress = (i: number) =>
    clamp((lineDrawT - courtLineDelays[i]) / 0.35);
  // Undraw progress en finale: orden inverso (la última en dibujarse es la primera en borrarse)
  const undrawDelays = [0.5, 0.4, 0.3, 0.2, 0.1, 0.0];
  const undrawProgress = (i: number) =>
    clamp((courtFinaleT - undrawDelays[i]) / 0.35);

  // Cream → dark verde durante el finale (rgb interpolation)
  const tt = clamp(courtFinaleT * 1.5);
  const bgR = Math.round(248 - (248 - 14) * tt);
  const bgG = Math.round(245 - (245 - 28) * tt);
  const bgB = Math.round(239 - (239 - 22) * tt);
  const finaleBg = `rgb(${bgR},${bgG},${bgB})`;

  // ─── SVG overlay logic ───
  const showOverlay = !isMobileRef.current && flyT > 0;
  const BUILD_START = 0.78;
  const BUILD_END = 0.88;
  let buildT = 0;
  if (holdT > 0) buildT = 1;
  else if (flyT > BUILD_START)
    buildT = clamp((flyT - BUILD_START) / (BUILD_END - BUILD_START));
  let legT = 0;
  if (holdT > 0) legT = 1;
  else if (flyT > 0.8) legT = (flyT - 0.8) / 0.2;
  const stripeData = [
    { d: J3_BALL_STRIPE_1, fromX: -50, fromY: -55, delay: 0.4 },
    { d: J3_BALL_STRIPE_2, fromX: 60, fromY: -35, delay: 0.48 },
    { d: J3_BALL_STRIPE_3, fromX: -60, fromY: 50, delay: 0.45 },
  ];
  const legData = [
    { d: J3_LEG_LEFT, fromX: -80, fromY: 0, delay: 0 },
    { d: J3_LEG_CENTER, fromX: 0, fromY: 60, delay: 0.1 },
    { d: J3_LEG_RIGHT, fromX: 80, fromY: 0, delay: 0.18 },
  ];
  const S = 3.31;
  const TX = 957 - 74 * S;
  const TY = 532 - 75 * S;

  const manif1 = MANIFESTO_LINE_1.split(" ");
  const manif2 = MANIFESTO_LINE_2.split(" ");

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[var(--bk)]"
      style={{ minHeight: "600dvh" }}
      data-bridge
    >
      <div className="sticky top-0 h-[100dvh] w-full overflow-hidden flex items-center justify-center">
        {/* CAPA pelota J3 — se zoomea con tunnel y desaparece al pasar a manifiesto */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `scale(${tunnelScale})`,
            filter: motionBlur > 0.1 ? `blur(${motionBlur}px)` : "none",
            willChange: "transform, filter",
            opacity: fadeOutT >= 1 ? 0 : 1,
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full max-h-[100dvh] object-contain"
            style={{ background: "#0E1C16" }}
            aria-hidden
          />
          {showOverlay && (
            <svg
              viewBox="0 0 1920 1080"
              className="absolute inset-0 w-full h-full pointer-events-none"
              preserveAspectRatio="xMidYMid meet"
              style={{ mixBlendMode: "lighten" }}
              aria-hidden
            >
              <defs>
                <clipPath id="bridge-ball-clip">
                  <circle cx="74" cy="75" r="58" />
                </clipPath>
                <filter id="bridge-energy-glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="1.5 0 0 0 0.2  0 1.2 0 0 0.1  0 0 0.5 0 0  0 0 0 1 0" result="glow" />
                  <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="bridge-trail-glow" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
                  <feColorMatrix in="blur" type="matrix" values="2 0 0 0 0.4  0 1.5 0 0 0.3  0 0 0.3 0 0  0 0 0 0.8 0" result="glow" />
                  <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <g transform={`translate(${TX}, ${TY}) scale(${S})`}>
                <g clipPath="url(#bridge-ball-clip)">
                  {stripeData.map(({ d, fromX, fromY, delay }, i) => {
                    const p = clamp((buildT - delay) / 0.45);
                    const e = easeOutBack(p);
                    const dx = fromX * (1 - e);
                    const dy = fromY * (1 - e);
                    if (p <= 0) return null;
                    return (
                      <g key={`s${i}`}>
                        {buildT < 0.98 && (
                          <path d={d} fill="#E8DDD0" filter="url(#bridge-trail-glow)" opacity={clamp(p * 2.5) * (1 - clamp((p - 0.7) / 0.3))} transform={`translate(${dx}, ${dy}) scale(${0.5 + 0.5 * e})`} style={{ transformOrigin: "74px 75px" }} />
                        )}
                        <path d={d} fill="#C9A96E" filter={buildT >= 0.98 ? undefined : "url(#bridge-energy-glow)"} opacity={clamp(p * 3)} transform={`translate(${dx}, ${dy}) scale(${0.5 + 0.5 * e})`} style={{ transformOrigin: "74px 75px" }} />
                      </g>
                    );
                  })}
                </g>
                {legData.map(({ d, fromX, fromY, delay }, i) => {
                  const p = clamp((legT - delay) / 0.55);
                  const e = easeOutBack(p);
                  const dx = fromX * (1 - e);
                  const dy = fromY * (1 - e);
                  if (p <= 0) return null;
                  return (
                    <g key={`l${i}`}>
                      {flyT <= 0.96 && (
                        <path d={d} fill="#E8DDD0" filter="url(#bridge-trail-glow)" opacity={clamp(p * 2.5) * (1 - clamp((p - 0.6) / 0.4))} transform={`translate(${dx}, ${dy})`} />
                      )}
                      <path d={d} fill="#C9A96E" filter={flyT > 0.96 ? undefined : "url(#bridge-energy-glow)"} opacity={clamp(p * 3)} transform={`translate(${dx}, ${dy})`} />
                    </g>
                  );
                })}
              </g>
            </svg>
          )}
        </div>

        {/* Vignettes / pulses durante el tunnel */}
        {vignetteOp > 0.01 && fadeOutT < 1 && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 50% 50% at 50% 50%, transparent 20%, rgba(14,28,22,0.85) 100%)", opacity: vignetteOp }} aria-hidden />
        )}
        {pulseOp > 0.01 && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 50%, rgba(201,169,110,0.6) 0%, rgba(201,169,110,0) 55%)", opacity: pulseOp }} aria-hidden />
        )}
        {fadeOutT < 0.6 && (
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, transparent 50%, rgba(14,28,22,0.55) 100%)", opacity: 1 - clamp(fadeOutT / 0.6) }} aria-hidden />
        )}

        {/* CREMA → dark verde durante el finale.
            Visibilidad acoplada al manifiesto: si el manifiesto está visible
            (incluso durante scroll up), el cream lo respalda. */}
        {(whiteoutOp > 0.01 || manifBaseOp > 0.01) && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: courtFinaleT > 0 ? finaleBg : "#F8F5EF",
              opacity: Math.max(whiteoutOp, manifBaseOp),
            }}
            aria-hidden
          />
        )}

        {/* MANIFIESTO sobre crema — aparece cuando el cream se monta y fade out al pasar a la pista */}
        {manifTriggered && manifOpacity > 0.01 && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center px-6 pointer-events-none"
            style={{
              opacity: manifOpacity,
              filter: manifBlur > 0.1 ? `blur(${manifBlur}px)` : "none",
              transform: `scale(${manifScale})`,
              willChange: "opacity, filter, transform",
            }}
          >
            <div className="text-center max-w-4xl">
              <p className="text-[clamp(22px,2.8vw,38px)] tracking-[0.04em] text-[#6e6e73] font-light leading-[1.6] flex flex-wrap justify-center gap-x-[0.3em]">
                {manif1.map((word, i) => (
                  <span key={`m1-${i}`} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
                    <span className="inline-block" style={{ animation: `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + i * 0.09}s both` }}>
                      {word}
                    </span>
                  </span>
                ))}
              </p>
              <p className="text-[clamp(26px,3.4vw,46px)] tracking-[-0.01em] text-[#1d1d1f] font-bold leading-[1.4] mt-4 flex flex-wrap justify-center gap-x-[0.3em]">
                {manif2.map((word, i) => (
                  <span key={`m2-${i}`} className="inline-block overflow-hidden" style={{ paddingBottom: "0.08em" }}>
                    <span className="inline-block" style={{ animation: `bridgeWordReveal 0.7s cubic-bezier(.16,1,.3,1) ${0.15 + (manif1.length + i) * 0.09 + 0.15}s both` }}>
                      {word}
                    </span>
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* STATS — aparecen tras la fase finale del court, dentro del mismo pin.
            Mientras el scroll está bloqueado durante el lock de stats, statsT
            se queda congelado — usamos el max entre statsT y el timer para
            que la opacity y los counters progresen igual. */}
        {(statsT > 0 || statsAnimProgress > 0) && (() => {
          const effectiveProgress = Math.max(statsT, statsAnimProgress);
          return (
          <div
            className="absolute inset-0 z-40 flex items-center justify-center px-6 sm:px-12 overflow-hidden"
            style={{
              opacity: effectiveProgress,
              pointerEvents: effectiveProgress > 0.5 ? "auto" : "none",
            }}
          >
            {/* Background photo — más presente, no tan apagado */}
            <NextImage
              src="/images/story/hero-coach.jpeg"
              alt=""
              aria-hidden
              fill
              className="object-cover"
              style={{ opacity: 0.65 * effectiveProgress }}
              sizes="100vw"
            />
            {/* Overlay verde sutil para legibilidad sin tapar la foto */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "linear-gradient(180deg, rgba(14,28,22,0.6) 0%, rgba(14,28,22,0.3) 50%, rgba(14,28,22,0.7) 100%)",
              }}
              aria-hidden
            />
            {/* Subtle radial glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(201,169,110,.05) 0%, transparent 70%)",
              }}
              aria-hidden
            />

            <div
              className="relative z-10 max-w-[1100px] mx-auto w-full"
              style={{
                transform: `translateY(${(1 - effectiveProgress) * 40}px)`,
                transition: "transform .3s cubic-bezier(.16,1,.3,1)",
              }}
            >
              {/* Header */}
              <div className="text-center mb-5 sm:mb-10 md:mb-14">
                <span className="text-[8px] sm:text-[10px] font-bold tracking-[3px] sm:tracking-[4px] uppercase text-[var(--g1)]">
                  Nuestra historia en números
                </span>
              </div>

              {/* Row 1 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 sm:gap-y-10 gap-x-3 sm:gap-x-4 max-w-[1000px] mx-auto">
                {STATS_ITEMS.slice(0, 4).map((s, i) => (
                  <StatCell
                    key={i}
                    stat={s}
                    index={i}
                    progress={effectiveProgress}
                  />
                ))}
              </div>

              {/* Divider */}
              <div className="flex items-center justify-center gap-3 my-3 sm:my-6 md:my-10">
                <span className="h-px w-10 bg-[var(--g1)]/20" />
                <span className="w-1 h-1 rounded-full bg-[var(--g1)]/30" />
                <span className="h-px w-10 bg-[var(--g1)]/20" />
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 sm:gap-y-10 gap-x-3 sm:gap-x-4 max-w-[1000px] mx-auto">
                {STATS_ITEMS.slice(4).map((s, i) => (
                  <StatCell
                    key={i}
                    stat={s}
                    index={i + 4}
                    progress={effectiveProgress}
                  />
                ))}
              </div>
            </div>
          </div>
          );
        })()}

        {/* PISTA — aparece como línea fina que crece, igual que /story */}
        {courtT > 0 && (
          <div
            className="absolute z-30 flex items-center justify-center overflow-hidden"
            style={{
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: `${courtCurrentW}px`,
              height: `${courtCurrentH}px`,
              background: "var(--bk)",
            }}
          >
            {heightGrow > 0.05 && (
              <svg
                viewBox="0 0 200 100"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                className="absolute inset-0 w-full h-full max-[960px]:rotate-90"
              >
                {[
                  <rect key="rect" x="2" y="2" width="196" height="96" fill="none" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                  <line key="lc" x1="100" y1="2" x2="100" y2="98" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                  <line key="ll" x1="38" y1="2" x2="38" y2="98" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                  <line key="lr" x1="162" y1="2" x2="162" y2="98" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                  <line key="hl" x1="38" y1="50" x2="100" y2="50" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                  <line key="hr" x1="100" y1="50" x2="162" y2="50" stroke="var(--g1)" strokeWidth={isMob ? 1.5 : 1.2} />,
                ].map((el, i) => {
                  const len = courtLineLengths[i];
                  // En finale, las líneas se "des-dibujan" (dashoffset crece de 0 a len)
                  const dp = courtFinaleT > 0
                    ? Math.max(0, 1 - undrawProgress(i))
                    : courtDrawProgress(i);
                  const dashoffset = len * (1 - dp);
                  return (
                    <g key={i} style={{ strokeDasharray: len, strokeDashoffset: dashoffset }}>
                      {el}
                    </g>
                  );
                })}
              </svg>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
