import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { AppSidebar } from "@/components/workforcehub-sidebar";

export const metadata: Metadata = {
  title: "Workforce Hub",
  description: "Find and manage workforce opportunities",
};

export default function WorkforceHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="pt-[90px]">
        <SidebarProvider >
        <SidebarTrigger className="ps-6 pe-5 text-darker z-30"/>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-40">
            <div>
              <AppSidebar />
            </div>
            <main className="md:col-span-4">
                {children}
            </main>
          </div>
        </SidebarProvider>
    </div>
  );
}
