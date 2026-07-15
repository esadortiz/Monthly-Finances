import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StaggerRows, AnimatedRow } from "@/components/animations/stagger-rows"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MetaAhorroDialog } from "@/components/dashboard/metas/meta-dialog"
import { DeleteMetaAhorroButton } from "@/components/dashboard/metas/delete-meta-button"
import type { MetaAhorro } from "@/types/database"

export default async function MetasPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: metas } = await supabase
    .from("metas_ahorro")
    .select("*")
    .eq("usuario_id", user.id)
    .order("creado_en", { ascending: false })

  const metasList = (metas ?? []) as MetaAhorro[]
  const totalObjetivo = metasList.reduce((s, m) => s + Number(m.monto_objetivo), 0)
  const totalAhorrado = metasList.reduce((s, m) => s + Number(m.monto_actual), 0)

  function getProgress(gastado: number, objetivo: number): number {
    if (objetivo === 0) return 0
    return Math.min(Math.round((gastado / objetivo) * 100), 999)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Metas de Ahorro</h2>
          <p className="text-sm text-muted-foreground">
            Define y da seguimiento a tus objetivos de ahorro · {metasList.length} metas
          </p>
        </div>
        <MetaAhorroDialog />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Meta Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold tabular-nums">
              ${totalObjetivo.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ahorrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-emerald-600 tabular-nums">
              ${totalAhorrado.toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Por Ahorrar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl sm:text-2xl font-bold text-blue-600 tabular-nums">
              ${(totalObjetivo - totalAhorrado).toLocaleString("es-CO")}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          {metasList.length === 0 ? (
            <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
              No hay metas de ahorro. Crea la primera con el botón &quot;Nueva Meta&quot;.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Meta</TableHead>
                  <TableHead className="hidden md:table-cell">Fecha Límite</TableHead>
                  <TableHead className="text-right">Objetivo</TableHead>
                  <TableHead className="hidden sm:table-cell text-right">Ahorrado</TableHead>
                  <TableHead className="hidden md:table-cell text-right">Progreso</TableHead>
                  <TableHead className="w-[70px]"></TableHead>
                </TableRow>
              </TableHeader>
              <StaggerRows>
                {metasList.map((meta) => {
                  const progress = getProgress(
                    Number(meta.monto_actual),
                    Number(meta.monto_objetivo)
                  )
                  const completada = Number(meta.monto_actual) >= Number(meta.monto_objetivo)
                  return (
                    <AnimatedRow key={meta.id}>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span
                            className="hidden sm:inline-block size-3 rounded-full shrink-0"
                            style={{ backgroundColor: meta.color }}
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-sm leading-tight truncate">{meta.nombre}</p>
                            {meta.descripcion && (
                              <p className="hidden sm:block text-xs text-muted-foreground truncate">
                                {meta.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-sm text-muted-foreground">
                        {meta.fecha_limite
                          ? new Date(meta.fecha_limite).toLocaleDateString("es-CO", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "Sin fecha"}
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2 text-right font-medium tabular-nums">
                        ${Number(meta.monto_objetivo).toLocaleString("es-CO")}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell p-1.5 sm:p-2 text-right tabular-nums">
                        <span className={completada ? "text-emerald-600 font-medium" : ""}>
                          ${Number(meta.monto_actual).toLocaleString("es-CO")}
                        </span>
                      </TableCell>
                      <TableCell className="hidden md:table-cell p-1.5 sm:p-2 text-right">
                        <div className="flex items-center gap-2 justify-end">
                          <div className="w-20 sm:w-24 h-2 rounded-full bg-muted overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                completada ? "bg-emerald-500" : "bg-blue-500"
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground w-8 sm:w-10 text-right tabular-nums">
                            {progress}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="p-1.5 sm:p-2">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <MetaAhorroDialog
                            meta={meta}
                            triggerVariant="ghost"
                          />
                          <DeleteMetaAhorroButton
                            id={meta.id}
                            nombre={meta.nombre}
                          />
                        </div>
                      </TableCell>
                    </AnimatedRow>
                  )
                })}
              </StaggerRows>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
