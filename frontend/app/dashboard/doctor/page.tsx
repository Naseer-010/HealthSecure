'use client'

import { useState, useEffect, useRef } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalTimeline } from '@/components/dashboard/medical-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, ShieldCheck, FileUp, Award, Loader2, Upload, X, FileText } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import {
  searchPatient,
  getPatientRecords,
  createRecord,
  DoctorProfile,
  MedicalRecord
} from '@/lib/api'

interface PatientInfo {
  health_id: string
  name: string
  age: number | null
}

export default function DoctorDashboard() {
  const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
  const [searchId, setSearchId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null)
  const [patientRecords, setPatientRecords] = useState<MedicalRecord[]>([])
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state for new record
  const [recordType, setRecordType] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [document, setDocument] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const doctorProfile = profile as DoctorProfile | null

  const handleSearch = async () => {
    if (!searchId.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSelectedPatient(null)
    setPatientRecords([])

    try {
      // First search for the patient
      const patient = await searchPatient(searchId.trim())
      setSelectedPatient(patient)

      // Then get their records
      try {
        const recordsData = await getPatientRecords(searchId.trim())
        setPatientRecords(recordsData.records)
      } catch {
        // Patient found but no records or access denied
        setPatientRecords([])
      }
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Patient not found')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddRecord = async () => {
    if (!selectedPatient || !recordType || !diagnosis) return

    setIsSubmitting(true)
    try {
      const newRecord = await createRecord({
        patient_health_id: selectedPatient.health_id,
        record_type: recordType,
        diagnosis,
        notes,
        document: document || undefined
      })

      // Add the new record to the list
      setPatientRecords([newRecord, ...patientRecords])

      // Reset form and close dialog
      setRecordType('')
      setDiagnosis('')
      setNotes('')
      setDocument(null)
      setIsAddRecordOpen(false)
    } catch (err) {
      console.error('Failed to create record:', err)
      alert(err instanceof Error ? err.message : 'Failed to create record')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const doctorName = doctorProfile
    ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
    : user?.name || 'Doctor'
  const doctorId = doctorProfile?.doctor_id || user?.doctor_id || 'N/A'
  const specialization = doctorProfile?.specialization || 'Specialist'
  const medicalLicense = doctorProfile?.medical_license || 'N/A'
  const isVerified = doctorProfile?.is_verified ?? user?.is_verified ?? false

  // Convert records to timeline format
  const timelineEvents = patientRecords.map(record => ({
    date: new Date(record.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    recordType: record.record_type_display || record.record_type,
    doctor: record.doctor_name,
    hospital: record.hospital,
    verified: true
  }))

  return (
    <DashboardLayout
      userName={doctorName}
      userRole="Doctor"
      healthId={doctorId}
      currentPage="/dashboard/doctor"
    >
      <div className="space-y-6">
        {/* Doctor Profile Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  {doctorProfile ? `${doctorProfile.first_name[0]}${doctorProfile.last_name[0]}` : 'DR'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">{doctorName}</h2>
                <p className="text-muted-foreground mb-3">{specialization}</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1.5 rounded-lg">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">License: {medicalLicense}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">{doctorId}</span>
                    <Badge
                      variant="outline"
                      className={isVerified
                        ? "border-green-500/30 text-green-700 bg-green-50"
                        : "border-yellow-500/30 text-yellow-700 bg-yellow-50"
                      }
                    >
                      {isVerified ? 'Verified' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Search Patient</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Enter patient Health ID (e.g., HID-9F3A-21XX)"
                  className="pl-10"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-primary text-primary-foreground"
                disabled={isSearching}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search Patient'
                )}
              </Button>
            </div>
            {searchError && (
              <p className="text-red-500 text-sm mt-2">{searchError}</p>
            )}
          </CardContent>
        </Card>

        {/* Patient Details - Shown after search */}
        {selectedPatient && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Patient Summary</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Read-only access to verified records</p>
                </div>
                <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <FileUp className="w-4 h-4 mr-2" />
                      Add New Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Medical Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="record-type">Record Type</Label>
                        <Select value={recordType} onValueChange={setRecordType}>
                          <SelectTrigger id="record-type">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="lab">Lab Report</SelectItem>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="imaging">Imaging Report</SelectItem>
                            <SelectItem value="procedure">Procedure Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis</Label>
                        <Input
                          id="diagnosis"
                          placeholder="Enter primary diagnosis..."
                          value={diagnosis}
                          onChange={(e) => setDiagnosis(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Enter additional medical notes..."
                          rows={4}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Upload Document (Optional)</Label>
                        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="hidden"
                            accept=".pdf,.png,.jpg,.jpeg,.dcm"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) setDocument(file)
                            }}
                          />
                          {document ? (
                            <div className="flex items-center justify-between p-2 bg-accent/50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-sm font-medium truncate max-w-[200px]">{document.name}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {(document.size / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setDocument(null)
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = ''
                                  }
                                }}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="flex flex-col items-center cursor-pointer py-6 hover:bg-accent/30 rounded-lg transition-colors"
                            >
                              <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                              <span className="text-sm font-medium text-foreground">Click to upload</span>
                              <span className="text-xs text-muted-foreground mt-1">PDF, Images, DICOM up to 10MB</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-primary text-primary-foreground"
                        onClick={handleAddRecord}
                        disabled={isSubmitting || !recordType || !diagnosis}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          'Submit Record'
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                        {selectedPatient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{selectedPatient.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedPatient.age ? `Age: ${selectedPatient.age} years` : 'Age not specified'}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono text-sm font-semibold text-foreground">{selectedPatient.health_id}</span>
                        <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">Medical History Timeline</h4>
                  {timelineEvents.length > 0 ? (
                    <MedicalTimeline events={timelineEvents} />
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      No visible medical records for this patient.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout >
  )
}
