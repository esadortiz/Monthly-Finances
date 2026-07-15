"use server"

import { createClient } from "@/lib/supabase/server"
import { importarFilaSchema } from "@/lib/validation/schemas"
import { sanitizeOptional } from "@/lib/security/sanitize"
import { checkRateLimit } from "@/lib/security/rate-limiter"

type FilaImportada = {
  fecha: string
  descripcion: string
  valor: number
  categoria_nombre?: string
  cuenta_nombre?: string
  metodo_pago?: string
}

type Resultado = {
  success: boolean
  message: string
  insertados: number
  errores: number
}

export async function importarTransacciones(
  tipo: "ingreso" | "gasto",
  filas: FilaImportada[],
  cuenta_id?: string,
  categoria_id?: string
): Promise<Resultado> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error("No autorizado")

  const rateCheck = checkRateLimit(`importar:${user.id}`, 5, 60 * 1000)
  if (!rateCheck.allowed) {
    return {
      success: false,
      message: "Demasiadas importaciones. Espera un momento.",
      insertados: 0,
      errores: filas.length,
    }
  }

  if (filas.length > 5000) {
    return {
      success: false,
      message: "Máximo 5000 registros por importación",
      insertados: 0,
      errores: filas.length,
    }
  }

  let insertados = 0
  let errores = 0

  for (const fila of filas) {
    try {
      const parsed = importarFilaSchema.safeParse(fila)
      if (!parsed.success) {
        errores++
        continue
      }

      if (!parsed.data.fecha || !parsed.data.valor || isNaN(parsed.data.valor)) {
        errores++
        continue
      }

      const fecha = new Date(parsed.data.fecha).toISOString().split("T")[0]
      if (!fecha) {
        errores++
        continue
      }

      const record = {
        usuario_id: user.id,
        cuenta_id: cuenta_id ?? null,
        categoria_id: categoria_id ?? null,
        fecha,
        valor: Math.abs(parsed.data.valor),
        descripcion: sanitizeOptional(parsed.data.descripcion),
        ...(tipo === "gasto" ? { metodo_pago: parsed.data.metodo_pago || null } : {}),
      }

      const { error } = await supabase
        .from(tipo === "ingreso" ? "ingresos" : "gastos")
        .insert(record)

      if (error) {
        errores++
      } else {
        insertados++
      }
    } catch {
      errores++
    }
  }

  return {
    success: errores === 0,
    message: `Se insertaron ${insertados} registros${errores > 0 ? ` (${errores} errores)` : ""}`,
    insertados,
    errores,
  }
}
