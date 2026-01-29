import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  Code,
  BookOpen,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';

export default function Documentation() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'getting-started' | 'api' | 'integration' | 'best-practices' | 'faq'>('getting-started');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const codeExample = (code: string) => (
    <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
      <pre className="whitespace-pre-wrap break-words">{code}</pre>
    </div>
  );

  const faqItems = [
    {
      question: 'What data does PrivacyMetrics collect?',
      answer: 'PrivacyMetrics collects only essential analytics data: page views, clicks, custom events, device type, browser, and general location (country/city). We never collect personal data like names, emails, or IP addresses (unless you explicitly enable tracking). No cookies are set by default.',
    },
    {
      question: 'Is PrivacyMetrics GDPR compliant?',
      answer: 'Yes! PrivacyMetrics is designed to be GDPR compliant out of the box. We don\'t track individuals, don\'t use cookies by default, and provide full data retention controls. You can enable additional privacy features in Settings > Privacy tab.',
    },
    {
      question: 'How long is data retained?',
      answer: 'By default, event data is retained for 90 days. You can configure this in Settings > Privacy tab to keep data for 30 days, 60 days, 6 months, 1 year, or forever. Archived events are automatically deleted after the retention period.',
    },
    {
      question: 'Can I export my analytics data?',
      answer: 'Yes! You can export data through the API or download reports from the Analytics dashboard. Use the API to build custom reports and integrations with your other tools.',
    },
    {
      question: 'What\'s the difference between pageviews and unique visitors?',
      answer: 'Pageviews count every page view. Unique visitors count how many distinct visitors viewed your site in a given period. This helps you understand both traffic volume and reach.',
    },
    {
      question: 'How do I troubleshoot tracking issues?',
      answer: 'Use the testing tools: 1) Go to Settings > Tracking tab, 2) Click "Verify Tracking" to check if events are being collected, 3) Visit /test-admin to run automated tests, 4) Use /tracker-test to manually send test events.',
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Documentation</h1>
          <p className="text-muted-foreground">Guides, tutorials, and API reference for PrivacyMetrics</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border overflow-x-auto">
          {(['getting-started', 'api', 'integration', 'best-practices', 'faq'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab === 'getting-started' && 'Getting Started'}
              {tab === 'api' && 'API Reference'}
              {tab === 'integration' && 'Integration'}
              {tab === 'best-practices' && 'Best Practices'}
              {tab === 'faq' && 'FAQ'}
            </button>
          ))}
        </div>

        {/* Getting Started */}
        {activeTab === 'getting-started' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  5-Minute Quick Start
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ol className="space-y-4">
                  <li className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold">Create a Website</h3>
                      <p className="text-sm text-muted-foreground mt-1">Go to Dashboard and click "Create Website" to add your site.</p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold">Get Your Tracking Code</h3>
                      <p className="text-sm text-muted-foreground mt-1">Navigate to Settings > Tracking to get your unique tracking code.</p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold">Install the Script</h3>
                      <p className="text-sm text-muted-foreground mt-1">Copy the tracking script and add it to your website's HTML.</p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h3 className="font-semibold">Verify Installation</h3>
                      <p className="text-sm text-muted-foreground mt-1">Click "Verify Tracking" in Settings to confirm events are being collected.</p>
                    </div>
                  </li>

                  <li className="flex gap-4">
                    <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-primary text-white font-semibold text-sm">
                      5
                    </div>
                    <div>
                      <h3 className="font-semibold">View Your Analytics</h3>
                      <p className="text-sm text-muted-foreground mt-1">Go to Analytics to see real-time data and reports about your visitors.</p>
                    </div>
                  </li>
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What is Tracked?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">Automatically Tracked</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>✓ Page views</li>
                      <li>✓ Unique visitors</li>
                      <li>✓ Device & browser info</li>
                      <li>✓ Referral source</li>
                      <li>✓ General location (country/city)</li>
                      <li>✓ Session duration</li>
                    </ul>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">Optional Tracking</h3>
                    <ul className="text-sm text-muted-foreground space-y-2">
                      <li>✓ Custom events</li>
                      <li>✓ Click tracking</li>
                      <li>✓ Form submissions</li>
                      <li>✓ User actions</li>
                      <li>✓ Conversion goals</li>
                      <li>✓ Custom properties</li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>🔒 Privacy First:</strong> No personal data (emails, names, IPs) is collected by default. No cookies are set. All tracking is anonymized.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tracking Script Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  The tracking script is lightweight (<6KB gzipped) and includes:
                </p>

                <div className="space-y-3">
                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-semibold text-sm mb-1">Automatic Pageview Tracking</p>
                    <p className="text-xs text-muted-foreground">Every page view is automatically tracked and sent to our servers.</p>
                  </div>

                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-semibold text-sm mb-1">Event Batching</p>
                    <p className="text-xs text-muted-foreground">Events are batched and sent in groups of 10 or every 5 seconds for efficiency.</p>
                  </div>

                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-semibold text-sm mb-1">Zero Dependencies</p>
                    <p className="text-xs text-muted-foreground">No jQuery, no heavy libraries - just pure JavaScript that works everywhere.</p>
                  </div>

                  <div className="p-3 border border-border rounded-lg">
                    <p className="font-semibold text-sm mb-1">Visitor Identification</p>
                    <p className="text-xs text-muted-foreground">Uses localStorage for persistent visitor IDs and sessionStorage for session IDs.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Reference */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API requests require authentication using an API key. Include your API key in the Authorization header.
                </p>

                {codeExample(`curl -H "Authorization: Bearer YOUR_API_KEY" \\
  https://api.privacymetrics.io/v1/events`)}

                <p className="text-sm text-muted-foreground">
                  Get your API key from Settings > API Configuration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Events API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Create Event</h3>
                    <p className="text-sm text-muted-foreground mb-3">Send a single analytics event to your website.</p>
                    {codeExample(`POST /v1/events

{
  "trackingCode": "pm-xxxxxxxx-xxxxx",
  "eventType": "pageview",
  "url": "https://example.com/about",
  "title": "About Us",
  "properties": {
    "custom_field": "value"
  }
}`)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Batch Events</h3>
                    <p className="text-sm text-muted-foreground mb-3">Send multiple events in a single request (up to 100 events).</p>
                    {codeExample(`POST /v1/events/batch

{
  "trackingCode": "pm-xxxxxxxx-xxxxx",
  "events": [
    {
      "eventType": "pageview",
      "url": "https://example.com/page1"
    },
    {
      "eventType": "click",
      "elementId": "button-1",
      "properties": { "section": "hero" }
    }
  ]
}`)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metrics API</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  Retrieve analytics data for your website. All requests require authentication.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Get Dashboard Metrics</h3>
                    {codeExample(`GET /v1/websites/{websiteId}/metrics?period=7days

Response:
{
  "pageviews": 1250,
  "uniqueVisitors": 450,
  "bounceRate": 32.5,
  "avgSessionDuration": 245,
  "topPages": [
    {
      "url": "/",
      "pageviews": 320,
      "uniqueVisitors": 180
    }
  ],
  "devices": {
    "desktop": 60,
    "mobile": 35,
    "tablet": 5
  }
}`)}
                  </div>

                  <div>
                    <h3 className="font-semibold text-sm mb-2">Get Events</h3>
                    {codeExample(`GET /v1/websites/{websiteId}/events?limit=100&offset=0

Response:
{
  "events": [
    {
      "id": "evt_123",
      "eventType": "pageview",
      "timestamp": "2024-01-15T10:30:00Z",
      "url": "https://example.com/products",
      "visitorId": "visitor_123",
      "deviceType": "mobile"
    }
  ],
  "total": 5000,
  "hasMore": true
}`)}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Codes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 border-b border-border">
                    <span className="font-semibold">200</span>
                    <span className="text-muted-foreground">OK - Request successful</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-border">
                    <span className="font-semibold">400</span>
                    <span className="text-muted-foreground">Bad Request - Invalid parameters</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-border">
                    <span className="font-semibold">401</span>
                    <span className="text-muted-foreground">Unauthorized - Invalid API key</span>
                  </div>
                  <div className="flex justify-between p-2 border-b border-border">
                    <span className="font-semibold">404</span>
                    <span className="text-muted-foreground">Not Found - Resource doesn't exist</span>
                  </div>
                  <div className="flex justify-between p-2">
                    <span className="font-semibold">500</span>
                    <span className="text-muted-foreground">Server Error - Please retry</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Integration Guides */}
        {activeTab === 'integration' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Integration Guides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  PrivacyMetrics works with any website or app. Choose your platform below for specific instructions.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Next.js', 'React', 'Vue.js', 'Angular', 'WordPress', 'Shopify'].map((platform) => (
                    <a
                      key={platform}
                      href="#"
                      className="p-4 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
                    >
                      <p className="font-semibold mb-1">{platform}</p>
                      <p className="text-xs text-muted-foreground mb-3">Step-by-step integration guide</p>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>React Integration Example</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  For React apps, add the tracking code to your main App.js or layout file:
                </p>

                {codeExample(`import { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Load tracking script
    const script = document.createElement('script');
    script.src = 'https://yourapi.com/tracker.js';
    script.async = true;
    document.head.appendChild(script);

    // Configure tracker
    window.TRACKER_CODE = 'pm-xxxxxxxx-xxxxx';
    window.TRACKER_API = 'https://yourapi.com/api/v1/events';
  }, []);

  return (
    <div>
      {/* Your app content */}
    </div>
  );
}`)}

                <p className="text-sm text-muted-foreground">
                  Once installed, all page navigations will be automatically tracked. For custom events:
                </p>

                {codeExample(`// Track custom events
if (window.tracker) {
  window.tracker.track('signup', {
    plan: 'pro',
    source: 'homepage'
  });
}`)}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Custom Event Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground mb-3">
                  Track custom events to understand user behavior beyond page views:
                </p>

                {codeExample(`// Click tracking
document.getElementById('button').addEventListener('click', () => {
  window.tracker?.track('click', {
    element: 'cta-button',
    section: 'hero',
    action: 'signup'
  });
});

// Form submissions
document.getElementById('contact-form').addEventListener('submit', () => {
  window.tracker?.track('form_submit', {
    formName: 'contact',
    fields: 3
  });
});

// Custom actions
function trackPurchase(amount, product) {
  window.tracker?.track('purchase', {
    amount: amount,
    product: product,
    currency: 'USD'
  });
}`)}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Best Practices */}
        {activeTab === 'best-practices' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Analytics Best Practices
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">1. Set Clear Goals</h3>
                    <p className="text-sm text-muted-foreground">
                      Define what success looks like for your website. Are you measuring signups, purchases, downloads, or something else?
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">2. Track Key Events</h3>
                    <p className="text-sm text-muted-foreground">
                      Use custom events to track important user actions like button clicks, form submissions, and conversions. This helps you understand the user journey.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">3. Use Meaningful Names</h3>
                    <p className="text-sm text-muted-foreground">
                      Give your events clear, descriptive names like "clicked_subscribe" instead of "btn_1". This makes reports easier to understand.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">4. Monitor Device Performance</h3>
                    <p className="text-sm text-muted-foreground">
                      Check the Analytics dashboard regularly to see how users are accessing your site (desktop, mobile, tablet). Optimize for your audience.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">5. Review Traffic Sources</h3>
                    <p className="text-sm text-muted-foreground">
                      Understand where your visitors come from (search engines, social media, direct). Double down on what's working.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">6. Check Bounce Rate</h3>
                    <p className="text-sm text-muted-foreground">
                      A high bounce rate on important pages might indicate a problem. Analyze which pages have high bounces and improve them.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">7. Privacy by Default</h3>
                    <p className="text-sm text-muted-foreground">
                      PrivacyMetrics respects user privacy. No personal data collection or tracking across websites. Inform users about your tracking in your privacy policy.
                    </p>
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <h3 className="font-semibold mb-2">8. Review Regularly</h3>
                    <p className="text-sm text-muted-foreground">
                      Check your analytics at least weekly. Look for trends, changes in user behavior, and opportunities for improvement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>GDPR:</strong> PrivacyMetrics is GDPR compliant. We don't require explicit consent for essential analytics, but you should still disclose tracking in your privacy policy.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      <strong>CCPA:</strong> PrivacyMetrics is CCPA compliant. We don't sell user data, and users can request deletion of their data through your privacy request process.
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <p className="text-sm text-green-800 dark:text-green-200">
                      <strong>Cookie Policy:</strong> PrivacyMetrics doesn't use cookies by default. If you need cookie consent for other tools, use our Cookie Consent feature in Settings.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-border rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-600" />
                    Recommended Privacy Policy Update
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Include this information in your website's privacy policy:
                  </p>
                  <div className="bg-muted p-3 rounded text-xs text-muted-foreground">
                    <p>
                      "We use PrivacyMetrics, a privacy-focused analytics service, to measure website traffic and user engagement. This tool does not track personal information, use cookies, or profile users across websites."
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full p-4 bg-muted hover:bg-muted/80 flex items-start justify-between gap-4 transition-colors"
                >
                  <span className="font-semibold text-left">{item.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 flex-shrink-0 transition-transform ${
                      expandedFaq === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {expandedFaq === index && (
                  <div className="p-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}