import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: number;
  trendLabel?: string;
  color?: "blue" | "purple" | "green" | "orange";
  invertTrend?: boolean;
}

const colorClasses = {
  blue: "text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400",
  purple:
    "text-purple-600 bg-purple-50 dark:bg-purple-950/30 dark:text-purple-400",
  green: "text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400",
  orange:
    "text-orange-600 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400",
};

export function MetricCard({
  title,
  value,
  icon: Icon,
  trend = 0,
  trendLabel = "change",
  color = "blue",
  invertTrend = false,
}: MetricCardProps) {
  const isTrendPositive = (trend > 0 && !invertTrend) || (trend < 0 && invertTrend);
  const TrendIcon = isTrendPositive ? TrendingUp : TrendingDown;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("rounded-lg p-2", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold",
              isTrendPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(trend)}%</span>
          </div>
          <span className="text-xs text-muted-foreground">{trendLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
}
