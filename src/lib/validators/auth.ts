import { z } from 'zod'

// ==================== SHARED SCHEMAS ====================

const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email format')
  .max(255, 'Email must be less than 255 characters')
  .toLowerCase()
  .trim()

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(100, 'Password must be less than 100 characters')

const strongPasswordSchema = passwordSchema
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password must contain at least one uppercase letter, one lowercase letter, and one number'
  )

const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .min(2, 'Must be at least 2 characters')
  .max(100, 'Must be less than 100 characters')
  .trim()

// ==================== LOGIN ====================

export const LoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,  // Login: no regex needed (already hashed)
})

export type LoginInput = z.infer<typeof LoginSchema>

// ==================== REGISTER ====================

export const RegisterSchema = z
  .object({
    email: emailSchema,
    password: strongPasswordSchema,  // Register: strong validation
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    firstName: nameSchema,
    lastName: nameSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],  // Error on the confirmPassword field
  })

export type RegisterInput = z.infer<typeof RegisterSchema>

// ==================== PROFILE UPDATE ====================

export const UpdateProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
})

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>