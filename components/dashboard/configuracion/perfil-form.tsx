"use client"

import { useState, useTransition } from "react"
import { User, Save } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { actualizarPerfil } from "@/app/actions/perfil"

interface PerfilFormProps {
  email: string
  nombre: string
  apellido: string
  telefono: string
}

export function PerfilForm({ email, nombre, apellido, telefono }: PerfilFormProps) {
  const [isPending, startTransition] = useTransition()

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      const input = {
        nombre: (formData.get("nombre") as string).trim(),
        apellido: (formData.get("apellido") as string).trim(),
        telefono: (formData.get("telefono") as string).trim(),
      }

      const result = await actualizarPerfil(input)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="size-5" />
          Información Personal
        </CardTitle>
        <CardDescription>
          Actualiza tus datos personales. El correo electrónico no se puede cambiar.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <div className="flex h-8 items-center rounded-lg border border-border bg-muted/50 px-2.5 text-sm text-muted-foreground">
              {email}
            </div>
            <p className="text-xs text-muted-foreground">
              El correo no se puede modificar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre</Label>
              <Input
                id="nombre"
                name="nombre"
                placeholder="Tu nombre"
                defaultValue={nombre}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apellido">Apellido</Label>
              <Input
                id="apellido"
                name="apellido"
                placeholder="Tu apellido"
                defaultValue={apellido}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              type="tel"
              placeholder="+57 300 000 0000"
              defaultValue={telefono}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              <Save className="size-4" />
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}