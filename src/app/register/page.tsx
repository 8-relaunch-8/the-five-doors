'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import RegisterForm from '@/components/auth/RegisterForm'
import { useEffect, useRef } from 'react'

export default function RegisterPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const initialAuthState = useRef(isAuthenticated)

  // Only redirect if user was ALREADY authenticated on page load
  useEffect(() => {
    if (!isLoading && isAuthenticated && initialAuthState.current) {
      router.replace('/')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  return <RegisterForm />
}