"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { gastoSchema } from "@/lib/validation/schemas"
import { sanitizeOptional } from "@/lib/security/sanitize"
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

export async function crearGasto(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = gastoSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("gastos").insert({
    usuario_id: user.id,
    cuenta_id: parsed.data.cuenta_id,
    categoria_id: parsed.data.categoria_id || null,
    fecha: parsed.data.fecha,
    valor: parsed.data.valor,
    descripcion: sanitizeOptional(parsed.data.descripcion),
    metodo_pago: parsed.data.metodo_pago || null,
    comprobante_url: parsed.data.comprobante_url || null,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Gasto creado correctamente" }
}

export async function actualizarGasto(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = gastoSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("gastos")
    .update({
      cuenta_id: parsed.data.cuenta_id,
      categoria_id: parsed.data.categoria_id || null,
      fecha: parsed.data.fecha,
      valor: parsed.data.valor,
      descripcion: sanitizeOptional(parsed.data.descripcion),
      metodo_pago: parsed.data.metodo_pago || null,
      comprobante_url: parsed.data.comprobante_url || null,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Gasto actualizado correctamente" }
}

export async function eliminarGasto(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("gastos")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Gasto eliminado correctamente" }
}
