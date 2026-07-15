"use client"

import { Target } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface MetaItem {
  id: string
  nombre: string
  monto_objetivo: number
  monto_actual: number
  color: string
}

interface SavingsOverviewProps {
  metas: MetaItem[]
}

export function SavingsOverview({ metas }: SavingsOverviewProps) {
  if (metas.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Target className="size-4" />
          Metas de Ahorro
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {metas.slice(0, 4).map((m) => {
          const progress = m.monto_objetivo > 0
            ? Math.min(Math.round((m.monto_actual / m.monto_objetivo) * 100), 100)
            : 0
          return (
            <div key={m.id}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                  <span className="font-medium">{m.nombre}</span>
                </span>
                <span className="text-xs text-muted-foreground">{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    progress >= 100 ? "bg-emerald-500" : "bg-blue-500"
                  )}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                ${m.monto_actual.toLocaleString("es-CO")} de ${m.monto_objetivo.toLocaleString("es-CO")}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
