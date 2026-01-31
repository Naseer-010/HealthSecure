'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { MedicalTimeline } from '@/components/dashboard/medical-timeline'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, ShieldCheck, FileUp, Award } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const mockPatientHistory = [
  {
    date: 'Dec 18, 2024',
    recordType: 'Annual Physical Examination',
    doctor: 'Sarah Chen',
    hospital: 'Central Medical Hospital',
    verified: true
  },
  {
    date: 'Nov 25, 2024',
    recordType: 'Blood Test - Complete Panel',
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
  }
]

export default function DoctorDashboard() {
  const [searchId, setSearchId] = useState('')
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null)
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false)

  const handleSearch = () => {
    if (searchId) {
      setSelectedPatient('Jane Wilson')
    }
  }

  return (
    <DashboardLayout
      userName="Dr. Sarah Chen"
      userRole="Doctor"
      healthId="DOC-4K7B-89YZ"
      currentPage="/dashboard"
    >
      <div className="space-y-6">
        {/* Doctor Profile Section */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Avatar className="w-20 h-20 border-4 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl font-semibold">
                  SC
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-foreground mb-1">Dr. Sarah Chen</h2>
                <p className="text-muted-foreground mb-3">Cardiology Specialist</p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1.5 rounded-lg">
                    <Award className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">License: MD-2024-8821</span>
                  </div>
                  <div className="flex items-center gap-2 bg-background/60 backdrop-blur px-3 py-1.5 rounded-lg">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                    <span className="font-mono text-sm font-semibold text-foreground">DOC-4K7B-89YZ</span>
                    <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                      Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Patient Search */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Search Patient</CardTitle>
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
              <Button onClick={handleSearch} className="bg-primary text-primary-foreground">
                Search Patient
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Patient Details - Shown after search */}
        {selectedPatient && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Patient Summary</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Read-only access to verified records</p>
                </div>
                <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary text-primary-foreground">
                      <FileUp className="w-4 h-4 mr-2" />
                      Add New Record
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Medical Record</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="record-type">Record Type</Label>
                        <Select>
                          <SelectTrigger id="record-type">
                            <SelectValue placeholder="Select record type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prescription">Prescription</SelectItem>
                            <SelectItem value="lab">Lab Report</SelectItem>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="imaging">Imaging Report</SelectItem>
                            <SelectItem value="procedure">Procedure Notes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="diagnosis">Diagnosis / Notes</Label>
                        <Textarea
                          id="diagnosis"
                          placeholder="Enter diagnosis or medical notes..."
                          rows={4}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="document">Upload Document</Label>
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                          <FileUp className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            PDF, JPG, PNG up to 10MB
                          </p>
                        </div>
                      </div>

                      <Button 
                        className="w-full bg-primary text-primary-foreground"
                        onClick={() => setIsAddRecordOpen(false)}
                      >
                        Submit Record
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="bg-accent/30 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-16 h-16 border-2 border-primary/20">
                      <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                        JW
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{selectedPatient}</h3>
                      <p className="text-sm text-muted-foreground">Female, 34 years</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-mono text-sm font-semibold text-foreground">HID-9F3A-21XX</span>
                        <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                          <ShieldCheck className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-4">Medical History Timeline</h4>
                  <MedicalTimeline events={mockPatientHistory} />
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
