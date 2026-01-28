# Developer Guide: Privacy-Focused Web Analytics Dashboard

## Overview

This is a self-hosted web analytics dashboard designed with privacy in mind. Developers can use this to collect and view analytics data from their websites without relying on third-party services like Google Analytics.

## What's Currently Implemented (MVP Phase 1)

### ✅ Core Features
- **User Authentication** - Register, login, API key generation
- **Website Management** - Register multiple websites with unique tracking codes
- **Dashboard Interface** - Beautiful UI to view analytics metrics
- **Mock Data** - Sample dashboard endpoints returning analytics data

### ❌ Not Yet Implemented (Phase 2+)
- Actual tracking script for websites
- Real data collection and event storage
- Metric aggregation and calculations
- Visitor profiling and session management

---

## Getting Started

### 1. Installation

```bash
# Clone the repository
git clone https://github.com/Maneesh-Relanto/Privacy-Focused-Web-Analytics-Dashboard.git
cd Privacy-Focused-Web-Analytics-Dashboard

# Install dependencies
pnpm install

# Setup database
npx prisma migrate dev

# Start dev server
pnpm run dev
```

The app will be available at `http://localhost:8080`

---

## Step-by-Step: How to Use the App

### Step 1: Create an Account

**Navigate to:** `http://localhost:8080/dashboard`

**Register a new account:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourname@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "userId": "user123",
  "email": "yourname@example.com",
  "apiKey": "pk_live_abc123def456...",
  "createdAt": "2024-01-28T20:00:00Z"
}
```

### Step 2: Login

```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "yourname@example.com",
    "password": "securePassword123"
  }'
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "userId": "user123"
}
```

Save this `accessToken` - you'll use it for authenticated requests.

### Step 3: Register a Website

Register the website you want to track analytics for:

```bash
curl -X POST http://localhost:3000/api/v1/websites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "name": "My Awesome Website",
    "domain": "example.com",
    "description": "My personal blog and portfolio"
  }'
```

**Response:**
```json
{
  "id": "web_123",
  "userId": "user123",
  "name": "My Awesome Website",
  "domain": "example.com",
  "description": "My personal blog and portfolio",
  "trackingCode": "pm-abc123-1704067200000",
  "createdAt": "2024-01-28T20:00:00Z"
}
```

Save the `trackingCode` - this identifies your website in the system.

### Step 4: View Your Websites

```bash
curl http://localhost:3000/api/v1/websites \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "websites": [
    {
      "id": "web_123",
      "name": "My Awesome Website",
      "domain": "example.com",
      "trackingCode": "pm-abc123-1704067200000",
      "createdAt": "2024-01-28T20:00:00Z"
    }
  ]
}
```

### Step 5: Access the Dashboard

Navigate to `http://localhost:8080/dashboard` and log in with your credentials.

The dashboard shows:
- **Page Views** - Total number of page views
- **Visitors** - Unique visitors count
- **Duration** - Average session duration
- **Bounce Rate** - Percentage of single-page sessions
- **Charts** - Visual trends and analytics data

---

## API Reference

### Authentication Endpoints

#### Register User
- **Method:** `POST`
- **URL:** `/api/v1/auth/register`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** User object with `apiKey` and `accessToken`

#### Login
- **Method:** `POST`
- **URL:** `/api/v1/auth/login`
- **Body:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response:** `{ accessToken, userId }`

#### Get Current User Profile
- **Method:** `GET`
- **URL:** `/api/v1/auth/me`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Response:** User profile object

### Website Management Endpoints

#### Create Website
- **Method:** `POST`
- **URL:** `/api/v1/websites`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Body:**
  ```json
  {
    "name": "Website Name",
    "domain": "example.com",
    "description": "Website description (optional)"
  }
  ```
- **Response:** Website object with `trackingCode`

#### List All Websites
- **Method:** `GET`
- **URL:** `/api/v1/websites`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Response:** Array of website objects

#### Get Website Details
- **Method:** `GET`
- **URL:** `/api/v1/websites/{websiteId}`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Response:** Single website object

#### Update Website
- **Method:** `PUT`
- **URL:** `/api/v1/websites/{websiteId}`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Body:**
  ```json
  {
    "name": "Updated Name",
    "description": "Updated description"
  }
  ```
- **Response:** Updated website object

#### Delete Website
- **Method:** `DELETE`
- **URL:** `/api/v1/websites/{websiteId}`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Response:** `{ message: "Website deleted successfully" }`

### Dashboard Analytics Endpoints (Currently Mock Data)

#### Get All Dashboard Data
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/all?dateRange=7d`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`
- **Query Params:** `dateRange` (7d, 30d, 90d, 1y)
- **Response:** Complete dashboard object with metrics and charts

#### Get Metrics
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/metrics`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

#### Get Chart Data
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/chart-data`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

#### Get Top Pages
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/top-pages`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

#### Get Referrers
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/referrers`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

#### Get Device Distribution
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/devices`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

#### Get Top Locations
- **Method:** `GET`
- **URL:** `/api/v1/dashboard/locations`
- **Headers:** `Authorization: Bearer ACCESS_TOKEN`

---

## Frontend Integration

### Accessing the Dashboard

1. **Navigate to Dashboard:** `http://localhost:8080/dashboard`
2. **Login** with your credentials
3. **View analytics** in the beautiful, privacy-first dashboard

### Using React Hooks (for developers integrating into the app)

```typescript
import { useDashboardData } from "@/hooks/useDashboardData";

export function MyComponent() {
  const { data, loading, error } = useDashboardData("7d");

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <p>Page Views: {data?.metrics?.pageViews}</p>
      <p>Visitors: {data?.metrics?.visitors}</p>
    </div>
  );
}
```

---

## Project Structure

```
.
├── client/                 # Frontend React app
│   ├── pages/             # Page components
│   │   ├── Index.tsx      # Landing page
│   │   └── Dashboard.tsx  # Analytics dashboard
│   ├── components/        # Reusable components
│   ├── hooks/             # Custom React hooks
│   └── App.tsx            # Main app component
├── server/                # Backend Express server
│   ├── routes/            # API route handlers
│   │   ├── auth.ts        # Authentication endpoints
│   │   ├── dashboard.ts   # Dashboard data endpoints
│   │   └── websites.ts    # Website management endpoints
│   └── schemas/           # Zod validation schemas
├── shared/                # Shared types and utilities
├── prisma/                # Database schema
└── index.html             # HTML entry point
```

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database (SQLite by default)
DATABASE_URL="file:./dev.db"

# Server
PORT=3000

# JWT Secret (change this to a strong random value in production)
JWT_SECRET="your-super-secret-key-change-in-production"
```

---

## Building for Production

### Build the Application

```bash
# Build both client and server
pnpm run build

# Or build client only (for GitHub Pages)
pnpm run build:pages
```

### Deploy Landing Page to GitHub Pages

1. Build the client:
   ```bash
   pnpm run build:pages
   ```

2. Configure GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose `main` branch and `/docs` folder

3. Commit and push the built files:
   ```bash
   git add dist/spa -f
   git commit -m "Deploy landing page"
   git push origin main
   ```

Your landing page will be available at:
https://maneesh-relanto.github.io/Privacy-Focused-Web-Analytics-Dashboard/

---

## What's Next (Phase 2+)

To make this fully functional, developers need to implement:

1. **Tracking Script**
   - Create a lightweight JavaScript (~2KB) that websites can embed
   - Collect page views, sessions, device info, referrers

2. **Event Collection**
   - `POST /api/v1/events` endpoint to receive tracking data
   - Validate and store events in the database

3. **Metric Aggregation**
   - Hourly/daily aggregation jobs
   - Calculate bounce rates, session durations, top pages

4. **Visitor Management**
   - Session tracking and identification
   - Device and location detection

5. **Real-time Updates**
   - WebSocket support for live dashboard updates

---

## Support & Resources

- **Database:** SQLite (easily migratable to PostgreSQL via Prisma)
- **Frontend Framework:** React 18 with TypeScript
- **Backend Framework:** Express.js
- **UI Components:** Radix UI with Tailwind CSS
- **Validation:** Zod for runtime type checking
- **Database ORM:** Prisma

---

## Security Considerations

- Passwords are hashed using bcryptjs
- Authentication uses JWT tokens
- API keys are generated for programmatic access
- All endpoints require authentication
- HTTPS should be used in production
- Sensitive routes are protected with middleware

---

## Troubleshooting

### Port Already in Use
```bash
# Change the port in .env
PORT=3001
```

### Database Issues
```bash
# Reset the database
npx prisma migrate reset

# Or seed with initial data (if available)
npx prisma db seed
```

### Authentication Errors
- Ensure you're sending the `Authorization: Bearer TOKEN` header
- Check that your token hasn't expired
- Re-login to get a fresh token

---

## Questions?

For issues, questions, or feature requests, refer to the project repository or documentation files in the `docs/` directory.
