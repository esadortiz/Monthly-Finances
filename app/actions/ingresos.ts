"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ingresoBaseSchema } from "@/lib/validation/schemas"
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

export async function crearIngreso(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = ingresoBaseSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("ingresos").insert({
    usuario_id: user.id,
    cuenta_id: parsed.data.cuenta_id,
    categoria_id: parsed.data.categoria_id || null,
    fecha: parsed.data.fecha,
    valor: parsed.data.valor,
    descripcion: sanitizeOptional(parsed.data.descripcion),
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/ingresos")
  return { success: true, message: "Ingreso creado correctamente" }
}

export async function actualizarIngreso(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = ingresoBaseSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("ingresos")
    .update({
      cuenta_id: parsed.data.cuenta_id,
      categoria_id: parsed.data.categoria_id || null,
      fecha: parsed.data.fecha,
      valor: parsed.data.valor,
      descripcion: sanitizeOptional(parsed.data.descripcion),
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/ingresos")
  return { success: true, message: "Ingreso actualizado correctamente" }
}

export async function eliminarIngreso(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("ingresos")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/ingresos")
  return { success: true, message: "Ingreso eliminado correctamente" }
}
