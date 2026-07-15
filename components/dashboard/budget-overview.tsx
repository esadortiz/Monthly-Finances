"use client"

import { PiggyBank } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface PresupuestoItem {
  nombre: string
  monto_mensual: number
  gastado: number
  color?: string
}

interface BudgetOverviewProps {
  presupuestos: PresupuestoItem[]
}

export function BudgetOverview({ presupuestos }: BudgetOverviewProps) {
  if (presupuestos.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <PiggyBank className="size-4" />
          Presupuestos del Mes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {presupuestos.slice(0, 5).map((p) => {
          const ratio = p.monto_mensual > 0 ? p.gastado / p.monto_mensual : 0
          const restante = p.monto_mensual - p.gastado
          return (
            <div key={p.nombre}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{p.nombre}</span>
                <span className={cn(
                  "text-xs",
                  restante < 0 ? "text-red-600 font-medium" : "text-muted-foreground"
                )}>
                  ${p.gastado.toLocaleString("es-CO")} / ${p.monto_mensual.toLocaleString("es-CO")}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    ratio > 1 ? "bg-red-500" : ratio > 0.8 ? "bg-yellow-500" : "bg-emerald-500"
                  )}
                  style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
