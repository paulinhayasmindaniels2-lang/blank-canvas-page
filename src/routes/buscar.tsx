import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { SiteHeader } from "@/components/SiteHeader";
import { ArticleCard } from "@/components/ArticleCard";
import { searchArticles } from "@/lib/articles";

const searchSchema = z.object({ q: z.string().optional().default("") });

export const Route = createFileRoute("/buscar")({
  validateSearch: (input) => searchSchema.parse(input),
  head: () => ({
    meta: [
      { title: "Buscar — Ember.News" },
      { name: "description", content: "Encontre artigos por palavra-chave." },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const results = q ? searchArticles(q) : [];

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <span className="text-xs uppercase tracking-[0.3em] text-ember">Busca</span>
        <h1 className="mt-2 font-display text-4xl uppercase">
          {q ? <>Resultados para "{q}"</> : "Buscar artigos"}
        </h1>
        <p className="mt-2 max-w-prose text-muted-foreground">
          {q
            ? `${results.length} artigo${results.length === 1 ? "" : "s"} encontrado${
                results.length === 1 ? "" : "s"
              }.`
            : "Use a barra de busca no topo para encontrar artigos por palavras-chave."}
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {results.map((a) => (
            <ArticleCard key={a.slug} article={a} size="md" />
          ))}
        </div>
      </main>
    </div>
  );
}
