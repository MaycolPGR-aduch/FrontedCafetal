import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Package, CheckCircle, XCircle, Clock } from 'lucide-react'
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import { mockLots, mockProducts, mockWarehouses } from '../../lib/mock-data'
import { Lot, QualityStatus } from '../../lib/types'
import { formatDate, translateStatus } from '../../lib/utils'
import { toast } from 'sonner@2.0.3'

export function GestionLotes() {
  const [lots, setLots] = React.useState<Lot[]>(mockLots)

  const handleQualityStatusChange = (lot: Lot, newStatus: QualityStatus) => {
    setLots(lots.map(l => 
      l.id === lot.id 
        ? { ...l, qualityStatus: newStatus }
        : l
    ))
    toast.success(`Lote ${lot.lotCode} ${translateStatus(newStatus).toLowerCase()}`)
  }

  const getProduct = (productId: string) => {
    return mockProducts.find(p => p.id === productId)
  }

  const getWarehouse = (warehouseId: string) => {
    return mockWarehouses.find(w => w.id === warehouseId)
  }

  const getExpiryStatus = (expiryDate: string) => {
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysToExpiry < 0) return { status: 'expired', color: 'bg-red-500', text: 'Vencido' }
    if (daysToExpiry <= 30) return { status: 'warning', color: 'bg-yellow-500', text: 'Por vencer' }
    return { status: 'ok', color: 'bg-green-500', text: 'Vigente' }
  }

  const columns: ColumnDef<Lot>[] = [
    {
      accessorKey: 'lotCode',
      header: 'Código de Lote',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.lotCode}</div>
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
      accessorKey: 'qty',
      header: 'Cantidad Disponible',
      cell: ({ row }) => {
        const product = getProduct(row.original.productId)
        return `${row.original.qty} ${row.original.uom}`
      }
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
      accessorKey: 'qualityStatus',
      header: 'Estado de Calidad',
      cell: ({ row }) => <StatusBadge status={row.original.qualityStatus} />
    },
    {
      accessorKey: 'productionDate',
      header: 'Fecha Producción',
      cell: ({ row }) => formatDate(row.original.productionDate)
    },
    {
      accessorKey: 'expiryDate',
      header: 'Vencimiento',
      cell: ({ row }) => {
        const expiry = getExpiryStatus(row.original.expiryDate)
        return (
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${expiry.color}`} />
            <div>
              <div>{formatDate(row.original.expiryDate)}</div>
              <div className="text-sm text-muted-foreground">{expiry.text}</div>
            </div>
          </div>
        )
      }
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const lot = row.original
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
              <DropdownMenuSeparator />
              {lot.qualityStatus === QualityStatus.PENDING && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Aprobar Calidad
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Aprobar lote {lot.lotCode}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción marcará el lote como aprobado para su uso en producción y ventas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleQualityStatusChange(lot, QualityStatus.APPROVED)}
                        >
                          Aprobar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Rechazar Calidad
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Rechazar lote {lot.lotCode}?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción marcará el lote como rechazado. No podrá ser usado para producción o ventas.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleQualityStatusChange(lot, QualityStatus.REJECTED)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Rechazar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
              <DropdownMenuItem>
                Ver Historial de Calidad
              </DropdownMenuItem>
              <DropdownMenuItem>
                Ver Movimientos
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Calculate stats
  const totalLots = lots.length
  const approvedLots = lots.filter(l => l.qualityStatus === QualityStatus.APPROVED).length
  const pendingLots = lots.filter(l => l.qualityStatus === QualityStatus.PENDING).length
  const rejectedLots = lots.filter(l => l.qualityStatus === QualityStatus.REJECTED).length
  const totalStock = lots.reduce((sum, lot) => sum + lot.qty, 0)
  const expiringLots = lots.filter(l => {
    const expiry = getExpiryStatus(l.expiryDate)
    return expiry.status === 'warning' || expiry.status === 'expired'
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Gestión de Lotes</h1>
        <p className="text-muted-foreground">
          Administra los lotes de producción y su estado de calidad
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lotes</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalLots}</div>
            <p className="text-xs text-muted-foreground">
              {totalStock.toLocaleString()} KG total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Aprobados</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedLots}</div>
            <Progress 
              value={(approvedLots / totalLots) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingLots}</div>
            <p className="text-xs text-muted-foreground">
              Esperando aprobación
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Vencer</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expiringLots}</div>
            <p className="text-xs text-muted-foreground">
              Próximos a vencer
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lotes de Producción</CardTitle>
          <CardDescription>
            Lista de todos los lotes con su estado de calidad y fecha de vencimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={lots}
            searchKey="lotCode"
            searchPlaceholder="Buscar por código de lote..."
            enableSelection={true}
          />
        </CardContent>
      </Card>
    </div>
  )
}