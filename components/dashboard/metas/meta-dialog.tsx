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
import { Textarea } from "@/components/ui/textarea"
import { crearMeta, actualizarMeta } from "@/app/actions/metas"
import type { MetaAhorro } from "@/types/database"
import { CurrencyInput } from "@/components/dashboard/currency-input"

const colores = [
  { value: "#10b981", label: "Verde" },
  { value: "#3b82f6", label: "Azul" },
  { value: "#f59e0b", label: "Amarillo" },
  { value: "#ef4444", label: "Rojo" },
  { value: "#8b5cf6", label: "Púrpura" },
  { value: "#ec4899", label: "Rosa" },
  { value: "#14b8a6", label: "Teal" },
  { value: "#f97316", label: "Naranja" },
]

interface MetaAhorroDialogProps {
  meta?: MetaAhorro
  triggerVariant?: "default" | "ghost"
}

export function MetaAhorroDialog({
  meta,
  triggerVariant = "default",
}: MetaAhorroDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!meta

  const [formData, setFormData] = useState({
    nombre: meta?.nombre ?? "",
    descripcion: meta?.descripcion ?? "",
    monto_objetivo: meta?.monto_objetivo ?? 0,
    monto_actual: meta?.monto_actual ?? 0,
    fecha_limite: meta?.fecha_limite ?? "",
    color: meta?.color ?? "#10b981",
  })

  useEffect(() => {
    if (meta) {
      setFormData({
        nombre: meta.nombre,
        descripcion: meta.descripcion ?? "",
        monto_objetivo: meta.monto_objetivo,
        monto_actual: meta.monto_actual,
        fecha_limite: meta.fecha_limite ?? "",
        color: meta.color,
      })
    }
  }, [meta])

  async function handleSubmit(formDataToSend: FormData) {
    const input = {
      nombre: formDataToSend.get("nombre") as string,
      descripcion: (formDataToSend.get("descripcion") as string) || null,
      monto_objetivo: Number(formDataToSend.get("objetivo_raw")) || 0,
      monto_actual: isEditing ? Number(formDataToSend.get("actual_raw")) || 0 : undefined,
      fecha_limite: (formDataToSend.get("fecha_limite") as string) || null,
      color: formDataToSend.get("color") as string,
    }

    if (!input.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    if (input.monto_objetivo <= 0) {
      toast.error("El monto objetivo debe ser mayor a 0")
      return
    }

    const result =
      isEditing && meta
        ? await actualizarMeta(meta.id, input)
        : await crearMeta(input)

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
                Nueva Meta
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Meta" : "Nueva Meta de Ahorro"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de tu meta de ahorro"
              : "Define una meta de ahorro para alcanzar tus objetivos financieros"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Viaje a Cartagena, Fondo de emergencia..."
              defaultValue={formData.nombre}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Describe tu meta..."
              defaultValue={formData.descripcion}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="monto_objetivo">Meta ($)</Label>
              <CurrencyInput
                id="monto_objetivo"
                name="objetivo"
                defaultValue={formData.monto_objetivo || ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto_actual">Ahorrado ($)</Label>
              <CurrencyInput
                id="monto_actual"
                name="actual"
                defaultValue={formData.monto_actual || ""}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_limite">Fecha límite (opcional)</Label>
              <Input
                id="fecha_limite"
                name="fecha_limite"
                type="date"
                defaultValue={formData.fecha_limite}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {colores.map((c) => (
                  <label
                    key={c.value}
                    className="flex cursor-pointer items-center gap-1.5"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={c.value}
                      defaultChecked={formData.color === c.value}
                      className="sr-only peer"
                    />
                    <span
                      className="size-7 rounded-full border-2 border-transparent peer-checked:border-foreground transition-all"
                      style={{ backgroundColor: c.value }}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Meta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
