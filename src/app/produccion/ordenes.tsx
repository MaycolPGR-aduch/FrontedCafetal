import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, Play, Square, X, Eye } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { StatusBadge } from '../../components/status-badge'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../components/ui/dialog'
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { useForm } from 'react-hook-form@7.55.0'
import { mockProductionOrders, mockProducts } from '../../lib/mock-data'
import { ProductionOrder, ProductionOrderStatus } from '../../lib/types'
import { formatDate, translateStatus } from '../../lib/utils'
import { toast } from 'sonner@2.0.3'

interface FormData {
  productId: string
  plannedQty: number
  startDate: string
  endDate: string
  notes: string
}

export function OrdenesProduccion() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [selectedOrder, setSelectedOrder] = React.useState<ProductionOrder | null>(null)
  const [orders, setOrders] = React.useState<ProductionOrder[]>(mockProductionOrders)

  const form = useForm<FormData>({
    defaultValues: {
      productId: '',
      plannedQty: 0,
      startDate: '',
      endDate: '',
      notes: ''
    }
  })

  const handleCreateOrder = (data: FormData) => {
    const newOrder: ProductionOrder = {
      id: Date.now().toString(),
      code: `OP-2024-${String(orders.length + 1).padStart(3, '0')}`,
      productId: data.productId,
      plannedQty: data.plannedQty,
      actualQty: 0,
      status: ProductionOrderStatus.PLANNED,
      startDate: data.startDate,
      endDate: data.endDate,
      notes: data.notes
    }

    setOrders([...orders, newOrder])
    setIsCreateOpen(false)
    form.reset()
    toast.success('Orden de producción creada exitosamente')
  }

  const handleStatusChange = (order: ProductionOrder, newStatus: ProductionOrderStatus) => {
    setOrders(orders.map(o => 
      o.id === order.id 
        ? { ...o, status: newStatus }
        : o
    ))
    toast.success(`Orden ${order.code} ${translateStatus(newStatus).toLowerCase()}`)
  }

  const getProduct = (productId: string) => {
    return mockProducts.find(p => p.id === productId)
  }

  const columns: ColumnDef<ProductionOrder>[] = [
    {
      accessorKey: 'code',
      header: 'Código',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.code}</div>
      )
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
      accessorKey: 'plannedQty',
      header: 'Planificado',
      cell: ({ row }) => {
        const product = getProduct(row.original.productId)
        return `${row.original.plannedQty} ${product?.uom}`
      }
    },
    {
      accessorKey: 'actualQty',
      header: 'Producido',
      cell: ({ row }) => {
        const product = getProduct(row.original.productId)
        const percentage = row.original.plannedQty > 0 
          ? (row.original.actualQty / row.original.plannedQty * 100).toFixed(1)
          : '0'
        return (
          <div>
            <div>{row.original.actualQty} {product?.uom}</div>
            <div className="text-sm text-muted-foreground">{percentage}%</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      accessorKey: 'startDate',
      header: 'Inicio',
      cell: ({ row }) => formatDate(row.original.startDate)
    },
    {
      accessorKey: 'endDate',
      header: 'Fin',
      cell: ({ row }) => formatDate(row.original.endDate)
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const order = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menú</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => setSelectedOrder(order)}>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {order.status === ProductionOrderStatus.PLANNED && (
                <DropdownMenuItem onClick={() => handleStatusChange(order, ProductionOrderStatus.IN_PROCESS)}>
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar
                </DropdownMenuItem>
              )}
              {order.status === ProductionOrderStatus.IN_PROCESS && (
                <DropdownMenuItem onClick={() => handleStatusChange(order, ProductionOrderStatus.DONE)}>
                  <Square className="mr-2 h-4 w-4" />
                  Finalizar
                </DropdownMenuItem>
              )}
              {order.status !== ProductionOrderStatus.CANCELED && order.status !== ProductionOrderStatus.DONE && (
                <DropdownMenuItem 
                  onClick={() => handleStatusChange(order, ProductionOrderStatus.CANCELED)}
                  className="text-destructive"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Órdenes de Producción</h1>
          <p className="text-muted-foreground">
            Gestiona las órdenes de producción y su estado
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Orden
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateOrder)}>
                <DialogHeader>
                  <DialogTitle>Nueva Orden de Producción</DialogTitle>
                  <DialogDescription>
                    Crea una nueva orden de producción especificando el producto y cantidades.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Producto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un producto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProducts.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name} ({product.sku})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="plannedQty"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad Planificada</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            {...field} 
                            onChange={e => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Inicio</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Fin</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notas</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Notas adicionales sobre la orden..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Crear Orden</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Órdenes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === ProductionOrderStatus.IN_PROCESS).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders.filter(o => o.status === ProductionOrderStatus.DONE).length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.5%</div>
            <p className="text-xs text-muted-foreground">
              Promedio de cumplimiento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Órdenes de Producción</CardTitle>
          <CardDescription>
            Lista de todas las órdenes de producción con sus estados actuales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={orders}
            searchKey="code"
            searchPlaceholder="Buscar por código..."
            enableSelection={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}