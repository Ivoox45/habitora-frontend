// src/feature/contracts/hooks/useUploadContractSignature.ts

import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";

import { subirFirmaContrato } from "../api/contracts";
import type { ContratoDetalle } from "../types";

type Variables = {
  contractId: number;
  base64: string;
};

// Mutation result = ContratoDetalle
// Mutation error = Error
// Mutation variables = Variables
// Mutation context = unknown
type MutationOpts = UseMutationOptions<
  ContratoDetalle,
  Error,
  Variables,
  unknown
>;

export const useUploadContractSignature = (
  propertyId: number,
  options?: MutationOpts
) => {
  const queryClient = useQueryClient();

  return useMutation<ContratoDetalle, Error, Variables, unknown>({
    // -------------------------------------------------------
    // MUTATION FN
    // -------------------------------------------------------
    mutationFn: ({ contractId, base64 }) =>
      subirFirmaContrato(propertyId, contractId, base64),

    // -------------------------------------------------------
    // ON SUCCESS
    // -------------------------------------------------------
    onSuccess: (...args) => {
      const [data] = args;
      
      // Invalidar el detalle específico del contrato
      queryClient.invalidateQueries({
        queryKey: ["contracts", "detail", propertyId, data.id],
      });

      // Invalidar la firma del contrato
      queryClient.invalidateQueries({
        queryKey: ["contracts", "signature", propertyId, data.id],
      });

      // Invalidar TODAS las listas de contratos de esta propiedad 
      // (incluye todas las combinaciones de filtros)
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      // ejecutar callback del usuario
      // @ts-ignore
      options?.onSuccess?.(...args);
    },

    // -------------------------------------------------------
    // ON ERROR
    // -------------------------------------------------------
    onError: (...args) => {
      // @ts-ignore
      options?.onError?.(...args);
    },

    // -------------------------------------------------------
    // ON SETTLED
    // -------------------------------------------------------
    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      // @ts-ignore
      options?.onSettled?.(...args);
    },

    // Spread del resto de opciones, EXCLUYENDO los callbacks para evitar override
    ...((({ onSuccess, onError, onSettled, ...rest }) => rest)(options || {})),
  });
};
