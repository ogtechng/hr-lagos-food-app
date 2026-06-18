export interface PublicJob {
  id: string;
  entityId: string;
  entityName: string;
  entitySlug: string;
  title: string;
  slug: string;
  department: string | null;
  location: string;
  employmentType: string | null;
  description: string | null;
  responsibilities: string | null;
  requirements: string | null;
  status: "draft" | "published" | "closed";
  createdAt: Date;
  updatedAt: Date;
}
