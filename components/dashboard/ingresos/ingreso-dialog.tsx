"use client"

import { useState, useEffect, useTransition } from "react"
import { Plus, Pencil } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { crearIngreso, actualizarIngreso } from "@/app/actions/ingresos"
import type { IngresoInput } from "@/lib/validation/schemas"
import type { Categoria, Ingreso } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"
import { CurrencyInput } from "@/components/dashboard/currency-input"

interface IngresoDialogProps {
  categorias: Categoria[]
  ingreso?: Ingreso
  triggerVariant?: "default" | "ghost"
}

export function IngresoDialog({
  categorias,
  ingreso,
  triggerVariant = "default",
}: IngresoDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!ingreso

  const [formData, setFormData] = useState<IngresoInput>({
    categoria_id: ingreso?.categoria_id ?? "",
    fecha: ingreso?.fecha ?? new Date().toISOString().split("T")[0],
    valor: ingreso?.valor ?? 0,
    descripcion: ingreso?.descripcion ?? "",
  })

  useEffect(() => {
    if (ingreso) {
      setFormData({
        categoria_id: ingreso.categoria_id ?? "",
        fecha: ingreso.fecha,
        valor: ingreso.valor,
        descripcion: ingreso.descripcion ?? "",
      })
    }
  }, [ingreso])

  async function handleSubmit(formDataToSend: FormData) {
    const catId = formDataToSend.get("categoria_id") as string
    const input = {
      categoria_id: catId && catId !== "none" ? catId : null,
      fecha: formDataToSend.get("fecha") as string,
      valor: Number(formDataToSend.get("valor_raw")) || 0,
      descripcion: (formDataToSend.get("descripcion") as string) || null,
    }

    if (input.valor <= 0) {
      toast.error("El valor debe ser mayor a 0")
      return
    }

    const result =
      isEditing && ingreso
        ? await actualizarIngreso(ingreso.id, input)
        : await crearIngreso(input)

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  const categoriasIngreso = categorias.filter((c) => c.tipo === "ingreso")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={triggerVariant} size={triggerVariant === "ghost" ? "icon-sm" : "default"}>
            {triggerVariant === "default" ? (
              <>
                <Plus className="size-4" />
                Nuevo Ingreso
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Ingreso" : "Nuevo Ingreso"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del ingreso"
              : "Registra un nuevo ingreso en tu cuenta"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Ej: Salario mensual, venta de producto..."
              defaultValue={formData.descripcion ?? ""}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="valor">Valor</Label>
            <CurrencyInput
              id="valor"
              name="valor"
              defaultValue={formData.valor || ""}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                defaultValue={formData.fecha}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Categoría</Label>
              <LabeledSelect
                name="categoria_id"
                defaultValue={formData.categoria_id || "none"}
                placeholder="Sin categoría"
                options={[
                  { value: "none", label: "Sin categoría" },
                  ...categoriasIngreso.map((cat) => ({
                    value: cat.id,
                    label: cat.nombre,
                    color: cat.color,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Ingreso"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
