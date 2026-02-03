# 🚀 Free Hosting Options for PrivacyMetrics

**Complete guide to deploy PrivacyMetrics for free (without Netlify)**

---

## 📊 Comparison Table

| Platform | Free Tier | Database | SSL | Uptime | Best For |
|----------|-----------|----------|-----|--------|----------|
| **Railway** | $5/month credits | ✅ PostgreSQL | ✅ | 99.9% | Full-stack apps |
| **Render** | ✅ Free | ✅ PostgreSQL | ✅ | 99% | Small projects |
| **PlanetScale** | ✅ Free | MySQL | ✅ | 99.9% | Database only |
| **Fly.io** | ✅ Free | Optional | ✅ | 99.99% | Docker apps |
| **Heroku** | ❌ (discontinued) | ❌ | ✅ | 99.9% | Legacy |
| **Vercel** | ✅ Free | No DB | ✅ | 99.99% | Frontend only |
| **AWS Free Tier** | 12 months free | ✅ RDS | ✅ | 99.99% | Full control |
| **DigitalOcean** | $5/month | ✅ Managed DB | ✅ | 99.99% | Very affordable |
| **Replit** | ✅ Free | Optional | ✅ | 95% | Learning/testing |

---

## 🥇 Recommended Options

### **Option 1: Render.com (BEST FOR FREE)**

**Pros:**
- Completely free for small projects
- Includes free PostgreSQL database
- Easy one-click deployment
- Good uptime (99%)
- Git integration

**Cons:**
- Spins down after 15 minutes of inactivity
- Free tier limited resources
- No custom domain on free tier

**Setup Steps:**

1. **Sign up** at [render.com](https://render.com)

2. **Connect GitHub:**
   - Click "New +"
   - Select "Web Service"
   - Connect your GitHub repo

3. **Configure Service:**
   ```
   Name: privacymetrics
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm run start
   ```

4. **Add Environment Variables:**
   - Click "Environment"
   - Add all variables from `.env.example`:
     ```
     DATABASE_URL=postgresql://...
     JWT_SECRET=your-secret-here
     IP_SALT=your-salt-here
     NODE_ENV=production
     ```

5. **Create Database:**
   - Click "PostgreSQL"
   - Free 90-day trial
   - Copy connection string to `DATABASE_URL`

6. **Deploy:**
   - Click "Create Web Service"
   - Wait for deployment
   - Access at `yourapp.onrender.com`

---

### **Option 2: Railway.app (BEST OVERALL)**

**Pros:**
- $5/month free credits
- Includes database
- Fast deployment
- Good documentation
- GitHub integration

**Setup Steps:**

1. **Sign up** at [railway.app](https://railway.app)

2. **Create Project:**
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repo

3. **Add Services:**
   - Add Node.js service
   - Add PostgreSQL plugin (automatic)

4. **Configure:**
   - Set environment variables in project settings
   - Railway auto-populates `DATABASE_URL`

5. **Deploy:**
   - Auto-deploys on push
   - View logs in dashboard

**Cost:** Free for first month, then $5 included per account

---

### **Option 3: Fly.io (BEST FOR PERFORMANCE)**

**Pros:**
- Free tier with good limits
- Global edge deployment
- Fast performance (99.99% uptime)
- Docker-based (easy to customize)

**Setup Steps:**

1. **Install Fly CLI:**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **Sign up:**
   ```bash
   flyctl auth signup
   ```

3. **Create App:**
   ```bash
   cd your-project
   flyctl launch
   ```

4. **Configure Dockerfile:**
   ```dockerfile
   FROM node:22-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 8080
   CMD ["npm", "run", "start"]
   ```

5. **Set Secrets:**
   ```bash
   flyctl secrets set DATABASE_URL=postgresql://...
   flyctl secrets set JWT_SECRET=your-secret
   flyctl secrets set IP_SALT=your-salt
   ```

6. **Deploy:**
   ```bash
   flyctl deploy
   ```

**Cost:** Free tier includes 3 shared-cpu-1x 256MB instances

---

### **Option 4: AWS Free Tier (BEST FOR CONTROL)**

**Pros:**
- 12 months completely free
- Includes EC2, RDS, S3
- Full control
- Most scalable

**Setup Steps:**

1. **Create AWS Account:**
   - Sign up at [aws.amazon.com/free](https://aws.amazon.com/free)
   - Verify email and phone

2. **Launch EC2 Instance:**
   - Go to EC2 Dashboard
   - Click "Launch Instance"
   - Choose Ubuntu 22.04 LTS (Free tier eligible)
   - Instance type: t2.micro (free)
   - Security group: Allow HTTP, HTTPS, SSH

3. **Connect via SSH:**
   ```bash
   ssh -i key.pem ubuntu@your-instance-ip
   ```

4. **Install Dependencies:**
   ```bash
   sudo apt update
   sudo apt install nodejs npm postgresql -y
   ```

5. **Clone and Deploy:**
   ```bash
   git clone your-repo
   cd your-project
   npm install
   npm run build
   npm run start
   ```

6. **Setup Database:**
   - Use AWS RDS (free tier: single-AZ, 20GB)
   - Or local PostgreSQL

7. **Setup Domain:**
   - Register with Route 53
   - Or use free alternative: Freenom.com

---

### **Option 5: DigitalOcean ($5/month)**

**Pros:**
- Very cheap ($5/month for app + database)
- Reliable (99.99% uptime)
- Easy to use
- Good support
- App Platform simplifies deployment

**Setup Steps:**

1. **Create DigitalOcean Account:**
   - Sign up at [digitalocean.com](https://digitalocean.com)
   - Get $200 credits with referral

2. **Create App:**
   - Click "Apps"
   - Select "Create App"
   - Choose GitHub repo

3. **Configure:**
   ```
   Component: Web Service
   Build: npm run build
   Run: npm run start
   HTTP Port: 8080
   ```

4. **Add Database:**
   - Click "Add Resource"
   - Select "PostgreSQL"
   - $15/month (or use lower tier)

5. **Deploy:**
   - Click "Create App"
   - Auto-deploys on push

**Monthly Cost:** $5 app + $15 database = $20 (or $5 if using cheaper database)

---

## 🗄️ Database-Only Options

If you prefer to host the app elsewhere, use a managed database:

### **PlanetScale (MySQL) - FREE**
```bash
# Create account at planetscale.com
# Create database
# Get connection string
# Use as DATABASE_URL
```

### **Supabase (PostgreSQL) - FREE**
```bash
# Sign up at supabase.com
# Create project
# Get connection string
# Includes 500 MB storage, 2GB bandwidth
```

### **MongoDB Atlas (NoSQL) - FREE**
```bash
# Sign up at mongodb.com/cloud
# Create cluster
# Get connection string
# Includes 512MB storage
```

---

## 📋 Step-by-Step: Deploy to Render (Quickest)

### **Prerequisites:**
- GitHub account
- PrivacyMetrics repo pushed to GitHub
- 15 minutes

### **Deploy:**

1. **Go to [render.com](https://render.com)**

2. **Click "New +" → "Web Service"**

3. **Connect GitHub:**
   - Click "Connect account"
   - Authorize Render
   - Select your repo
   - Click "Connect"

4. **Configure Service:**
   ```
   Name: privacymetrics
   Environment: Node
   Build Command: npm install && npm run build
   Start Command: npm start
   Branch: main
   ```

5. **Create PostgreSQL Database:**
   - Click "+" → "PostgreSQL"
   - Name: `privacymetrics-db`
   - Keep defaults

6. **Add Environment Variables:**
   - In Web Service settings, click "Environment"
   - Add from `.env.example`:
     ```
     NODE_ENV=production
     JWT_SECRET=<generate-random-32-chars>
     IP_SALT=<generate-random-32-chars>
     DATABASE_URL=<from-PostgreSQL-service>
     ```

7. **Deploy:**
   - Render auto-deploys
   - Wait for "live" status
   - Visit your URL

**⏱️ Total Time:** 10-15 minutes

---

## 🔒 Environment Variables Checklist

Before deploying, ensure you have:

- [ ] `NODE_ENV=production`
- [ ] `JWT_SECRET` (32-byte random string)
- [ ] `IP_SALT` (32-byte random string)
- [ ] `DATABASE_URL` (PostgreSQL connection string)
- [ ] `PORT=8080` (optional, Render auto-sets)

**Generate Secure Values:**
```bash
# PowerShell
[System.Convert]::ToBase64String([System.Security.Cryptography.RNGCryptoServiceProvider]::new().GetBytes(32))

# Linux/Mac
openssl rand -base64 32
```

---

## 🚀 Post-Deployment

### **1. Verify Installation**
```bash
# Test API health
curl https://your-app.onrender.com/api/ping
```

### **2. Run Database Migrations**
```bash
# Use Render's Shell access
npx prisma migrate deploy
```

### **3. Test Authentication**
```bash
# Create test account
curl -X POST https://your-app.onrender.com/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "name": "Test User"
  }'
```

### **4. Monitor Logs**
- Render: Dashboard → "Logs" tab
- Railway: Project → "Logs" menu
- Fly.io: `flyctl logs`

---

## 🐛 Troubleshooting

### **Deployment Failed**
- Check build logs in platform dashboard
- Ensure `package.json` has correct start script
- Check Node.js version compatibility

### **Database Connection Error**
- Verify `DATABASE_URL` is set correctly
- Run migrations: `npx prisma migrate deploy`
- Check database credentials

### **App Spinning Down (Render)**
- This is normal on free tier
- First request takes 30 seconds to wake up
- Upgrade to paid to keep running

### **Environment Variables Not Recognized**
- Restart the deployment
- Clear cache
- Verify variable names exactly match

---

## 💰 Cost Comparison Summary

| Service | Recommendation | Monthly Cost | When to Use |
|---------|---|---|---|
| **Render** | ✅ Best Free | $0 | Just starting out |
| **Railway** | ✅ Good Balance | $5 | Small production |
| **Fly.io** | ✅ Performance | $0 | High traffic free |
| **AWS** | For Scale | $0-$50+ | Enterprise |
| **DigitalOcean** | Sweet Spot | $20 | Professional apps |

---

## ⚡ Quick Decision Tree

```
Do you want free hosting?
├─ YES, small project → Render.com ✅
├─ YES, better performance → Fly.io ✅
├─ YES, include database → Railway.app ($5)
└─ NO, I'll pay → DigitalOcean ($5-20)

Do you want managed database?
├─ YES → Use platform's built-in
└─ NO → PlanetScale or Supabase
```

---

## 📚 Useful Resources

- **Render Docs:** https://render.com/docs
- **Railway Docs:** https://docs.railway.app
- **Fly.io Docs:** https://fly.io/docs
- **AWS Free Tier:** https://aws.amazon.com/free
- **DigitalOcean:** https://www.digitalocean.com

---

## 🎯 Next Steps

1. Choose a platform from above
2. Follow its setup instructions
3. Deploy and test
4. Update `docs/DEPLOYMENT_GUIDE.md` with your choice
5. Share your app URL!

**Happy deploying! 🚀**
