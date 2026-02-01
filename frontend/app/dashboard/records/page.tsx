'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalRecordCard } from '@/components/dashboard/medical-record-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, Loader2, AlertCircle, FileText, Download, Calendar, Building2, User, Eye } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAuth } from '@/hooks/useAuth'
import { PatientProfile, MedicalRecord, getRecords, toggleRecordVisibility, getDocumentUrl } from '@/lib/api'

export default function MedicalRecordsPage() {
  const { isLoading: authLoading, user, profile } = useAuth('PATIENT')
  const patientProfile = profile as PatientProfile | null
  const [records, setRecords] = useState<MedicalRecord[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  // Record detail dialog state
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Fetch records from API
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const data = await getRecords()
        setRecords(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load records')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

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

  const handleViewRecord = (record: MedicalRecord) => {
    setSelectedRecord(record)
    setIsViewDialogOpen(true)
  }

  const handleDownloadRecord = (record: MedicalRecord) => {
    if (record.document) {
      const url = getDocumentUrl(record.document)
      window.open(url, '_blank')
    } else {
      // Create a text representation of the record for download
      const recordText = `
Medical Record
==============

Record Type: ${record.record_type_display}
Diagnosis: ${record.diagnosis}
Date: ${formatDate(record.created_at)}

Doctor: Dr. ${record.doctor_name}
Hospital: ${record.hospital}

Notes:
${record.notes || 'No additional notes'}
      `.trim()

      const blob = new Blob([recordText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `medical-record-${record.id}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch =
      record.record_type_display.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctor_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesFilter =
      filterType === 'all' ||
      (filterType === 'visible' && record.is_visible) ||
      (filterType === 'hidden' && !record.is_visible)

    return matchesSearch && matchesFilter
  })

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading records...</p>
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
      currentPage="/dashboard/records"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Medical Records</h2>
          <p className="text-muted-foreground mt-1">
            View and manage all your medical records
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

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search records, doctors, or hospitals..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="visible">Visible Only</SelectItem>
                  <SelectItem value="hidden">Hidden Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Records Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {filteredRecords.length} {filteredRecords.length === 1 ? 'Record' : 'Records'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {records.length === 0
                    ? 'No medical records found. Records will appear here when created by your healthcare providers.'
                    : 'No records found matching your criteria'}
                </p>
                {records.length > 0 && (
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      setSearchQuery('')
                      setFilterType('all')
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRecords.map((record) => (
                  <MedicalRecordCard
                    key={record.id}
                    recordType={`${record.record_type_display} - ${record.diagnosis}`}
                    doctorName={record.doctor_name}
                    hospital={record.hospital}
                    date={formatDate(record.created_at)}
                    isVisible={record.is_visible}
                    onToggleVisibility={() => handleToggleVisibility(record.id)}
                    onView={() => handleViewRecord(record)}
                    onDownload={() => handleDownloadRecord(record)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Record Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Medical Record Details
            </DialogTitle>
          </DialogHeader>

          {selectedRecord && (
            <div className="space-y-6 py-4">
              {/* Record Type and Status */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {selectedRecord.record_type_display}
                  </h3>
                  <p className="text-muted-foreground">{selectedRecord.diagnosis}</p>
                </div>
                <Badge
                  variant="outline"
                  className={selectedRecord.is_visible
                    ? "border-green-500/30 text-green-700 bg-green-50"
                    : "border-orange-500/30 text-orange-700 bg-orange-50"
                  }
                >
                  <Eye className="w-3 h-3 mr-1" />
                  {selectedRecord.is_visible ? 'Visible to Doctors' : 'Hidden'}
                </Badge>
              </div>

              {/* Record Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <User className="w-4 h-4" />
                    <span className="text-sm">Doctor</span>
                  </div>
                  <p className="font-medium text-foreground">Dr. {selectedRecord.doctor_name}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Building2 className="w-4 h-4" />
                    <span className="text-sm">Hospital</span>
                  </div>
                  <p className="font-medium text-foreground">{selectedRecord.hospital}</p>
                </div>

                <div className="p-4 bg-muted/30 rounded-lg md:col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Date Created</span>
                  </div>
                  <p className="font-medium text-foreground">{formatDate(selectedRecord.created_at)}</p>
                </div>
              </div>

              {/* Notes Section */}
              {selectedRecord.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Clinical Notes</h4>
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {selectedRecord.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Document Section */}
              {selectedRecord.document && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Attached Document</h4>
                  <div className="p-4 border border-dashed rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Medical Document</p>
                        <p className="text-sm text-muted-foreground">Click to view or download</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const url = getDocumentUrl(selectedRecord.document!)
                        window.open(url, '_blank')
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsViewDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => handleDownloadRecord(selectedRecord)}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
