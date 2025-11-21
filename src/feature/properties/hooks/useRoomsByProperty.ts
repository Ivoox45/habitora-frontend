// src/feature/properties/hooks/useRoomsByProperty.ts
import { useQuery } from "@tanstack/react-query";
import { getRoomsByProperty } from "../api/rooms";
import type { Room, RoomsByFloor, RoomsFilters } from "../types";

// Tipos reales del backend
type BackendRoom = {
  id: number;
  propiedadId: number;
  pisoId: number;
  codigo: string;
  estado: string;
  precioRenta: string;
};

type BackendRoomsByFloor = {
  pisoId: number;
  numeroPiso: number;
  habitaciones?: BackendRoom[] | null;
};

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
    ],
    enabled: !!propertyId && propertyId > 0,
    queryFn: async () => {
      const raw = (await getRoomsByProperty(propertyId as number, {
        status: filters?.status,
        search: filters?.search,
      })) as BackendRoomsByFloor[];

      const mapped: RoomsByFloor[] = raw.map((floor) => ({
        floorId: floor.pisoId,
        floorNumber: floor.numeroPiso,
        // 👇 si el backend manda null/undefined, caemos en []
        rooms: (floor.habitaciones ?? []).map<Room>((room) => ({
          id: room.id,
          propertyId: room.propiedadId,
          floorId: room.pisoId,
          code: room.codigo,
          status: room.estado,
          rentPrice: room.precioRenta,
        })),
      }));

      return mapped;
    },
  });
};
