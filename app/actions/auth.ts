"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { loginSchema, signupSchema, recuperarSchema } from "@/lib/validation/schemas"
import { sanitizeText } from "@/lib/security/sanitize"
import { checkRateLimit } from "@/lib/security/rate-limiter"

export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const ip = "global"
  const rateCheck = checkRateLimit(`login:${email}`, 5, 15 * 60 * 1000)
  if (!rateCheck.allowed) {
    const minutos = Math.ceil(rateCheck.resetIn / 60000)
    redirect(
      `/login?error=${encodeURIComponent(`Demasiados intentos. Intenta de nuevo en ${minutos} minutos.`)}`
    )
  }

  const parsed = loginSchema.safeParse({ email, password })
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message || "Datos inválidos"
    redirect(`/login?error=${encodeURIComponent(error)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    redirect(`/login?error=${encodeURIComponent(traducirError(error.message))}`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    const supabaseAudit = await createClient()
    await supabaseAudit.from("auditoria").insert({
      usuario_id: user.id,
      accion: "login",
      entidad: "auth",
      detalles: null,
      ip: null,
    }).maybeSingle()
  }

  revalidatePath("/", "layout")
  redirect("/dashboard")
}

export async function signup(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string
  const nombre = formData.get("nombre") as string
  const apellido = formData.get("apellido") as string

  const ip = "global"
  const rateCheck = checkRateLimit(`signup:${email}`, 3, 15 * 60 * 1000)
  if (!rateCheck.allowed) {
    const minutos = Math.ceil(rateCheck.resetIn / 60000)
    redirect(
      `/register?error=${encodeURIComponent(`Demasiados intentos. Intenta de nuevo en ${minutos} minutos.`)}`
    )
  }

  const parsed = signupSchema.safeParse({ email, password, confirmPassword, nombre, apellido })
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message || "Datos inválidos"
    redirect(`/register?error=${encodeURIComponent(error)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: {
        nombre: sanitizeText(parsed.data.nombre),
        apellido: sanitizeText(parsed.data.apellido),
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
    },
  })

  if (error) {
    console.error("Signup Supabase error:", error)
    redirect(`/register?error=${encodeURIComponent(traducirError(error.message))}`)
  }

  redirect("/register/revisa-tu-correo")
}

export async function recuperarContrasena(formData: FormData) {
  const email = formData.get("email") as string

  const ip = "global"
  const rateCheck = checkRateLimit(`recuperar:${email}`, 3, 15 * 60 * 1000)
  if (!rateCheck.allowed) {
    const minutos = Math.ceil(rateCheck.resetIn / 60000)
    redirect(
      `/recuperar?error=${encodeURIComponent(`Demasiados intentos. Intenta de nuevo en ${minutos} minutos.`)}`
    )
  }

  const parsed = recuperarSchema.safeParse({ email })
  if (!parsed.success) {
    const error = parsed.error.issues[0]?.message || "Correo inválido"
    redirect(`/recuperar?error=${encodeURIComponent(error)}`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
  })

  if (error) {
    redirect(`/recuperar?error=${encodeURIComponent(traducirError(error.message))}`)
  }

  redirect("/recuperar?enviado=true")
}

export async function logout() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const supabaseAudit = await createClient()
    await supabaseAudit.from("auditoria").insert({
      usuario_id: user.id,
      accion: "logout",
      entidad: "auth",
      detalles: null,
      ip: null,
    }).maybeSingle()
  }

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error("Logout error:", error.message)
  }
  revalidatePath("/", "layout")
  redirect("/login")
}

function traducirError(mensaje: string): string {
  if (!mensaje) return "Error inesperado. Intenta de nuevo."
  const errores: Record<string, string> = {
    "invalid login credentials": "Correo o contraseña incorrectos",
    "user already registered": "Ya existe una cuenta con este correo",
    "email not confirmed": "Debes confirmar tu correo antes de iniciar sesión",
    "password should be at least 6 characters": "La contraseña debe tener al menos 6 caracteres",
    "email rate limit exceeded": "Demasiados intentos con este correo. Espera una hora e intenta de nuevo.",
  }
  return errores[mensaje.toLowerCase()] ?? mensaje
}
