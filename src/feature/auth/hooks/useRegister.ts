// src/feature/auth/hooks/useRegister.ts
import { useMutation } from "@tanstack/react-query";
import { registerRequest } from "../api/auth";
import type { RegisterRequest, AuthMessageResponse } from "../types";
import { useAuthStore } from "@/store/useAuthStore";

type UseRegisterOptions = {
  onSuccess?: (data: AuthMessageResponse) => void;
  onError?: (error: unknown) => void;
};

export const useRegister = (options?: UseRegisterOptions) => {
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation<AuthMessageResponse, unknown, RegisterRequest>({
    mutationFn: registerRequest,
    onSuccess: (data, payload) => {
      const { nombreCompleto, email, telefonoWhatsapp } = payload;

      setUser({
        nombreCompleto,
        email,
        telefonoWhatsapp,
      });

      options?.onSuccess?.(data);
    },
    onError: (error) => {
      options?.onError?.(error);
    },
  });
};
