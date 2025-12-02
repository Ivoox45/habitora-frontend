import { useQuery } from "@tanstack/react-query";
import { getTenantById } from "../../api/tenants.api";

export function useTenantByIdQuery(propiedadId?: number, tenantId?: number) {
    return useQuery({
        queryKey: ["tenant", propiedadId, tenantId],
        enabled: !!propiedadId && !!tenantId,
        queryFn: () => getTenantById(propiedadId!, tenantId!),
    });
}
