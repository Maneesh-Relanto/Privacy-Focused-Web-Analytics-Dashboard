# Test Infrastructure Structure

## 📁 Complete Directory Layout

```
tests/
│
├── README.md                          # Complete testing guide
├── QUICK_START.md                     # Quick start (you are here!)
├── STRUCTURE.md                       # This file - directory organization
├── package.json                       # Test scripts and dependencies
├── .env.test                          # Test environment variables
│
├── scripts/                           # Automated test scripts
│   ├── index.ts                       # Main test runner entry point
│   ├── utils.ts                       # Shared utility functions
│   ├── auth.test.ts                   # Authentication tests (7 tests)
│   ├── events.test.ts                 # Event collection tests (9 tests)
│   ├── websites.test.ts               # Website management tests (coming)
│   ├── aggregation.test.ts            # Metric aggregation tests (coming)
│   └── dashboard.test.ts              # Dashboard API tests (coming)
│
├── data/                              # Test data and fixtures
│   ├── fixtures.ts                    # Reusable test data
│   ├── sample-events.json             # Sample event payloads
│   └── test-users.json                # Test user data
│
└── ui/                                # Web-based testing UI
    ├── test-admin.tsx                 # Test admin dashboard component
    ├── components/                    # Reusable UI components
    │   ├── TestRunner.tsx             # Individual test runner
    │   ├── EventTester.tsx            # Manual event sender
    │   └── ResultsViewer.tsx          # Results display
    └── styles.css                     # Test UI styling
```

---

## 🎯 What's in Each Section

### `scripts/` - Automated Tests

These Node.js scripts use the test utilities to verify functionality.

| File | Tests | Purpose |
|------|-------|---------|
| **index.ts** | N/A | Orchestrates all test suites, generates reports |
| **utils.ts** | N/A | Shared functions (API calls, setup, assertions) |
| **auth.test.ts** | 7 | User registration, login, token validation |
| **events.test.ts** | 9 | Event collection, batching, validation |
| **websites.test.ts** | TBD | Website CRUD, tracking code generation |
| **aggregation.test.ts** | TBD | Metric calculations, trend analysis |
| **dashboard.test.ts** | TBD | Dashboard endpoints, data retrieval |

**Total Tests Implemented:** 16/40 (40% complete)

### `data/` - Test Data & Fixtures

Reusable test data that can be used in multiple test scripts.

| File | Contains |
|------|----------|
| **fixtures.ts** | Sample users, websites, events, devices, locations |
| **sample-events.json** | Real event payload examples |
| **test-users.json** | Test user account examples |

### `ui/` - Web Testing Interface

React components for the test admin dashboard at `/test-admin`

| Component | Purpose |
|-----------|---------|
| **test-admin.tsx** | Main dashboard (Status: Ready) |
| **TestRunner.tsx** | Run individual tests |
| **EventTester.tsx** | Manually send events |
| **ResultsViewer.tsx** | Display test results |

---

## 🔄 Test Execution Flow

### Via Web UI (Recommended)

```
User visits /test-admin
         ↓
    Clicks "Run All Tests"
         ↓
  JavaScript loads test utils
         ↓
  Each test suite runs sequentially:
    - Setup environment (create test user, website)
    - Run assertions (make API calls, verify responses)
    - Cleanup (delete test data)
         ↓
  Results display in real-time
         ↓
  User can download/copy logs
```

### Via Command Line

```
pnpm test
    ↓
Node.js loads scripts/index.ts
    ↓
Imports test modules (auth, events, etc)
    ↓
Each runs its test cases
    ↓
Writes summary report to stdout
    ↓
Exit with status code (0 = success, 1 = failure)
```

---

## 📦 Dependencies

### Test Script Dependencies
Located in `/tests/package.json`:
- `node-fetch` - HTTP requests (for Node.js tests)
- `ts-node` - TypeScript execution
- `@types/node` - Type definitions
- `typescript` - TypeScript compiler

### Runtime Dependencies
The test UI uses the existing project dependencies:
- React 18 (already in main project)
- Tailwind CSS (already in main project)
- Radix UI Button component (already in main project)

---

## 🚀 How to Run Tests

### Method 1: Web UI (Easiest) ✅
```bash
pnpm dev
# Navigate to http://localhost:8080/test-admin
# Click "Run All Tests"
```

### Method 2: Command Line
```bash
# Run all tests
pnpm test

# Run specific test
pnpm test:auth
pnpm test:events

# Watch mode (auto-rerun)
pnpm test:watch
```

### Method 3: Individual Tests
```bash
# Run just one test file
node --loader ts-node/esm tests/scripts/auth.test.ts
```

---

## 📊 Test Coverage Status

### Implemented ✅

| Component | Coverage | Tests |
|-----------|----------|-------|
| Authentication | 100% | 7 |
| Event Collection | 100% | 9 |
| **Total Implemented** | **100%** | **16** |

### In Progress 🔄

| Component | Coverage | Tests |
|-----------|----------|-------|
| Website Management | 0% | - |
| Event Aggregation | 0% | - |
| Dashboard API | 0% | - |
| **Total to Implement** | **0%** | **24** |

### Summary
- **Complete:** 16 tests ✅
- **Remaining:** 24 tests (for Phase 3/4)
- **Total:** 40 tests planned

---

## 🔧 Configuration Files

### `.env.test` - Test Environment Variables

Controls test behavior:
```
TEST_API_URL=http://localhost:8080        # API server URL
TEST_API_TIMEOUT=10000                    # Request timeout (ms)
TEST_LOG_LEVEL=debug                      # Verbosity level
TEST_SAMPLE_EVENTS_COUNT=100              # Sample data size
TEST_RETRY_COUNT=1                        # Retry failed tests
```

### `package.json` - Test Scripts

Defines how to run tests:
```json
{
  "scripts": {
    "test": "Run all tests",
    "test:auth": "Run auth tests only",
    "test:watch": "Watch mode",
    "test:ui": "Open test admin page",
    "test:reset": "Clear test data"
  }
}
```

---

## 🔗 Integration with Main App

### Test Admin Route
The test UI is integrated into the main app:
- **Route:** `/test-admin`
- **Component:** `client/pages/TestAdmin.tsx`
- **Added to:** `client/App.tsx`
- **Accessible:** When dev server is running

### Test Scripts Location
Located outside the main codebase:
- **Path:** `/tests/` (separate folder)
- **Reason:** Keep tests isolated from production code
- **Access:** Via CLI or imported by test admin UI

### Test Data
Uses the production API endpoints:
- Creates real data in the database
- No mocking required
- Cleans up after itself

---

## 📈 Testing Workflow

### Before Making Changes
```bash
pnpm test  # Run all tests to verify baseline
```

### After Making Changes
```bash
# Test specific component
pnpm test:auth      # If auth changes

# Or test everything
pnpm test

# Check specific test in UI
# Visit /test-admin and run individual tests
```

### Before Committing
```bash
# Run full test suite
pnpm test

# Verify test admin UI works
# Visit http://localhost:8080/test-admin

# Commit only if all tests pass
git commit -m "Feature: xyz"
```

---

## 🎯 Future Test Additions

### Phase 3 Tests
- Real-time WebSocket updates
- Advanced filtering
- Custom date ranges
- Period comparisons

### Phase 4 Tests
- Conversion tracking
- Funnel analysis
- Custom dashboards
- Alerts and notifications

### Infrastructure Tests
- Database migrations
- Performance benchmarks
- Load testing
- Security scanning

---

## 📝 Test Documentation

### For Users
- **Quick Start:** `tests/QUICK_START.md` - How to run tests
- **Main Guide:** `tests/README.md` - Comprehensive testing guide

### For Developers
- **Structure:** `tests/STRUCTURE.md` - This file
- **Scripts:** Each `.test.ts` file has inline comments
- **Utils:** `tests/scripts/utils.ts` has documented functions

### For DevOps
- **Setup:** `tests/.env.test` - Configuration
- **CI/CD:** Add to your CI pipeline (see `tests/README.md`)
- **Reports:** Generated as JSON (configurable)

---

## 🔐 Security Notes

### Test Data Isolation
- Tests create and delete their own data
- No shared state between test runs
- Safe to run multiple times

### Test Credentials
- Test user email: `test@example.com`
- Test password: `test123secure`
- Only for development/testing

### Cleanup
- All test data is automatically deleted after tests complete
- Manual reset: `curl -X DELETE http://localhost:8080/api/seed`

---

## ✅ Checklist for New Developers

When you're new to the project:

- [ ] Read `tests/QUICK_START.md`
- [ ] Run `pnpm dev`
- [ ] Visit `http://localhost:8080/test-admin`
- [ ] Click "Run All Tests"
- [ ] Review the logs
- [ ] Try individual tests
- [ ] Read `tests/README.md` for details
- [ ] Try `/tracker-test` page
- [ ] Try `/metrics-tester` page

---

**Last Updated:** January 29, 2025

See also:
- [Quick Start Guide](./QUICK_START.md)
- [Complete Testing Guide](./README.md)
- [Main Project README](../README.md)
