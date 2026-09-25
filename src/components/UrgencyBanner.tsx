import * as React from "react";
import { cn } from "@/lib/utils";

export interface UrgencyBannerProps {
  message?: string;
  className?: string;
}

function getTodayLong() {
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function UrgencyBanner({
  message = "Reportagens verificadas, análises independentes e as manchetes que importam — todos os dias na sua edição.",
  className,
}: UrgencyBannerProps) {
  const [today, setToday] = React.useState("");

  React.useEffect(() => {
    setToday(getTodayLong());
  }, []);

  return (
    <div
      className={cn(
        "w-full border-y border-border/60 bg-foreground text-background",
        className
      )}
      role="note"
      aria-label="Edição de hoje"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-1 px-4 py-3 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-6 sm:text-left">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-background/90" suppressHydrationWarning>
          Edição de hoje · {today}
        </span>
        <span className="newspaper-rule hidden h-4 w-px border-t-0 border-l border-background/20 sm:block" aria-hidden="true" />
        <p className="font-sans text-[0.8rem] leading-snug text-background/80">
          {message}
        </p>
      </div>
    </div>
  );
}
