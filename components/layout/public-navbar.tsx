"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#companies", label: "Companies" },
  { href: "/jobs", label: "Jobs" },
  { href: "/#faqs", label: "FAQs" },
] as const;

export function PublicNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href.includes("#")) return false;
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65">
      <Container className="flex h-16 items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Produce for Lagos Careers — home"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/images/produce-for-lagos-programme-logo.png"
            alt="Produce for Lagos Programme"
            width={199}
            height={87}
            priority
            className="h-10 w-auto"
          />
          <span className="hidden h-5 w-px bg-border sm:block" aria-hidden="true" />
          <span className="hidden font-display text-sm font-semibold tracking-tight text-foreground sm:block">
            Careers
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Button nativeButton={false} size="lg" render={<Link href="/jobs" />}>
            Browse roles
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>

        {/* Mobile toggle */}
        <Button
          variant="ghost"
          size="icon-sm"
          className="md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>
      </Container>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Button
              nativeButton={false}
              className="mt-2 w-full"
              render={<Link href="/jobs" onClick={() => setOpen(false)} />}
            >
              Browse roles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </Container>
        </div>
      )}
    </header>
  );
}
