import { Router, Request, Response } from 'express';
import { trackingService } from '../services/tracking';
import { z } from 'zod';

const router = Router();

// Validation schema for tracking events
const TrackingEventSchema = z.object({
  trackingCode: z.string().min(1, 'Tracking code is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  visitorId: z.string().min(1, 'Visitor ID is required'),
  eventType: z.enum(['pageview', 'page_leave', 'page_hide', 'page_show', 'custom_event']),
  eventData: z.record(z.any()).optional(),
  page: z.object({
    url: z.string().url(),
    path: z.string(),
    title: z.string(),
    referrer: z.string().nullable().optional(),
    queryParams: z.record(z.string()).nullable().optional()
  }),
  device: z.object({
    type: z.enum(['mobile', 'tablet', 'desktop']),
    browser: z.string(),
    browserVersion: z.string().optional(),
    os: z.string(),
    screen: z.object({
      width: z.number(),
      height: z.number(),
      availWidth: z.number().optional(),
      availHeight: z.number().optional()
    })
  }),
  timestamp: z.string(),
  language: z.string().optional(),
  timezone: z.string().optional()
});

/**
 * POST /api/v1/track
 * Receive tracking events from websites
 * No authentication required - uses tracking code for identification
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = TrackingEventSchema.parse(req.body);

    // Get client IP (for geolocation, will be hashed)
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() 
      || req.headers['x-real-ip'] as string
      || req.socket.remoteAddress 
      || 'unknown';

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Process the tracking event
    await trackingService.processEvent({
      ...validatedData,
      clientIp,
      userAgent
    });

    // Return minimal response (no data needed by client)
    res.status(204).send();

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Tracking] Validation error:', error.errors);
      res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Invalid tracking event data',
        details: error.errors
      });
      return;
    }

    console.error('[Tracking] Error processing event:', error);
    
    // Don't expose internal errors to tracking clients
    res.status(500).json({
      error: 'TRACKING_ERROR',
      message: 'Failed to process tracking event'
    });
  }
});

/**
 * GET /api/v1/track/health
 * Health check for tracking endpoint
 */
router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'tracking',
    timestamp: new Date().toISOString()
  });
});

export default router;
