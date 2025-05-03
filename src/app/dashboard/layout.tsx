import { getServerSession } from 'next-auth/next';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import { DashboardSidebar } from '@/components/dashboard-sidebar';
import { authOptions } from '@/lib/auth';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Dashboard",
  description: "Find and manage job opportunities",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the user session for the sidebar
  const session = await getServerSession(authOptions);

  return (
    <div className="relative">
      <SidebarProvider className="mt-[-20px]">
        {/* Render the DashboardSidebar here, passing the session */}
        <DashboardSidebar session={session} />
        <SidebarTrigger className="lg:hidden fixed flex top-[80px] left-4 z-30 bg-light text-white p-2 rounded-md" />
        <main className="w-full">
          {children}
        </main>
      </SidebarProvider>
      <Toaster/>
    </div>
  );
}