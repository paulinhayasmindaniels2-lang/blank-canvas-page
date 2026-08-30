import { useEffect, useRef } from "react";

/**
 * Fundo animado estilo "Matrix digital rain".
 * Renderizado em <canvas>, fixo atrás do conteúdo, com baixa opacidade
 * para não competir com a leitura do site.
 */
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
    let columns = 0;
    let drops: number[] = [];

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = new Array(columns).fill(1).map(() => Math.random() * -50);
    };

    setup();
    window.addEventListener("resize", setup);

    if (prefersReducedMotion) {
      return () => window.removeEventListener("resize", setup);
    }

    let frame = 0;
    let rafId: number;

    const draw = () => {
      rafId = requestAnimationFrame(draw);
      frame++;
      // controla a velocidade (desenha a cada 2 frames)
      if (frame % 2 !== 0) return;

      ctx.fillStyle = "rgba(5, 8, 6, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // caractere líder mais brilhante
        ctx.fillStyle = "rgba(120, 255, 170, 0.95)";
        ctx.fillText(char, x, y);

        // rastro esverdeado
        ctx.fillStyle = "rgba(0, 255, 120, 0.35)";
        ctx.fillText(char, x, y - fontSize);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", setup);
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
