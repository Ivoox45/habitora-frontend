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
      // Refrescar listas relacionadas para que la UI se actualice sin recargar
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      // Inquilinos disponibles (al crear contrato, el inquilino deja de estar disponible)
      queryClient.invalidateQueries({
        queryKey: ["contracts", "tenants-by-property", propertyId],
      });

      // Habitaciones disponibles (la habitación pasa a OCUPADA)
      queryClient.invalidateQueries({
        queryKey: ["contracts", "available-rooms", propertyId],
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

      queryClient.invalidateQueries({
        queryKey: ["contracts", "tenants-by-property", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["contracts", "available-rooms", propertyId],
      });

      options?.onSettled?.(
        ...(args as Parameters<NonNullable<typeof options.onSettled>>)
      );
    },

    ...(options ?? {}),
  });
};
