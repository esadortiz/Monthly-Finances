import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default async function AuthCodeErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-sm text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Link inválido o expirado</CardTitle>
          <CardDescription>
            {error
              ? `Error: ${error}`
              : 'Este link de confirmación ya no es válido. Intenta registrarte de nuevo o inicia sesión si ya confirmaste tu cuenta antes.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <Link href="/login" className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/80">
            Ir a iniciar sesión
          </Link>
          <Link href="/register" className="inline-flex h-8 items-center justify-center rounded-lg border px-4 text-sm font-medium hover:bg-muted">
            Registrarme de nuevo
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
