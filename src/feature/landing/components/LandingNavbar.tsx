// src/feature/landing/components/LandingNavbar.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { LandingUserMenu } from "./LandingUserMenu"; // menú del usuario

export function LandingNavbar() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currentPropertyId = useCurrentPropertyStore(
    (state) => state.currentPropertyId
  );

  const goToAppOrStart = () => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }

    if (currentPropertyId) {
      navigate("/app");
    } else {
      navigate("/start");
    }
  };

  const handleLoginClick = () => {
    if (isAuthenticated) goToAppOrStart();
    else navigate("/auth", { state: { mode: "login" } });
  };

  const handleRegisterClick = () => {
    if (isAuthenticated) goToAppOrStart();
    else navigate("/auth", { state: { mode: "register" } });
  };

  return (
    <header className="border-b bg-background border-border">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* Logo + Nombre */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => navigate("/")}
        >
          <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-lg font-bold">H</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-foreground">
            Habitora
          </span>
        </div>

        {/* Acciones */}
        {isAuthenticated ? (
          <LandingUserMenu />
        ) : (
          <nav className="flex items-center gap-3 select-none">
            <button
              className="text-sm text-foreground hover:opacity-80 cursor-pointer"
              onClick={handleLoginClick}
            >
              Iniciar sesión
            </button>

            <button
              className="text-sm font-medium bg-primary text-primary-foreground 
                         px-4 py-2 rounded-full hover:opacity-90 transition cursor-pointer"
              onClick={handleRegisterClick}
            >
              Registrarme
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
