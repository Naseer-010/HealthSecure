'use client'

import React from "react"

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Lock, Mail, Phone, Shield, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OTPInput } from '@/components/auth/otp-input'

function LoginPageContent() {
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'patient'
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [medicalLicense, setMedicalLicense] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate authentication - in production this would validate credentials
    // Redirect based on user type
    if (userType === 'doctor') {
      window.location.href = '/dashboard/doctor'
    } else {
      window.location.href = '/dashboard/patient'
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-balance">HealthSecure</h1>
          <p className="text-muted-foreground text-balance">
            {userType === 'doctor' 
              ? 'Doctor portal - Access patient records securely' 
              : 'Your medical records are protected by secure digital identity'}
          </p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              {userType === 'doctor' ? 'Doctor Login' : 'Patient Login'}
            </CardTitle>
            <CardDescription className="text-center">
              {userType === 'doctor' 
                ? 'Sign in with your medical credentials' 
                : 'Sign in to access your lifetime health history'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {userType === 'doctor' ? (
                // Doctor Login Form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="license">Medical License Number</Label>
                    <Input
                      id="license"
                      type="text"
                      placeholder="Enter your medical license number"
                      value={medicalLicense}
                      onChange={(e) => setMedicalLicense(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-email">Email Address</Label>
                    <Input
                      id="doctor-email"
                      type="email"
                      placeholder="doctor@hospital.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="doctor-password">Password</Label>
                    <Input
                      id="doctor-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Link
                    href="/forgot-password"
                    className="text-sm text-primary hover:underline block text-right"
                  >
                    Forgot password?
                  </Link>
                </>
              ) : (
                // Patient Login Form
                <>
                  <Tabs defaultValue="email" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="email">
                        <Mail className="mr-2 h-4 w-4" />
                        Email
                      </TabsTrigger>
                      <TabsTrigger value="phone">
                        <Phone className="mr-2 h-4 w-4" />
                        Phone
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="email" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="phone" className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          required
                        />
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="space-y-4">
                    <Tabs
                      value={loginMethod}
                      onValueChange={(value) => setLoginMethod(value as 'password' | 'otp')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="password">
                          <Lock className="mr-2 h-4 w-4" />
                          Password
                        </TabsTrigger>
                        <TabsTrigger value="otp">
                          <Shield className="mr-2 h-4 w-4" />
                          OTP
                        </TabsTrigger>
                      </TabsList>
                      <TabsContent value="password" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="password">Password</Label>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                        <Link
                          href="/forgot-password"
                          className="text-sm text-primary hover:underline block text-right"
                        >
                          Forgot password?
                        </Link>
                      </TabsContent>
                      <TabsContent value="otp" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label>Enter 6-digit OTP</Label>
                          <OTPInput value={otp} onChange={setOtp} />
                          <p className="text-xs text-muted-foreground text-center">
                            We'll send a verification code to your email or phone
                          </p>
                        </div>
                        <Button type="button" variant="outline" className="w-full bg-transparent">
                          Send OTP
                        </Button>
                      </TabsContent>
                    </Tabs>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full" size="lg">
                {userType === 'doctor' ? 'Login to Doctor Portal' : 'Login with Secure Health ID'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  {userType === 'doctor' ? 'Not registered as a doctor? ' : 'Don\'t have a Health ID? '}
                </span>
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  {userType === 'doctor' ? 'Register Now' : 'Create New Health ID'}
                </Link>
              </div>

              <div className="text-center">
                <Link 
                  href={userType === 'doctor' ? '/login?type=patient' : '/login?type=doctor'} 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Switch to {userType === 'doctor' ? 'Patient' : 'Doctor'} Login
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          <Lock className="inline h-3 w-3 mr-1" />
          Blockchain Secured
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  )
}
