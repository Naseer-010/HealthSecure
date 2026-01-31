'use client'

import { useState } from 'react'
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
import { ShieldCheck, Clock, CheckCircle2, AlertCircle, FileText, ExternalLink } from 'lucide-react'

const mockVerifications = [
  {
    id: 1,
    recordId: 'REC-8492-AC7D',
    type: 'Lab Report',
    patient: 'Jane Wilson',
    patientId: 'HID-9F3A-21XX',
    submittedAt: '2024-12-18 10:30 AM',
    status: 'verified',
    blockchainHash: '0x7f8a3b2c1d9e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9',
    verifiedAt: '2024-12-18 10:31 AM',
  },
  {
    id: 2,
    recordId: 'REC-9103-BD8E',
    type: 'Prescription',
    patient: 'Michael Thompson',
    patientId: 'HID-7B2C-45YY',
    submittedAt: '2024-12-18 09:15 AM',
    status: 'verified',
    blockchainHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    verifiedAt: '2024-12-18 09:16 AM',
  },
  {
    id: 3,
    recordId: 'REC-7284-CE9F',
    type: 'Diagnosis',
    patient: 'Robert Chen',
    patientId: 'HID-5L9E-78AA',
    submittedAt: '2024-12-17 02:20 PM',
    status: 'pending',
    blockchainHash: null,
    verifiedAt: null,
  },
  {
    id: 4,
    recordId: 'REC-6175-DF0G',
    type: 'Imaging Report',
    patient: 'Jane Wilson',
    patientId: 'HID-9F3A-21XX',
    submittedAt: '2024-12-15 03:15 PM',
    status: 'verified',
    blockchainHash: '0x9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e',
    verifiedAt: '2024-12-15 03:16 PM',
  },
  {
    id: 5,
    recordId: 'REC-5066-EG1H',
    type: 'Consultation Notes',
    patient: 'Sarah Martinez',
    patientId: 'HID-3K8D-12ZZ',
    submittedAt: '2024-12-14 02:45 PM',
    status: 'verified',
    blockchainHash: '0x8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d',
    verifiedAt: '2024-12-14 02:46 PM',
  },
  {
    id: 6,
    recordId: 'REC-4957-FH2I',
    type: 'Lab Report',
    patient: 'Emily Davis',
    patientId: 'HID-2M4F-89BB',
    submittedAt: '2024-12-13 11:00 AM',
    status: 'failed',
    blockchainHash: null,
    verifiedAt: null,
    errorMessage: 'Verification timeout - Please resubmit',
  },
]

export default function VerificationsPage() {
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredVerifications = mockVerifications.filter((verification) => {
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

  return (
    <DashboardLayout
      userName="Dr. Sarah Chen"
      userRole="Doctor"
      healthId="DOC-4K7B-89YZ"
      currentPage="/dashboard/doctor/verifications"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Blockchain Verifications</h1>
          <p className="text-muted-foreground mt-1">
            Track the blockchain verification status of your submitted records
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">
                  {mockVerifications.filter(v => v.status === 'verified').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Verified</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {mockVerifications.filter(v => v.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Pending</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">
                  {mockVerifications.filter(v => v.status === 'failed').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Failed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockVerifications.length}
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
                              Blockchain Transaction Hash:
                            </p>
                            <p className="text-xs font-mono text-muted-foreground break-all">
                              {verification.blockchainHash}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="flex-shrink-0">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {verification.status === 'failed' && verification.errorMessage && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm text-red-800">{verification.errorMessage}</p>
                            <Button 
                              size="sm" 
                              className="mt-2 bg-red-600 text-white hover:bg-red-700"
                            >
                              Retry Verification
                            </Button>
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

        {filteredVerifications.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No verifications found matching your filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
