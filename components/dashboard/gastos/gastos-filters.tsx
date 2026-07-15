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
import type { Cuenta, Categoria } from "@/types/database"

interface GastosFiltersProps {
  cuentas: Cuenta[]
  categorias: Categoria[]
}

const metodosPago = [
  { value: "efectivo", label: "Efectivo" },
  { value: "tarjeta_debito", label: "Tarjeta Débito" },
  { value: "tarjeta_credito", label: "Tarjeta Crédito" },
  { value: "transferencia", label: "Transferencia" },
  { value: "otro", label: "Otro" },
]

export function GastosFilters({ cuentas, categorias }: GastosFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const categoriaId = searchParams.get("categoria") ?? "all"
  const cuentaId = searchParams.get("cuenta") ?? "all"
  const metodoId = searchParams.get("metodo") ?? "all"
  const [desde, setDesde] = useState(searchParams.get("desde") ?? "")
  const [hasta, setHasta] = useState(searchParams.get("hasta") ?? "")

  useEffect(() => {
    setQ(searchParams.get("q") ?? "")
    setDesde(searchParams.get("desde") ?? "")
    setHasta(searchParams.get("hasta") ?? "")
  }, [searchParams])

  const categoriasGasto = categorias.filter((c) => c.tipo === "gasto")

  const categoriaLabelMap = new Map([
    ["all", "Todas las categorías"],
    ...categoriasGasto.map((c) => [c.id, c.nombre] as const),
  ])
  const cuentaLabelMap = new Map([
    ["all", "Todas las cuentas"],
    ...cuentas.map((c) => [c.id, c.nombre] as const),
  ])
  const metodoLabelMap = new Map([
    ["all", "Todos los métodos"],
    ...metodosPago.map((m) => [m.value, m.label] as const),
  ])

  const updateFilter = useCallback(
    (key: string, value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value && value !== "all" && value !== "") {
          params.set(key, value)
        } else {
          params.delete(key)
        }
        router.push(`/dashboard/gastos?${params.toString()}`)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q])

  const clearFilters = () => {
    setQ("")
    setDesde("")
    setHasta("")
    startTransition(() => {
      router.push("/dashboard/gastos")
    })
  }

  const hasFilters =
    q !== "" ||
    categoriaId !== "all" ||
    cuentaId !== "all" ||
    metodoId !== "all" ||
    desde !== "" ||
    hasta !== ""

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por descripción..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select
          value={categoriaId}
          onValueChange={(v) => v && updateFilter("categoria", v)}
        >
          <SelectTrigger className="w-full sm:w-[170px]">
            <SelectValue placeholder="Categoría">
              {(value: string) => (
                <span className="flex items-center gap-1.5">
                  {(() => {
                    const cat = categoriasGasto.find((c) => c.id === value)
                    if (cat) {
                      return (
                        <span
                          className="size-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                      )
                    }
                    return null
                  })()}
                  {categoriaLabelMap.get(value) ?? "Todas las categorías"}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categoriasGasto.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={metodoId}
          onValueChange={(v) => v && updateFilter("metodo", v)}
        >
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Método de pago">
              {(value: string) => (
                <span>{metodoLabelMap.get(value) ?? "Todos los métodos"}</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los métodos</SelectItem>
            {metodosPago.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Select
          value={cuentaId}
          onValueChange={(v) => v && updateFilter("cuenta", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Cuenta">
              {(value: string) => (
                <span>{cuentaLabelMap.get(value) ?? "Todas las cuentas"}</span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las cuentas</SelectItem>
            {cuentas.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Desde:</span>
          <Input
            type="date"
            value={desde}
            onChange={(e) => {
              setDesde(e.target.value)
              updateFilter("desde", e.target.value)
            }}
            className="w-full sm:w-[150px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Hasta:</span>
          <Input
            type="date"
            value={hasta}
            onChange={(e) => {
              setHasta(e.target.value)
              updateFilter("hasta", e.target.value)
            }}
            className="w-full sm:w-[150px]"
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
    </div>
  )
}