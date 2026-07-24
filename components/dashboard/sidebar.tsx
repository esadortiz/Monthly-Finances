"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "motion/react"
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Tags,
  PiggyBank,
  Target,
  CreditCard,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Logo } from "@/components/logo"
import { logout } from "@/app/actions/auth"
import { useState, useEffect } from "react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ingresos", label: "Ingresos", icon: TrendingUp },
  { href: "/dashboard/gastos", label: "Gastos", icon: TrendingDown },
  { href: "/dashboard/categorias", label: "Categorías", icon: Tags },
  { href: "/dashboard/presupuestos", label: "Presupuestos", icon: PiggyBank },
  { href: "/dashboard/metas", label: "Metas", icon: Target },
  { href: "/dashboard/deudas", label: "Deudas", icon: CreditCard },
  { href: "/dashboard/configuracion", label: "Perfil", icon: UserCircle },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024)
  }, [])

  return (
    <>
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "fixed left-4 top-3 z-50 flex size-8 items-center justify-center rounded-lg ring-1 ring-border lg:hidden",
          collapsed ? "bg-background" : "hidden"
        )}
        aria-label={collapsed ? "Abrir menú" : "Cerrar menú"}
      >
        <Menu className="size-4" />
      </button>

      <motion.aside
        initial={false}
        animate={{ x: isDesktop ? 0 : collapsed ? "-100%" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-[#0f0f12] border-r border-border",
          "lg:sticky lg:top-0 lg:w-56 lg:h-screen lg:translate-x-0"
        )}
      >
        <div className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
          <button
            onClick={() => setCollapsed(true)}
            className="flex size-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-border lg:hidden"
            aria-label="Cerrar menú"
          >
            <X className="size-4" />
          </button>
          <div className="min-w-0 flex-1">
            <Logo />
          </div>
        </div>

        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item, i) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * i, ease: "easeOut" }}
              >
                <Link
                  href={item.href}
                  onClick={() => setCollapsed(true)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  )}
                >
                  <item.icon className="size-4 shrink-0" />
                  {item.label}
                </Link>
              </motion.div>
            )
          })}
        </nav>

        <div className="shrink-0 border-t p-2">
          <form action={logout}>
            <motion.button
              type="submit"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="size-4 shrink-0" />
              Cerrar Sesión
            </motion.button>
          </form>
        </div>
      </motion.aside>

      <AnimatePresence>
        {!collapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/45 backdrop-blur-sm lg:hidden"
            onClick={() => setCollapsed(true)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
