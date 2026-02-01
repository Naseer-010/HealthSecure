'use client'

import React from "react"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FileText,
  Clock,
  ShieldCheck,
  Activity,
  Settings,
  ShieldCheckIcon,
  User,
  LogOut
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useLanguage } from '@/lib/i18n/language-context'

const getPatientNavItems = (t: (key: string) => string) => [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/dashboard/patient' },
  { icon: FileText, labelKey: 'medicalRecords', href: '/dashboard/records' },
  { icon: Clock, labelKey: 'timeline', href: '/dashboard/timeline' },
  { icon: ShieldCheck, labelKey: 'accessControl', href: '/dashboard/access' },
  { icon: Activity, labelKey: 'activityLogs', href: '/dashboard/activity' },
  { icon: Settings, labelKey: 'settings', href: '/dashboard/settings' },
]

const getDoctorNavItems = (t: (key: string) => string) => [
  { icon: LayoutDashboard, labelKey: 'dashboard', href: '/dashboard/doctor' },
  { icon: User, labelKey: 'myPatients', href: '/dashboard/doctor/patients' },
  { icon: FileText, labelKey: 'addRecord', href: '/dashboard/doctor/add-record' },
  { icon: Clock, labelKey: 'recentActivity', href: '/dashboard/doctor/activity' },
  { icon: Activity, labelKey: 'accessControl', href: '/dashboard/doctor/access' },
  { icon: ShieldCheck, labelKey: 'verifications', href: '/dashboard/doctor/verifications' },
  { icon: Settings, labelKey: 'settings', href: '/dashboard/doctor/settings' },
]

interface DashboardLayoutProps {
  children: React.ReactNode
  userName: string
  userRole: 'Patient' | 'Doctor'
  healthId: string
  currentPage?: string
}

export function DashboardLayout({
  children,
  userName,
  userRole,
  healthId,
  currentPage = '/dashboard'
}: DashboardLayoutProps) {
  const [activePage, setActivePage] = useState(currentPage)
  const { t } = useLanguage()
  const navItemsConfig = userRole === 'Doctor' ? getDoctorNavItems(t) : getPatientNavItems(t)
  const navItems = navItemsConfig.map(item => ({
    ...item,
    label: t(item.labelKey as any)
  }))

  const handleLogout = () => {
    // Clear any session data
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
    }
    // Redirect to landing page
    window.location.href = '/'
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-6 border-b border-border">
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => window.location.href = '/'}
            title="Go to Home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheckIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">HealthSecure</h1>
              <p className="text-xs text-muted-foreground">Lifetime Records</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item, index) => {
            const Icon = item.icon
            const isActive = activePage === item.href
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05, ease: 'easeOut' }}
              >
                <Button
                  variant={isActive ? 'default' : 'ghost'}
                  className={cn(
                    'w-full justify-start gap-3 transition-all duration-200',
                    isActive && 'bg-primary text-primary-foreground'
                  )}
                  onClick={() => {
                    setActivePage(item.href)
                    window.location.href = item.href
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  {item.label}
                </Button>
              </motion.div>
            )
          })}
        </nav>

        <div className="p-4 border-t border-border space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start gap-3 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive bg-transparent"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" />
            {t('logout')}
          </Button>
          <div className="text-xs text-muted-foreground text-center">
            <ShieldCheckIcon className="w-3 h-3 inline mr-1" />
            {t('blockchainSecured')}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-foreground">
              {navItems.find(item => item.href === activePage)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/50 border border-primary/20">
              <ShieldCheckIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">{healthId}</span>
              <Badge variant="outline" className="text-xs border-primary/30 text-primary">{t('verified')}</Badge>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-foreground">{userName}</p>
                <Badge
                  variant="secondary"
                  className={cn(
                    'text-xs',
                    userRole === 'Doctor' && 'bg-primary/10 text-primary border-primary/20'
                  )}
                >
                  {t(userRole === 'Doctor' ? 'doctor' : 'patient')}
                </Badge>
              </div>
              <Avatar className="w-9 h-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {userName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
