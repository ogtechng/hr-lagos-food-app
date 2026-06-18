"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  FileText,
  LayoutDashboard,
  Store,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
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
  { title: "Jobs", href: "/admin/jobs", icon: BriefcaseBusiness },
  { title: "Applications", href: "/admin/applications", icon: FileText },
  { title: "Reports", href: "/admin/reports", icon: BarChart3 },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader>
        <Link
          href="/admin"
          aria-label="My Lagos Food admin — dashboard"
          className="flex h-9 items-center px-1"
        >
          <Image
            src="/logo.svg"
            alt="My Lagos Food"
            width={816}
            height={264}
            priority
            className="h-7 w-auto group-data-[collapsible=icon]:hidden"
          />
          <span className="hidden size-7 items-center justify-center rounded-md bg-primary text-primary-foreground group-data-[collapsible=icon]:flex">
            <Store className="size-4" aria-hidden="true" />
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#8a877d]">Admin</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={cn(
                        "font-medium",
                        active
                          ? "bg-white text-[#0b6132] shadow-sm hover:bg-white hover:text-[#0b6132]"
                          : "text-[#5b5750] hover:bg-white/70 hover:text-[#0b6132]",
                      )}
                      render={<Link href={item.href} aria-current={active ? "page" : undefined} />}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
}
