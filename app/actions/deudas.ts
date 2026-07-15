"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { deudaSchema } from "@/lib/validation/schemas"
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

export async function crearDeuda(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = deudaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("deudas").insert({
    usuario_id: user.id,
    nombre: sanitizeText(parsed.data.nombre),
    acreedor: sanitizeOptional(parsed.data.acreedor),
    monto_total: parsed.data.monto_total,
    monto_pagado: parsed.data.monto_pagado ?? 0,
    tasa_interes: parsed.data.tasa_interes ?? null,
    cuotas_totales: parsed.data.cuotas_totales ?? null,
    cuotas_pagadas: parsed.data.cuotas_pagadas ?? 0,
    fecha_limite: parsed.data.fecha_limite || null,
    estado: parsed.data.estado || "pendiente",
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/deudas")
  return { success: true, message: "Deuda creada correctamente" }
}

export async function actualizarDeuda(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = deudaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("deudas")
    .update({
      nombre: sanitizeText(parsed.data.nombre),
      acreedor: sanitizeOptional(parsed.data.acreedor),
      monto_total: parsed.data.monto_total,
      monto_pagado: parsed.data.monto_pagado ?? 0,
      tasa_interes: parsed.data.tasa_interes ?? null,
      cuotas_totales: parsed.data.cuotas_totales ?? null,
      cuotas_pagadas: parsed.data.cuotas_pagadas ?? 0,
      fecha_limite: parsed.data.fecha_limite || null,
      estado: parsed.data.estado || "pendiente",
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/deudas")
  return { success: true, message: "Deuda actualizada correctamente" }
}

export async function eliminarDeuda(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("deudas")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/deudas")
  return { success: true, message: "Deuda eliminada correctamente" }
}
