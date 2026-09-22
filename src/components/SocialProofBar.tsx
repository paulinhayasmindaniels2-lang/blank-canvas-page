import { motion } from "motion/react";
import { Users, Star, Flame, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Stat {
  icon: LucideIcon;
  value: string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: Users,
    value: "+50.000",
    label: "leitores ativos por mês",
  },
  {
    icon: Star,
    value: "4.9/5",
    label: "avaliação média dos assinantes",
  },
  {
    icon: Flame,
    value: "+120",
    label: "furos exclusivos por mês",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "dos assinantes renovam",
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
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function SocialProofBar() {
  return (
    <section
      aria-label="Prova social e números da Ember.News"
      className="relative border-y border-border bg-card/60 py-10 sm:py-12"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="mb-6 text-center text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground sm:text-xs">
          Por que milhares confiam na cobertura Ember
        </p>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                className="flex flex-col items-center gap-2 rounded-[3px] border border-border bg-background/40 px-3 py-6 text-center sm:px-4"
              >
                <Icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" aria-hidden="true" />
                <span className="stat-counter text-2xl sm:text-3xl md:text-4xl">
                  {stat.value}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">
                  {stat.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
