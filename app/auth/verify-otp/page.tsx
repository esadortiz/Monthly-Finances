"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useState, useRef, type KeyboardEvent, type ClipboardEvent } from "react"
import { createClient } from "@/lib/supabase/client"
import { Logo } from "@/components/logo"

function VerifyOtpForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email") ?? ""
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [digits, setDigits] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newDigits = [...digits]
    newDigits[index] = value.slice(-1)
    setDigits(newDigits)
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const text = e.clipboardData.getData("text")
    const nums = text.replace(/\D/g, "").slice(0, 6).split("")
    const newDigits = [...digits]
    nums.forEach((d, i) => { newDigits[i] = d })
    setDigits(newDigits)
    const focusIndex = Math.min(nums.length, 5)
    inputRefs.current[focusIndex]?.focus()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = digits.join("")
    if (code.length !== 6) {
      setError("Ingresa el código completo de 6 dígitos")
      return
    }
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "signup",
    })

    if (verifyError) {
      const msg = verifyError.message === "Token has expired or is invalid"
        ? "El código expiró o es inválido. Solicita uno nuevo."
        : verifyError.message
      setError(msg)
      setLoading(false)
      return
    }

    router.push("/dashboard")
  }

  async function handleResend() {
    setLoading(true)
    setError("")
    const supabase = createClient()
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/confirm` },
    })
    if (resendError) {
      setError(resendError.message)
    }
    setLoading(false)
  }

  if (!email) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <p className="text-red-500">Falta el correo electrónico. Vuelve a <a href="/register" className="underline">registrarte</a>.</p>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="mb-8">
        <Logo href="/" />
      </div>
      <div className="w-full max-w-sm rounded-xl border border-white/40 bg-white/70 p-8 text-center shadow-[0_8px_40px_rgba(0,0,0,0.08)] backdrop-blur-2xl dark:border-white/10 dark:bg-white/5 dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)]">
        <h1 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">Verifica tu correo</h1>
        <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
          Enviamos un código de 6 dígitos a <strong>{email}</strong>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center gap-2">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="size-11 rounded-lg border border-gray-300 bg-white text-center text-xl font-bold text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 dark:border-gray-600 dark:bg-white/5 dark:text-white dark:focus:border-white dark:focus:ring-white"
              />
            ))}
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
          >
            {loading ? "Verificando..." : "Verificar código"}
          </button>
        </form>

        <p className="mt-6 text-xs text-gray-400">
          ¿No recibiste el código?{" "}
          <button onClick={handleResend} disabled={loading} className="text-gray-900 underline hover:text-gray-700 dark:text-white dark:hover:text-gray-300">
            Reenviar
          </button>
        </p>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpForm />
    </Suspense>
  )
}
