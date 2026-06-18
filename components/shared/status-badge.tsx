import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusVariant =
  | "pending"
  | "reviewed"
  | "shortlisted"
  | "interviewed"
  | "offered"
  | "hired"
  | "submitted"
  | "accepted"
  | "rejected"
  | "withdrawn"
  | "draft"
  | "published"
  | "closed"
  | "archived";

const statusStyles: Record<StatusVariant, string> = {
  pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  reviewed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  shortlisted: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100",
  interviewed: "bg-purple-100 text-purple-800 hover:bg-purple-100",
  offered: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  hired: "bg-green-100 text-green-800 hover:bg-green-100",
  submitted: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
  accepted: "bg-green-100 text-green-800 hover:bg-green-100",
  rejected: "bg-red-100 text-red-800 hover:bg-red-100",
  withdrawn: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  draft: "bg-gray-100 text-gray-800 hover:bg-gray-100",
  published: "bg-green-100 text-green-800 hover:bg-green-100",
  closed: "bg-red-100 text-red-800 hover:bg-red-100",
  archived: "bg-gray-100 text-gray-500 hover:bg-gray-100",
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalized = status.toLowerCase() as StatusVariant;

  return (
    <Badge
      variant="secondary"
      className={cn(
        "border-transparent capitalize",
        statusStyles[normalized] ?? "bg-gray-100 text-gray-800",
        className,
      )}
    >
      {status.replace(/_/g, " ")}
    </Badge>
  );
}
