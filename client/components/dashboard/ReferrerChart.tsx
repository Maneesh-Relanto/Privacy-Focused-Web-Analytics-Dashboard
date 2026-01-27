import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const referrerData = [
  { source: "google.com", views: 3200 },
  { source: "github.com", views: 2100 },
  { source: "twitter.com", views: 1800 },
  { source: "reddit.com", views: 1200 },
  { source: "direct", views: 900 },
];

export function ReferrerChart() {
  const isDark = document.documentElement.classList.contains("dark");

  const colors = {
    text: isDark ? "#e2e8f0" : "#1e293b",
    grid: isDark ? "#334155" : "#e2e8f0",
    bar: "#a855f7",
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={referrerData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          type="number"
          stroke={colors.text}
          style={{ fontSize: "12px" }}
        />
        <YAxis
          type="category"
          dataKey="source"
          stroke={colors.text}
          style={{ fontSize: "12px" }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: "8px",
            color: colors.text,
          }}
        />
        <Bar dataKey="views" fill={colors.bar} radius={[0, 8, 8, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
