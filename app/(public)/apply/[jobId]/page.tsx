import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { ApplicationForm } from "@/features/applications/components/application-form";
import { ApplicationJobSummary } from "@/features/applications/components/application-job-summary";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type ApplyPageProps = {
  params: Promise<{ jobId: string }>;
};

export default async function ApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;
  const api = await createServerApiClient();
  const job = await make_jobs_service(api)
    .get_published_by_id(jobId)
    .catch(() => null);

  if (!job) {
    notFound();
  }

  return (
    <Section className="py-12 md:py-16">
      <Container className="space-y-8">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-semibold text-primary">Application</p>
          <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Submit your application
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            No account is required. Complete the form and upload your CV to apply.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ApplicationJobSummary job={job} />
          </aside>
          <ApplicationForm jobId={job.id} />
        </div>
      </Container>
    </Section>
  );
}
