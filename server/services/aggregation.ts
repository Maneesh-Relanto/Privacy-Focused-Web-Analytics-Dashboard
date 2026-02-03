/**
 * Event Aggregation Service
 * Calculates analytics metrics from raw events
 * Handles: pageviews, unique visitors, bounce rate, session duration, traffic sources, etc.
 */

import prisma from '../lib/prisma';

/**
 * Interface for aggregated metrics response
 */
export interface DashboardMetrics {
  pageViews: number;
  pageViewsChange: number;
  uniqueVisitors: number;
  uniqueVisitorsChange: number;
  sessions: number;
  sessionsChange: number;
  avgSessionDuration: number;
  avgSessionDurationChange: number;
  bounceRate: number;
  bounceRateChange: number;
}

export interface TopPage {
  url: string;
  pageTitle?: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

export interface TrafficSource {
  referrer: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export interface DeviceStats {
  mobile: number;
  desktop: number;
  tablet: number;
  other: number;
}

/**
 * Get date range for filtering events
 */
function getDateRange(days: number): { start: Date; end: Date } {
  const end = new Date();
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end };
}

/**
 * Count pageviews for a website in a given date range
 */
export async function countPageViews(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const count = await prisma.event.count({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
  });
  return count;
}

/**
 * Get unique visitor count
 */
export async function countUniqueVisitors(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const result = await prisma.event.findMany({
    where: {
      websiteId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    distinct: ["visitorId"],
    select: { visitorId: true },
  });

  return result.filter((r) => r.visitorId).length;
}

/**
 * Get session count (unique sessions with at least one pageview)
 */
export async function countSessions(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const result = await prisma.event.findMany({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    distinct: ["sessionId"],
    select: { sessionId: true },
  });

  return result.filter((r) => r.sessionId).length;
}

/**
 * Calculate bounce rate (sessions with only 1 pageview / total sessions)
 */
export async function calculateBounceRate(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  // Get all events in range
  const events = await prisma.event.findMany({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { sessionId: true },
  });

  if (events.length === 0) return 0;

  // Count pageviews per session
  const sessionPageViews = new Map<string, number>();
  events.forEach((event) => {
    if (event.sessionId) {
      sessionPageViews.set(
        event.sessionId,
        (sessionPageViews.get(event.sessionId) || 0) + 1
      );
    }
  });

  // Count single-page sessions (bounces)
  const bounces = Array.from(sessionPageViews.values()).filter(
    (count) => count === 1
  ).length;
  const totalSessions = sessionPageViews.size;

  return totalSessions > 0 ? Math.round((bounces / totalSessions) * 100) : 0;
}

/**
 * Calculate average session duration in seconds
 * Using time between first and last event in a session
 */
export async function calculateAvgSessionDuration(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<number> {
  const events = await prisma.event.findMany({
    where: {
      websiteId,
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { sessionId: true, timestamp: true },
    orderBy: { timestamp: "asc" },
  });

  if (events.length === 0) return 0;

  // Group events by session and calculate duration
  const sessionDurations = new Map<string, number>();
  const sessionTimes = new Map<string, { first: Date; last: Date }>();

  events.forEach((event) => {
    if (event.sessionId) {
      const times = sessionTimes.get(event.sessionId);
      if (!times) {
        sessionTimes.set(event.sessionId, {
          first: event.timestamp,
          last: event.timestamp,
        });
      } else {
        times.last = event.timestamp;
      }
    }
  });

  // Calculate duration for each session
  sessionTimes.forEach((times, sessionId) => {
    const durationSeconds =
      (times.last.getTime() - times.first.getTime()) / 1000;
    sessionDurations.set(sessionId, durationSeconds);
  });

  // Calculate average
  const durations = Array.from(sessionDurations.values());
  if (durations.length === 0) return 0;

  const avgDuration =
    durations.reduce((a, b) => a + b, 0) / durations.length;
  return Math.round(avgDuration);
}

/**
 * Get top pages by pageview count
 */
export async function getTopPages(
  websiteId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<TopPage[]> {
  const events = await prisma.event.findMany({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      pageUrl: true,
      sessionId: true,
      visitorId: true,
    },
  });

  if (events.length === 0) return [];

  // Group by page
  const pageStats = new Map<
    string,
    {
      views: number;
      sessions: Set<string>;
      visitors: Set<string>;
    }
  >();

  events.forEach((event) => {
    const url = event.pageUrl;
    if (!pageStats.has(url)) {
      pageStats.set(url, {
        views: 0,
        sessions: new Set(),
        visitors: new Set(),
      });
    }

    const stats = pageStats.get(url)!;
    stats.views++;
    if (event.sessionId) stats.sessions.add(event.sessionId);
    if (event.visitorId) stats.visitors.add(event.visitorId);
  });

  // Convert to array and sort by views
  const topPages = Array.from(pageStats.entries())
    .map(([url, stats]) => {
      const bounceRate = calculatePageBounceRate(events, url);
      const avgDuration = calculatePageAvgDuration(events, url);

      return {
        url,
        pageTitle: undefined, // Could be added from additional context
        views: stats.views,
        uniqueVisitors: stats.visitors.size,
        bounceRate,
        avgSessionDuration: avgDuration,
      };
    })
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);

  return topPages;
}

/**
 * Helper: Calculate bounce rate for specific page
 */
function calculatePageBounceRate(
  events: Array<{ pageUrl: string; sessionId: string | null }>,
  pageUrl: string
): number {
  const pageEvents = events.filter((e) => e.pageUrl === pageUrl);
  if (pageEvents.length === 0) return 0;

  const sessionPageCounts = new Map<string, number>();
  events.forEach((event) => {
    if (event.sessionId) {
      sessionPageCounts.set(
        event.sessionId,
        (sessionPageCounts.get(event.sessionId) || 0) + 1
      );
    }
  });

  const pageSessions = new Set(pageEvents.map((e) => e.sessionId));
  const bounces = Array.from(pageSessions).filter(
    (sessionId) => sessionPageCounts.get(sessionId as string) === 1
  ).length;

  return pageSessions.size > 0
    ? Math.round((bounces / pageSessions.size) * 100)
    : 0;
}

/**
 * Helper: Calculate average session duration for specific page
 */
function calculatePageAvgDuration(
  events: Array<{ pageUrl: string; sessionId: string | null }>,
  pageUrl: string
): number {
  const pageEvents = events.filter((e) => e.pageUrl === pageUrl);
  if (pageEvents.length === 0) return 0;

  // For now, return a simple calculation
  return Math.round(Math.random() * 300); // Placeholder
}

/**
 * Get traffic sources (referrers)
 */
export async function getTrafficSources(
  websiteId: string,
  startDate: Date,
  endDate: Date,
  limit: number = 10
): Promise<TrafficSource[]> {
  const events = await prisma.event.findMany({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      referrer: true,
      sessionId: true,
      visitorId: true,
    },
  });

  if (events.length === 0) return [];

  // Group by referrer
  const referrerStats = new Map<
    string,
    {
      sessions: Set<string>;
      visitors: Set<string>;
      pageViews: number;
    }
  >();

  events.forEach((event) => {
    const referrer = event.referrer || "Direct";

    if (!referrerStats.has(referrer)) {
      referrerStats.set(referrer, {
        sessions: new Set(),
        visitors: new Set(),
        pageViews: 0,
      });
    }

    const stats = referrerStats.get(referrer)!;
    stats.pageViews++;
    if (event.sessionId) stats.sessions.add(event.sessionId);
    if (event.visitorId) stats.visitors.add(event.visitorId);
  });

  // Convert to array and sort
  const sources = Array.from(referrerStats.entries())
    .map(([referrer, stats]) => ({
      referrer,
      visitors: stats.visitors.size,
      sessions: stats.sessions.size,
      pageViews: stats.pageViews,
    }))
    .sort((a, b) => b.pageViews - a.pageViews)
    .slice(0, limit);

  return sources;
}

/**
 * Get device statistics
 */
export async function getDeviceStats(
  websiteId: string,
  startDate: Date,
  endDate: Date
): Promise<DeviceStats> {
  const events = await prisma.event.findMany({
    where: {
      websiteId,
      eventType: "pageview",
      timestamp: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: { visitorId: true },
    // Note: device info would need to be stored or inferred from user agent
  });

  // TODO: This would require device info to be tracked
  // For now, return placeholder data
  return {
    mobile: Math.round(events.length * 0.4),
    desktop: Math.round(events.length * 0.5),
    tablet: Math.round(events.length * 0.08),
    other: Math.round(events.length * 0.02),
  };
}

/**
 * Get comprehensive dashboard metrics for date range
 */
export async function getDashboardMetrics(
  websiteId: string,
  daysBack: number = 7
): Promise<DashboardMetrics> {
  const { start: currentStart, end: currentEnd } = getDateRange(daysBack);
  const { start: prevStart, end: prevEnd } = getDateRange(daysBack * 2);

  // Current period metrics
  const pageViews = await countPageViews(websiteId, currentStart, currentEnd);
  const uniqueVisitors = await countUniqueVisitors(
    websiteId,
    currentStart,
    currentEnd
  );
  const sessions = await countSessions(websiteId, currentStart, currentEnd);
  const avgSessionDuration = await calculateAvgSessionDuration(
    websiteId,
    currentStart,
    currentEnd
  );
  const bounceRate = await calculateBounceRate(
    websiteId,
    currentStart,
    currentEnd
  );

  // Previous period metrics for comparison
  const prevPageViews = await countPageViews(websiteId, prevStart, prevEnd);
  const prevUniqueVisitors = await countUniqueVisitors(
    websiteId,
    prevStart,
    prevEnd
  );
  const prevSessions = await countSessions(websiteId, prevStart, prevEnd);
  const prevAvgSessionDuration = await calculateAvgSessionDuration(
    websiteId,
    prevStart,
    prevEnd
  );
  const prevBounceRate = await calculateBounceRate(websiteId, prevStart, prevEnd);

  // Calculate percentage changes
  const pageViewsChange = calculatePercentChange(prevPageViews, pageViews);
  const uniqueVisitorsChange = calculatePercentChange(
    prevUniqueVisitors,
    uniqueVisitors
  );
  const sessionsChange = calculatePercentChange(prevSessions, sessions);
  const avgSessionDurationChange = calculatePercentChange(
    prevAvgSessionDuration,
    avgSessionDuration
  );
  const bounceRateChange = bounceRate - prevBounceRate;

  return {
    pageViews,
    pageViewsChange,
    uniqueVisitors,
    uniqueVisitorsChange,
    sessions,
    sessionsChange,
    avgSessionDuration,
    avgSessionDurationChange,
    bounceRate,
    bounceRateChange,
  };
}

/**
 * Helper: Calculate percentage change between two values
 */
function calculatePercentChange(prev: number, current: number): number {
  if (prev === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - prev) / prev) * 100);
}

export default {
  getDashboardMetrics,
  getTopPages,
  getTrafficSources,
  getDeviceStats,
  countPageViews,
  countUniqueVisitors,
  countSessions,
  calculateBounceRate,
  calculateAvgSessionDuration,
};
