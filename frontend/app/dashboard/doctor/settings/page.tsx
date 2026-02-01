'use client'

import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Shield, Bell, Lock, User, Mail, Phone, Briefcase, GraduationCap, FileCheck, Calendar, Globe, Loader2 } from 'lucide-react'
import { useLanguage } from '@/lib/i18n/language-context'
import { languages, type Language } from '@/lib/i18n/translations'
import { useAuth } from '@/hooks/useAuth'
import { DoctorProfile } from '@/lib/api'

export default function DoctorSettingsPage() {
  const { language, setLanguage, t } = useLanguage()
  const { isLoading, user, profile } = useAuth('DOCTOR')
  const doctorProfile = profile as DoctorProfile | null

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  const userName = doctorProfile
    ? `Dr. ${doctorProfile.first_name} ${doctorProfile.last_name}`
    : user?.name || 'Doctor'
  const healthId = doctorProfile?.doctor_id || user?.doctor_id || 'N/A'
  const firstName = doctorProfile?.first_name || ''
  const lastName = doctorProfile?.last_name || ''
  const email = doctorProfile?.email || user?.email || ''
  const phone = doctorProfile?.phone || ''
  const medicalLicense = doctorProfile?.medical_license || ''
  const hospital = doctorProfile?.hospital || ''

  return (
    <DashboardLayout
      userName={userName}
      userRole="Doctor"
      healthId={healthId}
      currentPage="/dashboard/doctor/settings"
    >
      <div className="space-y-6 max-w-4xl">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Doctor Settings</h2>
          <p className="text-muted-foreground mt-1">
            Manage your professional profile and preferences
          </p>
        </div>

        {/* Language Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <CardTitle>{t('languagePreferences')}</CardTitle>
            </div>
            <CardDescription>{t('choosePreferredLanguage')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="language">{t('language')}</Label>
              <Select value={language} onValueChange={(value) => setLanguage(value as Language)}>
                <SelectTrigger id="language">
                  <SelectValue placeholder={t('selectLanguage')} />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(languages) as Language[]).map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {languages[lang].nativeName} ({languages[lang].name})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <CardTitle>Professional Information</CardTitle>
            </div>
            <CardDescription>Update your medical credentials and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first-name">First Name</Label>
                <Input id="first-name" defaultValue={firstName} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last-name">Last Name</Label>
                <Input id="last-name" defaultValue={lastName} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="license">Medical License Number</Label>
              <div className="relative">
                <FileCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="license" className="pl-10" defaultValue={medicalLicense} disabled />
              </div>
              <p className="text-xs text-muted-foreground">Contact support to update license number</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              <Select defaultValue="cardiology">
                <SelectTrigger id="specialization">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="orthopedics">Orthopedics</SelectItem>
                  <SelectItem value="pediatrics">Pediatrics</SelectItem>
                  <SelectItem value="general">General Practice</SelectItem>
                  <SelectItem value="surgery">Surgery</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">Highest Qualification</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="qualification" className="pl-10" defaultValue="MD, FACC" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" defaultValue="15" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital">Hospital/Clinic Affiliation</Label>
              <Input id="hospital" defaultValue={hospital} />
            </div>

            <Button className="bg-primary text-primary-foreground">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle>Contact Information</CardTitle>
            </div>
            <CardDescription>Update your contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" type="email" className="pl-10" defaultValue={email} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" type="tel" className="pl-10" defaultValue={phone} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                rows={4}
                defaultValue="Board-certified cardiologist with 15 years of experience in cardiovascular care and interventional procedures."
                className="resize-none"
              />
            </div>

            <Button className="bg-primary text-primary-foreground">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Consultation Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle>Consultation Preferences</CardTitle>
            </div>
            <CardDescription>Configure your consultation availability</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Accept New Patients</p>
                <p className="text-sm text-muted-foreground">Allow new patient registrations</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Emergency Consultations</p>
                <p className="text-sm text-muted-foreground">Available for urgent cases</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Telemedicine</p>
                <p className="text-sm text-muted-foreground">Offer virtual consultations</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="consultation-time">Average Consultation Time</Label>
              <Select defaultValue="30">
                <SelectTrigger id="consultation-time">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Manage your security preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Biometric Authentication</p>
                  <p className="text-sm text-muted-foreground">Use fingerprint or face ID</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Auto-Logout</p>
                  <p className="text-sm text-muted-foreground">Logout after 15 minutes of inactivity</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div>
                <p className="font-medium text-foreground mb-3">Change Password</p>
                <div className="space-y-3">
                  <Input type="password" placeholder="Current password" />
                  <Input type="password" placeholder="New password" />
                  <Input type="password" placeholder="Confirm new password" />
                  <Button variant="outline">Update Password</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy & Data Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <CardTitle>Privacy & Data</CardTitle>
            </div>
            <CardDescription>Control your data and privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Activity Logging</p>
                <p className="text-sm text-muted-foreground">Track all your actions and record access</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Record Encryption</p>
                <p className="text-sm text-muted-foreground">End-to-end encryption for all records</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Anonymous Statistics</p>
                <p className="text-sm text-muted-foreground">Contribute to medical research anonymously</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Choose what notifications you receive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">New Patient Registration</p>
                <p className="text-sm text-muted-foreground">When a patient grants you access</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Record Verification Requests</p>
                <p className="text-sm text-muted-foreground">When verification is needed</p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">System Updates</p>
                <p className="text-sm text-muted-foreground">Platform updates and new features</p>
              </div>
              <Switch />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="font-medium text-foreground">Patient Messages</p>
                <p className="text-sm text-muted-foreground">Messages from your patients</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
