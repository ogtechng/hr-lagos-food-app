import { notFound } from "next/navigation";

import { Container } from "@/components/shared/container";
import { Section } from "@/components/shared/section";
import { JobDetail } from "@/features/jobs/components/job-detail";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

type JobDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params;

  let job = null;

  try {
    const api = await createServerApiClient();
    job = await make_jobs_service(api).get_published_by_slug(slug);
  } catch {
    notFound();
  }

  if (!job) {
    notFound();
  }

  return (
    <Section className="py-12 md:py-16">
      <Container>
        <JobDetail job={job} />
      </Container>
    </Section>
  );
}
