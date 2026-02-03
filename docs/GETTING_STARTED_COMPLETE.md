# 🎯 Getting Started - Complete Flow

**Everything you need to know to use PrivacyMetrics**

---

## Step-by-Step Walkthrough

### 1️⃣ **Create Your Account**
- Go to http://localhost:8083/register
- Fill in your details:
  - Full Name
  - Email (must be unique)
  - Password (min 8 chars, 1 uppercase, 1 lowercase, 1 number)
  - Confirm password
- Click "Create Account"

✅ **You're now logged in!**

---

### 2️⃣ **Create Your First Website**
- You'll see "No Website Selected" message on dashboard
- Click **"Manage Websites"** button
- Click **"Create New Website"**
- Fill in:
  - **Website Name**: e.g., "My Blog" or "Company Site"
  - **Domain**: e.g., `https://myblog.com` (with https://)
  - **Description** (optional): e.g., "My personal tech blog"
- Click **"Create Website"**

✅ **Your website is created!** You'll see the **Tracking Code** (e.g., `pm-abc123-1234567890`)

---

### 3️⃣ **Install the Tracking Script**
Copy the tracking code and add this to your website:

```html
<!-- Before closing </body> tag -->
<script src="https://your-domain.com/pm-tracker.js"></script>
<script>
  PrivacyMetrics.init({
    trackingCode: 'pm-abc123-1234567890',  // Your tracking code from above
    apiEndpoint: 'https://your-domain.com/api/v1/track'
  });
</script>
```

👉 **See [USER_GUIDE.md](./USER_GUIDE.md) for installation in different frameworks**

---

### 4️⃣ **View Your Analytics**
- Go back to Websites page
- Click **"View Dashboard"** on your website
- See real-time analytics:
  - 📊 Page views
  - 👥 Unique visitors
  - ⏱️ Session duration
  - 📉 Bounce rate
  - 📱 Device breakdown
  - 🔗 Traffic sources
  - 📄 Top pages

✅ **Dashboard is live!**

---

## 🌍 Key Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | / | Landing page, sign in/up |
| Register | /register | Create account |
| Login | /login | Sign in to account |
| Dashboard | /dashboard | View analytics for selected website |
| Websites | /websites | Create & manage websites |
| Settings | /settings | Account settings |
| Documentation | /documentation | Help & guides |
| Test Tracker | /tracker-test | Test tracking script |

---

## 💾 Local Development Servers

**Both servers are running:**
- **Frontend**: http://localhost:8083 (Vite)
- **Backend API**: http://localhost:3000 (Express)

---

## 🔑 Quick Tips

1. **Tracking Code** - Found when you create a website
2. **Website Selection** - Automatically opens dashboard for selected site
3. **Dark Mode** - Toggle in dashboard sidebar
4. **Date Range** - Change in dashboard top-right
5. **Refresh** - Click refresh icon to reload data

---

## 🐛 Troubleshooting

### "No Website Selected"
- This is normal after registration
- Click "Manage Websites" to create one

### Registration Failed
- Email might already be registered
- Password must meet requirements
- Check browser console for errors

### Dashboard Shows No Data
- Make sure tracking script is installed
- Visit your website to generate page views
- Data appears in real-time (may take 5-10 seconds)

### Tracking Code Not Working
- Verify tracking code is correct
- Check domain matches website domain
- Look for errors in browser console

---

## 📚 Next Steps

1. ✅ Register account
2. ✅ Create first website
3. ✅ Install tracking script
4. ✅ View analytics
5. 📖 Read [USER_GUIDE.md](./USER_GUIDE.md) for advanced features
6. 🚀 Deploy to production
7. 📢 Share with users

---

## 🚀 Ready to Deploy?

See [FREE_HOSTING_GUIDE.md](./FREE_HOSTING_GUIDE.md) for free hosting options!

**Recommended:** Render.com (free + PostgreSQL included)

---

**Happy tracking! 📊**
