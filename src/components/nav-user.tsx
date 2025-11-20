import { useState } from "react";
import {
  BadgeCheck,
  ChevronsUpDown,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Check,
} from "lucide-react";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

import { useNavigate } from "react-router-dom";
import { useLogout } from "@/feature/auth/hooks/useLogout";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export function NavUser() {
  const authUser = useAuthStore((state) => state.user);

  // Vista para el UI con fallbacks
  const uiUser = {
    name: authUser?.nombreCompleto ?? "Usuario Habitora",
    email: authUser?.email ?? "sin-correo@habitora.app",
    avatar: "",
    initials:
      authUser?.nombreCompleto
        ?.split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "HB",
    role: "Propietario",
  };

  const [openLogout, setOpenLogout] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const {
    mutate: logout,
    isPending: isLoggingOut,
  } = useLogout({
    onSuccess: () => {
      toast.success("Sesión cerrada correctamente.");
      navigate("/auth");
    },
    onError: () => {
      toast.error("No se pudo cerrar la sesión. Intenta de nuevo.");
    },
  });

  const handleConfirmLogout = () => {
    if (isLoggingOut) return;
    setOpenLogout(false);
    logout();
  };

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size="lg"
                className="gap-3 data-[state=open]:bg-muted data-[state=open]:text-foreground"
              >
                <Avatar className="h-8 w-8">
                  {uiUser.avatar ? (
                    <AvatarImage src={uiUser.avatar} alt={uiUser.name} />
                  ) : null}
                  <AvatarFallback className="bg-gray-900 text-white text-xs font-semibold">
                    {uiUser.initials}
                  </AvatarFallback>
                </Avatar>

                {/* Texto: se oculta cuando el sidebar está colapsado */}
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-medium">{uiUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {uiUser.role}
                  </span>
                </div>

                <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="min-w-60 rounded-lg"
              side="right"
              align="end"
              sideOffset={4}
            >
              {/* Header del dropdown */}
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    {uiUser.avatar ? (
                      <AvatarImage src={uiUser.avatar} alt={uiUser.name} />
                    ) : null}
                    <AvatarFallback className="bg-gray-900 text-white text-xs font-semibold">
                      {uiUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{uiUser.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {uiUser.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              {/* Grupo Cuenta */}
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => setOpenProfile(true)}>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Cuenta
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {/* Apariencia / Tema */}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Apariencia</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  onClick={() => setTheme("light")}
                  className="gap-2"
                >
                  <Sun className="h-4 w-4" />
                  Claro
                  {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("dark")}
                  className="gap-2"
                >
                  <Moon className="h-4 w-4" />
                  Oscuro
                  {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setTheme("system")}
                  className="gap-2"
                >
                  <Laptop className="h-4 w-4" />
                  Sistema
                  {theme === "system" && (
                    <Check className="ml-auto h-4 w-4" />
                  )}
                </DropdownMenuItem>
              </DropdownMenuGroup>

              {/* Logout */}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setOpenLogout(true)}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      {/* Dialog de confirmación de logout */}
      <Dialog open={openLogout} onOpenChange={setOpenLogout}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Deseas cerrar sesión?</DialogTitle>
            <DialogDescription>
              Se cerrará tu sesión actual y regresarás al inicio de sesión.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenLogout(false)}
              disabled={isLoggingOut}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Cerrando..." : "Cerrar sesión"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de perfil */}
      <Dialog open={openProfile} onOpenChange={setOpenProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Perfil de usuario</DialogTitle>
            <DialogDescription>
              Consulta tus datos de cuenta.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4 py-2">
            <Avatar className="w-16 h-16">
              {uiUser.avatar ? (
                <AvatarImage src={uiUser.avatar} alt={uiUser.name} />
              ) : null}
              <AvatarFallback className="bg-gray-900 text-white text-lg font-semibold">
                {uiUser.initials}
              </AvatarFallback>
            </Avatar>

            <div className="text-center space-y-1">
              <div className="font-bold text-lg">{uiUser.name}</div>
              <div className="text-sm text-muted-foreground">
                {uiUser.email}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setOpenProfile(false)}>Cerrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
