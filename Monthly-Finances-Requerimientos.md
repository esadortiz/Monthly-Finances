# Documento de Requerimientos
# Monthly Finances
### SaaS para Gestión de Gastos Personales y Finanzas

---

## 1. Descripción del Proyecto

**Monthly Finances** es una plataforma SaaS (Software as a Service) diseñada para ayudar a las personas a administrar sus finanzas personales desde cualquier dispositivo.

Permitirá registrar ingresos, gastos, cuentas bancarias, presupuestos, metas de ahorro y generar reportes en tiempo real mediante una interfaz moderna, intuitiva y segura.

El sistema será multiusuario, por lo que cada usuario tendrá su propia cuenta y únicamente podrá acceder a su información.

---

## 2. Objetivo General

Desarrollar una plataforma web que permita administrar de forma sencilla y segura las finanzas personales, facilitando el control de ingresos, gastos y presupuestos mediante estadísticas y reportes.

---

## 3. Objetivos Específicos

- Registrar ingresos y gastos.
- Administrar múltiples cuentas financieras.
- Llevar control del presupuesto mensual.
- Visualizar estadísticas financieras.
- Generar reportes.
- Exportar información.
- Gestionar metas de ahorro.
- Gestionar deudas.
- Mantener la información segura mediante autenticación.

---

## 4. Tipo de Sistema

- SaaS
- Multiusuario
- Responsive
- Cloud
- Escalable

---

## 5. Roles del Sistema

### Usuario
Puede administrar únicamente su información.

### Administrador
Puede administrar la plataforma:
- Usuarios
- Estadísticas generales
- Configuración del sistema
- Planes (futuro)
- Soporte

---

## 6. Tecnologías

**Frontend**
- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/UI
- React Hook Form

**Backend**
- Next.js Server Actions
- Supabase
- PostgreSQL

**Autenticación**
- Supabase Auth

**Despliegue**
- Vercel

**Librerías**
- Recharts
- TanStack Table
- React Query
- Zod
- React Hot Toast

---

## 7. Arquitectura

```
Cliente
    │
    ▼
Next.js
    │
Server Actions / API
    │
    ▼
Supabase Auth
    │
    ▼
PostgreSQL
```

---

## 8. Roadmap por Fases

La construcción de Monthly Finances se organiza en 5 fases incrementales, priorizando primero un MVP funcional y luego expandiendo hacia funcionalidades avanzadas y de inteligencia artificial.

---

### 🟢 FASE 1 — MVP (Núcleo funcional)

**Objetivo:** Tener una versión usable donde el usuario pueda registrarse, iniciar sesión y llevar el control básico de ingresos y gastos.

**Módulos incluidos**
- Autenticación (registro, inicio de sesión, cerrar sesión, verificación por correo)
- Dashboard básico (saldo disponible, ingresos del mes, gastos del mes, balance, últimos movimientos)
- Ingresos (crear, editar, eliminar, buscar, filtrar)
- Gastos (registrar, editar, eliminar, buscar, filtrar, adjuntar comprobante)
- Categorías (crear, editar, eliminar, color, ícono)
- Cuentas (Bancolombia, Nequi, Daviplata, efectivo, caja de ahorro — con nombre, tipo, saldo inicial y saldo actual)
- Perfil básico (editar información, cambiar contraseña)

**Requerimientos Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RF-01 | El usuario podrá registrarse. |
| RF-02 | El usuario podrá iniciar sesión. |
| RF-03 | El usuario podrá recuperar su contraseña. |
| RF-04 | El usuario podrá registrar ingresos. |
| RF-05 | El usuario podrá registrar gastos. |
| RF-06 | El usuario podrá editar ingresos y gastos. |
| RF-07 | El usuario podrá eliminar registros. |
| RF-08 | El usuario podrá administrar categorías. |
| RF-09 | El usuario podrá administrar cuentas financieras. |
| RF-16 | El usuario podrá configurar su perfil. |
| RF-18 | Cada usuario solo podrá acceder a su propia información. |

**Requerimientos No Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RNF-01 | Diseño responsive para computador, tablet y móvil. |
| RNF-02 | Autenticación segura mediante JWT o Supabase Auth. |
| RNF-03 | Cifrado de contraseñas. |
| RNF-07 | Interfaz moderna e intuitiva. |
| RNF-08 | Compatibilidad con Chrome, Edge, Firefox y Safari. |

---

### 🟡 FASE 2 — Control Financiero Avanzado

**Objetivo:** Añadir herramientas de planificación financiera: presupuestos, metas de ahorro, deudas y recordatorios.

**Módulos incluidos**
- Presupuestos (por categoría y mes; mostrar presupuesto, gastado, disponible, % utilizado)
- Metas de ahorro (ej. viaje, moto, casa, emergencias; mostrar meta, ahorrado, faltante, progreso)
- Deudas (banco, tarjetas, personas, préstamos; campos: acreedor, valor, cuotas, fecha límite, estado)
- Recordatorios (servicios, tarjetas, arriendo, créditos, seguros)

**Requerimientos Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RF-10 | El usuario podrá crear presupuestos. |
| RF-11 | El usuario podrá crear metas de ahorro. |
| RF-12 | El usuario podrá registrar deudas. |
| RF-17 | El sistema enviará recordatorios de pagos. |

**Requerimientos No Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RNF-05 | Tiempo de respuesta menor a 2 segundos en operaciones comunes. |
| RNF-09 | Copias de seguridad automáticas de la información. |

---

### 🔵 FASE 3 — Estadísticas, Reportes y Exportación

**Objetivo:** Dar visibilidad completa al usuario sobre su información financiera mediante gráficos, reportes y exportación de datos.

**Módulos incluidos**
- Dashboard avanzado (gastos por categoría, ingresos por categoría, gráficos, resumen mensual)
- Reportes (gastos mensuales/anuales, ingresos, balance, categorías, presupuestos)
- Gráficos (barras, circular, línea, calendario)
- Calendario financiero (gastos por día, ingresos por día, eventos financieros)
- Exportaciones (Excel, PDF, CSV)

**Requerimientos Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RF-13 | El usuario podrá generar reportes. |
| RF-14 | El usuario podrá exportar información a PDF, Excel y CSV. |
| RF-15 | El usuario podrá consultar estadísticas financieras. |

**Requerimientos No Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RNF-04 | Alta disponibilidad del servicio. |
| RNF-06 | Base de datos escalable. |

---

### 🟣 FASE 4 — Panel Administrativo y Escalabilidad

**Objetivo:** Habilitar la gestión de la plataforma a nivel administrativo y preparar la arquitectura para crecer.

**Módulos incluidos**
- Panel de administrador (gestión de usuarios, estadísticas generales, configuración del sistema, soporte)
- Gestión de planes (futuro / base para monetización)
- Mejoras de perfil (cambiar foto, configuración personal avanzada)

**Requerimientos Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RF-19 | El administrador podrá gestionar usuarios y monitorear la plataforma. |

**Requerimientos No Funcionales cubiertos**

| Código | Requerimiento |
|--------|----------------|
| RNF-10 | Arquitectura preparada para crecimiento y nuevos módulos. |

---

### 🟠 FASE 5 — Funcionalidades Futuras / Innovación

**Objetivo:** Diferenciar a Monthly Finances de la competencia mediante inteligencia artificial, automatización y expansión a nuevas plataformas.

**Funcionalidades planeadas**
- IA para clasificar gastos automáticamente.
- Lectura de facturas mediante OCR.
- Escaneo de recibos.
- Conexión con bancos (Open Banking).
- Notificaciones push.
- Aplicación móvil (iOS / Android).
- Finanzas familiares.
- Presupuestos compartidos.
- Suscripción Premium.
- API pública.

*Nota: Esta fase no tiene RF/RNF asignados formalmente ya que corresponde a evolución del producto post-lanzamiento, sujeta a validación con usuarios reales.*

---

## 9. Resumen de Requerimientos Funcionales (RF) — Vista Completa

| Código | Requerimiento | Fase |
|--------|----------------|------|
| RF-01 | El usuario podrá registrarse. | 1 |
| RF-02 | El usuario podrá iniciar sesión. | 1 |
| RF-03 | El usuario podrá recuperar su contraseña. | 1 |
| RF-04 | El usuario podrá registrar ingresos. | 1 |
| RF-05 | El usuario podrá registrar gastos. | 1 |
| RF-06 | El usuario podrá editar ingresos y gastos. | 1 |
| RF-07 | El usuario podrá eliminar registros. | 1 |
| RF-08 | El usuario podrá administrar categorías. | 1 |
| RF-09 | El usuario podrá administrar cuentas financieras. | 1 |
| RF-10 | El usuario podrá crear presupuestos. | 2 |
| RF-11 | El usuario podrá crear metas de ahorro. | 2 |
| RF-12 | El usuario podrá registrar deudas. | 2 |
| RF-13 | El usuario podrá generar reportes. | 3 |
| RF-14 | El usuario podrá exportar información a PDF, Excel y CSV. | 3 |
| RF-15 | El usuario podrá consultar estadísticas financieras. | 3 |
| RF-16 | El usuario podrá configurar su perfil. | 1 |
| RF-17 | El sistema enviará recordatorios de pagos. | 2 |
| RF-18 | Cada usuario solo podrá acceder a su propia información. | 1 |
| RF-19 | El administrador podrá gestionar usuarios y monitorear la plataforma. | 4 |

---

## 10. Resumen de Requerimientos No Funcionales (RNF) — Vista Completa

| Código | Requerimiento | Fase |
|--------|----------------|------|
| RNF-01 | Diseño responsive para computador, tablet y móvil. | 1 |
| RNF-02 | Autenticación segura mediante JWT o Supabase Auth. | 1 |
| RNF-03 | Cifrado de contraseñas. | 1 |
| RNF-04 | Alta disponibilidad del servicio. | 3 |
| RNF-05 | Tiempo de respuesta menor a 2 segundos en operaciones comunes. | 2 |
| RNF-06 | Base de datos escalable. | 3 |
| RNF-07 | Interfaz moderna e intuitiva. | 1 |
| RNF-08 | Compatibilidad con Chrome, Edge, Firefox y Safari. | 1 |
| RNF-09 | Copias de seguridad automáticas de la información. | 2 |
| RNF-10 | Arquitectura preparada para crecimiento y nuevos módulos. | 4 |

---

## 11. Diagrama de Fases (Vista Rápida)

```
FASE 1 (MVP)        → Auth + Ingresos + Gastos + Categorías + Cuentas + Dashboard básico
FASE 2 (Planeación) → Presupuestos + Metas de ahorro + Deudas + Recordatorios
FASE 3 (Análisis)   → Reportes + Gráficos + Calendario + Exportaciones
FASE 4 (Admin)      → Panel administrativo + Escalabilidad + Planes
FASE 5 (Innovación) → IA + OCR + Open Banking + App móvil + Premium + API pública
```

---

*Documento generado para Monthly Finances — versión reestructurada por fases.*
