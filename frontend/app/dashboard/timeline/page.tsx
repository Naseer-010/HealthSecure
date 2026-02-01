'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalTimeline } from '@/components/dashboard/medical-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { PatientProfile, MedicalRecord, getRecords } from '@/lib/api'

interface TimelineEvent {
  date: string
  recordType: string
  doctor: string
  hospital: string
  verified: boolean
}

export default function TimelinePage() {
  const { isLoading: authLoading, user, profile } = useAuth('PATIENT')
  const patientProfile = profile as PatientProfile | null
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch records and transform to timeline events
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const records = await getRecords()

        // Transform records to timeline events
        const events: TimelineEvent[] = records.map((record: MedicalRecord) => ({
          date: new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          recordType: `${record.record_type_display} - ${record.diagnosis}`,
          doctor: record.doctor_name,
          hospital: record.hospital,
          verified: !!record.ipfs_cid || !!record.ipfs_metadata_cid // Consider verified if on IPFS
        }))

        setTimelineEvents(events)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load timeline')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

  const verifiedCount = timelineEvents.filter(e => e.verified).length

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading timeline...</p>
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
      currentPage="/dashboard/timeline"
    >
      <div className="space-y-6">
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

        <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your Medical Timeline
                </h2>
                <p className="text-muted-foreground">
                  A complete chronological view of your lifelong medical history
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">{timelineEvents.length} Records</Badge>
                  {verifiedCount > 0 && (
                    <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                      {verifiedCount} Verified on Blockchain
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            {timelineEvents.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No medical history yet. Your timeline will populate as healthcare providers add records.
                </p>
              </div>
            ) : (
              <MedicalTimeline events={timelineEvents} />
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
