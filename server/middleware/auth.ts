import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth";

/**
 * Extend Express Request to include user info
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
      };
    }
  }
}

/**
 * Authentication middleware - verifies JWT token
 * Expects Authorization header: Bearer <token>
 */
export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Missing or invalid authorization header",
      });
      return;
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix
    const payload = verifyToken(token);

    if (!payload) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid or expired token",
      });
      return;
    }

    // Attach user info to request
    req.user = payload;
    next();
  } catch (error) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Token verification failed",
    });
  }
}

/**
 * Optional authentication middleware - doesn't fail if no token
 * Useful for public endpoints that can optionally show user-specific data
 */
export function optionalAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      if (payload) {
        req.user = payload;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}

/**
 * API Key authentication middleware
 * Expects header: X-API-Key: <key>
 */
export function apiKeyMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Missing API key header (X-API-Key)",
    });
    return;
  }

  // In production, verify against database
  // For now, just pass it through - implement actual verification later
  req.user = {
    userId: "api-user",
    email: "api@tracking.local",
  };

  next();
}
