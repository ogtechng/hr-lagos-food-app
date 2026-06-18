import { cn } from "@/lib/utils";

interface Item {
  label: string;
  value: React.ReactNode;
}

interface DescriptionListProps {
  items: Item[];
  className?: string;
  layout?: "horizontal" | "vertical";
}

export function DescriptionList({ items, className, layout = "horizontal" }: DescriptionListProps) {
  return (
    <dl className={cn(layout === "horizontal" ? "divide-y" : "space-y-4", className)}>
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            layout === "horizontal"
              ? "flex items-center justify-between gap-4 py-4"
              : "space-y-1.5",
          )}
        >
          <dt className="text-sm font-semibold text-muted-foreground">{item.label}</dt>
          <dd className="text-sm font-medium">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
