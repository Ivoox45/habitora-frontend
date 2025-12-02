import type { RoomsByFloor, Room } from "../types";

/** Máximo de habitaciones por piso (.01 a .08) */
export const MAX_ROOMS_PER_FLOOR = 8;

/** Obtiene el rango de códigos válido para un piso */
export function getFloorCodeRange(floorNumber: number) {
    const base = floorNumber * 100;
    return {
        min: base + 1,
        max: base + MAX_ROOMS_PER_FLOOR,
    };
}

/** Convierte un código de habitación (string) en número seguro */
export function parseRoomCode(code: string | number | null | undefined): number | null {
    const n = Number(code);
    return Number.isFinite(n) ? n : null;
}

/** Códigos usados (numéricos) en un piso */
export function getUsedCodesInFloor(floor: RoomsByFloor): number[] {
    return floor.rooms
        .map((room) => parseRoomCode(room.code))
        .filter((n): n is number => n !== null);
}

/** Códigos disponibles del .01 al .08 para un piso */
export function getAvailableCodesForFloor(floor: RoomsByFloor): number[] {
    const { min, max } = getFloorCodeRange(floor.floorNumber);
    const used = new Set(getUsedCodesInFloor(floor));

    const available: number[] = [];
    for (let c = min; c <= max; c++) {
        if (!used.has(c)) available.push(c);
    }
    return available;
}

/** 
 * Códigos disponibles para EDITAR una habitación:
 * incluye su código actual incluso si ya está "ocupado".
 */
export function getAvailableCodesForRoom(floors: RoomsByFloor[], room: Room): number[] {
    const floor = floors.find((f) => f.floorId === room.floorId);
    if (!floor) return [];

    const available = getAvailableCodesForFloor(floor);

    // Incluir código actual
    const current = parseRoomCode(room.code);
    if (current && !available.includes(current)) available.push(current);

    return available.sort((a, b) => a - b);
}

/** Valida un número de renta */
export function validateRent(value: string): boolean {
    const n = Number(value);
    return !Number.isNaN(n) && n >= 0;
}
