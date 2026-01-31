'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalTimeline } from '@/components/dashboard/medical-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Calendar } from 'lucide-react'

const mockTimelineEvents = [
  {
    date: 'Dec 18, 2024',
    recordType: 'Annual Physical Examination',
    doctor: 'Sarah Chen',
    hospital: 'Central Medical Hospital',
    verified: true
  },
  {
    date: 'Nov 25, 2024',
    recordType: 'Blood Test - Complete Metabolic Panel',
    doctor: 'Michael Rodriguez',
    hospital: 'HealthCare Diagnostics',
    verified: true
  },
  {
    date: 'Oct 12, 2024',
    recordType: 'Cardiology Consultation',
    doctor: 'Emily Watson',
    hospital: 'Heart & Vascular Institute',
    verified: true
  },
  {
    date: 'Sep 8, 2024',
    recordType: 'Chest X-Ray',
    doctor: 'David Kim',
    hospital: 'Imaging Specialists',
    verified: true
  },
  {
    date: 'Jul 22, 2024',
    recordType: 'Dental Examination',
    doctor: 'Lisa Patel',
    hospital: 'Smile Dental Clinic',
    verified: true
  },
  {
    date: 'May 15, 2024',
    recordType: 'Vision Test',
    doctor: 'Robert Chang',
    hospital: 'EyeCare Center',
    verified: true
  },
  {
    date: 'Mar 3, 2024',
    recordType: 'Allergy Test Panel',
    doctor: 'Amanda Foster',
    hospital: 'Allergy & Immunology Clinic',
    verified: true
  },
  {
    date: 'Jan 18, 2024',
    recordType: 'Annual Vaccination',
    doctor: 'Sarah Chen',
    hospital: 'Central Medical Hospital',
    verified: true
  }
]

export default function TimelinePage() {
  return (
    <DashboardLayout
      userName="John Anderson"
      userRole="Patient"
      healthId="HID-9F3A-21XX"
      currentPage="/dashboard/timeline"
    >
      <div className="space-y-6">
        <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">
                  Your Medical Timeline
                </h2>
                <p className="text-muted-foreground">
                  A complete chronological view of your lifelong medical history
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary">{mockTimelineEvents.length} Records</Badge>
                  <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                    All Verified
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Medical History</CardTitle>
          </CardHeader>
          <CardContent>
            <MedicalTimeline events={mockTimelineEvents} />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
