// src/feature/properties/api/rooms.ts

import axiosInstance from "@/lib/axios";
import type {
  Room,
  RoomsByFloor,
  CreateRoomPayload,
  UpdateRoomPayload,
  RoomsFilters,
} from "../types";

/**
 * GET /api/propiedades/{propiedadId}/habitaciones
 * List rooms grouped by floors for a property.
 * Optional filters: status (DISPONIBLE/OCUPADA), search (code prefix).
 */
export async function getRoomsByProperty(
  propertyId: number,
  filters?: RoomsFilters
): Promise<RoomsByFloor[]> {
  const { data } = await axiosInstance.get<RoomsByFloor[]>(
    `/api/propiedades/${propertyId}/habitaciones`,
    {
      params: {
        estado: filters?.status,
        search: filters?.search,
      },
    }
  );
  return data;
}

/**
 * GET /api/habitaciones/piso/{pisoId}
 * List rooms by floor.
 */
export async function getRoomsByFloor(floorId: number): Promise<Room[]> {
  const { data } = await axiosInstance.get<Room[]>(
    `/api/habitaciones/piso/${floorId}`
  );
  return data;
}

/**
 * POST /api/propiedades/{propiedadId}/habitaciones/manual
 * Create a room manually for a property.
 */
export async function createRoomManual(
  propertyId: number,
  payload: CreateRoomPayload
): Promise<Room> {
  const { data } = await axiosInstance.post<Room>(
    `/api/propiedades/${propertyId}/habitaciones/manual`,
    {
      pisoId: payload.floorId,
      codigo: payload.code,
      precioRenta: payload.rentPrice,
    }
  );
  return data;
}

/**
 * PUT /api/propiedades/{propiedadId}/habitaciones/{habitacionId}
 * Update room data.
 */
export async function updateRoom(
  propertyId: number,
  roomId: number,
  payload: UpdateRoomPayload
): Promise<Room> {
  const { data } = await axiosInstance.put<Room>(
    `/api/propiedades/${propertyId}/habitaciones/${roomId}`,
    {
      codigo: payload.code,
      precioRenta: payload.rentPrice,
    }
  );
  return data;
}

/**
 * DELETE /api/propiedades/{propiedadId}/habitaciones/{habitacionId}
 * Delete a room.
 */
export async function deleteRoom(
  propertyId: number,
  roomId: number
): Promise<void> {
  await axiosInstance.delete(
    `/api/propiedades/${propertyId}/habitaciones/${roomId}`
  );
}
