import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LayoutDashboardIcon, ChartBarIcon, FolderIcon, CircleHelpIcon, SearchIcon } from "lucide-react"
import { Link } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"
import logo from "@/assets/logo.png"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: (
        <LayoutDashboardIcon />
      ),
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: (
        <ChartBarIcon />
      ),
    },
    {
      title: "Subscriptions",
      url: "/subscriptions",
      icon: (
        <FolderIcon />
      ),
    },
  ],
  navSecondary: [
    {
      title: "Get Help",
      url: "https://github.com/desarus0/Subscription-Manager/issues",
      icon: (
        <CircleHelpIcon />
      ),
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  const { user } = useUser()

  const clerkUser = {
    name: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() || 'User',
    email: user?.primaryEmailAddress?.emailAddress ?? '',
    avatar: user?.imageUrl ?? '',
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-auto! data-[slot=sidebar-menu-button]:p-3!">
              <Link to="/">
                <img src={logo} className="size-12" alt="Recur logo" />
                <span className="text-3xl font-semibold">Recur</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={clerkUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
