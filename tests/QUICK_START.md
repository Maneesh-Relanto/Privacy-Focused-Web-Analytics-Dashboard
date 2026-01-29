# Quick Start - Testing Guide

## 🚀 Access Test Admin Dashboard

The easiest way to test everything is through the web UI:

1. Make sure the dev server is running: `pnpm dev`
2. Navigate to: **http://localhost:8080/test-admin**
3. Click **"Run All Tests"** button
4. Watch the tests execute in real-time
5. View results and logs

## 📊 What You'll See

### Test Results Cards
Each test suite shows:
- **Status:** ✅ (passed) ❌ (failed) ⏳ (running) ⭕ (pending)
- **Duration:** Time taken in milliseconds
- **Message:** Details about the test result
- **Run Test Button:** Execute just that test

### Test Logs
Real-time output showing:
- Timestamps for each action
- Color-coded results (green = success, red = error, yellow = warning)
- Detailed request/response information
- Performance metrics

### Controls
- **Run All Tests** - Execute all test suites sequentially
- **Reset** - Clear results and logs
- **Copy** - Copy all logs to clipboard
- **Download** - Download logs as a `.txt` file

---

## 🧪 What Gets Tested

### 1️⃣ Authentication Tests
Tests user registration, login, and token validation:
- ✅ User registration with email/password
- ✅ Duplicate registration rejection
- ✅ Login with valid credentials
- ✅ Login failure with wrong password
- ✅ Protected route access with token
- ✅ Protected route rejection without token
- ✅ Invalid token rejection

**Expected:** 7/7 tests to pass ✅

### 2️⃣ Event Collection Tests
Tests sending and validating events:
- ✅ Send single pageview event
- ✅ Send click event
- ✅ Send custom event
- ✅ Send batch of 10 events
- ✅ Reject invalid tracking code
- ✅ Reject missing required fields
- ✅ Reject invalid URL format
- ✅ Send large batch of 50 events
- ✅ Send event with all properties

**Expected:** 9/9 tests to pass ✅

### 3️⃣ Dashboard API Tests *(Coming Soon)*
Tests metric retrieval and aggregation:
- Get overall metrics
- Get time-series data
- Get top pages
- Get traffic sources
- Get device breakdown
- Calculate trends vs previous period

### 4️⃣ Aggregation Tests *(Coming Soon)*
Tests metric calculations:
- Count pageviews
- Count unique visitors
- Group sessions
- Calculate bounce rate
- Calculate session duration
- Rank top pages
- Analyze traffic sources

---

## 💻 Command Line Tests (Advanced)

If you prefer running tests from the command line:

```bash
# Run all tests
pnpm test

# Run specific test suite
pnpm test:auth        # Authentication only
pnpm test:events      # Event collection only

# Run with watch mode (auto-rerun on changes)
pnpm test:watch

# Reset test data
pnpm test:reset
```

---

## 📝 Test Data Management

### Automatic Setup
Each test automatically:
1. Creates a test user
2. Generates an authentication token
3. Creates a test website
4. Creates test events
5. Cleans up after itself

### Manual Setup
To create test data without running tests:

```bash
# Create test data via API
curl -X POST http://localhost:8080/api/seed

# Response includes:
# - Test user email: test@example.com
# - Test password: test123
# - Tracking code: pm-test-xxxxx
# - Sample events: 168 (last 7 days)
```

### Manual Cleanup
```bash
# Clear all test data
curl -X DELETE http://localhost:8080/api/seed
```

---

## 🔍 Interpreting Test Results

### ✅ All Green (Success)
```
✅ Authentication Tests
   Passed: 7 | Failed: 0 | Duration: 234ms
```
Everything is working correctly!

### ⚠️ Some Red (Failures)
```
❌ Event Collection Tests
   Passed: 8 | Failed: 1 | Duration: 892ms
```
Check the test logs for specific error messages.

### ❌ All Red (Major Issues)
```
❌ Dashboard API Tests
   Passed: 0 | Failed: 4 | Duration: 1234ms
```
Backend might not be running. Check:
1. Is `pnpm dev` running?
2. Check browser console (F12) for errors
3. Check terminal logs for backend errors

---

## 🛠️ Troubleshooting

### Test Page Shows "Click Run All Tests to Start Testing..."
This is normal! The page is waiting for you to click the button to start tests.

### Tests Are Slow
- First test run initializes data: This is normal
- Subsequent runs should be faster
- Check your internet connection/server latency

### "Failed to reach API" Error
```bash
# Make sure dev server is running:
pnpm dev

# Check server is on port 3001:
curl http://localhost:8080/api/ping
# Should return: {"message":"ping"}
```

### "Tracking code not found" Error
This means the test website wasn't created. Check:
1. Is the test user authenticated?
2. Are there database errors?
3. Try running `/api/seed` to create fresh test data

### Tests Time Out
Increase the timeout in `/tests/.env.test`:
```
TEST_API_TIMEOUT=20000  # 20 seconds instead of 10
```

---

## 📊 Sample Output

Here's what successful test output looks like:

```
[14:23:45] Starting: Authentication
[14:23:45] Test user created: test-1234567890@example.com
[14:23:45] Login successful, token obtained
[14:23:46] Test website created: pm-test-1234567890
✅ Authentication - PASSED (1234ms)

[14:23:46] Starting: Event Collection
[14:23:46] Single event sent successfully (145ms)
[14:23:46] Click event sent successfully (89ms)
[14:23:46] Custom event sent successfully (234ms)
[14:23:47] Batch events sent successfully (567ms)
✅ Event Collection - PASSED (2345ms)

✅ All tests completed in 3579ms
Results: 2 passed, 0 failed
```

---

## 📚 Next Steps

1. **Run the tests** - Click "Run All Tests" on `/test-admin`
2. **Review results** - Check what passed/failed in the logs
3. **Test the tracker** - Go to `/tracker-test` to manually send events
4. **View metrics** - Go to `/metrics-tester` to see aggregated data
5. **Check dashboard** - Go to `/dashboard` to view analytics

---

## 🎯 Common Test Scenarios

### Scenario 1: Test Event Collection End-to-End
1. Go to `/test-admin` and run "Event Collection Tests"
2. Go to `/tracker-test` and send some manual events
3. Go to `/metrics-tester` and verify events appear
4. Go to `/dashboard` to see the metrics

### Scenario 2: Test Authentication Flow
1. Go to `/test-admin` and run "Authentication Tests"
2. All tests should pass including registration, login, token validation

### Scenario 3: Full System Test
1. Run "Run All Tests" on `/test-admin`
2. Check that all tests pass (should be 4/4 test suites)
3. Use `/tracker-test` to send real events
4. Verify metrics appear in `/dashboard`
5. Download test logs for documentation

---

## 🚀 Tips & Tricks

### Tip 1: Run Tests Frequently
Run tests before committing code to catch issues early:
```bash
# Quick test before commit
pnpm test && git commit -am "Feature X"
```

### Tip 2: Monitor Performance
Each test shows execution time. Track if:
- Tests are getting slower
- API response times are degrading
- Database queries need optimization

### Tip 3: Combine Manual & Automated Testing
- **Automated tests** verify everything works
- **Manual tests** (/tracker-test, /metrics-tester) let you explore features

### Tip 4: Use Test Logs for Debugging
The detailed logs show:
- Exact API requests and responses
- Timing information
- Error messages and stack traces
- Great for debugging issues

---

## 📞 Getting Help

**Tests not running?**
1. Check that `pnpm dev` is running
2. Verify port 8080 is accessible
3. Look at browser console (F12) for errors
4. Check terminal for backend errors

**Specific test failing?**
1. Check the test logs for error details
2. Read the test file: `tests/scripts/xxx.test.ts`
3. Check the API documentation: `docs/API_DOCUMENTATION.md`
4. Try the endpoint manually with curl

**Need more info?**
- Read `/tests/README.md` for comprehensive guide
- Check test source code in `/tests/scripts/`
- Review API docs in `/docs/API_DOCUMENTATION.md`

---

**Happy Testing! 🎉**

Last Updated: January 29, 2025
