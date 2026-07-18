import { z } from "zod"

const coloresValidos = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/

export const loginSchema = z.object({
  email: z.string().email("Correo inválido").max(255),
  password: z.string().min(1, "Contraseña requerida").max(128),
})

export const signupSchema = z.object({
  email: z.string().email("Correo inválido").max(255),
  password: z.string().min(6, "Mínimo 6 caracteres").max(128),
  confirmPassword: z.string().max(128),
  nombre: z.string().min(1, "Nombre requerido").max(100),
  apellido: z.string().min(1, "Apellido requerido").max(100),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})

export const recuperarSchema = z.object({
  email: z.string().email("Correo inválido").max(255),
})

export const categoriaSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100),
  tipo: z.enum(["ingreso", "gasto"]),
  color: z.string().regex(coloresValidos, "Color inválido"),
  icono: z.string().max(50).default(""),
})

export const cuentaSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100),
  tipo: z.enum(["banco", "billetera_digital", "efectivo", "ahorros", "otro"]),
  saldo_inicial: z.number().min(-999999999).max(999999999),
  saldo_actual: z.number().min(-999999999).max(999999999),
})

export const ingresoBaseSchema = z.object({
  cuenta_id: z.string().uuid("Cuenta inválida"),
  categoria_id: z.string().uuid("Categoría inválida").nullable().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  valor: z.number().min(0, "Valor debe ser positivo").max(999999999),
  descripcion: z.string().max(500).nullable().optional(),
})

export const gastoSchema = z.object({
  cuenta_id: z.string().uuid("Cuenta inválida"),
  categoria_id: z.string().uuid("Categoría inválida").nullable().optional(),
  fecha: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida (YYYY-MM-DD)"),
  valor: z.number().min(0, "Valor debe ser positivo").max(999999999),
  descripcion: z.string().max(500).nullable().optional(),
  metodo_pago: z.enum(["efectivo", "tarjeta_debito", "tarjeta_credito", "transferencia", "otro"]).nullable().optional(),
  comprobante_url: z.string().url("URL inválida").max(2048).nullable().optional(),
})

export const metaSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100),
  descripcion: z.string().max(500).nullable().optional(),
  monto_objetivo: z.number().min(1, "Debe ser mayor a 0").max(999999999),
  monto_actual: z.number().min(0).max(999999999).optional(),
  fecha_limite: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida").nullable().optional(),
  color: z.string().regex(coloresValidos, "Color inválido").optional(),
})

export const deudaSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100),
  acreedor: z.string().max(100).nullable().optional(),
  monto_total: z.number().min(0, "Debe ser positivo").max(999999999),
  monto_pagado: z.number().min(0).max(999999999).optional(),
  tasa_interes: z.number().min(0).max(100).nullable().optional(),
  cuotas_totales: z.number().int().min(0).max(999).nullable().optional(),
  cuotas_pagadas: z.number().int().min(0).max(999).optional(),
  fecha_limite: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  estado: z.enum(["pendiente", "al_dia", "pagada"]).optional(),
})

export const presupuestoSchema = z.object({
  categoria_id: z.string().uuid().nullable().optional(),
  nombre: z.string().min(1, "Nombre requerido").max(100),
  monto_mensual: z.number().min(0).max(999999999),
  periodo: z.enum(["mensual", "quincenal"]).default("mensual"),
  mes: z.number().int().min(1).max(12),
  anio: z.number().int().min(2020).max(2100),
})

export const recordatorioSchema = z.object({
  titulo: z.string().min(1, "Título requerido").max(200),
  descripcion: z.string().max(500).nullable().optional(),
  tipo: z.enum(["pago", "vencimiento", "personalizado"]),
  fecha_recordatorio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Fecha inválida"),
  fecha_vencimiento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
  completado: z.boolean().optional(),
  recurrencia: z.enum(["diaria", "semanal", "mensual", "anual"]).nullable().optional(),
})

export const perfilSchema = z.object({
  nombre: z.string().min(1, "Nombre requerido").max(100),
  apellido: z.string().min(1, "Apellido requerido").max(100),
  telefono: z.string().max(20).default(""),
})

export const cambiarPasswordSchema = z.object({
  password_actual: z.string().min(1, "Contraseña actual requerida").max(128),
  password_nueva: z.string().min(6, "Mínimo 6 caracteres").max(128),
})

export const importarFilaSchema = z.object({
  fecha: z.string().min(1),
  descripcion: z.string().max(500).nullable().optional(),
  valor: z.number(),
  categoria_nombre: z.string().max(100).nullable().optional(),
  cuenta_nombre: z.string().max(100).nullable().optional(),
  metodo_pago: z.string().max(50).nullable().optional(),
})

export type CategoriaInput = z.infer<typeof categoriaSchema>
export type CuentaInput = z.infer<typeof cuentaSchema>
export type IngresoInput = z.infer<typeof ingresoBaseSchema>
export type GastoInput = z.infer<typeof gastoSchema>
export type MetaAhorroInput = z.infer<typeof metaSchema>
export type DeudaInput = z.infer<typeof deudaSchema>
export type PresupuestoInput = z.infer<typeof presupuestoSchema>
export type RecordatorioInput = z.infer<typeof recordatorioSchema>
