// src/layouts/Layout.tsx (o donde lo tengas)
import { Outlet } from "react-router-dom";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ThemeProvider } from "@/components/theme-provider";

export default function Layout() {
  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="habitora-intranet-theme"
    >
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset>
          <main className="min-h-screen bg-background">
            {/* Top bar */}
            <header className="flex h-14 items-center gap-2 border-b px-4">
              <SidebarTrigger className="md:hidden" />
              <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                Panel Habitora
              </h1>
            </header>

            {/* Contenido de la ruta actual (/app/...) */}
            <section className="p-4">
              <Outlet />
            </section>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
