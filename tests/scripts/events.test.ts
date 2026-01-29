/**
 * Event Collection Tests
 * Tests sending single events, batch events, and event validation
 */

import {
  apiCall,
  setupTest,
  teardownTest,
  sendTestEvent,
  sendBatchEvents,
  log,
  logSuccess,
  logError,
  assertEquals,
  assertExists,
  assertArray,
  getTestContext,
} from "./utils";

export async function testEventCollection() {
  log("Running Event Collection Tests...\n");

  let context: any;
  try {
    // Setup
    context = await setupTest();
    const trackingCode = context.testTrackingCode;

    // Test 1: Send Single Pageview Event
    log("Test 1: Send Single Pageview Event");
    const singleEventResponse = await sendTestEvent(trackingCode, "pageview", {
      title: "Test Page",
      pathname: "/test",
    });

    assertEquals(
      singleEventResponse.status,
      201,
      "Single event should return 201",
    );
    assertExists(singleEventResponse.data.id, "Event ID should be returned");
    assertEquals(
      singleEventResponse.data.eventType,
      "pageview",
      "Event type should match",
    );
    logSuccess(
      `✅ Single event sent successfully (${singleEventResponse.timing}ms)\n`,
    );

    // Test 2: Send Click Event
    log("Test 2: Send Click Event");
    const clickEventResponse = await sendTestEvent(trackingCode, "click", {
      elementText: "Click here",
      href: "/link",
    });

    assertEquals(
      clickEventResponse.status,
      201,
      "Click event should return 201",
    );
    assertEquals(
      clickEventResponse.data.eventType,
      "click",
      "Event type should be click",
    );
    logSuccess(
      `✅ Click event sent successfully (${clickEventResponse.timing}ms)\n`,
    );

    // Test 3: Send Custom Event
    log("Test 3: Send Custom Event");
    const customEventResponse = await sendTestEvent(trackingCode, "custom", {
      action: "form_submit",
      form_id: "contact-form",
    });

    assertEquals(
      customEventResponse.status,
      201,
      "Custom event should return 201",
    );
    assertEquals(
      customEventResponse.data.eventType,
      "custom",
      "Event type should be custom",
    );
    logSuccess(
      `✅ Custom event sent successfully (${customEventResponse.timing}ms)\n`,
    );

    // Test 4: Send Batch Events
    log("Test 4: Send Batch Events (10 events)");
    const batchResponse = await sendBatchEvents(trackingCode, 10);

    assertEquals(batchResponse.status, 201, "Batch should return 201");
    assertEquals(
      batchResponse.data.eventsCreated,
      10,
      "Should create 10 events",
    );
    logSuccess(`✅ Batch events sent successfully (${batchResponse.timing}ms)`);
    logSuccess(`   Created: ${batchResponse.data.eventsCreated} events\n`);

    // Test 5: Invalid Tracking Code (should fail)
    log("Test 5: Invalid Tracking Code (should fail)");
    const invalidTrackingResponse = await apiCall(
      "POST",
      "/api/v1/events",
      {
        trackingCode: "invalid-code-123",
        eventType: "pageview",
        url: "https://example.com",
        sessionId: "sess-123",
        visitorId: "vis-123",
      },
      {},
      false,
    );

    assertEquals(
      invalidTrackingResponse.status,
      404,
      "Invalid tracking code should fail with 404",
    );
    logSuccess(
      `✅ Invalid tracking code correctly rejected (${invalidTrackingResponse.timing}ms)\n`,
    );

    // Test 6: Missing Required Fields (should fail)
    log("Test 6: Missing Required Fields (should fail)");
    const missingFieldsResponse = await apiCall(
      "POST",
      "/api/v1/events",
      {
        trackingCode, // Missing other required fields
      },
      {},
      false,
    );

    assertEquals(
      missingFieldsResponse.status,
      400,
      "Missing fields should fail with 400",
    );
    logSuccess(
      `✅ Missing fields correctly rejected (${missingFieldsResponse.timing}ms)\n`,
    );

    // Test 7: Invalid URL Format (should fail)
    log("Test 7: Invalid URL Format (should fail)");
    const invalidUrlResponse = await apiCall(
      "POST",
      "/api/v1/events",
      {
        trackingCode,
        eventType: "pageview",
        url: "not-a-valid-url", // Invalid URL
        sessionId: "sess-123",
        visitorId: "vis-123",
      },
      {},
      false,
    );

    assertEquals(
      invalidUrlResponse.status,
      400,
      "Invalid URL should fail with 400",
    );
    logSuccess(
      `✅ Invalid URL correctly rejected (${invalidUrlResponse.timing}ms)\n`,
    );

    // Test 8: Large Batch (50 events)
    log("Test 8: Large Batch (50 events)");
    const largeBatchResponse = await sendBatchEvents(trackingCode, 50);

    assertEquals(
      largeBatchResponse.status,
      201,
      "Large batch should return 201",
    );
    assertEquals(
      largeBatchResponse.data.eventsCreated,
      50,
      "Should create 50 events",
    );
    logSuccess(
      `✅ Large batch sent successfully (${largeBatchResponse.timing}ms)`,
    );
    logSuccess(`   Created: ${largeBatchResponse.data.eventsCreated} events\n`);

    // Test 9: Event with All Properties
    log("Test 9: Event with All Properties");
    const fullPropertyResponse = await apiCall(
      "POST",
      "/api/v1/events",
      {
        trackingCode,
        eventType: "pageview",
        url: "https://example.com/page",
        referrer: "https://google.com/search?q=test",
        sessionId: `sess-${Date.now()}`,
        visitorId: `vis-${Math.random().toString(36).substr(2, 9)}`,
        deviceType: "desktop",
        browser: "Chrome",
        os: "Windows",
        location: "US",
        properties: {
          title: "Test Page",
          scrollDepth: 75,
          timeOnPage: 45,
        },
      },
      {},
      false,
    );

    assertEquals(
      fullPropertyResponse.status,
      201,
      "Full property event should return 201",
    );
    logSuccess(
      `✅ Full property event sent successfully (${fullPropertyResponse.timing}ms)\n`,
    );

    // Cleanup
    await teardownTest(context);

    logSuccess("\n✅ All Event Collection Tests Passed!\n");
    return {
      success: true,
      testsPassed: 9,
      testsFailed: 0,
      totalEventsCreated: 10 + 50 + 3, // Batch tests + single/click/custom
    };
  } catch (error) {
    logError(
      `\n❌ Event collection test failed: ${error instanceof Error ? error.message : "Unknown error"}\n`,
    );
    if (context) await teardownTest(context);
    return {
      success: false,
      testsPassed: 0,
      testsFailed: 1,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export default testEventCollection;
