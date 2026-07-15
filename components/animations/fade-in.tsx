"use client"

import { motion } from "motion/react"

interface FadeInProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  y?: number
  className?: string
  as?: "div" | "span" | "section"
}

export function FadeIn({
  children,
  delay = 0,
  duration = 0.4,
  y = 20,
  className,
  as = "div",
}: FadeInProps) {
  const Component = motion[as]

  return (
    <Component
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: "easeOut" as const }}
      className={className}
    >
      {children}
    </Component>
  )
}
