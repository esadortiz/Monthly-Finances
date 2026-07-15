"use client"

import { motion } from "motion/react"

export function StaggerRows({ children }: { children: React.ReactNode }) {
  return (
    <motion.tbody
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
    >
      {children}
    </motion.tbody>
  )
}

export const rowItem = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
}

export function AnimatedRow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.tr
      variants={rowItem}
      whileHover={{ backgroundColor: "var(--accent)", transition: { duration: 0.15 } }}
      className={className}
    >
      {children}
    </motion.tr>
  )
}
