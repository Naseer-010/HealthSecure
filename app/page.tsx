'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Shield, Lock, Clock, Users, FileText, Activity, CheckCircle2, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LandingPage() {
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">HealthSecure</span>
          </div>
          <Button onClick={() => setLoginModalOpen(true)} size="lg">
            Login
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 lg:py-32">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-accent/50 text-sm">
            <CheckCircle2 className="h-4 w-4 text-primary" />
            <span>Blockchain secured medical records platform</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-balance leading-tight">
            Your Lifetime Health Records,
            <span className="text-primary"> Always Secure</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl text-balance leading-relaxed">
            Access your complete medical history anytime, anywhere. HealthSecure uses advanced digital identity technology to keep your health data safe and accessible only to you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/signup">Get Started - It's Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" onClick={() => setLoginModalOpen(true)}>
              Sign In
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-accent/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Choose HealthSecure?</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Built with the latest security technology to protect what matters most - your health information
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Bank-Level Security</CardTitle>
              <CardDescription className="leading-relaxed">
                Your health records are protected with military-grade encryption and blockchain technology
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Lifetime Access</CardTitle>
              <CardDescription className="leading-relaxed">
                Access your complete medical history from childhood to present, all in one secure place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Control Access</CardTitle>
              <CardDescription className="leading-relaxed">
                Grant or revoke doctor access to your records instantly. You're always in control
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Complete Records</CardTitle>
              <CardDescription className="leading-relaxed">
                Store lab results, prescriptions, diagnoses, and medical imaging all in one place
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Activity className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription className="leading-relaxed">
                See exactly who accessed your records and when with complete audit trails
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>HIPAA Compliant</CardTitle>
              <CardDescription className="leading-relaxed">
                Fully compliant with all healthcare privacy regulations and industry standards
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance">
            Get started with your secure health records in three simple steps
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              1
            </div>
            <h3 className="text-xl font-semibold">Create Your Health ID</h3>
            <p className="text-muted-foreground leading-relaxed">
              Sign up in minutes with your basic information. Your unique Health ID is generated instantly.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              2
            </div>
            <h3 className="text-xl font-semibold">Upload Your Records</h3>
            <p className="text-muted-foreground leading-relaxed">
              Add your existing medical records, or have your doctor upload them directly to your account.
            </p>
          </div>

          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold">Access Anywhere</h3>
            <p className="text-muted-foreground leading-relaxed">
              View your complete health history from any device, and share with doctors as needed.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 bg-accent/30">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-balance">Ready to Secure Your Health Records?</h2>
          <p className="text-xl text-muted-foreground text-balance leading-relaxed">
            Join thousands of patients and doctors who trust HealthSecure with their medical data.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/signup">
                Create Your Health ID
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Shield className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="font-bold">HealthSecure</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your lifetime health records, secured by blockchain technology.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground">Security</Link></li>
                <li><Link href="#" className="hover:text-foreground">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">About</Link></li>
                <li><Link href="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground">HIPAA</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2024 HealthSecure. All rights reserved. Blockchain Secured Platform.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <Dialog open={loginModalOpen} onOpenChange={setLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">Welcome Back</DialogTitle>
            <DialogDescription className="text-center">
              Select your account type to continue
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <Link href="/login?type=patient">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Patient Login</CardTitle>
                      <CardDescription>Access your health records</CardDescription>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>

            <Link href="/login?type=doctor">
              <Card className="cursor-pointer hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                      <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle>Doctor Login</CardTitle>
                      <CardDescription>Manage patient records</CardDescription>
                    </div>
                    <ArrowRight className="ml-auto h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
              </Card>
            </Link>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
