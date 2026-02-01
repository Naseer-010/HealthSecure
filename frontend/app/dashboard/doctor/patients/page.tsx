'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Eye, FileText, Clock, Loader2, AlertCircle, Users, UserPlus } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { DoctorProfile, MedicalRecord, getRecords, searchPatient } from '@/lib/api'

interface PatientInfo {
  id: string
  name: string
  lastVisit: string
  recordCount: number
  age?: number | null
}

interface SearchResult {
  health_id: string
  name: string
  age: number | null
}

export default function MyPatientsPage() {
  const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
  const doctorProfile = profile as DoctorProfile | null
  const [patients, setPatients] = useState<PatientInfo[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // New patient search state
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
  const [healthIdSearch, setHealthIdSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
  const [searchError, setSearchError] = useState<string | null>(null)

  // Fetch records and extract unique patients
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const records = await getRecords()

        setTotalRecords(records.length)

        // Extract unique patients from records
        const patientMap = new Map<string, PatientInfo>()

        records.forEach((record: MedicalRecord) => {
          const patientKey = record.patient_health_id

          if (patientMap.has(patientKey)) {
            // Update existing patient
            const existing = patientMap.get(patientKey)!
            existing.recordCount += 1
            // Update last visit if this record is more recent
            const existingDate = new Date(existing.lastVisit)
            const recordDate = new Date(record.created_at)
            if (recordDate > existingDate) {
              existing.lastVisit = record.created_at
            }
          } else {
            // Add new patient
            patientMap.set(patientKey, {
              id: record.patient_health_id,
              name: record.patient_name,
              lastVisit: record.created_at,
              recordCount: 1
            })
          }
        })

        // Sort by most recent visit
        const patientList = Array.from(patientMap.values())
          .sort((a, b) => new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime())

        setPatients(patientList)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load patients')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesSearch
  })

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Handle patient search by Health ID
  const handlePatientSearch = async () => {
    if (!healthIdSearch.trim()) return

    setIsSearching(true)
    setSearchError(null)
    setSearchResult(null)

    try {
      const result = await searchPatient(healthIdSearch.trim())
      setSearchResult(result)
    } catch (err) {
      setSearchError(err instanceof Error ? err.message : 'Patient not found')
    } finally {
      setIsSearching(false)
    }
  }

  // Navigate to add record for searched patient
  const handleAddRecordForPatient = (healthId: string) => {
    setIsSearchDialogOpen(false)
    window.location.href = `/dashboard/doctor?patient=${healthId}`
  }

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading patients...</p>
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
      currentPage="/dashboard/doctor/patients"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
            <p className="text-muted-foreground mt-1">
              Manage and view your patient records
            </p>
          </div>

          {/* Search New Patient Dialog */}
          <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                Find Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Search Patient by Health ID</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="health-id">Patient Health ID</Label>
                  <div className="flex gap-2">
                    <Input
                      id="health-id"
                      placeholder="HID-XXXX-XXXX"
                      value={healthIdSearch}
                      onChange={(e) => setHealthIdSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handlePatientSearch()}
                    />
                    <Button
                      onClick={handlePatientSearch}
                      disabled={isSearching || !healthIdSearch.trim()}
                    >
                      {isSearching ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Search Error */}
                {searchError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{searchError}</span>
                  </div>
                )}

                {/* Search Result */}
                {searchResult && (
                  <Card className="border-green-500/30 bg-green-50/50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-green-500/20">
                          <AvatarFallback className="bg-green-100 text-green-700">
                            {searchResult.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{searchResult.name}</h4>
                          <p className="text-sm text-muted-foreground font-mono">{searchResult.health_id}</p>
                          {searchResult.age && (
                            <p className="text-sm text-muted-foreground">{searchResult.age} years old</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button
                          className="flex-1"
                          onClick={() => handleAddRecordForPatient(searchResult.health_id)}
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Add Record
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleAddRecordForPatient(searchResult.health_id)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Records
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </DialogContent>
          </Dialog>
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
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search existing patients by name or Health ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Patients</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Patient Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{patients.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {patients.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Active Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {totalRecords}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Records</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
        {filteredPatients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {patients.length === 0
                  ? 'No patients yet. Use "Find Patient" to search for a patient by their Health ID and add records.'
                  : 'No patients found matching your search.'}
              </p>
              {patients.length === 0 && (
                <Button
                  className="mt-4"
                  onClick={() => setIsSearchDialogOpen(true)}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Find Patient
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredPatients.map((patient) => (
              <Card key={patient.id} className="hover:border-primary/30 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                        {patient.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{patient.name}</h3>
                        </div>
                        <Badge
                          variant="outline"
                          className="border-green-500/30 text-green-700 bg-green-50 w-fit"
                        >
                          Active
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <FileText className="w-4 h-4" />
                          <span className="font-mono font-semibold text-foreground">{patient.id}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>Last visit: {formatDate(patient.lastVisit)}</span>
                        </div>
                      </div>

                      <div className="bg-accent/30 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Medical Records:</span>{' '}
                          <span className="text-muted-foreground">{patient.recordCount} records on file</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 lg:flex-none bg-transparent"
                        onClick={() => window.location.href = `/dashboard/doctor?patient=${patient.id}`}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Records
                      </Button>
                      <Button
                        className="flex-1 lg:flex-none bg-primary text-primary-foreground"
                        onClick={() => window.location.href = `/dashboard/doctor?patient=${patient.id}`}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
