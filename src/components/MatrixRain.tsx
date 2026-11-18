import { useEffect, useRef } from "react";

/**
 * Fundo animado estilo "Matrix digital rain".
 * Renderizado em <canvas>, fixo atrás do conteúdo, com baixa opacidade
 * para não competir com a leitura do site.
 *
 * Otimizações: limita a ~30 fps (independente da taxa do monitor), pausa quando
 * a aba está oculta e aplica debounce no redimensionamento.
 */
const FRAME_INTERVAL_MS = 1000 / 30;
const RESIZE_DEBOUNCE_MS = 150;

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const chars =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 16;
    type Drop = { y: number; speed: number; offset: number };
    let drops: Drop[] = [];
    let rafId = 0;
    let lastTime = 0;
    let resizeTimer: number | undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const makeDrop = (): Drop => ({
      y: Math.random() * -50,
      speed: 0.6 + Math.random() * 0.6,
      offset: Math.random() * chars.length,
    });

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, makeDrop);
    };

    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, RESIZE_DEBOUNCE_MS);
    };

    setup();
    window.addEventListener("resize", onResize);

    if (prefersReducedMotion) {
      return () => {
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
      };
    }

    const draw = () => {
      // Trail fade: semi-transparent overlay creates smooth decay instead of hard clear
      ctx.fillStyle = "rgba(10, 5, 2, 0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i];
        const x = i * fontSize;
        const y = drop.y * fontSize;

        // Pick character using per-drop offset for visual variety
        const charIndex = Math.floor(drop.offset + drop.y * 0.3) % chars.length;
        const char = chars[charIndex < 0 ? 0 : charIndex];

        // Leading character: bright white-amber with subtle glow
        ctx.shadowColor = "rgba(255, 180, 80, 0.7)";
        ctx.shadowBlur = 8;
        ctx.fillStyle = "rgba(255, 235, 180, 0.95)";
        ctx.fillText(char, x, y);

        // Reset shadow for trail characters to avoid cumulative blur cost
        ctx.shadowBlur = 0;

        // First trail: warm amber
        ctx.fillStyle = "rgba(255, 160, 40, 0.45)";
        ctx.fillText(char, x, y - fontSize);

        // Second trail: dimmer for depth gradient
        ctx.fillStyle = "rgba(255, 120, 20, 0.18)";
        ctx.fillText(char, x, y - fontSize * 2);

        // Reset drop when well past viewport bottom; random threshold prevents sync
        if (y > canvas.height + fontSize * 3 && Math.random() > 0.97) {
          drops[i] = makeDrop();
          drops[i].y = Math.random() * -20;
        } else {
          drop.y += drop.speed;
        }
      }
    };

    const loop = (time: number) => {
      rafId = requestAnimationFrame(loop);
      if (time - lastTime < FRAME_INTERVAL_MS) return;
      lastTime = time;
      draw();
    };

    const start = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      cancelAnimationFrame(rafId);
    };

    const onVisibilityChange = () => {
      if (document.hidden) stop();
      else start();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    start();

    return () => {
      stop();
      window.clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-screen w-screen opacity-[0.16] mix-blend-screen"
    />
  );
}
