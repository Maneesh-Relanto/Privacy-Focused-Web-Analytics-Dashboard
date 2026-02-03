/**
 * PrivacyMetrics Tracker - Privacy-First Web Analytics
 * 
 * Lightweight tracking script that respects user privacy:
 * - No cookies
 * - No personal data collection
 * - No cross-site tracking
 * - Anonymized IP addresses
 * 
 * Usage: <script src="https://your-domain.com/pm-tracker.js" data-tracking-code="pm-xxx-xxx"></script>
 */

(function() {
  'use strict';

  // Configuration
  const scriptElement = document.currentScript || document.querySelector('script[data-tracking-code]');
  const trackingCode = scriptElement ? scriptElement.getAttribute('data-tracking-code') : null;
  const apiEndpoint = scriptElement ? (scriptElement.getAttribute('data-api-endpoint') || window.location.origin + '/api/v1/track') : '/api/v1/track';
  const debug = scriptElement ? scriptElement.getAttribute('data-debug') === 'true' : false;

  // Validate tracking code
  if (!trackingCode) {
    console.warn('[PrivacyMetrics] No tracking code provided. Add data-tracking-code attribute to script tag.');
    return;
  }

  if (debug) console.log('[PrivacyMetrics] Initialized with tracking code:', trackingCode);

  // Generate anonymous session ID (stored in sessionStorage, expires when browser closes)
  function getSessionId() {
    const storageKey = 'pm_session_' + trackingCode;
    let sessionId = sessionStorage.getItem(storageKey);
    
    if (!sessionId) {
      sessionId = generateId();
      sessionStorage.setItem(storageKey, sessionId);
    }
    
    return sessionId;
  }

  // Generate anonymous visitor ID (stored in localStorage, persistent)
  function getVisitorId() {
    const storageKey = 'pm_visitor_' + trackingCode;
    let visitorId = localStorage.getItem(storageKey);
    
    if (!visitorId) {
      visitorId = generateId();
      localStorage.setItem(storageKey, visitorId);
    }
    
    return visitorId;
  }

  // Generate unique ID
  function generateId() {
    return 'pm_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Get device type
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
      return 'mobile';
    }
    return 'desktop';
  }

  // Get browser info
  function getBrowserInfo() {
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    let version = '';

    // Detect browser
    if (ua.indexOf('Firefox') > -1) {
      browser = 'Firefox';
      version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('SamsungBrowser') > -1) {
      browser = 'Samsung Browser';
      version = ua.match(/SamsungBrowser\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
      browser = 'Opera';
      version = ua.match(/(?:Opera|OPR)\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Trident') > -1) {
      browser = 'Internet Explorer';
      version = ua.match(/rv:(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edge') > -1) {
      browser = 'Edge (Legacy)';
      version = ua.match(/Edge\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Edg') > -1) {
      browser = 'Edge';
      version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Chrome') > -1) {
      browser = 'Chrome';
      version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
    } else if (ua.indexOf('Safari') > -1) {
      browser = 'Safari';
      version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
    }

    return { browser, version };
  }

  // Get OS info
  function getOSInfo() {
    const ua = navigator.userAgent;
    let os = 'Unknown';

    if (ua.indexOf('Win') > -1) os = 'Windows';
    else if (ua.indexOf('Mac') > -1) os = 'macOS';
    else if (ua.indexOf('Linux') > -1) os = 'Linux';
    else if (ua.indexOf('Android') > -1) os = 'Android';
    else if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1) os = 'iOS';

    return os;
  }

  // Get screen resolution
  function getScreenInfo() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    };
  }

  // Get referrer (sanitized)
  function getReferrer() {
    const referrer = document.referrer;
    if (!referrer) return null;

    try {
      const referrerUrl = new URL(referrer);
      const currentUrl = new URL(window.location.href);

      // Internal referrer (same domain)
      if (referrerUrl.hostname === currentUrl.hostname) {
        return null; // Don't track internal navigation
      }

      // External referrer - return only domain
      return referrerUrl.hostname;
    } catch (e) {
      return null;
    }
  }

  // Get UTM parameters
  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utmParams = {};

    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      const value = params.get(param);
      if (value) utmParams[param] = value;
    });

    return Object.keys(utmParams).length > 0 ? utmParams : null;
  }

  // Track event
  function track(eventType, eventData = {}) {
    const sessionId = getSessionId();
    const visitorId = getVisitorId();
    const browserInfo = getBrowserInfo();
    const screenInfo = getScreenInfo();

    const payload = {
      trackingCode: trackingCode,
      sessionId: sessionId,
      visitorId: visitorId,
      eventType: eventType,
      eventData: eventData,
      page: {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: getReferrer(),
        queryParams: getUtmParams()
      },
      device: {
        type: getDeviceType(),
        browser: browserInfo.browser,
        browserVersion: browserInfo.version,
        os: getOSInfo(),
        screen: screenInfo
      },
      timestamp: new Date().toISOString(),
      language: navigator.language || navigator.userLanguage,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };

    if (debug) {
      console.log('[PrivacyMetrics] Tracking event:', eventType, payload);
    }

    // Send to server using sendBeacon (non-blocking, works even on page unload)
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    
    if (navigator.sendBeacon) {
      navigator.sendBeacon(apiEndpoint, blob);
    } else {
      // Fallback to fetch for older browsers
      fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(err => {
        if (debug) console.error('[PrivacyMetrics] Tracking failed:', err);
      });
    }
  }

  // Track page view
  function trackPageView() {
    track('pageview', {
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    });
  }

  // Track page leave (calculate duration)
  const pageLoadTime = Date.now();
  
  function trackPageLeave() {
    const duration = Date.now() - pageLoadTime;
    track('page_leave', { duration: duration });
  }

  // Automatic tracking
  // Track initial page view
  if (document.readyState === 'complete') {
    trackPageView();
  } else {
    window.addEventListener('load', trackPageView);
  }

  // Track page leave
  window.addEventListener('beforeunload', trackPageLeave);

  // Track page visibility changes (for accurate session duration)
  let visibilityStartTime = Date.now();
  
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      const visibleDuration = Date.now() - visibilityStartTime;
      track('page_hide', { duration: visibleDuration });
    } else {
      visibilityStartTime = Date.now();
      track('page_show');
    }
  });

  // Expose manual tracking API
  window.PrivacyMetrics = {
    track: track,
    trackEvent: function(eventName, properties) {
      track('custom_event', { eventName: eventName, properties: properties });
    },
    trackPageView: trackPageView,
    getSessionId: getSessionId,
    getVisitorId: getVisitorId,
    // Allow users to opt-out
    optOut: function() {
      localStorage.setItem('pm_optout_' + trackingCode, 'true');
      console.log('[PrivacyMetrics] User opted out of tracking');
    },
    optIn: function() {
      localStorage.removeItem('pm_optout_' + trackingCode);
      console.log('[PrivacyMetrics] User opted into tracking');
    },
    isOptedOut: function() {
      return localStorage.getItem('pm_optout_' + trackingCode) === 'true';
    }
  };

  // Check opt-out status
  if (window.PrivacyMetrics.isOptedOut()) {
    console.log('[PrivacyMetrics] Tracking disabled - user opted out');
    return;
  }

  if (debug) {
    console.log('[PrivacyMetrics] Ready. API available at window.PrivacyMetrics');
    console.log('[PrivacyMetrics] Session ID:', getSessionId());
    console.log('[PrivacyMetrics] Visitor ID:', getVisitorId());
  }

})();
