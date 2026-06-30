"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  Layers3,
  FileText,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Entities", href: "/admin/entities", icon: Building2 },
  { title: "Departments", href: "/admin/departments", icon: Layers3 },
  { title: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-4 border-b border-white/10 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:py-3">
        <Link
          href="/admin"
          aria-label="Produce for Lagos admin dashboard"
          className="flex h-14 items-center px-1 text-white/80"
        >
          <Image
            src="/logo.svg"
            alt="Produce for Lagos"
            width={816}
            height={264}
            priority
            className="h-7 w-auto brightness-0 invert"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2 py-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
        <SidebarGroup className="p-0 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center">
          <SidebarGroupLabel className="px-2 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-white/45">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
            <SidebarMenu className="gap-1 group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:items-center">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem
                    key={item.href}
                    className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:justify-center"
                  >
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "h-9 rounded-lg font-medium tracking-tight group-data-[collapsible=icon]:!size-9 group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:overflow-hidden",
                        active
                          ? "bg-[var(--admin-lemon)]/15 text-[var(--admin-lemon)] hover:bg-[var(--admin-lemon)]/15 hover:text-[var(--admin-lemon)]"
                          : "text-white/58 hover:bg-white/10 hover:text-white/90",
                      )}
                      render={<Link href={item.href} aria-current={active ? "page" : undefined} />}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t border-white/10 p-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-3">
        <div className="flex items-center gap-3 rounded-lg bg-white/10 p-2 text-white/75 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
          <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--admin-lemon)] text-[var(--admin-primary)]">
            <HelpCircle className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-semibold text-white/85">Admin help</p>
            <p className="truncate text-[0.7rem] text-white/55">Review workflows</p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
