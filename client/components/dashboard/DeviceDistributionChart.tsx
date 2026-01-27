import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const deviceData = [
  { name: "Mobile", value: 45, color: "#3b82f6" },
  { name: "Desktop", value: 40, color: "#a855f7" },
  { name: "Tablet", value: 15, color: "#10b981" },
];

export function DeviceDistributionChart() {
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={deviceData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name} ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {deviceData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
            borderRadius: "8px",
            color: isDark ? "#e2e8f0" : "#1e293b",
          }}
          formatter={(value) => `${value}%`}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
