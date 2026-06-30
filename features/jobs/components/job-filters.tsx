import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PublicJobFilters } from "@/features/jobs/schemas/public-job-filters.schema";
import type { Entity } from "@/app/api/_db/schema";

interface JobFiltersProps {
  filters: PublicJobFilters;
  entities: Entity[];
  departments: string[];
  locations: string[];
  employmentTypes: string[];
}

export function JobFilters({
  filters,
  entities,
  departments,
  locations,
  employmentTypes,
}: JobFiltersProps) {
  return (
    <form action="/jobs" className="border border-[#d8d3c7] bg-white/80 p-4 md:p-5">
      <div className="grid items-end gap-4 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr_auto]">
        <div className="space-y-2">
          <label htmlFor="job-search" className="text-sm font-semibold">
            Search
          </label>
          <Input id="job-search" name="q" defaultValue={filters.q ?? ""} placeholder="Job title" />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold">Entity</span>
          <Select name="entity" defaultValue={filters.entity ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All entities</SelectItem>
              {entities.map((entity) => (
                <SelectItem key={entity.id} value={entity.slug}>
                  {entity.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold">Function</span>
          <Select name="department" defaultValue={filters.department ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All functions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All functions</SelectItem>
              {departments.map((department) => (
                <SelectItem key={department} value={department}>
                  {department}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold">Location</span>
          <Select name="location" defaultValue={filters.location ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All locations</SelectItem>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-semibold">Type</span>
          <Select name="employmentType" defaultValue={filters.employmentType ?? ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" className="w-full lg:w-auto">
          <Search className="size-4" aria-hidden="true" />
          Search
        </Button>
      </div>
    </form>
  );
}
