// src/feature/contracts/api/contracts.ts
import axiosInstance from "@/lib/axios";
import type {
  ContratoListado,
  ContratosFilters,
  ContratoDetalle,
  CrearContratoPayload,
  SubirFirmaContratoPayload,
  AvailableRoomsByFloor,
  Tenant,
  TenantsFilters,
} from "../types";

// Helper: limpia un dataURL y deja solo el base64
export const stripBase64Prefix = (value: string): string => {
  const commaIndex = value.indexOf(",");
  if (value.startsWith("data:image") && commaIndex !== -1) {
    return value.slice(commaIndex + 1);
  }
  return value;
};

// --------- CONTRATOS ---------

// GET /api/propiedades/{propiedadId}/contratos
export async function getContractsByProperty(
  propertyId: number,
  filters?: ContratosFilters
): Promise<ContratoListado[]> {
  const response = await axiosInstance.get<ContratoListado[]>(
    `/api/propiedades/${propertyId}/contratos`,
    {
      params: {
        estado: filters?.estado,
        search: filters?.search,
      },
    }
  );
  return response.data;
}

// alias opcional en español
export { getContractsByProperty as getContratosByPropiedad };

// GET /api/propiedades/{propiedadId}/contratos/{contratoId}
export async function getContractById(
  propertyId: number,
  contractId: number
): Promise<ContratoDetalle> {
  const response = await axiosInstance.get<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}`
  );
  return response.data;
}

// POST /api/propiedades/{propiedadId}/contratos
export async function createContract(
  propertyId: number,
  payload: CrearContratoPayload
): Promise<ContratoDetalle> {
  const response = await axiosInstance.post<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos`,
    payload
  );
  return response.data;
}

// alias en español
export { createContract as crearContrato };

// PUT /api/propiedades/{propiedadId}/contratos/{contratoId}/finalizar
export async function finalizeContract(
  propertyId: number,
  contractId: number
): Promise<ContratoDetalle> {
  const response = await axiosInstance.put<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}/finalizar`
  );
  return response.data;
}

// alias en español
export { finalizeContract as finalizarContrato };

// POST /api/propiedades/{propiedadId}/contratos/{contratoId}/firma
// Recibe base64 limpio o dataURL; siempre envía base64 limpio al backend.
export async function uploadContractSignature(
  propertyId: number,
  contractId: number,
  base64: string
): Promise<ContratoDetalle> {
  const clean = stripBase64Prefix(base64);

  const payload: SubirFirmaContratoPayload = {
    file: clean,
  };

  const response = await axiosInstance.post<ContratoDetalle>(
    `/api/propiedades/${propertyId}/contratos/${contractId}/firma`,
    payload
  );
  return response.data;
}

// alias en español → esto arregla el error de `subirFirmaContrato`
export { uploadContractSignature as subirFirmaContrato };

// GET /api/propiedades/{propiedadId}/contratos/{contratoId}/firma  (image/png)
export async function downloadContractSignatureAsBlob(
  propertyId: number,
  contractId: number
): Promise<Blob> {
  const response = await axiosInstance.get(
    `/api/propiedades/${propertyId}/contratos/${contractId}/firma`,
    {
      responseType: "blob",
    }
  );
  return response.data;
}

// --------- HABITACIONES DISPONIBLES ---------

// GET /api/propiedades/{propiedadId}/habitaciones?estado=DISPONIBLE
export async function getAvailableRoomsByProperty(
  propertyId: number
): Promise<AvailableRoomsByFloor[]> {
  const response = await axiosInstance.get<AvailableRoomsByFloor[]>(
    `/api/propiedades/${propertyId}/habitaciones`,
    {
      params: {
        estado: "DISPONIBLE",
      },
    }
  );
  return response.data;
}

// --------- INQUILINOS ---------

// GET /api/propiedades/{propiedadId}/inquilinos
export async function getTenantsByProperty(
  propertyId: number,
  filters?: TenantsFilters
): Promise<Tenant[]> {
  const response = await axiosInstance.get<Tenant[]>(
    `/api/propiedades/${propertyId}/inquilinos`,
    {
      params: {
        disponibles: filters?.disponibles,
        query: filters?.query,
      },
    }
  );
  return response.data;
}
