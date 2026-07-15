import { Suspense } from 'react'
import { Logo } from '@/components/logo'
import { RecuperarForm } from '@/components/auth/recuperar-form'

export default function RecuperarPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo href="/" />
      </div>
      <Suspense fallback={null}>
        <RecuperarForm />
      </Suspense>
    </div>
  )
}
