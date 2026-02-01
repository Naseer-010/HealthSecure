'use client'

import { ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface HealthIdBadgeProps {
  healthId: string
  verified?: boolean
}

export function HealthIdBadge({ healthId, verified = true }: HealthIdBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
        <ShieldCheck className="h-6 w-6 text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">Secure Health ID</p>
        <p className="font-mono text-base font-semibold tracking-wider">{healthId}</p>
      </div>
      {verified && (
        <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary">
          Verified
        </Badge>
      )}
    </div>
  )
}
