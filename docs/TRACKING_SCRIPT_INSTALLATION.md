# Tracking Script Installation Guide

## Quick Start - Install PrivacyMetrics in 2 Minutes

### Step 1: Get Your Tracking Code

1. **Register an account**: Visit your PrivacyMetrics dashboard
2. **Create a website**: Go to Settings → Websites → Add Website
3. **Copy your tracking code**: You'll get a unique code like `pm-abc123-1234567890`

### Step 2: Add the Script to Your Website

Add this single line of code to your website's `<head>` section, just before the closing `</head>` tag:

```html
<script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
```

**Replace:**
- `https://your-domain.com` with your PrivacyMetrics server URL
- `pm-abc123-1234567890` with your actual tracking code

### Step 3: Done! 🎉

That's it! Your website is now tracked. Visit your dashboard to see real-time analytics.

---

## Installation Examples

### Static HTML Website

Add to your `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>My Website</title>
    
    <!-- PrivacyMetrics Tracking -->
    <script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
</head>
<body>
    <h1>Welcome to my website</h1>
</body>
</html>
```

### WordPress

1. Go to **Appearance → Theme Editor**
2. Select **header.php**
3. Add the script before `</head>`

Or use a plugin like **Insert Headers and Footers**.

### React / Next.js

#### React (Create React App, Vite)

Add to `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... other head elements ... -->
    
    <!-- PrivacyMetrics -->
    <script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
</head>
<body>
    <div id="root"></div>
</body>
</html>
```

#### Next.js

Add to `pages/_document.js` (or `_document.tsx`):

```jsx
import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
        {/* PrivacyMetrics Tracking */}
        <script 
          src="https://your-domain.com/pm-tracker.js" 
          data-tracking-code="pm-abc123-1234567890"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
```

### Vue.js

Add to `public/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <!-- ... other head elements ... -->
    
    <!-- PrivacyMetrics -->
    <script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
</head>
<body>
    <div id="app"></div>
</body>
</html>
```

### Angular

Add to `src/index.html`:

```html
<!doctype html>
<html lang="en">
<head>
  <!-- ... other head elements ... -->
  
  <!-- PrivacyMetrics -->
  <script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

### Gatsby

Add to `gatsby-ssr.js`:

```javascript
export const onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="privacy-metrics"
      src="https://your-domain.com/pm-tracker.js"
      data-tracking-code="pm-abc123-1234567890"
    />,
  ]);
};
```

---

## Advanced Configuration

### Custom API Endpoint

If your tracking API is on a different domain:

```html
<script 
  src="https://your-cdn.com/pm-tracker.js" 
  data-tracking-code="pm-abc123-1234567890"
  data-api-endpoint="https://api.your-domain.com/api/v1/track"
></script>
```

### Debug Mode

Enable debug mode to see tracking events in the browser console:

```html
<script 
  src="https://your-domain.com/pm-tracker.js" 
  data-tracking-code="pm-abc123-1234567890"
  data-debug="true"
></script>
```

This will log:
- Tracking initialization
- Session and visitor IDs
- Every event sent to the server

**Note:** Don't use debug mode in production!

---

## Manual Event Tracking

### Track Custom Events

Track button clicks, form submissions, or any custom action:

```javascript
// Track a button click
document.getElementById('signup-btn').addEventListener('click', function() {
  window.PrivacyMetrics.trackEvent('signup_button_clicked', {
    location: 'homepage_hero',
    buttonText: 'Get Started'
  });
});

// Track form submission
document.getElementById('contact-form').addEventListener('submit', function() {
  window.PrivacyMetrics.trackEvent('contact_form_submitted', {
    formType: 'contact'
  });
});

// Track file download
document.getElementById('download-btn').addEventListener('click', function() {
  window.PrivacyMetrics.trackEvent('file_downloaded', {
    fileName: 'whitepaper.pdf',
    fileSize: '2.5MB'
  });
});
```

### Track Page Views (SPA)

For Single Page Applications (React, Vue, Angular), manually track route changes:

```javascript
// React Router
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    if (window.PrivacyMetrics) {
      window.PrivacyMetrics.trackPageView();
    }
  }, [location]);

  return <div>...</div>;
}
```

---

## Privacy Controls

### User Opt-Out

Allow users to opt-out of tracking:

```html
<button onclick="window.PrivacyMetrics.optOut()">
  Opt-out of Analytics
</button>

<button onclick="window.PrivacyMetrics.optIn()">
  Opt-in to Analytics
</button>
```

Check opt-out status:

```javascript
if (window.PrivacyMetrics.isOptedOut()) {
  console.log('User has opted out of tracking');
}
```

### What We Track (Privacy-First)

✅ **We DO track:**
- Page views and navigation
- Device type (mobile/desktop/tablet)
- Browser and OS
- Screen resolution
- Referrer source
- Time on page
- Custom events you define

❌ **We DON'T track:**
- Personal information (names, emails, etc.)
- Cookies (we use sessionStorage/localStorage only)
- IP addresses (hashed for privacy)
- Cross-site activity
- Fingerprinting beyond basic device info

---

## Verification

### Check if Tracking is Working

1. **Open your website**
2. **Open browser DevTools** (F12)
3. **Go to Console tab**
4. **Add `?data-debug=true`** to your script tag temporarily
5. **Reload the page**
6. **Look for:** `[PrivacyMetrics] Tracking event: pageview`

### Check Dashboard

1. Visit your PrivacyMetrics dashboard
2. Select your website
3. You should see your visit within 5-10 seconds

---

## Content Security Policy (CSP)

If your site uses CSP headers, add:

```
script-src 'self' https://your-domain.com;
connect-src 'self' https://your-domain.com/api/v1/track;
```

---

## Self-Hosting the Script

For maximum privacy and control, host the tracking script on your own domain:

1. **Download** `pm-tracker.js` from your PrivacyMetrics server
2. **Upload** to your website (e.g., `/js/pm-tracker.js`)
3. **Update** the script tag:

```html
<script src="/js/pm-tracker.js" data-tracking-code="pm-abc123-1234567890"></script>
```

Benefits:
- No third-party requests
- Faster loading (same domain)
- Better privacy
- Works with strict CSP policies

---

## Troubleshooting

### Script Not Loading

**Check:**
1. Is the script URL correct?
2. Is your PrivacyMetrics server running?
3. Check browser console for errors

### No Data in Dashboard

**Check:**
1. Is your tracking code correct?
2. Is the website active in settings?
3. Is tracking blocked by ad blocker? (Unlikely with privacy-focused tracking)
4. Check Network tab in DevTools for failed requests

### Ad Blockers

PrivacyMetrics is privacy-focused and shouldn't be blocked, but some aggressive blockers might block it. If needed:

1. Host the script on your own domain
2. Rename `pm-tracker.js` to something generic like `analytics.js`
3. Use a custom API endpoint path

---

## Multiple Websites

Track multiple websites with different tracking codes:

**Website 1:**
```html
<script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-site1-123"></script>
```

**Website 2:**
```html
<script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-site2-456"></script>
```

---

## Need Help?

- **Documentation**: [your-domain.com/docs](https://your-domain.com/docs)
- **GitHub Issues**: [github.com/your-org/privacy-metrics/issues](https://github.com/your-org/privacy-metrics/issues)
- **Community**: [Discord/Slack link]
- **Email**: support@your-domain.com

---

## API Reference

### `window.PrivacyMetrics`

The global API object available after the script loads.

#### Methods

**`trackPageView()`**
- Manually track a page view
- Useful for Single Page Applications

**`trackEvent(eventName, properties)`**
- Track a custom event
- `eventName` (string): Name of the event
- `properties` (object): Custom properties

**`track(eventType, eventData)`**
- Low-level tracking method
- `eventType` (string): Event type
- `eventData` (object): Event data

**`optOut()`**
- Disable tracking for this user

**`optIn()`**
- Enable tracking for this user

**`isOptedOut()`**
- Returns `true` if user has opted out

**`getSessionId()`**
- Returns current session ID

**`getVisitorId()`**
- Returns current visitor ID

---

**Last Updated:** February 3, 2026
