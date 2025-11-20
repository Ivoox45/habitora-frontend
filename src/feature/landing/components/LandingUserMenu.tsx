// src/feature/landing/components/LandingUserMenu.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Sun, Moon, Laptop, Check } from "lucide-react";

import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/feature/auth/hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/components/theme-provider";
import { toast } from "sonner";

export function LandingUserMenu() {
  const authUser = useAuthStore((state) => state.user);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme(); // 👈 NECESARIO!!

  const { mutate: logout } = useLogout({
    onSuccess: () => {
      toast.success("Sesión cerrada correctamente.");
      navigate("/auth");
    },
  });

  const uiUser = {
    name: authUser?.nombreCompleto ?? "Usuario Habitora",
    avatar: "",
    initials:
      authUser?.nombreCompleto
        ?.split(" ")
        .map((p) => p[0])
        .slice(0, 2)
        .join("")
        .toUpperCase() ?? "HB",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer">
        <Avatar className="h-8 w-8">
          {uiUser.avatar ? (
            <AvatarImage src={uiUser.avatar} alt={uiUser.name} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              {uiUser.initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-medium text-foreground">
          Hola, {uiUser.name.split(" ")[0]}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* PANEL */}
        <DropdownMenuItem onClick={() => navigate("/start")}>
          <LayoutDashboard className="h-4 w-4 mr-2" />
          Ir al panel
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* APARIENCIA */}
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Apariencia
        </DropdownMenuLabel>

        <DropdownMenuItem onClick={() => setTheme("light")} className="flex items-center gap-2">
          <Sun className="h-4 w-4" />
          Claro
          {theme === "light" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("dark")} className="flex items-center gap-2">
          <Moon className="h-4 w-4" />
          Oscuro
          {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setTheme("system")} className="flex items-center gap-2">
          <Laptop className="h-4 w-4" />
          Sistema
          {theme === "system" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* LOGOUT */}
        <DropdownMenuItem onClick={() => logout()}>
          <LogOut className="h-4 w-4 mr-2" />
          Cerrar sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
