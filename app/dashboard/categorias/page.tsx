import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CategoriaDialog } from "@/components/dashboard/categorias/categoria-dialog"
import { DeleteCategoriaButton } from "@/components/dashboard/categorias/delete-categoria-button"
import type { Categoria } from "@/types/database"

export default async function CategoriasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: categorias } = await supabase
    .from("categorias")
    .select("*")
    .eq("usuario_id", user.id)
    .order("tipo")
    .order("nombre")

  const categoriasList = (categorias ?? []) as Categoria[]
  const categoriasIngreso = categoriasList.filter((c) => c.tipo === "ingreso")
  const categoriasGasto = categoriasList.filter((c) => c.tipo === "gasto")

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Categorías</h2>
          <p className="text-sm text-muted-foreground">
            Administra las categorías de ingresos y gastos
          </p>
        </div>
        <CategoriaDialog />
      </div>

      {categoriasList.length === 0 ? (
        <Card>
          <CardContent className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
            No hay categorías registradas. Crea la primera con el botón "Nueva Categoría".
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  ↑
                </span>
                Categorías de Ingreso
                <Badge variant="secondary">{categoriasIngreso.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {categoriasIngreso.length === 0 ? (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  No hay categorías de ingreso
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {categoriasIngreso.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                    >
                      <span
                        className="flex size-9 items-center justify-center rounded-lg text-sm"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        ●
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {cat.nombre}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cat.icono}
                      </span>
                      <div className="flex items-center gap-1">
                        <CategoriaDialog categoria={cat} triggerVariant="ghost" />
                        <DeleteCategoriaButton id={cat.id} nombre={cat.nombre} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex size-6 items-center justify-center rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  ↓
                </span>
                Categorías de Gasto
                <Badge variant="secondary">{categoriasGasto.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {categoriasGasto.length === 0 ? (
                <div className="px-4 pb-4 text-sm text-muted-foreground">
                  No hay categorías de gasto
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {categoriasGasto.map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/50"
                    >
                      <span
                        className="flex size-9 items-center justify-center rounded-lg text-sm"
                        style={{ backgroundColor: `${cat.color}20`, color: cat.color }}
                      >
                        ●
                      </span>
                      <span className="flex-1 text-sm font-medium">
                        {cat.nombre}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {cat.icono}
                      </span>
                      <div className="flex items-center gap-1">
                        <CategoriaDialog categoria={cat} triggerVariant="ghost" />
                        <DeleteCategoriaButton id={cat.id} nombre={cat.nombre} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
