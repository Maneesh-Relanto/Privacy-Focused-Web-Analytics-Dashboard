import prisma from '../lib/prisma';
import crypto from 'crypto';

// Simple event interface
interface SimpleTrackingEvent {
  trackingCode: string;
  sessionId: string;
  visitorId: string;
  url: string;
  referrer: string | null;
  timestamp: Date;
  clientIp: string;
  userAgent: string;
}

interface TrackingEvent {
  trackingCode: string;
  sessionId: string;
  visitorId: string;
  eventType: 'pageview' | 'page_leave' | 'page_hide' | 'page_show' | 'custom_event';
  eventData?: Record<string, any>;
  page: {
    url: string;
    path: string;
    title: string;
    referrer?: string | null;
    queryParams?: Record<string, string> | null;
  };
  device: {
    type: 'mobile' | 'tablet' | 'desktop';
    browser: string;
    browserVersion?: string;
    os: string;
    screen: {
      width: number;
      height: number;
      availWidth?: number;
      availHeight?: number;
    };
  };
  timestamp: string;
  language?: string;
  timezone?: string;
  clientIp: string;
  userAgent: string;
}

/**
 * Hash IP address for privacy (one-way hash)
 */
function hashIp(ip: string): string {
  return crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'default-salt').digest('hex');
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'unknown';
  }
}

/**
 * Estimate location from timezone (privacy-friendly, no IP geolocation API)
 */
function estimateLocation(timezone?: string): { country: string; region: string } {
  if (!timezone) return { country: 'Unknown', region: 'Unknown' };

  // Basic timezone to region mapping
  const timezoneMap: Record<string, { country: string; region: string }> = {
    'America/New_York': { country: 'United States', region: 'Eastern' },
    'America/Chicago': { country: 'United States', region: 'Central' },
    'America/Denver': { country: 'United States', region: 'Mountain' },
    'America/Los_Angeles': { country: 'United States', region: 'Pacific' },
    'Europe/London': { country: 'United Kingdom', region: 'London' },
    'Europe/Paris': { country: 'France', region: 'Paris' },
    'Europe/Berlin': { country: 'Germany', region: 'Berlin' },
    'Asia/Tokyo': { country: 'Japan', region: 'Tokyo' },
    'Asia/Shanghai': { country: 'China', region: 'Shanghai' },
    'Asia/Kolkata': { country: 'India', region: 'Kolkata' },
    'Australia/Sydney': { country: 'Australia', region: 'Sydney' }
  };

  const location = timezoneMap[timezone];
  if (location) return location;

  // Fallback: extract country from timezone
  const parts = timezone.split('/');
  if (parts.length >= 2) {
    return { country: parts[0].replace('_', ' '), region: parts[1].replace('_', ' ') };
  }

  return { country: 'Unknown', region: 'Unknown' };
}

/**
 * Process incoming tracking event
 */
export const trackingService = {
  /**
   * Simple, fast event processing - minimal overhead
   */
  async processSimpleEvent(event: SimpleTrackingEvent): Promise<void> {
    try {
      // 1. Verify tracking code
      const website = await prisma.website.findUnique({
        where: { trackingCode: event.trackingCode },
        select: { id: true, userId: true, isActive: true }
      });

      if (!website) {
        console.warn(`[Track] Invalid code: ${event.trackingCode}`);
        return;
      }
      
      if (!website.isActive) {
        console.warn(`[Track] Website inactive: ${event.trackingCode}`);
        return;
      }

      // 2. Create or update visitor (first-time vs returning)
      const hashedIp = hashIp(event.clientIp);
      let visitor = await prisma.visitor.findFirst({
        where: {
          websiteId: website.id,
          fingerprint: hashedIp
        }
      });

      if (!visitor) {
        visitor = await prisma.visitor.create({
          data: {
            websiteId: website.id,
            fingerprint: hashedIp,
            firstSeen: event.timestamp,
            pageViews: 1
          }
        });
      } else {
        await prisma.visitor.update({
          where: { id: visitor.id },
          data: {
            pageViews: { increment: 1 }
          }
        });
      }

      // 3. Create or update session
      let session = await prisma.session.findFirst({
        where: {
          websiteId: website.id,
          visitorId: visitor.id,
          id: event.sessionId
        }
      });

      if (!session) {
        session = await prisma.session.create({
          data: {
            id: event.sessionId,
            websiteId: website.id,
            userId: website.userId,
            visitorId: visitor.id,
            startTime: event.timestamp,
            pageCount: 1
          }
        });
      } else {
        await prisma.session.update({
          where: { id: session.id },
          data: {
            endTime: event.timestamp,
            pageCount: { increment: 1 }
          }
        });
      }

      // 4. Store the event
      await prisma.event.create({
        data: {
          websiteId: website.id,
          sessionId: session.id,
          visitorId: visitor.id,
          eventType: 'pageview',
          pageUrl: event.url,
          referrer: event.referrer,
          timestamp: event.timestamp
        }
      });

      console.log(`[Track] ✓ ${event.url}`);
    } catch (error) {
      console.error('[Track] Error:', error);
      throw error;
    }
  },

  async processEvent(event: TrackingEvent): Promise<void> {
    try {
      // 1. Find website by tracking code
      const website = await prisma.website.findUnique({
        where: { trackingCode: event.trackingCode }
      });

      if (!website || !website.isActive) {
        console.warn(`[Tracking] Invalid or inactive tracking code: ${event.trackingCode}`);
        return; // Silently ignore invalid tracking codes
      }

      // 2. Hash sensitive data
      const hashedIp = hashIp(event.clientIp);
      const visitorFingerprint = crypto.createHash('sha256')
        .update(event.visitorId + website.id + hashedIp)
        .digest('hex');

      // 3. Find or create visitor
      let visitor = await prisma.visitor.findFirst({
        where: {
          websiteId: website.id,
          fingerprint: visitorFingerprint
        }
      });

      if (!visitor) {
        const location = estimateLocation(event.timezone);
        
        visitor = await prisma.visitor.create({
          data: {
            websiteId: website.id,
            fingerprint: visitorFingerprint,
            firstSeenAt: new Date(event.timestamp),
            lastSeenAt: new Date(event.timestamp),
            country: location.country,
            region: location.region,
            language: event.language || 'unknown',
            timezone: event.timezone || 'unknown'
          }
        });
      } else {
        // Update last seen
        await prisma.visitor.update({
          where: { id: visitor.id },
          data: { lastSeenAt: new Date(event.timestamp) }
        });
      }

      // 4. Find or create session
      let session = await prisma.session.findFirst({
        where: {
          websiteId: website.id,
          visitorId: visitor.id,
          sessionIdentifier: event.sessionId,
          endedAt: null // Active session
        }
      });

      if (!session) {
        session = await prisma.session.create({
          data: {
            websiteId: website.id,
            userId: website.userId,
            visitorId: visitor.id,
            sessionIdentifier: event.sessionId,
            startedAt: new Date(event.timestamp),
            device: event.device.type,
            browser: event.device.browser,
            os: event.device.os,
            referrer: event.page.referrer || null,
            utmSource: event.page.queryParams?.utm_source || null,
            utmMedium: event.page.queryParams?.utm_medium || null,
            utmCampaign: event.page.queryParams?.utm_campaign || null,
            pageViews: 0,
            duration: 0
          }
        });
      }

      // 5. Create event record
      await prisma.event.create({
        data: {
          websiteId: website.id,
          visitorId: visitor.id,
          sessionId: session.id,
          eventType: event.eventType,
          eventName: event.eventType === 'custom_event' 
            ? (event.eventData?.eventName || 'custom') 
            : event.eventType,
          pageUrl: event.page.url,
          pagePath: event.page.path,
          pageTitle: event.page.title,
          referrer: event.page.referrer || null,
          utmSource: event.page.queryParams?.utm_source || null,
          utmMedium: event.page.queryParams?.utm_medium || null,
          utmCampaign: event.page.queryParams?.utm_campaign || null,
          device: event.device.type,
          browser: event.device.browser,
          os: event.device.os,
          country: visitor.country,
          region: visitor.region,
          properties: event.eventData ? JSON.stringify(event.eventData) : null,
          timestamp: new Date(event.timestamp)
        }
      });

      // 6. Update session stats based on event type
      if (event.eventType === 'pageview') {
        await prisma.session.update({
          where: { id: session.id },
          data: {
            pageViews: { increment: 1 },
            lastActivityAt: new Date(event.timestamp)
          }
        });

        // Update or create page analytics
        const existingPageAnalytics = await prisma.pageAnalytics.findFirst({
          where: {
            websiteId: website.id,
            pagePath: event.page.path
          }
        });

        if (existingPageAnalytics) {
          await prisma.pageAnalytics.update({
            where: { id: existingPageAnalytics.id },
            data: {
              views: { increment: 1 },
              lastViewedAt: new Date(event.timestamp)
            }
          });
        } else {
          await prisma.pageAnalytics.create({
            data: {
              websiteId: website.id,
              pagePath: event.page.path,
              pageTitle: event.page.title,
              views: 1,
              lastViewedAt: new Date(event.timestamp)
            }
          });
        }
      }

      if (event.eventType === 'page_leave' && event.eventData?.duration) {
        const duration = Math.floor(event.eventData.duration / 1000); // Convert to seconds
        await prisma.session.update({
          where: { id: session.id },
          data: {
            duration: { increment: duration },
            endedAt: new Date(event.timestamp),
            lastActivityAt: new Date(event.timestamp)
          }
        });
      }

      // 7. Update aggregated metrics (daily stats)
      await this.updateAggregatedMetrics(website.id, event);

      // 8. Update device stats
      if (event.eventType === 'pageview') {
        await this.updateDeviceStats(website.id, event);
      }

      // 9. Update referrer stats
      if (event.eventType === 'pageview' && event.page.referrer) {
        await this.updateReferrerStats(website.id, event);
      }

      // 10. Update location stats
      if (event.eventType === 'pageview') {
        await this.updateLocationStats(website.id, visitor, event);
      }

      console.log(`[Tracking] Successfully processed ${event.eventType} for ${website.domain}`);

    } catch (error) {
      console.error('[Tracking] Error processing event:', error);
      throw error;
    }
  },

  async updateAggregatedMetrics(websiteId: string, event: TrackingEvent): Promise<void> {
    const date = new Date(event.timestamp);
    date.setHours(0, 0, 0, 0); // Start of day

    const existing = await prisma.aggregatedMetrics.findFirst({
      where: {
        websiteId,
        date,
        period: 'day'
      }
    });

    if (existing) {
      await prisma.aggregatedMetrics.update({
        where: { id: existing.id },
        data: {
          pageViews: event.eventType === 'pageview' ? { increment: 1 } : existing.pageViews,
          updatedAt: new Date()
        }
      });
    } else {
      await prisma.aggregatedMetrics.create({
        data: {
          websiteId,
          date,
          period: 'day',
          pageViews: event.eventType === 'pageview' ? 1 : 0,
          uniqueVisitors: 0, // Will be calculated by a background job
          avgSessionDuration: 0,
          bounceRate: 0
        }
      });
    }
  },

  async updateDeviceStats(websiteId: string, event: TrackingEvent): Promise<void> {
    const date = new Date(event.timestamp);
    date.setHours(0, 0, 0, 0);

    const existing = await prisma.deviceStats.findFirst({
      where: {
        websiteId,
        date,
        deviceType: event.device.type
      }
    });

    if (existing) {
      await prisma.deviceStats.update({
        where: { id: existing.id },
        data: {
          count: { increment: 1 }
        }
      });
    } else {
      await prisma.deviceStats.create({
        data: {
          websiteId,
          date,
          deviceType: event.device.type,
          count: 1
        }
      });
    }
  },

  async updateReferrerStats(websiteId: string, event: TrackingEvent): Promise<void> {
    if (!event.page.referrer) return;

    const date = new Date(event.timestamp);
    date.setHours(0, 0, 0, 0);

    const existing = await prisma.referrerStats.findFirst({
      where: {
        websiteId,
        date,
        referrer: event.page.referrer
      }
    });

    if (existing) {
      await prisma.referrerStats.update({
        where: { id: existing.id },
        data: {
          count: { increment: 1 }
        }
      });
    } else {
      await prisma.referrerStats.create({
        data: {
          websiteId,
          date,
          referrer: event.page.referrer,
          count: 1
        }
      });
    }
  },

  async updateLocationStats(websiteId: string, visitor: any, event: TrackingEvent): Promise<void> {
    const date = new Date(event.timestamp);
    date.setHours(0, 0, 0, 0);

    const existing = await prisma.locationStats.findFirst({
      where: {
        websiteId,
        date,
        country: visitor.country
      }
    });

    if (existing) {
      await prisma.locationStats.update({
        where: { id: existing.id },
        data: {
          count: { increment: 1 }
        }
      });
    } else {
      await prisma.locationStats.create({
        data: {
          websiteId,
          date,
          country: visitor.country,
          region: visitor.region,
          city: null,
          count: 1
        }
      });
    }
  }
};
