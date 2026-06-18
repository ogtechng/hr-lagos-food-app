import type { Entity } from "@/app/api/_db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface EntityCardProps {
  entity: Entity;
}

export function EntityCard({ entity }: EntityCardProps) {
  return (
    <Card className="h-full border-[#c7dec4] bg-white/62">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[#c7dec4] bg-[#e6f4d9] text-sm font-semibold text-[#245438]">
            {entity.name.slice(0, 2).toUpperCase()}
          </div>
          <CardTitle className="text-[#173526]">{entity.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-4 text-sm leading-6 text-[#557057]">
          {entity.description ?? "Hiring across Lagos food operations and support teams."}
        </p>
      </CardContent>
    </Card>
  );
}
