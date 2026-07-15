"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  name: string
  defaultValue?: number | string
  required?: boolean
  className?: string
  id?: string
}

function formatear(valor: string): string {
  // Solo dígitos
  const digitos = valor.replace(/\D/g, "")
  if (!digitos) return ""
  // Formatear con separador de miles (punto)
  return Number(digitos).toLocaleString("es-CO")
}

function limpiar(valor: string): string {
  return valor.replace(/\D/g, "")
}

export function CurrencyInput({
  name,
  defaultValue,
  required,
  className,
  id,
}: CurrencyInputProps) {
  const valorInicial = defaultValue
    ? formatear(String(defaultValue))
    : ""

  const [valorFormateado, setValorFormateado] = useState(valorInicial)
  const [valorRaw, setValorRaw] = useState(
    defaultValue ? limpiar(String(defaultValue)) : ""
  )

  useEffect(() => {
    if (defaultValue !== undefined && defaultValue !== "") {
      setValorFormateado(formatear(String(defaultValue)))
      setValorRaw(limpiar(String(defaultValue)))
    } else {
      setValorFormateado("")
      setValorRaw("")
    }
  }, [defaultValue])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    const limpio = limpiar(input)
    setValorRaw(limpio)
    setValorFormateado(limpio ? formatear(limpio) : "")
  }

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
        $
      </span>
      <Input
        id={id}
        name={name}
        type="text"
        inputMode="numeric"
        placeholder="0"
        value={valorFormateado}
        onChange={handleChange}
        required={required}
        className={cn("pl-7 text-right font-medium tabular-nums", className)}
      />
      {/* Hidden input con el valor numérico real para el submit */}
      <input type="hidden" name={`${name}_raw`} value={valorRaw} />
    </div>
  )
}
