import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { companies } from "@/config/public-careers-content";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Produce for Lagos", href: "/#about" },
  { label: "Our Companies", href: "/#companies" },
  { label: "Current Vacancies", href: "/jobs" },
  { label: "Applicant FAQs", href: "/#faqs" },
] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-[#d8d3c7] bg-[#102318] text-[#f3f5ea]">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="Produce for Lagos Careers — home"
            >
              <Image
                src="/images/produce-for-lagos-programme-logo.png"
                alt="Produce for Lagos Programme"
                width={199}
                height={87}
                className="h-11 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-[#c8d8c1]">
              Produce for Lagos is building the future of food through infrastructure, finance,
              logistics and structured food trading.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-display text-sm font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#c8d8c1] transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entities */}
          <div>
            <h3 className="font-display text-sm font-semibold">Entities</h3>
            <ul className="mt-4 space-y-3">
              {companies.map((company) => (
                <li key={company.shortName}>
                  <span className="text-sm text-[#c8d8c1]">
                    {company.shortName}: {company.headline}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-[#c8d8c1]">Lagos, Nigeria</span>
              </li>
              <li>
                <Link
                  href="mailto:recruitments@ProduceforLagos.com"
                  className="text-sm text-[#c8d8c1] transition-colors hover:text-white"
                >
                  recruitments@ProduceforLagos.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-6 sm:flex-row">
          <p className="text-xs text-[#c8d8c1]">
            &copy; 2026 Produce for Lagos Recruitment App. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
