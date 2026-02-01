import type { UserRole } from '@prisma/client'
import type { RegisterRequest, LoginRequest } from '@/types/api/auth'

/**
 * Complete user object used in application state
 * (extends API responses with all fields)
 */
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

/**
 * Authentication state stored in Context
 */
export interface AuthState {
  user: User | null              
  isAuthenticated: boolean        
  isLoading: boolean             
}

/**
 * Re-export API request types for convenience
 * (used in Context methods)
 */
export type LoginCredentials = LoginRequest      // { email, password }
export type RegisterData = RegisterRequest       // { email, password, firstName, lastName }

/**
 * Profile update data (partial user fields)
 */
export interface UpdateProfileData {
  firstName?: string
  lastName?: string
  email?: string
}

/**
 * Methods exposed by AuthContext
 */
export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  updateProfile: (data: UpdateProfileData) => Promise<void>
  checkAuth: () => Promise<void>  // Verify current session on app load
}