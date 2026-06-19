import { cn } from '@/lib/utils'
import type { GuestStatus } from '@/lib/types'

const statusConfig: Record<GuestStatus, { label: string; className: string }> = {
  confirmed: {
    label: 'Confirmée',
    className: 'bg-nw-sage/15 text-nw-sage border border-nw-sage/30',
  },
  pending: {
    label: 'En attente',
    className: 'bg-nw-camel/12 text-nw-camel border border-nw-camel/30',
  },
  declined: {
    label: 'Déclinée',
    className: 'bg-nw-black/6 text-nw-black/40 border border-black',
  },
}

interface BadgeProps {
  status: GuestStatus
  className?: string
}

export function StatusBadge({ status, className }: BadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center text-[10px] font-display font-light tracking-[0.12em] uppercase px-2 py-0.5',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
