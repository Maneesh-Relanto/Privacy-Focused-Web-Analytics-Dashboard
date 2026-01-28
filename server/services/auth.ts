import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.JWT_SECRET || "dev-secret-key-change-in-production";
const JWT_EXPIRY = process.env.JWT_EXPIRY || "7d";

export interface JWTPayload {
  userId: string;
  email: string;
}

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hash Bcrypt hash
 * @returns True if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token
 * @param payload User data to encode
 * @returns JWT token string
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Verify and decode a JWT token
 * @param token JWT token string
 * @returns Decoded payload or null if invalid
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

/**
 * Generate a random API key for website tracking
 * Format: pk_test_xxxxx (18 characters)
 * @returns Random API key
 */
export function generateApiKey(): string {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "pk_";
  for (let i = 0; i < 32; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Hash an API key for secure storage
 * @param apiKey Plain API key
 * @returns Hashed API key
 */
export async function hashApiKey(apiKey: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(apiKey, salt);
}

/**
 * Verify an API key against a hash
 * @param apiKey Plain API key
 * @param hash Bcrypt hash
 * @returns True if API key matches
 */
export async function verifyApiKey(
  apiKey: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(apiKey, hash);
}

/**
 * Validate email format
 * @param email Email address
 * @returns True if valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Error message if invalid, empty string if valid
 */
export function validatePasswordStrength(password: string): string {
  if (password.length < 8) {
    return "Password must be at least 8 characters long";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number";
  }
  return "";
}
