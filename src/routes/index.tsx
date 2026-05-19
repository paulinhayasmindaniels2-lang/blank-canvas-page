import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Menu, Play, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "G2 — O portal de notícias do Brasil" },
      { name: "description", content: "Últimas notícias do Brasil e do mundo, esportes, economia, política, entretenimento e muito mais." },
    ],
  }),
  component: Index,
});

const editorias = [
  "Últimas", "Política", "Economia", "Mundo", "Saúde", "Educação",
  "Esportes", "Entretenimento", "Tecnologia", "Cultura", "Ciência", "Meio Ambiente",
];

const destaque = {
  chapeu: "POLÍTICA",
  titulo: "Congresso aprova projeto que altera regras da reforma tributária e amplia setores beneficiados",
  resumo: "Texto seguiu para sanção presidencial após acordo de líderes na madrugada desta terça-feira; entenda os principais pontos.",
  imagem: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1600&q=80",
};

const secundarios = [
  {
    chapeu: "ECONOMIA",
    titulo: "Dólar fecha em queda e Ibovespa renova máxima histórica com expectativa de corte de juros",
    imagem: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
  },
  {
    chapeu: "MUNDO",
    titulo: "Cúpula do clima começa nesta semana com pressão sobre países desenvolvidos",
    imagem: "https://images.unsplash.com/photo-1569163139394-de4798aa62b6?w=800&q=80",
  },
  {
    chapeu: "ESPORTES",
    titulo: "Seleção brasileira convoca jogadores para amistosos da data Fifa",
    imagem: "https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80",
  },
];

const maisLidas = [
  "Anvisa aprova novo medicamento contra Alzheimer; veja quem pode tomar",
  "Apagão atinge cinco estados do Nordeste e mobiliza ONS na madrugada",
  "Universidade abre 12 mil vagas em curso gratuito de programação",
  "Receita libera consulta ao 4º lote de restituição do Imposto de Renda",
  "Time brasileiro avança às oitavas da Libertadores em jogo dramático",
];

const noticias = [
  { editoria: "Tecnologia", titulo: "Startup brasileira desenvolve chip de IA com 40% menos consumo de energia", imagem: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80" },
  { editoria: "Saúde", titulo: "Pesquisa mostra que caminhar 7 mil passos por dia reduz risco cardíaco", imagem: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" },
  { editoria: "Cultura", titulo: "Festival de cinema do Rio anuncia programação com 320 filmes", imagem: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80" },
  { editoria: "Educação", titulo: "MEC divulga novo cronograma do Enem 2026 e mudanças na prova", imagem: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&q=80" },
  { editoria: "Entretenimento", titulo: "Nova série brasileira estreia e bate recorde de audiência no streaming", imagem: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=600&q=80" },
  { editoria: "Meio Ambiente", titulo: "Desmatamento na Amazônia cai 22% no acumulado do ano, diz Inpe", imagem: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80" },
];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <div className="bg-[oklch(0.18_0.02_260)] text-white text-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-4">
            <span className="font-semibold">terça-feira, 19 de maio de 2026</span>
            <span className="hidden md:inline opacity-70">São Paulo, 24°C</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:underline">Entrar</Link>
            <Link to="/" className="hover:underline">Assine</Link>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1"><Menu size={22} /></button>
            <Link to="/" className="flex items-baseline gap-1">
              <span className="text-3xl font-black tracking-tighter text-[oklch(0.55_0.22_25)]">g</span>
              <span className="text-3xl font-black tracking-tighter">2</span>
              <span className="ml-1 text-xs font-semibold text-muted-foreground hidden sm:inline">.com</span>
            </Link>
          </div>
          <div className="flex-1 max-w-md hidden md:block">
            <div className="flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2">
              <Search size={16} className="text-muted-foreground" />
              <input
                className="flex-1 bg-transparent text-sm outline-none"
                placeholder="O que você procura?"
              />
            </div>
          </div>
          <button className="rounded-full bg-[oklch(0.55_0.22_25)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
            ASSINE JÁ
          </button>
        </div>
        {/* Editorias */}
        <nav className="border-t border-border bg-white">
          <div className="mx-auto max-w-7xl overflow-x-auto">
            <ul className="flex gap-5 px-4 py-2 text-sm whitespace-nowrap">
              {editorias.map((e) => (
                <li key={e}>
                  <Link to="/" className="font-medium hover:text-[oklch(0.55_0.22_25)]">{e}</Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Destaque + secundárias */}
          <div className="lg:col-span-2 space-y-4">
            <article className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-md">
                <img src={destaque.imagem} alt="" className="w-full h-[420px] object-cover transition-transform duration-500 group-hover:scale-105" />
                <span className="absolute top-3 left-3 bg-[oklch(0.55_0.22_25)] text-white text-xs font-bold px-2 py-1 rounded">{destaque.chapeu}</span>
              </div>
              <h1 className="mt-4 text-3xl md:text-4xl font-bold leading-tight group-hover:underline">
                {destaque.titulo}
              </h1>
              <p className="mt-2 text-muted-foreground">{destaque.resumo}</p>
            </article>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
              {secundarios.map((n) => (
                <article key={n.titulo} className="group cursor-pointer">
                  <div className="overflow-hidden rounded-md">
                    <img src={n.imagem} alt="" className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <span className="mt-2 inline-block text-xs font-bold text-[oklch(0.55_0.22_25)]">{n.chapeu}</span>
                  <h3 className="text-base font-semibold leading-snug group-hover:underline">{n.titulo}</h3>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-card rounded-md border border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h2 className="font-bold text-sm tracking-wide">MAIS LIDAS</h2>
                <ChevronRight size={16} />
              </div>
              <ol className="divide-y divide-border">
                {maisLidas.map((t, i) => (
                  <li key={t} className="flex gap-3 px-4 py-3 hover:bg-secondary cursor-pointer">
                    <span className="text-2xl font-black text-[oklch(0.55_0.22_25)] leading-none">{i + 1}</span>
                    <p className="text-sm font-medium leading-snug">{t}</p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="relative rounded-md overflow-hidden bg-[oklch(0.18_0.02_260)] text-white p-5">
              <div className="flex items-center gap-2 text-xs font-bold mb-2">
                <span className="inline-flex items-center gap-1 bg-red-600 px-2 py-0.5 rounded">
                  <span className="size-2 bg-white rounded-full animate-pulse" /> AO VIVO
                </span>
                <span>g2 News</span>
              </div>
              <h3 className="text-lg font-bold leading-tight">Cobertura especial: votação no Senado tem repercussão imediata nos mercados</h3>
              <button className="mt-4 inline-flex items-center gap-2 rounded-full bg-white text-black text-sm font-semibold px-3 py-1.5">
                <Play size={14} /> Assistir agora
              </button>
            </div>
          </aside>
        </div>

        {/* Grid de notícias */}
        <section className="mt-10">
          <div className="flex items-center justify-between border-b-2 border-[oklch(0.55_0.22_25)] pb-2 mb-5">
            <h2 className="text-xl font-black tracking-tight">ÚLTIMAS NOTÍCIAS</h2>
            <Link to="/" className="text-sm font-semibold text-[oklch(0.55_0.22_25)] flex items-center gap-1">
              ver tudo <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((n) => (
              <article key={n.titulo} className="group cursor-pointer">
                <div className="overflow-hidden rounded-md">
                  <img src={n.imagem} alt="" className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <span className="mt-3 inline-block text-xs font-bold text-[oklch(0.55_0.22_25)]">{n.editoria.toUpperCase()}</span>
                <h3 className="text-lg font-semibold leading-snug group-hover:underline">{n.titulo}</h3>
                <p className="text-xs text-muted-foreground mt-1">há {Math.floor(Math.random() * 50) + 1} min</p>
              </article>
            ))}
          </div>
        </section>

        {/* Faixa esportes */}
        <section className="mt-12 bg-[oklch(0.18_0.02_260)] text-white rounded-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-black">⚽ ESPORTES</h2>
            <Link to="/" className="text-sm opacity-80 hover:opacity-100">ver mais</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            {["Brasileirão: confira a classificação atualizada após a rodada", "Libertadores: brasileiros conhecem adversários nas quartas", "Fórmula 1: GP de Mônaco tem treino marcado para sábado", "NBA: brasileiro brilha e marca 32 pontos em vitória"].map((t) => (
              <div key={t} className="border-l-2 border-[oklch(0.55_0.22_25)] pl-3 hover:opacity-80 cursor-pointer">
                {t}
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[oklch(0.12_0.02_260)] text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-bold mb-3">Portal</h4>
            <ul className="space-y-1 opacity-80">
              <li>Sobre</li><li>Anuncie</li><li>Trabalhe conosco</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Editorias</h4>
            <ul className="space-y-1 opacity-80">
              <li>Política</li><li>Economia</li><li>Esportes</li><li>Cultura</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Ajuda</h4>
            <ul className="space-y-1 opacity-80">
              <li>Central de atendimento</li><li>Fale conosco</li><li>Política de privacidade</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-3">Siga o g2</h4>
            <ul className="space-y-1 opacity-80">
              <li>Instagram</li><li>X / Twitter</li><li>YouTube</li><li>TikTok</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 py-4 text-center text-xs opacity-70">
          © 2026 g2.com — Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}
