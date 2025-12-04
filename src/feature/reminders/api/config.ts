import axiosInstance from "@/lib/axios";
import type { ReminderConfigDto } from "../types.ts";

export async function getReminderConfig(propiedadId: number) {
  const { data } = await axiosInstance.get<ReminderConfigDto>(`/propiedades/${propiedadId}/recordatorios/config`);
  return data;
}

export async function updateReminderConfig(propiedadId: number, payload: ReminderConfigDto) {
  await axiosInstance.put(`/propiedades/${propiedadId}/recordatorios/config`, payload);
}

export async function toggleReminderConfig(propiedadId: number, enabled: boolean) {
  await axiosInstance.put(`/propiedades/${propiedadId}/recordatorios/config/toggle`, null, { params: { enabled } });
}

export async function testSendReminderConfig(propiedadId: number, body: { telefonoDestino: string; mensaje: string }) {
  await axiosInstance.post(`/propiedades/${propiedadId}/recordatorios/test-send`, body);
}
