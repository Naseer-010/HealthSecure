'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Shield, Stethoscope, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RoleSelectionCard } from '@/components/auth/role-selection-card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { registerPatient, registerDoctor, loginUser } from '@/lib/api'

type Role = 'patient' | 'doctor' | null

export default function SignupPage() {
  const [step, setStep] = useState<'role' | 'details'>('role')
  const [role, setRole] = useState<Role>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Form fields
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [age, setAge] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [medicalLicense, setMedicalLicense] = useState('')
  const [hospital, setHospital] = useState('')

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole)
    setStep('details')
  }

  const handleBack = () => {
    setStep('role')
    setRole(null)
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (role === 'patient') {
        await registerPatient({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          age: age ? parseInt(age) : undefined,
          phone,
        })
      } else if (role === 'doctor') {
        await registerDoctor({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          medical_license: medicalLicense,
          specialization,
          hospital,
          phone,
        })
      }

      // Auto-login after successful registration
      await loginUser(email, password)

      // Redirect to appropriate dashboard
      window.location.href = role === 'patient' ? '/dashboard/patient' : '/dashboard/doctor'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl space-y-6">
        {step === 'details' && (
          <Button variant="ghost" onClick={handleBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to role selection
          </Button>
        )}

        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">Create Your Health ID</h1>
          <p className="text-muted-foreground text-balance">
            Access your lifetime health history safely
          </p>
        </div>

        {step === 'role' ? (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">Select Your Role</CardTitle>
              <CardDescription className="text-center">
                Choose how you'll be using HealthSecure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RoleSelectionCard
                title="Patient"
                description="Access and manage your personal health records"
                icon={User}
                onClick={() => handleRoleSelect('patient')}
              />
              <RoleSelectionCard
                title="Doctor"
                description="View patient records and provide care"
                icon={Stethoscope}
                onClick={() => handleRoleSelect('doctor')}
              />

              <div className="text-center text-sm pt-2">
                <span className="text-muted-foreground">Already have a Health ID? </span>
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center">
                {role === 'patient' ? 'Patient Registration' : 'Doctor Registration'}
              </CardTitle>
              <CardDescription className="text-center">
                Complete your profile to create your Secure Health ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {role === 'patient' ? (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="John" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Doe" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="age">Age</Label>
                      <Input id="age" type="number" placeholder="30" value={age} onChange={(e) => setAge(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="john.doe@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Jane" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Smith" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input id="specialization" placeholder="Cardiology" required value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Medical License ID</Label>
                      <Input id="license" placeholder="ML-123456" required value={medicalLicense} onChange={(e) => setMedicalLicense(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hospital">Hospital / Clinic Name</Label>
                      <Input id="hospital" placeholder="City General Hospital" required value={hospital} onChange={(e) => setHospital(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="dr.smith@hospital.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Create Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                  </>
                )}

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your identity will be securely verified before access is granted. This process
                    ensures the safety of all health records.
                  </AlertDescription>
                </Alert>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Secure Health ID'
                  )}
                </Button>

                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Already have a Health ID? </span>
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign In
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground">
          <Lock className="inline h-3 w-3 mr-1" />
          Blockchain Secured
        </p>
      </div>
    </div>
  )
}
