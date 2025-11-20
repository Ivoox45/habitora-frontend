// src/feature/auth/api/auth.ts
import axiosInstance from "@/lib/axios";
import type {
  LoginRequest,
  RegisterRequest,
  AuthMessageResponse,
  TienePropiedadesResponse,
  UsuarioResponse,
} from "../types";

export const registerRequest = async (
  data: RegisterRequest,
): Promise<AuthMessageResponse> => {
  const { data: message } = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/register",
    data,
  );
  return message;
};

export const loginRequest = async (
  data: LoginRequest,
): Promise<AuthMessageResponse> => {
  const { data: message } = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/login",
    data,
  );
  return message;
};

export const logoutRequest = async (): Promise<AuthMessageResponse> => {
  const { data: message } = await axiosInstance.post<AuthMessageResponse>(
    "/api/auth/logout",
  );
  return message;
};

export const checkTienePropiedades = async (): Promise<TienePropiedadesResponse> => {
  const { data } = await axiosInstance.get<TienePropiedadesResponse>(
    "/api/usuarios/tiene-propiedades",
  );
  return data;
};

export const getUsuarioById = async (id: number): Promise<UsuarioResponse> => {
  const { data } = await axiosInstance.get<UsuarioResponse>(
    `/api/usuarios/${id}`,
  );
  return data;
};
