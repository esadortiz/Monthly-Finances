"use client"

import { useState, useEffect } from "react"
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
import { crearDeuda, actualizarDeuda } from "@/app/actions/deudas"
import type { Deuda } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"
import { CurrencyInput } from "@/components/dashboard/currency-input"

const estados = [
  { value: "pendiente", label: "Pendiente" },
  { value: "al_dia", label: "Al día" },
  { value: "pagada", label: "Pagada" },
]

interface DeudaDialogProps {
  deuda?: Deuda
  triggerVariant?: "default" | "ghost"
}

export function DeudaDialog({
  deuda,
  triggerVariant = "default",
}: DeudaDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!deuda

  const [formData, setFormData] = useState({
    nombre: deuda?.nombre ?? "",
    acreedor: deuda?.acreedor ?? "",
    monto_total: deuda?.monto_total ?? 0,
    monto_pagado: deuda?.monto_pagado ?? 0,
    tasa_interes: deuda?.tasa_interes ?? "",
    cuotas_totales: deuda?.cuotas_totales ?? "",
    cuotas_pagadas: deuda?.cuotas_pagadas ?? 0,
    fecha_limite: deuda?.fecha_limite ?? "",
    estado: deuda?.estado ?? "pendiente",
  })

  useEffect(() => {
    if (deuda) {
      setFormData({
        nombre: deuda.nombre,
        acreedor: deuda.acreedor ?? "",
        monto_total: deuda.monto_total,
        monto_pagado: deuda.monto_pagado,
        tasa_interes: deuda.tasa_interes ?? "",
        cuotas_totales: deuda.cuotas_totales ?? "",
        cuotas_pagadas: deuda.cuotas_pagadas,
        fecha_limite: deuda.fecha_limite ?? "",
        estado: deuda.estado,
      })
    }
  }, [deuda])

  async function handleSubmit(formDataToSend: FormData) {
    const input = {
      nombre: formDataToSend.get("nombre") as string,
      acreedor: (formDataToSend.get("acreedor") as string) || null,
      monto_total: Number(formDataToSend.get("total_raw")) || 0,
      monto_pagado: Number(formDataToSend.get("pagado_raw")) || 0,
      tasa_interes: (formDataToSend.get("tasa_interes") as string)
        ? Number(formDataToSend.get("tasa_interes"))
        : null,
      cuotas_totales: (formDataToSend.get("cuotas_totales") as string)
        ? Number(formDataToSend.get("cuotas_totales"))
        : null,
      cuotas_pagadas: Number(formDataToSend.get("cuotas_pagadas")) || 0,
      fecha_limite: (formDataToSend.get("fecha_limite") as string) || null,
      estado: formDataToSend.get("estado") as string,
    }

    if (!input.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    if (input.monto_total <= 0) {
      toast.error("El monto total debe ser mayor a 0")
      return
    }

    const result =
      isEditing && deuda
        ? await actualizarDeuda(deuda.id, input)
        : await crearDeuda(input)

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={triggerVariant} size={triggerVariant === "ghost" ? "icon-sm" : "default"}>
            {triggerVariant === "default" ? (
              <>
                <Plus className="size-4" />
                Nueva Deuda
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Deuda" : "Nueva Deuda"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de tu deuda"
              : "Registra una deuda para llevar control de tus pagos"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Ej: Tarjeta de Crédito"
                defaultValue={formData.nombre}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="acreedor">Acreedor</Label>
              <Input
                id="acreedor"
                name="acreedor"
                placeholder="Ej: Bancolombia"
                defaultValue={formData.acreedor}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monto_total">Monto Total</Label>
              <CurrencyInput
                id="monto_total"
                name="total"
                defaultValue={formData.monto_total || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto_pagado">Pagado</Label>
              <CurrencyInput
                id="monto_pagado"
                name="pagado"
                defaultValue={formData.monto_pagado || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tasa_interes">Interés %</Label>
              <Input
                id="tasa_interes"
                name="tasa_interes"
                type="number"
                step="0.01"
                min="0"
                max="100"
                placeholder="0"
                defaultValue={formData.tasa_interes}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuotas_totales">Cuotas totales</Label>
              <Input
                id="cuotas_totales"
                name="cuotas_totales"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={formData.cuotas_totales}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cuotas_pagadas">Cuotas pagadas</Label>
              <Input
                id="cuotas_pagadas"
                name="cuotas_pagadas"
                type="number"
                min="0"
                placeholder="0"
                defaultValue={formData.cuotas_pagadas}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_limite">Próximo pago</Label>
              <Input
                id="fecha_limite"
                name="fecha_limite"
                type="date"
                defaultValue={formData.fecha_limite}
              />
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <LabeledSelect
                name="estado"
                defaultValue={formData.estado}
                placeholder="Selecciona el estado"
                options={estados}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Deuda"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
