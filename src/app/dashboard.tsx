import * as React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { KPICard } from '../components/kpi-card'
import { StatusBadge } from '../components/status-badge'
import { DataTable } from '../components/data-table'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  Package, 
  ShieldCheck, 
  Truck, 
  Calculator, 
  Users,
  AlertTriangle,
  Clock,
  FileText
} from 'lucide-react'
import { generateDashboardData } from '../lib/mock-data'
import { formatCurrency, formatDate } from '../lib/utils'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe']

// Datos mock para alertas operativas
const operationalAlerts = [
  {
    id: '1',
    type: 'stock_bajo',
    title: 'Stock bajo en Café Arábica Premium',
    description: 'Quedan solo 50 KG en almacén principal',
    severity: 'warning',
    date: '2024-02-01',
    action: 'Generar OC'
  },
  {
    id: '2',
    type: 'orden_vencida',
    title: 'Orden OP-2024-002 con retraso',
    description: 'Fecha límite: 05/02/2024',
    severity: 'error',
    date: '2024-02-06',
    action: 'Revisar'
  },
  {
    id: '3',
    type: 'factura_vencida',
    title: 'Factura FC-2024-001 vencida',
    description: 'Vencimiento: 09/02/2024 - Monto: S/ 14,160',
    severity: 'error',
    date: '2024-02-10',
    action: 'Gestionar'
  },
  {
    id: '4',
    type: 'calidad_pendiente',
    title: 'Lote LOT-2024-002 pendiente de aprobación',
    description: 'Test de calidad realizado hace 3 días',
    severity: 'warning',
    date: '2024-02-02',
    action: 'Aprobar'
  }
]

const alertColumns = [
  {
    accessorKey: 'title',
    header: 'Alerta',
    cell: ({ row }: any) => (
      <div className="space-y-1">
        <div className="font-medium">{row.original.title}</div>
        <div className="text-sm text-muted-foreground">{row.original.description}</div>
      </div>
    )
  },
  {
    accessorKey: 'severity',
    header: 'Severidad',
    cell: ({ row }: any) => {
      const severity = row.original.severity
      return (
        <Badge 
          variant={severity === 'error' ? 'destructive' : 'secondary'}
          className={severity === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : ''}
        >
          {severity === 'error' ? 'Crítico' : 'Advertencia'}
        </Badge>
      )
    }
  },
  {
    accessorKey: 'date',
    header: 'Fecha',
    cell: ({ row }: any) => formatDate(row.original.date)
  },
  {
    accessorKey: 'action',
    header: 'Acción',
    cell: ({ row }: any) => (
      <Button variant="outline" size="sm">
        {row.original.action}
      </Button>
    )
  }
]

export function Dashboard() {
  const [timeFilter, setTimeFilter] = React.useState('month')
  const [warehouseFilter, setWarehouseFilter] = React.useState('all')
  const [categoryFilter, setCategoryFilter] = React.useState('all')
  
  const dashboardData = React.useMemo(() => generateDashboardData(), [])

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Periodo:</label>
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Semana</SelectItem>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Almacén:</label>
          <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="1">Almacén Principal</SelectItem>
              <SelectItem value="2">Procesamiento</SelectItem>
              <SelectItem value="3">Distribución</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Categoría:</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              <SelectItem value="verde">Café Verde</SelectItem>
              <SelectItem value="tostado">Café Tostado</SelectItem>
              <SelectItem value="molido">Café Molido</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardData.kpis.map((kpi, index) => {
          const icons = [TrendingUp, Package, ShieldCheck, Truck, Calculator, Users]
          return (
            <KPICard
              key={index}
              title={kpi.title}
              value={kpi.value}
              delta={kpi.delta}
              deltaType={kpi.deltaType}
              icon={icons[index]}
              tooltip={kpi.tooltip}
            />
          )
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Ventas por Mes */}
        <Card>
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>Evolución de ventas en los últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData.salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => formatCurrency(value)} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Ventas']} />
                <Area 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#8884d8" 
                  fill="#8884d8" 
                  fillOpacity={0.6} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stock por Categoría */}
        <Card>
          <CardHeader>
            <CardTitle>Stock por Categoría</CardTitle>
            <CardDescription>Distribución actual del inventario</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.stockByCategory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} KG`, 'Stock']} />
                <Bar dataKey="stock" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tasa de Aprobación de Calidad */}
        <Card>
          <CardHeader>
            <CardTitle>Tasa de Aprobación de Calidad</CardTitle>
            <CardDescription>Porcentaje de lotes aprobados por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData.qualityRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Aprobación']} />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#ffc658" 
                  strokeWidth={3}
                  dot={{ fill: '#ffc658' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top 10 Productos Vendidos */}
        <Card>
          <CardHeader>
            <CardTitle>Top 10 Productos Vendidos</CardTitle>
            <CardDescription>Productos con mayor volumen de ventas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.topProducts} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={120} />
                <Tooltip formatter={(value) => [`${value} KG`, 'Vendido']} />
                <Bar dataKey="sales" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alertas Operativas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas Operativas
            </CardTitle>
            <CardDescription>
              Situaciones que requieren atención inmediata
            </CardDescription>
          </div>
          <Badge variant="destructive" className="ml-auto">
            {operationalAlerts.filter(alert => alert.severity === 'error').length} Críticas
          </Badge>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={alertColumns}
            data={operationalAlerts}
            searchKey="title"
            searchPlaceholder="Buscar alertas..."
          />
        </CardContent>
      </Card>
    </div>
  )
}