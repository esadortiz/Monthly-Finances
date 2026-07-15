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
import { DeudaDialog } from "@/components/dashboard/deudas/deuda-dialog"
import { DeleteDeudaButton } from "@/components/dashboard/deudas/delete-deuda-button"
import type { Deuda } from "@/types/database"

const estadoStyles: Record<string, string> = {
  pendiente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  al_dia: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  pagada: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
}

const estadoLabels: Record<string, string> = {
  pendiente: "Pendiente",
  al_dia: "Al día",
  pagada: "Pagada",
}

export default async function DeudasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: deudas } = await supabase
    .from("deudas")
    .select("*")
    .eq("usuario_id", user.id)
    .order("creado_en", { ascending: false })

  const deudasList = (deudas ?? []) as Deuda[]
  const totalDeuda = deudasList.reduce((s, d) => s + Number(d.monto_total), 0)
  const totalPagado = deudasList.reduce((s, d) => s + Number(d.monto_pagado), 0)
  const saldoPendiente = totalDeuda - totalPagado
  const deudasPendientes = deudasList.filter((d) => d.estado !== "pagada").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Deudas</h2>
          <p className="text-sm text-muted-foreground">
            Controla tus deudas y préstamos · {deudasList.length} deudas
            {deudasPendientes > 0 && ` (${deudasPendientes} pendientes)`}
          </p>
        </div>
        <DeudaDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deuda Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold tabular-nums">${totalDeuda.toLocaleString("es-CO")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pagado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">
              ${totalPagado.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Saldo Pendiente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-red-600 tabular-nums">
              ${saldoPendiente.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Deudas Activas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold">{deudasPendientes}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {deudasList.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No hay deudas registradas. Crea la primera con el botón &quot;Nueva Deuda&quot;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Deuda</TableHead>
                  <TableHead className="hidden md:table-cell">Acreedor</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Pagado</TableHead>
                  <TableHead className="text-right">Saldo</TableHead>
                  <TableHead className="hidden md:table-cell text-center">Cuotas</TableHead>
                  <TableHead className="hidden lg:table-cell text-center">Estado</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {deudasList.map((deuda) => {
                  const saldo = Number(deuda.monto_total) - Number(deuda.monto_pagado)
                  const pagado = Number(deuda.monto_total) > 0
                    ? Math.round((Number(deuda.monto_pagado) / Number(deuda.monto_total)) * 100)
                    : 0
                  return (
                    <AnimatedRow key={deuda.id}>
                      <TableCell className="p-1.5 sm:p-2">
                        <p className="font-medium text-sm leading-tight">{deuda.nombre}</p>
                        {deuda.tasa_interes && (
                          <p className="hidden sm:block text-xs text-muted-foreground">
                            {deuda.tasa_interes}% interés
                          </p>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-sm text-muted-foreground">
                        {deuda.acreedor || "—"}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-1.5 sm:p-2 text-right font-medium tabular-nums">
                        ${Number(deuda.monto_total).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-right tabular-nums">
                        ${Number(deuda.monto_pagado).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2 text-right tabular-nums whitespace-nowrap">
                        <span className={saldo > 0 ? "text-red-600 font-medium" : "text-emerald-600 font-medium"}>
                          ${saldo.toLocaleString("es-CO")}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-center text-sm">
                        {deuda.cuotas_totales
                          ? `${deuda.cuotas_pagadas}/${deuda.cuotas_totales}`
                          : "—"}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell p-1.5 sm:p-2 text-center">
                        <Badge className={estadoStyles[deuda.estado] || ""} variant="outline">
                          {estadoLabels[deuda.estado] || deuda.estado}
                        </Badge>
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <DeudaDialog
                            deuda={deuda}
                            triggerVariant="ghost"
                          />
                          <DeleteDeudaButton
                            id={deuda.id}
                            nombre={deuda.nombre}
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
