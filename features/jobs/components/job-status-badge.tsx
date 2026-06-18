import { Badge } from "@/components/ui/badge";

/** Subtle-background + vibrant-text styles per employment type (no border). */
const TYPE_STYLES: Record<string, string> = {
  "full-time": "bg-emerald-100 text-emerald-700",
  "part-time": "bg-blue-100 text-blue-700",
  contract: "bg-amber-100 text-amber-700",
  temporary: "bg-orange-100 text-orange-700",
  internship: "bg-purple-100 text-purple-700",
  freelance: "bg-cyan-100 text-cyan-700",
  volunteer: "bg-rose-100 text-rose-700",
};

const DEFAULT_STYLE = "bg-slate-100 text-slate-700";

interface JobStatusBadgeProps {
  employmentType?: string | null;
}

export function JobStatusBadge({ employmentType }: JobStatusBadgeProps) {
  if (!employmentType) {
    return null;
  }

  const style = TYPE_STYLES[employmentType.trim().toLowerCase()] ?? DEFAULT_STYLE;

  return <Badge className={`border-transparent ${style}`}>{employmentType}</Badge>;
}
