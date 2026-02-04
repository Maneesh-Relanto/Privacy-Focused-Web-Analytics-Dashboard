# PrivacyMetrics - Developer Guide

**One document. Simple tracking. Privacy-first analytics.**

---

## 🎯 Quick Start (2 Minutes)

### Step 1: Get Tracking Code

1. Go to http://localhost:8080 (or your deployed URL)
2. Sign up / Login
3. Click "Add Website"
4. Copy your tracking code (e.g., `pm-abc123-1706425600000`)

### Step 2: Add One Script Tag

Add this to your website's `<head>` section:

```html
<script src="https://your-domain.com/pm.js" 
        data-code="YOUR_TRACKING_CODE_HERE">
</script>
```

**That's it.** No configuration, no API keys, no cookies.

### Step 3: View Your Data

- **Local:** http://localhost:8080/dashboard
- **Production:** https://your-domain.com/dashboard

---

## 📊 What Gets Tracked Automatically

- ✅ Page views (URLs)
- ✅ Unique visitors (per browser)
- ✅ Session duration
- ✅ Referrer sources
- ✅ Device type (mobile/desktop)
- ✅ Browser/OS info
- ✅ Real-time updates

**Privacy-first:** No cookies, no fingerprinting, no personal data.

---

## 🔧 Setup for Development

### Prerequisites

- Node.js 18+
- pnpm (or npm)
- SQLite (included)

### Installation

```bash
# Clone repository
git clone <repo>
cd Privacy-Focused-Web-Analytics-Dashboard

# Install dependencies
pnpm install

# Start dev servers (frontend + backend)
pnpm dev
```

**Servers will start on:**
- Frontend: http://localhost:8080
- Backend: http://localhost:3000

---

## 🧪 Testing Locally

### Option 1: Use Built-in Debug Page

```bash
# With server running, open:
http://localhost:8080/test-debug.html
```

Then:
1. Replace `YOUR_TRACKING_CODE` with your actual code
2. Click "Check Status" 
3. Click "Test API Directly"
4. Should see ✅ All green

### Option 2: Create Test HTML

```html
<!DOCTYPE html>
<html>
<head>
    <title>Test Page</title>
    <script src="http://localhost:8080/pm.js" 
            data-code="YOUR_CODE"
            data-api="http://localhost:3000/api/v1/track">
    </script>
</head>
<body>
    <h1>Testing PrivacyMetrics</h1>
    <p>Open DevTools (F12) → Network tab to see POST requests</p>
</body>
</html>
```

### Option 3: Test API Directly

```powershell
$body = @{
    code = "your-tracking-code"
    sid = "pm_session_test"
    vid = "pm_visitor_test"
    url = "http://example.com/test"
    ref = "http://google.com"
    t = [int64](Get-Date -UFormat %s) * 1000
} | ConvertTo-Json

$response = Invoke-WebRequest `
    -Uri "http://localhost:3000/api/v1/track" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

Write-Host "Status: $($response.StatusCode)" # Should be 204
```

---

## 🚀 Integration Examples

### React / Next.js

```tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function App() {
  const router = useRouter();
  
  useEffect(() => {
    // Load tracker
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/pm.js';
    script.setAttribute('data-code', 'pm-your-code');
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    // Track route changes
    if (window.pm) {
      window.pm.track();
    }
  }, [router.pathname]);

  return <>{/* Your app */}</>;
}
```

### Vue.js

```vue
<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

onMounted(() => {
  // Load tracker
  const script = document.createElement('script');
  script.src = 'https://your-domain.com/pm.js';
  script.setAttribute('data-code', 'pm-your-code');
  document.head.appendChild(script);
});

watch(() => route.path, () => {
  if (window.pm) window.pm.track();
});
</script>
```

### Plain HTML/Static Site

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Site</title>
    <script src="https://your-domain.com/pm.js" 
            data-code="pm-your-code">
    </script>
</head>
<body>
    <!-- Your content -->
</body>
</html>
```

---

## 🔍 Verifying It Works

### Check Browser Console

```javascript
// Should both have values
console.log(sessionStorage.getItem('_pm_sid'));  // Session ID
console.log(sessionStorage.getItem('_pm_vid'));  // Visitor ID
```

### Check Network Tab

1. Press F12 (DevTools)
2. Go to "Network" tab
3. Reload page
4. Look for POST to `/api/v1/track`
5. Should return **204 No Content** ✅

### Check Dashboard

1. Go to http://localhost:8080/dashboard (or your deployed URL)
2. Select your website
3. Should show:
   - Page views count
   - Unique visitors
   - Top pages
   - Referrers

---

## ⚙️ Advanced Configuration

### Custom API Endpoint

```html
<script src="https://your-domain.com/pm.js" 
        data-code="pm-your-code"
        data-api="https://custom-api.com/track">
</script>
```

### Manual Event Tracking

```javascript
// Track button clicks, form submissions, etc.
if (window.pm) {
  window.pm.track();  // Send another event with current page data
}
```

### Multiple Websites

```html
<!-- Site A -->
<script src="https://analytics.com/pm.js" data-code="pm-site-a"></script>

<!-- Site B -->
<script src="https://analytics.com/pm.js" data-code="pm-site-b"></script>
```

---

## 📁 Project Structure

```
Privacy-Focused-Web-Analytics-Dashboard/
├── public/
│   ├── pm.js              # Tracking script
│   ├── test-simple.html   # Simple test page
│   └── test-debug.html    # Debug test page
├── client/
│   ├── pages/
│   │   ├── Index.tsx      # Home page
│   │   ├── Login.tsx      # Login
│   │   ├── Register.tsx   # Sign up
│   │   ├── Dashboard.tsx  # Analytics dashboard
│   │   └── WebsiteManagement.tsx  # Manage websites
│   ├── hooks/
│   │   └── useDashboardData.ts   # Dashboard data fetching
│   └── components/        # UI components
├── server/
│   ├── routes/
│   │   ├── auth.ts        # Authentication
│   │   ├── websites.ts    # Website CRUD
│   │   ├── tracking.ts    # Tracking endpoint
│   │   └── dashboard.ts   # Dashboard data
│   ├── services/
│   │   ├── tracking.ts    # Event processing
│   │   └── aggregation.ts # Data aggregation
│   └── middleware/
│       └── auth.ts        # JWT authentication
├── prisma/
│   └── schema.prisma      # Database schema
└── docs/                  # Additional documentation
```

---

## 🔐 Environment Variables

Create `.env` file:

```env
# Database
DATABASE_URL=file:./prisma/dev.db

# Server
PORT=3000
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### "No tracking code found" warning

**Fix:** Add `data-code` attribute to script tag:
```html
❌ <script src="/pm.js"></script>
✅ <script src="/pm.js" data-code="pm-abc123"></script>
```

### CORS Error

**Fix:** Make sure backend is running and CORS is configured:
```
Backend: http://localhost:3000/api/v1/track
Frontend: http://localhost:8080
```

### Data not showing in dashboard

**Check:**
1. Is the tracking code correct? (matches your website)
2. Did the network request return 204? (Check DevTools)
3. Is the website marked as active?
4. Wait a few seconds - aggregation can take time
5. Refresh the dashboard page

### Database Issues

```bash
# Reset database (dev only)
rm prisma/dev.db
pnpm dev
```

---

## 📚 API Endpoints

### Public Endpoints (No auth required)

- `POST /api/v1/track` - Track page view/event
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration

### Protected Endpoints (Auth required)

- `GET /api/v1/websites` - List user's websites
- `POST /api/v1/websites` - Create website
- `DELETE /api/v1/websites/:id` - Delete website
- `GET /api/v1/dashboard/metrics` - Dashboard metrics
- `GET /api/v1/dashboard/pageviews` - Pageview chart data
- `GET /api/v1/dashboard/top-pages` - Top pages
- `GET /api/v1/dashboard/referrers` - Referrer sources

---

## 🚀 Deployment

### Netlify

```bash
pnpm build
# Deploy dist/spa folder to Netlify
```

### Railway

Push to GitHub, connect repository to Railway:
- Build: `pnpm build:prod`
- Start: `pnpm start`

### Docker

```bash
docker build -t privacy-metrics .
docker run -p 3000:3000 -p 8080:8080 privacy-metrics
```

---

## 📊 What's Different About This Tracker

| Feature | PrivacyMetrics | Google Analytics | Plausible |
|---------|---|---|---|
| Self-hosted | ✅ | ❌ | ⚠️ |
| No cookies | ✅ | ❌ | ✅ |
| No tracking code required | ✅ | ❌ | ❌ |
| Open source | ✅ | ❌ | ❌ |
| Own your data | ✅ | ❌ | ✅ |
| GDPR compliant | ✅ | ❌ | ✅ |
| Simple implementation | ✅ | ❌ | ✅ |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature/your-feature`
5. Submit a pull request

---

## 📝 License

MIT License - see LICENSE file for details

---

## 🆘 Support

- **Issues:** Open GitHub issues
- **Discussion:** Start a discussion in GitHub
- **Security:** Report security issues privately

---

## ✅ Production Checklist

Before deploying:

- [ ] Database backed up
- [ ] Environment variables set
- [ ] SSL/HTTPS enabled
- [ ] CORS origins configured
- [ ] Tracking script URL updated
- [ ] Database migrations run
- [ ] Error logging configured
- [ ] Backups scheduled
- [ ] Tested on production domain
- [ ] Monitored for 24 hours

---

**Questions?** Check the troubleshooting section above or open an issue.

**Ready to track?** Grab your tracking code and add one line to your site! 🚀
