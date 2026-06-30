import type { AxiosInstance } from "axios";

import type { Entity } from "@/app/api/_db/schema";
import type { EntityListQuery } from "@/app/api/_schemas/entities/entity.schema";
import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";

type ApiEnvelope<T> = { data: T };

const core_api = (api: AxiosInstance) => ({
  get_all: async () => (await api.get<ApiEnvelope<Entity[]>>("/entities")).data.data,
  get_paginated: async (query: EntityListQuery) =>
    (await api.get<ApiEnvelope<PaginatedResult<Entity>>>("/entities", { params: query })).data.data,
  get_active: async () => (await api.get<ApiEnvelope<Entity[]>>("/entities/active")).data.data,
  get_by_id: async (id: string) =>
    (await api.get<ApiEnvelope<Entity>>(`/entities/${id}`)).data.data,
  get_by_slug: async (slug: string) =>
    (await api.get<ApiEnvelope<Entity>>(`/entities/slug/${encodeURIComponent(slug)}`)).data.data,
});

export default core_api;
