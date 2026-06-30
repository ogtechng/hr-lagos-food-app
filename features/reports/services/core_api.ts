import type { AxiosInstance } from "axios";

import type { ReportFilters, ReportListQuery } from "@/app/api/_schemas/reports/report.schema";
import type { PaginatedResult } from "@/app/api/_schemas/shared/list-query.schema";

type ApiEnvelope<T> = { data: T };

export type ApplicationsReportRow = {
  applicationId: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantState: string;
  jobTitle: string;
  entityName: string;
  status: "submitted" | "accepted" | "rejected";
  appliedAt: Date;
};

export type ApplicationsReportSummary = {
  total: number;
  submitted: number;
  accepted: number;
  rejected: number;
};

const core_api = (api: AxiosInstance) => ({
  get_applications: async (filters?: ReportFilters) =>
    (
      await api.get<ApiEnvelope<ApplicationsReportRow[]>>("/reports/applications", {
        params: filters,
      })
    ).data.data,
  get_applications_paginated: async (query: ReportListQuery) =>
    (
      await api.get<ApiEnvelope<PaginatedResult<ApplicationsReportRow>>>("/reports/applications", {
        params: query,
      })
    ).data.data,
  get_applications_summary: async (filters?: ReportFilters) =>
    (
      await api.get<ApiEnvelope<ApplicationsReportSummary>>("/reports/applications/summary", {
        params: filters,
      })
    ).data.data,
});

export default core_api;
