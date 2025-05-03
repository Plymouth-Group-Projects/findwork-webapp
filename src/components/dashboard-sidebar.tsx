'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Briefcase, 
  ClipboardCheck, 
  Users, 
  FileText,
  DollarSign, 
  Settings, 
  HelpCircle, 
  Bell,
  UserCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Session } from "next-auth"
import { LogoutButton } from "./auth/logout-button"

// Define proper props interface
interface DashboardSidebarProps {
  session?: Session | null
}

export function DashboardSidebar({ session }: DashboardSidebarProps) {
  // Using null as initial state to detect client-side rendering
  const [isMounted, setIsMounted] = useState(false)
  const pathname = usePathname()
  
  // Use session data if provided, otherwise use sample data
  const user = {
    name: session?.user?.name || "Guest User",
    email: session?.user?.email || "guest@example.com",
    avatar: session?.user?.image || "/avatars/user-placeholder.png",
    role: "Freelancer" // You might want to get this from session in the future
  }

  // Navigation items
  const navigationItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/job-listing", label: "Job Listings", icon: Briefcase, badge: "12" },
    { href: "/dashboard/jobs-applied", label: "Applications", icon: ClipboardCheck, badge: "3" },
    { href: "/dashboard/collaborations", label: "Collaborations", icon: Users },
    { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
    { href: "/dashboard/finance", label: "Finance", icon: DollarSign },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell, badge: "8" },
  ]

  const bottomNavItems = [
    { href: "/dashboard/profile", label: "Profile", icon: UserCircle },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
    { href: "/dashboard/help", label: "Help & Support", icon: HelpCircle },
  ]

  // Only render on the client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted (server render), return a simpler version or loading state
  if (!isMounted) {
    return (
      <Sidebar collapsible="icon" variant="sidebar" className="w-[80px] md:w-[250px] lg:w-[300px]">
        <SidebarContent className="pt-[60px]">
          <div className="p-4">Loading sidebar...</div>
        </SidebarContent>
      </Sidebar>
    )
  }

  return (
    <Sidebar 
      className="w-[80px] md:w-[250px] lg:w-[300px] border-r border-gray-200 dark:border-gray-800"
      collapsible={`${window.innerWidth < 1024 ? "icon" : "offcanvas"}`}
      variant="sidebar"
    >
      <SidebarContent className="flex flex-col pt-20 h-full">
        {/* Company Logo or Project Name */}
        <div className="px-6 py-5 flex items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-white">My Dashboard</span>
        </div>
        
        <SidebarGroup>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {/* Main Navigation Items */}
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.href} className="mb-1">
                  <Link 
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      pathname === item.href 
                        ? "bg-light/10 text-light" 
                        : "text-gray-600 hover:bg-light/10 hover:text-light dark:text-gray-300"
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                    {item.badge && (
                      <Badge 
                        className="ml-auto bg-light text-white group-data-[state=collapsed]:hidden"
                        variant="default"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Push the bottom items to the bottom */}
        <div className="mt-auto">
          <SidebarGroup>
            <SidebarGroupContent className="px-3">
              <SidebarMenu>
                {/* Settings and Help */}
                {bottomNavItems.map((item) => (
                  <SidebarMenuItem key={item.href} className="mb-1">
                    <Link 
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        pathname === item.href 
                          ? "bg-light/10 text-light" 
                          : "text-gray-600 hover:bg-light/10 hover:text-light dark:text-gray-300"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="group-data-[state=collapsed]:hidden">{item.label}</span>
                    </Link>
                  </SidebarMenuItem>
                ))}
                
                {/* User Profile and Logout */}
                <SidebarMenuItem>
                  <div className="py-4 pt-2 group-data-[state=collapsed]:hidden">
                    {/* Simple user profile display without dropdown */}
                    <div className="w-full flex items-center gap-3 px-3 py-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name || ""} />
                        <AvatarFallback className="bg-light text-white">
                          {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="text-sm font-medium text-darker">{user.name || "User"}</span>
                        <span className="text-xs text-gray-500">{user.role}</span>
                      </div>
                    </div>
                  </div>
                </SidebarMenuItem>
                
                {/* Logout Button */}
                <SidebarMenuItem className="mb-6 group-data-[state=collapsed]:hidden">
                  <LogoutButton/>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>
    </Sidebar>
  )
}
