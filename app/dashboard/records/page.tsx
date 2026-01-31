'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalRecordCard } from '@/components/dashboard/medical-record-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const allRecords = [
  {
    id: 1,
    recordType: 'Prescription',
    doctorName: 'Sarah Chen',
    hospital: 'Central Medical Hospital',
    date: 'Dec 18, 2024',
    isVisible: true
  },
  {
    id: 2,
    recordType: 'Lab Report - Blood Test',
    doctorName: 'Michael Rodriguez',
    hospital: 'HealthCare Diagnostics',
    date: 'Nov 25, 2024',
    isVisible: true
  },
  {
    id: 3,
    recordType: 'Diagnosis - Annual Checkup',
    doctorName: 'Emily Watson',
    hospital: 'Wellness Medical Center',
    date: 'Oct 12, 2024',
    isVisible: false
  },
  {
    id: 4,
    recordType: 'X-Ray Report',
    doctorName: 'David Kim',
    hospital: 'Imaging Specialists',
    date: 'Sep 8, 2024',
    isVisible: true
  },
  {
    id: 5,
    recordType: 'Dental Examination',
    doctorName: 'Lisa Patel',
    hospital: 'Smile Dental Clinic',
    date: 'Jul 22, 2024',
    isVisible: true
  },
  {
    id: 6,
    recordType: 'Vision Test',
    doctorName: 'Robert Chang',
    hospital: 'EyeCare Center',
    date: 'May 15, 2024',
    isVisible: false
  },
  {
    id: 7,
    recordType: 'Allergy Test Panel',
    doctorName: 'Amanda Foster',
    hospital: 'Allergy & Immunology Clinic',
    date: 'Mar 3, 2024',
    isVisible: true
  },
  {
    id: 8,
    recordType: 'Cardiology Consultation',
    doctorName: 'Emily Watson',
    hospital: 'Heart & Vascular Institute',
    date: 'Jan 18, 2024',
    isVisible: true
  }
]

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState(allRecords)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')

  const handleToggleVisibility = (id: number) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, isVisible: !record.isVisible } : record
    ))
  }

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.recordType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'visible' && record.isVisible) ||
      (filterType === 'hidden' && !record.isVisible)

    return matchesSearch && matchesFilter
  })

  return (
    <DashboardLayout
      userName="John Anderson"
      userRole="Patient"
      healthId="HID-9F3A-21XX"
      currentPage="/dashboard/records"
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Medical Records</h2>
          <p className="text-muted-foreground mt-1">
            View and manage all your medical records
          </p>
        </div>

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
                <p className="text-muted-foreground">No records found matching your criteria</p>
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
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredRecords.map((record) => (
                  <MedicalRecordCard
                    key={record.id}
                    recordType={record.recordType}
                    doctorName={record.doctorName}
                    hospital={record.hospital}
                    date={record.date}
                    isVisible={record.isVisible}
                    onToggleVisibility={() => handleToggleVisibility(record.id)}
                    onView={() => console.log('View record:', record.id)}
                    onDownload={() => console.log('Download record:', record.id)}
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
