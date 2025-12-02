// src/feature/properties/utils/rooms.mappers.ts

import type {
    Room,
    RoomsByFloor,
} from "../types/rooms.types";

//
// ---- Backend Types (RAW) ----
//
export type BackendRoom = {
    id: number;
    propiedadId: number;
    pisoId: number;
    codigo: string;
    estado: string;          // puede venir "OCUPADA" / "DISPONIBLE" / otros
    precioRenta: string;     // viene string del backend
};

export type BackendRoomsByFloor = {
    pisoId: number;
    numeroPiso: number;
    habitaciones: BackendRoom[];
};

//
// ---- Mappers ----
//

/**
 * Normaliza un BackendRoom → Room (tipado y limpio)
 */
export function mapBackendRoom(room: BackendRoom): Room {
    return {
        id: room.id,
        propertyId: room.propiedadId,
        floorId: room.pisoId,
        code: room.codigo ?? "",
        status: room.estado === "OCUPADA" ? "OCUPADA" : "DISPONIBLE",
        rentPrice: Number(room.precioRenta ?? 0),
    };
}

/**
 * Normaliza RoomsByFloor
 */
export function mapBackendRoomsByFloor(item: BackendRoomsByFloor): RoomsByFloor {
    return {
        floorId: item.pisoId,
        floorNumber: item.numeroPiso,
        rooms: (item.habitaciones ?? []).map(mapBackendRoom),
    };
}
