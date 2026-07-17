"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Suspense, useEffect, useState } from "react"

function ConfirmHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const code = searchParams.get("code")
    const token_hash = searchParams.get("token_hash")
    const type = searchParams.get("type")
    const next = searchParams.get("next") ?? "/dashboard"

    async function handleConfirm() {
      const supabase = createClient()

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          router.push(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
          return
        }
        router.push(next)
        return
      }

      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          type: type as "signup" | "email" | "recovery" | "invite",
          token_hash,
        })
        if (error) {
          router.push(`/auth/auth-code-error?error=${encodeURIComponent(error.message)}`)
          return
        }
        router.push(next)
        return
      }

      router.push("/auth/auth-code-error")
    }

    handleConfirm()
  }, [searchParams, router])

  return null
}

export default function ConfirmPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<p className="text-muted-foreground">Confirmando...</p>}>
        <ConfirmHandler />
      </Suspense>
    </div>
  )
}
