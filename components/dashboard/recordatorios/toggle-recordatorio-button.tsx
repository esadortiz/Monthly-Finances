"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { toast } from "sonner"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { toggleRecordatorio } from "@/app/actions/recordatorios"

interface ToggleRecordatorioButtonProps {
  id: string
  completado: boolean
}

export function ToggleRecordatorioButton({ id, completado }: ToggleRecordatorioButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleToggle() {
    startTransition(async () => {
      const result = await toggleRecordatorio(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={handleToggle}
      disabled={isPending}
      className={completado ? "text-emerald-600" : "text-muted-foreground"}
    >
      {completado ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
    </Button>
  )
}
