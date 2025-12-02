// src/feature/properties/schemas/rooms.schema.ts
import { z } from "zod";

/* -------------------------------------------------------
   📌 1) SCHEMAS RAW DEL BACKEND (DTO)
------------------------------------------------------- */

export const RoomDTOSchema = z.object({
    id: z.number(),
    propiedadId: z.number(),
    pisoId: z.number(),
    codigo: z.string(),
    estado: z.string(),
    precioRenta: z.string(),
});

export const RoomsByFloorDTOSchema = z.object({
    pisoId: z.number(),
    numeroPiso: z.number(),
    habitaciones: z.array(RoomDTOSchema).default([]),
});

/* Tipos inferidos del backend */
export type RoomDTO = z.infer<typeof RoomDTOSchema>;
export type RoomsByFloorDTO = z.infer<typeof RoomsByFloorDTOSchema>;

/* -------------------------------------------------------
   📌 2) SCHEMAS LIMPIOS PARA EL FRONTEND
      (Room, RoomsByFloor)
------------------------------------------------------- */

export const RoomSchema = z.object({
    id: z.number(),
    propertyId: z.number(),
    floorId: z.number(),
    code: z.string(),
    status: z.enum(["DISPONIBLE", "OCUPADA", "OTRO"]).default("OTRO"),
    rentPrice: z.number(),
});

export const RoomsByFloorSchema = z.object({
    floorId: z.number(),
    floorNumber: z.number(),
    rooms: z.array(RoomSchema),
});

export type Room = z.infer<typeof RoomSchema>;
export type RoomsByFloor = z.infer<typeof RoomsByFloorSchema>;

/* -------------------------------------------------------
   📌 3) NORMALIZADORES & HELPERS
------------------------------------------------------- */

function normalizeStatus(value: string): "DISPONIBLE" | "OCUPADA" | "OTRO" {
    const s = value.toUpperCase().trim();

    if (s === "DISPONIBLE") return "DISPONIBLE";
    if (s === "OCUPADA") return "OCUPADA";

    return "OTRO";
}

function toNumberSafe(value: string): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
}

/* -------------------------------------------------------
   📌 4) MAPPERS: Backend → Frontend
      (con parseo estricto vía Zod)
------------------------------------------------------- */

export function mapRoomDTO(dto: RoomDTO): Room {
    return RoomSchema.parse({
        id: dto.id,
        propertyId: dto.propiedadId,
        floorId: dto.pisoId,
        code: dto.codigo,
        status: normalizeStatus(dto.estado),
        rentPrice: toNumberSafe(dto.precioRenta),
    });
}

export function mapRoomsByFloorDTO(raw: RoomsByFloorDTO): RoomsByFloor {
    return RoomsByFloorSchema.parse({
        floorId: raw.pisoId,
        floorNumber: raw.numeroPiso,
        rooms: (raw.habitaciones ?? []).map(mapRoomDTO),
    });
}
