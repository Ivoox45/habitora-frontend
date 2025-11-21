// src/feature/tenants/hooks/useTenantById.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getTenantById } from "../api/tenants";
import type { Tenant } from "../types";

export function useTenantById(
  propiedadId: number | undefined,
  tenantId: number | undefined
): UseQueryResult<Tenant> {
  return useQuery({
    queryKey: ["tenant", propiedadId, tenantId],
    enabled: !!propiedadId && !!tenantId,
    queryFn: () => getTenantById(propiedadId as number, tenantId as number),
  });
}
