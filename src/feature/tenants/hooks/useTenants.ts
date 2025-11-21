// src/feature/tenants/hooks/useTenants.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getTenantsByProperty } from "../api/tenants";
import type { Tenant } from "../types";

export function useTenants(
  propiedadId: number | undefined
): UseQueryResult<Tenant[]> {
  return useQuery({
    queryKey: ["tenants", propiedadId],
    enabled: !!propiedadId,
    queryFn: () => getTenantsByProperty(propiedadId as number),
  });
}
