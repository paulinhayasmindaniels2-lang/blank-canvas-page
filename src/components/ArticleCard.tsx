import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { type Article, categories, formatDate } from "@/lib/articles";

type Size = "lg" | "md" | "sm";

export function ArticleCard({ article, size = "md" }: { article: Article; size?: Size }) {
  const cat = categories.find((c) => c.slug === article.category);

  const isLg = size === "lg";
  const isSm = size === "sm";

  return (
    <Link
      to="/artigo/$slug"
      params={{ slug: article.slug }}
      className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:border-ember/60 hover:shadow-[0_0_0_1px_var(--color-ember)] ${
        isLg ? "min-h-[420px]" : isSm ? "min-h-[200px]" : "min-h-[260px]"
      }`}
    >
      {/* Decorative gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 transition-opacity group-hover:opacity-90"
        style={{
          background:
            "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--color-ember) 22%, transparent), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/40 to-transparent"
      />

      <div className="relative flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ember">
            {cat?.name}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
        </div>

        <h3
          className={`font-display uppercase leading-tight text-foreground transition-colors group-hover:text-ember ${
            isLg ? "text-3xl md:text-4xl" : isSm ? "text-base" : "text-xl md:text-2xl"
          }`}
        >
          {article.title}
        </h3>

        {!isSm && (
          <p className="line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
        )}

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{article.author}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {article.readMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
