import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";

const footerLinks = [
  { label: "Home", href: "/" },
  { label: "Jobs", href: "/jobs" },
] as const;

const entities = ["P4L", "MyLagosFoodApp", "BulkFood"] as const;

export function PublicFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <Container className="py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="flex items-center gap-3"
              aria-label="My Lagos Food Careers — home"
            >
              <Image
                src="/logo.svg"
                alt="My Lagos Food App"
                width={816}
                height={264}
                className="h-9 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Public careers portal for food-sector roles across Lagos food platforms.
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
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
              {entities.map((entity) => (
                <li key={entity}>
                  <span className="text-sm text-muted-foreground">{entity}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-sm font-semibold">Contact</h3>
            <ul className="mt-4 space-y-3">
              <li>
                <span className="text-sm text-muted-foreground">Lagos, Nigeria</span>
              </li>
              <li>
                <Link
                  href="mailto:recruitments@mylagosfoodapp.com"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  recruitments@mylagosfoodapp.com
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} My Lagos Food App. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
