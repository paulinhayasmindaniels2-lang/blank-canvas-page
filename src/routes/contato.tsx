import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Loader2, Mail, Send } from "lucide-react";
import { toast } from "sonner";

const contactEmail = import.meta.env.VITE_CONTACT_EMAIL || "contato@ember.news";

export const Route = createFileRoute("/contato")({
  head: () => ({
    title: "Contato | Ember.News",
    meta: [
      { name: "description", content: "Entre em contato com a equipe Ember.News." },
    ],
  }),
  component: ContactComponent,
});

function ContactComponent() {
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const subject = String(form.get("subject") || "Contato pelo site");
    const message = String(form.get("message") || "");
    const body = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
    setIsSending(false);
    toast.success("Seu aplicativo de e-mail foi aberto para enviar a mensagem.");
  };

  return (
    <main className="min-h-screen bg-background px-4 py-16 text-foreground sm:px-6 md:py-24">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.6fr_1fr] lg:items-start">
        <section className="space-y-6 lg:pt-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="size-4" />
            Voltar para o site
          </Link>
          <div className="space-y-4">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-primary">Fale conosco</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">Vamos conversar?</h1>
            <p className="max-w-[52ch] leading-relaxed text-muted-foreground">
              Tem uma sugestão, dúvida ou quer falar sobre uma pauta? Envie sua mensagem. Nossa equipe responde assim que possível.
            </p>
          </div>
          <div className="flex items-center gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <Mail className="size-5 text-primary" />
            <span>{contactEmail}</span>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <div className="grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Seu nome" type="text" placeholder="Como podemos chamar você?" required />
              <Field id="email" label="Seu e-mail" type="email" placeholder="voce@exemplo.com" required />
            </div>
            <Field id="subject" label="Assunto" type="text" placeholder="Sobre o que você quer falar?" required />
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-foreground">Mensagem</label>
              <textarea
                id="message"
                name="message"
                required
                rows={7}
                placeholder="Escreva sua mensagem..."
                className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <button
              type="submit"
              disabled={isSending || sent}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-card active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              {sent ? "Mensagem preparada" : "Enviar mensagem"}
            </button>
            <p className="text-center text-xs leading-relaxed text-muted-foreground">
              O botão abrirá seu aplicativo de e-mail com a mensagem preenchida.
            </p>
          </form>
        </section>
      </div>
    </main>
  );
}

function Field({ id, label, type, placeholder, required }: { id: string; label: string; type: string; placeholder: string; required?: boolean }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">{label}</label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
