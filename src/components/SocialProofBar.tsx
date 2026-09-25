import * as React from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SocialProofBarProps {
  headlines?: string[];
  className?: string;
}

const DEFAULT_HEADLINES: string[] = [
  "Congresso aprova novo marco regulatório para inteligência artificial",
  "Inflação desacelera pelo terceiro mês consecutivo, aponta instituto",
  "Setor de energia renovável atrai maior volume de investimentos da década",
  "Seleção define escalação para amistoso decisivo nesta semana",
  "Bolsas fecham em alta após sinalização de corte de juros",
];

export function SocialProofBar({
  headlines = DEFAULT_HEADLINES,
  className,
}: SocialProofBarProps) {
  const track = [...headlines, ...headlines];

  return (
    <div
      className={cn(
        "w-full border-b border-border bg-primary text-primary-foreground",
        className
      )}
      role="region"
      aria-label="Última hora"
    >
      <div className="mx-auto flex max-w-6xl items-stretch">
        <div className="flex shrink-0 items-center gap-2 border-r border-primary-foreground/25 bg-primary px-3 py-2 sm:px-4">
          <Zap className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="whitespace-nowrap text-[0.7rem] font-bold uppercase tracking-[0.14em]">
            Última hora
          </span>
        </div>

        <div className="relative flex-1 overflow-hidden py-2">
          <div
            className="ticker-track flex w-max items-center gap-10 whitespace-nowrap pr-10 text-[0.78rem] font-medium motion-reduce:animate-none"
            style={{ animation: "ticker-scroll 32s linear infinite" }}
          >
            {track.map((headline, index) => (
              <span key={`${headline}-${index}`} className="flex items-center gap-10">
                <span>{headline}</span>
                <span className="text-primary-foreground/50" aria-hidden="true">
                  •
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
