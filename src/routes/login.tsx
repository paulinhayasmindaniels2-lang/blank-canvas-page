import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import estatuaVideo from "@/assets/estatua.mp4.asset.json";
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    title: "Login | Ember.News",
    meta: [
      { name: "description", content: "Faça login ou crie sua conta no Ember.News para acessar conteúdos exclusivos." },
    ],
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        window.location.href = "/";
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast.success("Cadastro realizado! Verifique seu e-mail.");
      }
    } catch (error: any) {
      const message = error?.message || "Ocorreu um erro na autenticação.";
      setErrorMsg(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
    } catch (error: any) {
      toast.error("Erro ao entrar com Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* Fundo animado — auroras neon derivadas do token primary */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="video-aurora absolute -left-1/4 -top-1/3 size-[70vw] rounded-full" />
        <div className="video-aurora-2 absolute -bottom-1/3 -right-1/4 size-[65vw] rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,transparent_0%,var(--background)_75%)]" />
      </div>

      {/* Painel visual — vídeo com overlay, oculto em telas pequenas */}
      <div className="relative hidden w-[45%] overflow-hidden lg:block">
        <video
          src={estatuaVideo.url}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background" />

        <div className="relative flex h-full flex-col justify-between p-10">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-lg uppercase tracking-widest text-foreground">
            <span className="size-2.5 rounded-full bg-ember" />
            Ember<span className="text-foreground">.</span>News
          </Link>

          <blockquote className="max-w-sm space-y-4">
            <p className="font-display text-2xl leading-tight tracking-tight text-foreground">
              "As notícias que moldam o amanhã, contadas com precisão."
            </p>
            <p className="text-sm text-muted-foreground">
              Junte-se a milhares de leitores acompanhando tecnologia, cultura e o mundo em tempo real.
            </p>
          </blockquote>
        </div>
      </div>

      {/* Painel do formulário */}
      <div className="flex w-full flex-1 items-center justify-center px-4 py-12 sm:px-8 lg:w-[55%]">
        <div className="w-full max-w-sm space-y-8">
          <div>
            <Link
              to="/"
              className="mb-8 inline-flex items-center gap-2 font-display text-xl uppercase tracking-widest text-foreground lg:hidden"
            >
              <span className="size-2.5 rounded-full bg-ember" />
              Ember<span className="text-foreground">.</span>News
            </Link>

            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {isLogin ? "Bem-vindo de volta" : "Criar sua conta"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {isLogin
                ? "Entre para acessar conteúdos exclusivos."
                : "Junte-se à nossa comunidade de tecnologia."}
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleAuth} noValidate>
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="voce@exemplo.com"
                  className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => toast.info("Verifique seu e-mail para redefinir a senha em breve.")}
                    className="text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline"
                  >
                    Esqueceu a senha?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-11 text-sm text-foreground placeholder:text-muted-foreground transition-colors focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <p role="alert" className="text-xs text-destructive">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isLogin ? (
                "Entrar"
              ) : (
                "Criar conta"
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading}
            className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <GoogleIcon className="size-4" />
                Google
              </>
            )}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg(null);
              }}
              className="font-semibold text-foreground underline-offset-2 transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
            >
              {isLogin ? "Cadastre-se" : "Faça login"}
            </button>
          </p>

          <Link
            to="/"
            className="group flex items-center justify-center gap-2 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-1" />
            Voltar para o site
          </Link>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.44c-.28 1.48-1.13 2.73-2.4 3.58v2.98h3.89c2.28-2.1 3.56-5.2 3.56-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.93-2.9l-3.89-2.98c-1.08.72-2.46 1.15-4.04 1.15-3.1 0-5.73-2.09-6.67-4.9H1.32v3.07C3.29 21.3 7.32 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.33 14.37A7.2 7.2 0 0 1 4.96 12c0-.82.14-1.62.37-2.37V6.56H1.32A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.32 5.44l4.01-3.07z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.79l3.44-3.44C17.94 1.19 15.24 0 12 0 7.32 0 3.29 2.7 1.32 6.56l4.01 3.07C6.27 6.84 8.9 4.75 12 4.75z"
      />
    </svg>
  );
}
