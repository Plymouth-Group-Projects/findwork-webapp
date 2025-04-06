import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";
import { Bebas_Neue, Lato } from "next/font/google";
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
            <SidebarTrigger className="ps-6 pe-5 text-darkest z-30"/>
            <AppSidebar />
            <main>
                {children}
            </main>
        </SidebarProvider>
    </div>
  );
}
