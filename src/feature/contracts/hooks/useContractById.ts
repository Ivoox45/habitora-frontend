// src/feature/contracts/hooks/useContractById.ts
import { useQuery } from "@tanstack/react-query";
import { getContratoById } from "../api/contracts";
import type { ContratoDetalle } from "../types";

export const useContractById = (
  propertyId: number | null | undefined,
  contractId: number | null | undefined
) => {
  return useQuery<ContratoDetalle, Error>({
    queryKey: ["contracts", "detail", propertyId, contractId],
    enabled:
      !!propertyId && propertyId > 0 && !!contractId && contractId > 0,
    queryFn: () =>
      getContratoById(propertyId as number, contractId as number),
  });
};
