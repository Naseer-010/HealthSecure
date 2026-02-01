'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    getUser,
    getProfile,
    isAuthenticated,
    logout,
    UserInfo,
    PatientProfile,
    DoctorProfile
} from '@/lib/api'

interface AuthState {
    isLoading: boolean
    isAuthenticated: boolean
    user: UserInfo | null
    profile: PatientProfile | DoctorProfile | null
    error: string | null
}

export function useAuth(requiredRole?: 'PATIENT' | 'DOCTOR') {
    const router = useRouter()
    const [state, setState] = useState<AuthState>({
        isLoading: true,
        isAuthenticated: false,
        user: null,
        profile: null,
        error: null
    })

    useEffect(() => {
        async function checkAuth() {
            // Check if we have a token
            if (!isAuthenticated()) {
                router.push('/login')
                return
            }

            // Get cached user info
            const cachedUser = getUser()
            if (!cachedUser) {
                router.push('/login')
                return
            }

            // Check role requirement
            if (requiredRole && cachedUser.role !== requiredRole) {
                const redirectPath = cachedUser.role === 'DOCTOR'
                    ? '/dashboard/doctor'
                    : '/dashboard/patient'
                router.push(redirectPath)
                return
            }

            try {
                // Fetch fresh profile data
                const profileData = await getProfile()

                setState({
                    isLoading: false,
                    isAuthenticated: true,
                    user: cachedUser,
                    profile: profileData.profile,
                    error: null
                })
            } catch (error) {
                console.error('Failed to fetch profile:', error)
                // Token might be expired, redirect to login
                logout()
            }
        }

        checkAuth()
    }, [router, requiredRole])

    return {
        ...state,
        logout
    }
}
