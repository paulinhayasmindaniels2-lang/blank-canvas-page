import { motion } from "motion/react";
import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    name: "Rafael Times\u00e3o",
    role: "CTO na NimbusStack",
    avatar: "https://picsum.photos/seed/ember-testimonial-1/120/120",
    quote:
      "Assinei desconfiado e em 2 semanas j\u00e1 tinha antecipado 3 movimentos de mercado que meus concorrentes s\u00f3 viram nos jornais grandes. Hoje eu chamaria de vantagem injusta.",
  },
  {
    name: "Camila Andrade",
    role: "Head de Produto, Vortex Labs",
    avatar: "https://picsum.photos/seed/ember-testimonial-2/120/120",
    quote:
      "Cancelei duas outras assinaturas de not\u00edcias porque a Ember sozinha j\u00e1 entrega mais furo real do que as duas juntas. Se voc\u00ea hesitar, vai ficar pra tr\u00e1s.",
  },
  {
    name: "Thiago Bezerra",
    role: "Engenheiro Staff, Orbit Systems",
    avatar: "https://picsum.photos/seed/ember-testimonial-3/120/120",
    quote:
      "A newsletter di\u00e1ria virou meu primeiro caf\u00e9 da manh\u00e3. Em 3 meses recuperei o valor da assinatura s\u00f3 evitando uma decis\u00e3o errada baseada em not\u00edcia velha.",
  },
  {
    name: "Larissa Kowalski",
    role: "Fundadora, Heron Ventures",
    avatar: "https://picsum.photos/seed/ember-testimonial-4/120/120",
    quote:
      "N\u00e3o \u00e9 exagero: virei assinante fundadora no primeiro dia e hoje indico pra todo o meu time. Quem entra depois, entra pagando mais caro por menos vaga.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};

export default function TestimonialsSection() {
  return (
    <section
      aria-label="Depoimentos de assinantes Ember.News"
      className="relative py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
          <span className="inline-flex items-center gap-2 rounded-[3px] border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            <Quote className="h-3.5 w-3.5" aria-hidden="true" />
            Prova real, sem enrola\u00e7\u00e3o
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Quem assinou n\u00e3o quer mais viver sem
          </h2>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Estes s\u00e3o resultados reais de leitores que decidiram sair na frente. Voc\u00ea pode ser o pr\u00f3ximo caso ou pode continuar chegando atrasado.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.name}
              variants={fadeUp}
              className="testimonial-card flex flex-col gap-4 p-5 sm:p-6"
            >
              <div className="relative z-10 flex items-center gap-1" aria-label="Avalia\u00e7\u00e3o 5 de 5 estrelas">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-4 w-4 fill-primary text-primary"
                    aria-hidden="true"
                  />
                ))}
              </div>

              <p className="relative z-10 text-sm leading-relaxed text-foreground/90 sm:text-[0.95rem]">
                \u201c{testimonial.quote}\u201d
              </p>

              <div className="relative z-10 mt-auto flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={testimonial.avatar}
                  alt={`Foto de ${testimonial.name}`}
                  loading="lazy"
                  className="h-11 w-11 shrink-0 rounded-full border border-primary/40 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {testimonial.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
