import * as React from "react";
import { cn } from "@/lib/utils";

export interface LatestTickerItem {
  title: string;
  category: string;
  href?: string;
}

export interface LatestTickerProps {
  items?: LatestTickerItem[];
  title?: string;
  className?: string;
}

const DEFAULT_ITEMS: LatestTickerItem[] = [
  {
    title: "Bancos centrais aceleram debate sobre moedas digitais soberanas",
    category: "Economia",
    href: "#",
  },
  {
    title: "Nova geração de chips promete cortar consumo de energia em data centers",
    category: "Tecnologia",
    href: "#",
  },
  {
    title: "Cidades médias lideram retomada do mercado de trabalho no semestre",
    category: "Negócios",
    href: "#",
  },
  {
    title: "Streaming muda estratégia e aposta em produções locais de longa duração",
    category: "Cultura",
    href: "#",
  },
  {
    title: "Pesquisa aponta mudança no hábito de leitura de notícias entre jovens",
    category: "Sociedade",
    href: "#",
  },
];

export function LatestTicker({
  items = DEFAULT_ITEMS,
  title = "Mais Lidas",
  className,
}: LatestTickerProps) {
  return (
    <aside
      className={cn(
        "card-hairline rounded-[6px] border border-border bg-card p-6",
        className
      )}
      aria-label={title}
    >
      <div className="flex items-baseline justify-between">
        <h2 className="headline-serif text-xl">{title}</h2>
        <span className="kicker">Ranking</span>
      </div>

      <div className="newspaper-rule mt-4" />

      <ol className="flex flex-col">
        {items.map((item, index) => (
          <li key={item.title} className={cn(index !== 0 && "border-t border-border")}>
            <a
              href={item.href ?? "#"}
              className="group flex items-start gap-4 py-4"
            >
              <span
                className="font-display shrink-0 text-3xl font-black leading-none text-primary"
                aria-hidden="true"
              >
                {String(index + 1).padStart(2, "0")}
              </span>

              <span className="flex flex-col gap-1">
                <span className="byline">{item.category}</span>
                <span className="font-display text-base font-semibold leading-snug text-foreground decoration-primary decoration-2 underline-offset-4 group-hover:underline">
                  {item.title}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}
