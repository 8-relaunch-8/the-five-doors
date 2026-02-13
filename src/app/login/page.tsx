'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/auth/LoginForm'
import { useEffect, useRef } from 'react'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const initialAuthState = useRef(isAuthenticated)

  // Only redirect if user was ALREADY authenticated on page load
  // Don't redirect if they just logged in (handled by LoginForm)
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

  return <LoginForm />
}