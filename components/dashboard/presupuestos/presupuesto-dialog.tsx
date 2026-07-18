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
import { crearPresupuesto, actualizarPresupuesto } from "@/app/actions/presupuestos"
import type { Categoria, Presupuesto } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"
import { CurrencyInput } from "@/components/dashboard/currency-input"

interface PresupuestoDialogProps {
  categorias: Categoria[]
  presupuesto?: Presupuesto
  triggerVariant?: "default" | "ghost"
}

const periodos = [
  { value: "mensual", label: "Mensual" },
  { value: "quincenal", label: "Quincenal" },
  { value: "15_dias", label: "15 Días" },
]

const meses = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

const now = new Date()
const mesActual = (now.getMonth() + 1).toString()
const anioActual = now.getFullYear().toString()

export function PresupuestoDialog({
  categorias,
  presupuesto,
  triggerVariant = "default",
}: PresupuestoDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!presupuesto

  const [formData, setFormData] = useState({
    categoria_id: presupuesto?.categoria_id ?? "",
    nombre: presupuesto?.nombre ?? "",
    monto_mensual: presupuesto?.monto_mensual ?? 0,
    periodo: presupuesto?.periodo ?? "mensual",
    mes: presupuesto?.mes?.toString() ?? mesActual,
    anio: presupuesto?.anio?.toString() ?? anioActual,
  })

  useEffect(() => {
    if (presupuesto) {
      setFormData({
        categoria_id: presupuesto.categoria_id ?? "",
        nombre: presupuesto.nombre,
        monto_mensual: presupuesto.monto_mensual,
        periodo: presupuesto.periodo,
        mes: presupuesto.mes.toString(),
        anio: presupuesto.anio.toString(),
      })
    }
  }, [presupuesto])

  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto")

  async function handleSubmit(formDataToSend: FormData) {
    const catId = formDataToSend.get("categoria_id") as string
    const input = {
      categoria_id: catId && catId !== "none" ? catId : null,
      nombre: formDataToSend.get("nombre") as string,
      monto_mensual: Number(formDataToSend.get("monto_raw")) || 0,
      periodo: (formDataToSend.get("periodo") as string) || "mensual",
      mes: Number(formDataToSend.get("mes")),
      anio: Number(formDataToSend.get("anio")),
    }

    if (input.monto_mensual <= 0) {
      toast.error("El monto debe ser mayor a 0")
      return
    }

    if (!input.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    const result =
      isEditing && presupuesto
        ? await actualizarPresupuesto(presupuesto.id, input)
        : await crearPresupuesto(input)

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
                Nuevo Presupuesto
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Presupuesto" : "Nuevo Presupuesto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del presupuesto"
              : "Define un presupuesto para controlar tus gastos"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Presupuesto de Alimentos"
              defaultValue={formData.nombre}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto_mensual">Monto</Label>
            <CurrencyInput
              id="monto_mensual"
              name="monto"
              defaultValue={formData.monto_mensual || ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Período</Label>
            <LabeledSelect
              name="periodo"
              defaultValue={formData.periodo}
              placeholder="Selecciona el período"
              options={periodos}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Mes</Label>
              <LabeledSelect
                name="mes"
                defaultValue={formData.mes}
                placeholder="Selecciona el mes"
                options={meses}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anio">Año</Label>
              <Input
                id="anio"
                name="anio"
                type="number"
                min={2024}
                max={2035}
                defaultValue={formData.anio}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Categoría (opcional)</Label>
            <LabeledSelect
              name="categoria_id"
              defaultValue={formData.categoria_id || "none"}
              placeholder="Todas las categorías"
              options={[
                { value: "none", label: "Todas las categorías" },
                ...categoriasGasto.map((cat) => ({
                  value: cat.id,
                  label: cat.nombre,
                  color: cat.color,
                })),
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Presupuesto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
