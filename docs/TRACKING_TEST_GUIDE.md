# Tracking Implementation & Testing Guide

## Quick Overview

Your tracking system works like this:

```
Your Website (Netlify)
    ↓
    ├─ Load tracking script (pm-tracker.js)
    ├─ Generate session & visitor IDs
    ├─ Collect page metadata
    └─ Send to API endpoint
         ↓
    Backend API (Railway) POST /api/v1/track
         ↓
    Prisma Database (SQLite)
         ├─ Store Event
         ├─ Create/Update Session
         └─ Track Visitor
              ↓
    Dashboard Frontend (Netlify)
         ├─ Fetch /api/v1/dashboard/metrics
         ├─ Display Charts
         └─ Show Analytics
```

---

## Step 1: Verify You Have a Tracking Code

When you registered a website in your dashboard, a tracking code was generated.

**Format:** `pm-xxxxx-timestamp` (e.g., `pm-a7k9m2-1706425600000`)

### To Find Your Tracking Code:

1. Login to your dashboard: https://privacy-focused-web-analytics-dashboard.netlify.app
2. Go to "Websites" or "Settings"
3. Find your registered website
4. Copy the **Tracking Code** (it will be visible in the website details)

---

## Step 2: Create a Test HTML File

Create a simple test page on your Netlify site that uses the tracking code.

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Test Site - Tracking Test</title>
    <script>
        // Replace with your actual tracking code
        const TRACKING_CODE = "pm-xxxxx-timestamp"; // ← REPLACE THIS
        const API_ENDPOINT = "https://privacy-focused-web-analytics-dashboard-production.up.railway.app/api/v1/track";
    </script>
    <!-- Include the tracking script -->
    <script src="https://privacy-focused-web-analytics-dashboard.netlify.app/pm-tracker.js" 
            data-tracking-code="pm-xxxxx-timestamp"
            data-api-endpoint="https://privacy-focused-web-analytics-dashboard-production.up.railway.app/api/v1/track"
            data-debug="true">
    </script>
</head>
<body>
    <h1>Tracking Test Page</h1>
    <p>This page is tracking your visit using PrivacyMetrics.</p>
    
    <button onclick="testTracking()">Trigger Test Event</button>
    
    <script>
        function testTracking() {
            console.log('Test event triggered');
            // The tracker will automatically capture this
            alert('Event sent! Check dashboard for data.');
        }
    </script>
</body>
</html>
```

---

## Step 3: Test Tracking Events

### Option A: Using Local Development

If you run `pnpm dev` locally:

1. **Create tracking code locally:**
   ```bash
   # Go to http://localhost:8080
   # Sign in
   # Create a new website
   # Copy the tracking code generated
   ```

2. **Use the built-in test page:**
   - Edit `public/test-tracking.html`
   - Replace `pm-your-tracking-code` with your actual code
   - Change API endpoint to `http://localhost:3000/api/v1/track`
   - Open `http://localhost:8080/test-tracking.html`

### Option B: Using Live Production

1. **In your Netlify dashboard, create an `test-tracking.html` file:**
   
   ```html
   <!DOCTYPE html>
   <html>
   <head>
       <title>PrivacyMetrics - Tracking Test</title>
       <script>
           // Your tracking code from the dashboard
           const TRACKING_CODE = "pm-xxxxx-timestamp";
       </script>
   </head>
   <body>
       <h1>✓ Tracking Test</h1>
       <p>Loaded with tracking code: <code id="code"></code></p>
       
       <h2>Test Actions:</h2>
       <ul>
           <li>Scroll down on this page</li>
           <li>Click the button below</li>
           <li>Wait 5 seconds</li>
       </ul>
       
       <button onclick="console.log('Button clicked - event tracking captured')">Test Click</button>
       
       <p>Open your dashboard to see the tracking data appear in real-time.</p>
       
       <script>
           document.getElementById('code').textContent = TRACKING_CODE;
       </script>
       <script src="https://privacy-focused-web-analytics-dashboard.netlify.app/pm-tracker.js" 
               data-tracking-code="pm-xxxxx-timestamp"
               data-api-endpoint="https://privacy-focused-web-analytics-dashboard-production.up.railway.app/api/v1/track"
               data-debug="true">
       </script>
   </body>
   </html>
   ```

2. **Access the test page:**
   ```
   https://privacy-focused-web-analytics-dashboard.netlify.app/test-tracking.html
   ```

---

## Step 4: Verify Events Are Being Tracked

### Check the Backend Logs:

1. Go to Railway: https://railway.app
2. Select your project: "privacy-focused-web-analytics-dashboard-production"
3. Go to "Deployments" tab
4. Click the latest deployment
5. View the live logs - you should see tracking events being processed

**Expected log output:**
```
[Tracking] Processing pageview event for tracking code: pm-xxxxx-timestamp
[Tracking] Session ID: sess_abc123def456
[Tracking] Event stored successfully
```

### Check the Database:

The events are stored in SQLite. If you want to verify:

```bash
# SSH into Railway container or use Prisma Studio locally:
npx prisma studio
```

Then check the `events` table:
- Filter by `websiteId` (from your website)
- You should see events with `eventType: "pageview"`

---

## Step 5: View Analytics in Dashboard

1. Go to your dashboard: https://privacy-focused-web-analytics-dashboard.netlify.app
2. Login with your account
3. Select your website from the list
4. You should see:
   - **Page Views** counter increasing
   - **Visitors** count
   - **Charts** starting to show data
   - **Recent Events** in analytics

---

## Troubleshooting

### Tracking Events Not Appearing?

1. **Check the tracking code:**
   ```bash
   # Open browser console on test page (F12)
   # Look for messages about tracking code
   # Error: "Tracking code not found" → Code is wrong
   ```

2. **Check API endpoint:**
   - Open DevTools → Network tab
   - Trigger an event
   - Look for POST request to `/api/v1/track`
   - If **no request** → script not loading
   - If **4xx error** → tracking code invalid
   - If **5xx error** → backend issue

3. **Verify backend is running:**
   ```bash
   curl https://privacy-focused-web-analytics-dashboard-production.up.railway.app/health
   # Should return: {"status":"ok"}
   ```

4. **Check tracking script exists:**
   ```bash
   curl https://privacy-focused-web-analytics-dashboard.netlify.app/pm-tracker.js
   # Should return JavaScript code
   ```

### No Data in Dashboard?

1. Wait 10-15 seconds for data to appear (batch processing)
2. Refresh the dashboard page
3. Check you're logged in to correct account
4. Verify you're viewing the correct website

---

## Complete Testing Checklist

- [ ] Website registered in dashboard with tracking code
- [ ] Tracking code copied (format: `pm-xxxxx-timestamp`)
- [ ] Test HTML page created
- [ ] Tracking script loaded in test page (check DevTools)
- [ ] Page view event sent (check Network tab)
- [ ] Backend logs show event processing
- [ ] Dashboard shows page view count increased
- [ ] Chart updates with new data
- [ ] Multiple events trigger multiple page view increments

---

## API Reference

### Tracking Endpoint

**POST** `https://privacy-focused-web-analytics-dashboard-production.up.railway.app/api/v1/track`

**Request body:**
```json
{
  "trackingCode": "pm-xxxxx-timestamp",
  "sessionId": "sess_abc123",
  "visitorId": "vis_xyz789",
  "eventType": "pageview",
  "page": {
    "url": "https://example.com/page",
    "path": "/page",
    "title": "Page Title",
    "referrer": null
  },
  "device": {
    "type": "desktop",
    "browser": "Chrome",
    "os": "Windows",
    "screen": {
      "width": 1920,
      "height": 1080
    }
  },
  "timestamp": "2026-02-03T12:00:00Z"
}
```

**Response:** 204 No Content (or 200 on error with error details)

### Dashboard Metrics Endpoint

**GET** `https://privacy-focused-web-analytics-dashboard-production.up.railway.app/api/v1/dashboard/metrics?websiteId=YOUR_WEBSITE_ID&days=7`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response:**
```json
{
  "success": true,
  "data": {
    "pageviews": 42,
    "visitors": 15,
    "sessions": 20,
    "bounceRate": 25.5,
    "avgDuration": 180
  },
  "website": "website_id",
  "period": "Last 7 days"
}
```

---

## Next Steps

Once tracking is working:

1. **Add tracking to production websites** - Use the tracking code on your real sites
2. **Monitor analytics** - Check dashboard regularly for insights
3. **Set up alerts** - When traffic anomalies occur
4. **Export data** - Generate reports (Phase 2)
5. **Custom events** - Send custom events like form submissions

