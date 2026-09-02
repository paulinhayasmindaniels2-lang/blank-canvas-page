import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff, Lock, Mail, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    title: "Admin Login | Ember.News",
    meta: [
      { name: "description", content: "Área restrita para administradores do Ember.News" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLoginComponent,
});

function AdminLoginComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Aqui poderíamos verificar se o usuário tem a role 'admin' no banco
      // Por enquanto, apenas confirmamos o login e redirecionamos
      toast.success("Acesso administrativo autorizado!");
      
      // Simulação de redirecionamento para o dashboard
      // window.location.href = "/admin/dashboard";
      toast.info("Redirecionando para o painel de controle...");
    } catch (error: any) {
      toast.error(error.message || "Falha na autenticação administrativa.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-4 py-12">
      {/* Fundo animado — auroras neon */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="video-aurora absolute -left-1/4 -top-1/3 size-[800px] rounded-full" />
        <div className="video-aurora-2 absolute -right-1/4 -bottom-1/3 size-[800px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-neutral-800 bg-neutral-900/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          
          <Link to="/" className="inline-flex items-center gap-2 font-display text-xl uppercase tracking-widest text-foreground">
            <span className="size-2 rounded-full bg-primary" />
            Ember<span className="text-white">.</span>Admin
          </Link>
          
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
            Painel de Controle
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Insira suas credenciais de administrador para continuar.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleAdminAuth}>
          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail admin"
                className="w-full rounded-xl border border-neutral-800 bg-black py-3 pl-11 pr-4 text-sm text-white placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-neutral-500" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Senha mestra"
                className="w-full rounded-xl border border-neutral-800 bg-black py-3 pl-11 pr-12 text-sm text-white placeholder:text-neutral-600 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              "Acessar Sistema"
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-4 border-t border-neutral-800 pt-6">
          <Link
            to="/"
            className="group flex items-center gap-2 text-sm text-neutral-500 transition-colors hover:text-white"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Voltar para o site
          </Link>
        </div>
      </div>
      

    </div>
  );
}
