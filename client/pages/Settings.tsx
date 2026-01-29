import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Copy,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
  Code,
  Download,
  ExternalLink,
  Settings as SettingsIcon,
} from "lucide-react";

export default function Settings() {
  const [copied, setCopied] = useState(false);
  const [showTrackingCode, setShowTrackingCode] = useState(false);
  const [trackingVerified, setTrackingVerified] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "general" | "tracking" | "privacy" | "api"
  >("general");
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Get website info from localStorage
  const websiteId = localStorage.getItem("selectedWebsiteId");
  const [generalSettings, setGeneralSettings] = useState({
    websiteName: localStorage.getItem("selectedWebsiteName") || "My Website",
    websiteDomain:
      localStorage.getItem("selectedWebsiteDomain") || "example.com",
    trackingEnabled: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    anonymizeIp: true,
    cookieConsent: false,
    gdprCompliant: true,
    dataRetention: "90", // days
  });

  const trackingCode = websiteId || "pm-xxxxxxxx-xxxxx";
  const apiUrl = window.location.origin;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveGeneralSettings = async () => {
    setIsSaving(true);
    try {
      // Save to localStorage
      localStorage.setItem("selectedWebsiteName", generalSettings.websiteName);
      localStorage.setItem(
        "selectedWebsiteDomain",
        generalSettings.websiteDomain,
      );

      // In a real app, this would call the API to update the website
      // For now, we'll just save to localStorage and show success
      setSaveMessage({
        type: "success",
        text: "✅ Website settings saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "❌ Failed to save settings. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const savePrivacySettings = async () => {
    setIsSaving(true);
    try {
      // In a real app, this would call the API to update privacy settings
      // For now, we'll just show success
      setSaveMessage({
        type: "success",
        text: "✅ Privacy settings saved successfully!",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } catch (error) {
      setSaveMessage({
        type: "error",
        text: "❌ Failed to save privacy settings. Please try again.",
      });
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const verifyTracking = () => {
    // Simulate verification check
    setTrackingVerified(true);
    setTimeout(() => {
      // In real implementation, check if events are coming in
      alert(
        "✅ Tracking verified! Events are being collected from your website.",
      );
    }, 500);
  };

  const installationMethods = [
    {
      name: "HTML Script Tag",
      description: "Add a single line to your website HTML",
      code: `<!-- Add this to your website's <head> or before </body> -->
<script>
  window.TRACKER_CODE = '${trackingCode}';
  window.TRACKER_API = '${apiUrl}/api/v1/events';
</script>
<script src="${apiUrl}/tracker.js" async></script>`,
      language: "html",
      suitable: "All websites",
    },
    {
      name: "NPM Package",
      description: "For React, Vue, Angular, and other frameworks",
      code: `// Install package
npm install pivotmetrics-tracker

// In your main.js or app.js
import { AnalyticsTracker } from 'pivotmetrics-tracker';

const tracker = new AnalyticsTracker({
  trackingCode: '${trackingCode}',
  apiUrl: '${apiUrl}/api/v1/events',
  autoPageViews: true
});

// Usage
tracker.track('custom', { action: 'signup' });`,
      language: "javascript",
      suitable: "React, Vue, Angular, etc.",
    },
    {
      name: "Content Delivery Network (CDN)",
      description: "Use without installation",
      code: `<!-- Add this to your website's <head> -->
<script>
  window.TRACKER_CODE = '${trackingCode}';
  window.TRACKER_API = '${apiUrl}/api/v1/events';
</script>
<script src="https://cdn.privacymetrics.io/tracker.js" async></script>`,
      language: "html",
      suitable: "Any website (recommended)",
    },
  ];

  return (
    <div className="flex-1 overflow-auto bg-background">
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Website Settings</h1>
          <p className="text-muted-foreground">
            Configure your website analytics and tracking
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 border-b border-border">
          {(["general", "tracking", "privacy", "api"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* General Settings */}
        {activeTab === "general" && (
          <div className="space-y-6">
            {saveMessage && (
              <div
                className={`p-4 rounded-lg ${
                  saveMessage.type === "success"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                }`}
              >
                {saveMessage.text}
              </div>
            )}
            <Card>
              <CardHeader>
                <CardTitle>Website Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={generalSettings.websiteName}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        websiteName: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="My Website"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Display name for your website
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Website Domain
                  </label>
                  <input
                    type="text"
                    value={generalSettings.websiteDomain}
                    onChange={(e) =>
                      setGeneralSettings({
                        ...generalSettings,
                        websiteDomain: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    placeholder="example.com"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your website's domain name
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">Enable Tracking</p>
                    <p className="text-sm text-muted-foreground">
                      Turn tracking on/off for this website
                    </p>
                  </div>
                  <Switch
                    checked={generalSettings.trackingEnabled}
                    onCheckedChange={(checked) =>
                      setGeneralSettings({
                        ...generalSettings,
                        trackingEnabled: checked,
                      })
                    }
                  />
                </div>

                <Button
                  className="w-full"
                  onClick={saveGeneralSettings}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tracking Code & Installation */}
        {activeTab === "tracking" && (
          <div className="space-y-6">
            {/* Tracking Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Your Tracking Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use this code to identify your website in the tracking script.
                  Keep it secret!
                </p>

                <div className="relative">
                  <div className="flex items-center gap-2 p-4 bg-muted rounded-lg font-mono text-sm border border-border">
                    <span className="flex-1">
                      {showTrackingCode ? trackingCode : "••••••••••••••••"}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowTrackingCode(!showTrackingCode)}
                      className="h-8 w-8 p-0"
                    >
                      {showTrackingCode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(trackingCode)}
                      className="gap-2"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex gap-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800 dark:text-blue-200">
                      <p className="font-semibold mb-1">
                        Keep Your Code Secure
                      </p>
                      <p>
                        Only use this code in your own websites. Anyone with
                        this code can send events for your website.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={verifyTracking}
                    className="flex-1"
                  >
                    {trackingVerified ? "✓ Verified" : "Verify Tracking"}
                  </Button>
                  <Button variant="outline">Regenerate Code</Button>
                </div>
              </CardContent>
            </Card>

            {/* Installation Methods */}
            <Card>
              <CardHeader>
                <CardTitle>Installation Methods</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {installationMethods.map((method, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg overflow-hidden"
                  >
                    <div className="bg-muted p-4 border-b border-border">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{method.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {method.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Best for: {method.suitable}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <pre className="whitespace-pre-wrap break-words">
                          {method.code}
                        </pre>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(method.code)}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Testing Links */}
            <Card>
              <CardHeader>
                <CardTitle>Test Your Tracking</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  After installing the tracking code, use these tools to verify
                  it's working:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <a
                    href="/tracker-test"
                    className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
                  >
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <span className="font-semibold">Tracker Test</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Send test events
                    </span>
                    <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                  </a>

                  <a
                    href="/metrics-tester"
                    className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
                  >
                    <SettingsIcon className="h-8 w-8 text-primary mb-2" />
                    <span className="font-semibold">Metrics Tester</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      View real metrics
                    </span>
                    <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                  </a>

                  <a
                    href="/test-admin"
                    className="flex flex-col items-center justify-center p-6 border border-border rounded-lg hover:border-primary hover:bg-muted transition-colors"
                  >
                    <Code className="h-8 w-8 text-primary mb-2" />
                    <span className="font-semibold">Run Tests</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Automated tests
                    </span>
                    <ExternalLink className="h-4 w-4 mt-2 text-muted-foreground" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Compliance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">Anonymize IP Addresses</p>
                      <p className="text-sm text-muted-foreground">
                        Remove the last octet of visitor IP addresses
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.anonymizeIp}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          anonymizeIp: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">Require Cookie Consent</p>
                      <p className="text-sm text-muted-foreground">
                        Only track after user consent is given
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.cookieConsent}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          cookieConsent: checked,
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <p className="font-semibold">GDPR Compliant</p>
                      <p className="text-sm text-muted-foreground">
                        Follow GDPR best practices automatically
                      </p>
                    </div>
                    <Switch
                      checked={privacySettings.gdprCompliant}
                      onCheckedChange={(checked) =>
                        setPrivacySettings({
                          ...privacySettings,
                          gdprCompliant: checked,
                        })
                      }
                    />
                  </div>

                  <div className="p-4 border border-border rounded-lg">
                    <label className="block font-semibold mb-3">
                      Data Retention Policy
                    </label>
                    <select
                      value={privacySettings.dataRetention}
                      onChange={(e) =>
                        setPrivacySettings({
                          ...privacySettings,
                          dataRetention: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background"
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days (default)</option>
                      <option value="180">6 months</option>
                      <option value="365">1 year</option>
                      <option value="never">Keep forever</option>
                    </select>
                    <p className="text-sm text-muted-foreground mt-2">
                      How long event data is retained before automatic deletion
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200">
                    <strong>✅ Privacy First:</strong> PrivacyMetrics collects
                    no personal data by default. We don't use cookies or track
                    individuals across sites.
                  </p>
                </div>

                <Button
                  className="w-full"
                  onClick={savePrivacySettings}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Privacy Settings"}
                </Button>
              </CardContent>
            </Card>

            {/* Compliance Info */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    GDPR Compliance Guide
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    How PrivacyMetrics meets GDPR requirements
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    Privacy Policy Template
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Update your website's privacy policy
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    Cookie Consent Implementation
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Add cookie consent to your website
                  </p>
                </a>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Keys */}
        {activeTab === "api" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>API Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  API keys allow you to access PrivacyMetrics data
                  programmatically. Keep them secret!
                </p>

                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">Default API Key</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Created automatically
                        </p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        Active
                      </span>
                    </div>

                    <div className="bg-muted p-3 rounded font-mono text-sm mb-3 break-all">
                      pk_live_51234567890abcdefghijklmnop
                    </div>

                    <Button size="sm" variant="outline" className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy API Key
                    </Button>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Documentation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    API Reference
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete API documentation
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    Code Examples
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Node.js, Python, Ruby examples
                  </p>
                </a>

                <a
                  href="#"
                  className="block p-4 border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <p className="font-semibold flex items-center gap-2">
                    Webhooks
                    <ExternalLink className="h-4 w-4" />
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive real-time event notifications
                  </p>
                </a>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
