import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";

interface ReportsExportButtonProps {
  searchParams: URLSearchParams;
}

export function ReportsExportButton({ searchParams }: ReportsExportButtonProps) {
  const href = `/api/admin/reports/export${searchParams.size > 0 ? `?${searchParams}` : ""}`;

  return (
    <Button
      nativeButton={false}
      variant="outline"
      className="border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white"
      render={<a href={href} />}
    >
      <Download className="size-4" aria-hidden="true" />
      Export CSV
    </Button>
  );
}
