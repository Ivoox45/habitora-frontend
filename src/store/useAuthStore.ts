// src/store/useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "@/feature/auth/types";

type AuthState = {
  user: AuthUser | null;
  isAuthenticated: boolean;

  // acciones
  setUser: (user: AuthUser) => void;
  setUserId: (id: number) => void;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

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

      // Cerrar sesión correctamente
      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "habitora-auth", // clave del localStorage
      version: 1,
    }
  )
);
