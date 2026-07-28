import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { type Article, categories, formatDate } from "@/lib/articles";

const MotionLink = motion.create(Link);

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
    <MotionLink
      to="/artigo/$slug"
      params={{ slug: article.slug }}
      whileHover={{ y: -6, rotate: isLg ? 0 : -0.3 }}
      whileTap={{ scale: 0.985 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-xl border bg-card p-5 transition-all will-change-transform ${
        isLg
          ? "min-h-[420px] border-[#EF4444]/40 p-7 shadow-[0_20px_60px_-20px_rgba(239,68,68,0.45)] hover:border-[#DC2626]/70 hover:shadow-[0_30px_80px_-20px_rgba(220,38,38,0.55)] md:min-h-[520px]"
          : isSpot
          ? "min-h-[260px] border-[#EF4444]/50 shadow-[0_12px_40px_-12px_rgba(239,68,68,0.5)] hover:border-[#DC2626]/70 hover:shadow-[0_18px_50px_-12px_rgba(220,38,38,0.6)]"
          : isSm
          ? "min-h-[200px] border-border hover:border-ember/60 hover:shadow-[0_0_0_1px_var(--color-ember)]"
          : "min-h-[260px] border-border hover:border-ember/60 hover:shadow-[0_0_0_1px_var(--color-ember)]"
      }`}
    >
      {/* Shine sweep on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
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
              ? "radial-gradient(120% 90% at 0% 100%, rgba(185,28,28,0.30), transparent 55%), radial-gradient(120% 90% at 100% 0%, rgba(220,38,38,0.25), transparent 55%)"
              : "radial-gradient(120% 80% at 100% 0%, color-mix(in oklab, var(--color-ember) 22%, transparent), transparent 60%)",
        }}
      />
      {isLg && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              "linear-gradient(135deg, rgba(185,28,28,0.0) 0%, rgba(185,28,28,0.0) 60%, rgba(220,38,38,0.08) 100%)",
          }}
        />
      )}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${
          isLg || isSpot ? "from-[#B91C1C] via-[#EF4444] to-[#DC2626]" : "from-transparent via-ember/40 to-transparent"
        }`}
      />

      <div className="relative flex flex-col gap-3">
        {(isLg || isSpot) && (
          <div className="mb-1 flex items-center gap-2">
            <span className="badge-destaque relative inline-flex items-center gap-1.5 overflow-hidden rounded-full bg-gradient-to-r from-[#B91C1C] to-[#DC2626] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_4px_20px_-4px_rgba(239,68,68,0.6)]">
              <span className="inline-block size-1.5 animate-pulse rounded-full bg-white" />
              <span className="relative z-10">Destaque</span>
              <span aria-hidden className="badge-destaque__shine" />
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
    </MotionLink>
  );
}
