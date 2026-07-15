import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ImportForm } from "@/components/dashboard/importar/import-form"

export default async function ImportarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const [{ data: cuentas }, { data: categorias }] = await Promise.all([
    supabase.from("cuentas").select("id, nombre").eq("usuario_id", user.id).order("nombre"),
    supabase.from("categorias").select("id, nombre, tipo").eq("usuario_id", user.id).order("nombre"),
  ])

  const cuentasList = cuentas ?? []
  const categoriasIngreso = (categorias ?? []).filter((c) => c.tipo === "ingreso")
  const categoriasGasto = (categorias ?? []).filter((c) => c.tipo === "gasto")

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Importar Transacciones</h2>
        <p className="text-sm text-muted-foreground">
          Sube un archivo CSV con tus movimientos bancarios
        </p>
      </div>

      <ImportForm
        cuentas={cuentasList}
        categoriasIngreso={categoriasIngreso}
        categoriasGasto={categoriasGasto}
      />
    </div>
  )
}
