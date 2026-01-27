import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useTheme } from "@/hooks/useTheme";

interface PageViewsChartProps {
  variant?: "pageviews" | "visitors";
}

const pageViewsData = [
  { date: "Mon", views: 2400, visitors: 1200 },
  { date: "Tue", views: 3210, visitors: 1500 },
  { date: "Wed", views: 2290, visitors: 1100 },
  { date: "Thu", views: 2000, visitors: 900 },
  { date: "Fri", views: 2181, visitors: 1050 },
  { date: "Sat", views: 2500, visitors: 1200 },
  { date: "Sun", views: 2100, visitors: 1000 },
];

export function PageViewsChart({ variant = "pageviews" }: PageViewsChartProps) {
  const isDark = document.documentElement.classList.contains("dark");

  const colors = {
    text: isDark ? "#e2e8f0" : "#1e293b",
    grid: isDark ? "#334155" : "#e2e8f0",
    line: "#3b82f6",
    lineSecondary: "#a855f7",
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={pageViewsData}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis stroke={colors.text} style={{ fontSize: "12px" }} />
        <YAxis stroke={colors.text} style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: "8px",
            color: colors.text,
          }}
          cursor={{ stroke: colors.line, strokeWidth: 1 }}
        />
        <Legend />
        {variant === "pageviews" ? (
          <Line
            type="monotone"
            dataKey="views"
            stroke={colors.line}
            strokeWidth={2}
            dot={{ fill: colors.line, r: 4 }}
            activeDot={{ r: 6 }}
            name="Page Views"
          />
        ) : (
          <Line
            type="monotone"
            dataKey="visitors"
            stroke={colors.lineSecondary}
            strokeWidth={2}
            dot={{ fill: colors.lineSecondary, r: 4 }}
            activeDot={{ r: 6 }}
            name="Unique Visitors"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
