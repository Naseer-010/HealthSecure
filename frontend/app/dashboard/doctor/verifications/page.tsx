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
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText, ExternalLink, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { DoctorProfile, MedicalRecord, getRecords } from '@/lib/api'

interface VerificationItem {
  id: number
  recordId: string
  type: string
  patient: string
  patientId: string
  submittedAt: string
  status: 'verified' | 'pending' | 'failed'
  blockchainHash: string | null
  verifiedAt: string | null
  ipfsUrl: string | null
}

export default function VerificationsPage() {
  const { isLoading: authLoading, user, profile } = useAuth('DOCTOR')
  const doctorProfile = profile as DoctorProfile | null
  const [verifications, setVerifications] = useState<VerificationItem[]>([])
  const [isLoadingRecords, setIsLoadingRecords] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('all')

  // Fetch records and generate verifications
  useEffect(() => {
    async function fetchRecords() {
      try {
        setIsLoadingRecords(true)
        setError(null)
        const records = await getRecords()

        // Generate verification entries from records
        const verificationItems: VerificationItem[] = records.map((record: MedicalRecord) => ({
          id: record.id,
          recordId: `REC-${record.id.toString().padStart(4, '0')}`,
          type: record.record_type_display,
          patient: record.patient_name,
          patientId: record.patient_health_id,
          submittedAt: new Date(record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) + ' ' + new Date(record.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          status: record.ipfs_cid || record.ipfs_metadata_cid ? 'verified' : 'pending',
          blockchainHash: record.ipfs_metadata_cid || record.ipfs_cid || null,
          verifiedAt: record.ipfs_cid ? new Date(record.updated_at || record.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) + ' ' + new Date(record.updated_at || record.created_at).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }) : null,
          ipfsUrl: record.ipfs_url || null
        }))

        setVerifications(verificationItems)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load verifications')
      } finally {
        setIsLoadingRecords(false)
      }
    }

    if (!authLoading) {
      fetchRecords()
    }
  }, [authLoading])

  const filteredVerifications = verifications.filter((verification) => {
    const matchesStatus = statusFilter === 'all' || verification.status === statusFilter
    return matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return (
          <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )
      case 'pending':
        return (
          <Badge variant="outline" className="border-orange-500/30 text-orange-700 bg-orange-50">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="border-red-500/30 text-red-700 bg-red-50">
            <AlertCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        )
      default:
        return null
    }
  }

  // Stats
  const verifiedCount = verifications.filter(v => v.status === 'verified').length
  const pendingCount = verifications.filter(v => v.status === 'pending').length
  const failedCount = verifications.filter(v => v.status === 'failed').length

  if (authLoading || isLoadingRecords) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading verifications...</p>
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
      currentPage="/dashboard/doctor/verifications"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blockchain Verifications</h1>
          <p className="text-muted-foreground mt-1">
            Track the blockchain verification status of your submitted records
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
                <p className="text-3xl font-bold text-green-600">
                  {verifiedCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {pendingCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {failedCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {verifications.length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <Card>
          <CardContent className="p-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[250px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Verifications</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Verifications List */}
        {filteredVerifications.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <ShieldCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {verifications.length === 0
                  ? 'No records yet. Verification status will appear here after you create records.'
                  : 'No verifications found matching your filter.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredVerifications.map((verification) => (
              <Card
                key={verification.id}
                className={
                  verification.status === 'failed'
                    ? 'border-red-500/30'
                    : verification.status === 'pending'
                      ? 'border-orange-500/30'
                      : ''
                }
              >
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-foreground">
                              {verification.type}
                            </h3>
                            {getStatusBadge(verification.status)}
                          </div>
                          <p className="text-sm text-muted-foreground font-mono">
                            Record ID: {verification.recordId}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {verification.patient.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{verification.patient}</span>
                        <span className="text-sm text-muted-foreground font-mono">
                          {verification.patientId}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-foreground">Submitted:</span>{' '}
                          <span className="text-muted-foreground">{verification.submittedAt}</span>
                        </div>
                        {verification.verifiedAt && (
                          <div>
                            <span className="font-medium text-foreground">Verified:</span>{' '}
                            <span className="text-muted-foreground">{verification.verifiedAt}</span>
                          </div>
                        )}
                      </div>

                      {verification.blockchainHash && (
                        <div className="bg-accent/30 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <ShieldCheck className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground mb-1">
                                IPFS Content Identifier (CID):
                              </p>
                              <p className="text-xs font-mono text-muted-foreground break-all">
                                {verification.blockchainHash}
                              </p>
                            </div>
                            {verification.ipfsUrl && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="flex-shrink-0"
                                onClick={() => window.open(verification.ipfsUrl!, '_blank')}
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      )}

                      {verification.status === 'pending' && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <div className="flex items-start gap-2">
                            <Clock className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-sm text-orange-800">
                                This record is awaiting IPFS verification. It will be verified automatically.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
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
