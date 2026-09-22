import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const SEED_EMAIL = 'donodotrafego@teste.com'
const SEED_PASSWORD = '456487898484das'

type SeedUserResult =
  | { status: 'created'; userId: string; email: string }
  | { status: 'exists'; email: string }
  | { status: 'error'; message: string }

const createSeedUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SeedUserResult> => {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: SEED_EMAIL,
        password: SEED_PASSWORD,
        email_confirm: true,
      })

      if (error) {
        const message = error.message ?? ''
        const alreadyExists =
          message.toLowerCase().includes('already') ||
          message.toLowerCase().includes('registered') ||
          message.toLowerCase().includes('exists') ||
          error.status === 422

        if (alreadyExists) {
          return { status: 'exists', email: SEED_EMAIL }
        }

        return { status: 'error', message }
      }

      if (!data?.user) {
        return {
          status: 'error',
          message: 'Resposta inesperada do Supabase: usuário não retornado.',
        }
      }

      return { status: 'created', userId: data.user.id, email: SEED_EMAIL }
    } catch (err) {
      return {
        status: 'error',
        message: err instanceof Error ? err.message : 'Erro desconhecido ao criar usuário.',
      }
    }
  },
)

export const Route = createFileRoute('/admin/seed-user')({
  component: SeedUserPage,
})

function SeedUserPage() {
  const [result, setResult] = useState<SeedUserResult | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleCreate() {
    setLoading(true)
    setResult(null)
    try {
      const res = await createSeedUser()
      setResult(res)
    } catch (err) {
      setResult({
        status: 'error',
        message: err instanceof Error ? err.message : 'Falha ao chamar a função do servidor.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-background flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-md rounded-[var(--radius)] border border-border bg-card/40 backdrop-blur-md p-8 hud-corner">
        <h1 className="font-display uppercase text-2xl tracking-wide text-foreground mb-3">
          Criar usuário seed
        </h1>
        <p className="text-sm text-muted-foreground mb-6 font-mono leading-relaxed">
          Esta página cria (ou confirma a existência) do usuário administrador padrão diretamente no
          banco de dados via Supabase Admin API, com e-mail já confirmado.
        </p>

        <div className="mb-6 space-y-1 text-xs font-mono text-muted-foreground border border-border rounded-[var(--radius)] p-3 bg-background/40">
          <p>
            <span className="text-foreground">email:</span> {SEED_EMAIL}
          </p>
          <p>
            <span className="text-foreground">senha:</span> {'*'.repeat(SEED_PASSWORD.length)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreate}
          disabled={loading}
          className="btn-hero-green w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando...' : 'Criar usuário agora'}
        </button>

        {result && (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 text-sm font-mono rounded-[var(--radius)] border border-border p-4"
          >
            {result.status === 'created' && (
              <p className="text-logo-green">
                Usuário criado com sucesso. ID: <span className="break-all">{result.userId}</span>
              </p>
            )}
            {result.status === 'exists' && (
              <p className="text-logo-green">
                O usuário {result.email} já existe no banco de dados.
              </p>
            )}
            {result.status === 'error' && (
              <p className="text-destructive">Erro: {result.message}</p>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
