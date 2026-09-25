import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArticleCard } from "@/components/ArticleCard";
import { LatestTicker } from "@/components/LatestTicker";
import { SiteHeader } from "@/components/SiteHeader";
import { NewsletterModal } from "@/components/NewsletterModal";
import { UrgencyBanner } from "@/components/UrgencyBanner";
import { SocialProofBar } from "@/components/SocialProofBar";
import TestimonialsSection from "@/components/TestimonialsSection";
import GuaranteeSection from "@/components/GuaranteeSection";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { articles, categories } from "@/lib/articles";
import {
  ArrowRight,
  Play,
  Twitter,
  ArrowUpRight,
  Linkedin,
  Instagram,
  Check,
  Mail,
  Newspaper,
  ShieldCheck,
} from "lucide-react";

const pricingPlans = [
  {
    name: "Leitor",
    price: "Grátis",
    originalPrice: "",
    period: "",
    description: "Para conhecer a redação — acesso limitado ao essencial do dia.",
    features: [
      "Acesso a todas as matérias abertas",
      "Newsletter semanal",
      "Busca ilimitada no acervo",
    ],
    highlighted: false,
    cta: "COMEÇAR GRATUITAMENTE",
  },
  {
    name: "Assinante Fundador",
    price: "R$ 19",
    originalPrice: "R$ 39",
    period: "/mês",
    description: "A assinatura completa, com preço de fundador travado para sempre.",
    features: [
      "Tudo do plano Leitor",
      "Reportagens exclusivas em primeira mão",
      "Edição sem anúncios",
      "Newsletter diária com furos de redação",
      "Acesso antecipado às pautas em apuração",
      "Preço de fundador travado para sempre",
    ],
    highlighted: true,
    cta: "QUERO SER ASSINANTE FUNDADOR",
  },
  {
    name: "Empresa",
    price: "R$ 89",
    originalPrice: "",
    period: "/mês",
    description: "Para redações e times que precisam de informação verificada todos os dias.",
    features: [
      "Tudo do plano Assinante",
      "Até 10 usuários por licença",
      "Relatórios setoriais sob medida",
      "Suporte editorial prioritário",
    ],
    highlighted: false,
    cta: "FALAR COM O COMERCIAL",
  },
];

const subscriptionSteps = [
  {
    icon: Newspaper,
    title: "Escolha sua edição",
    description: "Selecione o plano que combina com o seu ritmo de leitura — do gratuito ao fundador.",
  },
  {
    icon: Mail,
    title: "Confirme por e-mail",
    description: "Você recebe a confirmação e já começa a receber a newsletter diária na hora.",
  },
  {
    icon: ShieldCheck,
    title: "Leia com garantia",
    description: "Satisfação garantida em 7 dias — se não for para você, devolvemos o valor.",
  },
];

function toTickerItem(a: (typeof articles)[number]) {
  return { title: a.title, category: a.category, href: `/artigo/${a.slug}` };
}

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
      { title: "Ember.News — Jornal Digital de Tecnologia, Negócios e Cultura" },
      {
        name: "description",
        content:
          "Reportagens verificadas, análises independentes e as manchetes que importam. Assine a Ember.News e receba a edição diária com garantia de satisfação de 7 dias.",
      },
      { property: "og:title", content: "Ember.News — Jornal Digital de Tecnologia" },
      {
        property: "og:description",
        content:
          "Cobertura diária de tecnologia, negócios e cultura em formato de jornal. Assine e receba as manchetes do dia.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { featured, bentoSecondary, sidebarList, zigzag, grid } = useMemo(() => {
    const featured = articles.find((a) => a.featured) ?? articles[0];
    const rest = articles.filter((a) => a.slug !== featured.slug);
    return {
      featured,
      bentoSecondary: rest.slice(0, 2),
      sidebarList: rest.slice(2, 7),
      zigzag: rest.slice(7, 11),
      grid: rest.slice(11, 15),
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-background">
      <UrgencyBanner />
      <NewsletterModal />
      <SiteHeader />
      <SocialProofBar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <h1 className="sr-only">Ember.News — jornal digital de tecnologia, negócios e cultura</h1>

        {/* Hero editorial */}
        <section className="border-b border-border pb-10 md:pb-14">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col gap-5"
            >
              <span className="kicker">{featured.category}</span>
              <h2 className="headline-serif text-4xl italic sm:text-5xl lg:text-[3.4rem]">
                {featured.title}
              </h2>
              <p className="byline">
                {featured.author} · {featured.date} · {{featured.readMinutes} min
              </p>

              <a
                href={`/artigo/${featured.slug}`}
                className="-mx-4 overflow-hidden border-y border-border sm:mx-0 sm:rounded-[6px] sm:border"
              >
                <img
                  src={featured.image}
                  alt={featured.title}
                  className="h-[260px] w-full object-cover sm:h-[420px]"
                />
              </a>

              <p className="drop-cap max-w-2xl font-sans text-base leading-relaxed text-muted-foreground md:text-lg">
                {featured.excerpt}
              </p>

              <div className="mt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#planos"
                  className="btn-news-primary inline-flex items-center gap-2 rounded-[6px] px-6 py-3 text-sm font-bold uppercase tracking-wide"
                >
                  Assinar agora <ArrowRight className="size-4" />
                </a>
                <a
                  href="#em-pauta"
                  className="btn-news-outline inline-flex items-center gap-2 rounded-[6px] px-6 py-3 text-sm font-semibold uppercase tracking-wide"
                >
                  Ver pauta de hoje
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <LatestTicker items={sidebarList.map(toTickerItem)} />
            </motion.div>
          </div>
        </section>

        {/* Destaques do dia */}
        <section className="mt-12 md:mt-16">
          <div className="flex items-end justify-between">
            <h2 className="headline-serif text-2xl">Destaques do dia</h2>
            <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
              Selecionado pela redação
            </span>
          </div>
          <div className="newspaper-rule mt-4 mb-8" />
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {bentoSecondary.map((a, i) => (
              <motion.div
                key={a.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ArticleCard
                  image={a.image ?? ""}
                  category={a.category}
                  title={a.title}
                  excerpt={a.excerpt}
                  author={a.author}
                  date={a.date}
                  readTime={{a.readMinutes} min
                  href={`/artigo/${a.slug}`}
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Vídeo em destaque */}
        <motion.section {...fadeUp} className="mt-14 flex justify-center md:mt-20">
          <div className="w-full max-w-3xl overflow-hidden rounded-[6px] border border-border bg-card shadow-sm">
            <LazyVideo src={estatuaVideo.url} />
          </div>
        </motion.section>

        {/* Em pauta — zigzag editorial */}
        <section id="em-pauta" className="mt-14 flex flex-col gap-10 md:mt-20">
          <motion.div {...fadeUp} className="flex flex-col gap-2">
            <div className="flex items-end justify-between gap-6">
              <h2 className="headline-serif text-2xl">Em pauta agora</h2>
              <span className="h-px flex-1 bg-border" />
              <span className="hidden text-xs uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                Leitura recomendada
              </span>
            </div>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Reportagens em apuração e análises que estão movimentando a redação nas últimas horas.
            </p>
          </motion.div>

          {zigzag.map((a, i) => (
            <motion.div
              key={a.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            >
              <ArticleCard
                image={a.image ?? ""}
                category={a.category}
                title={a.title}
                excerpt={a.excerpt}
                author={a.author}
                date={a.date}
                readTime={{a.readMinutes} min
                href={`/artigo/${a.slug}`}
                variant="horizontal"
                className={i % 2 === 1 ? "sm:flex-row-reverse" : undefined}
              />
            </motion.div>
          ))}
        </section>

        {/* CTA intermediário */}
        <motion.section {...fadeUp} className="mt-14 md:mt-20">
          <div className="flex flex-col items-center gap-4 rounded-[6px] border border-border bg-card px-6 py-10 text-center">
            <span className="kicker">Assinatura fundador</span>
            <h3 className="headline-serif text-2xl sm:text-3xl">
              A edição completa, sem interrupções.
            </h3>
            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Reportagens exclusivas, sem anúncios e com a newsletter diária direto na sua caixa de entrada. Preço de fundador travado para sempre.
            </p>
            <a
              href="#planos"
              className="btn-news-primary inline-flex items-center gap-2 rounded-[6px] px-8 py-3.5 text-sm font-bold uppercase tracking-wide"
            >
              Ver planos de assinatura <ArrowRight className="size-4" />
            </a>
          </div>
        </motion.section>

        {/* Categorias como abas */}
        <motion.section id="categorias" {...fadeUp} className="mt-14 md:mt-20">
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
        </motion.section>

        {/* Como funciona a assinatura */}
        <motion.section {...fadeUp} className="mt-14 md:mt-20">
          <h2 className="headline-serif text-2xl">Como funciona a assinatura</h2>
          <div className="newspaper-rule mt-4 mb-10" />
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3">
            {subscriptionSteps.map((step, i) => (
              <div key={step.title} className="flex flex-col items-start gap-3">
                <span className="font-display text-4xl font-black text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <step.icon className="size-5 text-primary" />
                <h3 className="headline-serif text-lg">{step.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Depoimentos */}
        <div id="depoimentos" className="mt-14 md:mt-20">
          <TestimonialsSection />
        </div>

        {/* Planos */}
        <motion.section {...fadeUp} id="planos" className="mt-14 md:mt-20">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="kicker">Assinaturas</span>
            <h2 className="headline-serif text-3xl sm:text-4xl">Escolha sua edição</h2>
            <p className="max-w-md text-sm text-muted-foreground">
              O preço de fundador é travado para sempre — válido apenas para este lote de assinantes.
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
                className={`relative flex flex-col gap-6 rounded-[6px] border p-6 ${
                  plan.highlighted
                    ? "border-primary bg-card shadow-md"
                    : "border-border bg-card"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-6 bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                    Recomendado
                  </span>
                )}
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    {plan.name}
                  </span>
                  <div className="flex items-end gap-2">
                    {plan.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        {plan.originalPrice}
                      </span>
                    )}
                    <span className="font-display text-3xl font-black">{plan.price}</span>
                    {plan.period && (
                      <span className="pb-1 text-sm text-muted-foreground">{plan.period}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>
                </div>

                <div className="newspaper-rule" />

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
                  className={`w-full rounded-[6px] py-2.5 text-sm font-bold uppercase tracking-wide focus-visible:outline-none ${
                    plan.highlighted ? "btn-news-primary" : "btn-news-outline"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Garantia */}
        <div className="mt-14 md:mt-20">
          <GuaranteeSection />
        </div>

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


      <footer className="relative mt-32 overflow-hidden border-t border-white/10 bg-black">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-ember to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 size-80 -translate-x-1/2 rounded-full bg-ember/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-20">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
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
                      className="text-base font-medium text-muted-foreground border-b border-transparent transition-colors duration-200 hover:border-ember/40 hover:text-foreground"
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

          <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-border/60 pt-8 text-xs text-muted-foreground md:flex-row md:items-center">
            <span>© {new Date().getFullYear().toString()} Ember.News. Todos os direitos reservados.</span>
            <span className="uppercase tracking-wider">Tecnologia, sem ruído.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
