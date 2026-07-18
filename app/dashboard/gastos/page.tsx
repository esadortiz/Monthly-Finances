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
import { GastoDialog } from "@/components/dashboard/gastos/gasto-dialog"
import { DeleteGastoButton } from "@/components/dashboard/gastos/delete-gasto-button"
import { GastosFilters } from "@/components/dashboard/gastos/gastos-filters"
import { ExportButton } from "@/components/dashboard/export-button"
import { exportarGastos } from "@/app/actions/exportar"
import type { Categoria, Gasto } from "@/types/database"

const metodosPagoLabels: Record<string, string> = {
  efectivo: "Efectivo",
  tarjeta_debito: "Tarjeta Débito",
  tarjeta_credito: "Tarjeta Crédito",
  transferencia: "Transferencia",
  otro: "Otro",
}

export default async function GastosPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string
    q?: string
    categoria?: string
    metodo?: string
    desde?: string
    hasta?: string
  }>
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const [{ data: categorias }, { data: gastos }] =
    await Promise.all([
      supabase
        .from("categorias")
        .select("*")
        .eq("usuario_id", user.id)
        .order("nombre"),
      supabase
        .from("gastos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("fecha", { ascending: false }),
    ])

  const categoriasList = (categorias ?? []) as Categoria[]
  const gastosList = (gastos ?? []) as Gasto[]

  const categoriaMap = new Map(categoriasList.map((c) => [c.id, c]))

  const params = await searchParams

  let gastosFiltrados = gastosList

  if (params.q) {
    const query = params.q.toLowerCase()
    gastosFiltrados = gastosFiltrados.filter((g) =>
      g.descripcion?.toLowerCase().includes(query)
    )
  }

  if (params.categoria && params.categoria !== "all") {
    gastosFiltrados = gastosFiltrados.filter(
      (g) => g.categoria_id === params.categoria
    )
  }

  if (params.metodo && params.metodo !== "all") {
    gastosFiltrados = gastosFiltrados.filter(
      (g) => g.metodo_pago === params.metodo
    )
  }

  if (params.desde) {
    gastosFiltrados = gastosFiltrados.filter((g) => g.fecha >= params.desde!)
  }

  if (params.hasta) {
    gastosFiltrados = gastosFiltrados.filter((g) => g.fecha <= params.hasta!)
  }

  const total = gastosFiltrados.reduce((sum, g) => sum + Number(g.valor), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Gastos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus registros de gastos · {gastosFiltrados.length} de{" "}
            {gastosList.length} registros
          </p>
        </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ExportButton action={exportarGastos} fileName="gastos.csv" />
            <GastoDialog categorias={categoriasList} />
          </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total de Gastos</span>
            <Badge variant="secondary" className="text-base">
              ${total.toLocaleString("es-CO")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <GastosFilters categorias={categoriasList} />

          {gastosFiltrados.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              {gastosList.length === 0
                ? 'No hay gastos registrados. Crea el primero con el botón "Nuevo Gasto".'
                : "No se encontraron gastos con los filtros aplicados."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="hidden md:table-cell">Método</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {gastosFiltrados.map((gasto) => {
                  const categoria = gasto.categoria_id
                    ? categoriaMap.get(gasto.categoria_id)
                    : null
                  return (
                    <AnimatedRow key={gasto.id}>
                      <TableCell className="p-1.5 sm:p-2 text-sm whitespace-nowrap">
                        <span className="sm:hidden">
                          {new Date(gasto.fecha).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="hidden sm:inline">
                          {new Date(gasto.fecha).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-1.5 sm:p-2">
                        <div className="flex items-center gap-1.5">
                          {gasto.comprobante_url && (
                            <a
                              href={gasto.comprobante_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline shrink-0"
                            >
                              📎
                            </a>
                          )}
                          <span className="truncate block max-w-[120px] sm:max-w-none">
                            {gasto.descripcion || (
                              <span className="text-muted-foreground italic">
                                Sin descripción
                              </span>
                            )}
                          </span>
                        </div>
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
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-sm">
                        {gasto.metodo_pago
                          ? metodosPagoLabels[gasto.metodo_pago] ??
                            gasto.metodo_pago
                          : "—"}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2 text-right font-medium text-red-600 tabular-nums whitespace-nowrap">
                        <span className="sm:hidden">$</span>
                        <span className="hidden sm:inline">-$</span>
                        {Number(gasto.valor).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <GastoDialog
                            categorias={categoriasList}
                            gasto={gasto}
                            triggerVariant="ghost"
                          />
                          <DeleteGastoButton
                            id={gasto.id}
                            descripcion={gasto.descripcion}
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