// src/feature/contracts/hooks/useCreateContract.ts
import {
  useMutation,
  useQueryClient,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { crearContrato } from "../api/contracts";
import type { ContratoDetalle, CrearContratoPayload } from "../types";

type MutationOptions = UseMutationOptions<
  ContratoDetalle,
  Error,
  CrearContratoPayload,
  unknown
>;

export const useCreateContract = (
  propertyId: number,
  options?: MutationOptions
) => {
  const queryClient = useQueryClient();

  return useMutation<ContratoDetalle, Error, CrearContratoPayload, unknown>({
    mutationFn: (payload) => crearContrato(propertyId, payload),

    onSuccess: (...args) => {
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
