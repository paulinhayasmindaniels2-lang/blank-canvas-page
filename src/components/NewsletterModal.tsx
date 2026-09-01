import { useEffect, useState } from "react";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const STORAGE_KEY = "ember-newsletter-seen";
const OPEN_DELAY_MS = 1500;

export function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const alreadySeen = window.localStorage.getItem(STORAGE_KEY);
    if (alreadySeen) return;
    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const dismiss = () => {
    setOpen(false);
    window.localStorage.setItem(STORAGE_KEY, "1");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setLoading(true);
    const { error } = await supabase
      .from("newsletter_subscribers" as never)
      .insert({ email: trimmed } as never);
    setLoading(false);

    if (error) {
      if (error.code === "23505") {
        toast.info("Esse e-mail já está inscrito.");
        dismiss();
        return;
      }
      toast.error("Não foi possível concluir sua inscrição. Tente novamente.");
      return;
    }

    setSuccess(true);
    window.localStorage.setItem(STORAGE_KEY, "1");
    toast.success("Inscrição confirmada!");
    window.setTimeout(() => setOpen(false), 1800);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? setOpen(true) : dismiss())}>
      <DialogContent className="border-border/60 bg-card sm:max-w-md">
        {success ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary">
              <CheckCircle2 className="size-6" />
            </span>
            <p className="text-base font-semibold text-foreground">Você está inscrito!</p>
            <p className="text-sm text-muted-foreground">
              Em breve você recebe as principais notícias direto no seu e-mail.
            </p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <span className="mb-2 flex size-11 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Mail className="size-5" />
              </span>
              <DialogTitle className="font-display text-xl text-foreground">
                Não perca nenhuma notícia
              </DialogTitle>
              <DialogDescription>
                Inscreva-se e receba, direto no seu e-mail, a curadoria diária das principais
                notícias de tecnologia do Ember.News.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Seu e-mail
              </label>
              <Input
                id="newsletter-email"
                type="email"
                required
                autoComplete="email"
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="focus-visible:ring-2 focus-visible:ring-ring"
              />
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Inscrevendo...
                  </>
                ) : (
                  "Inscrever-se"
                )}
              </Button>
              <button
                type="button"
                onClick={dismiss}
                className="text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Agora não
              </button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
