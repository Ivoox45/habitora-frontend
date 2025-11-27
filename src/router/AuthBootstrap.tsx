// src/router/AuthBootstrap.tsx
import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axiosInstance from "@/lib/axios";

/**
 * Runs once on app start to validate persisted auth state.
 * - If token/user exist but backend says 401/404, clears session
 * - If backend unreachable (network error), keeps session (offline-friendly)
 */
// Bandera global para evitar múltiples ejecuciones simultáneas
let isBootstrapping = false;

export default function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      // Evitar ejecución múltiple
      if (isBootstrapping) {
        console.log("[AuthBootstrap] Ya se está ejecutando, saltando...");
        setReady(true);
        return;
      }
      
      isBootstrapping = true;
      console.log("[AuthBootstrap] Iniciando validación de sesión...");
      
      // Inactivity auto-logout: 7 days
      try {
        const last = Number(localStorage.getItem("habitora-last-activity")) || 0;
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        if (last && Date.now() - last > sevenDaysMs) {
          console.log("[AuthBootstrap] Sesión expirada por inactividad (7 días)");
          localStorage.removeItem("habitora-auth");
          localStorage.removeItem("habitora-current-property");
          localStorage.removeItem("habitora-last-activity");
          localStorage.removeItem("habitora-last-route");
          logout();
          setReady(true);
          isBootstrapping = false;
          return;
        }
      } catch {}

      // No auth persisted → ready
      if (!isAuthenticated || !user?.id) {
        setReady(true);
        isBootstrapping = false;
        return;
      }

      // Validar que el ID del usuario es válido (número)
      if (typeof user.id !== "number" || isNaN(user.id)) {
        console.warn("ID de usuario corrupto, limpiando sesión...");
        try {
          localStorage.removeItem("habitora-auth");
          localStorage.removeItem("habitora-current-property");
        } catch {}
        logout();
        setReady(true);
        isBootstrapping = false;
        return;
      }

      // Si hay usuario pero no token en memoria, intentar renovar con refresh token
      let currentToken = useAuthStore.getState().token;
      
      if (!currentToken) {
        console.log("[AuthBootstrap] No hay token, intentando renovar...");
        try {
          // Intentar renovar el access token con el refresh token (en cookie)
          const response = await axiosInstance.post("/api/auth/refresh", null, {
            headers: { "X-CSRF-Token": "bootstrap-refresh" },
          });
          const newAccessToken = response.data.accessToken;
          useAuthStore.getState().setToken(newAccessToken);
          currentToken = newAccessToken; // Guardar para usar inmediatamente
          console.log("[AuthBootstrap] Token renovado exitosamente");
        } catch (err: any) {
          // Si falla el refresh, hacer logout
          console.warn("[AuthBootstrap] No se pudo renovar token, redirigiendo al login");
          try {
            localStorage.removeItem("habitora-auth");
            localStorage.removeItem("habitora-current-property");
          } catch {}
          logout();
          setReady(true);
          isBootstrapping = false;
          return;
        }
      }

      // Validar que el usuario existe y recargar sus datos actualizados
      try {
        console.log("[AuthBootstrap] Validando usuario con ID:", user.id);
        // Agregar el token explícitamente para asegurar que se envíe
        const response = await axiosInstance.get(`/api/usuarios/${user.id}`, {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        const usuarioActualizado = response.data;
        console.log("[AuthBootstrap] Usuario validado:", usuarioActualizado.nombreCompleto);
        
        // Actualizar el usuario en el store con los datos más recientes
        useAuthStore.getState().setUser({
          id: usuarioActualizado.id,
          nombreCompleto: usuarioActualizado.nombreCompleto,
          email: usuarioActualizado.email,
          telefonoWhatsapp: usuarioActualizado.telefonoWhatsapp,
        });
        
        console.log("[AuthBootstrap] Sesión restaurada correctamente");
        setReady(true);
        isBootstrapping = false;
      } catch (err: any) {
        const status = err?.response?.status;
        // Only clear on known invalid session codes
        if (status === 401 || status === 403 || status === 404) {
          try {
            localStorage.removeItem("habitora-auth");
            localStorage.removeItem("habitora-current-property");
          } catch {}
          logout();
        }
        // Network/server errors → keep session, allow UI
        setReady(true);
        isBootstrapping = false;
      }
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null;
  return <>{children}</>;
}
