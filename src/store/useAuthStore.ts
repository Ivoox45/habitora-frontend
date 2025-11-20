// src/store/useAuthStore.ts
import { create } from "zustand";
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

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // Se usa cuando ya tienes todos los datos básicos del usuario
  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  // 👇 Actualiza solo el id del usuario (por ejemplo, después de checkTienePropiedades)
  setUserId: (id) =>
    set((state) => {
      if (!state.user) {
        // Si aún no hay user, no cambiamos nada
        return state;
      }

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

  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));
