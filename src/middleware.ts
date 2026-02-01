import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { logger } from '@/lib/utils/logger'

/**
 * Next.js Middleware - Route Protection
 * 
 * Executes BEFORE each request to:
 * - Verify authentication
 * - Redirect if necessary
 * - Control permissions (ADMIN, STAFF, VISITOR)
 */

const publicRoutes = [
  '/',
  '/login',
  '/register',
  '/exhibitions',
  '/about',
]

const protectedRoutes = [
  '/profile',
  '/bookings',
]

const adminRoutes = [
  '/admin',
]

const authRoutes = ['/login', '/register']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  logger.info(`[Middleware] ${request.method} ${pathname}`)

  const token = request.cookies.get('refreshToken')?.value

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

  // No token → allow public/auth routes, block protected
  if (!token) {
    if (isProtectedRoute || isAdminRoute) {
      logger.info(`[Middleware] ❌ No token, redirecting to /login`)
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  // Token exists → verify it
  try {
    const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    const userRole = payload.role as string

    logger.info(`[Middleware] ✅ Token valid, user role: ${userRole}`)

    // Authenticated user on auth pages → redirect to home
    if (isAuthRoute) {
      logger.info(`[Middleware] ➡️ Already authenticated, redirecting to /`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Admin route check
    if (isAdminRoute && userRole !== 'ADMIN') {
      logger.info(`[Middleware] ❌ Not ADMIN, redirecting to /`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()

  } catch (error) {
    logger.error(`[Middleware] ❌ Invalid token:`, error)
    
    // Token invalid → delete cookies and handle appropriately
    const response = isProtectedRoute || isAdminRoute
      ? NextResponse.redirect(new URL('/login', request.url))
      : isAuthRoute  // ← FIX: If we're on /login with invalid token
        ? NextResponse.next()  // ← Allow access to /login
        : NextResponse.next()
    
    response.cookies.delete('refreshToken')
    response.cookies.delete('accessToken')
    return response
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}