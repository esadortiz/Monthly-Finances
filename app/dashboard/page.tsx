import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StatsCard } from "@/components/dashboard/stats-card"
import { ExportButton } from "@/components/dashboard/export-button"
import { OverviewChart } from "@/components/dashboard/overview-chart"
import { RecentTransactions } from "@/components/dashboard/recent-transactions"
import { BudgetOverview } from "@/components/dashboard/budget-overview"
import { BudgetAlerts } from "@/components/dashboard/budget-alerts"
import { SavingsOverview } from "@/components/dashboard/savings-overview"
import { RemindersCard } from "@/components/dashboard/reminders-card"
import { exportarMovimientos } from "@/app/actions/exportar"
import type { Movimiento } from "@/types/database"

function formatear(valor: number): string {
  return `$${Math.round(valor).toLocaleString("es-CO")}`
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const ahora = new Date()
  const mesActual = ahora.getMonth()
  const anioActual = ahora.getFullYear()

  const [categoriasRes, ingresosRes, gastosRes, presupuestosRes, metasRes, deudasRes, recordatoriosRes] =
    await Promise.all([
      supabase.from("categorias").select("*").eq("usuario_id", user.id).order("nombre"),
      supabase.from("ingresos").select("*").eq("usuario_id", user.id).order("fecha", { ascending: false }),
      supabase.from("gastos").select("*").eq("usuario_id", user.id).order("fecha", { ascending: false }),
      supabase.from("presupuestos").select("*").eq("usuario_id", user.id),
      supabase.from("metas_ahorro").select("*").eq("usuario_id", user.id).order("creado_en", { ascending: false }),
      supabase.from("deudas").select("*").eq("usuario_id", user.id).order("creado_en", { ascending: false }),
      supabase.from("recordatorios").select("*").eq("usuario_id", user.id).not("completado", "eq", true).order("fecha_recordatorio", { ascending: true }).limit(5),
    ])

  const categorias = categoriasRes.data ?? []
  const ingresos = ingresosRes.data ?? []
  const gastos = gastosRes.data ?? []
  const presupuestos = presupuestosRes.data ?? []
  const metas = metasRes.data ?? []
  const deudas = deudasRes.data ?? []
  const recordatorios = recordatoriosRes.data ?? []

  const ingresos_mes = ingresos
    .filter((i) => {
      const d = new Date(i.fecha)
      return d.getMonth() === mesActual && d.getFullYear() === anioActual
    })
    .reduce((sum, i) => sum + Number(i.valor), 0)

  const gastos_mes = gastos
    .filter((g) => {
      const d = new Date(g.fecha)
      return d.getMonth() === mesActual && d.getFullYear() === anioActual
    })
    .reduce((sum, g) => sum + Number(g.valor), 0)

  // Presupuestos del mes actual
  const presupuestosMes = presupuestos
    .filter((p) => p.mes === mesActual + 1 && p.anio === anioActual)
    .map((p) => ({
      nombre: p.nombre,
      monto_mensual: Number(p.monto_mensual),
      gastado: Number(p.gastado),
    }))
  const totalPresupuestado = presupuestosMes.reduce((s, p) => s + p.monto_mensual, 0)
  const totalGastadoPresupuesto = presupuestosMes.reduce((s, p) => s + p.gastado, 0)
  const restantePresupuesto = totalPresupuestado - totalGastadoPresupuesto

  // Deudas resumen
  const totalDeuda = deudas.reduce((s, d) => s + Number(d.monto_total), 0)
  const totalPagado = deudas.reduce((s, d) => s + Number(d.monto_pagado), 0)
  const deudaRestante = totalDeuda - totalPagado

  // Metas resumen
  const metasData = metas.map((m) => ({
    id: m.id,
    nombre: m.nombre,
    monto_objetivo: Number(m.monto_objetivo),
    monto_actual: Number(m.monto_actual),
    color: m.color,
  }))

  // Chart data - últimos 6 meses
  const ultimos6meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(anioActual, mesActual - (5 - i), 1)
    return { mes: d.getMonth(), anio: d.getFullYear() }
  })

  const chartData = ultimos6meses.map(({ mes, anio }) => {
    const ing = ingresos
      .filter((i) => {
        const d = new Date(i.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, i) => s + Number(i.valor), 0)
    const gas = gastos
      .filter((g) => {
        const d = new Date(g.fecha)
        return d.getMonth() === mes && d.getFullYear() === anio
      })
      .reduce((s, g) => s + Number(g.valor), 0)
    const label = new Date(anio, mes).toLocaleDateString("es-CO", { month: "short", year: "2-digit" })
    return { fecha: label, ingresos: ing, gastos: gas }
  })

  // Transacciones recientes
  const categoriaMap = new Map(categorias.map((c) => [c.id, c]))

  const todosMovimientos: Movimiento[] = [
    ...ingresos.map((i) => ({
      id: i.id,
      tipo: "ingreso" as const,
      descripcion: i.descripcion,
      valor: Number(i.valor),
      fecha: i.fecha,
      categoria_nombre: i.categoria_id ? categoriaMap.get(i.categoria_id)?.nombre ?? null : null,
      categoria_color: i.categoria_id ? categoriaMap.get(i.categoria_id)?.color ?? null : null,
    })),
    ...gastos.map((g) => ({
      id: g.id,
      tipo: "gasto" as const,
      descripcion: g.descripcion,
      valor: Number(g.valor),
      fecha: g.fecha,
      categoria_nombre: g.categoria_id ? categoriaMap.get(g.categoria_id)?.nombre ?? null : null,
      categoria_color: g.categoria_id ? categoriaMap.get(g.categoria_id)?.color ?? null : null,
    })),
  ]
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 8)

  const recordatoriosData = recordatorios.map((r) => ({
    id: r.id,
    titulo: r.titulo,
    descripcion: r.descripcion,
    tipo: r.tipo,
    fecha_recordatorio: r.fecha_recordatorio,
    completado: r.completado,
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Panel Principal</h2>
          <p className="text-sm text-muted-foreground">Resumen de tus finanzas personales</p>
        </div>
        <ExportButton action={exportarMovimientos} fileName="movimientos.csv" label="Exportar Todo" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatsCard title="Ingresos del Mes" value={formatear(ingresos_mes)} icon="TrendingUp" iconClassName="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" />
        <StatsCard title="Gastos del Mes" value={formatear(gastos_mes)} icon="TrendingDown" iconClassName="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" />
        <StatsCard title="Balance" value={formatear(ingresos_mes - gastos_mes)} icon="RefreshCcw" iconClassName={ingresos_mes - gastos_mes >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"} />
        {totalPresupuestado > 0 && <StatsCard title="Restante Presupuesto" value={formatear(restantePresupuesto)} icon="PiggyBank" iconClassName={restantePresupuesto >= 0 ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"} />}
        {deudaRestante > 0 && <StatsCard title="Deuda Restante" value={formatear(deudaRestante)} icon="CreditCard" iconClassName="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" />}
      </div>

      <BudgetAlerts presupuestos={presupuestosMes} />

      <div className="grid gap-4 lg:grid-cols-3">
        <OverviewChart data={chartData} />
        <RecentTransactions movimientos={todosMovimientos} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <BudgetOverview presupuestos={presupuestosMes} />
        <SavingsOverview metas={metasData} />
        <RemindersCard recordatorios={recordatoriosData} />
      </div>
    </div>
  )
}
