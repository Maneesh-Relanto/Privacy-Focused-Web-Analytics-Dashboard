import { useEffect, useState } from "react";
import { Eye, Users, Clock, Globe } from "lucide-react";

export function FloatingMetricCards() {
  const [positions, setPositions] = useState<
    Array<{ x: number; y: number; rotation: number }>
  >([
    { x: 10, y: 20, rotation: -5 },
    { x: 60, y: 10, rotation: 3 },
    { x: 15, y: 65, rotation: 4 },
    { x: 70, y: 60, rotation: -3 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map((pos) => ({
          x: pos.x + (Math.random() - 0.5) * 2,
          y: pos.y + (Math.random() - 0.5) * 2,
          rotation: pos.rotation + (Math.random() - 0.5) * 2,
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const cards = [
    {
      icon: Eye,
      label: "Page Views",
      value: "45K",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30",
    },
    {
      icon: Users,
      label: "Visitors",
      value: "12K",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30",
    },
    {
      icon: Clock,
      label: "Session Time",
      value: "3m 42s",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30",
    },
    {
      icon: Globe,
      label: "Locations",
      value: "42",
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30",
    },
  ];

  return (
    <div className="w-full h-80 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Floating cards */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const pos = positions[idx] || { x: 0, y: 0, rotation: 0 };

          return (
            <div
              key={idx}
              className={`absolute bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-lg p-4 w-32 h-24 flex flex-col justify-between transition-transform duration-1000 ease-in-out`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
              }}
            >
              <Icon className="h-5 w-5 text-gray-300" />
              <div>
                <div className="text-xs text-gray-400">{card.label}</div>
                <div className="text-lg font-bold text-white">{card.value}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
