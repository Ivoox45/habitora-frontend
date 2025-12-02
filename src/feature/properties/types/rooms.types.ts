// src/feature/properties/types/rooms.types.ts

// ----- Estados permitidos -----
export type RoomStatus = "DISPONIBLE" | "OCUPADA";

// ----- Room normalizado -----
export type Room = {
    id: number;
    propertyId: number;   // propiedadId en backend
    floorId: number;      // pisoId en backend
    code: string;         // codigo
    status: RoomStatus;   // normalizado por mapper
    rentPrice: number;    // precioRenta convertido a number
};

// ----- Agrupación de habitaciones por piso -----
export type RoomsByFloor = {
    floorId: number;       // pisoId
    floorNumber: number;   // numeroPiso
    rooms: Room[];
};

// ----- Crear habitación -----
export type CreateRoomPayload = {
    floorId: number;
    code: string;
    rentPrice: number;
};

// ----- Actualizar habitación -----
export type UpdateRoomPayload = {
    code: string;
    rentPrice: number;
};

// ----- Filtros -----
export type RoomsFilters = {
    status?: RoomStatus;
    search?: string;
    requierePrecio?: boolean;
};
