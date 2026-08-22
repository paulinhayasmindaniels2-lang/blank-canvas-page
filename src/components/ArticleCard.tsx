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
          ? "min-h-[420px] border-neutral-700/60 p-7 shadow-[0_20px_60px_-20px_rgba(255,255,255,0.08)] hover:border-neutral-500/80 hover:shadow-[0_35px_90px_-20px_rgba(255,255,255,0.12)] md:min-h-[520px]"
          : isSpot
          ? "min-h-[260px] border-neutral-700/70 shadow-[0_12px_40px_-12px_rgba(255,255,255,0.08)] hover:border-neutral-500/80 hover:shadow-[0_22px_60px_-12px_rgba(255,255,255,0.15)]"
          : isSm
          ? "min-h-[200px] border-border hover:border-neutral-600/70 hover:shadow-[0_10px_30px_-10px_rgba(255,255,255,0.08)]"
          : "min-h-[260px] border-border hover:border-neutral-600/70 hover:shadow-[0_14px_40px_-10px_rgba(255,255,255,0.1)]"
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
              ? "radial-gradient(120% 90% at 0% 100%, rgba(64,64,64,0.30), transparent 55%), radial-gradient(120% 90% at 100% 0%, rgba(38,38,38,0.25), transparent 55%)"
              : "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--color-ember) 22%, transparent), transparent 60%)",
        }}
      />
      {isLg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(64,64,64,0.0) 0%, rgba(64,64,64,0.0) 60%, rgba(255,255,255,0.02) 100%)",
          }}
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
          isLg || isSpot ? "from-[#7F1D1D] via-[#DC2626] to-[#991B1B]" : "from-transparent via-red-500/40 to-transparent"
        }`}
      />

      <div className="relative flex flex-col gap-3">
        {(isLg || isSpot) && (
          <div className="mb-1 flex items-center gap-2">
            <span className="badge-destaque relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#991B1B] to-[#DC2626] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_-4px_rgba(220,38,38,0.6)]">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-red-200" />
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
              ? "headline-shimmer text-4xl text-foreground md:text-5xl lg:text-6xl"
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
