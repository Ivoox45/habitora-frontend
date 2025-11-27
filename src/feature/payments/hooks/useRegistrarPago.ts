// src/feature/payments/hooks/useRegistrarPago.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registrarPago } from "../api/payments";
import type { PagoCreateRequest } from "../types";
import { toast } from "sonner";

interface RegistrarPagoParams {
  propiedadId: number;
  facturaId: number;
  request: PagoCreateRequest;
}

export const useRegistrarPago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ propiedadId, facturaId, request }: RegistrarPagoParams) =>
      registrarPago(propiedadId, facturaId, request),
    onSuccess: () => {
      toast.success("Pago registrado exitosamente");
      // Invalidar queries para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
    },
    onError: (error: any) => {
      console.error("Error registrando pago:", error);
      toast.error(error?.response?.data?.message || "Error al registrar el pago");
    },
  });
};
