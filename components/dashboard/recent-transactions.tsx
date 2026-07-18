"use client"

import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Movimiento } from "@/types/database"

interface RecentTransactionsProps {
  movimientos: Movimiento[]
}

export function RecentTransactions({ movimientos }: RecentTransactionsProps) {
  if (movimientos.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Últimos Movimientos</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No hay movimientos registrados
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Últimos Movimientos</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {movimientos.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full"
                style={{
                  backgroundColor: m.categoria_color
                    ? `${m.categoria_color}20`
                    : "var(--muted)",
                }}
              >
                {m.tipo === "ingreso" ? (
                  <ArrowUpRight className="size-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="size-4 text-red-600" />
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-medium">
                  {m.descripcion || m.categoria_nombre || "Sin descripción"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {m.categoria_nombre || ""}
                </span>
              </div>
              <div className="text-right">
                <span
                  className={`text-sm font-semibold ${
                    m.tipo === "ingreso"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {m.tipo === "ingreso" ? "+" : "-"}$
                  {m.valor.toLocaleString("es-CO", {
                    minimumFractionDigits: 0,
                  })}
                </span>
                <p className="text-xs text-muted-foreground">
                  {new Date(m.fecha).toLocaleDateString("es-CO", {
                    day: "2-digit",
                    month: "short",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
