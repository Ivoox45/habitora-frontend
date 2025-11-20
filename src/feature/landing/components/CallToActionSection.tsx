// src/feature/landing/components/CallToActionSection.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

export function CallToActionSection() {
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

  const handleClick = () => {
    if (isAuthenticated) {
      goToAppOrStart();
    } else {
      navigate("/auth", { state: { mode: "register" } });
    }
  };

  return (
    <section className="mt-16 text-center">
      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        Comienza a gestionar tus propiedades hoy
      </h2>
      <p className="text-gray-600 mb-6">
        Únete a cientos de arrendadores que ya confían en Habitora.
      </p>
      <button
        className="px-6 py-3 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition"
        onClick={handleClick}
      >
        Crear cuenta gratis
      </button>
    </section>
  );
}
