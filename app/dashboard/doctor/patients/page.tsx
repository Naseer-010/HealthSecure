'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Search, Eye, FileText, Clock, Mail, Phone } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const mockPatients = [
  {
    id: 'HID-9F3A-21XX',
    name: 'Jane Wilson',
    age: 34,
    gender: 'Female',
    lastVisit: 'Dec 18, 2024',
    condition: 'Hypertension',
    status: 'Active',
    email: 'jane.wilson@email.com',
    phone: '+1 (555) 123-4567',
    recordCount: 12
  },
  {
    id: 'HID-7B2C-45YY',
    name: 'Michael Thompson',
    age: 52,
    gender: 'Male',
    lastVisit: 'Dec 15, 2024',
    condition: 'Diabetes Type 2',
    status: 'Active',
    email: 'michael.t@email.com',
    phone: '+1 (555) 234-5678',
    recordCount: 28
  },
  {
    id: 'HID-3K8D-12ZZ',
    name: 'Sarah Martinez',
    age: 28,
    gender: 'Female',
    lastVisit: 'Dec 10, 2024',
    condition: 'Asthma',
    status: 'Active',
    email: 'sarah.m@email.com',
    phone: '+1 (555) 345-6789',
    recordCount: 8
  },
  {
    id: 'HID-5L9E-78AA',
    name: 'Robert Chen',
    age: 45,
    gender: 'Male',
    lastVisit: 'Nov 28, 2024',
    condition: 'Post-Surgery Follow-up',
    status: 'Follow-up',
    email: 'robert.chen@email.com',
    phone: '+1 (555) 456-7890',
    recordCount: 15
  },
  {
    id: 'HID-2M4F-89BB',
    name: 'Emily Davis',
    age: 39,
    gender: 'Female',
    lastVisit: 'Nov 20, 2024',
    condition: 'Cholesterol Management',
    status: 'Monitoring',
    email: 'emily.davis@email.com',
    phone: '+1 (555) 567-8901',
    recordCount: 19
  },
]

export default function MyPatientsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filteredPatients = mockPatients.filter((patient) => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || patient.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout
      userName="Dr. Sarah Chen"
      userRole="Doctor"
      healthId="DOC-4K7B-89YZ"
      currentPage="/dashboard/doctor/patients"
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Patients</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your patient records
          </p>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search by name or Health ID..."
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
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Monitoring">Monitoring</SelectItem>
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
                <p className="text-4xl font-bold text-primary">{mockPatients.length}</p>
                <p className="text-sm text-muted-foreground mt-1">Total Patients</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {mockPatients.filter(p => p.status === 'Active').length}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Active Cases</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">
                  {mockPatients.reduce((sum, p) => sum + p.recordCount, 0)}
                </p>
                <p className="text-sm text-muted-foreground mt-1">Total Records</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Patient List */}
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
                        <p className="text-sm text-muted-foreground">
                          {patient.gender}, {patient.age} years
                        </p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          patient.status === 'Active' 
                            ? 'border-green-500/30 text-green-700 bg-green-50'
                            : patient.status === 'Follow-up'
                            ? 'border-orange-500/30 text-orange-700 bg-orange-50'
                            : 'border-blue-500/30 text-blue-700 bg-blue-50'
                        }
                      >
                        {patient.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4" />
                        <span className="font-mono font-semibold text-foreground">{patient.id}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>Last visit: {patient.lastVisit}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{patient.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                    </div>

                    <div className="bg-accent/30 rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-medium text-foreground">Primary Condition:</span>{' '}
                        <span className="text-muted-foreground">{patient.condition}</span>
                      </p>
                      <p className="text-sm mt-1">
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
                      onClick={() => window.location.href = `/dashboard/doctor/add-record?patient=${patient.id}`}
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

        {filteredPatients.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No patients found matching your search.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
