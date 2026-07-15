"use client"

import { useState, useTransition } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cambiarContraseña } from "@/app/actions/perfil"

export function PasswordForm() {
  const [isPending, startTransition] = useTransition()
  const [showActual, setShowActual] = useState(false)
  const [showNueva, setShowNueva] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  async function handleSubmit(formData: FormData) {
    const passwordNueva = formData.get("password_nueva") as string
    const passwordConfirm = formData.get("password_confirm") as string

    if (passwordNueva !== passwordConfirm) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    if (passwordNueva.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres")
      return
    }

    startTransition(async () => {
      const result = await cambiarContraseña({
        password_actual: formData.get("password_actual") as string,
        password_nueva: passwordNueva,
      })

      if (result.success) {
        toast.success(result.message)
        const form = document.getElementById("password-form") as HTMLFormElement
        form?.reset()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="size-5" />
          Cambiar Contraseña
        </CardTitle>
        <CardDescription>
          Asegúrate de usar una contraseña segura con al menos 6 caracteres.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="space-y-4" id="password-form">
          <div className="space-y-2">
            <Label htmlFor="password_actual">Contraseña Actual</Label>
            <div className="relative">
              <Input
                id="password_actual"
                name="password_actual"
                type={showActual ? "text" : "password"}
                placeholder="••••••••"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowActual(!showActual)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showActual ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="password_nueva">Nueva Contraseña</Label>
              <div className="relative">
                <Input
                  id="password_nueva"
                  name="password_nueva"
                  type={showNueva ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNueva(!showNueva)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNueva ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password_confirm">Confirmar Contraseña</Label>
              <div className="relative">
                <Input
                  id="password_confirm"
                  name="password_confirm"
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" variant="default" disabled={isPending}>
              <Lock className="size-4" />
              {isPending ? "Actualizando..." : "Cambiar Contraseña"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}