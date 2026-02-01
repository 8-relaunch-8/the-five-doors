'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { RegisterSchema } from '@/lib/validators/auth'
import { logger } from '@/lib/utils/logger'

export default function RegisterForm() {
  const { register } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // ✅ VALIDATION ZOD
    const validation = RegisterSchema.safeParse(formData)

    if (!validation.success) {
      const firstError = validation.error.errors[0]
      setError(firstError?.message || 'Validation failed')
      logger.info('❌ Validation failed:', firstError)
      return
    }

    setIsLoading(true)

    try {
      const { confirmPassword, ...registerData } = validation.data
      await register(registerData)
      logger.info('✅ Registration successful')
      router.push('/')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      setError(errorMessage)
      logger.error('❌ Registration error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (error) setError('')
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Create an Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label 
              htmlFor="firstName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name
            </label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange('firstName')}
              placeholder="John"
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum 2 characters
            </p>
          </div>

          <div>
            <label 
              htmlFor="lastName" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name
            </label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange('lastName')}
              placeholder="Doe"
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Minimum 2 characters
            </p>
          </div>

          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="john.doe@example.com"
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              We&#39;ll never share your email with anyone else
            </p>
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleChange('password')}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Must contain uppercase, lowercase, and number (min 8 chars)
            </p>
          </div>

          <div>
            <label 
              htmlFor="confirmPassword" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Re-enter your password
            </p>
          </div>

          {error && (
            <div 
              className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md"
              role="alert"
            >
              <strong className="font-medium">Error:</strong> {error}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full" 
            isLoading={isLoading}
            disabled={isLoading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link 
              href="/login" 
              className="font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}