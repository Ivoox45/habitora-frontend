// src/feature/landing/components/HeroSection.tsx
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";

export function HeroSection() {
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

  const handlePrimaryClick = () => {
    if (isAuthenticated) {
      goToAppOrStart();
    } else {
      // CTA principal → registro
      navigate("/auth", { state: { mode: "register" } });
    }
  };

  const handleSecondaryClick = () => {
    if (isAuthenticated) {
      goToAppOrStart();
    } else {
      navigate("/auth", { state: { mode: "login" } });
    }
  };

  return (
    <section className="pt-16 pb-12 text-center">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
          Administra tus propiedades
          <br />
          y arrendamientos fácilmente
        </h1>

        <p className="text-base md:text-lg text-gray-600 mb-8">
          La plataforma completa para arrendadores de habitaciones y mini-departamentos.
          Gestiona inquilinos, contratos, pagos y recordatorios desde un solo lugar.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            className="px-6 py-3 rounded-full text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition"
            onClick={handlePrimaryClick}
          >
            Comenzar gratis
          </button>
          <button
            className="px-6 py-3 rounded-full text-sm font-medium border border-gray-300 text-gray-800 bg-white hover:bg-gray-100 transition"
            onClick={handleSecondaryClick}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </section>
  );
}
