import { useEffect, useState } from "react";

export function AnimatedChartVisualization() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    Array(7).fill(0),
  );

  useEffect(() => {
    // Animate bars from bottom to their target height
    const targetValues = [45, 65, 35, 70, 55, 80, 60];
    const interval = setInterval(() => {
      setAnimatedValues((prev) =>
        prev.map((val, idx) => {
          const target = targetValues[idx];
          const diff = target - val;
          return val + diff * 0.15; // Smooth animation
        }),
      );
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const maxValue = 100;

  return (
    <div className="w-full h-80 bg-white rounded-2xl p-8 flex flex-col shadow-lg border border-gray-100">
      {/* Header */}
      <div className="mb-8">
        <h3 className="text-gray-900 font-bold text-lg mb-2">
          Page Views Trend
        </h3>
        <p className="text-gray-500 text-sm">Last 7 days performance</p>
      </div>

      {/* Chart */}
      <div className="flex items-end justify-around flex-1 gap-3 px-4">
        {days.map((day, idx) => {
          const height = (animatedValues[idx] / maxValue) * 100;
          return (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 flex-1 h-full justify-end"
            >
              <div
                className="w-full bg-gradient-to-t from-blue-600 via-cyan-500 to-blue-400 rounded-lg transition-all duration-75 hover:shadow-md"
                style={{ height: `${height}%` }}
              ></div>
              <span className="text-xs text-gray-600 font-medium">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-between text-xs text-gray-500 mt-6 pt-6 border-t border-gray-200">
        <span>0</span>
        <span>50</span>
        <span>100</span>
      </div>
    </div>
  );
}
