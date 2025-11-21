// src/feature/contracts/hooks/useTenantsByProperty.ts
import { useQuery } from "@tanstack/react-query";
import { getTenantsByProperty } from "../api/contracts";
import type { Tenant, TenantsFilters } from "../types";

export const useTenantsByProperty = (
  propertyId: number | null | undefined,
  filters?: TenantsFilters
) => {
  return useQuery<Tenant[]>({
    queryKey: [
      "contracts",
      "tenants-by-property",
      propertyId,
      filters?.disponibles ?? null,
      filters?.query ?? null,
    ],
    enabled: !!propertyId && propertyId > 0,
    queryFn: () =>
      getTenantsByProperty(propertyId as number, {
        disponibles: filters?.disponibles,
        query: filters?.query,
      }),
  });
};
