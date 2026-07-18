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
import type { Categoria } from "@/types/database"

interface IngresosFiltersProps {
  categorias: Categoria[]
}

export function IngresosFilters({ categorias }: IngresosFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [q, setQ] = useState(searchParams.get("q") ?? "")
  const categoriaId = searchParams.get("categoria") ?? "all"
  const [desde, setDesde] = useState(searchParams.get("desde") ?? "")
  const [hasta, setHasta] = useState(searchParams.get("hasta") ?? "")

  // Sincronizar estado local cuando cambian los searchParams
  useEffect(() => {
    setQ(searchParams.get("q") ?? "")
    setDesde(searchParams.get("desde") ?? "")
    setHasta(searchParams.get("hasta") ?? "")
  }, [searchParams])

  const categoriasIngreso = categorias.filter((c) => c.tipo === "ingreso")

  // Mapa value -> label para mostrar nombres en el trigger
  const categoriaLabelMap = new Map([
    ["all", "Todas las categorías"],
    ...categoriasIngreso.map((c) => [c.id, c.nombre] as const),
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
        router.push(`/dashboard/ingresos?${params.toString()}`)
      })
    },
    [router, searchParams]
  )

  // Debounce para la búsqueda de texto
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
      router.push("/dashboard/ingresos")
    })
  }

  const hasFilters =
    q !== "" ||
    categoriaId !== "all" ||
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
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Categoría">
              {(value: string) => (
                <span className="flex items-center gap-1.5">
                  {(() => {
                    const cat = categoriasIngreso.find((c) => c.id === value)
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
            {categoriasIngreso.map((cat) => (
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
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Desde:</span>
          <Input
            type="date"
            value={desde}
            onChange={(e) => {
              setDesde(e.target.value)
              updateFilter("desde", e.target.value)
            }}
            className="w-full sm:w-[160px]"
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
            className="w-full sm:w-[160px]"
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
