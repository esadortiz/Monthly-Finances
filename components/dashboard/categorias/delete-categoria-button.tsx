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
import { eliminarCategoria } from "@/app/actions/categorias"

interface DeleteCategoriaButtonProps {
  id: string
  nombre: string
}

export function DeleteCategoriaButton({ id, nombre }: DeleteCategoriaButtonProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const result = await eliminarCategoria(id)
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
          <DialogTitle>Eliminar Categoría</DialogTitle>
          <DialogDescription>
            ¿Seguro que deseas eliminar la categoría &ldquo;{nombre}&rdquo;? Los
            ingresos y gastos asociados quedarán sin categoría. Esta acción no
            se puede deshacer.
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
