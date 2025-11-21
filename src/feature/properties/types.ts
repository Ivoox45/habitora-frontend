// src/feature/properties/types.ts

// ----- PROPIEDAD (se mantiene en español) -----
export type Propiedad = {
  id: number;
  nombre: string;
  direccion: string;
  cantidadPisos: number;
  pisoResidenciaDueno: number;
};

// ----- ROOMS (HABITACIONES) -----

export type RoomStatus = "DISPONIBLE" | "OCUPADA";

export type Room = {
  id: number;
  propertyId: number; // propiedadId
  floorId: number;    // pisoId
  code: string;       // codigo
  status: RoomStatus | string; // por si el backend envía otros valores
  rentPrice: string;  // precioRenta viene como string en la respuesta
};

export type RoomsByFloor = {
  floorId: number;    // pisoId
  floorNumber: number; // numeroPiso
  rooms: Room[];
};

export type CreateRoomPayload = {
  floorId: number;
  code: string;
  rentPrice: number;
};

export type UpdateRoomPayload = {
  code: string;
  rentPrice: number;
};

export type RoomsFilters = {
  status?: RoomStatus;
  search?: string;
};

// (Opcional) Aliases para no romper código viejo:
// export type Habitacion = Room;
// export type PisoConHabitaciones = RoomsByFloor;
// export type HabitacionEstado = RoomStatus;
// export type CrearHabitacionPayload = CreateRoomPayload;
// export type ActualizarHabitacionPayload = UpdateRoomPayload;
// export type HabitacionesFilters = RoomsFilters;
