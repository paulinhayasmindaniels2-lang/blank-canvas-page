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
      className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border bg-card p-5 transition-all ${
        isLg
          ? "min-h-[420px] border-[#C084FC]/40 p-7 shadow-[0_20px_60px_-20px_rgba(192,132,252,0.45)] hover:border-[#EC4899]/70 hover:shadow-[0_30px_80px_-20px_rgba(236,72,153,0.55)] md:min-h-[520px]"
          : isSpot
          ? "min-h-[260px] border-[#C084FC]/50 shadow-[0_12px_40px_-12px_rgba(192,132,252,0.5)] hover:border-[#EC4899]/70 hover:shadow-[0_18px_50px_-12px_rgba(236,72,153,0.6)]"
          : isSm
          ? "min-h-[200px] border-border hover:border-ember/60 hover:shadow-[0_0_0_1px_var(--color-ember)]"
          : "min-h-[260px] border-border hover:border-ember/60 hover:shadow-[0_0_0_1px_var(--color-ember)]"
      }`}
    >
      {/* Decorative gradient */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-0 transition-opacity ${
          isLg || isSpot ? "opacity-100" : "opacity-60 group-hover:opacity-90"
        }`}
        style={{
          background:
            isLg || isSpot
              ? "radial-gradient(120% 90% at 0% 100%, rgba(139,92,246,0.30), transparent 55%), radial-gradient(120% 90% at 100% 0%, rgba(236,72,153,0.25), transparent 55%)"
              : "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--color-ember) 22%, transparent), transparent 60%)",
        }}
      />
      {isLg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(139,92,246,0.0) 0%, rgba(139,92,246,0.0) 60%, rgba(236,72,153,0.08) 100%)",
          }}
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
          isLg || isSpot ? "from-[#8B5CF6] via-[#C084FC] to-[#EC4899]" : "from-transparent via-ember/40 to-transparent"
        }`}
      />

      <div className="relative flex flex-col gap-3">
        {(isLg || isSpot) && (
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_-4px_rgba(192,132,252,0.6)]">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
              Destaque
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ember">
            {cat?.name}
          </span>
          <span className="text-xs text-muted-foreground">{formatDate(article.date)}</span>
        </div>

        <h3
          className={`font-display uppercase leading-tight transition-colors ${
            isLg
              ? "text-4xl text-foreground md:text-5xl lg:text-6xl"
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
