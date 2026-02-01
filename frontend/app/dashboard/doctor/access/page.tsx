'use client'

import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ShieldCheck, ShieldOff, Loader2, AlertCircle, Users, FileText, Clock, Eye, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import {
    DoctorProfile,
    MedicalRecord,
    getRecords,
    searchPatient,
    AccessRequest,
    getAccessRequests
} from '@/lib/api'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

interface PatientAccess {
    id: number
    patientName: string
    healthId: string
    recordCount: number
    lastAccess: string
    accessType: 'Full' | 'Temporary' | 'Emergency'
    fromAccessRequest: boolean
    status: 'APPROVED' | 'REVOKED'
    revokedAt?: string
}

interface SearchResult {
    health_id: string
    name: string
    age: number | null
}

export default function DoctorAccessControlPage() {
    const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
    const doctorProfile = profile as DoctorProfile | null
    const [patients, setPatients] = useState<PatientAccess[]>([])
    const [isLoadingRecords, setIsLoadingRecords] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Search dialog state
    const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false)
    const [healthIdSearch, setHealthIdSearch] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const [searchResult, setSearchResult] = useState<SearchResult | null>(null)
    const [searchError, setSearchError] = useState<string | null>(null)

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

                // Create a map to merge data
                const patientMap = new Map<string, PatientAccess>()

                // First, add patients from access requests (patients who granted access or revoked)
                accessRequests.forEach((request: AccessRequest, index: number) => {
                    if (request.status === 'APPROVED' || request.status === 'REVOKED') {
                        const accessTypeMap: Record<string, 'Full' | 'Temporary' | 'Emergency'> = {
                            'FULL': 'Full',
                            'TEMPORARY': 'Temporary',
                            'EMERGENCY': 'Emergency'
                        }
                        patientMap.set(request.patient_health_id, {
                            id: index + 1,
                            patientName: request.patient_name,
                            healthId: request.patient_health_id,
                            recordCount: 0,
                            lastAccess: request.granted_at,
                            accessType: accessTypeMap[request.access_type] || 'Full',
                            fromAccessRequest: true,
                            status: request.status,
                            revokedAt: request.revoked_at || undefined
                        })
                    }
                })

                // Then merge with records data
                records.forEach((record: MedicalRecord, index: number) => {
                    const patientKey = record.patient_health_id

                    if (patientMap.has(patientKey)) {
                        // Update existing patient
                        const existing = patientMap.get(patientKey)!
                        existing.recordCount += 1
                        // Update last access if more recent
                        const existingDate = new Date(existing.lastAccess)
                        const recordDate = new Date(record.created_at)
                        if (recordDate > existingDate) {
                            existing.lastAccess = record.created_at
                        }
                    } else {
                        // Add new patient from records
                        patientMap.set(patientKey, {
                            id: 1000 + index,
                            patientName: record.patient_name,
                            healthId: record.patient_health_id,
                            recordCount: 1,
                            lastAccess: record.created_at,
                            accessType: 'Full',
                            fromAccessRequest: false,
                            status: 'APPROVED'
                        })
                    }
                })

                // Sort by most recent access
                const patientList = Array.from(patientMap.values())
                    .sort((a, b) => new Date(b.lastAccess).getTime() - new Date(a.lastAccess).getTime())

                setPatients(patientList)
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

    const filteredPatients = patients.filter((patient) => {
        const matchesSearch = patient.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.healthId.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesSearch
    })

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

    // Navigate to doctor dashboard with patient
    const handleViewPatient = (healthId: string) => {
        setIsSearchDialogOpen(false)
        window.location.href = `/dashboard/doctor?patient=${healthId}`
    }

    // Count patients with explicit access grants
    const patientsWithGrants = patients.filter(p => p.fromAccessRequest).length

    if (authLoading || isLoadingRecords) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">Loading access data...</p>
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
            currentPage="/dashboard/doctor/access"
        >
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Patient Access</h1>
                        <p className="text-muted-foreground mt-1">
                            View patients who have granted you access to their records
                        </p>
                    </div>

                    {/* Search Patient Dialog */}
                    <Dialog open={isSearchDialogOpen} onOpenChange={setIsSearchDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-primary text-primary-foreground">
                                <Search className="w-4 h-4 mr-2" />
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
                                                    onClick={() => handleViewPatient(searchResult.health_id)}
                                                >
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Add Record
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    className="flex-1"
                                                    onClick={() => handleViewPatient(searchResult.health_id)}
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

                {/* Your Doctor ID Card */}
                <Card className="border-primary/30 bg-primary/5">
                    <CardContent className="p-5">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <ShieldCheck className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">Your Doctor ID</h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                    Patients can grant you access by entering this ID in their Access Control settings
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

                {/* Search Filter */}
                <Card>
                    <CardContent className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Search patients by name or Health ID..."
                                className="pl-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stats Cards */}
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
                                <p className="text-4xl font-bold text-green-600">{patientsWithGrants}</p>
                                <p className="text-sm text-muted-foreground mt-1">Explicit Access Grants</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-4xl font-bold text-primary">
                                    {patients.reduce((sum, p) => sum + p.recordCount, 0)}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">Total Records</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Patients with Access */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Patients Who Granted Access</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredPatients.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                <p className="text-muted-foreground mb-2">
                                    {patients.length === 0
                                        ? 'No patients have granted you access yet.'
                                        : 'No patients found matching your search.'}
                                </p>
                                {patients.length === 0 && (
                                    <p className="text-sm text-muted-foreground">
                                        Share your Doctor ID <span className="font-mono font-semibold">{healthId}</span> with patients so they can grant you access.
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {filteredPatients.map((patient) => (
                                    <Card
                                        key={patient.id}
                                        className={`border transition-colors ${patient.status === 'REVOKED'
                                                ? 'border-red-200 bg-red-50/30'
                                                : 'hover:border-primary/30'
                                            }`}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start gap-4">
                                                <Avatar className={`w-12 h-12 border-2 ${patient.status === 'REVOKED'
                                                        ? 'border-red-200 opacity-60'
                                                        : 'border-primary/20'
                                                    }`}>
                                                    <AvatarFallback className={`font-semibold ${patient.status === 'REVOKED'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-primary/10 text-primary'
                                                        }`}>
                                                        {patient.patientName.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <h4 className={`font-semibold ${patient.status === 'REVOKED'
                                                                    ? 'text-muted-foreground'
                                                                    : 'text-foreground'
                                                                }`}>{patient.patientName}</h4>
                                                            <p className="text-sm text-muted-foreground font-mono">{patient.healthId}</p>
                                                        </div>
                                                        {patient.status === 'REVOKED' ? (
                                                            <Badge variant="outline" className="border-red-500/30 text-red-700 bg-red-50">
                                                                <ShieldOff className="w-3 h-3 mr-1" />
                                                                Access Revoked
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className={
                                                                patient.fromAccessRequest
                                                                    ? "border-green-500/30 text-green-700 bg-green-50"
                                                                    : "border-blue-500/30 text-blue-700 bg-blue-50"
                                                            }>
                                                                <ShieldCheck className="w-3 h-3 mr-1" />
                                                                {patient.fromAccessRequest ? 'Explicit Grant' : 'Via Records'}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <FileText className="w-4 h-4" />
                                                            <span>{patient.recordCount} records</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            <span>
                                                                {patient.status === 'REVOKED' && patient.revokedAt
                                                                    ? `Revoked: ${formatDate(patient.revokedAt)}`
                                                                    : `Last: ${formatDate(patient.lastAccess)}`
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {patient.status === 'REVOKED' ? (
                                                        <div className="mt-3 p-2 bg-red-100/50 rounded text-sm text-red-700">
                                                            This patient has revoked your access to their records.
                                                        </div>
                                                    ) : (
                                                        <div className="flex gap-2 mt-3">
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => handleViewPatient(patient.healthId)}
                                                            >
                                                                <Eye className="w-3 h-3 mr-1" />
                                                                View
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                onClick={() => handleViewPatient(patient.healthId)}
                                                            >
                                                                <FileText className="w-3 h-3 mr-1" />
                                                                Add Record
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
