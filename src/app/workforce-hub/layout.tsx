import Footer from "@/components/footer";
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
    <div className="relative">
      <SidebarProvider className="mt-[-25px]">
        <SidebarTrigger className="lg:hidden fixed flex top-[80px] left-4 z-30 bg-light text-white p-2 rounded-md" />
        <main className="w-full">
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}