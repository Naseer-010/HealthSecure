'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FileText, UserPlus, Edit, Eye, Clock, ShieldCheck } from 'lucide-react'

const mockActivities = [
  {
    id: 1,
    type: 'record_added',
    icon: FileText,
    title: 'Added Lab Report',
    patient: 'Jane Wilson',
    patientId: 'HID-9F3A-21XX',
    description: 'Complete Blood Count - All values within normal range',
    timestamp: '2024-12-18 10:30 AM',
    status: 'verified',
  },
  {
    id: 2,
    type: 'record_updated',
    icon: Edit,
    title: 'Updated Prescription',
    patient: 'Michael Thompson',
    patientId: 'HID-7B2C-45YY',
    description: 'Modified dosage for Metformin 500mg',
    timestamp: '2024-12-18 09:15 AM',
    status: 'verified',
  },
  {
    id: 3,
    type: 'patient_viewed',
    icon: Eye,
    title: 'Viewed Medical History',
    patient: 'Sarah Martinez',
    patientId: 'HID-3K8D-12ZZ',
    description: 'Accessed complete medical timeline',
    timestamp: '2024-12-17 04:45 PM',
    status: 'completed',
  },
  {
    id: 4,
    type: 'record_added',
    icon: FileText,
    title: 'Added Diagnosis',
    patient: 'Robert Chen',
    patientId: 'HID-5L9E-78AA',
    description: 'Post-operative follow-up - Recovery progressing well',
    timestamp: '2024-12-17 02:20 PM',
    status: 'verified',
  },
  {
    id: 5,
    type: 'patient_access',
    icon: UserPlus,
    title: 'Granted Access',
    patient: 'Emily Davis',
    patientId: 'HID-2M4F-89BB',
    description: 'Patient granted access to medical records',
    timestamp: '2024-12-16 11:30 AM',
    status: 'completed',
  },
  {
    id: 6,
    type: 'record_added',
    icon: FileText,
    title: 'Added Imaging Report',
    patient: 'Jane Wilson',
    patientId: 'HID-9F3A-21XX',
    description: 'Chest X-Ray - No abnormalities detected',
    timestamp: '2024-12-15 03:15 PM',
    status: 'verified',
  },
  {
    id: 7,
    type: 'patient_viewed',
    icon: Eye,
    title: 'Viewed Patient Record',
    patient: 'Michael Thompson',
    patientId: 'HID-7B2C-45YY',
    description: 'Reviewed recent lab results',
    timestamp: '2024-12-15 10:00 AM',
    status: 'completed',
  },
  {
    id: 8,
    type: 'record_added',
    icon: FileText,
    title: 'Added Consultation Notes',
    patient: 'Sarah Martinez',
    patientId: 'HID-3K8D-12ZZ',
    description: 'Annual check-up completed',
    timestamp: '2024-12-14 02:45 PM',
    status: 'verified',
  },
]

export default function DoctorActivityPage() {
  const [filterType, setFilterType] = useState('all')
  const [filterTime, setFilterTime] = useState('all')

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesType = filterType === 'all' || activity.type === filterType
    return matchesType
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'record_added':
        return FileText
      case 'record_updated':
        return Edit
      case 'patient_viewed':
        return Eye
      case 'patient_access':
        return UserPlus
      default:
        return FileText
    }
  }

  return (
    <DashboardLayout
      userName="Dr. Sarah Chen"
      userRole="Doctor"
      healthId="DOC-4K7B-89YZ"
      currentPage="/dashboard/doctor/activity"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Recent Activity</h1>
          <p className="text-muted-foreground mt-1">
            Track your recent actions and patient interactions
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockActivities.filter(a => a.type === 'record_added').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Records Added</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockActivities.filter(a => a.type === 'patient_viewed').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Records Viewed</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockActivities.filter(a => a.type === 'record_updated').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Records Updated</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {mockActivities.filter(a => a.status === 'verified').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Verified</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[250px]">
                  <SelectValue placeholder="Filter by activity type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="record_added">Records Added</SelectItem>
                  <SelectItem value="record_updated">Records Updated</SelectItem>
                  <SelectItem value="patient_viewed">Records Viewed</SelectItem>
                  <SelectItem value="patient_access">Access Granted</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterTime} onValueChange={setFilterTime}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Filter by time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activity Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      {index < filteredActivities.length - 1 && (
                        <div className="absolute left-1/2 top-10 bottom-0 w-0.5 bg-border -translate-x-1/2 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{activity.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                                {activity.patient.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">{activity.patient}</span>
                            <span className="text-sm text-muted-foreground font-mono">
                              {activity.patientId}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {activity.status === 'verified' && (
                            <Badge variant="outline" className="border-green-500/30 text-green-700 bg-green-50">
                              <ShieldCheck className="w-3 h-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          <div className="flex items-center gap-1 text-sm text-muted-foreground whitespace-nowrap">
                            <Clock className="w-4 h-4" />
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
