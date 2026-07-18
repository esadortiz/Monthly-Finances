export interface Cuenta {
  id: string
  usuario_id: string
  nombre: string
  tipo: 'banco' | 'billetera_digital' | 'efectivo' | 'ahorros' | 'otro'
  saldo_inicial: number
  saldo_actual: number
  creado_en: string
  actualizado_en: string
}

export interface Categoria {
  id: string
  usuario_id: string
  nombre: string
  tipo: 'ingreso' | 'gasto'
  color: string
  icono: string
  creado_en: string
}

export interface Ingreso {
  id: string
  usuario_id: string
  cuenta_id: string
  categoria_id: string | null
  fecha: string
  valor: number
  descripcion: string | null
  creado_en: string
  actualizado_en: string
}

export interface Gasto {
  id: string
  usuario_id: string
  cuenta_id: string
  categoria_id: string | null
  fecha: string
  metodo_pago: string | null
  valor: number
  descripcion: string | null
  comprobante_url: string | null
  creado_en: string
  actualizado_en: string
}

export interface DashboardData {
  saldo_disponible: number
  ingresos_mes: number
  gastos_mes: number
  balance: number
  cuentas: Cuenta[]
  ultimos_movimientos: Movimiento[]
  gastos_por_categoria: { categoria: string; total: number; color: string }[]
  ingresos_recientes: { fecha: string; total: number }[]
  gastos_recientes: { fecha: string; total: number }[]
}

export interface Presupuesto {
  id: string
  usuario_id: string
  categoria_id: string | null
  nombre: string
  monto_mensual: number
  periodo: 'mensual' | 'quincenal'
  mes: number
  anio: number
  gastado: number
  creado_en: string
  actualizado_en: string
}

export interface MetaAhorro {
  id: string
  usuario_id: string
  nombre: string
  descripcion: string | null
  monto_objetivo: number
  monto_actual: number
  fecha_limite: string | null
  color: string
  creado_en: string
  actualizado_en: string
}

export interface Deuda {
  id: string
  usuario_id: string
  nombre: string
  acreedor: string | null
  monto_total: number
  monto_pagado: number
  tasa_interes: number | null
  cuotas_totales: number | null
  cuotas_pagadas: number
  fecha_limite: string | null
  estado: 'pendiente' | 'al_dia' | 'pagada'
  creado_en: string
  actualizado_en: string
}

export interface Recordatorio {
  id: string
  usuario_id: string
  titulo: string
  descripcion: string | null
  tipo: 'pago' | 'vencimiento' | 'personalizado'
  fecha_recordatorio: string
  fecha_vencimiento: string | null
  completado: boolean
  recurrencia: 'diaria' | 'semanal' | 'mensual' | 'anual' | null
  creado_en: string
  actualizado_en: string
}

export interface Movimiento {
  id: string
  tipo: 'ingreso' | 'gasto'
  descripcion: string | null
  valor: number
  fecha: string
  categoria_nombre: string | null
  categoria_color: string | null
  cuenta_nombre: string
}
