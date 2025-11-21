// src/feature/tenants/hooks/useSearchTenants.ts
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { searchTenants } from "../api/tenants";
import type { Tenant } from "../types";

export function useSearchTenants(
  propiedadId: number | undefined,
  query: string
): UseQueryResult<Tenant[]> {
  const trimmed = query.trim();

  return useQuery({
    queryKey: ["tenants-search", propiedadId, trimmed],
    enabled: !!propiedadId && trimmed.length > 0,
    queryFn: () => searchTenants(propiedadId as number, trimmed),
  });
}
