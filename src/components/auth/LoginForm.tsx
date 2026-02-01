'use client'

import { useState, type FormEvent } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { LoginSchema } from '@/lib/validators/auth'
import { logger } from '@/lib/utils/logger'

export default function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    // VALIDATION ZOD
    const validation = LoginSchema.safeParse(formData)
    
    if (!validation.success) {
    const firstError = validation.error.errors[0]
    setError(firstError?.message || 'Validation failed')
    logger.info('❌ Validation failed:', firstError)
    return
  }

    setIsLoading(true)

    try {
      await login(validation.data)
      logger.info('✅ Login successful')
      router.push('/profile')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed'
      setError(errorMessage)
      logger.error('❌ Login error:', err)
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
      <h2 className="text-2xl font-bold text-center mb-8">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          required
          disabled={isLoading}
          autoComplete="email"
        />

        <Input
          label="Password"
          type="password"
          value={formData.password}
          onChange={handleChange('password')}
          required
          disabled={isLoading}
          autoComplete="current-password"
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          Log in
        </Button>
      </form>

      <p className="text-center mt-4 text-gray-600">
        Don&#39;t have an account?{' '}
        <Link href="/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  )
}