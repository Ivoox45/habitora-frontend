// src/components/app-sidebar.tsx  (o app-sidebar.jsx si lo tienes así)
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { CurrentPropertySwitcher } from "@/components/current-property-switcher";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

export function AppSidebar() {
  const currentPropertyName = useCurrentPropertyStore(
    (s) => s.currentPropertyName
  );

  return (
    <Sidebar collapsible="icon" className="group border-r">
      <SidebarHeader className="px-4">
        <div
          className="
            flex h-12 items-center justify-between
            group-data-[collapsible=icon]:justify-center
          "
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-gray-900 flex items-center justify-center">
              <span className="text-white text-lg font-bold select-none">
                H
              </span>
            </div>

            <span className="text-sm font-semibold tracking-wide text-foreground group-data-[collapsible=icon]:hidden">
              Habitora
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0">
        {/* Solo mostramos el switcher si hay propiedad seleccionada */}
        {currentPropertyName && (
          <CurrentPropertySwitcher name={currentPropertyName} />
        )}

        <NavProjects />
      </SidebarContent>

      <SidebarFooter className="mt-auto border-t p-2 group-data-[collapsible=icon]:p-2">
        <div className="pt-2">
          <NavUser />
        </div>
      </SidebarFooter>

      <SidebarRail topClass="top-9" />
    </Sidebar>
  );
}
