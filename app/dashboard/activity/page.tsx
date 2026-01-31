'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Eye, Download, UserPlus, UserMinus, FileText, Shield } from 'lucide-react'

const mockActivityLogs = [
  {
    id: 1,
    type: 'view',
    action: 'Medical record viewed',
    user: 'Dr. Sarah Chen',
    details: 'Blood Test Report - Nov 25, 2024',
    timestamp: 'Today at 2:45 PM',
    verified: true
  },
  {
    id: 2,
    type: 'download',
    action: 'Record downloaded',
    user: 'You',
    details: 'Prescription - Dec 18, 2024',
    timestamp: 'Today at 11:20 AM',
    verified: true
  },
  {
    id: 3,
    type: 'access_granted',
    action: 'Access granted',
    user: 'You',
    details: 'Dr. Emily Watson - Temporary Access',
    timestamp: 'Yesterday at 4:15 PM',
    verified: true
  },
  {
    id: 4,
    type: 'view',
    action: 'Medical record viewed',
    user: 'Dr. Michael Rodriguez',
    details: 'Annual Physical Examination',
    timestamp: 'Yesterday at 9:30 AM',
    verified: true
  },
  {
    id: 5,
    type: 'create',
    action: 'New record added',
    user: 'Dr. Sarah Chen',
    details: 'Prescription - Medication Refill',
    timestamp: 'Dec 18, 2024 at 3:20 PM',
    verified: true
  },
  {
    id: 6,
    type: 'view',
    action: 'Medical record viewed',
    user: 'Dr. David Kim',
    details: 'X-Ray Report',
    timestamp: 'Dec 17, 2024 at 1:45 PM',
    verified: true
  },
  {
    id: 7,
    type: 'access_revoked',
    action: 'Access revoked',
    user: 'You',
    details: 'Dr. Robert Johnson',
    timestamp: 'Dec 15, 2024 at 10:00 AM',
    verified: true
  },
  {
    id: 8,
    type: 'download',
    action: 'Record downloaded',
    user: 'You',
    details: 'Lab Report - Complete Panel',
    timestamp: 'Dec 14, 2024 at 5:30 PM',
    verified: true
  }
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'view':
      return Eye
    case 'download':
      return Download
    case 'access_granted':
      return UserPlus
    case 'access_revoked':
      return UserMinus
    case 'create':
      return FileText
    default:
      return Shield
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case 'view':
      return 'bg-blue-50 text-blue-600'
    case 'download':
      return 'bg-green-50 text-green-600'
    case 'access_granted':
      return 'bg-purple-50 text-purple-600'
    case 'access_revoked':
      return 'bg-orange-50 text-orange-600'
    case 'create':
      return 'bg-teal-50 text-teal-600'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}

export default function ActivityLogsPage() {
  return (
    <DashboardLayout
      userName="John Anderson"
      userRole="Patient"
      healthId="HID-9F3A-21XX"
      currentPage="/dashboard/activity"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity Logs</h2>
          <p className="text-muted-foreground mt-1">
            Complete audit trail of all actions on your medical records
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                All activities blockchain verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockActivityLogs.map((log) => {
                const Icon = getActivityIcon(log.type)
                const colorClass = getActivityColor(log.type)

                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-accent/30 transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-lg ${colorClass} flex items-center justify-center flex-shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{log.action}</h4>
                          <p className="text-sm text-muted-foreground mt-0.5">{log.user}</p>
                          <p className="text-sm text-foreground mt-1">{log.details}</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-sm text-muted-foreground">{log.timestamp}</p>
                          {log.verified && (
                            <Badge variant="outline" className="mt-2 border-green-500/30 text-green-700 bg-green-50 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
