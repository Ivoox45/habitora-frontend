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
    if (!isAuthenticated) return navigate("/auth");
    if (currentPropertyId) navigate("/app");
    else navigate("/start");
  };

  return (
    <section className="pt-16 pb-12 text-center text-foreground">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Administra tus propiedades
          <br /> y arrendamientos fácilmente
        </h1>

        <p className="text-base md:text-lg text-muted-foreground mb-8">
          La plataforma completa para arrendadores de habitaciones y mini-departamentos.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">

          {isAuthenticated ? (
            <button
              onClick={goToAppOrStart}
              className="px-6 py-3 rounded-full text-sm font-medium 
                         bg-primary text-primary-foreground hover:opacity-90 transition"
            >
              Ir al panel
            </button>
          ) : (
            <>
              <button
                onClick={() => navigate("/auth", { state: { mode: "register" } })}
                className="px-6 py-3 rounded-full text-sm font-medium 
                           bg-primary text-primary-foreground hover:opacity-90 transition"
              >
                Comenzar gratis
              </button>

              <button
                onClick={() => navigate("/auth", { state: { mode: "login" } })}
                className="px-6 py-3 rounded-full text-sm font-medium 
                           border border-border bg-background text-foreground 
                           hover:bg-muted transition"
              >
                Iniciar sesión
              </button>
            </>
          )}

        </div>
      </div>
    </section>
  );
}
