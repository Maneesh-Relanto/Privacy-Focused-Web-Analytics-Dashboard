import { Router, Request, Response } from "express";
import { authMiddleware } from "../middleware/auth";

const router = Router();

/**
 * GET /api/v1/dashboard/metrics
 * Get aggregated metrics for the dashboard
 *
 * Query params:
 * - dateRange: "24h" | "7d" | "30d" | "90d" (default: "7d")
 *
 * Returns: DashboardMetrics
 */
router.get("/metrics", authMiddleware, async (req: Request, res: Response) => {
  try {
    const dateRange = (req.query.dateRange as string) || "7d";

    // For MVP: Return mock data based on date range
    // In production: Query database for real data
    const metrics = {
      pageViews: 45231 + Math.random() * 10000,
      uniqueVisitors: 12847 + Math.random() * 5000,
      sessionDuration: 222 + Math.random() * 60, // in seconds (3-4 minutes)
      bounceRate: 32.4 + Math.random() * 10,
      pageViewsTrend: 12 + Math.random() * 10,
      visitorsTrend: 8 + Math.random() * 8,
      sessionDurationTrend: -2 + Math.random() * 4,
      bounceRateTrend: 5 + Math.random() * 5,
    };

    res.json(metrics);
  } catch (error) {
    console.error("Error fetching metrics:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch metrics",
    });
  }
});

/**
 * GET /api/v1/dashboard/chart-data
 * Get chart data for page views and visitors
 *
 * Query params:
 * - dateRange: "24h" | "7d" | "30d" | "90d" (default: "7d")
 * - type: "pageviews" | "visitors" | "both" (default: "both")
 *
 * Returns: { pageViewsChart, visitorsChart }
 */
router.get(
  "/chart-data",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const dateRange = (req.query.dateRange as string) || "7d";
      const type = (req.query.type as string) || "both";

      // Generate mock data based on date range
      const days =
        dateRange === "24h"
          ? 24
          : dateRange === "7d"
            ? 7
            : dateRange === "30d"
              ? 30
              : 90;
      const isHourly = dateRange === "24h";

      const generateDataPoints = () => {
        const points = [];
        const now = new Date();

        for (let i = days - 1; i >= 0; i--) {
          const date = new Date(now);
          if (isHourly) {
            date.setHours(date.getHours() - i);
          } else {
            date.setDate(date.getDate() - i);
          }

          points.push({
            date: isHourly
              ? date.toISOString().slice(11, 16)
              : date.toISOString().slice(0, 10),
            value: Math.floor(Math.random() * 5000) + 2000,
          });
        }
        return points;
      };

      const response: any = {};

      if (type === "pageviews" || type === "both") {
        response.pageViewsChart = {
          data: generateDataPoints(),
        };
      }

      if (type === "visitors" || type === "both") {
        response.visitorsChart = {
          data: generateDataPoints().map((p) => ({
            ...p,
            value: Math.floor(p.value / 3), // Fewer visitors than pageviews
          })),
        };
      }

      res.json(response);
    } catch (error) {
      console.error("Error fetching chart data:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch chart data",
      });
    }
  },
);

/**
 * GET /api/v1/dashboard/top-pages
 * Get top pages by view count
 */
router.get(
  "/top-pages",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const topPages = {
        pages: [
          { url: "/blog/react-hooks", views: 3241, percentage: 7.2 },
          { url: "/pricing", views: 2980, percentage: 6.6 },
          { url: "/features", views: 2650, percentage: 5.9 },
          { url: "/docs", views: 2100, percentage: 4.7 },
          { url: "/about", views: 1840, percentage: 4.1 },
        ],
      };

      res.json(topPages);
    } catch (error) {
      console.error("Error fetching top pages:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch top pages",
      });
    }
  },
);

/**
 * GET /api/v1/dashboard/referrers
 * Get top referrer sources
 */
router.get(
  "/referrers",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const referrers = {
        referrers: [
          { source: "google.com", visits: 8432 },
          { source: "github.com", visits: 3421 },
          { source: "twitter.com", visits: 2156 },
          { source: "reddit.com", visits: 1843 },
          { source: "Direct", visits: 1234 },
        ],
      };

      res.json(referrers);
    } catch (error) {
      console.error("Error fetching referrers:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch referrer data",
      });
    }
  },
);

/**
 * GET /api/v1/dashboard/devices
 * Get device distribution
 */
router.get("/devices", authMiddleware, async (req: Request, res: Response) => {
  try {
    const total = 12847;
    const mobile = Math.floor(total * 0.45);
    const desktop = Math.floor(total * 0.4);
    const tablet = total - mobile - desktop;

    const devices = {
      devices: [
        {
          type: "mobile" as const,
          count: mobile,
          percentage: (mobile / total) * 100,
        },
        {
          type: "desktop" as const,
          count: desktop,
          percentage: (desktop / total) * 100,
        },
        {
          type: "tablet" as const,
          count: tablet,
          percentage: (tablet / total) * 100,
        },
      ],
    };

    res.json(devices);
  } catch (error) {
    console.error("Error fetching device distribution:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch device data",
    });
  }
});

/**
 * GET /api/v1/dashboard/locations
 * Get top visitor locations
 */
router.get(
  "/locations",
  authMiddleware,
  async (req: Request, res: Response) => {
    try {
      const locations = {
        locations: [
          {
            country: "United States",
            city: "San Francisco, CA",
            visitors: 3421,
            percentage: 26.6,
          },
          {
            country: "United States",
            city: "New York, NY",
            visitors: 2156,
            percentage: 16.8,
          },
          {
            country: "India",
            city: "Bangalore",
            visitors: 1843,
            percentage: 14.3,
          },
          {
            country: "United Kingdom",
            city: "London",
            visitors: 1234,
            percentage: 9.6,
          },
          {
            country: "Germany",
            city: "Berlin",
            visitors: 987,
            percentage: 7.7,
          },
        ],
      };

      res.json(locations);
    } catch (error) {
      console.error("Error fetching locations:", error);
      res.status(500).json({
        error: "INTERNAL_ERROR",
        message: "Failed to fetch location data",
      });
    }
  },
);

/**
 * GET /api/v1/dashboard/all
 * Get all dashboard data at once
 */
router.get("/all", authMiddleware, async (req: Request, res: Response) => {
  try {
    const dateRange = (req.query.dateRange as string) || "7d";

    // Call individual endpoints or fetch data directly
    // For MVP: Combine all mock data

    const days =
      dateRange === "24h"
        ? 24
        : dateRange === "7d"
          ? 7
          : dateRange === "30d"
            ? 30
            : 90;
    const isHourly = dateRange === "24h";

    const generateDataPoints = () => {
      const points = [];
      const now = new Date();

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        if (isHourly) {
          date.setHours(date.getHours() - i);
        } else {
          date.setDate(date.getDate() - i);
        }

        points.push({
          date: isHourly
            ? date.toISOString().slice(11, 16)
            : date.toISOString().slice(0, 10),
          value: Math.floor(Math.random() * 5000) + 2000,
        });
      }
      return points;
    };

    const response = {
      metrics: {
        pageViews: 45231 + Math.random() * 10000,
        uniqueVisitors: 12847 + Math.random() * 5000,
        sessionDuration: 222 + Math.random() * 60,
        bounceRate: 32.4 + Math.random() * 10,
        pageViewsTrend: 12 + Math.random() * 10,
        visitorsTrend: 8 + Math.random() * 8,
        sessionDurationTrend: -2 + Math.random() * 4,
        bounceRateTrend: 5 + Math.random() * 5,
      },
      pageViewsChart: {
        data: generateDataPoints(),
      },
      visitorsChart: {
        data: generateDataPoints().map((p) => ({
          ...p,
          value: Math.floor(p.value / 3),
        })),
      },
      topPages: {
        pages: [
          { url: "/blog/react-hooks", views: 3241, percentage: 7.2 },
          { url: "/pricing", views: 2980, percentage: 6.6 },
          { url: "/features", views: 2650, percentage: 5.9 },
          { url: "/docs", views: 2100, percentage: 4.7 },
          { url: "/about", views: 1840, percentage: 4.1 },
        ],
      },
      referrers: {
        referrers: [
          { source: "google.com", visits: 8432 },
          { source: "github.com", visits: 3421 },
          { source: "twitter.com", visits: 2156 },
          { source: "reddit.com", visits: 1843 },
          { source: "Direct", visits: 1234 },
        ],
      },
      devices: {
        devices: [
          { type: "mobile" as const, count: 5781, percentage: 45 },
          { type: "desktop" as const, count: 5139, percentage: 40 },
          { type: "tablet" as const, count: 1927, percentage: 15 },
        ],
      },
      locations: {
        locations: [
          {
            country: "United States",
            city: "San Francisco, CA",
            visitors: 3421,
            percentage: 26.6,
          },
          {
            country: "United States",
            city: "New York, NY",
            visitors: 2156,
            percentage: 16.8,
          },
          {
            country: "India",
            city: "Bangalore",
            visitors: 1843,
            percentage: 14.3,
          },
          {
            country: "United Kingdom",
            city: "London",
            visitors: 1234,
            percentage: 9.6,
          },
          {
            country: "Germany",
            city: "Berlin",
            visitors: 987,
            percentage: 7.7,
          },
        ],
      },
      lastUpdated: new Date().toISOString(),
    };

    res.json(response);
  } catch (error) {
    console.error("Error fetching all dashboard data:", error);
    res.status(500).json({
      error: "INTERNAL_ERROR",
      message: "Failed to fetch dashboard data",
    });
  }
});

export default router;
