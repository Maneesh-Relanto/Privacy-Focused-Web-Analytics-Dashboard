/**
 * Test Utilities
 * Shared functions for making API calls, setup/teardown, logging, etc.
 */

import fetch from "node-fetch";

// Configuration
const API_URL = process.env.TEST_API_URL || "http://localhost:8080";
const API_TIMEOUT = parseInt(process.env.TEST_API_TIMEOUT || "10000");

// Test state
let testContext: TestContext = {
  accessToken: null,
  userId: null,
  userEmail: null,
  testWebsiteId: null,
  testTrackingCode: null,
  createdIds: {
    users: [],
    websites: [],
    events: [],
  },
};

interface TestContext {
  accessToken: string | null;
  userId: string | null;
  userEmail: string | null;
  testWebsiteId: string | null;
  testTrackingCode: string | null;
  createdIds: {
    users: string[];
    websites: string[];
    events: string[];
  };
}

interface ApiResponse {
  status: number;
  statusText: string;
  data: any;
  headers: Record<string, string>;
  error?: string;
  timing: number;
}

/**
 * Make an API call with proper error handling
 */
export async function apiCall(
  method: string,
  endpoint: string,
  body?: any,
  headers?: Record<string, string>,
  useAuth = true,
): Promise<ApiResponse> {
  const url = `${API_URL}${endpoint}`;
  const startTime = Date.now();

  try {
    const defaultHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (useAuth && testContext.accessToken) {
      defaultHeaders["Authorization"] = `Bearer ${testContext.accessToken}`;
    }

    const options: any = {
      method,
      headers: { ...defaultHeaders, ...headers },
      timeout: API_TIMEOUT,
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    const timing = Date.now() - startTime;

    const result: ApiResponse = {
      status: response.status,
      statusText: response.statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
      timing,
    };

    return result;
  } catch (error) {
    const timing = Date.now() - startTime;
    return {
      status: 0,
      statusText: "Error",
      data: null,
      headers: {},
      error: error instanceof Error ? error.message : "Unknown error",
      timing,
    };
  }
}

/**
 * Setup test environment
 */
export async function setupTest(): Promise<TestContext> {
  log("Setting up test environment...");

  try {
    // Register test user
    const registerResponse = await apiCall(
      "POST",
      "/api/v1/auth/register",
      {
        email: `test-${Date.now()}@example.com`,
        password: "test123secure",
        name: "Test User",
      },
      {},
      false,
    );

    if (registerResponse.status !== 201) {
      logError(`Failed to register test user: ${registerResponse.statusText}`);
      throw new Error("User registration failed");
    }

    const userId = registerResponse.data.user?.id;
    const userEmail = registerResponse.data.user?.email;
    testContext.userId = userId;
    testContext.userEmail = userEmail;
    testContext.createdIds.users.push(userId);
    logSuccess(`Test user created: ${userEmail}`);

    // Login to get token
    const loginResponse = await apiCall(
      "POST",
      "/api/v1/auth/login",
      {
        email: userEmail,
        password: "test123secure",
      },
      {},
      false,
    );

    if (loginResponse.status !== 200) {
      logError(`Failed to login: ${loginResponse.statusText}`);
      throw new Error("Login failed");
    }

    testContext.accessToken = loginResponse.data.accessToken;
    logSuccess("Login successful, token obtained");

    // Create test website
    const websiteResponse = await apiCall("POST", "/api/v1/websites", {
      name: `Test Website ${Date.now()}`,
      domain: `test-${Date.now()}.example.com`,
    });

    if (websiteResponse.status !== 201) {
      logError(`Failed to create website: ${websiteResponse.statusText}`);
      throw new Error("Website creation failed");
    }

    testContext.testWebsiteId = websiteResponse.data.website?.id;
    testContext.testTrackingCode = websiteResponse.data.website?.trackingCode;
    testContext.createdIds.websites.push(testContext.testWebsiteId);
    logSuccess(`Test website created: ${testContext.testTrackingCode}`);

    log("Test setup complete ✅");
    return testContext;
  } catch (error) {
    logError(
      `Test setup failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
    throw error;
  }
}

/**
 * Teardown test environment
 */
export async function teardownTest(context: TestContext): Promise<void> {
  log("Cleaning up test data...");

  try {
    // Delete created websites
    for (const websiteId of context.createdIds.websites) {
      await apiCall("DELETE", `/api/v1/websites/${websiteId}`);
    }
    logSuccess(`Deleted ${context.createdIds.websites.length} websites`);

    // Note: Users and events cascade delete with websites via Prisma
    log("Test cleanup complete ✅");
  } catch (error) {
    logWarning(
      `Cleanup error (continuing): ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Send test events
 */
export async function sendTestEvent(
  trackingCode: string,
  eventType: "pageview" | "click" | "custom" = "pageview",
  properties?: Record<string, any>,
): Promise<ApiResponse> {
  const event = {
    trackingCode,
    eventType,
    url: `https://${trackingCode}.example.com/page-${Math.floor(Math.random() * 5) + 1}`,
    referrer: Math.random() > 0.7 ? "https://google.com/search" : null,
    sessionId: `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    visitorId: `vis-${Math.random().toString(36).substr(2, 9)}`,
    properties,
  };

  const response = await apiCall("POST", "/api/v1/events", event, {}, false);

  if (response.status === 201) {
    testContext.createdIds.events.push(response.data.id);
  }

  return response;
}

/**
 * Send batch events
 */
export async function sendBatchEvents(
  trackingCode: string,
  count: number = 10,
): Promise<ApiResponse> {
  const events = [];
  for (let i = 0; i < count; i++) {
    events.push({
      trackingCode,
      eventType: "pageview",
      url: `https://${trackingCode}.example.com/page-${Math.floor(Math.random() * 5) + 1}`,
      referrer: Math.random() > 0.7 ? "https://google.com/search" : null,
      sessionId: `sess-${Date.now()}-${i}`,
      visitorId: `vis-${Math.floor(Math.random() * 20) + 1}`,
    });
  }

  const response = await apiCall(
    "POST",
    "/api/v1/events/batch",
    { events },
    {},
    false,
  );

  return response;
}

/**
 * Get test context
 */
export function getTestContext(): TestContext {
  return testContext;
}

/**
 * Reset test context
 */
export function resetTestContext(): void {
  testContext = {
    accessToken: null,
    userId: null,
    userEmail: null,
    testWebsiteId: null,
    testTrackingCode: null,
    createdIds: {
      users: [],
      websites: [],
      events: [],
    },
  };
}

/**
 * Logging utilities
 */

export function log(message: string): void {
  console.log(`[TEST] ${message}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("test:log", { detail: { message, level: "info" } }),
    );
  }
}

export function logSuccess(message: string): void {
  console.log(`✅ ${message}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("test:log", { detail: { message, level: "success" } }),
    );
  }
}

export function logError(message: string): void {
  console.error(`❌ ${message}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("test:log", { detail: { message, level: "error" } }),
    );
  }
}

export function logWarning(message: string): void {
  console.warn(`⚠️ ${message}`);
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("test:log", { detail: { message, level: "warning" } }),
    );
  }
}

/**
 * Assertion helpers
 */

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function assertEquals(
  actual: any,
  expected: any,
  message: string,
): void {
  if (actual !== expected) {
    throw new Error(
      `Assertion failed: ${message}\nExpected: ${expected}\nActual: ${actual}`,
    );
  }
}

export function assertExists(value: any, message: string): void {
  if (!value) {
    throw new Error(`Assertion failed: ${message} - value does not exist`);
  }
}

export function assertArray(value: any, message: string): void {
  if (!Array.isArray(value)) {
    throw new Error(`Assertion failed: ${message} - value is not an array`);
  }
}

/**
 * Timing utilities
 */

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function measure<T>(
  name: string,
  fn: () => Promise<T>,
): Promise<T> {
  const startTime = Date.now();
  const result = await fn();
  const duration = Date.now() - startTime;
  logSuccess(`${name} completed in ${duration}ms`);
  return result;
}

/**
 * Export all utilities as default
 */
export default {
  apiCall,
  setupTest,
  teardownTest,
  sendTestEvent,
  sendBatchEvents,
  getTestContext,
  resetTestContext,
  log,
  logSuccess,
  logError,
  logWarning,
  assert,
  assertEquals,
  assertExists,
  assertArray,
  sleep,
  measure,
};
