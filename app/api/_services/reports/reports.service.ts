import {
  getApplicationsReport,
  getApplicationsReportSummary,
} from "@/app/api/_repositories/reports/reports.repository";
import type { ReportFilters } from "@/app/api/_schemas/reports/report.schema";

export async function getApplicationsReportService(filters: ReportFilters = {}) {
  return getApplicationsReport(filters);
}

export async function getApplicationsReportSummaryService(filters: ReportFilters = {}) {
  return getApplicationsReportSummary(filters);
}

function escapeCsvValue(value: string | number | Date | null | undefined) {
  const stringValue = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export async function exportApplicationsReportCsv(filters: ReportFilters = {}) {
  const rows = await getApplicationsReport(filters);
  const headers = [
    "Applicant Name",
    "Email",
    "Phone",
    "State",
    "Job Title",
    "Entity",
    "Status",
    "Application Date",
  ];

  const lines = [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) =>
      [
        row.applicantName,
        row.applicantEmail,
        row.applicantPhone,
        row.applicantState,
        row.jobTitle,
        row.entityName,
        row.status,
        row.appliedAt,
      ]
        .map(escapeCsvValue)
        .join(","),
    ),
  ];

  return lines.join("\n");
}
