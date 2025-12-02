import { useQuery } from "@tanstack/react-query";
import { searchTenants } from "../../api/tenants.api";

export function useSearchTenantsQuery(propiedadId?: number, query: string = "") {
    const trimmed = query.trim();

    return useQuery({
        queryKey: ["tenants-search", propiedadId, trimmed],
        enabled: !!propiedadId && trimmed.length > 0,
        queryFn: () => searchTenants(propiedadId!, trimmed),
    });
}
