# Frontend-Backend Integration Guide

**[← Back to README](../README.md)** | **[Documentation Index](./INDEX.md)** | **[Project Structure](./PROJECT_STRUCTURE.md)** | **[API Docs](./API_DOCUMENTATION.md)**

## 📊 Overview

This guide explains how the frontend Dashboard connects to the backend API to display real data instead of hardcoded mock values.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│     Frontend (React)                 │
│   Dashboard.tsx                      │
└──────────────┬──────────────────────┘
               │
        Uses hooks (useDashboardData)
               │
               ↓
┌─────────────────────────────────────┐
│   React Hooks (useDashboardData)    │
│   client/hooks/useDashboardData.ts  │
└──────────────┬──────────────────────┘
               │
        Fetch with Authorization
               │
               ↓
┌─────────────────────────────────────┐
│      Backend (Express.js)            │
│   /api/v1/dashboard/* endpoints     │
│   server/routes/dashboard.ts        │
└──────────────┬──────────────────────┘
               │
        Query Database
               │
               ↓
┌─────────────────────────────────────┐
│   SQLite Database                    │
│   prisma/dev.db                      │
└─────────────────────────────────────┘
```

---

## 🎯 What's Been Implemented

### 1. ✅ API Endpoints Created

**Location**: `server/routes/dashboard.ts`

Endpoints available:

- `GET /api/v1/dashboard/metrics` - Aggregated metrics
- `GET /api/v1/dashboard/chart-data` - Chart data (pageviews & visitors)
- `GET /api/v1/dashboard/top-pages` - Top pages list
- `GET /api/v1/dashboard/referrers` - Referrer sources
- `GET /api/v1/dashboard/devices` - Device distribution
- `GET /api/v1/dashboard/locations` - Geographic data
- `GET /api/v1/dashboard/all` - All data at once

**All endpoints require**: `Authorization: Bearer {token}`

### 2. ✅ React Hooks Created

**Location**: `client/hooks/useDashboardData.ts`

Available hooks:

```typescript
useDashboardData(dateRange); // Fetch all data
useDashboardMetrics(dateRange); // Fetch metrics only
useChartData(dateRange, type); // Fetch chart data
useTopPages(); // Fetch top pages
useReferrers(); // Fetch referrers
useDeviceDistribution(); // Fetch device data
useTopLocations(); // Fetch location data
```

Each hook returns:

```typescript
{
  data: T | null,     // The fetched data
  loading: boolean,   // Loading state
  error: string | null // Error message if failed
}
```

### 3. ✅ TypeScript Types Created

**Location**: `shared/types/dashboard.ts`

- `DashboardMetrics` - Metrics interface
- `DashboardData` - Complete dashboard data
- Chart data types
- Response types

### 4. ✅ API Routes Registered

**Modified**: `server/index.ts`

Dashboard routes mounted at `/api/v1/dashboard`

---

## 🔄 How to Use in Dashboard Component

### Before (Hardcoded Mock Data)

```typescript
export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <MetricCard
      title="Page Views"
      value="45,231"        // ← Hardcoded
      trend={12}
      // ...
    />
  )
}
```

### After (Using Real API Data)

```typescript
import { useDashboardData } from "@/hooks/useDashboardData"

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false)
  const [dateRange, setDateRange] = useState("7d")

  // Fetch data from API
  const { data, loading, error } = useDashboardData(dateRange)

  if (loading) return <DashboardSkeleton />
  if (error) return <ErrorState message={error} />
  if (!data) return <EmptyState />

  // Format metrics for display
  const pageViewsFormatted = Math.floor(data.metrics.pageViews).toLocaleString()
  const sessionDurationFormatted = formatSeconds(data.metrics.sessionDuration)

  return (
    <MetricCard
      title="Page Views"
      value={pageViewsFormatted}  // ← From API
      trend={Math.round(data.metrics.pageViewsTrend)}
      // ...
    />
  )
}
```

---

## 📝 Implementation Steps

### Step 1: Import the Hook

```typescript
import { useDashboardData } from "@/hooks/useDashboardData";
```

### Step 2: Use the Hook in Component

```typescript
const { data, loading, error } = useDashboardData(dateRange);
```

### Step 3: Add Loading State

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
    </div>
  )
}
```

### Step 4: Add Error Handling

```typescript
if (error) {
  return (
    <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
      <p className="text-destructive font-medium">Error loading dashboard</p>
      <p className="text-sm text-destructive/80">{error}</p>
    </div>
  )
}
```

### Step 5: Replace Mock Data with Real Data

```typescript
// Before
<MetricCard value="45,231" />

// After
<MetricCard value={Math.floor(data.metrics.pageViews).toLocaleString()} />
```

---

## 🔐 Authentication

All dashboard endpoints require authentication. The hooks automatically:

1. Get token from `localStorage.getItem('accessToken')`
2. Send it in the `Authorization: Bearer {token}` header
3. Fail gracefully if no token exists

**Make sure users are logged in before viewing dashboard!**

---

## 📊 Data Flow Example

### User wants to see Page Views metric:

```
1. Dashboard component renders
2. useDashboardData("7d") hook is called
3. Hook checks for token in localStorage
4. Hook makes GET request to /api/v1/dashboard/all
5. Request includes: Authorization: Bearer {token}
6. Backend receives request
7. Backend authenticates user via authMiddleware
8. Backend queries database for metrics
9. Backend returns JSON with data
10. Hook updates state with data
11. Component re-renders with real metrics
12. User sees actual data
```

---

## 🧪 Testing the Integration

### 1. Start Backend

```bash
npm run build
npm run start
```

### 2. Login to Get Token

```bash
# Register or login to get access token
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@example.com","password":"SecurePass123"}'

# Copy the accessToken from response
```

### 3. Test API Directly

```bash
curl http://localhost:3000/api/v1/dashboard/metrics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

Should return:

```json
{
  "pageViews": 45231,
  "uniqueVisitors": 12847,
  "sessionDuration": 222,
  "bounceRate": 32.4,
  "pageViewsTrend": 12,
  ...
}
```

### 4. Test in Dashboard

```bash
npm run dev
```

Navigate to `/dashboard` - should display real data from API.

---

## 📈 Response Examples

### Metrics Response

```json
{
  "pageViews": 45231,
  "uniqueVisitors": 12847,
  "sessionDuration": 222,
  "bounceRate": 32.4,
  "pageViewsTrend": 12,
  "visitorsTrend": 8,
  "sessionDurationTrend": -2,
  "bounceRateTrend": 5
}
```

### Chart Data Response

```json
{
  "pageViewsChart": {
    "data": [
      { "date": "2026-01-22", "value": 4523 },
      { "date": "2026-01-23", "value": 5231 },
      { "date": "2026-01-24", "value": 4891 },
      ...
    ]
  },
  "visitorsChart": {
    "data": [
      { "date": "2026-01-22", "value": 1234 },
      { "date": "2026-01-23", "value": 1456 },
      ...
    ]
  }
}
```

---

## 🎯 Next Steps

1. **Modify Dashboard.tsx** to use hooks
2. **Add loading skeleton** component
3. **Add error boundary** for better error handling
4. **Test with real token** from login
5. **Seed database** with real test data
6. **Deploy to production**

---

## 💡 Best Practices

### ✅ DO

- Always check `loading` state before rendering
- Handle `error` state gracefully
- Store token securely (localStorage is minimum, use httpOnly cookies in production)
- Refresh data on date range change
- Show skeleton loaders while loading

### ❌ DON'T

- Hardcode API URLs (they can change)
- Forget to send authorization header
- Ignore loading states (shows jarring UI)
- Display raw error messages to users
- Trust token without verification

---

## 🚀 Performance Optimization (Future)

- Use React Query for automatic caching
- Implement request debouncing for frequent updates
- Add pagination for large datasets
- Cache responses based on date range
- Implement real-time WebSocket updates

---

## 📞 Troubleshooting

### "Not authenticated" error

**Problem**: Getting 401 Unauthorized
**Solution**: Make sure user is logged in. Token might be expired.

### Empty data response

**Problem**: Dashboard shows no data
**Solution**: Backend might be returning null. Check:

- Token is valid
- User is authenticated
- Database has data

### Network error

**Problem**: Can't reach API
**Solution**: Make sure backend is running on port 3000

### CORS error

**Problem**: Cross-origin request blocked
**Solution**: CORS middleware is already configured. Check browser console.

---

## 📚 Related Files

- **Backend routes**: `server/routes/dashboard.ts`
- **React hooks**: `client/hooks/useDashboardData.ts`
- **Types**: `shared/types/dashboard.ts`
- **Dashboard component**: `client/pages/Dashboard.tsx`
- **Server config**: `server/index.ts`

---

**Ready to integrate? Follow the implementation steps above!** 🚀
