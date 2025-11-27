// src/feature/payments/hooks/useFacturas.ts
import { useQuery } from "@tanstack/react-query";
import { getFacturas } from "../api/payments";
import type { EstadoFactura } from "../types";

export const useFacturas = (
  propiedadId: number | null,
  contratoId?: number,
  estado?: EstadoFactura
) => {
  return useQuery({
    queryKey: ["facturas", propiedadId, contratoId, estado],
    queryFn: () => getFacturas(propiedadId!, contratoId, estado),
    enabled: propiedadId !== null && propiedadId > 0,
  });
};
