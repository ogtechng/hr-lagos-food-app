"use client";

import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LogoutButton } from "@/features/auth/components/logout-button";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  return (
    <TooltipProvider>
      <SidebarProvider style={{ "--sidebar": "#f7f5ef" } as React.CSSProperties}>
        <AdminSidebar />
        <SidebarInset className="min-w-0 overflow-x-hidden">
          <header className="flex h-14 shrink-0 items-center gap-3 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <h1 className="font-display text-sm font-semibold tracking-tight">Admin Portal</h1>
            <div className="ml-auto">
              <LogoutButton />
            </div>
          </header>
          <div className="min-w-0 flex-1 overflow-y-auto">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
