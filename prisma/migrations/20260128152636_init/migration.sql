-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "apiKey" TEXT,
    "apiKeyHash" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- CreateTable
CREATE TABLE "websites" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "domain" TEXT NOT NULL,
    "trackingCode" TEXT NOT NULL,
    "publicUrl" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "websites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "events" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "websiteId" TEXT NOT NULL,
    "sessionId" TEXT,
    "visitorId" TEXT,
    "eventType" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "referrer" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "properties" TEXT,
    CONSTRAINT "events_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "events_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "websiteId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "visitorId" TEXT,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "pageCount" INTEGER NOT NULL DEFAULT 0,
    "deviceType" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "country" TEXT,
    "city" TEXT,
    CONSTRAINT "sessions_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "sessions_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "visitors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "visitors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "websiteId" TEXT NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "firstSeen" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" DATETIME NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "sessionCount" INTEGER NOT NULL DEFAULT 0,
    "bounceCount" INTEGER NOT NULL DEFAULT 0,
    "country" TEXT,
    "city" TEXT,
    CONSTRAINT "visitors_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "aggregated_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "websiteId" TEXT NOT NULL,
    "bucket" DATETIME NOT NULL,
    "period" TEXT NOT NULL,
    "pageViews" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "sessions" INTEGER NOT NULL DEFAULT 0,
    "bounceRate" REAL,
    "avgSessionDuration" REAL,
    "mobileViews" INTEGER NOT NULL DEFAULT 0,
    "desktopViews" INTEGER NOT NULL DEFAULT 0,
    "tabletViews" INTEGER NOT NULL DEFAULT 0,
    "topReferrers" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "aggregated_metrics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "page_analytics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "websiteId" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "pageTitle" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "uniqueVisitors" INTEGER NOT NULL DEFAULT 0,
    "avgSessionDuration" REAL,
    "bounceRate" REAL,
    "exitRate" REAL,
    "topReferrers" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "page_analytics_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "websites" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_apiKey_key" ON "users"("apiKey");

-- CreateIndex
CREATE UNIQUE INDEX "users_apiKeyHash_key" ON "users"("apiKeyHash");

-- CreateIndex
CREATE UNIQUE INDEX "websites_domain_key" ON "websites"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "websites_trackingCode_key" ON "websites"("trackingCode");

-- CreateIndex
CREATE INDEX "websites_userId_idx" ON "websites"("userId");

-- CreateIndex
CREATE INDEX "events_websiteId_idx" ON "events"("websiteId");

-- CreateIndex
CREATE INDEX "events_sessionId_idx" ON "events"("sessionId");

-- CreateIndex
CREATE INDEX "events_visitorId_idx" ON "events"("visitorId");

-- CreateIndex
CREATE INDEX "events_timestamp_idx" ON "events"("timestamp");

-- CreateIndex
CREATE INDEX "events_pageUrl_idx" ON "events"("pageUrl");

-- CreateIndex
CREATE INDEX "sessions_websiteId_idx" ON "sessions"("websiteId");

-- CreateIndex
CREATE INDEX "sessions_userId_idx" ON "sessions"("userId");

-- CreateIndex
CREATE INDEX "sessions_visitorId_idx" ON "sessions"("visitorId");

-- CreateIndex
CREATE INDEX "sessions_startTime_idx" ON "sessions"("startTime");

-- CreateIndex
CREATE INDEX "visitors_websiteId_idx" ON "visitors"("websiteId");

-- CreateIndex
CREATE INDEX "visitors_firstSeen_idx" ON "visitors"("firstSeen");

-- CreateIndex
CREATE UNIQUE INDEX "visitors_websiteId_fingerprint_key" ON "visitors"("websiteId", "fingerprint");

-- CreateIndex
CREATE INDEX "aggregated_metrics_websiteId_idx" ON "aggregated_metrics"("websiteId");

-- CreateIndex
CREATE INDEX "aggregated_metrics_bucket_idx" ON "aggregated_metrics"("bucket");

-- CreateIndex
CREATE UNIQUE INDEX "aggregated_metrics_websiteId_bucket_period_key" ON "aggregated_metrics"("websiteId", "bucket", "period");

-- CreateIndex
CREATE INDEX "page_analytics_websiteId_idx" ON "page_analytics"("websiteId");

-- CreateIndex
CREATE INDEX "page_analytics_views_idx" ON "page_analytics"("views");

-- CreateIndex
CREATE UNIQUE INDEX "page_analytics_websiteId_pageUrl_key" ON "page_analytics"("websiteId", "pageUrl");
