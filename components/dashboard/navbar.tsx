"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { useTheme } from "@/components/theme-provider"
import { Moon, Sun, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Navbar() {
  const { theme, setTheme } = useTheme()

  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex h-14 items-center justify-between border-b bg-background/40 backdrop-blur-md px-4 lg:px-6 sticky top-0 z-30"
    >
      <div className="flex items-center gap-2" />

      <div className="flex items-center gap-2">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Cambiar tema"
          >
            <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/dashboard/configuracion" title="Perfil">
            <Avatar size="sm" className="cursor-pointer">
              <AvatarFallback>
                <User className="size-3.5" />
              </AvatarFallback>
            </Avatar>
          </Link>
        </motion.div>
      </div>
    </motion.header>
  )
}
