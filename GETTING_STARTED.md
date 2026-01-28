# Getting Started with PrivacyMetrics

This guide provides step-by-step instructions to set up PrivacyMetrics on your infrastructure.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Configuration](#configuration)
5. [Troubleshooting](#troubleshooting)
6. [FAQ](#faq)

---

## Prerequisites

Before you begin, ensure you have the following installed:

### Required

- **Node.js**: Version 22 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version`

- **pnpm**: Version 10.14.0 or higher (package manager)
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **Git**: For cloning the repository
  - [Download Git](https://git-scm.com/)
  - Verify: `git --version`

### Optional

- **Docker**: For containerized deployment
  - [Download Docker](https://www.docker.com/)
  - Verify: `docker --version`

- **Docker Compose**: For running with database
  - Usually comes with Docker Desktop
  - Verify: `docker-compose --version`

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-org/privacy-metrics.git
cd privacy-metrics
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This command will:
- Install all npm dependencies
- Set up pre-commit hooks (if configured)
- Prepare the development environment

**Expected output**: Should complete without errors. Look for "done" message.

### Step 3: Verify Installation

```bash
pnpm typecheck
```

This validates that TypeScript types are correct. If successful, you'll see:
```
✓ No type errors found
```

### Step 4: Start Development Server

```bash
pnpm dev
```

**Expected output**:
```
  VITE v7.1.2  ready in 369 ms

  ➜  Local:   http://localhost:8080/
  ➜  Network: http://172.x.x.x:8080/
```

### Step 5: Access the Application

Open your browser and navigate to:

- **Landing Page**: http://localhost:8080/
- **Demo Dashboard**: http://localhost:8080/dashboard

You should see:
- A modern landing page with "PrivacyMetrics" branding
- Navigation links (Features, Why Us, Demo)
- A fully functional demo dashboard with charts and metrics

### Step 6: Stop the Server

Press `Ctrl + C` in the terminal to stop the development server.

---

## Production Deployment

### Option 1: Self-Hosted on Your Server

#### 1.1 Build for Production

```bash
pnpm build
```

This creates:
- Client build in `dist/spa/`
- Server build in `dist/server/`

#### 1.2 Start Production Server

```bash
pnpm start
```

The server will start on port 8080. Configure your reverse proxy (nginx, apache, etc.) to forward traffic to this port.

#### 1.3 Deploy to Your Server

1. Copy the entire project to your server:
   ```bash
   scp -r . user@your-server:/opt/privacy-metrics
   ```

2. On your server, install and run:
   ```bash
   cd /opt/privacy-metrics
   pnpm install --prod  # Install only production dependencies
   pnpm build
   pnpm start
   ```

3. Configure a reverse proxy (nginx example):
   ```nginx
   server {
       listen 80;
       server_name analytics.yourdomain.com;
   
       location / {
           proxy_pass http://localhost:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

4. Enable HTTPS (recommended with Let's Encrypt):
   ```bash
   sudo certbot --nginx -d analytics.yourdomain.com
   ```

### Option 2: Docker Deployment

#### 2.1 Build Docker Image

```bash
docker build -t privacy-metrics:latest .
```

#### 2.2 Run Docker Container

```bash
docker run -p 8080:8080 privacy-metrics:latest
```

Access the app at http://localhost:8080

#### 2.3 Docker Compose (with environment management)

Create a `docker-compose.yml`:

```yaml
version: '3.8'

services:
  privacy-metrics:
    build: .
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

Run:
```bash
docker-compose up -d
```

### Option 3: Netlify Deployment

#### 3.1 Connect GitHub Repository

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your GitHub repository
5. Netlify auto-detects the build command

#### 3.2 Automatic Deployment

Netlify automatically deploys when you push to `main` branch:
- Build command: `pnpm build`
- Publish directory: `dist/spa`

### Option 4: Vercel Deployment

#### 4.1 Connect GitHub Repository

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Select your GitHub repository
5. Configure build settings

#### 4.2 Configure Build Settings

- Build Command: `pnpm build`
- Output Directory: `dist/spa`

---

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Node Environment
NODE_ENV=development

# Server Port
PORT=8080

# Add any other configuration as needed
```

### Tailwind CSS Configuration

Tailwind colors are defined in `tailwind.config.ts`. To customize the theme:

1. Edit `tailwind.config.ts`
2. Update color values in `client/global.css`
3. Restart dev server for changes to take effect

Example:
```css
:root {
  --primary: 212 45% 35%;  /* Deep blue */
  --accent: 268 85% 50%;   /* Vibrant purple */
}
```

---

## Troubleshooting

### Issue: Port 8080 Already in Use

**Solution**: Kill the process using that port

```bash
# macOS/Linux
lsof -ti :8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

Or run on a different port:
```bash
PORT=3000 pnpm dev
```

### Issue: CSS Not Loading (Tailwind Not Applied)

**Solution**: Ensure Tailwind config is in root:

```bash
# Check files exist:
ls -la tailwind.config.ts postcss.config.js

# Restart dev server:
pnpm dev
```

### Issue: TypeScript Errors During Build

**Solution**: Run type check and fix errors:

```bash
pnpm typecheck
```

Fix any errors in the source code and run again.

### Issue: Dependencies Not Installing

**Solution**: Clear cache and reinstall:

```bash
pnpm store prune
rm -rf node_modules
pnpm install
```

### Issue: Build Fails in Production

**Solution**: Build locally first to verify:

```bash
pnpm build
pnpm start
# Visit http://localhost:8080
```

Check the build output for errors.

---

## FAQ

### Q: Can I run this on Windows?

**A:** Yes! Node.js works on Windows. Use Command Prompt or PowerShell:

```bash
pnpm dev
# Access at http://localhost:8080
```

For Docker, install Docker Desktop for Windows.

### Q: How do I update the app?

**A:** Pull latest changes and reinstall:

```bash
git pull origin main
pnpm install
pnpm dev
```

### Q: Can I customize the branding?

**A:** Yes! Customize:

1. **Logo**: Update icon in `client/pages/Index.tsx` and `client/pages/Dashboard.tsx`
2. **Name**: Search-replace "PrivacyMetrics" with your name
3. **Colors**: Edit `tailwind.config.ts` and `client/global.css`
4. **Content**: Edit component text in `client/pages/`

### Q: What if I want to add a new page?

**A:** Follow these steps:

1. Create a new file in `client/pages/MyPage.tsx`:
```tsx
export default function MyPage() {
  return <div>My Page Content</div>;
}
```

2. Add route in `client/App.tsx`:
```tsx
import MyPage from "./pages/MyPage";

// In <Routes>:
<Route path="/my-page" element={<MyPage />} />
```

3. Add navigation link in `client/pages/Index.tsx`

4. Access at http://localhost:8080/my-page

### Q: How do I add a new API endpoint?

**A:** Follow these steps:

1. Create route handler in `server/routes/my-endpoint.ts`:
```typescript
import { RequestHandler } from "express";

export const handleMyEndpoint: RequestHandler = (req, res) => {
  res.json({ message: "Hello from my endpoint!" });
};
```

2. Register in `server/index.ts`:
```typescript
import { handleMyEndpoint } from "./routes/my-endpoint";

app.get("/api/my-endpoint", handleMyEndpoint);
```

3. Call from React:
```typescript
const response = await fetch("/api/my-endpoint");
const data = await response.json();
```

### Q: How do I enable HTTPS for local development?

**A:** Use mkcert for self-signed certificates:

```bash
# Install mkcert
brew install mkcert  # macOS
# or download from https://github.com/FiloSottile/mkcert

# Create certificate
mkcert localhost 127.0.0.1

# Use with Node.js
# (Requires code changes to server config)
```

For production, use Let's Encrypt (free HTTPS).

### Q: Can I run multiple instances?

**A:** Yes, on different ports:

```bash
PORT=8080 pnpm dev  # Instance 1
PORT=8081 pnpm dev  # Instance 2
```

With Docker:
```bash
docker run -p 8080:8080 privacy-metrics:latest
docker run -p 8081:8080 privacy-metrics:latest
```

### Q: How do I check if everything is working correctly?

**A:** Run the full test suite:

```bash
pnpm typecheck    # TypeScript validation
pnpm test         # Run tests
pnpm build        # Test production build
pnpm start        # Run production server
```

### Q: What's the recommended Node.js version?

**A:** Node.js 22 LTS (Long Term Support) is recommended.

Check compatibility:
```bash
node --version  # Should be v22.x.x or higher
```

### Q: How do I set up a development team?

**A:** 

1. Each developer clones the repo:
   ```bash
   git clone <repository>
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create a feature branch:
   ```bash
   git checkout -b feature/my-feature
   ```

4. Make changes and test locally:
   ```bash
   pnpm dev
   ```

5. Push and create a pull request:
   ```bash
   git push origin feature/my-feature
   ```

---

## Next Steps

1. **Read the Documentation**: Check `/docs` folder for technical details
2. **Explore the Code**: Review `client/` and `server/` structure
3. **Customize**: Modify branding, colors, and content
4. **Deploy**: Choose your deployment option above
5. **Get Help**: Check GitHub issues or discussions

---

## Support

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review the [FAQ](#faq)
3. Check existing GitHub issues
4. Create a new issue with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (Node.js version, OS, etc.)

---

**Happy deploying! 🚀**
