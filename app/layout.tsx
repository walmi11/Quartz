import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import SidebarClientWrapper from "@/components/SidebarClientWrapper";

export const metadata: Metadata = {
  title: "Quartz",
  description: "The most powerful environment ever built for your courses",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-[hsl(var(--background))] text-[hsl(var(--foreground))] antialiased h-screen flex overflow-hidden custom-scrollbar">
        <SidebarClientWrapper>
          <Sidebar />
        </SidebarClientWrapper>
        <main className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10">
          {children}
        </main>
      </body>
    </html>
  );
}