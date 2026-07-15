import { Suspense } from 'react'
import { Logo } from '@/components/logo'
import { LoginForm } from '@/components/auth/login-form'
import { AuthBackground } from '@/components/auth/auth-background'

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center p-4 overflow-hidden bg-background text-black">
      <AuthBackground />
      <div className="relative z-10 mb-8">
        <Logo href="/" variant="dark" />
      </div>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
