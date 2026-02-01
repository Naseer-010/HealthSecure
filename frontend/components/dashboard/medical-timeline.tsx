'use client'

import { ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface TimelineEvent {
  date: string
  recordType: string
  doctor: string
  hospital: string
  verified: boolean
}

interface MedicalTimelineProps {
  events: TimelineEvent[]
}

export function MedicalTimeline({ events }: MedicalTimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

      <div className="space-y-6">
        {events.map((event, index) => (
          <motion.div 
            key={index} 
            className="relative flex gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1, ease: 'easeOut' }}
          >
            {/* Timeline dot */}
            <motion.div 
              className="relative z-10 flex-shrink-0"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 + 0.1, type: 'spring', stiffness: 200 }}
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-4 border-background shadow-sm">
                <ShieldCheck className="w-6 h-6 text-primary-foreground" />
              </div>
            </motion.div>

            {/* Event card */}
            <motion.div 
              className="flex-1"
              whileHover={{ x: 4, transition: { duration: 0.2 } }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-foreground">{event.recordType}</h4>
                      <p className="text-sm text-muted-foreground mt-1">Dr. {event.doctor}</p>
                    </div>
                    {event.verified && (
                      <Badge variant="outline" className="text-xs border-green-500/30 text-green-700 bg-green-50">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="space-y-1.5 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Hospital</span>
                      <span className="text-foreground font-medium">{event.hospital}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="text-foreground font-medium">{event.date}</span>
                    </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
