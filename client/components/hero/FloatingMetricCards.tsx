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
        })),
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
    <div className="w-full h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl relative overflow-hidden shadow-lg border border-gray-200">
      {/* Background gradient effect */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
      </div>

      {/* Floating cards */}
      <div className="relative w-full h-full flex items-center justify-center p-8">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          const pos = positions[idx] || { x: 0, y: 0, rotation: 0 };

          const cardColorMap = {
            "from-blue-500/20 to-blue-600/20":
              "from-blue-100 to-cyan-100 border-blue-300",
            "from-purple-500/20 to-purple-600/20":
              "from-purple-100 to-pink-100 border-purple-300",
            "from-green-500/20 to-green-600/20":
              "from-green-100 to-emerald-100 border-green-300",
            "from-orange-500/20 to-orange-600/20":
              "from-orange-100 to-amber-100 border-orange-300",
          };

          const iconColorMap = {
            "from-blue-500/20 to-blue-600/20": "text-blue-600",
            "from-purple-500/20 to-purple-600/20": "text-purple-600",
            "from-green-500/20 to-green-600/20": "text-green-600",
            "from-orange-500/20 to-orange-600/20": "text-orange-600",
          };

          const textColorMap = {
            "from-blue-500/20 to-blue-600/20": "text-blue-700",
            "from-purple-500/20 to-purple-600/20": "text-purple-700",
            "from-green-500/20 to-green-600/20": "text-green-700",
            "from-orange-500/20 to-orange-600/20": "text-orange-700",
          };

          return (
            <div
              key={idx}
              className={`absolute bg-gradient-to-br ${cardColorMap[card.color as keyof typeof cardColorMap]} border rounded-xl p-4 w-32 h-24 flex flex-col justify-between transition-transform duration-1000 ease-in-out shadow-md hover:shadow-lg`}
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `translate(-50%, -50%) rotate(${pos.rotation}deg)`,
              }}
            >
              <Icon
                className={`h-5 w-5 ${iconColorMap[card.color as keyof typeof iconColorMap]}`}
              />
              <div>
                <div className="text-xs text-gray-600 font-semibold">
                  {card.label}
                </div>
                <div
                  className={`text-lg font-bold ${textColorMap[card.color as keyof typeof textColorMap]}`}
                >
                  {card.value}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
