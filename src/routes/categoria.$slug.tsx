import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleCard } from "@/components/ArticleCard";
import { SiteHeader } from "@/components/SiteHeader";
import {
  articlesByCategory,
  getCategoryBySlug,
  type CategorySlug,
} from "@/lib/articles";

export const Route = createFileRoute("/categoria/$slug")({
  loader: ({ params }) => {
    const cat = getCategoryBySlug(params.slug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.category.name} — Ember.News` },
          { name: "description", content: loaderData.category.description },
          { property: "og:title", content: `${loaderData.category.name} — Ember.News` },
          { property: "og:description", content: loaderData.category.description },
        ]
      : [],
  }),
  component: CategoryPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl uppercase">Categoria não encontrada</h1>
      </div>
    </div>
  ),
});

function CategoryPage() {
  const { category } = Route.useLoaderData();
  const list = articlesByCategory(category.slug as CategorySlug);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="flex flex-col gap-3">
          <span className="text-xs uppercase tracking-[0.3em] text-ember">Categoria</span>
          <h1 className="font-display text-4xl uppercase md:text-5xl">{category.name}</h1>
          <p className="max-w-2xl text-muted-foreground">{category.description}</p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 md:mt-12 lg:grid-cols-3">
          {list.length === 0 ? (
            <p className="text-muted-foreground">Nenhum artigo nesta categoria ainda.</p>
          ) : (
            list.map((a) => <ArticleCard key={a.slug} article={a} size="md" />)
          )}
        </div>
      </main>
    </div>
  );
}
