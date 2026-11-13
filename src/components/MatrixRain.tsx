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
      "アイウエオカキクケコサシスセソタチツテト0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 15;
    let drops: number[] = [];
    let rafId = 0;
    let lastTime = 0;
    let resizeTimer: number | undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Redimensionar o canvas reinicia o contexto; define a fonte uma única vez aqui.
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      const columns = Math.floor(canvas.width / fontSize);
      drops = Array.from({ length: columns }, () => Math.random() * -50);
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
      ctx.fillStyle = "rgba(2, 12, 7, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // caractere líder mais brilhante
        ctx.fillStyle = "rgba(180, 255, 200, 0.95)";
        ctx.fillText(char, x, y);

        // rastro verde neon
        ctx.fillStyle = "rgba(30, 220, 100, 0.4)";
        ctx.fillText(char, x, y - fontSize);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
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
