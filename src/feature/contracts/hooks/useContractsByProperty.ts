// src/feature/contracts/hooks/useContractsByProperty.ts
import { useQuery } from "@tanstack/react-query";
import { getContratosByPropiedad } from "../api/contracts";
import type { ContratoListado, ContratosFilters } from "../types";

export const useContractsByProperty = (
  propertyId: number | null | undefined,
  filters?: ContratosFilters
) => {
  return useQuery<ContratoListado[], Error>({
    queryKey: [
      "contracts",
      "by-property",
      propertyId,
      filters?.estado ?? null,
      filters?.search ?? null,
    ],
    enabled: !!propertyId && propertyId > 0,
    queryFn: () =>
      getContratosByPropiedad(propertyId as number, {
        estado: filters?.estado,
        search: filters?.search,
      }),
  });
};
