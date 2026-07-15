"use client"

import { motion } from "motion/react"
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
  type LucideIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

const iconMap: Record<string, LucideIcon> = {
  Wallet,
  TrendingUp,
  TrendingDown,
  RefreshCcw,
}

interface StatsCardProps {
  title: string
  value: string
  icon: string
  className?: string
  iconClassName?: string
}

export function StatsCard({
  title,
  value,
  icon: iconName,
  className,
  iconClassName,
}: StatsCardProps) {
  const Icon = iconMap[iconName] ?? Wallet

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: "easeOut" },
        },
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className={cn("group", className)}
    >
      <Card className="relative overflow-hidden transition-shadow duration-200 group-hover:shadow-lg">
        <CardContent className="flex items-start gap-4 p-4">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-lg",
              iconClassName
            )}
          >
            <Icon className="size-5" />
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <span className="text-sm text-muted-foreground">{title}</span>
            <motion.span
              className="text-xl font-semibold tracking-tight truncate"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            >
              {value}
            </motion.span>
          </div>
        </CardContent>
        <div className="absolute right-0 top-0 size-24 translate-x-8 -translate-y-8 rounded-full bg-foreground/[0.02]" />
      </Card>
    </motion.div>
  )
}
