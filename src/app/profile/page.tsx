import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'
import ProfileClient from './ProfileClient'

// SERVER COMPONENT (not 'use client')
export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get('refreshToken')?.value

  // Protection: no token → redirect
  if (!token) {
    redirect('/login')
  }

  // Verify token
  let userData
  try {
    const secret = new TextEncoder().encode(process.env.JWT_REFRESH_SECRET!)
    await jwtVerify(token, secret)
  } catch (error) {
    // Invalid token → redirect
    redirect('/login')
  }

  // Fetch user data
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
      headers: {
        Cookie: `refreshToken=${token}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      redirect('/login')
    }

    const data = await response.json()
    userData = data.user
  } catch (error) {
    redirect('/login')
  }

  // JSX OUTSIDE try/catch ✅
  return <ProfileClient user={userData} />
}