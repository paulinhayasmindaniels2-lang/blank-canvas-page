import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { LatestTicker } from "@/components/LatestTicker";
import { SiteHeader } from "@/components/SiteHeader";
import { MatrixRain } from "@/components/MatrixRain";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { articles, categories } from "@/lib/articles";
import { ArrowRight, Play, Twitter, Linkedin, Instagram, ArrowUpRight, Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Leitor",
    price: "Grátis",
    period: "",
    description: "Para acompanhar o essencial da tecnologia.",
    features: [
      "Acesso a todas as matérias",
      "Newsletter semanal",
      "Busca ilimitada",
    ],
    highlighted: false,
    cta: "Começar agora",
  },
  {
    name: "Assinante",
    price: "R$ 19",
    period: "/mês",
    description: "Para quem quer profundidade e antecipação.",
    features: [
      "Tudo do plano Leitor",
      "Reportagens exclusivas",
      "Sem anúncios",
      "Newsletter diária",
      "Acesso antecipado a pautas",
    ],
    highlighted: true,
    cta: "Assinar agora",
  },
  {
    name: "Empresa",
    price: "R$ 89",
    period: "/mês",
    description: "Para times que acompanham o mercado de perto.",
    features: [
      "Tudo do plano Assinante",
      "Até 10 usuários",
      "Relatórios setoriais",
      "Suporte prioritário",
    ],
    highlighted: false,
    cta: "Falar com vendas",
  },
];

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
    <div className="relative min-h-screen bg-background">
      <MatrixRain />
      <div className="sr-only">oi</div>
      <div className="relative z-10">
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 lg:px-8 lg:py-12">
        <h1 className="sr-only">Notícias de tecnologia</h1>

        {/* Hero editorial principal */}
        <section className="flex flex-col gap-6">
          {/* Banner principal no topo da hero */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-2xl border border-border/80 shadow-lg"
          >
            <img
              src="/breaking-news-banner.jpg"
              alt="Banner de notícias de última hora"
              className="h-40 w-full object-cover md:h-56 lg:h-64"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/80 via-background/0 to-transparent"
            />
          </motion.div>

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
        <motion.section {...fadeUp} className="mt-16 flex justify-center md:mt-24">
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
        <section className="mt-16 flex flex-col gap-10 md:mt-24">
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
        <motion.section {...fadeUp} className="mt-16 md:mt-24">
          <h2 className="font-display text-2xl uppercase">Categorias</h2>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
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

        {/* Tabela de preços */}
        <motion.section {...fadeUp} className="mt-16 md:mt-24">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-display text-2xl uppercase">Planos</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Escolha o plano ideal para acompanhar o que importa em tecnologia.
            </p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative flex flex-col gap-6 rounded-2xl border p-6 ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-xl shadow-primary/10 md:-translate-y-2"
                    : "border-border bg-card/40"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                    Mais popular
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </span>
                  <div className="flex items-end gap-1">
                    <span className="font-display text-3xl">{plan.price}</span>
                    {plan.period && (
                      <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <ul className="flex flex-1 flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`w-full rounded-lg py-2.5 text-sm font-semibold transition-all focus-visible:outline-none ${
                    plan.highlighted
                      ? "btn-neon-subscribe text-primary-foreground"
                      : "border border-border bg-transparent text-foreground transition-colors duration-200 hover:border-primary/60 hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Grid mais recentes */}
        {grid.length > 0 && (
          <motion.section {...fadeUp} className="mt-16 md:mt-24">
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl uppercase">Mais recentes</h2>
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                {articles.length} artigos
              </span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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


      <footer className="relative mt-16 overflow-hidden border-t border-border/60 bg-card/40 md:mt-24 lg:mt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ember/50 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-96 -translate-x-1/2 rounded-full bg-ember/10 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20 lg:px-8">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            {/* Marca */}
            <div className="flex flex-col gap-4">
              <span className="font-display text-xl uppercase tracking-wider text-foreground">
                Ember<span className="text-ember">.</span>News
              </span>
              <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                Cobertura diária de IA, startups, cibersegurança, hardware e software — jornalismo de tecnologia com curadoria editorial, sem ruído.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Ember.News no Twitter"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-ember/60 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Twitter className="size-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Ember.News no LinkedIn"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-ember/60 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Linkedin className="size-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label="Ember.News no Instagram"
                  className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-all duration-200 hover:border-ember/60 hover:text-ember focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Instagram className="size-4" />
                </a>
              </div>
            </div>

            {/* Categorias */}
            <nav aria-label="Categorias" className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Categorias</span>
              <ul className="flex flex-col gap-3">
                {categories.map((c) => (
                  <li key={c.slug}>
                    <Link
                      to="/categoria/$slug"
                      params={{ slug: c.slug }}
                      className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Institucional */}
            <nav aria-label="Institucional" className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Institucional</span>
              <ul className="flex flex-col gap-3">
                <li>
                  <Link
                    to="/buscar"
                    search={{ q: "" }}
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Buscar
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Sobre nós
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Contato
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="group inline-flex items-center gap-1 text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Anuncie conosco
                    <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </li>
              </ul>
            </nav>

            {/* Legal */}
            <nav aria-label="Legal" className="flex flex-col gap-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</span>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Termos de uso
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Privacidade
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
                  >
                    Cookies
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:mt-16 md:flex-row md:items-center">
            <span>© {new Date().getFullYear().toString()} Ember.News. Todos os direitos reservados.</span>
            <span className="uppercase tracking-wider">Tecnologia, sem ruído.</span>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}
