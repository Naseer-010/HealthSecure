'use client';

import { UserCheck, Clock, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface AccessControlCardProps {
  doctorName: string
  specialization: string
  hospital: string
  accessType: 'Full' | 'Temporary' | 'Emergency'
  grantedDate: string
  expiresDate?: string
  onRevoke?: () => void
}

export function AccessControlCard({
  doctorName,
  specialization,
  hospital,
  accessType,
  grantedDate,
  expiresDate,
  onRevoke
}: AccessControlCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {doctorName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold text-foreground">Dr. {doctorName}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{specialization}</p>
              <p className="text-xs text-muted-foreground mt-1">{hospital}</p>
            </div>
          </div>

          <Badge 
            variant="outline"
            className={
              accessType === 'Full' 
                ? 'border-green-500/30 text-green-700 bg-green-50'
                : accessType === 'Temporary'
                ? 'border-orange-500/30 text-orange-700 bg-orange-50'
                : 'border-red-500/30 text-red-700 bg-red-50'
            }
          >
            {accessType === 'Temporary' && <Clock className="w-3 h-3 mr-1" />}
            {accessType === 'Emergency' && <UserCheck className="w-3 h-3 mr-1" />}
            {accessType}
          </Badge>
        </div>

        <div className="space-y-1.5 mb-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Access Granted</span>
            <span className="text-foreground font-medium">{grantedDate}</span>
          </div>
          {expiresDate && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Expires</span>
              <span className="text-foreground font-medium">{expiresDate}</span>
            </div>
          )}
        </div>

        <Button 
          variant="outline" 
          size="sm" 
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 bg-transparent"
          onClick={onRevoke}
        >
          <X className="w-4 h-4 mr-2" />
          Revoke Access
        </Button>
      </CardContent>
    </Card>
  )
}
