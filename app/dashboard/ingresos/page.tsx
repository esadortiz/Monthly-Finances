import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { StaggerRows, AnimatedRow } from "@/components/animations/stagger-rows"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { IngresoDialog } from "@/components/dashboard/ingresos/ingreso-dialog"
import { DeleteIngresoButton } from "@/components/dashboard/ingresos/delete-ingreso-button"
import { IngresosFilters } from "@/components/dashboard/ingresos/ingresos-filters"
import { ExportButton } from "@/components/dashboard/export-button"
import { exportarIngresos } from "@/app/actions/exportar"
import type { Cuenta, Categoria, Ingreso } from "@/types/database"

export default async function IngresosPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string
    categoria?: string
    cuenta?: string
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

  const [{ data: cuentas }, { data: categorias }, { data: ingresos }] =
    await Promise.all([
      supabase
        .from("cuentas")
        .select("*")
        .eq("usuario_id", user.id)
        .order("nombre"),
      supabase
        .from("categorias")
        .select("*")
        .eq("usuario_id", user.id)
        .order("nombre"),
      supabase
        .from("ingresos")
        .select("*")
        .eq("usuario_id", user.id)
        .order("fecha", { ascending: false }),
    ])

  const cuentasList = (cuentas ?? []) as Cuenta[]
  const categoriasList = (categorias ?? []) as Categoria[]
  const ingresosList = (ingresos ?? []) as Ingreso[]

  const cuentaMap = new Map(cuentasList.map((c) => [c.id, c]))
  const categoriaMap = new Map(categoriasList.map((c) => [c.id, c]))

  const params = await searchParams

  // Aplicar filtros
  let ingresosFiltrados = ingresosList

  if (params.q) {
    const query = params.q.toLowerCase()
    ingresosFiltrados = ingresosFiltrados.filter((i) =>
      i.descripcion?.toLowerCase().includes(query)
    )
  }

  if (params.categoria && params.categoria !== "all") {
    ingresosFiltrados = ingresosFiltrados.filter(
      (i) => i.categoria_id === params.categoria
    )
  }

  if (params.cuenta && params.cuenta !== "all") {
    ingresosFiltrados = ingresosFiltrados.filter(
      (i) => i.cuenta_id === params.cuenta
    )
  }

  if (params.desde) {
    ingresosFiltrados = ingresosFiltrados.filter(
      (i) => i.fecha >= params.desde!
    )
  }

  if (params.hasta) {
    ingresosFiltrados = ingresosFiltrados.filter(
      (i) => i.fecha <= params.hasta!
    )
  }

  const total = ingresosFiltrados.reduce((sum, i) => sum + Number(i.valor), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Ingresos</h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus registros de ingresos · {ingresosFiltrados.length} de{" "}
            {ingresosList.length} registros
          </p>
        </div>
        {cuentasList.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <ExportButton action={exportarIngresos} fileName="ingresos.csv" />
            <IngresoDialog cuentas={cuentasList} categorias={categoriasList} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Total de Ingresos</span>
            <Badge variant="secondary" className="text-base">
              ${total.toLocaleString("es-CO")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <IngresosFilters cuentas={cuentasList} categorias={categoriasList} />
          {ingresosFiltrados.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              {ingresosList.length === 0
                ? 'No hay ingresos registrados. Crea el primero con el botón "Nuevo Ingreso".'
                : "No se encontraron ingresos con los filtros aplicados."}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden sm:table-cell">Descripción</TableHead>
                  <TableHead className="hidden md:table-cell">Categoría</TableHead>
                  <TableHead className="hidden md:table-cell">Cuenta</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {ingresosFiltrados.map((ingreso) => {
                  const cuenta = cuentaMap.get(ingreso.cuenta_id)
                  const categoria = ingreso.categoria_id
                    ? categoriaMap.get(ingreso.categoria_id)
                    : null
                  return (
                    <AnimatedRow key={ingreso.id}>
                      <TableCell className="p-1.5 sm:p-2 text-sm whitespace-nowrap">
                        <span className="sm:hidden">
                          {new Date(ingreso.fecha).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="hidden sm:inline">
                          {new Date(ingreso.fecha).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-1.5 sm:p-2">
                        <span className="truncate block max-w-[120px] sm:max-w-none">
                          {ingreso.descripcion || (
                            <span className="text-muted-foreground italic">
                              Sin descripción
                            </span>
                          )}
                        </span>
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
                        {cuenta?.nombre ?? "—"}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2 text-right font-medium text-emerald-600 tabular-nums whitespace-nowrap">
                        <span className="sm:hidden">$</span>
                        <span className="hidden sm:inline">+$</span>
                        {Number(ingreso.valor).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <IngresoDialog
                            cuentas={cuentasList}
                            categorias={categoriasList}
                            ingreso={ingreso}
                            triggerVariant="ghost"
                          />
                          <DeleteIngresoButton
                            id={ingreso.id}
                            descripcion={ingreso.descripcion}
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
