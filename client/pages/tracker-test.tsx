import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, AlertTriangle, Copy } from 'lucide-react';

export default function TrackerTest() {
  const [trackingCode, setTrackingCode] = useState('');
  const [inputTrackingCode, setInputTrackingCode] = useState('');
  const [debugLog, setDebugLog] = useState<string[]>([]);
  const [isTrackerLoaded, setIsTrackerLoaded] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/events');
  const [trackerReady, setTrackerReady] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  // Load tracking code from localStorage or use default
  useEffect(() => {
    const stored = localStorage.getItem('selectedWebsiteId');
    if (stored) {
      setInputTrackingCode(stored);
      setTrackingCode(stored);
    }
    
    addLog('Tracker test page initialized');
    addLog(`API Endpoint: ${apiEndpoint}`);
  }, []);

  // Initialize tracker when tracking code changes
  useEffect(() => {
    if (!trackingCode) {
      setIsTrackerLoaded(false);
      setTrackerReady(false);
      return;
    }

    // Cleanup previous script
    const scripts = document.querySelectorAll('script[src="/tracker.js"]');
    scripts.forEach(s => s.remove());

    // Configure tracker
    (window as any).TRACKER_CODE = trackingCode;
    (window as any).TRACKER_API = apiEndpoint;
    (window as any).TRACKER_DEBUG = true;

    addLog(`Initializing tracker with code: ${trackingCode}`);
    addLog(`Using API endpoint: ${apiEndpoint}`);

    // Load the tracker script
    const script = document.createElement('script');
    script.src = '/tracker.js';
    script.async = true;
    script.onload = () => {
      addLog('✅ Tracker script loaded successfully');
    };
    script.onerror = () => {
      addLog('❌ Error loading tracker script from /tracker.js');
    };
    document.head.appendChild(script);

    // Check if tracker is loaded
    let attempts = 0;
    const checkTracker = setInterval(() => {
      attempts++;
      if ((window as any).PivotMetrics) {
        setIsTrackerLoaded(true);
        setTrackerReady(true);
        clearInterval(checkTracker);
        addLog('✅ Tracker initialized successfully');
        addLog('Available functions: window.PivotMetrics.track(), window.PivotMetrics.flush()');
        addLog('Ready to test events!');
      } else if (attempts > 50) {
        clearInterval(checkTracker);
        addLog('⚠️ Tracker initialization timeout');
      }
    }, 100);

    return () => clearInterval(checkTracker);
  }, [trackingCode, apiEndpoint]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const verifyAndSetupTracker = async () => {
    if (!inputTrackingCode.trim()) {
      setVerificationError('Please enter a tracking code');
      return;
    }

    setIsVerifying(true);
    setVerificationError(null);
    
    try {
      // Try to verify the tracking code by checking if we can send an event
      const response = await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: inputTrackingCode,
          eventType: 'pageview',
          url: window.location.href,
          sessionId: 'verify-' + Date.now(),
          visitorId: 'verify-' + Math.random().toString(36).substr(2, 9),
        }),
      });

      if (response.status === 201) {
        addLog(`✅ Tracking code verified: ${inputTrackingCode}`);
        setTrackingCode(inputTrackingCode);
        localStorage.setItem('selectedWebsiteId', inputTrackingCode);
        setVerificationError(null);
      } else if (response.status === 404) {
        setVerificationError('Tracking code not found. Please create a website first from the dashboard.');
        addLog(`❌ Tracking code not found: ${inputTrackingCode}`);
      } else {
        const error = await response.json();
        setVerificationError(`Error: ${error.message || 'Unknown error'}`);
        addLog(`❌ Verification failed: ${error.message}`);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Network error';
      setVerificationError(`Network error: ${message}`);
      addLog(`❌ Network error during verification: ${message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const trackPageView = () => {
    if (!trackerReady) {
      addLog('⚠️ Tracker not ready. Please set up a tracking code first.');
      return;
    }
    addLog('Tracking pageview event...');
    (window as any).PivotMetrics?.track?.('pageview', {
      title: document.title,
      pathname: window.location.pathname,
    });
  };

  const trackCustomEvent = () => {
    if (!trackerReady) {
      addLog('⚠️ Tracker not ready. Please set up a tracking code first.');
      return;
    }
    const eventData = {
      type: 'test_event',
      action: 'button_click',
      timestamp: new Date().toISOString(),
    };
    addLog(`Tracking custom event: ${JSON.stringify(eventData)}`);
    (window as any).PivotMetrics?.track?.('custom', eventData);
  };

  const trackMultipleEvents = () => {
    if (!trackerReady) {
      addLog('⚠️ Tracker not ready. Please set up a tracking code first.');
      return;
    }
    addLog('Tracking 5 custom events for batch test...');
    for (let i = 1; i <= 5; i++) {
      (window as any).PivotMetrics?.track?.('custom', {
        type: 'batch_test',
        eventNumber: i,
        timestamp: new Date().toISOString(),
      });
      addLog(`  Event ${i} queued`);
    }
    addLog('Waiting 5 seconds for auto-flush...');
  };

  const flushEvents = () => {
    if (!trackerReady) {
      addLog('⚠️ Tracker not ready. Please set up a tracking code first.');
      return;
    }
    addLog('Manually flushing all queued events...');
    (window as any).PivotMetrics?.flush?.();
  };

  const checkLocalStorage = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('pm_visitor_') || k.startsWith('pm_session_')
    );
    if (keys.length === 0) {
      addLog('No visitor/session IDs found in localStorage');
      return;
    }
    addLog(`Found ${keys.length} tracker IDs:`);
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      addLog(`  ${key}: ${value}`);
    });
  };

  const clearAndReset = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('pm_visitor_') || k.startsWith('pm_session_')
    );
    keys.forEach((key) => localStorage.removeItem(key));
    const sessionKeys = Object.keys(sessionStorage).filter((k) =>
      k.startsWith('pm_visitor_') || k.startsWith('pm_session_')
    );
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    addLog(`✅ Cleared ${keys.length + sessionKeys.length} tracker IDs`);
    setDebugLog([]);
    window.location.reload();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addLog('✅ Copied to clipboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Tracking Script Test Page</h1>
        <p className="text-slate-400 mb-8">
          Test the lightweight analytics tracker and verify event collection
        </p>

        {/* Setup Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Setup Tracker</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tracking Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputTrackingCode}
                  onChange={(e) => setInputTrackingCode(e.target.value)}
                  placeholder="Enter your tracking code (e.g., pm-abc123xyz)"
                  className="flex-1 px-4 py-2 rounded bg-slate-700 text-white placeholder-slate-500 border border-slate-600 focus:outline-none focus:border-blue-500"
                  disabled={isVerifying}
                />
                <Button
                  onClick={verifyAndSetupTracker}
                  disabled={isVerifying || !inputTrackingCode.trim()}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Setup'}
                </Button>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                You can find your tracking code in the dashboard after creating a website.
              </p>
            </div>

            {verificationError && (
              <div className="flex items-start gap-3 p-4 rounded bg-red-900/20 border border-red-700">
                <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-300">Setup Error</p>
                  <p className="text-red-200 text-sm">{verificationError}</p>
                </div>
              </div>
            )}

            {trackerReady && (
              <div className="flex items-start gap-3 p-4 rounded bg-green-900/20 border border-green-700">
                <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-green-300">Tracker Ready</p>
                  <p className="text-green-200 text-sm">Tracking code verified and tracker initialized successfully</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Status Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Tracker Status</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Script Loaded</p>
              <p className={`text-lg font-bold ${isTrackerLoaded ? 'text-green-400' : 'text-red-400'}`}>
                {isTrackerLoaded ? '✅ YES' : '❌ NO'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Ready to Track</p>
              <p className={`text-lg font-bold ${trackerReady ? 'text-green-400' : 'text-yellow-400'}`}>
                {trackerReady ? '✅ YES' : '⏳ NO'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">API Endpoint</p>
              <p className="text-sm font-mono text-blue-400">{apiEndpoint}</p>
            </div>
          </div>
        </div>

        {/* Event Tracking Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Track Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={trackPageView}
              disabled={!trackerReady}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Track Pageview
            </Button>
            <Button
              onClick={trackCustomEvent}
              disabled={!trackerReady}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Track Custom Event
            </Button>
            <Button
              onClick={trackMultipleEvents}
              disabled={!trackerReady}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Track 5 Events (Batch)
            </Button>
            <Button
              onClick={flushEvents}
              disabled={!trackerReady}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Flush Events Now
            </Button>
          </div>
        </div>

        {/* Local Storage Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Session & Visitor IDs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={checkLocalStorage}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded"
            >
              Check Local Storage
            </Button>
            <Button
              onClick={clearAndReset}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Clear & Reset
            </Button>
          </div>
        </div>

        {/* Debug Log Section */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center justify-between">
            <span>Debug Log</span>
            <Button
              onClick={() => setDebugLog([])}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
            >
              Clear
            </Button>
          </h2>
          <div className="bg-slate-900 rounded p-4 h-80 overflow-y-auto font-mono text-xs">
            {debugLog.length === 0 ? (
              <p className="text-slate-500">Logs will appear here...</p>
            ) : (
              debugLog.map((log, i) => (
                <div key={i} className="text-slate-300 mb-1 hover:bg-slate-800 px-2 py-0.5 rounded cursor-pointer" onClick={() => copyToClipboard(log)}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Quick Start Guide
          </h2>
          <ol className="list-decimal list-inside space-y-3 text-slate-300">
            <li><strong>Create a Website:</strong> Go to the dashboard, create a website, and copy its tracking code</li>
            <li><strong>Setup Tracker:</strong> Paste the tracking code above and click "Setup"</li>
            <li><strong>Test Events:</strong> Click any button above to queue events for tracking</li>
            <li><strong>Monitor Network:</strong> Open DevTools (F12) → Network tab to see API requests</li>
            <li><strong>View Results:</strong> Check your dashboard or use the Metrics Tester page to see the data</li>
          </ol>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-blue-900/20 rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-semibold mb-4">Technical Details</h2>
          <div className="space-y-3 text-sm text-slate-300">
            <div>
              <p className="font-semibold text-blue-300">Event Request (Single)</p>
              <p className="text-slate-400">POST /api/v1/events</p>
              <p className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 overflow-x-auto">
                {'{ trackingCode, eventType, url, sessionId, visitorId, ... }'}
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-300">Batch Request (Multiple)</p>
              <p className="text-slate-400">POST /api/v1/events/batch</p>
              <p className="font-mono text-xs bg-slate-900 p-2 rounded mt-1 overflow-x-auto">
                {'{ events: [{ trackingCode, eventType, url, ... }, ...] }'}
              </p>
            </div>
            <p className="text-slate-400 pt-2">
              Events are automatically batched (10 events or 5 seconds) and sent to the server.
              Check the Network tab in DevTools to monitor requests in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
