'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface RoleSelectionCardProps {
  title: string
  description: string
  icon: LucideIcon
  selected?: boolean
  onClick?: () => void
}

export function RoleSelectionCard({
  title,
  description,
  icon: Icon,
  selected = false,
  onClick,
}: RoleSelectionCardProps) {
  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:border-primary hover:shadow-md',
        selected && 'border-primary bg-primary/5 shadow-md'
      )}
      onClick={onClick}
    >
      <CardContent className="flex items-start gap-4 p-6">
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-lg',
            selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold leading-none">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
