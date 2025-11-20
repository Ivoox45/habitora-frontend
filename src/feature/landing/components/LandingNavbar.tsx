// src/feature/landing/components/LandingNavbar.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

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
    if (isAuthenticated) {
      goToAppOrStart();
    } else {
      navigate("/auth", { state: { mode: "login" } });
    }
  };

  const handleRegisterClick = () => {
    if (isAuthenticated) {
      goToAppOrStart();
    } else {
      navigate("/auth", { state: { mode: "register" } });
    }
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + nombre */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={goToAppOrStart}>
          <div className="h-8 w-8 rounded-md bg-gray-900 flex items-center justify-center">
            <span className="text-white text-lg font-bold">H</span>
          </div>
          <span className="font-semibold text-lg tracking-tight text-gray-900">
            Habitora
          </span>
        </div>

        {/* Acciones */}
        <nav className="flex items-center gap-3">
          <button
            className="text-sm text-gray-700 hover:text-gray-900"
            onClick={handleLoginClick}
          >
            Iniciar sesión
          </button>
          <button
            className="text-sm font-medium bg-gray-900 text-white px-4 py-2 rounded-full hover:bg-gray-800 transition"
            onClick={handleRegisterClick}
          >
            Registrarme
          </button>
        </nav>
      </div>
    </header>
  );
}
