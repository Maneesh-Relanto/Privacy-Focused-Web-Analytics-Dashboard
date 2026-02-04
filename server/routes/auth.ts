import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import {
  registerSchema,
  loginSchema,
  RegisterRequest,
  LoginRequest,
} from "../schemas/auth";
import {
  hashPassword,
  verifyPassword,
  generateToken,
  generateApiKey,
  hashApiKey,
} from "../services/auth";

const router = Router();

/**
 * POST /api/v1/auth/register
 * Create a new user account
 *
 * @param email - User email address (unique)
 * @param password - Password (min 8 chars, uppercase, lowercase, number)
 * @param name - Optional display name
 *
 * @returns {
 *   user: { id, email, name, createdAt },
 *   tokens: { accessToken, refreshToken, expiresIn }
 * }
 */
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: validation.error.flatten(),
      });
      return;
    }

    const { email, password, name }: RegisterRequest = validation.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(409).json({
        error: "CONFLICT",
        message: "Email already registered",
      });
      return;
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate API key for tracking
    const apiKey = generateApiKey();
    const hashedApiKey = await hashApiKey(apiKey);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || undefined,
        apiKey,
        apiKeyHash: hashedApiKey,
      },
    });

    // Generate tokens
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    // In production, you'd generate a separate refresh token and store it
    // For now, we're using the same token with longer expiry
    const refreshToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        apiKey: user.apiKey,
        createdAt: user.createdAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 604800, // 7 days in seconds
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Registration failed",
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Authenticate user with email and password
 *
 * @param email - User email
 * @param password - User password
 *
 * @returns {
 *   user: { id, email, name, createdAt },
 *   tokens: { accessToken, refreshToken, expiresIn }
 * }
 */
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    // Validate request body
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid request body",
        details: validation.error.flatten(),
      });
      return;
    }

    const { email, password }: LoginRequest = validation.data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
      return;
    }

    // Verify password
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(403).json({
        error: "FORBIDDEN",
        message: "Account is inactive",
      });
      return;
    }

    // Generate tokens
    const accessToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = generateToken({
      userId: user.id,
      email: user.email,
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      },
      tokens: {
        accessToken,
        refreshToken,
        expiresIn: 604800, // 7 days in seconds
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Login failed",
    });
  }
});

/**
 * GET /api/v1/auth/me
 * Get current user profile (requires authentication)
 *
 * @returns Current user data
 */
router.get("/me", async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        error: "UNAUTHORIZED",
        message: "Authentication required",
      });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        isActive: true,
      },
    });

    if (!user) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "User not found",
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch user",
    });
  }
});

/**
 * POST /api/v1/auth/logout
 * Logout user (invalidate token)
 * In production, store tokens in a blacklist or use refresh token rotation
 */
router.post("/logout", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Logged out successfully",
  });
});

export default router;
