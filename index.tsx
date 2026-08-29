import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { LatestTicker } from "@/components/LatestTicker";
import { SiteHeader } from "@/components/SiteHeader";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { articles, categories } from "@/lib/articles";
import { ArrowRight, Play } from "lucide-react";

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div ref={ref} className="aspect-video w-full">
      {visible && play ? (
        <video
          src={src}
          controls
          autoPlay
          playsInline
          preload="metadata"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlay(true)}
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-black"
          aria-label="Reproduzir vídeo"
        >
          <span className="flex size-16 items-center justify-center rounded-full bg-white/10 backdrop-blur transition-transform group-hover:scale-110">
            <Play className="size-7 fill-white text-white" />
          </span>
        </button>
      )}
    </div>
  );
}

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};


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
  const { featured, sidebarList, zigzag, grid } = useMemo(() => {
    const featured = articles.find((a) => a.featured) ?? articles[0];
    const rest = articles.filter((a) => a.slug !== featured.slug);
    return {
      featured,
      sidebarList: rest.slice(0, 5),
      zigzag: rest.slice(5, 9),
      grid: rest.slice(9, 13),
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="sr-only">oi</div>
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-6">
        <h1 className="sr-only">Notícias de tecnologia</h1>

        {/* Hero editorial principal */}
        <section className="flex flex-col gap-6 py-2">
          {/* Trending Bar Topo Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-wrap items-center gap-3 rounded-full border border-border/80 bg-card/60 px-4 py-2 text-xs backdrop-blur-md"
          >
            <span className="flex items-center gap-1.5 font-bold uppercase tracking-widest text-primary">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              Em Alta
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" />
            <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground">#IA Multimodal</span>
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground">#Cibersegurança</span>
              <span className="rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground">#Startups US$ 80M</span>
              <span className="hidden rounded-full bg-secondary/80 px-2.5 py-0.5 text-[11px] font-medium text-foreground md:inline-block">#Chips 3nm</span>
            </div>
          </motion.div>

          {/* Grid Split Hero */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center justify-between">
                <span className="ember-shimmer-text flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em]">
                  <span className="inline-block size-1.5 rounded-full bg-primary" />
                  Manchete do Dia
                </span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">
                  Edição Especial
                </span>
              </div>
              <div className="relative overflow-hidden rounded-xl border border-neutral-700/60 shadow-[0_20px_60px_-20px_rgba(255,255,255,0.08)]">
                <img
                  src="/bird-banner.svg"
                  alt="Ilustração de um pássaro ao entardecer"
                  className="h-48 w-full object-cover md:h-64"
                  loading="lazy"
                />
              </div>
              <ArticleCard article={featured} size="lg" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-2xl border border-border/80 bg-card/40 p-5 backdrop-blur-sm shadow-lg"
            >
              <LatestTicker items={sidebarList} />
            </motion.div>
          </div>
        </section>

        {/* Vídeo em destaque */}
        <motion.section {...fadeUp} className="mt-8 flex justify-center">
          <div className="relative w-full max-w-3xl">
            <div className="pointer-events-none absolute -inset-8 -z-10 overflow-hidden rounded-[2rem]">
              <div className="video-aurora absolute inset-0" />
              <div className="video-aurora-2 absolute inset-0" />
            </div>
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              <LazyVideo src={estatuaVideo.url} />
            </motion.div>
          </div>
        </motion.section>

        {/* Zigzag editorial rows */}
        <section className="mt-8 flex flex-col gap-10">
          <motion.div {...fadeUp} className="flex items-end justify-between">
            <h2 className="font-display text-2xl uppercase">Em pauta</h2>
            <span className="h-px flex-1 mx-6 bg-border" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Leitura longa
            </span>
          </motion.div>
          {zigzag.map((a, i) => (
            <motion.article
              key={a.slug}
              initial={{ opacity: 0, x: i % 2 === 1 ? 40 : -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className={`grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ArticleCard article={a} size="md" spotlight={i === 0} />
              <div className="flex flex-col justify-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-primary">
                  {a.category}
                </span>
                <h3 className="font-display text-2xl leading-tight md:text-3xl">
                  {a.title}
                </h3>
                <p className="text-sm text-muted-foreground">{a.excerpt}</p>
                <Link
                  to="/artigo/$slug"
                  params={{ slug: a.slug }}
                  className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  Ler matéria <ArrowRight className="size-4" />
                </Link>
              </div>
            </motion.article>
          ))}
        </section>

        {/* Categorias */}
        <motion.section {...fadeUp} className="mt-16">
          <h2 className="font-display text-2xl uppercase">Categorias</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((c, i) => (
              <motion.div
                key={c.slug}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Link
                  to="/categoria/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-neutral-500 hover:shadow-lg hover:shadow-white/5"
                >
                  <span className="text-sm font-medium">{c.name}</span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-ember" />
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Grid mais recentes */}
        {grid.length > 0 && (
          <motion.section {...fadeUp} className="mt-16">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl uppercase">Mais recentes</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {articles.length} artigos
              </span>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {grid.map((a, i) => (
                <motion.div
                  key={a.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <ArticleCard article={a} size="sm" />
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </main>


      <footer className="mt-20 border-t border-border/60">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:px-6">
          <span className="font-display uppercase tracking-wider text-foreground">
             Ember<span className="text-white">.\u200b</span>News
          </span>
          <span>© {new Date().getFullYear().toString()} Ember.News — Tecnologia, sem ruído.</span>
        </div>
      </footer>
    </div>
  );
}
