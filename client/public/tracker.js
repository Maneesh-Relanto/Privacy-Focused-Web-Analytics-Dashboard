/**
 * Lightweight Analytics Tracker Embed Script
 * 
 * Usage:
 * <script>
 *   window.TRACKER_CODE = 'your-tracking-code-here';
 *   window.TRACKER_API = 'https://analytics.example.com/api/v1/events';
 * </script>
 * <script src="https://analytics.example.com/tracker.js" async></script>
 */

(function() {
  // Get tracking code from window or script attribute
  const trackingCode = window.TRACKER_CODE || 
    document.currentScript?.getAttribute('data-tracking-code') ||
    'pm-missing-code';
  
  const apiUrl = window.TRACKER_API || 
    document.currentScript?.getAttribute('data-api-url') ||
    '/api/v1/events';

  // Helper to generate unique IDs
  function generateId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  // Session ID management (reset per tab/window)
  function getOrCreateSessionId() {
    const sessionKey = 'pm_session_' + trackingCode;
    let sessionId = sessionStorage.getItem(sessionKey);
    
    if (!sessionId) {
      sessionId = generateId('sess');
      sessionStorage.setItem(sessionKey, sessionId);
    }
    
    return sessionId;
  }

  // Visitor ID management (persistent across sessions)
  function getOrCreateVisitorId() {
    const visitorKey = 'pm_visitor_' + trackingCode;
    let visitorId = localStorage.getItem(visitorKey);
    
    if (!visitorId) {
      visitorId = generateId('vis');
      localStorage.setItem(visitorKey, visitorId);
    }
    
    return visitorId;
  }

  // Event queue for batching
  let eventQueue = [];
  let flushTimer = null;
  let isOnline = navigator.onLine;
  const BATCH_SIZE = 10;
  const FLUSH_INTERVAL = 5000; // 5 seconds
  const API_BATCH_URL = apiUrl.endsWith('/batch') ? apiUrl : apiUrl + '/batch';
  const API_SINGLE_URL = apiUrl;

  const sessionId = getOrCreateSessionId();
  const visitorId = getOrCreateVisitorId();

  function log(message, data) {
    if (window.TRACKER_DEBUG) {
      console.log('[PivotMetrics] ' + message, data);
    }
  }

  function queueEvent(eventType, properties) {
    const event = {
      trackingCode: trackingCode,
      eventType: eventType,
      url: window.location.href,
      referrer: document.referrer || undefined,
      sessionId: sessionId,
      visitorId: visitorId,
      properties: properties
    };

    eventQueue.push(event);
    log('Event queued', event);

    if (eventQueue.length >= BATCH_SIZE) {
      flush();
    } else if (!flushTimer) {
      flushTimer = setTimeout(flush, FLUSH_INTERVAL);
    }
  }

  function flush(sync) {
    if (eventQueue.length === 0 || !isOnline) {
      return;
    }

    const events = eventQueue.slice();
    eventQueue = [];

    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }

    try {
      if (events.length === 1) {
        sendEvent(events[0], sync);
      } else {
        sendBatch(events, sync);
      }
      log('Events flushed', { count: events.length });
    } catch (error) {
      log('Error flushing events', error);
      eventQueue.unshift.apply(eventQueue, events);
    }
  }

  function sendEvent(event, sync) {
    const request = new XMLHttpRequest();
    request.open('POST', API_SINGLE_URL, !sync);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify(event));
  }

  function sendBatch(events, sync) {
    const request = new XMLHttpRequest();
    request.open('POST', API_BATCH_URL, !sync);
    request.setRequestHeader('Content-Type', 'application/json');
    request.send(JSON.stringify({ events: events }));
  }

  // Setup event listeners
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      flush();
    }
  });

  window.addEventListener('online', function() {
    isOnline = true;
    log('Back online');
    flush();
  });

  window.addEventListener('offline', function() {
    isOnline = false;
    log('Offline');
  });

  window.addEventListener('beforeunload', function() {
    flush(true);
  });

  // Track clicks on links
  document.addEventListener('click', function(e) {
    var target = e.target;
    while (target) {
      if (target.tagName === 'A') {
        var href = target.getAttribute('href');
        if (href && !href.startsWith('javascript:')) {
          queueEvent('click', {
            elementText: target.textContent,
            href: href
          });
        }
        break;
      }
      target = target.parentElement;
    }
  });

  // Track initial pageview
  function trackPageView() {
    queueEvent('pageview', {
      title: document.title,
      pathname: window.location.pathname
    });
  }

  // Track SPA navigation
  var originalPushState = window.history.pushState;
  var originalReplaceState = window.history.replaceState;

  function trackStateChange() {
    setTimeout(trackPageView, 0);
  }

  window.history.pushState = function() {
    originalPushState.apply(window.history, arguments);
    trackStateChange();
  };

  window.history.replaceState = function() {
    originalReplaceState.apply(window.history, arguments);
    trackStateChange();
  };

  // Public API
  window.PivotMetrics = {
    track: function(eventType, properties) {
      queueEvent(eventType, properties);
    },
    flush: flush
  };

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', trackPageView);
  } else {
    trackPageView();
  }

  log('Tracker loaded', {
    trackingCode: trackingCode,
    sessionId: sessionId,
    visitorId: visitorId
  });
})();
