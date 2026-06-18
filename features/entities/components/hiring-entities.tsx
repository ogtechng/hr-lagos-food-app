import type { Entity } from "@/app/api/_db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { EntityCard } from "@/features/entities/components/entity-card";

interface HiringEntitiesProps {
  entities: Entity[];
}

export function HiringEntities({ entities }: HiringEntitiesProps) {
  if (entities.length === 0) {
    return (
      <EmptyState
        title="No active hiring entities yet"
        description="Active teams will appear here once they are ready to receive applications."
      />
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-[1.1fr_0.9fr_1fr_1.05fr]">
      {entities.map((entity) => (
        <EntityCard key={entity.id} entity={entity} />
      ))}
    </div>
  );
}
