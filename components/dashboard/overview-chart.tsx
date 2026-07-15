"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
  fecha: string
  ingresos: number
  gastos: number
}

interface OverviewChartProps {
  data: ChartData[]
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active?: boolean
  payload?: Array<{ value: number; name: string; color: string }>
  label?: string
}) => {
  if (!active || !payload) return null
  return (
    <div className="rounded-xl border bg-card/95 backdrop-blur-md px-4 py-3 text-sm shadow-2xl">
      <p className="mb-2 font-medium text-foreground/60 text-xs tracking-wider uppercase">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center justify-between gap-6 py-0.5" style={{ color: entry.color }}>
          <span className="flex items-center gap-2">
            <span className="size-2 rounded-full" style={{ background: entry.color }} />
            {entry.name}
          </span>
          <span className="font-semibold tabular-nums">
            ${entry.value.toLocaleString("es-CO", { minimumFractionDigits: 0 })}
          </span>
        </p>
      ))}
    </div>
  )
}

export function OverviewChart({ data }: OverviewChartProps) {
  if (data.length === 0) {
    return (
      <Card className="col-span-full lg:col-span-2">
        <CardHeader>
          <CardTitle>Ingresos vs Gastos</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
          No hay datos para mostrar
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(
    ...data.flatMap((d) => [d.ingresos, d.gastos]),
    1
  )

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Ingresos vs Gastos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-6 pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: "var(--chart-1)" }} />
            Ingresos
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-2.5 rounded-full" style={{ background: "var(--chart-2)" }} />
            Gastos
          </div>
        </div>
        <div className="h-[300px] sm:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 40 }}>
              <defs>
                <linearGradient id="ingresosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gastosGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--chart-2)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-border/50"
                vertical={false}
              />
              <XAxis
                dataKey="fecha"
                className="text-xs text-muted-foreground"
                tickLine={false}
                axisLine={false}
                dy={6}
              />
              <YAxis
                className="text-[10px] text-foreground/60"
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => {
                  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`
                  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`
                  return `$${v}`
                }}
                domain={[0, maxValue * 1.15]}
                width={36}
                dx={0}
              />
              <Tooltip content={<CustomTooltip />} cursor={false} />
              <Area
                type="monotone"
                dataKey="ingresos"
                name="Ingresos"
                stroke="var(--chart-1)"
                strokeWidth={3}
                fill="url(#ingresosGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 3,
                  stroke: "var(--card)",
                  fill: "var(--chart-1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="gastos"
                name="Gastos"
                stroke="var(--chart-2)"
                strokeWidth={3}
                fill="url(#gastosGrad)"
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 3,
                  stroke: "var(--card)",
                  fill: "var(--chart-2)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
