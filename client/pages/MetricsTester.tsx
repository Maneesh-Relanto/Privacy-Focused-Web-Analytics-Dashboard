import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Eye,
  Users,
  Clock,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Copy,
} from 'lucide-react';

interface MetricsData {
  pageViews: number;
  pageViewsChange: number;
  uniqueVisitors: number;
  uniqueVisitorsChange: number;
  sessions: number;
  sessionsChange: number;
  avgSessionDuration: number;
  avgSessionDurationChange: number;
  bounceRate: number;
  bounceRateChange: number;
}

interface PageviewsChartData {
  date: string;
  pageviews: number;
}

interface TopPage {
  url: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: number;
}

interface TrafficSource {
  referrer: string;
  visitors: number;
  sessions: number;
  pageViews: number;
}

export default function MetricsTester() {
  const [websiteId, setWebsiteId] = useState<string>(
    localStorage.getItem('selectedWebsiteId') || ''
  );
  const [days, setDays] = useState<string>('7');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Data states
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [pageviewsChart, setPageviewsChart] = useState<PageviewsChartData[] | null>(null);
  const [topPages, setTopPages] = useState<TopPage[] | null>(null);
  const [referrers, setReferrers] = useState<TrafficSource[] | null>(null);

  // Raw response states (for debugging)
  const [rawResponses, setRawResponses] = useState<Map<string, any>>(new Map());

  const fetchAllMetrics = async () => {
    if (!websiteId.trim()) {
      setError('Please enter a website ID');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const newResponses = new Map();

      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError('Not authenticated. Please log in first.');
        return;
      }

      // Fetch metrics
      const metricsRes = await fetch(
        `/api/v1/dashboard/metrics?websiteId=${websiteId}&days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!metricsRes.ok) {
        throw new Error(`Metrics API error: ${metricsRes.statusText}`);
      }

      const metricsData = await metricsRes.json();
      newResponses.set('metrics', metricsData);
      setMetrics(metricsData.data);

      // Fetch pageviews
      const pageviewsRes = await fetch(
        `/api/v1/dashboard/pageviews?websiteId=${websiteId}&days=${days}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (pageviewsRes.ok) {
        const pageviewsData = await pageviewsRes.json();
        newResponses.set('pageviews', pageviewsData);
        setPageviewsChart(pageviewsData.data);
      }

      // Fetch top pages
      const topPagesRes = await fetch(
        `/api/v1/dashboard/top-pages?websiteId=${websiteId}&days=${days}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (topPagesRes.ok) {
        const topPagesData = await topPagesRes.json();
        newResponses.set('topPages', topPagesData);
        setTopPages(topPagesData.data);
      }

      // Fetch referrers
      const referrersRes = await fetch(
        `/api/v1/dashboard/referrers?websiteId=${websiteId}&days=${days}&limit=10`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (referrersRes.ok) {
        const referrersData = await referrersRes.json();
        newResponses.set('referrers', referrersData);
        setReferrers(referrersData.data);
      }

      setRawResponses(newResponses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMetrics(null);
      setPageviewsChart(null);
      setTopPages(null);
      setReferrers(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
  }: {
    title: string;
    value: string;
    change: number;
    icon: any;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            <p
              className={`text-sm mt-2 ${
                change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {change >= 0 ? '+' : ''}{change}% vs previous
            </p>
          </div>
          <Icon className="h-10 w-10 text-muted-foreground/50" />
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Real Data Metrics Tester</h1>
        <p className="text-muted-foreground mb-8">
          Test the aggregation service and verify real data is being fetched from the database
        </p>

        {/* Input Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Test Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Website ID</label>
                <Input
                  placeholder="Enter website ID (e.g., web-123...)"
                  value={websiteId}
                  onChange={(e) => setWebsiteId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && fetchAllMetrics()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Date Range</label>
                <Select value={days} onValueChange={setDays}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Last 24h</SelectItem>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={fetchAllMetrics}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Fetching...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Test Metrics
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Status Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-red-900">Error</p>
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            )}

            {metrics && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-green-900">Success!</p>
                  <p className="text-sm text-green-800">
                    Data fetched for {days === '1' ? '24h' : days + 'd'} • {metrics.pageViews} pageviews found
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Metrics Cards */}
        {metrics && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Dashboard Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Page Views"
                value={metrics.pageViews.toLocaleString()}
                change={metrics.pageViewsChange}
                icon={Eye}
              />
              <MetricCard
                title="Unique Visitors"
                value={metrics.uniqueVisitors.toLocaleString()}
                change={metrics.uniqueVisitorsChange}
                icon={Users}
              />
              <MetricCard
                title="Sessions"
                value={metrics.sessions.toLocaleString()}
                change={metrics.sessionsChange}
                icon={TrendingUp}
              />
              <MetricCard
                title="Avg Session Duration"
                value={`${Math.round(metrics.avgSessionDuration)}s`}
                change={metrics.avgSessionDurationChange}
                icon={Clock}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <MetricCard
                title="Bounce Rate"
                value={`${metrics.bounceRate.toFixed(1)}%`}
                change={metrics.bounceRateChange}
                icon={TrendingUp}
              />
            </div>
          </div>
        )}

        {/* Pageviews Chart Data */}
        {pageviewsChart && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Pageviews Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4 font-medium">Date</th>
                      <th className="text-right py-2 px-4 font-medium">Pageviews</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageviewsChart.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4">{row.date}</td>
                        <td className="text-right py-2 px-4 font-medium">
                          {row.pageviews.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Total: {pageviewsChart.reduce((sum, row) => sum + row.pageviews, 0)} pageviews
              </p>
            </CardContent>
          </Card>
        )}

        {/* Top Pages */}
        {topPages && topPages.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4 font-medium">Page URL</th>
                      <th className="text-right py-2 px-4 font-medium">Views</th>
                      <th className="text-right py-2 px-4 font-medium">Unique Visitors</th>
                      <th className="text-right py-2 px-4 font-medium">Bounce Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPages.map((page, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 truncate text-blue-600">{page.url}</td>
                        <td className="text-right py-2 px-4 font-medium">{page.views}</td>
                        <td className="text-right py-2 px-4">{page.uniqueVisitors}</td>
                        <td className="text-right py-2 px-4">{page.bounceRate.toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Traffic Sources */}
        {referrers && referrers.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Traffic Sources (Referrers)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-4 font-medium">Referrer</th>
                      <th className="text-right py-2 px-4 font-medium">Visitors</th>
                      <th className="text-right py-2 px-4 font-medium">Sessions</th>
                      <th className="text-right py-2 px-4 font-medium">Page Views</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referrers.map((source, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/50">
                        <td className="py-2 px-4 font-medium">{source.referrer}</td>
                        <td className="text-right py-2 px-4">{source.visitors}</td>
                        <td className="text-right py-2 px-4">{source.sessions}</td>
                        <td className="text-right py-2 px-4">{source.pageViews}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Raw API Responses (for debugging) */}
        {rawResponses.size > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Raw API Responses (Debug)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from(rawResponses.entries()).map(([key, response]) => (
                <div key={key} className="bg-muted p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-mono text-sm font-bold">{key}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(JSON.stringify(response, null, 2), key)
                      }
                    >
                      {copied === key ? '✓ Copied' : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <pre className="bg-background p-3 rounded overflow-x-auto text-xs max-h-64 overflow-y-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        {!metrics && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">How to Use This Tester</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-blue-900">
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  <strong>Get your Website ID:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Log in to the dashboard</li>
                    <li>Go to your websites page</li>
                    <li>Copy the ID of a website (looks like: clv1234567890)</li>
                  </ul>
                </li>
                <li>
                  <strong>Generate test events:</strong>
                  <ul className="list-disc list-inside ml-4 mt-1">
                    <li>Go to /tracker-test page</li>
                    <li>Click "Track Pageview" or "Track 5 Events"</li>
                    <li>This creates real events in the database</li>
                  </ul>
                </li>
                <li>
                  <strong>Enter Website ID above:</strong> Paste your website ID in the input field
                </li>
                <li>
                  <strong>Click "Test Metrics":</strong> Fetches real data from database and displays it
                </li>
                <li>
                  <strong>Check results:</strong> See the actual metrics calculated from your events
                </li>
              </ol>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
