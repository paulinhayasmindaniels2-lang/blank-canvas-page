import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/login")({
  head: () => ({
    title: "Entrar | Ember.News",
    meta: [
      { name: "description", content: "Acesse sua conta para ler a edição completa." },
    ],
  }),
  component: LoginComponent,
});

const VALID_EMAIL = "teste@teste.com";
const VALID_PASSWORD = "teste65s464846";

function LoginComponent() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (email.trim() === VALID_EMAIL && password === VALID_PASSWORD) {
      localStorage.setItem("demo_auth", "1");
      toast.success("Login realizado com sucesso!");
      navigate({ to: "/" });
    } else {
      const message = "E-mail ou senha incorretos.";
      setErrorMsg(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Painel do formulário */}
      <div className="flex w-full items-center justify-center px-4 py-12 sm:px-8 md:w-1/2">
        <div className="w-full max-w-sm">
          <Card className="border-border bg-card rounded-[var(--radius)] shadow-sm">
            <CardContent className="space-y-6 p-8">
              <div className="space-y-2">
                <span className="kicker text-primary">ACESSO DO LEITOR</span>
                <h1 className="headline-serif text-3xl text-foreground">
                  Entrar na edição
                </h1>
                <p className="text-sm text-muted-foreground">
                  Use suas credenciais para acessar o conteúdo completo.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="teste@teste.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>

                {errorMsg && (
                  <p role="alert" className="text-sm text-destructive">
                    {errorMsg}
                  </p>
                )}

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="btn-news-primary w-full"
                >
                  {isLoading ? "Entrando..." : "Entrar"}
                </Button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  Esqueci a senha
                </button>
                <Link
                  to="/"
                  className="font-medium text-foreground underline-offset-2 hover:underline"
                >
                  Voltar ao site
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Painel visual */}
      <div className="relative hidden w-1/2 overflow-hidden md:block">
        <img
          src="https://picsum.photos/seed/crie-um-login-de-usuario-teste-teste-teste-com-teste65s464846-1/1600/1000"
          alt="Banca de jornal"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative flex h-full flex-col items-start justify-end p-12">
          <blockquote className="max-w-md space-y-3">
            <p className="headline-serif text-2xl leading-snug text-background">
              "O jornalismo é a primeira versão da história — escrita com pressa, mas com verdade."
            </p>
            <p className="text-sm text-background/80">
              — Redação Ember.News
            </p>
          </blockquote>
        </div>
      </div>
    </div>
  );
}
