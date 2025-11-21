// src/feature/tenants/hooks/useDeleteTenant.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenant } from "../api/tenants";

type SimpleOptions = {
  onSuccess?: () => void;
  onError?: () => void;
};

export function useDeleteTenant(
  propiedadId: number,
  tenantId: number,
  options?: SimpleOptions
) {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, void>({
    mutationFn: () => deleteTenant(propiedadId, tenantId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tenants", propiedadId] });
      options?.onSuccess?.();
    },
    onError: () => {
      options?.onError?.();
    },
  });
}
