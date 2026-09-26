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

export function ArticleCard(props: ArticleCardProps) {
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
}

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
        "card-hairline group flex h-full flex-col overflow-hidden rounded-[6px] border border-border bg-card transition-shadow hover:shadow-sm",
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
          className={cn(
            "h-48 w-full rounded-[4px] object-cover",
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
        <span className="kicker">{category}</span>

        <h3
          className={cn(
            "headline-serif text-xl leading-snug",
            isHorizontal && "sm:text-2xl"
          )}
        >
          <a
            href={href}
            className="decoration-primary decoration-2 underline-offset-4 hover:underline"
          >
            {title}
          </a>
        </h3>

        <p className="font-sans text-sm leading-relaxed text-muted-foreground">
          {excerpt}
        </p>

        <div className="newspaper-rule mt-1" />

        <p className="byline">
          {author} · {date} · {readTime}
        </p>
      </div>
    </article>
  );
}
