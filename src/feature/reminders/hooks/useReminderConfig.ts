import { useMutation, useQuery } from "@tanstack/react-query";
import { getReminderConfig, updateReminderConfig, toggleReminderConfig, testSendReminderConfig } from "../api/config.ts";
import type { ReminderConfigDto } from "../types";

export const useReminderConfig = (propiedadId: number) => {
  const query = useQuery<ReminderConfigDto, Error>({
    queryKey: ["recordatorios-config", propiedadId],
    queryFn: () => getReminderConfig(propiedadId),
    enabled: !!propiedadId,
    refetchOnWindowFocus: false,
  });

  const update = useMutation({
    mutationFn: (payload: ReminderConfigDto) => updateReminderConfig(propiedadId, payload),
  });

  const toggle = useMutation({
    mutationFn: (activo: boolean) => toggleReminderConfig(propiedadId, activo),
  });

  const testSend = useMutation({
    mutationFn: (body: { telefonoDestino: string; mensaje: string }) => testSendReminderConfig(propiedadId, body),
  });

  return { query, update, toggle, testSend };
};
