import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  CircleDollarSign,
  Factory,
  Leaf,
  Network,
  ShieldCheck,
  Truck,
  UsersRound,
} from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import {
  applicantFaqs,
  challengeMetrics,
  companies,
  jobFamilies,
  missionObjectives,
} from "@/config/public-careers-content";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

async function getLandingData() {
  try {
    const api = await createServerApiClient();
    const jobs = await make_jobs_service(api).get_published();
    return { jobs: jobs.slice(0, 4), openRoleCount: jobs.length };
  } catch {
    return { jobs: [], openRoleCount: 0 };
  }
}

const missionStats = [
  { label: "Infrastructure", icon: Factory },
  { label: "Finance", icon: CircleDollarSign },
  { label: "Logistics", icon: Truck },
  { label: "Food systems", icon: Leaf },
] as const;

export default async function PublicHomePage() {
  const { jobs, openRoleCount } = await getLandingData();

  return (
    <div className="w-full overflow-x-clip bg-[#f0f7df] text-[#24231f]">
      <section className=" border-b border-[#d8d3c7]">
        <Container className="grid items-center gap-10 py-10 md:grid-cols-[0.92fr_1.08fr] md:py-14">
          <div className="relative z-10 max-w-2xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-[#a7c7a5] bg-white/70 px-3 py-1.5 text-sm font-semibold text-[#17542f]">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              Produce for Lagos Careers
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.94] tracking-tight text-[#102318] md:text-7xl">
              Building the future of food.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#4b5148] md:text-xl">
              Produce for Lagos is driving one of Africa&apos;s most ambitious food systems
              transformation programmes-re-imagining how food is produced, financed, traded,
              transported and distributed.
            </p>
            <p className="mt-4 max-w-xl text-base leading-7 text-[#5d6259]">
              If you want your work to improve millions of lives by redesigning the systems that
              feed one of the world&apos;s most populous cities, we would love to hear from you.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                nativeButton={false}
                size="lg"
                className="bg-[#0a5a32] text-white hover:bg-[#084727]"
                render={<Link href="/jobs" />}
              >
                Browse roles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <Button
                nativeButton={false}
                size="lg"
                variant="outline"
                className="border-[#b6c9ad] bg-white/75 text-[#173526] hover:bg-[#eef5e8]"
                render={<Link href="#talent-community" />}
              >
                Join talent community
              </Button>
            </div>
            <p className="mt-5 text-sm font-medium text-[#667060]">
              {openRoleCount
                ? `${openRoleCount} open ${openRoleCount === 1 ? "role" : "roles"} currently published.`
                : "Open roles appear here as they are published."}
            </p>
          </div>

          <div className="relative">
            <div className="absolute -left-5 top-8 hidden h-44 w-44 border border-[#6d9a70]/35 md:block" />
            <div className="absolute -right-4 bottom-12 hidden h-28 w-28 border border-[#dfff67]/60 md:block" />
            <div className="relative overflow-hidden rounded-[1.25rem] border border-[#becbb5] bg-[#e9eddf] shadow-[0_28px_70px_-40px_rgba(11,61,33,0.45)]">
              <Image
                src="/images/produce-for-lagos-field-team.jpeg"
                alt="Produce for Lagos field team visiting an agricultural site."
                width={4000}
                height={2250}
                priority
                className="aspect-[5/4] w-full object-cover md:aspect-[4/5] lg:aspect-[5/4]"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#102318]/92 via-[#102318]/50 to-transparent p-5 pt-20 text-white">
                <p className="max-w-sm text-sm leading-6 text-[#e6f2dc]">
                  A coordinated ecosystem for sourcing food, transporting it from production centres
                  to organised markets, and strengthening food security for Lagos.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="why-join" className="border-b border-[#d8d3c7] bg-[#fbfaf6] py-14 md:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                Why join Produce for Lagos?
              </p>
              <h2 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                Work that strengthens the systems feeding millions.
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-lg leading-8 text-[#41483f]">
                By joining Produce for Lagos, you will be joining a mission with purpose.
                You&apos;ll work alongside professionals in agriculture, infrastructure, logistics,
                finance, technology, public policy and business to build solutions with lasting
                impact.
              </p>
              <p className="text-base leading-7 text-[#5d6259]">
                Whether you&apos;re an engineer, analyst, agronomist, software developer, marketer
                or operations specialist, your work will contribute directly to strengthening food
                security for millions.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {missionStats.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center gap-3 border-t border-[#d8d3c7] py-4"
                    >
                      <Icon className="size-5 text-[#0a5a32]" aria-hidden="true" />
                      <span className="text-sm font-semibold text-[#243526]">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="talent-community" className="border-b border-[#d8d3c7] py-14 md:py-20">
        <Container>
          <div className="grid gap-8 rounded-[1rem] border border-[#0a5a32] bg-[#0a5a32] p-6 text-[#f3f5ea] md:grid-cols-[1fr_0.7fr] md:p-10">
            <div>
              <p className="text-sm font-semibold text-[#dfff67]">Join Our Talent Community</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                Share your profile, even if the right role is not open today.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#d8e8d0]">
                To discover open roles, upload your CV, and get email updates across our food
                operations network, please browse current vacancies. If the right opportunity for
                you is not available today, we would love to stay connected.
              </p>
            </div>
            <div className="flex flex-col justify-end gap-3">
              <Button
                nativeButton={false}
                size="lg"
                className="bg-[#dfff67] text-[#063b21] hover:bg-[#ecff93]"
                render={<Link href="/jobs" />}
              >
                Browse current vacancies
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
              <p className="text-sm leading-6 text-[#bed8b7]">
                As we continue to grow, we will reach out when opportunities aligned with your
                experience become available.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="about" className="border-b border-[#d8d3c7] bg-[#fbfaf6] py-14 md:py-20">
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                Introducing Produce for Lagos
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                An integrated public-private initiative transforming how food reaches Lagos.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-7 text-[#4f564d]">
              <p>
                By combining modern infrastructure, innovative financing, efficient logistics and
                structured food trading, we are creating a more resilient, affordable and
                transparent food ecosystem that benefits farmers, businesses and consumers alike.
              </p>
              <p>
                Produce for Lagos brings together infrastructure, finance, logistics and commercial
                trading into one coordinated ecosystem for sourcing food, transporting it from
                production centers with efficient logistics to well-organised markets and on to the
                final consumer.
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section id="challenge" className="border-b border-[#d8d3c7] py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                The Challenge
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                Lagos sits at the epicentre of Nigeria&apos;s food security challenge.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-7 text-[#4f564d]">
              <p>
                Food security is one of the defining challenges of rapidly growing cities.
                Nigeria&apos;s food economy is vast, dynamic, and under sustained pressure. The
                national food market is valued at over ₦22 trillion annually, yet systemic
                inefficiencies continue to drain its potential.
              </p>
              <p>
                Each year, the country loses an estimated $8-10 billion to post-harvest
                inefficiencies-eroding farmer incomes, fuelling price volatility, and undermining
                national food security.
              </p>
              <p>
                Today, much of Lagos&apos; food trade occurs through informal markets with limited
                infrastructure, resulting in high post-harvest losses, poor price transparency, weak
                quality assurance, food safety concerns, and significant logistics inefficiencies.
              </p>
            </div>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden border border-[#d8d3c7] bg-[#d8d3c7] sm:grid-cols-2 lg:grid-cols-5">
            {challengeMetrics.map((metric) => (
              <div key={metric.label} className="bg-[#fbfaf6] p-5 md:p-6">
                <p className="font-display text-3xl font-semibold tracking-tight text-[#0a5a32]">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-5 text-[#5d6259]">{metric.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section
        id="mission"
        className="border-b border-[#d8d3c7] bg-[#123321] py-14 text-[#f3f5ea] md:py-20"
      >
        <Container>
          <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#dfff67]">
                Our Mission
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Modernise the entire food value chain-from farm gate to final market.
              </h2>
            </div>
            <div>
              <p className="text-base leading-7 text-[#d8e8d0]">
                Lagos requires a food system that is efficient, resilient and capable of serving one
                of the world&apos;s fastest-growing urban populations. Produce for Lagos was created
                to modernise the entire food value chain while creating economic opportunities
                across Nigeria.
              </p>
              <div className="mt-8 divide-y divide-[#355842] border-y border-[#355842]">
                {missionObjectives.map((objective) => (
                  <div key={objective} className="flex gap-3 py-4">
                    <CheckCircle2
                      className="mt-0.5 size-5 shrink-0 text-[#dfff67]"
                      aria-hidden="true"
                    />
                    <p className="text-sm leading-6 text-[#e8f1df]">{objective}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="culture" className="border-b border-[#d8d3c7] bg-[#fbfaf6] py-14 md:py-20">
        <Container>
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                Our Culture
              </p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                Collaboration across disciplines, with execution at the centre.
              </h2>
              <p className="mt-5 max-w-3xl text-base leading-7 text-[#4f564d]">
                We believe the best ideas come from collaboration across disciplines. We value
                integrity, innovation, excellence, curiosity and execution. Our teams are encouraged
                to think boldly, solve complex problems and build systems that improve lives at
                scale.
              </p>
            </div>
            <div className="grid gap-3">
              {["Integrity", "Innovation", "Excellence", "Curiosity", "Execution"].map((value) => (
                <div key={value} className="flex items-center gap-3 border-t border-[#d8d3c7] py-4">
                  <BadgeCheck className="size-5 text-[#0a5a32]" aria-hidden="true" />
                  <span className="font-display text-xl font-semibold text-[#243526]">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="companies" className="border-b border-[#d8d3c7] py-14 md:py-20">
        <Container>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
              Meet Our Companies
            </p>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
              Four complementary pillars, one coordinated food system.
            </h2>
            <p className="mt-5 text-base leading-7 text-[#4f564d]">
              Each company plays a distinct role, but together they create a modern food system that
              delivers greater efficiency, lower costs, improved food quality and stronger market
              resilience.
            </p>
          </div>
          <div className="mt-10 grid gap-px overflow-hidden border border-[#d8d3c7] bg-[#d8d3c7] md:grid-cols-2">
            {companies.map((company, index) => (
              <article key={company.name} className="bg-[#fbfaf6] p-6 md:p-8">
                <div className="flex min-h-16 items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#0a5a32]">{company.shortName}</p>
                    <h3 className="mt-2 font-display text-2xl font-semibold leading-tight text-[#173526]">
                      {company.headline}
                    </h3>
                  </div>
                  {company.logoSrc ? (
                    <Image
                      src={company.logoSrc}
                      alt={`${company.shortName} logo`}
                      width={index === 1 ? 160 : 130}
                      height={80}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <Network className="size-7 text-[#7e9b6e]" aria-hidden="true" />
                  )}
                </div>
                <p className="mt-6 text-sm leading-6 text-[#4f564d]">{company.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      <section id="vacancies" className="border-b border-[#d8d3c7] bg-[#fbfaf6] py-14 md:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                Current Vacancies
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                Search by company or by function.
              </h2>
              <p className="mt-5 text-base leading-7 text-[#4f564d]">
                People tend to think about their careers by career family. Choose a function to see
                opportunities across P4L Fund, LAFSINCO, BulkFood, and EkoLog.
              </p>
              <Button
                nativeButton={false}
                size="lg"
                className="mt-8 bg-[#0a5a32] text-white hover:bg-[#084727]"
                render={<Link href="/jobs" />}
              >
                View all roles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
            <div>
              <div className="grid gap-2 sm:grid-cols-2">
                {jobFamilies.map((family) => (
                  <Link
                    key={family}
                    href={`/jobs?department=${encodeURIComponent(family)}`}
                    className="group flex min-h-16 items-center justify-between gap-4 border border-[#d8d3c7] bg-white/70 px-4 py-3 text-sm font-semibold text-[#243526] transition-colors hover:border-[#7fad70] hover:bg-[#eef5e8]"
                  >
                    {family}
                    <ArrowRight
                      className="size-4 shrink-0 text-[#0a5a32] transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <Link
                    key={job.id}
                    href={`/jobs/${job.slug}`}
                    className="border border-[#d8d3c7] bg-white p-5 transition-colors hover:border-[#7fad70]"
                  >
                    <p className="text-sm font-semibold text-[#0a5a32]">{job.entityName}</p>
                    <h3 className="mt-2 font-display text-xl font-semibold text-[#173526]">
                      {job.title}
                    </h3>
                    <p className="mt-3 text-sm text-[#5d6259]">
                      {[job.department, job.location].filter(Boolean).join(" / ")}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section id="faqs" className="py-14 md:py-20">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#5f7f47]">
                Applicant Frequently Asked Questions
              </p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-tight text-[#173526] md:text-5xl">
                Applicant questions
              </h2>
            </div>
            <ShieldCheck className="hidden size-12 text-[#0a5a32] md:block" aria-hidden="true" />
          </div>
          <div className="mt-8 grid gap-px overflow-hidden border border-[#d8d3c7] bg-[#d8d3c7] md:grid-cols-2">
            {applicantFaqs.map((faq) => (
              <div key={faq.question} className="bg-[#fbfaf6] p-6">
                <h3 className="font-display text-xl font-semibold text-[#173526]">
                  {faq.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#4f564d]">{faq.answer}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-start gap-4 border-t border-[#d8d3c7] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-xl text-sm leading-6 text-[#5d6259]">
              Open roles appear as they are published. If your preferred function is not hiring
              today, check back as the programme continues to grow.
            </p>
            <Button
              nativeButton={false}
              size="lg"
              className="bg-[#0a5a32] text-white hover:bg-[#084727]"
              render={<Link href="/jobs" />}
            >
              Browse roles
              <UsersRound className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </Container>
      </section>
    </div>
  );
}
