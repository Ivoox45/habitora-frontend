// src/feature/properties/hooks/useRoomsByProperty.ts
import { useQuery } from "@tanstack/react-query";
import { getRoomsByProperty } from "../api/rooms";
import type { RoomsByFloor, RoomsFilters } from "../types";

/**
 * Obtiene las habitaciones de una propiedad, agrupadas por piso.
 * La API `getRoomsByProperty` debe devolver `RoomsByFloor[]`.
 */
export const useRoomsByProperty = (
  propertyId: number | null | undefined,
  filters?: RoomsFilters
) => {
  return useQuery<RoomsByFloor[]>({
    queryKey: [
      "rooms",
      "by-property",
      propertyId,
      filters?.status ?? null,
      filters?.search ?? null,
      filters?.requierePrecio ?? null, // ✅ entra al cache key
    ],
    enabled: !!propertyId && propertyId > 0,
    queryFn: () =>
      getRoomsByProperty(propertyId as number, {
        status: filters?.status,
        search: filters?.search,
        requierePrecio: filters?.requierePrecio,
      }),
  });
};
