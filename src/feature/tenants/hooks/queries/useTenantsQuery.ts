import { useQuery } from "@tanstack/react-query";
import { getTenantsByProperty } from "../../api/tenants.api";

export function useTenantsQuery(propiedadId: number) {
    return useQuery({
        queryKey: ["tenants", propiedadId],
        queryFn: () => getTenantsByProperty(propiedadId),
        enabled: !!propiedadId,
    });
}
