'use client'

import Link from 'next/link'
import { Activity, Calendar, FileText, Lock, LogOut, Settings, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HealthIdBadge } from '@/components/auth/health-id-badge'
import { Separator } from '@/components/ui/separator'

export default function DashboardPage() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    healthId: 'HID-9F3A-21XX',
    role: 'Patient',
    verified: true,
  }

  const recentActivity = [
    {
      id: 1,
      title: 'Lab Results Uploaded',
      date: '2 days ago',
      type: 'document',
    },
    {
      id: 2,
      title: 'Appointment Scheduled',
      date: '5 days ago',
      type: 'appointment',
    },
    {
      id: 3,
      title: 'Prescription Updated',
      date: '1 week ago',
      type: 'prescription',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold">HealthSecure</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 max-w-6xl">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-balance">
              Welcome back, {user.name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your health records and appointments
            </p>
          </div>

          <HealthIdBadge healthId={user.healthId} verified={user.verified} />

          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Health Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Total documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Upcoming visits</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Current medications</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest health record updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium leading-none">{activity.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{activity.date}</p>
                          </div>
                        </div>
                      </div>
                      {index < recentActivity.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security & Verification</CardTitle>
                <CardDescription>Your account security status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">Identity Verified</p>
                      <p className="text-sm text-muted-foreground mt-1">Last verified today</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <Lock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium leading-none">Encrypted Records</p>
                      <p className="text-sm text-muted-foreground mt-1">All data secured</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg border bg-muted/50 p-4">
                  <div>
                    <p className="font-medium leading-none text-sm">Audit Log</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Track all access to your records
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Log
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your health information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Button variant="outline" className="h-auto flex-col items-start p-4 bg-transparent">
                  <FileText className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Upload Records</span>
                  <span className="text-xs text-muted-foreground">Add new documents</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 bg-transparent">
                  <Calendar className="h-5 w-5 mb-2" />
                  <span className="font-semibold">Book Appointment</span>
                  <span className="text-xs text-muted-foreground">Schedule a visit</span>
                </Button>
                <Button variant="outline" className="h-auto flex-col items-start p-4 bg-transparent">
                  <Activity className="h-5 w-5 mb-2" />
                  <span className="font-semibold">View History</span>
                  <span className="text-xs text-muted-foreground">See all records</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            <Lock className="inline h-3 w-3 mr-1" />
            Blockchain Secured • Your data is encrypted and protected
          </p>
        </div>
      </footer>
    </div>
  )
}
