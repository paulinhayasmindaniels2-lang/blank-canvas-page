import { createFileRoute, Link } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { supabaseAdmin } from '@/integrations/supabase/client.server'

const TEST_USER = {
  email: 'teste@doakdo.com',
  password: 'dasd468486',
} as const

type SeedResult = {
  status: 'created' | 'updated'
  email: string
}

const seedTestUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SeedResult> => {
    const { data: listData, error: listError } =
      await supabaseAdmin.auth.admin.listUsers()

    if (listError) {
      throw new Error(listError.message)
    }

    const existingUser = listData.users.find(
      (u) => u.email?.toLowerCase() === TEST_USER.email.toLowerCase(),
    )

    if (existingUser) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        existingUser.id,
        { password: TEST_USER.password },
      )

      if (updateError) {
        throw new Error(updateError.message)
      }

      return { status: 'updated', email: TEST_USER.email }
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: TEST_USER.email,
      password: TEST_USER.password,
      email_confirm: true,
    })

    if (!error && data?.user) {
      return { status: 'created', email: TEST_USER.email }
    }

    const message = error?.message?.toLowerCase() ?? ''
    const alreadyExists =
      message.includes('already') ||
      message.includes('registered') ||
      message.includes('exists') ||
      error?.status === 422

    if (!alreadyExists) {
      throw new Error(error?.message ?? `Falha ao criar usuário de teste ${TEST_USER.email}`)
    }

    const { data: refreshedList, error: refreshError } =
      await supabaseAdmin.auth.admin.listUsers()

    if (refreshError) {
      throw new Error(refreshError.message)
    }

    const conflictingUser = refreshedList.users.find(
      (u) => u.email?.toLowerCase() === TEST_USER.email.toLowerCase(),
    )

    if (!conflictingUser) {
      throw new Error(`Usuário ${TEST_USER.email} não encontrado após conflito de criação`)
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      conflictingUser.id,
      { password: TEST_USER.password },
    )

    if (updateError) {
      throw new Error(updateError.message)
    }

    return { status: 'updated', email: TEST_USER.email }
  },
)

export const Route = createFileRoute('/admin/seed-user')({
  head: () => ({
    title: 'Seed de usuário | Ember.News',
  }),
  component: SeedUserPage,
})

function SeedUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [hasRun, setHasRun] = useState(false)
  const [result, setResult] = useState<SeedResult | null>(null)

  const runSeed = async () => {
    setIsLoading(true)
    try {
      const seedResult = await seedTestUser()
      setResult(seedResult)

      if (seedResult.status === 'created') {
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
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <Card className="card-hairline rounded-[var(--radius)] shadow-sm">
          <CardContent className="space-y-6 p-8">
            <div className="space-y-2">
              <span className="kicker text-primary">UTILITÁRIO INTERNO</span>
              <h1 className="headline-serif text-3xl text-foreground">
                Seed de usuário de teste
              </h1>
              <p className="text-sm text-muted-foreground">
                Cria (ou atualiza a senha de) um usuário de teste no Supabase para
                permitir login imediato na edição.
              </p>
            </div>

            <div
              className="space-y-3 rounded-[var(--radius)] border border-border bg-muted/40 p-4 text-sm"
              role="group"
              aria-label="Credenciais do usuário de teste"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">E-mail</span>
                <span className="break-all font-medium text-foreground">
                  {TEST_USER.email}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Senha</span>
                <span className="font-medium text-foreground">
                  {TEST_USER.password}
                </span>
              </div>
            </div>

            {result && (
              <div className="flex items-center gap-2 rounded-[var(--radius)] border border-primary/20 bg-primary/5 p-3 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>
                  {result.status === 'created'
                    ? 'Usuário criado com sucesso.'
                    : 'Usuário já existia; senha sincronizada.'}
                </span>
              </div>
            )}

            <div className="space-y-3">
              <Button
                type="button"
                onClick={runSeed}
                disabled={isLoading}
                className="btn-news-primary w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    Executando...
                  </>
                ) : (
                  'Criar / sincronizar usuário'
                )}
              </Button>

              <Link
                to="/login"
                className="block text-center text-sm text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
              >
                Ir para a página de login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
