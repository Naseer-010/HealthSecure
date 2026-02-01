'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { MedicalRecordCard } from '@/components/dashboard/medical-record-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Calendar, EyeOff, ShieldCheck, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { getRecords, toggleRecordVisibility, MedicalRecord, PatientProfile } from '@/lib/api'

export default function PatientDashboard() {
  const { isLoading: authLoading, user, profile } = useAuth('PATIENT')
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const patientProfile = profile as PatientProfile | null

  // Fetch medical records
  useEffect(() => {
    async function fetchRecords() {
      try {
        const data = await getRecords()
        setRecords(data)
      } catch (err) {
        setError('Failed to load medical records')
        console.error(err)
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading && user) {
      fetchRecords()
    }
  }, [authLoading, user])

  const handleToggleVisibility = async (id: number) => {
    try {
      const result = await toggleRecordVisibility(id)
      setRecords(records.map(record =>
        record.id === id ? { ...record, is_visible: result.is_visible } : record
      ))
    } catch (err) {
      console.error('Failed to toggle visibility:', err)
    }
  }

  // Show loading state
  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const visibleRecords = records.filter(r => r.is_visible).length
  const hiddenRecords = records.filter(r => !r.is_visible).length
  const userName = patientProfile
    ? `${patientProfile.first_name} ${patientProfile.last_name}`
    : user?.name || 'Patient'
  const healthId = patientProfile?.health_id || user?.health_id || 'N/A'

  // Get the most recent record date for "Last Visit"
  const lastVisitDate = records.length > 0
    ? new Date(records[0].created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : 'None'
  const lastVisitYear = records.length > 0
    ? new Date(records[0].created_at).getFullYear().toString()
    : ''

  // Count unique doctors
  const uniqueDoctors = new Set(records.map(r => r.doctor_name)).size

  return (
    <DashboardLayout
      userName={userName}
      userRole="Patient"
      healthId={healthId}
      currentPage="/dashboard/patient"
    >
      <div className="space-y-6">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">
                    Welcome back, {userName}
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Your health records are secure and up to date
                  </p>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-4 py-2 rounded-lg inline-flex">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">{healthId}</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Records"
            value={records.length}
            icon={FileText}
            description="Lifetime medical records"
          />
          <StatCard
            title="Doctors Connected"
            value={uniqueDoctors}
            icon={Users}
            description="Healthcare providers"
          />
          <StatCard
            title="Last Visit"
            value={lastVisitDate}
            icon={Calendar}
            description={lastVisitYear}
          />
          <StatCard
            title="Hidden Records"
            value={hiddenRecords}
            icon={EyeOff}
            description={`${visibleRecords} visible`}
          />
        </div>

        {/* Medical Records Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3, ease: 'easeOut' }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">My Medical Records</CardTitle>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="text-center py-8 text-red-500">{error}</div>
              ) : records.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No medical records found. Your records will appear here once added by a healthcare provider.
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {records.map((record, index) => (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                    >
                      <MedicalRecordCard
                        recordType={record.record_type_display || record.record_type}
                        doctorName={record.doctor_name}
                        hospital={record.hospital}
                        date={new Date(record.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        isVisible={record.is_visible}
                        onToggleVisibility={() => handleToggleVisibility(record.id)}
                        onView={() => console.log('View record:', record.id)}
                        onDownload={() => console.log('Download record:', record.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
