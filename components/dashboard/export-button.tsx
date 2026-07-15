"use client"

import { useTransition } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface ExportButtonProps {
  label?: string
  fileName?: string
  action: () => Promise<string>
}

export function ExportButton({ label = "Exportar CSV", fileName = "export.csv", action }: ExportButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      try {
        const csv = await action()
        if (!csv) {
          toast.error("No hay datos para exportar")
          return
        }
        const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
        toast.success("Archivo exportado correctamente")
      } catch {
        toast.error("Error al exportar")
      }
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      <Download className="size-4" />
      {isPending ? "Exportando..." : label}
    </Button>
  )
}
