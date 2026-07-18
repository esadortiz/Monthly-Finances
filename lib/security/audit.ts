import { createClient } from "@/lib/supabase/server"

export type AccionAuditable =
  | "login"
  | "logout"
  | "registro"
  | "cambio_password"
  | "recuperar_password"
  | "crear"
  | "actualizar"
  | "eliminar"
  | "exportar"

export async function registrarAuditoria(
  usuarioId: string,
  accion: AccionAuditable,
  entidad: string,
  entidadId?: string,
  detalles?: Record<string, unknown>
) {
  try {
    const supabase = await createClient()
    await supabase.from("auditoria").insert({
      usuario_id: usuarioId,
      accion,
      entidad,
      entidad_id: entidadId || null,
      detalles: detalles || null,
      ip: null,
    })
  } catch {
    // Fallo silencioso - no debe interrumpir la operación principal
  }
}
