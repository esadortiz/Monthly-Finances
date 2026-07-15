"use client"

import { useState, useRef } from "react"
import { Upload, FileText, AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { importarTransacciones } from "@/app/actions/importar"

type MapeoColumnas = {
  fecha: string
  descripcion: string
  valor: string
}

function parseCSV(texto: string): string[][] {
  const lines = texto.split(/\r?\n/).filter((l) => l.trim())
  return lines.map((line) => {
    const result: string[] = []
    let current = ""
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
    result.push(current.trim())
    return result
  })
}

function detectarColumna(header: string): keyof MapeoColumnas | null {
  const h = header.toLowerCase().trim()
  if (["fecha", "date", "fec"].includes(h)) return "fecha"
  if (["descripcion", "descripción", "description", "desc", "detalle", "concepto", "concept", "glosa"].includes(h)) return "descripcion"
  if (["valor", "value", "amount", "monto", "total", "val", "importe"].includes(h)) return "valor"
  return null
}

interface ImportFormProps {
  cuentas: { id: string; nombre: string }[]
  categoriasIngreso: { id: string; nombre: string }[]
  categoriasGasto: { id: string; nombre: string }[]
}

export function ImportForm({ cuentas, categoriasIngreso, categoriasGasto }: ImportFormProps) {
  const [tipo, setTipo] = useState<"ingreso" | "gasto">("ingreso")
  const [headers, setHeaders] = useState<string[]>([])
  const [filas, setFilas] = useState<string[][]>([])
  const [mapeo, setMapeo] = useState<MapeoColumnas>({ fecha: "", descripcion: "", valor: "" })
  const [cuentaId, setCuentaId] = useState("")
  const [categoriaId, setCategoriaId] = useState("")
  const [importando, setImportando] = useState(false)
  const [resultado, setResultado] = useState<{ insertados: number; errores: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categorias = tipo === "ingreso" ? categoriasIngreso : categoriasGasto

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setResultado(null)

    const validMimeTypes = ["text/csv", "text/plain", "application/vnd.ms-excel"]
    const maxSize = 5 * 1024 * 1024

    if (!validMimeTypes.includes(file.type) && !file.name.endsWith(".csv")) {
      toast.error("Solo se permiten archivos CSV")
      e.target.value = ""
      return
    }

    if (file.size > maxSize) {
      toast.error("El archivo excede el tamaño máximo de 5 MB")
      e.target.value = ""
      return
    }

    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      const parsed = parseCSV(text)
      if (parsed.length < 2) {
        toast.error("El archivo debe tener al menos un encabezado y una fila de datos")
        return
      }

      const h = parsed[0]
      const rows = parsed.slice(1)
      setHeaders(h)
      setFilas(rows)

      const auto: MapeoColumnas = { fecha: "", descripcion: "", valor: "" }
      for (const col of h) {
        const detected = detectarColumna(col)
        if (detected && !auto[detected]) {
          auto[detected] = col
        }
      }
      setMapeo(auto)
      toast.success(`Archivo cargado: ${rows.length} registros`)
    }
    reader.readAsText(file)
  }

  const validateMapeo = () => {
    if (!mapeo.fecha) return "Selecciona la columna Fecha"
    if (!mapeo.valor) return "Selecciona la columna Valor"
    return null
  }

  const previewRows = filas.slice(0, 5).map((row) => {
    const get = (col: string) => {
      const idx = headers.indexOf(col)
      return idx >= 0 ? row[idx] : ""
    }
    const valor = parseFloat(get(mapeo.valor).replace(/[$,.\s]/g, "").replace(",", "."))
    return {
      fecha: get(mapeo.fecha),
      descripcion: get(mapeo.descripcion),
      valor: isNaN(valor) ? 0 : valor,
    }
  })

  const handleImport = async () => {
    const err = validateMapeo()
    if (err) {
      toast.error(err)
      return
    }

    setImportando(true)
    try {
      const mapped = filas.map((row) => {
        const get = (col: string) => {
          const idx = headers.indexOf(col)
          return idx >= 0 ? row[idx] : ""
        }
        const rawValor = get(mapeo.valor).replace(/[$,.\s]/g, "").replace(",", ".")
        return {
          fecha: get(mapeo.fecha),
          descripcion: get(mapeo.descripcion),
          valor: parseFloat(rawValor) || 0,
        }
      }).filter((r) => r.fecha && r.valor)

      const res = await importarTransacciones(tipo, mapped, cuentaId || undefined, categoriaId || undefined)
      setResultado({ insertados: res.insertados, errores: res.errores })
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.info(res.message)
      }
    } catch {
      toast.error("Error al importar")
    } finally {
      setImportando(false)
    }
  }

  const reset = () => {
    setHeaders([])
    setFilas([])
    setMapeo({ fecha: "", descripcion: "", valor: "" })
    setResultado(null)
    setCuentaId("")
    setCategoriaId("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="space-y-6">
      {headers.length === 0 ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="size-5" />
                Subir Archivo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                <Label className="shrink-0">Tipo de transacción</Label>
                <Select value={tipo} onValueChange={(v) => setTipo((v ?? "ingreso") as "ingreso" | "gasto")}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ingreso">Ingresos</SelectItem>
                    <SelectItem value="gasto">Gastos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-12">
                <FileText className="size-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Selecciona un archivo CSV con tus transacciones
                </p>
                <p className="text-xs text-muted-foreground">
                  Columnas esperadas: Fecha, Descripción, Valor
                </p>
                <Button onClick={() => inputRef.current?.click()} variant="secondary">
                  <Upload className="size-4" />
                  Seleccionar archivo
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFile}
                  className="hidden"
                />
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Vista previa</h3>
              <p className="text-sm text-muted-foreground">
                {filas.length} registros encontrados
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={reset}>
                <ArrowLeft className="size-4" />
                Volver
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Mapeo de Columnas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <Label>Fecha *</Label>
                  <Select
                    value={mapeo.fecha}
                    onValueChange={(v) => setMapeo((m) => ({ ...m, fecha: v ?? "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Valor *</Label>
                  <Select
                    value={mapeo.valor}
                    onValueChange={(v) => setMapeo((m) => ({ ...m, valor: v ?? "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar columna" />
                    </SelectTrigger>
                    <SelectContent>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Label>Descripción</Label>
                  <Select
                    value={mapeo.descripcion}
                    onValueChange={(v) => setMapeo((m) => ({ ...m, descripcion: v ?? "" }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar columna" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">(ninguna)</SelectItem>
                      {headers.map((h) => (
                        <SelectItem key={h} value={h}>{h}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-base">
                <span>Asignación Adicional</span>
                <Badge variant="secondary">{tipo === "ingreso" ? "Ingreso" : "Gasto"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Cuenta (opcional)</Label>
                  <Select value={cuentaId} onValueChange={(v) => setCuentaId(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin cuenta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin cuenta</SelectItem>
                      {cuentas.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Categoría (opcional)</Label>
                  <Select value={categoriaId} onValueChange={(v) => setCategoriaId(v ?? "")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sin categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Sin categoría</SelectItem>
                      {categorias.map((c) => (
                        <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vista Previa ({Math.min(5, previewRows.length)} de {filas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Descripción</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {previewRows.map((r, i) => (
                    <TableRow key={i}>
                      <TableCell>{r.fecha}</TableCell>
                      <TableCell>{r.descripcion || "-"}</TableCell>
                      <TableCell className="text-right font-mono">
                        ${r.valor.toLocaleString("es-CO")}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {resultado && (
            <Card>
              <CardContent className="flex items-center gap-3 pt-6">
                {resultado.errores === 0 ? (
                  <CheckCircle2 className="size-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="size-5 text-yellow-500" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {resultado.insertados} registros importados
                  </p>
                  {resultado.errores > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {resultado.errores} registros con errores
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={reset}>
              Cancelar
            </Button>
            <Button onClick={handleImport} disabled={importando || previewRows.length === 0}>
              {importando ? "Importando..." : `Importar ${filas.length} registros`}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
