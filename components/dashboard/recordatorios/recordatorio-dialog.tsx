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
import { crearRecordatorio, actualizarRecordatorio } from "@/app/actions/recordatorios"
import type { Recordatorio } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"

const tipos = [
  { value: "personalizado", label: "Personalizado" },
  { value: "pago", label: "Pago" },
  { value: "vencimiento", label: "Vencimiento" },
]

const recurrencias = [
  { value: "", label: "Sin repetición" },
  { value: "diaria", label: "Cada día" },
  { value: "semanal", label: "Cada semana" },
  { value: "mensual", label: "Cada mes" },
  { value: "anual", label: "Cada año" },
]

interface RecordatorioDialogProps {
  recordatorio?: Recordatorio
  triggerVariant?: "default" | "ghost"
}

export function RecordatorioDialog({
  recordatorio,
  triggerVariant = "default",
}: RecordatorioDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!recordatorio

  const [formData, setFormData] = useState({
    titulo: recordatorio?.titulo ?? "",
    descripcion: recordatorio?.descripcion ?? "",
    tipo: recordatorio?.tipo ?? "personalizado",
    fecha_recordatorio: recordatorio?.fecha_recordatorio ?? new Date().toISOString().split("T")[0],
    fecha_vencimiento: recordatorio?.fecha_vencimiento ?? "",
    recurrencia: recordatorio?.recurrencia ?? "",
  })

  useEffect(() => {
    if (recordatorio) {
      setFormData({
        titulo: recordatorio.titulo,
        descripcion: recordatorio.descripcion ?? "",
        tipo: recordatorio.tipo,
        fecha_recordatorio: recordatorio.fecha_recordatorio,
        fecha_vencimiento: recordatorio.fecha_vencimiento ?? "",
        recurrencia: recordatorio.recurrencia ?? "",
      })
    }
  }, [recordatorio])

  async function handleSubmit(formDataToSend: FormData) {
    const input = {
      titulo: formDataToSend.get("titulo") as string,
      descripcion: (formDataToSend.get("descripcion") as string) || null,
      tipo: formDataToSend.get("tipo") as string,
      fecha_recordatorio: formDataToSend.get("fecha_recordatorio") as string,
      fecha_vencimiento: (formDataToSend.get("fecha_vencimiento") as string) || null,
      recurrencia: formDataToSend.get("recurrencia") as string || null,
    }

    if (!input.titulo.trim()) {
      toast.error("El título es obligatorio")
      return
    }

    if (!input.fecha_recordatorio) {
      toast.error("La fecha es obligatoria")
      return
    }

    const result =
      isEditing && recordatorio
        ? await actualizarRecordatorio(recordatorio.id, input)
        : await crearRecordatorio(input)

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
                Nuevo Recordatorio
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Recordatorio" : "Nuevo Recordatorio"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del recordatorio"
              : "Crea un recordatorio para no olvidar tus pagos y vencimientos"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="titulo">Título</Label>
            <Input
              id="titulo"
              name="titulo"
              placeholder="Ej: Pago tarjeta de crédito"
              defaultValue={formData.titulo}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción (opcional)</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Detalles del recordatorio..."
              defaultValue={formData.descripcion}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <LabeledSelect
                name="tipo"
                defaultValue={formData.tipo}
                placeholder="Selecciona el tipo"
                options={tipos}
              />
            </div>
            <div className="space-y-2">
              <Label>Repetir</Label>
              <LabeledSelect
                name="recurrencia"
                defaultValue={formData.recurrencia || ""}
                placeholder="Sin repetición"
                options={recurrencias}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_recordatorio">Fecha del recordatorio</Label>
              <Input
                id="fecha_recordatorio"
                name="fecha_recordatorio"
                type="date"
                defaultValue={formData.fecha_recordatorio}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fecha_vencimiento">Fecha de vencimiento (opcional)</Label>
              <Input
                id="fecha_vencimiento"
                name="fecha_vencimiento"
                type="date"
                defaultValue={formData.fecha_vencimiento}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Recordatorio"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
