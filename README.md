# Monthly Finances

Aplicación web para gestión de finanzas personales enfocada en el mercado colombiano (COP, Bancolombia, Nequi).

## Tecnologías

- **Framework:** Next.js 16 (Turbopack)
- **UI:** Tailwind CSS v4, Motion (Framer Motion), @base-ui/react
- **Gráficos:** Recharts
- **Base de datos:** Supabase (PostgreSQL + Auth + Row Level Security)
- **Validación:** Zod
- **Pagos/Billeteras:** Bancolombia, Nequi

## Funcionalidades

- Dashboard con resumen financiero
- Gestión de ingresos, gastos, cuentas, categorías
- Presupuestos mensuales
- Metas de ahorro
- Deudas
- Análisis y exportación de datos
- Importación de movimientos desde CSV
- Autenticación (login, registro, recuperación de contraseña)
- Seguridad: CSP, HSTS, rate limiting, sanitización XSS, auditoría

## Empezar

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Variables de entorno

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Build

```bash
npm run build
```
