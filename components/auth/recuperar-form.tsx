'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { recuperarContrasena } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Mail, ArrowLeft } from 'lucide-react'

export function RecuperarForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const enviado = searchParams.get('enviado')

  if (enviado) {
    return (
      <Card className="w-full max-w-sm bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Revisa tu correo</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Te hemos enviado un enlace para restablecer tu contraseña
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10">
              <Mail className="size-7 text-gray-700 dark:text-gray-300" />
            </div>
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              Si existe una cuenta con ese correo, recibirás un enlace de recuperación en unos minutos.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center rounded-lg border border-gray-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-sm h-8 gap-1.5 px-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 transition-all hover:bg-white/80 dark:hover:bg-white/10"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio de sesión
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-sm bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Recuperar contraseña</CardTitle>
        <CardDescription className="text-gray-500 dark:text-gray-400">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={recuperarContrasena} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Correo electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="tu@correo.com"
              required
              className="bg-white/60 dark:bg-white/5 border-white/50 dark:border-white/10 backdrop-blur-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button type="submit" className="w-full bg-gray-900 text-white hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 shadow-md">
            Enviar enlace
          </Button>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            <Link href="/login" className="font-medium text-gray-900 dark:text-white underline underline-offset-4 inline-flex items-center gap-1">
              <ArrowLeft className="size-3" />
              Volver al inicio de sesión
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
