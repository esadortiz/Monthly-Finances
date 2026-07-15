"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { metaSchema } from "@/lib/validation/schemas"
import { sanitizeText, sanitizeOptional } from "@/lib/security/sanitize"
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

export async function crearMeta(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = metaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("metas_ahorro").insert({
    usuario_id: user.id,
    nombre: sanitizeText(parsed.data.nombre),
    descripcion: sanitizeOptional(parsed.data.descripcion),
    monto_objetivo: parsed.data.monto_objetivo,
    monto_actual: parsed.data.monto_actual ?? 0,
    fecha_limite: parsed.data.fecha_limite || null,
    color: parsed.data.color || "#10b981",
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/metas")
  return { success: true, message: "Meta de ahorro creada correctamente" }
}

export async function actualizarMeta(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = metaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("metas_ahorro")
    .update({
      nombre: sanitizeText(parsed.data.nombre),
      descripcion: sanitizeOptional(parsed.data.descripcion),
      monto_objetivo: parsed.data.monto_objetivo,
      monto_actual: parsed.data.monto_actual ?? 0,
      fecha_limite: parsed.data.fecha_limite || null,
      color: parsed.data.color || "#10b981",
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/metas")
  return { success: true, message: "Meta de ahorro actualizada correctamente" }
}

export async function eliminarMeta(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("metas_ahorro")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/metas")
  return { success: true, message: "Meta de ahorro eliminada correctamente" }
}
