import { useState, useEffect } from "react";
import type { DashboardData, DashboardMetrics } from "@shared/types/dashboard";

/**
 * Hook to fetch all dashboard data at once
 */
export function useDashboardData(dateRange: string = "7d", websiteId?: string) {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        // Get websiteId from parameter or localStorage (for testing)
        const selectedWebsiteId = websiteId || localStorage.getItem("selectedWebsiteId");
        if (!selectedWebsiteId) {
          setError("No website selected");
          return;
        }

        // Convert date range to days
        const dayMap: { [key: string]: number } = {
          "24h": 1,
          "7d": 7,
          "30d": 30,
          "90d": 90,
        };
        const days = dayMap[dateRange] || 7;

        // Fetch metrics
        const metricsRes = await fetch(
          `/api/v1/dashboard/metrics?websiteId=${selectedWebsiteId}&days=${days}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Fetch pageviews chart data
        const pageviewsRes = await fetch(
          `/api/v1/dashboard/pageviews?websiteId=${selectedWebsiteId}&days=${days}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Fetch top pages
        const topPagesRes = await fetch(
          `/api/v1/dashboard/top-pages?websiteId=${selectedWebsiteId}&days=${days}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Fetch referrers
        const referrersRes = await fetch(
          `/api/v1/dashboard/referrers?websiteId=${selectedWebsiteId}&days=${days}&limit=10`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        // Fetch devices
        const devicesRes = await fetch(
          `/api/v1/dashboard/devices?websiteId=${selectedWebsiteId}&days=${days}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!metricsRes.ok || !pageviewsRes.ok || !topPagesRes.ok || !referrersRes.ok || !devicesRes.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const metricsData = await metricsRes.json();
        const pageviewsData = await pageviewsRes.json();
        const topPagesData = await topPagesRes.json();
        const referrersData = await referrersRes.json();
        const devicesData = await devicesRes.json();

        // Map to dashboard format
        const dashboardData: DashboardData = {
          metrics: {
            pageViews: metricsData.data?.pageViews || 0,
            pageViewsTrend: metricsData.data?.pageViewsChange || 0,
            uniqueVisitors: metricsData.data?.uniqueVisitors || 0,
            visitorsTrend: metricsData.data?.uniqueVisitorsChange || 0,
            sessions: metricsData.data?.sessions || 0,
            sessionsTrend: metricsData.data?.sessionsChange || 0,
            sessionDuration: metricsData.data?.avgSessionDuration || 0,
            sessionDurationTrend: metricsData.data?.avgSessionDurationChange || 0,
            bounceRate: metricsData.data?.bounceRate || 0,
            bounceRateTrend: metricsData.data?.bounceRateChange || 0,
          },
          pageViewsChart: {
            data: pageviewsData.data?.map((item: any) => ({
              date: item.date,
              pageviews: item.pageviews,
            })) || [],
          },
          visitorsChart: {
            data: pageviewsData.data?.map((item: any) => ({
              date: item.date,
              visitors: Math.round(item.pageviews * 0.7), // Estimate visitors from pageviews
            })) || [],
          },
          topPages: {
            pages: topPagesData.data || [],
          },
          referrers: {
            data: referrersData.data || [],
          },
          devices: devicesData.data || {},
        };

        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, websiteId]);

  return { data, loading, error };
}

/**
 * Hook to fetch only metrics
 */
export function useDashboardMetrics(dateRange: string = "7d") {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch(
          `/api/v1/dashboard/metrics?dateRange=${dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch metrics");
        }

        const result = await response.json();
        setMetrics(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, [dateRange]);

  return { metrics, loading, error };
}

/**
 * Hook to fetch chart data
 */
export function useChartData(
  dateRange: string = "7d",
  type: "pageviews" | "visitors" | "both" = "both",
) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch(
          `/api/v1/dashboard/chart-data?dateRange=${dateRange}&type=${type}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch chart data");
        }

        const result = await response.json();
        setChartData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange, type]);

  return { chartData, loading, error };
}

/**
 * Hook to fetch top pages
 */
export function useTopPages() {
  const [topPages, setTopPages] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/v1/dashboard/top-pages", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch top pages");
        }

        const result = await response.json();
        setTopPages(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { topPages, loading, error };
}

/**
 * Hook to fetch referrer data
 */
export function useReferrers() {
  const [referrers, setReferrers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/v1/dashboard/referrers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch referrers");
        }

        const result = await response.json();
        setReferrers(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { referrers, loading, error };
}

/**
 * Hook to fetch device distribution
 */
export function useDeviceDistribution() {
  const [devices, setDevices] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/v1/dashboard/devices", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch device data");
        }

        const result = await response.json();
        setDevices(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { devices, loading, error };
}

/**
 * Hook to fetch top locations
 */
export function useTopLocations() {
  const [locations, setLocations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("accessToken");
        if (!token) {
          setError("Not authenticated");
          return;
        }

        const response = await fetch("/api/v1/dashboard/locations", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch location data");
        }

        const result = await response.json();
        setLocations(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { locations, loading, error };
}
