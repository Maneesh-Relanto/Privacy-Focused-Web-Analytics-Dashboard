/**
 * Main Test Runner
 * Orchestrates all test suites and generates reports
 */

import testAuthentication from './auth.test';
import testEventCollection from './events.test';

interface TestReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  duration: number;
  suites: Array<{
    name: string;
    passed: number;
    failed: number;
    duration: number;
  }>;
}

/**
 * Run all tests
 */
export async function runAllTests(): Promise<TestReport> {
  const startTime = Date.now();
  const report: TestReport = {
    timestamp: new Date().toISOString(),
    totalTests: 0,
    passed: 0,
    failed: 0,
    duration: 0,
    suites: [],
  };

  console.log('\n');
  console.log('╔════════════════════════════════════════╗');
  console.log('║     TEST SUITE - Privacy Analytics      ║');
  console.log('║        Running All Test Suites         ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\n');

  try {
    // Test 1: Authentication
    console.log('📋 Running Authentication Tests...');
    const authStart = Date.now();
    const authResult = await testAuthentication();
    const authDuration = Date.now() - authStart;

    if (authResult.success) {
      console.log(`✅ Authentication Tests Passed (${authDuration}ms)\n`);
      report.suites.push({
        name: 'Authentication',
        passed: authResult.testsPassed,
        failed: 0,
        duration: authDuration,
      });
      report.passed += authResult.testsPassed;
      report.totalTests += authResult.testsPassed;
    } else {
      console.log(`❌ Authentication Tests Failed\n`);
      report.suites.push({
        name: 'Authentication',
        passed: 0,
        failed: 1,
        duration: authDuration,
      });
      report.failed += 1;
      report.totalTests += 1;
    }

    // Test 2: Event Collection
    console.log('📋 Running Event Collection Tests...');
    const eventsStart = Date.now();
    const eventsResult = await testEventCollection();
    const eventsDuration = Date.now() - eventsStart;

    if (eventsResult.success) {
      console.log(`✅ Event Collection Tests Passed (${eventsDuration}ms)\n`);
      report.suites.push({
        name: 'Event Collection',
        passed: eventsResult.testsPassed,
        failed: 0,
        duration: eventsDuration,
      });
      report.passed += eventsResult.testsPassed;
      report.totalTests += eventsResult.testsPassed;
    } else {
      console.log(`❌ Event Collection Tests Failed\n`);
      report.suites.push({
        name: 'Event Collection',
        passed: 0,
        failed: 1,
        duration: eventsDuration,
      });
      report.failed += 1;
      report.totalTests += 1;
    }

    // Generate report
    report.duration = Date.now() - startTime;

    console.log('╔════════════════════════════════════════╗');
    console.log('║            TEST REPORT SUMMARY         ║');
    console.log('╚════════════════════════════════════════╝\n');

    for (const suite of report.suites) {
      const status = suite.failed === 0 ? '✅' : '❌';
      console.log(`${status} ${suite.name}`);
      console.log(`   Passed: ${suite.passed} | Failed: ${suite.failed} | Duration: ${suite.duration}ms`);
    }

    console.log('\n' + '═'.repeat(40));
    const totalStatus = report.failed === 0 ? '✅' : '⚠️';
    console.log(`${totalStatus} Total: ${report.passed}/${report.totalTests} passed`);
    console.log(`⏱️  Total Duration: ${report.duration}ms`);
    console.log('═'.repeat(40) + '\n');

    if (report.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! 🎉\n');
    } else {
      console.log(`⚠️  ${report.failed} test suite(s) failed\n`);
    }

    return report;
  } catch (error) {
    console.error('Fatal error running tests:', error);
    throw error;
  }
}

/**
 * Run specific test suite
 */
export async function runTestSuite(suiteName: string): Promise<any> {
  switch (suiteName.toLowerCase()) {
    case 'auth':
    case 'authentication':
      return testAuthentication();
    case 'events':
    case 'event-collection':
      return testEventCollection();
    default:
      throw new Error(`Unknown test suite: ${suiteName}`);
  }
}

// Export for use in test admin UI
export default {
  runAllTests,
  runTestSuite,
};
