import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StaggerRows, AnimatedRow } from "@/components/animations/stagger-rows"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PresupuestoDialog } from "@/components/dashboard/presupuestos/presupuesto-dialog"
import { DeletePresupuestoButton } from "@/components/dashboard/presupuestos/delete-presupuesto-button"
import { PresupuestosFilters } from "@/components/dashboard/presupuestos/presupuestos-filters"
import { recalcularGastado } from "@/app/actions/presupuestos"
import type { Categoria, Presupuesto } from "@/types/database"

const meses = [
  "", "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
]

const periodoLabel: Record<string, string> = {
  mensual: "Mensual",
  quincenal: "Quincenal",
}

function getProgressColor(gastado: number, monto: number): string {
  if (monto === 0) return "bg-muted"
  const ratio = gastado / monto
  if (ratio > 1) return "bg-red-500"
  if (ratio > 0.8) return "bg-yellow-500"
  return "bg-emerald-500"
}

function getProgressText(gastado: number, monto: number): string {
  if (monto === 0) return "0%"
  return `${Math.min(Math.round((gastado / monto) * 100), 999)}%`
}

export default async function PresupuestosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    mes?: string
    anio?: string
  }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: categorias }, { data: presupuestos }] = await Promise.all([
    supabase
      .from("categorias")
      .select("*")
      .eq("usuario_id", user.id)
      .order("nombre"),
    supabase
      .from("presupuestos")
      .select("*")
      .eq("usuario_id", user.id)
      .order("anio", { ascending: false })
      .order("mes", { ascending: false }),
  ])

  const categoriasList = (categorias ?? []) as Categoria[]
  const presupuestosList = (presupuestos ?? []) as Presupuesto[]
  const categoriaMap = new Map(categoriasList.map((c) => [c.id, c]))

  const params = await searchParams

  // Recalcular gastado para cada presupuesto
  const presupuestosConGastado = await Promise.all(
    presupuestosList.map(async (p) => {
      const gastado = await recalcularGastado(p.id)
      return { ...p, gastado }
    })
  )

  // Aplicar filtros
  let presupuestosFiltrados = presupuestosConGastado

  if (params.q) {
    const query = params.q.toLowerCase()
    presupuestosFiltrados = presupuestosFiltrados.filter((p) =>
      p.nombre.toLowerCase().includes(query)
    )
  }

  if (params.mes && params.mes !== "all") {
    presupuestosFiltrados = presupuestosFiltrados.filter(
      (p) => p.mes === parseInt(params.mes!)
    )
  }

  if (params.anio && params.anio !== "all") {
    presupuestosFiltrados = presupuestosFiltrados.filter(
      (p) => p.anio === parseInt(params.anio!)
    )
  }

  const totalPresupuestado = presupuestosFiltrados.reduce(
    (sum, p) => sum + Number(p.monto_mensual), 0
  )
  const totalGastado = presupuestosFiltrados.reduce(
    (sum, p) => sum + Number(p.gastado), 0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Presupuestos</h2>
          <p className="text-sm text-muted-foreground">
            Controla tus gastos mensuales por categoría · {presupuestosFiltrados.length} presupuestos
          </p>
        </div>
        {categoriasList.length > 0 && (
          <PresupuestoDialog categorias={categoriasList} />
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Presupuestado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold tabular-nums">
              ${totalPresupuestado.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Gastado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">
              ${totalGastado.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Restante
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">
              ${(totalPresupuestado - totalGastado).toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <PresupuestosFilters />
          {presupuestosFiltrados.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              {presupuestosList.length === 0
                ? 'No hay presupuestos. Crea el primero con el botón "Nuevo Presupuesto".'
                : "No se encontraron presupuestos con los filtros aplicados."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="hidden md:table-cell">Período</TableHead>
                  <TableHead className="text-right">Presupuesto</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Gastado</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Progreso</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {presupuestosFiltrados.map((presupuesto) => {
                  const categoria = presupuesto.categoria_id
                    ? categoriaMap.get(presupuesto.categoria_id)
                    : null
                  const restante =
                    Number(presupuesto.monto_mensual) - Number(presupuesto.gastado)
                  return (
                    <AnimatedRow key={presupuesto.id}>
                      <TableCell className="p-1.5 sm:p-2 font-medium text-sm">
                        {presupuesto.nombre}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2">
                        {categoria ? (
                          <Badge variant="outline" className="gap-1.5">
                            <span
                              className="size-2 rounded-full"
                              style={{ backgroundColor: categoria.color }}
                            />
                            {categoria.nombre}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            Todas
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-sm text-muted-foreground">
                        {meses[presupuesto.mes]} {presupuesto.anio} · {periodoLabel[presupuesto.periodo] || "Mensual"}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2 text-right font-medium tabular-nums whitespace-nowrap">
                        ${Number(presupuesto.monto_mensual).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-1.5 sm:p-2 text-right tabular-nums whitespace-nowrap">
                        <span className={restante < 0 ? "text-red-600 font-medium" : ""}>
                          ${Number(presupuesto.gastado).toLocaleString("es-CO")}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-20 sm:w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${getProgressColor(
                                Number(presupuesto.gastado),
                                Number(presupuesto.monto_mensual)
                              )}`}
                              style={{
                                width: `${Math.min(
                                  (Number(presupuesto.gastado) /
                                    Number(presupuesto.monto_mensual)) *
                                    100,
                                  100
                                )}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 sm:w-10 text-right tabular-nums">
                            {getProgressText(
                              Number(presupuesto.gastado),
                              Number(presupuesto.monto_mensual)
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <PresupuestoDialog
                            categorias={categoriasList}
                            presupuesto={presupuesto}
                            triggerVariant="ghost"
                          />
                          <DeletePresupuestoButton
                            id={presupuesto.id}
                            nombre={presupuesto.nombre}
                          />
                        </div>
                      </TableCell>
                    </AnimatedRow>
                  )
                })}
              </StaggerRows>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
