import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal, Plus, User, Calendar, Phone, Mail } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { DataTable } from '../../components/data-table'
import { StatusBadge } from '../../components/status-badge'
import { Avatar, AvatarFallback } from '../../components/ui/avatar'
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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useForm } from 'react-hook-form@7.55.0'
import { mockEmployees, mockPositions } from '../../lib/mock-data'
import { Employee, EmployeeStatus } from '../../lib/types'
import { formatCurrency, formatDate } from '../../lib/utils'
import { toast } from 'sonner@2.0.3'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe']

interface FormData {
  documentId: string
  firstName: string
  lastName: string
  positionId: string
  hireDate: string
  baseSalary: number
  email: string
  phone: string
}

export function GestionEmpleados() {
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)
  const [employees, setEmployees] = React.useState<Employee[]>(mockEmployees)
  const [departmentFilter, setDepartmentFilter] = React.useState('all')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const form = useForm<FormData>({
    defaultValues: {
      documentId: '',
      firstName: '',
      lastName: '',
      positionId: '',
      hireDate: '',
      baseSalary: 0,
      email: '',
      phone: ''
    }
  })

  const handleCreateEmployee = (data: FormData) => {
    const newEmployee: Employee = {
      id: Date.now().toString(),
      documentId: data.documentId,
      firstName: data.firstName,
      lastName: data.lastName,
      positionId: data.positionId,
      hireDate: data.hireDate,
      status: EmployeeStatus.ACTIVE,
      baseSalary: data.baseSalary,
      email: data.email,
      phone: data.phone
    }

    setEmployees([...employees, newEmployee])
    setIsCreateOpen(false)
    form.reset()
    toast.success('Empleado registrado exitosamente')
  }

  const toggleEmployeeStatus = (employee: Employee) => {
    const newStatus = employee.status === EmployeeStatus.ACTIVE 
      ? EmployeeStatus.INACTIVE 
      : EmployeeStatus.ACTIVE

    setEmployees(employees.map(emp => 
      emp.id === employee.id 
        ? { ...emp, status: newStatus }
        : emp
    ))

    toast.success(`Empleado ${newStatus === EmployeeStatus.ACTIVE ? 'activado' : 'desactivado'}`)
  }

  const getPosition = (positionId: string) => {
    return mockPositions.find(p => p.id === positionId)
  }

  const getEmployeeInitials = (employee: Employee) => {
    return `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`
  }

  const getYearsOfService = (hireDate: string) => {
    const hire = new Date(hireDate)
    const today = new Date()
    return Math.floor((today.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365))
  }

  // Filter employees
  const filteredEmployees = employees.filter(employee => {
    const position = getPosition(employee.positionId)
    return (
      (departmentFilter === 'all' || position?.department === departmentFilter) &&
      (statusFilter === 'all' || employee.status === statusFilter)
    )
  })

  const columns: ColumnDef<Employee>[] = [
    {
      accessorKey: 'employee',
      header: 'Empleado',
      cell: ({ row }) => {
        const employee = row.original
        return (
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarFallback>
                {getEmployeeInitials(employee)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {employee.firstName} {employee.lastName}
              </div>
              <div className="text-sm text-muted-foreground">
                DNI: {employee.documentId}
              </div>
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'positionId',
      header: 'Puesto',
      cell: ({ row }) => {
        const position = getPosition(row.original.positionId)
        return (
          <div>
            <div className="font-medium">{position?.name}</div>
            <div className="text-sm text-muted-foreground">{position?.department}</div>
          </div>
        )
      }
    },
    {
      accessorKey: 'hireDate',
      header: 'Fecha Ingreso',
      cell: ({ row }) => {
        const hireDate = row.original.hireDate
        const years = getYearsOfService(hireDate)
        return (
          <div>
            <div>{formatDate(hireDate)}</div>
            <div className="text-sm text-muted-foreground">
              {years} {years === 1 ? 'año' : 'años'}
            </div>
          </div>
        )
      }
    },
    {
      accessorKey: 'baseSalary',
      header: 'Salario Base',
      cell: ({ row }) => (
        <div className="font-medium">
          {formatCurrency(row.original.baseSalary)}
        </div>
      )
    },
    {
      accessorKey: 'email',
      header: 'Contacto',
      cell: ({ row }) => (
        <div className="space-y-1">
          <div className="flex items-center text-sm">
            <Mail className="mr-1 h-3 w-3" />
            {row.original.email}
          </div>
          <div className="flex items-center text-sm">
            <Phone className="mr-1 h-3 w-3" />
            {row.original.phone}
          </div>
        </div>
      )
    },
    {
      accessorKey: 'status',
      header: 'Estado',
      cell: ({ row }) => <StatusBadge status={row.original.status} />
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const employee = row.original
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
                <User className="mr-2 h-4 w-4" />
                Ver Perfil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="mr-2 h-4 w-4" />
                Historial de Nómina
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toggleEmployeeStatus(employee)}>
                {employee.status === EmployeeStatus.ACTIVE ? 'Desactivar' : 'Activar'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // Calculate statistics
  const totalEmployees = filteredEmployees.length
  const activeEmployees = filteredEmployees.filter(e => e.status === EmployeeStatus.ACTIVE).length
  const totalPayroll = filteredEmployees
    .filter(e => e.status === EmployeeStatus.ACTIVE)
    .reduce((sum, e) => sum + e.baseSalary, 0)
  const avgSalary = activeEmployees > 0 ? totalPayroll / activeEmployees : 0

  // Chart data
  const employeesByDepartment = Array.from(new Set(mockPositions.map(p => p.department))).map(dept => ({
    name: dept,
    count: filteredEmployees.filter(emp => {
      const position = getPosition(emp.positionId)
      return position?.department === dept
    }).length
  }))

  const salaryRanges = [
    { range: '< S/ 2,000', count: filteredEmployees.filter(e => e.baseSalary < 2000).length },
    { range: 'S/ 2,000 - S/ 4,000', count: filteredEmployees.filter(e => e.baseSalary >= 2000 && e.baseSalary < 4000).length },
    { range: 'S/ 4,000 - S/ 6,000', count: filteredEmployees.filter(e => e.baseSalary >= 4000 && e.baseSalary < 6000).length },
    { range: '> S/ 6,000', count: filteredEmployees.filter(e => e.baseSalary >= 6000).length }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Empleados</h1>
          <p className="text-muted-foreground">
            Administra el personal y su información laboral
          </p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Empleado
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleCreateEmployee)}>
                <DialogHeader>
                  <DialogTitle>Nuevo Empleado</DialogTitle>
                  <DialogDescription>
                    Registra un nuevo empleado en el sistema.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombres</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Apellidos</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="documentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Documento de Identidad</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="DNI o CE" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="positionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puesto</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un puesto" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockPositions.map((position) => (
                              <SelectItem key={position.id} value={position.id}>
                                {position.name} - {position.department}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="hireDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Ingreso</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="baseSalary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salario Base</FormLabel>
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
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <DialogFooter>
                  <Button type="submit">Registrar Empleado</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Departamento:</label>
          <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {Array.from(new Set(mockPositions.map(p => p.department))).map(dept => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Estado:</label>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value={EmployeeStatus.ACTIVE}>Activos</SelectItem>
              <SelectItem value={EmployeeStatus.INACTIVE}>Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Empleados</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {activeEmployees} activos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nómina Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(totalPayroll)}
            </div>
            <p className="text-xs text-muted-foreground">
              Salarios base mensuales
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salario Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(avgSalary)}
            </div>
            <p className="text-xs text-muted-foreground">
              Por empleado activo
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employeesByDepartment.filter(d => d.count > 0).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Con personal activo
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="employees" className="space-y-4">
        <TabsList>
          <TabsTrigger value="employees">Empleados</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>
        
        <TabsContent value="employees" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal de la Empresa</CardTitle>
              <CardDescription>
                Información completa de todos los empleados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={filteredEmployees}
                searchKey="firstName"
                searchPlaceholder="Buscar empleados..."
                enableSelection={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Empleados por Departamento</CardTitle>
                <CardDescription>Distribución del personal</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={employeesByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución Salarial</CardTitle>
                <CardDescription>Rangos de salarios base</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={salaryRanges}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {salaryRanges.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}