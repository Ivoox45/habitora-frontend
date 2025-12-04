import axiosInstance from "@/lib/axios";
import type { FiltrosRecordatorios, Recordatorio, EstadisticasRecordatorios } from "../types";

export async function getRecordatorios(propiedadId: number, filtros?: FiltrosRecordatorios) {
  const params: any = {};
  if (filtros?.estado) params.estado = filtros.estado;
  if (filtros?.tipo) params.tipo = filtros.tipo;
  if (filtros?.fechaDesde) params.fechaDesde = filtros.fechaDesde;
  if (filtros?.fechaHasta) params.fechaHasta = filtros.fechaHasta;
  const { data } = await axiosInstance.get<Recordatorio[]>(`/recordatorios/${propiedadId}`, { params });
  return data;
}

export async function getEstadisticasRecordatorios(propiedadId: number) {
  const { data } = await axiosInstance.get<EstadisticasRecordatorios>(`/recordatorios/${propiedadId}/estadisticas`);
  return data;
}

export async function cancelarRecordatorio(recordatorioId: number) {
  const { data } = await axiosInstance.post(`/recordatorios/${recordatorioId}/cancelar`);
  return data;
}

export async function crearRecordatorioManual(propiedadId: number, payload: { facturaId: number; mensaje?: string }) {
  const { data } = await axiosInstance.post(`/recordatorios/${propiedadId}/manual`, payload);
  return data as Recordatorio;
}
