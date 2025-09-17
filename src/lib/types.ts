// Enums de estado
export enum ProductionOrderStatus {
  PLANNED = 'PLANNED',
  IN_PROCESS = 'IN_PROCESS',
  DONE = 'DONE',
  CANCELED = 'CANCELED'
}

export enum QualityStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export enum ShipmentStatus {
  PLANNED = 'PLANNED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED'
}

export enum InvoiceStatus {
  OPEN = 'OPEN',
  PAID = 'PAID',
  PARTIAL = 'PARTIAL',
  OVERDUE = 'OVERDUE'
}

export enum InvoiceType {
  SALES = 'SALES',
  PURCHASE = 'PURCHASE'
}

export enum EmployeeStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export enum PayrollItemType {
  BASIC = 'BASIC',
  BONUS = 'BONUS',
  OVERTIME = 'OVERTIME',
  DEDUCTION = 'DEDUCTION',
  TAX = 'TAX'
}

export enum MovementType {
  PURCHASE = 'PURCHASE',
  SALE = 'SALE',
  PROD_IN = 'PROD_IN',
  PROD_OUT = 'PROD_OUT',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  ADJUSTMENT = 'ADJUSTMENT'
}

export enum CostType {
  MATERIAL = 'MATERIAL',
  LABOR = 'LABOR',
  OVERHEAD = 'OVERHEAD',
  LOGISTICS = 'LOGISTICS',
  OTHER = 'OTHER'
}

export enum PaymentMethod {
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
  CARD = 'CARD',
  CHECK = 'CHECK'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  GERENCIA = 'GERENCIA',
  PRODUCCION = 'PRODUCCION',
  LOGISTICA = 'LOGISTICA',
  FINANZAS = 'FINANZAS',
  RRHH = 'RRHH'
}

// Interfaces principales
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  uom: string; // unidad de medida
  unitCost: number;
  salePrice: number;
  active: boolean;
}

export interface Warehouse {
  id: string;
  code: string;
  name: string;
  location: string;
  active: boolean;
}

export interface Lot {
  id: string;
  lotCode: string;
  productId: string;
  qty: number;
  uom: string;
  qualityStatus: QualityStatus;
  productionDate: string;
  expiryDate: string;
  warehouseId: string;
}

export interface ProductionOrder {
  id: string;
  code: string;
  productId: string;
  plannedQty: number;
  actualQty: number;
  status: ProductionOrderStatus;
  startDate: string;
  endDate: string;
  notes: string;
}

export interface QualityTest {
  id: string;
  lotId: string;
  moisturePct: number;
  acidity: number;
  cuppingScore: number;
  passed: boolean;
  testDate: string;
  comments: string;
  testerId: string;
}

export interface InventoryMovement {
  id: string;
  timestamp: string;
  warehouseId: string;
  productId: string;
  lotId?: string;
  qty: number;
  type: MovementType;
  reference: string;
  notes: string;
}

export interface Shipment {
  id: string;
  code: string;
  status: ShipmentStatus;
  shipDate: string;
  carrier: string;
  trackingNumber: string;
  customerId: string;
}

export interface ShipmentItem {
  id: string;
  shipmentId: string;
  productId: string;
  lotId: string;
  qty: number;
  uom: string;
}

export interface Customer {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export interface Supplier {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export interface SalesOrder {
  id: string;
  code: string;
  customerId: string;
  date: string;
  status: string;
  total: number;
  currency: string;
}

export interface SalesOrderItem {
  id: string;
  salesOrderId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrder {
  id: string;
  code: string;
  supplierId: string;
  date: string;
  status: string;
  total: number;
  currency: string;
}

export interface PurchaseOrderItem {
  id: string;
  purchaseOrderId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  code: string;
  type: InvoiceType;
  partyId: string; // customerId o supplierId
  date: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
}

export interface InvoiceItem {
  id: string;
  invoiceId: string;
  productId: string;
  qty: number;
  unitPrice: number;
  total: number;
}

export interface Payment {
  id: string;
  invoiceId: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  reference: string;
  notes: string;
}

export interface CostCenter {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

export interface CostRecord {
  id: string;
  costCenterId: string;
  type: CostType;
  amount: number;
  date: string;
  productionOrderId?: string;
  description: string;
}

export interface Position {
  id: string;
  code: string;
  name: string;
  department: string;
  baseSalary: number;
  active: boolean;
}

export interface Employee {
  id: string;
  documentId: string;
  firstName: string;
  lastName: string;
  positionId: string;
  hireDate: string;
  status: EmployeeStatus;
  baseSalary: number;
  email: string;
  phone: string;
}

export interface PayrollPeriod {
  id: string;
  startDate: string;
  endDate: string;
  payDate: string;
  status: string;
  total: number;
}

export interface PayrollItem {
  id: string;
  payrollPeriodId: string;
  employeeId: string;
  type: PayrollItemType;
  amount: number;
  description: string;
}

// Tipos para la interfaz
export interface KPIData {
  title: string;
  value: string;
  delta?: string;
  deltaType?: 'positive' | 'negative' | 'neutral';
  icon?: string;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: any;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface Filters {
  dateRange?: DateRange;
  warehouseId?: string;
  categoryId?: string;
  status?: string;
}