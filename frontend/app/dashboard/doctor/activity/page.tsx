'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, UserPlus, Edit, Eye, Clock, ShieldCheck, Loader2, AlertCircle, Activity } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { DoctorProfile, MedicalRecord, getRecords } from '@/lib/api'

interface ActivityItem {
  id: number
  type: string
  title: string
  patient: string
  patientId: string
  description: string
  timestamp: string
  status: string
}

// Format relative time
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) + ' ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

export default function DoctorActivityPage() {
  const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
  const doctorProfile = profile as DoctorProfile | null
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState('all')
  const [filterTime, setFilterTime] = useState('all')

  // Fetch records and generate activity
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const records = await getRecords()

        // Generate activity from records
        const activityItems: ActivityItem[] = records.map((record: MedicalRecord) => ({
          id: record.id,
          type: 'record_added',
          title: `Added ${record.record_type_display}`,
          patient: record.patient_name,
          patientId: record.patient_health_id,
          description: record.diagnosis,
          timestamp: formatRelativeTime(record.created_at),
          status: record.ipfs_cid || record.ipfs_metadata_cid ? 'verified' : 'completed'
        }))

        setActivities(activityItems)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load activity')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

  const filteredActivities = activities.filter((activity) => {
    const matchesType = filterType === 'all' || activity.type === filterType
    return matchesType
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'record_added':
        return FileText
      case 'record_updated':
        return Edit
      case 'patient_viewed':
        return Eye
      case 'patient_access':
        return UserPlus
      default:
        return FileText
    }
  }

  // Stats
  const recordsAdded = activities.filter(a => a.type === 'record_added').length
  const verifiedCount = activities.filter(a => a.status === 'verified').length

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading activity...</p>
        </div>
      </div>
    )
  }

  const userName = doctorProfile
    ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
    : user?.name || 'Doctor'
  const healthId = doctorProfile?.doctor_id || user?.doctor_id || 'N/A'

  return (
    <DashboardLayout
      userName={userName}
      userRole="Doctor"
      healthId={healthId}
      currentPage="/dashboard/doctor/activity"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recent Activity</h1>
          <p className="text-muted-foreground mt-1">
            Track your recent actions and patient interactions
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {recordsAdded}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Records Added</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-1">Records Viewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">0</p>
                <p className="text-sm text-muted-foreground mt-1">Records Updated</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {verifiedCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Verified</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filter by activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="record_added">Records Added</SelectItem>
                  <SelectItem value="record_updated">Records Updated</SelectItem>
                  <SelectItem value="patient_viewed">Records Viewed</SelectItem>
                  <SelectItem value="patient_access">Access Granted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTime} onValueChange={setFilterTime}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No activity yet. Activity will appear here as you create records for patients.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredActivities.map((activity, index) => {
                  const Icon = getActivityIcon(activity.type)
                  return (
                    <div
                      key={activity.id}
                      className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        {index < filteredActivities.length - 1 && (
                          <div className="absolute left-1/2 top-10 bottom-0 w-0.5 bg-border -translate-x-1/2 h-4" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                          <div>
                            <h4 className="font-semibold text-foreground">{activity.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                  {activity.patient.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{activity.patient}</span>
                              <span className="text-sm text-muted-foreground font-mono">
                                {activity.patientId}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {activity.status === 'verified' && (
                              <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                                <ShieldCheck className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                            <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                              <Clock className="w-4 h-4" />
                              {activity.timestamp}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
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
