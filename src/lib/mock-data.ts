import { 
  Product, 
  Warehouse, 
  Lot, 
  ProductionOrder, 
  QualityTest, 
  InventoryMovement,
  Customer,
  Supplier,
  Employee,
  Position,
  CostCenter,
  Invoice,
  Payment,
  ProductionOrderStatus,
  QualityStatus,
  ShipmentStatus,
  InvoiceStatus,
  InvoiceType,
  EmployeeStatus,
  MovementType,
  CostType,
  PaymentMethod
} from './types'

// Productos
export const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'CAFE-001',
    name: 'Café Arábica Premium',
    category: 'Café Verde',
    uom: 'KG',
    unitCost: 12.50,
    salePrice: 18.00,
    active: true
  },
  {
    id: '2',
    sku: 'CAFE-002',
    name: 'Café Robusta',
    category: 'Café Verde',
    uom: 'KG',
    unitCost: 8.00,
    salePrice: 12.00,
    active: true
  },
  {
    id: '3',
    sku: 'CAFE-T001',
    name: 'Café Tostado Arábica',
    category: 'Café Tostado',
    uom: 'KG',
    unitCost: 15.00,
    salePrice: 22.00,
    active: true
  },
  {
    id: '4',
    sku: 'CAFE-T002',
    name: 'Café Molido Premium',
    category: 'Café Molido',
    uom: 'KG',
    unitCost: 16.00,
    salePrice: 25.00,
    active: true
  }
]

// Almacenes
export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    code: 'ALM-001',
    name: 'Almacén Principal',
    location: 'Lima, Perú',
    active: true
  },
  {
    id: '2',
    code: 'ALM-002',
    name: 'Almacén Procesamiento',
    location: 'Junín, Perú',
    active: true
  },
  {
    id: '3',
    code: 'ALM-003',
    name: 'Almacén Distribución',
    location: 'Callao, Perú',
    active: true
  }
]

// Lotes
export const mockLots: Lot[] = [
  {
    id: '1',
    lotCode: 'LOT-2024-001',
    productId: '1',
    qty: 500,
    uom: 'KG',
    qualityStatus: QualityStatus.APPROVED,
    productionDate: '2024-01-15',
    expiryDate: '2025-01-15',
    warehouseId: '1'
  },
  {
    id: '2',
    lotCode: 'LOT-2024-002',
    productId: '1',
    qty: 300,
    uom: 'KG',
    qualityStatus: QualityStatus.PENDING,
    productionDate: '2024-02-01',
    expiryDate: '2025-02-01',
    warehouseId: '1'
  },
  {
    id: '3',
    lotCode: 'LOT-2024-003',
    productId: '2',
    qty: 800,
    uom: 'KG',
    qualityStatus: QualityStatus.APPROVED,
    productionDate: '2024-01-20',
    expiryDate: '2025-01-20',
    warehouseId: '2'
  }
]

// Órdenes de Producción
export const mockProductionOrders: ProductionOrder[] = [
  {
    id: '1',
    code: 'OP-2024-001',
    productId: '3',
    plannedQty: 1000,
    actualQty: 950,
    status: ProductionOrderStatus.DONE,
    startDate: '2024-01-10',
    endDate: '2024-01-15',
    notes: 'Producción exitosa con 95% de rendimiento'
  },
  {
    id: '2',
    code: 'OP-2024-002',
    productId: '4',
    plannedQty: 500,
    actualQty: 0,
    status: ProductionOrderStatus.IN_PROCESS,
    startDate: '2024-02-01',
    endDate: '2024-02-05',
    notes: 'En proceso de molido'
  },
  {
    id: '3',
    code: 'OP-2024-003',
    productId: '3',
    plannedQty: 800,
    actualQty: 0,
    status: ProductionOrderStatus.PLANNED,
    startDate: '2024-02-10',
    endDate: '2024-02-15',
    notes: 'Programado para tostado especial'
  }
]

// Tests de Calidad
export const mockQualityTests: QualityTest[] = [
  {
    id: '1',
    lotId: '1',
    moisturePct: 11.5,
    acidity: 4.2,
    cuppingScore: 85,
    passed: true,
    testDate: '2024-01-16',
    comments: 'Excelente calidad, perfil aromático sobresaliente',
    testerId: '1'
  },
  {
    id: '2',
    lotId: '2',
    moisturePct: 12.8,
    acidity: 4.0,
    cuppingScore: 78,
    passed: false,
    testDate: '2024-02-02',
    comments: 'Humedad ligeramente alta, requiere secado adicional',
    testerId: '1'
  },
  {
    id: '3',
    lotId: '3',
    moisturePct: 10.2,
    acidity: 3.8,
    cuppingScore: 82,
    passed: true,
    testDate: '2024-01-21',
    comments: 'Buena calidad, apto para mezclas premium',
    testerId: '2'
  }
]

// Clientes
export const mockCustomers: Customer[] = [
  {
    id: '1',
    code: 'CLI-001',
    name: 'Distribuidora Norte SAC',
    email: 'ventas@disnorte.com',
    phone: '+51 1 234-5678',
    address: 'Av. Principal 123, Lima',
    active: true
  },
  {
    id: '2',
    code: 'CLI-002',
    name: 'Café Express EIRL',
    email: 'compras@cafeexpress.pe',
    phone: '+51 1 987-6543',
    address: 'Jr. Comercio 456, Arequipa',
    active: true
  },
  {
    id: '3',
    code: 'CLI-003',
    name: 'Supermercados Andinos',
    email: 'proveedores@andinos.com',
    phone: '+51 1 555-0123',
    address: 'Av. Los Incas 789, Cusco',
    active: true
  }
]

// Proveedores
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    code: 'PROV-001',
    name: 'Cooperativa Cafetalera Valle',
    email: 'ventas@coopvalle.pe',
    phone: '+51 64 123-456',
    address: 'Plaza Mayor s/n, Chanchamayo',
    active: true
  },
  {
    id: '2',
    code: 'PROV-002',
    name: 'Agroindustrial Montaña',
    email: 'comercial@agromontana.com',
    phone: '+51 83 987-654',
    address: 'Carretera Central Km 15, Satipo',
    active: true
  }
]

// Posiciones
export const mockPositions: Position[] = [
  {
    id: '1',
    code: 'POS-001',
    name: 'Gerente General',
    department: 'Gerencia',
    baseSalary: 8000,
    active: true
  },
  {
    id: '2',
    code: 'POS-002',
    name: 'Jefe de Producción',
    department: 'Producción',
    baseSalary: 5000,
    active: true
  },
  {
    id: '3',
    code: 'POS-003',
    name: 'Técnico de Calidad',
    department: 'Calidad',
    baseSalary: 3000,
    active: true
  },
  {
    id: '4',
    code: 'POS-004',
    name: 'Operario de Producción',
    department: 'Producción',
    baseSalary: 1800,
    active: true
  }
]

// Empleados
export const mockEmployees: Employee[] = [
  {
    id: '1',
    documentId: '12345678',
    firstName: 'Juan Carlos',
    lastName: 'Mendoza Silva',
    positionId: '1',
    hireDate: '2020-01-15',
    status: EmployeeStatus.ACTIVE,
    baseSalary: 8000,
    email: 'jmendoza@cafetal.com',
    phone: '+51 999 123 456'
  },
  {
    id: '2',
    documentId: '87654321',
    firstName: 'María Elena',
    lastName: 'Quispe Huamán',
    positionId: '2',
    hireDate: '2021-03-10',
    status: EmployeeStatus.ACTIVE,
    baseSalary: 5000,
    email: 'mquispe@cafetal.com',
    phone: '+51 999 654 321'
  },
  {
    id: '3',
    documentId: '11223344',
    firstName: 'Roberto',
    lastName: 'García Flores',
    positionId: '3',
    hireDate: '2022-06-01',
    status: EmployeeStatus.ACTIVE,
    baseSalary: 3000,
    email: 'rgarcia@cafetal.com',
    phone: '+51 999 112 233'
  }
]

// Centros de Costo
export const mockCostCenters: CostCenter[] = [
  {
    id: '1',
    code: 'CC-PROD',
    name: 'Producción',
    active: true
  },
  {
    id: '2',
    code: 'CC-LOG',
    name: 'Logística',
    active: true
  },
  {
    id: '3',
    code: 'CC-ADM',
    name: 'Administración',
    active: true
  }
]

// Facturas
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    code: 'FV-2024-001',
    type: InvoiceType.SALES,
    partyId: '1',
    date: '2024-01-15',
    dueDate: '2024-02-14',
    currency: 'PEN',
    subtotal: 15000,
    tax: 2700,
    total: 17700,
    paidAmount: 17700,
    status: InvoiceStatus.PAID
  },
  {
    id: '2',
    code: 'FV-2024-002',
    type: InvoiceType.SALES,
    partyId: '2',
    date: '2024-01-20',
    dueDate: '2024-02-19',
    currency: 'PEN',
    subtotal: 8500,
    tax: 1530,
    total: 10030,
    paidAmount: 5000,
    status: InvoiceStatus.PARTIAL
  },
  {
    id: '3',
    code: 'FC-2024-001',
    type: InvoiceType.PURCHASE,
    partyId: '1',
    date: '2024-01-10',
    dueDate: '2024-02-09',
    currency: 'PEN',
    subtotal: 12000,
    tax: 2160,
    total: 14160,
    paidAmount: 0,
    status: InvoiceStatus.OVERDUE
  }
]

// Movimientos de Inventario
export const mockInventoryMovements: InventoryMovement[] = [
  {
    id: '1',
    timestamp: '2024-01-15T10:30:00',
    warehouseId: '1',
    productId: '1',
    lotId: '1',
    qty: 500,
    type: MovementType.PURCHASE,
    reference: 'OC-2024-001',
    notes: 'Recepción de compra a proveedor'
  },
  {
    id: '2',
    timestamp: '2024-01-16T14:20:00',
    warehouseId: '1',
    productId: '1',
    lotId: '1',
    qty: -100,
    type: MovementType.PROD_OUT,
    reference: 'OP-2024-001',
    notes: 'Consumo para producción de café tostado'
  },
  {
    id: '3',
    timestamp: '2024-01-16T16:45:00',
    warehouseId: '2',
    productId: '3',
    lotId: undefined,
    qty: 95,
    type: MovementType.PROD_IN,
    reference: 'OP-2024-001',
    notes: 'Ingreso de producción terminada'
  }
]

// Pagos
export const mockPayments: Payment[] = [
  {
    id: '1',
    invoiceId: '1',
    date: '2024-02-10',
    amount: 17700,
    method: PaymentMethod.TRANSFER,
    reference: 'TXN-2024-001',
    notes: 'Pago completo por transferencia'
  },
  {
    id: '2',
    invoiceId: '2',
    date: '2024-02-15',
    amount: 5000,
    method: PaymentMethod.CASH,
    reference: 'CASH-2024-001',
    notes: 'Pago parcial en efectivo'
  }
]

// Función para generar datos agregados para el Dashboard
export function generateDashboardData() {
  const currentMonth = new Date().getMonth()
  const currentYear = new Date().getFullYear()
  
  return {
    kpis: [
      {
        title: 'Ventas del Mes',
        value: formatCurrency(125000),
        delta: '+12.5%',
        deltaType: 'positive' as const,
        tooltip: 'Ventas comparadas con el mes anterior'
      },
      {
        title: 'Stock Total',
        value: '2,450 KG',
        delta: '-5.2%',
        deltaType: 'negative' as const,
        tooltip: 'Inventario total en almacenes'
      },
      {
        title: 'Lotes Aprobados',
        value: '85%',
        delta: '+3.1%',
        deltaType: 'positive' as const,
        tooltip: 'Porcentaje de lotes que pasan control de calidad'
      },
      {
        title: 'Entregas a Tiempo',
        value: '92%',
        delta: '+1.8%',
        deltaType: 'positive' as const,
        tooltip: 'Porcentaje de envíos entregados en fecha'
      },
      {
        title: 'Costo de Producción',
        value: formatCurrency(45000),
        delta: '-2.3%',
        deltaType: 'positive' as const,
        tooltip: 'Costos de producción del mes'
      },
      {
        title: 'Nómina del Periodo',
        value: formatCurrency(28000),
        delta: '+0.5%',
        deltaType: 'neutral' as const,
        tooltip: 'Gasto en nómina del periodo actual'
      }
    ],
    salesByMonth: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(currentYear, i).toLocaleDateString('es-PE', { month: 'short' }),
      sales: Math.floor(Math.random() * 50000) + 80000
    })),
    stockByCategory: [
      { category: 'Café Verde', stock: 1200 },
      { category: 'Café Tostado', stock: 800 },
      { category: 'Café Molido', stock: 450 }
    ],
    qualityRate: Array.from({ length: 6 }, (_, i) => ({
      month: new Date(currentYear, currentMonth - 5 + i).toLocaleDateString('es-PE', { month: 'short' }),
      rate: Math.floor(Math.random() * 20) + 75
    })),
    topProducts: mockProducts.slice(0, 10).map(product => ({
      name: product.name,
      sales: Math.floor(Math.random() * 1000) + 500
    }))
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(amount)
}