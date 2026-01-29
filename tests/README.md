# Testing Infrastructure

This directory contains all testing utilities, scripts, and the test admin UI. These files are **completely separate from the production codebase**.

## 📁 Folder Structure

```
tests/
├── README.md                  # This file
├── package.json              # Test-specific dependencies
├── scripts/                  # Automated test scripts
│   ├── setup.ts             # Test environment setup
│   ├── auth.test.ts         # Authentication tests
│   ├── websites.test.ts     # Website management tests
│   ├── events.test.ts       # Event collection tests
│   ├── aggregation.test.ts  # Metric aggregation tests
│   ├── dashboard.test.ts    # Dashboard API tests
│   └── utils.ts             # Shared test utilities
├── data/                     # Test data and fixtures
│   ├── sample-events.json   # Sample event payloads
│   ├── test-users.json      # Test user data
│   └── fixtures.ts          # Reusable test data
├── ui/                       # Web UI for testing
│   ├── test-admin.tsx       # Test admin dashboard (React component)
│   ├── components/          # UI components for testing
│   │   ├── TestRunner.tsx   # Runs individual tests
│   │   ├── EventTester.tsx  # Event collection tester
│   │   └── ResultsViewer.tsx # Displays test results
│   └── styles.css           # Test UI styles
└── .env.test                # Test environment variables

```

## 🚀 Quick Start

### 1. Install Test Dependencies

```bash
npm install # or pnpm install (uses root package.json)
```

### 2. Run Tests via Web UI

```bash
pnpm dev
# Navigate to: http://localhost:8080/test-admin
```

### 3. Run Tests via Command Line

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test:auth
pnpm test:events
pnpm test:aggregation
```

---

## 📋 Available Test Suites

### Authentication Tests (`scripts/auth.test.ts`)

Tests user registration, login, and token generation

**What it tests:**

- User registration with email/password
- Login with valid credentials
- Token generation and validation
- Protected route access

**Run:** `pnpm test:auth`

### Website Management Tests (`scripts/websites.test.ts`)

Tests CRUD operations for websites

**What it tests:**

- Create website with tracking code
- List websites for user
- Retrieve single website
- Update website settings
- Delete website
- Tracking code validation

**Run:** `pnpm test:websites`

### Event Collection Tests (`scripts/events.test.ts`)

Tests single and batch event collection

**What it tests:**

- Send single pageview event
- Send batch events
- Event validation (tracking code, URL, required fields)
- Error handling (invalid tracking codes, malformed requests)
- Event storage in database

**Run:** `pnpm test:events`

### Aggregation Tests (`scripts/aggregation.test.ts`)

Tests metric calculations from raw events

**What it tests:**

- Page view counting
- Unique visitor identification
- Session grouping and duration
- Bounce rate calculation
- Top pages ranking
- Traffic source analysis
- Device statistics

**Run:** `pnpm test:aggregation`

### Dashboard API Tests (`scripts/dashboard.test.ts`)

Tests dashboard data endpoints

**What it tests:**

- Get overall metrics
- Get time-series pageview data
- Get top pages list
- Get referrer data
- Get device breakdown
- Trend calculations (previous period comparison)

**Run:** `pnpm test:dashboard`

---

## 🧪 Test Admin Web UI

Access the test dashboard at `http://localhost:8080/test-admin`

### Features

**Test Runner**

- Run individual test suites
- Run all tests in sequence
- Real-time test output
- Color-coded results (✅ pass, ❌ fail, ⚠️ skip)

**Test Controls**

- Setup test environment (seed data)
- Reset test data
- Clear logs
- Export results as JSON

**Results Viewer**

- View detailed test output
- See error messages and stack traces
- Timeline of test execution
- Performance metrics

**Manual Testers**

- Event Collection Tester: Send test events and verify they're stored
- Dashboard Tester: Call dashboard APIs and view results
- Authentication Tester: Test login flow

**Logs & Debugging**

- Real-time console logs
- Request/response bodies
- Database query logs
- API response times

---

## 🔧 Writing New Tests

### Test Structure

Each test file should follow this pattern:

```typescript
// tests/scripts/feature.test.ts
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { apiCall, setupTest, teardownTest } from "./utils";

describe("Feature Tests", () => {
  let testData: any;

  beforeAll(async () => {
    testData = await setupTest();
  });

  afterAll(async () => {
    await teardownTest(testData);
  });

  it("should do something", async () => {
    const result = await apiCall("POST", "/api/v1/endpoint", {
      data: "test",
    });

    expect(result.status).toBe(200);
    expect(result.data.id).toBeDefined();
  });
});
```

### Test Utilities (`utils.ts`)

Available helper functions:

```typescript
// Make API calls
apiCall(method, endpoint, body?, headers?)

// Setup/teardown
setupTest() → returns testData
teardownTest(testData) → cleanup

// Database utilities
seedTestData() → creates test user, website, events
clearTestData() → removes all test data

// Logging
log(message) → console + test UI
logSuccess(message)
logError(message)
logWarning(message)
```

---

## 📊 Expected Test Results

When running the full test suite, you should see:

```
✅ Authentication Tests
   ✅ User registration (145ms)
   ✅ User login (98ms)
   ✅ Token validation (52ms)
   Total: 3/3 passed

✅ Website Management Tests
   ✅ Create website (234ms)
   ✅ List websites (89ms)
   ✅ Update website (156ms)
   Total: 3/3 passed

✅ Event Collection Tests
   ✅ Send single event (123ms)
   ✅ Send batch events (267ms)
   ✅ Event validation (78ms)
   Total: 3/3 passed

✅ Aggregation Tests
   ✅ Count pageviews (312ms)
   ✅ Count unique visitors (234ms)
   ✅ Calculate bounce rate (189ms)
   Total: 3/3 passed

✅ Dashboard API Tests
   ✅ Get metrics (167ms)
   ✅ Get trends (234ms)
   Total: 2/2 passed

TOTAL: 14/14 tests passed ✅
```

---

## 🐛 Debugging Failed Tests

### Check the Test Admin UI

- Navigate to `http://localhost:8080/test-admin`
- Look at detailed error messages
- Check request/response bodies
- Review timing and logs

### Check the Console

- Open browser DevTools (F12)
- Check Console tab for errors
- Check Network tab for API calls

### Check the Database

```bash
# View test data
sqlite3 db.sqlite
SELECT * FROM events WHERE websiteId = 'test-website-id';
```

### Run Individual Tests

```bash
pnpm test:events  # Just event tests
pnpm test:events -- --reporter=verbose  # With verbose output
```

---

## 🔄 Test Workflow

### Development Workflow

1. Make code changes
2. Run `pnpm test` to verify
3. Use `/test-admin` UI to manually verify features
4. Fix any failures
5. Commit and push

### Adding New Features

1. Write test cases first (TDD)
2. Implement feature code
3. Run tests to verify
4. Add manual test UI if needed
5. Document in feature guide

### Before Deployment

1. Run full test suite: `pnpm test`
2. Check test UI at `/test-admin`
3. Verify all metrics with sample data
4. Clear test data: `pnpm test:reset`
5. Deploy with confidence

---

## 📝 Environment Variables

Create `.env.test` for test-specific configuration:

```
# API Configuration
TEST_API_URL=http://localhost:3001
TEST_API_TIMEOUT=10000

# Test User Credentials
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=test123secure

# Database
TEST_DATABASE_URL=file:./db.test.sqlite

# Logging
TEST_LOG_LEVEL=debug
TEST_ENABLE_LOGS=true
```

---

## 🎯 Test Coverage Goals

| Component           | Current | Target  |
| ------------------- | ------- | ------- |
| Authentication      | 100%    | 100% ✅ |
| Website Management  | 100%    | 100% ✅ |
| Event Collection    | 95%     | 100%    |
| Aggregation         | 90%     | 100%    |
| Dashboard API       | 85%     | 100%    |
| Frontend Components | 60%     | 80%     |

---

## 📚 Additional Resources

- **Vitest Documentation:** https://vitest.dev/
- **Testing Best Practices:** See `/docs/DEVELOPER_GUIDE.md`
- **API Reference:** See `/docs/API_DOCUMENTATION.md`
- **Architecture:** See `/docs/REAL_DATA_INTEGRATION_GUIDE.md`

---

## ✅ Checklist for Test Maintenance

- [ ] Run full test suite weekly
- [ ] Update tests when adding features
- [ ] Review test coverage reports
- [ ] Clean up old test data
- [ ] Update this README when adding new tests
- [ ] Keep test utilities in sync with API changes

---

**Last Updated:** January 29, 2025
