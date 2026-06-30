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
    <Card
      className={cn(
        "dashboard-soft-ring rounded-lg border-[var(--admin-border)] bg-[var(--admin-panel)]",
        className,
      )}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
            {title}
          </p>
          {icon && (
            <div className="grid size-8 place-items-center rounded-md bg-neutral-100 text-neutral-700">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="font-display text-3xl font-semibold tracking-tight">{value}</p>
          {trend && trendValue && (
            <span
              className={cn(
                "text-xs font-semibold",
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
        <div className="mt-3 h-px overflow-hidden rounded-full bg-neutral-100">
          <div className="h-full w-2/3 rounded-full bg-linear-to-r from-neutral-300 via-neutral-500 to-neutral-300" />
        </div>
      </CardContent>
    </Card>
  );
}
