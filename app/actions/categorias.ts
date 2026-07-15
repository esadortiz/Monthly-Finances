"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { categoriaSchema } from "@/lib/validation/schemas"
import { sanitizeText } from "@/lib/security/sanitize"
export type ActionResult = {
  success: boolean
  message: string
}

function getUserOrRedirect() {
  throw new Error("Use getUserOrThrow instead")
}

async function getUserOrThrow() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  return { supabase, user }
}

export async function crearCategoria(input: Record<string, unknown>): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = categoriaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const data = {
    usuario_id: user.id,
    nombre: sanitizeText(parsed.data.nombre),
    tipo: parsed.data.tipo,
    color: parsed.data.color,
    icono: sanitizeText(parsed.data.icono),
  }

  const { error } = await supabase.from("categorias").insert(data)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/categorias")
  revalidatePath("/dashboard/ingresos")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Categoría creada correctamente" }
}

export async function actualizarCategoria(
  id: string,
  input: Record<string, unknown>
): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const parsed = categoriaSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message || "Datos inválidos" }
  }

  const { error } = await supabase
    .from("categorias")
    .update({
      nombre: sanitizeText(parsed.data.nombre),
      tipo: parsed.data.tipo,
      color: parsed.data.color,
      icono: sanitizeText(parsed.data.icono),
    })
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/categorias")
  revalidatePath("/dashboard/ingresos")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Categoría actualizada correctamente" }
}

export async function eliminarCategoria(id: string): Promise<ActionResult> {
  const { supabase, user } = await getUserOrThrow()

  const { error } = await supabase
    .from("categorias")
    .delete()
    .eq("id", id)
    .eq("usuario_id", user.id)

  if (error) {
    return { success: false, message: error.message }
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/categorias")
  revalidatePath("/dashboard/ingresos")
  revalidatePath("/dashboard/gastos")
  return { success: true, message: "Categoría eliminada correctamente" }
}
