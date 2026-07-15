"use client"

import { useState } from "react"
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
import { crearCategoria, actualizarCategoria } from "@/app/actions/categorias"
import type { Categoria } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"

const colores = [
  "#ef4444",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#64748b",
]

const iconos = [
  { value: "briefcase", label: "Maletín" },
  { value: "laptop", label: "Laptop" },
  { value: "shopping-cart", label: "Carrito" },
  { value: "utensils", label: "Comida" },
  { value: "car", label: "Auto" },
  { value: "zap", label: "Energía" },
  { value: "music", label: "Música" },
  { value: "heart", label: "Salud" },
  { value: "home", label: "Casa" },
  { value: "gift", label: "Regalo" },
  { value: "plane", label: "Avión" },
  { value: "book", label: "Libro" },
  { value: "gamepad", label: "Juegos" },
  { value: "shirt", label: "Ropa" },
  { value: "phone", label: "Teléfono" },
  { value: "graduation-cap", label: "Educación" },
  { value: "dumbbell", label: "Gym" },
  { value: "coffee", label: "Café" },
  { value: "pizza", label: "Pizza" },
  { value: "wallet", label: "Billetera" },
]

interface CategoriaDialogProps {
  categoria?: Categoria
  triggerVariant?: "default" | "ghost"
}

export function CategoriaDialog({
  categoria,
  triggerVariant = "default",
}: CategoriaDialogProps) {
  const [open, setOpen] = useState(false)
  const [color, setColor] = useState(categoria?.color ?? "#6366f1")
  const isEditing = !!categoria

  async function handleSubmit(formData: FormData) {
    const input = {
      nombre: formData.get("nombre") as string,
      tipo: formData.get("tipo") as string,
      color: (formData.get("color") as string) || color,
      icono: formData.get("icono") as string,
    }

    if (!input.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    const result =
      isEditing && categoria
        ? await actualizarCategoria(categoria.id, input)
        : await crearCategoria(input)

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
                Nueva Categoría
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoría" : "Nueva Categoría"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la categoría"
              : "Crea una categoría para clasificar ingresos o gastos"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Alimentación, Salario..."
              defaultValue={categoria?.nombre ?? ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo</Label>
            <LabeledSelect
              name="tipo"
              defaultValue={categoria?.tipo ?? "gasto"}
              options={[
                { value: "ingreso", label: "Ingreso" },
                { value: "gasto", label: "Gasto" },
              ]}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <input type="hidden" name="color" value={color} />
            <div className="flex flex-wrap gap-2">
              {colores.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`size-8 rounded-lg transition-transform hover:scale-110 ${
                    color === c
                      ? "ring-2 ring-offset-2 ring-offset-background ring-foreground"
                      : ""
                  }`}
                  style={{ backgroundColor: c }}
                  aria-label={`Color ${c}`}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <Input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-16 cursor-pointer p-0"
              />
              <span className="text-xs text-muted-foreground">
                Personalizado: {color}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icono">Ícono</Label>
            <LabeledSelect
              name="icono"
              defaultValue={categoria?.icono ?? "circle"}
              placeholder="Selecciona un ícono"
              options={[
                { value: "circle", label: "Círculo (por defecto)" },
                ...iconos.map((ic) => ({
                  value: ic.value,
                  label: ic.label,
                })),
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Categoría"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
