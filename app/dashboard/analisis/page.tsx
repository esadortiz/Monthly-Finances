import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { SpendingByCategory } from "@/components/dashboard/analytics/spending-by-category"
import { MonthlyTrend } from "@/components/dashboard/analytics/monthly-trend"
import { SummaryTable } from "@/components/dashboard/analytics/summary-table"
import type { Categoria, Gasto, Ingreso } from "@/types/database"

export default async function AnalisisPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: categorias }, { data: ingresos }, { data: gastos }] =
    await Promise.all([
      supabase.from("categorias").select("*").eq("usuario_id", user.id).order("nombre"),
      supabase.from("ingresos").select("*").eq("usuario_id", user.id).order("fecha", { ascending: false }),
      supabase.from("gastos").select("*").eq("usuario_id", user.id).order("fecha", { ascending: false }),
    ])

  const categoriasList = (categorias ?? []) as Categoria[]
  const ingresosList = (ingresos ?? []) as Ingreso[]
  const gastosList = (gastos ?? []) as Gasto[]

  const categoriaMap = new Map(categoriasList.map((c) => [c.id, c]))

  // Gastos por categoría
  const gastosPorCategoria: { name: string; value: number; color: string }[] = []
  const gastosAgrupados = new Map<string, { total: number; color: string }>()

  for (const g of gastosList) {
    const cat = g.categoria_id ? categoriaMap.get(g.categoria_id) : null
    const key = cat?.nombre ?? "Sin categoría"
    const color = cat?.color ?? "#6b7280"
    const prev = gastosAgrupados.get(key) ?? { total: 0, color }
    prev.total += Number(g.valor)
    gastosAgrupados.set(key, prev)
  }

  for (const [name, { total, color }] of gastosAgrupados) {
    if (total > 0) {
      gastosPorCategoria.push({ name, value: total, color })
    }
  }

  gastosPorCategoria.sort((a, b) => b.value - a.value)

  // Últimos 6 meses
  const ahora = new Date()
  const mesActual = ahora.getMonth()
  const anioActual = ahora.getFullYear()

  const ultimos6meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(anioActual, mesActual - (5 - i), 1)
    return { mes: d.getMonth(), anio: d.getFullYear() }
  })

  const trendData = ultimos6meses.map(({ mes, anio }) => {
    const ing = ingresosList
      .filter((i) => {
        const d = new Date(i.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, i) => s + Number(i.valor), 0)
    const gas = gastosList
      .filter((g) => {
        const d = new Date(g.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, g) => s + Number(g.valor), 0)
    const label = new Date(anio, mes).toLocaleDateString("es-CO", {
      month: "short",
      year: "2-digit",
    })
    return { fecha: label, ingresos: ing, gastos: gas }
  })

  const summaryData = ultimos6meses.map(({ mes, anio }) => {
    const ing = ingresosList
      .filter((i) => {
        const d = new Date(i.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, i) => s + Number(i.valor), 0)
    const gas = gastosList
      .filter((g) => {
        const d = new Date(g.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, g) => s + Number(g.valor), 0)
    const label = new Date(anio, mes).toLocaleDateString("es-CO", {
      month: "long",
      year: "numeric",
    })
    return { mes: label, ingresos: ing, gastos: gas, balance: ing - gas }
  }).reverse()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Análisis e Informes</h2>
        <p className="text-sm text-muted-foreground">
          Visualiza tus ingresos y gastos con gráficos detallados
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SpendingByCategory data={gastosPorCategoria} />
        <MonthlyTrend data={trendData} />
      </div>

      <SummaryTable data={summaryData} />
    </div>
  )
}
