import { Logo } from '@/components/logo'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function RevisaTuCorreoPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo href="/" />
      </div>
      <Card className="w-full max-w-sm text-center bg-white/70 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-white/10">
              <svg className="size-7 text-gray-700 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Revisa tu correo</CardTitle>
          <CardDescription className="text-gray-500 dark:text-gray-400">
            Te enviamos un link de confirmacion. Haz clic en el para activar
            tu cuenta y poder iniciar sesion en Monthly Finances.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Si no lo ves en unos minutos, revisa la carpeta de spam.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

