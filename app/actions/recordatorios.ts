"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { recordatorioSchema } from "@/lib/validation/schemas"
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

export async function crearRecordatorio(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = recordatorioSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("recordatorios").insert({
    usuario_id: user.id,
    titulo: sanitizeText(parsed.data.titulo),
    descripcion: sanitizeOptional(parsed.data.descripcion),
    tipo: parsed.data.tipo,
    fecha_recordatorio: parsed.data.fecha_recordatorio,
    fecha_vencimiento: parsed.data.fecha_vencimiento || null,
    completado: parsed.data.completado ?? false,
    recurrencia: parsed.data.recurrencia || null,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard/recordatorios")
  return { success: true, message: "Recordatorio creado correctamente" }
}

export async function actualizarRecordatorio(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = recordatorioSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("recordatorios")
    .update({
      titulo: sanitizeText(parsed.data.titulo),
      descripcion: sanitizeOptional(parsed.data.descripcion),
      tipo: parsed.data.tipo,
      fecha_recordatorio: parsed.data.fecha_recordatorio,
      fecha_vencimiento: parsed.data.fecha_vencimiento || null,
      completado: parsed.data.completado ?? false,
      recurrencia: parsed.data.recurrencia || null,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard/recordatorios")
  return { success: true, message: "Recordatorio actualizado correctamente" }
}

export async function toggleRecordatorio(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { data: recordatorio } = await supabase
    .from("recordatorios")
    .select("completado")
    .eq("id", id)
    .eq("usuario_id", user.id)
    .single()

  if (!recordatorio) {
    return { success: false, message: "Recordatorio no encontrado" }
  }

  const { error } = await supabase
    .from("recordatorios")
    .update({
      completado: !recordatorio.completado,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard/recordatorios")
  return {
    success: true,
    message: recordatorio.completado
      ? "Recordatorio marcado como pendiente"
      : "Recordatorio marcado como completado",
  }
}

export async function eliminarRecordatorio(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("recordatorios")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard/recordatorios")
  return { success: true, message: "Recordatorio eliminado correctamente" }
}
