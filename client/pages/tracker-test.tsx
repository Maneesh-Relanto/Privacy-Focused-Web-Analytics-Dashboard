import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function TrackerTest() {
  const [trackingCode, setTrackingCode] = useState('pm-test-tracker-123');
  const [debugLog, setDebugLog] = useState<string[]>([
    'Welcome to the Tracking Script Test Page!',
    'Setting up test environment...',
  ]);
  const [isTrackerLoaded, setIsTrackerLoaded] = useState(false);

  useEffect(() => {
    // Initialize tracker with test tracking code
    (window as any).TRACKER_CODE = trackingCode;
    (window as any).TRACKER_DEBUG = true;

    // Load the tracker script
    const script = document.createElement('script');
    script.src = '/tracker.js';
    script.async = true;
    script.onload = () => {
      addLog('✅ Tracker script loaded');
    };
    script.onerror = () => {
      addLog('❌ Error loading tracker script');
    };
    document.body.appendChild(script);

    // Check if tracker is loaded
    const checkTracker = setInterval(() => {
      if ((window as any).PivotMetrics) {
        setIsTrackerLoaded(true);
        clearInterval(checkTracker);
        addLog('✅ Tracker initialized successfully');
        addLog('Available functions: PivotMetrics.track(), PivotMetrics.flush()');
      }
    }, 100);

    return () => clearInterval(checkTracker);
  }, [trackingCode]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugLog((prev) => [...prev, `[${timestamp}] ${message}`]);
  };

  const trackPageView = () => {
    addLog('Tracking pageview event...');
    (window as any).PivotMetrics?.track?.('pageview', {
      title: document.title,
      pathname: window.location.pathname,
    });
  };

  const trackCustomEvent = () => {
    const eventData = {
      type: 'test_event',
      action: 'button_click',
      timestamp: new Date().toISOString(),
    };
    addLog(`Tracking custom event: ${JSON.stringify(eventData)}`);
    (window as any).PivotMetrics?.track?.('custom', eventData);
  };

  const trackMultipleEvents = () => {
    addLog('Tracking 5 custom events...');
    for (let i = 1; i <= 5; i++) {
      (window as any).PivotMetrics?.track?.('custom', {
        type: 'batch_test',
        eventNumber: i,
        timestamp: new Date().toISOString(),
      });
      addLog(`  Event ${i} queued`);
    }
  };

  const flushEvents = () => {
    addLog('Flushing all queued events...');
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
    keys.forEach((key) => {
      const value = localStorage.getItem(key);
      addLog(`${key}: ${value}`);
    });
  };

  const clearLocalStorage = () => {
    const keys = Object.keys(localStorage).filter((k) =>
      k.startsWith('pm_visitor_') || k.startsWith('pm_session_')
    );
    keys.forEach((key) => localStorage.removeItem(key));
    const sessionKeys = Object.keys(sessionStorage).filter((k) =>
      k.startsWith('pm_visitor_') || k.startsWith('pm_session_')
    );
    sessionKeys.forEach((key) => sessionStorage.removeItem(key));
    addLog(`Cleared ${keys.length + sessionKeys.length} tracker IDs`);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Tracking Script Test Page</h1>
        <p className="text-slate-400 mb-8">
          Test the lightweight analytics tracker in real-time
        </p>

        {/* Status Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Tracker Status</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-slate-400 text-sm">Tracker Loaded</p>
              <p className={`text-lg font-bold ${isTrackerLoaded ? 'text-green-400' : 'text-red-400'}`}>
                {isTrackerLoaded ? '✅ YES' : '❌ NO'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-sm">Available API</p>
              <p className="text-lg font-bold text-blue-400">window.PivotMetrics</p>
            </div>
          </div>
        </div>

        {/* Event Tracking Section */}
        <div className="bg-slate-800 rounded-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Track Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button
              onClick={trackPageView}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
            >
              Track Pageview
            </Button>
            <Button
              onClick={trackCustomEvent}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            >
              Track Custom Event
            </Button>
            <Button
              onClick={trackMultipleEvents}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded"
            >
              Track 5 Events (Batch)
            </Button>
            <Button
              onClick={flushEvents}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              Flush Queued Events
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
              onClick={clearLocalStorage}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
            >
              Clear & Reset IDs
            </Button>
          </div>
        </div>

        {/* Debug Log Section */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">Debug Log</h2>
          <div className="bg-slate-900 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
            {debugLog.length === 0 ? (
              <p className="text-slate-500">Click buttons above to see debug logs...</p>
            ) : (
              debugLog.map((log, i) => (
                <div key={i} className="text-slate-300 mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
          <Button
            onClick={() => setDebugLog([])}
            className="mt-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-1 px-3 rounded text-sm"
          >
            Clear Log
          </Button>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h2 className="text-xl font-semibold mb-4">How to Test</h2>
          <ol className="list-decimal list-inside space-y-2 text-slate-300">
            <li>Open browser DevTools (F12) → Console tab</li>
            <li>You should see tracker initialization messages</li>
            <li>Click "Track Pageview" to send a pageview event</li>
            <li>Check Network tab to see API requests to /api/v1/events</li>
            <li>Use "Track 5 Events" to test batching (will queue, then flush)</li>
            <li>Click "Flush Queued Events" to immediately send all queued events</li>
            <li>Check browser Network tab for POST requests</li>
            <li>Check your analytics dashboard to see events appear</li>
          </ol>
        </div>

        {/* Network Requests Info */}
        <div className="mt-8 bg-blue-900 rounded-lg p-6 border border-blue-700">
          <h2 className="text-xl font-semibold mb-4">💡 How to Monitor Requests</h2>
          <div className="space-y-3 text-sm text-blue-100">
            <p>
              <strong>Single Event Request:</strong>
              <br />
              Method: POST
              <br />
              URL: /api/v1/events
              <br />
              Body: &#123; trackingCode, eventType, url, sessionId, visitorId, ... &#125;
            </p>
            <p>
              <strong>Batch Event Request:</strong>
              <br />
              Method: POST
              <br />
              URL: /api/v1/events/batch
              <br />
              Body: &#123; events: [...] &#125;
            </p>
            <p className="pt-3">
              Open browser DevTools (F12) → Network tab to see these requests in real-time!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
