"use client"

import { Stagger } from "@/components/animations/stagger"
import { PropsWithChildren } from "react"

export function StaggerGrid({ children }: PropsWithChildren) {
  return <Stagger staggerDelay={0.08}>{children}</Stagger>
}
