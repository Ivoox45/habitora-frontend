import { useQuery } from "@tanstack/react-query";
import { getEstadisticasRecordatorios } from "../api/reminders.ts";
import type { EstadisticasRecordatorios } from "../types";

export const useEstadisticasRecordatorios = (propiedadId: number) => {
  return useQuery<EstadisticasRecordatorios, Error>({
    queryKey: ["recordatorios-estadisticas", propiedadId],
    queryFn: () => getEstadisticasRecordatorios(propiedadId),
    enabled: !!propiedadId,
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
};
