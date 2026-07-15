import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CuentaDialog } from "@/components/dashboard/cuentas/cuenta-dialog"
import { DeleteCuentaButton } from "@/components/dashboard/cuentas/delete-cuenta-button"
import type { Cuenta } from "@/types/database"

const tipoLabels: Record<string, string> = {
  banco: "Banco",
  billetera_digital: "Billetera Digital",
  efectivo: "Efectivo",
  ahorros: "Caja de Ahorro",
  otro: "Otro",
}

const tipoColores: Record<string, string> = {
  banco: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  billetera_digital: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  efectivo: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  ahorros: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  otro: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400",
}

export default async function CuentasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: cuentas } = await supabase
    .from("cuentas")
    .select("*")
    .eq("usuario_id", user.id)
    .order("nombre")

  const cuentasList = (cuentas ?? []) as Cuenta[]

  const saldoTotal = cuentasList.reduce(
    (sum, c) => sum + Number(c.saldo_actual),
    0
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Cuentas</h2>
          <p className="text-sm text-muted-foreground">
            Administra tus cuentas bancarias y billeteras
          </p>
        </div>
        <CuentaDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Saldo Total</span>
            <Badge variant="secondary" className="text-base">
              ${saldoTotal.toLocaleString("es-CO")}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cuentasList.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No hay cuentas registradas. Crea la primera con el botón "Nueva Cuenta".
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cuentasList.map((cuenta) => {
                const diferencia =
                  Number(cuenta.saldo_actual) - Number(cuenta.saldo_inicial)
                return (
                  <Card key={cuenta.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex size-10 items-center justify-center rounded-lg ${
                            tipoColores[cuenta.tipo] ?? tipoColores.otro
                          }`}
                        >
                          <span className="text-lg font-bold">
                            {cuenta.nombre.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CuentaDialog
                            cuenta={cuenta}
                            triggerVariant="ghost"
                          />
                          <DeleteCuentaButton
                            id={cuenta.id}
                            nombre={cuenta.nombre}
                          />
                        </div>
                      </div>

                      <div className="mt-3">
                        <h3 className="text-sm font-semibold">
                          {cuenta.nombre}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs"
                        >
                          {tipoLabels[cuenta.tipo] ?? cuenta.tipo}
                        </Badge>
                      </div>

                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Saldo actual
                          </span>
                          <span className="text-lg font-semibold">
                            ${Number(cuenta.saldo_actual).toLocaleString("es-CO")}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Saldo inicial
                          </span>
                          <span className="text-sm text-muted-foreground">
                            ${Number(cuenta.saldo_inicial).toLocaleString("es-CO")}
                          </span>
                        </div>
                        {diferencia !== 0 && (
                          <div className="flex items-center justify-between border-t pt-1">
                            <span className="text-xs text-muted-foreground">
                              Diferencia
                            </span>
                            <span
                              className={`text-xs font-medium ${
                                diferencia > 0
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                            >
                              {diferencia > 0 ? "+" : ""}
                              ${diferencia.toLocaleString("es-CO")}
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
