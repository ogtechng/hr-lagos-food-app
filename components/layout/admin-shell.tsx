"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { Bell, Search, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const isDashboard = pathname === "/admin";

  return (
    <TooltipProvider>
      <SidebarProvider
        className="admin-scope"
        style={
          {
            "--sidebar": "var(--admin-primary-strong)",
            "--sidebar-foreground": "var(--admin-lemon)",
            "--sidebar-accent": "rgba(217, 249, 157, 0.12)",
            "--sidebar-accent-foreground": "var(--admin-lemon)",
            "--sidebar-border": "rgba(217, 249, 157, 0.12)",
          } as React.CSSProperties
        }
      >
        <AdminSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden bg-[var(--admin-canvas)]">
          {isDashboard && (
            <SidebarTrigger className="absolute left-4 top-4 z-30 bg-white/10 text-white backdrop-blur hover:bg-white/15 hover:text-[var(--admin-lemon)]" />
          )}
          <header
            className={
              isDashboard
                ? "hidden"
                : "sticky top-0 z-20 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--admin-border)] bg-[var(--admin-panel)] px-4 backdrop-blur md:px-6"
            }
          >
            <SidebarTrigger className="-ml-1 text-[var(--admin-primary)]" />
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--admin-muted)]">
                Produce for Lagos
              </p>
              <h1 className="truncate text-sm font-semibold tracking-tight text-[var(--admin-text)]">
                HR Admin
              </h1>
            </div>
            <div className="mx-auto hidden h-10 w-full max-w-xl items-center gap-2 rounded-lg border border-[var(--admin-border)] bg-[var(--admin-panel-muted)] px-3 text-sm text-[var(--admin-muted)] lg:flex">
              <Search className="size-4" aria-hidden="true" />
              <span className="flex-1">Search jobs, applicants, entities</span>
              <kbd className="rounded-md border border-[var(--admin-border)] bg-[var(--admin-panel)] px-1.5 py-0.5 text-[0.7rem]">
                Cmd K
              </kbd>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <Button type="button" variant="outline" size="icon-sm" aria-label="Notifications">
                <Bell className="size-4" aria-hidden="true" />
              </Button>
              <Button type="button" variant="outline" size="icon-sm" aria-label="Settings">
                <Settings className="size-4" aria-hidden="true" />
              </Button>
              <LogoutButton />
            </div>
          </header>
          <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
