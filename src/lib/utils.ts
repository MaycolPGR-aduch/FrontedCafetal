import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { QualityStatus, ProductionOrderStatus, ShipmentStatus, InvoiceStatus, EmployeeStatus } from "./types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Formateo de moneda en PEN
export function formatCurrency(amount: number, currency: string = 'PEN'): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

// Formateo de fechas
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options
  }).format(dateObj)
}

export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj)
}

// Formateo de números
export function formatNumber(num: number, decimals: number = 2): string {
  return new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num)
}

// Mapeo de estados a colores de badge
export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    // Production Order
    [ProductionOrderStatus.PLANNED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [ProductionOrderStatus.IN_PROCESS]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [ProductionOrderStatus.DONE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [ProductionOrderStatus.CANCELED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    
    // Quality Status
    [QualityStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [QualityStatus.APPROVED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [QualityStatus.REJECTED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    
    // Shipment Status
    [ShipmentStatus.PLANNED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [ShipmentStatus.IN_TRANSIT]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [ShipmentStatus.DELIVERED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [ShipmentStatus.CANCELED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    
    // Invoice Status
    [InvoiceStatus.OPEN]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    [InvoiceStatus.PAID]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [InvoiceStatus.PARTIAL]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    [InvoiceStatus.OVERDUE]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    
    // Employee Status
    [EmployeeStatus.ACTIVE]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    [EmployeeStatus.INACTIVE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
  }
  
  return statusColors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
}

// Traducción de estados
export function translateStatus(status: string): string {
  const translations: Record<string, string> = {
    // Production Order
    [ProductionOrderStatus.PLANNED]: 'Planificado',
    [ProductionOrderStatus.IN_PROCESS]: 'En Proceso',
    [ProductionOrderStatus.DONE]: 'Terminado',
    [ProductionOrderStatus.CANCELED]: 'Cancelado',
    
    // Quality Status
    [QualityStatus.PENDING]: 'Pendiente',
    [QualityStatus.APPROVED]: 'Aprobado',
    [QualityStatus.REJECTED]: 'Rechazado',
    
    // Shipment Status
    [ShipmentStatus.PLANNED]: 'Planificado',
    [ShipmentStatus.IN_TRANSIT]: 'En Tránsito',
    [ShipmentStatus.DELIVERED]: 'Entregado',
    [ShipmentStatus.CANCELED]: 'Cancelado',
    
    // Invoice Status
    [InvoiceStatus.OPEN]: 'Abierto',
    [InvoiceStatus.PAID]: 'Pagado',
    [InvoiceStatus.PARTIAL]: 'Parcial',
    [InvoiceStatus.OVERDUE]: 'Vencido',
    
    // Employee Status
    [EmployeeStatus.ACTIVE]: 'Activo',
    [EmployeeStatus.INACTIVE]: 'Inactivo',
  }
  
  return translations[status] || status
}

// Calculadora de días de atraso
export function getDaysOverdue(dueDate: string): number {
  const due = new Date(dueDate)
  const today = new Date()
  const diffTime = today.getTime() - due.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays > 0 ? diffDays : 0
}

// Generador de códigos únicos
export function generateCode(prefix: string): string {
  const timestamp = Date.now().toString().slice(-6)
  const random = Math.random().toString(36).substr(2, 3).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

// Función para búsqueda/filtrado de texto
export function searchInObject(obj: any, searchTerm: string): boolean {
  if (!searchTerm) return true
  
  const term = searchTerm.toLowerCase()
  
  for (const value of Object.values(obj)) {
    if (value && typeof value === 'string' && value.toLowerCase().includes(term)) {
      return true
    }
    if (value && typeof value === 'number' && value.toString().includes(term)) {
      return true
    }
  }
  
  return false
}

// Debounce para búsquedas
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}