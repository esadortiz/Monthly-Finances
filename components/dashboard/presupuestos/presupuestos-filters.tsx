"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useState, useTransition, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
interface PresupuestosFiltersProps {}

const meses = [
  { value: "", label: "Todos los meses" },
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
]

const currentYear = new Date().getFullYear()

export function PresupuestosFilters({}: PresupuestosFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const mes = searchParams.get("mes") ?? ""
  const anio = searchParams.get("anio") ?? currentYear.toString()

  const mesLabelMap = new Map(meses.map((m) => [m.value, m.label]))

  const updateFilter = useCallback(
    (key: string, value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all" && value !== "") {
          params.set(key, value)
        } else {
          params.delete(key)
        }
        router.push(`/dashboard/presupuestos?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (q !== (searchParams.get("q") ?? "")) {
        updateFilter("q", q)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [q])

  const clearFilters = () => {
    setQ("")
    startTransition(() => {
      router.push("/dashboard/presupuestos")
    })
  }

  const hasFilters =
    q !== "" || mes !== "" || anio !== currentYear.toString()

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar presupuesto..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={mes}
          onValueChange={(v) => updateFilter("mes", v ?? "")}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Mes">
              {(value: string) => (
                <span>{mesLabelMap.get(value) ?? "Todos los meses"}</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {meses.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Año"
          value={anio}
          onChange={(e) => updateFilter("anio", e.target.value)}
          className="w-full sm:w-[100px]"
          min={2024}
          max={2035}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          disabled={isPending}
        >
          <X className="size-4" />
          Limpiar filtros
        </Button>
      )}
    </div>
  )
}
