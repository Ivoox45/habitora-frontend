// src/feature/properties/api/rooms.ts

import axiosInstance from "@/lib/axios";
import type {
  Room,
  RoomsByFloor,
  CreateRoomPayload,
  UpdateRoomPayload,
  RoomsFilters,
} from "../types";

/* ===== Tipos RAW que devuelve el backend ===== */

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
  habitaciones: BackendRoom[];
};

/* ===== Mapeadores backend -> frontend ===== */

function mapBackendRoom(room: BackendRoom): Room {
  return {
    id: room.id,
    propertyId: room.propiedadId,
    floorId: room.pisoId,
    code: room.codigo,
    status: room.estado,
    rentPrice: room.precioRenta,
  };
}

function mapBackendRoomsByFloor(item: BackendRoomsByFloor): RoomsByFloor {
  return {
    floorId: item.pisoId,
    floorNumber: item.numeroPiso,
    rooms: (item.habitaciones ?? []).map(mapBackendRoom),
  };
}

/**
 * GET /api/propiedades/{propiedadId}/habitaciones
 * List rooms grouped by floors for a property.
 * Optional filters: status (DISPONIBLE/OCUPADA), search (code prefix),
 * requierePrecio: true=solo con precio, false=solo sin precio.
 */
export async function getRoomsByProperty(
  propertyId: number,
  filters?: RoomsFilters
): Promise<RoomsByFloor[]> {
  const response = await axiosInstance.get<BackendRoomsByFloor[]>(
    `/api/propiedades/${propertyId}/habitaciones`,
    {
      params: {
        estado: filters?.status,
        search: filters?.search,
        requierePrecio: filters?.requierePrecio,
      },
    }
  );

  const data = response.data ?? [];
  return data.map(mapBackendRoomsByFloor);
}

/**
 * GET /api/habitaciones/piso/{pisoId}
 * List rooms by floor.
 */
export async function getRoomsByFloor(floorId: number): Promise<Room[]> {
  const { data } = await axiosInstance.get<BackendRoom[]>(
    `/api/habitaciones/piso/${floorId}`
  );
  return (data ?? []).map(mapBackendRoom);
}

/**
 * POST /api/propiedades/{propiedadId}/habitaciones/manual
 * Create a room manually for a property.
 */
export async function createRoomManual(
  propertyId: number,
  payload: CreateRoomPayload
): Promise<Room> {
  const { data } = await axiosInstance.post<BackendRoom>(
    `/api/propiedades/${propertyId}/habitaciones/manual`,
    {
      pisoId: payload.floorId,
      codigo: payload.code,
      precioRenta: payload.rentPrice,
    }
  );
  return mapBackendRoom(data);
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
  const { data } = await axiosInstance.put<BackendRoom>(
    `/api/propiedades/${propertyId}/habitaciones/${roomId}`,
    {
      codigo: payload.code,
      precioRenta: payload.rentPrice,
    }
  );
  return mapBackendRoom(data);
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
