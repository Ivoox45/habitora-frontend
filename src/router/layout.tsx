// src/router/layout.tsx

import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

import Spinner from "@/components/spinner";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { useCurrentPropertyStore } from "@/store/useCurrentPropertyStore";
import { useAuthStore } from "@/store/useAuthStore";
import { usePropiedadById } from "@/feature/properties/hooks/usePropiedadById";

export default function Layout() {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const token = useAuthStore((s) => s.token);

  const { currentPropertyId, setCurrentProperty, clearCurrentProperty } =
    useCurrentPropertyStore();

  // 1️⃣ Convertimos el param a número
  const numericId = propertyId ? Number(propertyId) : null;
  const isInvalidParam =
    !propertyId || numericId === null || Number.isNaN(numericId);

  // Si el param no existe o no es número válido → mandamos a /start
  useEffect(() => {
    if (isInvalidParam) {
      clearCurrentProperty();
      navigate("/start");
    }
  }, [isInvalidParam, clearCurrentProperty, navigate]);

  // 2️⃣ Preguntamos al backend si esa propiedad existe y es del usuario
  // Pero SOLO si ya tenemos token (evita 403 en reload mientras AuthBootstrap renueva)
  const shouldFetch = !isInvalidParam && numericId !== null && !!token;
  const { data, isLoading, isError } = usePropiedadById(
    shouldFetch ? numericId : null
  );

  useEffect(() => {
    if (!numericId || isInvalidParam) return;

    if (isError) {
      // El backend devolvió 404 → propiedad no existe / no es del usuario
      clearCurrentProperty();
      navigate("/start");
      return;
    }

    if (data && currentPropertyId !== numericId) {
      // Sincronizamos el store con lo que dice el backend
      setCurrentProperty(data.id, data.nombre);
    }
  }, [
    numericId,
    isInvalidParam,
    isError,
    data,
    currentPropertyId,
    setCurrentProperty,
    clearCurrentProperty,
    navigate,
  ]);

  // Mostrar spinner mientras:
  // - El parámetro es inválido (se redirigirá)
  // - No hay token todavía (AuthBootstrap renovando)
  // - El query está cargando
  // - Hubo error (se redirigirá)
  if (isInvalidParam || !token || isLoading || isError) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <main className="h-screen flex flex-col bg-background">
          <header className="flex h-14 items-center gap-2 border-b px-4 shrink-0">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-lg font-semibold">Panel Habitora</h1>
          </header>

          <section className="flex-1 overflow-y-auto p-4">
            <Outlet />
          </section>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
