import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'
import { logger } from '@/lib/utils/logger'

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

  const token = request.cookies.get('accessToken')?.value

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
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const { payload } = await jwtVerify(token, secret)
    const userRole = payload.role as string

    logger.info(`[Middleware] ✅ Token valid, user role: ${userRole}`)

    // Authenticated user on auth pages → redirect
    if (isAuthRoute) {
      logger.info(`[Middleware] ⚠️ Authenticated user on auth route: ${pathname}`)
      const redirectUrl = userRole === 'ADMIN' || userRole === 'STAFF'
        ? '/admin/artworks'
        : '/profile'
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }

    // Admin route check (ADMIN or STAFF)
    if (isAdminRoute && userRole !== 'ADMIN' && userRole !== 'STAFF') {
      logger.info(`[Middleware] ❌ Not ADMIN/STAFF, redirecting to /`)
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()

  } catch (error) {
    logger.error(`[Middleware] ❌ Invalid token:`, error)
    
    const response = isProtectedRoute || isAdminRoute
      ? NextResponse.redirect(new URL('/login', request.url))
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