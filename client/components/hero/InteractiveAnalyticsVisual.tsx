import { useEffect, useState } from "react";

export function InteractiveAnalyticsVisual() {
  const [chartData, setChartData] = useState<number[]>(Array(12).fill(0));
  const [pieData, setPieData] = useState<number[]>([0, 0, 0]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Animate line chart
    const chartInterval = setInterval(() => {
      setChartData((prev) =>
        prev.map(() => Math.random() * 80 + 20)
      );
    }, 3000);

    // Animate pie chart
    const pieInterval = setInterval(() => {
      setPieData([
        45 + Math.random() * 10,
        30 + Math.random() * 10,
        25 + Math.random() * 10,
      ]);
    }, 3000);

    return () => {
      clearInterval(chartInterval);
      clearInterval(pieInterval);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = (e.currentTarget as HTMLElement)?.getBoundingClientRect?.();
      if (rect) {
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const total = pieData.reduce((a, b) => a + b, 1);
  const percentages = pieData.map((val) => (val / total) * 100);

  // Create SVG path for pie chart
  const getArcPath = (
    startAngle: number,
    endAngle: number,
    radius: number = 40
  ) => {
    const start = {
      x: Math.cos((startAngle * Math.PI) / 180) * radius,
      y: Math.sin((startAngle * Math.PI) / 180) * radius,
    };
    const end = {
      x: Math.cos((endAngle * Math.PI) / 180) * radius,
      y: Math.sin((endAngle * Math.PI) / 180) * radius,
    };

    const largeArc = endAngle - startAngle > 180 ? 1 : 0;

    return `M 0 0 L ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 1 ${end.x} ${end.y} Z`;
  };

  return (
    <div className="w-full h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-8 flex gap-8">
      {/* Line Chart */}
      <div className="flex-1 flex flex-col">
        <h3 className="text-white font-semibold mb-4">Traffic Over Time</h3>
        <div className="flex-1 relative bg-slate-800/50 rounded p-4">
          <svg className="w-full h-full" preserveAspectRatio="none">
            {/* Grid lines */}
            {Array.from({ length: 5 }).map((_, i) => (
              <line
                key={`grid-${i}`}
                x1="0"
                y1={`${(i * 100) / 4}%`}
                x2="100%"
                y2={`${(i * 100) / 4}%`}
                stroke="rgb(100, 116, 139)"
                strokeOpacity="0.2"
              />
            ))}

            {/* Polyline chart */}
            <polyline
              points={chartData
                .map(
                  (val, idx) =>
                    `${((idx / (chartData.length - 1)) * 100).toFixed(1)}% ${(100 - val).toFixed(1)}%`
                )
                .join(" ")}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>

            {/* Data points */}
            {chartData.map((val, idx) => (
              <circle
                key={`point-${idx}`}
                cx={`${(idx / (chartData.length - 1)) * 100}%`}
                cy={`${100 - val}%`}
                r="3"
                fill="#3b82f6"
                opacity="0.7"
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-white font-semibold mb-4">Distribution</h3>
        <svg width="120" height="120" viewBox="-60 -60 120 120">
          {(() => {
            let startAngle = 0;
            const colors = ["#3b82f6", "#8b5cf6", "#ec4899"];

            return percentages.map((percentage, idx) => {
              const endAngle = startAngle + (percentage / 100) * 360;
              const path = getArcPath(startAngle, endAngle);
              startAngle = endAngle;

              return (
                <path
                  key={`pie-${idx}`}
                  d={path}
                  fill={colors[idx]}
                  opacity="0.8"
                  className="transition-opacity hover:opacity-100"
                />
              );
            });
          })()}

          {/* Center circle for donut effect */}
          <circle cx="0" cy="0" r="20" fill="#1e293b" />
        </svg>
        <div className="text-xs text-gray-400 mt-4 space-y-1">
          <div>
            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Mobile: {percentages[0].toFixed(0)}%
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
            Desktop: {percentages[1].toFixed(0)}%
          </div>
          <div>
            <span className="inline-block w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
            Tablet: {percentages[2].toFixed(0)}%
          </div>
        </div>
      </div>
    </div>
  );
}
