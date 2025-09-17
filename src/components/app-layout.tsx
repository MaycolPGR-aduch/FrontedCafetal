import * as React from 'react'
import { SidebarProvider } from './ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { AppTopbar } from './app-topbar'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb'
import { Separator } from './ui/separator'

interface AppLayoutProps {
  children: React.ReactNode
  currentPath?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  title?: string
  actions?: React.ReactNode
}

export function AppLayout({ 
  children, 
  currentPath = '/app/dashboard',
  breadcrumbs = [],
  title,
  actions
}: AppLayoutProps) {
  const [dateRange, setDateRange] = React.useState<{ from: Date; to: Date }>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  })
  const [globalSearchQuery, setGlobalSearchQuery] = React.useState('')

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar currentPath={currentPath} />
        
        <div className="flex-1 flex flex-col">
          <AppTopbar 
            onDateRangeChange={setDateRange}
            onGlobalSearch={setGlobalSearchQuery}
          />
          
          <main className="flex-1 flex flex-col overflow-hidden">
            {/* Page Header */}
            {(breadcrumbs.length > 0 || title || actions) && (
              <div className="border-b">
                <div className="flex items-center justify-between p-4">
                  <div className="space-y-1">
                    {breadcrumbs.length > 0 && (
                      <Breadcrumb>
                        <BreadcrumbList>
                          {breadcrumbs.map((crumb, index) => (
                            <React.Fragment key={index}>
                              {index > 0 && <BreadcrumbSeparator />}
                              <BreadcrumbItem>
                                {crumb.href ? (
                                  <BreadcrumbLink href={crumb.href}>
                                    {crumb.label}
                                  </BreadcrumbLink>
                                ) : (
                                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                )}
                              </BreadcrumbItem>
                            </React.Fragment>
                          ))}
                        </BreadcrumbList>
                      </Breadcrumb>
                    )}
                    {title && (
                      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    )}
                  </div>
                  {actions && (
                    <div className="flex items-center gap-2">
                      {actions}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Page Content */}
            <div className="flex-1 overflow-auto p-4">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}