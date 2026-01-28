import { useState, useEffect } from "react";
import { Eye, Users, Clock, TrendingUp } from "lucide-react";

export function AnimatedDashboardPreview() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const metrics = [
    { icon: Eye, label: "Page Views", value: "45,231", color: "blue" },
    { icon: Users, label: "Visitors", value: "12,847", color: "purple" },
    { icon: Clock, label: "Duration", value: "3m 42s", color: "green" },
    { icon: TrendingUp, label: "Bounce Rate", value: "32.4%", color: "orange" },
  ];

  return (
    <div className="w-full h-80 bg-white rounded-2xl p-8 flex flex-col shadow-lg border border-gray-100">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-gray-900 font-bold text-lg">Analytics Dashboard</h3>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: "from-blue-50 to-cyan-50 border-blue-200",
            purple: "from-purple-50 to-pink-50 border-purple-200",
            green: "from-green-50 to-emerald-50 border-green-200",
            orange: "from-orange-50 to-amber-50 border-orange-200",
          };

          const iconColors = {
            blue: "text-blue-600",
            purple: "text-purple-600",
            green: "text-green-600",
            orange: "text-orange-600",
          };

          const textColors = {
            blue: "text-blue-700",
            purple: "text-purple-700",
            green: "text-green-700",
            orange: "text-orange-700",
          };

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colorClasses[metric.color as keyof typeof colorClasses]} border rounded-xl p-6 transition-all duration-500 transform hover:shadow-md ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <Icon
                  className={`h-5 w-5 ${iconColors[metric.color as keyof typeof iconColors]}`}
                />
              </div>
              <div className="text-gray-600 text-xs font-semibold uppercase tracking-wide">
                {metric.label}
              </div>
              <div
                className={`${textColors[metric.color as keyof typeof textColors]} text-2xl font-bold mt-2`}
              >
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
