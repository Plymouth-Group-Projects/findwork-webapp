import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";

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
    <div>
        <SidebarProvider >
        <SidebarTrigger className="px-[28px] py-5 mt-[99px] text-darker z-30"/>
            <main>
                {children}
            </main>
        </SidebarProvider>
    </div>
  );
}