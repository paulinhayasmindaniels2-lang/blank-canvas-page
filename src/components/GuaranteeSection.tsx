import { motion } from "motion/react";
import { ShieldCheck, CheckCircle2, XCircle, Headset, Flame } from "lucide-react";
import { useCallback } from "react";

const bullets = [
  {
    icon: XCircle,
    title: "Cancelamento em 1 clique",
    description:
      "Sem ligação, sem retenção forçada, sem letra miúda. Você cancela quando quiser, direto no painel.",
  },
  {
    icon: CheckCircle2,
    title: "Sem fidelidade, sem pegadinha",
    description:
      "Nenhum contrato de permanência. Se a Ember não entregar valor pra você, o risco é nosso, não seu.",
  },
  {
    icon: Headset,
    title: "Suporte humano de verdade",
    description:
      "Time real respondendo em horas, não bots genéricos te enrolando por dias.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function GuaranteeSection() {
  const handleCta = useCallback(() => {
    const target = document.getElementById("planos");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <section
      aria-label="Garantia de risco zero e chamada final para assinatura"
      className="relative overflow-hidden border-y border-border bg-card/50 py-16 sm:py-20"
    >
      <div className="hero-aurora-a right-[-10%] top-[-20%] h-72 w-72 opacity-40 sm:h-96 sm:w-96" aria-hidden="true" />
      <div className="hero-aurora-b bottom-[-20%] left-[-10%] h-64 w-64 opacity-30 sm:h-80 sm:w-80" aria-hidden="true" />

      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="flex flex-col items-center text-center"
        >
          <motion.div variants={fadeUp} className="guarantee-badge">
            <ShieldCheck className="h-10 w-10" aria-hidden="true" />
          </motion.div>

          <motion.span
            variants={fadeUp}
            className="mt-6 inline-flex items-center gap-2 rounded-[3px] border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary"
          >
            <Flame className="h-3.5 w-3.5" aria-hidden="true" />
            Garantia incondicional
          </motion.span>

          <motion.h2
            variants={fadeUp}
            className="mt-4 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl md:text-5xl"
          >
            Risco zero por <span className="ember-shimmer-text">7 dias</span>
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg"
          >
            Assine agora. Se em 7 dias você achar que a Ember.News não vale cada centavo, devolvemos 100% do seu
            dinheiro, sem perguntas e sem burocracia. Você só tem a ganhar — o prejuízo, se houver, é nosso.
          </motion.p>

          <motion.div
            variants={container}
            className="mt-10 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3 sm:gap-5"
          >
            {bullets.map((bullet) => {
              const Icon = bullet.icon;
              return (
                <motion.div
                  key={bullet.title}
                  variants={fadeUp}
                  className="flex flex-col gap-3 rounded-[3px] border border-border bg-background/50 p-5"
                >
                  <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                  <p className="text-sm font-bold text-foreground">{bullet.title}</p>
                  <p className="text-xs leading-relaxed text-muted-foreground sm:text-sm">
                    {bullet.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-12 flex w-full flex-col items-center gap-4 rounded-[3px] border border-primary/30 bg-primary/5 px-4 py-8 sm:px-8"
          >
            <p className="text-lg font-extrabold uppercase tracking-tight text-foreground sm:text-xl">
              Pare de chegar atrasado nas notícias que movem o mercado
            </p>
            <button
              type="button"
              onClick={handleCta}
              className="btn-neon-subscribe inline-flex items-center justify-center gap-2 rounded-[3px] px-8 py-4 text-sm font-extrabold uppercase tracking-wide sm:text-base"
            >
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
              Quero garantir minha vaga
            </button>
            <p className="urgency-pulse inline-flex items-center gap-2 rounded-[3px] border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-destructive sm:text-xs">
              <Flame className="h-3.5 w-3.5" aria-hidden="true" />
              Restam poucas vagas no plano fundador — preço sobe assim que lotar
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
