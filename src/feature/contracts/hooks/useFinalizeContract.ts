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

    onSuccess: (data) => {

      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["contracts", "detail", propertyId, data.id],
      });

      // Al finalizar, la habitación vuelve a estar disponible
      queryClient.invalidateQueries({
        queryKey: ["contracts", "available-rooms", propertyId],
      });

      // El inquilino vuelve a estar disponible para nuevos contratos
      queryClient.invalidateQueries({
        queryKey: ["contracts", "tenants-by-property", propertyId],
      });

      // Invalidar facturas ya que se cancelaron las pendientes
      queryClient.invalidateQueries({
        queryKey: ["facturas", propertyId],
      });

      // user-provided onSuccess will be handled by mutation spread below if needed
    },

    onError: () => {},

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["contracts", "by-property", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["contracts", "available-rooms", propertyId],
      });

      queryClient.invalidateQueries({
        queryKey: ["contracts", "tenants-by-property", propertyId],
      });

      // Invalidar facturas
      queryClient.invalidateQueries({
        queryKey: ["facturas", propertyId],
      });

      // user-provided onSettled will be handled by mutation spread below if needed
    },

    ...(options ?? {}),
  });
};
