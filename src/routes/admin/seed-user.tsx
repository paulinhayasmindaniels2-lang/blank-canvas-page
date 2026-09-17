import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2, UserPlus, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";

const SEED_EMAIL = "reidolol@teste.com";
const SEED_PASSWORD = "123456";

const createTestUser = createServerFn({ method: "POST" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  // Verifica se o usuário já existe (para não duplicar)
  const { data: existingList, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) throw new Error(listError.message);

  const found = existingList?.users?.find((u) => u.email === SEED_EMAIL);

  if (found) {
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(found.id, {
      password: SEED_PASSWORD,
      email_confirm: true,
    });
    if (updateError) throw new Error(updateError.message);
    return { created: false, updated: true, email: SEED_EMAIL };
  }

  const { error: createError } = await supabaseAdmin.auth.admin.createUser({
    email: SEED_EMAIL,
    password: SEED_PASSWORD,
    email_confirm: true,
  });
  if (createError) throw new Error(createError.message);

  return { created: true, updated: false, email: SEED_EMAIL };
});

export const Route = createFileRoute("/admin/seed-user")({
  head: () => ({
    title: "Criar usuário de teste | Ember.Admin",
    meta: [
      { name: "description", content: "Utilitário administrativo para criar o usuário de teste." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SeedUserComponent,
});

type Status = "idle" | "loading" | "success" | "error";

function SeedUserComponent() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  const runSeed = async () => {
    setStatus("loading");
    setMessage("");
    try {
      const result = await createTestUser();
      const text = result.created
        ? `Usuário ${result.email} criado com sucesso.`
        : `Usuário ${result.email} já existia — senha atualizada para a solicitada.`;
      setStatus("success");
      setMessage(text);
      toast.success(text);
    } catch (error: any) {
      const msg = error?.message || "Falha ao criar o usuário de teste.";
      setStatus("error");
      setMessage(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    runSeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="video-aurora absolute -left-1/4 -top-1/3 size-[800px] rounded-full will-change-transform" />
        <div className="video-aurora-2 absolute -right-1/4 -bottom-1/3 size-[800px] rounded-full will-change-transform" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0%,var(--background)_80%)]" />
      </div>

      <div className="relative w-full max-w-md space-y-8 rounded-2xl border border-border bg-card/50 p-8 shadow-2xl backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserPlus className="size-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Criar usuário de teste
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Cria (ou atualiza a senha de) <span className="font-medium text-foreground">{SEED_EMAIL}</span>{" "}
            com a senha definida, já com e-mail confirmado.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Criando usuário...
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground">
              <CheckCircle2 className="size-4 text-primary" />
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              <XCircle className="size-4" />
              {message}
            </div>
          )}

          <button
            type="button"
            onClick={runSeed}
            disabled={status === "loading"}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50"
          >
            {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : "Executar novamente"}
          </button>
        </div>

        <div className="mt-4 flex flex-col items-center gap-4 border-t border-border pt-6">
          <Link
            to="/login"
            className="group flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            Ir para a página de login
          </Link>
        </div>
      </div>
    </div>
  );
}
