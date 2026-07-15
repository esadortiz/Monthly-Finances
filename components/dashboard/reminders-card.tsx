"use client"

import { Bell } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ReminderItem {
  id: string
  titulo: string
  descripcion: string | null
  tipo: string
  fecha_recordatorio: string
  completado: boolean
}

interface RemindersCardProps {
  recordatorios: ReminderItem[]
}

const tipoStyles: Record<string, string> = {
  pago: "border-l-blue-500",
  vencimiento: "border-l-red-500",
  personalizado: "border-l-purple-500",
}

export function RemindersCard({ recordatorios }: RemindersCardProps) {
  if (recordatorios.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="size-4" />
          Próximos Recordatorios
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {recordatorios.slice(0, 5).map((r) => (
          <div
            key={r.id}
            className={cn(
              "border-l-2 pl-3 py-1.5",
              tipoStyles[r.tipo] || "border-l-muted",
              r.completado && "opacity-50"
            )}
          >
            <p className={cn("text-sm font-medium", r.completado && "line-through")}>
              {r.titulo}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(r.fecha_recordatorio).toLocaleDateString("es-CO", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
              {r.descripcion && ` · ${r.descripcion}`}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
