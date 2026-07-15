import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PerfilForm } from "@/components/dashboard/configuracion/perfil-form"
import { PasswordForm } from "@/components/dashboard/configuracion/password-form"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function ConfiguracionPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const metadata = user.user_metadata ?? {}

  const iniciales =
    (metadata.nombre?.[0] ?? "") + (metadata.apellido?.[0] ?? "")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Perfil</h2>
        <p className="text-sm text-muted-foreground">
          Gestiona tu información personal y contraseña
        </p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-3 sm:gap-4 p-4">
          <Avatar size="lg" className="shrink-0 bg-primary text-primary-foreground">
            <AvatarFallback className="bg-primary text-primary-foreground">
              {iniciales || user.email?.[0].toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="text-base sm:text-lg font-semibold truncate">
              {metadata.nombre && metadata.apellido
                ? `${metadata.nombre} ${metadata.apellido}`
                : metadata.nombre || "Usuario"}
            </h3>
            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          </div>
          <Badge variant="secondary" className="hidden sm:inline-flex shrink-0">Cuenta activa</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <PerfilForm
          email={user.email ?? ""}
          nombre={metadata.nombre ?? ""}
          apellido={metadata.apellido ?? ""}
          telefono={metadata.telefono ?? ""}
        />
        <PasswordForm />
      </div>
    </div>
  )
}
