import * as React from 'react'
import { Bell, CalendarDays, Search, User } from 'lucide-react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover'
import { Calendar } from './ui/calendar'
import { Badge } from './ui/badge'
import { ThemeToggle } from './theme-toggle'
import { SidebarTrigger } from './ui/sidebar'
import { Separator } from './ui/separator'
import { formatDate } from '../lib/utils'

interface AppTopbarProps {
  onDateRangeChange?: (dateRange: { from: Date; to: Date }) => void
  onGlobalSearch?: (query: string) => void
}

export function AppTopbar({ onDateRangeChange, onGlobalSearch }: AppTopbarProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value
    setSearchQuery(query)
    onGlobalSearch?.(query)
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const newDateRange = { ...dateRange, to: date }
      setDateRange(newDateRange)
      onDateRangeChange?.(newDateRange)
    }
  }

  // Mock notifications
  const notifications = [
    { id: 1, title: 'Stock bajo en Café Arábica', type: 'warning' },
    { id: 2, title: 'Orden OP-2024-001 completada', type: 'success' },
    { id: 3, title: 'Factura FV-2024-015 vencida', type: 'error' },
  ]

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      
      {/* Global Search */}
      <div className="flex items-center gap-2 flex-1">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar productos, lotes, facturas... (Ctrl+K)"
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-8"
          />
        </div>
      </div>

      {/* Date Range Selector */}
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarDays className="h-4 w-4" />
            <span className="hidden sm:inline">
              {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <Calendar
            mode="single"
            selected={dateRange.to}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            {notifications.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs"
              >
                {notifications.length}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notificaciones</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex items-start gap-2">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                notification.type === 'warning' ? 'bg-yellow-500' :
                notification.type === 'success' ? 'bg-green-500' :
                'bg-red-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm">{notification.title}</p>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Toggle */}
      <ThemeToggle />

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            <span className="sr-only">Menú de usuario</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configuración</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Cerrar Sesión</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}