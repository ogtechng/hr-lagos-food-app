import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  compact?: boolean;
}

export function EmptyState({
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#d8d3c7] bg-[#fbfaf6] text-center",
        compact ? "p-8" : "p-12",
        className,
      )}
    >
      <div
        className="relative mb-5 flex size-20 items-center justify-center overflow-hidden rounded-3xl border border-[#d8d3c7] bg-[#f4f1e8]"
        aria-hidden="true"
      >
        <div className="absolute -left-8 top-4 h-px w-24 rotate-[-18deg] bg-[#b9b2a4]" />
        <div className="absolute -right-8 bottom-5 h-px w-24 rotate-12 bg-[#b9b2a4]" />
        <div className="absolute -top-8 right-4 size-16 rounded-full border border-[#b9b2a4]" />
        <div className="grid size-10 place-items-center rounded-2xl border border-[#c8dcc7] bg-[#e9f4df]">
          <div className="h-4 w-5 rounded-sm border border-[#085b31]" />
        </div>
      </div>
      <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
