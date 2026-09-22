import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import { CheckCircle2, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const TEST_USER_EMAIL = 'donodotrafego2@teste.com'
const TEST_USER_PASSWORD = '456487898484das'

type SeedUserResult = {
  status: 'created' | 'already_exists'
  userId: string | null
  message: string
}

const createTestUser = createServerFn({ method: 'POST' }).handler(
  async (): Promise<SeedUserResult> => {
    const { supabaseServer } = await import(
      '@/integrations/supabase/client.server'
    )

    const { data, error } = await supabaseServer.auth.admin.createUser({
      email: TEST_USER_EMAIL,
      password: TEST_USER_PASSWORD,
      email_confirm: true,
    })

    if (error) {
      const alreadyExists =
        error.message?.toLowerCase().includes('already registered') ||
        error.message?.toLowerCase().includes('already exists') ||
        error.message?.toLowerCase().includes('already been registered')

      if (alreadyExists) {
        return {
          status: 'already_exists',
          userId: null,
          message: `O usuário ${TEST_USER_EMAIL} já existe.`,
        }
      }

      throw new Error(error.message ?? 'Falha ao criar usuário de teste.')
    }

    return {
      status: 'created',
      userId: data.user?.id ?? null,
      message: `Usuário ${TEST_USER_EMAIL} criado com sucesso.`,
    }
  },
)

function SeedUserPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<SeedUserResult | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleCreateUser = async () => {
    setIsLoading(true)
    setErrorMessage(null)
    setResult(null)

    try {
      const response = await createTestUser()
      setResult(response)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Erro inesperado ao criar usuário de teste.'
      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md border-border bg-card font-display">
        <CardHeader>
          <CardTitle className="text-xl text-foreground">
            Criar usuário de teste
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Ao clicar no botão abaixo, será criado (via Supabase Auth Admin) o
            usuário de teste com o email{' '}
            <span className="font-medium text-primary">
              {TEST_USER_EMAIL}
            </span>{' '}
            e senha já confirmada (email_confirm: true).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
            <p>
              <span className="text-foreground">Email:</span> {TEST_USER_EMAIL}
            </p>
            <p>
              <span className="text-foreground">Senha:</span>{' '}
              {TEST_USER_PASSWORD}
            </p>
          </div>

          <Button
            onClick={handleCreateUser}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando usuário...
              </>
            ) : (
              'Criar usuário'
            )}
          </Button>

          {result && result.status === 'created' && (
            <Alert className="border-primary/40 bg-primary/10 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <AlertTitle>Usuário criado</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {result.message}
                {result.userId && (
                  <>
                    <br />
                    <span className="text-foreground">ID:</span>{' '}
                    <span className="font-mono text-xs">{result.userId}</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {result && result.status === 'already_exists' && (
            <Alert className="border-ember/40 bg-ember/10 text-foreground">
              <CheckCircle2 className="h-4 w-4 text-ember" />
              <AlertTitle>Usuário já existe</AlertTitle>
              <AlertDescription className="text-muted-foreground">
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          {errorMessage && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Erro ao criar usuário</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export const Route = createFileRoute('/admin/seed-user')({
  component: SeedUserPage,
})
