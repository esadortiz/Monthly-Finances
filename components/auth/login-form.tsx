'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { login } from '@/app/actions/auth'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { AuthFloatingInput } from '@/components/auth/auth-floating-input'

export function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative w-full max-w-[380px] p-[40px_24px] sm:p-[50px_40px] bg-white/70 backdrop-blur-[12px] rounded-2xl border border-white/30 shadow-[0_25px_50px_rgba(0,0,0,0.1)] dark:bg-white/5 dark:border-white/10 dark:shadow-[0_25px_50px_rgba(0,0,0,0.2)] z-10">
      <h2 className="text-gray-900 dark:text-white text-center mb-[45px] text-xl font-semibold tracking-[1px]">
        Iniciar sesión
      </h2>

      <form action={login}>
        <AuthFloatingInput
          id="email"
          name="email"
          type="email"
          label="Correo electrónico"
          icon={<Mail className="size-4" />}
          required
        />

        <AuthFloatingInput
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          label="Contraseña"
          icon={<Lock className="size-4" />}
          required
          endAdornment={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-2.5 text-gray-400 dark:text-white/50 hover:text-gray-600 dark:hover:text-white/80 transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          }
        />

        <div className="flex justify-end -mt-5 mb-5">
          <Link
            href="/recuperar"
            className="text-xs text-gray-400 dark:text-white/50 hover:text-gray-700 dark:hover:text-sky-300 transition-colors"
          >
            ¿Olvidaste tu contraseña?
          </Link>
        </div>

        {error && (
          <p className="text-sm text-red-500 dark:text-red-400 text-center mb-4">{error}</p>
        )}

        <button
          type="submit"
          className="w-full py-[14px] bg-gray-900 border-none rounded-lg text-white text-sm font-semibold tracking-[1.5px] uppercase cursor-pointer transition-all duration-300 hover:bg-gray-800 hover:shadow-lg hover:-translate-y-px active:translate-y-0 mt-2.5"
        >
          Ingresar
        </button>

        <p className="text-center mt-8 text-gray-500 dark:text-white/70 text-sm">
          ¿No tienes cuenta?{' '}
          <Link href="/register" className="text-black dark:text-gray-300 font-semibold no-underline hover:text-gray-600 ml-1">
            Regístrate
          </Link>
        </p>
      </form>
    </div>
  )
}
