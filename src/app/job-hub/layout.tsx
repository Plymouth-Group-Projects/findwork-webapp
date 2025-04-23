import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Job Hub",
  description: "Find and manage job opportunities",
};

export default function JobHubLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <SidebarProvider className="mt-[-20px]">
        <SidebarTrigger className="lg:hidden fixed flex top-[80px] left-4 z-30 bg-light text-white p-2 rounded-md" />
        <main className="w-full">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}