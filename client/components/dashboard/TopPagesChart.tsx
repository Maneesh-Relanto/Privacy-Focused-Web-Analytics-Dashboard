import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TopPage {
  url: string;
  views: number;
  percentage: number;
}

interface TopPagesChartProps {
  data?: TopPage[];
}

const defaultTopPagesData = [
  { url: "/home", views: 4200, percentage: 42 },
  { url: "/about", views: 3000, percentage: 30 },
  { url: "/pricing", views: 2800, percentage: 28 },
  { url: "/docs", views: 2400, percentage: 24 },
  { url: "/contact", views: 2210, percentage: 22 },
];

export function TopPagesChart({ data }: TopPagesChartProps) {
  const chartData = data
    ? data.map((page) => ({
        page: page.url,
        views: page.views,
      }))
    : defaultTopPagesData.map((page) => ({
        page: page.url,
        views: page.views,
      }));
  const isDark = document.documentElement.classList.contains("dark");

  const colors = {
    text: isDark ? "#e2e8f0" : "#1e293b",
    grid: isDark ? "#334155" : "#e2e8f0",
    bar: "#3b82f6",
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={topPagesData}>
        <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
        <XAxis
          dataKey="page"
          stroke={colors.text}
          style={{ fontSize: "12px" }}
        />
        <YAxis stroke={colors.text} style={{ fontSize: "12px" }} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: "8px",
            color: colors.text,
          }}
        />
        <Bar dataKey="views" fill={colors.bar} radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
