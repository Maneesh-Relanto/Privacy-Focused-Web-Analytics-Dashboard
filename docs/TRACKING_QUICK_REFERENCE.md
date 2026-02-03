# Tracking Script Quick Reference

## 📦 Installation

```html
<script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-xxx-xxx"></script>
```

## 🎯 Custom Event Tracking

```javascript
// Track button click
window.PrivacyMetrics.trackEvent('button_clicked', {
  button: 'signup',
  location: 'header'
});

// Track form submission
window.PrivacyMetrics.trackEvent('form_submitted', {
  formId: 'contact',
  fields: 3
});

// Track download
window.PrivacyMetrics.trackEvent('file_downloaded', {
  filename: 'whitepaper.pdf'
});
```

## 🔒 Privacy Controls

```javascript
// Opt out of tracking
window.PrivacyMetrics.optOut();

// Opt in to tracking
window.PrivacyMetrics.optIn();

// Check opt-out status
if (window.PrivacyMetrics.isOptedOut()) {
  console.log('User opted out');
}
```

## 🔄 Manual Page Tracking (for SPAs)

```javascript
// React Router
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  
  useEffect(() => {
    window.PrivacyMetrics?.trackPageView();
  }, [location]);
}
```

## ⚙️ Configuration Options

```html
<script 
  src="https://your-domain.com/pm-tracker.js" 
  data-tracking-code="pm-xxx-xxx"
  data-api-endpoint="https://custom-api.com/track"
  data-debug="true"
></script>
```

## 🧪 Testing

Visit: `http://localhost:8080/test-tracking.html`

## 📊 What's Tracked

✅ Page views • ✅ Session duration • ✅ Device type • ✅ Browser/OS • ✅ Referrer • ✅ Custom events

❌ No cookies • ❌ No personal data • ❌ No cross-site tracking

## 📚 Full Documentation

See [TRACKING_SCRIPT_INSTALLATION.md](./TRACKING_SCRIPT_INSTALLATION.md) for complete guide.
