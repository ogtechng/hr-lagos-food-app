import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down";
  trendValue?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("border-[#ddd8cc] bg-[#fbfaf6]", className)}>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </p>
          {icon && (
            <div className="grid size-9 place-items-center rounded-2xl border border-[#c8dcc7] bg-[#e9f4df] text-[#085b31]">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <p className="font-display text-4xl font-semibold tracking-tight">{value}</p>
          {trend && trendValue && (
            <span
              className={cn(
                "text-sm font-medium",
                trend === "up" ? "text-green-600" : "text-red-600",
              )}
            >
              {trend === "up" ? "+" : "-"}
              {trendValue}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 text-xs leading-5 text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
