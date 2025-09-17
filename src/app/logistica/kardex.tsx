import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Download, Filter, Calendar } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Input } from '../../components/ui/input'
import { DatePickerWithRange } from '../../components/ui/date-range-picker'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from 'recharts'
import { mockInventoryMovements, mockProducts, mockWarehouses } from '../../lib/mock-data'
import { InventoryMovement, MovementType } from '../../lib/types'
import { formatDateTime, formatNumber } from '../../lib/utils'
import { DateRange } from 'react-day-picker'

export function KardexMovimientos() {
  const [warehouseFilter, setWarehouseFilter] = React.useState('all')
  const [productFilter, setProductFilter] = React.useState('all')
  const [movementTypeFilter, setMovementTypeFilter] = React.useState('all')
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>()

  // Generate more movement data for better visualization
  const allMovements: InventoryMovement[] = React.useMemo(() => {
    const baseMovements = [...mockInventoryMovements]
    
    // Add more movements for demonstration
    const additionalMovements: InventoryMovement[] = []
    const types = Object.values(MovementType)
    
    for (let i = 0; i < 20; i++) {
      const randomProduct = mockProducts[Math.floor(Math.random() * mockProducts.length)]
      const randomWarehouse = mockWarehouses[Math.floor(Math.random() * mockWarehouses.length)]
      const randomType = types[Math.floor(Math.random() * types.length)]
      const randomDate = new Date()
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30))
      
      additionalMovements.push({
        id: `mov-${Date.now()}-${i}`,
        timestamp: randomDate.toISOString(),
        warehouseId: randomWarehouse.id,
        productId: randomProduct.id,
        lotId: undefined,
        qty: randomType.includes('OUT') || randomType === MovementType.SALE ? 
          -(Math.floor(Math.random() * 100) + 10) :
          Math.floor(Math.random() * 200) + 50,
        type: randomType,
        reference: `REF-${randomType}-${String(i + 1).padStart(3, '0')}`,
        notes: `Movimiento automático de ${randomType.toLowerCase()}`
      })
    }
    
    return [...baseMovements, ...additionalMovements].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
  }, [])

  const getProduct = (productId: string) => {
    return mockProducts.find(p => p.id === productId)
  }

  const getWarehouse = (warehouseId: string) => {
    return mockWarehouses.find(w => w.id === warehouseId)
  }

  const getMovementTypeColor = (type: MovementType) => {
    const colors: Record<MovementType, string> = {
      [MovementType.PURCHASE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      [MovementType.SALE]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      [MovementType.PROD_IN]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      [MovementType.PROD_OUT]: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      [MovementType.TRANSFER_IN]: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
      [MovementType.TRANSFER_OUT]: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
      [MovementType.ADJUSTMENT]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
    return colors[type]
  }

  const translateMovementType = (type: MovementType) => {
    const translations: Record<MovementType, string> = {
      [MovementType.PURCHASE]: 'Compra',
      [MovementType.SALE]: 'Venta',
      [MovementType.PROD_IN]: 'Ingreso Producción',
      [MovementType.PROD_OUT]: 'Salida Producción',
      [MovementType.TRANSFER_IN]: 'Transferencia Entrada',
      [MovementType.TRANSFER_OUT]: 'Transferencia Salida',
      [MovementType.ADJUSTMENT]: 'Ajuste'
    }
    return translations[type]
  }

  // Filter movements
  const filteredMovements = allMovements.filter(movement => {
    const product = getProduct(movement.productId)
    const movementDate = new Date(movement.timestamp)
    
    return (
      (warehouseFilter === 'all' || movement.warehouseId === warehouseFilter) &&
      (productFilter === 'all' || movement.productId === productFilter) &&
      (movementTypeFilter === 'all' || movement.type === movementTypeFilter) &&
      (!dateRange?.from || movementDate >= dateRange.from) &&
      (!dateRange?.to || movementDate <= dateRange.to)
    )
  })

  const columns: ColumnDef<InventoryMovement>[] = [
    {
      accessorKey: 'timestamp',
      header: 'Fecha/Hora',
      cell: ({ row }) => (
        <div className="text-sm">
          {formatDateTime(row.original.timestamp)}
        </div>
      )
    },
    {
      accessorKey: 'warehouseId',
      header: 'Almacén',
      cell: ({ row }) => {
        const warehouse = getWarehouse(row.original.warehouseId)
        return (
          <div>
            <div className="font-medium">{warehouse?.name}</div>
            <div className="text-sm text-muted-foreground">{warehouse?.code}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'productId',
      header: 'Producto',
      cell: ({ row }) => {
        const product = getProduct(row.original.productId)
        return (
          <div>
            <div className="font-medium">{product?.name}</div>
            <div className="text-sm text-muted-foreground">{product?.sku}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'type',
      header: 'Tipo',
      cell: ({ row }) => (
        <Badge 
          variant="secondary"
          className={getMovementTypeColor(row.original.type)}
        >
          {translateMovementType(row.original.type)}
        </Badge>
      )
    },
    {
      accessorKey: 'qty',
      header: 'Cantidad',
      cell: ({ row }) => {
        const qty = row.original.qty
        const product = getProduct(row.original.productId)
        const isPositive = qty > 0
        
        return (
          <div className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? '+' : ''}{formatNumber(qty, 0)} {product?.uom}
          </div>
        )
      }
    },
    {
      accessorKey: 'reference',
      header: 'Referencia',
      cell: ({ row }) => (
        <div className="font-mono text-sm">{row.original.reference}</div>
      )
    },
    {
      accessorKey: 'notes',
      header: 'Notas',
      cell: ({ row }) => (
        <div className="max-w-xs truncate text-sm text-muted-foreground">
          {row.original.notes}
        </div>
      )
    }
  ]

  // Calculate running balance for chart
  const balanceData = React.useMemo(() => {
    if (productFilter === 'all') return []
    
    const productMovements = allMovements
      .filter(m => m.productId === productFilter)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    
    let runningBalance = 0
    return productMovements.map(movement => {
      runningBalance += movement.qty
      return {
        date: new Date(movement.timestamp).toLocaleDateString('es-PE'),
        balance: runningBalance,
        movement: movement.qty
      }
    })
  }, [productFilter, allMovements])

  // Calculate summary statistics
  const totalInflow = filteredMovements
    .filter(m => m.qty > 0)
    .reduce((sum, m) => sum + m.qty, 0)
  
  const totalOutflow = filteredMovements
    .filter(m => m.qty < 0)
    .reduce((sum, m) => sum + Math.abs(m.qty), 0)
  
  const netMovement = totalInflow - totalOutflow

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Kardex - Movimientos de Inventario</h1>
          <p className="text-muted-foreground">
            Registro detallado de todos los movimientos de stock
          </p>
        </div>
        
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Exportar Kardex
        </Button>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-5 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <label className="text-sm font-medium">Filtros:</label>
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Almacén</label>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {mockWarehouses.map(warehouse => (
                <SelectItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Producto</label>
          <Select value={productFilter} onValueChange={setProductFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {mockProducts.map(product => (
                <SelectItem key={product.id} value={product.id}>
                  {product.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Tipo</label>
          <Select value={movementTypeFilter} onValueChange={setMovementTypeFilter}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Object.values(MovementType).map(type => (
                <SelectItem key={type} value={type}>
                  {translateMovementType(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Periodo</label>
          <DatePickerWithRange
            date={dateRange}
            onDateChange={setDateRange}
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredMovements.length}</div>
            <p className="text-xs text-muted-foreground">
              En el periodo seleccionado
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatNumber(totalInflow, 0)} KG
            </div>
            <p className="text-xs text-muted-foreground">
              Entradas al inventario
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              -{formatNumber(totalOutflow, 0)} KG
            </div>
            <p className="text-xs text-muted-foreground">
              Salidas del inventario
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Movimiento Neto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netMovement >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netMovement >= 0 ? '+' : ''}{formatNumber(netMovement, 0)} KG
            </div>
            <p className="text-xs text-muted-foreground">
              Balance del periodo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Balance Chart - only show when specific product is selected */}
      {productFilter !== 'all' && balanceData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Evolución de Stock - {getProduct(productFilter)?.name}</CardTitle>
            <CardDescription>
              Balance acumulado del producto seleccionado
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={balanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} KG`, 'Stock']}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#8884d8" 
                  strokeWidth={2}
                  dot={{ fill: '#8884d8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Movements Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Movimientos</CardTitle>
          <CardDescription>
            Historial completo de movimientos de inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredMovements}
            searchKey="reference"
            searchPlaceholder="Buscar por referencia..."
          />
        </CardContent>
      </Card>
    </div>
  )
}