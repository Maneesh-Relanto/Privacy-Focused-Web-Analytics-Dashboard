import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";

const router = Router();

/**
 * POST /api/seed
 * Create test data for development and testing
 * This endpoint creates:
 * - A test user (email: test@example.com, password: test123)
 * - A test website with tracking code
 * - Sample events to test aggregation
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    // Check if test data already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: "test@example.com" },
    });

    if (existingUser) {
      return res.status(400).json({
        error: "TEST_DATA_EXISTS",
        message: "Test data already exists. Use /api/seed/reset to clear it first.",
        user: {
          email: existingUser.email,
          websites: [],
        },
      });
    }

    // Create test user
    const hashedPassword = await bcrypt.hash("test123", 10);
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        password: hashedPassword,
        name: "Test User",
      },
    });

    // Create test website
    const trackingCode = "pm-test-" + Date.now();
    const website = await prisma.website.create({
      data: {
        userId: user.id,
        name: "Test Website",
        domain: "test-example.com",
        trackingCode: trackingCode,
      },
    });

    // Create sample events (last 7 days)
    const now = new Date();
    const eventsToCreate = [];

    for (let dayOffset = 6; dayOffset >= 0; dayOffset--) {
      const dayDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
      const baseHour = dayDate.getHours();

      // Create events throughout the day
      for (let hour = 0; hour < 24; hour++) {
        const eventDate = new Date(dayDate);
        eventDate.setHours(hour);

        // Pageviews (more frequent)
        for (let i = 0; i < Math.floor(Math.random() * 5) + 2; i++) {
          eventsToCreate.push({
            websiteId: website.id,
            eventType: "pageview" as const,
            pageUrl: `https://test-example.com/page-${Math.floor(Math.random() * 5) + 1}`,
            referrer: Math.random() > 0.7 ? "https://google.com/search" : null,
            sessionId: `sess-${dayOffset}-${hour}-${i}`,
            visitorId: `vis-${Math.floor(Math.random() * 20) + 1}`,
            timestamp: new Date(eventDate.getTime() + Math.random() * 3600000),
          });
        }

        // Clicks (less frequent)
        if (Math.random() > 0.6) {
          eventsToCreate.push({
            websiteId: website.id,
            eventType: "click" as const,
            pageUrl: `https://test-example.com/page-1`,
            referrer: null,
            sessionId: `sess-${dayOffset}-${hour}-click`,
            visitorId: `vis-${Math.floor(Math.random() * 20) + 1}`,
            timestamp: new Date(eventDate.getTime() + Math.random() * 3600000),
          });
        }
      }
    }

    // Batch insert events
    const createdEvents = await Promise.all(
      eventsToCreate.map((event) =>
        prisma.event.create({ data: event })
      )
    );

    res.status(201).json({
      success: true,
      message: "Test data created successfully",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        website: {
          id: website.id,
          name: website.name,
          domain: website.domain,
          trackingCode: trackingCode,
        },
        eventsCreated: createdEvents.length,
        testCredentials: {
          email: "test@example.com",
          password: "test123",
        },
        instructions: {
          step1: "Log in with the test credentials above",
          step2: `Use tracking code '${trackingCode}' in the tracker test page`,
          step3: "View dashboard to see aggregated metrics",
          step4: "Use /api/seed/reset to clear all test data",
        },
      },
    });
  } catch (error) {
    console.error("Error seeding test data:", error);
    res.status(500).json({
      error: "SEED_ERROR",
      message: "Failed to create test data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * DELETE /api/seed
 * Reset/clear all test data
 */
router.delete("/", async (req: Request, res: Response) => {
  try {
    // Delete test user and all related data (cascade)
    const user = await prisma.user.delete({
      where: { email: "test@example.com" },
    });

    res.status(200).json({
      success: true,
      message: "Test data cleared successfully",
      deletedUser: user.email,
    });
  } catch (error) {
    if ((error as any).code === "P2025") {
      // Not found
      return res.status(404).json({
        error: "NOT_FOUND",
        message: "No test data found to delete",
      });
    }

    console.error("Error resetting test data:", error);
    res.status(500).json({
      error: "RESET_ERROR",
      message: "Failed to reset test data",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
