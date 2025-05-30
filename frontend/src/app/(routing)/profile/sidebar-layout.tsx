"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLogout } from "@/hooks/user-hooks";
import { useLocalUserPicture, useUserStore } from "@/store/user-store";

import {
  Calendar,
  CircleDotDashed,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Menu items.
export const profileLinks = [
  {
    title: "Diaries",
    url: "/profile/diaries",
    icon: CircleDotDashed,
  },
  {
    title: "Settings",
    url: "/profile/settings",
    icon: Settings,
  },
];

export function SidebarProfileLayout({ children }: React.PropsWithChildren) {
  const picture = useLocalUserPicture();
  const pathname = usePathname();

  function pathnameCheck(url: string) {
    return pathname.startsWith(url);
  }

  return (
    <SidebarProvider className="grid h-full min-h-0 grid-cols-1 overflow-hidden rounded-3xl md:grid-cols-[auto_1fr]">
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="relative h-full min-h-[50vh]"
      >
        <SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem className="flex items-center gap-4 overflow-hidden">
                  <Avatar className="h-4 w-4">
                    <AvatarImage src={picture}></AvatarImage>
                  </Avatar>
                  Profile
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {profileLinks.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={pathnameCheck(item.url)}
                      asChild
                    >
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="glass grid !w-full grid-rows-[auto_1fr] bg-transparent">
        <div>
          <SidebarTrigger className="p-6" />
        </div>
        <main className="min-h-full w-full">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
