'use client'

import React from "react"
import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, FileUp, ShieldCheck, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useAuth } from '@/hooks/useAuth'
import { searchPatient, createRecord, DoctorProfile } from '@/lib/api'

interface PatientInfo {
  health_id: string
  name: string
  age: number | null
}

export default function AddRecordPage() {
  const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
  const [searchId, setSearchId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null)
  const [recordType, setRecordType] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const doctorProfile = profile as DoctorProfile | null

  const handleSearch = async () => {
    if (!searchId.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSelectedPatient(null)

    try {
      const patient = await searchPatient(searchId.trim())
      setSelectedPatient(patient)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Patient not found')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPatient || !recordType || !diagnosis || !notes) return

    setIsSubmitting(true)
    try {
      await createRecord({
        patient_health_id: selectedPatient.health_id,
        record_type: recordType,
        diagnosis,
        notes
      })

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setRecordType('')
        setDiagnosis('')
        setNotes('')
        setSelectedPatient(null)
        setSearchId('')
      }, 3000)
    } catch (err) {
      console.error('Failed to create record:', err)
      alert(err instanceof Error ? err.message : 'Failed to create record')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  const doctorName = doctorProfile
    ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
    : user?.name || 'Doctor'
  const doctorId = doctorProfile?.doctor_id || user?.doctor_id || 'N/A'

  return (
    <DashboardLayout
      userName={doctorName}
      userRole="Doctor"
      healthId={doctorId}
      currentPage="/dashboard/doctor/add-record"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Medical Record</h1>
          <p className="text-muted-foreground mt-1">
            Create a new medical record for your patient
          </p>
        </div>

        {/* Search Patient */}
        <Card>
          <CardHeader>
            <CardTitle>Search Patient</CardTitle>
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

        {/* Patient Info */}
        {selectedPatient && (
          <Card className="border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {selectedPatient.name.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{selectedPatient.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedPatient.age ? `Age: ${selectedPatient.age} years` : 'Age not specified'}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-mono text-sm font-semibold text-foreground">
                      {selectedPatient.health_id}
                    </span>
                    <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Record Form */}
        {selectedPatient && (
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Medical Record Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Record Type */}
                <div className="space-y-2">
                  <Label htmlFor="record-type">
                    Record Type <span className="text-destructive">*</span>
                  </Label>
                  <Select value={recordType} onValueChange={setRecordType} required>
                    <SelectTrigger id="record-type">
                      <SelectValue placeholder="Select record type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="lab">Lab Report</SelectItem>
                      <SelectItem value="diagnosis">Diagnosis</SelectItem>
                      <SelectItem value="imaging">Imaging Report</SelectItem>
                      <SelectItem value="procedure">Procedure Notes</SelectItem>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up Notes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Diagnosis */}
                <div className="space-y-2">
                  <Label htmlFor="diagnosis">
                    Diagnosis / Chief Complaint <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="diagnosis"
                    placeholder="Enter primary diagnosis or chief complaint"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    required
                  />
                </div>

                {/* Clinical Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">
                    Clinical Notes <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter detailed clinical notes, observations, and treatment plan..."
                    rows={6}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Include symptoms, examination findings, and treatment recommendations
                  </p>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <Label>Upload Supporting Documents</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, JPG, PNG, DICOM up to 10MB
                    </p>
                  </div>
                </div>

                {/* Blockchain Note */}
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This record will be permanently stored on the blockchain and cannot be deleted.
                    Please ensure all information is accurate before submitting.
                  </AlertDescription>
                </Alert>

                {/* Submit Button */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => {
                      setSelectedPatient(null)
                      setSearchId('')
                      setRecordType('')
                      setDiagnosis('')
                      setNotes('')
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground"
                    disabled={!recordType || !diagnosis || !notes || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        Submit & Verify on Blockchain
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        )}

        {/* Success Message */}
        {submitted && (
          <Alert className="border-green-500/50 bg-green-50">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Medical record successfully added and verified on blockchain!
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  )
}
