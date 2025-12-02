// src/feature/properties/api/rooms.api.ts

import axiosInstance from "@/lib/axios";
import {
    mapBackendRoom,
    mapBackendRoomsByFloor,
    type BackendRoom,
    type BackendRoomsByFloor,
} from "../utils/rooms.mappers";

import type {
    Room,
    RoomsFilters,
    RoomsByFloor,
    CreateRoomPayload,
    UpdateRoomPayload,
} from "../types/rooms.types";

/**
 * GET /api/propiedades/{id}/habitaciones
 */
export async function getRoomsByProperty(
    propertyId: number,
    filters?: RoomsFilters
): Promise<RoomsByFloor[]> {
    const { data } = await axiosInstance.get<BackendRoomsByFloor[]>(
        `/api/propiedades/${propertyId}/habitaciones`,
        {
            params: {
                estado: filters?.status ?? undefined,
                search: filters?.search ?? undefined,
                requierePrecio: filters?.requierePrecio ?? undefined,
            },
        }
    );

    return (data ?? []).map(mapBackendRoomsByFloor);
}

/**
 * GET /api/habitaciones/piso/{pisoId}
 */
export async function getRoomsByFloor(floorId: number): Promise<Room[]> {
    const { data } = await axiosInstance.get<BackendRoom[]>(
        `/api/habitaciones/piso/${floorId}`
    );

    return (data ?? []).map(mapBackendRoom);
}

/**
 * POST /api/propiedades/{id}/habitaciones/manual
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
 * PUT /api/propiedades/{id}/habitaciones/{habitacionId}
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
 * DELETE /api/propiedades/{id}/habitaciones/{habitacionId}
 */
export async function deleteRoom(
    propertyId: number,
    roomId: number
): Promise<void> {
    await axiosInstance.delete(
        `/api/propiedades/${propertyId}/habitaciones/${roomId}`
    );
}
