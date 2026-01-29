# Event Collection API Guide

**[← Back to README](../README.md)** | **[Documentation Index](./INDEX.md)** | **[API Docs](./API_DOCUMENTATION.md)** | **[Developer Guide](./DEVELOPER_GUIDE.md)**

---

## Overview

The Event Collection API allows you to track user interactions and analytics data from your websites. Events are collected through the `/api/v1/events` endpoints and stored in the database for later aggregation and analysis.

**Base URL:** `http://localhost:3000/api/v1/events`

---

## Prerequisites

1. You must have a **website registered** with a valid `trackingCode`
   - See [Website Management Guide](./WEBSITE_MANAGEMENT_GUIDE.md) to register a website
2. You have the website's `trackingCode` (format: `pm-xxxx-timestamp`)
3. You understand the Event data model (see below)

---

## Event Data Model

### Event Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `trackingCode` | string | ✅ Yes | Website tracking code (format: `pm-*`) |
| `eventType` | enum | ✅ Yes | Type of event: `pageview`, `click`, `custom` |
| `url` | string (URL) | ✅ Yes | The page URL where event occurred |
| `referrer` | string (URL) | ❌ No | Referrer URL (where visitor came from) |
| `sessionId` | string | ✅ Yes | Unique session identifier |
| `visitorId` | string | ✅ Yes | Unique visitor identifier |
| `deviceType` | enum | ❌ No | Device type: `mobile`, `tablet`, `desktop` |
| `browser` | string | ❌ No | Browser name (e.g., "Chrome", "Firefox") |
| `os` | string | ❌ No | Operating system (e.g., "Windows", "macOS") |
| `location` | string | ❌ No | Geographic location (e.g., "US", "GB") |
| `timestamp` | number | ❌ No | Event timestamp in milliseconds (server uses current time if omitted) |
| `properties` | object | ❌ No | Custom properties as key-value pairs |

### Example Event Object

```json
{
  "trackingCode": "pm-abc123-1704067200000",
  "eventType": "pageview",
  "url": "https://example.com/blog/article",
  "referrer": "https://google.com",
  "sessionId": "sess-user-123-session-456",
  "visitorId": "vis-user-unique-id-789",
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "location": "US",
  "timestamp": 1704067200000,
  "properties": {
    "articleId": "art-123",
    "readingTime": 5
  }
}
```

---

## API Endpoints

### 1. Create Single Event

**Endpoint:** `POST /api/v1/events`

**Purpose:** Submit a single event to the tracking system

**Request Body:**
```json
{
  "trackingCode": "pm-abc123-1704067200000",
  "eventType": "pageview",
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "sessionId": "sess-123",
  "visitorId": "vis-123",
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "location": "US"
}
```

**Success Response (201 Created):**
```json
{
  "id": "clv1234567890",
  "websiteId": "web-123",
  "eventType": "pageview",
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "sessionId": "sess-123",
  "visitorId": "vis-123",
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "location": "US",
  "createdAt": "2026-01-28T20:00:00.000Z"
}
```

**Error Response (400 - Invalid Data):**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Invalid event data",
  "details": {
    "fieldErrors": {
      "trackingCode": ["Invalid tracking code format"]
    }
  }
}
```

**Error Response (404 - Website Not Found):**
```json
{
  "error": "NOT_FOUND",
  "message": "Website with this tracking code not found"
}
```

---

### 2. Create Multiple Events (Batch)

**Endpoint:** `POST /api/v1/events/batch`

**Purpose:** Submit multiple events in a single request (recommended for performance)

**Request Body:**
```json
{
  "events": [
    {
      "trackingCode": "pm-abc123-1704067200000",
      "eventType": "pageview",
      "url": "https://example.com/page1",
      "sessionId": "sess-123",
      "visitorId": "vis-123",
      "deviceType": "desktop",
      "browser": "Chrome"
    },
    {
      "trackingCode": "pm-abc123-1704067200000",
      "eventType": "click",
      "url": "https://example.com/page1",
      "sessionId": "sess-123",
      "visitorId": "vis-123",
      "deviceType": "desktop",
      "browser": "Chrome",
      "properties": {
        "buttonId": "cta-button"
      }
    }
  ]
}
```

**Success Response (201 Created):**
```json
{
  "success": true,
  "eventsCreated": 2,
  "events": [
    {
      "id": "clv1234567890",
      "websiteId": "web-123",
      "eventType": "pageview",
      "url": "https://example.com/page1",
      "createdAt": "2026-01-28T20:00:00.000Z"
    },
    {
      "id": "clv1234567891",
      "websiteId": "web-123",
      "eventType": "click",
      "url": "https://example.com/page1",
      "createdAt": "2026-01-28T20:00:00.001Z"
    }
  ],
  "message": "Successfully created 2 events"
}
```

**Partial Success Response (207 Multi-Status):**
```json
{
  "success": false,
  "eventsCreated": 1,
  "events": [
    {
      "id": "clv1234567890",
      "websiteId": "web-123",
      "eventType": "pageview",
      "url": "https://example.com/page1",
      "createdAt": "2026-01-28T20:00:00.000Z"
    }
  ],
  "errors": [
    {
      "index": 1,
      "error": "NOT_FOUND",
      "message": "Website with tracking code \"invalid\" not found"
    }
  ],
  "message": "Created 1 events with 1 errors"
}
```

---

### 3. Get Events

**Endpoint:** `GET /api/v1/events?trackingCode=pm-xxx&eventType=pageview&limit=100&offset=0`

**Purpose:** Retrieve events for a website with optional filtering

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `trackingCode` | string | ✅ Yes | Website tracking code |
| `eventType` | string | ❌ No | Filter by event type (`pageview`, `click`, `custom`) |
| `limit` | number | ❌ No | Max results (default: 100, max: 1000) |
| `offset` | number | ❌ No | Pagination offset (default: 0) |

**Success Response (200 OK):**
```json
{
  "events": [
    {
      "id": "clv1234567890",
      "eventType": "pageview",
      "url": "https://example.com/page",
      "referrer": "https://google.com",
      "sessionId": "sess-123",
      "visitorId": "vis-123",
      "deviceType": "desktop",
      "browser": "Chrome",
      "os": "Windows",
      "location": "US",
      "createdAt": "2026-01-28T20:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "limit": 100,
    "offset": 0
  }
}
```

---

### 4. Get Specific Event

**Endpoint:** `GET /api/v1/events/:id`

**Purpose:** Retrieve a specific event by ID

**Success Response (200 OK):**
```json
{
  "id": "clv1234567890",
  "websiteId": "web-123",
  "eventType": "pageview",
  "url": "https://example.com/page",
  "referrer": "https://google.com",
  "sessionId": "sess-123",
  "visitorId": "vis-123",
  "deviceType": "desktop",
  "browser": "Chrome",
  "os": "Windows",
  "location": "US",
  "properties": null,
  "createdAt": "2026-01-28T20:00:00.000Z"
}
```

---

## cURL Examples

### Step 1: Get a Website Tracking Code

First, register a website to get the tracking code (see [Website Management Guide](./WEBSITE_MANAGEMENT_GUIDE.md)):

```bash
curl -X POST http://localhost:3000/api/v1/websites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Website",
    "domain": "example.com",
    "description": "My example website"
  }'
```

This returns:
```json
{
  "id": "web-123",
  "trackingCode": "pm-abc123-1704067200000",
  "name": "My Website",
  "domain": "example.com"
}
```

### Step 2: Send a Single Event

```bash
curl -X POST http://localhost:3000/api/v1/events \
  -H "Content-Type: application/json" \
  -d '{
    "trackingCode": "pm-abc123-1704067200000",
    "eventType": "pageview",
    "url": "https://example.com/blog/article-1",
    "referrer": "https://google.com",
    "sessionId": "sess-user123-session1",
    "visitorId": "vis-user123",
    "deviceType": "desktop",
    "browser": "Chrome",
    "os": "Windows",
    "location": "US"
  }'
```

### Step 3: Send Batch Events

```bash
curl -X POST http://localhost:3000/api/v1/events/batch \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      {
        "trackingCode": "pm-abc123-1704067200000",
        "eventType": "pageview",
        "url": "https://example.com/page1",
        "sessionId": "sess-123",
        "visitorId": "vis-123",
        "deviceType": "desktop",
        "browser": "Chrome",
        "os": "Windows"
      },
      {
        "trackingCode": "pm-abc123-1704067200000",
        "eventType": "pageview",
        "url": "https://example.com/page2",
        "sessionId": "sess-123",
        "visitorId": "vis-123",
        "deviceType": "desktop",
        "browser": "Chrome",
        "os": "Windows"
      },
      {
        "trackingCode": "pm-abc123-1704067200000",
        "eventType": "click",
        "url": "https://example.com/page2",
        "sessionId": "sess-123",
        "visitorId": "vis-123",
        "deviceType": "desktop",
        "browser": "Chrome",
        "properties": {
          "buttonId": "subscribe-btn"
        }
      }
    ]
  }'
```

### Step 4: Retrieve Events

```bash
# Get all events for a website
curl http://localhost:3000/api/v1/events?trackingCode=pm-abc123-1704067200000

# Get only pageview events
curl http://localhost:3000/api/v1/events?trackingCode=pm-abc123-1704067200000&eventType=pageview

# Get with pagination
curl http://localhost:3000/api/v1/events?trackingCode=pm-abc123-1704067200000&limit=50&offset=0

# Get specific event
curl http://localhost:3000/api/v1/events/clv1234567890
```

---

## Implementation Details

### Event Storage

Events are stored in the `Event` table in SQLite with the following structure:

```prisma
model Event {
  id          String   @id @default(cuid())
  websiteId   String
  website     Website  @relation(fields: [websiteId], references: [id])
  
  eventType   String
  url         String
  referrer    String?
  sessionId   String
  visitorId   String
  deviceType  String?
  browser     String?
  os          String?
  location    String?
  properties  String?  // JSON stringified
  
  createdAt   DateTime @default(now())
  
  @@index([websiteId])
  @@index([sessionId])
  @@index([visitorId])
  @@index([createdAt])
}
```

### Validation

All events are validated using Zod schemas:

- **trackingCode** - Must match pattern `pm-*`
- **eventType** - Must be one of: `pageview`, `click`, `custom`
- **url** - Must be a valid URL
- **sessionId** - Required, non-empty string
- **visitorId** - Required, non-empty string
- **deviceType** - Optional, must be one of: `mobile`, `tablet`, `desktop`
- **browser** - Optional, max 100 characters
- **os** - Optional, max 100 characters
- **location** - Optional, max 100 characters

### Error Handling

- **400 Bad Request** - Invalid event data or schema validation failure
- **404 Not Found** - Website tracking code not found
- **207 Multi-Status** - Batch request with partial failures
- **500 Internal Server Error** - Server processing error

---

## Best Practices

### 1. Use Batch API for Performance

Instead of sending individual events:
```bash
# ❌ Slow - Multiple requests
curl -X POST http://localhost:3000/api/v1/events -d {...}
curl -X POST http://localhost:3000/api/v1/events -d {...}
curl -X POST http://localhost:3000/api/v1/events -d {...}

# ✅ Fast - Single batch request
curl -X POST http://localhost:3000/api/v1/events/batch -d {...}
```

### 2. Always Include Device Information

Include device type, browser, and OS for better analytics:
```json
{
  "deviceType": "mobile",
  "browser": "Safari",
  "os": "iOS"
}
```

### 3. Use Consistent Session/Visitor IDs

Use the same `sessionId` for events in the same session, and same `visitorId` for all events from a visitor:
```json
{
  "sessionId": "sess-[timestamp]-[random]",
  "visitorId": "vis-[unique-user-id]"
}
```

### 4. Include Referrer Information

Helps track traffic sources:
```json
{
  "referrer": "https://google.com/search?q=analytics"
}
```

### 5. Use Custom Properties for Extensibility

Add custom data as needed:
```json
{
  "properties": {
    "articleId": "art-123",
    "author": "john-doe",
    "category": "tech"
  }
}
```

---

## Testing Checklist

- [ ] Created a website and have the tracking code
- [ ] Can send a single event successfully
- [ ] Can send batch events successfully
- [ ] Can retrieve events for a website
- [ ] Validation rejects invalid tracking codes
- [ ] Validation rejects invalid URLs
- [ ] Handles missing required fields
- [ ] Batch API handles partial failures gracefully

---

## Next Steps

After implementing event collection:

1. **Build the Tracking Script** - Lightweight JavaScript to embed on websites
2. **Implement Event Aggregation** - Process raw events into metrics
3. **Real-time Dashboard Updates** - Connect real event data to the dashboard
4. **Analytics Processing** - Calculate bounce rates, session duration, etc.

---

## Support & Troubleshooting

### Event not being recorded
- Check that the `trackingCode` is valid
- Verify the website is registered
- Ensure the JSON format is correct

### Validation errors
- Check all required fields are present
- Verify field formats (URLs, enum values)
- Check field lengths (max 100 for string fields)

### Batch failures
- Review the `errors` array in the response
- Check index of failed event in original array
- Validate each event individually if needed

---

**[← Back to README](../README.md)** | **[Documentation Index](./INDEX.md)** | **[API Docs](./API_DOCUMENTATION.md)**
