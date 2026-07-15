import { Suspense } from 'react'
import { Logo } from '@/components/logo'
import { RegisterForm } from '@/components/auth/register-form'
import { AuthBackground } from '@/components/auth/auth-background'

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-background text-black">
      <AuthBackground />
      <div className="relative z-10 mb-8">
        <Logo href="/" variant="dark" />
      </div>
      <Suspense fallback={null}>
        <RegisterForm />
      </Suspense>
    </div>
  )
}
