import { NextRequest, NextResponse } from "next/server";

import { requireAdmin } from "@/app/api/_auth/require-admin";
import { applicationIdParamSchema } from "@/app/api/_schemas/applications/application.schema";
import { getApplicationDetailByIdService } from "@/app/api/_services/applications/applications.service";
import { createServiceClient } from "@/app/api/_supabase/service-role";
import { hasSupabaseServiceRoleEnv } from "@/app/api/_supabase/env";

type RouteContext = {
  params: Promise<unknown>;
};

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAdmin();
    const { id } = applicationIdParamSchema.parse(await context.params);
    const application = await getApplicationDetailByIdService(id);

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    if (!hasSupabaseServiceRoleEnv()) {
      return NextResponse.json({ error: "CV access is not configured" }, { status: 503 });
    }

    if (!application.cvStoragePath) {
      return NextResponse.json({ error: "CV storage path is unavailable" }, { status: 404 });
    }

    const bucket = process.env.SUPABASE_CV_BUCKET ?? "cvs";
    const supabase = createServiceClient();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(application.cvStoragePath, 600);

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: "CV could not be opened" }, { status: 404 });
    }

    // `?json=1` returns the signed URL for in-page preview (PDF iframe / Office viewer);
    // the default redirect powers the "Open" button.
    if (request.nextUrl.searchParams.has("json")) {
      return NextResponse.json({ url: data.signedUrl, fileName: application.cvFileName });
    }

    return NextResponse.redirect(data.signedUrl);
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof Error && error.message === "Forbidden") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
