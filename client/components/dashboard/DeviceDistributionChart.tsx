import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DeviceStats {
  type: "mobile" | "desktop" | "tablet";
  count: number;
  percentage: number;
}

interface DeviceDistributionChartProps {
  data?: DeviceStats[];
}

const defaultDeviceData = [
  { name: "Mobile", value: 45, color: "#3b82f6" },
  { name: "Desktop", value: 40, color: "#a855f7" },
  { name: "Tablet", value: 15, color: "#10b981" },
];

const deviceColors: Record<string, string> = {
  mobile: "#3b82f6",
  desktop: "#a855f7",
  tablet: "#10b981",
};

export function DeviceDistributionChart({ data }: DeviceDistributionChartProps) {
  const chartData = data
    ? data.map((device) => ({
        name: device.type.charAt(0).toUpperCase() + device.type.slice(1),
        value: device.percentage,
        color: deviceColors[device.type],
      }))
    : defaultDeviceData;
  const isDark = document.documentElement.classList.contains("dark");

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, value }) => `${name} ${value}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
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
