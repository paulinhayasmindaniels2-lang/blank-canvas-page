import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const TEST_EMAIL = 'caio@teste.com'
const TEST_PASSWORD = 'caioteste2625'

type SeedResult = {
  status: 'created' | 'updated'
  email: string
}

const seedTestUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SeedResult> => {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      email_confirm: true,
    })

    if (!error && data?.user) {
      return { status: 'created', email: TEST_EMAIL }
    }

    const message = error?.message?.toLowerCase() ?? ''
    const alreadyExists =
      message.includes('already') ||
      message.includes('registered') ||
      message.includes('exists') ||
      error?.status === 422

    if (!alreadyExists) {
      throw new Error(error?.message ?? 'Falha ao criar usuário de teste')
    }

    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      throw new Error(listError.message)
    }

    const existingUser = listData.users.find(
      (u) => u.email?.toLowerCase() === TEST_EMAIL.toLowerCase(),
    )

    if (!existingUser) {
      throw new Error('Usuário não encontrado após conflito de criação')
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existingUser.id,
      { password: TEST_PASSWORD },
    )

    if (updateError) {
      throw new Error(updateError.message)
    }

    return { status: 'updated', email: TEST_EMAIL }
  },
)

export const Route = createFileRoute('/admin/seed-user')({
  component: SeedUserPage,
})

function SeedUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)

  const runSeed = async () => {
    setIsLoading(true)
    try {
      const result = await seedTestUser()
      if (result.status === 'created') {
        toast.success('Usuário de teste criado com sucesso.')
      } else {
        toast.success('Usuário já existia — senha atualizada.')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro desconhecido ao criar usuário.'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!hasRun) {
      setHasRun(true)
      void runSeed()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background px-4 py-12 font-mono">
      <div className="relative w-full max-w-md border border-border bg-card p-8">
        <span className="hud-corner hud-corner-tl" aria-hidden="true" />
        <span className="hud-corner hud-corner-tr" aria-hidden="true" />
        <span className="hud-corner hud-corner-bl" aria-hidden="true" />
        <span className="hud-corner hud-corner-br" aria-hidden="true" />

        <h1 className="text-sm uppercase tracking-[0.3em] text-primary mb-1">
          root@ember
        </h1>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
          seed :: usuário de teste
        </p>

        <div
          className="mb-6 border border-border bg-background/60 p-4 font-mono text-xs leading-relaxed"
          role="group"
          aria-label="Credenciais do usuário de teste"
        >
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> email
          </p>
          <p className="mb-2 break-all text-foreground">{TEST_EMAIL}</p>
          <p className="text-muted-foreground">
            <span className="text-primary">$</span> senha
          </p>
          <p className="text-foreground">{TEST_PASSWORD}</p>
        </div>

        <button
          type="button"
          onClick={runSeed}
          disabled={isLoading}
          className="btn-hero-green flex w-full items-center justify-center gap-2 text-xs uppercase tracking-widest disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              executando...
            </>
          ) : (
            'Criar usuário teste'
          )}
        </button>
      </div>
    </div>
  )
}
