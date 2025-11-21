// src/feature/contracts/hooks/useFinalizeContract.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { finalizarContrato } from "../api/contracts";
import type { ContratoDetalle } from "../types";

type Variables = { contractId: number };

type MutationOptions = UseMutationOptions<
  ContratoDetalle,
  Error,
  Variables,
  unknown
>;

export const useFinalizeContract = (
  propertyId: number,
  options?: MutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation<ContratoDetalle, Error, Variables, unknown>({
    mutationFn: ({ contractId }) =>
      finalizarContrato(propertyId, contractId),

    onSuccess: (...args) => {
      const [data] = args as [ContratoDetalle, Variables, unknown];

      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["contracts", "detail", propertyId, data.id],
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
