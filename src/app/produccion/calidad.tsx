import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Plus, Beaker, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
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
import { Textarea } from '../../components/ui/textarea'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Switch } from '../../components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import { useForm } from 'react-hook-form@7.55.0'
import { mockQualityTests, mockLots, mockProducts, mockEmployees } from '../../lib/mock-data'
import { QualityTest } from '../../lib/types'
import { formatDate } from '../../lib/utils'
import { toast } from 'sonner@2.0.3'

interface FormData {
  lotId: string
  moisturePct: number
  acidity: number
  cuppingScore: number
  passed: boolean
  comments: string
  testerId: string
}

export function ControlCalidad() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [tests, setTests] = React.useState<QualityTest[]>(mockQualityTests)

  const form = useForm<FormData>({
    defaultValues: {
      lotId: '',
      moisturePct: 0,
      acidity: 0,
      cuppingScore: 0,
      passed: false,
      comments: '',
      testerId: ''
    }
  })

  const handleCreateTest = (data: FormData) => {
    const newTest: QualityTest = {
      id: Date.now().toString(),
      lotId: data.lotId,
      moisturePct: data.moisturePct,
      acidity: data.acidity,
      cuppingScore: data.cuppingScore,
      passed: data.passed,
      testDate: new Date().toISOString().split('T')[0],
      comments: data.comments,
      testerId: data.testerId
    }

    setTests([...tests, newTest])
    setIsCreateOpen(false)
    form.reset()
    toast.success('Test de calidad registrado exitosamente')
  }

  const getLot = (lotId: string) => {
    return mockLots.find(l => l.id === lotId)
  }

  const getProduct = (productId: string) => {
    return mockProducts.find(p => p.id === productId)
  }

  const getEmployee = (employeeId: string) => {
    return mockEmployees.find(e => e.id === employeeId)
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excelente', variant: 'default' as const }
    if (score >= 85) return { label: 'Muy Bueno', variant: 'secondary' as const }
    if (score >= 75) return { label: 'Bueno', variant: 'outline' as const }
    return { label: 'Regular', variant: 'destructive' as const }
  }

  const columns: ColumnDef<QualityTest>[] = [
    {
      accessorKey: 'lotId',
      header: 'Lote',
      cell: ({ row }) => {
        const lot = getLot(row.original.lotId)
        const product = lot ? getProduct(lot.productId) : null
        return (
          <div>
            <div className="font-medium">{lot?.lotCode}</div>
            <div className="text-sm text-muted-foreground">{product?.name}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'moisturePct',
      header: 'Humedad (%)',
      cell: ({ row }) => {
        const moisture = row.original.moisturePct
        const isOptimal = moisture >= 10 && moisture <= 12
        return (
          <div className={`font-medium ${isOptimal ? 'text-green-600' : 'text-yellow-600'}`}>
            {moisture}%
          </div>
        )
      }
    },
    {
      accessorKey: 'acidity',
      header: 'Acidez',
      cell: ({ row }) => (
        <div className="font-medium">{row.original.acidity}</div>
      )
    },
    {
      accessorKey: 'cuppingScore',
      header: 'Puntuación',
      cell: ({ row }) => {
        const score = row.original.cuppingScore
        const badge = getScoreBadge(score)
        return (
          <div className="space-y-1">
            <div className={`font-bold ${getScoreColor(score)}`}>{score}/100</div>
            <Badge variant={badge.variant} className="text-xs">
              {badge.label}
            </Badge>
          </div>
        )
      }
    },
    {
      accessorKey: 'passed',
      header: 'Resultado',
      cell: ({ row }) => (
        <Badge variant={row.original.passed ? 'default' : 'destructive'}>
          {row.original.passed ? 'Aprobado' : 'Rechazado'}
        </Badge>
      )
    },
    {
      accessorKey: 'testDate',
      header: 'Fecha Test',
      cell: ({ row }) => formatDate(row.original.testDate)
    },
    {
      accessorKey: 'testerId',
      header: 'Analista',
      cell: ({ row }) => {
        const employee = getEmployee(row.original.testerId)
        return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A'
      }
    }
  ]

  // Generate humidity trend data
  const humidityTrend = tests.slice(-10).map((test, index) => ({
    test: `Test ${index + 1}`,
    humidity: test.moisturePct,
    optimal: 11 // Línea de referencia óptima
  }))

  // Calculate quality stats
  const totalTests = tests.length
  const passedTests = tests.filter(t => t.passed).length
  const averageScore = tests.reduce((sum, t) => sum + t.cuppingScore, 0) / totalTests
  const recentTests = tests.filter(t => {
    const testDate = new Date(t.testDate)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    return testDate >= thirtyDaysAgo
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Control de Calidad</h1>
          <p className="text-muted-foreground">
            Gestiona los tests de calidad y análisis de lotes
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Test
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateTest)}>
                <DialogHeader>
                  <DialogTitle>Nuevo Test de Calidad</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo análisis de calidad para un lote.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <FormField
                    control={form.control}
                    name="lotId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lote</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un lote" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockLots.map((lot) => (
                              <SelectItem key={lot.id} value={lot.id}>
                                {lot.lotCode} - {getProduct(lot.productId)?.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="moisturePct"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Humedad (%)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
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
                      name="acidity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Acidez</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.1"
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
                      name="cuppingScore"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Puntuación Cupping</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0"
                              max="100"
                              {...field} 
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="testerId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Analista</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un analista" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockEmployees.map((employee) => (
                              <SelectItem key={employee.id} value={employee.id}>
                                {employee.firstName} {employee.lastName}
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
                    name="passed"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Lote Aprobado
                          </FormLabel>
                          <FormDescription>
                            Marca si el lote pasa el control de calidad
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Comentarios</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Observaciones del análisis..."
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Registrar Test</Button>
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
            <CardTitle className="text-sm font-medium">Tests Totales</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
            <p className="text-xs text-muted-foreground">
              {recentTests.length} en los últimos 30 días
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Aprobación</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round((passedTests / totalTests) * 100)}%</div>
            <Progress 
              value={(passedTests / totalTests) * 100} 
              className="mt-2 h-2"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>
              {averageScore.toFixed(1)}/100
            </div>
            <p className="text-xs text-muted-foreground">
              {getScoreBadge(averageScore).label}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lotes Rechazados</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests - passedTests}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round(((totalTests - passedTests) / totalTests) * 100)}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tests">Tests de Calidad</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
        </TabsList>
        
        <TabsContent value="tests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Tests</CardTitle>
              <CardDescription>
                Registro completo de todos los análisis de calidad realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={tests}
                searchKey="lotId"
                searchPlaceholder="Buscar por lote..."
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Humedad</CardTitle>
              <CardDescription>
                Evolución de los niveles de humedad en los últimos tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={humidityTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="test" />
                  <YAxis domain={[8, 16]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="humidity" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Humedad Actual"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="optimal" 
                    stroke="#82ca9d" 
                    strokeDasharray="5 5"
                    name="Nivel Óptimo"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}