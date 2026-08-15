export type CategorySlug = "ia" | "startups" | "ciberseguranca" | "hardware" | "software";

export type Category = {
  slug: CategorySlug;
  name: string;
  description: string;
};

export const categories: Category[] = [
  { slug: "ia", name: "Inteligência Artificial", description: "Modelos, pesquisa e aplicações de IA." },
  { slug: "startups", name: "Startups", description: "Rodadas, lançamentos e bastidores do ecossistema." },
  { slug: "ciberseguranca", name: "Cibersegurança", description: "Vulnerabilidades, ataques e defesa." },
  { slug: "hardware", name: "Hardware", description: "Chips, dispositivos e infraestrutura." },
  { slug: "software", name: "Software", description: "Ferramentas, linguagens e código aberto." },
];

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  author: string;
  date: string; // ISO yyyy-mm-dd — formatado de forma estável
  readMinutes: number;
  featured?: boolean;
  size?: "lg" | "md" | "sm";
  body: string[];
};

export const articles: Article[] = [
  {
    slug: "novo-modelo-multimodal-bate-recordes",
    title: "Novo modelo multimodal bate recordes em raciocínio visual",
    excerpt:
      "Pesquisadores apresentam uma arquitetura que combina texto, imagem e áudio com latência reduzida e menor custo de inferência.",
    category: "ia",
    author: "JOAO COSTA",
    date: "2026-05-18",
    readMinutes: 6,
    featured: true,
    size: "lg",
    body: [
      "Um grupo de pesquisadores publicou nesta semana os resultados de um novo modelo multimodal capaz de superar benchmarks consolidados de raciocínio visual e linguagem natural simultaneamente.",
      "Segundo o paper, a arquitetura introduz um mecanismo de atenção esparsa que reduz drasticamente o custo de inferência sem prejudicar a precisão em tarefas complexas.",
      "A comunidade open source já começou a portar pesos derivados, e startups apostam em casos de uso que vão de moderação de conteúdo a assistentes visuais para acessibilidade.",
    ],
  },
  {
    slug: "rodada-serie-b-fintech-brasileira",
    title: "Fintech brasileira levanta US$ 80 mi em Série B",
    excerpt: "Aporte liderado por fundo americano amplia operação para México e Colômbia ainda este ano.",
    category: "startups",
    author: "Rafael Lima",
    date: "2026-05-17",
    readMinutes: 4,
    size: "md",
    body: [
      "A fintech, que oferece infraestrutura de pagamentos para marketplaces, anunciou uma rodada de Série B de US$ 80 milhões liderada por um fundo sediado em Nova York.",
      "Com o novo aporte, a empresa planeja triplicar o time de engenharia e abrir escritórios em Cidade do México e Bogotá.",
    ],
  },
  {
    slug: "vulnerabilidade-critica-em-roteadores",
    title: "Vulnerabilidade crítica afeta milhões de roteadores domésticos",
    excerpt: "Falha permite execução remota de código e já tem patch disponível para principais fabricantes.",
    category: "ciberseguranca",
    author: "Beatriz Souza",
    date: "2026-05-16",
    readMinutes: 5,
    size: "md",
    body: [
      "Pesquisadores divulgaram uma falha crítica que afeta firmwares de roteadores domésticos amplamente distribuídos.",
      "A vulnerabilidade, classificada com CVSS 9.8, permite execução remota de código sem autenticação prévia.",
      "Fabricantes já liberaram patches; usuários devem atualizar o firmware imediatamente.",
    ],
  },
  {
    slug: "novo-chip-3nm-acelera-inferencia",
    title: "Novo chip de 3nm promete acelerar inferência local",
    excerpt: "Arquitetura dedicada a transformers reduz consumo em 40% comparada à geração anterior.",
    category: "hardware",
    author: "Eduardo Tanaka",
    date: "2026-05-15",
    readMinutes: 4,
    size: "sm",
    body: [
      "O novo SoC, fabricado em processo de 3nm, traz núcleos dedicados a operações de transformer.",
      "Os primeiros benchmarks indicam ganhos expressivos em modelos de linguagem rodando localmente em laptops.",
    ],
  },
  {
    slug: "framework-open-source-atinge-1-0",
    title: "Framework web open source atinge versão 1.0",
    excerpt: "Projeto mantido pela comunidade promete renderização híbrida e DX simplificada.",
    category: "software",
    author: "Camila Ribeiro",
    date: "2026-05-14",
    readMinutes: 3,
    size: "sm",
    body: [
      "Após dois anos em beta, o framework anunciou sua primeira versão estável.",
      "Entre os destaques estão streaming de componentes, server functions tipadas e cache granular.",
    ],
  },
  {
    slug: "agentes-autonomos-ganham-espaco-no-suporte",
    title: "Agentes autônomos ganham espaço no suporte técnico",
    excerpt: "Empresas relatam queda no tempo médio de resposta após implantação de agentes baseados em LLMs.",
    category: "ia",
    author: "JOAO COSTA",
    date: "2026-05-13",
    readMinutes: 5,
    size: "md",
    body: [
      "Casos de uso de agentes autônomos em suporte técnico cresceram nos últimos meses.",
      "Empresas reportam redução de 35% no tempo médio de resposta e aumento na satisfação dos usuários.",
    ],
  },
  {
    slug: "ataques-de-phishing-com-deepfake-de-voz",
    title: "Ataques de phishing com deepfake de voz se multiplicam",
    excerpt: "Criminosos clonam vozes de executivos para autorizar transferências bancárias fraudulentas.",
    category: "ciberseguranca",
    author: "Beatriz Souza",
    date: "2026-05-12",
    readMinutes: 4,
    size: "sm",
    body: [
      "Especialistas alertam para o crescimento de golpes que combinam engenharia social e clonagem de voz por IA.",
      "Recomenda-se adotar palavras-chave internas e canais de verificação fora da banda para autorizações sensíveis.",
    ],
  },
  {
    slug: "acelerador-lanca-batch-focado-em-ia",
    title: "Acelerador lança batch focado em IA aplicada",
    excerpt: "Programa investe US$ 250 mil em cada uma das 20 startups selecionadas.",
    category: "startups",
    author: "Rafael Lima",
    date: "2026-05-11",
    readMinutes: 3,
    size: "sm",
    body: [
      "O programa, com sede em São Paulo, abriu inscrições para sua nova turma de aceleração focada em IA aplicada.",
      "Cada startup selecionada receberá US$ 250 mil em troca de equity e seis meses de mentoria intensiva.",
    ],
  },
];

export function getArticleBySlug(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function articlesByCategory(slug: CategorySlug) {
  return articles.filter((a) => a.category === slug);
}

export function searchArticles(query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q),
  );
}

// Formato estável (não usa Intl locale-dependent) — evita hydration mismatch
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  return `${parseInt(d, 10)} ${meses[parseInt(m, 10) - 1]} ${y}`;
}
