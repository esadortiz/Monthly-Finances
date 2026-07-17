"use client"

import Image from "next/image"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"

export function Logo({ size = "sm", href, variant = "normal" }: { size?: "sm" | "md" | "lg"; href?: string; variant?: "normal" | "contrast" | "dark" }) {
  const { resolvedTheme } = useTheme()
  const dims = size === "lg" ? 40 : size === "md" ? 32 : 28

  let iconSrc: string
  if (variant === "dark") {
    iconSrc = "/images/logo-icon.svg"
  } else if (variant === "contrast") {
    iconSrc = resolvedTheme === "dark" ? "/images/logo-icon.svg" : "/images/logo-icon-blanco.svg"
  } else {
    iconSrc = resolvedTheme === "dark" ? "/images/logo-icon-blanco.svg" : "/images/logo-icon.svg"
  }

  const content = (
    <div className="flex items-center gap-2">
      <Image
        src={iconSrc}
        alt="Monthly Finances"
        width={dims}
        height={dims}
      />
      <span className={`font-semibold text-black dark:text-white ${size === "lg" ? "text-base" : "text-sm"}`}>Monthly Finances</span>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }
  return content
}
