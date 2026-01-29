# Lightweight Tracking Script Guide

The Lightweight Tracking Script is a minimal (~2KB gzipped), dependency-free JavaScript library that enables web analytics collection on your websites. It automatically tracks pageviews and allows custom event tracking with automatic batching for optimal performance.

## Table of Contents

1. [Installation](#installation)
2. [Configuration](#configuration)
3. [Basic Usage](#basic-usage)
4. [Custom Events](#custom-events)
5. [Advanced Features](#advanced-features)
6. [Troubleshooting](#troubleshooting)
7. [Performance Optimization](#performance-optimization)
8. [Privacy Considerations](#privacy-considerations)

---

## Installation

### Prerequisites

- A website where you can add scripts to the `<head>` or `<body>` tag
- Your tracking code from the PivotMetrics dashboard (e.g., `pm-abc123-1704067200000`)

### Quick Start

1. Log in to your PivotMetrics dashboard
2. Navigate to the website settings
3. Copy your tracking code
4. Add the following script to your website's HTML:

```html
<script>
  window.TRACKER_CODE = 'your-tracking-code-here';
</script>
<script src="https://your-analytics-domain.com/tracker.js" async></script>
```

Replace `your-tracking-code-here` with your actual tracking code from the dashboard.

### Advanced Installation

If you need more control over the tracker initialization, you can specify additional options:

```html
<script>
  window.TRACKER_CODE = 'pm-abc123-1704067200000';
  window.TRACKER_API = 'https://your-analytics-domain.com/api/v1/events';
  window.TRACKER_DEBUG = true; // Enable debug logging
</script>
<script src="https://your-analytics-domain.com/tracker.js" async></script>
```

### Alternative: Data Attributes

You can also use data attributes instead of window variables:

```html
<script 
  src="https://your-analytics-domain.com/tracker.js" 
  async
  data-tracking-code="pm-abc123-1704067200000"
  data-api-url="https://your-analytics-domain.com/api/v1/events">
</script>
```

---

## Configuration

### Available Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `TRACKER_CODE` | string | (required) | Your unique tracking code from the dashboard |
| `TRACKER_API` | string | `/api/v1/events` | API endpoint for sending events |
| `TRACKER_DEBUG` | boolean | `false` | Enable debug logging in browser console |

### Configuration Examples

#### Basic Configuration
```html
<script>
  window.TRACKER_CODE = 'pm-abc123-1704067200000';
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

#### Development Configuration (with debugging)
```html
<script>
  window.TRACKER_CODE = 'pm-abc123-1704067200000';
  window.TRACKER_DEBUG = true;
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

#### Custom API Endpoint
```html
<script>
  window.TRACKER_CODE = 'pm-abc123-1704067200000';
  window.TRACKER_API = 'https://custom-api.example.com/events';
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

---

## Basic Usage

### Automatic Pageview Tracking

Once installed, the script automatically tracks:

- **Initial page load** - Triggered when the page first loads
- **Pageview events** - Recorded with page title and URL
- **Single Page App (SPA) navigation** - Tracks `pushState` and `replaceState` changes
- **Link clicks** - Automatically tracks clicks on `<a>` tags
- **Page visibility changes** - Flushes events when tab becomes hidden

**No additional code is needed** for basic tracking.

### Example: Blog with Automatic Tracking

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Blog</title>
  <script>
    window.TRACKER_CODE = 'pm-abc123-1704067200000';
  </script>
  <script src="https://analytics.example.com/tracker.js" async></script>
</head>
<body>
  <h1>My Blog</h1>
  <article>...</article>
  <!-- Pageview is automatically tracked on load -->
  <!-- Link clicks are automatically tracked -->
  <a href="/about">About</a>
</body>
</html>
```

---

## Custom Events

### Tracking Custom Events

Use the `PivotMetrics.track()` function to send custom events:

```javascript
// Simple custom event
PivotMetrics.track('custom', {
  action: 'video_play',
  videoId: '123',
  duration: 45
});
```

### Real-World Examples

#### E-commerce: Track Product View
```javascript
PivotMetrics.track('custom', {
  type: 'product_view',
  productId: 'SKU-12345',
  productName: 'Blue Widget',
  category: 'Electronics',
  price: 99.99
});
```

#### E-commerce: Track Add to Cart
```javascript
PivotMetrics.track('custom', {
  type: 'add_to_cart',
  productId: 'SKU-12345',
  quantity: 2,
  price: 199.98
});
```

#### SaaS: Track Feature Usage
```javascript
PivotMetrics.track('custom', {
  type: 'feature_used',
  featureName: 'export_report',
  userId: 'user-123',
  duration: 30000 // milliseconds
});
```

#### Content: Track Video Engagement
```javascript
// Video started
PivotMetrics.track('custom', {
  type: 'video_event',
  event: 'start',
  videoId: 'video-123',
  videoTitle: 'Tutorial: Getting Started'
});

// Video played 50%
PivotMetrics.track('custom', {
  type: 'video_event',
  event: 'progress',
  videoId: 'video-123',
  progress: 50
});

// Video completed
PivotMetrics.track('custom', {
  type: 'video_event',
  event: 'complete',
  videoId: 'video-123',
  watchTime: 600 // seconds
});
```

#### Form Tracking
```javascript
// Form submission
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  PivotMetrics.track('custom', {
    type: 'form_submit',
    formName: 'contact',
    fields: ['name', 'email', 'message']
  });
  
  // Then submit the form
  this.submit();
});
```

#### Button Click Tracking
```javascript
document.getElementById('signup-btn').addEventListener('click', function() {
  PivotMetrics.track('custom', {
    type: 'button_click',
    buttonId: 'signup-btn',
    buttonText: 'Sign Up',
    location: 'hero_section'
  });
});
```

---

## Advanced Features

### Event Batching

The tracker automatically batches events for optimal performance:

- Events are queued locally in the browser
- Batch is sent when either condition is met:
  - **Batch Size Limit**: 10 events accumulated
  - **Time Interval**: 5 seconds since last flush
- Events are also flushed when the page is about to unload

**This means you can call `PivotMetrics.track()` frequently without worrying about performance.**

### Manual Flush

Force-send all queued events immediately:

```javascript
// Send all queued events
PivotMetrics.flush();
```

Use cases:
- Before navigation to external site
- After critical user action
- In long-lived single page applications

### Session and Visitor IDs

The tracker automatically manages:

- **Session ID**: Per-tab/window session identifier
  - Generated on first visit
  - Stored in `sessionStorage`
  - Resets when closing the tab/window
  
- **Visitor ID**: Cross-session identifier
  - Generated on first visit
  - Stored in `localStorage`
  - Persists across browser sessions

**These IDs are automatically sent with every event.**

### Offline Support

The tracker handles offline scenarios gracefully:

- Events are queued in memory while offline
- Connection is monitored automatically
- Events are sent automatically when connection is restored
- Events are flushed before page unload

### Debug Mode

Enable detailed logging in the browser console:

```html
<script>
  window.TRACKER_CODE = 'pm-abc123-1704067200000';
  window.TRACKER_DEBUG = true;
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

Then open browser DevTools console (F12) to see:
```
[PivotMetrics] Tracker loaded { trackingCode: '...', sessionId: '...', visitorId: '...' }
[PivotMetrics] Event queued { eventType: 'pageview', url: 'https://...', ... }
[PivotMetrics] Events flushed { count: 2 }
```

---

## Troubleshooting

### Script Not Loading

**Problem**: Tracking code appears in HTML but no events are recorded

**Solutions**:
1. Verify tracking code is correct in dashboard
2. Check browser console for errors (F12)
3. Ensure script URL is correct
4. Verify CORS is configured on the analytics server
5. Enable debug mode to see initialization logs

### No Events in Dashboard

**Problem**: Script loads but events don't appear in analytics dashboard

**Solutions**:
1. Check the browser's Network tab (F12 → Network) to verify requests are being sent
2. Verify the API endpoint is correct (`TRACKER_API`)
3. Enable debug mode and check console logs
4. Check server logs for errors processing events
5. Verify the website is active in the dashboard

### Events Are Delayed

**Problem**: Events appear in dashboard after significant delay

**Possible causes**:
- Events are being batched (working as intended)
- Browser is offline (events sent when reconnected)
- High latency network connection

**Solutions**:
- Use `PivotMetrics.flush()` to send events immediately
- Monitor network tab for slow requests
- Check server performance and API response times

### Duplicate Events

**Problem**: Events appear multiple times in dashboard

**Possible causes**:
- Script is included twice on the page
- Multiple tracking codes pointing to same website
- Manual `.track()` calls plus automatic tracking

**Solutions**:
1. Ensure script tag is only included once
2. Verify `TRACKER_CODE` is set to single correct code
3. Review custom tracking code for duplicates

### High Memory Usage

**Problem**: Browser memory increases significantly after installing tracker

**Possible causes**:
- Very large number of custom properties in events
- Many untracked errors causing event queue buildup
- Infinite event tracking loop

**Solutions**:
1. Reduce amount of data in custom event properties
2. Limit frequency of custom tracking calls
3. Ensure tracking code doesn't create infinite loops
4. Use `PivotMetrics.flush()` periodically in long-running apps

---

## Performance Optimization

### Best Practices

#### 1. Use Async Script Loading
```html
<!-- Good: Script loads asynchronously -->
<script src="https://analytics.example.com/tracker.js" async></script>

<!-- Avoid: Script blocks page load -->
<script src="https://analytics.example.com/tracker.js"></script>
```

#### 2. Minimize Custom Event Data
```javascript
// Good: Only necessary data
PivotMetrics.track('custom', {
  type: 'button_click',
  buttonId: 'signup'
});

// Avoid: Excessive nested data
PivotMetrics.track('custom', {
  type: 'button_click',
  user: { id: '123', name: 'John', email: 'john@example.com', ... },
  page: { title: '...', url: '...', referrer: '...', ... },
  device: { ... },
  browserData: { ... }
});
```

#### 3. Batch Similar Events
```javascript
// Good: Single track call with aggregated data
PivotMetrics.track('custom', {
  type: 'page_metrics',
  scrollDepth: 75,
  timeOnPage: 45,
  clicks: 3
});

// Avoid: Multiple track calls for related data
PivotMetrics.track('custom', { scrollDepth: 75 });
PivotMetrics.track('custom', { timeOnPage: 45 });
PivotMetrics.track('custom', { clicks: 3 });
```

#### 4. Use Manual Flush for Long-Lived Apps
```javascript
// For SPAs that may not reload for hours
setInterval(() => {
  PivotMetrics.flush();
}, 30000); // Flush every 30 seconds
```

### Typical Performance Metrics

- **Script Size**: ~2KB gzipped
- **Load Time**: <10ms (after async script downloads)
- **Per Event**: <0.5KB uncompressed
- **Memory Footprint**: <1MB even with thousands of queued events
- **CPU Impact**: Negligible (<1% in background)

---

## Privacy Considerations

### Data Collected

By default, the tracker collects:

- **Session ID**: Unique per browser tab/window
- **Visitor ID**: Unique per browser (persisted)
- **Page URL**: Current page address
- **Referrer**: Previous page if available
- **Page Title**: Document title
- **Event Type**: pageview, click, custom, etc.
- **Timestamp**: When event occurred
- **Custom Properties**: Any data you explicitly pass

### Data NOT Collected

The tracker does **NOT** collect:
- Personally identifiable information (PII)
- IP addresses
- User agent details
- Geolocation
- Device fingerprints
- Tracking across domains

### Respecting User Privacy

#### Respect Do-Not-Track (DNT) Headers

```html
<script>
  // Don't track users with DNT preference
  if (navigator.doNotTrack === '1') {
    console.log('User has DNT enabled, not tracking');
  } else {
    window.TRACKER_CODE = 'pm-abc123-1704067200000';
  }
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

#### Exclude Sensitive Pages

```javascript
// Don't track events on admin/settings pages
if (window.location.pathname.startsWith('/admin')) {
  // Script is loaded but you can choose not to use it
  window.SKIP_TRACKING = true;
}
```

#### Anonymize Custom Data

Never send PII in custom events:

```javascript
// Good: No PII
PivotMetrics.track('custom', {
  type: 'user_action',
  userId: 'user_hash_123' // Use hashed/anonymized ID
});

// Bad: Contains PII
PivotMetrics.track('custom', {
  userName: 'John Doe',
  userEmail: 'john@example.com',
  userPhone: '555-1234'
});
```

### GDPR and CCPA Compliance

The lightweight tracker is designed to be privacy-focused:

1. **No Cookies by Default**: Uses sessionStorage/localStorage (no third-party cookies)
2. **No PII Collection**: Tracker doesn't collect personal information
3. **User Consent**: You control when/what is tracked

**To ensure full compliance:**
- Add consent mechanisms before loading tracker
- Allow users to opt-out of tracking
- Document data collection in privacy policy
- Implement data deletion if needed

Example: Consent-based tracking
```html
<script>
  // Only load tracker if user consents
  if (localStorage.getItem('analytics-consent') === 'true') {
    window.TRACKER_CODE = 'pm-abc123-1704067200000';
  }
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

---

## API Reference

### `PivotMetrics.track(eventType, properties)`

Queue a custom event for sending.

**Parameters:**
- `eventType` (string): Type of event (e.g., 'custom', 'click', 'scroll')
- `properties` (object, optional): Custom event data

**Example:**
```javascript
PivotMetrics.track('custom', {
  action: 'signup',
  plan: 'premium'
});
```

### `PivotMetrics.flush()`

Immediately send all queued events.

**Parameters:** None

**Example:**
```javascript
// Send events immediately
PivotMetrics.flush();
```

---

## Integration Examples

### Next.js / React

```jsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Initialize tracker on app load
    window.TRACKER_CODE = process.env.NEXT_PUBLIC_TRACKING_CODE;
    
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_TRACKER_URL;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const trackEvent = (eventType, properties) => {
    window.PivotMetrics?.track(eventType, properties);
  };

  return (
    <button onClick={() => trackEvent('custom', { action: 'click' })}>
      Track Event
    </button>
  );
}
```

### Vue.js

```vue
<template>
  <button @click="trackEvent">Track Event</button>
</template>

<script>
export default {
  mounted() {
    window.TRACKER_CODE = 'pm-abc123-1704067200000';
    const script = document.createElement('script');
    script.src = 'https://analytics.example.com/tracker.js';
    script.async = true;
    document.head.appendChild(script);
  },
  methods: {
    trackEvent() {
      window.PivotMetrics?.track('custom', { action: 'button_click' });
    }
  }
};
</script>
```

### WordPress

Add to theme's `functions.php`:

```php
add_action('wp_head', function() {
  $tracking_code = 'pm-abc123-1704067200000'; // Get from settings
  echo '<script>';
  echo 'window.TRACKER_CODE = "' . esc_js($tracking_code) . '";';
  echo '</script>';
  echo '<script src="https://analytics.example.com/tracker.js" async></script>';
});
```

Or add directly to theme's `header.php`:

```html
<script>
  window.TRACKER_CODE = "pm-abc123-1704067200000";
</script>
<script src="https://analytics.example.com/tracker.js" async></script>
```

---

## Support and Resources

- **Dashboard**: Log in to manage websites and view analytics
- **Documentation**: Check docs/INDEX.md for all guides
- **API Reference**: See docs/EVENT_COLLECTION_GUIDE.md for event API details
- **Issues**: Report problems using the feedback form

For questions or issues, please contact support through the dashboard.
