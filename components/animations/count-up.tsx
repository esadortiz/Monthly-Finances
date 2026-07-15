"use client"

import { useEffect, useState, useRef } from "react"

interface CountUpProps {
  value: number
  duration?: number
  prefix?: string
  suffix?: string
  locale?: string
  decimals?: number
  className?: string
}

export function CountUp({
  value,
  duration = 1,
  prefix = "",
  suffix = "",
  locale = "es-CO",
  decimals = 0,
  className,
}: CountUpProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const prevValue = useRef(0)

  useEffect(() => {
    let startTime: number | null = null
    const startValue = prevValue.current
    const endValue = value

    if (startValue === endValue) return

    function animate(timestamp: number) {
      if (!startTime) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = startValue + (endValue - startValue) * eased

      setDisplayValue(Math.round(current))

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        prevValue.current = endValue
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={className}>
      {prefix}
      {displayValue.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  )
}
