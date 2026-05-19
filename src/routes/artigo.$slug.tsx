import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { ArticleCard } from "@/components/ArticleCard";
import {
  articles,
  categories,
  formatDate,
  getArticleBySlug,
} from "@/lib/articles";
import { ArrowLeft, Bookmark, Clock, Heart, Share2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/artigo/$slug")({
  loader: ({ params }) => {
    const article = getArticleBySlug(params.slug);
    if (!article) throw notFound();
    return { article };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.article.title} — Ember.News` },
          { name: "description", content: loaderData.article.excerpt },
          { property: "og:title", content: loaderData.article.title },
          { property: "og:description", content: loaderData.article.excerpt },
          { property: "og:type", content: "article" },
        ]
      : [],
  }),
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Artigo não encontrado</h1>
        <Link to="/" className="mt-4 inline-block text-ember underline">
          Voltar para a home
        </Link>
      </div>
    </div>
  ),
});

function ArticlePage() {
  const { article } = Route.useLoaderData();
  const cat = categories.find((c) => c.slug === article.category);
  const related = articles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  // Estado vem de localStorage só no cliente — evita mismatch de hidratação
  useEffect(() => {
    try {
      const likes = JSON.parse(localStorage.getItem("ember:likes") ?? "[]") as string[];
      const saves = JSON.parse(localStorage.getItem("ember:saves") ?? "[]") as string[];
      setLiked(likes.includes(article.slug));
      setSaved(saves.includes(article.slug));
    } catch {
      // ignore
    }
  }, [article.slug]);

  const toggle = (key: "likes" | "saves", value: boolean) => {
    try {
      const k = `ember:${key}`;
      const list = JSON.parse(localStorage.getItem(k) ?? "[]") as string[];
      const next = value ? [...new Set([...list, article.slug])] : list.filter((s) => s !== article.slug);
      localStorage.setItem(k, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Link
          to="/categoria/$slug"
          params={{ slug: article.category }}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-ember"
        >
          <ArrowLeft className="size-4" /> {cat?.name}
        </Link>

        <article className="mt-6">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center rounded-full border border-ember/40 bg-ember/10 px-2.5 py-0.5 font-medium uppercase tracking-wider text-ember">
              {cat?.name}
            </span>
            <span className="text-muted-foreground">{formatDate(article.date)}</span>
            <span className="inline-flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" /> {article.readMinutes} min
            </span>
          </div>

          <h1 className="mt-4 font-display text-4xl uppercase leading-tight md:text-5xl">
            {article.title}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>

          <div className="mt-6 flex items-center justify-between border-y border-border py-4">
            <div className="flex items-center gap-3">
              <div className="grid size-9 place-items-center rounded-full bg-ember/15 text-sm font-medium text-ember">
                {article.author.split(" ").map((n: string) => n[0]).slice(0, 2).join("")}
              </div>
              <div>
                <div className="text-sm font-medium">{article.author}</div>
                <div className="text-xs text-muted-foreground">Redação Ember.News</div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  setLiked((v) => {
                    toggle("likes", !v);
                    return !v;
                  });
                }}
                aria-label="Curtir"
                className={`grid size-9 place-items-center rounded-md border border-border transition-colors hover:border-ember ${
                  liked ? "bg-ember/15 text-ember" : "text-muted-foreground"
                }`}
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  setSaved((v) => {
                    toggle("saves", !v);
                    return !v;
                  });
                }}
                aria-label="Salvar"
                className={`grid size-9 place-items-center rounded-md border border-border transition-colors hover:border-ember ${
                  saved ? "bg-ember/15 text-ember" : "text-muted-foreground"
                }`}
              >
                <Bookmark className={`size-4 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={() => {
                  if (typeof window === "undefined") return;
                  const nav = window.navigator as Navigator & { share?: (data: ShareData) => Promise<void> };
                  if (nav.share) {
                    void nav.share({ title: article.title, url: window.location.href });
                  } else if (nav.clipboard) {
                    void nav.clipboard.writeText(window.location.href);
                  }
                }}
                aria-label="Compartilhar"
                className="grid size-9 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:border-ember"
              >
                <Share2 className="size-4" />
              </button>
            </div>
          </div>

          <div className="prose prose-invert mt-8 max-w-none space-y-5 text-base leading-relaxed text-foreground/90">
            {article.body.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </article>

        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="font-display text-xl uppercase">Relacionados</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} size="sm" />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
