import { useState, useEffect } from "react";
import type { DashboardData, DashboardMetrics } from "@shared/types/dashboard";

/**
 * Hook to fetch all dashboard data at once
 */
export function useDashboardData(dateRange: string = "7d") {
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

        const response = await fetch(
          `/api/v1/dashboard/all?dateRange=${dateRange}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

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
