// src/feature/tenants/hooks/useUpdateTenant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTenant } from "../api/tenants";
import type { UpdateTenantPayload, Tenant } from "../types";

type SimpleOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useUpdateTenant(
  propiedadId: number,
  tenantId: number,
  options?: SimpleOptions
) {
  const queryClient = useQueryClient();

  return useMutation<Tenant, unknown, UpdateTenantPayload>({
    mutationFn: (payload) => updateTenant(propiedadId, tenantId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants", propiedadId] });
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
}
