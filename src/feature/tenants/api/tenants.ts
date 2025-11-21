// src/feature/tenants/api/tenants.ts

import axiosInstance from "@/lib/axios";
import type {
  Tenant,
  CreateTenantPayload,
  UpdateTenantPayload,
} from "../types";

/**
 * Lista todos los inquilinos de una propiedad.
 * GET /api/propiedades/{propiedadId}/inquilinos
 */
export async function getTenantsByProperty(
  propiedadId: number
): Promise<Tenant[]> {
  const { data } = await axiosInstance.get<Tenant[]>(
    `/api/propiedades/${propiedadId}/inquilinos`
  );
  return data;
}

/**
 * Obtiene un inquilino por id dentro de una propiedad.
 * GET /api/propiedades/{propiedadId}/inquilinos/{id}
 */
export async function getTenantById(
  propiedadId: number,
  tenantId: number
): Promise<Tenant> {
  const { data } = await axiosInstance.get<Tenant>(
    `/api/propiedades/${propiedadId}/inquilinos/${tenantId}`
  );
  return data;
}

/**
 * Crea un nuevo inquilino en la propiedad.
 * POST /api/propiedades/{propiedadId}/inquilinos
 */
export async function createTenant(
  propiedadId: number,
  payload: CreateTenantPayload
): Promise<Tenant> {
  const { data } = await axiosInstance.post<Tenant>(
    `/api/propiedades/${propiedadId}/inquilinos`,
    payload
  );
  return data;
}

/**
 * Actualiza datos de un inquilino.
 * PUT /api/propiedades/{propiedadId}/inquilinos/{id}
 */
export async function updateTenant(
  propiedadId: number,
  tenantId: number,
  payload: UpdateTenantPayload
): Promise<Tenant> {
  const { data } = await axiosInstance.put<Tenant>(
    `/api/propiedades/${propiedadId}/inquilinos/${tenantId}`,
    payload
  );
  return data;
}

/**
 * Elimina un inquilino de la propiedad.
 * DELETE /api/propiedades/{propiedadId}/inquilinos/{id}
 */
export async function deleteTenant(
  propiedadId: number,
  tenantId: number
): Promise<void> {
  await axiosInstance.delete(
    `/api/propiedades/${propiedadId}/inquilinos/${tenantId}`
  );
}

/**
 * Busca inquilinos por nombre o DNI dentro de la propiedad.
 * GET /api/propiedades/{propiedadId}/inquilinos/search?query=...
 */
export async function searchTenants(
  propiedadId: number,
  query: string
): Promise<Tenant[]> {
  const { data } = await axiosInstance.get<Tenant[]>(
    `/api/propiedades/${propiedadId}/inquilinos/search`,
    {
      params: { query },
    }
  );
  return data;
}
