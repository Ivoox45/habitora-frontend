// src/feature/start/api/start.ts
import axiosInstance from "@/lib/axios";
import type {
  CrearPropiedadRequest,
  Propiedad,
  Piso,
  CrearHabitacionesRequest,
  UsuarioPropiedadesSimpleResponse,
} from "../types";

export const crearPropiedad = async (
  data: CrearPropiedadRequest,
): Promise<Propiedad> => {
  const { data: propiedad } = await axiosInstance.post<Propiedad>(
    "/api/propiedades",
    data,
  );
  return propiedad;
};

export const getPisosByPropiedad = async (
  propiedadId: number,
): Promise<Piso[]> => {
  const { data } = await axiosInstance.get<Piso[]>(
    `/api/propiedades/${propiedadId}/pisos`,
  );
  return data;
};

export const crearHabitacionesAutomatico = async (
  data: CrearHabitacionesRequest,
): Promise<void> => {
  await axiosInstance.post<void>("/api/habitaciones/crear-automatico", data);
};

export const getUsuarioPropiedadesSimple = async (
  usuarioId: number,
): Promise<UsuarioPropiedadesSimpleResponse> => {
  const { data } = await axiosInstance.get<UsuarioPropiedadesSimpleResponse>(
    `/api/usuarios/${usuarioId}/propiedades-simple`,
  );
  return data;
};
