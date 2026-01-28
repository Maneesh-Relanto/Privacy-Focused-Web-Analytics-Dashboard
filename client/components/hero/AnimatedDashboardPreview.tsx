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
    <div className="w-full h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 flex flex-col">
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-semibold">Analytics Dashboard</h3>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-400">Live</span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 flex-1">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          const colorClasses = {
            blue: "from-blue-500/20 to-blue-600/20",
            purple: "from-purple-500/20 to-purple-600/20",
            green: "from-green-500/20 to-green-600/20",
            orange: "from-orange-500/20 to-orange-600/20",
          };

          return (
            <div
              key={idx}
              className={`bg-gradient-to-br ${colorClasses[metric.color as keyof typeof colorClasses]} border border-gray-700 rounded-lg p-4 transition-all duration-500 transform ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              style={{
                transitionDelay: `${idx * 150}ms`,
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className="h-4 w-4 text-gray-300" />
              </div>
              <div className="text-gray-400 text-xs font-medium">
                {metric.label}
              </div>
              <div className="text-white text-lg font-bold mt-1">
                {metric.value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
