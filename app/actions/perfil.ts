"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { perfilSchema, cambiarPasswordSchema } from "@/lib/validation/schemas"
import { sanitizeText } from "@/lib/security/sanitize"

export type ActionResult = {
  success: boolean
  message: string
}

async function getUserOrThrow() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return { supabase, user }
}

export async function actualizarPerfil(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = perfilSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.auth.updateUser({
    data: {
      nombre: sanitizeText(parsed.data.nombre),
      apellido: sanitizeText(parsed.data.apellido),
      telefono: sanitizeText(parsed.data.telefono),
    },
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/configuracion")
  return { success: true, message: "Perfil actualizado correctamente" }
}

export async function cambiarContraseña(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = cambiarPasswordSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error: verifyError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: parsed.data.password_actual,
  })

  if (verifyError) {
    return { success: false, message: "La contraseña actual es incorrecta" }
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password_nueva,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard/configuracion")
  return { success: true, message: "Contraseña actualizada correctamente" }
}
