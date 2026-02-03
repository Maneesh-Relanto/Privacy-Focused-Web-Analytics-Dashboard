import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  createWebsiteSchema,
  updateWebsiteSchema,
  CreateWebsiteRequest,
  UpdateWebsiteRequest,
} from "../schemas/websites";
import { generateTrackingCode } from "../services/websites";

const router = Router();

/**
 * POST /api/v1/websites
 * Create a new website for tracking
 */
router.post(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const validation = createWebsiteSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: validation.error.flatten(),
        });
        return;
      }

      const { name, domain, description }: CreateWebsiteRequest =
        validation.data;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: "UNAUTHORIZED",
          message: "User not found in request context",
        });
        return;
      }

      // Check if domain already exists for this user
      const existingWebsite = await prisma.website.findFirst({
        where: {
          userId,
          domain,
        },
      });

      if (existingWebsite) {
        res.status(409).json({
          error: "CONFLICT",
          message: "This domain is already registered for your account",
        });
        return;
      }

      const trackingCode = generateTrackingCode();

      const website = await prisma.website.create({
        data: {
          userId,
          name,
          domain,
          description: description || undefined,
          trackingCode,
        },
      });

      res.status(201).json({
        id: website.id,
        userId: website.userId,
        name: website.name,
        domain: website.domain,
        description: website.description,
        trackingCode: website.trackingCode,
        createdAt: website.createdAt.toISOString(),
        updatedAt: website.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error("Error creating website:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to create website",
      });
    }
  },
);

/**
 * GET /api/v1/websites
 * List all websites for authenticated user
 */
router.get(
  "/",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: "UNAUTHORIZED",
          message: "User not found in request context",
        });
        return;
      }

      const websites = await prisma.website.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        websites: websites.map((site) => ({
          id: site.id,
          userId: site.userId,
          name: site.name,
          domain: site.domain,
          description: site.description,
          trackingCode: site.trackingCode,
          createdAt: site.createdAt.toISOString(),
          updatedAt: site.updatedAt.toISOString(),
        })),
        total: websites.length,
      });
    } catch (error) {
      console.error("Error fetching websites:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch websites",
      });
    }
  },
);

/**
 * GET /api/v1/websites/:id
 * Get specific website details
 */
router.get(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: "UNAUTHORIZED",
          message: "User not found in request context",
        });
        return;
      }

      const website = await prisma.website.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!website) {
        res.status(404).json({
          error: "NOT_FOUND",
          message: "Website not found",
        });
        return;
      }

      res.json({
        id: website.id,
        userId: website.userId,
        name: website.name,
        domain: website.domain,
        description: website.description,
        trackingCode: website.trackingCode,
        createdAt: website.createdAt.toISOString(),
        updatedAt: website.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error("Error fetching website:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch website",
      });
    }
  },
);

/**
 * PUT /api/v1/websites/:id
 * Update website details
 */
router.put(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: "UNAUTHORIZED",
          message: "User not found in request context",
        });
        return;
      }

      const validation = updateWebsiteSchema.safeParse(req.body);

      if (!validation.success) {
        res.status(400).json({
          error: "VALIDATION_ERROR",
          message: "Invalid request body",
          details: validation.error.flatten(),
        });
        return;
      }

      const updateData: UpdateWebsiteRequest = validation.data;

      // Verify website belongs to user
      const website = await prisma.website.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!website) {
        res.status(404).json({
          error: "NOT_FOUND",
          message: "Website not found",
        });
        return;
      }

      // If domain is being updated, check for duplicates
      if (updateData.domain && updateData.domain !== website.domain) {
        const existingWebsite = await prisma.website.findFirst({
          where: {
            userId,
            domain: updateData.domain,
            id: { not: id },
          },
        });

        if (existingWebsite) {
          res.status(409).json({
            error: "CONFLICT",
            message: "This domain is already registered for your account",
          });
          return;
        }
      }

      const updatedWebsite = await prisma.website.update({
        where: { id },
        data: {
          name: updateData.name || website.name,
          domain: updateData.domain || website.domain,
          description:
            updateData.description !== undefined
              ? updateData.description
              : website.description,
        },
      });

      res.json({
        id: updatedWebsite.id,
        userId: updatedWebsite.userId,
        name: updatedWebsite.name,
        domain: updatedWebsite.domain,
        description: updatedWebsite.description,
        trackingCode: updatedWebsite.trackingCode,
        createdAt: updatedWebsite.createdAt.toISOString(),
        updatedAt: updatedWebsite.updatedAt.toISOString(),
      });
    } catch (error) {
      console.error("Error updating website:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to update website",
      });
    }
  },
);

/**
 * DELETE /api/v1/websites/:id
 * Delete a website
 */
router.delete(
  "/:id",
  authMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      if (!userId) {
        res.status(401).json({
          error: "UNAUTHORIZED",
          message: "User not found in request context",
        });
        return;
      }

      // Verify website belongs to user
      const website = await prisma.website.findFirst({
        where: {
          id,
          userId,
        },
      });

      if (!website) {
        res.status(404).json({
          error: "NOT_FOUND",
          message: "Website not found",
        });
        return;
      }

      await prisma.website.delete({
        where: { id },
      });

      res.json({
        success: true,
        message: "Website deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting website:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to delete website",
      });
    }
  },
);

export default router;
