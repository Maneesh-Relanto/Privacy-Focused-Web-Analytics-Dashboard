# Real Data Integration Guide

**Status**: ✅ Complete  
**Date**: January 29, 2025  
**Phase**: Phase 2 - Real Data Integration

---

## Overview

This guide explains how the PrivacyMetrics dashboard now connects to real event data collected by the Lightweight Tracking Script. Instead of displaying mock/hardcoded data, the dashboard now calculates and displays actual analytics metrics from your websites.

## Architecture

### Data Flow

```
Website with Tracking Script
    ↓
Events sent to /api/v1/events
    ↓
Events stored in database
    ↓
Dashboard queries aggregation service
    ↓
Metrics calculated from raw events
    ↓
Dashboard displays real analytics
```

### Key Components

1. **Aggregation Service** (`server/services/aggregation.ts`)
   - Calculates metrics from raw events
   - Functions: pageviews, unique visitors, bounce rate, session duration, etc.
   - Handles date range filtering
   - Computes trend comparisons

2. **Dashboard Routes** (`server/routes/dashboard.ts`)
   - Real data API endpoints
   - Enforces website ownership verification
   - Returns calculated metrics

3. **Frontend Hooks** (`client/hooks/useDashboardData.ts`)
   - Fetches data from dashboard endpoints
   - Handles loading and error states
   - Maps API responses to component format

4. **Dashboard Components** (`client/pages/Dashboard.tsx`)
   - Displays real metrics from API
   - Date range filtering (24h, 7d, 30d, 90d)
   - Real-time data updates

---

## How It Works

### Step 1: Events Are Collected

Website visitors trigger events:
```javascript
// Automatic pageviews
// Tracked on page load and SPA navigation

// Custom events (if configured)
PivotMetrics.track('custom', {
  action: 'signup',
  plan: 'premium'
});
```

### Step 2: Events Are Stored

Events are sent to the collection API:
```
POST /api/v1/events
{
  trackingCode: "pm-xxx",
  eventType: "pageview",
  url: "https://website.com/page",
  sessionId: "sess-123",
  visitorId: "vis-123",
  timestamp: "2025-01-29T10:00:00Z"
}
```

Events are stored in the database.

### Step 3: Metrics Are Calculated

Dashboard queries aggregation service:
```
GET /api/v1/dashboard/metrics?websiteId=web-123&days=7
```

The aggregation service:
1. Queries all events for the website in date range
2. Counts pageviews
3. Identifies unique visitors
4. Groups events into sessions
5. Calculates bounce rate (single-page sessions)
6. Calculates average session duration
7. Computes trends vs previous period

### Step 4: Dashboard Displays Metrics

Components render the real data:
```
Page Views: 1,234 (+12%)
Unique Visitors: 456 (+8%)
Sessions: 567 (-3%)
Bounce Rate: 42% (+2%)
Avg Session Duration: 3m 45s (+15%)
```

---

## API Reference

### GET /api/v1/dashboard/metrics

Get overall dashboard metrics.

**Query Parameters:**
- `websiteId` (required): Website ID
- `days` (optional): Number of days to analyze (default: 7)

**Response:**
```json
{
  "success": true,
  "data": {
    "pageViews": 1234,
    "pageViewsChange": 12,
    "uniqueVisitors": 456,
    "uniqueVisitorsChange": 8,
    "sessions": 567,
    "sessionsChange": -3,
    "avgSessionDuration": 225,
    "avgSessionDurationChange": 15,
    "bounceRate": 42,
    "bounceRateChange": 2
  }
}
```

**Example:**
```bash
curl -X GET "http://localhost:3000/api/v1/dashboard/metrics?websiteId=web-123&days=7" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### GET /api/v1/dashboard/pageviews

Get pageview data over time (for charting).

**Query Parameters:**
- `websiteId` (required)
- `days` (optional): Default 7

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "date": "2025-01-29",
      "pageviews": 156
    },
    {
      "date": "2025-01-28",
      "pageviews": 142
    }
  ],
  "total": 1234
}
```

### GET /api/v1/dashboard/top-pages

Get top pages by pageview count.

**Query Parameters:**
- `websiteId` (required)
- `days` (optional): Default 7
- `limit` (optional): Default 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "url": "https://example.com/",
      "views": 450,
      "uniqueVisitors": 320,
      "bounceRate": 35,
      "avgSessionDuration": 240
    },
    {
      "url": "https://example.com/about",
      "views": 320,
      "uniqueVisitors": 280,
      "bounceRate": 42,
      "avgSessionDuration": 180
    }
  ],
  "total": 2
}
```

### GET /api/v1/dashboard/referrers

Get traffic sources (referrers).

**Query Parameters:**
- `websiteId` (required)
- `days` (optional)
- `limit` (optional): Default 10

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "referrer": "google.com",
      "visitors": 150,
      "sessions": 160,
      "pageViews": 450
    },
    {
      "referrer": "Direct",
      "visitors": 120,
      "sessions": 130,
      "pageViews": 300
    }
  ],
  "total": 2
}
```

### GET /api/v1/dashboard/devices

Get device breakdown statistics.

**Query Parameters:**
- `websiteId` (required)
- `days` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "mobile": 400,
    "desktop": 600,
    "tablet": 100,
    "other": 20
  }
}
```

---

## Setting Up for Your Website

### 1. Add Tracking Script

Add the Lightweight Tracking Script to your website:

```html
<script>
  window.TRACKER_CODE = 'your-tracking-code-from-dashboard';
</script>
<script src="https://your-analytics-domain.com/tracker.js" async></script>
```

### 2. Generate Events

Events are automatically tracked. To send custom events:

```javascript
// In your application code
PivotMetrics.track('custom', {
  event_name: 'signup',
  plan: 'premium',
  user_id: 'user-123'
});
```

### 3. Access Dashboard

1. Log in to PrivacyMetrics dashboard
2. Select the website from your website list
3. View real analytics data (auto-updates every 5-10 seconds)
4. Use date range selector to view different time periods

### 4. Test Data

To verify the setup is working:

1. Go to your website
2. In browser console, check: `window.PivotMetrics` (should exist)
3. Open Network tab in DevTools
4. Look for POST requests to `/api/v1/events`
5. Check dashboard in 30-60 seconds (batching delay)

---

## Metric Calculations

### Page Views

**Definition**: Total number of page load events

**Calculation**: Count all events with `eventType = "pageview"`

**Example**: 
- 10 users × 3 pages each = 30 pageviews

### Unique Visitors

**Definition**: Number of distinct visitors in period

**Calculation**: Count distinct `visitorId` values

**Example**:
- Visitor A: 5 pageviews
- Visitor B: 3 pageviews
- Visitor C: 2 pageviews
- Unique Visitors = 3

### Sessions

**Definition**: Number of distinct user sessions

**Calculation**: Count distinct `sessionId` values where `eventType = "pageview"`

**Example**:
- Session 1 (Visitor A): 3 pageviews
- Session 2 (Visitor A): 2 pageviews
- Session 3 (Visitor B): 1 pageview
- Sessions = 3

### Bounce Rate

**Definition**: Percentage of sessions that have only 1 page view

**Calculation**: `(Single-page sessions / Total sessions) × 100`

**Example**:
- Session 1: 5 pages (not a bounce)
- Session 2: 1 page (BOUNCE)
- Session 3: 2 pages (not a bounce)
- Bounce Rate = (1/3) × 100 = 33.3%

**Interpretation**:
- High bounce rate (>50%) may indicate:
  - Poor content relevance
  - Slow page load
  - Unclear call-to-action
- Low bounce rate (<40%) indicates:
  - Engaging content
  - Good user experience
  - Effective marketing message

### Average Session Duration

**Definition**: Average time spent per session

**Calculation**: `Sum of all session durations / Number of sessions`

**Session duration**: Time between first and last event in session

**Example**:
- Session 1: 5 minutes
- Session 2: 2 minutes
- Session 3: 8 minutes
- Average = (5 + 2 + 8) / 3 = 5 minutes

### Trend Calculation

**Definition**: Percentage change comparing current period to previous period

**Calculation**: `((Current - Previous) / Previous) × 100`

**Example**:
- Last 7 days: 1,000 pageviews
- Previous 7 days: 800 pageviews
- Change = ((1,000 - 800) / 800) × 100 = +25%

---

## Date Range Filtering

Dashboard supports multiple time periods:

| Range | Period | Comparison |
|-------|--------|-----------|
| 24h | Last 24 hours | vs previous 24h |
| 7d | Last 7 days | vs previous 7 days |
| 30d | Last 30 days | vs previous 30 days |
| 90d | Last 90 days | vs previous 90 days |

**How to use:**
1. Click date range selector (top right of dashboard)
2. Select desired period
3. Dashboard updates automatically
4. Trends compare to previous same-length period

---

## Testing Real Data Integration

### Manual Testing

1. **Generate Test Events**
   ```javascript
   // In browser console on your website
   for (let i = 0; i < 5; i++) {
     PivotMetrics.track('custom', {
       test: true,
       iteration: i
     });
   }
   ```

2. **Flush Events**
   ```javascript
   PivotMetrics.flush();
   ```

3. **Monitor Network**
   - Open DevTools → Network tab
   - Filter by `/api/v1/events`
   - Should see POST requests

4. **Check Dashboard**
   - Wait 30-60 seconds
   - Refresh dashboard
   - Metrics should update

### Integration Tests

Run the test suite:
```bash
npm test -- server/__tests__/aggregation.test.ts
```

Tests verify:
- Event counting accuracy
- Unique visitor identification
- Session grouping
- Bounce rate calculation
- Session duration calculation
- Date range filtering

---

## Troubleshooting

### Events not appearing in dashboard

**Possible causes:**
1. Tracking script not installed
2. Wrong tracking code
3. Website marked as inactive
4. Events haven't synced yet (5-10 second delay)

**Solutions:**
1. Verify tracking script in page HTML: `Ctrl+U` → search "TRACKER_CODE"
2. Check tracking code matches dashboard
3. Activate website in settings if needed
4. Wait 60 seconds and refresh dashboard
5. Check browser Network tab for API errors

### Metrics showing as 0

**Possible causes:**
1. No events recorded yet
2. Date range too narrow
3. Website ID mismatch

**Solutions:**
1. Generate test events on your website
2. Try expanding date range (30 days)
3. Verify you're viewing correct website

### Bounce rate seems wrong

**Note**: Bounce rate requires session grouping logic. In early versions, may not be perfectly accurate. Please report if calculations seem off.

### Performance issues with large event counts

**If dashboard is slow:**
1. Try shorter date range (24h instead of 90d)
2. Optimize database indexes
3. Consider event aggregation jobs (future feature)

---

## Performance Metrics

### Query Performance

| Metric | Query Time |
|--------|-----------|
| 1,000 events | <100ms |
| 10,000 events | 100-500ms |
| 100,000 events | 500ms-2s |
| 1M+ events | Consider pre-aggregation |

### Optimization Tips

1. **Use appropriate date ranges** - Shorter ranges are faster
2. **Limit requests** - Avoid refreshing every second
3. **Batch calculations** - Running daily aggregation jobs
4. **Index by websiteId and timestamp** - Already done

---

## Next Steps

### Short-term (Phase 2)

- ✅ Real data collection
- ✅ Metric calculations
- ✅ Dashboard integration
- 🔄 More advanced metrics (exit rate, CTR, etc.)

### Medium-term (Phase 3)

- Real-time WebSocket updates
- Event filtering and segmentation
- Custom date ranges (not just presets)
- Comparison periods (YoY, etc.)

### Long-term (Phase 4)

- Goal tracking
- Conversion funnel analysis
- Custom event dashboards
- Real-time alerts
- Automated reports

---

## FAQ

### Q: Why is there a delay before events appear?

**A**: Events are batched for performance (default 5-10 seconds). This reduces API calls and improves efficiency. You can manually flush with `PivotMetrics.flush()`.

### Q: Can I see individual visitor data?

**A**: Currently, the dashboard shows aggregated metrics for privacy. Individual visitor tracking is intentionally not exposed to protect user privacy.

### Q: How accurate are the metrics?

**A**: Metrics are calculated from actual event data, so they're as accurate as the tracking. Edge cases (timezone transitions, clock skew) may cause minor variations.

### Q: Can I export the data?

**A**: Data export is a future feature. For now, you can use the API endpoints to programmatically retrieve metrics.

### Q: How long is data retained?

**A**: Currently, all events are retained indefinitely. We recommend periodic archival for very large datasets.

---

## Support

For questions or issues:

1. **Check this guide** - Most answers are here
2. **Review API documentation** - See EVENT_COLLECTION_GUIDE.md
3. **Run tests** - Verify system is working: `npm test`
4. **Check logs** - Server logs show aggregation errors
5. **Contact support** - Via dashboard feedback form

---

**Implementation Status**: ✅ Complete  
**Last Updated**: January 29, 2025
