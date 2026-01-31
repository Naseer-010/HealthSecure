'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { StatCard } from '@/components/dashboard/stat-card'
import { MedicalRecordCard } from '@/components/dashboard/medical-record-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Users, Calendar, EyeOff, ShieldCheck } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// Mock data
const mockRecords = [
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
  }
]

export default function PatientDashboard() {
  const [records, setRecords] = useState(mockRecords)

  const handleToggleVisibility = (id: number) => {
    setRecords(records.map(record => 
      record.id === id ? { ...record, isVisible: !record.isVisible } : record
    ))
  }

  const visibleRecords = records.filter(r => r.isVisible).length
  const hiddenRecords = records.filter(r => !r.isVisible).length

  return (
    <DashboardLayout
      userName="John Anderson"
      userRole="Patient"
      healthId="HID-9F3A-21XX"
      currentPage="/dashboard"
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
                    Welcome back, John Anderson
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    Your health records are secure and up to date
                  </p>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-4 py-2 rounded-lg inline-flex">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">HID-9F3A-21XX</span>
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
            value={12}
            icon={Users}
            description="Authorized healthcare providers"
          />
          <StatCard
            title="Last Visit"
            value="Dec 18"
            icon={Calendar}
            description="2024"
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {records.map((record, index) => (
                  <motion.div
                    key={record.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: 0.4 + index * 0.1, ease: 'easeOut' }}
                  >
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
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
