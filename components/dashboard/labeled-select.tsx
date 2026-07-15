"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export interface SelectOption {
  value: string
  label: string
  color?: string
}

interface LabeledSelectProps {
  name: string
  options: SelectOption[]
  defaultValue?: string
  placeholder?: string
  required?: boolean
  className?: string
  triggerClassName?: string
}

export function LabeledSelect({
  name,
  options,
  defaultValue = "",
  placeholder,
  required,
  className,
  triggerClassName,
}: LabeledSelectProps) {
  // Mapa value -> label para renderizar el texto del trigger
  const labelMap = new Map(options.map((o) => [o.value, o]))

  return (
    <Select name={name} defaultValue={defaultValue} required={required}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue placeholder={placeholder}>
          {(value: string) => {
            const opt = labelMap.get(value)
            if (!opt) return <span>{placeholder ?? ""}</span>
            return (
              <span className="flex items-center gap-1.5">
                {opt.color && (
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                )}
                {opt.label}
              </span>
            )
          }}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.color && (
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: opt.color }}
              />
            )}
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
