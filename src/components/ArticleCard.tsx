import * as React from "react";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/articles";

export interface ArticleCardProps {
  article?: Article;
  size?: string;
  image?: string;
  category?: string;
  title?: string;
  excerpt?: string;
  author?: string;
  date?: string;
  readTime?: string;
  href?: string;
  /** "default" for grid cards, "horizontal" for zigzag/featured rows */
  variant?: "default" | "horizontal";
  className?: string;
}

export const ArticleCard = React.memo(function ArticleCard(props: ArticleCardProps) {
  const a = props.article;
  return (
    <ArticleCardView
      {...props}
      image={props.image ?? a?.image}
      category={props.category ?? a?.category ?? ""}
      title={props.title ?? a?.title ?? ""}
      excerpt={props.excerpt ?? a?.excerpt ?? ""}
      author={props.author ?? a?.author ?? ""}
      date={props.date ?? a?.date ?? ""}
      readTime={props.readTime ?? (a ? `${a.readMinutes} min` : "")}
      href={props.href ?? (a ? `/artigo/${a.slug}` : undefined)}
    />
  );
});

function ArticleCardView({
  image,
  category,
  title,
  excerpt,
  author,
  date,
  readTime,
  href = "#",
  variant = "default",
  className,
}: ArticleCardProps) {
  const isHorizontal = variant === "horizontal";

  return (
    <article
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5",
        isHorizontal && "sm:flex-row",
        className
      )}
    >
      <a
        href={href}
        className={cn(
          "block overflow-hidden bg-muted",
          isHorizontal ? "sm:w-2/5" : "w-full"
        )}
      >
        <img
          src={image}
          alt={title}
          loading="lazy"
          decoding="async"
          className={cn(
            "h-52 w-full object-cover transition-transform duration-500 group-hover:scale-105",
            isHorizontal && "sm:h-full"
          )}
        />
      </a>

      <div
        className={cn(
          "flex flex-1 flex-col gap-3 p-5",
          isHorizontal && "sm:justify-center sm:p-6"
        )}
      >
        <span className="kicker text-[10px]">{category}</span>

        <h3
          className={cn(
            "headline-serif text-lg leading-snug transition-colors group-hover:text-primary",
            isHorizontal && "sm:text-xl"
          )}
        >
          <a href={href} className="hover:underline decoration-primary/40 underline-offset-4">
            {title}
          </a>
        </h3>

        {excerpt && (
          <p className="line-clamp-2 font-sans text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        )}

        <div className="mt-auto pt-3">
          <div className="newspaper-rule mb-3" />
          <p className="byline text-[11px]">
            {author} · {date} · {readTime}
          </p>
        </div>
      </div>
    </article>
  );
}