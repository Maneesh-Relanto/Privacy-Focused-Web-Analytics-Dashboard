/**
 * PrivacyMetrics - Simple, Privacy-First Analytics
 * Zero cookies, zero fingerprinting, zero BS
 */
(function() {
  'use strict';

  // Get tracking code from script tag data attribute
  const script = document.currentScript || document.querySelector('script[data-code]');
  const trackingCode = script ? script.getAttribute('data-code') : null;
  const apiEndpoint = script ? script.getAttribute('data-api') : null;

  if (!trackingCode) {
    console.warn('[PM] No tracking code found. Add data-code="pm-xxx" to script tag.');
    return;
  }

  const API = apiEndpoint || 'http://localhost:3000/api/v1/track';

  // Generate simple IDs (no cookies, no storage)
  function generateId() {
    return 'pm_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get or create session ID (expires when tab closes)
  const SESSION_KEY = '_pm_sid';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateId();
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }

  // Visitor ID (persists, but no tracking across sites)
  const VISITOR_KEY = '_pm_vid';
  let visitorId = sessionStorage.getItem(VISITOR_KEY);
  if (!visitorId) {
    visitorId = generateId();
    sessionStorage.setItem(VISITOR_KEY, visitorId);
  }

  // Track page view
  function track() {
    const data = {
      code: trackingCode,
      sid: sessionId,
      vid: visitorId,
      url: location.href,
      ref: document.referrer || null,
      t: Date.now()
    };

    // Send beacon (doesn't block page)
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(API, blob);
    } else {
      // Fallback to fetch
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true
      }).catch(function() {
        // Silent fail - don't break the page
      });
    }
  }

  // Track on page load
  if (document.readyState === 'complete') {
    track();
  } else {
    window.addEventListener('load', track);
  }

  // Expose for custom events (optional)
  window.pm = {
    track: track,
    version: '1.0.0'
  };
})();
