import { Router, Request, Response } from 'express';
import { trackingService } from '../services/tracking';
import { z } from 'zod';

const router = Router();

// SIMPLIFIED validation - only essentials for privacy-first tracking
const SimpleTrackingSchema = z.object({
  code: z.string().min(1, 'Tracking code required'),
  sid: z.string().min(1, 'Session ID required'),
  vid: z.string().min(1, 'Visitor ID required'),
  url: z.string().url('Valid URL required'),
  ref: z.string().nullable().optional(),
  t: z.number()
});

/**
 * POST /api/v1/track
 * Simple, privacy-first event tracking
 * No auth required - uses tracking code only
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    // Log raw request
    console.log('[Track] Raw request body:', JSON.stringify(req.body));
    
    // Validate minimal payload
    const data = SimpleTrackingSchema.parse(req.body);
    
    console.log('[Track] Validated data:', {
      code: data.code,
      sid: data.sid,
      vid: data.vid,
      url: data.url
    });

    // Get client IP (will be hashed for privacy)
    const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() 
      || req.headers['x-real-ip'] as string
      || req.socket.remoteAddress 
      || 'unknown';

    // Get user agent
    const userAgent = req.headers['user-agent'] || 'unknown';

    // Process the event
    await trackingService.processSimpleEvent({
      trackingCode: data.code,
      sessionId: data.sid,
      visitorId: data.vid,
      url: data.url,
      referrer: data.ref || null,
      timestamp: new Date(data.t),
      clientIp,
      userAgent
    });

    // Return 204 No Content (fastest response)
    res.status(204).send();

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('[Track] Validation error:', error.errors);
      res.status(400).json({
        error: 'Invalid data',
        details: error.errors
      });
      return;
    }

    console.error('[Track] Error:', error instanceof Error ? error.message : String(error));
    console.error('[Track] Full error:', error);
    res.status(500).json({ error: 'Tracking failed' });
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
