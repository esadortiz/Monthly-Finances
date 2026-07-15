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
import { RecordatorioDialog } from "@/components/dashboard/recordatorios/recordatorio-dialog"
import { DeleteRecordatorioButton } from "@/components/dashboard/recordatorios/delete-recordatorio-button"
import { ToggleRecordatorioButton } from "@/components/dashboard/recordatorios/toggle-recordatorio-button"
import type { Recordatorio } from "@/types/database"

const tipoStyles: Record<string, string> = {
  pago: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  vencimiento: "bg-red-100 text-red-800 hover:bg-red-100",
  personalizado: "bg-purple-100 text-purple-800 hover:bg-purple-100",
}

const tipoLabels: Record<string, string> = {
  pago: "Pago",
  vencimiento: "Vencimiento",
  personalizado: "Personalizado",
}

const recurrenciaLabels: Record<string, string> = {
  diaria: "Cada día",
  semanal: "Cada semana",
  mensual: "Cada mes",
  anual: "Cada año",
}

export default async function RecordatoriosPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: recordatorios } = await supabase
    .from("recordatorios")
    .select("*")
    .eq("usuario_id", user.id)
    .order("fecha_recordatorio", { ascending: true })

  const recordatoriosList = (recordatorios ?? []) as Recordatorio[]
  const pendientes = recordatoriosList.filter((r) => !r.completado).length
  const completados = recordatoriosList.filter((r) => r.completado).length
  const hoy = new Date().toISOString().split("T")[0]
  const proximos = recordatoriosList.filter(
    (r) => !r.completado && r.fecha_recordatorio >= hoy
  ).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Recordatorios</h2>
          <p className="text-sm text-muted-foreground">
            No olvides tus pagos y vencimientos importantes · {recordatoriosList.length} recordatorios
          </p>
        </div>
        <RecordatorioDialog />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{recordatoriosList.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">{pendientes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">{completados}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Próximos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{proximos}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {recordatoriosList.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No hay recordatorios. Crea el primero con el botón &quot;Nuevo Recordatorio&quot;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[36px] sm:w-[40px]"></TableHead>
                  <TableHead>Recordatorio</TableHead>
                  <TableHead className="hidden md:table-cell">Tipo</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="hidden md:table-cell">Vencimiento</TableHead>
                  <TableHead className="hidden lg:table-cell">Repite</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {recordatoriosList.map((r) => (
                  <AnimatedRow
                    key={r.id}
                    className={r.completado ? "opacity-50" : ""}
                  >
                    <TableCell className="p-1.5 sm:p-2">
                      <ToggleRecordatorioButton id={r.id} completado={r.completado} />
                    </TableCell>
                    <TableCell className="p-1.5 sm:p-2">
                      <p className={`font-medium text-sm leading-tight ${r.completado ? "line-through" : ""}`}>
                        {r.titulo}
                      </p>
                      {r.descripcion && (
                        <p className="hidden sm:block text-xs text-muted-foreground truncate">
                          {r.descripcion}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell p-1.5 sm:p-2">
                      <Badge className={tipoStyles[r.tipo] || ""} variant="outline">
                        {tipoLabels[r.tipo] || r.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="p-1.5 sm:p-2 text-sm whitespace-nowrap">
                      {new Date(r.fecha_recordatorio).toLocaleDateString("es-CO", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-sm text-muted-foreground whitespace-nowrap">
                      {r.fecha_vencimiento
                        ? new Date(r.fecha_vencimiento).toLocaleDateString("es-CO", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell p-1.5 sm:p-2 text-sm text-muted-foreground">
                      {r.recurrencia ? recurrenciaLabels[r.recurrencia] : "—"}
                    </TableCell>
                    <TableCell className="p-1.5 sm:p-2">
                      <div className="flex items-center gap-0.5 sm:gap-1">
                        <RecordatorioDialog
                          recordatorio={r}
                          triggerVariant="ghost"
                        />
                        <DeleteRecordatorioButton id={r.id} titulo={r.titulo} />
                      </div>
                    </TableCell>
                    </AnimatedRow>
                ))}
              </StaggerRows>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
