import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  BarChart3,
  LayoutDashboard,
  Settings,
  BookOpen,
  LogOut,
  RefreshCw,
  Moon,
  Sun,
  TrendingUp,
  Users,
  Eye,
  Clock,
  MapPin,
  Monitor,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PageViewsChart } from "@/components/dashboard/PageViewsChart";
import { TopPagesChart } from "@/components/dashboard/TopPagesChart";
import { DeviceDistributionChart } from "@/components/dashboard/DeviceDistributionChart";
import { ReferrerChart } from "@/components/dashboard/ReferrerChart";

export default function Dashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [dateRange, setDateRange] = useState("7d");
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // Simulate dark mode by adding/removing class
  useMemo(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        {/* Sidebar */}
        <Sidebar className="border-r border-border">
          <SidebarHeader className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-6 w-6 text-primary" />
              <span className="font-bold text-primary">PrivacyMetrics</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive
                  className="text-base font-semibold"
                >
                  <a href="#" className="flex items-center gap-2">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>Overview</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="#" className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Analytics</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="#" className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className="text-base">
                  <a href="#" className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Documentation</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <div className="border-t border-border p-4 mt-auto space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Dark Mode</span>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  aria-label="Toggle dark mode"
                />
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full justify-start"
              asChild
            >
              <Link to="/">
                <LogOut className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Bar */}
          <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 sticky top-0 z-10">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="md:hidden" />
                <h1 className="text-2xl font-bold hidden sm:block">
                  Dashboard Overview
                </h1>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24h</SelectItem>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isLoading}
                >
                  <RefreshCw
                    className="h-4 w-4"
                    style={isLoading ? { animation: "spin 1s linear infinite" } : {}}
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
              {/* Real-time Status */}
              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-medium text-sm">
                    Live (Updated 2 minutes ago)
                  </span>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Page Views"
                  value="45,231"
                  icon={Eye}
                  trend={12}
                  trendLabel="vs last period"
                  color="blue"
                />
                <MetricCard
                  title="Unique Visitors"
                  value="12,847"
                  icon={Users}
                  trend={8}
                  trendLabel="vs last period"
                  color="purple"
                />
                <MetricCard
                  title="Avg Session Duration"
                  value="3m 42s"
                  icon={Clock}
                  trend={-2}
                  trendLabel="vs last period"
                  color="green"
                />
                <MetricCard
                  title="Bounce Rate"
                  value="32.4%"
                  icon={TrendingUp}
                  trend={5}
                  trendLabel="vs last period"
                  color="orange"
                  invertTrend
                />
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Page Views Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Page Views Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PageViewsChart />
                  </CardContent>
                </Card>

                {/* Visitors Over Time */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visitors Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PageViewsChart variant="visitors" />
                  </CardContent>
                </Card>
              </div>

              {/* Second Row Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Pages */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Pages</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TopPagesChart />
                  </CardContent>
                </Card>

                {/* Top Referrers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Referrers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReferrerChart />
                  </CardContent>
                </Card>
              </div>

              {/* Device Distribution and Geographic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Device Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Device Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeviceDistributionChart />
                  </CardContent>
                </Card>

                {/* Geographic */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Locations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { country: "United States", views: "18,432", pct: 41 },
                        { country: "Canada", views: "8,234", pct: 18 },
                        { country: "United Kingdom", views: "7,123", pct: 16 },
                        { country: "Germany", views: "5,421", pct: 12 },
                        { country: "France", views: "6,021", pct: 13 },
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {item.country}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground w-12 text-right">
                              {item.views}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
