import type { Entity } from "@/app/api/_db/schema";
import { EmptyState } from "@/components/shared/empty-state";
import { StatusBadge } from "@/components/shared/status-badge";
import { EntityActions } from "@/features/entities/components/admin/entity-actions";
import { EntityForm } from "@/features/entities/components/admin/entity-form";

interface EntitiesTableProps {
  entities: Entity[];
}

export function EntitiesTable({ entities }: EntitiesTableProps) {
  if (entities.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8d3c7] bg-[#fbfaf6] p-6">
        <EmptyState title="No entities yet" description="Create the first hiring entity." />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
      {entities.map((entity) => (
        <article
          key={entity.id}
          className="overflow-hidden rounded-2xl border border-[#dcd7cb] bg-[#fbfaf6]"
        >
          <div className="flex min-h-56 flex-col p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex size-11 items-center justify-center rounded-2xl border border-[#c8dcc7] bg-[#e9f4df] text-sm font-semibold text-[#085b31]">
                  {entity.name.slice(0, 2).toUpperCase()}
                </div>
              </div>
              <StatusBadge status={entity.isActive ? "published" : "archived"} />
            </div>

            <div className="mt-5 flex-1">
              <h2 className="text-lg font-semibold tracking-tight">{entity.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">/{entity.slug}</p>
              <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
                {entity.description ?? "No description provided."}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e3ded3] pt-4">
              <EntityActions entity={entity} />
            </div>
          </div>

          <details className="group border-t border-[#e3ded3]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 bg-background px-5 py-3 text-sm font-medium transition-colors hover:bg-muted">
              <span>Edit details</span>
              <span className="text-muted-foreground group-open:hidden">Open</span>
              <span className="hidden text-muted-foreground group-open:inline">Close</span>
            </summary>
            <div className="hidden bg-[#f4f1e8] p-5 group-open:block">
              <EntityForm entity={entity} />
            </div>
          </details>
        </article>
      ))}
    </div>
  );
}
