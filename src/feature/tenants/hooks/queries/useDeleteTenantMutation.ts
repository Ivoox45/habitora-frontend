import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTenant } from "../../api/tenants.api";

export function useDeleteTenantMutation(
    propiedadId: number,
    tenantId: number,
    options?: { onSuccess?: () => void; onError?: () => void }
) {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: () => deleteTenant(propiedadId, tenantId),

        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["tenants", propiedadId] });
            options?.onSuccess?.();
        },

        onError: () => options?.onError?.(),
    });
}
