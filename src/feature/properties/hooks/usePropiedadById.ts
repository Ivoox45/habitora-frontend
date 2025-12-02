// src/feature/properties/hooks/usePropiedadById.ts
import { useQuery } from "@tanstack/react-query";
import { getPropertyById } from "../api/properties.api";
import type { Propiedad } from "../types";

/**
 * Obtiene una propiedad por id.
 */
export const usePropiedadById = (id: number | null) => {
  return useQuery<Propiedad>({
    queryKey: ["propiedad", id],
    enabled: id !== null && id > 0,
    retry: false, // un 404 no reintenta en bucle
    queryFn: () => getPropertyById(id as number),
  });
};
