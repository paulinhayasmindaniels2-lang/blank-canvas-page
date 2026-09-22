import { useEffect, useState, useCallback } from "react";
import { Flame, X } from "lucide-react";

const CYCLE_SECONDS = 2 * 60 * 60; // 2h simulated countdown, loops forever

function formatUnit(value: number): string {
  return value.toString().padStart(2, "0");
}

export default function UrgencyBanner() {
  const [secondsLeft, setSecondsLeft] = useState(CYCLE_SECONDS);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? CYCLE_SECONDS : prev - 1));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [dismissed]);

  const handleCta = useCallback(() => {
    const target = document.getElementById("planos");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (dismissed) return null;

  const hours = Math.floor(secondsLeft / 3600);
  const minutes = Math.floor((secondsLeft % 3600) / 60);
  const seconds = secondsLeft % 60;

  return (
    <div
      role="alert"
      className="urgency-bar urgency-pulse sticky top-0 z-50 w-full"
    >
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2 px-3 py-2 text-center sm:gap-3 sm:px-6">
        <Flame className="h-4 w-4 shrink-0 animate-pulse sm:h-5 sm:w-5" aria-hidden="true" />
        <span className="text-[11px] font-bold uppercase tracking-wide sm:text-xs md:text-sm">
          Oferta de lançamento expira em
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-[3px] border border-current/30 bg-black/20 px-2 py-0.5 font-mono text-xs font-extrabold tabular-nums sm:text-sm"
          aria-label={`Tempo restante ${hours} horas ${minutes} minutos ${seconds} segundos`}
        >
          <span>{formatUnit(hours)}</span>
          <span aria-hidden="true">:</span>
          <span>{formatUnit(minutes)}</span>
          <span aria-hidden="true">:</span>
          <span>{formatUnit(seconds)}</span>
        </span>
        <button
          type="button"
          onClick={handleCta}
          className="ml-1 shrink-0 rounded-[3px] bg-black/25 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide underline decoration-2 underline-offset-2 transition-colors hover:bg-black/40 sm:text-xs"
        >
          Garantir agora
        </button>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Fechar aviso de oferta"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[3px] p-1 text-current/80 transition-colors hover:bg-black/20 hover:text-current sm:right-4"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
