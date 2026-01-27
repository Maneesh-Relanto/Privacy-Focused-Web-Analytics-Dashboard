import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const topPagesData = [
  { page: "/home", views: 4200, users: 2400 },
  { page: "/about", views: 3000, users: 1398 },
  { page: "/pricing", views: 2800, users: 1321 },
  { page: "/docs", views: 2400, users: 1200 },
  { page: "/contact", views: 2210, users: 1100 },
];

export function TopPagesChart() {
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
        <XAxis dataKey="page" stroke={colors.text} style={{ fontSize: "12px" }} />
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
