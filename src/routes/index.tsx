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
  TrendingUp,
  Clock,
} from "lucide-react";

const NewsletterModal = lazy(() =>
  import("@/components/NewsletterModal").then((mod) => ({ default: mod.NewsletterModal })),
);
const NewsPhotoCarousel = lazy(() => import("@/components/NewsPhotoCarousel"));

const loadMotionFeatures = () => import("@/lib/motion-features").then((mod) => mod.default);

const NEWSLETTER_STORAGE_KEY = "ember-newsletter-seen";

function NewsletterGate() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(NEWSLETTER_STORAGE_KEY)) return;
    } catch {
      // storage indisponível
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
      className="aspect-[16/9] w-full rounded-xl border border-border bg-muted sm:aspect-[21/9]"
    />
  );
}

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
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl bg-muted"
          aria-label="Reproduzir vídeo"
        >
          <span className="flex size-16 items-center justify-center rounded-full border border-white/20 bg-black/40 backdrop-blur-sm transition-transform group-hover:scale-110">
            <Play className="size-6 fill-white text-white" />
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

          {/* Breaking news strip */}
          <div className="border-b border-border bg-primary text-primary-foreground">
            <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5 text-xs font-medium sm:px-6 lg:px-8">
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-0.5 font-bold uppercase tracking-[0.14em]">
                <Zap className="size-3" /> Plantão
              </span>
              <a
                href={`/artigo/${featured.slug}`}
                className="min-w-0 truncate hover:underline decoration-white/60 underline-offset-4"
              >
                {featured.title}
              </a>
            </div>
          </div>

          <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
            <h1 className="sr-only">Ember.News — notícias, fofocas e bastidores</h1>

            {/* HERO BENTO GRID */}
            <section className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto] lg:gap-5">
              {/* Main story - spans 8 cols */}
              <m.a
                href={`/artigo/${featured.slug}`}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative block overflow-hidden rounded-xl lg:col-span-8 lg:row-span-2"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  width={1200}
                  height={600}
                  fetchPriority="high"
                  decoding="async"
                  className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-[1.02] sm:h-[520px] lg:h-full lg:min-h-[560px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-6 text-white sm:p-8 lg:p-10">
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    <Flame className="size-3.5" /> Destaque
                  </span>
                  <h2 className="headline-serif text-3xl leading-[1.1] text-white sm:text-4xl lg:text-5xl xl:text-6xl">
                    {featured.title}
                  </h2>
                  <p className="max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base lg:text-lg">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-wide text-white/60">
                    <span>{featured.author}</span>
                    <span className="size-1 rounded-full bg-white/40" />
                    <span className="inline-flex items-center gap-1">
                      <Clock className="size-3" /> {featured.readMinutes} min
                    </span>
                  </div>
                </div>
              </m.a>

              {/* Secondary stories - 4 cols stack */}
              <div className="flex flex-col gap-4 lg:col-span-4 lg:row-span-2">
                {secondary.map((a, i) => (
                  <m.a
                    key={a.slug}
                    href={`/artigo/${a.slug}`}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="group relative flex flex-1 overflow-hidden rounded-xl bg-card border border-border transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="w-2/5 overflow-hidden">
                      <img
                        src={a.image}
                        alt={a.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2 p-4 sm:p-5">
                      <span className="kicker text-[10px]">{a.category}</span>
                      <h3 className="headline-serif text-base leading-snug sm:text-lg group-hover:text-primary transition-colors">
                        {a.title}
                      </h3>
                      <span className="text-[11px] text-muted-foreground">
                        {a.readMinutes} min de leitura
                      </span>
                    </div>
                  </m.a>
                ))}
              </div>
            </section>

            {/* TICKER */}
            <m.section {...fadeUp} id="plantao" className="mt-16 md:mt-24">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5">
                  <TrendingUp className="size-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Em alta
                  </span>
                </div>
                <div className="h-px flex-1 bg-border" />
              </div>
              <div className="mt-6">
                <LatestTicker items={tickerItems} />
              </div>
            </m.section>

            {/* CAROUSEL */}
            <m.section {...fadeUp} id="carrossel-noticias" className="mt-16 md:mt-24">
              <div className="mb-8 flex items-end justify-between gap-6">
                <div>
                  <span className="kicker mb-2 block">Visual</span>
                  <h2 className="headline-serif text-2xl sm:text-3xl">Flagras e imagens</h2>
                </div>
                <Link
                  to="/buscar"
                  search={{ q: "" }}
                  className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
                >
                  Ver tudo <ArrowRight className="size-4" />
                </Link>
              </div>
              <DeferredCarousel />
            </m.section>

            {/* FOFOCAS - Modern list layout */}
            <section id="fofocas" className="mt-16 md:mt-24">
              <m.div {...fadeUp} className="mb-10">
                <div className="flex items-center gap-4">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                    <Flame className="size-5 text-primary" />
                  </span>
                  <div>
                    <h2 className="headline-serif text-2xl sm:text-3xl">Fofoca quente</h2>
                    <p className="text-sm text-muted-foreground">
                      Rumores, bastidores e tudo o que os famosos não queriam que você soubesse.
                    </p>
                  </div>
                </div>
              </m.div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {fofocas.map((a, i) => (
                  <m.div
                    key={a.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
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
                    />
                  </m.div>
                ))}
              </div>
            </section>

            {/* VIDEO */}
            <m.section {...fadeUp} className="mt-16 md:mt-24">
              <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8">
                <div className="mb-6 flex items-center gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-red-500/10">
                    <Play className="size-4 fill-red-500 text-red-500" />
                  </span>
                  <h2 className="headline-serif text-xl sm:text-2xl">Vídeo do dia</h2>
                </div>
                <div className="overflow-hidden rounded-xl shadow-sm">
                  <LazyVideo src={estatuaVideo.url} />
                </div>
              </div>
            </m.section>

            {/* CATEGORIES */}
            <m.section id="categorias" {...fadeUp} className="mt-16 md:mt-24">
              <div className="mb-6">
                <span className="kicker mb-2 block">Navegue</span>
                <h2 className="headline-serif text-2xl sm:text-3xl">Editorias</h2>
              </div>
              <nav
                aria-label="Editorias"
                className="flex flex-wrap gap-2"
              >
                {categories.map((c) => (
                  <Link
                    key={c.slug}
                    to="/categoria/$slug"
                    params={{ slug: c.slug }}
                    className="rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {c.name}
                  </Link>
                ))}
              </nav>
            </m.section>

            {/* NEWSLETTER */}
            <m.section {...fadeUp} id="newsletter" className="mt-16 md:mt-24">
              <div className="relative overflow-hidden rounded-2xl bg-foreground px-6 py-14 text-center text-background sm:px-12 md:py-20">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                <div className="relative flex flex-col items-center gap-5">
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Mail className="size-5" />
                  </span>
                  <h3 className="headline-serif text-2xl sm:text-3xl md:text-4xl">
                    A fofoca chega primeiro no seu e-mail.
                  </h3>
                  <p className="max-w-lg text-sm leading-relaxed text-background/70 md:text-base">
                    Todas as manhãs, o resumo das notícias e das fofocas mais comentadas. Grátis e sem spam.
                  </p>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row"
                  >
                    <label htmlFor="newsletter-email" className="sr-only">
                      E-mail
                    </label>
                    <input
                      id="newsletter-email"
                      type="email"
                      required
                      placeholder="seu@email.com"
                      className="w-full rounded-lg border-0 bg-background/10 px-5 py-3.5 text-base text-background placeholder:text-background/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    />
                    <button
                      type="submit"
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Quero receber <ArrowRight className="size-4" />
                    </button>
                  </form>
                </div>
              </div>
            </m.section>

            {/* MORE STORIES GRID */}
            {grid.length > 0 && (
              <m.section {...fadeUp} className="mt-16 md:mt-24">
                <div className="mb-8 flex items-end justify-between gap-4">
                  <div>
                    <span className="kicker mb-2 block">Leia também</span>
                    <h2 className="headline-serif text-2xl sm:text-3xl">Mais lidas</h2>
                  </div>
                  <span className="hidden text-xs font-medium uppercase tracking-wider text-muted-foreground sm:inline">
                    {articles.length} matérias
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {grid.map((a, i) => (
                    <m.div
                      key={a.slug}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                    >
                      <ArticleCard article={a} size="sm" />
                    </m.div>
                  ))}
                </div>
              </m.section>
            )}
          </main>

          {/* FOOTER */}
          <footer className="mt-32 border-t border-border bg-card">
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:px-8 md:py-20">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.5fr_1fr_1fr]">
                <div className="flex flex-col gap-5">
                  <span className="logo-animated font-display text-xl font-bold uppercase tracking-wider text-logo">
                    Ember<span className="text-primary">.</span>News
                  </span>
                  <p className="max-w-[40ch] text-sm leading-relaxed text-muted-foreground">
                    Notícias, fofocas e bastidores dos famosos, todos os dias, sem enrolação.
                  </p>
                  <div className="flex items-center gap-3">
                    <a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Ember.News no Twitter"
                      className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Twitter className="size-4" />
                    </a>
                    <a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label="Ember.News no Instagram"
                      className="flex size-10 items-center justify-center rounded-full border border-border text-muted-foreground transition-all hover:border-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Instagram className="size-4" />
                    </a>
                  </div>
                </div>

                <nav aria-label="Editorias" className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Editorias</span>
                  <ul className="flex flex-col gap-3">
                    {categories.map((c) => (
                      <li key={c.slug}>
                        <Link
                          to="/categoria/$slug"
                          params={{ slug: c.slug }}
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                        >
                          {c.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                <nav aria-label="Institucional" className="flex flex-col gap-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-foreground">Institucional</span>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <Link
                        to="/buscar"
                        search={{ q: "" }}
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        Buscar
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/contato"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        Contato
                      </Link>
                    </li>
                    <li>
                      <a
                        href="#newsletter"
                        className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                      >
                        Newsletter <ArrowUpRight className="size-3.5" />
                      </a>
                    </li>
                  </ul>
                </nav>
              </div>

              <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
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