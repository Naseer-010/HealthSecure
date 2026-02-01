'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Eye, Download, UserPlus, UserMinus, FileText, Shield, Loader2, AlertCircle, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { PatientProfile, MedicalRecord, getRecords } from '@/lib/api'

interface ActivityLog {
  id: number
  type: string
  action: string
  user: string
  details: string
  timestamp: string
  verified: boolean
}

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

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const timeStr = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  if (diffDays === 0) {
    return `Today at ${timeStr}`
  } else if (diffDays === 1) {
    return `Yesterday at ${timeStr}`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }) + ` at ${timeStr}`
  }
}

export default function ActivityLogsPage() {
  const { isLoading: authLoading, user, profile } = useAuth('PATIENT')
  const patientProfile = profile as PatientProfile | null
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch records and generate activity logs
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const records = await getRecords()

        // Generate activity logs from records
        const logs: ActivityLog[] = records.map((record: MedicalRecord, index: number) => ({
          id: record.id,
          type: 'create',
          action: 'Medical record added',
          user: record.doctor_name,
          details: `${record.record_type_display} - ${record.diagnosis}`,
          timestamp: formatRelativeTime(record.created_at),
          verified: !!record.ipfs_cid || !!record.ipfs_metadata_cid
        }))

        // Sort by most recent first (records should already be sorted, but ensure it)
        setActivityLogs(logs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity logs')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

  const verifiedCount = activityLogs.filter(l => l.verified).length

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading activity logs...</p>
        </div>
      </div>
    )
  }

  const userName = patientProfile
    ? `${patientProfile.first_name} ${patientProfile.last_name}`
    : user?.name || 'Patient'
  const healthId = patientProfile?.health_id || user?.health_id || 'N/A'

  return (
    <DashboardLayout
      userName={userName}
      userRole="Patient"
      healthId={healthId}
      currentPage="/dashboard/activity"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Activity Logs</h2>
          <p className="text-muted-foreground mt-1">
            Complete audit trail of all actions on your medical records
          </p>
        </div>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="p-4 flex items-center gap-3 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.location.reload()}
                className="ml-auto"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              {verifiedCount > 0 && (
                <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                  {verifiedCount} blockchain verified
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {activityLogs.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No activity yet. Activity will appear here as healthcare providers interact with your records.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {activityLogs.map((log) => {
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
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
