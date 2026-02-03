import { Router, Request, Response } from "express";
import prisma from "../lib/prisma";
import { createEventSchema, batchEventSchema } from "../schemas/events";
import { z } from "zod";

const router = Router();

/**
 * Helper function to find website by tracking code
 */
async function findWebsiteByTrackingCode(trackingCode: string) {
  return prisma.website.findFirst({
    where: { trackingCode },
  });
}

/**
 * POST /api/v1/events
 * Create a single event
 *
 * Request body:
 * {
 *   trackingCode: "pm-xxx-timestamp",
 *   eventType: "pageview" | "click" | "custom",
 *   url: "https://example.com/page",
 *   referrer?: "https://google.com",
 *   sessionId: "sess-xxx",
 *   visitorId: "vis-xxx",
 *   deviceType?: "mobile" | "tablet" | "desktop",
 *   browser?: "Chrome",
 *   os?: "Windows",
 *   location?: "US",
 *   timestamp?: 1704067200000,
 *   properties?: {}
 * }
 */
router.post("/", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = createEventSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid event data",
        details: validation.error.flatten(),
      });
      return;
    }

    const eventData = validation.data;

    // Find website by tracking code
    const website = await findWebsiteByTrackingCode(eventData.trackingCode);

    if (!website) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Website with this tracking code not found",
      });
      return;
    }

    // Create the event
    const event = await prisma.event.create({
      data: {
        websiteId: website.id,
        eventType: eventData.eventType,
        pageUrl: eventData.url,
        referrer: eventData.referrer || null,
        sessionId: eventData.sessionId || null,
        visitorId: eventData.visitorId || null,
        properties: eventData.properties ? JSON.stringify(eventData.properties) : null,
      },
    });

    // Return success response
    res.status(201).json({
      id: event.id,
      websiteId: event.websiteId,
      eventType: event.eventType,
      pageUrl: event.pageUrl,
      referrer: event.referrer,
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      timestamp: event.timestamp.toISOString(),
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create event",
    });
  }
});

/**
 * POST /api/v1/events/batch
 * Create multiple events in a single request (for batching)
 *
 * Request body:
 * {
 *   events: [
 *     { trackingCode, eventType, url, ... },
 *     { trackingCode, eventType, url, ... }
 *   ]
 * }
 */
router.post("/batch", async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validation = batchEventSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Invalid batch event data",
        details: validation.error.flatten(),
      });
      return;
    }

    const { events: eventsToCreate } = validation.data;
    const createdEvents = [];
    const errors = [];

    // Process each event
    for (let i = 0; i < eventsToCreate.length; i++) {
      try {
        const eventData = eventsToCreate[i];

        // Find website by tracking code
        const website = await findWebsiteByTrackingCode(eventData.trackingCode);

        if (!website) {
          errors.push({
            index: i,
            error: "NOT_FOUND",
            message: `Website with tracking code "${eventData.trackingCode}" not found`,
          });
          continue;
        }

        // Create the event
        const event = await prisma.event.create({
          data: {
            websiteId: website.id,
            eventType: eventData.eventType,
            pageUrl: eventData.url,
            referrer: eventData.referrer || null,
            sessionId: eventData.sessionId || null,
            visitorId: eventData.visitorId || null,
            properties: eventData.properties
              ? JSON.stringify(eventData.properties)
              : null,
          },
        });

        createdEvents.push({
          id: event.id,
          websiteId: event.websiteId,
          eventType: event.eventType,
          pageUrl: event.pageUrl,
          timestamp: event.timestamp.toISOString(),
        });
      } catch (error) {
        errors.push({
          index: i,
          error: "PROCESSING_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Return response
    const status = errors.length > 0 ? 207 : 201; // 207 = Multi-Status (partial success)
    res.status(status).json({
      success: errors.length === 0,
      eventsCreated: createdEvents.length,
      events: createdEvents,
      errors: errors.length > 0 ? errors : undefined,
      message:
        errors.length === 0
          ? `Successfully created ${createdEvents.length} events`
          : `Created ${createdEvents.length} events with ${errors.length} errors`,
    });
  } catch (error) {
    console.error("Error creating batch events:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to create batch events",
    });
  }
});

/**
 * GET /api/v1/events
 * Get events for a website (with optional filtering)
 * Query params:
 * - trackingCode: filter by tracking code
 * - eventType: filter by event type
 * - limit: max results (default: 100)
 * - offset: pagination offset (default: 0)
 */
router.get("/", async (req: Request, res: Response) => {
  try {
    const { trackingCode, eventType, limit = "100", offset = "0" } = req.query;

    if (!trackingCode) {
      res.status(400).json({
        error: "MISSING_PARAMETER",
        message: "trackingCode query parameter is required",
      });
      return;
    }

    // Find website by tracking code
    const website = await findWebsiteByTrackingCode(trackingCode as string);

    if (!website) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Website not found",
      });
      return;
    }

    // Build filter
    const where: any = { websiteId: website.id };
    if (eventType) {
      where.eventType = eventType;
    }

    // Get events
    const events = await prisma.event.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: Math.min(parseInt(limit as string) || 100, 1000), // Max 1000
      skip: parseInt(offset as string) || 0,
    });

    // Get total count
    const total = await prisma.event.count({ where });

    res.status(200).json({
      events: events.map((event) => ({
        id: event.id,
        eventType: event.eventType,
        pageUrl: event.pageUrl,
        referrer: event.referrer,
        sessionId: event.sessionId,
        visitorId: event.visitorId,
        timestamp: event.timestamp.toISOString(),
      })),
      pagination: {
        total,
        limit: Math.min(parseInt(limit as string) || 100, 1000),
        offset: parseInt(offset as string) || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch events",
    });
  }
});

/**
 * GET /api/v1/events/:id
 * Get a specific event by ID
 */
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      res.status(404).json({
        error: "NOT_FOUND",
        message: "Event not found",
      });
      return;
    }

    res.status(200).json({
      id: event.id,
      websiteId: event.websiteId,
      eventType: event.eventType,
      pageUrl: event.pageUrl,
      referrer: event.referrer,
      sessionId: event.sessionId,
      visitorId: event.visitorId,
      properties: event.properties ? JSON.parse(event.properties) : null,
      timestamp: event.timestamp.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      error: "INTERNAL_SERVER_ERROR",
      message: "Failed to fetch event",
    });
  }
});

export default router;
