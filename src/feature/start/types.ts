// src/feature/start/types.ts

export type CrearPropiedadRequest = {
  nombre: string;
  direccion: string;
  cantidadPisos: number;
  /**
   * 1..cantidadPisos o 0 si el dueño no reside en la propiedad
   */
  pisoResidenciaDueno: number;
};

export type Propiedad = {
  id: number;
  nombre: string;
  direccion: string;
  cantidadPisos: number;
  pisoResidenciaDueno: number;
};

export type Piso = {
  id: number;
  numeroPiso: number;
};

export type CrearHabitacionesRequest = {
  pisoId: number;
  cantidadHabitaciones: number;
};

export type OnboardingPayload = {
  propiedad: CrearPropiedadRequest;
  /**
   * Índice 0 = piso 1, índice 1 = piso 2, etc.
   */
  habitacionesPorPiso: number[];
};

export type PropiedadSimple = {
  id: number;
  nombre: string;
  direccion: string;
};

export type UsuarioPropiedadesSimpleResponse = {
  usuarioId: number;
  nombreCompleto: string;
  email: string;
  propiedades: PropiedadSimple[];
};
