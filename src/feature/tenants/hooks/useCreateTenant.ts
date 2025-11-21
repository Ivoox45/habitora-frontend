// src/feature/tenants/hooks/useCreateTenant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTenant } from "../api/tenants";
import type { CreateTenantPayload, Tenant } from "../types";

type SimpleOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useCreateTenant(
  propiedadId: number,
  options?: SimpleOptions
) {
  const queryClient = useQueryClient();

  return useMutation<Tenant, unknown, CreateTenantPayload>({
    mutationFn: (payload) => createTenant(propiedadId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants", propiedadId] });
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
}
