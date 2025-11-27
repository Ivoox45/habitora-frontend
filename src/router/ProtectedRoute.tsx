// src/router/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  // NO validar en el backend aquí - el AuthBootstrap ya lo hizo
  // Si llega un 401 en cualquier petición, el interceptor de axios maneja el logout automático
  
  if (!isAuthenticated) {
    // Redirigir al login si no está autenticado
    return <Navigate to="/auth" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
