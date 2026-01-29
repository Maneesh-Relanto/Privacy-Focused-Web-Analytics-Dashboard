/**
 * Authentication Tests
 * Tests user registration, login, and token validation
 */

import {
  apiCall,
  log,
  logSuccess,
  logError,
  assertEquals,
  assertExists,
} from "./utils";

export async function testAuthentication() {
  log("Running Authentication Tests...\n");

  try {
    // Test 1: User Registration
    log("Test 1: User Registration");
    const email = `test-${Date.now()}@example.com`;
    const password = "SecurePassword123!";

    const registerResponse = await apiCall(
      "POST",
      "/api/v1/auth/register",
      {
        email,
        password,
        name: "Test User",
      },
      {},
      false,
    );

    assertEquals(registerResponse.status, 201, "Register status should be 201");
    assertExists(registerResponse.data.user?.id, "User ID should be returned");
    assertEquals(
      registerResponse.data.user?.email,
      email,
      "Email should match",
    );
    logSuccess(
      `✅ User registration successful (${registerResponse.timing}ms)\n`,
    );

    const userId = registerResponse.data.user?.id;

    // Test 2: Duplicate Registration (should fail)
    log("Test 2: Duplicate Registration (should fail)");
    const duplicateResponse = await apiCall(
      "POST",
      "/api/v1/auth/register",
      {
        email, // Same email
        password: "AnotherPassword123!",
        name: "Another User",
      },
      {},
      false,
    );

    assertEquals(
      duplicateResponse.status,
      400,
      "Duplicate registration should fail with 400",
    );
    logSuccess(
      `✅ Duplicate registration correctly rejected (${duplicateResponse.timing}ms)\n`,
    );

    // Test 3: User Login
    log("Test 3: User Login");
    const loginResponse = await apiCall(
      "POST",
      "/api/v1/auth/login",
      {
        email,
        password,
      },
      {},
      false,
    );

    assertEquals(loginResponse.status, 200, "Login status should be 200");
    assertExists(
      loginResponse.data.accessToken,
      "Access token should be returned",
    );
    assertEquals(loginResponse.data.user?.id, userId, "User ID should match");
    logSuccess(`✅ User login successful (${loginResponse.timing}ms)\n`);

    const accessToken = loginResponse.data.accessToken;

    // Test 4: Invalid Login (wrong password)
    log("Test 4: Invalid Login (wrong password)");
    const invalidLoginResponse = await apiCall(
      "POST",
      "/api/v1/auth/login",
      {
        email,
        password: "WrongPassword123!",
      },
      {},
      false,
    );

    assertEquals(
      invalidLoginResponse.status,
      401,
      "Invalid login should fail with 401",
    );
    logSuccess(
      `✅ Invalid login correctly rejected (${invalidLoginResponse.timing}ms)\n`,
    );

    // Test 5: Protected Route Access
    log("Test 5: Protected Route Access");
    const protectedResponse = await apiCall(
      "GET",
      "/api/v1/protected",
      undefined,
      { Authorization: `Bearer ${accessToken}` },
      false,
    );

    assertEquals(
      protectedResponse.status,
      200,
      "Protected route should be accessible with token",
    );
    logSuccess(
      `✅ Protected route access granted (${protectedResponse.timing}ms)\n`,
    );

    // Test 6: Protected Route Without Token (should fail)
    log("Test 6: Protected Route Without Token (should fail)");
    const noTokenResponse = await apiCall(
      "GET",
      "/api/v1/protected",
      undefined,
      {},
      false,
    );

    assertEquals(
      noTokenResponse.status,
      401,
      "Protected route without token should fail with 401",
    );
    logSuccess(
      `✅ Protected route correctly blocked (${noTokenResponse.timing}ms)\n`,
    );

    // Test 7: Invalid Token (should fail)
    log("Test 7: Invalid Token (should fail)");
    const invalidTokenResponse = await apiCall(
      "GET",
      "/api/v1/protected",
      undefined,
      { Authorization: "Bearer invalid-token-xyz" },
      false,
    );

    assertEquals(
      invalidTokenResponse.status,
      401,
      "Invalid token should fail with 401",
    );
    logSuccess(
      `✅ Invalid token correctly rejected (${invalidTokenResponse.timing}ms)\n`,
    );

    logSuccess("\n✅ All Authentication Tests Passed!\n");
    return {
      success: true,
      testsPassed: 7,
      testsFailed: 0,
    };
  } catch (error) {
    logError(
      `\n❌ Authentication test failed: ${error instanceof Error ? error.message : "Unknown error"}\n`,
    );
    return {
      success: false,
      testsPassed: 0,
      testsFailed: 1,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Export for use in test admin UI
export default testAuthentication;
