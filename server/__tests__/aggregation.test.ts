/**
 * Integration tests for event aggregation service
 * Tests metric calculations against real event data
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { PrismaClient } from "@prisma/client";
import aggregation from "../services/aggregation";

const prisma = new PrismaClient();

describe("Event Aggregation Service", () => {
  let testWebsiteId: string;

  beforeAll(async () => {
    // Create test website
    const website = await prisma.website.create({
      data: {
        name: "Test Website",
        domain: `test-${Date.now()}.com`,
        trackingCode: `pm-test-${Date.now()}`,
        userId: "test-user",
      },
    });
    testWebsiteId = website.id;

    // Create test events
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    await prisma.event.create({
      data: {
        websiteId: testWebsiteId,
        eventType: "pageview",
        pageUrl: "https://example.com/page1",
        sessionId: "sess-1",
        visitorId: "vis-1",
        timestamp: yesterday,
      },
    });

    await prisma.event.create({
      data: {
        websiteId: testWebsiteId,
        eventType: "pageview",
        pageUrl: "https://example.com/page2",
        sessionId: "sess-1",
        visitorId: "vis-1",
        timestamp: now,
      },
    });

    await prisma.event.create({
      data: {
        websiteId: testWebsiteId,
        eventType: "pageview",
        pageUrl: "https://example.com/page1",
        sessionId: "sess-2",
        visitorId: "vis-2",
        timestamp: now,
      },
    });
  });

  afterAll(async () => {
    // Clean up test data
    await prisma.event.deleteMany({
      where: { websiteId: testWebsiteId },
    });

    await prisma.website.delete({
      where: { id: testWebsiteId },
    });

    await prisma.$disconnect();
  });

  describe("countPageViews", () => {
    it("should count pageviews in date range", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const count = await aggregation.countPageViews(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      expect(count).toBe(3);
    });

    it("should return 0 for empty date range", async () => {
      const futureDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const evenLaterDate = new Date(futureDate.getTime() + 24 * 60 * 60 * 1000);

      const count = await aggregation.countPageViews(
        testWebsiteId,
        futureDate,
        evenLaterDate,
      );

      expect(count).toBe(0);
    });
  });

  describe("countUniqueVisitors", () => {
    it("should count unique visitors", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const count = await aggregation.countUniqueVisitors(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      expect(count).toBe(2); // vis-1 and vis-2
    });
  });

  describe("countSessions", () => {
    it("should count unique sessions", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const count = await aggregation.countSessions(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      expect(count).toBe(2); // sess-1 and sess-2
    });
  });

  describe("calculateBounceRate", () => {
    it("should calculate bounce rate (single page sessions)", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const bounceRate = await aggregation.calculateBounceRate(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      // sess-1 has 2 pages, sess-2 has 1 page
      // 1 bounce / 2 sessions = 50%
      expect(bounceRate).toBe(50);
    });
  });

  describe("calculateAvgSessionDuration", () => {
    it("should calculate average session duration", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const duration = await aggregation.calculateAvgSessionDuration(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      // Should return a number (duration in seconds)
      expect(typeof duration).toBe("number");
      expect(duration).toBeGreaterThanOrEqual(0);
    });
  });

  describe("getTopPages", () => {
    it("should return top pages sorted by views", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const topPages = await aggregation.getTopPages(
        testWebsiteId,
        twoDaysAgo,
        now,
        10,
      );

      expect(topPages.length).toBeGreaterThan(0);
      expect(topPages[0].views).toBeGreaterThanOrEqual(topPages[1]?.views || 0);
    });

    it("should respect limit parameter", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const topPages = await aggregation.getTopPages(
        testWebsiteId,
        twoDaysAgo,
        now,
        1,
      );

      expect(topPages.length).toBeLessThanOrEqual(1);
    });
  });

  describe("getTrafficSources", () => {
    it("should return traffic sources", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const sources = await aggregation.getTrafficSources(
        testWebsiteId,
        twoDaysAgo,
        now,
        10,
      );

      // Should include "Direct" since no referrer was set
      expect(sources.length).toBeGreaterThan(0);
      expect(sources.some((s) => s.referrer === "Direct")).toBe(true);
    });
  });

  describe("getDeviceStats", () => {
    it("should return device statistics", async () => {
      const now = new Date();
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      const devices = await aggregation.getDeviceStats(
        testWebsiteId,
        twoDaysAgo,
        now,
      );

      expect(devices).toHaveProperty("mobile");
      expect(devices).toHaveProperty("desktop");
      expect(devices).toHaveProperty("tablet");
      expect(devices).toHaveProperty("other");
    });
  });

  describe("getDashboardMetrics", () => {
    it("should return comprehensive dashboard metrics", async () => {
      const metrics = await aggregation.getDashboardMetrics(testWebsiteId, 7);

      expect(metrics).toHaveProperty("pageViews");
      expect(metrics).toHaveProperty("pageViewsChange");
      expect(metrics).toHaveProperty("uniqueVisitors");
      expect(metrics).toHaveProperty("uniqueVisitorsChange");
      expect(metrics).toHaveProperty("sessions");
      expect(metrics).toHaveProperty("sessionsChange");
      expect(metrics).toHaveProperty("avgSessionDuration");
      expect(metrics).toHaveProperty("avgSessionDurationChange");
      expect(metrics).toHaveProperty("bounceRate");
      expect(metrics).toHaveProperty("bounceRateChange");

      expect(metrics.pageViews).toBeGreaterThan(0);
      expect(metrics.uniqueVisitors).toBeGreaterThan(0);
      expect(metrics.sessions).toBeGreaterThan(0);
    });
  });
});

describe("Dashboard API Endpoints", () => {
  // These tests would require setting up Express server
  // For now, documented as integration tests
  it.skip("GET /api/v1/dashboard/metrics should return real metrics", () => {
    // Test would: 
    // 1. Create test website and events
    // 2. Call metrics endpoint
    // 3. Verify metrics match aggregation service
  });

  it.skip("GET /api/v1/dashboard/top-pages should return real top pages", () => {
    // Test would:
    // 1. Create test events for multiple pages
    // 2. Call top-pages endpoint
    // 3. Verify pages are sorted by views
  });

  it.skip("GET /api/v1/dashboard/pageviews should return time series data", () => {
    // Test would:
    // 1. Create events spread over multiple days
    // 2. Call pageviews endpoint
    // 3. Verify data is grouped by date
  });
});
