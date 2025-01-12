"use client";

import {
  CreditCard,
  Frame,
  Image,
  Images,
  Layers,
  Settings,
  SquareTerminal,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashbaord", url: "/dashboard", icon: SquareTerminal },
  { title: "Generate Image", url: "/image-generation", icon: Image },
  { title: "My Modals", url: "/models", icon: Frame },
  { title: "Trained Modals", url: "/model-training", icon: Layers },
  { title: "My Images", url: "/gallery", icon: Images },
  { title: "Billing", url: "/billing", icon: CreditCard },
  { title: "Setting", url: "/account-settings", icon: Settings },
];
export function NavMain() {
  const pathname = usePathname();
  return (
    <SidebarGroup>
      <SidebarMenu>
        {navItems.map((item) => (
          <Link
            href={item.url}
            key={item.title}
            className={cn(
              "rounded-none",
              pathname === item.url
                ? "text-primary bg-primary/5"
                : "text-muted-foreground"
            )}
          >
            <SidebarMenuItem>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
