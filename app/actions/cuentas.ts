"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { cuentaSchema } from "@/lib/validation/schemas"
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

export async function crearCuenta(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = cuentaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("cuentas").insert({
    usuario_id: user.id,
    nombre: sanitizeText(parsed.data.nombre),
    tipo: parsed.data.tipo,
    saldo_inicial: parsed.data.saldo_inicial,
    saldo_actual: parsed.data.saldo_actual,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/cuentas")
  return { success: true, message: "Cuenta creada correctamente" }
}

export async function actualizarCuenta(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = cuentaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("cuentas")
    .update({
      nombre: sanitizeText(parsed.data.nombre),
      tipo: parsed.data.tipo,
      saldo_inicial: parsed.data.saldo_inicial,
      saldo_actual: parsed.data.saldo_actual,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/cuentas")
  return { success: true, message: "Cuenta actualizada correctamente" }
}

export async function eliminarCuenta(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("cuentas")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/cuentas")
  return { success: true, message: "Cuenta eliminada correctamente" }
}
