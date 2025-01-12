"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  CreditCard,
  Frame,
  Framer,
  GalleryVerticalEnd,
  Image,
  ImagePlayIcon,
  Images,
  Layers,
  Map,
  PieChart,
  Settings2,
  Sparkle,
  Sparkles,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { url } from "inspector";
import Link from "next/link";

// This is sample data.
const data = [
  { title: "Dashbaord", url: "/dashboard", icon: PieChart },
  { title: "Generate Image", url: "/image-generation", icon: Image },
  { title: "My Modals", url: "/models", icon: Frame },
  { title: "Trained Modals", url: "/model-training", icon: Layers },
  { title: "My Images", url: "/gallery", icon: Images },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Setting", url: "/account-settings", icon: CreditCard },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {/* <TeamSwitcher teams={data.teams} /> */}
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Sparkles className="size-6" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{"Pictoria AI"}</span>
              <span className="truncate text-xs">{"Pro"}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>{/* <NavUser user={data.user} /> */}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
