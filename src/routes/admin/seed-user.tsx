import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const TEST_USERS = [
  { email: 'caio@teste.com', password: 'caioteste2625' },
  { email: 'teste2@teste.com', password: 'teste2025senha' },
] as const

type SeedResult = {
  status: 'created' | 'updated'
  email: string
}

const seedTestUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SeedResult[]> => {
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      throw new Error(listError.message)
    }

    const results: SeedResult[] = []

    for (const user of TEST_USERS) {
      const existingUser = listData.users.find(
        (u) => u.email?.toLowerCase() === user.email.toLowerCase(),
      )

      if (existingUser) {
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          existingUser.id,
          { password: user.password },
        )

        if (updateError) {
          throw new Error(updateError.message)
        }

        results.push({ status: 'updated', email: user.email })
        continue
      }

      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
      })

      if (!error && data?.user) {
        results.push({ status: 'created', email: user.email })
        continue
      }

      const message = error?.message?.toLowerCase() ?? ''
      const alreadyExists =
        message.includes('already') ||
        message.includes('registered') ||
        message.includes('exists') ||
        error?.status === 422

      if (!alreadyExists) {
        throw new Error(error?.message ?? `Falha ao criar usuário de teste ${user.email}`)
      }

      const { data: refreshedList, error: refreshError } =
        await supabaseAdmin.auth.admin.listUsers()

      if (refreshError) {
        throw new Error(refreshError.message)
      }

      const conflictingUser = refreshedList.users.find(
        (u) => u.email?.toLowerCase() === user.email.toLowerCase(),
      )

      if (!conflictingUser) {
        throw new Error(`Usuário ${user.email} não encontrado após conflito de criação`)
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        conflictingUser.id,
        { password: user.password },
      )

      if (updateError) {
        throw new Error(updateError.message)
      }

      results.push({ status: 'updated', email: user.email })
    }

    return results
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
      const results = await seedTestUser()
      const createdCount = results.filter((r) => r.status === 'created').length
      const updatedCount = results.filter((r) => r.status === 'updated').length

      if (createdCount > 0 && updatedCount === 0) {
        toast.success('Usuários de teste criados com sucesso.')
      } else if (createdCount > 0 && updatedCount > 0) {
        toast.success('Usuários de teste sincronizados (alguns criados, outros com senha atualizada).')
      } else {
        toast.success('Usuários já existiam — senhas atualizadas.')
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Erro desconhecido ao criar usuários.'
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
          seed :: usuários de teste
        </p>

        <div className="mb-6 space-y-4">
          {TEST_USERS.map((user) => (
            <div
              key={user.email}
              className="border border-border bg-background/60 p-4 font-mono text-xs leading-relaxed"
              role="group"
              aria-label={`Credenciais do usuário de teste ${user.email}`}
            >
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> email
              </p>
              <p className="mb-2 break-all text-foreground">{user.email}</p>
              <p className="text-muted-foreground">
                <span className="text-primary">$</span> senha
              </p>
              <p className="text-foreground">{user.password}</p>
            </div>
          ))}
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
            'Criar usuários teste'
          )}
        </button>
      </div>
    </div>
  )
}
