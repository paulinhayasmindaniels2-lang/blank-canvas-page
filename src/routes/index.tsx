import { createFileRoute, Link } from "@tanstack/react-router";
import { LazyMotion, MotionConfig, m } from "motion/react";
import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { LatestTicker } from "@/components/LatestTicker";
import { SiteHeader } from "@/components/SiteHeader";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { articles, categories } from "@/lib/articles";
import {
  ArrowRight,
  Play,
  Twitter,
  ArrowUpRight,
  Instagram,
  Flame,
  Mail,
  Zap,
} from "lucide-react";

// Módulos não essenciais à primeira renderização: carregados em chunks separados.
const NewsletterModal = lazy(() =>
  import("@/components/NewsletterModal").then((mod) => ({ default: mod.NewsletterModal })),
);
const NewsPhotoCarousel = lazy(() => import("@/components/NewsPhotoCarousel"));

// Features de animação (domAnimation) carregadas após a hidratação.
const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

// Mesma chave usada por NewsletterModal: se o modal já foi visto, nem baixamos o chunk.
const NEWSLETTER_STORAGE_KEY = "ember-newsletter-seen";

function NewsletterGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(NEWSLETTER_STORAGE_KEY)) return;
    } catch {
      // sem acesso ao storage: segue o fluxo normal
    }

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setReady(true), { timeout: 1000 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(() => setReady(true), 200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <NewsletterModal />
    </Suspense>
  );
}

function CarouselPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="aspect-[16/9] w-full rounded-[6px] border border-border bg-muted sm:aspect-[21/9]"
    />
  );
}

// Só carrega o carrossel (e o Embla) quando a seção está perto da área visível.
function DeferredCarousel() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || near) return;
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(node);
    return () => io.disconnect();
  }, [near]);

  return (
    <div ref={ref}>
      {near ? (
        <Suspense fallback={<CarouselPlaceholder />}>
          <NewsPhotoCarousel />
        </Suspense>
      ) : (
        <CarouselPlaceholder />
      )}
    </div>
  );
}

// Componente isolado: evita re-renderizar a página inteira só para preencher o ano.
function CurrentYear() {
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year ?? ""}</>;
}

function toTickerItem(a: (typeof articles)[number]) {
  return { title: a.title, category: a.category, href: `/artigo/${a.slug}` };
}

function LazyVideo({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
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
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden bg-muted"
          aria-label="Reproduzir vídeo"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-border bg-background/90 transition-transform group-hover:scale-105">
            <Play className="size-6 fill-foreground text-foreground" />
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
      { title: "Ember.News — Notícias, Fofocas e Bastidores" },
      {
        name: "description",
        content:
          "As notícias do dia, as fofocas mais quentes e os bastidores dos famosos. Receba o plantão da Ember.News no seu e-mail.",
      },
      { property: "og:title", content: "Ember.News — Notícias, Fofocas e Bastidores" },
      {
        property: "og:description",
        content: "Plantão de notícias, fofocas e bastidores dos famosos, todos os dias.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { featured, secondary, tickerItems, fofocas, grid } = useMemo(() => {
    const featured = articles.find((a) => a.featured) ?? articles[0];
    const rest = articles.filter((a) => a.slug !== featured.slug);
    return {
      featured,
      secondary: rest.slice(0, 2),
      tickerItems: rest.slice(2, 8).map(toTickerItem),
      fofocas: rest.slice(8, 12),
      grid: rest.slice(12, 16),
    };
  }, []);

  return (
    <LazyMotion features={loadMotionFeatures}>
      <MotionConfig reducedMotion="user">
        <div className="relative min-h-screen bg-background">
          <NewsletterGate />
          <SiteHeader />

          {/* Faixa de plantão */}
          <div className="border-b border-border bg-primary text-primary-foreground">
            <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2 text-xs sm:px-6">
              <span className="inline-flex shrink-0 items-center gap-1 font-bold uppercase tracking-[0.14em]">
                <Zap className="size-3.5" /> Plantão
              </span>
              <a
                href={`/artigo/${featured.slug}`}
                className="min-w-0 truncate font-medium hover:underline"
              >
                {featured.title}
              </a>
            </div>
          </div>

          <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
            <h1 className="sr-only">Ember.News — notícias, fofocas e bastidores</h1>

            {/* Manchete + destaques */}
            <section className="grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_1fr]">
              <m.a
                href={`/artigo/${featured.slug}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative block overflow-hidden rounded-[6px]"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  width={1200}
                  height={480}
                  fetchPriority="high"
                  decoding="async"
                  className="h-[380px] w-full max-w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] sm:h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white sm:p-8">
                  <span className="inline-flex w-fit items-center gap-1 bg-primary px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    <Flame className="size-3.5" /> Bomba do dia
                  </span>
                  <h2 className="headline-serif text-3xl text-white sm:text-4xl lg:text-5xl">
                    {featured.title}
                  </h2>
                  <p className="max-w-xl text-sm text-white/85 sm:text-base">{featured.excerpt}</p>
                </div>
              </m.a>

              <div className="flex flex-col gap-6">
                {secondary.map((a, i) => (
                  <m.div
                    key={a.slug}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  >
                    <ArticleCard
                      image={a.image}
                      category={a.category}
                      title={a.title}
                      excerpt={a.excerpt}
                      author={a.author}
                      date={a.date}
                      readTime={`${a.readMinutes} min`}
                      href={`/artigo/${a.slug}`}
                    />
                  </m.div>
                ))}
              </div>
            </section>

            {/* Plantão */}
            <m.section {...fadeUp} id="plantao" className="mt-14 md:mt-20">
              <div className="flex items-end justify-between">
                <h2 className="headline-serif text-2xl">Plantão de notícias</h2>
                <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                  Atualizado ao longo do dia
                </span>
              </div>
              <div className="newspaper-rule mt-4 mb-8" />
              <LatestTicker items={tickerItems} />
            </m.section>

            {/* Em imagens */}
            <m.section {...fadeUp} id="carrossel-noticias" className="mt-14 md:mt-20">
              <h2 className="headline-serif text-2xl">Flagras e imagens</h2>
              <div className="newspaper-rule mt-4 mb-8" />
              <DeferredCarousel />
            </m.section>

            {/* Fofocas */}
            <section id="fofocas" className="mt-14 flex flex-col gap-10 md:mt-20">
              <m.div {...fadeUp} className="flex flex-col gap-2">
                <div className="flex items-end justify-between gap-6">
                  <h2 className="headline-serif text-2xl">Fofoca quente</h2>
                  <span className="h-px flex-1 bg-border" />
                  <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                    O assunto do momento
                  </span>
                </div>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Rumores, bastidores e tudo o que os famosos não queriam que você soubesse.
                </p>
              </m.div>

              {fofocas.map((a, i) => (
                <m.div
                  key={a.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ArticleCard
                    image={a.image}
                    category={a.category}
                    title={a.title}
                    excerpt={a.excerpt}
                    author={a.author}
                    date={a.date}
                    readTime={`${a.readMinutes} min`}
                    href={`/artigo/${a.slug}`}
                    variant="horizontal"
                    className={i % 2 === 1 ? "sm:flex-row-reverse" : undefined}
                  />
                </m.div>
              ))}
            </section>

            {/* Vídeo */}
            <m.section {...fadeUp} className="mt-14 flex flex-col items-center gap-4 md:mt-20">
              <h2 className="headline-serif text-2xl">Vídeo do dia</h2>
              <div className="w-full max-w-3xl overflow-hidden rounded-[6px] border border-border bg-card shadow-sm">
                <LazyVideo src={estatuaVideo.url} />
              </div>
            </m.section>

            {/* Editorias */}
            <m.section id="categorias" {...fadeUp} className="mt-14 md:mt-20">
              <div className="flex items-end justify-between">
                <h2 className="headline-serif text-2xl">Editorias</h2>
                <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                  Escolha um assunto
                </span>
              </div>
              <nav
                aria-label="Editorias"
                className="mt-6 flex gap-1 overflow-x-auto border-b border-border [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              >
                {categories.map((c, i) => (
                  <Link
                    key={c.slug}
                    to="/categoria/$slug"
                    params={{ slug: c.slug }}
                    className={`shrink-0 border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors ${
                      i === 0
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
                    }`}
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </m.section>

            {/* Newsletter */}
            <m.section {...fadeUp} id="newsletter" className="mt-14 md:mt-20">
              <div className="flex flex-col items-center gap-4 rounded-[6px] border border-border bg-card px-6 py-10 text-center">
                <Mail className="size-6 text-primary" />
                <span className="kicker">Newsletter grátis</span>
                <h3 className="headline-serif text-2xl sm:text-3xl">
                  Saia na frente: a fofoca chega primeiro no seu e-mail.
                </h3>
                <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                  Todas as manhãs, o resumo das notícias e das fofocas mais comentadas. Sem custo e sem spam.
                </p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex w-full max-w-md flex-col gap-2 sm:flex-row"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    E-mail
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    className="w-full rounded-[6px] border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <button
                    type="submit"
                    className="btn-news-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-[6px] px-6 py-3 text-sm font-bold uppercase tracking-wide"
                  >
                    Quero receber <ArrowRight className="size-4" />
                  </button>
                </form>
              </div>
            </m.section>

            {/* Mais recentes */}
            {grid.length > 0 && (
              <m.section {...fadeUp} className="mt-16">
                <div className="flex items-end justify-between">
                  <h2 className="headline-serif text-2xl">Mais lidas</h2>
                  <span className="text-xs uppercase tracking-wider text-muted-foreground">
                    {articles.length} matérias
                  </span>
                </div>
                <div className="newspaper-rule mt-4 mb-6" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {grid.map((a, i) => (
                    <m.div
                      key={a.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-60px" }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                    >
                      <ArticleCard article={a} size="sm" />
                    </m.div>
                  ))}
                </div>
              </m.section>
            )}
          </main>

          <footer className="relative mt-32 overflow-hidden bg-foreground text-background">
            <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
                <div className="flex flex-col gap-4">
                  <span className="font-display text-xl uppercase tracking-wider text-logo">
                    Ember<span className="text-logo">.</span>News
                  </span>
                  <p className="max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
                    Notícias, fofocas e bastidores dos famosos, todos os dias, sem enrolação.
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Ember.News no Twitter"
                      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Twitter className="size-4" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Ember.News no Instagram"
                      className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Instagram className="size-4" />
                    </a>
                  </div>
                </div>

                <nav aria-label="Editorias" className="flex flex-col gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Editorias</span>
                  <ul className="flex flex-col gap-3">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to="/categoria/$slug"
                          params={{ slug: c.slug }}
                          className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label="Institucional" className="flex flex-col gap-4">
                  <span className="text-xs font-semibold uppercase tracking-wider text-foreground">Institucional</span>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        to="/buscar"
                        search={{ q: "" }}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Buscar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contato"
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Contato
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#newsletter"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        Newsletter <ArrowUpRight className="size-3.5" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
                <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                  © <CurrentYear /> Ember.News. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
