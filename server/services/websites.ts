/**
 * Generate a unique tracking code for a website
 * Format: pm-{random-alphanumeric}-{timestamp}
 * Example: pm-a7x9k2-1706425600000
 */
export function generateTrackingCode(): string {
  const randomPart = Math.random().toString(36).substring(2, 8); // 6 character random string
  const timestamp = Date.now();
  return `pm-${randomPart}-${timestamp}`;
}

/**
 * Validate a tracking code format
 */
export function isValidTrackingCode(code: string): boolean {
  const trackingCodeRegex = /^pm-[a-z0-9]{6}-\d{13}$/;
  return trackingCodeRegex.test(code);
}

/**
 * Generate a tracking snippet for embedding in a website
 * This can be used to show users how to implement the tracker
 */
export function generateTrackingSnippet(trackingCode: string): string {
  return `<!-- PrivacyMetrics Tracking -->
<script>
  (function() {
    const trackingCode = '${trackingCode}';
    // Tracking script will be implemented in Phase 2
    console.log('PrivacyMetrics initialized with code:', trackingCode);
  })();
</script>`;
}
