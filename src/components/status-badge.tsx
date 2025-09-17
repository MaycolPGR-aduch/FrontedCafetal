import { Badge } from './ui/badge'
import { getStatusColor, translateStatus } from '../lib/utils'
import { cn } from '../lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge 
      variant="secondary" 
      className={cn(getStatusColor(status), className)}
    >
      {translateStatus(status)}
    </Badge>
  )
}