import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, Eye, CreditCard, Download, AlertCircle, DollarSign } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { StatusBadge } from '../../components/status-badge'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../components/ui/form'
import { Input } from '../../components/ui/input'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useForm } from 'react-hook-form@7.55.0'
import { mockInvoices, mockCustomers, mockSuppliers, mockPayments } from '../../lib/mock-data'
import { Invoice, InvoiceStatus, InvoiceType, PaymentMethod } from '../../lib/types'
import { formatCurrency, formatDate, getDaysOverdue } from '../../lib/utils'
import { toast } from 'sonner@2.0.3'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300']

interface PaymentFormData {
  amount: number
  method: PaymentMethod
  reference: string
  notes: string
}

export function GestionFacturas() {
  const [isPaymentOpen, setIsPaymentOpen] = React.useState(false)
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [invoices, setInvoices] = React.useState<Invoice[]>(mockInvoices)
  const [statusFilter, setStatusFilter] = React.useState('all')
  const [typeFilter, setTypeFilter] = React.useState('all')

  const form = useForm<PaymentFormData>({
    defaultValues: {
      amount: 0,
      method: PaymentMethod.TRANSFER,
      reference: '',
      notes: ''
    }
  })

  const handlePayment = (data: PaymentFormData) => {
    if (!selectedInvoice) return

    const newPaidAmount = selectedInvoice.paidAmount + data.amount
    const newStatus = newPaidAmount >= selectedInvoice.total 
      ? InvoiceStatus.PAID 
      : InvoiceStatus.PARTIAL

    setInvoices(invoices.map(inv => 
      inv.id === selectedInvoice.id 
        ? { ...inv, paidAmount: newPaidAmount, status: newStatus }
        : inv
    ))

    setIsPaymentOpen(false)
    setSelectedInvoice(null)
    form.reset()
    toast.success(`Pago registrado: ${formatCurrency(data.amount)}`)
  }

  const getParty = (invoice: Invoice) => {
    if (invoice.type === InvoiceType.SALES) {
      return mockCustomers.find(c => c.id === invoice.partyId)
    } else {
      return mockSuppliers.find(s => s.id === invoice.partyId)
    }
  }

  const getDueDays = (dueDate: string) => {
    const days = getDaysOverdue(dueDate)
    if (days === 0) return { text: 'Hoy', color: 'text-yellow-600' }
    if (days > 0) return { text: `${days} días`, color: 'text-red-600' }
    
    const daysToDue = Math.abs(days)
    return { text: `${daysToDue} días`, color: 'text-green-600' }
  }

  // Filter invoices
  const filteredInvoices = invoices.filter(invoice => {
    return (
      (statusFilter === 'all' || invoice.status === statusFilter) &&
      (typeFilter === 'all' || invoice.type === typeFilter)
    )
  })

  const columns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'code',
      header: 'Factura',
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.code}</div>
          <Badge variant={row.original.type === InvoiceType.SALES ? 'default' : 'secondary'}>
            {row.original.type === InvoiceType.SALES ? 'Venta' : 'Compra'}
          </Badge>
        </div>
      )
    },
    {
      accessorKey: 'partyId',
      header: 'Cliente/Proveedor',
      cell: ({ row }) => {
        const party = getParty(row.original)
        return (
          <div>
            <div className="font-medium">{party?.name}</div>
            <div className="text-sm text-muted-foreground">{party?.code}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'date',
      header: 'Fecha',
      cell: ({ row }) => formatDate(row.original.date)
    },
    {
      accessorKey: 'dueDate',
      header: 'Vencimiento',
      cell: ({ row }) => {
        const due = getDueDays(row.original.dueDate)
        return (
          <div>
            <div>{formatDate(row.original.dueDate)}</div>
            <div className={`text-sm ${due.color}`}>
              {due.text}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'total',
      header: 'Total',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.total, row.original.currency)}
        </div>
      )
    },
    {
      accessorKey: 'paidAmount',
      header: 'Pagado',
      cell: ({ row }) => {
        const invoice = row.original
        const percentage = (invoice.paidAmount / invoice.total) * 100
        return (
          <div className="space-y-1">
            <div className="font-medium">
              {formatCurrency(invoice.paidAmount, invoice.currency)}
            </div>
            <Progress value={percentage} className="h-2" />
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
      id: 'actions',
      cell: ({ row }) => {
        const invoice = row.original
        const balance = invoice.total - invoice.paidAmount
        
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
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                Ver Detalle
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Download className="mr-2 h-4 w-4" />
                Descargar PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {balance > 0 && (
                <DropdownMenuItem 
                  onClick={() => {
                    setSelectedInvoice(invoice)
                    form.setValue('amount', balance)
                    setIsPaymentOpen(true)
                  }}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Registrar Pago
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Calculate statistics
  const totalInvoices = filteredInvoices.length
  const totalAmount = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalPaid = filteredInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0)
  const totalPending = totalAmount - totalPaid
  const overdueInvoices = filteredInvoices.filter(inv => 
    getDaysOverdue(inv.dueDate) > 0 && inv.status !== InvoiceStatus.PAID
  ).length

  // Chart data
  const statusDistribution = [
    { name: 'Pagadas', value: filteredInvoices.filter(i => i.status === InvoiceStatus.PAID).length },
    { name: 'Abiertas', value: filteredInvoices.filter(i => i.status === InvoiceStatus.OPEN).length },
    { name: 'Parciales', value: filteredInvoices.filter(i => i.status === InvoiceStatus.PARTIAL).length },
    { name: 'Vencidas', value: filteredInvoices.filter(i => i.status === InvoiceStatus.OVERDUE).length }
  ]

  const monthlyTrends = Array.from({ length: 6 }, (_, i) => {
    const date = new Date()
    date.setMonth(date.getMonth() - i)
    const monthInvoices = invoices.filter(inv => {
      const invDate = new Date(inv.date)
      return invDate.getMonth() === date.getMonth() && invDate.getFullYear() === date.getFullYear()
    })
    
    return {
      month: date.toLocaleDateString('es-PE', { month: 'short' }),
      sales: monthInvoices.filter(i => i.type === InvoiceType.SALES).reduce((sum, i) => sum + i.total, 0),
      purchases: monthInvoices.filter(i => i.type === InvoiceType.PURCHASE).reduce((sum, i) => sum + i.total, 0)
    }
  }).reverse()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Facturas</h1>
          <p className="text-muted-foreground">
            Administra facturas de venta y compra, pagos y cobranzas
          </p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Factura
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Estado:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={InvoiceStatus.OPEN}>Abiertas</SelectItem>
              <SelectItem value={InvoiceStatus.PAID}>Pagadas</SelectItem>
              <SelectItem value={InvoiceStatus.PARTIAL}>Parciales</SelectItem>
              <SelectItem value={InvoiceStatus.OVERDUE}>Vencidas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Tipo:</label>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={InvoiceType.SALES}>Ventas</SelectItem>
              <SelectItem value={InvoiceType.PURCHASE}>Compras</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Facturas</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInvoices}</div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totalAmount)} total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cobrado</CardTitle>
            <CreditCard className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalPaid)}
            </div>
            <Progress 
              value={(totalPaid / totalAmount) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Por Cobrar</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totalPending)}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalPending / totalAmount) * 100)}% pendiente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {overdueInvoices}
            </div>
            <p className="text-xs text-muted-foreground">
              Requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-4">
        <TabsList>
          <TabsTrigger value="invoices">Facturas</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="invoices" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Listado de Facturas</CardTitle>
              <CardDescription>
                Gestiona todas las facturas de venta y compra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredInvoices}
                searchKey="code"
                searchPlaceholder="Buscar por número de factura..."
                enableSelection={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado</CardTitle>
                <CardDescription>Estado actual de las facturas</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tendencia Mensual</CardTitle>
                <CardDescription>Ventas vs Compras por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="sales" fill="#8884d8" name="Ventas" />
                    <Bar dataKey="purchases" fill="#82ca9d" name="Compras" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Payment Dialog */}
      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handlePayment)}>
              <DialogHeader>
                <DialogTitle>Registrar Pago</DialogTitle>
                <DialogDescription>
                  Factura: {selectedInvoice?.code} - 
                  Saldo: {selectedInvoice && formatCurrency(selectedInvoice.total - selectedInvoice.paidAmount)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01"
                          {...field} 
                          onChange={e => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Método de Pago</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value={PaymentMethod.CASH}>Efectivo</SelectItem>
                          <SelectItem value={PaymentMethod.TRANSFER}>Transferencia</SelectItem>
                          <SelectItem value={PaymentMethod.CARD}>Tarjeta</SelectItem>
                          <SelectItem value={PaymentMethod.CHECK}>Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Referencia</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Número de operación, cheque, etc." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notas</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Observaciones adicionales..." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button type="submit">Registrar Pago</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}