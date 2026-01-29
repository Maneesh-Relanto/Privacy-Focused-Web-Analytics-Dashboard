import { z } from "zod";

/**
 * Event validation schemas for tracking data
 */

export const createEventSchema = z.object({
  // Website identification
  trackingCode: z
    .string()
    .min(1, "Tracking code is required")
    .regex(/^pm-/, "Invalid tracking code format"),

  // Event information
  eventType: z
    .enum(["pageview", "click", "custom"])
    .default("pageview"),

  // Page information
  url: z
    .string()
    .url("Invalid URL")
    .min(1, "URL is required"),

  referrer: z
    .string()
    .url("Invalid referrer URL")
    .optional()
    .nullable(),

  // Session information
  sessionId: z
    .string()
    .min(1, "Session ID is required"),

  // Device and browser information
  deviceType: z
    .enum(["mobile", "tablet", "desktop"])
    .optional()
    .nullable(),

  browser: z
    .string()
    .max(100, "Browser name too long")
    .optional()
    .nullable(),

  os: z
    .string()
    .max(100, "OS name too long")
    .optional()
    .nullable(),

  // Location information
  location: z
    .string()
    .max(100, "Location too long")
    .optional()
    .nullable(),

  // Visitor identification
  visitorId: z
    .string()
    .min(1, "Visitor ID is required"),

  // Timestamp (optional, server will use current time if not provided)
  timestamp: z
    .number()
    .optional(),

  // Custom properties (for extensibility)
  properties: z
    .record(z.string(), z.unknown())
    .optional()
    .nullable(),
});

export const batchEventSchema = z.object({
  events: z.array(createEventSchema).min(1, "At least one event is required"),
});

// Type definitions
export type CreateEventInput = z.infer<typeof createEventSchema>;
export type BatchEventInput = z.infer<typeof batchEventSchema>;

// Response types
export interface EventResponse {
  id: string;
  websiteId: string;
  eventType: string;
  url: string;
  referrer: string | null;
  sessionId: string;
  visitorId: string;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  location: string | null;
  createdAt: string;
}

export interface BatchEventResponse {
  success: boolean;
  eventsCreated: number;
  message: string;
}

export interface EventErrorResponse {
  error: string;
  message: string;
  details?: Record<string, unknown>;
}
