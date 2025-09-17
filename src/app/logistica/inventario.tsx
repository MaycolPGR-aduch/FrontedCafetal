// inventario.tsx
import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Package, Filter, Store } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { formatNumber } from '../../lib/utils'

// 👉 nuevo hook
import { useProducts, useWarehouses, useUoms, Product as ApiProduct } from '../../hooks/useCafetalApi'

export function GestionInventario() {
  // Filtros UI (cliente) -> enviados al backend
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  const [search, setSearch] = React.useState('')

  // Datos backend
  const { data: products, loading: prodLoading, error: prodError, refetch: refetchProducts } =
    useProducts({ search, category: categoryFilter })
  const { data: warehouses } = useWarehouses()
  const { data: uoms } = useUoms()

  // categorías derivadas de los productos reales
  const categories = React.useMemo(
    () => Array.from(new Set(products.map(p => p.category))).sort(),
    [products]
  )

  // Columnas para Productos
  const productColumns: ColumnDef<ApiProduct>[] = [
    {
      accessorKey: 'name',
      header: 'Producto',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.name}</div>
          <div className="text-sm text-muted-foreground">{row.original.sku}</div>
        </div>
      ),
    },
    { accessorKey: 'category', header: 'Categoría' },
    { accessorKey: 'uom', header: 'UOM' },
  ]

  // KPI simples basados en productos (hasta tener /inventory/lots)
  const totalProductos = products.length
  const totalCategorias = categories.length
  const totalUoms = new Set(products.map(p => p.uom)).size

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Inventario / Productos</h1>
        <p className="text-muted-foreground">Datos en vivo desde FastAPI + SQL Server</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalProductos, 0)}</div>
            <p className="text-xs text-muted-foreground">Total registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorías</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalCategorias, 0)}</div>
            <p className="text-xs text-muted-foreground">Agrupaciones únicas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unidades (UOM)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(totalUoms, 0)}</div>
            <p className="text-xs text-muted-foreground">Tipos utilizados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Almacenes</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(warehouses.length, 0)}</div>
            <p className="text-xs text-muted-foreground">Ubicaciones activas</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="products" className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Productos</TabsTrigger>
          <TabsTrigger value="warehouses">Almacenes</TabsTrigger>
          {/* <TabsTrigger value="analytics">Análisis</TabsTrigger>  // lo activamos cuando haya /inventory/lots */}
        </TabsList>

        {/* Productos */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Productos</CardTitle>
              <CardDescription>Fuente: GET /products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Filtros */}
              <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
                <Filter className="h-4 w-4" />
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Categoría:</label>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Todas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c} value={c}>{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Buscar por nombre o SKU…"
                    className="h-9 w-64 rounded-md border bg-background px-3 text-sm outline-none ring-offset-background
                               placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <Button onClick={() => refetchProducts()}>Buscar</Button>
                </div>
              </div>

              {/* Tabla */}
              {prodError && <div className="text-sm text-red-600">Error: {prodError}</div>}
              {prodLoading ? (
                <div className="text-sm text-muted-foreground">Cargando…</div>
              ) : (
                <DataTable
                  columns={productColumns}
                  data={products}
                  enableSelection={false}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Almacenes */}
        <TabsContent value="warehouses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Almacenes</CardTitle>
              <CardDescription>Fuente: GET /warehouses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {warehouses.map(w => (
                  <Card key={w.id}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{w.name}</CardTitle>
                      <CardDescription>{w.code}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Badge variant="outline">ID: {w.id}</Badge>
                    </CardContent>
                  </Card>
                ))}
                {warehouses.length === 0 && (
                  <div className="text-sm text-muted-foreground">Sin almacenes.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analítica por lotes (pendiente de endpoint) */}
        {/* <TabsContent value="analytics">...</TabsContent> */}
      </Tabs>
    </div>
  )
}
