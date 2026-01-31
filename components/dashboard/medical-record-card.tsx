'use client';

import { FileText, Download, Eye, EyeOff, ShieldCheck, MoreVertical } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

interface MedicalRecordCardProps {
  recordType: string
  doctorName: string
  hospital: string
  date: string
  isVisible: boolean
  onToggleVisibility?: () => void
  onView?: () => void
  onDownload?: () => void
}

export function MedicalRecordCard({
  recordType,
  doctorName,
  hospital,
  date,
  isVisible,
  onToggleVisibility,
  onView,
  onDownload
}: MedicalRecordCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card className="border-l-4 border-l-primary hover:shadow-lg transition-all duration-300">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{recordType}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">Dr. {doctorName}</p>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onView}>
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Hospital</span>
              <span className="text-foreground font-medium">{hospital}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Date</span>
              <span className="text-foreground font-medium">{date}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs border-green-500/30 text-green-700 bg-green-50">
                <ShieldCheck className="w-3 h-3 mr-1" />
                Verified
              </Badge>
              <Badge 
                variant="outline" 
                className={cn(
                  'text-xs',
                  isVisible 
                    ? 'border-blue-500/30 text-blue-700 bg-blue-50' 
                    : 'border-orange-500/30 text-orange-700 bg-orange-50'
                )}
              >
                {isVisible ? <Eye className="w-3 h-3 mr-1" /> : <EyeOff className="w-3 h-3 mr-1" />}
                {isVisible ? 'Visible' : 'Hidden'}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">Visibility</span>
              <Switch checked={isVisible} onCheckedChange={onToggleVisibility} />
            </div>
        </div>
      </CardContent>
    </Card>
    </motion.div>
  )
}
