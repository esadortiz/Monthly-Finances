"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { presupuestoSchema } from "@/lib/validation/schemas"
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

export async function crearPresupuesto(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = presupuestoSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase.from("presupuestos").insert({
    usuario_id: user.id,
    categoria_id: parsed.data.categoria_id || null,
    nombre: sanitizeText(parsed.data.nombre),
    monto_mensual: parsed.data.monto_mensual,
    mes: parsed.data.mes,
    anio: parsed.data.anio,
  })

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/presupuestos")
  return { success: true, message: "Presupuesto creado correctamente" }
}

export async function actualizarPresupuesto(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = presupuestoSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("presupuestos")
    .update({
      categoria_id: parsed.data.categoria_id || null,
      nombre: sanitizeText(parsed.data.nombre),
      monto_mensual: parsed.data.monto_mensual,
      mes: parsed.data.mes,
      anio: parsed.data.anio,
      actualizado_en: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/presupuestos")
  return { success: true, message: "Presupuesto actualizado correctamente" }
}

export async function eliminarPresupuesto(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("presupuestos")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/presupuestos")
  return { success: true, message: "Presupuesto eliminado correctamente" }
}

export async function recalcularGastado(presupuestoId: string): Promise<number> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return 0

  const { data: presupuesto } = await supabase
    .from("presupuestos")
    .select("mes, anio, categoria_id")
    .eq("id", presupuestoId)
    .eq("usuario_id", user.id)
    .single()

  if (!presupuesto) return 0

  let query = supabase
    .from("gastos")
    .select("valor")
    .eq("usuario_id", user.id)
    .gte(
      "fecha",
      `${presupuesto.anio}-${String(presupuesto.mes).padStart(2, "0")}-01`
    )
    .lt(
      "fecha",
      `${presupuesto.mes === 12 ? presupuesto.anio + 1 : presupuesto.anio}-${String(presupuesto.mes === 12 ? 1 : presupuesto.mes + 1).padStart(2, "0")}-01`
    )

  if (presupuesto.categoria_id) {
    query = query.eq("categoria_id", presupuesto.categoria_id)
  }

  const { data: gastos } = await query
  const total = (gastos ?? []).reduce((sum, g) => sum + Number(g.valor), 0)

  await supabase
    .from("presupuestos")
    .update({ gastado: total, actualizado_en: new Date().toISOString() })
    .eq("id", presupuestoId)
    .eq("usuario_id", user.id)

  return total
}
