import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard } from "@/components/ArticleCard";
import { SiteHeader } from "@/components/SiteHeader";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { articles, categories } from "@/lib/articles";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ember.News — Notícias de tecnologia" },
      {
        name: "description",
        content:
          "Cobertura diária de IA, startups, cibersegurança, hardware e software. Notícias de tecnologia com curadoria editorial.",
      },
      { property: "og:title", content: "Ember.News — Notícias de tecnologia" },
      {
        property: "og:description",
        content: "Cobertura diária de IA, startups, cibersegurança, hardware e software.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== featured.slug);
  const secondary = rest.slice(0, 2);
  const tertiary = rest.slice(2, 6);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-12">
        {/* Hero */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="ember-shimmer-text text-xs uppercase tracking-[0.3em]">Em destaque</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <h1 className="sr-only">Notícias de tecnologia</h1>
        </section>

        {/* Vídeo em destaque */}
        <section className="mt-6 flex justify-center">
          <div className="relative w-full max-w-2xl">
            <div className="pointer-events-none absolute -inset-8 -z-10 overflow-hidden rounded-[2rem]">
              <div className="video-aurora absolute inset-0" />
              <div className="video-aurora-2 absolute inset-0" />
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
              <video
                src={estatuaVideo.url}
                controls
                playsInline
                className="aspect-video w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* Bento grid */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-[auto_auto]">
          <div className="md:col-span-2 md:row-span-2">
            <ArticleCard article={featured} size="lg" />
          </div>
          {secondary.map((a, i) => (
            <div key={a.slug}>
              <ArticleCard article={a} size="md" spotlight={i === 0} />
            </div>
          ))}
        </section>

        {/* Categorias */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl uppercase">Categorias</h2>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/categoria/$slug"
                params={{ slug: c.slug }}
                className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-colors hover:border-ember/60"
              >
                <span className="text-sm font-medium">{c.name}</span>
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-ember" />
              </Link>
            ))}
          </div>
        </section>

        {/* Mais recentes */}
        <section className="mt-14">
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl uppercase">Mais recentes</h2>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {articles.length} artigos
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {tertiary.map((a) => (
              <ArticleCard key={a.slug} article={a} size="sm" />
            ))}
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:px-6">
          <span className="font-display uppercase tracking-wider text-foreground">
            Ember<span className="text-red-500">.</span>News
          </span>
          <span>© {new Date().getFullYear().toString()} Ember.News — Tecnologia, sem ruído.</span>
        </div>
      </footer>
    </div>
  );
}
