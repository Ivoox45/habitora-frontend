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
  base64: string; // can be full dataURL or clean base64
};

type MutationOptions = UseMutationOptions<
  ContratoDetalle,
  Error,
  Variables,
  unknown
>;

export const useUploadContractSignature = (
  propertyId: number,
  options?: MutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation<ContratoDetalle, Error, Variables, unknown>({
    mutationFn: ({ contractId, base64 }) =>
      subirFirmaContrato(propertyId, contractId, base64),

    onSuccess: (...args) => {
      const [data] = args as [ContratoDetalle, Variables, unknown];

      // Refresh detail + list
      queryClient.invalidateQueries({
        queryKey: ["contracts", "detail", propertyId, data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      options?.onSuccess?.(
        ...(args as Parameters<NonNullable<typeof options.onSuccess>>)
      );
    },

    onError: (...args) => {
      options?.onError?.(
        ...(args as Parameters<NonNullable<typeof options.onError>>)
      );
    },

    onSettled: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      options?.onSettled?.(
        ...(args as Parameters<NonNullable<typeof options.onSettled>>)
      );
    },

    ...(options ?? {}),
  });
};
