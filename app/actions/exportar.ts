"use server"

import { createClient } from "@/lib/supabase/server"
import { checkRateLimit } from "@/lib/security/rate-limiter"

type Filtros = {
  desde?: string
  hasta?: string
  categoria_id?: string
}

function escapeCSV(valor: string | number | null | undefined): string {
  if (valor == null) return ""
  const str = String(valor)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function toRows(
  data: Record<string, unknown>[],
  columns: { key: string; label: string }[]
): string {
  const header = columns.map((c) => escapeCSV(c.label)).join(",")
  const rows = data.map((row) =>
    columns
      .map((c) => escapeCSV(row[c.key] as string | number | null | undefined))
      .join(",")
  )
  return [header, ...rows].join("\r\n")
}

async function verificarAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  const rateCheck = checkRateLimit(`exportar:${user.id}`, 10, 60 * 1000)
  if (!rateCheck.allowed) {
    throw new Error("Demasiadas exportaciones. Espera un momento.")
  }

  return { supabase, user }
}

export async function exportarIngresos(filtros?: Filtros): Promise<string> {
  const { supabase, user } = await verificarAuth()

  let query = supabase
    .from("ingresos")
    .select("*, categorias(nombre)")
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: false })

  if (filtros?.desde) query = query.gte("fecha", filtros.desde)
  if (filtros?.hasta) query = query.lte("fecha", filtros.hasta)
  if (filtros?.categoria_id) query = query.eq("categoria_id", filtros.categoria_id)
  if (filtros?.categoria_id) query = query.eq("categoria_id", filtros.categoria_id)

  const { data } = await query
  if (!data) return ""

  return toRows(data, [
    { key: "id", label: "ID" },
    { key: "fecha", label: "Fecha" },
    { key: "descripcion", label: "Descripción" },
    { key: "valor", label: "Valor" },
    { key: "categoria_id", label: "Categoría" },
    { key: "creado_en", label: "Creado" },
  ])
}

export async function exportarGastos(filtros?: Filtros): Promise<string> {
  const { supabase, user } = await verificarAuth()

  let query = supabase
    .from("gastos")
    .select("*, categorias(nombre)")
    .eq("usuario_id", user.id)
    .order("fecha", { ascending: false })

  if (filtros?.desde) query = query.gte("fecha", filtros.desde)
  if (filtros?.hasta) query = query.lte("fecha", filtros.hasta)
  if (filtros?.categoria_id) query = query.eq("categoria_id", filtros.categoria_id)

  const { data } = await query
  if (!data) return ""

  return toRows(data, [
    { key: "id", label: "ID" },
    { key: "fecha", label: "Fecha" },
    { key: "descripcion", label: "Descripción" },
    { key: "valor", label: "Valor" },
    { key: "categoria_id", label: "Categoría" },
    { key: "creado_en", label: "Creado" },
  ])
}

export async function exportarMovimientos(filtros?: {
  desde?: string
  hasta?: string
  tipo?: "ingreso" | "gasto"
}): Promise<string> {
  const { supabase, user } = await verificarAuth()

  const [ingresosRes, gastosRes] = await Promise.all([
    supabase
      .from("ingresos")
      .select("*, categorias(nombre)")
      .eq("usuario_id", user.id),
    supabase
      .from("gastos")
      .select("*, categorias(nombre)")
      .eq("usuario_id", user.id),
  ])

  const movimientos: Record<string, unknown>[] = []

  if (!filtros?.tipo || filtros.tipo === "ingreso") {
    for (const i of ingresosRes.data ?? []) {
      if (filtros?.desde && i.fecha < filtros.desde) continue
      if (filtros?.hasta && i.fecha > filtros.hasta) continue
      movimientos.push({
        fecha: i.fecha,
        tipo: "Ingreso",
        descripcion: i.descripcion,
        valor: Number(i.valor),
        categoria: (i as Record<string, unknown>).categorias
          ? ((i as Record<string, unknown>).categorias as Record<string, unknown>)
              .nombre ?? ""
          : "",
      })
    }
  }

  if (!filtros?.tipo || filtros.tipo === "gasto") {
    for (const g of gastosRes.data ?? []) {
      if (filtros?.desde && g.fecha < filtros.desde) continue
      if (filtros?.hasta && g.fecha > filtros.hasta) continue
      movimientos.push({
        fecha: g.fecha,
        tipo: "Gasto",
        descripcion: g.descripcion,
        valor: -Math.abs(Number(g.valor)),
        categoria: (g as Record<string, unknown>).categorias
          ? ((g as Record<string, unknown>).categorias as Record<string, unknown>)
              .nombre ?? ""
          : "",
      })
    }
  }

  movimientos.sort((a, b) => String(b.fecha).localeCompare(String(a.fecha)))

  return toRows(movimientos, [
    { key: "fecha", label: "Fecha" },
    { key: "tipo", label: "Tipo" },
    { key: "descripcion", label: "Descripción" },
    { key: "valor", label: "Valor" },
    { key: "categoria", label: "Categoría" },
  ])
}
