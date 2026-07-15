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
import { crearCuenta, actualizarCuenta } from "@/app/actions/cuentas"
import type { Cuenta } from "@/types/database"
import { LabeledSelect } from "@/components/dashboard/labeled-select"

const tipos = [
  { value: "banco", label: "Banco (Bancolombia)" },
  { value: "billetera_digital", label: "Billetera Digital (Nequi/Daviplata)" },
  { value: "efectivo", label: "Efectivo" },
  { value: "ahorros", label: "Caja de Ahorro" },
  { value: "otro", label: "Otro" },
]

interface CuentaDialogProps {
  cuenta?: Cuenta
  triggerVariant?: "default" | "ghost"
}

export function CuentaDialog({
  cuenta,
  triggerVariant = "default",
}: CuentaDialogProps) {
  const [open, setOpen] = useState(false)
  const isEditing = !!cuenta

  async function handleSubmit(formData: FormData) {
    const input = {
      nombre: formData.get("nombre") as string,
      tipo: formData.get("tipo") as string,
      saldo_inicial: Number(formData.get("saldo_inicial")),
      saldo_actual: Number(formData.get("saldo_actual")),
    }

    if (!input.nombre.trim()) {
      toast.error("El nombre es obligatorio")
      return
    }

    const result =
      isEditing && cuenta
        ? await actualizarCuenta(cuenta.id, input)
        : await crearCuenta(input)

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
                Nueva Cuenta
              </>
            ) : (
              <Pencil className="size-3.5" />
            )}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cuenta" : "Nueva Cuenta"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Modifica los datos de la cuenta financiera"
              : "Registra una cuenta bancaria, billetera digital o efectivo"}
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Ej: Bancolombia Ahorros, Nequi, Efectivo..."
              defaultValue={cuenta?.nombre ?? ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Tipo de Cuenta</Label>
            <LabeledSelect
              name="tipo"
              defaultValue={cuenta?.tipo ?? "banco"}
              placeholder="Selecciona el tipo"
              options={tipos.map((t) => ({
                value: t.value,
                label: t.label,
              }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="saldo_inicial">Saldo Inicial</Label>
              <Input
                id="saldo_inicial"
                name="saldo_inicial"
                type="number"
                min="0"
                step="100"
                placeholder="0"
                defaultValue={cuenta?.saldo_inicial ?? 0}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="saldo_actual">Saldo Actual</Label>
              <Input
                id="saldo_actual"
                name="saldo_actual"
                type="number"
                step="100"
                placeholder="0"
                defaultValue={cuenta?.saldo_actual ?? 0}
                required
              />
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            El saldo actual se actualizará automáticamente cuando registres
            ingresos o gastos asociados a esta cuenta.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? "Guardar Cambios" : "Crear Cuenta"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
