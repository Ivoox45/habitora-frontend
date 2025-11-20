// src/feature/auth/hooks/useLogout.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { logoutRequest } from "../api/auth";
import type { AuthMessageResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";

type UseLogoutOptions = {
  onSuccess?: (data: AuthMessageResponse) => void;
  onError?: (error: unknown) => void;
};

export const useLogout = (options?: UseLogoutOptions) => {
  const clearAuth = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  return useMutation<AuthMessageResponse, unknown, void>({
    mutationFn: logoutRequest,
    onSuccess: (data) => {
      clearAuth();

      queryClient.removeQueries({
        queryKey: ["usuario-propiedades-simple"],
        exact: true,
      });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
