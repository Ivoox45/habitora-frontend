// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/feature/auth/types";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;

  // acciones
  setUser: (user: AuthUser) => void;
  setUserId: (id: number) => void;
  setAuthenticated: (value: boolean) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      token: null,

      // Guardar toda la info del usuario y marcarlo como autenticado
      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      // Actualizar el ID del usuario sin perder los demás datos
      setUserId: (id) =>
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              id,
            },
            isAuthenticated: true,
          };
        }),

      setAuthenticated: (value) =>
        set((state) => ({
          ...state,
          isAuthenticated: value,
        })),

      setToken: (token) =>
        set((state) => ({
          ...state,
          token,
        })),

      // Cerrar sesión correctamente
      logout: () => {
        // Limpiar última actividad
        try {
          localStorage.removeItem("habitora-last-activity");
          localStorage.removeItem("habitora-last-route");
        } catch {}
        
        set({
          user: null,
          isAuthenticated: false,
          token: null,
        });
      },
    }),
    {
      name: "habitora-auth", // clave del localStorage
      version: 2, // Incrementar versión para limpiar cache viejo
      // Solo persistir user e isAuthenticated, NO el token
      // El token se maneja en memoria y se renueva con refresh token
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // token NO se persiste → solo en memoria por seguridad
      }),
    }
  )
);
