'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { AccessControlCard } from '@/components/dashboard/access-control-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserPlus, AlertCircle, Loader2, Users, CheckCircle2, Info } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import {
  PatientProfile,
  MedicalRecord,
  getRecords,
  AccessRequest,
  getAccessRequests,
  createAccessRequest,
  revokeAccess
} from '@/lib/api'

interface DoctorAccess {
  id: number
  accessRequestId?: number  // ID from access request API
  doctorName: string
  specialization: string
  hospital: string
  accessType: 'Full' | 'Temporary' | 'Emergency'
  grantedDate: string
  recordCount: number
  status: string
}

export default function AccessControlPage() {
  const { isLoading: authLoading, user, profile } = useAuth('PATIENT')
  const patientProfile = profile as PatientProfile | null
  const [doctors, setDoctors] = useState<DoctorAccess[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isGrantAccessOpen, setIsGrantAccessOpen] = useState(false)

  // Grant access form state
  const [doctorId, setDoctorId] = useState('')
  const [accessType, setAccessType] = useState<'FULL' | 'TEMPORARY' | 'EMERGENCY'>('FULL')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [grantSuccess, setGrantSuccess] = useState(false)
  const [grantError, setGrantError] = useState<string | null>(null)
  const [revokeSuccess, setRevokeSuccess] = useState<string | null>(null)

  // Fetch records and access requests
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoadingRecords(true)
        setError(null)

        // Fetch both records and access requests
        const [records, accessRequests] = await Promise.all([
          getRecords(),
          getAccessRequests()
        ])

        // Create a map to merge data from records and access requests
        const doctorMap = new Map<string, DoctorAccess>()

        // First, add doctors from access requests
        accessRequests.forEach((request: AccessRequest, index: number) => {
          if (request.status === 'APPROVED') {
            const accessTypeMap: Record<string, 'Full' | 'Temporary' | 'Emergency'> = {
              'FULL': 'Full',
              'TEMPORARY': 'Temporary',
              'EMERGENCY': 'Emergency'
            }
            doctorMap.set(request.doctor_name, {
              id: index + 1,
              accessRequestId: request.id,
              doctorName: request.doctor_name,
              specialization: 'Healthcare Provider',
              hospital: request.doctor_hospital || 'Not specified',
              accessType: accessTypeMap[request.access_type] || 'Full',
              grantedDate: new Date(request.granted_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              recordCount: 0,
              status: request.status
            })
          }
        })

        // Then merge with records data
        records.forEach((record: MedicalRecord, index: number) => {
          const doctorKey = record.doctor_name

          if (doctorMap.has(doctorKey)) {
            // Update existing doctor
            const existing = doctorMap.get(doctorKey)!
            existing.recordCount += 1
            existing.hospital = record.hospital
            existing.specialization = record.record_type_display
          } else {
            // Add new doctor from records (implicit access)
            doctorMap.set(doctorKey, {
              id: 1000 + index,
              doctorName: record.doctor_name,
              specialization: record.record_type_display,
              hospital: record.hospital,
              accessType: 'Full',
              grantedDate: new Date(record.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              recordCount: 1,
              status: 'APPROVED'
            })
          }
        })

        setDoctors(Array.from(doctorMap.values()))
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load access data')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchData()
    }
  }, [authLoading])

  const handleRevoke = async (id: number, accessRequestId?: number) => {
    const doctor = doctors.find(d => d.id === id)

    if (accessRequestId) {
      try {
        await revokeAccess(accessRequestId)
      } catch (err) {
        console.error('Failed to revoke access:', err)
      }
    }

    // Update UI
    setDoctors(doctors.filter(d => d.id !== id))
    if (doctor) {
      setRevokeSuccess(doctor.doctorName)
      setTimeout(() => setRevokeSuccess(null), 3000)
    }
  }

  const handleGrantAccess = async () => {
    if (!accessType) return

    setIsSubmitting(true)
    setGrantError(null)

    try {
      await createAccessRequest({
        doctor_id: doctorId.trim() || undefined,
        access_type: accessType
      })

      // Show success message
      setGrantSuccess(true)
      setDoctorId('')
      setAccessType('FULL')

      // Hide success and close dialog after 2 seconds
      setTimeout(() => {
        setGrantSuccess(false)
        setIsGrantAccessOpen(false)
        // Refresh the page to show new access
        window.location.reload()
      }, 2000)
    } catch (err) {
      setGrantError(err instanceof Error ? err.message : 'Failed to grant access')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading access controls...</p>
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
      currentPage="/dashboard/access"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Access Control</h2>
            <p className="text-muted-foreground mt-1">
              Manage who can view your medical records
            </p>
          </div>
          <Dialog open={isGrantAccessOpen} onOpenChange={(open) => {
            setIsGrantAccessOpen(open)
            if (!open) {
              setGrantSuccess(false)
              setGrantError(null)
              setDoctorId('')
              setAccessType('FULL')
            }
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grant Access to Doctor</DialogTitle>
                <DialogDescription>
                  Share your Health ID with your doctor so they can access your records.
                </DialogDescription>
              </DialogHeader>

              {grantSuccess ? (
                <div className="py-8 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Access Granted!</h3>
                  <p className="text-sm text-muted-foreground">
                    The doctor can now access your medical records.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 py-4">
                  {/* Info Card */}
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">How it works</p>
                      <p>Share your Health ID <span className="font-mono font-semibold">{healthId}</span> with your doctor, then grant access here.</p>
                    </div>
                  </div>

                  {grantError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">{grantError}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="doctor-id">Doctor ID (Optional)</Label>
                    <Input
                      id="doctor-id"
                      placeholder="DOC-XXXX-XXXX"
                      value={doctorId}
                      onChange={(e) => setDoctorId(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Enter the doctor's ID to grant specific access, or leave blank for general access
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="access-type">Access Type</Label>
                    <Select value={accessType} onValueChange={(v) => setAccessType(v as 'FULL' | 'TEMPORARY' | 'EMERGENCY')}>
                      <SelectTrigger id="access-type">
                        <SelectValue placeholder="Select access type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FULL">Full Access</SelectItem>
                        <SelectItem value="TEMPORARY">Temporary (30 days)</SelectItem>
                        <SelectItem value="EMERGENCY">Emergency Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground"
                    onClick={handleGrantAccess}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Granting Access...
                      </>
                    ) : (
                      'Grant Access'
                    )}
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Success Notification for Revoke */}
        {revokeSuccess && (
          <Card className="border-green-500/30 bg-green-50">
            <CardContent className="p-4 flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <p className="text-green-800">Access revoked for {revokeSuccess}</p>
            </CardContent>
          </Card>
        )}

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

        {/* Your Health ID Card */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Your Health ID</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Share this ID with your healthcare providers to grant them access
                </p>
                <div className="flex items-center gap-2">
                  <code className="px-3 py-2 bg-background border rounded-lg font-mono text-lg font-semibold">
                    {healthId}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(healthId)}
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Access Status */}
        <Card className="border-amber-500/30 bg-amber-50/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Emergency Access Protocol</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Authorized medical professionals can access your records in emergency situations
                </p>
                <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors with Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Authorized Healthcare Providers</CardTitle>
          </CardHeader>
          <CardContent>
            {doctors.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">
                  No healthcare providers have been granted access yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  Share your Health ID <span className="font-mono font-semibold">{healthId}</span> with doctors, then grant access above.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <AccessControlCard
                    key={doctor.id}
                    doctorName={doctor.doctorName}
                    specialization={`${doctor.recordCount} record${doctor.recordCount !== 1 ? 's' : ''} created`}
                    hospital={doctor.hospital}
                    accessType={doctor.accessType}
                    grantedDate={doctor.grantedDate}
                    onRevoke={() => handleRevoke(doctor.id, doctor.accessRequestId)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
