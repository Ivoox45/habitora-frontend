// src/router/layout.tsx
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Layout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="h-screen flex flex-col bg-background">

          <header className="flex h-14 items-center gap-2 border-b px-4 shrink-0">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold">
              Panel Habitora
            </h1>
          </header>

          <section className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </section>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
