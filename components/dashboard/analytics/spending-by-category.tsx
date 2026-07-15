"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CategoryData {
  name: string
  value: number
  color: string
}

interface SpendingByCategoryProps {
  data: CategoryData[]
}

const MAX_BARS = 6

export function SpendingByCategory({ data }: SpendingByCategoryProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoría</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No hay gastos registrados
        </CardContent>
      </Card>
    )
  }

  const sorted = [...data].sort((a, b) => b.value - a.value)
  const top = sorted.slice(0, MAX_BARS)
  const maxValue = top[0].value
  const total = sorted.reduce((s, d) => s + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gastos por Categoría</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {top.map((entry) => {
            const pct = total > 0 ? (entry.value / total) * 100 : 0
            return (
              <div key={entry.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ background: entry.color }}
                    />
                    <span className="text-foreground truncate">{entry.name}</span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-medium tabular-nums text-foreground">
                      ${entry.value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
                    </span>
                    <span className="text-xs text-muted-foreground w-10 text-right tabular-nums">
                      {pct.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(entry.value / maxValue) * 100}%`,
                      background: entry.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
          {sorted.length > MAX_BARS && (
            <p className="text-xs text-muted-foreground text-center pt-1">
              +{sorted.length - MAX_BARS} categorías más
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
