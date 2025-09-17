import * as React from 'react'
import {
  BarChart3,
  Factory,
  Truck,
  DollarSign,
  Users,
  Settings,
  Coffee,
  Package,
  FileText,
  Calendar,
  ShieldCheck,
  Warehouse,
  TrendingUp,
  Receipt,
  CreditCard,
  User,
  Calculator,
  BookOpen
} from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from './ui/sidebar'

// Menu items data
const menuItems = [
  {
    title: 'Gerencial',
    items: [
      {
        title: 'Dashboard',
        url: '/app/dashboard',
        icon: BarChart3,
      },
    ],
  },
  {
    title: 'Producción',
    items: [
      {
        title: 'Órdenes de Producción',
        url: '/app/produccion/ordenes',
        icon: Factory,
      },
      {
        title: 'Lotes',
        url: '/app/produccion/lotes',
        icon: Package,
      },
      {
        title: 'Calidad',
        url: '/app/produccion/calidad',
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: 'Logística',
    items: [
      {
        title: 'Inventario',
        url: '/app/logistica/inventario',
        icon: Warehouse,
      },
      {
        title: 'Kardex',
        url: '/app/logistica/kardex',
        icon: BookOpen,
      },
      {
        title: 'Envíos',
        url: '/app/logistica/envios',
        icon: Truck,
      },
    ],
  },
  {
    title: 'Finanzas',
    items: [
      {
        title: 'Ventas',
        url: '/app/finanzas/ventas',
        icon: TrendingUp,
      },
      {
        title: 'Compras',
        url: '/app/finanzas/compras',
        icon: Receipt,
      },
      {
        title: 'Facturas',
        url: '/app/finanzas/facturas',
        icon: FileText,
      },
      {
        title: 'Pagos',
        url: '/app/finanzas/pagos',
        icon: CreditCard,
      },
      {
        title: 'Costos',
        url: '/app/finanzas/costos',
        icon: Calculator,
      },
    ],
  },
  {
    title: 'Recursos Humanos',
    items: [
      {
        title: 'Empleados',
        url: '/app/rrhh/empleados',
        icon: Users,
      },
      {
        title: 'Nómina',
        url: '/app/rrhh/nomina',
        icon: DollarSign,
      },
    ],
  },
  {
    title: 'Configuración',
    items: [
      {
        title: 'Catálogos',
        url: '/app/config/catalogos',
        icon: Settings,
      },
    ],
  },
]

interface AppSidebarProps {
  currentPath?: string
}

export function AppSidebar({ currentPath = '/app/dashboard' }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <Coffee className="h-6 w-6 text-primary" />
            <div>
              <h2 className="font-semibold">CAFETAL SAC</h2>
              <p className="text-xs text-muted-foreground">ERP Gestión</p>
            </div>
          </div>
        </div>

        {menuItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={currentPath === item.url}
                    >
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}