"use client"

import { useState, useEffect } from "react"
import { Plus, Pencil, Receipt } from "lucide-react"
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
import { crearGasto, actualizarGasto } from "@/app/actions/gastos"
import type { Categoria, Gasto } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"
import { CurrencyInput } from "@/components/dashboard/currency-input"

const metodosPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta_debito", label: "Tarjeta Débito" },
  { value: "tarjeta_credito", label: "Tarjeta Crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "otro", label: "Otro" },
]

interface GastoDialogProps {
  categorias: Categoria[]
  gasto?: Gasto
  triggerVariant?: "default" | "ghost"
}

export function GastoDialog({
  categorias,
  gasto,
  triggerVariant = "default",
}: GastoDialogProps) {
  const [open, setOpen] = useState(false)
  const [comprobante, setComprobante] = useState(
    gasto?.comprobante_url ?? ""
  )
  const isEditing = !!gasto

  useEffect(() => {
    if (gasto) {
      setComprobante(gasto.comprobante_url ?? "")
    }
  }, [gasto])

  async function handleSubmit(formData: FormData) {
    const catId = formData.get("categoria_id") as string
    const input = {
      categoria_id: catId && catId !== "none" ? catId : null,
      fecha: formData.get("fecha") as string,
      valor: Number(formData.get("valor_raw")) || 0,
      descripcion: (formData.get("descripcion") as string) || null,
      metodo_pago: (formData.get("metodo_pago") as string) || null,
      comprobante_url: (formData.get("comprobante_url") as string) || null,
    }

    if (input.valor <= 0) {
      toast.error("El valor debe ser mayor a 0")
      return
    }

    const result =
      isEditing && gasto
        ? await actualizarGasto(gasto.id, input)
        : await crearGasto(input)

    if (result.success) {
      toast.success(result.message)
      setOpen(false)
    } else {
      toast.error(result.message)
    }
  }

  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant={triggerVariant} size={triggerVariant === "ghost" ? "icon-sm" : "default"}>
            {triggerVariant === "default" ? (
              <>
                <Plus className="size-4" />
                Nuevo Gasto
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Gasto" : "Nuevo Gasto"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos del gasto"
              : "Registra un nuevo gasto en tu cuenta"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              name="descripcion"
              placeholder="Ej: Mercado del día, factura de electricidad..."
              defaultValue={gasto?.descripcion ?? ""}
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor">Valor</Label>
              <CurrencyInput
                id="valor"
                name="valor"
                defaultValue={gasto?.valor ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                name="fecha"
                type="date"
                defaultValue={gasto?.fecha ?? new Date().toISOString().split("T")[0]}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoría</Label>
              <LabeledSelect
                name="categoria_id"
                defaultValue={gasto?.categoria_id ?? "none"}
                placeholder="Sin categoría"
                options={[
                  { value: "none", label: "Sin categoría" },
                  ...categoriasGasto.map((cat) => ({
                    value: cat.id,
                    label: cat.nombre,
                    color: cat.color,
                  })),
                ]}
              />
            </div>

            <div className="space-y-2">
              <Label>Método de Pago</Label>
              <LabeledSelect
                name="metodo_pago"
                defaultValue={gasto?.metodo_pago ?? "none"}
                placeholder="Sin especificar"
                options={[
                  { value: "none", label: "Sin especificar" },
                  ...metodosPago.map((m) => ({
                    value: m.value,
                    label: m.label,
                  })),
                ]}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comprobante_url">URL del Comprobante (opcional)</Label>
            <Input
              id="comprobante_url"
              name="comprobante_url"
              type="url"
              placeholder="https://..."
              value={comprobante}
              onChange={(e) => setComprobante(e.target.value)}
            />
            {comprobante && (
              <a
                href={comprobante}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <Receipt className="size-3" />
                Ver comprobante
              </a>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Gasto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
