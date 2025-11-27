// src/feature/contracts/hooks/useContractById.ts
import { useQuery } from "@tanstack/react-query";
import { getContractById } from "../api/contracts";
import type { ContratoDetalle } from "../types";

export const useContractById = (
  propertyId: number | null | undefined,
  contractId: number | null | undefined,
  enabled: boolean = true
) => {
  return useQuery<ContratoDetalle, Error>({
    queryKey: ["contracts", "detail", propertyId, contractId],
    enabled:
      enabled && !!propertyId && propertyId > 0 && !!contractId && contractId > 0,
    queryFn: () =>
      getContractById(propertyId as number, contractId as number),
    staleTime: 1000 * 30, // 30 segundos
  });
};
