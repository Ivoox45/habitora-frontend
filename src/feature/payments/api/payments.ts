// src/feature/payments/api/payments.ts
import axiosInstance from "@/lib/axios";
import type { Factura, Pago, PagoCreateRequest, EstadoFactura } from "../types";

/**
 * Listar facturas de una propiedad
 */
export const getFacturas = async (
  propiedadId: number,
  contratoId?: number,
  estado?: EstadoFactura
): Promise<Factura[]> => {
  const params = new URLSearchParams();
  if (contratoId) params.append("contratoId", String(contratoId));
  if (estado) params.append("estado", estado);

  const { data } = await axiosInstance.get<Factura[]>(
    `/api/propiedades/${propiedadId}/facturas${params.toString() ? `?${params}` : ""}`
  );
  return data;
};

/**
 * Registrar pago de una factura
 */
export const registrarPago = async (
  propiedadId: number,
  facturaId: number,
  request: PagoCreateRequest
): Promise<Pago> => {
  const { data } = await axiosInstance.post<Pago>(
    `/api/propiedades/${propiedadId}/facturas/${facturaId}/pagos`,
    request
  );
  return data;
};

/**
 * Listar pagos de una factura
 */
export const getPagosFactura = async (
  propiedadId: number,
  facturaId: number
): Promise<Pago[]> => {
  const { data } = await axiosInstance.get<Pago[]>(
    `/api/propiedades/${propiedadId}/facturas/${facturaId}/pagos`
  );
  return data;
};
