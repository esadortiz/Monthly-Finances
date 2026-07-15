"use client"

import { AlertTriangle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface AlertaPresupuesto {
  nombre: string
  monto_mensual: number
  gastado: number
}

interface BudgetAlertsProps {
  presupuestos: AlertaPresupuesto[]
}

export function BudgetAlerts({ presupuestos }: BudgetAlertsProps) {
  const alerts = presupuestos.filter((p) => {
    const ratio = p.monto_mensual > 0 ? p.gastado / p.monto_mensual : 0
    return ratio >= 0.8
  })

  if (alerts.length === 0) return null

  return (
    <Card className="border-yellow-200 dark:border-yellow-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="size-4 text-yellow-600" />
          Alertas de Presupuesto
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((p) => {
          const ratio = p.monto_mensual > 0 ? (p.gastado / p.monto_mensual) * 100 : 0
          const restante = p.monto_mensual - p.gastado
          const isOver = restante < 0
          return (
            <div
              key={p.nombre}
              className="flex items-start justify-between rounded-lg border p-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {isOver ? (
                    <AlertCircle className="size-4 shrink-0 text-red-500" />
                  ) : (
                    <AlertTriangle className="size-4 shrink-0 text-yellow-500" />
                  )}
                  <span className="font-medium text-sm">{p.nombre}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {isOver
                    ? `Excedido por $${Math.abs(restante).toLocaleString("es-CO")}`
                    : `Restan $${restante.toLocaleString("es-CO")} (${Math.round(ratio)}% usado)`
                  }
                </p>
              </div>
              <Badge variant={isOver ? "destructive" : "secondary"}>
                {Math.round(ratio)}%
              </Badge>
            </div>
          )
        })}
        <div className="pt-1">
          <Link
            href="/dashboard/presupuestos"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos los presupuestos →
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
