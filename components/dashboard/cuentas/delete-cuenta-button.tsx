"use client"

import { Trash2 } from "lucide-react"
import { toast } from "sonner"
import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { eliminarCuenta } from "@/app/actions/cuentas"

interface DeleteCuentaButtonProps {
  id: string
  nombre: string
}

export function DeleteCuentaButton({ id, nombre }: DeleteCuentaButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const result = await eliminarCuenta(id)
      if (result.success) {
        toast.success(result.message)
        setOpen(false)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
            <Trash2 className="size-3.5" />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Eliminar Cuenta</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar la cuenta &ldquo;{nombre}&rdquo;? Los
            ingresos y gastos asociados también serán eliminados. Esta acción
            no se puede deshacer.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? "Eliminando..." : "Eliminar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
