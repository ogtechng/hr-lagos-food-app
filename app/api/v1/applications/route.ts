import { NextRequest } from "next/server";
import { z } from "zod";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import {
  applicationFiltersSchema,
  publicApplicationFormSchema,
} from "@/app/api/_schemas/applications/application.schema";
import {
  createApplicationForJob,
  listApplicationsService,
} from "@/app/api/_services/applications/applications.service";
import { created, handleApiError, ok, searchParamsToObject } from "@/app/api/_utils/http";

function formDataValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    const filters = applicationFiltersSchema.parse(
      searchParamsToObject(request.nextUrl.searchParams),
    );
    return ok(await listApplicationsService(filters));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const input = publicApplicationFormSchema.parse({
      jobId: formDataValue(formData, "jobId"),
      name: formDataValue(formData, "name"),
      phone: formDataValue(formData, "phone"),
      email: formDataValue(formData, "email"),
      state: formDataValue(formData, "state"),
      address: formDataValue(formData, "address"),
    });
    const cv = formData.get("cv");

    if (!(cv instanceof File) || cv.size === 0) {
      return Response.json(
        { error: "Invalid request", details: { fieldErrors: { cv: ["CV is required"] } } },
        { status: 400 },
      );
    }

    const coverLetterRaw = formData.get("coverLetter");
    const coverLetter =
      coverLetterRaw instanceof File && coverLetterRaw.size > 0 ? coverLetterRaw : null;

    return created(await createApplicationForJob(input, cv, coverLetter));
  } catch (error) {
    const safeMessages = new Set([
      "CV is required",
      "Cover letter upload is not configured",
      "Cover letter upload failed",
      "The uploaded Cover letter file could not be verified",
      "Only PDF, DOC, and DOCX files are allowed",
      "The uploaded CV file could not be verified",
      "CV upload is not configured",
      "CV upload failed",
    ]);

    if (error instanceof Error && error.message === "Job not found") {
      return Response.json({ error: "This job is no longer available." }, { status: 404 });
    }

    const fieldFor = (message: string) =>
      message.includes("Cover letter")
        ? ("coverLetter" as const)
        : message.includes("CV") || message.includes("file")
          ? ("cv" as const)
          : undefined;

    if (
      error instanceof Error &&
      (error.message.startsWith("CV must be") || error.message.startsWith("Cover letter must be"))
    ) {
      const field = fieldFor(error.message);
      return Response.json(
        { error: error.message, fieldErrors: field ? { [field]: error.message } : undefined },
        { status: 400 },
      );
    }

    if (error instanceof Error && safeMessages.has(error.message)) {
      const field = fieldFor(error.message);
      return Response.json(
        { error: error.message, fieldErrors: field ? { [field]: error.message } : undefined },
        { status: 400 },
      );
    }

    if (error instanceof z.ZodError) {
      return handleApiError(error);
    }

    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
