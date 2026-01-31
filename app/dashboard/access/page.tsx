'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { AccessControlCard } from '@/components/dashboard/access-control-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck, UserPlus, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mockDoctorAccess = [
  {
    id: 1,
    doctorName: 'Sarah Chen',
    specialization: 'Cardiology',
    hospital: 'Central Medical Hospital',
    accessType: 'Full' as const,
    grantedDate: 'Jan 15, 2024'
  },
  {
    id: 2,
    doctorName: 'Michael Rodriguez',
    specialization: 'Internal Medicine',
    hospital: 'HealthCare Diagnostics',
    accessType: 'Full' as const,
    grantedDate: 'Mar 22, 2024'
  },
  {
    id: 3,
    doctorName: 'Emily Watson',
    specialization: 'Dermatology',
    hospital: 'Skin Health Clinic',
    accessType: 'Temporary' as const,
    grantedDate: 'Dec 10, 2024',
    expiresDate: 'Feb 10, 2025'
  },
  {
    id: 4,
    doctorName: 'David Kim',
    specialization: 'Radiology',
    hospital: 'Imaging Specialists',
    accessType: 'Temporary' as const,
    grantedDate: 'Nov 5, 2024',
    expiresDate: 'Jan 5, 2025'
  }
]

export default function AccessControlPage() {
  const [doctors, setDoctors] = useState(mockDoctorAccess)
  const [isGrantAccessOpen, setIsGrantAccessOpen] = useState(false)

  const handleRevoke = (id: number) => {
    setDoctors(doctors.filter(d => d.id !== id))
  }

  return (
    <DashboardLayout
      userName="John Anderson"
      userRole="Patient"
      healthId="HID-9F3A-21XX"
      currentPage="/dashboard/access"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Access Control</h2>
            <p className="text-muted-foreground mt-1">
              Manage who can view your medical records
            </p>
          </div>
          <Dialog open={isGrantAccessOpen} onOpenChange={setIsGrantAccessOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary text-primary-foreground">
                <UserPlus className="w-4 h-4 mr-2" />
                Grant Access
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Grant Access to Doctor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-id">Doctor Health ID</Label>
                  <Input
                    id="doctor-id"
                    placeholder="DOC-XXXX-XXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-type">Access Type</Label>
                  <Select>
                    <SelectTrigger id="access-type">
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Full Access</SelectItem>
                      <SelectItem value="temporary">Temporary (30 days)</SelectItem>
                      <SelectItem value="emergency">Emergency Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  className="w-full bg-primary text-primary-foreground"
                  onClick={() => setIsGrantAccessOpen(false)}
                >
                  Grant Access
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Emergency Access Status */}
        <Card className="border-amber-500/30 bg-amber-50/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground mb-1">Emergency Access Protocol</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Authorized medical professionals can access your records in emergency situations
                </p>
                <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Doctors with Access */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Authorized Healthcare Providers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {doctors.map((doctor) => (
                <AccessControlCard
                  key={doctor.id}
                  doctorName={doctor.doctorName}
                  specialization={doctor.specialization}
                  hospital={doctor.hospital}
                  accessType={doctor.accessType}
                  grantedDate={doctor.grantedDate}
                  expiresDate={doctor.expiresDate}
                  onRevoke={() => handleRevoke(doctor.id)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
