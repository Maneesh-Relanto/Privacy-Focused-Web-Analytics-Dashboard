/**
 * Dashboard Routes
 * Real analytics data endpoints that query actual events
 * Replaces mock data with aggregated metrics
 */

import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import aggregation from "../services/aggregation";
import { authMiddleware } from "../middleware/auth";

const router = Router();
const prisma = new PrismaClient();

/**
 * Verify user owns the website
 */
async function verifyWebsiteOwnership(
  websiteId: string,
  userId: string
): Promise<boolean> {
  const website = await prisma.website.findFirst({
    where: {
      id: websiteId,
      userId,
    },
  });
  return !!website;
}

/**
 * GET /api/v1/dashboard/metrics
 * Get overall dashboard metrics (pageviews, visitors, sessions, bounce rate, avg duration)
 * Query params: websiteId, days (default: 7)
 */
router.get("/metrics", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { websiteId, days = "7" } = req.query;
    const userId = (req as any).user?.id;

    if (!websiteId || typeof websiteId !== "string") {
      res.status(400).json({ error: "websiteId is required" });
      return;
    }

    // Verify ownership
    const isOwner = await verifyWebsiteOwnership(websiteId, userId);
    if (!isOwner) {
      res.status(403).json({ error: "Unauthorized access to website" });
      return;
    }

    const daysNum = Math.max(1, parseInt(days as string) || 7);
    const metrics = await aggregation.getDashboardMetrics(websiteId, daysNum);

    res.json({
      success: true,
      data: metrics,
      website: websiteId,
      period: `Last ${daysNum} days`,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({ error: "Failed to fetch metrics" });
  }
});

/**
 * GET /api/v1/dashboard/pageviews
 * Get pageview data over time for charting
 * Query params: websiteId, days
 */
router.get(
  "/pageviews",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { websiteId, days = "7" } = req.query;
      const userId = (req as any).user?.id;

      if (!websiteId || typeof websiteId !== "string") {
        res.status(400).json({ error: "websiteId is required" });
        return;
      }

      // Verify ownership
      const isOwner = await verifyWebsiteOwnership(websiteId, userId);
      if (!isOwner) {
        res.status(403).json({ error: "Unauthorized access to website" });
        return;
      }

      const daysNum = Math.max(1, parseInt(days as string) || 7);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - daysNum * 24 * 60 * 60 * 1000);

      // Get events grouped by date
      const events = await prisma.event.findMany({
        where: {
          websiteId,
          eventType: "pageview",
          timestamp: {
            gte: startDate,
            lte: endDate,
          },
        },
        select: { timestamp: true },
        orderBy: { timestamp: "asc" },
      });

      // Group by date
      const dateMap = new Map<string, number>();
      events.forEach((event) => {
        const dateKey = event.timestamp.toISOString().split("T")[0];
        dateMap.set(dateKey, (dateMap.get(dateKey) || 0) + 1);
      });

      // Convert to array
      const data = Array.from(dateMap.entries())
        .map(([date, views]) => ({
          date,
          pageviews: views,
        }))
        .sort((a, b) => a.date.localeCompare(b.date));

      res.json({
        success: true,
        data,
        total: events.length,
      });
    } catch (error) {
      console.error("Error fetching pageviews:", error);
      res.status(500).json({ error: "Failed to fetch pageview data" });
    }
  }
);

/**
 * GET /api/v1/dashboard/top-pages
 * Get top pages by pageview count
 * Query params: websiteId, limit, days
 */
router.get(
  "/top-pages",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { websiteId, limit = "10", days = "7" } = req.query;
      const userId = (req as any).user?.id;

      if (!websiteId || typeof websiteId !== "string") {
        res.status(400).json({ error: "websiteId is required" });
        return;
      }

      // Verify ownership
      const isOwner = await verifyWebsiteOwnership(websiteId, userId);
      if (!isOwner) {
        res.status(403).json({ error: "Unauthorized access to website" });
        return;
      }

      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      const daysNum = Math.max(1, parseInt(days as string) || 7);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - daysNum * 24 * 60 * 60 * 1000);

      const topPages = await aggregation.getTopPages(
        websiteId,
        startDate,
        endDate,
        limitNum
      );

      res.json({
        success: true,
        data: topPages,
        total: topPages.length,
      });
    } catch (error) {
      console.error("Error fetching top pages:", error);
      res.status(500).json({ error: "Failed to fetch top pages" });
    }
  }
);

/**
 * GET /api/v1/dashboard/referrers
 * Get traffic sources (referrers)
 * Query params: websiteId, limit, days
 */
router.get(
  "/referrers",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const { websiteId, limit = "10", days = "7" } = req.query;
      const userId = (req as any).user?.id;

      if (!websiteId || typeof websiteId !== "string") {
        res.status(400).json({ error: "websiteId is required" });
        return;
      }

      // Verify ownership
      const isOwner = await verifyWebsiteOwnership(websiteId, userId);
      if (!isOwner) {
        res.status(403).json({ error: "Unauthorized access to website" });
        return;
      }

      const limitNum = Math.max(1, parseInt(limit as string) || 10);
      const daysNum = Math.max(1, parseInt(days as string) || 7);
      const endDate = new Date();
      const startDate = new Date(endDate.getTime() - daysNum * 24 * 60 * 60 * 1000);

      const referrers = await aggregation.getTrafficSources(
        websiteId,
        startDate,
        endDate,
        limitNum
      );

      res.json({
        success: true,
        data: referrers,
        total: referrers.length,
      });
    } catch (error) {
      console.error("Error fetching referrers:", error);
      res.status(500).json({ error: "Failed to fetch referrer data" });
    }
  }
);

/**
 * GET /api/v1/dashboard/devices
 * Get device breakdown statistics
 * Query params: websiteId, days
 */
router.get("/devices", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { websiteId, days = "7" } = req.query;
    const userId = (req as any).user?.id;

    if (!websiteId || typeof websiteId !== "string") {
      res.status(400).json({ error: "websiteId is required" });
      return;
    }

    // Verify ownership
    const isOwner = await verifyWebsiteOwnership(websiteId, userId);
    if (!isOwner) {
      res.status(403).json({ error: "Unauthorized access to website" });
      return;
    }

    const daysNum = Math.max(1, parseInt(days as string) || 7);
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - daysNum * 24 * 60 * 60 * 1000);

    const devices = await aggregation.getDeviceStats(
      websiteId,
      startDate,
      endDate
    );

    res.json({
      success: true,
      data: devices,
    });
  } catch (error) {
    console.error("Error fetching device stats:", error);
    res.status(500).json({ error: "Failed to fetch device statistics" });
  }
});

export default router;
