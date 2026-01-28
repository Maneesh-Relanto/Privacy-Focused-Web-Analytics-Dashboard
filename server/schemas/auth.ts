import { z } from 'zod'

/**
 * Validation schema for user registration
 */
export const registerSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be at most 255 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be at most 255 characters')
    .optional(),
})

export type RegisterRequest = z.infer<typeof registerSchema>

/**
 * Validation schema for user login
 */
export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export type LoginRequest = z.infer<typeof loginSchema>

/**
 * Validation schema for token refresh
 */
export const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .min(1, 'Refresh token is required'),
})

export type RefreshTokenRequest = z.infer<typeof refreshTokenSchema>

/**
 * Response types
 */
export interface AuthTokenResponse {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthUserResponse {
  id: string
  email: string
  name?: string
  apiKey?: string
  createdAt: string
}

export interface AuthResponse {
  user: AuthUserResponse
  tokens: AuthTokenResponse
}

export interface ErrorResponse {
  error: string
  message: string
  statusCode: number
}
