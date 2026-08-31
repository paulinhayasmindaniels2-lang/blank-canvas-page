import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { type Article, categories, formatDate } from "@/lib/articles";

type Size = "lg" | "md" | "sm";

export function ArticleCard({
  article,
  size = "md",
  spotlight = false,
}: {
  article: Article;
  size?: Size;
  spotlight?: boolean;
}) {
  const cat = categories.find((c) => c.slug === article.category);

  const isLg = size === "lg";
  const isSm = size === "sm";
  const isSpot = spotlight && !isLg;

  return (
    <Link
      to="/artigo/$slug"
      params={{ slug: article.slug }}
      className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border bg-card p-5 transition-all duration-300 ease-out will-change-transform hover:-translate-y-1.5 ${
        isLg
          ? "min-h-[280px] border-primary/30 p-6 shadow-[0_20px_60px_-20px_rgba(190,90,255,0.25)] hover:border-primary/60 hover:shadow-[0_35px_90px_-20px_rgba(190,90,255,0.35)] md:min-h-[340px]"
          : isSpot
          ? "min-h-[260px] border-primary/25 shadow-[0_12px_40px_-12px_rgba(190,90,255,0.2)] hover:border-primary/55 hover:shadow-[0_22px_60px_-12px_rgba(190,90,255,0.35)]"
          : isSm
          ? "min-h-[200px] border-border hover:border-primary/40 hover:shadow-[0_10px_30px_-10px_rgba(190,90,255,0.2)]"
          : "min-h-[260px] border-border hover:border-primary/40 hover:shadow-[0_14px_40px_-10px_rgba(190,90,255,0.25)]"
      }`}
    >
      {/* Shine sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-full"
      />
      {/* Decorative gradient */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity ${
          isLg || isSpot ? "opacity-100" : "opacity-60 group-hover:opacity-90"
        }`}
        style={{
          background:
            isLg || isSpot
              ? "radial-gradient(120% 90% at 0% 100%, color-mix(in oklab, var(--color-ember) 28%, transparent), transparent 55%), radial-gradient(120% 90% at 100% 0%, color-mix(in oklab, var(--color-ember) 18%, transparent), transparent 55%)"
              : "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--color-ember) 22%, transparent), transparent 60%)",
        }}
      />
      {isLg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(190,90,255,0.0) 0%, rgba(190,90,255,0.0) 60%, rgba(220,170,255,0.05) 100%)",
          }}
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
          isLg || isSpot ? "from-transparent via-primary/60 to-transparent" : "from-transparent via-primary/30 to-transparent"
        }`}
      />

      <div className="relative flex flex-col gap-3">
        {(isLg || isSpot) && (
          <div className="mb-1 flex items-center gap-2">
            <span className="badge-destaque relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_4px_20px_-4px_rgba(190,90,255,0.4)]">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-primary-foreground" />
              <span className="relative z-10">DESTAQUE</span>
              <span aria-hidden className="badge-destaque__shine" />
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-0 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/70">
            {cat?.name}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
        </div>

        <h3
          className={`font-display uppercase leading-tight transition-colors ${
            isLg
              ? "headline-shimmer text-3xl text-foreground md:text-4xl lg:text-5xl"
              : isSm
              ? "text-base text-foreground group-hover:text-ember"
              : "text-xl text-foreground group-hover:text-ember md:text-2xl"
          }`}
        >
          {article.title}
        </h3>

        {!isSm && (
          <p className={`text-muted-foreground ${isLg ? "max-w-2xl text-base line-clamp-3" : "line-clamp-2 text-sm"}`}>
            {article.excerpt}
          </p>
        )}

        <div className={`mt-2 flex items-center justify-between text-muted-foreground ${isLg ? "text-sm" : "text-xs"}`}>
          <span className={isLg ? "font-medium text-foreground" : ""}>{article.author}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className={isLg ? "size-4" : "size-3"} />
            {article.readMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
