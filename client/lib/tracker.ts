/**
 * Lightweight Analytics Tracker
 * - Automatically tracks pageviews
 * - Provides custom event tracking
 * - Batches events for performance
 * - ~2KB gzipped
 */

interface TrackerConfig {
  trackingCode: string;
  apiUrl?: string;
  batchSize?: number;
  flushInterval?: number;
  debug?: boolean;
}

interface EventData {
  trackingCode: string;
  eventType: "pageview" | "custom" | "click" | "scroll";
  url: string;
  referrer?: string;
  sessionId: string;
  visitorId: string;
  properties?: Record<string, unknown>;
}

class AnalyticsTracker {
  private config: Required<TrackerConfig>;
  private sessionId: string;
  private visitorId: string;
  private eventQueue: EventData[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isOnline: boolean = navigator.onLine;

  constructor(config: TrackerConfig) {
    this.config = {
      trackingCode: config.trackingCode,
      apiUrl: config.apiUrl || "/api/v1/events",
      batchSize: config.batchSize || 10,
      flushInterval: config.flushInterval || 5000, // 5 seconds
      debug: config.debug || false,
    };

    this.sessionId = this.getOrCreateSessionId();
    this.visitorId = this.getOrCreateVisitorId();

    this.setupEventListeners();
    this.trackPageView();

    this.log("Tracker initialized", {
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      trackingCode: this.config.trackingCode,
    });
  }

  /**
   * Get or create a session ID
   * Session ID is reset on new browser tab/window
   */
  private getOrCreateSessionId(): string {
    const sessionKey = `pm_session_${this.config.trackingCode}`;
    let sessionId = sessionStorage.getItem(sessionKey);

    if (!sessionId) {
      sessionId = `sess-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(sessionKey, sessionId);
    }

    return sessionId;
  }

  /**
   * Get or create a visitor ID
   * Visitor ID persists across sessions
   */
  private getOrCreateVisitorId(): string {
    const visitorKey = `pm_visitor_${this.config.trackingCode}`;
    let visitorId = localStorage.getItem(visitorKey);

    if (!visitorId) {
      visitorId = `vis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(visitorKey, visitorId);
    }

    return visitorId;
  }

  /**
   * Setup browser event listeners
   */
  private setupEventListeners(): void {
    // Track page visibility changes
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.flush();
      }
    });

    // Track online/offline status
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.log("Back online, flushing queued events");
      this.flush();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.log("Offline, queueing events");
    });

    // Flush events before unload
    window.addEventListener("beforeunload", () => {
      this.flush(true); // Use synchronous request
    });

    // Track clicks on links
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "A") {
        const href = target.getAttribute("href");
        if (href && !href.startsWith("javascript:")) {
          this.track("click", {
            elementText: target.textContent,
            href: href,
          });
        }
      }
    });
  }

  /**
   * Automatically track page view
   */
  private trackPageView(): void {
    const referrer = document.referrer || undefined;

    this.track("pageview", {
      title: document.title,
      pathname: window.location.pathname,
    });

    // Also track history changes (SPA support)
    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const trackStateChange = () => {
      setTimeout(() => {
        this.track("pageview", {
          title: document.title,
          pathname: window.location.pathname,
        });
      }, 0);
    };

    window.history.pushState = function (...args) {
      originalPushState.apply(window.history, args);
      trackStateChange();
      return null;
    } as any;

    window.history.replaceState = function (...args) {
      originalReplaceState.apply(window.history, args);
      trackStateChange();
      return null;
    } as any;
  }

  /**
   * Queue an event for sending
   */
  public track(
    eventType: "pageview" | "custom" | "click" | "scroll",
    properties?: Record<string, unknown>
  ): void {
    const event: EventData = {
      trackingCode: this.config.trackingCode,
      eventType,
      url: window.location.href,
      referrer: document.referrer || undefined,
      sessionId: this.sessionId,
      visitorId: this.visitorId,
      properties,
    };

    this.eventQueue.push(event);
    this.log("Event queued", event);

    // Auto-flush if queue reaches batch size
    if (this.eventQueue.length >= this.config.batchSize) {
      this.flush();
    } else if (!this.flushTimer) {
      // Schedule flush if not already scheduled
      this.flushTimer = setTimeout(() => {
        this.flush();
      }, this.config.flushInterval);
    }
  }

  /**
   * Send queued events to the server
   */
  public async flush(sync = false): Promise<void> {
    if (this.eventQueue.length === 0) {
      return;
    }

    if (!this.isOnline) {
      this.log("Offline, skipping flush");
      return;
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    // Clear any pending flush timer
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    try {
      if (events.length === 1) {
        // Send single event
        await this.sendEvent(events[0], sync);
      } else {
        // Send batch of events
        await this.sendBatch(events, sync);
      }

      this.log("Events sent successfully", { count: events.length });
    } catch (error) {
      this.log("Error sending events, re-queueing", error);
      // Re-queue failed events
      this.eventQueue.unshift(...events);
    }
  }

  /**
   * Send a single event to the API
   */
  private async sendEvent(event: EventData, sync = false): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(event),
      keepalive: sync, // Keep connection alive during page unload
    };

    const response = await fetch(this.config.apiUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Send batch of events to the API
   */
  private async sendBatch(events: EventData[], sync = false): Promise<void> {
    const options: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ events }),
      keepalive: sync,
    };

    const batchUrl = `${this.config.apiUrl}/batch`;
    const response = await fetch(batchUrl, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
  }

  /**
   * Internal logging for debugging
   */
  private log(message: string, data?: unknown): void {
    if (this.config.debug) {
      console.log(`[PivotMetrics] ${message}`, data);
    }
  }
}

/**
 * Global initialization function
 * Attach to window for easy access: window.pv.track('custom', { data })
 */
declare global {
  interface Window {
    pv?: AnalyticsTracker;
    PivotMetrics?: {
      init: (config: TrackerConfig) => AnalyticsTracker;
    };
  }
}

export function initTracker(config: TrackerConfig): AnalyticsTracker {
  const tracker = new AnalyticsTracker(config);
  window.pv = tracker;
  return tracker;
}

export default AnalyticsTracker;
