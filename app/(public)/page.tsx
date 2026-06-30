import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardList,
  FileText,
  Send,
  ShieldCheck,
  UploadCloud,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { make_jobs_service } from "@/features/jobs/services";
import { createServerApiClient } from "@/lib/server-api-client";

export const dynamic = "force-dynamic";

async function getLandingData() {
  try {
    const api = await createServerApiClient();
    const jobs = await make_jobs_service(api).get_published();
    return { jobs: jobs.slice(0, 5) };
  } catch {
    return { jobs: [] };
  }
}

const channels = ["Kitchen", "Logistics", "Support", "Warehouse", "Engineering"];

const tabs = ["Operations", "Kitchen teams", "Logistics"];

const entityLogos = [
  { name: "BulkFood", src: "/bulkfood.png", width: 594, height: 296 },
  { name: "Produce for Lagos App", src: "/mylagosfoodapp-logo.svg", width: 816, height: 264 },
  { name: "P4L", src: "/p4lagos.png", width: 199, height: 87 },
];

const flow = [
  { label: "Browse role", icon: BriefcaseBusiness },
  { label: "Short form", icon: ClipboardList },
  { label: "Upload CV", icon: UploadCloud },
  { label: "Under review", icon: ShieldCheck },
  { label: "Email update", icon: Send },
];

const stack = [
  {
    eyebrow: "Intake",
    title: "No-account applications",
    body: "Applicants can move from a published role to a complete application without creating a profile first.",
    icon: FileText,
    media: "bg-orange-100",
    iconWrap: "border-orange-300/70 bg-white/85 text-orange-600",
    accent: "text-orange-600",
  },
  {
    eyebrow: "Updates",
    title: "Clear status updates",
    body: "Every application moves through a transparent review, and you are notified by email as your status changes.",
    icon: BadgeCheck,
    media: "bg-purple-100",
    iconWrap: "border-purple-300/70 bg-white/85 text-purple-600",
    accent: "text-purple-600",
  },
];

const faqs = [
  [
    "Do applicants need an account?",
    "No. The application flow is public and intentionally lightweight.",
  ],
  ["Which CV formats work?", "PDF, DOC, and DOCX files are accepted in the upload flow."],
  [
    "Who reviews my application?",
    "The hiring team for the role reviews your application, and you receive email updates as it progresses.",
  ],
  ["How are applicants updated?", "Application status updates can be sent by email."],
];

function HiringMap() {
  return (
    <div className="relative min-h-[20rem] overflow-hidden rounded-[1.15rem] border border-[#9ec5aa] bg-[#eef5ec] p-4">
      <div className="absolute inset-0 bg-[linear-gradient(#c8ddcc_1px,transparent_1px),linear-gradient(90deg,#c8ddcc_1px,transparent_1px)] bg-[size:46px_46px] opacity-60" />
      <div className="relative grid h-full grid-cols-4 gap-3">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-[#9ec5aa] bg-[#f9fbf4]/80 p-2">
            <div className="h-2 w-12 rounded-full bg-[#b4d3bb]" />
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-8 rounded border border-[#bad2bf] bg-white/70" />
              <div className="h-8 rounded border border-[#bad2bf] bg-white/70" />
            </div>
          </div>
        ))}
      </div>
      <div className="absolute left-[38%] top-[42%] w-36 rounded-xl border border-[#0b6132] bg-[#0b6132] p-3 text-[#eef8e7]">
        <UsersRound className="mb-2 size-4" aria-hidden="true" />
        <p className="text-xs font-semibold">Hiring desk</p>
        <p className="mt-1 text-[0.68rem] leading-4 text-[#c6e3c9]">Applications reviewed here</p>
      </div>
    </div>
  );
}

function LayeredDeployGraphic() {
  return (
    <div className="relative mx-auto flex min-h-[17rem] w-full max-w-sm items-center justify-center">
      <div className="relative rounded-2xl flex aspect-square w-64 items-center justify-center overflow-hidden  bg-[#AACC00]/50 sm:w-72">
        <div
          className="pointer-events-none absolute -left-20 -top-16 h-44 w-44 rounded-full border border-[#0b6132]/18"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-24 -bottom-20 h-52 w-52 rounded-full border border-[#189044]/18"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-8 bottom-12 h-px w-40 -rotate-12 bg-[#0b6132]/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-10 top-16 h-px w-44 rotate-12 bg-[#189044]/20"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute left-8 top-9 h-16 w-16 rotate-12 border border-[#0b6132]/14"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute bottom-8 right-9 text-2xl font-light leading-none text-[#0b6132]/20"
          aria-hidden="true"
        >
          +
        </div>
      </div>
      <div className="absolute flex size-28 items-center justify-center rounded-3xl border border-[#0b6132] bg-[#0b6132] text-[#d7eccc]">
        <BriefcaseBusiness className="size-12" aria-hidden="true" />
      </div>
    </div>
  );
}

export default async function PublicHomePage() {
  const { jobs } = await getLandingData();

  return (
    <div className="bg-[#f7f5ef] text-[#24231f]">
      <section className="border-b border-[#ddd8cc] px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[1.35rem] border border-[#0c5b30] bg-[#064b28] text-center text-[#f2f0e6]">
          <div className="hero-noise relative overflow-hidden px-5 py-16 md:px-12 md:py-24">
            <div
              className="pointer-events-none absolute -left-12 top-[19%] hidden h-24 w-64 -rotate-12 rounded-full border border-[#dfff67]/30 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-10 top-[17%] hidden h-20 w-56 rotate-12 rounded-full border border-[#f2f0e6]/25 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-3 left-[7%] hidden h-32 w-32 rotate-45 border border-[#f2f0e6]/18 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -bottom-2 right-[10%] hidden h-24 w-24 rotate-12 border border-[#dfff67]/28 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -left-6 top-[47%] hidden h-px w-48 rotate-[-18deg] bg-[#dfff67]/30 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-8 top-[49%] hidden h-px w-56 rotate-12 bg-[#f2f0e6]/22 md:block"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute right-[18%] bottom-[21%] hidden text-2xl font-light leading-none text-[#dfff67]/35 md:block"
              aria-hidden="true"
            >
              +
            </div>
            <div
              className="pointer-events-none absolute left-[18%] bottom-[19%] hidden text-xl font-light leading-none text-[#f2f0e6]/28 md:block"
              aria-hidden="true"
            >
              +
            </div>
            <p className="relative mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[#78a783] px-3 py-1 text-sm font-medium text-[#c7ddbd]">
              <BriefcaseBusiness className="size-4" aria-hidden="true" />
              Produce for Lagos Careers
            </p>
            <h1 className="relative mx-auto max-w-4xl font-display text-5xl leading-[0.95] tracking-tight md:text-7xl">
              Meet the hiring portal for <span className="text-[#dfff67]">Lagos food teams.</span>
            </h1>
            <p className="relative mx-auto mt-7 max-w-2xl text-lg leading-8 text-[#d9e8d2] md:text-xl">
              One place to discover open roles, upload your CV, and get email updates across our
              food operations network.
            </p>
            <div className="relative mt-9 flex justify-center">
              <Link
                href="/jobs"
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-[#dfff67] px-6 text-sm font-semibold text-[#063b21] transition-colors hover:bg-[#ecff93] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ecff93] focus-visible:ring-offset-2 focus-visible:ring-offset-[#064b28] sm:w-auto md:min-h-12 md:px-7 md:text-base"
              >
                Browse roles
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
            <p className="relative mt-5 text-sm text-[#bfd8bc]">
              {jobs.length
                ? `${jobs.length} open roles currently featured.`
                : "Open roles appear here as they are published."}
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ddd8cc] px-4 md:px-6">
        <div className="mx-auto grid max-w-[1280px] border-x border-[#ddd8cc] md:grid-cols-[0.55fr_1.45fr]">
          <div className="border-b border-[#ddd8cc] bg-[#f1f0e9] p-7 md:border-b-0 md:border-r">
            <p className="text-xs text-[#58544b]">Built for multi-entity hiring</p>
            <p className="mt-8 font-display text-2xl">
              Active entities <span className="text-[#189044]">connected</span>
            </p>
            <p className="mt-3 text-sm leading-6 text-[#58544b]">
              Each team keeps its own jobs while applicants browse one public portal.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3">
            {entityLogos.map((logo) => (
              <div
                key={logo.name}
                className="flex min-h-28 items-center justify-center border-b border-r border-[#ddd8cc] p-6 last:border-r-0"
              >
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  className="h-12 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#ddd8cc] bg-[#fbfaf6] py-14 md:py-20">
        <div className="mx-auto max-w-[1280px] px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-end">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#ddd8cc] bg-white px-3 py-1.5 text-xs font-medium text-[#4f4a41]">
                <span className="size-2 rounded-full bg-[#189044]" aria-hidden="true" />
                Careers at Produce for Lagos
              </p>
              <h2 className="max-w-3xl font-display text-4xl leading-[0.98] tracking-tight md:text-6xl">
                Recruiting operations with visibility from role to decision.
              </h2>
            </div>
            <div className="md:pb-2">
              <p className="max-w-xl text-base leading-7 text-[#3f3c35] md:text-lg">
                Applying should feel calm and clear. Browse open roles, apply in minutes with a
                short form and your CV, and track your status by email.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  nativeButton={false}
                  size={"lg"}
                  className="bg-[#171714] text-white hover:bg-[#2a2924]"
                  render={<Link href="/jobs" />}
                >
                  Browse open roles
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 w-full overflow-hidden border-y border-[#d8d3c7] bg-[#efece3] md:mt-16">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://res.cloudinary.com/dsh9lmk7j/image/upload/v1781771679/DJI_0332_xxrmo3.jpg"
            alt="Aerial view across the Lagos food operations network."
            loading="eager"
            className="aspect-16/10 w-full object-cover sm:aspect-16/8 lg:aspect-21/8"
          />
        </div>
      </section>

      <section className="border-b border-[#ddd8cc] px-4 py-10 md:px-6">
        <div className="mx-auto max-w-[1280px] rounded-[1.15rem] border border-[#ddd8cc] bg-[#fbfaf6]">
          <div className="grid gap-5 border-b border-[#ddd8cc] p-6 md:grid-cols-[1fr_auto] md:items-end">
            <h2 className="max-w-xl font-display text-3xl leading-tight md:text-4xl">
              Frontier hiring, deployed in <span className="text-[#189044]">every operation</span>
            </h2>
            <div className="flex flex-wrap">
              {tabs.map((tab) => (
                <span
                  key={tab}
                  className="border border-[#ddd8cc] bg-[#f7f5ef] px-5 py-3 text-sm font-medium first:rounded-l-md last:rounded-r-md"
                >
                  {tab}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-8 p-6 lg:grid-cols-[0.45fr_0.55fr]">
            <div>
              <p className="font-display text-2xl">Food operations</p>
              <p className="mt-6 text-sm font-semibold">Role intake</p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#58544b]">
                Open roles, a short application form, and CV upload are kept in one simple, focused
                flow.
              </p>
              <div className="mt-10 rounded-md border border-[#ddd8cc] bg-[#f7f5ef] p-4 text-sm">
                <p className="font-medium">Applicant note</p>
                <p className="mt-2 text-[#58544b]">
                  I can start immediately and have dispatch coordination experience.
                </p>
              </div>
            </div>
            <HiringMap />
          </div>
        </div>
      </section>

      <section className="border-b border-[#ddd8cc] px-4 py-16 md:px-6">
        <div className="mx-auto max-w-[1180px]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="font-display text-3xl md:text-4xl">
                The full stack for <span className="text-[#189044]">hiring coordination</span>
              </h2>
              <p className="mt-5 max-w-3xl text-sm leading-6 text-[#58544b]">
                Everything needed to take an applicant from interest to decision without a heavy
                account system or disconnected spreadsheets.
              </p>
            </div>
            <Button
              nativeButton={false}
              size="lg"
              className="hidden bg-[#085b31] text-white hover:bg-[#0a6b3b] md:inline-flex"
              render={<Link href="/jobs" />}
            >
              View roles
            </Button>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {stack.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="border border-[#ddd8cc] bg-[#fbfaf6] p-6">
                  <div
                    className={`flex min-h-48 items-center justify-center rounded-md ${item.media}`}
                  >
                    <div
                      className={`flex size-16 items-center justify-center rounded-full border shadow-sm ${item.iconWrap}`}
                    >
                      <Icon className="size-7" aria-hidden="true" />
                    </div>
                  </div>
                  <p className={`mt-5 text-xs font-semibold ${item.accent}`}>{item.eyebrow}</p>
                  <h3 className="mt-2 font-display text-2xl">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#58544b]">{item.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="flow" className="border-b border-[#ddd8cc] px-4 py-16 md:px-6">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="font-display text-3xl md:text-4xl">
            Application flow that is fast and accurate for{" "}
            <span className="text-[#189044]">busy teams</span>
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-6 text-[#58544b]">
            Apply once with a short form and your CV, then track your status by email.
          </p>
          <div className="relative mt-12 overflow-hidden border border-[#ddd8cc] bg-[#fbfaf6] p-8">
            <div className="absolute -left-10 top-6 h-36 w-36 rounded-full border border-[#9ec5aa]" />
            <div className="absolute -right-10 bottom-6 h-36 w-36 rounded-full border border-[#9ec5aa]" />
            <div className="relative flex flex-wrap items-center justify-center gap-4">
              {flow.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="rounded-md border border-[#ddd8cc] bg-[#f7f5ef] px-4 py-3">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Icon className="size-4 text-[#189044]" aria-hidden="true" />
                        {item.label}
                      </div>
                    </div>
                    {index < flow.length - 1 && (
                      <ArrowRight className="hidden size-4 text-[#8a877d] md:block" />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              {channels.map((channel) => (
                <span
                  key={channel}
                  className="rounded-md border border-[#ddd8cc] bg-white px-4 py-2 text-sm text-[#58544b]"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#ddd8cc] px-4 py-14 md:px-6">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[0.9fr_1.1fr] md:items-center">
          <div className="bg-[#55A630] rounded-3xl w-full h-full flex justify-center items-center">
            <LayeredDeployGraphic />
          </div>
          <div>
            <h2 className="font-display text-3xl leading-tight md:text-4xl">
              Built for applicants.{" "}
              <span className="text-[#189044]">From first look to offer.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-6 text-[#58544b]">
              Discover roles across our food operations network, apply in minutes, and stay informed
              by email — no account required.
            </p>
            <div className="mt-8 divide-y divide-[#ddd8cc] border-y border-[#ddd8cc]">
              {["Browse every open role", "Apply without an account", "Email status updates"].map(
                (item) => (
                  <div key={item} className="flex items-center gap-3 py-4">
                    <CheckCircle2 className="size-4 text-[#189044]" aria-hidden="true" />
                    <span className="text-sm font-medium">{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-16 md:px-6">
        <div className="mx-auto max-w-[1180px]">
          <h2 className="font-display text-3xl md:text-4xl">Applicant questions</h2>
          <div className="mt-8 grid gap-px overflow-hidden border border-[#ddd8cc] bg-[#ddd8cc] md:grid-cols-2">
            {faqs.map(([question, answer]) => (
              <div key={question} className="bg-[#fbfaf6] p-6">
                <h3 className="font-display text-xl">{question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#58544b]">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
