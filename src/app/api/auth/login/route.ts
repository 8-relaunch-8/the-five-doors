import { NextRequest, NextResponse } from 'next/server'
import { LoginSchema } from '@/lib/validators/auth'
import { AuthService } from '@/lib/services/auth.service'
import { JWTService } from '@/lib/services/jwt.service'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = LoginSchema.parse(body)

    const user = await AuthService.loginUser(validatedData)

    const { accessToken, refreshToken } = JWTService.generateTokenPair(
      user.id,
      user.email,
      user.role
    )

    const userResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
    }

    const response = NextResponse.json(
      {
        success: true,
        message: 'Connection successful',
        user: userResponse,
      },
      { status: 200 }
    )

    const isProduction = process.env.NODE_ENV === 'production'

    response.cookies.set('accessToken', accessToken, {
      httpOnly: true,           // JavaScript can't access (XSS protection)
      secure: isProduction,     // HTTPS only in production
      sameSite: 'strict',       // CSRF protection
      maxAge: 60 * 15,          // 15 min in seconds
      path: '/',                // available on all site
    })

    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)

    // Validation errors
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          errors: error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    // Invalid credentials
    if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Unknown errors
    return NextResponse.json(
      { error: 'Error during login' },
      { status: 500 }
    )
  }
}