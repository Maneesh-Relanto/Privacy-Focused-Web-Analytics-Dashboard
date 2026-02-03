# 🚀 PrivacyMetrics User Guide

**Complete step-by-step guide to start tracking your website analytics**

---

## 📖 Table of Contents

1. [Getting Started](#getting-started)
2. [Creating Your Account](#step-1-create-your-account)
3. [Adding Your First Website](#step-2-add-your-first-website)
4. [Installing the Tracking Script](#step-3-install-the-tracking-script)
5. [Viewing Your Analytics](#step-4-view-your-analytics)
6. [Advanced Features](#advanced-features)

---

## Getting Started

### What You'll Need
- ✅ A website where you want to track analytics
- ✅ Ability to edit your website's HTML or use a framework
- ✅ 5 minutes of your time

### What You'll Get
- 📊 Real-time visitor analytics
- 🌍 Geographic location tracking (privacy-first, timezone-based)
- 📱 Device and browser statistics
- 📄 Page views and popular pages
- 🔗 Referrer tracking (where your visitors come from)
- 🎯 Custom event tracking
- 🔒 100% GDPR compliant, no cookies

---

## Step 1: Create Your Account

### 1.1 Access PrivacyMetrics
Open your browser and go to:
```
http://localhost:8080
```
(In production: https://your-domain.com)

### 1.2 Sign Up
1. Click the **"Get Started"** or **"Sign Up"** button
2. Fill in your details:
   - **Email**: your@email.com
   - **Password**: Create a strong password (min 8 characters)
3. Click **"Create Account"**

### 1.3 Log In
1. After registration, you'll be redirected to the login page
2. Enter your email and password
3. Click **"Log In"**
4. You'll land on your dashboard

---

## Step 2: Add Your First Website

### 2.1 Navigate to Website Management
From your dashboard:
1. Look for **"Create Website"** or **"Add Website"** button
2. Click it to open the website creation form

### 2.2 Fill in Website Details
Provide the following information:

| Field | Description | Example |
|-------|-------------|---------|
| **Name** | A friendly name for your site | "My Blog" or "Company Website" |
| **Domain** | Your website URL (with https://) | `https://myblog.com` |
| **Description** | Optional description | "Personal tech blog" |

### 2.3 Create Website
1. Click **"Create Website"** or **"Add"**
2. You'll receive a unique **Tracking Code** like: `pm-a7x9k2-1706425600000`
3. **Important**: Copy this tracking code - you'll need it next!

---

## Step 3: Install the Tracking Script

### 3.1 Get Your Tracking Code
After creating your website, you'll see:
```
Your Tracking Code: pm-a7x9k2-1706425600000
```

### 3.2 Choose Your Installation Method

#### 📄 **Method A: Static HTML Website**

Add this code **before the closing `</body>` tag** of your HTML:

```html
<!-- PrivacyMetrics Analytics -->
<script src="https://your-domain.com/pm-tracker.js"></script>
<script>
  PrivacyMetrics.init({
    trackingCode: 'pm-a7x9k2-1706425600000',  // Your unique code
    apiEndpoint: 'https://your-domain.com/api/v1/track'
  });
</script>
```

#### ⚛️ **Method B: React / Next.js**

**In your main layout or `_app.tsx`:**

```tsx
import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Load PrivacyMetrics
    const script = document.createElement('script');
    script.src = 'https://your-domain.com/pm-tracker.js';
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      (window as any).PrivacyMetrics?.init({
        trackingCode: 'pm-a7x9k2-1706425600000',
        apiEndpoint: 'https://your-domain.com/api/v1/track'
      });
    };
  }, []);

  return <YourApp />;
}
```

#### 🎨 **Method C: WordPress**

1. Go to **Appearance > Theme Editor**
2. Open `footer.php`
3. Add the tracking code before `</body>`
4. Save changes

#### 💚 **Method D: Vue.js**

**In your `main.js` or `App.vue`:**

```javascript
import { onMounted } from 'vue';

export default {
  setup() {
    onMounted(() => {
      const script = document.createElement('script');
      script.src = 'https://your-domain.com/pm-tracker.js';
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        window.PrivacyMetrics?.init({
          trackingCode: 'pm-a7x9k2-1706425600000',
          apiEndpoint: 'https://your-domain.com/api/v1/track'
        });
      };
    });
  }
};
```

### 3.3 Verify Installation

Open your website in a browser and check:
1. Open browser **Developer Tools** (F12)
2. Go to **Console** tab
3. You should see: `✅ PrivacyMetrics initialized`
4. No errors should appear

---

## Step 4: View Your Analytics

### 4.1 Access Your Dashboard
1. Go back to PrivacyMetrics dashboard
2. Click on your website name
3. Wait a few seconds for data to load

### 4.2 Understanding Your Dashboard

#### 📊 **Key Metrics** (Top Cards)
- **Total Visitors**: Unique visitors to your site
- **Total Page Views**: How many pages have been viewed
- **Avg Session Duration**: How long visitors stay
- **Bounce Rate**: Percentage of single-page sessions

#### 📈 **Page Views Chart**
- Visualizes traffic over time
- Hover over points to see exact numbers
- Toggle between daily/weekly/monthly views

#### 📱 **Device Distribution**
- Desktop vs Mobile vs Tablet breakdown
- Helps you optimize for your audience

#### 🌐 **Top Pages**
- Most visited pages on your site
- Shows view counts for each page

#### 🔗 **Referrer Sources**
- Where your traffic comes from
- Direct, search engines, social media, etc.

### 4.3 Refresh Data
- Dashboard updates automatically
- Click **"Refresh"** button for manual update
- Real-time data may take 5-10 seconds to appear

---

## Advanced Features

### 🎯 Track Custom Events

Track button clicks, form submissions, or any custom action:

```javascript
// Track a button click
document.getElementById('signup-btn').addEventListener('click', () => {
  PrivacyMetrics.trackEvent('signup_clicked', {
    plan: 'premium',
    source: 'homepage'
  });
});

// Track form submission
form.addEventListener('submit', () => {
  PrivacyMetrics.trackEvent('form_submitted', {
    formName: 'contact',
    fields: 5
  });
});

// Track file download
PrivacyMetrics.trackEvent('file_downloaded', {
  fileName: 'whitepaper.pdf',
  fileSize: '2.5MB'
});
```

### 🔒 Privacy Controls

#### Allow Users to Opt-Out
```html
<!-- Add an opt-out button -->
<button onclick="PrivacyMetrics.optOut()">
  Disable Analytics
</button>

<!-- Opt back in -->
<button onclick="PrivacyMetrics.optIn()">
  Enable Analytics
</button>
```

#### Check Opt-Out Status
```javascript
if (PrivacyMetrics.hasOptedOut()) {
  console.log('User has opted out of tracking');
}
```

### 📱 Single Page Applications (SPAs)

For React, Vue, Angular apps, manually track page changes:

```javascript
// Track route changes
router.afterEach((to) => {
  PrivacyMetrics.trackPageView({
    page: to.path,
    title: to.meta.title || document.title
  });
});
```

### ⚙️ Configuration Options

```javascript
PrivacyMetrics.init({
  trackingCode: 'pm-a7x9k2-1706425600000',  // Required
  apiEndpoint: 'https://your-domain.com/api/v1/track',  // Required
  
  // Optional settings
  autoTrack: true,              // Auto-track page views (default: true)
  trackOutboundLinks: true,     // Track external link clicks (default: true)
  respectDoNotTrack: true,      // Respect browser DNT header (default: true)
  sessionTimeout: 30            // Session timeout in minutes (default: 30)
});
```

---

## 🐛 Troubleshooting

### No Data Appearing?

**Check 1: Script Loaded**
```javascript
// In browser console
console.log(typeof PrivacyMetrics);
// Should show: "object"
```

**Check 2: Initialization**
```javascript
// Check if initialized
PrivacyMetrics.getSessionId();
// Should return a session ID like: "1706425600000-abc123"
```

**Check 3: Network Requests**
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Visit a page on your site
4. Look for request to `/api/v1/track`
5. Should show status `200 OK`

**Check 4: Correct Tracking Code**
- Verify tracking code matches the one in your dashboard
- Check for typos in `trackingCode` field

### Script Not Loading?

**Solution 1: Check File Path**
```html
<!-- Development -->
<script src="http://localhost:8080/pm-tracker.js"></script>

<!-- Production -->
<script src="https://your-domain.com/pm-tracker.js"></script>
```

**Solution 2: CORS Issues**
- Ensure your API allows requests from your website domain
- Check server CORS configuration

### Data Delayed?

- Analytics data may take 5-10 seconds to appear
- Try refreshing your dashboard
- Check if events are being sent (Network tab)

---

## 🎉 Success Checklist

- [ ] Account created and logged in
- [ ] Website added to PrivacyMetrics
- [ ] Tracking code copied
- [ ] Script installed on website
- [ ] Script verified (no console errors)
- [ ] First page view tracked
- [ ] Dashboard showing data
- [ ] Custom events working (optional)

---

## 📚 Additional Resources

- **[Installation Guide](./TRACKING_SCRIPT_INSTALLATION.md)** - Detailed installation for all frameworks
- **[Quick Reference](./TRACKING_QUICK_REFERENCE.md)** - API reference card
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference
- **[Website Management](./WEBSITE_MANAGEMENT_GUIDE.md)** - Managing multiple websites

---

## 💡 Tips for Success

1. **Start Simple**: Install the basic tracking first, add custom events later
2. **Test Locally**: Use `localhost` to test before deploying to production
3. **Privacy First**: PrivacyMetrics doesn't use cookies or store PII
4. **Performance**: The tracking script is ~8KB and loads asynchronously
5. **GDPR Compliant**: No consent banner needed (no cookies, no PII)

---

## 🆘 Need Help?

- **Issues**: Open an issue on GitHub
- **Questions**: Check the documentation
- **Contributions**: Pull requests welcome!

---

**Happy Tracking! 📊**
