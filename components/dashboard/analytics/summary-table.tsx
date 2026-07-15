"use client"

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface SummaryRow {
  mes: string
  ingresos: number
  gastos: number
  balance: number
}

interface SummaryTableProps {
  data: SummaryRow[]
}

function formatear(valor: number): string {
  return `$${Math.round(valor).toLocaleString("es-CO")}`
}

export function SummaryTable({ data }: SummaryTableProps) {
  const totalIngresos = data.reduce((s, r) => s + r.ingresos, 0)
  const totalGastos = data.reduce((s, r) => s + r.gastos, 0)
  const totalBalance = data.reduce((s, r) => s + r.balance, 0)

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Resumen Mensual</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
          No hay datos para mostrar
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumen Mensual</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">Mes</TableHead>
              <TableHead className="text-right">Ingresos</TableHead>
              <TableHead className="text-right">Gastos</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.mes}>
                <TableCell className="hidden sm:table-cell font-medium capitalize">
                  {row.mes}
                </TableCell>
                <TableCell className="text-right text-emerald-600 tabular-nums">
                  +{formatear(row.ingresos)}
                </TableCell>
                <TableCell className="text-right text-red-600 tabular-nums">
                  -{formatear(row.gastos)}
                </TableCell>
                <TableCell
                  className={`hidden sm:table-cell text-right font-medium ${
                    row.balance >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                >
                  {row.balance >= 0 ? "+" : ""}
                  {formatear(row.balance)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <tfoot>
            <TableRow>
              <TableCell className="hidden sm:table-cell font-semibold">Total</TableCell>
              <TableCell className="text-right font-semibold text-emerald-600 tabular-nums">
                +{formatear(totalIngresos)}
              </TableCell>
              <TableCell className="text-right font-semibold text-red-600 tabular-nums">
                -{formatear(totalGastos)}
              </TableCell>
              <TableCell
                className={`hidden sm:table-cell text-right font-semibold ${
                  totalBalance >= 0 ? "text-emerald-600" : "text-red-600"
                }`}
              >
                {totalBalance >= 0 ? "+" : ""}
                {formatear(totalBalance)}
              </TableCell>
            </TableRow>
          </tfoot>
        </Table>
      </CardContent>
    </Card>
  )
}
